window.__ModuleLoader__.load({ id: "dsh-plugin-console", factory: (require) => {
var module = { exports: {} }; var exports = module.exports;
//#region rolldown:runtime
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
	if (from && typeof from === "object" || typeof from === "function") for (var keys = __getOwnPropNames(from), i = 0, n = keys.length, key; i < n; i++) {
		key = keys[i];
		if (!__hasOwnProp.call(to, key) && key !== except) __defProp(to, key, {
			get: ((k) => from[k]).bind(null, key),
			enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable
		});
	}
	return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", {
	value: mod,
	enumerable: true
}) : target, mod));

//#endregion
let react = require("react");
react = __toESM(react);
let __deepseek_ai_dsh_client_ui_primitives = require("@deepseek-ai/dsh-client-ui-primitives");
__deepseek_ai_dsh_client_ui_primitives = __toESM(__deepseek_ai_dsh_client_ui_primitives);
let react_jsx_runtime = require("react/jsx-runtime");
react_jsx_runtime = __toESM(react_jsx_runtime);

//#region \0plugin-console-css:src/client/PluginManageSettingsTab.module.css.mjs
const css = ".gHlwVW_section{width:100%;min-width:0;max-width:880px;color:var(--dsw-alias-label-primary);flex-direction:column;gap:12px;display:flex}.gHlwVW_header,.gHlwVW_viewTabs,.gHlwVW_toolbar,.gHlwVW_listHeader,.gHlwVW_row,.gHlwVW_rowOpen,.gHlwVW_rowActions,.gHlwVW_iconActions,.gHlwVW_detailHeader,.gHlwVW_detailActionRow,.gHlwVW_detailFacts,.gHlwVW_pagination,.gHlwVW_modalHeader,.gHlwVW_modalActions,.gHlwVW_checkRow{align-items:center;display:flex}.gHlwVW_header{justify-content:space-between;gap:12px}.gHlwVW_header h3,.gHlwVW_header p,.gHlwVW_detailTitle h3,.gHlwVW_detailTitle p,.gHlwVW_detailDescription,.gHlwVW_readmeHeading h4,.gHlwVW_readmeHeading span,.gHlwVW_modal h3,.gHlwVW_modalLead,.gHlwVW_warningList h4,.gHlwVW_status,.gHlwVW_failure,.gHlwVW_errorBanner,.gHlwVW_banner,.gHlwVW_stale,.gHlwVW_inlineWarnings,.gHlwVW_markdown p{margin:0}.gHlwVW_header h3{font-size:15px;font-weight:650;line-height:22px}.gHlwVW_header p,.gHlwVW_status,.gHlwVW_muted,.gHlwVW_listHeader,.gHlwVW_rowMeta,.gHlwVW_detailTitle p,.gHlwVW_readmeHeading span,.gHlwVW_stale,.gHlwVW_failure,.gHlwVW_errorBanner,.gHlwVW_banner,.gHlwVW_capability{color:var(--dsw-alias-label-tertiary);font-size:12px;line-height:18px}.gHlwVW_capability{border:1px solid var(--dsw-alias-border-l2);white-space:nowrap;border-radius:5px;padding:3px 7px}.gHlwVW_capability[data-ready=true]{border-color:color-mix(in srgb, var(--dsw-alias-state-success-primary) 45%, var(--dsw-alias-border-l2));color:var(--dsw-alias-state-success-primary)}.gHlwVW_viewTabs{border-bottom:1px solid var(--dsw-alias-border-l2);gap:2px}.gHlwVW_viewTab{color:var(--dsw-alias-label-tertiary);font:inherit;cursor:pointer;background:0 0;border:0;border-bottom:2px solid #0000;padding:6px 10px;font-size:13px;line-height:20px}.gHlwVW_viewTab:hover,.gHlwVW_viewTab[data-active=true]{color:var(--dsw-alias-label-primary)}.gHlwVW_viewTab[data-active=true]{border-bottom-color:var(--dsw-alias-state-business-primary);font-weight:600}.gHlwVW_tabCount{color:var(--dsw-alias-label-tertiary);font-variant-numeric:tabular-nums;font-size:11px}.gHlwVW_banner,.gHlwVW_errorBanner{border:1px solid var(--dsw-alias-border-l2);border-left:3px solid var(--dsw-alias-state-success-primary);background:var(--dsw-alias-bg-layer-1);justify-content:space-between;gap:10px;padding:8px 10px}.gHlwVW_errorBanner{border-left-color:var(--dsw-alias-state-error-primary);color:var(--dsw-alias-state-error-primary)}.gHlwVW_toolbar{flex-wrap:wrap;gap:8px}.gHlwVW_search{min-width:180px;color:var(--dsw-alias-label-tertiary);flex:240px;align-items:center;display:flex;position:relative}.gHlwVW_search>svg{pointer-events:none;position:absolute;left:11px}.gHlwVW_search input,.gHlwVW_selectLabel select{box-sizing:border-box;border:1px solid var(--dsw-alias-border-l2);background:var(--dsw-alias-bg-layer-1);height:36px;color:var(--dsw-alias-label-primary);font:inherit;border-radius:7px;outline:none;font-size:13px}.gHlwVW_search input{width:100%;padding:0 10px 0 34px}.gHlwVW_search input:focus-visible,.gHlwVW_selectLabel select:focus-visible{border-color:var(--dsw-alias-state-business-primary);box-shadow:0 0 0 2px color-mix(in srgb, var(--dsw-alias-state-business-primary) 18%, transparent)}.gHlwVW_selectLabel{color:var(--dsw-alias-label-tertiary);align-items:center;gap:6px;font-size:12px;display:inline-flex}.gHlwVW_selectLabel select{min-width:140px;padding:0 8px}.gHlwVW_iconButton,.gHlwVW_iconButtonDanger,.gHlwVW_ghostButton,.gHlwVW_primaryButton,.gHlwVW_dangerButton,.gHlwVW_backButton{border:1px solid var(--dsw-alias-border-l2);min-height:28px;color:var(--dsw-alias-label-secondary);font:inherit;cursor:pointer;background:0 0;border-radius:6px;justify-content:center;align-items:center;gap:5px;font-size:12px;line-height:18px;text-decoration:none;display:inline-flex}.gHlwVW_iconButton,.gHlwVW_iconButtonDanger{width:30px;min-width:30px;padding:0}.gHlwVW_ghostButton,.gHlwVW_primaryButton,.gHlwVW_dangerButton,.gHlwVW_backButton{padding:4px 9px}.gHlwVW_iconButton:hover,.gHlwVW_ghostButton:hover,.gHlwVW_backButton:hover{background:var(--dsw-alias-interactive-bg-hover);color:var(--dsw-alias-label-primary)}.gHlwVW_iconButtonDanger,.gHlwVW_dangerButton{border-color:color-mix(in srgb, var(--dsw-alias-state-error-primary) 45%, var(--dsw-alias-border-l2));color:var(--dsw-alias-state-error-primary)}.gHlwVW_iconButtonDanger:hover,.gHlwVW_dangerButton:hover{background:color-mix(in srgb, var(--dsw-alias-state-error-primary) 10%, transparent)}.gHlwVW_primaryButton{border-color:var(--dsw-alias-state-business-primary);background:var(--dsw-alias-state-business-primary);color:var(--dsw-alias-label-white,#fff)}.gHlwVW_primaryButton:hover{filter:brightness(1.08)}button:disabled{cursor:default;opacity:.48}.gHlwVW_listHeader{justify-content:space-between;gap:10px;min-height:22px}.gHlwVW_listHeader>span:first-child{color:var(--dsw-alias-label-secondary);font-variant-numeric:tabular-nums}.gHlwVW_list{border:1px solid var(--dsw-alias-border-l2);border-radius:8px;flex-direction:column;gap:1px;margin:0;padding:0;list-style:none;display:flex;overflow:hidden}.gHlwVW_row{background:var(--dsw-alias-bg-layer-1);justify-content:space-between;gap:10px;min-width:0;padding:11px 12px}.gHlwVW_row+.gHlwVW_row{border-top:1px solid var(--dsw-alias-border-l2)}.gHlwVW_row:hover{background:var(--dsw-alias-interactive-bg-hover)}.gHlwVW_rowOpen{min-width:0;color:inherit;font:inherit;text-align:left;cursor:pointer;background:0 0;border:0;flex:auto;justify-content:flex-start;gap:10px;padding:0}.gHlwVW_avatar,.gHlwVW_avatarFallback{border-radius:7px;flex:none;width:32px;height:32px}.gHlwVW_avatar{object-fit:cover}.gHlwVW_avatarFallback{background:var(--dsw-alias-bg-layer-3);color:var(--dsw-alias-label-secondary);justify-content:center;align-items:center;font-size:13px;font-weight:650;display:inline-flex}.gHlwVW_rowBody{flex-direction:column;flex:auto;gap:3px;min-width:0;display:flex}.gHlwVW_rowHeading{align-items:center;gap:7px;min-width:0;display:flex}.gHlwVW_rowHeading strong{text-overflow:ellipsis;white-space:nowrap;min-width:0;font-size:13px;line-height:19px;overflow:hidden}.gHlwVW_rowDescription{color:var(--dsw-alias-label-secondary);text-overflow:ellipsis;white-space:nowrap;font-size:12px;line-height:18px;overflow:hidden}.gHlwVW_rowMeta{font-variant-numeric:tabular-nums;flex-wrap:wrap;gap:4px 10px;display:flex}.gHlwVW_rowActions,.gHlwVW_iconActions{flex:none;gap:6px}.gHlwVW_categoryBadge,.gHlwVW_sourceBadge,.gHlwVW_stateBadge{border:1px solid var(--dsw-alias-border-l2);min-height:18px;color:var(--dsw-alias-label-tertiary);white-space:nowrap;border-radius:4px;align-items:center;padding:1px 5px;font-size:10px;line-height:15px;display:inline-flex}.gHlwVW_sourceBadge[data-kind=npm]{border-color:color-mix(in srgb, #cb3837 45%, var(--dsw-alias-border-l2));color:#c43a3a}.gHlwVW_sourceBadge[data-kind=github]{color:var(--dsw-alias-label-secondary)}.gHlwVW_stateBadge[data-state=active]{border-color:color-mix(in srgb, var(--dsw-alias-state-success-primary) 45%, var(--dsw-alias-border-l2));color:var(--dsw-alias-state-success-primary)}.gHlwVW_stateBadge[data-state^=pending]{border-color:color-mix(in srgb, var(--dsw-alias-state-warning-primary,#bc7a00) 45%, var(--dsw-alias-border-l2));color:var(--dsw-alias-state-warning-primary,#bc7a00)}.gHlwVW_updateMeta{color:var(--dsw-alias-state-business-primary)}.gHlwVW_pagination{color:var(--dsw-alias-label-tertiary);font-variant-numeric:tabular-nums;justify-content:center;gap:10px;font-size:12px}.gHlwVW_detail{border-top:1px solid var(--dsw-alias-border-l2);flex-direction:column;gap:13px;min-width:0;padding-top:12px;display:flex}.gHlwVW_backButton{border:0;align-self:flex-start;padding-left:0}.gHlwVW_detailHeader{gap:10px}.gHlwVW_detailHeader .gHlwVW_avatar,.gHlwVW_detailHeader .gHlwVW_avatarFallback{width:40px;height:40px}.gHlwVW_detailTitle{flex:auto;min-width:0}.gHlwVW_detailTitle h3{overflow-wrap:anywhere;font-size:16px;line-height:22px}.gHlwVW_detailDescription{color:var(--dsw-alias-label-secondary);font-size:13px;line-height:20px}.gHlwVW_detailFacts{color:var(--dsw-alias-label-tertiary);flex-wrap:wrap;gap:5px 12px;font-size:12px}.gHlwVW_verified{color:var(--dsw-alias-state-success-primary)}.gHlwVW_unverified{color:var(--dsw-alias-state-warning-primary,#bc7a00)}.gHlwVW_detailActionRow{flex-wrap:wrap;gap:8px}.gHlwVW_spec,.gHlwVW_breakable{overflow-wrap:anywhere;font-family:var(--ds-font-family-code);font-size:11px}.gHlwVW_spec{min-width:0;color:var(--dsw-alias-label-tertiary);flex:220px}.gHlwVW_metaGrid{border-top:1px solid var(--dsw-alias-border-l2);border-bottom:1px solid var(--dsw-alias-border-l2);grid-template-columns:100px minmax(0,1fr);gap:7px 10px;margin:0;padding:10px 0;display:grid}.gHlwVW_metaGrid div{display:contents}.gHlwVW_metaGrid dt{color:var(--dsw-alias-label-tertiary);font-size:11px;line-height:17px}.gHlwVW_metaGrid dd{min-width:0;color:var(--dsw-alias-label-secondary);margin:0;font-size:12px;line-height:17px}.gHlwVW_inlineWarnings{color:var(--dsw-alias-state-warning-primary,#bc7a00);padding-left:18px;font-size:12px;line-height:18px}.gHlwVW_readmeHeading{border-bottom:1px solid var(--dsw-alias-border-l2);justify-content:space-between;align-items:baseline;gap:10px;padding-bottom:6px;display:flex}.gHlwVW_readmeHeading h4{font-size:13px;line-height:20px}.gHlwVW_markdown{overflow-wrap:anywhere;min-width:0;color:var(--dsw-alias-label-secondary);font-size:13px;line-height:20px}.gHlwVW_markdown h1,.gHlwVW_markdown h2,.gHlwVW_markdown h3,.gHlwVW_markdown h4{color:var(--dsw-alias-label-primary);line-height:1.35}.gHlwVW_markdown h1{font-size:20px}.gHlwVW_markdown h2{font-size:17px}.gHlwVW_markdown h3{font-size:15px}.gHlwVW_markdown h4{font-size:13px}.gHlwVW_markdown pre{border:1px solid var(--dsw-alias-border-l2);background:var(--dsw-alias-bg-layer-1);font-family:var(--ds-font-family-code);border-radius:6px;padding:9px;font-size:11px;line-height:17px;overflow:auto}.gHlwVW_markdown code{font-family:var(--ds-font-family-code);font-size:.92em}.gHlwVW_markdown blockquote{border-left:3px solid var(--dsw-alias-border-l2);color:var(--dsw-alias-label-tertiary);margin-left:0;padding-left:10px}.gHlwVW_markdown table{border-collapse:collapse;max-width:100%;display:block;overflow:auto}.gHlwVW_markdown th,.gHlwVW_markdown td{border:1px solid var(--dsw-alias-border-l2);padding:5px 8px}.gHlwVW_modalBackdrop{z-index:1000;background:#00000073;justify-content:center;align-items:center;padding:18px;display:flex;position:fixed;inset:0}.gHlwVW_modal{border:1px solid var(--dsw-alias-border-l1);background:var(--dsw-alias-bg-layer-3);width:min(520px,100%);max-height:min(700px,90vh);box-shadow:var(--ds-shadow-lv3,0 12px 35px #00000040);border-radius:8px;padding:16px;overflow:auto}.gHlwVW_modalHeader{justify-content:space-between;gap:10px}.gHlwVW_modalHeader h3{font-size:15px;line-height:22px}.gHlwVW_modalLead{color:var(--dsw-alias-label-primary);margin-top:12px;font-size:14px;line-height:20px}.gHlwVW_warningList{border-left:3px solid var(--dsw-alias-state-warning-primary,#bc7a00);color:var(--dsw-alias-label-secondary);margin-top:12px;padding-left:10px;font-size:12px;line-height:19px}.gHlwVW_warningList h4{color:var(--dsw-alias-label-primary);font-size:12px}.gHlwVW_warningList ul{margin:5px 0 0;padding-left:17px}.gHlwVW_checkRow{color:var(--dsw-alias-label-secondary);align-items:flex-start;gap:8px;margin-top:14px;font-size:12px;line-height:18px}.gHlwVW_checkRow input{margin-top:2px}.gHlwVW_modalActions{justify-content:flex-end;gap:8px;margin-top:16px}.gHlwVW_failure{color:var(--dsw-alias-state-error-primary);flex-wrap:wrap;align-items:center;gap:8px;display:flex}.gHlwVW_visuallyHidden{clip:rect(0 0 0 0);clip-path:inset(50%);white-space:nowrap;width:1px;height:1px;position:absolute;overflow:hidden}@media (width<=680px){.gHlwVW_row{flex-direction:column;align-items:flex-start}.gHlwVW_rowActions,.gHlwVW_iconActions{align-self:flex-end}.gHlwVW_selectLabel{flex:150px}.gHlwVW_selectLabel select{flex:auto;min-width:0}.gHlwVW_metaGrid{grid-template-columns:86px minmax(0,1fr)}}@media (width<=380px){.gHlwVW_toolbar>.gHlwVW_search,.gHlwVW_toolbar>.gHlwVW_selectLabel,.gHlwVW_toolbar>.gHlwVW_iconButton{flex-basis:100%}.gHlwVW_search{min-width:0}.gHlwVW_selectLabel{justify-content:space-between}.gHlwVW_selectLabel select{max-width:65%}.gHlwVW_rowActions,.gHlwVW_iconActions{flex-wrap:wrap;justify-content:flex-end;width:100%}.gHlwVW_rowActions .gHlwVW_primaryButton,.gHlwVW_rowActions .gHlwVW_ghostButton,.gHlwVW_iconActions .gHlwVW_ghostButton{text-overflow:ellipsis;max-width:100%;overflow:hidden}}";
const tagId = "dsh-plugin-console/PluginManageSettingsTab.module.css";
if (document.querySelector("style[data-plugin-css=" + JSON.stringify(tagId) + "]") === null) {
	const tag = document.createElement("style");
	tag.dataset.plugin = "dsh-plugin-console";
	tag.dataset.pluginCss = tagId;
	tag.textContent = css;
	document.head.appendChild(tag);
}
var PluginManageSettingsTab_module_css_default = {
	"avatar": "gHlwVW_avatar",
	"avatarFallback": "gHlwVW_avatarFallback",
	"backButton": "gHlwVW_backButton",
	"banner": "gHlwVW_banner",
	"breakable": "gHlwVW_breakable",
	"capability": "gHlwVW_capability",
	"categoryBadge": "gHlwVW_categoryBadge",
	"checkRow": "gHlwVW_checkRow",
	"dangerButton": "gHlwVW_dangerButton",
	"detail": "gHlwVW_detail",
	"detailActionRow": "gHlwVW_detailActionRow",
	"detailDescription": "gHlwVW_detailDescription",
	"detailFacts": "gHlwVW_detailFacts",
	"detailHeader": "gHlwVW_detailHeader",
	"detailTitle": "gHlwVW_detailTitle",
	"errorBanner": "gHlwVW_errorBanner",
	"failure": "gHlwVW_failure",
	"ghostButton": "gHlwVW_ghostButton",
	"header": "gHlwVW_header",
	"iconActions": "gHlwVW_iconActions",
	"iconButton": "gHlwVW_iconButton",
	"iconButtonDanger": "gHlwVW_iconButtonDanger",
	"inlineWarnings": "gHlwVW_inlineWarnings",
	"list": "gHlwVW_list",
	"listHeader": "gHlwVW_listHeader",
	"markdown": "gHlwVW_markdown",
	"metaGrid": "gHlwVW_metaGrid",
	"modal": "gHlwVW_modal",
	"modalActions": "gHlwVW_modalActions",
	"modalBackdrop": "gHlwVW_modalBackdrop",
	"modalHeader": "gHlwVW_modalHeader",
	"modalLead": "gHlwVW_modalLead",
	"muted": "gHlwVW_muted",
	"pagination": "gHlwVW_pagination",
	"primaryButton": "gHlwVW_primaryButton",
	"readmeHeading": "gHlwVW_readmeHeading",
	"row": "gHlwVW_row",
	"rowActions": "gHlwVW_rowActions",
	"rowBody": "gHlwVW_rowBody",
	"rowDescription": "gHlwVW_rowDescription",
	"rowHeading": "gHlwVW_rowHeading",
	"rowMeta": "gHlwVW_rowMeta",
	"rowOpen": "gHlwVW_rowOpen",
	"search": "gHlwVW_search",
	"section": "gHlwVW_section",
	"selectLabel": "gHlwVW_selectLabel",
	"sourceBadge": "gHlwVW_sourceBadge",
	"spec": "gHlwVW_spec",
	"stale": "gHlwVW_stale",
	"stateBadge": "gHlwVW_stateBadge",
	"status": "gHlwVW_status",
	"tabCount": "gHlwVW_tabCount",
	"toolbar": "gHlwVW_toolbar",
	"unverified": "gHlwVW_unverified",
	"updateMeta": "gHlwVW_updateMeta",
	"verified": "gHlwVW_verified",
	"viewTab": "gHlwVW_viewTab",
	"viewTabs": "gHlwVW_viewTabs",
	"visuallyHidden": "gHlwVW_visuallyHidden",
	"warningList": "gHlwVW_warningList"
};

