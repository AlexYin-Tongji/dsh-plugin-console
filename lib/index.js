import { createRequire } from "node:module";
import { basename, dirname, isAbsolute, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { dshHomePath } from "@deepseek-ai/dsh-home-paths";
import z from "@deepseek-ai/schemastery";
import { access, constants, copyFile, cp, lstat, mkdir, mkdtemp, open, opendir, readFile, readlink, realpath, rename, rm, stat, writeFile } from "node:fs/promises";
import semver from "semver";
import { createHash, randomUUID } from "node:crypto";
import { readFileSync } from "node:fs";
import { spawn } from "node:child_process";
import { readProfileManifest } from "@deepseek-ai/dsh-app-boot";
import { isMap, isSeq, parse, parseDocument, stringify } from "yaml";
import { setTimeout as setTimeout$1 } from "node:timers/promises";
import { tmpdir } from "node:os";
import { Script, createContext } from "node:vm";

//#region src/util.ts
function isRecord(value) {
	return typeof value === "object" && value !== null && !Array.isArray(value);
}
function errorMessage(error) {
	return error instanceof Error ? error.message : String(error);
}
async function writeFileAtomic(path, content) {
	await mkdir(dirname(path), {
		recursive: true,
		mode: 448
	});
	const temporary = `${path}.${randomUUID()}.tmp`;
	try {
		const handle = await open(temporary, "wx", 384);
		try {
			await handle.writeFile(content, "utf8");
			await handle.sync();
		} finally {
			await handle.close();
		}
		await rename(temporary, path);
	} finally {
		await rm(temporary, { force: true }).catch(() => void 0);
	}
}
async function readTextBounded(path, maxBytes) {
	const handle = await open(path, "r");
	try {
		if ((await handle.stat()).size > maxBytes) throw new Error(`File exceeds ${String(maxBytes)} bytes.`);
		return await handle.readFile("utf8");
	} finally {
		await handle.close();
	}
}
async function readResponseTextBounded(response, maxBytes) {
	const declared = response.headers.get("content-length");
	if (declared !== null && Number(declared) > maxBytes) throw new Error(`Response exceeds ${String(maxBytes)} bytes.`);
	if (response.body === null) return "";
	const reader = response.body.getReader();
	const chunks = [];
	let total = 0;
	try {
		for (;;) {
			const { done, value } = await reader.read();
			if (done) break;
			total += value.byteLength;
			if (total > maxBytes) {
				await reader.cancel();
				throw new Error(`Response exceeds ${String(maxBytes)} bytes.`);
			}
			chunks.push(value);
		}
	} finally {
		reader.releaseLock();
	}
	const all = new Uint8Array(total);
	let offset = 0;
	for (const chunk of chunks) {
		all.set(chunk, offset);
		offset += chunk.byteLength;
	}
	return new TextDecoder("utf-8", { fatal: true }).decode(all);
}
function stringValue(value) {
	return typeof value === "string" && value.trim().length > 0 ? value.trim() : null;
}
function authorName(value) {
	if (typeof value === "string") return stringValue(value);
	if (!isRecord(value)) return null;
	return stringValue(value.name);
}
function normalizeGithubRepository(value) {
	const raw = typeof value === "string" ? value : isRecord(value) && typeof value.url === "string" ? value.url : null;
	if (raw === null) return null;
	const normalized = raw.replace(/^git\+/, "").replace(/^git@github\.com:/, "https://github.com/").replace(/^github:/, "https://github.com/").replace(/\.git(?:#.*)?$/, "").replace(/#.*$/, "");
	let url;
	try {
		url = new URL(normalized);
	} catch {
		return null;
	}
	if (url.hostname.toLowerCase() !== "github.com") return null;
	const parts = url.pathname.split("/").filter(Boolean);
	if (parts.length < 2) return null;
	const owner$1 = parts[0];
	const repo = parts[1];
	if (owner$1 === void 0 || repo === void 0 || !/^[\w.-]+$/.test(owner$1) || !/^[\w.-]+$/.test(repo)) return null;
	return `${owner$1}/${repo}`;
}
function redactProcessOutput(value, maxChars = 8e3) {
	const redacted = value.replace(/(https?:\/\/)([^\s/@:]+):([^\s/@]+)@/g, "$1***:***@").replace(/(token|password|secret|api[_-]?key)(\s*[=:]\s*)[^\s]+/gi, "$1$2***").trim();
	if (redacted.length === 0) return null;
	return redacted.length > maxChars ? redacted.slice(-maxChars) : redacted;
}

//#endregion
//#region src/catalog.ts
const CACHE_SCHEMA = 1;
const INSPECTION_CACHE_MS = 600 * 1e3;
const MAX_CATALOG_ITEMS = 5e3;
const LIFECYCLE_SCRIPT_NAMES$1 = [
	"preinstall",
	"install",
	"postinstall",
	"prepare"
];
const README_NAMES$1 = {
	zh: [
		"README.zh.md",
		"README.zh-CN.md",
		"README.zh.markdown",
		"README.zh.rst",
		"README.zh.txt",
		"README.md",
		"README.markdown",
		"README.mdx",
		"README.rst",
		"README.txt",
		"README"
	],
	en: [
		"README.md",
		"README.en.md",
		"README.markdown",
		"README.en.markdown",
		"README.mdx",
		"README.rst",
		"README.txt",
		"README"
	]
};
const NPM_PACKAGE = /^(?:@[a-z0-9][a-z0-9._~-]*\/[a-z0-9][a-z0-9._~-]*|[a-z0-9][a-z0-9._~-]*)$/i;
const NPM_INTEGRITY = /^sha512-[A-Za-z0-9+/]+={0,2}$/;
function validNpmPackageName(value) {
	return value.length <= 214 && NPM_PACKAGE.test(value);
}
function validNpmIntegrity(value) {
	if (!NPM_INTEGRITY.test(value)) return false;
	try {
		return Buffer.from(value.slice(7), "base64").byteLength === 64;
	} catch {
		return false;
	}
}
function readDescription(value) {
	if (typeof value === "string") return {
		zh: value,
		en: value
	};
	if (!isRecord(value)) return {
		zh: "",
		en: ""
	};
	return {
		zh: stringValue(value.zh) ?? stringValue(value.en) ?? "",
		en: stringValue(value.en) ?? stringValue(value.zh) ?? ""
	};
}
function parseGithubUrl(value) {
	const fullName = normalizeGithubRepository(value);
	if (fullName === null) return null;
	return {
		fullName,
		url: `https://github.com/${fullName}`
	};
}
function parseRawCatalogItem(value) {
	if (!isRecord(value)) return null;
	const repository = parseGithubUrl(value.url);
	if (repository === null) return null;
	const [owner$1 = "", repo = ""] = repository.fullName.split("/");
	const name$1 = stringValue(value.name) ?? repo;
	const description = readDescription(value.description);
	if (name$1.length > 160 || owner$1.length === 0 || repo.length === 0 || (stringValue(value.category)?.length ?? 0) > 64 || description.zh.length > 4e3 || description.en.length > 4e3) return null;
	const npm = stringValue(value.npm);
	const packageName = npm !== null && validNpmPackageName(npm) ? npm : null;
	const stars = typeof value.stars === "number" && Number.isSafeInteger(value.stars) && value.stars >= 0 ? value.stars : 0;
	return {
		id: repository.fullName.toLowerCase(),
		name: name$1,
		owner: owner$1,
		repositoryUrl: repository.url,
		pageUrl: stringValue(value.page),
		category: stringValue(value.category) ?? "other",
		description,
		packageName,
		stars,
		addedAt: stringValue(value.added),
		artifactKind: packageName === null ? "github" : "npm"
	};
}
/** Parse the curated community feed into one deterministic, deduplicated index. */
function parseCatalogText(text) {
	const root = JSON.parse(text);
	const values = Array.isArray(root) ? root : isRecord(root) && Array.isArray(root.plugins) ? root.plugins : null;
	if (values === null) throw new TypeError("Catalog root must contain a plugins array.");
	if (values.length > MAX_CATALOG_ITEMS) throw new TypeError("Catalog contains too many entries.");
	const byId = /* @__PURE__ */ new Map();
	for (const value of values) {
		const item = parseRawCatalogItem(value);
		if (item !== null && !byId.has(item.id)) byId.set(item.id, item);
	}
	return [...byId.values()].sort((left, right) => {
		if (right.stars !== left.stars) return right.stars - left.stars;
		return left.name < right.name ? -1 : left.name > right.name ? 1 : 0;
	});
}
function validateListRequest(request) {
	return {
		query: request.query.trim().slice(0, 256),
		category: request.category.trim().slice(0, 64) || "all",
		page: Number.isSafeInteger(request.page) ? Math.max(1, request.page) : 1,
		pageSize: Number.isSafeInteger(request.pageSize) ? Math.min(50, Math.max(1, request.pageSize)) : 30
	};
}
function queryCatalog(items, request, status) {
	const normalized = validateListRequest(request);
	const query = normalized.query.toLocaleLowerCase();
	const filtered = items.filter((item) => {
		if (normalized.category !== "all" && item.category !== normalized.category) return false;
		if (query.length === 0) return true;
		return [
			item.name,
			item.owner,
			item.packageName ?? "",
			item.description.zh,
			item.description.en
		].some((value) => value.toLocaleLowerCase().includes(query));
	});
	const categories = [...items.reduce((counts, item) => {
		counts.set(item.category, (counts.get(item.category) ?? 0) + 1);
		return counts;
	}, /* @__PURE__ */ new Map())].map(([id, count]) => ({
		id,
		count
	})).sort((left, right) => right.count - left.count || left.id.localeCompare(right.id));
	const start = (normalized.page - 1) * normalized.pageSize;
	return {
		items: filtered.slice(start, start + normalized.pageSize),
		total: filtered.length,
		page: normalized.page,
		pageSize: normalized.pageSize,
		categories,
		status
	};
}
function bundlePatchPath$1(value) {
	const dsh = isRecord(value.dsh) ? value.dsh : null;
	const patch = dsh !== null && isRecord(dsh.bundle) ? stringValue(dsh.bundle.patch) : null;
	if (patch === null || patch.startsWith("/") || patch.includes("\\")) return null;
	const normalized = patch.startsWith("./") ? patch.slice(2) : patch;
	if (normalized.split("/").some((segment) => segment.length === 0 || segment === "." || segment === "..")) return null;
	return normalized;
}
function manifestSummary(value) {
	const packageName = stringValue(value.name);
	const version = stringValue(value.version);
	if (packageName === null || !validNpmPackageName(packageName) || version === null || semver.valid(version) === null) return null;
	const dsh = isRecord(value.dsh) ? value.dsh : null;
	const bundle = bundlePatchPath$1(value) !== null;
	const client = dsh !== null && isRecord(dsh.client) && dsh.client.platform === "web";
	const scripts = isRecord(value.scripts) ? value.scripts : {};
	const lifecycleScripts$1 = LIFECYCLE_SCRIPT_NAMES$1.filter((name$1) => typeof scripts[name$1] === "string");
	const repository = normalizeGithubRepository(value.repository);
	return {
		packageName,
		version,
		description: stringValue(value.description),
		author: authorName(value.author),
		license: stringValue(value.license),
		homepage: stringValue(value.homepage),
		repositoryUrl: repository === null ? null : `https://github.com/${repository}`,
		bundle,
		client,
		lifecycleScripts: lifecycleScripts$1,
		deprecated: stringValue(value.deprecated)
	};
}
function validNpmTarball(value) {
	const raw = stringValue(value);
	if (raw === null) return false;
	try {
		const url = new URL(raw);
		return url.protocol === "https:" && url.hostname === "registry.npmjs.org";
	} catch {
		return false;
	}
}
function inspectionWarnings(manifest, value) {
	const warnings = [];
	if (manifest.lifecycleScripts.length > 0) warnings.push("lifecycle-scripts-present");
	if (manifest.license === null) warnings.push("license-missing");
	if (manifest.deprecated !== null) warnings.push("package-deprecated");
	const peers = isRecord(value.peerDependencies) ? value.peerDependencies : {};
	if (!Object.keys(peers).some((name$1) => name$1 === "@deepseek-ai/cordis" || name$1.startsWith("@deepseek-ai/dsh-"))) warnings.push("dsh-compatibility-not-declared");
	return warnings;
}
async function fetchJson(fetchImpl, url, signal, maxBytes, headers = {}) {
	const response = await fetchImpl(url, {
		signal,
		headers: {
			accept: "application/json",
			"user-agent": "dsh-plugin-console",
			...headers
		}
	});
	if (!response.ok) throw new Error(`HTTP ${String(response.status)} from ${new URL(url).hostname}.`);
	return {
		value: JSON.parse(await readResponseTextBounded(response, maxBytes)),
		response
	};
}
async function fetchReadme(fetchImpl, fullName, ref, locale$1, signal, maxBytes) {
	for (const file of README_NAMES$1[locale$1]) {
		const url = `https://raw.githubusercontent.com/${fullName}/${ref.split("/").map((segment) => encodeURIComponent(segment)).join("/")}/${file}`;
		try {
			const response = await fetchImpl(url, {
				signal,
				headers: { "user-agent": "dsh-plugin-console" }
			});
			if (response.status === 404) continue;
			if (!response.ok) continue;
			return {
				text: await readResponseTextBounded(response, maxBytes),
				source: `${fullName}@${ref}/${file}`
			};
		} catch {}
	}
	return {
		text: null,
		source: null
	};
}
function unavailableDetail(item, message) {
	return {
		...item,
		verification: "unavailable",
		verificationMessage: message,
		installSpec: null,
		commitSha: null,
		integrity: null,
		manifest: null,
		readme: null,
		readmeSource: null,
		warnings: []
	};
}
function invalidDetail(item, message, manifest = null, warnings = []) {
	return {
		...item,
		verification: "invalid",
		verificationMessage: message,
		installSpec: null,
		commitSha: null,
		integrity: null,
		manifest,
		readme: null,
		readmeSource: null,
		warnings
	};
}
function cacheRecord(value, sourceUrl) {
	if (!isRecord(value) || value.schemaVersion !== CACHE_SCHEMA || value.sourceUrl !== sourceUrl || typeof value.fetchedAt !== "string" || Number.isNaN(Date.parse(value.fetchedAt)) || !(typeof value.etag === "string" || value.etag === null) || !Array.isArray(value.items)) throw new TypeError("Invalid plugin catalog cache.");
	const items = value.items.map(parseCachedItem);
	if (items.some((item) => item === null)) throw new TypeError("Invalid plugin catalog cache entry.");
	return {
		schemaVersion: CACHE_SCHEMA,
		sourceUrl,
		fetchedAt: value.fetchedAt,
		etag: value.etag,
		items
	};
}
function parseCachedItem(value) {
	if (!isRecord(value)) return null;
	const canonical = parseRawCatalogItem({
		name: value.name,
		url: value.repositoryUrl,
		page: value.pageUrl,
		category: value.category,
		description: value.description,
		npm: value.packageName,
		stars: value.stars,
		added: value.addedAt
	});
	if (canonical === null || value.id !== canonical.id || value.owner !== canonical.owner || value.artifactKind !== canonical.artifactKind) return null;
	return canonical;
}
/** Owns the last-known-good catalog and on-demand package verification. */
var PluginCatalog = class {
	fetchImpl;
	now;
	closeController = new AbortController();
	items = [];
	source = "none";
	fetchedAt = null;
	etag = null;
	error = null;
	refreshPromise = null;
	inspections = /* @__PURE__ */ new Map();
	disposed = false;
	constructor(options) {
		this.options = options;
		this.fetchImpl = options.fetchImpl ?? fetch;
		this.now = options.now ?? (() => /* @__PURE__ */ new Date());
	}
	async initialize() {
		try {
			const record = cacheRecord(JSON.parse(await readFile(this.options.cachePath, "utf8")), this.options.sourceUrl);
			this.items = record.items;
			this.source = "cache";
			this.fetchedAt = record.fetchedAt;
			this.etag = record.etag;
			this.error = null;
		} catch (error) {
			if (error.code !== "ENOENT") this.error = "Saved community catalog is invalid.";
		}
	}
	status() {
		const stale = this.fetchedAt !== null && this.now().getTime() - Date.parse(this.fetchedAt) > this.options.maxAgeMs;
		return {
			state: this.items.length === 0 ? this.source === "none" ? "unavailable" : "empty" : "ready",
			source: this.source,
			sourceUrl: this.options.sourceUrl,
			fetchedAt: this.fetchedAt,
			stale,
			error: this.error
		};
	}
	list(request) {
		return queryCatalog(this.items, request, this.status());
	}
	find(id) {
		return this.items.find((item) => item.id === id.toLocaleLowerCase());
	}
	findByPackage(packageName) {
		return this.items.find((item) => item.packageName === packageName);
	}
	findByRepository(repository) {
		if (repository === null) return void 0;
		const normalized = repository.toLocaleLowerCase();
		return this.items.find((item) => item.id === normalized);
	}
	refresh() {
		if (this.refreshPromise !== null) return this.refreshPromise;
		const pending = this.refreshOnce().finally(() => {
			if (this.refreshPromise === pending) this.refreshPromise = null;
		});
		this.refreshPromise = pending;
		return pending;
	}
	async refreshOnce() {
		if (this.disposed) return this.status();
		try {
			const timeout = AbortSignal.timeout(this.options.timeoutMs);
			const headers = {};
			if (this.etag !== null) headers["if-none-match"] = this.etag;
			const response = await this.fetchImpl(this.options.sourceUrl, {
				signal: AbortSignal.any([timeout, this.closeController.signal]),
				headers: {
					accept: "application/json",
					"user-agent": "dsh-plugin-console",
					...headers
				}
			});
			const fetchedAt = this.now().toISOString();
			if (response.status === 304) {
				if (this.items.length === 0) throw new Error("Catalog returned not-modified without a local cache.");
				await this.commit({
					schemaVersion: CACHE_SCHEMA,
					sourceUrl: this.options.sourceUrl,
					fetchedAt,
					etag: this.etag,
					items: this.items
				});
				this.source = "network";
				this.fetchedAt = fetchedAt;
				this.error = null;
				return this.status();
			}
			if (!response.ok) throw new Error(`Catalog returned HTTP ${String(response.status)}.`);
			const items = parseCatalogText(await readResponseTextBounded(response, this.options.maxCatalogBytes));
			const next = {
				schemaVersion: CACHE_SCHEMA,
				sourceUrl: this.options.sourceUrl,
				fetchedAt,
				etag: response.headers.get("etag"),
				items
			};
			await this.commit(next);
			this.items = items;
			this.source = "network";
			this.fetchedAt = fetchedAt;
			this.etag = next.etag;
			this.error = null;
		} catch (error) {
			if (!this.disposed) this.error = errorMessage(error);
		}
		return this.status();
	}
	async commit(record) {
		await writeFileAtomic(this.options.cachePath, `${JSON.stringify(record)}\n`);
	}
	async detail(id, locale$1, force = false) {
		const item = this.find(id);
		if (item === void 0) return null;
		const cached = this.inspections.get(item.id);
		if (!force && cached !== void 0 && cached.locale === locale$1 && cached.expiresAt > this.now().getTime()) return cached.detail;
		let detail;
		try {
			detail = item.artifactKind === "npm" ? await this.inspectNpm(item, locale$1) : await this.inspectGithub(item, locale$1);
		} catch (error) {
			detail = unavailableDetail(item, errorMessage(error));
		}
		this.inspections.set(item.id, {
			expiresAt: this.now().getTime() + INSPECTION_CACHE_MS,
			locale: locale$1,
			detail
		});
		return detail;
	}
	/** Verify the latest npm manifest even when a package is absent from the community index. */
	async latestNpmArtifact(packageName) {
		if (!validNpmPackageName(packageName)) return null;
		const catalogItem = this.findByPackage(packageName);
		if (catalogItem !== void 0) {
			const detail = await this.detail(catalogItem.id, "en");
			if (detail?.verification === "verified" && detail.manifest !== null && detail.installSpec !== null && detail.manifest.repositoryUrl !== null && detail.integrity !== null && validNpmIntegrity(detail.integrity)) return {
				manifest: detail.manifest,
				sourceSpec: detail.installSpec,
				repositoryUrl: detail.manifest.repositoryUrl,
				integrity: detail.integrity,
				warnings: detail.warnings
			};
			return null;
		}
		const signal = this.operationSignal();
		const { value } = await fetchJson(this.fetchImpl, `https://registry.npmjs.org/${encodeURIComponent(packageName)}/latest`, signal, Math.min(this.options.maxCatalogBytes, 1e6));
		if (!isRecord(value)) return null;
		const manifest = manifestSummary(value);
		if (manifest === null || manifest.packageName !== packageName || !manifest.bundle) return null;
		const repository = normalizeGithubRepository(value.repository);
		const dist = isRecord(value.dist) ? value.dist : {};
		const integrity = stringValue(dist.integrity);
		if (repository === null || integrity === null || !validNpmIntegrity(integrity) || !validNpmTarball(dist.tarball)) return null;
		const warnings = inspectionWarnings(manifest, value);
		return {
			manifest,
			sourceSpec: `${packageName}@${manifest.version}`,
			repositoryUrl: `https://github.com/${repository}`,
			integrity,
			warnings
		};
	}
	operationSignal() {
		return AbortSignal.any([AbortSignal.timeout(this.options.timeoutMs), this.closeController.signal]);
	}
	async inspectNpm(item, locale$1) {
		const packageName = item.packageName;
		if (packageName === null || !validNpmPackageName(packageName)) return invalidDetail(item, "Catalog npm package name is invalid.");
		const encoded = encodeURIComponent(packageName);
		const signal = this.operationSignal();
		const { value } = await fetchJson(this.fetchImpl, `https://registry.npmjs.org/${encoded}/latest`, signal, Math.min(this.options.maxCatalogBytes, 1e6));
		if (!isRecord(value)) return invalidDetail(item, "npm metadata is invalid.");
		const manifest = manifestSummary(value);
		if (manifest === null || manifest.packageName !== packageName) return invalidDetail(item, "npm package identity does not match the catalog.");
		const warnings = inspectionWarnings(manifest, value);
		if (!manifest.bundle) return invalidDetail(item, "Published package does not declare an installable DSH bundle.", manifest, warnings);
		const dist = isRecord(value.dist) ? value.dist : {};
		const integrity = stringValue(dist.integrity);
		if (integrity === null || !validNpmIntegrity(integrity) || !validNpmTarball(dist.tarball)) return invalidDetail(item, "npm metadata has no valid HTTPS tarball and immutable integrity hash.", manifest, [...warnings, "integrity-missing"]);
		const repository = normalizeGithubRepository(value.repository);
		if (repository === null || repository.toLocaleLowerCase() !== item.id) return invalidDetail(item, "npm package repository does not match the catalog repository.", manifest, [...warnings, "repository-mismatch"]);
		const gitHead = typeof value.gitHead === "string" && /^[0-9a-f]{40}$/i.test(value.gitHead) ? value.gitHead : null;
		const readme = gitHead === null ? {
			text: null,
			source: null
		} : await fetchReadme(this.fetchImpl, repository, gitHead, locale$1, signal, this.options.maxReadmeBytes);
		return {
			...item,
			verification: "verified",
			verificationMessage: null,
			installSpec: `${packageName}@${manifest.version}`,
			commitSha: gitHead,
			integrity,
			manifest,
			readme: readme.text,
			readmeSource: readme.source,
			warnings: gitHead === null ? [...warnings, "registry-version-pinned"] : warnings
		};
	}
	async inspectGithub(item, locale$1) {
		const fullName = item.id;
		const signal = this.operationSignal();
		const repoResult = await fetchJson(this.fetchImpl, `https://api.github.com/repos/${fullName}`, signal, Math.min(this.options.maxCatalogBytes, 1e6));
		if (!isRecord(repoResult.value)) return invalidDetail(item, "GitHub repository metadata is invalid.");
		if (repoResult.value.archived === true) return invalidDetail(item, "GitHub repository is archived.", null, ["repository-archived"]);
		const defaultBranch = stringValue(repoResult.value.default_branch);
		if (defaultBranch === null) return invalidDetail(item, "GitHub default branch is unavailable.");
		const commitResult = await fetchJson(this.fetchImpl, `https://api.github.com/repos/${fullName}/commits/${encodeURIComponent(defaultBranch)}`, signal, Math.min(this.options.maxCatalogBytes, 1e6));
		const sha = isRecord(commitResult.value) ? stringValue(commitResult.value.sha) : null;
		if (sha === null || !/^[0-9a-f]{40}$/i.test(sha)) return invalidDetail(item, "GitHub commit could not be pinned.");
		const packageResponse = await this.fetchImpl(`https://raw.githubusercontent.com/${fullName}/${sha}/package.json`, {
			signal,
			headers: { "user-agent": "dsh-plugin-console" }
		});
		if (!packageResponse.ok) return invalidDetail(item, "Repository root does not contain package.json.");
		const packageValue = JSON.parse(await readResponseTextBounded(packageResponse, 512e3));
		if (!isRecord(packageValue)) return invalidDetail(item, "Repository package.json is invalid.");
		const manifest = manifestSummary(packageValue);
		if (manifest === null) return invalidDetail(item, "Repository package manifest has no valid name or version.");
		const warnings = inspectionWarnings(manifest, packageValue);
		if (!manifest.bundle) return invalidDetail(item, "Repository does not declare an installable DSH bundle.", manifest, warnings);
		const declaredRepository = normalizeGithubRepository(packageValue.repository);
		if (declaredRepository !== null && declaredRepository.toLocaleLowerCase() !== item.id) return invalidDetail(item, "Repository package identity points to a different GitHub project.", manifest, [...warnings, "repository-mismatch"]);
		const patchPath = bundlePatchPath$1(packageValue);
		if (patchPath === null) return invalidDetail(item, "Repository bundle patch path is invalid.", manifest, warnings);
		const encodedPatch = patchPath.split("/").map((segment) => encodeURIComponent(segment)).join("/");
		const patchResponse = await this.fetchImpl(`https://raw.githubusercontent.com/${fullName}/${sha}/${encodedPatch}`, {
			signal,
			headers: { "user-agent": "dsh-plugin-console" }
		});
		if (!patchResponse.ok) return invalidDetail(item, "Repository does not ship its declared bundle patch.", manifest, warnings);
		await readResponseTextBounded(patchResponse, 1e6);
		const readme = await fetchReadme(this.fetchImpl, fullName, sha, locale$1, signal, this.options.maxReadmeBytes);
		return {
			...item,
			packageName: manifest.packageName,
			verification: "verified",
			verificationMessage: null,
			installSpec: `github:${fullName}#${sha}`,
			commitSha: sha,
			integrity: null,
			manifest,
			readme: readme.text,
			readmeSource: readme.source,
			warnings: [...warnings, "git-source"]
		};
	}
	async close() {
		this.disposed = true;
		this.closeController.abort();
		await this.refreshPromise;
		this.inspections.clear();
	}
};

//#endregion
//#region src/process.ts
function processExit(child, onError) {
	return new Promise((resolve$1) => {
		let settled = false;
		const finish = (exit) => {
			if (settled) return;
			settled = true;
			resolve$1(exit);
		};
		child.once("error", (error) => {
			onError?.(error);
			finish({
				code: 1,
				signal: null
			});
		});
		child.once("exit", (code, signal) => finish({
			code,
			signal
		}));
	});
}
async function waitUntil(check, timeoutMs) {
	const deadline = Date.now() + timeoutMs;
	while (Date.now() < deadline) {
		if (check()) return true;
		await setTimeout$1(40);
	}
	return check();
}
function posixGroupAlive(pid) {
	try {
		process.kill(-pid, 0);
		return true;
	} catch (error) {
		return error.code !== "ESRCH";
	}
}
async function runTaskkill(pid, force, timeoutMs) {
	const child = spawn("taskkill", [
		"/pid",
		String(pid),
		"/t",
		...force ? ["/f"] : []
	], {
		shell: false,
		stdio: "ignore"
	});
	const exited = processExit(child);
	const result = await Promise.race([exited.then((exit) => exit.code === 0), setTimeout$1(timeoutMs).then(() => null)]);
	if (result !== null) return result;
	child.kill("SIGKILL");
	await Promise.race([exited, setTimeout$1(1e3)]);
	return false;
}
async function terminateProcessTree(child, exited, graceMs = 7e3, forceMs = 3e3) {
	const pid = child.pid;
	if (pid === void 0) return await Promise.race([exited.then(() => true), setTimeout$1(forceMs).then(() => false)]);
	if (process.platform === "win32") {
		if (await runTaskkill(pid, false, graceMs) && await Promise.race([exited.then(() => true), setTimeout$1(1e3).then(() => false)])) return true;
		return await runTaskkill(pid, true, forceMs) && await Promise.race([exited.then(() => true), setTimeout$1(forceMs).then(() => false)]);
	}
	if (!posixGroupAlive(pid)) return true;
	try {
		process.kill(-pid, "SIGTERM");
	} catch (error) {
		if (error.code !== "ESRCH") return false;
	}
	if (await waitUntil(() => !posixGroupAlive(pid), graceMs)) {
		await Promise.race([exited, setTimeout$1(500)]);
		return true;
	}
	try {
		process.kill(-pid, "SIGKILL");
	} catch (error) {
		if (error.code !== "ESRCH") return false;
	}
	const gone = await waitUntil(() => !posixGroupAlive(pid), forceMs);
	await Promise.race([exited, setTimeout$1(500)]);
	return gone;
}

//#endregion
//#region src/profile.ts
const PACKAGE_NAME$1 = /^[a-z0-9][a-z0-9._~-]*$/i;
const SCOPED_PACKAGE_NAME = /^@[a-z0-9][a-z0-9._~-]*\/[a-z0-9][a-z0-9._~-]*$/i;
const MAX_PACKAGE_JSON_BYTES = 512e3;
const NPM_TIMEOUT_MS = 8e3;
const MAX_NPM_METADATA_BYTES = 128e3;
const NPM_CACHE_MS = 300 * 1e3;
const MAX_PROFILE_PATCH_BYTES = 1e6;
const LIFECYCLE_SCRIPT_NAMES = [
	"preinstall",
	"install",
	"postinstall",
	"prepare"
];
const README_NAMES = {
	zh: [
		"README.zh.md",
		"README.zh-CN.md",
		"README.zh.markdown",
		"README.zh.rst",
		"README.zh.txt",
		"README.md",
		"README.markdown",
		"README.mdx",
		"README.rst",
		"README.txt",
		"README"
	],
	en: [
		"README.md",
		"README.en.md",
		"README.markdown",
		"README.en.markdown",
		"README.mdx",
		"README.rst",
		"README.txt",
		"README"
	]
};
const JS_EXPRESSION_TAG$1 = {
	tag: "tag:yaml.org,2002:js",
	identify: (value) => isRecord(value) && Object.keys(value).length === 1 && typeof value.__jsExpr === "string",
	resolve: (value) => ({ __jsExpr: value }),
	stringify: ({ value }) => isRecord(value) && typeof value.__jsExpr === "string" ? value.__jsExpr : ""
};
function packageNameValid(name$1) {
	return name$1.length <= 214 && (PACKAGE_NAME$1.test(name$1) || SCOPED_PACKAGE_NAME.test(name$1));
}
function packagePath(profileDir$1, packageName) {
	return join(profileDir$1, "node_modules", ...packageName.split("/"), "package.json");
}
function pathWithin$1(path, root) {
	const child = relative(resolve(root), resolve(path));
	return child.length === 0 || !child.startsWith("..") && !isAbsolute(child);
}
async function readPackageJson(profileDir$1, packageName) {
	if (!packageNameValid(packageName)) return null;
	const paths = [packagePath(profileDir$1, packageName)];
	try {
		const resolved = createRequire(join(profileDir$1, "package.json")).resolve(`${packageName}/package.json`);
		if (pathWithin$1(resolved, join(profileDir$1, "node_modules")) || pathWithin$1(resolved, join(dirname(profileDir$1), "node_modules"))) paths.push(resolved);
	} catch {}
	for (const path of [...new Set(paths)]) try {
		const raw = await readTextBounded(path, MAX_PACKAGE_JSON_BYTES);
		const value = JSON.parse(raw);
		if (!isRecord(value) || value.name !== packageName) continue;
		return {
			path,
			root: dirname(path),
			value
		};
	} catch {}
	return null;
}
function packageString(value) {
	return typeof value === "string" && value.trim().length > 0 ? value.trim() : null;
}
function packageAuthor(value) {
	if (typeof value === "string") return packageString(value);
	return isRecord(value) ? packageString(value.name) : null;
}
function packageRepository(value) {
	const fullName = normalizeGithubRepository(value);
	return fullName === null ? null : `https://github.com/${fullName}`;
}
function lifecycleScripts(value) {
	if (!isRecord(value)) return [];
	return LIFECYCLE_SCRIPT_NAMES.filter((name$1) => typeof value[name$1] === "string");
}
function bundlePatchPath(value) {
	if (!isRecord(value) || !isRecord(value.bundle) || typeof value.bundle.patch !== "string") return null;
	const raw = value.bundle.patch.startsWith("./") ? value.bundle.patch.slice(2) : value.bundle.patch;
	if (raw.length === 0 || raw.startsWith("/") || raw.includes("\\")) return null;
	return raw.split("/").some((segment) => segment.length === 0 || segment === "." || segment === "..") ? null : raw;
}
function isBundle(value) {
	return bundlePatchPath(value) !== null;
}
function isWebClient(value) {
	return isRecord(value) && isRecord(value.client) && value.client.platform === "web";
}
/**
* Runtime mirror: FiberState is an exported cross-package const enum.
* This projection follows DeepSeek Harness's host-plugin-inventory pattern.
*/
const FIBER_STATE = {
	PENDING: 0,
	LOADING: 1,
	ACTIVE: 2,
	FAILED: 3,
	DISPOSED: 4,
	UNLOADING: 5
};
function runtimePhase(value) {
	switch (value) {
		case FIBER_STATE.PENDING: return "pending";
		case FIBER_STATE.LOADING: return "loading";
		case FIBER_STATE.ACTIVE: return "active";
		case FIBER_STATE.FAILED: return "failed";
		case FIBER_STATE.UNLOADING: return "unloading";
		case FIBER_STATE.DISPOSED: return null;
	}
}
function launchState(requestedSpec, activeAtLaunch, activeAfterRestart, launchSpec) {
	if (requestedSpec === null) return activeAtLaunch && !activeAfterRestart ? "pending-removal" : "installed-inactive";
	if (activeAtLaunch && !activeAfterRestart) return "pending-removal";
	if (!activeAtLaunch && activeAfterRestart) return "pending-install";
	if (activeAtLaunch && launchSpec !== void 0 && launchSpec !== requestedSpec) return "pending-update";
	if (!activeAfterRestart) return "installed-inactive";
	return "active";
}
function npmPackageFromSpec(packageName, spec) {
	if (spec === null) return false;
	if (spec.startsWith("github:") || spec.startsWith("git:") || spec.startsWith("file:") || spec.startsWith("link:")) return false;
	return spec === packageName || spec.startsWith(`${packageName}@`);
}
function githubCommitFromSpec(spec) {
	if (spec === null) return null;
	return /^(?:github:[\w.-]+\/[\w.-]+|git\+https:\/\/github\.com\/[\w.-]+\/[\w.-]+(?:\.git)?)#([0-9a-f]{40})$/i.exec(spec)?.[1]?.toLocaleLowerCase() ?? null;
}
function packageVersion(value) {
	return packageString(value.version);
}
function packageDsh(value) {
	return isRecord(value.dsh) ? value.dsh : null;
}
function pluginRuntimeEntries(ctx, packageName, targets = []) {
	const entries = [];
	const targetKeys = new Set(targets.map((target) => activationKey(target.id, target.name)));
	for (const entry of ctx.loader.entries()) {
		if (entry.options.group) continue;
		if (!(targetKeys.size > 0 ? targetKeys.has(activationKey(entry.options.id, entry.options.name)) : entry.options.name === packageName)) continue;
		entries.push({
			patchId: entry.options.id,
			name: entry.options.name,
			summary: {
				entryId: entry.id,
				enabled: !entry.disabled,
				phase: entry.fiber === void 0 ? null : runtimePhase(entry.fiber.state)
			}
		});
	}
	return entries;
}
function profileFromContext(ctx, explicit) {
	if (explicit !== void 0) return explicit;
	if (ctx.baseUrl === void 0 || !ctx.baseUrl.startsWith("file:")) throw new Error("dsh-plugin-console requires a file-backed profile Loader baseUrl.");
	return fileURLToPath(ctx.baseUrl);
}
async function latestNpmVersion(packageName, fetchImpl) {
	try {
		const response = await fetchImpl(`https://registry.npmjs.org/${encodeURIComponent(packageName)}/latest`, {
			signal: AbortSignal.timeout(NPM_TIMEOUT_MS),
			headers: {
				accept: "application/json",
				"user-agent": "dsh-plugin-console"
			}
		});
		if (!response.ok) return {
			version: null,
			error: `npm returned HTTP ${String(response.status)}.`
		};
		const value = JSON.parse(await readResponseTextBounded(response, MAX_NPM_METADATA_BYTES));
		if (!isRecord(value) || typeof value.version !== "string") return {
			version: null,
			error: "npm latest metadata is invalid."
		};
		return {
			version: value.version,
			error: null
		};
	} catch (error) {
		return {
			version: null,
			error: errorMessage(error)
		};
	}
}
async function readProfileReadme(root, locale$1, maxBytes) {
	for (const name$1 of README_NAMES[locale$1]) try {
		return {
			text: await readTextBounded(join(root, name$1), maxBytes),
			file: name$1
		};
	} catch {}
	return {
		text: null,
		file: null
	};
}
function activationKey(id, name$1) {
	return `${id}\0${name$1}`;
}
function parseProfilePatchDocument(text) {
	const document = parseDocument(text, { customTags: [JS_EXPRESSION_TAG$1] });
	if (document.errors.length > 0) throw document.errors[0];
	if (!isSeq(document.contents)) throw new Error("Profile patch file must contain a YAML patch list.");
	return {
		document,
		sequence: document.contents
	};
}
function collectBundleEntries(sequence, targets) {
	for (const item of sequence.items) {
		if (!isMap(item)) continue;
		const group = item.get("group") === true;
		const id = item.get("id");
		const name$1 = item.get("name");
		if (!group && typeof id === "string" && typeof name$1 === "string") targets.set(activationKey(id, name$1), {
			id,
			name: name$1
		});
		const config = item.get("config");
		if (group && isSeq(config)) collectBundleEntries(config, targets);
	}
}
async function readBundleActivationDescriptor(root, dsh) {
	const relative$1 = bundlePatchPath(dsh);
	if (relative$1 === null) throw new Error("The package does not declare a valid DSH bundle patch.");
	const { sequence } = parseProfilePatchDocument(await readTextBounded(join(root, relative$1), MAX_PROFILE_PATCH_BYTES));
	const targets = /* @__PURE__ */ new Map();
	const configurationTargets = /* @__PURE__ */ new Map();
	for (const patch of sequence.items) {
		if (!isMap(patch)) throw new Error("The bundle patch contains a non-mapping entry.");
		const insert = patch.get("insert");
		if (isSeq(insert)) collectBundleEntries(insert, targets);
		else if (insert === void 0 && typeof patch.get("id") === "string") {
			const id = patch.get("id");
			const name$1 = typeof patch.get("name") === "string" ? patch.get("name") : null;
			configurationTargets.set(`${id}\0${name$1 ?? ""}`, {
				id,
				name: name$1
			});
		}
	}
	if (targets.size === 0 && configurationTargets.size === 0) throw new Error("The bundle patch declares neither Loader entries nor explicit configuration overrides.");
	return {
		targets: [...targets.values()],
		configurationTargets: [...configurationTargets.values()],
		configurationOnly: targets.size === 0 && configurationTargets.size > 0
	};
}
async function readBundleActivationTargets(root, dsh) {
	return (await readBundleActivationDescriptor(root, dsh)).targets;
}
async function readProfilePatchDocument(path) {
	try {
		return parseProfilePatchDocument(await readTextBounded(path, MAX_PROFILE_PATCH_BYTES));
	} catch (error) {
		if (error.code === "ENOENT") return parseProfilePatchDocument("[]\n");
		throw error;
	}
}
async function activationOverrides(path) {
	const values = /* @__PURE__ */ new Map();
	const { sequence } = await readProfilePatchDocument(path);
	for (const patch of sequence.items) {
		if (!isMap(patch) || patch.get("insert") !== void 0) continue;
		const id = patch.get("id");
		const name$1 = patch.get("name");
		const disabled = patch.get("disabled");
		if (typeof id === "string" && typeof name$1 === "string" && typeof disabled === "boolean") values.set(activationKey(id, name$1), disabled);
	}
	return values;
}
async function writable(path) {
	try {
		await access(path, constants.W_OK);
		return true;
	} catch {
		return false;
	}
}
async function writableIfPresent(path) {
	try {
		await access(path, constants.F_OK);
	} catch (error) {
		return error.code === "ENOENT";
	}
	return writable(path);
}
async function commandAvailable(command$1) {
	const child = spawn(command$1, ["--version"], {
		detached: process.platform !== "win32",
		stdio: [
			"ignore",
			"ignore",
			"ignore"
		]
	});
	const exited = processExit(child);
	let timer;
	const timeout = new Promise((resolve$1) => {
		timer = setTimeout(() => resolve$1(null), 5e3);
	});
	const result = await Promise.race([exited.then((exit) => exit.code === 0), timeout]);
	if (timer !== void 0) clearTimeout(timer);
	if (result !== null) return result;
	await terminateProcessTree(child, exited, 1e3, 1e3);
	return false;
}
async function mapWithConcurrency(items, limit, map) {
	const results = new Array(items.length);
	let cursor = 0;
	const workers = Array.from({ length: Math.min(limit, items.length) }, async () => {
		for (;;) {
			const index = cursor++;
			const item = items[index];
			if (item === void 0) return;
			results[index] = await map(item);
		}
	});
	await Promise.all(workers);
	return results;
}
/** Host-owned view of one active profile. */
var ProfileManager = class {
	runtime;
	ctx;
	dshBin;
	catalog;
	maxReadmeBytes;
	fetchImpl;
	latestCache = /* @__PURE__ */ new Map();
	busy = false;
	constructor(options) {
		this.ctx = options.ctx;
		this.dshBin = options.dshBin;
		this.catalog = options.catalog;
		this.maxReadmeBytes = options.maxReadmeBytes ?? 262144;
		this.fetchImpl = options.fetchImpl ?? fetch;
		const dir = profileFromContext(options.ctx, options.profileDir);
		const manifest = readProfileManifest("dsh-plugin-console", dir);
		this.runtime = {
			profileName: basename(dir),
			dir,
			launchDependencies: { ...manifest.dependencies ?? {} },
			launchBundles: [...manifest.dsh?.profile?.bundles ?? []]
		};
	}
	get isBusy() {
		return this.busy;
	}
	setBusy(value) {
		this.busy = value;
	}
	async capabilities() {
		const profileWritable = await Promise.all([
			writable(this.runtime.dir),
			writableIfPresent(join(this.runtime.dir, "package.json")),
			writableIfPresent(join(this.runtime.dir, "pnpm-lock.yaml")),
			writableIfPresent(join(this.runtime.dir, "pnpm-workspace.yaml")),
			writableIfPresent(profilePatchPath(this.runtime))
		]).then((values) => values.every(Boolean));
		const [dshAvailable, pnpmAvailable] = await Promise.all([commandAvailable(this.dshBin), commandAvailable("pnpm")]);
		return {
			profileName: this.runtime.profileName,
			profileWritable,
			dshAvailable,
			pnpmAvailable,
			busy: this.busy,
			message: !profileWritable ? "The active DSH profile is not writable." : !dshAvailable ? `Cannot execute ${this.dshBin}; install DSH or configure dshBin.` : !pnpmAvailable ? "Cannot execute pnpm; install pnpm or expose it on PATH." : null
		};
	}
	fingerprint() {
		const hash = createHash("sha256");
		for (const filename of [
			"package.json",
			"pnpm-lock.yaml",
			"pnpm-workspace.yaml",
			"cordis.patch.yml"
		]) {
			hash.update(filename).update("\0");
			try {
				hash.update(readFileSync(join(this.runtime.dir, filename)));
			} catch (error) {
				if (error.code !== "ENOENT") return "";
				hash.update("<missing>");
			}
			hash.update("\0");
		}
		return hash.digest("hex");
	}
	async list(locale$1 = "zh", checkUpdates = true) {
		const manifest = readProfileManifest("dsh-plugin-console", this.runtime.dir);
		const dependencies = manifest.dependencies ?? {};
		const bundles = manifest.dsh?.profile?.bundles ?? [];
		const overrides = await activationOverrides(profilePatchPath(this.runtime)).catch((error) => {
			this.ctx.logger?.warn(error instanceof Error ? error : new Error(errorMessage(error)));
			return /* @__PURE__ */ new Map();
		});
		return await mapWithConcurrency([...new Set([...Object.keys(dependencies), ...bundles])].filter(packageNameValid).sort(), 4, async (packageName) => {
			const requestedSpec = dependencies[packageName] ?? null;
			const packageData = await readPackageJson(this.runtime.dir, packageName);
			const dsh = packageData === null ? null : packageDsh(packageData.value);
			const bundle = dsh !== null && isBundle(dsh);
			const client = dsh !== null && isWebClient(dsh);
			const activeAtLaunch = this.runtime.launchBundles.includes(packageName);
			const activeAfterRestart = bundles.includes(packageName);
			const bundleTargets = packageData === null ? [] : await readBundleActivationTargets(packageData.root, dsh).catch((error) => {
				this.ctx.logger?.warn(error instanceof Error ? error : new Error(errorMessage(error)));
				return [];
			});
			const pluginEntries = pluginRuntimeEntries(this.ctx, packageName, bundleTargets);
			const entries = pluginEntries.map((entry) => entry.summary);
			const keyCounts = pluginEntries.reduce((counts, entry) => {
				const key = activationKey(entry.patchId, entry.name);
				counts.set(key, (counts.get(key) ?? 0) + 1);
				return counts;
			}, /* @__PURE__ */ new Map());
			const persistedState = launchState(requestedSpec, activeAtLaunch, activeAfterRestart, this.runtime.launchDependencies[packageName]);
			const disabledEntries = pluginEntries.map((entry) => {
				const key = activationKey(entry.patchId, entry.name);
				return keyCounts.get(key) === 1 ? overrides.get(key) ?? !entry.summary.enabled : !entry.summary.enabled;
			});
			const state = persistedState === "active" && disabledEntries.length > 0 ? disabledEntries.every(Boolean) ? "paused" : disabledEntries.some(Boolean) ? "partially-paused" : persistedState : persistedState;
			const baseRow = {
				packageName,
				requestedSpec,
				version: packageData === null ? null : packageVersion(packageData.value),
				description: packageData === null ? null : packageString(packageData.value.description),
				author: packageData === null ? null : packageAuthor(packageData.value.author),
				license: packageData === null ? null : packageString(packageData.value.license),
				homepage: packageData === null ? null : packageString(packageData.value.homepage),
				repositoryUrl: packageData === null ? null : packageRepository(packageData.value.repository),
				system: !Object.prototype.hasOwnProperty.call(dependencies, packageName) || packageName.startsWith("@deepseek-ai/"),
				directDependency: Object.prototype.hasOwnProperty.call(dependencies, packageName),
				bundle,
				client,
				activeAtLaunch,
				activeAfterRestart,
				state,
				runtimeEntries: entries,
				latestVersion: null,
				updateAvailable: false,
				updateCheckError: null,
				catalogId: this.catalog.findByRepository(packageRepository(packageData?.value.repository ?? null))?.id ?? this.catalog.findByPackage(packageName)?.id ?? null
			};
			if (checkUpdates && baseRow.directDependency && !baseRow.system && baseRow.version !== null && npmPackageFromSpec(packageName, requestedSpec)) {
				const cached = this.latestCache.get(packageName);
				const latest = cached !== void 0 && cached.expiresAt > Date.now() ? cached.value : await latestNpmVersion(packageName, this.fetchImpl);
				this.latestCache.set(packageName, {
					expiresAt: Date.now() + NPM_CACHE_MS,
					value: latest
				});
				return {
					...baseRow,
					latestVersion: latest.version,
					updateAvailable: latest.version !== null && semver.valid(baseRow.version) !== null && semver.valid(latest.version) !== null && semver.gt(latest.version, baseRow.version),
					updateCheckError: latest.error ?? (latest.version !== null && (semver.valid(baseRow.version) === null || semver.valid(latest.version) === null) ? "Installed or latest version is not valid semver." : null)
				};
			}
			const installedCommit = githubCommitFromSpec(requestedSpec);
			if (checkUpdates && baseRow.directDependency && !baseRow.system && installedCommit !== null && baseRow.catalogId !== null) {
				const latest = await this.catalog.detail(baseRow.catalogId, "en");
				return {
					...baseRow,
					latestVersion: latest?.commitSha?.slice(0, 7) ?? latest?.manifest?.version ?? null,
					updateAvailable: latest?.verification === "verified" && latest.commitSha !== null && latest.commitSha.toLocaleLowerCase() !== installedCommit,
					updateCheckError: latest === null || latest.verification === "verified" ? null : latest.verificationMessage
				};
			}
			return baseRow;
		});
	}
	async detail(packageName, locale$1 = "zh") {
		const summary = (await this.list(locale$1, true)).find((row) => row.packageName === packageName);
		if (summary === void 0) return null;
		const packageData = await readPackageJson(this.runtime.dir, packageName);
		if (packageData === null) return {
			...summary,
			readme: null,
			readmeFile: null,
			keywords: [],
			lifecycleScripts: []
		};
		const readme = await readProfileReadme(packageData.root, locale$1, this.maxReadmeBytes);
		return {
			...summary,
			readme: readme.text,
			readmeFile: readme.file,
			keywords: Array.isArray(packageData.value.keywords) ? packageData.value.keywords.filter((value) => typeof value === "string").slice(0, 100) : [],
			lifecycleScripts: lifecycleScripts(packageData.value.scripts)
		};
	}
	async activationDescriptor(packageName) {
		const packageData = await readPackageJson(this.runtime.dir, packageName);
		if (packageData === null) throw new Error(`The installed package ${packageName} could not be resolved.`);
		return readBundleActivationDescriptor(packageData.root, packageDsh(packageData.value));
	}
	async activationTargets(packageName) {
		return (await this.activationDescriptor(packageName)).targets;
	}
	async setPluginPaused(packageName, paused) {
		const declaredTargets = await this.activationTargets(packageName);
		const targets = pluginRuntimeEntries(this.ctx, packageName, declaredTargets).map((entry) => ({
			id: entry.patchId,
			name: entry.name
		}));
		const uniqueTargets = /* @__PURE__ */ new Map();
		for (const target of targets) {
			const key = activationKey(target.id, target.name);
			if (uniqueTargets.has(key)) throw new Error(`Loader entry ${target.id} is ambiguous and cannot be paused safely.`);
			uniqueTargets.set(key, target);
		}
		if (uniqueTargets.size === 0) throw new Error("The plugin has no Loader entries that can be paused.");
		const path = profilePatchPath(this.runtime);
		const { document, sequence } = await readProfilePatchDocument(path);
		for (const target of uniqueTargets.values()) {
			const patch = sequence.items.filter((patch$1) => isMap(patch$1) && patch$1.get("insert") === void 0 && patch$1.get("id") === target.id && patch$1.get("name") === target.name).at(-1);
			if (patch === void 0) sequence.items.push(document.createNode({
				id: target.id,
				name: target.name,
				disabled: paused
			}));
			else patch.set("disabled", paused);
		}
		await writeFileAtomic(path, String(document));
		return [...uniqueTargets.values()];
	}
	/** Remove persisted pause overrides that target a package being uninstalled. */
	async removePluginPauseOverrides(targets) {
		const targetKeys = new Set(targets.map((target) => activationKey(target.id, target.name)));
		if (targetKeys.size === 0) return;
		const path = profilePatchPath(this.runtime);
		const { document, sequence } = await readProfilePatchDocument(path);
		let pendingComment;
		const remaining = [];
		for (const item of sequence.items) {
			if (isMap(item) && item.get("insert") === void 0 && typeof item.get("id") === "string" && typeof item.get("name") === "string" && targetKeys.has(activationKey(item.get("id"), item.get("name")))) {
				if (typeof item.commentBefore === "string") pendingComment = pendingComment === void 0 ? item.commentBefore : `${pendingComment}\n${item.commentBefore}`;
				continue;
			}
			if (pendingComment !== void 0 && isMap(item)) {
				item.commentBefore = typeof item.commentBefore !== "string" ? pendingComment : `${pendingComment}\n${item.commentBefore}`;
				pendingComment = void 0;
			}
			remaining.push(item);
		}
		if (pendingComment !== void 0 && remaining.length === 0) sequence.commentBefore = pendingComment;
		if (remaining.length === sequence.items.length) return;
		sequence.items.splice(0, sequence.items.length, ...remaining);
		await writeFileAtomic(path, String(document));
	}
	async currentManifest() {
		return readProfileManifest("dsh-plugin-console", this.runtime.dir);
	}
	async close() {
		this.latestCache.clear();
	}
};
function profilePatchPath(runtime) {
	return join(runtime.dir, "cordis.patch.yml");
}

//#endregion
//#region src/dependency-tree.ts
function pathWithin(path, root) {
	const child = relative(resolve(root), resolve(path));
	return child.length === 0 || !child.startsWith("..") && !isAbsolute(child);
}
function copyFilter(root) {
	return (source) => {
		const first = relative(root, source).split(/[/\\]/)[0];
		return first !== ".git" && first !== "node_modules";
	};
}
async function materializeExternalLinks(sourceRoot, targetRoot) {
	const pending = [targetRoot];
	while (pending.length > 0) {
		const current = pending.pop();
		const directory = await opendir(current);
		for await (const entry of directory) {
			const targetPath = resolve(current, entry.name);
			const sourcePath = resolve(sourceRoot, relative(targetRoot, targetPath));
			const stat$1 = await lstat(targetPath);
			if (stat$1.isDirectory()) {
				pending.push(targetPath);
				continue;
			}
			if (!stat$1.isSymbolicLink()) continue;
			const link = await readlink(targetPath);
			if (pathWithin(resolve(dirname(targetPath), link), targetRoot)) continue;
			let sourceActual;
			try {
				sourceActual = await realpath(sourcePath);
			} catch (error) {
				if (error.code === "ENOENT") {
					await rm(targetPath, { force: true });
					continue;
				}
				throw error;
			}
			await rm(targetPath, {
				recursive: true,
				force: true
			});
			const sourceStat = await lstat(sourceActual);
			await cp(sourceActual, targetPath, {
				recursive: sourceStat.isDirectory(),
				dereference: false,
				verbatimSymlinks: true,
				preserveTimestamps: true,
				filter: sourceStat.isDirectory() ? copyFilter(sourceActual) : void 0
			});
			if (sourceStat.isDirectory()) pending.push(targetPath);
		}
	}
}
async function assertNoExternalLinks(targetRoot) {
	const pending = [targetRoot];
	while (pending.length > 0) {
		const current = pending.pop();
		const directory = await opendir(current);
		for await (const entry of directory) {
			const path = resolve(current, entry.name);
			const stat$1 = await lstat(path);
			if (stat$1.isDirectory()) pending.push(path);
			if (!stat$1.isSymbolicLink()) continue;
			if (!pathWithin(resolve(dirname(path), await readlink(path)), targetRoot)) throw new Error(`Dependency link escapes its private tree: ${path}`);
		}
	}
}
async function copyDependencyTree(sourceRoot, targetRoot) {
	await mkdir(dirname(targetRoot), {
		recursive: true,
		mode: 448
	});
	await cp(sourceRoot, targetRoot, {
		recursive: true,
		dereference: false,
		verbatimSymlinks: true,
		preserveTimestamps: true
	});
	await materializeExternalLinks(sourceRoot, targetRoot);
	await assertNoExternalLinks(targetRoot);
}

//#endregion
//#region src/canary.ts
const OUTPUT_LIMIT = 24e3;
const POLL_MS = 40;
const DEFAULT_STARTUP_STABILITY_MS = 3e3;
const CLIENT_SCRIPT_TIMEOUT_MS = 3e3;
const CLIENT_FACTORY_TIMEOUT_MS = 3e3;
const CLIENT_SEED_MODULES = new Set([
	"react",
	"react/jsx-runtime",
	"react-dom",
	"react-dom/client",
	"@deepseek-ai/cordis",
	"@deepseek-ai/dsh-client-ui-slots",
	"@deepseek-ai/dsh-client-web-react",
	"@deepseek-ai/dsh-client-ui-primitives",
	"@deepseek-ai/dsh-client-ui-attachment",
	"@deepseek-ai/dsh-client-schema-form"
]);
const CLIENT_SCRIPT_MAX_BYTES = 8 * 1024 * 1024;
var CanarySetupError = class extends Error {
	code;
	constructor(code, message) {
		super(message);
		this.name = "CanarySetupError";
		this.code = code;
	}
};
const PROBE_SOURCE = String.raw`import { readFileSync, renameSync, writeFileSync } from 'node:fs'

export const name = 'plugin-console-canary-probe'
export const inject = ['loader']

function publish(path, value) {
  const temporary = path + '.tmp'
  writeFileSync(temporary, JSON.stringify(value))
  renameSync(temporary, path)
}

export function apply(ctx, config) {
  queueMicrotask(async () => {
    const base = {
      protocolVersion: 1,
      nonce: config.nonce,
      pid: process.pid,
      packageName: config.packageName,
      expectedVersion: config.expectedVersion,
    }
    try {
      await ctx.loader.await()
      await new Promise(resolve => setImmediate(resolve))
      const all = [...ctx.loader.entries()]
      const entries = config.targets.map(target => {
        const matches = all.filter(entry => entry.options.id === target.id && entry.options.name === target.name)
        const entry = matches[0]
        return {
          ...target,
          matches: matches.length,
          disabled: entry?.disabled ?? null,
          state: entry?.fiber?.state ?? null,
          missingServices: entry?.fiber === undefined
            ? []
            : Object.keys(entry.fiber.inject).filter(service => entry.fiber.ctx.get(service) === undefined),
        }
      })
      const configurationEntries = config.configurationTargets.map(target => {
        const matches = all.filter(entry => entry.options.id === target.id && (target.name === null || entry.options.name === target.name))
        const entry = matches[0]
        return {
          id: target.id,
          name: target.name ?? entry?.options.name ?? '',
          matches: matches.length,
          disabled: entry?.disabled ?? null,
          state: entry?.fiber?.state ?? null,
          missingServices: entry?.fiber === undefined
            ? []
            : Object.keys(entry.fiber.inject).filter(service => entry.fiber.ctx.get(service) === undefined),
        }
      })
      const manifest = JSON.parse(readFileSync(config.packageJsonPath, 'utf8'))
      const actualVersion = typeof manifest.version === 'string' ? manifest.version : null
      const clientExpected = manifest.dsh?.client?.platform === 'web'
      const clientGraph = ctx.get('clientModules')?.graph?.()
      const clientEntry = clientGraph?.entries?.find(entry => entry.id === config.packageName)
      const clientPresent = !clientExpected || clientEntry !== undefined
      const clientUrl = clientExpected && typeof clientEntry?.url === 'string' ? clientEntry.url : null
      const clientGraphIds = clientGraph?.entries
        ?.filter(entry => typeof entry.id === 'string')
        .map(entry => entry.id) ?? []
      const port = ctx.get('webServer')?.port
      const passed = actualVersion === config.expectedVersion
        && clientPresent
        && Number.isSafeInteger(port)
        && port > 0
        && entries.every(entry => entry.matches === 1 && entry.disabled === false && entry.state === 2)
        && configurationEntries.every(entry => entry.matches === 1 && (entry.disabled === true || entry.state === 2))
      publish(config.resultPath, {
        ...base,
        passed,
        actualVersion,
        clientExpected,
        clientPresent,
        clientUrl,
        clientGraphIds,
        port: Number.isSafeInteger(port) ? port : null,
        entries,
        configurationEntries,
      })
    } catch (error) {
      publish(config.resultPath, {
        ...base,
        passed: false,
        actualVersion: null,
        clientExpected: false,
        clientPresent: false,
        clientUrl: null,
        clientGraphIds: [],
        port: null,
        entries: [],
        configurationEntries: [],
        error: error instanceof Error ? error.stack ?? error.message : String(error),
      })
    }
  })
}

export default { name, inject, apply }
`;
function appendOutput(current, chunk) {
	const next = current + chunk.toString("utf8");
	return next.length > OUTPUT_LIMIT ? next.slice(-OUTPUT_LIMIT) : next;
}
async function copyIfPresent(source, destination) {
	try {
		await copyFile(source, destination);
	} catch (error) {
		if (error.code !== "ENOENT") throw error;
	}
}
function packageJsonPath(profileDir$1, packageName) {
	return join(profileDir$1, "node_modules", ...packageName.split("/"), "package.json");
}
async function copyCanaryDependencies(sourceProfile, canaryProfile) {
	await copyDependencyTree(join(sourceProfile, "node_modules"), join(canaryProfile, "node_modules"));
}
async function prepareCanaryHome(request) {
	const root = await mkdtemp(join(tmpdir(), "dsh-plugin-console-canary-"));
	try {
		const profileDir$1 = join(root, "profiles", request.profileName);
		const tempDir = join(root, "tmp");
		const cwd = join(root, "workspace");
		await Promise.all([
			mkdir(profileDir$1, {
				recursive: true,
				mode: 448
			}),
			mkdir(tempDir, {
				recursive: true,
				mode: 448
			}),
			mkdir(cwd, {
				recursive: true,
				mode: 448
			})
		]);
		await copyIfPresent(join(process.cwd(), ".env"), join(cwd, ".env"));
		for (const filename of [
			"package.json",
			"pnpm-lock.yaml",
			"pnpm-workspace.yaml",
			"cordis.patch.yml"
		]) await copyIfPresent(join(request.profileDir, filename), join(profileDir$1, filename));
		const homePatch = join(root, "cordis.patch.yml");
		await writeFile(homePatch, "[]\n", {
			encoding: "utf8",
			mode: 384
		});
		const profilesRoot = dirname(request.profileDir);
		if (basename(profilesRoot) === "profiles") {
			const sourceHome = dirname(profilesRoot);
			await copyIfPresent(join(sourceHome, "cordis.patch.yml"), homePatch);
			await copyIfPresent(join(sourceHome, ".env"), join(root, ".env"));
		}
		await copyCanaryDependencies(request.profileDir, profileDir$1);
		const nonce = randomUUID();
		const resultPath = join(root, "result.json");
		const probePath = join(root, "probe.mjs");
		const patchPath = join(root, "canary.patch.yml");
		await writeFile(probePath, PROBE_SOURCE, {
			encoding: "utf8",
			mode: 384
		});
		const config = {
			nonce,
			resultPath,
			packageName: request.packageName,
			expectedVersion: request.expectedVersion,
			packageJsonPath: packageJsonPath(profileDir$1, request.packageName),
			targets: request.targets.map((target) => ({
				id: target.id,
				name: target.name
			})),
			configurationTargets: (request.configurationTargets ?? []).map((target) => ({
				id: target.id,
				name: target.name
			}))
		};
		await writeFile(patchPath, stringify([...request.targets.map((target) => ({
			id: target.id,
			name: target.name,
			disabled: false
		})), { insert: [{
			id: `plugin-console-canary-${nonce}`,
			name: probePath,
			config
		}] }]), {
			encoding: "utf8",
			mode: 384
		});
		return {
			root,
			resultPath,
			patchPath,
			cwd,
			nonce
		};
	} catch (error) {
		try {
			await rm(root, {
				recursive: true,
				force: true,
				maxRetries: 3,
				retryDelay: 100
			});
		} catch (cleanupError) {
			if (error instanceof CanarySetupError && error.code === "canary-shutdown-failed") throw error;
			throw new CanarySetupError("canary-cleanup-failed", `Canary preparation failed and its temporary profile could not be removed: ${errorMessage(cleanupError)}`);
		}
		throw error;
	}
}
function canaryEnvironment(root, nonce) {
	const env = {
		...process.env,
		DSH_HOME: root,
		HOME: root,
		USERPROFILE: root,
		XDG_CONFIG_HOME: join(root, "config"),
		XDG_CACHE_HOME: join(root, "cache"),
		TMPDIR: join(root, "tmp"),
		TMP: join(root, "tmp"),
		TEMP: join(root, "tmp"),
		DSH_PLUGIN_CONSOLE_CANARY_NONCE: nonce
	};
	for (const name$1 of [
		"CORDIS_SHARED",
		"DSH_SNAPSHOT",
		"DSH_WEB_URL",
		"NODE_PATH",
		"NODE_AUTH_TOKEN",
		"NPM_TOKEN",
		"NPM_CONFIG_USERCONFIG",
		"npm_config_userconfig"
	]) delete env[name$1];
	return env;
}
function startProcess(request, prepared) {
	let stdout = "";
	let stderr = "";
	let startError = null;
	const child = spawn(request.dshBin, [
		"--profile",
		request.profileName,
		"--patch",
		prepared.patchPath,
		"--host",
		"127.0.0.1",
		"--port",
		"0"
	], {
		cwd: prepared.cwd,
		detached: process.platform !== "win32",
		env: canaryEnvironment(prepared.root, prepared.nonce),
		shell: false,
		stdio: [
			"ignore",
			"pipe",
			"pipe"
		]
	});
	child.stdout?.on("data", (chunk) => {
		stdout = appendOutput(stdout, chunk);
	});
	child.stderr?.on("data", (chunk) => {
		stderr = appendOutput(stderr, chunk);
	});
	return {
		child,
		exited: processExit(child, (error) => {
			startError = errorMessage(error);
		}),
		startError: () => startError,
		output: () => redactProcessOutput(`${stdout}\n${stderr}`)
	};
}
function parseProbeDocument(text, request, nonce, pid) {
	try {
		const value = JSON.parse(text);
		if (!isRecord(value) || value.protocolVersion !== 1 || value.nonce !== nonce || value.pid !== pid || value.packageName !== request.packageName || value.expectedVersion !== request.expectedVersion || typeof value.passed !== "boolean" || !(typeof value.actualVersion === "string" || value.actualVersion === null) || typeof value.clientExpected !== "boolean" || typeof value.clientPresent !== "boolean" || !(typeof value.clientUrl === "string" || value.clientUrl === null) || !Array.isArray(value.clientGraphIds) || value.clientGraphIds.some((id) => typeof id !== "string") || !(typeof value.port === "number" || value.port === null) || !Array.isArray(value.entries) || !Array.isArray(value.configurationEntries) || !(value.error === void 0 || typeof value.error === "string")) return null;
		const entries = value.entries;
		if (entries.length !== request.targets.length || entries.some((entry, index) => {
			const target = request.targets[index];
			return !isRecord(entry) || target === void 0 || entry.id !== target.id || entry.name !== target.name || typeof entry.matches !== "number" || !Number.isSafeInteger(entry.matches) || entry.matches < 0 || !(typeof entry.disabled === "boolean" || entry.disabled === null) || !(typeof entry.state === "number" || entry.state === null) || !Array.isArray(entry.missingServices) || entry.missingServices.some((service) => typeof service !== "string");
		})) return null;
		const configurationEntries = value.configurationEntries;
		const configurationTargets = request.configurationTargets ?? [];
		if (configurationEntries.length !== configurationTargets.length || configurationEntries.some((entry, index) => {
			const target = configurationTargets[index];
			return !isRecord(entry) || target === void 0 || entry.id !== target.id || target.name !== null && entry.name !== target.name || typeof entry.name !== "string" || typeof entry.matches !== "number" || !Number.isSafeInteger(entry.matches) || entry.matches < 0 || !(typeof entry.disabled === "boolean" || entry.disabled === null) || !(typeof entry.state === "number" || entry.state === null) || !Array.isArray(entry.missingServices) || entry.missingServices.some((service) => typeof service !== "string");
		})) return null;
		if (value.port !== null && (!Number.isSafeInteger(value.port) || value.port <= 0 || value.port > 65535)) return null;
		if (value.clientUrl !== null && (!value.clientUrl.startsWith("/plugins/") || !value.clientUrl.includes("/client.js"))) return null;
		return value;
	} catch {
		return null;
	}
}
function probeFailureDetail(document) {
	if (document.error !== void 0) return document.error;
	const entries = [...document.entries, ...document.configurationEntries].map((entry) => `${entry.id} (${entry.name}): matches=${String(entry.matches)}, disabled=${String(entry.disabled)}, state=${String(entry.state)}${entry.missingServices.length === 0 ? "" : `, missing=${entry.missingServices.join(",")}`}`).join("\n");
	return [
		`Expected ${document.packageName}@${document.expectedVersion}, loaded ${document.actualVersion ?? "unknown"}.`,
		document.clientExpected && !document.clientPresent ? "The package declares a Web client, but it is missing from the client module graph." : "",
		entries
	].filter(Boolean).join("\n");
}
function clientVmBootstrap(stateName) {
	return String.raw`const ${stateName} = (() => {
  const registrations = [];
  const safeStringify = JSON.stringify.bind(JSON);
  const moduleLoader = { load(value) { registrations.push(value); } };
  const makeElement = (tagName) => {
    const attributes = Object.create(null);
    const children = [];
    const element = {
      tagName: String(tagName).toUpperCase(),
      dataset: Object.create(null),
      style: Object.create(null),
      children,
      parentNode: null,
      textContent: '',
      setAttribute(name, value) {
        const key = String(name);
        const text = String(value);
        attributes[key] = text;
        if (key.startsWith('data-')) {
          const datasetKey = key.slice(5).replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
          this.dataset[datasetKey] = text;
        }
      },
      getAttribute(name) { return attributes[String(name)] ?? null; },
      removeAttribute(name) { delete attributes[String(name)]; },
      appendChild(child) {
        if (child !== null && (typeof child === 'object' || typeof child === 'function')) {
          children.push(child);
          child.parentNode = this;
        }
        return child;
      },
      append(...items) { for (const item of items) this.appendChild(item); },
      remove() {
        const parent = this.parentNode;
        if (parent === null || !Array.isArray(parent.children)) return;
        const index = parent.children.indexOf(this);
        if (index >= 0) parent.children.splice(index, 1);
      },
      addEventListener() {},
      removeEventListener() {},
    };
    return element;
  };
  const head = makeElement('head');
  const body = makeElement('body');
  const documentElement = makeElement('html');
  documentElement.appendChild(head);
  documentElement.appendChild(body);
  const document = {
    head,
    body,
    documentElement,
    createElement: (tagName) => makeElement(tagName),
    querySelector: () => null,
    querySelectorAll: () => [],
    addEventListener() {},
    removeEventListener() {},
  };
  const inspect = () => {
    const registration = registrations.length === 1 ? registrations[0] : null;
    let id = null;
    let factory = false;
    if (registration !== null && (typeof registration === 'object' || typeof registration === 'function')) {
      id = typeof registration.id === 'string' ? registration.id : null;
      factory = typeof registration.factory === 'function';
    }
    return safeStringify({ count: registrations.length, id, factory });
  };
  const runFactory = (allowed) => {
    if (registrations.length !== 1) throw new Error('client bundle factory cannot run without exactly one registration');
    const registration = registrations[0];
    if (registration === null || (typeof registration !== 'object' && typeof registration !== 'function') || typeof registration.factory !== 'function') {
      throw new Error('client bundle registration has no callable factory');
    }
    let opaque;
    const opaqueTarget = function () {};
    opaque = new Proxy(opaqueTarget, {
      get(target, property, receiver) {
        const descriptor = Reflect.getOwnPropertyDescriptor(target, property);
        if (descriptor !== undefined && !descriptor.configurable && 'value' in descriptor && !descriptor.writable) return Reflect.get(target, property, receiver);
        if (property === 'then') return undefined;
        if (property === Symbol.iterator) return function* () {};
        if (property === Symbol.asyncIterator) return async function* () {};
        if (property === Symbol.toPrimitive) return () => 0;
        return opaque;
      },
      apply() { return opaque; },
      getPrototypeOf() { return opaque; },
      construct(_target, _arguments, newTarget) {
        const prototype = Reflect.get(newTarget, 'prototype');
        return Object.create((typeof prototype === 'object' && prototype !== null) || typeof prototype === 'function' ? prototype : null);
      },
    });
    const require = (specifier) => {
      if (typeof specifier !== 'string' || specifier.length === 0) throw new Error('client factory called require() with a non-string module id');
      const normalized = specifier.endsWith('/client') ? specifier.slice(0, -7) : specifier;
      if (!allowed.includes(specifier) && !allowed.includes(normalized)) throw new Error('client factory dependency "' + specifier + '" is absent from the Web module graph');
      return opaque;
    };
    registration.factory(require);
  };
  globalThis.window = globalThis;
  globalThis.self = globalThis;
  globalThis.__ModuleLoader__ = moduleLoader;
  globalThis.document = document;
  globalThis.console = Object.freeze({ debug() {}, info() {}, log() {}, warn() {}, error() {} });
  globalThis.navigator = Object.freeze({ userAgent: 'dsh-plugin-console-canary' });
  globalThis.location = Object.freeze({ href: 'http://127.0.0.1/' });
  globalThis.setTimeout = () => undefined;
  globalThis.clearTimeout = () => undefined;
  globalThis.requestAnimationFrame = () => undefined;
  globalThis.cancelAnimationFrame = () => undefined;
  return Object.freeze({ inspect, runFactory });
})();`;
}
function clientRequireIds(graphIds) {
	const ids = new Set(CLIENT_SEED_MODULES);
	for (const id of graphIds) {
		ids.add(id);
		if (id.endsWith("/client")) ids.add(id.slice(0, -7));
		else ids.add(`${id}/client`);
	}
	return ids;
}
/**
* Parse and execute one DSH classic client bundle in a capability-limited VM.
* The browser loader's contract is deliberately synchronous: one registration
* and a factory whose `require` calls resolve only against platform seeds or
* rows in the boot graph.
*/
function validateClientBundle(source, packageName, graphIds = []) {
	const sandbox = Object.create(null);
	const stateName = `__dsh_canary_state_${randomUUID().replaceAll("-", "_")}`;
	try {
		const context = createContext(sandbox, { codeGeneration: {
			strings: false,
			wasm: false
		} });
		new Script(clientVmBootstrap(stateName), { filename: `${packageName}/client.bootstrap.js` }).runInContext(context, { timeout: CLIENT_SCRIPT_TIMEOUT_MS });
		new Script(source, { filename: `${packageName}/client.js` }).runInContext(context, { timeout: CLIENT_SCRIPT_TIMEOUT_MS });
		const summaryValue = new Script(`${stateName}.inspect()`, { filename: `${packageName}/client.registrations.js` }).runInContext(context, { timeout: CLIENT_SCRIPT_TIMEOUT_MS });
		if (typeof summaryValue !== "string") return {
			ok: false,
			detail: "client bundle probe could not read its registration summary."
		};
		const summaryValueParsed = JSON.parse(summaryValue);
		if (!isRecord(summaryValueParsed) || typeof summaryValueParsed.count !== "number" || !Number.isSafeInteger(summaryValueParsed.count) || !(typeof summaryValueParsed.id === "string" || summaryValueParsed.id === null) || typeof summaryValueParsed.factory !== "boolean") return {
			ok: false,
			detail: "client bundle returned an invalid registration summary."
		};
		const summary = summaryValueParsed;
		if (summary.count !== 1) return {
			ok: false,
			detail: `client bundle registered ${String(summary.count)} modules; expected exactly one registration for "${packageName}".`
		};
		if (summary.id === null) return {
			ok: false,
			detail: "client bundle called __ModuleLoader__.load with an invalid registration id."
		};
		if (!summary.factory) return {
			ok: false,
			detail: `client bundle registration "${summary.id}" has no callable factory.`
		};
		if (summary.id !== packageName) return {
			ok: false,
			detail: `client bundle registered "${summary.id}" but the graph row expects "${packageName}".`
		};
		const allowed = [...clientRequireIds(graphIds)];
		new Script(`${stateName}.runFactory(${JSON.stringify(allowed)})`, { filename: `${packageName}/client.factory.js` }).runInContext(context, { timeout: CLIENT_FACTORY_TIMEOUT_MS });
		return {
			ok: true,
			detail: null
		};
	} catch (error) {
		return {
			ok: false,
			detail: `client bundle validation failed: ${errorMessage(error)}`
		};
	}
}
async function checkHttp(port, clientUrl, packageName, graphIds) {
	if (port === null || !Number.isSafeInteger(port) || port <= 0) return {
		ok: false,
		detail: "The isolated Web server did not report a valid port."
	};
	try {
		const rootResponse = await fetch(`http://127.0.0.1:${String(port)}/`, {
			headers: { host: `127.0.0.1:${String(port)}` },
			signal: AbortSignal.timeout(3e3)
		});
		await rootResponse.body?.cancel();
		if (!rootResponse.ok) return {
			ok: false,
			detail: `Web root returned HTTP ${String(rootResponse.status)}.`
		};
		if (clientUrl === null) return {
			ok: true,
			detail: null
		};
		const bundleResponse = await fetch(`http://127.0.0.1:${String(port)}${clientUrl}`, {
			headers: { host: `127.0.0.1:${String(port)}` },
			signal: AbortSignal.timeout(3e3)
		});
		if (!bundleResponse.ok) {
			await bundleResponse.body?.cancel();
			return {
				ok: false,
				detail: `Client bundle returned HTTP ${String(bundleResponse.status)}.`
			};
		}
		return validateClientBundle(await readResponseTextBounded(bundleResponse, CLIENT_SCRIPT_MAX_BYTES), packageName, graphIds);
	} catch {
		return {
			ok: false,
			detail: "The Web root or client bundle could not be fetched."
		};
	}
}
async function runActivationCanary(request) {
	if (request.targets.length === 0 && (request.configurationOnly !== true || (request.configurationTargets?.length ?? 0) === 0)) return {
		status: "failed",
		code: "canary-target-failed",
		detail: "The updated bundle has no verified Loader entries or explicit configuration-only declaration."
	};
	let prepared;
	try {
		prepared = await prepareCanaryHome(request);
	} catch (error) {
		return {
			status: "failed",
			code: error instanceof CanarySetupError ? error.code : "canary-preparation-failed",
			detail: errorMessage(error)
		};
	}
	let running = null;
	let outcome = {
		status: "failed",
		code: "canary-start-failed",
		detail: null
	};
	try {
		try {
			running = startProcess(request, prepared);
		} catch (error) {
			outcome = {
				status: "failed",
				code: "canary-start-failed",
				detail: errorMessage(error)
			};
		}
		if (running !== null) {
			const deadline = Date.now() + request.timeoutMs;
			let document = null;
			while (Date.now() < deadline && outcome.code === "canary-start-failed" && outcome.detail === null) {
				try {
					document = parseProbeDocument(await readFile(prepared.resultPath, "utf8"), request, prepared.nonce, running.child.pid);
					if (document !== null) break;
				} catch (error) {
					if (error.code !== "ENOENT") {
						outcome = {
							status: "failed",
							code: "canary-target-failed",
							detail: errorMessage(error)
						};
						break;
					}
				}
				const exit = await Promise.race([running.exited, setTimeout$1(POLL_MS).then(() => null)]);
				if (exit !== null) {
					const startError = running.startError();
					outcome = {
						status: "failed",
						code: startError === null ? "canary-process-exited" : "canary-start-failed",
						detail: startError ?? running.output() ?? `Canary exited with code ${String(exit.code)} (${String(exit.signal)}).`
					};
					break;
				}
			}
			if (document === null && outcome.code === "canary-start-failed" && outcome.detail === null) outcome = {
				status: "failed",
				code: "canary-timeout",
				detail: running.output() ?? "The isolated DSH startup did not settle before the deadline."
			};
			else if (document !== null && !document.passed) outcome = {
				status: "failed",
				code: "canary-target-failed",
				detail: probeFailureDetail(document)
			};
			else if (document !== null) {
				await setTimeout$1(request.stabilityMs ?? DEFAULT_STARTUP_STABILITY_MS);
				if (running.child.exitCode !== null || running.child.signalCode !== null) outcome = {
					status: "failed",
					code: "canary-process-exited",
					detail: running.output()
				};
				else {
					const http = await checkHttp(document.port, document.clientUrl, request.packageName, document.clientGraphIds);
					if (!http.ok) outcome = {
						status: "failed",
						code: "canary-http-failed",
						detail: http.detail ?? "The isolated DSH Web process activated its Loader entries but did not serve its index."
					};
					else outcome = {
						status: "passed",
						code: "canary-passed",
						detail: null
					};
				}
			}
		}
	} finally {
		let shutdown = true;
		if (running !== null) shutdown = await terminateProcessTree(running.child, running.exited);
		let cleanup = true;
		try {
			await rm(prepared.root, {
				recursive: true,
				force: true,
				maxRetries: 3,
				retryDelay: 100
			});
		} catch {
			cleanup = false;
		}
		if (!shutdown) outcome = {
			status: "failed",
			code: "canary-shutdown-failed",
			detail: "The isolated DSH process could not be terminated cleanly."
		};
		else if (!cleanup) outcome = {
			status: "failed",
			code: "canary-cleanup-failed",
			detail: "The isolated DSH process stopped, but its temporary profile could not be removed."
		};
	}
	return outcome;
}

//#endregion
//#region src/lock.ts
const LOCK_DIR = ".dsh-plugin-console.lock";
const OWNER_FILE = "owner.json";
const OWNER_WRITE_GRACE_MS = 500;
const OWNERLESS_STALE_MS = 3e4;
var ProfileLockedError = class extends Error {
	constructor(message = "Another plugin manager process is changing this profile.") {
		super(message);
		this.name = "ProfileLockedError";
	}
};
function pidAlive(pid) {
	try {
		process.kill(pid, 0);
		return true;
	} catch (error) {
		return error.code !== "ESRCH";
	}
}
async function owner(path) {
	try {
		const value = JSON.parse(await readFile(path, "utf8"));
		if (!isRecord(value) || !Number.isSafeInteger(value.pid) || value.pid <= 0 || typeof value.nonce !== "string") return null;
		return {
			pid: value.pid,
			nonce: value.nonce
		};
	} catch (error) {
		if (error.code === "ENOENT") return null;
		throw error;
	}
}
async function acquireProfileLock(profileDir$1) {
	await mkdir(profileDir$1, { recursive: true });
	const lockDir = join(profileDir$1, LOCK_DIR);
	const ownerPath = join(lockDir, OWNER_FILE);
	const nonce = randomUUID();
	for (let attempt = 0; attempt < 3; attempt += 1) try {
		await mkdir(lockDir, { mode: 448 });
		await writeFile(ownerPath, `${JSON.stringify({
			pid: process.pid,
			nonce,
			createdAt: (/* @__PURE__ */ new Date()).toISOString()
		})}\n`, {
			encoding: "utf8",
			flag: "wx",
			mode: 384
		});
		return async () => {
			const current = await owner(ownerPath);
			if (current?.nonce !== nonce || current.pid !== process.pid) return;
			await rm(lockDir, {
				recursive: true,
				force: true
			});
		};
	} catch (error) {
		if (error.code !== "EEXIST") throw error;
		await setTimeout$1(OWNER_WRITE_GRACE_MS);
		const current = await owner(ownerPath);
		if (current !== null && pidAlive(current.pid)) throw new ProfileLockedError();
		if (current === null) {
			let info;
			try {
				info = await stat(lockDir);
			} catch (statError) {
				if (statError.code === "ENOENT") continue;
				throw statError;
			}
			if (Date.now() - info.mtimeMs < OWNERLESS_STALE_MS) throw new ProfileLockedError();
		}
		const staleDir = join(profileDir$1, `${LOCK_DIR}.stale-${nonce}-${String(attempt)}`);
		try {
			await rename(lockDir, staleDir);
		} catch (renameError) {
			if (renameError.code === "ENOENT") continue;
			throw renameError;
		}
		await rm(staleDir, {
			recursive: true,
			force: true
		});
	}
	throw new ProfileLockedError();
}

//#endregion
//#region src/operations.ts
const PLAN_TTL_MS = 300 * 1e3;
const MAX_OUTPUT_CHARS = 24e3;
const MAX_STDOUT_CHARS = 5e6;
const PACKAGE_NAME = /^(?:[a-z0-9][a-z0-9._~-]*|@[a-z0-9][a-z0-9._~-]*\/[a-z0-9][a-z0-9._~-]*)$/i;
const JS_EXPRESSION_TAG = {
	tag: "tag:yaml.org,2002:js",
	identify: (value) => isRecord(value) && Object.keys(value).length === 1 && typeof value.__jsExpr === "string",
	resolve: (value) => ({ __jsExpr: value }),
	stringify: ({ value }) => isRecord(value) && typeof value.__jsExpr === "string" ? value.__jsExpr : ""
};
function emptyPlan(profileName, action, reason, packageName = null, catalogId = null) {
	return {
		status: "blocked",
		planId: null,
		blockReason: reason,
		action,
		profileName,
		catalogId,
		packageName,
		currentVersion: null,
		currentSpec: null,
		targetVersion: null,
		sourceSpec: null,
		artifactIntegrity: null,
		lifecycleScripts: [],
		warnings: [],
		expiresAt: null
	};
}
function validPackageName(value) {
	return value.length <= 214 && PACKAGE_NAME.test(value);
}
async function snapshotResult(profile, action, code, packageName, restartRequired, rollback, detail, canary = "not-run", processCleanup = "not-needed") {
	const [installedResult, capabilitiesResult] = await Promise.allSettled([profile.list("zh", false), profile.capabilities()]);
	const snapshotError = installedResult.status === "rejected" ? errorMessage(installedResult.reason) : capabilitiesResult.status === "rejected" ? errorMessage(capabilitiesResult.reason) : null;
	return {
		status: code === "succeeded" ? "succeeded" : "failed",
		code,
		action,
		packageName,
		restartRequired,
		activation: code === "succeeded" && restartRequired ? "pending-restart" : rollback === "failed" || processCleanup === "failed" ? "unknown" : "unchanged",
		canary,
		processCleanup,
		rollback,
		detail: detail ?? snapshotError,
		installed: installedResult.status === "fulfilled" ? installedResult.value : [],
		capabilities: capabilitiesResult.status === "fulfilled" ? capabilitiesResult.value : {
			profileName: profile.runtime.profileName,
			profileWritable: false,
			dshAvailable: false,
			pnpmAvailable: false,
			busy: false,
			message: snapshotError ?? "The profile state could not be read after the operation."
		}
	};
}
async function command(executable, args, cwd, timeoutMs) {
	let stdout = "";
	let stderr = "";
	let stdoutTruncated = false;
	let startError = null;
	const child = spawn(executable, [...args], {
		cwd,
		detached: process.platform !== "win32",
		shell: false,
		env: { ...process.env },
		stdio: [
			"ignore",
			"pipe",
			"pipe"
		]
	});
	child.stdout?.on("data", (chunk) => {
		stdout += chunk.toString("utf8");
		if (stdout.length > MAX_STDOUT_CHARS) {
			stdout = stdout.slice(-MAX_STDOUT_CHARS);
			stdoutTruncated = true;
		}
	});
	child.stderr?.on("data", (chunk) => {
		stderr += chunk.toString("utf8");
		if (stderr.length > MAX_OUTPUT_CHARS) stderr = stderr.slice(-MAX_OUTPUT_CHARS);
	});
	const exited = processExit(child, (error) => {
		startError = error;
	});
	let timeoutHandle;
	const timeout = new Promise((resolve$1) => {
		timeoutHandle = setTimeout(() => resolve$1(null), timeoutMs);
	});
	const exit = await Promise.race([exited, timeout]);
	if (timeoutHandle !== void 0) clearTimeout(timeoutHandle);
	let timedOut = false;
	let processCleanup = true;
	if (exit === null) {
		timedOut = true;
		processCleanup = await terminateProcessTree(child, exited);
		if (!processCleanup) stderr += "\nThe timed-out command process tree could not be terminated completely.";
	}
	const output = redactProcessOutput(`${stdout}\n${stderr}`);
	if (startError !== null) return {
		code: 1,
		unavailable: startError.code === "ENOENT",
		timedOut,
		output: output ?? errorMessage(startError),
		stdout: stdout.trim().length === 0 ? null : stdout,
		stdoutTruncated,
		processCleanup
	};
	return {
		code: exit?.code ?? null,
		unavailable: false,
		timedOut,
		output,
		stdout: stdout.trim().length === 0 ? null : stdout,
		stdoutTruncated
	};
}
async function backupFile(path) {
	try {
		return {
			path,
			content: await readFile(path, "utf8")
		};
	} catch (error) {
		if (error.code === "ENOENT") return {
			path,
			content: null
		};
		throw error;
	}
}
function manifestRecordField(value, field, context) {
	const nested = value[field];
	if (nested === void 0) return void 0;
	if (!isRecord(nested)) throw new Error(`${context}.${field} must be an object.`);
	return nested;
}
function manifestBundles(manifest) {
	const dsh = manifestRecordField(manifest, "dsh", "package.json");
	if (dsh === void 0) return [];
	const profile = manifestRecordField(dsh, "profile", "package.json.dsh");
	if (profile === void 0 || profile.bundles === void 0) return [];
	if (!Array.isArray(profile.bundles) || profile.bundles.some((bundle) => typeof bundle !== "string")) throw new Error("package.json.dsh.profile.bundles must be an array of package names.");
	return profile.bundles;
}
async function removeBundleFromProfileManifest(profileDir$1, packageName) {
	const path = join(profileDir$1, "package.json");
	let raw;
	try {
		raw = await readFile(path, "utf8");
	} catch (error) {
		if (error.code === "ENOENT") return;
		throw error;
	}
	const parsed = JSON.parse(raw);
	if (!isRecord(parsed)) throw new Error("The profile package.json must contain an object.");
	const dependencies = manifestRecordField(parsed, "dependencies", "package.json");
	if (dependencies !== void 0 && Object.prototype.hasOwnProperty.call(dependencies, packageName)) throw new Error(`The package manager reported removal success, but ${packageName} is still a profile dependency.`);
	const dsh = manifestRecordField(parsed, "dsh", "package.json");
	const profile = dsh === void 0 ? void 0 : manifestRecordField(dsh, "profile", "package.json.dsh");
	const bundles = profile === void 0 || profile.bundles === void 0 ? [] : manifestBundles(parsed);
	const remaining = bundles.filter((bundle) => bundle !== packageName);
	if (remaining.length !== bundles.length) {
		const nextDsh = dsh === void 0 ? void 0 : {
			...dsh,
			profile: profile === void 0 ? void 0 : {
				...profile,
				bundles: remaining
			}
		};
		const nextManifest = nextDsh === void 0 ? parsed : {
			...parsed,
			dsh: nextDsh
		};
		const trailingNewline = raw.endsWith("\n") ? "\n" : "";
		await writeFileAtomic(path, `${JSON.stringify(nextManifest, null, 2)}${trailingNewline}`);
	}
}
function workspaceReleaseAgeExclusions(raw) {
	const document = parseDocument(raw);
	if (document.errors.length > 0) throw document.errors[0];
	const value = document.get("minimumReleaseAgeExclude", true);
	if (value === void 0) return [];
	if (!isSeq(value) || value.items.some((item) => !(typeof item === "string" || isRecord(item) && typeof item.value === "string"))) throw new Error("pnpm-workspace.yaml.minimumReleaseAgeExclude must be a string array.");
	return value.items.map((item) => typeof item === "string" ? item : item.value);
}
/** Remove only release-age exceptions introduced by the package operation. */
async function removeAddedWorkspaceReleaseExclusion(profileDir$1, packageName, originalRaw) {
	const path = join(profileDir$1, "pnpm-workspace.yaml");
	let raw;
	try {
		raw = await readFile(path, "utf8");
	} catch (error) {
		if (error.code === "ENOENT") return;
		throw error;
	}
	const document = parseDocument(raw);
	if (document.errors.length > 0) throw document.errors[0];
	const value = document.get("minimumReleaseAgeExclude", true);
	if (value === void 0) return;
	if (!isSeq(value) || value.items.some((item) => !(typeof item === "string" || isRecord(item) && typeof item.value === "string"))) throw new Error("pnpm-workspace.yaml.minimumReleaseAgeExclude must be a string array.");
	const originalCounts = /* @__PURE__ */ new Map();
	for (const text of originalRaw === null ? [] : workspaceReleaseAgeExclusions(originalRaw)) originalCounts.set(text, (originalCounts.get(text) ?? 0) + 1);
	const removed = value.items.filter((item) => {
		const text = typeof item === "string" ? item : item.value;
		if (text !== packageName && !text.startsWith(`${packageName}@`)) return true;
		const count = originalCounts.get(text) ?? 0;
		if (count > 0) {
			originalCounts.set(text, count - 1);
			return true;
		}
		return false;
	});
	if (removed.length === value.items.length) return;
	if (removed.length === 0) document.delete("minimumReleaseAgeExclude");
	else value.items.splice(0, value.items.length, ...removed);
	const trailingNewline = raw.endsWith("\n") ? "\n" : "";
	await writeFileAtomic(path, `${String(document).replace(/\n+$/, "")}${trailingNewline}`);
}
async function restoreFiles(files) {
	for (const file of files) if (file.content === null) await rm(file.path, { force: true });
	else await writeFileAtomic(file.path, file.content);
}
async function pathExists(path) {
	try {
		await access(path);
		return true;
	} catch {
		return false;
	}
}
async function backupDependencies(profileDir$1) {
	const root = await mkdtemp(join(profileDir$1, ".dsh-plugin-console-recovery-"));
	const source = join(profileDir$1, "node_modules");
	const snapshot = join(root, "node_modules");
	try {
		if (!await pathExists(source)) return {
			root,
			snapshot: null,
			preserve: false
		};
		await copyDependencyTree(source, snapshot);
		return {
			root,
			snapshot,
			preserve: false
		};
	} catch (error) {
		await rm(root, {
			recursive: true,
			force: true,
			maxRetries: 3,
			retryDelay: 100
		}).catch(() => void 0);
		throw error;
	}
}
async function restoreDependencies(profileDir$1, backup) {
	const current = join(profileDir$1, "node_modules");
	const displaced = join(backup.root, "failed-node_modules");
	let currentMoved = false;
	let snapshotMoved = false;
	try {
		await rm(displaced, {
			recursive: true,
			force: true
		});
		if (await pathExists(current)) {
			await rename(current, displaced);
			currentMoved = true;
		}
		if (backup.snapshot !== null) {
			await rename(backup.snapshot, current);
			snapshotMoved = true;
			backup.snapshot = null;
		}
		try {
			await rm(displaced, {
				recursive: true,
				force: true,
				maxRetries: 3,
				retryDelay: 100
			});
		} catch {
			return false;
		}
		return true;
	} catch {
		try {
			if (!snapshotMoved && backup.snapshot !== null && !await pathExists(current)) {
				await rename(backup.snapshot, current);
				backup.snapshot = null;
				snapshotMoved = true;
			}
			if (snapshotMoved) {
				if (currentMoved) try {
					await rm(displaced, {
						recursive: true,
						force: true,
						maxRetries: 3,
						retryDelay: 100
					});
				} catch {
					return false;
				}
				return true;
			}
		} catch {}
		return false;
	}
}
async function cleanupDependencyBackup(backup) {
	if (backup === null || backup.preserve) return;
	await rm(backup.root, {
		recursive: true,
		force: true,
		maxRetries: 3,
		retryDelay: 100
	});
}
function preserveDependencyBackup(backup) {
	if (backup !== null) backup.preserve = true;
}
async function backupFilesChanged(files) {
	for (const file of files) try {
		const current = await readFile(file.path, "utf8");
		if (file.content === null || current !== file.content) return true;
	} catch (error) {
		if (error.code !== "ENOENT" || file.content !== null) return true;
	}
	return false;
}
async function lockfileHasIntegrity(profileDir$1, packageName, version, integrity) {
	try {
		const value = parse(await readFile(join(profileDir$1, "pnpm-lock.yaml"), "utf8"));
		if (!isRecord(value)) return false;
		const stores = [value.packages, value.snapshots].filter(isRecord);
		if (stores.length === 0) return false;
		const importer = isRecord(value.importers) && isRecord(value.importers["."]) ? value.importers["."] : null;
		if (importer === null) return false;
		let reference = null;
		for (const field of [
			"dependencies",
			"devDependencies",
			"optionalDependencies"
		]) {
			const dependencies = importer[field];
			if (!isRecord(dependencies) || dependencies[packageName] === void 0) continue;
			const direct = dependencies[packageName];
			reference = typeof direct === "string" ? direct : isRecord(direct) && typeof direct.version === "string" ? direct.version : null;
			break;
		}
		if (reference === null || reference !== version && !reference.startsWith(`${version}(`)) return false;
		const prefixes = new Set([`${packageName}@${version}`, `${packageName}@${reference}`]);
		return stores.some((store) => Object.entries(store).some(([rawKey, entry]) => {
			const key = rawKey.startsWith("/") ? rawKey.slice(1) : rawKey;
			if (![...prefixes].some((prefix) => key === prefix || key.startsWith(`${prefix}(`))) return false;
			return isRecord(entry) && isRecord(entry.resolution) && entry.resolution.integrity === integrity;
		}));
	} catch {
		return false;
	}
}
function collectComposedEntries(value, entries) {
	if (!Array.isArray(value)) return;
	for (const item of value) {
		if (!isRecord(item)) continue;
		entries.push(item);
		if (item.group === true) collectComposedEntries(item.config, entries);
	}
}
function activationDumpMatches(output, targets, paused) {
	if (output === null || output === void 0) return false;
	try {
		const entries = [];
		collectComposedEntries(parse(output, { customTags: [JS_EXPRESSION_TAG] }), entries);
		return targets.every((target) => {
			const matching = entries.filter((entry) => entry.id === target.id && entry.name === target.name);
			return matching.length === 1 && matching[0]?.disabled === paused;
		});
	} catch {
		return false;
	}
}
function requestedSpecMatchesPlan(requestedSpec, plan) {
	if (requestedSpec === null || plan.sourceSpec === null) return false;
	if (plan.sourceSpec.startsWith("github:") || plan.sourceSpec.startsWith("git+")) return requestedSpec === plan.sourceSpec;
	const fileSpec = plan.sourceSpec.startsWith("/") ? `file:${plan.sourceSpec}` : plan.sourceSpec;
	return requestedSpec === plan.sourceSpec || requestedSpec === fileSpec || requestedSpec === plan.targetVersion;
}
function packageManagerRejectedBeforeMutation(output) {
	if (output === null) return false;
	return /ERR_PNPM_(?:MINIMUM_RELEASE_AGE_VIOLATION|TRUST_DOWNGRADE|LOCKFILE_RESOLUTION_VERIFICATION|FROZEN_LOCKFILE_WITH_OUTDATED_LOCKFILE|BROKEN_LOCKFILE|OUTDATED_LOCKFILE)/.test(output);
}
function warningList(detail, action) {
	const warnings = [];
	if (action === "pause" || action === "resume") warnings.push("restart-required");
	else if (action === "remove") warnings.push("remove-data-kept");
	else {
		warnings.push("trusted-code", "restart-required", "scripts-disabled", "canary-validation");
		if (detail.warnings.includes("dsh-compatibility-not-declared")) warnings.push("compatibility-unknown");
	}
	return warnings;
}
/** Owns one mutation at a time and never exposes arbitrary package-manager args. */
var ProfileOperations = class {
	plans = /* @__PURE__ */ new Map();
	runCommand;
	probeActivation;
	lockProfile;
	now;
	timeoutMs;
	canaryTimeoutMs;
	operation = null;
	disposed = false;
	constructor(options) {
		this.options = options;
		this.runCommand = options.runCommand ?? ((args, cwd, timeoutMs) => command(options.dshBin, args, cwd, timeoutMs));
		this.probeActivation = options.probeActivation ?? runActivationCanary;
		this.lockProfile = options.lockProfile ?? acquireProfileLock;
		this.now = options.now ?? (() => Date.now());
		this.timeoutMs = options.timeoutMs ?? 300 * 1e3;
		this.canaryTimeoutMs = options.canaryTimeoutMs ?? 6e4;
	}
	get busy() {
		return this.options.profile.isBusy;
	}
	async plan(request) {
		this.prunePlans();
		if (this.disposed) return emptyPlan(this.options.profile.runtime.profileName, request.action, "manager-disposed");
		if (this.busy) return emptyPlan(this.options.profile.runtime.profileName, request.action, "another-operation-is-running");
		const capabilities = await this.options.profile.capabilities();
		if (!capabilities.profileWritable) return emptyPlan(this.options.profile.runtime.profileName, request.action, "profile-not-writable");
		if (request.action !== "pause" && request.action !== "resume") {
			if (!capabilities.dshAvailable) return emptyPlan(this.options.profile.runtime.profileName, request.action, "dsh-command-unavailable");
			if (!capabilities.pnpmAvailable) return emptyPlan(this.options.profile.runtime.profileName, request.action, "pnpm-command-unavailable");
		}
		const installed = await this.options.profile.list("zh", false);
		let packageName = request.packageName ?? null;
		let catalogId = request.catalogId ?? null;
		let currentVersion = null;
		let currentSpec = null;
		let targetVersion = null;
		let sourceSpec = null;
		let artifactIntegrity = null;
		let lifecycleScripts$1 = [];
		let detail = null;
		if (request.action === "pause" || request.action === "resume") {
			if (packageName === null || !validPackageName(packageName)) return emptyPlan(this.options.profile.runtime.profileName, request.action, "package-name-invalid");
			const row$1 = installed.find((item) => item.packageName === packageName);
			if (row$1 === void 0) return emptyPlan(this.options.profile.runtime.profileName, request.action, "package-not-installed", packageName);
			if (!row$1.directDependency || row$1.system) return emptyPlan(this.options.profile.runtime.profileName, request.action, "system-package-protected", packageName);
			if (row$1.state === "pending-removal" || row$1.state === "pending-install" || row$1.state === "pending-update") return emptyPlan(this.options.profile.runtime.profileName, request.action, "restart-required-before-next-change", packageName);
			if (packageName === "dsh-plugin-console" && request.action === "pause") return emptyPlan(this.options.profile.runtime.profileName, request.action, "self-pause-protected", packageName);
			if (!row$1.bundle || row$1.runtimeEntries.length === 0) return emptyPlan(this.options.profile.runtime.profileName, request.action, "plugin-entry-unavailable", packageName);
			const paused = row$1.state === "paused" || row$1.state === "partially-paused";
			if (request.action === "pause" && paused) return emptyPlan(this.options.profile.runtime.profileName, request.action, "already-paused", packageName);
			if (request.action === "resume" && !paused) return emptyPlan(this.options.profile.runtime.profileName, request.action, "already-active", packageName);
			return this.storePlan({
				action: request.action,
				catalogId: row$1.catalogId,
				packageName,
				currentVersion: row$1.version,
				currentSpec: row$1.requestedSpec,
				targetVersion: row$1.version,
				sourceSpec: null,
				artifactIntegrity: null,
				lifecycleScripts: lifecycleScripts$1,
				warnings: warningList({ warnings: [] }, request.action)
			});
		}
		if (request.action === "remove") {
			if (packageName === null || !validPackageName(packageName)) return emptyPlan(this.options.profile.runtime.profileName, request.action, "package-name-invalid");
			const row$1 = installed.find((item) => item.packageName === packageName);
			if (row$1 === void 0) return emptyPlan(this.options.profile.runtime.profileName, request.action, "package-not-installed", packageName);
			if (!row$1.directDependency || row$1.system) return emptyPlan(this.options.profile.runtime.profileName, request.action, "system-package-protected", packageName);
			if (row$1.state === "pending-removal" || row$1.state === "pending-update") return emptyPlan(this.options.profile.runtime.profileName, request.action, "restart-required-before-next-change", packageName);
			currentVersion = row$1.version;
			currentSpec = row$1.requestedSpec;
			catalogId = row$1.catalogId;
			const warnings = warningList({ warnings: [] }, request.action);
			if (packageName === "dsh-plugin-console") warnings.push("self-removal");
			return this.storePlan({
				action: request.action,
				catalogId,
				packageName,
				currentVersion,
				currentSpec,
				targetVersion: null,
				sourceSpec: null,
				artifactIntegrity: null,
				lifecycleScripts: lifecycleScripts$1,
				warnings
			});
		}
		if (catalogId === null && packageName !== null) catalogId = this.options.catalog.findByPackage(packageName)?.id ?? null;
		let artifact = null;
		if (catalogId === null && request.action === "update" && packageName !== null) {
			artifact = await this.options.catalog.latestNpmArtifact(packageName);
			if (artifact === null) return emptyPlan(this.options.profile.runtime.profileName, request.action, "catalog-entry-required", packageName);
		} else if (catalogId !== null) {
			detail = await this.options.catalog.detail(catalogId, "zh");
			if (detail === null) return emptyPlan(this.options.profile.runtime.profileName, request.action, "catalog-entry-missing", packageName, catalogId);
			if (detail.verification !== "verified" || detail.installSpec === null || detail.manifest === null) return emptyPlan(this.options.profile.runtime.profileName, request.action, detail.verificationMessage ?? "artifact-not-verified", detail.manifest?.packageName ?? packageName, catalogId);
		} else return emptyPlan(this.options.profile.runtime.profileName, request.action, "catalog-entry-required", packageName);
		const resolvedPackageName = detail?.manifest?.packageName ?? artifact?.manifest.packageName;
		const resolvedVersion = detail?.manifest?.version ?? artifact?.manifest.version;
		const resolvedSpec = detail?.installSpec ?? artifact?.sourceSpec;
		const resolvedScripts = detail?.manifest?.lifecycleScripts ?? artifact?.manifest.lifecycleScripts ?? [];
		artifactIntegrity = detail?.integrity ?? artifact?.integrity ?? null;
		const row = resolvedPackageName === void 0 ? void 0 : installed.find((item) => item.packageName === resolvedPackageName);
		if (resolvedPackageName === void 0 || resolvedVersion === void 0 || resolvedSpec === void 0) return emptyPlan(this.options.profile.runtime.profileName, request.action, "artifact-not-verified", packageName, catalogId);
		if (request.action === "install" && row !== void 0) return emptyPlan(this.options.profile.runtime.profileName, request.action, "already-installed", resolvedPackageName, catalogId);
		if (request.action === "update") {
			if (row === void 0) return emptyPlan(this.options.profile.runtime.profileName, request.action, "package-not-installed", resolvedPackageName, catalogId);
			if (!row.directDependency) return emptyPlan(this.options.profile.runtime.profileName, request.action, "system-package-protected", resolvedPackageName, catalogId);
			if (row.state === "pending-install" || row.state === "pending-update" || row.state === "pending-removal") return emptyPlan(this.options.profile.runtime.profileName, request.action, "restart-required-before-next-change", resolvedPackageName, catalogId);
			if (artifact !== null && (row.repositoryUrl === null || row.repositoryUrl.toLocaleLowerCase() !== artifact.repositoryUrl.toLocaleLowerCase())) return emptyPlan(this.options.profile.runtime.profileName, request.action, "artifact-repository-mismatch", resolvedPackageName, catalogId);
			currentVersion = row.version;
			currentSpec = row.requestedSpec;
			if (detail?.artifactKind === "github") {
				if (row.requestedSpec === resolvedSpec) return emptyPlan(this.options.profile.runtime.profileName, request.action, "already-up-to-date", resolvedPackageName, catalogId);
			} else {
				if (currentVersion === null || semver.valid(currentVersion) === null) return emptyPlan(this.options.profile.runtime.profileName, request.action, "installed-version-invalid", resolvedPackageName, catalogId);
				if (semver.valid(resolvedVersion) === null || !semver.gt(resolvedVersion, currentVersion)) return emptyPlan(this.options.profile.runtime.profileName, request.action, "already-up-to-date", resolvedPackageName, catalogId);
			}
		}
		targetVersion = resolvedVersion;
		sourceSpec = resolvedSpec;
		lifecycleScripts$1 = resolvedScripts;
		return this.storePlan({
			action: request.action,
			catalogId,
			packageName: resolvedPackageName,
			currentVersion,
			currentSpec,
			targetVersion,
			sourceSpec,
			artifactIntegrity,
			lifecycleScripts: lifecycleScripts$1,
			warnings: [...detail === null ? warningList({ warnings: artifact?.warnings ?? [] }, request.action) : warningList(detail, request.action), ...artifact === null ? [] : ["uncatalogued-update"]]
		});
	}
	storePlan(input) {
		const planId = randomUUID();
		const expiresAt = new Date(this.now() + PLAN_TTL_MS).toISOString();
		const plan = {
			status: "ready",
			planId,
			blockReason: null,
			profileName: this.options.profile.runtime.profileName,
			catalogId: input.catalogId,
			packageName: input.packageName,
			currentVersion: input.currentVersion,
			currentSpec: input.currentSpec,
			targetVersion: input.targetVersion,
			sourceSpec: input.sourceSpec,
			artifactIntegrity: input.artifactIntegrity,
			lifecycleScripts: [...input.lifecycleScripts],
			warnings: [...input.warnings],
			expiresAt,
			action: input.action
		};
		this.plans.set(planId, {
			plan,
			fingerprint: this.options.profile.fingerprint()
		});
		return plan;
	}
	async execute(planId) {
		this.prunePlans();
		if (this.disposed) return snapshotResult(this.options.profile, null, "manager-disposed", null, false, "not-needed", null);
		if (this.operation !== null || this.busy) return snapshotResult(this.options.profile, null, "operation-busy", null, false, "not-needed", null);
		const stored = this.plans.get(planId);
		this.plans.delete(planId);
		if (stored === void 0) return snapshotResult(this.options.profile, null, "plan-invalid-or-expired", null, false, "not-needed", null);
		if (Date.parse(stored.plan.expiresAt ?? "") <= this.now()) return snapshotResult(this.options.profile, stored.plan.action, "plan-expired", stored.plan.packageName, false, "not-needed", null);
		if (stored.fingerprint !== this.options.profile.fingerprint()) return snapshotResult(this.options.profile, stored.plan.action, "profile-changed", stored.plan.packageName, false, "not-needed", null);
		const plan = stored.plan;
		if (plan.packageName === null) return snapshotResult(this.options.profile, plan.action, "plan-invalid", null, false, "not-needed", null);
		this.options.profile.setBusy(true);
		const operation = this.prepareAndRun(plan, stored.fingerprint).then((result) => ({
			...result,
			capabilities: {
				...result.capabilities,
				busy: false
			}
		})).finally(() => this.options.profile.setBusy(false));
		this.operation = operation;
		try {
			return await operation;
		} finally {
			if (this.operation === operation) this.operation = null;
		}
	}
	profileFiles() {
		return Promise.all([
			backupFile(join(this.options.profile.runtime.dir, "package.json")),
			backupFile(join(this.options.profile.runtime.dir, "pnpm-lock.yaml")),
			backupFile(join(this.options.profile.runtime.dir, "pnpm-workspace.yaml")),
			backupFile(profilePatchPath(this.options.profile.runtime))
		]);
	}
	async prepareAndRun(plan, fingerprint) {
		let release = null;
		try {
			release = await this.lockProfile(this.options.profile.runtime.dir);
		} catch (error) {
			const code = error instanceof ProfileLockedError ? "profile-locked" : "profile-lock-failed";
			return snapshotResult(this.options.profile, plan.action, code, plan.packageName, false, "not-needed", errorMessage(error));
		}
		try {
			if (fingerprint !== this.options.profile.fingerprint()) return snapshotResult(this.options.profile, plan.action, "profile-changed", plan.packageName, false, "not-needed", null);
			if (!await this.planStillTargetsCurrentState(plan)) return snapshotResult(this.options.profile, plan.action, "plan-state-changed", plan.packageName, false, "not-needed", null);
			let backups;
			let dependencies = null;
			try {
				backups = await this.profileFiles();
				if (plan.action === "install" || plan.action === "update" || plan.action === "remove") dependencies = await backupDependencies(this.options.profile.runtime.dir);
			} catch (error) {
				await cleanupDependencyBackup(dependencies).catch(() => void 0);
				return snapshotResult(this.options.profile, plan.action, "backup-failed", plan.packageName, false, "not-needed", errorMessage(error));
			}
			try {
				return await this.runPlan(plan, backups, dependencies);
			} finally {
				await cleanupDependencyBackup(dependencies).catch(() => void 0);
			}
		} finally {
			await release().catch(() => void 0);
		}
	}
	async planStillTargetsCurrentState(plan) {
		if (plan.action === "pause" || plan.action === "resume") {
			const row$1 = (await this.options.profile.list("zh", false)).find((item) => item.packageName === plan.packageName);
			if (row$1 === void 0 || !row$1.directDependency || row$1.system || row$1.version !== plan.currentVersion || row$1.requestedSpec !== plan.currentSpec) return false;
			if (row$1.runtimeEntries.length === 0) return false;
			const paused = row$1.state === "paused" || row$1.state === "partially-paused";
			return plan.action === "pause" ? !paused : paused;
		}
		if (plan.action === "remove") {
			const row$1 = (await this.options.profile.list("zh", false)).find((item) => item.packageName === plan.packageName);
			return row$1 !== void 0 && row$1.directDependency && !row$1.system && row$1.version === plan.currentVersion && row$1.requestedSpec === plan.currentSpec;
		}
		if (plan.catalogId !== null) {
			const detail = await this.options.catalog.detail(plan.catalogId, "en", true);
			if (detail === null || detail.verification !== "verified" || detail.installSpec !== plan.sourceSpec) return false;
			if (detail.integrity !== plan.artifactIntegrity) return false;
		} else if (plan.action === "update" && plan.packageName !== null) {
			const artifact = await this.options.catalog.latestNpmArtifact(plan.packageName);
			if (artifact === null || artifact.sourceSpec !== plan.sourceSpec || artifact.integrity !== plan.artifactIntegrity) return false;
		}
		const row = (await this.options.profile.list("zh", false)).find((item) => item.packageName === plan.packageName);
		if (plan.action === "install") return row === void 0;
		return row !== void 0 && row.directDependency && row.version === plan.currentVersion && row.requestedSpec === plan.currentSpec;
	}
	async runPlan(plan, backups, dependencies) {
		if (plan.action === "pause" || plan.action === "resume") {
			const paused = plan.action === "pause";
			let targets;
			try {
				targets = await this.options.profile.setPluginPaused(plan.packageName, paused);
			} catch (error) {
				const rollback = await this.rollbackActivation(backups);
				return snapshotResult(this.options.profile, plan.action, "activation-change-failed", plan.packageName, false, rollback, errorMessage(error));
			}
			let composition;
			try {
				composition = await this.runCommand([
					"--profile",
					this.options.profile.runtime.profileName,
					"--dump-config"
				], this.options.profile.runtime.dir, this.timeoutMs);
			} catch (error) {
				const rollback = await this.rollbackActivation(backups);
				return snapshotResult(this.options.profile, plan.action, "composition-validation-failed", plan.packageName, false, rollback, errorMessage(error));
			}
			if (composition.unavailable || composition.timedOut || composition.code !== 0) {
				const rollback = await this.rollbackActivation(backups);
				return snapshotResult(this.options.profile, plan.action, "composition-validation-failed", plan.packageName, false, rollback, composition.output);
			}
			if (composition.stdoutTruncated || !activationDumpMatches(composition.stdout ?? composition.output, targets, paused)) {
				const rollback = await this.rollbackActivation(backups);
				return snapshotResult(this.options.profile, plan.action, "activation-validation-failed", plan.packageName, false, rollback, null);
			}
			return snapshotResult(this.options.profile, plan.action, "succeeded", plan.packageName, true, "not-needed", null);
		}
		const args = plan.action === "remove" ? [
			"plugin",
			"--profile",
			this.options.profile.runtime.profileName,
			"remove",
			plan.packageName
		] : [
			"plugin",
			"--profile",
			this.options.profile.runtime.profileName,
			"add",
			"--save-exact",
			"--ignore-scripts",
			plan.sourceSpec
		];
		let removalTargets = [];
		if (plan.action === "remove") try {
			removalTargets = (await this.options.profile.activationDescriptor(plan.packageName)).targets;
		} catch {}
		let result;
		try {
			result = await this.runCommand(args, this.options.profile.runtime.dir, this.timeoutMs);
		} catch (error) {
			preserveDependencyBackup(dependencies);
			return snapshotResult(this.options.profile, plan.action, "dsh-command-indeterminate", plan.packageName, false, "failed", errorMessage(error), "not-run", "failed");
		}
		let mutationState;
		try {
			if (result.code === 0 && plan.action === "remove") {
				if (removalTargets.length > 0 && typeof this.options.profile.removePluginPauseOverrides === "function") await this.options.profile.removePluginPauseOverrides(removalTargets);
				await removeBundleFromProfileManifest(this.options.profile.runtime.dir, plan.packageName);
				await removeAddedWorkspaceReleaseExclusion(this.options.profile.runtime.dir, plan.packageName, backups.find((file) => file.path === join(this.options.profile.runtime.dir, "pnpm-workspace.yaml"))?.content ?? null);
			}
			mutationState = await this.profileFiles();
		} catch (error) {
			try {
				mutationState = await this.profileFiles();
			} catch {
				preserveDependencyBackup(dependencies);
				return snapshotResult(this.options.profile, plan.action, "mutation-snapshot-failed", plan.packageName, false, "failed", errorMessage(error));
			}
			const rollback = await this.rollback(backups, true, plan, mutationState, dependencies);
			return snapshotResult(this.options.profile, plan.action, "profile-manifest-repair-failed", plan.packageName, false, rollback, errorMessage(error));
		}
		if (result.unavailable) {
			const rollback = await this.rollback(backups, true, plan, mutationState, dependencies, true);
			return snapshotResult(this.options.profile, plan.action, "dsh-command-indeterminate", plan.packageName, false, rollback, result.output);
		}
		if (result.timedOut) {
			if (result.processCleanup === false) {
				preserveDependencyBackup(dependencies);
				return snapshotResult(this.options.profile, plan.action, "operation-process-leaked", plan.packageName, false, "failed", result.output, "not-run", "failed");
			}
			const rollback = await this.rollback(backups, true, plan, mutationState, dependencies);
			return snapshotResult(this.options.profile, plan.action, "operation-timeout", plan.packageName, false, rollback, result.output, "not-run", "succeeded");
		}
		if (result.code !== 0) {
			const rollback = await this.rollback(backups, true, plan, mutationState, dependencies, packageManagerRejectedBeforeMutation(result.output));
			return snapshotResult(this.options.profile, plan.action, "dsh-command-failed", plan.packageName, false, rollback, result.output);
		}
		try {
			const row = (await this.options.profile.list("zh", false)).find((item) => item.packageName === plan.packageName);
			const integrityValid = plan.action === "remove" || plan.artifactIntegrity === null ? true : plan.targetVersion !== null && await lockfileHasIntegrity(this.options.profile.runtime.dir, plan.packageName, plan.targetVersion, plan.artifactIntegrity);
			const githubSource = plan.sourceSpec?.startsWith("github:") === true || plan.sourceSpec?.startsWith("git+") === true;
			if (!(plan.action === "remove" ? row === void 0 || !row.directDependency : row !== void 0 && row.directDependency && row.bundle && row.version === plan.targetVersion && (!githubSource || row.requestedSpec === plan.sourceSpec) && integrityValid)) {
				const rollback = await this.rollback(backups, true, plan, mutationState, dependencies);
				return snapshotResult(this.options.profile, plan.action, "post-install-validation-failed", plan.packageName, false, rollback, result.output);
			}
			const composition = await this.runCommand([
				"--profile",
				this.options.profile.runtime.profileName,
				"--dump-config"
			], this.options.profile.runtime.dir, this.timeoutMs);
			if (composition.unavailable || composition.timedOut || composition.code !== 0) {
				const rollback = await this.rollback(backups, true, plan, mutationState, dependencies);
				return snapshotResult(this.options.profile, plan.action, "composition-validation-failed", plan.packageName, false, rollback, composition.output ?? result.output);
			}
			if (plan.action === "remove") {
				if (await backupFilesChanged(mutationState)) {
					preserveDependencyBackup(dependencies);
					return snapshotResult(this.options.profile, plan.action, "profile-changed-during-removal", plan.packageName, false, "failed", "The profile changed outside this operation while removal was being validated; the changed state was left untouched.");
				}
				return snapshotResult(this.options.profile, plan.action, "succeeded", plan.packageName, true, "not-needed", result.output);
			}
			let canary;
			try {
				canary = await this.runIsolatedActivation(plan.packageName, plan.targetVersion);
			} catch (error) {
				const rollback = await this.rollback(backups, true, plan, mutationState, dependencies);
				return snapshotResult(this.options.profile, plan.action, "canary-preparation-failed", plan.packageName, false, rollback, errorMessage(error), "failed");
			}
			if (canary.status !== "passed") {
				const rollback = await this.rollback(backups, true, plan, mutationState, dependencies);
				const detail = canary.detail === null ? null : redactProcessOutput(canary.detail);
				const cleanup = canary.code === "canary-shutdown-failed" ? "failed" : "succeeded";
				return snapshotResult(this.options.profile, plan.action, canary.code, plan.packageName, false, rollback, detail, "failed", cleanup);
			}
			if (await backupFilesChanged(mutationState)) {
				preserveDependencyBackup(dependencies);
				return snapshotResult(this.options.profile, plan.action, "profile-changed-during-canary", plan.packageName, false, "failed", "The profile changed outside this operation while the isolated canary was running; the tested snapshot was not accepted.", "failed", "succeeded");
			}
			const finalRow = (await this.options.profile.list("zh", false)).find((row$1) => row$1.packageName === plan.packageName);
			if (finalRow === void 0 || finalRow.version !== plan.targetVersion || !requestedSpecMatchesPlan(finalRow.requestedSpec, plan)) {
				preserveDependencyBackup(dependencies);
				return snapshotResult(this.options.profile, plan.action, "profile-changed-during-canary", plan.packageName, false, "failed", null, "failed", "succeeded");
			}
			return snapshotResult(this.options.profile, plan.action, "succeeded", plan.packageName, true, "not-needed", result.output, "passed", "succeeded");
		} catch (error) {
			const rollback = await this.rollback(backups, true, plan, mutationState, dependencies);
			return snapshotResult(this.options.profile, plan.action, "post-install-validation-failed", plan.packageName, false, rollback, errorMessage(error));
		}
	}
	async runIsolatedActivation(packageName, expectedVersion) {
		const descriptor = await this.options.profile.activationDescriptor(packageName);
		return this.probeActivation({
			profileDir: this.options.profile.runtime.dir,
			profileName: this.options.profile.runtime.profileName,
			dshBin: this.options.dshBin,
			packageName,
			expectedVersion,
			targets: descriptor.targets,
			configurationTargets: descriptor.configurationTargets,
			configurationOnly: descriptor.configurationOnly,
			timeoutMs: this.canaryTimeoutMs
		});
	}
	async rollbackActivation(backups) {
		try {
			if (await this.rollback(backups, false) === "failed") return "failed";
			const validation = await this.runCommand([
				"--profile",
				this.options.profile.runtime.profileName,
				"--dump-config"
			], this.options.profile.runtime.dir, this.timeoutMs);
			return validation.code === 0 && !validation.unavailable && !validation.timedOut ? "succeeded" : "failed";
		} catch {
			return "failed";
		}
	}
	async rollbackStateMatches(plan) {
		const row = (await this.options.profile.list("zh", false)).find((item) => item.packageName === plan.packageName);
		if (plan.action === "install") return row === void 0 || !row.directDependency;
		if (plan.action !== "update" && plan.action !== "remove") return true;
		return row !== void 0 && row.directDependency && row.bundle && row.version === plan.currentVersion && row.requestedSpec === plan.currentSpec;
	}
	async rollback(backups, repairPackages = true, plan, expectedCurrent, dependencies = null, metadataNoopSafe = false) {
		const failed = () => {
			preserveDependencyBackup(dependencies);
			return "failed";
		};
		try {
			const metadataChanged = await backupFilesChanged(backups);
			if (!metadataChanged && (!repairPackages || metadataNoopSafe)) return "not-needed";
			if (expectedCurrent !== void 0 && await backupFilesChanged(expectedCurrent)) return failed();
			if (metadataChanged) await restoreFiles(backups);
			if (!repairPackages) return "succeeded";
			let dependenciesRestored = false;
			if (dependencies !== null) dependenciesRestored = await restoreDependencies(this.options.profile.runtime.dir, dependencies);
			if (!dependenciesRestored) {
				const hasLockfile = backups.some((file) => file.path.endsWith("pnpm-lock.yaml") && file.content !== null);
				const installArgs = [
					"plugin",
					"--profile",
					this.options.profile.runtime.profileName,
					"install",
					"--force",
					"--package-import-method=copy"
				];
				if (hasLockfile) installArgs.push("--frozen-lockfile");
				installArgs.push("--ignore-scripts");
				const repair = await this.runCommand(installArgs, this.options.profile.runtime.dir, this.timeoutMs);
				if (repair.code !== 0 || repair.unavailable || repair.timedOut) return failed();
			}
			const composition = await this.runCommand([
				"--profile",
				this.options.profile.runtime.profileName,
				"--dump-config"
			], this.options.profile.runtime.dir, this.timeoutMs);
			if (composition.code !== 0 || composition.unavailable || composition.timedOut) return failed();
			if (await backupFilesChanged(backups)) return failed();
			if (plan !== void 0 && !await this.rollbackStateMatches(plan)) return failed();
			if (plan !== void 0 && (plan.action === "update" || plan.action === "remove")) {
				if (plan.packageName === null || plan.currentVersion === null) return failed();
				if ((await this.runIsolatedActivation(plan.packageName, plan.currentVersion)).status !== "passed") return failed();
			}
			return "succeeded";
		} catch {
			return failed();
		}
	}
	prunePlans() {
		const now = this.now();
		for (const [id, stored] of this.plans) if (Date.parse(stored.plan.expiresAt ?? "") <= now) this.plans.delete(id);
	}
	async close() {
		this.disposed = true;
		this.plans.clear();
		await this.operation;
	}
};

//#endregion
//#region src/index.ts
const name = "plugin-console";
const inject = ["webServer", "loader"];
const Config = z.object({
	catalogUrl: z.string().default("https://awesome-dsh-plugin.com/plugins.json"),
	cacheMaxAgeMs: z.natural().min(6e4).default(1728e5),
	requestTimeoutMs: z.natural().min(1e3).default(15e3),
	maxCatalogBytes: z.natural().min(1024).default(5e6),
	maxReadmeBytes: z.natural().min(1024).default(262144),
	operationTimeoutMs: z.natural().min(1e4).default(3e5),
	canaryTimeoutMs: z.natural().min(5e3).default(6e4),
	dshBin: z.string().default("dsh")
});
const API_PATH = "/api/plugin-console";
const MAX_BODY_BYTES = 64 * 1024;
var ApiFailure = class extends Error {
	constructor(status, code, message) {
		super(message);
		this.status = status;
		this.code = code;
		this.name = "ApiFailure";
	}
};
function locale(value) {
	return value === "en" ? "en" : "zh";
}
function listRequest(value) {
	if (!isRecord(value)) return {
		query: "",
		category: "all",
		page: 1,
		pageSize: 24
	};
	const query = typeof value.query === "string" ? value.query : "";
	const category = typeof value.category === "string" ? value.category : "all";
	const page = typeof value.page === "number" && Number.isSafeInteger(value.page) ? value.page : 1;
	const pageSize = typeof value.pageSize === "number" && Number.isSafeInteger(value.pageSize) ? value.pageSize : 24;
	if (query.length > 256 || category.length > 64 || page < 1 || pageSize < 1 || pageSize > 50) throw new ApiFailure(400, "request-invalid", "Invalid catalog list request.");
	return {
		query,
		category,
		page,
		pageSize
	};
}
function planRequest(value) {
	if (!isRecord(value) || value.action !== "install" && value.action !== "update" && value.action !== "remove" && value.action !== "pause" && value.action !== "resume") throw new ApiFailure(400, "request-invalid", "Invalid operation action.");
	const catalogId = value.catalogId === void 0 ? void 0 : typeof value.catalogId === "string" ? value.catalogId : null;
	const packageName = value.packageName === void 0 ? void 0 : typeof value.packageName === "string" ? value.packageName : null;
	if (catalogId === null || packageName === null || catalogId === void 0 && packageName === void 0) throw new ApiFailure(400, "request-invalid", "An operation target is required.");
	return {
		action: value.action,
		...catalogId === void 0 ? {} : { catalogId },
		...packageName === void 0 ? {} : { packageName }
	};
}
function executeRequest(value) {
	if (!isRecord(value) || typeof value.planId !== "string" || value.planId.length < 16 || value.planId.length > 128) throw new ApiFailure(400, "request-invalid", "Invalid operation plan.");
	return value.planId;
}
async function readJson(req) {
	if (!req.headers["content-type"]?.toLocaleLowerCase().startsWith("application/json")) throw new ApiFailure(415, "content-type-invalid", "Expected application/json.");
	const chunks = [];
	let total = 0;
	for await (const chunk of req) {
		const buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
		total += buffer.byteLength;
		if (total > MAX_BODY_BYTES) {
			req.resume();
			throw new ApiFailure(413, "request-too-large", "Request body is too large.");
		}
		chunks.push(buffer);
	}
	let parsed;
	try {
		parsed = JSON.parse(Buffer.concat(chunks).toString("utf8"));
	} catch {
		throw new ApiFailure(400, "json-invalid", "Request body is not valid JSON.");
	}
	if (!isRecord(parsed)) throw new ApiFailure(400, "request-invalid", "Request body must be an object.");
	return parsed;
}
function verifySameOrigin(req) {
	const host = req.headers.host;
	const origin = req.headers.origin;
	const fetchSite = req.headers["sec-fetch-site"];
	if (fetchSite !== void 0 && fetchSite !== "same-origin" && fetchSite !== "same-site" && fetchSite !== "none") throw new ApiFailure(403, "origin-denied", "Only same-origin WebUI requests are accepted.");
	if (host === void 0 || origin === void 0) throw new ApiFailure(403, "origin-denied", "Only same-origin WebUI requests are accepted.");
	let url;
	try {
		url = new URL(origin);
	} catch {
		throw new ApiFailure(403, "origin-denied", "Only same-origin WebUI requests are accepted.");
	}
	if (url.protocol !== "http:" && url.protocol !== "https:" || url.host !== host) throw new ApiFailure(403, "origin-denied", "Only same-origin WebUI requests are accepted.");
}
function verifyLoopback(req) {
	const address = req.socket.remoteAddress ?? "";
	if (address !== "127.0.0.1" && address !== "::1" && !address.startsWith("::ffff:127.")) throw new ApiFailure(403, "mutation-local-only", "Plugin mutations are available only from the loopback WebUI.");
}
function sendJson(res, status, value) {
	const body = `${JSON.stringify(value)}\n`;
	res.writeHead(status, {
		"cache-control": "no-store",
		"content-type": "application/json; charset=utf-8",
		"content-length": Buffer.byteLength(body),
		"x-content-type-options": "nosniff"
	});
	res.end(body);
}
/** Resolve the profile path from the Loader's own base URL, never from client input. */
function profileDir(ctx) {
	if (ctx.baseUrl === void 0 || !ctx.baseUrl.startsWith("file:")) throw new Error("dsh-plugin-console requires a file-backed profile Loader baseUrl.");
	const profilesRoot = resolve(dshHomePath("profiles"));
	const dir = resolve(fileURLToPath(ctx.baseUrl));
	const child = relative(profilesRoot, dir);
	if (child.length === 0 || child.startsWith("..") || isAbsolute(child)) throw new Error("dsh-plugin-console can manage only the active profile under $DSH_HOME/profiles.");
	return dir;
}
/** Mount the manager against only the active profile. */
async function apply(ctx, config) {
	let catalogUrl;
	try {
		catalogUrl = new URL(config.catalogUrl);
	} catch {
		throw new Error("dsh-plugin-console catalogUrl must be an absolute HTTPS URL.");
	}
	if (catalogUrl.protocol !== "https:") throw new Error("dsh-plugin-console catalogUrl must use HTTPS.");
	if (config.dshBin.trim().length === 0 || config.dshBin.includes("\0")) throw new Error("dsh-plugin-console dshBin is invalid.");
	const catalog = new PluginCatalog({
		sourceUrl: catalogUrl.href,
		cachePath: dshHomePath("cache", "plugin-console", "catalog.json"),
		maxAgeMs: config.cacheMaxAgeMs,
		timeoutMs: config.requestTimeoutMs,
		maxCatalogBytes: config.maxCatalogBytes,
		maxReadmeBytes: config.maxReadmeBytes
	});
	await catalog.initialize();
	const manager = new ProfileManager({
		ctx,
		profileDir: profileDir(ctx),
		dshBin: config.dshBin,
		catalog,
		maxReadmeBytes: config.maxReadmeBytes
	});
	const operations = new ProfileOperations({
		profile: manager,
		catalog,
		dshBin: config.dshBin,
		timeoutMs: config.operationTimeoutMs,
		canaryTimeoutMs: config.canaryTimeoutMs
	});
	const disposeRoute = ctx.webServer.register({
		kind: "exact",
		path: API_PATH,
		handler: async (req, res) => {
			try {
				if (req.method !== "POST") {
					res.setHeader("allow", "POST");
					throw new ApiFailure(405, "method-not-allowed", "Use POST for the manager API.");
				}
				verifySameOrigin(req);
				const body = await readJson(req);
				const method = body.method;
				const params = body.params;
				let value;
				switch (method) {
					case "bootstrap": {
						const request = listRequest(params);
						if (catalog.status().state === "unavailable" || catalog.status().stale) await catalog.refresh();
						value = {
							catalog: catalog.list(request),
							installed: await manager.list(locale(isRecord(params) ? params.locale : void 0)),
							capabilities: await manager.capabilities()
						};
						break;
					}
					case "catalog/list":
						value = catalog.list(listRequest(params));
						break;
					case "catalog/refresh":
						await catalog.refresh();
						value = catalog.list(listRequest(isRecord(params) ? params.request : void 0));
						break;
					case "catalog/detail":
						if (!isRecord(params) || typeof params.id !== "string") throw new ApiFailure(400, "request-invalid", "Catalog id is required.");
						value = await catalog.detail(params.id, locale(params.locale));
						break;
					case "installed/list":
						value = await manager.list(locale(isRecord(params) ? params.locale : void 0));
						break;
					case "installed/detail":
						if (!isRecord(params) || typeof params.packageName !== "string") throw new ApiFailure(400, "request-invalid", "Package name is required.");
						value = await manager.detail(params.packageName, locale(params.locale));
						break;
					case "capabilities":
						value = await manager.capabilities();
						break;
					case "plan":
						verifyLoopback(req);
						value = await operations.plan(planRequest(params));
						break;
					case "execute":
						verifyLoopback(req);
						value = await operations.execute(executeRequest(params));
						break;
					default: throw new ApiFailure(404, "method-unknown", "Unknown manager API method.");
				}
				sendJson(res, 200, {
					ok: true,
					value
				});
			} catch (error) {
				const failure = error instanceof ApiFailure ? error : new ApiFailure(500, "request-failed", "The manager request could not be completed.");
				ctx.logger.warn(error instanceof Error ? error : new Error(errorMessage(error)));
				sendJson(res, failure.status, {
					ok: false,
					error: {
						code: failure.code,
						message: failure.message
					}
				});
			}
		}
	});
	ctx.effect(() => disposeRoute, "plugin-console.api");
	ctx.effect(() => async () => {
		await operations.close();
		await manager.close();
		await catalog.close();
	}, "plugin-console.close");
}
var src_default = {
	name,
	inject,
	apply,
	Config
};

//#endregion
export { Config, PluginCatalog, ProfileManager, ProfileOperations, apply, src_default as default, inject, name, parseCatalogText, queryCatalog, runActivationCanary };
//# sourceMappingURL=index.js.map