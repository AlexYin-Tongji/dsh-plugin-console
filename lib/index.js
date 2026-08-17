import { createRequire } from "node:module";
import { basename, dirname, isAbsolute, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { dshHomePath } from "@deepseek-ai/dsh-home-paths";
import z from "@deepseek-ai/schemastery";
import { access, constants, mkdir, open, readFile, rename, rm, writeFile } from "node:fs/promises";
import semver from "semver";
import { createHash, randomUUID } from "node:crypto";
import { readFileSync } from "node:fs";
import { spawn } from "node:child_process";
import { readProfileManifest } from "@deepseek-ai/dsh-app-boot";
import { parse } from "yaml";

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
	const owner = parts[0];
	const repo = parts[1];
	if (owner === void 0 || repo === void 0 || !/^[\w.-]+$/.test(owner) || !/^[\w.-]+$/.test(repo)) return null;
	return `${owner}/${repo}`;
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
	const [owner = "", repo = ""] = repository.fullName.split("/");
	const name$1 = stringValue(value.name) ?? repo;
	const description = readDescription(value.description);
	if (name$1.length > 160 || owner.length === 0 || repo.length === 0 || (stringValue(value.category)?.length ?? 0) > 64 || description.zh.length > 4e3 || description.en.length > 4e3) return null;
	const npm = stringValue(value.npm);
	const packageName = npm !== null && validNpmPackageName(npm) ? npm : null;
	const stars = typeof value.stars === "number" && Number.isSafeInteger(value.stars) && value.stars >= 0 ? value.stars : 0;
	return {
		id: repository.fullName.toLowerCase(),
		name: name$1,
		owner,
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
function bundlePatchPath(value) {
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
	const bundle = bundlePatchPath(value) !== null;
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
	const candidates = locale$1 === "zh" ? [
		"README.zh.md",
		"README.zh-CN.md",
		"README.md"
	] : ["README.md", "README.en.md"];
	for (const file of candidates) {
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
		const patchPath = bundlePatchPath(packageValue);
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
//#region src/profile.ts
const PACKAGE_NAME$1 = /^[a-z0-9][a-z0-9._~-]*$/i;
const SCOPED_PACKAGE_NAME = /^@[a-z0-9][a-z0-9._~-]*\/[a-z0-9][a-z0-9._~-]*$/i;
const MAX_PACKAGE_JSON_BYTES = 512e3;
const NPM_TIMEOUT_MS = 8e3;
const NPM_CACHE_MS = 300 * 1e3;
const LIFECYCLE_SCRIPT_NAMES = [
	"preinstall",
	"install",
	"postinstall",
	"prepare"
];
function packageNameValid(name$1) {
	return name$1.length <= 214 && (PACKAGE_NAME$1.test(name$1) || SCOPED_PACKAGE_NAME.test(name$1));
}
function packagePath(profileDir$1, packageName) {
	return join(profileDir$1, "node_modules", ...packageName.split("/"), "package.json");
}
function pathWithin(path, root) {
	const child = relative(resolve(root), resolve(path));
	return child.length === 0 || !child.startsWith("..") && !isAbsolute(child);
}
async function readPackageJson(profileDir$1, packageName) {
	if (!packageNameValid(packageName)) return null;
	const paths = [packagePath(profileDir$1, packageName)];
	try {
		const resolved = createRequire(join(profileDir$1, "package.json")).resolve(`${packageName}/package.json`);
		if (pathWithin(resolved, join(profileDir$1, "node_modules")) || pathWithin(resolved, join(dirname(profileDir$1), "node_modules"))) paths.push(resolved);
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
function isBundle(value) {
	return isRecord(value) && isRecord(value.bundle) && typeof value.bundle.patch === "string";
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
function runtimeEntries(ctx, packageName) {
	const entries = [];
	for (const entry of ctx.loader.entries()) {
		if (entry.options.group || entry.options.name !== packageName) continue;
		entries.push({
			entryId: entry.id,
			enabled: !entry.disabled,
			phase: entry.fiber === void 0 ? null : runtimePhase(entry.fiber.state)
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
		const value = await response.json();
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
	const names = locale$1 === "zh" ? [
		"README.zh.md",
		"README.zh-CN.md",
		"README.md"
	] : ["README.md", "README.en.md"];
	for (const name$1 of names) try {
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
async function writable(path) {
	try {
		await access(path, constants.W_OK);
		return true;
	} catch {
		return false;
	}
}
async function commandAvailable(command$1) {
	return new Promise((resolve$1) => {
		const child = spawn(command$1, ["--version"], { stdio: [
			"ignore",
			"ignore",
			"ignore"
		] });
		const timer = setTimeout(() => {
			child.kill("SIGTERM");
			resolve$1(false);
		}, 5e3);
		child.once("error", () => {
			clearTimeout(timer);
			resolve$1(false);
		});
		child.once("exit", (code) => {
			clearTimeout(timer);
			resolve$1(code === 0);
		});
	});
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
			writable(join(this.runtime.dir, "package.json")),
			writable(join(this.runtime.dir, "pnpm-workspace.yaml"))
		]).then((values) => values.every(Boolean));
		const dshAvailable = await commandAvailable(this.dshBin);
		return {
			profileName: this.runtime.profileName,
			profileWritable,
			dshAvailable,
			busy: this.busy,
			message: !profileWritable ? "The active DSH profile is not writable." : !dshAvailable ? `Cannot execute ${this.dshBin}; install DSH or configure dshBin.` : null
		};
	}
	fingerprint() {
		const hash = createHash("sha256");
		for (const filename of [
			"package.json",
			"pnpm-lock.yaml",
			"pnpm-workspace.yaml"
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
		return await mapWithConcurrency([...new Set([...Object.keys(dependencies), ...bundles])].filter(packageNameValid).sort(), 4, async (packageName) => {
			const requestedSpec = dependencies[packageName] ?? null;
			const packageData = await readPackageJson(this.runtime.dir, packageName);
			const dsh = packageData === null ? null : packageDsh(packageData.value);
			const bundle = dsh !== null && isBundle(dsh);
			const client = dsh !== null && isWebClient(dsh);
			const activeAtLaunch = this.runtime.launchBundles.includes(packageName);
			const activeAfterRestart = bundles.includes(packageName);
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
				state: launchState(requestedSpec, activeAtLaunch, activeAfterRestart, this.runtime.launchDependencies[packageName]),
				runtimeEntries: runtimeEntries(this.ctx, packageName),
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
	async currentManifest() {
		return readProfileManifest("dsh-plugin-console", this.runtime.dir);
	}
	async close() {
		this.latestCache.clear();
	}
};

//#endregion
//#region src/operations.ts
const PLAN_TTL_MS = 300 * 1e3;
const MAX_OUTPUT_CHARS = 24e3;
const PACKAGE_NAME = /^(?:[a-z0-9][a-z0-9._~-]*|@[a-z0-9][a-z0-9._~-]*\/[a-z0-9][a-z0-9._~-]*)$/i;
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
function snapshotResult(profile, action, code, packageName, restartRequired, rollback, detail) {
	return Promise.all([profile.list("zh", false), profile.capabilities()]).then(([installed, capabilities]) => ({
		status: code === "succeeded" ? "succeeded" : "failed",
		code,
		action,
		packageName,
		restartRequired,
		rollback,
		detail,
		installed,
		capabilities
	}));
}
function command(executable, args, cwd, timeoutMs) {
	return new Promise((resolve$1) => {
		let output = "";
		let timedOut = false;
		let settled = false;
		const child = spawn(executable, [...args], {
			cwd,
			shell: false,
			env: { ...process.env },
			stdio: [
				"ignore",
				"pipe",
				"pipe"
			]
		});
		const append = (chunk) => {
			output += chunk.toString("utf8");
			if (output.length > MAX_OUTPUT_CHARS) output = output.slice(-MAX_OUTPUT_CHARS);
		};
		child.stdout?.on("data", append);
		child.stderr?.on("data", append);
		const timer = setTimeout(() => {
			timedOut = true;
			child.kill("SIGTERM");
			setTimeout(() => {
				if (!settled) child.kill("SIGKILL");
			}, 5e3);
		}, timeoutMs);
		const finish = (result) => {
			if (settled) return;
			settled = true;
			clearTimeout(timer);
			resolve$1({
				...result,
				output: redactProcessOutput(output)
			});
		};
		child.once("error", (error) => finish({
			code: 1,
			unavailable: error.code === "ENOENT",
			timedOut,
			output: null
		}));
		child.once("exit", (code) => finish({
			code,
			unavailable: false,
			timedOut,
			output: null
		}));
	});
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
async function restoreFiles(files) {
	for (const file of files) if (file.content === null) await rm(file.path, { force: true });
	else await writeFile(file.path, file.content, {
		encoding: "utf8",
		mode: 384
	});
}
async function lockfileHasIntegrity(profileDir$1, packageName, version, integrity) {
	try {
		const value = parse(await readFile(join(profileDir$1, "pnpm-lock.yaml"), "utf8"));
		if (!isRecord(value) || !isRecord(value.packages)) return false;
		const prefix = `${packageName}@${version}`;
		return Object.entries(value.packages).some(([key, entry]) => {
			if (key !== prefix && !key.startsWith(`${prefix}(`)) return false;
			return isRecord(entry) && isRecord(entry.resolution) && entry.resolution.integrity === integrity;
		});
	} catch {
		return false;
	}
}
function warningList(detail, action) {
	const warnings = [];
	if (action !== "remove") {
		warnings.push("trusted-code", "restart-required", "scripts-disabled");
		if (detail.warnings.includes("dsh-compatibility-not-declared")) warnings.push("compatibility-unknown");
	} else warnings.push("remove-data-kept");
	return warnings;
}
/** Owns one mutation at a time and never exposes arbitrary package-manager args. */
var ProfileOperations = class {
	plans = /* @__PURE__ */ new Map();
	runCommand;
	now;
	timeoutMs;
	operation = null;
	disposed = false;
	constructor(options) {
		this.options = options;
		this.runCommand = options.runCommand ?? ((args, cwd, timeoutMs) => command(options.dshBin, args, cwd, timeoutMs));
		this.now = options.now ?? (() => Date.now());
		this.timeoutMs = options.timeoutMs ?? 300 * 1e3;
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
		if (!capabilities.dshAvailable) return emptyPlan(this.options.profile.runtime.profileName, request.action, "dsh-command-unavailable");
		const installed = await this.options.profile.list("zh", false);
		let packageName = request.packageName ?? null;
		let catalogId = request.catalogId ?? null;
		let currentVersion = null;
		let targetVersion = null;
		let sourceSpec = null;
		let artifactIntegrity = null;
		let lifecycleScripts$1 = [];
		let detail = null;
		if (request.action === "remove") {
			if (packageName === null || !validPackageName(packageName)) return emptyPlan(this.options.profile.runtime.profileName, request.action, "package-name-invalid");
			const row$1 = installed.find((item) => item.packageName === packageName);
			if (row$1 === void 0) return emptyPlan(this.options.profile.runtime.profileName, request.action, "package-not-installed", packageName);
			if (!row$1.directDependency) return emptyPlan(this.options.profile.runtime.profileName, request.action, "system-package-protected", packageName);
			if (row$1.state === "pending-removal" || row$1.state === "pending-install" || row$1.state === "pending-update") return emptyPlan(this.options.profile.runtime.profileName, request.action, "restart-required-before-next-change", packageName);
			currentVersion = row$1.version;
			catalogId = row$1.catalogId;
			const warnings = warningList({ warnings: [] }, request.action);
			if (packageName === "dsh-plugin-console") warnings.push("self-removal");
			return this.storePlan({
				action: request.action,
				catalogId,
				packageName,
				currentVersion,
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
			if (artifact !== null && (row.repositoryUrl === null || row.repositoryUrl.toLocaleLowerCase() !== artifact.repositoryUrl.toLocaleLowerCase())) return emptyPlan(this.options.profile.runtime.profileName, request.action, "artifact-repository-mismatch", resolvedPackageName, catalogId);
			currentVersion = row.version;
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
		const operation = this.prepareAndRun(plan).then((result) => ({
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
	async prepareAndRun(plan) {
		if (!await this.planStillTargetsCurrentState(plan)) return snapshotResult(this.options.profile, plan.action, "plan-state-changed", plan.packageName, false, "not-needed", null);
		let backups;
		try {
			backups = await Promise.all([
				backupFile(join(this.options.profile.runtime.dir, "package.json")),
				backupFile(join(this.options.profile.runtime.dir, "pnpm-lock.yaml")),
				backupFile(join(this.options.profile.runtime.dir, "pnpm-workspace.yaml"))
			]);
		} catch (error) {
			return snapshotResult(this.options.profile, plan.action, "backup-failed", plan.packageName, false, "not-needed", errorMessage(error));
		}
		return this.runPlan(plan, backups);
	}
	async planStillTargetsCurrentState(plan) {
		if (plan.action === "remove") {
			const row$1 = (await this.options.profile.list("zh", false)).find((item) => item.packageName === plan.packageName);
			return row$1 !== void 0 && row$1.directDependency && row$1.version === plan.currentVersion;
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
		return row !== void 0 && row.directDependency && row.version === plan.currentVersion;
	}
	async runPlan(plan, backups) {
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
		const result = await this.runCommand(args, this.options.profile.runtime.dir, this.timeoutMs);
		if (result.unavailable) {
			const rollback = await this.rollback(backups);
			return snapshotResult(this.options.profile, plan.action, "dsh-command-indeterminate", plan.packageName, false, rollback, result.output);
		}
		if (result.timedOut) {
			const rollback = await this.rollback(backups);
			return snapshotResult(this.options.profile, plan.action, "operation-timeout", plan.packageName, false, rollback, result.output);
		}
		if (result.code !== 0) {
			const rollback = await this.rollback(backups);
			return snapshotResult(this.options.profile, plan.action, "dsh-command-failed", plan.packageName, false, rollback, result.output);
		}
		const row = (await this.options.profile.list("zh", false)).find((item) => item.packageName === plan.packageName);
		const integrityValid = plan.action === "remove" || plan.artifactIntegrity === null ? true : plan.targetVersion !== null && await lockfileHasIntegrity(this.options.profile.runtime.dir, plan.packageName, plan.targetVersion, plan.artifactIntegrity);
		if (!(plan.action === "remove" ? row === void 0 || !row.directDependency : row !== void 0 && row.directDependency && row.bundle && row.version === plan.targetVersion && integrityValid)) {
			const rollback = await this.rollback(backups);
			return snapshotResult(this.options.profile, plan.action, "post-install-validation-failed", plan.packageName, false, rollback, result.output);
		}
		const composition = await this.runCommand([
			"--profile",
			this.options.profile.runtime.profileName,
			"--dump-config"
		], this.options.profile.runtime.dir, this.timeoutMs);
		if (composition.unavailable || composition.timedOut || composition.code !== 0) {
			const rollback = await this.rollback(backups);
			return snapshotResult(this.options.profile, plan.action, "composition-validation-failed", plan.packageName, false, rollback, composition.output ?? result.output);
		}
		return snapshotResult(this.options.profile, plan.action, "succeeded", plan.packageName, true, "not-needed", result.output);
	}
	async rollback(backups) {
		try {
			await restoreFiles(backups);
			await rm(join(this.options.profile.runtime.dir, "node_modules"), {
				recursive: true,
				force: true
			});
			const hasLockfile = backups.some((file) => file.path.endsWith("pnpm-lock.yaml") && file.content !== null);
			const installArgs = [
				"plugin",
				"--profile",
				this.options.profile.runtime.profileName,
				"install"
			];
			if (hasLockfile) installArgs.push("--frozen-lockfile");
			installArgs.push("--ignore-scripts");
			const repair = await this.runCommand(installArgs, this.options.profile.runtime.dir, this.timeoutMs);
			return repair.code === 0 && !repair.unavailable && !repair.timedOut ? "succeeded" : "failed";
		} catch {
			return "failed";
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
	if (!isRecord(value) || value.action !== "install" && value.action !== "update" && value.action !== "remove") throw new ApiFailure(400, "request-invalid", "Invalid operation action.");
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
		timeoutMs: config.operationTimeoutMs
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
export { Config, PluginCatalog, ProfileManager, ProfileOperations, apply, src_default as default, inject, name, parseCatalogText, queryCatalog };
//# sourceMappingURL=index.js.map