//#endregion
//#region src/client/PluginManageSettingsTab.tsx
const DEFAULT_REQUEST = {
	query: "",
	category: "all",
	page: 1,
	pageSize: 24
};
function languageOf(value) {
	return value.toLocaleLowerCase().startsWith("en") ? "en" : "zh";
}
function interpolate(template, values) {
	return Object.entries(values).reduce((text, [key, value]) => text.replaceAll(`{${key}}`, String(value)), template);
}
function formatStars(value, t) {
	return interpolate(t("stars", { count: value }), { count: value });
}
const CATEGORY_LABEL_KEYS = {
	ui: "category.ui",
	tools: "category.tools",
	tool: "category.tool",
	theme: "category.theme",
	memory: "category.memory",
	skill: "category.skill",
	model: "category.model",
	session: "category.session",
	workflow: "category.workflow",
	notify: "category.notify",
	dev: "category.dev",
	market: "category.market",
	vision: "category.vision",
	fun: "category.fun",
	other: "category.other",
	uncategorized: "category.uncategorized"
};
function categoryLabel(category, t) {
	const key = CATEGORY_LABEL_KEYS[category];
	return key === void 0 ? category : t(key);
}
function localizedDescription(description, language) {
	return description[language] || description[language === "zh" ? "en" : "zh"];
}
function statusLabel(state, t) {
	switch (state) {
		case "active": return t("active");
		case "installed-inactive": return t("inactive");
		case "pending-install": return t("pendingInstall");
		case "pending-update": return t("pendingUpdate");
		case "pending-removal": return t("pendingRemoval");
	}
}
function reasonLabel(reason, t) {
	switch (reason) {
		case "artifact-not-verified": return t("reasonNotVerified");
		case "already-installed": return t("reasonAlreadyInstalled");
		case "already-up-to-date": return t("reasonUpToDate");
		case "profile-not-writable": return t("reasonProfile");
		case "another-operation-is-running": return t("reasonBusy");
		case "dsh-command-unavailable": return t("reasonUnavailable");
		case "system-package-protected": return t("reasonProtected");
		case "package-not-installed": return t("reasonMissing");
		case "restart-required-before-next-change": return t("reasonRestart");
		case "profile-changed": return t("reasonChanged");
		case "artifact-repository-mismatch": return t("reasonRepository");
		case "installed-version-invalid": return t("reasonVersion");
		case "plan-state-changed": return t("reasonState");
		case "composition-validation-failed": return t("reasonState");
		default: return reason ?? t("reasonGeneric");
	}
}
function warningText(warning, t) {
	switch (warning) {
		case "trusted-code": return t("warningTrusted");
		case "restart-required": return t("warningRestart");
		case "scripts-disabled": return t("warningScripts");
		case "compatibility-unknown": return t("warningCompat");
		case "remove-data-kept": return t("warningData");
		case "self-removal": return t("warningSelf");
		case "uncatalogued-update": return t("warningUncatalogued");
	}
}
function artifactWarningText(signal, t) {
	switch (signal) {
		case "lifecycle-scripts-present": return t("artifactLifecycle");
		case "license-missing": return t("artifactLicense");
		case "package-deprecated": return t("artifactDeprecated");
		case "dsh-compatibility-not-declared": return t("artifactCompat");
		case "git-source": return t("artifactGit");
		case "registry-version-pinned": return t("artifactRegistry");
		default: return interpolate(t("artifactOther", { signal }), { signal });
	}
}
function OwnerAvatar({ owner, name }) {
	const [failed, setFailed] = (0, react.useState)(false);
	if (failed || !/^[A-Za-z0-9_.-]+$/.test(owner)) return /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
		className: PluginManageSettingsTab_module_css_default.avatarFallback,
		"aria-hidden": "true",
		children: name.trim().slice(0, 1).toUpperCase() || "?"
	});
	return /* @__PURE__ */ (0, react_jsx_runtime.jsx)("img", {
		className: PluginManageSettingsTab_module_css_default.avatar,
		src: `https://github.com/${encodeURIComponent(owner)}.png?size=64`,
		alt: "",
		loading: "lazy",
		referrerPolicy: "no-referrer",
		onError: () => {
			setFailed(true);
		}
	});
}
function SourceBadge({ item, t }) {
	return /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
		className: PluginManageSettingsTab_module_css_default.sourceBadge,
		"data-kind": item.artifactKind,
		children: item.artifactKind === "npm" ? t("npm") : t("github")
	});
}
function CatalogRow({ item, installed, language, t, onOpen, onInstall, working }) {
	const canInstall = installed === void 0 && !working;
	return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("li", {
		className: PluginManageSettingsTab_module_css_default.row,
		children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("button", {
			className: PluginManageSettingsTab_module_css_default.rowOpen,
			type: "button",
			onClick: onOpen,
			children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(OwnerAvatar, {
				owner: item.owner,
				name: item.name
			}), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
				className: PluginManageSettingsTab_module_css_default.rowBody,
				children: [
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
						className: PluginManageSettingsTab_module_css_default.rowHeading,
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("strong", {
							title: item.name,
							children: item.name
						}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
							className: PluginManageSettingsTab_module_css_default.categoryBadge,
							children: categoryLabel(item.category, t)
						})]
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
						className: PluginManageSettingsTab_module_css_default.rowDescription,
						children: localizedDescription(item.description, language) || item.repositoryUrl
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
						className: PluginManageSettingsTab_module_css_default.rowMeta,
						children: [
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)(SourceBadge, {
								item,
								t
							}),
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: formatStars(item.stars, t) }),
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: t("community") })
						]
					})
				]
			})]
		}), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
			className: PluginManageSettingsTab_module_css_default.rowActions,
			children: [installed !== void 0 ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
				className: PluginManageSettingsTab_module_css_default.stateBadge,
				"data-state": installed.state,
				children: statusLabel(installed.state, t)
			}) : null, installed === void 0 ? /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("button", {
				className: PluginManageSettingsTab_module_css_default.primaryButton,
				type: "button",
				disabled: !canInstall,
				onClick: onInstall,
				children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(__deepseek_ai_dsh_client_ui_primitives.IconDownloadOutline16, { "aria-hidden": "true" }), working ? t("installing") : t("install")]
			}) : /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
				className: PluginManageSettingsTab_module_css_default.ghostButton,
				type: "button",
				onClick: onOpen,
				children: t("details")
			})]
		})]
	});
}
function InstalledRow({ item, t, onOpen, onUpdate, onRemove, working }) {
	const pending = item.state.startsWith("pending-");
	const canUpdate = item.updateAvailable && !working && !pending && !item.system;
	const canRemove = item.directDependency && !item.system && !working && !pending;
	return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("li", {
		className: PluginManageSettingsTab_module_css_default.row,
		children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("button", {
			className: PluginManageSettingsTab_module_css_default.rowOpen,
			type: "button",
			onClick: onOpen,
			children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(OwnerAvatar, {
				owner: item.repositoryUrl?.split("/")[3] ?? "",
				name: item.packageName
			}), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
				className: PluginManageSettingsTab_module_css_default.rowBody,
				children: [
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
						className: PluginManageSettingsTab_module_css_default.rowHeading,
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("strong", {
							title: item.packageName,
							children: item.packageName
						}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
							className: PluginManageSettingsTab_module_css_default.stateBadge,
							"data-state": item.state,
							children: statusLabel(item.state, t)
						})]
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
						className: PluginManageSettingsTab_module_css_default.rowDescription,
						children: item.description ?? item.repositoryUrl ?? t("runtimeUnknown")
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
						className: PluginManageSettingsTab_module_css_default.rowMeta,
						children: [
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: item.version === null ? t("missingValue") : interpolate(t("versionValue", { version: item.version }), { version: item.version }) }),
							item.system ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: t("system") }) : /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: t("direct") }),
							item.bundle ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: t("bundleLayer") }) : null,
							item.client ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: t("clientLayer") }) : null,
							item.updateAvailable && item.latestVersion !== null ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
								className: PluginManageSettingsTab_module_css_default.updateMeta,
								children: interpolate(t("updateAvailable"), { version: item.latestVersion })
							}) : null
						]
					})
				]
			})]
		}), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
			className: PluginManageSettingsTab_module_css_default.iconActions,
			children: [
				canUpdate ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
					className: PluginManageSettingsTab_module_css_default.iconButton,
					type: "button",
					title: t("ariaUpdate"),
					"aria-label": t("ariaUpdate"),
					onClick: onUpdate,
					children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(__deepseek_ai_dsh_client_ui_primitives.IconRefreshOutline16, { "aria-hidden": "true" })
				}) : null,
				canRemove ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
					className: PluginManageSettingsTab_module_css_default.iconButtonDanger,
					type: "button",
					title: t("ariaRemove"),
					"aria-label": t("ariaRemove"),
					onClick: onRemove,
					children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(__deepseek_ai_dsh_client_ui_primitives.IconTrashOutline16, { "aria-hidden": "true" })
				}) : null,
				/* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
					className: PluginManageSettingsTab_module_css_default.ghostButton,
					type: "button",
					onClick: onOpen,
					children: t("details")
				})
			]
		})]
	});
}
function Markdown({ value }) {
	if (value === null || value.trim().length === 0) return null;
	return /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
		className: PluginManageSettingsTab_module_css_default.markdown,
		children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(__deepseek_ai_dsh_client_ui_primitives.MarkdownText, { text: value })
	});
}
function ReviewDialog({ review, t, working, onCancel, onConfirm }) {
	const [acknowledged, setAcknowledged] = (0, react.useState)(false);
	const closeRef = (0, react.useRef)(null);
	const modalRef = (0, react.useRef)(null);
	const titleId = (0, react.useId)();
	const requiresAck = review.plan.action !== "remove";
	(0, react.useEffect)(() => {
		closeRef.current?.focus();
		const onKeyDown = (event) => {
			if (event.key === "Escape" && !working) {
				event.preventDefault();
				onCancel();
				return;
			}
			if (event.key !== "Tab") return;
			const focusable = [...modalRef.current?.querySelectorAll("button, input, a[href]") ?? []].filter((element) => !element.hasAttribute("disabled") && element.tabIndex >= 0);
			if (focusable.length === 0) return;
			const first = focusable[0];
			const last = focusable[focusable.length - 1];
			if (event.shiftKey && document.activeElement === first) {
				event.preventDefault();
				last?.focus();
			} else if (!event.shiftKey && document.activeElement === last) {
				event.preventDefault();
				first?.focus();
			}
		};
		document.addEventListener("keydown", onKeyDown);
		return () => document.removeEventListener("keydown", onKeyDown);
	}, [
		onCancel,
		review.plan.planId,
		working
	]);
	(0, react.useEffect)(() => {
		setAcknowledged(false);
	}, [review.plan.planId]);
	return /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
		className: PluginManageSettingsTab_module_css_default.modalBackdrop,
		role: "presentation",
		children: /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
			ref: modalRef,
			className: PluginManageSettingsTab_module_css_default.modal,
			role: "dialog",
			"aria-modal": "true",
			"aria-labelledby": titleId,
			children: [
				/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
					className: PluginManageSettingsTab_module_css_default.modalHeader,
					children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("h3", {
						id: titleId,
						children: t("reviewTitle")
					}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
						ref: closeRef,
						className: PluginManageSettingsTab_module_css_default.iconButton,
						type: "button",
						title: t("close"),
						"aria-label": t("close"),
						onClick: onCancel,
						children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(__deepseek_ai_dsh_client_ui_primitives.IconCloseOutline16, { "aria-hidden": "true" })
					})]
				}),
				/* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
					className: PluginManageSettingsTab_module_css_default.modalLead,
					children: review.title
				}),
				/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("dl", {
					className: PluginManageSettingsTab_module_css_default.metaGrid,
					children: [
						/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("dt", { children: t("packageName") }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("dd", { children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("code", { children: review.plan.packageName ?? t("missingValue") }) })] }),
						/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("dt", { children: t("reviewTarget") }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("dd", { children: review.plan.targetVersion ?? review.plan.currentVersion ?? t("missingValue") })] }),
						/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("dt", { children: t("reviewSpec") }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("dd", { children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("code", {
							className: PluginManageSettingsTab_module_css_default.breakable,
							children: review.plan.sourceSpec ?? t("removeSpec")
						}) })] })
					]
				}),
				review.plan.warnings.length > 0 ? /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
					className: PluginManageSettingsTab_module_css_default.warningList,
					children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("h4", { children: t("reviewWarnings") }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("ul", { children: review.plan.warnings.map((warning) => /* @__PURE__ */ (0, react_jsx_runtime.jsx)("li", { children: warningText(warning, t) }, warning)) })]
				}) : null,
				requiresAck ? /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("label", {
					className: PluginManageSettingsTab_module_css_default.checkRow,
					children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("input", {
						type: "checkbox",
						checked: acknowledged,
						onChange: (event) => {
							setAcknowledged(event.currentTarget.checked);
						}
					}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: t("acknowledge") })]
				}) : null,
				/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
					className: PluginManageSettingsTab_module_css_default.modalActions,
					children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
						className: PluginManageSettingsTab_module_css_default.ghostButton,
						type: "button",
						disabled: working,
						onClick: onCancel,
						children: t("cancel")
					}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
						className: review.plan.action === "remove" ? PluginManageSettingsTab_module_css_default.dangerButton : PluginManageSettingsTab_module_css_default.primaryButton,
						type: "button",
						disabled: working || requiresAck && !acknowledged,
						onClick: onConfirm,
						children: working ? t(review.plan.action === "install" ? "installing" : review.plan.action === "update" ? "updating" : "removing") : t("confirm")
					})]
				})
			]
		})
	});
}
function CatalogDetailView({ detail, language, t, working, onBack, onInstall }) {
	const description = localizedDescription(detail.description, language);
	return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("section", {
		className: PluginManageSettingsTab_module_css_default.detail,
		children: [
			/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("button", {
				className: PluginManageSettingsTab_module_css_default.backButton,
				type: "button",
				onClick: onBack,
				children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(__deepseek_ai_dsh_client_ui_primitives.IconChevronLeftOutline14, { "aria-hidden": "true" }), t("back")]
			}),
			/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				className: PluginManageSettingsTab_module_css_default.detailHeader,
				children: [
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)(OwnerAvatar, {
						owner: detail.owner,
						name: detail.name
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						className: PluginManageSettingsTab_module_css_default.detailTitle,
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("h3", { children: detail.name }), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("p", { children: [
							detail.owner,
							t("separator"),
							categoryLabel(detail.category, t)
						] })]
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("a", {
						className: PluginManageSettingsTab_module_css_default.iconButton,
						href: detail.repositoryUrl,
						target: "_blank",
						rel: "noreferrer noopener",
						title: t("openRepository"),
						"aria-label": t("openRepository"),
						children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(__deepseek_ai_dsh_client_ui_primitives.IconRightUpOutline14, { "aria-hidden": "true" })
					})
				]
			}),
			description ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
				className: PluginManageSettingsTab_module_css_default.detailDescription,
				children: description
			}) : null,
			/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				className: PluginManageSettingsTab_module_css_default.detailFacts,
				children: [
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: detail.artifactKind === "npm" ? t("npm") : t("github") }),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: formatStars(detail.stars, t) }),
					detail.verification === "verified" ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
						className: PluginManageSettingsTab_module_css_default.verified,
						children: t("verified")
					}) : /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
						className: PluginManageSettingsTab_module_css_default.unverified,
						children: detail.verificationMessage ?? t("unverified")
					})
				]
			}),
			detail.verification === "verified" && detail.installSpec !== null ? /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				className: PluginManageSettingsTab_module_css_default.detailActionRow,
				children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("code", {
					className: PluginManageSettingsTab_module_css_default.spec,
					children: detail.installSpec
				}), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("button", {
					className: PluginManageSettingsTab_module_css_default.primaryButton,
					type: "button",
					disabled: working,
					onClick: onInstall,
					children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(__deepseek_ai_dsh_client_ui_primitives.IconDownloadOutline16, { "aria-hidden": "true" }), working ? t("installing") : t("install")]
				})]
			}) : null,
			detail.manifest !== null ? /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("dl", {
				className: PluginManageSettingsTab_module_css_default.metaGrid,
				children: [
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("dt", { children: t("packageName") }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("dd", { children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("code", { children: detail.manifest.packageName }) })] }),
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("dt", { children: t("version") }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("dd", { children: detail.manifest.version })] }),
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("dt", { children: t("license") }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("dd", { children: detail.manifest.license ?? t("missingValue") })] }),
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("dt", { children: t("clientLayer") }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("dd", { children: detail.manifest.client ? t("verified") : t("missingValue") })] })
				]
			}) : null,
			detail.warnings.length > 0 ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("ul", {
				className: PluginManageSettingsTab_module_css_default.inlineWarnings,
				children: detail.warnings.map((warning) => /* @__PURE__ */ (0, react_jsx_runtime.jsx)("li", { children: artifactWarningText(warning, t) }, warning))
			}) : null,
			/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				className: PluginManageSettingsTab_module_css_default.readmeHeading,
				children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("h4", { children: t("usage") }), detail.readmeSource ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: interpolate(t("readmeSource"), { source: detail.readmeSource }) }) : null]
			}),
			detail.readme === null ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
				className: PluginManageSettingsTab_module_css_default.muted,
				children: t("noReadme")
			}) : /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Markdown, { value: detail.readme })
		]
	});
}
function InstalledDetailView({ detail, t, working, onBack, onUpdate, onRemove }) {
	return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("section", {
		className: PluginManageSettingsTab_module_css_default.detail,
		children: [
			/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("button", {
				className: PluginManageSettingsTab_module_css_default.backButton,
				type: "button",
				onClick: onBack,
				children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(__deepseek_ai_dsh_client_ui_primitives.IconChevronLeftOutline14, { "aria-hidden": "true" }), t("back")]
			}),
			/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				className: PluginManageSettingsTab_module_css_default.detailHeader,
				children: [
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)(OwnerAvatar, {
						owner: detail.repositoryUrl?.split("/")[3] ?? "",
						name: detail.packageName
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						className: PluginManageSettingsTab_module_css_default.detailTitle,
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("h3", { children: detail.packageName }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", { children: statusLabel(detail.state, t) })]
					}),
					detail.repositoryUrl ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("a", {
						className: PluginManageSettingsTab_module_css_default.iconButton,
						href: detail.repositoryUrl,
						target: "_blank",
						rel: "noreferrer noopener",
						title: t("openRepository"),
						"aria-label": t("openRepository"),
						children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(__deepseek_ai_dsh_client_ui_primitives.IconRightUpOutline14, { "aria-hidden": "true" })
					}) : null
				]
			}),
			detail.description ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
				className: PluginManageSettingsTab_module_css_default.detailDescription,
				children: detail.description
			}) : null,
			/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("dl", {
				className: PluginManageSettingsTab_module_css_default.metaGrid,
				children: [
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("dt", { children: t("version") }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("dd", { children: detail.version ?? t("missingValue") })] }),
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("dt", { children: t("source") }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("dd", { children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("code", {
						className: PluginManageSettingsTab_module_css_default.breakable,
						children: detail.requestedSpec ?? t("missingValue")
					}) })] }),
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("dt", { children: t("bundleLayer") }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("dd", { children: detail.activeAfterRestart ? t("verified") : t("inactive") })] }),
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("dt", { children: t("runtime") }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("dd", { children: detail.runtimeEntries.length === 0 ? t("runtimeUnknown") : detail.runtimeEntries.map((entry) => interpolate(t("runtimeEntry", {
						id: entry.entryId,
						phase: entry.phase ?? t("missingValue")
					}), {
						id: entry.entryId,
						phase: entry.phase ?? t("missingValue")
					})).join(t("separator")) })] })
				]
			}),
			/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				className: PluginManageSettingsTab_module_css_default.detailActionRow,
				children: [
					detail.updateAvailable ? /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("button", {
						className: PluginManageSettingsTab_module_css_default.primaryButton,
						type: "button",
						disabled: working,
						onClick: onUpdate,
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(__deepseek_ai_dsh_client_ui_primitives.IconRefreshOutline16, { "aria-hidden": "true" }), working ? t("updating") : t("update")]
					}) : null,
					!detail.system && detail.directDependency ? /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("button", {
						className: PluginManageSettingsTab_module_css_default.dangerButton,
						type: "button",
						disabled: working,
						onClick: onRemove,
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(__deepseek_ai_dsh_client_ui_primitives.IconTrashOutline16, { "aria-hidden": "true" }), working ? t("removing") : t("remove")]
					}) : null,
					detail.updateCheckError ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
						className: PluginManageSettingsTab_module_css_default.muted,
						children: t("checkFailed")
					}) : null
				]
			}),
			/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				className: PluginManageSettingsTab_module_css_default.readmeHeading,
				children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("h4", { children: t("usage") }), detail.readmeFile ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: detail.readmeFile }) : null]
			}),
			detail.readme === null ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
				className: PluginManageSettingsTab_module_css_default.muted,
				children: t("noReadme")
			}) : /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Markdown, { value: detail.readme })
		]
	});
}
function PluginManageSettingsTab({ api, locale, t }) {
	const [view, setView] = (0, react.useState)("store");
	const [catalog, setCatalog] = (0, react.useState)(null);
	const [installed, setInstalled] = (0, react.useState)([]);
	const [capabilities, setCapabilities] = (0, react.useState)(null);
	const [load, setLoad] = (0, react.useState)({ status: "loading" });
	const [query, setQuery] = (0, react.useState)("");
	const [category, setCategory] = (0, react.useState)("all");
	const [page, setPage] = (0, react.useState)(1);
	const [selection, setSelection] = (0, react.useState)(null);
	const [detail, setDetail] = (0, react.useState)({ status: "idle" });
	const [review, setReview] = (0, react.useState)(null);
	const [working, setWorking] = (0, react.useState)(false);
	const [banner, setBanner] = (0, react.useState)(null);
	const [operationError, setOperationError] = (0, react.useState)(null);
	const [reload, setReload] = (0, react.useState)(0);
	const alive = (0, react.useRef)(true);
	const requestSequence = (0, react.useRef)(0);
	const operationSequence = (0, react.useRef)(0);
	const language = languageOf(locale());
	(0, react.useEffect)(() => {
		alive.current = true;
		return () => {
			alive.current = false;
		};
	}, []);
	const request = (0, react.useMemo)(() => ({
		query,
		category,
		page,
		pageSize: 24
	}), [
		category,
		page,
		query
	]);
	const loadBootstrap = () => {
		const sequence = ++requestSequence.current;
		setLoad({ status: "loading" });
		api.bootstrap(DEFAULT_REQUEST, language).then((value) => {
			if (!alive.current || sequence !== requestSequence.current) return;
			setCatalog(value.catalog);
			setInstalled(value.installed);
			setCapabilities(value.capabilities);
			setLoad({ status: "ready" });
		}).catch((error) => {
			if (!alive.current || sequence !== requestSequence.current) return;
			setLoad({
				status: "error",
				message: error instanceof Error ? error.message : String(error)
			});
		});
	};
	(0, react.useEffect)(() => {
		loadBootstrap();
	}, [language, reload]);
	(0, react.useEffect)(() => {
		if (load.status !== "ready") return;
		let live = true;
		const sequence = ++requestSequence.current;
		const timer = setTimeout(() => {
			api.listCatalog(request).then((value) => {
				if (live && alive.current && sequence === requestSequence.current) setCatalog(value);
			}).catch(() => void 0);
		}, 180);
		return () => {
			live = false;
			clearTimeout(timer);
		};
	}, [
		category,
		load.status,
		page,
		query,
		request
	]);
	(0, react.useEffect)(() => {
		if (selection === null) {
			setDetail({ status: "idle" });
			return;
		}
		let live = true;
		setDetail({ status: "loading" });
		(selection.kind === "store" ? api.catalogDetail(selection.id, language) : api.installedDetail(selection.packageName, language)).then((value) => {
			if (!live || !alive.current) return;
			setDetail(value === null ? {
				status: "missing",
				message: null
			} : {
				status: "ready",
				value
			});
		}).catch((error) => {
			if (live && alive.current) setDetail({
				status: "error",
				message: error instanceof Error ? error.message : String(error)
			});
		});
		return () => {
			live = false;
		};
	}, [language, selection]);
	const installedByCatalog = (0, react.useMemo)(() => new Map(installed.flatMap((item) => item.catalogId === null ? [] : [[item.catalogId, item]])), [installed]);
	const categories = catalog?.categories ?? [];
	const pages = catalog === null ? 1 : Math.max(1, Math.ceil(catalog.total / catalog.pageSize));
	const openStore = (id) => {
		setView("store");
		setSelection({
			kind: "store",
			id
		});
		setOperationError(null);
	};
	const openInstalled = (packageName) => {
		setView("installed");
		setSelection({
			kind: "installed",
			packageName
		});
		setOperationError(null);
	};
	const closeDetail = () => {
		setSelection(null);
		setOperationError(null);
	};
	const startPlan = (requestToPlan, title) => {
		const sequence = ++operationSequence.current;
		setWorking(true);
		setOperationError(null);
		api.plan(requestToPlan).then((plan) => {
			if (!alive.current || sequence !== operationSequence.current) return;
			if (plan.status === "blocked") setOperationError(interpolate(t("blocked", { reason: "" }), { reason: reasonLabel(plan.blockReason, t) }));
			else setReview({
				plan,
				title
			});
		}).catch((error) => {
			if (!alive.current || sequence !== operationSequence.current) return;
			setOperationError(interpolate(t("operationFailed", { message: "" }), { message: error instanceof Error ? error.message : String(error) }));
		}).finally(() => {
			if (alive.current && sequence === operationSequence.current) setWorking(false);
		});
	};
	const confirmPlan = () => {
		if (review?.plan.planId === null || review?.plan.planId === void 0) return;
		const sequence = ++operationSequence.current;
		const planId = review.plan.planId;
		setWorking(true);
		api.execute(planId).then((result) => {
			if (!alive.current || sequence !== operationSequence.current) return;
			setInstalled(result.installed);
			setCapabilities(result.capabilities);
			setReview(null);
			if (result.status === "succeeded") {
				setBanner(t("restartBanner"));
				setSelection(null);
			} else setOperationError(interpolate(t("operationFailed", { message: "" }), { message: result.detail ?? result.code }));
		}).catch((error) => {
			if (!alive.current || sequence !== operationSequence.current) return;
			setOperationError(interpolate(t("operationFailed", { message: "" }), { message: error instanceof Error ? error.message : String(error) }));
		}).finally(() => {
			if (alive.current && sequence === operationSequence.current) setWorking(false);
		});
	};
	const refresh = () => {
		const sequence = ++operationSequence.current;
		const requestId = ++requestSequence.current;
		setWorking(true);
		api.refreshCatalog(request).then((value) => {
			if (alive.current && sequence === operationSequence.current && requestId === requestSequence.current) setCatalog(value);
		}).catch((error) => {
			if (alive.current && sequence === operationSequence.current) setOperationError(interpolate(t("catalogError", { message: "" }), { message: error instanceof Error ? error.message : String(error) }));
		}).finally(() => {
			if (alive.current && sequence === operationSequence.current) setWorking(false);
		});
	};
	const detailReady = detail.status === "ready" ? detail.value : null;
	const storeDetail = detailReady !== null && "verification" in detailReady ? detailReady : null;
	const installedDetail = detailReady !== null && "readmeFile" in detailReady ? detailReady : null;
	return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
		className: PluginManageSettingsTab_module_css_default.section,
		"aria-busy": load.status === "loading" || working,
		children: [
			/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("header", {
				className: PluginManageSettingsTab_module_css_default.header,
				children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("h3", { children: t("store") }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", { children: capabilities === null ? t("loading") : interpolate(t("profile", { name: capabilities.profileName }), { name: capabilities.profileName }) })] }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
					className: PluginManageSettingsTab_module_css_default.capability,
					"data-ready": capabilities?.profileWritable && capabilities.dshAvailable ? "true" : "false",
					children: capabilities?.profileWritable && capabilities.dshAvailable ? t("dshReady") : capabilities === null ? t("loading") : t("dshMissing")
				})]
			}),
			/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				className: PluginManageSettingsTab_module_css_default.viewTabs,
				"aria-label": t("tab"),
				children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
					className: PluginManageSettingsTab_module_css_default.viewTab,
					type: "button",
					"aria-pressed": view === "store",
					"data-active": view === "store" ? "true" : void 0,
					onClick: () => {
						setView("store");
						setSelection(null);
					},
					children: t("store")
				}), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("button", {
					className: PluginManageSettingsTab_module_css_default.viewTab,
					type: "button",
					"aria-pressed": view === "installed",
					"data-active": view === "installed" ? "true" : void 0,
					onClick: () => {
						setView("installed");
						setSelection(null);
					},
					children: [
						t("installed"),
						" ",
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
							className: PluginManageSettingsTab_module_css_default.tabCount,
							children: installed.length
						})
					]
				})]
			}),
			banner ? /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				className: PluginManageSettingsTab_module_css_default.banner,
				role: "status",
				children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: banner }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
					className: PluginManageSettingsTab_module_css_default.iconButton,
					type: "button",
					title: t("close"),
					"aria-label": t("close"),
					onClick: () => setBanner(null),
					children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(__deepseek_ai_dsh_client_ui_primitives.IconCloseOutline16, { "aria-hidden": "true" })
				})]
			}) : null,
			operationError ? /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				className: PluginManageSettingsTab_module_css_default.errorBanner,
				role: "alert",
				children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: operationError }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
					className: PluginManageSettingsTab_module_css_default.iconButton,
					type: "button",
					title: t("close"),
					"aria-label": t("close"),
					onClick: () => setOperationError(null),
					children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(__deepseek_ai_dsh_client_ui_primitives.IconCloseOutline16, { "aria-hidden": "true" })
				})]
			}) : null,
			load.status === "loading" ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
				className: PluginManageSettingsTab_module_css_default.status,
				children: t("loading")
			}) : null,
			load.status === "error" ? /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				className: PluginManageSettingsTab_module_css_default.failure,
				role: "alert",
				children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: load.message ?? t("error") }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
					className: PluginManageSettingsTab_module_css_default.ghostButton,
					type: "button",
					onClick: () => setReload((value) => value + 1),
					children: t("retry")
				})]
			}) : null,
			selection !== null ? detail.status === "loading" ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
				className: PluginManageSettingsTab_module_css_default.status,
				children: t("loading")
			}) : detail.status === "error" ? /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				className: PluginManageSettingsTab_module_css_default.failure,
				children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: detail.message ?? t("error") }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
					className: PluginManageSettingsTab_module_css_default.ghostButton,
					type: "button",
					onClick: () => setSelection({ ...selection }),
					children: t("retry")
				})]
			}) : detail.status === "ready" && storeDetail !== null ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)(CatalogDetailView, {
				detail: storeDetail,
				language,
				t,
				working,
				onBack: closeDetail,
				onInstall: () => startPlan({
					action: "install",
					catalogId: storeDetail.id
				}, t("reviewInstall"))
			}) : detail.status === "ready" && installedDetail !== null ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)(InstalledDetailView, {
				detail: installedDetail,
				t,
				working,
				onBack: closeDetail,
				onUpdate: () => installedDetail.catalogId !== null ? startPlan({
					action: "update",
					catalogId: installedDetail.catalogId,
					packageName: installedDetail.packageName
				}, t("reviewUpdate")) : startPlan({
					action: "update",
					packageName: installedDetail.packageName
				}, t("reviewUpdate")),
				onRemove: () => startPlan({
					action: "remove",
					packageName: installedDetail.packageName
				}, t("reviewRemove"))
			}) : /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
				className: PluginManageSettingsTab_module_css_default.status,
				children: t("error")
			}) : view === "store" ? /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("section", {
				className: PluginManageSettingsTab_module_css_default.catalogView,
				"aria-label": t("ariaStore"),
				children: [
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						className: PluginManageSettingsTab_module_css_default.toolbar,
						children: [
							/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("label", {
								className: PluginManageSettingsTab_module_css_default.search,
								children: [
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)(__deepseek_ai_dsh_client_ui_primitives.IconSearchOutline16, { "aria-hidden": "true" }),
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
										className: PluginManageSettingsTab_module_css_default.visuallyHidden,
										children: t("ariaSearch")
									}),
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("input", {
										type: "search",
										value: query,
										placeholder: t("search"),
										"aria-label": t("ariaSearch"),
										onChange: (event) => {
											setQuery(event.currentTarget.value);
											setPage(1);
										}
									})
								]
							}),
							/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("label", {
								className: PluginManageSettingsTab_module_css_default.selectLabel,
								children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: t("category") }), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("select", {
									value: category,
									onChange: (event) => {
										setCategory(event.currentTarget.value);
										setPage(1);
									},
									children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("option", {
										value: "all",
										children: t("allCategories")
									}), categories.map((item) => /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("option", {
										value: item.id,
										children: [
											categoryLabel(item.id, t),
											" (",
											item.count,
											")"
										]
									}, item.id))]
								})]
							}),
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
								className: PluginManageSettingsTab_module_css_default.iconButton,
								type: "button",
								disabled: working,
								title: t("ariaRefresh"),
								"aria-label": t("ariaRefresh"),
								onClick: refresh,
								children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(__deepseek_ai_dsh_client_ui_primitives.IconRefreshOutline16, { "aria-hidden": "true" })
							})
						]
					}),
					catalog?.status.stale ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
						className: PluginManageSettingsTab_module_css_default.stale,
						children: t("stale")
					}) : null,
					catalog?.status.state === "unavailable" ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
						className: PluginManageSettingsTab_module_css_default.status,
						children: t("catalogUnavailable")
					}) : null,
					catalog !== null && catalog.items.length === 0 && catalog.status.state !== "unavailable" ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
						className: PluginManageSettingsTab_module_css_default.status,
						children: t("catalogEmpty")
					}) : null,
					catalog !== null && catalog.items.length > 0 ? /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, { children: [
						/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
							className: PluginManageSettingsTab_module_css_default.listHeader,
							children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: interpolate(t("catalogCount", { count: catalog.total }), { count: catalog.total }) }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: catalog.status.source === "network" ? t("sourceNetwork") : catalog.status.source === "cache" ? t("sourceCache") : t("sourceNone") })]
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)("ul", {
							className: PluginManageSettingsTab_module_css_default.list,
							children: catalog.items.map((item) => /* @__PURE__ */ (0, react_jsx_runtime.jsx)(CatalogRow, {
								item,
								installed: installedByCatalog.get(item.id),
								language,
								t,
								onOpen: () => openStore(item.id),
								onInstall: () => startPlan({
									action: "install",
									catalogId: item.id
								}, t("reviewInstall")),
								working
							}, item.id))
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)(Pagination, {
							page: catalog.page,
							pages,
							t,
							onPage: setPage
						})
					] }) : null
				]
			}) : /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("section", {
				className: PluginManageSettingsTab_module_css_default.catalogView,
				"aria-label": t("ariaInstalled"),
				children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
					className: PluginManageSettingsTab_module_css_default.listHeader,
					children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: interpolate(t("installedCount", { count: installed.length }), { count: installed.length }) }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
						className: PluginManageSettingsTab_module_css_default.ghostButton,
						type: "button",
						disabled: working,
						onClick: () => setReload((value) => value + 1),
						children: t("refresh")
					})]
				}), installed.length === 0 ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
					className: PluginManageSettingsTab_module_css_default.status,
					children: t("noPlugins")
				}) : /* @__PURE__ */ (0, react_jsx_runtime.jsx)("ul", {
					className: PluginManageSettingsTab_module_css_default.list,
					children: installed.map((item) => /* @__PURE__ */ (0, react_jsx_runtime.jsx)(InstalledRow, {
						item,
						t,
						onOpen: () => openInstalled(item.packageName),
						onUpdate: () => item.catalogId !== null ? startPlan({
							action: "update",
							catalogId: item.catalogId,
							packageName: item.packageName
						}, t("reviewUpdate")) : startPlan({
							action: "update",
							packageName: item.packageName
						}, t("reviewUpdate")),
						onRemove: () => startPlan({
							action: "remove",
							packageName: item.packageName
						}, t("reviewRemove")),
						working
					}, item.packageName))
				})]
			}),
			review !== null ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)(ReviewDialog, {
				review,
				t,
				working,
				onCancel: () => setReview(null),
				onConfirm: confirmPlan
			}) : null
		]
	});
}
function Pagination({ page, pages, t, onPage }) {
	if (pages <= 1) return null;
	return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("nav", {
		className: PluginManageSettingsTab_module_css_default.pagination,
		"aria-label": t("page", {
			page,
			pages
		}),
		children: [
			/* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
				className: PluginManageSettingsTab_module_css_default.iconButton,
				type: "button",
				disabled: page <= 1,
				title: t("previous"),
				"aria-label": t("previous"),
				onClick: () => onPage(page - 1),
				children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(__deepseek_ai_dsh_client_ui_primitives.IconChevronLeftOutline14, { "aria-hidden": "true" })
			}),
			/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: interpolate(t("page", {
				page,
				pages
			}), {
				page,
				pages
			}) }),
			/* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
				className: PluginManageSettingsTab_module_css_default.iconButton,
				type: "button",
				disabled: page >= pages,
				title: t("next"),
				"aria-label": t("next"),
				onClick: () => onPage(page + 1),
				children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(__deepseek_ai_dsh_client_ui_primitives.IconChevronRightOutline14, { "aria-hidden": "true" })
			})
		]
	});
}

//#endregion
//#region src/client/api.ts
async function call(method, params) {
	const response = await fetch("/api/plugin-console", {
		method: "POST",
		credentials: "same-origin",
		headers: { "content-type": "application/json" },
		body: JSON.stringify({
			method,
			...params === void 0 ? {} : { params }
		})
	});
	const result = await response.json();
	if (!response.ok || !result.ok) {
		const message = result.ok ? `HTTP ${String(response.status)}` : result.error.message;
		throw new Error(message);
	}
	return result.value;
}
function createPluginManageApi() {
	return {
		bootstrap: (request, locale) => call("bootstrap", {
			...request,
			locale
		}),
		listCatalog: (request) => call("catalog/list", request),
		refreshCatalog: (request) => call("catalog/refresh", { request }),
		catalogDetail: (id, locale) => call("catalog/detail", {
			id,
			locale
		}),
		installed: (locale) => call("installed/list", { locale }),
		installedDetail: (packageName, locale) => call("installed/detail", {
			packageName,
			locale
		}),
		capabilities: () => call("capabilities"),
		plan: (request) => call("plan", request),
		execute: (planId) => call("execute", { planId })
	};
}

//#endregion
//#region src/client/locales.ts
const zh = {
	tab: "管理",
	store: "插件商店",
	installed: "已安装",
	search: "搜索社区插件",
	category: "分类",
	allCategories: "全部",
	"category.ui": "UI",
	"category.tools": "工具",
	"category.tool": "工具",
	"category.theme": "主题",
	"category.memory": "记忆",
	"category.skill": "技能",
	"category.model": "模型",
	"category.session": "会话",
	"category.workflow": "工作流",
	"category.notify": "通知",
	"category.dev": "开发",
	"category.market": "市场",
	"category.vision": "视觉",
	"category.fun": "娱乐",
	"category.other": "其他",
	"category.uncategorized": "未分类",
	refresh: "同步目录",
	refreshing: "同步中…",
	sourceNetwork: "社区目录",
	sourceCache: "本地缓存",
	sourceNone: "尚未同步",
	stale: "目录已过期",
	catalogCount: "{count} 个结果",
	catalogEmpty: "没有匹配的插件",
	catalogUnavailable: "目录暂时不可用，请先同步或检查网络。",
	catalogError: "目录同步失败：{message}",
	previous: "上一页",
	next: "下一页",
	page: "第 {page} / {pages} 页",
	stars: "{count} stars",
	community: "社区",
	npm: "npm",
	github: "GitHub 源码",
	verified: "已验证",
	verifying: "验证中…",
	unverified: "无法验证",
	install: "安装",
	installing: "安装中…",
	update: "更新",
	updating: "更新中…",
	remove: "删除",
	removing: "删除中…",
	openRepository: "打开仓库",
	details: "插件详情",
	usage: "使用说明",
	noReadme: "该插件没有随包发布 README。",
	readmeSource: "文档来源：{source}",
	packageName: "包名",
	version: "版本",
	author: "作者",
	license: "许可证",
	source: "安装来源",
	bundleLayer: "Bundle 层",
	clientLayer: "Web 客户端",
	runtime: "运行状态",
	active: "已生效",
	inactive: "未进入 Bundle 层",
	pendingInstall: "待重启启用",
	pendingUpdate: "待重启更新",
	pendingRemoval: "待重启删除",
	system: "系统组件",
	direct: "直接依赖",
	noPlugins: "当前 profile 没有可管理的外部插件。",
	updateAvailable: "有新版本 {version}",
	latest: "已是最新",
	checkFailed: "版本检查失败",
	runtimeUnknown: "未观测到 Loader 条目",
	missingValue: "—",
	versionValue: "v{version}",
	removeSpec: "pnpm remove",
	runtimeEntry: "{id}: {phase}",
	separator: " · ",
	restartBanner: "变更已写入当前 profile，重启 DSH 后生效。",
	operationFailed: "操作失败：{message}",
	operationOutput: "命令输出",
	retry: "重试",
	close: "关闭",
	back: "返回列表",
	reviewTitle: "确认操作",
	reviewInstall: "确认安装这个插件？",
	reviewUpdate: "确认更新这个插件？",
	reviewRemove: "确认从当前 profile 删除这个插件？",
	reviewTarget: "目标版本",
	reviewSpec: "精确来源",
	reviewWarnings: "操作说明",
	warningTrusted: "插件代码会在 DSH Host 进程中运行，请确认来源可信。",
	warningRestart: "安装、更新或删除不会改变当前进程，重启后才会重新组合。",
	warningScripts: "生命周期脚本默认被禁用；发布包必须包含可运行的构建产物。",
	warningCompat: "包没有声明明确的 DSH 兼容范围，请先查看源码和 README。",
	warningData: "删除包不会删除插件创建的配置、缓存或工作区文件。",
	warningSelf: "这会删除管理器本身；当前进程仍会运行到下次重启。",
	warningUncatalogued: "该包不在当前社区目录中，更新仅依据同名 npm 包、相同仓库和完整性哈希。",
	artifactLifecycle: "包声明了生命周期脚本；自动安装会禁用这些脚本。",
	artifactLicense: "包没有声明许可证。",
	artifactDeprecated: "npm 已将该版本标记为 deprecated。",
	artifactCompat: "包没有声明 DSH/Cordis peer 兼容范围。",
	artifactGit: "安装来源是固定 commit 的 GitHub 仓库。",
	artifactRegistry: "npm artifact 由精确版本和 integrity 固定，但没有对应 git commit。",
	artifactOther: "存在额外 artifact 风险信号：{signal}",
	acknowledge: "我理解这是会在本机运行的第三方代码。",
	cancel: "取消",
	confirm: "确认执行",
	blocked: "无法执行：{reason}",
	reasonNotVerified: "候选包没有通过 manifest 验证",
	reasonAlreadyInstalled: "该插件已经安装",
	reasonUpToDate: "当前版本已经是最新",
	reasonProfile: "当前 profile 不可写",
	reasonBusy: "已有另一个操作正在执行",
	reasonUnavailable: "dsh 命令不可用",
	reasonProtected: "系统组件不能删除",
	reasonMissing: "没有找到该插件",
	reasonRestart: "请先重启 DSH 使上一次变更生效",
	reasonChanged: "profile 在确认后发生了变化，请重新操作",
	reasonRepository: "npm 包声明的仓库与当前安装来源不一致",
	reasonVersion: "当前安装版本无法安全比较",
	reasonState: "确认后插件或社区 artifact 发生了变化，请重新操作",
	reasonGeneric: "请求被拒绝",
	installedCount: "{count} 个已安装包",
	profile: "Profile: {name}",
	writable: "可写",
	readOnly: "只读",
	dshReady: "管理命令可用",
	dshMissing: "管理命令不可用",
	loading: "加载中…",
	error: "加载失败，请重试。",
	ariaStore: "插件商店",
	ariaInstalled: "已安装插件",
	ariaSearch: "搜索插件",
	ariaRefresh: "同步社区目录",
	ariaUpdate: "更新插件",
	ariaRemove: "删除插件"
};
const en = {
	tab: "Manage",
	store: "Plugin store",
	installed: "Installed",
	search: "Search community plugins",
	category: "Category",
	allCategories: "All",
	"category.ui": "UI",
	"category.tools": "Tools",
	"category.tool": "Tools",
	"category.theme": "Themes",
	"category.memory": "Memory",
	"category.skill": "Skills",
	"category.model": "Models",
	"category.session": "Sessions",
	"category.workflow": "Workflow",
	"category.notify": "Notifications",
	"category.dev": "Development",
	"category.market": "Markets",
	"category.vision": "Vision",
	"category.fun": "Fun",
	"category.other": "Other",
	"category.uncategorized": "Uncategorized",
	refresh: "Sync catalog",
	refreshing: "Syncing…",
	sourceNetwork: "Community catalog",
	sourceCache: "Local cache",
	sourceNone: "Not synced",
	stale: "Catalog is stale",
	catalogCount: "{count} results",
	catalogEmpty: "No matching plugins",
	catalogUnavailable: "The catalog is unavailable. Sync it or check the network.",
	catalogError: "Catalog sync failed: {message}",
	previous: "Previous page",
	next: "Next page",
	page: "Page {page} / {pages}",
	stars: "{count} stars",
	community: "Community",
	npm: "npm",
	github: "GitHub source",
	verified: "Verified",
	verifying: "Verifying…",
	unverified: "Unavailable",
	install: "Install",
	installing: "Installing…",
	update: "Update",
	updating: "Updating…",
	remove: "Remove",
	removing: "Removing…",
	openRepository: "Open repository",
	details: "Plugin details",
	usage: "Usage",
	noReadme: "This plugin did not publish a README.",
	readmeSource: "Documentation source: {source}",
	packageName: "Package",
	version: "Version",
	author: "Author",
	license: "License",
	source: "Install source",
	bundleLayer: "Bundle layer",
	clientLayer: "Web client",
	runtime: "Runtime",
	active: "Active",
	inactive: "Not in bundle layers",
	pendingInstall: "Enable after restart",
	pendingUpdate: "Update after restart",
	pendingRemoval: "Remove after restart",
	system: "System component",
	direct: "Direct dependency",
	noPlugins: "No external plugins are available in this profile.",
	updateAvailable: "New version {version}",
	latest: "Up to date",
	checkFailed: "Version check failed",
	runtimeUnknown: "No Loader entry observed",
	missingValue: "—",
	versionValue: "v{version}",
	removeSpec: "pnpm remove",
	runtimeEntry: "{id}: {phase}",
	separator: " · ",
	restartBanner: "The profile changed. Restart DSH to apply it.",
	operationFailed: "Operation failed: {message}",
	operationOutput: "Command output",
	retry: "Retry",
	close: "Close",
	back: "Back to list",
	reviewTitle: "Review operation",
	reviewInstall: "Install this plugin?",
	reviewUpdate: "Update this plugin?",
	reviewRemove: "Remove this plugin from the current profile?",
	reviewTarget: "Target version",
	reviewSpec: "Exact source",
	reviewWarnings: "Operation notes",
	warningTrusted: "Plugin code runs inside the DSH Host process. Verify the source before continuing.",
	warningRestart: "The running process is unchanged; the new composition applies after restart.",
	warningScripts: "Lifecycle scripts are disabled by default; the published artifact must already be runnable.",
	warningCompat: "The package does not declare a clear DSH compatibility range. Review its source and README.",
	warningData: "Removing the package does not remove plugin-created config, cache, or workspace files.",
	warningSelf: "This removes the manager itself; the current process continues until the next restart.",
	warningUncatalogued: "This package is outside the community catalog; update trust is limited to the same npm name, repository, and integrity hash.",
	artifactLifecycle: "The package declares lifecycle scripts; automatic installation disables them.",
	artifactLicense: "The package does not declare a license.",
	artifactDeprecated: "npm marks this version as deprecated.",
	artifactCompat: "The package does not declare a DSH/Cordis peer compatibility range.",
	artifactGit: "The install source is a GitHub repository pinned to a commit.",
	artifactRegistry: "The npm artifact is pinned by exact version and integrity, but has no matching git commit.",
	artifactOther: "Additional artifact risk signal: {signal}",
	acknowledge: "I understand this is third-party code that will run locally.",
	cancel: "Cancel",
	confirm: "Confirm",
	blocked: "Cannot continue: {reason}",
	reasonNotVerified: "The candidate did not pass manifest verification",
	reasonAlreadyInstalled: "The plugin is already installed",
	reasonUpToDate: "The installed version is current",
	reasonProfile: "The current profile is not writable",
	reasonBusy: "Another operation is already running",
	reasonUnavailable: "The dsh command is unavailable",
	reasonProtected: "System components cannot be removed",
	reasonMissing: "The plugin was not found",
	reasonRestart: "Restart DSH before another change",
	reasonChanged: "The profile changed after review; try again",
	reasonRepository: "The npm repository does not match the installed origin",
	reasonVersion: "The installed version cannot be compared safely",
	reasonState: "The plugin or artifact changed after review; try again",
	reasonGeneric: "The request was rejected",
	installedCount: "{count} installed packages",
	profile: "Profile: {name}",
	writable: "Writable",
	readOnly: "Read-only",
	dshReady: "Manager command ready",
	dshMissing: "Manager command unavailable",
	loading: "Loading…",
	error: "Load failed. Try again.",
	ariaStore: "Plugin store",
	ariaInstalled: "Installed plugins",
	ariaSearch: "Search plugins",
	ariaRefresh: "Sync community catalog",
	ariaUpdate: "Update plugin",
	ariaRemove: "Remove plugin"
};

//#endregion
//#region src/client/index.ts
const NS = "settings.pluginConsole";
const inject = ["slots", "locale"];
function apply(ctx) {
	ctx.effect(() => ctx.locale.register(NS, {
		zh,
		en
	}), "plugin-console: dictionaries");
	const t = ctx.locale.bind(NS);
	const api = createPluginManageApi();
	const injected = () => ({
		api,
		locale: () => ctx.locale.getLocale().active
	});
	ctx.slots.inject("settings.plugins.tab", () => ctx.slots.register({
		name: "settings.plugins.tab",
		id: "manage",
		order: 30,
		label: () => t("tab"),
		locale: NS,
		inject: injected
	}, PluginManageSettingsTab));
}

//#endregion
exports.NS = NS;
exports.apply = apply;
exports.inject = inject;
return module.exports; } });
//# sourceMappingURL=client.js.map