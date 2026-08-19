window.__ModuleLoader__.load({ id: "dsh-plugin-console", factory: (require) => {
var module = { exports: {} }; var exports = module.exports;
//#region rolldown:runtime
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJS = (cb, mod) => function() {
	return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __export = (all$4) => {
	let target = {};
	for (var name$1 in all$4) __defProp(target, name$1, {
		get: all$4[name$1],
		enumerable: true
	});
	return target;
};
var __copyProps = (to, from, except, desc) => {
	if (from && typeof from === "object" || typeof from === "function") for (var keys$1 = __getOwnPropNames(from), i = 0, n = keys$1.length, key; i < n; i++) {
		key = keys$1[i];
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

//#region node_modules/devlop/lib/default.js
function ok() {}
function unreachable() {}

//#endregion
//#region node_modules/comma-separated-tokens/index.js
/**
* @typedef Options
*   Configuration for `stringify`.
* @property {boolean} [padLeft=true]
*   Whether to pad a space before a token.
* @property {boolean} [padRight=false]
*   Whether to pad a space after a token.
*/
/**
* @typedef {Options} StringifyOptions
*   Please use `StringifyOptions` instead.
*/
/**
* Parse comma-separated tokens to an array.
*
* @param {string} value
*   Comma-separated tokens.
* @returns {Array<string>}
*   List of tokens.
*/
function parse(value) {
	/** @type {Array<string>} */
	const tokens = [];
	const input = String(value || "");
	let index$2 = input.indexOf(",");
	let start = 0;
	/** @type {boolean} */
	let end = false;
	while (!end) {
		if (index$2 === -1) {
			index$2 = input.length;
			end = true;
		}
		const token = input.slice(start, index$2).trim();
		if (token || !end) tokens.push(token);
		start = index$2 + 1;
		index$2 = input.indexOf(",", start);
	}
	return tokens;
}
/**
* Serialize an array of strings or numbers to comma-separated tokens.
*
* @param {Array<string|number>} values
*   List of tokens.
* @param {Options} [options]
*   Configuration for `stringify` (optional).
* @returns {string}
*   Comma-separated tokens.
*/
function stringify(values, options) {
	const settings = options || {};
	return (values[values.length - 1] === "" ? [...values, ""] : values).join((settings.padRight ? " " : "") + "," + (settings.padLeft === false ? "" : " ")).trim();
}

//#endregion
//#region node_modules/estree-util-is-identifier-name/lib/index.js
const nameRe = /^[$_\p{ID_Start}][$_\u{200C}\u{200D}\p{ID_Continue}]*$/u;
const nameReJsx = /^[$_\p{ID_Start}][-$_\u{200C}\u{200D}\p{ID_Continue}]*$/u;
/** @type {Options} */
const emptyOptions$4 = {};
/**
* Checks if the given value is a valid identifier name.
*
* @param {string} name
*   Identifier to check.
* @param {Options | null | undefined} [options]
*   Configuration (optional).
* @returns {boolean}
*   Whether `name` can be an identifier.
*/
function name(name$1, options) {
	return ((options || emptyOptions$4).jsx ? nameReJsx : nameRe).test(name$1);
}

//#endregion
//#region node_modules/hast-util-whitespace/lib/index.js
/**
* @typedef {import('hast').Nodes} Nodes
*/
const re = /[ \t\n\f\r]/g;
/**
* Check if the given value is *inter-element whitespace*.
*
* @param {Nodes | string} thing
*   Thing to check (`Node` or `string`).
* @returns {boolean}
*   Whether the `value` is inter-element whitespace (`boolean`): consisting of
*   zero or more of space, tab (`\t`), line feed (`\n`), carriage return
*   (`\r`), or form feed (`\f`); if a node is passed it must be a `Text` node,
*   whose `value` field is checked.
*/
function whitespace(thing) {
	return typeof thing === "object" ? thing.type === "text" ? empty$1(thing.value) : false : empty$1(thing);
}
/**
* @param {string} value
* @returns {boolean}
*/
function empty$1(value) {
	return value.replace(re, "") === "";
}

//#endregion
//#region node_modules/property-information/lib/util/schema.js
/**
* @import {Schema as SchemaType, Space} from 'property-information'
*/
/** @type {SchemaType} */
var Schema = class {
	/**
	* @param {SchemaType['property']} property
	*   Property.
	* @param {SchemaType['normal']} normal
	*   Normal.
	* @param {Space | undefined} [space]
	*   Space.
	* @returns
	*   Schema.
	*/
	constructor(property, normal, space$1) {
		this.normal = normal;
		this.property = property;
		if (space$1) this.space = space$1;
	}
};
Schema.prototype.normal = {};
Schema.prototype.property = {};
Schema.prototype.space = void 0;

//#endregion
//#region node_modules/property-information/lib/util/merge.js
/**
* @param {ReadonlyArray<Schema>} definitions
*   Definitions.
* @param {Space | undefined} [space]
*   Space.
* @returns {Schema}
*   Schema.
*/
function merge(definitions, space$1) {
	/** @type {Record<string, Info>} */
	const property = {};
	/** @type {Record<string, string>} */
	const normal = {};
	for (const definition$2 of definitions) {
		Object.assign(property, definition$2.property);
		Object.assign(normal, definition$2.normal);
	}
	return new Schema(property, normal, space$1);
}

//#endregion
//#region node_modules/property-information/lib/normalize.js
/**
* Get the cleaned case insensitive form of an attribute or property.
*
* @param {string} value
*   An attribute-like or property-like name.
* @returns {string}
*   Value that can be used to look up the properly cased property on a
*   `Schema`.
*/
function normalize(value) {
	return value.toLowerCase();
}

//#endregion
//#region node_modules/property-information/lib/util/info.js
/**
* @import {Info as InfoType} from 'property-information'
*/
/** @type {InfoType} */
var Info = class {
	/**
	* @param {string} property
	*   Property.
	* @param {string} attribute
	*   Attribute.
	* @returns
	*   Info.
	*/
	constructor(property, attribute) {
		this.attribute = attribute;
		this.property = property;
	}
};
Info.prototype.attribute = "";
Info.prototype.booleanish = false;
Info.prototype.boolean = false;
Info.prototype.commaOrSpaceSeparated = false;
Info.prototype.commaSeparated = false;
Info.prototype.defined = false;
Info.prototype.mustUseProperty = false;
Info.prototype.number = false;
Info.prototype.overloadedBoolean = false;
Info.prototype.property = "";
Info.prototype.spaceSeparated = false;
Info.prototype.space = void 0;

//#endregion
//#region node_modules/property-information/lib/util/types.js
var types_exports = /* @__PURE__ */ __export({
	boolean: () => boolean,
	booleanish: () => booleanish,
	commaOrSpaceSeparated: () => commaOrSpaceSeparated,
	commaSeparated: () => commaSeparated,
	number: () => number,
	overloadedBoolean: () => overloadedBoolean,
	spaceSeparated: () => spaceSeparated
});
let powers = 0;
const boolean = increment();
const booleanish = increment();
const overloadedBoolean = increment();
const number = increment();
const spaceSeparated = increment();
const commaSeparated = increment();
const commaOrSpaceSeparated = increment();
function increment() {
	return 2 ** ++powers;
}

//#endregion
//#region node_modules/property-information/lib/util/defined-info.js
const checks = Object.keys(types_exports);
var DefinedInfo = class extends Info {
	/**
	* @constructor
	* @param {string} property
	*   Property.
	* @param {string} attribute
	*   Attribute.
	* @param {number | null | undefined} [mask]
	*   Mask.
	* @param {Space | undefined} [space]
	*   Space.
	* @returns
	*   Info.
	*/
	constructor(property, attribute, mask, space$1) {
		let index$2 = -1;
		super(property, attribute);
		mark(this, "space", space$1);
		if (typeof mask === "number") while (++index$2 < checks.length) {
			const check = checks[index$2];
			mark(this, checks[index$2], (mask & types_exports[check]) === types_exports[check]);
		}
	}
};
DefinedInfo.prototype.defined = true;
/**
* @template {keyof DefinedInfo} Key
*   Key type.
* @param {DefinedInfo} values
*   Info.
* @param {Key} key
*   Key.
* @param {DefinedInfo[Key]} value
*   Value.
* @returns {undefined}
*   Nothing.
*/
function mark(values, key, value) {
	if (value) values[key] = value;
}

//#endregion
//#region node_modules/property-information/lib/util/create.js
/**
* @param {Definition} definition
*   Definition.
* @returns {Schema}
*   Schema.
*/
function create(definition$2) {
	/** @type {Record<string, Info>} */
	const properties$1 = {};
	/** @type {Record<string, string>} */
	const normals = {};
	for (const [property, value] of Object.entries(definition$2.properties)) {
		const info = new DefinedInfo(property, definition$2.transform(definition$2.attributes || {}, property), value, definition$2.space);
		if (definition$2.mustUseProperty && definition$2.mustUseProperty.includes(property)) info.mustUseProperty = true;
		properties$1[property] = info;
		normals[normalize(property)] = property;
		normals[normalize(info.attribute)] = property;
	}
	return new Schema(properties$1, normals, definition$2.space);
}

//#endregion
//#region node_modules/property-information/lib/aria.js
const aria$1 = create({
	properties: {
		ariaActiveDescendant: null,
		ariaAtomic: booleanish,
		ariaAutoComplete: null,
		ariaBusy: booleanish,
		ariaChecked: booleanish,
		ariaColCount: number,
		ariaColIndex: number,
		ariaColSpan: number,
		ariaControls: spaceSeparated,
		ariaCurrent: null,
		ariaDescribedBy: spaceSeparated,
		ariaDetails: null,
		ariaDisabled: booleanish,
		ariaDropEffect: spaceSeparated,
		ariaErrorMessage: null,
		ariaExpanded: booleanish,
		ariaFlowTo: spaceSeparated,
		ariaGrabbed: booleanish,
		ariaHasPopup: null,
		ariaHidden: booleanish,
		ariaInvalid: null,
		ariaKeyShortcuts: null,
		ariaLabel: null,
		ariaLabelledBy: spaceSeparated,
		ariaLevel: number,
		ariaLive: null,
		ariaModal: booleanish,
		ariaMultiLine: booleanish,
		ariaMultiSelectable: booleanish,
		ariaOrientation: null,
		ariaOwns: spaceSeparated,
		ariaPlaceholder: null,
		ariaPosInSet: number,
		ariaPressed: booleanish,
		ariaReadOnly: booleanish,
		ariaRelevant: null,
		ariaRequired: booleanish,
		ariaRoleDescription: spaceSeparated,
		ariaRowCount: number,
		ariaRowIndex: number,
		ariaRowSpan: number,
		ariaSelected: booleanish,
		ariaSetSize: number,
		ariaSort: null,
		ariaValueMax: number,
		ariaValueMin: number,
		ariaValueNow: number,
		ariaValueText: null,
		role: null
	},
	transform(_, property) {
		return property === "role" ? property : "aria-" + property.slice(4).toLowerCase();
	}
});

//#endregion
//#region node_modules/property-information/lib/util/case-sensitive-transform.js
/**
* @param {Record<string, string>} attributes
*   Attributes.
* @param {string} attribute
*   Attribute.
* @returns {string}
*   Transformed attribute.
*/
function caseSensitiveTransform(attributes, attribute) {
	return attribute in attributes ? attributes[attribute] : attribute;
}

//#endregion
//#region node_modules/property-information/lib/util/case-insensitive-transform.js
/**
* @param {Record<string, string>} attributes
*   Attributes.
* @param {string} property
*   Property.
* @returns {string}
*   Transformed property.
*/
function caseInsensitiveTransform(attributes, property) {
	return caseSensitiveTransform(attributes, property.toLowerCase());
}

//#endregion
//#region node_modules/property-information/lib/html.js
const html$3 = create({
	attributes: {
		acceptcharset: "accept-charset",
		classname: "class",
		htmlfor: "for",
		httpequiv: "http-equiv"
	},
	mustUseProperty: [
		"checked",
		"multiple",
		"muted",
		"selected"
	],
	properties: {
		abbr: null,
		accept: commaSeparated,
		acceptCharset: spaceSeparated,
		accessKey: spaceSeparated,
		action: null,
		allow: null,
		allowFullScreen: boolean,
		allowPaymentRequest: boolean,
		allowUserMedia: boolean,
		alpha: boolean,
		alt: null,
		as: null,
		async: boolean,
		autoCapitalize: null,
		autoComplete: spaceSeparated,
		autoFocus: boolean,
		autoPlay: boolean,
		blocking: spaceSeparated,
		capture: null,
		charSet: null,
		checked: boolean,
		cite: null,
		className: spaceSeparated,
		closedBy: null,
		colorSpace: null,
		cols: number,
		colSpan: number,
		command: null,
		commandFor: null,
		content: null,
		contentEditable: booleanish,
		controls: boolean,
		controlsList: spaceSeparated,
		coords: number | commaSeparated,
		crossOrigin: null,
		data: null,
		dateTime: null,
		decoding: null,
		default: boolean,
		defer: boolean,
		dir: null,
		dirName: null,
		disabled: boolean,
		download: overloadedBoolean,
		draggable: booleanish,
		encType: null,
		enterKeyHint: null,
		fetchPriority: null,
		form: null,
		formAction: null,
		formEncType: null,
		formMethod: null,
		formNoValidate: boolean,
		formTarget: null,
		headers: spaceSeparated,
		height: number,
		hidden: overloadedBoolean,
		high: number,
		href: null,
		hrefLang: null,
		htmlFor: spaceSeparated,
		httpEquiv: spaceSeparated,
		id: null,
		imageSizes: null,
		imageSrcSet: null,
		inert: boolean,
		inputMode: null,
		integrity: null,
		is: null,
		isMap: boolean,
		itemId: null,
		itemProp: spaceSeparated,
		itemRef: spaceSeparated,
		itemScope: boolean,
		itemType: spaceSeparated,
		kind: null,
		label: null,
		lang: null,
		language: null,
		list: null,
		loading: null,
		loop: boolean,
		low: number,
		manifest: null,
		max: null,
		maxLength: number,
		media: null,
		method: null,
		min: null,
		minLength: number,
		multiple: boolean,
		muted: boolean,
		name: null,
		nonce: null,
		noModule: boolean,
		noValidate: boolean,
		onAbort: null,
		onAfterPrint: null,
		onAuxClick: null,
		onBeforeMatch: null,
		onBeforePrint: null,
		onBeforeToggle: null,
		onBeforeUnload: null,
		onBlur: null,
		onCancel: null,
		onCanPlay: null,
		onCanPlayThrough: null,
		onChange: null,
		onClick: null,
		onClose: null,
		onContextLost: null,
		onContextMenu: null,
		onContextRestored: null,
		onCopy: null,
		onCueChange: null,
		onCut: null,
		onDblClick: null,
		onDrag: null,
		onDragEnd: null,
		onDragEnter: null,
		onDragExit: null,
		onDragLeave: null,
		onDragOver: null,
		onDragStart: null,
		onDrop: null,
		onDurationChange: null,
		onEmptied: null,
		onEnded: null,
		onError: null,
		onFocus: null,
		onFormData: null,
		onHashChange: null,
		onInput: null,
		onInvalid: null,
		onKeyDown: null,
		onKeyPress: null,
		onKeyUp: null,
		onLanguageChange: null,
		onLoad: null,
		onLoadedData: null,
		onLoadedMetadata: null,
		onLoadEnd: null,
		onLoadStart: null,
		onMessage: null,
		onMessageError: null,
		onMouseDown: null,
		onMouseEnter: null,
		onMouseLeave: null,
		onMouseMove: null,
		onMouseOut: null,
		onMouseOver: null,
		onMouseUp: null,
		onOffline: null,
		onOnline: null,
		onPageHide: null,
		onPageShow: null,
		onPaste: null,
		onPause: null,
		onPlay: null,
		onPlaying: null,
		onPopState: null,
		onProgress: null,
		onRateChange: null,
		onRejectionHandled: null,
		onReset: null,
		onResize: null,
		onScroll: null,
		onScrollEnd: null,
		onSecurityPolicyViolation: null,
		onSeeked: null,
		onSeeking: null,
		onSelect: null,
		onSlotChange: null,
		onStalled: null,
		onStorage: null,
		onSubmit: null,
		onSuspend: null,
		onTimeUpdate: null,
		onToggle: null,
		onUnhandledRejection: null,
		onUnload: null,
		onVolumeChange: null,
		onWaiting: null,
		onWheel: null,
		open: boolean,
		optimum: number,
		pattern: null,
		ping: spaceSeparated,
		placeholder: null,
		playsInline: boolean,
		popover: null,
		popoverTarget: null,
		popoverTargetAction: null,
		poster: null,
		preload: null,
		readOnly: boolean,
		referrerPolicy: null,
		rel: spaceSeparated,
		required: boolean,
		reversed: boolean,
		rows: number,
		rowSpan: number,
		sandbox: spaceSeparated,
		scope: null,
		scoped: boolean,
		seamless: boolean,
		selected: boolean,
		shadowRootClonable: boolean,
		shadowRootCustomElementRegistry: boolean,
		shadowRootDelegatesFocus: boolean,
		shadowRootMode: null,
		shadowRootSerializable: boolean,
		shape: null,
		size: number,
		sizes: null,
		slot: null,
		span: number,
		spellCheck: booleanish,
		src: null,
		srcDoc: null,
		srcLang: null,
		srcSet: null,
		start: number,
		step: null,
		style: null,
		tabIndex: number,
		target: null,
		title: null,
		translate: null,
		type: null,
		typeMustMatch: boolean,
		useMap: null,
		value: booleanish,
		width: number,
		wrap: null,
		writingSuggestions: null,
		align: null,
		aLink: null,
		archive: spaceSeparated,
		axis: null,
		background: null,
		bgColor: null,
		border: number,
		borderColor: null,
		bottomMargin: number,
		cellPadding: null,
		cellSpacing: null,
		char: null,
		charOff: null,
		classId: null,
		clear: null,
		code: null,
		codeBase: null,
		codeType: null,
		color: null,
		compact: boolean,
		declare: boolean,
		event: null,
		face: null,
		frame: null,
		frameBorder: null,
		hSpace: number,
		leftMargin: number,
		link: null,
		longDesc: null,
		lowSrc: null,
		marginHeight: number,
		marginWidth: number,
		noResize: boolean,
		noHref: boolean,
		noShade: boolean,
		noWrap: boolean,
		object: null,
		profile: null,
		prompt: null,
		rev: null,
		rightMargin: number,
		rules: null,
		scheme: null,
		scrolling: booleanish,
		standby: null,
		summary: null,
		text: null,
		topMargin: number,
		valueType: null,
		version: null,
		vAlign: null,
		vLink: null,
		vSpace: number,
		allowTransparency: null,
		autoCorrect: null,
		autoSave: null,
		credentialless: boolean,
		disablePictureInPicture: boolean,
		disableRemotePlayback: boolean,
		exportParts: commaSeparated,
		part: spaceSeparated,
		prefix: null,
		property: null,
		results: number,
		security: null,
		unselectable: null
	},
	space: "html",
	transform: caseInsensitiveTransform
});

//#endregion
//#region node_modules/property-information/lib/svg.js
const svg$1 = create({
	attributes: {
		accentHeight: "accent-height",
		alignmentBaseline: "alignment-baseline",
		arabicForm: "arabic-form",
		baselineShift: "baseline-shift",
		capHeight: "cap-height",
		className: "class",
		clipPath: "clip-path",
		clipRule: "clip-rule",
		colorInterpolation: "color-interpolation",
		colorInterpolationFilters: "color-interpolation-filters",
		colorProfile: "color-profile",
		colorRendering: "color-rendering",
		crossOrigin: "crossorigin",
		dataType: "datatype",
		dominantBaseline: "dominant-baseline",
		enableBackground: "enable-background",
		fillOpacity: "fill-opacity",
		fillRule: "fill-rule",
		floodColor: "flood-color",
		floodOpacity: "flood-opacity",
		fontFamily: "font-family",
		fontSize: "font-size",
		fontSizeAdjust: "font-size-adjust",
		fontStretch: "font-stretch",
		fontStyle: "font-style",
		fontVariant: "font-variant",
		fontWeight: "font-weight",
		glyphName: "glyph-name",
		glyphOrientationHorizontal: "glyph-orientation-horizontal",
		glyphOrientationVertical: "glyph-orientation-vertical",
		hrefLang: "hreflang",
		horizAdvX: "horiz-adv-x",
		horizOriginX: "horiz-origin-x",
		horizOriginY: "horiz-origin-y",
		imageRendering: "image-rendering",
		letterSpacing: "letter-spacing",
		lightingColor: "lighting-color",
		markerEnd: "marker-end",
		markerMid: "marker-mid",
		markerStart: "marker-start",
		maskType: "mask-type",
		navDown: "nav-down",
		navDownLeft: "nav-down-left",
		navDownRight: "nav-down-right",
		navLeft: "nav-left",
		navNext: "nav-next",
		navPrev: "nav-prev",
		navRight: "nav-right",
		navUp: "nav-up",
		navUpLeft: "nav-up-left",
		navUpRight: "nav-up-right",
		onAbort: "onabort",
		onActivate: "onactivate",
		onAfterPrint: "onafterprint",
		onBeforePrint: "onbeforeprint",
		onBegin: "onbegin",
		onCancel: "oncancel",
		onCanPlay: "oncanplay",
		onCanPlayThrough: "oncanplaythrough",
		onChange: "onchange",
		onClick: "onclick",
		onClose: "onclose",
		onCopy: "oncopy",
		onCueChange: "oncuechange",
		onCut: "oncut",
		onDblClick: "ondblclick",
		onDrag: "ondrag",
		onDragEnd: "ondragend",
		onDragEnter: "ondragenter",
		onDragExit: "ondragexit",
		onDragLeave: "ondragleave",
		onDragOver: "ondragover",
		onDragStart: "ondragstart",
		onDrop: "ondrop",
		onDurationChange: "ondurationchange",
		onEmptied: "onemptied",
		onEnd: "onend",
		onEnded: "onended",
		onError: "onerror",
		onFocus: "onfocus",
		onFocusIn: "onfocusin",
		onFocusOut: "onfocusout",
		onHashChange: "onhashchange",
		onInput: "oninput",
		onInvalid: "oninvalid",
		onKeyDown: "onkeydown",
		onKeyPress: "onkeypress",
		onKeyUp: "onkeyup",
		onLoad: "onload",
		onLoadedData: "onloadeddata",
		onLoadedMetadata: "onloadedmetadata",
		onLoadStart: "onloadstart",
		onMessage: "onmessage",
		onMouseDown: "onmousedown",
		onMouseEnter: "onmouseenter",
		onMouseLeave: "onmouseleave",
		onMouseMove: "onmousemove",
		onMouseOut: "onmouseout",
		onMouseOver: "onmouseover",
		onMouseUp: "onmouseup",
		onMouseWheel: "onmousewheel",
		onOffline: "onoffline",
		onOnline: "ononline",
		onPageHide: "onpagehide",
		onPageShow: "onpageshow",
		onPaste: "onpaste",
		onPause: "onpause",
		onPlay: "onplay",
		onPlaying: "onplaying",
		onPopState: "onpopstate",
		onProgress: "onprogress",
		onRateChange: "onratechange",
		onRepeat: "onrepeat",
		onReset: "onreset",
		onResize: "onresize",
		onScroll: "onscroll",
		onSeeked: "onseeked",
		onSeeking: "onseeking",
		onSelect: "onselect",
		onShow: "onshow",
		onStalled: "onstalled",
		onStorage: "onstorage",
		onSubmit: "onsubmit",
		onSuspend: "onsuspend",
		onTimeUpdate: "ontimeupdate",
		onToggle: "ontoggle",
		onUnload: "onunload",
		onVolumeChange: "onvolumechange",
		onWaiting: "onwaiting",
		onZoom: "onzoom",
		overlinePosition: "overline-position",
		overlineThickness: "overline-thickness",
		paintOrder: "paint-order",
		panose1: "panose-1",
		pointerEvents: "pointer-events",
		referrerPolicy: "referrerpolicy",
		renderingIntent: "rendering-intent",
		shapeRendering: "shape-rendering",
		stopColor: "stop-color",
		stopOpacity: "stop-opacity",
		strikethroughPosition: "strikethrough-position",
		strikethroughThickness: "strikethrough-thickness",
		strokeDashArray: "stroke-dasharray",
		strokeDashOffset: "stroke-dashoffset",
		strokeLineCap: "stroke-linecap",
		strokeLineJoin: "stroke-linejoin",
		strokeMiterLimit: "stroke-miterlimit",
		strokeOpacity: "stroke-opacity",
		strokeWidth: "stroke-width",
		tabIndex: "tabindex",
		textAnchor: "text-anchor",
		textDecoration: "text-decoration",
		textRendering: "text-rendering",
		transformOrigin: "transform-origin",
		typeOf: "typeof",
		underlinePosition: "underline-position",
		underlineThickness: "underline-thickness",
		unicodeBidi: "unicode-bidi",
		unicodeRange: "unicode-range",
		unitsPerEm: "units-per-em",
		vAlphabetic: "v-alphabetic",
		vHanging: "v-hanging",
		vIdeographic: "v-ideographic",
		vMathematical: "v-mathematical",
		vectorEffect: "vector-effect",
		vertAdvY: "vert-adv-y",
		vertOriginX: "vert-origin-x",
		vertOriginY: "vert-origin-y",
		wordSpacing: "word-spacing",
		writingMode: "writing-mode",
		xHeight: "x-height",
		playbackOrder: "playbackorder",
		timelineBegin: "timelinebegin"
	},
	properties: {
		about: commaOrSpaceSeparated,
		accentHeight: number,
		accumulate: null,
		additive: null,
		alignmentBaseline: null,
		alphabetic: number,
		amplitude: number,
		arabicForm: null,
		ascent: number,
		attributeName: null,
		attributeType: null,
		azimuth: number,
		bandwidth: null,
		baselineShift: null,
		baseFrequency: null,
		baseProfile: null,
		bbox: null,
		begin: null,
		bias: number,
		by: null,
		calcMode: null,
		capHeight: number,
		className: spaceSeparated,
		clip: null,
		clipPath: null,
		clipPathUnits: null,
		clipRule: null,
		color: null,
		colorInterpolation: null,
		colorInterpolationFilters: null,
		colorProfile: null,
		colorRendering: null,
		content: null,
		contentScriptType: null,
		contentStyleType: null,
		crossOrigin: null,
		cursor: null,
		cx: null,
		cy: null,
		d: null,
		dataType: null,
		defaultAction: null,
		descent: number,
		diffuseConstant: number,
		direction: null,
		display: null,
		dur: null,
		divisor: number,
		dominantBaseline: null,
		download: boolean,
		dx: null,
		dy: null,
		edgeMode: null,
		editable: null,
		elevation: number,
		enableBackground: null,
		end: null,
		event: null,
		exponent: number,
		externalResourcesRequired: null,
		fill: null,
		fillOpacity: number,
		fillRule: null,
		filter: null,
		filterRes: null,
		filterUnits: null,
		floodColor: null,
		floodOpacity: null,
		focusable: null,
		focusHighlight: null,
		fontFamily: null,
		fontSize: null,
		fontSizeAdjust: null,
		fontStretch: null,
		fontStyle: null,
		fontVariant: null,
		fontWeight: null,
		format: null,
		fr: null,
		from: null,
		fx: null,
		fy: null,
		g1: commaSeparated,
		g2: commaSeparated,
		glyphName: commaSeparated,
		glyphOrientationHorizontal: null,
		glyphOrientationVertical: null,
		glyphRef: null,
		gradientTransform: null,
		gradientUnits: null,
		handler: null,
		hanging: number,
		hatchContentUnits: null,
		hatchUnits: null,
		height: null,
		href: null,
		hrefLang: null,
		horizAdvX: number,
		horizOriginX: number,
		horizOriginY: number,
		id: null,
		ideographic: number,
		imageRendering: null,
		initialVisibility: null,
		in: null,
		in2: null,
		intercept: number,
		k: number,
		k1: number,
		k2: number,
		k3: number,
		k4: number,
		kernelMatrix: commaOrSpaceSeparated,
		kernelUnitLength: null,
		keyPoints: null,
		keySplines: null,
		keyTimes: null,
		kerning: null,
		lang: null,
		lengthAdjust: null,
		letterSpacing: null,
		lightingColor: null,
		limitingConeAngle: number,
		local: null,
		markerEnd: null,
		markerMid: null,
		markerStart: null,
		markerHeight: null,
		markerUnits: null,
		markerWidth: null,
		mask: null,
		maskContentUnits: null,
		maskType: null,
		maskUnits: null,
		mathematical: null,
		max: null,
		media: null,
		mediaCharacterEncoding: null,
		mediaContentEncodings: null,
		mediaSize: number,
		mediaTime: null,
		method: null,
		min: null,
		mode: null,
		name: null,
		navDown: null,
		navDownLeft: null,
		navDownRight: null,
		navLeft: null,
		navNext: null,
		navPrev: null,
		navRight: null,
		navUp: null,
		navUpLeft: null,
		navUpRight: null,
		numOctaves: null,
		observer: null,
		offset: null,
		onAbort: null,
		onActivate: null,
		onAfterPrint: null,
		onBeforePrint: null,
		onBegin: null,
		onCancel: null,
		onCanPlay: null,
		onCanPlayThrough: null,
		onChange: null,
		onClick: null,
		onClose: null,
		onCopy: null,
		onCueChange: null,
		onCut: null,
		onDblClick: null,
		onDrag: null,
		onDragEnd: null,
		onDragEnter: null,
		onDragExit: null,
		onDragLeave: null,
		onDragOver: null,
		onDragStart: null,
		onDrop: null,
		onDurationChange: null,
		onEmptied: null,
		onEnd: null,
		onEnded: null,
		onError: null,
		onFocus: null,
		onFocusIn: null,
		onFocusOut: null,
		onHashChange: null,
		onInput: null,
		onInvalid: null,
		onKeyDown: null,
		onKeyPress: null,
		onKeyUp: null,
		onLoad: null,
		onLoadedData: null,
		onLoadedMetadata: null,
		onLoadStart: null,
		onMessage: null,
		onMouseDown: null,
		onMouseEnter: null,
		onMouseLeave: null,
		onMouseMove: null,
		onMouseOut: null,
		onMouseOver: null,
		onMouseUp: null,
		onMouseWheel: null,
		onOffline: null,
		onOnline: null,
		onPageHide: null,
		onPageShow: null,
		onPaste: null,
		onPause: null,
		onPlay: null,
		onPlaying: null,
		onPopState: null,
		onProgress: null,
		onRateChange: null,
		onRepeat: null,
		onReset: null,
		onResize: null,
		onScroll: null,
		onSeeked: null,
		onSeeking: null,
		onSelect: null,
		onShow: null,
		onStalled: null,
		onStorage: null,
		onSubmit: null,
		onSuspend: null,
		onTimeUpdate: null,
		onToggle: null,
		onUnload: null,
		onVolumeChange: null,
		onWaiting: null,
		onZoom: null,
		opacity: null,
		operator: null,
		order: null,
		orient: null,
		orientation: null,
		origin: null,
		overflow: null,
		overlay: null,
		overlinePosition: number,
		overlineThickness: number,
		paintOrder: null,
		panose1: null,
		path: null,
		pathLength: number,
		patternContentUnits: null,
		patternTransform: null,
		patternUnits: null,
		phase: null,
		ping: spaceSeparated,
		pitch: null,
		playbackOrder: null,
		pointerEvents: null,
		points: null,
		pointsAtX: number,
		pointsAtY: number,
		pointsAtZ: number,
		preserveAlpha: null,
		preserveAspectRatio: null,
		primitiveUnits: null,
		propagate: null,
		property: commaOrSpaceSeparated,
		r: null,
		radius: null,
		referrerPolicy: null,
		refX: null,
		refY: null,
		rel: commaOrSpaceSeparated,
		rev: commaOrSpaceSeparated,
		renderingIntent: null,
		repeatCount: null,
		repeatDur: null,
		requiredExtensions: commaOrSpaceSeparated,
		requiredFeatures: commaOrSpaceSeparated,
		requiredFonts: commaOrSpaceSeparated,
		requiredFormats: commaOrSpaceSeparated,
		resource: null,
		restart: null,
		result: null,
		rotate: null,
		rx: null,
		ry: null,
		scale: null,
		seed: null,
		shapeRendering: null,
		side: null,
		slope: null,
		snapshotTime: null,
		specularConstant: number,
		specularExponent: number,
		spreadMethod: null,
		spacing: null,
		startOffset: null,
		stdDeviation: null,
		stemh: null,
		stemv: null,
		stitchTiles: null,
		stopColor: null,
		stopOpacity: null,
		strikethroughPosition: number,
		strikethroughThickness: number,
		string: null,
		stroke: null,
		strokeDashArray: commaOrSpaceSeparated,
		strokeDashOffset: null,
		strokeLineCap: null,
		strokeLineJoin: null,
		strokeMiterLimit: number,
		strokeOpacity: number,
		strokeWidth: null,
		style: null,
		surfaceScale: number,
		syncBehavior: null,
		syncBehaviorDefault: null,
		syncMaster: null,
		syncTolerance: null,
		syncToleranceDefault: null,
		systemLanguage: commaOrSpaceSeparated,
		tabIndex: number,
		tableValues: null,
		target: null,
		targetX: number,
		targetY: number,
		textAnchor: null,
		textDecoration: null,
		textRendering: null,
		textLength: null,
		timelineBegin: null,
		title: null,
		transformBehavior: null,
		type: null,
		typeOf: commaOrSpaceSeparated,
		to: null,
		transform: null,
		transformOrigin: null,
		u1: null,
		u2: null,
		underlinePosition: number,
		underlineThickness: number,
		unicode: null,
		unicodeBidi: null,
		unicodeRange: null,
		unitsPerEm: number,
		values: null,
		vAlphabetic: number,
		vMathematical: number,
		vectorEffect: null,
		vHanging: number,
		vIdeographic: number,
		version: null,
		vertAdvY: number,
		vertOriginX: number,
		vertOriginY: number,
		viewBox: null,
		viewTarget: null,
		visibility: null,
		width: null,
		widths: null,
		wordSpacing: null,
		writingMode: null,
		x: null,
		x1: null,
		x2: null,
		xChannelSelector: null,
		xHeight: number,
		y: null,
		y1: null,
		y2: null,
		yChannelSelector: null,
		z: null,
		zoomAndPan: null
	},
	space: "svg",
	transform: caseSensitiveTransform
});

//#endregion
//#region node_modules/property-information/lib/xlink.js
const xlink = create({
	properties: {
		xLinkActuate: null,
		xLinkArcRole: null,
		xLinkHref: null,
		xLinkRole: null,
		xLinkShow: null,
		xLinkTitle: null,
		xLinkType: null
	},
	space: "xlink",
	transform(_, property) {
		return "xlink:" + property.slice(5).toLowerCase();
	}
});

//#endregion
//#region node_modules/property-information/lib/xmlns.js
const xmlns = create({
	attributes: { xmlnsxlink: "xmlns:xlink" },
	properties: {
		xmlnsXLink: null,
		xmlns: null
	},
	space: "xmlns",
	transform: caseInsensitiveTransform
});

//#endregion
//#region node_modules/property-information/lib/xml.js
const xml = create({
	properties: {
		xmlBase: null,
		xmlLang: null,
		xmlSpace: null
	},
	space: "xml",
	transform(_, property) {
		return "xml:" + property.slice(3).toLowerCase();
	}
});

//#endregion
//#region node_modules/property-information/lib/hast-to-react.js
/**
* Special cases for React (`Record<string, string>`).
*
* `hast` is close to `React` but differs in a couple of cases.
* To get a React property from a hast property,
* check if it is in `hastToReact`.
* If it is, use the corresponding value;
* otherwise, use the hast property.
*
* @type {Record<string, string>}
*/
const hastToReact = {
	classId: "classID",
	dataType: "datatype",
	itemId: "itemID",
	strokeDashArray: "strokeDasharray",
	strokeDashOffset: "strokeDashoffset",
	strokeLineCap: "strokeLinecap",
	strokeLineJoin: "strokeLinejoin",
	strokeMiterLimit: "strokeMiterlimit",
	typeOf: "typeof",
	xLinkActuate: "xlinkActuate",
	xLinkArcRole: "xlinkArcrole",
	xLinkHref: "xlinkHref",
	xLinkRole: "xlinkRole",
	xLinkShow: "xlinkShow",
	xLinkTitle: "xlinkTitle",
	xLinkType: "xlinkType",
	xmlnsXLink: "xmlnsXlink"
};

//#endregion
//#region node_modules/property-information/lib/find.js
const cap$1 = /[A-Z]/g;
const dash = /-[a-z]/g;
const valid = /^data[-\w.:]+$/i;
/**
* Look up info on a property.
*
* In most cases the given `schema` contains info on the property.
* All standard,
* most legacy,
* and some non-standard properties are supported.
* For these cases,
* the returned `Info` has hints about the value of the property.
*
* `name` can also be a valid data attribute or property,
* in which case an `Info` object with the correctly cased `attribute` and
* `property` is returned.
*
* `name` can be an unknown attribute,
* in which case an `Info` object with `attribute` and `property` set to the
* given name is returned.
* It is not recommended to provide unsupported legacy or recently specced
* properties.
*
*
* @param {Schema} schema
*   Schema;
*   either the `html` or `svg` export.
* @param {string} value
*   An attribute-like or property-like name;
*   it will be passed through `normalize` to hopefully find the correct info.
* @returns {Info}
*   Info.
*/
function find(schema, value) {
	const normal = normalize(value);
	let property = value;
	let Type = Info;
	if (normal in schema.normal) return schema.property[schema.normal[normal]];
	if (normal.length > 4 && normal.slice(0, 4) === "data" && valid.test(value)) {
		if (value.charAt(4) === "-") {
			const rest = value.slice(5).replace(dash, camelcase);
			property = "data" + rest.charAt(0).toUpperCase() + rest.slice(1);
		} else {
			const rest = value.slice(4);
			if (!dash.test(rest)) {
				let dashes = rest.replace(cap$1, kebab);
				if (dashes.charAt(0) !== "-") dashes = "-" + dashes;
				value = "data" + dashes;
			}
		}
		Type = DefinedInfo;
	}
	return new Type(property, value);
}
/**
* @param {string} $0
*   Value.
* @returns {string}
*   Kebab.
*/
function kebab($0) {
	return "-" + $0.toLowerCase();
}
/**
* @param {string} $0
*   Value.
* @returns {string}
*   Camel.
*/
function camelcase($0) {
	return $0.charAt(1).toUpperCase();
}

//#endregion
//#region node_modules/property-information/index.js
const html$1 = merge([
	aria$1,
	html$3,
	xlink,
	xmlns,
	xml
], "html");
const svg = merge([
	aria$1,
	svg$1,
	xlink,
	xmlns,
	xml
], "svg");

//#endregion
//#region node_modules/space-separated-tokens/index.js
/**
* Parse space-separated tokens to an array of strings.
*
* @param {string} value
*   Space-separated tokens.
* @returns {Array<string>}
*   List of tokens.
*/
function parse$1(value) {
	const input = String(value || "").trim();
	return input ? input.split(/[ \t\n\r\f]+/g) : [];
}
/**
* Serialize an array of strings as space separated-tokens.
*
* @param {Array<string|number>} values
*   List of tokens.
* @returns {string}
*   Space-separated tokens.
*/
function stringify$1(values) {
	return values.join(" ").trim();
}

//#endregion
//#region node_modules/inline-style-parser/cjs/index.js
var require_cjs$2 = /* @__PURE__ */ __commonJS({ "node_modules/inline-style-parser/cjs/index.js": ((exports, module) => {
	var COMMENT_REGEX = /\/\*[^*]*\*+([^/*][^*]*\*+)*\//g;
	var NEWLINE_REGEX = /\n/g;
	var WHITESPACE_REGEX = /^\s*/;
	var PROPERTY_REGEX = /^(\*?[-#/*\\\w]+(\[[0-9a-z_-]+\])?)\s*/;
	var COLON_REGEX = /^:\s*/;
	var VALUE_REGEX = /^((?:'(?:\\'|.)*?'|"(?:\\"|.)*?"|\([^)]*?\)|[^};])+)/;
	var SEMICOLON_REGEX = /^[;\s]*/;
	var TRIM_REGEX = /^\s+|\s+$/g;
	var NEWLINE = "\n";
	var FORWARD_SLASH = "/";
	var ASTERISK = "*";
	var EMPTY_STRING = "";
	var TYPE_COMMENT = "comment";
	var TYPE_DECLARATION = "declaration";
	/**
	* @param {String} style
	* @param {Object} [options]
	* @return {Object[]}
	* @throws {TypeError}
	* @throws {Error}
	*/
	function index$1(style$1, options) {
		if (typeof style$1 !== "string") throw new TypeError("First argument must be a string");
		if (!style$1) return [];
		options = options || {};
		/**
		* Positional.
		*/
		var lineno = 1;
		var column = 1;
		/**
		* Update lineno and column based on `str`.
		*
		* @param {String} str
		*/
		function updatePosition(str) {
			var lines = str.match(NEWLINE_REGEX);
			if (lines) lineno += lines.length;
			var i = str.lastIndexOf(NEWLINE);
			column = ~i ? str.length - i : column + str.length;
		}
		/**
		* Mark position and patch `node.position`.
		*
		* @return {Function}
		*/
		function position$3() {
			var start = {
				line: lineno,
				column
			};
			return function(node$1) {
				node$1.position = new Position(start);
				whitespace$1();
				return node$1;
			};
		}
		/**
		* Store position information for a node.
		*
		* @constructor
		* @property {Object} start
		* @property {Object} end
		* @property {undefined|String} source
		*/
		function Position(start) {
			this.start = start;
			this.end = {
				line: lineno,
				column
			};
			this.source = options.source;
		}
		/**
		* Non-enumerable source string.
		*/
		Position.prototype.content = style$1;
		/**
		* Error `msg`.
		*
		* @param {String} msg
		* @throws {Error}
		*/
		function error(msg) {
			var err = /* @__PURE__ */ new Error(options.source + ":" + lineno + ":" + column + ": " + msg);
			err.reason = msg;
			err.filename = options.source;
			err.line = lineno;
			err.column = column;
			err.source = style$1;
			if (options.silent);
			else throw err;
		}
		/**
		* Match `re` and return captures.
		*
		* @param {RegExp} re
		* @return {undefined|Array}
		*/
		function match(re$1) {
			var m = re$1.exec(style$1);
			if (!m) return;
			var str = m[0];
			updatePosition(str);
			style$1 = style$1.slice(str.length);
			return m;
		}
		/**
		* Parse whitespace.
		*/
		function whitespace$1() {
			match(WHITESPACE_REGEX);
		}
		/**
		* Parse comments.
		*
		* @param {Object[]} [rules]
		* @return {Object[]}
		*/
		function comments(rules) {
			var c;
			rules = rules || [];
			while (c = comment$3()) if (c !== false) rules.push(c);
			return rules;
		}
		/**
		* Parse comment.
		*
		* @return {Object}
		* @throws {Error}
		*/
		function comment$3() {
			var pos = position$3();
			if (FORWARD_SLASH != style$1.charAt(0) || ASTERISK != style$1.charAt(1)) return;
			var i = 2;
			while (EMPTY_STRING != style$1.charAt(i) && (ASTERISK != style$1.charAt(i) || FORWARD_SLASH != style$1.charAt(i + 1))) ++i;
			i += 2;
			if (EMPTY_STRING === style$1.charAt(i - 1)) return error("End of comment missing");
			var str = style$1.slice(2, i - 2);
			column += 2;
			updatePosition(str);
			style$1 = style$1.slice(i);
			column += 2;
			return pos({
				type: TYPE_COMMENT,
				comment: str
			});
		}
		/**
		* Parse declaration.
		*
		* @return {Object}
		* @throws {Error}
		*/
		function declaration() {
			var pos = position$3();
			var prop = match(PROPERTY_REGEX);
			if (!prop) return;
			comment$3();
			if (!match(COLON_REGEX)) return error("property missing ':'");
			var val = match(VALUE_REGEX);
			var ret = pos({
				type: TYPE_DECLARATION,
				property: trim(prop[0].replace(COMMENT_REGEX, EMPTY_STRING)),
				value: val ? trim(val[0].replace(COMMENT_REGEX, EMPTY_STRING)) : EMPTY_STRING
			});
			match(SEMICOLON_REGEX);
			return ret;
		}
		/**
		* Parse declarations.
		*
		* @return {Object[]}
		*/
		function declarations() {
			var decls = [];
			comments(decls);
			var decl;
			while (decl = declaration()) if (decl !== false) {
				decls.push(decl);
				comments(decls);
			}
			return decls;
		}
		whitespace$1();
		return declarations();
	}
	/**
	* Trim `str`.
	*
	* @param {String} str
	* @return {String}
	*/
	function trim(str) {
		return str ? str.replace(TRIM_REGEX, EMPTY_STRING) : EMPTY_STRING;
	}
	module.exports = index$1;
}) });

//#endregion
//#region node_modules/style-to-object/cjs/index.js
var require_cjs$1 = /* @__PURE__ */ __commonJS({ "node_modules/style-to-object/cjs/index.js": ((exports) => {
	var __importDefault = exports && exports.__importDefault || function(mod) {
		return mod && mod.__esModule ? mod : { "default": mod };
	};
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = StyleToObject;
	const inline_style_parser_1 = __importDefault(require_cjs$2());
	/**
	* Parses inline style to object.
	*
	* @param style - Inline style.
	* @param iterator - Iterator.
	* @returns - Style object or null.
	*
	* @example Parsing inline style to object:
	*
	* ```js
	* import parse from 'style-to-object';
	* parse('line-height: 42;'); // { 'line-height': '42' }
	* ```
	*/
	function StyleToObject(style$1, iterator) {
		let styleObject = null;
		if (!style$1 || typeof style$1 !== "string") return styleObject;
		const declarations = (0, inline_style_parser_1.default)(style$1);
		const hasIterator = typeof iterator === "function";
		declarations.forEach((declaration) => {
			if (declaration.type !== "declaration") return;
			const { property, value } = declaration;
			if (hasIterator) iterator(property, value, declaration);
			else if (value) {
				styleObject = styleObject || {};
				styleObject[property] = value;
			}
		});
		return styleObject;
	}
}) });

//#endregion
//#region node_modules/style-to-js/cjs/utilities.js
var require_utilities = /* @__PURE__ */ __commonJS({ "node_modules/style-to-js/cjs/utilities.js": ((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.camelCase = void 0;
	var CUSTOM_PROPERTY_REGEX = /^--[a-zA-Z0-9_-]+$/;
	var HYPHEN_REGEX = /-([a-z])/g;
	var NO_HYPHEN_REGEX = /^[^-]+$/;
	var VENDOR_PREFIX_REGEX = /^-(webkit|moz|ms|o|khtml)-/;
	var MS_VENDOR_PREFIX_REGEX = /^-(ms)-/;
	/**
	* Checks whether to skip camelCase.
	*/
	var skipCamelCase = function(property) {
		return !property || NO_HYPHEN_REGEX.test(property) || CUSTOM_PROPERTY_REGEX.test(property);
	};
	/**
	* Replacer that capitalizes first character.
	*/
	var capitalize = function(match, character) {
		return character.toUpperCase();
	};
	/**
	* Replacer that removes beginning hyphen of vendor prefix property.
	*/
	var trimHyphen = function(match, prefix) {
		return "".concat(prefix, "-");
	};
	/**
	* CamelCases a CSS property.
	*/
	var camelCase = function(property, options) {
		if (options === void 0) options = {};
		if (skipCamelCase(property)) return property;
		property = property.toLowerCase();
		if (options.reactCompat) property = property.replace(MS_VENDOR_PREFIX_REGEX, trimHyphen);
		else property = property.replace(VENDOR_PREFIX_REGEX, trimHyphen);
		return property.replace(HYPHEN_REGEX, capitalize);
	};
	exports.camelCase = camelCase;
}) });

//#endregion
//#region node_modules/style-to-js/cjs/index.js
var require_cjs = /* @__PURE__ */ __commonJS({ "node_modules/style-to-js/cjs/index.js": ((exports, module) => {
	var style_to_object_1 = (exports && exports.__importDefault || function(mod) {
		return mod && mod.__esModule ? mod : { "default": mod };
	})(require_cjs$1());
	var utilities_1 = require_utilities();
	/**
	* Parses CSS inline style to JavaScript object (camelCased).
	*/
	function StyleToJS(style$1, options) {
		var output = {};
		if (!style$1 || typeof style$1 !== "string") return output;
		(0, style_to_object_1.default)(style$1, function(property, value) {
			if (property && value) output[(0, utilities_1.camelCase)(property, options)] = value;
		});
		return output;
	}
	StyleToJS.default = StyleToJS;
	module.exports = StyleToJS;
}) });

//#endregion
//#region node_modules/unist-util-position/lib/index.js
/**
* @typedef {import('unist').Node} Node
* @typedef {import('unist').Point} Point
* @typedef {import('unist').Position} Position
*/
/**
* @typedef NodeLike
* @property {string} type
* @property {PositionLike | null | undefined} [position]
*
* @typedef PositionLike
* @property {PointLike | null | undefined} [start]
* @property {PointLike | null | undefined} [end]
*
* @typedef PointLike
* @property {number | null | undefined} [line]
* @property {number | null | undefined} [column]
* @property {number | null | undefined} [offset]
*/
/**
* Get the ending point of `node`.
*
* @param node
*   Node.
* @returns
*   Point.
*/
const pointEnd = point$3("end");
/**
* Get the starting point of `node`.
*
* @param node
*   Node.
* @returns
*   Point.
*/
const pointStart = point$3("start");
/**
* Get the positional info of `node`.
*
* @param {'end' | 'start'} type
*   Side.
* @returns
*   Getter.
*/
function point$3(type) {
	return point$4;
	/**
	* Get the point info of `node` at a bound side.
	*
	* @param {Node | NodeLike | null | undefined} [node]
	* @returns {Point | undefined}
	*/
	function point$4(node$1) {
		const point$5 = node$1 && node$1.position && node$1.position[type] || {};
		if (typeof point$5.line === "number" && point$5.line > 0 && typeof point$5.column === "number" && point$5.column > 0) return {
			line: point$5.line,
			column: point$5.column,
			offset: typeof point$5.offset === "number" && point$5.offset > -1 ? point$5.offset : void 0
		};
	}
}
/**
* Get the positional info of `node`.
*
* @param {Node | NodeLike | null | undefined} [node]
*   Node.
* @returns {Position | undefined}
*   Position.
*/
function position(node$1) {
	const start = pointStart(node$1);
	const end = pointEnd(node$1);
	if (start && end) return {
		start,
		end
	};
}

//#endregion
//#region node_modules/unist-util-stringify-position/lib/index.js
/**
* @typedef {import('unist').Node} Node
* @typedef {import('unist').Point} Point
* @typedef {import('unist').Position} Position
*/
/**
* @typedef NodeLike
* @property {string} type
* @property {PositionLike | null | undefined} [position]
*
* @typedef PointLike
* @property {number | null | undefined} [line]
* @property {number | null | undefined} [column]
* @property {number | null | undefined} [offset]
*
* @typedef PositionLike
* @property {PointLike | null | undefined} [start]
* @property {PointLike | null | undefined} [end]
*/
/**
* Serialize the positional info of a point, position (start and end points),
* or node.
*
* @param {Node | NodeLike | Point | PointLike | Position | PositionLike | null | undefined} [value]
*   Node, position, or point.
* @returns {string}
*   Pretty printed positional info of a node (`string`).
*
*   In the format of a range `ls:cs-le:ce` (when given `node` or `position`)
*   or a point `l:c` (when given `point`), where `l` stands for line, `c` for
*   column, `s` for `start`, and `e` for end.
*   An empty string (`''`) is returned if the given value is neither `node`,
*   `position`, nor `point`.
*/
function stringifyPosition(value) {
	if (!value || typeof value !== "object") return "";
	if ("position" in value || "type" in value) return position$2(value.position);
	if ("start" in value || "end" in value) return position$2(value);
	if ("line" in value || "column" in value) return point$2(value);
	return "";
}
/**
* @param {Point | PointLike | null | undefined} point
* @returns {string}
*/
function point$2(point$4) {
	return index(point$4 && point$4.line) + ":" + index(point$4 && point$4.column);
}
/**
* @param {Position | PositionLike | null | undefined} pos
* @returns {string}
*/
function position$2(pos) {
	return point$2(pos && pos.start) + "-" + point$2(pos && pos.end);
}
/**
* @param {number | null | undefined} value
* @returns {number}
*/
function index(value) {
	return value && typeof value === "number" ? value : 1;
}

//#endregion
//#region node_modules/vfile-message/lib/index.js
/**
* Message.
*/
var VFileMessage = class extends Error {
	/**
	* Create a message for `reason`.
	*
	* > 🪦 **Note**: also has obsolete signatures.
	*
	* @overload
	* @param {string} reason
	* @param {Options | null | undefined} [options]
	* @returns
	*
	* @overload
	* @param {string} reason
	* @param {Node | NodeLike | null | undefined} parent
	* @param {string | null | undefined} [origin]
	* @returns
	*
	* @overload
	* @param {string} reason
	* @param {Point | Position | null | undefined} place
	* @param {string | null | undefined} [origin]
	* @returns
	*
	* @overload
	* @param {string} reason
	* @param {string | null | undefined} [origin]
	* @returns
	*
	* @overload
	* @param {Error | VFileMessage} cause
	* @param {Node | NodeLike | null | undefined} parent
	* @param {string | null | undefined} [origin]
	* @returns
	*
	* @overload
	* @param {Error | VFileMessage} cause
	* @param {Point | Position | null | undefined} place
	* @param {string | null | undefined} [origin]
	* @returns
	*
	* @overload
	* @param {Error | VFileMessage} cause
	* @param {string | null | undefined} [origin]
	* @returns
	*
	* @param {Error | VFileMessage | string} causeOrReason
	*   Reason for message, should use markdown.
	* @param {Node | NodeLike | Options | Point | Position | string | null | undefined} [optionsOrParentOrPlace]
	*   Configuration (optional).
	* @param {string | null | undefined} [origin]
	*   Place in code where the message originates (example:
	*   `'my-package:my-rule'` or `'my-rule'`).
	* @returns
	*   Instance of `VFileMessage`.
	*/
	constructor(causeOrReason, optionsOrParentOrPlace, origin) {
		super();
		if (typeof optionsOrParentOrPlace === "string") {
			origin = optionsOrParentOrPlace;
			optionsOrParentOrPlace = void 0;
		}
		/** @type {string} */
		let reason = "";
		/** @type {Options} */
		let options = {};
		let legacyCause = false;
		if (optionsOrParentOrPlace) if ("line" in optionsOrParentOrPlace && "column" in optionsOrParentOrPlace) options = { place: optionsOrParentOrPlace };
		else if ("start" in optionsOrParentOrPlace && "end" in optionsOrParentOrPlace) options = { place: optionsOrParentOrPlace };
		else if ("type" in optionsOrParentOrPlace) options = {
			ancestors: [optionsOrParentOrPlace],
			place: optionsOrParentOrPlace.position
		};
		else options = { ...optionsOrParentOrPlace };
		if (typeof causeOrReason === "string") reason = causeOrReason;
		else if (!options.cause && causeOrReason) {
			legacyCause = true;
			reason = causeOrReason.message;
			options.cause = causeOrReason;
		}
		if (!options.ruleId && !options.source && typeof origin === "string") {
			const index$2 = origin.indexOf(":");
			if (index$2 === -1) options.ruleId = origin;
			else {
				options.source = origin.slice(0, index$2);
				options.ruleId = origin.slice(index$2 + 1);
			}
		}
		if (!options.place && options.ancestors && options.ancestors) {
			const parent = options.ancestors[options.ancestors.length - 1];
			if (parent) options.place = parent.position;
		}
		const start = options.place && "start" in options.place ? options.place.start : options.place;
		/**
		* Stack of ancestor nodes surrounding the message.
		*
		* @type {Array<Node> | undefined}
		*/
		this.ancestors = options.ancestors || void 0;
		/**
		* Original error cause of the message.
		*
		* @type {Error | undefined}
		*/
		this.cause = options.cause || void 0;
		/**
		* Starting column of message.
		*
		* @type {number | undefined}
		*/
		this.column = start ? start.column : void 0;
		/**
		* State of problem.
		*
		* * `true` — error, file not usable
		* * `false` — warning, change may be needed
		* * `undefined` — change likely not needed
		*
		* @type {boolean | null | undefined}
		*/
		this.fatal = void 0;
		/**
		* Path of a file (used throughout the `VFile` ecosystem).
		*
		* @type {string | undefined}
		*/
		this.file = "";
		/**
		* Reason for message.
		*
		* @type {string}
		*/
		this.message = reason;
		/**
		* Starting line of error.
		*
		* @type {number | undefined}
		*/
		this.line = start ? start.line : void 0;
		/**
		* Serialized positional info of message.
		*
		* On normal errors, this would be something like `ParseError`, buit in
		* `VFile` messages we use this space to show where an error happened.
		*/
		this.name = stringifyPosition(options.place) || "1:1";
		/**
		* Place of message.
		*
		* @type {Point | Position | undefined}
		*/
		this.place = options.place || void 0;
		/**
		* Reason for message, should use markdown.
		*
		* @type {string}
		*/
		this.reason = this.message;
		/**
		* Category of message (example: `'my-rule'`).
		*
		* @type {string | undefined}
		*/
		this.ruleId = options.ruleId || void 0;
		/**
		* Namespace of message (example: `'my-package'`).
		*
		* @type {string | undefined}
		*/
		this.source = options.source || void 0;
		/**
		* Stack of message.
		*
		* This is used by normal errors to show where something happened in
		* programming code, irrelevant for `VFile` messages,
		*
		* @type {string}
		*/
		this.stack = legacyCause && options.cause && typeof options.cause.stack === "string" ? options.cause.stack : "";
		/**
		* Specify the source value that’s being reported, which is deemed
		* incorrect.
		*
		* @type {string | undefined}
		*/
		this.actual = void 0;
		/**
		* Suggest acceptable values that can be used instead of `actual`.
		*
		* @type {Array<string> | undefined}
		*/
		this.expected = void 0;
		/**
		* Long form description of the message (you should use markdown).
		*
		* @type {string | undefined}
		*/
		this.note = void 0;
		/**
		* Link to docs for the message.
		*
		* > 👉 **Note**: this must be an absolute URL that can be passed as `x`
		* > to `new URL(x)`.
		*
		* @type {string | undefined}
		*/
		this.url = void 0;
	}
};
VFileMessage.prototype.file = "";
VFileMessage.prototype.name = "";
VFileMessage.prototype.reason = "";
VFileMessage.prototype.message = "";
VFileMessage.prototype.stack = "";
VFileMessage.prototype.column = void 0;
VFileMessage.prototype.line = void 0;
VFileMessage.prototype.ancestors = void 0;
VFileMessage.prototype.cause = void 0;
VFileMessage.prototype.fatal = void 0;
VFileMessage.prototype.place = void 0;
VFileMessage.prototype.ruleId = void 0;
VFileMessage.prototype.source = void 0;

//#endregion
//#region node_modules/hast-util-to-jsx-runtime/lib/index.js
var import_cjs = /* @__PURE__ */ __toESM(require_cjs(), 1);
const own$8 = {}.hasOwnProperty;
/** @type {Map<string, number>} */
const emptyMap = /* @__PURE__ */ new Map();
const cap = /[A-Z]/g;
const tableElements = new Set([
	"table",
	"tbody",
	"thead",
	"tfoot",
	"tr"
]);
const tableCellElement = new Set(["td", "th"]);
const docs = "https://github.com/syntax-tree/hast-util-to-jsx-runtime";
/**
* Transform a hast tree to preact, react, solid, svelte, vue, etc.,
* with an automatic JSX runtime.
*
* @param {Nodes} tree
*   Tree to transform.
* @param {Options} options
*   Configuration (required).
* @returns {JsxElement}
*   JSX element.
*/
function toJsxRuntime(tree, options) {
	if (!options || options.Fragment === void 0) throw new TypeError("Expected `Fragment` in options");
	const filePath = options.filePath || void 0;
	/** @type {Create} */
	let create$1;
	if (options.development) {
		if (typeof options.jsxDEV !== "function") throw new TypeError("Expected `jsxDEV` in options when `development: true`");
		create$1 = developmentCreate(filePath, options.jsxDEV);
	} else {
		if (typeof options.jsx !== "function") throw new TypeError("Expected `jsx` in production options");
		if (typeof options.jsxs !== "function") throw new TypeError("Expected `jsxs` in production options");
		create$1 = productionCreate(filePath, options.jsx, options.jsxs);
	}
	/** @type {State} */
	const state = {
		Fragment: options.Fragment,
		ancestors: [],
		components: options.components || {},
		create: create$1,
		elementAttributeNameCase: options.elementAttributeNameCase || "react",
		evaluater: options.createEvaluater ? options.createEvaluater() : void 0,
		filePath,
		ignoreInvalidStyle: options.ignoreInvalidStyle || false,
		passKeys: options.passKeys !== false,
		passNode: options.passNode || false,
		schema: options.space === "svg" ? svg : html$1,
		stylePropertyNameCase: options.stylePropertyNameCase || "dom",
		tableCellAlignToStyle: options.tableCellAlignToStyle !== false
	};
	const result = one$3(state, tree, void 0);
	if (result && typeof result !== "string") return result;
	return state.create(tree, state.Fragment, { children: result || void 0 }, void 0);
}
/**
* Transform a node.
*
* @param {State} state
*   Info passed around.
* @param {Nodes} node
*   Current node.
* @param {string | undefined} key
*   Key.
* @returns {Child | undefined}
*   Child, optional.
*/
function one$3(state, node$1, key) {
	if (node$1.type === "element") return element$4(state, node$1, key);
	if (node$1.type === "mdxFlowExpression" || node$1.type === "mdxTextExpression") return mdxExpression(state, node$1);
	if (node$1.type === "mdxJsxFlowElement" || node$1.type === "mdxJsxTextElement") return mdxJsxElement(state, node$1, key);
	if (node$1.type === "mdxjsEsm") return mdxEsm(state, node$1);
	if (node$1.type === "root") return root$5(state, node$1, key);
	if (node$1.type === "text") return text$8(state, node$1);
}
/**
* Handle element.
*
* @param {State} state
*   Info passed around.
* @param {Element} node
*   Current node.
* @param {string | undefined} key
*   Key.
* @returns {Child | undefined}
*   Child, optional.
*/
function element$4(state, node$1, key) {
	const parentSchema = state.schema;
	let schema = parentSchema;
	if (node$1.tagName.toLowerCase() === "svg" && parentSchema.space === "html") {
		schema = svg;
		state.schema = schema;
	}
	state.ancestors.push(node$1);
	const type = findComponentFromName(state, node$1.tagName, false);
	const props = createElementProps(state, node$1);
	let children$1 = createChildren(state, node$1);
	if (tableElements.has(node$1.tagName)) children$1 = children$1.filter(function(child) {
		return typeof child === "string" ? !whitespace(child) : true;
	});
	addNode(state, props, type, node$1);
	addChildren(props, children$1);
	state.ancestors.pop();
	state.schema = parentSchema;
	return state.create(node$1, type, props, key);
}
/**
* Handle MDX expression.
*
* @param {State} state
*   Info passed around.
* @param {MdxFlowExpressionHast | MdxTextExpressionHast} node
*   Current node.
* @returns {Child | undefined}
*   Child, optional.
*/
function mdxExpression(state, node$1) {
	if (node$1.data && node$1.data.estree && state.evaluater) {
		const expression = node$1.data.estree.body[0];
		/* @__PURE__ */ ok(expression.type === "ExpressionStatement");
		return state.evaluater.evaluateExpression(expression.expression);
	}
	crashEstree(state, node$1.position);
}
/**
* Handle MDX ESM.
*
* @param {State} state
*   Info passed around.
* @param {MdxjsEsmHast} node
*   Current node.
* @returns {Child | undefined}
*   Child, optional.
*/
function mdxEsm(state, node$1) {
	if (node$1.data && node$1.data.estree && state.evaluater) return state.evaluater.evaluateProgram(node$1.data.estree);
	crashEstree(state, node$1.position);
}
/**
* Handle MDX JSX.
*
* @param {State} state
*   Info passed around.
* @param {MdxJsxFlowElementHast | MdxJsxTextElementHast} node
*   Current node.
* @param {string | undefined} key
*   Key.
* @returns {Child | undefined}
*   Child, optional.
*/
function mdxJsxElement(state, node$1, key) {
	const parentSchema = state.schema;
	let schema = parentSchema;
	if (node$1.name === "svg" && parentSchema.space === "html") {
		schema = svg;
		state.schema = schema;
	}
	state.ancestors.push(node$1);
	const type = node$1.name === null ? state.Fragment : findComponentFromName(state, node$1.name, true);
	const props = createJsxElementProps(state, node$1);
	const children$1 = createChildren(state, node$1);
	addNode(state, props, type, node$1);
	addChildren(props, children$1);
	state.ancestors.pop();
	state.schema = parentSchema;
	return state.create(node$1, type, props, key);
}
/**
* Handle root.
*
* @param {State} state
*   Info passed around.
* @param {Root} node
*   Current node.
* @param {string | undefined} key
*   Key.
* @returns {Child | undefined}
*   Child, optional.
*/
function root$5(state, node$1, key) {
	/** @type {Props} */
	const props = {};
	addChildren(props, createChildren(state, node$1));
	return state.create(node$1, state.Fragment, props, key);
}
/**
* Handle text.
*
* @param {State} _
*   Info passed around.
* @param {Text} node
*   Current node.
* @returns {Child | undefined}
*   Child, optional.
*/
function text$8(_, node$1) {
	return node$1.value;
}
/**
* Add `node` to props.
*
* @param {State} state
*   Info passed around.
* @param {Props} props
*   Props.
* @param {unknown} type
*   Type.
* @param {Element | MdxJsxFlowElementHast | MdxJsxTextElementHast} node
*   Node.
* @returns {undefined}
*   Nothing.
*/
function addNode(state, props, type, node$1) {
	if (typeof type !== "string" && type !== state.Fragment && state.passNode) props.node = node$1;
}
/**
* Add children to props.
*
* @param {Props} props
*   Props.
* @param {Array<Child>} children
*   Children.
* @returns {undefined}
*   Nothing.
*/
function addChildren(props, children$1) {
	if (children$1.length > 0) {
		const value = children$1.length > 1 ? children$1 : children$1[0];
		if (value) props.children = value;
	}
}
/**
* @param {string | undefined} _
*   Path to file.
* @param {Jsx} jsx
*   Dynamic.
* @param {Jsx} jsxs
*   Static.
* @returns {Create}
*   Create a production element.
*/
function productionCreate(_, jsx$1, jsxs$1) {
	return create$1;
	/** @type {Create} */
	function create$1(_$1, type, props, key) {
		const fn = Array.isArray(props.children) ? jsxs$1 : jsx$1;
		return key ? fn(type, props, key) : fn(type, props);
	}
}
/**
* @param {string | undefined} filePath
*   Path to file.
* @param {JsxDev} jsxDEV
*   Development.
* @returns {Create}
*   Create a development element.
*/
function developmentCreate(filePath, jsxDEV) {
	return create$1;
	/** @type {Create} */
	function create$1(node$1, type, props, key) {
		const isStaticChildren = Array.isArray(props.children);
		const point$4 = pointStart(node$1);
		return jsxDEV(type, props, key, isStaticChildren, {
			columnNumber: point$4 ? point$4.column - 1 : void 0,
			fileName: filePath,
			lineNumber: point$4 ? point$4.line : void 0
		}, void 0);
	}
}
/**
* Create props from an element.
*
* @param {State} state
*   Info passed around.
* @param {Element} node
*   Current element.
* @returns {Props}
*   Props.
*/
function createElementProps(state, node$1) {
	/** @type {Props} */
	const props = {};
	/** @type {string | undefined} */
	let alignValue;
	/** @type {string} */
	let prop;
	for (prop in node$1.properties) if (prop !== "children" && own$8.call(node$1.properties, prop)) {
		const result = createProperty$1(state, prop, node$1.properties[prop]);
		if (result) {
			const [key, value] = result;
			if (state.tableCellAlignToStyle && key === "align" && typeof value === "string" && tableCellElement.has(node$1.tagName)) alignValue = value;
			else props[key] = value;
		}
	}
	if (alignValue) {
		const style$1 = props.style || (props.style = {});
		style$1[state.stylePropertyNameCase === "css" ? "text-align" : "textAlign"] = alignValue;
	}
	return props;
}
/**
* Create props from a JSX element.
*
* @param {State} state
*   Info passed around.
* @param {MdxJsxFlowElementHast | MdxJsxTextElementHast} node
*   Current JSX element.
* @returns {Props}
*   Props.
*/
function createJsxElementProps(state, node$1) {
	/** @type {Props} */
	const props = {};
	for (const attribute of node$1.attributes) if (attribute.type === "mdxJsxExpressionAttribute") if (attribute.data && attribute.data.estree && state.evaluater) {
		const expression = attribute.data.estree.body[0];
		/* @__PURE__ */ ok(expression.type === "ExpressionStatement");
		const objectExpression = expression.expression;
		/* @__PURE__ */ ok(objectExpression.type === "ObjectExpression");
		const property = objectExpression.properties[0];
		/* @__PURE__ */ ok(property.type === "SpreadElement");
		Object.assign(props, state.evaluater.evaluateExpression(property.argument));
	} else crashEstree(state, node$1.position);
	else {
		const name$1 = attribute.name;
		/** @type {unknown} */
		let value;
		if (attribute.value && typeof attribute.value === "object") if (attribute.value.data && attribute.value.data.estree && state.evaluater) {
			const expression = attribute.value.data.estree.body[0];
			/* @__PURE__ */ ok(expression.type === "ExpressionStatement");
			value = state.evaluater.evaluateExpression(expression.expression);
		} else crashEstree(state, node$1.position);
		else value = attribute.value === null ? true : attribute.value;
		props[name$1] = value;
	}
	return props;
}
/**
* Create children.
*
* @param {State} state
*   Info passed around.
* @param {Parents} node
*   Current element.
* @returns {Array<Child>}
*   Children.
*/
function createChildren(state, node$1) {
	/** @type {Array<Child>} */
	const children$1 = [];
	let index$2 = -1;
	/** @type {Map<string, number>} */
	/* c8 ignore next */
	const countsByName = state.passKeys ? /* @__PURE__ */ new Map() : emptyMap;
	while (++index$2 < node$1.children.length) {
		const child = node$1.children[index$2];
		/** @type {string | undefined} */
		let key;
		if (state.passKeys) {
			const name$1 = child.type === "element" ? child.tagName : child.type === "mdxJsxFlowElement" || child.type === "mdxJsxTextElement" ? child.name : void 0;
			if (name$1) {
				const count = countsByName.get(name$1) || 0;
				key = name$1 + "-" + count;
				countsByName.set(name$1, count + 1);
			}
		}
		const result = one$3(state, child, key);
		if (result !== void 0) children$1.push(result);
	}
	return children$1;
}
/**
* Handle a property.
*
* @param {State} state
*   Info passed around.
* @param {string} prop
*   Key.
* @param {Array<number | string> | boolean | number | string | null | undefined} value
*   hast property value.
* @returns {Field | undefined}
*   Field for runtime, optional.
*/
function createProperty$1(state, prop, value) {
	const info = find(state.schema, prop);
	if (value === null || value === void 0 || typeof value === "number" && Number.isNaN(value)) return;
	if (Array.isArray(value)) value = info.commaSeparated ? stringify(value) : stringify$1(value);
	if (info.property === "style") {
		let styleObject = typeof value === "object" ? value : parseStyle(state, String(value));
		if (state.stylePropertyNameCase === "css") styleObject = transformStylesToCssCasing(styleObject);
		return ["style", styleObject];
	}
	return [state.elementAttributeNameCase === "react" && info.space ? hastToReact[info.property] || info.property : info.attribute, value];
}
/**
* Parse a CSS declaration to an object.
*
* @param {State} state
*   Info passed around.
* @param {string} value
*   CSS declarations.
* @returns {Style}
*   Properties.
* @throws
*   Throws `VFileMessage` when CSS cannot be parsed.
*/
function parseStyle(state, value) {
	try {
		return (0, import_cjs.default)(value, { reactCompat: true });
	} catch (error) {
		if (state.ignoreInvalidStyle) return {};
		const cause = error;
		const message = new VFileMessage("Cannot parse `style` attribute", {
			ancestors: state.ancestors,
			cause,
			ruleId: "style",
			source: "hast-util-to-jsx-runtime"
		});
		message.file = state.filePath || void 0;
		message.url = docs + "#cannot-parse-style-attribute";
		throw message;
	}
}
/**
* Create a JSX name from a string.
*
* @param {State} state
*   To do.
* @param {string} name
*   Name.
* @param {boolean} allowExpression
*   Allow member expressions and identifiers.
* @returns {unknown}
*   To do.
*/
function findComponentFromName(state, name$1, allowExpression) {
	/** @type {Identifier | Literal | MemberExpression} */
	let result;
	if (!allowExpression) result = {
		type: "Literal",
		value: name$1
	};
	else if (name$1.includes(".")) {
		const identifiers = name$1.split(".");
		let index$2 = -1;
		/** @type {Identifier | Literal | MemberExpression | undefined} */
		let node$1;
		while (++index$2 < identifiers.length) {
			/** @type {Identifier | Literal} */
			const prop = name(identifiers[index$2]) ? {
				type: "Identifier",
				name: identifiers[index$2]
			} : {
				type: "Literal",
				value: identifiers[index$2]
			};
			node$1 = node$1 ? {
				type: "MemberExpression",
				object: node$1,
				property: prop,
				computed: Boolean(index$2 && prop.type === "Literal"),
				optional: false
			} : prop;
		}
		/* @__PURE__ */ ok(node$1, "always a result");
		result = node$1;
	} else result = name(name$1) && !/^[a-z]/.test(name$1) ? {
		type: "Identifier",
		name: name$1
	} : {
		type: "Literal",
		value: name$1
	};
	if (result.type === "Literal") {
		const name$2 = result.value;
		return own$8.call(state.components, name$2) ? state.components[name$2] : name$2;
	}
	if (state.evaluater) return state.evaluater.evaluateExpression(result);
	crashEstree(state);
}
/**
* @param {State} state
* @param {Position | undefined} [place]
* @returns {never}
*/
function crashEstree(state, place) {
	const message = new VFileMessage("Cannot handle MDX estrees without `createEvaluater`", {
		ancestors: state.ancestors,
		place,
		ruleId: "mdx-estree",
		source: "hast-util-to-jsx-runtime"
	});
	message.file = state.filePath || void 0;
	message.url = docs + "#cannot-handle-mdx-estrees-without-createevaluater";
	throw message;
}
/**
* Transform a DOM casing style object to a CSS casing style object.
*
* @param {Style} domCasing
* @returns {Style}
*/
function transformStylesToCssCasing(domCasing) {
	/** @type {Style} */
	const cssCasing = {};
	/** @type {string} */
	let from;
	for (from in domCasing) if (own$8.call(domCasing, from)) cssCasing[transformStyleToCssCasing(from)] = domCasing[from];
	return cssCasing;
}
/**
* Transform a DOM casing style field to a CSS casing style field.
*
* @param {string} from
* @returns {string}
*/
function transformStyleToCssCasing(from) {
	let to = from.replace(cap, toDash);
	if (to.slice(0, 3) === "ms-") to = "-" + to;
	return to;
}
/**
* Make `$0` dash cased.
*
* @param {string} $0
*   Capitalized ASCII leter.
* @returns {string}
*   Dash and lower letter.
*/
function toDash($0) {
	return "-" + $0.toLowerCase();
}

//#endregion
//#region node_modules/html-url-attributes/lib/index.js
/**
* HTML URL properties.
*
* Each key is a property name and each value is a list of tag names it applies
* to or `null` if it applies to all elements.
*
* @type {Record<string, Array<string> | null>}
*/
const urlAttributes = {
	action: ["form"],
	cite: [
		"blockquote",
		"del",
		"ins",
		"q"
	],
	data: ["object"],
	formAction: ["button", "input"],
	href: [
		"a",
		"area",
		"base",
		"link"
	],
	icon: ["menuitem"],
	itemId: null,
	manifest: ["html"],
	ping: ["a", "area"],
	poster: ["video"],
	src: [
		"audio",
		"embed",
		"iframe",
		"img",
		"input",
		"script",
		"source",
		"track",
		"video"
	]
};

//#endregion
//#region node_modules/mdast-util-to-string/lib/index.js
/**
* @typedef {import('mdast').Nodes} Nodes
*
* @typedef Options
*   Configuration (optional).
* @property {boolean | null | undefined} [includeImageAlt=true]
*   Whether to use `alt` for `image`s (default: `true`).
* @property {boolean | null | undefined} [includeHtml=true]
*   Whether to use `value` of HTML (default: `true`).
*/
/** @type {Options} */
const emptyOptions$3 = {};
/**
* Get the text content of a node or list of nodes.
*
* Prefers the node’s plain-text fields, otherwise serializes its children,
* and if the given value is an array, serialize the nodes in it.
*
* @param {unknown} [value]
*   Thing to serialize, typically `Node`.
* @param {Options | null | undefined} [options]
*   Configuration (optional).
* @returns {string}
*   Serialized `value`.
*/
function toString(value, options) {
	const settings = options || emptyOptions$3;
	return one$2(value, typeof settings.includeImageAlt === "boolean" ? settings.includeImageAlt : true, typeof settings.includeHtml === "boolean" ? settings.includeHtml : true);
}
/**
* One node or several nodes.
*
* @param {unknown} value
*   Thing to serialize.
* @param {boolean} includeImageAlt
*   Include image `alt`s.
* @param {boolean} includeHtml
*   Include HTML.
* @returns {string}
*   Serialized node.
*/
function one$2(value, includeImageAlt, includeHtml) {
	if (node(value)) {
		if ("value" in value) return value.type === "html" && !includeHtml ? "" : value.value;
		if (includeImageAlt && "alt" in value && value.alt) return value.alt;
		if ("children" in value) return all$3(value.children, includeImageAlt, includeHtml);
	}
	if (Array.isArray(value)) return all$3(value, includeImageAlt, includeHtml);
	return "";
}
/**
* Serialize a list of nodes.
*
* @param {Array<unknown>} values
*   Thing to serialize.
* @param {boolean} includeImageAlt
*   Include image `alt`s.
* @param {boolean} includeHtml
*   Include HTML.
* @returns {string}
*   Serialized nodes.
*/
function all$3(values, includeImageAlt, includeHtml) {
	/** @type {Array<string>} */
	const result = [];
	let index$2 = -1;
	while (++index$2 < values.length) result[index$2] = one$2(values[index$2], includeImageAlt, includeHtml);
	return result.join("");
}
/**
* Check if `value` looks like a node.
*
* @param {unknown} value
*   Thing.
* @returns {value is Nodes}
*   Whether `value` is a node.
*/
function node(value) {
	return Boolean(value && typeof value === "object");
}

//#endregion
//#region node_modules/character-entities/index.js
/**
* Map of named character references.
*
* @type {Record<string, string>}
*/
const characterEntities = {
	AElig: "Æ",
	AMP: "&",
	Aacute: "Á",
	Abreve: "Ă",
	Acirc: "Â",
	Acy: "А",
	Afr: "𝔄",
	Agrave: "À",
	Alpha: "Α",
	Amacr: "Ā",
	And: "⩓",
	Aogon: "Ą",
	Aopf: "𝔸",
	ApplyFunction: "⁡",
	Aring: "Å",
	Ascr: "𝒜",
	Assign: "≔",
	Atilde: "Ã",
	Auml: "Ä",
	Backslash: "∖",
	Barv: "⫧",
	Barwed: "⌆",
	Bcy: "Б",
	Because: "∵",
	Bernoullis: "ℬ",
	Beta: "Β",
	Bfr: "𝔅",
	Bopf: "𝔹",
	Breve: "˘",
	Bscr: "ℬ",
	Bumpeq: "≎",
	CHcy: "Ч",
	COPY: "©",
	Cacute: "Ć",
	Cap: "⋒",
	CapitalDifferentialD: "ⅅ",
	Cayleys: "ℭ",
	Ccaron: "Č",
	Ccedil: "Ç",
	Ccirc: "Ĉ",
	Cconint: "∰",
	Cdot: "Ċ",
	Cedilla: "¸",
	CenterDot: "·",
	Cfr: "ℭ",
	Chi: "Χ",
	CircleDot: "⊙",
	CircleMinus: "⊖",
	CirclePlus: "⊕",
	CircleTimes: "⊗",
	ClockwiseContourIntegral: "∲",
	CloseCurlyDoubleQuote: "”",
	CloseCurlyQuote: "’",
	Colon: "∷",
	Colone: "⩴",
	Congruent: "≡",
	Conint: "∯",
	ContourIntegral: "∮",
	Copf: "ℂ",
	Coproduct: "∐",
	CounterClockwiseContourIntegral: "∳",
	Cross: "⨯",
	Cscr: "𝒞",
	Cup: "⋓",
	CupCap: "≍",
	DD: "ⅅ",
	DDotrahd: "⤑",
	DJcy: "Ђ",
	DScy: "Ѕ",
	DZcy: "Џ",
	Dagger: "‡",
	Darr: "↡",
	Dashv: "⫤",
	Dcaron: "Ď",
	Dcy: "Д",
	Del: "∇",
	Delta: "Δ",
	Dfr: "𝔇",
	DiacriticalAcute: "´",
	DiacriticalDot: "˙",
	DiacriticalDoubleAcute: "˝",
	DiacriticalGrave: "`",
	DiacriticalTilde: "˜",
	Diamond: "⋄",
	DifferentialD: "ⅆ",
	Dopf: "𝔻",
	Dot: "¨",
	DotDot: "⃜",
	DotEqual: "≐",
	DoubleContourIntegral: "∯",
	DoubleDot: "¨",
	DoubleDownArrow: "⇓",
	DoubleLeftArrow: "⇐",
	DoubleLeftRightArrow: "⇔",
	DoubleLeftTee: "⫤",
	DoubleLongLeftArrow: "⟸",
	DoubleLongLeftRightArrow: "⟺",
	DoubleLongRightArrow: "⟹",
	DoubleRightArrow: "⇒",
	DoubleRightTee: "⊨",
	DoubleUpArrow: "⇑",
	DoubleUpDownArrow: "⇕",
	DoubleVerticalBar: "∥",
	DownArrow: "↓",
	DownArrowBar: "⤓",
	DownArrowUpArrow: "⇵",
	DownBreve: "̑",
	DownLeftRightVector: "⥐",
	DownLeftTeeVector: "⥞",
	DownLeftVector: "↽",
	DownLeftVectorBar: "⥖",
	DownRightTeeVector: "⥟",
	DownRightVector: "⇁",
	DownRightVectorBar: "⥗",
	DownTee: "⊤",
	DownTeeArrow: "↧",
	Downarrow: "⇓",
	Dscr: "𝒟",
	Dstrok: "Đ",
	ENG: "Ŋ",
	ETH: "Ð",
	Eacute: "É",
	Ecaron: "Ě",
	Ecirc: "Ê",
	Ecy: "Э",
	Edot: "Ė",
	Efr: "𝔈",
	Egrave: "È",
	Element: "∈",
	Emacr: "Ē",
	EmptySmallSquare: "◻",
	EmptyVerySmallSquare: "▫",
	Eogon: "Ę",
	Eopf: "𝔼",
	Epsilon: "Ε",
	Equal: "⩵",
	EqualTilde: "≂",
	Equilibrium: "⇌",
	Escr: "ℰ",
	Esim: "⩳",
	Eta: "Η",
	Euml: "Ë",
	Exists: "∃",
	ExponentialE: "ⅇ",
	Fcy: "Ф",
	Ffr: "𝔉",
	FilledSmallSquare: "◼",
	FilledVerySmallSquare: "▪",
	Fopf: "𝔽",
	ForAll: "∀",
	Fouriertrf: "ℱ",
	Fscr: "ℱ",
	GJcy: "Ѓ",
	GT: ">",
	Gamma: "Γ",
	Gammad: "Ϝ",
	Gbreve: "Ğ",
	Gcedil: "Ģ",
	Gcirc: "Ĝ",
	Gcy: "Г",
	Gdot: "Ġ",
	Gfr: "𝔊",
	Gg: "⋙",
	Gopf: "𝔾",
	GreaterEqual: "≥",
	GreaterEqualLess: "⋛",
	GreaterFullEqual: "≧",
	GreaterGreater: "⪢",
	GreaterLess: "≷",
	GreaterSlantEqual: "⩾",
	GreaterTilde: "≳",
	Gscr: "𝒢",
	Gt: "≫",
	HARDcy: "Ъ",
	Hacek: "ˇ",
	Hat: "^",
	Hcirc: "Ĥ",
	Hfr: "ℌ",
	HilbertSpace: "ℋ",
	Hopf: "ℍ",
	HorizontalLine: "─",
	Hscr: "ℋ",
	Hstrok: "Ħ",
	HumpDownHump: "≎",
	HumpEqual: "≏",
	IEcy: "Е",
	IJlig: "Ĳ",
	IOcy: "Ё",
	Iacute: "Í",
	Icirc: "Î",
	Icy: "И",
	Idot: "İ",
	Ifr: "ℑ",
	Igrave: "Ì",
	Im: "ℑ",
	Imacr: "Ī",
	ImaginaryI: "ⅈ",
	Implies: "⇒",
	Int: "∬",
	Integral: "∫",
	Intersection: "⋂",
	InvisibleComma: "⁣",
	InvisibleTimes: "⁢",
	Iogon: "Į",
	Iopf: "𝕀",
	Iota: "Ι",
	Iscr: "ℐ",
	Itilde: "Ĩ",
	Iukcy: "І",
	Iuml: "Ï",
	Jcirc: "Ĵ",
	Jcy: "Й",
	Jfr: "𝔍",
	Jopf: "𝕁",
	Jscr: "𝒥",
	Jsercy: "Ј",
	Jukcy: "Є",
	KHcy: "Х",
	KJcy: "Ќ",
	Kappa: "Κ",
	Kcedil: "Ķ",
	Kcy: "К",
	Kfr: "𝔎",
	Kopf: "𝕂",
	Kscr: "𝒦",
	LJcy: "Љ",
	LT: "<",
	Lacute: "Ĺ",
	Lambda: "Λ",
	Lang: "⟪",
	Laplacetrf: "ℒ",
	Larr: "↞",
	Lcaron: "Ľ",
	Lcedil: "Ļ",
	Lcy: "Л",
	LeftAngleBracket: "⟨",
	LeftArrow: "←",
	LeftArrowBar: "⇤",
	LeftArrowRightArrow: "⇆",
	LeftCeiling: "⌈",
	LeftDoubleBracket: "⟦",
	LeftDownTeeVector: "⥡",
	LeftDownVector: "⇃",
	LeftDownVectorBar: "⥙",
	LeftFloor: "⌊",
	LeftRightArrow: "↔",
	LeftRightVector: "⥎",
	LeftTee: "⊣",
	LeftTeeArrow: "↤",
	LeftTeeVector: "⥚",
	LeftTriangle: "⊲",
	LeftTriangleBar: "⧏",
	LeftTriangleEqual: "⊴",
	LeftUpDownVector: "⥑",
	LeftUpTeeVector: "⥠",
	LeftUpVector: "↿",
	LeftUpVectorBar: "⥘",
	LeftVector: "↼",
	LeftVectorBar: "⥒",
	Leftarrow: "⇐",
	Leftrightarrow: "⇔",
	LessEqualGreater: "⋚",
	LessFullEqual: "≦",
	LessGreater: "≶",
	LessLess: "⪡",
	LessSlantEqual: "⩽",
	LessTilde: "≲",
	Lfr: "𝔏",
	Ll: "⋘",
	Lleftarrow: "⇚",
	Lmidot: "Ŀ",
	LongLeftArrow: "⟵",
	LongLeftRightArrow: "⟷",
	LongRightArrow: "⟶",
	Longleftarrow: "⟸",
	Longleftrightarrow: "⟺",
	Longrightarrow: "⟹",
	Lopf: "𝕃",
	LowerLeftArrow: "↙",
	LowerRightArrow: "↘",
	Lscr: "ℒ",
	Lsh: "↰",
	Lstrok: "Ł",
	Lt: "≪",
	Map: "⤅",
	Mcy: "М",
	MediumSpace: " ",
	Mellintrf: "ℳ",
	Mfr: "𝔐",
	MinusPlus: "∓",
	Mopf: "𝕄",
	Mscr: "ℳ",
	Mu: "Μ",
	NJcy: "Њ",
	Nacute: "Ń",
	Ncaron: "Ň",
	Ncedil: "Ņ",
	Ncy: "Н",
	NegativeMediumSpace: "​",
	NegativeThickSpace: "​",
	NegativeThinSpace: "​",
	NegativeVeryThinSpace: "​",
	NestedGreaterGreater: "≫",
	NestedLessLess: "≪",
	NewLine: "\n",
	Nfr: "𝔑",
	NoBreak: "⁠",
	NonBreakingSpace: "\xA0",
	Nopf: "ℕ",
	Not: "⫬",
	NotCongruent: "≢",
	NotCupCap: "≭",
	NotDoubleVerticalBar: "∦",
	NotElement: "∉",
	NotEqual: "≠",
	NotEqualTilde: "≂̸",
	NotExists: "∄",
	NotGreater: "≯",
	NotGreaterEqual: "≱",
	NotGreaterFullEqual: "≧̸",
	NotGreaterGreater: "≫̸",
	NotGreaterLess: "≹",
	NotGreaterSlantEqual: "⩾̸",
	NotGreaterTilde: "≵",
	NotHumpDownHump: "≎̸",
	NotHumpEqual: "≏̸",
	NotLeftTriangle: "⋪",
	NotLeftTriangleBar: "⧏̸",
	NotLeftTriangleEqual: "⋬",
	NotLess: "≮",
	NotLessEqual: "≰",
	NotLessGreater: "≸",
	NotLessLess: "≪̸",
	NotLessSlantEqual: "⩽̸",
	NotLessTilde: "≴",
	NotNestedGreaterGreater: "⪢̸",
	NotNestedLessLess: "⪡̸",
	NotPrecedes: "⊀",
	NotPrecedesEqual: "⪯̸",
	NotPrecedesSlantEqual: "⋠",
	NotReverseElement: "∌",
	NotRightTriangle: "⋫",
	NotRightTriangleBar: "⧐̸",
	NotRightTriangleEqual: "⋭",
	NotSquareSubset: "⊏̸",
	NotSquareSubsetEqual: "⋢",
	NotSquareSuperset: "⊐̸",
	NotSquareSupersetEqual: "⋣",
	NotSubset: "⊂⃒",
	NotSubsetEqual: "⊈",
	NotSucceeds: "⊁",
	NotSucceedsEqual: "⪰̸",
	NotSucceedsSlantEqual: "⋡",
	NotSucceedsTilde: "≿̸",
	NotSuperset: "⊃⃒",
	NotSupersetEqual: "⊉",
	NotTilde: "≁",
	NotTildeEqual: "≄",
	NotTildeFullEqual: "≇",
	NotTildeTilde: "≉",
	NotVerticalBar: "∤",
	Nscr: "𝒩",
	Ntilde: "Ñ",
	Nu: "Ν",
	OElig: "Œ",
	Oacute: "Ó",
	Ocirc: "Ô",
	Ocy: "О",
	Odblac: "Ő",
	Ofr: "𝔒",
	Ograve: "Ò",
	Omacr: "Ō",
	Omega: "Ω",
	Omicron: "Ο",
	Oopf: "𝕆",
	OpenCurlyDoubleQuote: "“",
	OpenCurlyQuote: "‘",
	Or: "⩔",
	Oscr: "𝒪",
	Oslash: "Ø",
	Otilde: "Õ",
	Otimes: "⨷",
	Ouml: "Ö",
	OverBar: "‾",
	OverBrace: "⏞",
	OverBracket: "⎴",
	OverParenthesis: "⏜",
	PartialD: "∂",
	Pcy: "П",
	Pfr: "𝔓",
	Phi: "Φ",
	Pi: "Π",
	PlusMinus: "±",
	Poincareplane: "ℌ",
	Popf: "ℙ",
	Pr: "⪻",
	Precedes: "≺",
	PrecedesEqual: "⪯",
	PrecedesSlantEqual: "≼",
	PrecedesTilde: "≾",
	Prime: "″",
	Product: "∏",
	Proportion: "∷",
	Proportional: "∝",
	Pscr: "𝒫",
	Psi: "Ψ",
	QUOT: "\"",
	Qfr: "𝔔",
	Qopf: "ℚ",
	Qscr: "𝒬",
	RBarr: "⤐",
	REG: "®",
	Racute: "Ŕ",
	Rang: "⟫",
	Rarr: "↠",
	Rarrtl: "⤖",
	Rcaron: "Ř",
	Rcedil: "Ŗ",
	Rcy: "Р",
	Re: "ℜ",
	ReverseElement: "∋",
	ReverseEquilibrium: "⇋",
	ReverseUpEquilibrium: "⥯",
	Rfr: "ℜ",
	Rho: "Ρ",
	RightAngleBracket: "⟩",
	RightArrow: "→",
	RightArrowBar: "⇥",
	RightArrowLeftArrow: "⇄",
	RightCeiling: "⌉",
	RightDoubleBracket: "⟧",
	RightDownTeeVector: "⥝",
	RightDownVector: "⇂",
	RightDownVectorBar: "⥕",
	RightFloor: "⌋",
	RightTee: "⊢",
	RightTeeArrow: "↦",
	RightTeeVector: "⥛",
	RightTriangle: "⊳",
	RightTriangleBar: "⧐",
	RightTriangleEqual: "⊵",
	RightUpDownVector: "⥏",
	RightUpTeeVector: "⥜",
	RightUpVector: "↾",
	RightUpVectorBar: "⥔",
	RightVector: "⇀",
	RightVectorBar: "⥓",
	Rightarrow: "⇒",
	Ropf: "ℝ",
	RoundImplies: "⥰",
	Rrightarrow: "⇛",
	Rscr: "ℛ",
	Rsh: "↱",
	RuleDelayed: "⧴",
	SHCHcy: "Щ",
	SHcy: "Ш",
	SOFTcy: "Ь",
	Sacute: "Ś",
	Sc: "⪼",
	Scaron: "Š",
	Scedil: "Ş",
	Scirc: "Ŝ",
	Scy: "С",
	Sfr: "𝔖",
	ShortDownArrow: "↓",
	ShortLeftArrow: "←",
	ShortRightArrow: "→",
	ShortUpArrow: "↑",
	Sigma: "Σ",
	SmallCircle: "∘",
	Sopf: "𝕊",
	Sqrt: "√",
	Square: "□",
	SquareIntersection: "⊓",
	SquareSubset: "⊏",
	SquareSubsetEqual: "⊑",
	SquareSuperset: "⊐",
	SquareSupersetEqual: "⊒",
	SquareUnion: "⊔",
	Sscr: "𝒮",
	Star: "⋆",
	Sub: "⋐",
	Subset: "⋐",
	SubsetEqual: "⊆",
	Succeeds: "≻",
	SucceedsEqual: "⪰",
	SucceedsSlantEqual: "≽",
	SucceedsTilde: "≿",
	SuchThat: "∋",
	Sum: "∑",
	Sup: "⋑",
	Superset: "⊃",
	SupersetEqual: "⊇",
	Supset: "⋑",
	THORN: "Þ",
	TRADE: "™",
	TSHcy: "Ћ",
	TScy: "Ц",
	Tab: "	",
	Tau: "Τ",
	Tcaron: "Ť",
	Tcedil: "Ţ",
	Tcy: "Т",
	Tfr: "𝔗",
	Therefore: "∴",
	Theta: "Θ",
	ThickSpace: "  ",
	ThinSpace: " ",
	Tilde: "∼",
	TildeEqual: "≃",
	TildeFullEqual: "≅",
	TildeTilde: "≈",
	Topf: "𝕋",
	TripleDot: "⃛",
	Tscr: "𝒯",
	Tstrok: "Ŧ",
	Uacute: "Ú",
	Uarr: "↟",
	Uarrocir: "⥉",
	Ubrcy: "Ў",
	Ubreve: "Ŭ",
	Ucirc: "Û",
	Ucy: "У",
	Udblac: "Ű",
	Ufr: "𝔘",
	Ugrave: "Ù",
	Umacr: "Ū",
	UnderBar: "_",
	UnderBrace: "⏟",
	UnderBracket: "⎵",
	UnderParenthesis: "⏝",
	Union: "⋃",
	UnionPlus: "⊎",
	Uogon: "Ų",
	Uopf: "𝕌",
	UpArrow: "↑",
	UpArrowBar: "⤒",
	UpArrowDownArrow: "⇅",
	UpDownArrow: "↕",
	UpEquilibrium: "⥮",
	UpTee: "⊥",
	UpTeeArrow: "↥",
	Uparrow: "⇑",
	Updownarrow: "⇕",
	UpperLeftArrow: "↖",
	UpperRightArrow: "↗",
	Upsi: "ϒ",
	Upsilon: "Υ",
	Uring: "Ů",
	Uscr: "𝒰",
	Utilde: "Ũ",
	Uuml: "Ü",
	VDash: "⊫",
	Vbar: "⫫",
	Vcy: "В",
	Vdash: "⊩",
	Vdashl: "⫦",
	Vee: "⋁",
	Verbar: "‖",
	Vert: "‖",
	VerticalBar: "∣",
	VerticalLine: "|",
	VerticalSeparator: "❘",
	VerticalTilde: "≀",
	VeryThinSpace: " ",
	Vfr: "𝔙",
	Vopf: "𝕍",
	Vscr: "𝒱",
	Vvdash: "⊪",
	Wcirc: "Ŵ",
	Wedge: "⋀",
	Wfr: "𝔚",
	Wopf: "𝕎",
	Wscr: "𝒲",
	Xfr: "𝔛",
	Xi: "Ξ",
	Xopf: "𝕏",
	Xscr: "𝒳",
	YAcy: "Я",
	YIcy: "Ї",
	YUcy: "Ю",
	Yacute: "Ý",
	Ycirc: "Ŷ",
	Ycy: "Ы",
	Yfr: "𝔜",
	Yopf: "𝕐",
	Yscr: "𝒴",
	Yuml: "Ÿ",
	ZHcy: "Ж",
	Zacute: "Ź",
	Zcaron: "Ž",
	Zcy: "З",
	Zdot: "Ż",
	ZeroWidthSpace: "​",
	Zeta: "Ζ",
	Zfr: "ℨ",
	Zopf: "ℤ",
	Zscr: "𝒵",
	aacute: "á",
	abreve: "ă",
	ac: "∾",
	acE: "∾̳",
	acd: "∿",
	acirc: "â",
	acute: "´",
	acy: "а",
	aelig: "æ",
	af: "⁡",
	afr: "𝔞",
	agrave: "à",
	alefsym: "ℵ",
	aleph: "ℵ",
	alpha: "α",
	amacr: "ā",
	amalg: "⨿",
	amp: "&",
	and: "∧",
	andand: "⩕",
	andd: "⩜",
	andslope: "⩘",
	andv: "⩚",
	ang: "∠",
	ange: "⦤",
	angle: "∠",
	angmsd: "∡",
	angmsdaa: "⦨",
	angmsdab: "⦩",
	angmsdac: "⦪",
	angmsdad: "⦫",
	angmsdae: "⦬",
	angmsdaf: "⦭",
	angmsdag: "⦮",
	angmsdah: "⦯",
	angrt: "∟",
	angrtvb: "⊾",
	angrtvbd: "⦝",
	angsph: "∢",
	angst: "Å",
	angzarr: "⍼",
	aogon: "ą",
	aopf: "𝕒",
	ap: "≈",
	apE: "⩰",
	apacir: "⩯",
	ape: "≊",
	apid: "≋",
	apos: "'",
	approx: "≈",
	approxeq: "≊",
	aring: "å",
	ascr: "𝒶",
	ast: "*",
	asymp: "≈",
	asympeq: "≍",
	atilde: "ã",
	auml: "ä",
	awconint: "∳",
	awint: "⨑",
	bNot: "⫭",
	backcong: "≌",
	backepsilon: "϶",
	backprime: "‵",
	backsim: "∽",
	backsimeq: "⋍",
	barvee: "⊽",
	barwed: "⌅",
	barwedge: "⌅",
	bbrk: "⎵",
	bbrktbrk: "⎶",
	bcong: "≌",
	bcy: "б",
	bdquo: "„",
	becaus: "∵",
	because: "∵",
	bemptyv: "⦰",
	bepsi: "϶",
	bernou: "ℬ",
	beta: "β",
	beth: "ℶ",
	between: "≬",
	bfr: "𝔟",
	bigcap: "⋂",
	bigcirc: "◯",
	bigcup: "⋃",
	bigodot: "⨀",
	bigoplus: "⨁",
	bigotimes: "⨂",
	bigsqcup: "⨆",
	bigstar: "★",
	bigtriangledown: "▽",
	bigtriangleup: "△",
	biguplus: "⨄",
	bigvee: "⋁",
	bigwedge: "⋀",
	bkarow: "⤍",
	blacklozenge: "⧫",
	blacksquare: "▪",
	blacktriangle: "▴",
	blacktriangledown: "▾",
	blacktriangleleft: "◂",
	blacktriangleright: "▸",
	blank: "␣",
	blk12: "▒",
	blk14: "░",
	blk34: "▓",
	block: "█",
	bne: "=⃥",
	bnequiv: "≡⃥",
	bnot: "⌐",
	bopf: "𝕓",
	bot: "⊥",
	bottom: "⊥",
	bowtie: "⋈",
	boxDL: "╗",
	boxDR: "╔",
	boxDl: "╖",
	boxDr: "╓",
	boxH: "═",
	boxHD: "╦",
	boxHU: "╩",
	boxHd: "╤",
	boxHu: "╧",
	boxUL: "╝",
	boxUR: "╚",
	boxUl: "╜",
	boxUr: "╙",
	boxV: "║",
	boxVH: "╬",
	boxVL: "╣",
	boxVR: "╠",
	boxVh: "╫",
	boxVl: "╢",
	boxVr: "╟",
	boxbox: "⧉",
	boxdL: "╕",
	boxdR: "╒",
	boxdl: "┐",
	boxdr: "┌",
	boxh: "─",
	boxhD: "╥",
	boxhU: "╨",
	boxhd: "┬",
	boxhu: "┴",
	boxminus: "⊟",
	boxplus: "⊞",
	boxtimes: "⊠",
	boxuL: "╛",
	boxuR: "╘",
	boxul: "┘",
	boxur: "└",
	boxv: "│",
	boxvH: "╪",
	boxvL: "╡",
	boxvR: "╞",
	boxvh: "┼",
	boxvl: "┤",
	boxvr: "├",
	bprime: "‵",
	breve: "˘",
	brvbar: "¦",
	bscr: "𝒷",
	bsemi: "⁏",
	bsim: "∽",
	bsime: "⋍",
	bsol: "\\",
	bsolb: "⧅",
	bsolhsub: "⟈",
	bull: "•",
	bullet: "•",
	bump: "≎",
	bumpE: "⪮",
	bumpe: "≏",
	bumpeq: "≏",
	cacute: "ć",
	cap: "∩",
	capand: "⩄",
	capbrcup: "⩉",
	capcap: "⩋",
	capcup: "⩇",
	capdot: "⩀",
	caps: "∩︀",
	caret: "⁁",
	caron: "ˇ",
	ccaps: "⩍",
	ccaron: "č",
	ccedil: "ç",
	ccirc: "ĉ",
	ccups: "⩌",
	ccupssm: "⩐",
	cdot: "ċ",
	cedil: "¸",
	cemptyv: "⦲",
	cent: "¢",
	centerdot: "·",
	cfr: "𝔠",
	chcy: "ч",
	check: "✓",
	checkmark: "✓",
	chi: "χ",
	cir: "○",
	cirE: "⧃",
	circ: "ˆ",
	circeq: "≗",
	circlearrowleft: "↺",
	circlearrowright: "↻",
	circledR: "®",
	circledS: "Ⓢ",
	circledast: "⊛",
	circledcirc: "⊚",
	circleddash: "⊝",
	cire: "≗",
	cirfnint: "⨐",
	cirmid: "⫯",
	cirscir: "⧂",
	clubs: "♣",
	clubsuit: "♣",
	colon: ":",
	colone: "≔",
	coloneq: "≔",
	comma: ",",
	commat: "@",
	comp: "∁",
	compfn: "∘",
	complement: "∁",
	complexes: "ℂ",
	cong: "≅",
	congdot: "⩭",
	conint: "∮",
	copf: "𝕔",
	coprod: "∐",
	copy: "©",
	copysr: "℗",
	crarr: "↵",
	cross: "✗",
	cscr: "𝒸",
	csub: "⫏",
	csube: "⫑",
	csup: "⫐",
	csupe: "⫒",
	ctdot: "⋯",
	cudarrl: "⤸",
	cudarrr: "⤵",
	cuepr: "⋞",
	cuesc: "⋟",
	cularr: "↶",
	cularrp: "⤽",
	cup: "∪",
	cupbrcap: "⩈",
	cupcap: "⩆",
	cupcup: "⩊",
	cupdot: "⊍",
	cupor: "⩅",
	cups: "∪︀",
	curarr: "↷",
	curarrm: "⤼",
	curlyeqprec: "⋞",
	curlyeqsucc: "⋟",
	curlyvee: "⋎",
	curlywedge: "⋏",
	curren: "¤",
	curvearrowleft: "↶",
	curvearrowright: "↷",
	cuvee: "⋎",
	cuwed: "⋏",
	cwconint: "∲",
	cwint: "∱",
	cylcty: "⌭",
	dArr: "⇓",
	dHar: "⥥",
	dagger: "†",
	daleth: "ℸ",
	darr: "↓",
	dash: "‐",
	dashv: "⊣",
	dbkarow: "⤏",
	dblac: "˝",
	dcaron: "ď",
	dcy: "д",
	dd: "ⅆ",
	ddagger: "‡",
	ddarr: "⇊",
	ddotseq: "⩷",
	deg: "°",
	delta: "δ",
	demptyv: "⦱",
	dfisht: "⥿",
	dfr: "𝔡",
	dharl: "⇃",
	dharr: "⇂",
	diam: "⋄",
	diamond: "⋄",
	diamondsuit: "♦",
	diams: "♦",
	die: "¨",
	digamma: "ϝ",
	disin: "⋲",
	div: "÷",
	divide: "÷",
	divideontimes: "⋇",
	divonx: "⋇",
	djcy: "ђ",
	dlcorn: "⌞",
	dlcrop: "⌍",
	dollar: "$",
	dopf: "𝕕",
	dot: "˙",
	doteq: "≐",
	doteqdot: "≑",
	dotminus: "∸",
	dotplus: "∔",
	dotsquare: "⊡",
	doublebarwedge: "⌆",
	downarrow: "↓",
	downdownarrows: "⇊",
	downharpoonleft: "⇃",
	downharpoonright: "⇂",
	drbkarow: "⤐",
	drcorn: "⌟",
	drcrop: "⌌",
	dscr: "𝒹",
	dscy: "ѕ",
	dsol: "⧶",
	dstrok: "đ",
	dtdot: "⋱",
	dtri: "▿",
	dtrif: "▾",
	duarr: "⇵",
	duhar: "⥯",
	dwangle: "⦦",
	dzcy: "џ",
	dzigrarr: "⟿",
	eDDot: "⩷",
	eDot: "≑",
	eacute: "é",
	easter: "⩮",
	ecaron: "ě",
	ecir: "≖",
	ecirc: "ê",
	ecolon: "≕",
	ecy: "э",
	edot: "ė",
	ee: "ⅇ",
	efDot: "≒",
	efr: "𝔢",
	eg: "⪚",
	egrave: "è",
	egs: "⪖",
	egsdot: "⪘",
	el: "⪙",
	elinters: "⏧",
	ell: "ℓ",
	els: "⪕",
	elsdot: "⪗",
	emacr: "ē",
	empty: "∅",
	emptyset: "∅",
	emptyv: "∅",
	emsp13: " ",
	emsp14: " ",
	emsp: " ",
	eng: "ŋ",
	ensp: " ",
	eogon: "ę",
	eopf: "𝕖",
	epar: "⋕",
	eparsl: "⧣",
	eplus: "⩱",
	epsi: "ε",
	epsilon: "ε",
	epsiv: "ϵ",
	eqcirc: "≖",
	eqcolon: "≕",
	eqsim: "≂",
	eqslantgtr: "⪖",
	eqslantless: "⪕",
	equals: "=",
	equest: "≟",
	equiv: "≡",
	equivDD: "⩸",
	eqvparsl: "⧥",
	erDot: "≓",
	erarr: "⥱",
	escr: "ℯ",
	esdot: "≐",
	esim: "≂",
	eta: "η",
	eth: "ð",
	euml: "ë",
	euro: "€",
	excl: "!",
	exist: "∃",
	expectation: "ℰ",
	exponentiale: "ⅇ",
	fallingdotseq: "≒",
	fcy: "ф",
	female: "♀",
	ffilig: "ﬃ",
	fflig: "ﬀ",
	ffllig: "ﬄ",
	ffr: "𝔣",
	filig: "ﬁ",
	fjlig: "fj",
	flat: "♭",
	fllig: "ﬂ",
	fltns: "▱",
	fnof: "ƒ",
	fopf: "𝕗",
	forall: "∀",
	fork: "⋔",
	forkv: "⫙",
	fpartint: "⨍",
	frac12: "½",
	frac13: "⅓",
	frac14: "¼",
	frac15: "⅕",
	frac16: "⅙",
	frac18: "⅛",
	frac23: "⅔",
	frac25: "⅖",
	frac34: "¾",
	frac35: "⅗",
	frac38: "⅜",
	frac45: "⅘",
	frac56: "⅚",
	frac58: "⅝",
	frac78: "⅞",
	frasl: "⁄",
	frown: "⌢",
	fscr: "𝒻",
	gE: "≧",
	gEl: "⪌",
	gacute: "ǵ",
	gamma: "γ",
	gammad: "ϝ",
	gap: "⪆",
	gbreve: "ğ",
	gcirc: "ĝ",
	gcy: "г",
	gdot: "ġ",
	ge: "≥",
	gel: "⋛",
	geq: "≥",
	geqq: "≧",
	geqslant: "⩾",
	ges: "⩾",
	gescc: "⪩",
	gesdot: "⪀",
	gesdoto: "⪂",
	gesdotol: "⪄",
	gesl: "⋛︀",
	gesles: "⪔",
	gfr: "𝔤",
	gg: "≫",
	ggg: "⋙",
	gimel: "ℷ",
	gjcy: "ѓ",
	gl: "≷",
	glE: "⪒",
	gla: "⪥",
	glj: "⪤",
	gnE: "≩",
	gnap: "⪊",
	gnapprox: "⪊",
	gne: "⪈",
	gneq: "⪈",
	gneqq: "≩",
	gnsim: "⋧",
	gopf: "𝕘",
	grave: "`",
	gscr: "ℊ",
	gsim: "≳",
	gsime: "⪎",
	gsiml: "⪐",
	gt: ">",
	gtcc: "⪧",
	gtcir: "⩺",
	gtdot: "⋗",
	gtlPar: "⦕",
	gtquest: "⩼",
	gtrapprox: "⪆",
	gtrarr: "⥸",
	gtrdot: "⋗",
	gtreqless: "⋛",
	gtreqqless: "⪌",
	gtrless: "≷",
	gtrsim: "≳",
	gvertneqq: "≩︀",
	gvnE: "≩︀",
	hArr: "⇔",
	hairsp: " ",
	half: "½",
	hamilt: "ℋ",
	hardcy: "ъ",
	harr: "↔",
	harrcir: "⥈",
	harrw: "↭",
	hbar: "ℏ",
	hcirc: "ĥ",
	hearts: "♥",
	heartsuit: "♥",
	hellip: "…",
	hercon: "⊹",
	hfr: "𝔥",
	hksearow: "⤥",
	hkswarow: "⤦",
	hoarr: "⇿",
	homtht: "∻",
	hookleftarrow: "↩",
	hookrightarrow: "↪",
	hopf: "𝕙",
	horbar: "―",
	hscr: "𝒽",
	hslash: "ℏ",
	hstrok: "ħ",
	hybull: "⁃",
	hyphen: "‐",
	iacute: "í",
	ic: "⁣",
	icirc: "î",
	icy: "и",
	iecy: "е",
	iexcl: "¡",
	iff: "⇔",
	ifr: "𝔦",
	igrave: "ì",
	ii: "ⅈ",
	iiiint: "⨌",
	iiint: "∭",
	iinfin: "⧜",
	iiota: "℩",
	ijlig: "ĳ",
	imacr: "ī",
	image: "ℑ",
	imagline: "ℐ",
	imagpart: "ℑ",
	imath: "ı",
	imof: "⊷",
	imped: "Ƶ",
	in: "∈",
	incare: "℅",
	infin: "∞",
	infintie: "⧝",
	inodot: "ı",
	int: "∫",
	intcal: "⊺",
	integers: "ℤ",
	intercal: "⊺",
	intlarhk: "⨗",
	intprod: "⨼",
	iocy: "ё",
	iogon: "į",
	iopf: "𝕚",
	iota: "ι",
	iprod: "⨼",
	iquest: "¿",
	iscr: "𝒾",
	isin: "∈",
	isinE: "⋹",
	isindot: "⋵",
	isins: "⋴",
	isinsv: "⋳",
	isinv: "∈",
	it: "⁢",
	itilde: "ĩ",
	iukcy: "і",
	iuml: "ï",
	jcirc: "ĵ",
	jcy: "й",
	jfr: "𝔧",
	jmath: "ȷ",
	jopf: "𝕛",
	jscr: "𝒿",
	jsercy: "ј",
	jukcy: "є",
	kappa: "κ",
	kappav: "ϰ",
	kcedil: "ķ",
	kcy: "к",
	kfr: "𝔨",
	kgreen: "ĸ",
	khcy: "х",
	kjcy: "ќ",
	kopf: "𝕜",
	kscr: "𝓀",
	lAarr: "⇚",
	lArr: "⇐",
	lAtail: "⤛",
	lBarr: "⤎",
	lE: "≦",
	lEg: "⪋",
	lHar: "⥢",
	lacute: "ĺ",
	laemptyv: "⦴",
	lagran: "ℒ",
	lambda: "λ",
	lang: "⟨",
	langd: "⦑",
	langle: "⟨",
	lap: "⪅",
	laquo: "«",
	larr: "←",
	larrb: "⇤",
	larrbfs: "⤟",
	larrfs: "⤝",
	larrhk: "↩",
	larrlp: "↫",
	larrpl: "⤹",
	larrsim: "⥳",
	larrtl: "↢",
	lat: "⪫",
	latail: "⤙",
	late: "⪭",
	lates: "⪭︀",
	lbarr: "⤌",
	lbbrk: "❲",
	lbrace: "{",
	lbrack: "[",
	lbrke: "⦋",
	lbrksld: "⦏",
	lbrkslu: "⦍",
	lcaron: "ľ",
	lcedil: "ļ",
	lceil: "⌈",
	lcub: "{",
	lcy: "л",
	ldca: "⤶",
	ldquo: "“",
	ldquor: "„",
	ldrdhar: "⥧",
	ldrushar: "⥋",
	ldsh: "↲",
	le: "≤",
	leftarrow: "←",
	leftarrowtail: "↢",
	leftharpoondown: "↽",
	leftharpoonup: "↼",
	leftleftarrows: "⇇",
	leftrightarrow: "↔",
	leftrightarrows: "⇆",
	leftrightharpoons: "⇋",
	leftrightsquigarrow: "↭",
	leftthreetimes: "⋋",
	leg: "⋚",
	leq: "≤",
	leqq: "≦",
	leqslant: "⩽",
	les: "⩽",
	lescc: "⪨",
	lesdot: "⩿",
	lesdoto: "⪁",
	lesdotor: "⪃",
	lesg: "⋚︀",
	lesges: "⪓",
	lessapprox: "⪅",
	lessdot: "⋖",
	lesseqgtr: "⋚",
	lesseqqgtr: "⪋",
	lessgtr: "≶",
	lesssim: "≲",
	lfisht: "⥼",
	lfloor: "⌊",
	lfr: "𝔩",
	lg: "≶",
	lgE: "⪑",
	lhard: "↽",
	lharu: "↼",
	lharul: "⥪",
	lhblk: "▄",
	ljcy: "љ",
	ll: "≪",
	llarr: "⇇",
	llcorner: "⌞",
	llhard: "⥫",
	lltri: "◺",
	lmidot: "ŀ",
	lmoust: "⎰",
	lmoustache: "⎰",
	lnE: "≨",
	lnap: "⪉",
	lnapprox: "⪉",
	lne: "⪇",
	lneq: "⪇",
	lneqq: "≨",
	lnsim: "⋦",
	loang: "⟬",
	loarr: "⇽",
	lobrk: "⟦",
	longleftarrow: "⟵",
	longleftrightarrow: "⟷",
	longmapsto: "⟼",
	longrightarrow: "⟶",
	looparrowleft: "↫",
	looparrowright: "↬",
	lopar: "⦅",
	lopf: "𝕝",
	loplus: "⨭",
	lotimes: "⨴",
	lowast: "∗",
	lowbar: "_",
	loz: "◊",
	lozenge: "◊",
	lozf: "⧫",
	lpar: "(",
	lparlt: "⦓",
	lrarr: "⇆",
	lrcorner: "⌟",
	lrhar: "⇋",
	lrhard: "⥭",
	lrm: "‎",
	lrtri: "⊿",
	lsaquo: "‹",
	lscr: "𝓁",
	lsh: "↰",
	lsim: "≲",
	lsime: "⪍",
	lsimg: "⪏",
	lsqb: "[",
	lsquo: "‘",
	lsquor: "‚",
	lstrok: "ł",
	lt: "<",
	ltcc: "⪦",
	ltcir: "⩹",
	ltdot: "⋖",
	lthree: "⋋",
	ltimes: "⋉",
	ltlarr: "⥶",
	ltquest: "⩻",
	ltrPar: "⦖",
	ltri: "◃",
	ltrie: "⊴",
	ltrif: "◂",
	lurdshar: "⥊",
	luruhar: "⥦",
	lvertneqq: "≨︀",
	lvnE: "≨︀",
	mDDot: "∺",
	macr: "¯",
	male: "♂",
	malt: "✠",
	maltese: "✠",
	map: "↦",
	mapsto: "↦",
	mapstodown: "↧",
	mapstoleft: "↤",
	mapstoup: "↥",
	marker: "▮",
	mcomma: "⨩",
	mcy: "м",
	mdash: "—",
	measuredangle: "∡",
	mfr: "𝔪",
	mho: "℧",
	micro: "µ",
	mid: "∣",
	midast: "*",
	midcir: "⫰",
	middot: "·",
	minus: "−",
	minusb: "⊟",
	minusd: "∸",
	minusdu: "⨪",
	mlcp: "⫛",
	mldr: "…",
	mnplus: "∓",
	models: "⊧",
	mopf: "𝕞",
	mp: "∓",
	mscr: "𝓂",
	mstpos: "∾",
	mu: "μ",
	multimap: "⊸",
	mumap: "⊸",
	nGg: "⋙̸",
	nGt: "≫⃒",
	nGtv: "≫̸",
	nLeftarrow: "⇍",
	nLeftrightarrow: "⇎",
	nLl: "⋘̸",
	nLt: "≪⃒",
	nLtv: "≪̸",
	nRightarrow: "⇏",
	nVDash: "⊯",
	nVdash: "⊮",
	nabla: "∇",
	nacute: "ń",
	nang: "∠⃒",
	nap: "≉",
	napE: "⩰̸",
	napid: "≋̸",
	napos: "ŉ",
	napprox: "≉",
	natur: "♮",
	natural: "♮",
	naturals: "ℕ",
	nbsp: "\xA0",
	nbump: "≎̸",
	nbumpe: "≏̸",
	ncap: "⩃",
	ncaron: "ň",
	ncedil: "ņ",
	ncong: "≇",
	ncongdot: "⩭̸",
	ncup: "⩂",
	ncy: "н",
	ndash: "–",
	ne: "≠",
	neArr: "⇗",
	nearhk: "⤤",
	nearr: "↗",
	nearrow: "↗",
	nedot: "≐̸",
	nequiv: "≢",
	nesear: "⤨",
	nesim: "≂̸",
	nexist: "∄",
	nexists: "∄",
	nfr: "𝔫",
	ngE: "≧̸",
	nge: "≱",
	ngeq: "≱",
	ngeqq: "≧̸",
	ngeqslant: "⩾̸",
	nges: "⩾̸",
	ngsim: "≵",
	ngt: "≯",
	ngtr: "≯",
	nhArr: "⇎",
	nharr: "↮",
	nhpar: "⫲",
	ni: "∋",
	nis: "⋼",
	nisd: "⋺",
	niv: "∋",
	njcy: "њ",
	nlArr: "⇍",
	nlE: "≦̸",
	nlarr: "↚",
	nldr: "‥",
	nle: "≰",
	nleftarrow: "↚",
	nleftrightarrow: "↮",
	nleq: "≰",
	nleqq: "≦̸",
	nleqslant: "⩽̸",
	nles: "⩽̸",
	nless: "≮",
	nlsim: "≴",
	nlt: "≮",
	nltri: "⋪",
	nltrie: "⋬",
	nmid: "∤",
	nopf: "𝕟",
	not: "¬",
	notin: "∉",
	notinE: "⋹̸",
	notindot: "⋵̸",
	notinva: "∉",
	notinvb: "⋷",
	notinvc: "⋶",
	notni: "∌",
	notniva: "∌",
	notnivb: "⋾",
	notnivc: "⋽",
	npar: "∦",
	nparallel: "∦",
	nparsl: "⫽⃥",
	npart: "∂̸",
	npolint: "⨔",
	npr: "⊀",
	nprcue: "⋠",
	npre: "⪯̸",
	nprec: "⊀",
	npreceq: "⪯̸",
	nrArr: "⇏",
	nrarr: "↛",
	nrarrc: "⤳̸",
	nrarrw: "↝̸",
	nrightarrow: "↛",
	nrtri: "⋫",
	nrtrie: "⋭",
	nsc: "⊁",
	nsccue: "⋡",
	nsce: "⪰̸",
	nscr: "𝓃",
	nshortmid: "∤",
	nshortparallel: "∦",
	nsim: "≁",
	nsime: "≄",
	nsimeq: "≄",
	nsmid: "∤",
	nspar: "∦",
	nsqsube: "⋢",
	nsqsupe: "⋣",
	nsub: "⊄",
	nsubE: "⫅̸",
	nsube: "⊈",
	nsubset: "⊂⃒",
	nsubseteq: "⊈",
	nsubseteqq: "⫅̸",
	nsucc: "⊁",
	nsucceq: "⪰̸",
	nsup: "⊅",
	nsupE: "⫆̸",
	nsupe: "⊉",
	nsupset: "⊃⃒",
	nsupseteq: "⊉",
	nsupseteqq: "⫆̸",
	ntgl: "≹",
	ntilde: "ñ",
	ntlg: "≸",
	ntriangleleft: "⋪",
	ntrianglelefteq: "⋬",
	ntriangleright: "⋫",
	ntrianglerighteq: "⋭",
	nu: "ν",
	num: "#",
	numero: "№",
	numsp: " ",
	nvDash: "⊭",
	nvHarr: "⤄",
	nvap: "≍⃒",
	nvdash: "⊬",
	nvge: "≥⃒",
	nvgt: ">⃒",
	nvinfin: "⧞",
	nvlArr: "⤂",
	nvle: "≤⃒",
	nvlt: "<⃒",
	nvltrie: "⊴⃒",
	nvrArr: "⤃",
	nvrtrie: "⊵⃒",
	nvsim: "∼⃒",
	nwArr: "⇖",
	nwarhk: "⤣",
	nwarr: "↖",
	nwarrow: "↖",
	nwnear: "⤧",
	oS: "Ⓢ",
	oacute: "ó",
	oast: "⊛",
	ocir: "⊚",
	ocirc: "ô",
	ocy: "о",
	odash: "⊝",
	odblac: "ő",
	odiv: "⨸",
	odot: "⊙",
	odsold: "⦼",
	oelig: "œ",
	ofcir: "⦿",
	ofr: "𝔬",
	ogon: "˛",
	ograve: "ò",
	ogt: "⧁",
	ohbar: "⦵",
	ohm: "Ω",
	oint: "∮",
	olarr: "↺",
	olcir: "⦾",
	olcross: "⦻",
	oline: "‾",
	olt: "⧀",
	omacr: "ō",
	omega: "ω",
	omicron: "ο",
	omid: "⦶",
	ominus: "⊖",
	oopf: "𝕠",
	opar: "⦷",
	operp: "⦹",
	oplus: "⊕",
	or: "∨",
	orarr: "↻",
	ord: "⩝",
	order: "ℴ",
	orderof: "ℴ",
	ordf: "ª",
	ordm: "º",
	origof: "⊶",
	oror: "⩖",
	orslope: "⩗",
	orv: "⩛",
	oscr: "ℴ",
	oslash: "ø",
	osol: "⊘",
	otilde: "õ",
	otimes: "⊗",
	otimesas: "⨶",
	ouml: "ö",
	ovbar: "⌽",
	par: "∥",
	para: "¶",
	parallel: "∥",
	parsim: "⫳",
	parsl: "⫽",
	part: "∂",
	pcy: "п",
	percnt: "%",
	period: ".",
	permil: "‰",
	perp: "⊥",
	pertenk: "‱",
	pfr: "𝔭",
	phi: "φ",
	phiv: "ϕ",
	phmmat: "ℳ",
	phone: "☎",
	pi: "π",
	pitchfork: "⋔",
	piv: "ϖ",
	planck: "ℏ",
	planckh: "ℎ",
	plankv: "ℏ",
	plus: "+",
	plusacir: "⨣",
	plusb: "⊞",
	pluscir: "⨢",
	plusdo: "∔",
	plusdu: "⨥",
	pluse: "⩲",
	plusmn: "±",
	plussim: "⨦",
	plustwo: "⨧",
	pm: "±",
	pointint: "⨕",
	popf: "𝕡",
	pound: "£",
	pr: "≺",
	prE: "⪳",
	prap: "⪷",
	prcue: "≼",
	pre: "⪯",
	prec: "≺",
	precapprox: "⪷",
	preccurlyeq: "≼",
	preceq: "⪯",
	precnapprox: "⪹",
	precneqq: "⪵",
	precnsim: "⋨",
	precsim: "≾",
	prime: "′",
	primes: "ℙ",
	prnE: "⪵",
	prnap: "⪹",
	prnsim: "⋨",
	prod: "∏",
	profalar: "⌮",
	profline: "⌒",
	profsurf: "⌓",
	prop: "∝",
	propto: "∝",
	prsim: "≾",
	prurel: "⊰",
	pscr: "𝓅",
	psi: "ψ",
	puncsp: " ",
	qfr: "𝔮",
	qint: "⨌",
	qopf: "𝕢",
	qprime: "⁗",
	qscr: "𝓆",
	quaternions: "ℍ",
	quatint: "⨖",
	quest: "?",
	questeq: "≟",
	quot: "\"",
	rAarr: "⇛",
	rArr: "⇒",
	rAtail: "⤜",
	rBarr: "⤏",
	rHar: "⥤",
	race: "∽̱",
	racute: "ŕ",
	radic: "√",
	raemptyv: "⦳",
	rang: "⟩",
	rangd: "⦒",
	range: "⦥",
	rangle: "⟩",
	raquo: "»",
	rarr: "→",
	rarrap: "⥵",
	rarrb: "⇥",
	rarrbfs: "⤠",
	rarrc: "⤳",
	rarrfs: "⤞",
	rarrhk: "↪",
	rarrlp: "↬",
	rarrpl: "⥅",
	rarrsim: "⥴",
	rarrtl: "↣",
	rarrw: "↝",
	ratail: "⤚",
	ratio: "∶",
	rationals: "ℚ",
	rbarr: "⤍",
	rbbrk: "❳",
	rbrace: "}",
	rbrack: "]",
	rbrke: "⦌",
	rbrksld: "⦎",
	rbrkslu: "⦐",
	rcaron: "ř",
	rcedil: "ŗ",
	rceil: "⌉",
	rcub: "}",
	rcy: "р",
	rdca: "⤷",
	rdldhar: "⥩",
	rdquo: "”",
	rdquor: "”",
	rdsh: "↳",
	real: "ℜ",
	realine: "ℛ",
	realpart: "ℜ",
	reals: "ℝ",
	rect: "▭",
	reg: "®",
	rfisht: "⥽",
	rfloor: "⌋",
	rfr: "𝔯",
	rhard: "⇁",
	rharu: "⇀",
	rharul: "⥬",
	rho: "ρ",
	rhov: "ϱ",
	rightarrow: "→",
	rightarrowtail: "↣",
	rightharpoondown: "⇁",
	rightharpoonup: "⇀",
	rightleftarrows: "⇄",
	rightleftharpoons: "⇌",
	rightrightarrows: "⇉",
	rightsquigarrow: "↝",
	rightthreetimes: "⋌",
	ring: "˚",
	risingdotseq: "≓",
	rlarr: "⇄",
	rlhar: "⇌",
	rlm: "‏",
	rmoust: "⎱",
	rmoustache: "⎱",
	rnmid: "⫮",
	roang: "⟭",
	roarr: "⇾",
	robrk: "⟧",
	ropar: "⦆",
	ropf: "𝕣",
	roplus: "⨮",
	rotimes: "⨵",
	rpar: ")",
	rpargt: "⦔",
	rppolint: "⨒",
	rrarr: "⇉",
	rsaquo: "›",
	rscr: "𝓇",
	rsh: "↱",
	rsqb: "]",
	rsquo: "’",
	rsquor: "’",
	rthree: "⋌",
	rtimes: "⋊",
	rtri: "▹",
	rtrie: "⊵",
	rtrif: "▸",
	rtriltri: "⧎",
	ruluhar: "⥨",
	rx: "℞",
	sacute: "ś",
	sbquo: "‚",
	sc: "≻",
	scE: "⪴",
	scap: "⪸",
	scaron: "š",
	sccue: "≽",
	sce: "⪰",
	scedil: "ş",
	scirc: "ŝ",
	scnE: "⪶",
	scnap: "⪺",
	scnsim: "⋩",
	scpolint: "⨓",
	scsim: "≿",
	scy: "с",
	sdot: "⋅",
	sdotb: "⊡",
	sdote: "⩦",
	seArr: "⇘",
	searhk: "⤥",
	searr: "↘",
	searrow: "↘",
	sect: "§",
	semi: ";",
	seswar: "⤩",
	setminus: "∖",
	setmn: "∖",
	sext: "✶",
	sfr: "𝔰",
	sfrown: "⌢",
	sharp: "♯",
	shchcy: "щ",
	shcy: "ш",
	shortmid: "∣",
	shortparallel: "∥",
	shy: "­",
	sigma: "σ",
	sigmaf: "ς",
	sigmav: "ς",
	sim: "∼",
	simdot: "⩪",
	sime: "≃",
	simeq: "≃",
	simg: "⪞",
	simgE: "⪠",
	siml: "⪝",
	simlE: "⪟",
	simne: "≆",
	simplus: "⨤",
	simrarr: "⥲",
	slarr: "←",
	smallsetminus: "∖",
	smashp: "⨳",
	smeparsl: "⧤",
	smid: "∣",
	smile: "⌣",
	smt: "⪪",
	smte: "⪬",
	smtes: "⪬︀",
	softcy: "ь",
	sol: "/",
	solb: "⧄",
	solbar: "⌿",
	sopf: "𝕤",
	spades: "♠",
	spadesuit: "♠",
	spar: "∥",
	sqcap: "⊓",
	sqcaps: "⊓︀",
	sqcup: "⊔",
	sqcups: "⊔︀",
	sqsub: "⊏",
	sqsube: "⊑",
	sqsubset: "⊏",
	sqsubseteq: "⊑",
	sqsup: "⊐",
	sqsupe: "⊒",
	sqsupset: "⊐",
	sqsupseteq: "⊒",
	squ: "□",
	square: "□",
	squarf: "▪",
	squf: "▪",
	srarr: "→",
	sscr: "𝓈",
	ssetmn: "∖",
	ssmile: "⌣",
	sstarf: "⋆",
	star: "☆",
	starf: "★",
	straightepsilon: "ϵ",
	straightphi: "ϕ",
	strns: "¯",
	sub: "⊂",
	subE: "⫅",
	subdot: "⪽",
	sube: "⊆",
	subedot: "⫃",
	submult: "⫁",
	subnE: "⫋",
	subne: "⊊",
	subplus: "⪿",
	subrarr: "⥹",
	subset: "⊂",
	subseteq: "⊆",
	subseteqq: "⫅",
	subsetneq: "⊊",
	subsetneqq: "⫋",
	subsim: "⫇",
	subsub: "⫕",
	subsup: "⫓",
	succ: "≻",
	succapprox: "⪸",
	succcurlyeq: "≽",
	succeq: "⪰",
	succnapprox: "⪺",
	succneqq: "⪶",
	succnsim: "⋩",
	succsim: "≿",
	sum: "∑",
	sung: "♪",
	sup1: "¹",
	sup2: "²",
	sup3: "³",
	sup: "⊃",
	supE: "⫆",
	supdot: "⪾",
	supdsub: "⫘",
	supe: "⊇",
	supedot: "⫄",
	suphsol: "⟉",
	suphsub: "⫗",
	suplarr: "⥻",
	supmult: "⫂",
	supnE: "⫌",
	supne: "⊋",
	supplus: "⫀",
	supset: "⊃",
	supseteq: "⊇",
	supseteqq: "⫆",
	supsetneq: "⊋",
	supsetneqq: "⫌",
	supsim: "⫈",
	supsub: "⫔",
	supsup: "⫖",
	swArr: "⇙",
	swarhk: "⤦",
	swarr: "↙",
	swarrow: "↙",
	swnwar: "⤪",
	szlig: "ß",
	target: "⌖",
	tau: "τ",
	tbrk: "⎴",
	tcaron: "ť",
	tcedil: "ţ",
	tcy: "т",
	tdot: "⃛",
	telrec: "⌕",
	tfr: "𝔱",
	there4: "∴",
	therefore: "∴",
	theta: "θ",
	thetasym: "ϑ",
	thetav: "ϑ",
	thickapprox: "≈",
	thicksim: "∼",
	thinsp: " ",
	thkap: "≈",
	thksim: "∼",
	thorn: "þ",
	tilde: "˜",
	times: "×",
	timesb: "⊠",
	timesbar: "⨱",
	timesd: "⨰",
	tint: "∭",
	toea: "⤨",
	top: "⊤",
	topbot: "⌶",
	topcir: "⫱",
	topf: "𝕥",
	topfork: "⫚",
	tosa: "⤩",
	tprime: "‴",
	trade: "™",
	triangle: "▵",
	triangledown: "▿",
	triangleleft: "◃",
	trianglelefteq: "⊴",
	triangleq: "≜",
	triangleright: "▹",
	trianglerighteq: "⊵",
	tridot: "◬",
	trie: "≜",
	triminus: "⨺",
	triplus: "⨹",
	trisb: "⧍",
	tritime: "⨻",
	trpezium: "⏢",
	tscr: "𝓉",
	tscy: "ц",
	tshcy: "ћ",
	tstrok: "ŧ",
	twixt: "≬",
	twoheadleftarrow: "↞",
	twoheadrightarrow: "↠",
	uArr: "⇑",
	uHar: "⥣",
	uacute: "ú",
	uarr: "↑",
	ubrcy: "ў",
	ubreve: "ŭ",
	ucirc: "û",
	ucy: "у",
	udarr: "⇅",
	udblac: "ű",
	udhar: "⥮",
	ufisht: "⥾",
	ufr: "𝔲",
	ugrave: "ù",
	uharl: "↿",
	uharr: "↾",
	uhblk: "▀",
	ulcorn: "⌜",
	ulcorner: "⌜",
	ulcrop: "⌏",
	ultri: "◸",
	umacr: "ū",
	uml: "¨",
	uogon: "ų",
	uopf: "𝕦",
	uparrow: "↑",
	updownarrow: "↕",
	upharpoonleft: "↿",
	upharpoonright: "↾",
	uplus: "⊎",
	upsi: "υ",
	upsih: "ϒ",
	upsilon: "υ",
	upuparrows: "⇈",
	urcorn: "⌝",
	urcorner: "⌝",
	urcrop: "⌎",
	uring: "ů",
	urtri: "◹",
	uscr: "𝓊",
	utdot: "⋰",
	utilde: "ũ",
	utri: "▵",
	utrif: "▴",
	uuarr: "⇈",
	uuml: "ü",
	uwangle: "⦧",
	vArr: "⇕",
	vBar: "⫨",
	vBarv: "⫩",
	vDash: "⊨",
	vangrt: "⦜",
	varepsilon: "ϵ",
	varkappa: "ϰ",
	varnothing: "∅",
	varphi: "ϕ",
	varpi: "ϖ",
	varpropto: "∝",
	varr: "↕",
	varrho: "ϱ",
	varsigma: "ς",
	varsubsetneq: "⊊︀",
	varsubsetneqq: "⫋︀",
	varsupsetneq: "⊋︀",
	varsupsetneqq: "⫌︀",
	vartheta: "ϑ",
	vartriangleleft: "⊲",
	vartriangleright: "⊳",
	vcy: "в",
	vdash: "⊢",
	vee: "∨",
	veebar: "⊻",
	veeeq: "≚",
	vellip: "⋮",
	verbar: "|",
	vert: "|",
	vfr: "𝔳",
	vltri: "⊲",
	vnsub: "⊂⃒",
	vnsup: "⊃⃒",
	vopf: "𝕧",
	vprop: "∝",
	vrtri: "⊳",
	vscr: "𝓋",
	vsubnE: "⫋︀",
	vsubne: "⊊︀",
	vsupnE: "⫌︀",
	vsupne: "⊋︀",
	vzigzag: "⦚",
	wcirc: "ŵ",
	wedbar: "⩟",
	wedge: "∧",
	wedgeq: "≙",
	weierp: "℘",
	wfr: "𝔴",
	wopf: "𝕨",
	wp: "℘",
	wr: "≀",
	wreath: "≀",
	wscr: "𝓌",
	xcap: "⋂",
	xcirc: "◯",
	xcup: "⋃",
	xdtri: "▽",
	xfr: "𝔵",
	xhArr: "⟺",
	xharr: "⟷",
	xi: "ξ",
	xlArr: "⟸",
	xlarr: "⟵",
	xmap: "⟼",
	xnis: "⋻",
	xodot: "⨀",
	xopf: "𝕩",
	xoplus: "⨁",
	xotime: "⨂",
	xrArr: "⟹",
	xrarr: "⟶",
	xscr: "𝓍",
	xsqcup: "⨆",
	xuplus: "⨄",
	xutri: "△",
	xvee: "⋁",
	xwedge: "⋀",
	yacute: "ý",
	yacy: "я",
	ycirc: "ŷ",
	ycy: "ы",
	yen: "¥",
	yfr: "𝔶",
	yicy: "ї",
	yopf: "𝕪",
	yscr: "𝓎",
	yucy: "ю",
	yuml: "ÿ",
	zacute: "ź",
	zcaron: "ž",
	zcy: "з",
	zdot: "ż",
	zeetrf: "ℨ",
	zeta: "ζ",
	zfr: "𝔷",
	zhcy: "ж",
	zigrarr: "⇝",
	zopf: "𝕫",
	zscr: "𝓏",
	zwj: "‍",
	zwnj: "‌"
};

//#endregion
//#region node_modules/decode-named-character-reference/index.js
const own$7 = {}.hasOwnProperty;
/**
* Decode a single character reference (without the `&` or `;`).
* You probably only need this when you’re building parsers yourself that follow
* different rules compared to HTML.
* This is optimized to be tiny in browsers.
*
* @param {string} value
*   `notin` (named), `#123` (deci), `#x123` (hexa).
* @returns {string|false}
*   Decoded reference.
*/
function decodeNamedCharacterReference(value) {
	return own$7.call(characterEntities, value) ? characterEntities[value] : false;
}

//#endregion
//#region node_modules/micromark-util-chunked/index.js
/**
* Like `Array#splice`, but smarter for giant arrays.
*
* `Array#splice` takes all items to be inserted as individual argument which
* causes a stack overflow in V8 when trying to insert 100k items for instance.
*
* Otherwise, this does not return the removed items, and takes `items` as an
* array instead of rest parameters.
*
* @template {unknown} T
*   Item type.
* @param {Array<T>} list
*   List to operate on.
* @param {number} start
*   Index to remove/insert at (can be negative).
* @param {number} remove
*   Number of items to remove.
* @param {Array<T>} items
*   Items to inject into `list`.
* @returns {undefined}
*   Nothing.
*/
function splice(list$3, start, remove, items) {
	const end = list$3.length;
	let chunkStart = 0;
	/** @type {Array<unknown>} */
	let parameters;
	if (start < 0) start = -start > end ? 0 : end + start;
	else start = start > end ? end : start;
	remove = remove > 0 ? remove : 0;
	if (items.length < 1e4) {
		parameters = Array.from(items);
		parameters.unshift(start, remove);
		list$3.splice(...parameters);
	} else {
		if (remove) list$3.splice(start, remove);
		while (chunkStart < items.length) {
			parameters = items.slice(chunkStart, chunkStart + 1e4);
			parameters.unshift(start, 0);
			list$3.splice(...parameters);
			chunkStart += 1e4;
			start += 1e4;
		}
	}
}
/**
* Append `items` (an array) at the end of `list` (another array).
* When `list` was empty, returns `items` instead.
*
* This prevents a potentially expensive operation when `list` is empty,
* and adds items in batches to prevent V8 from hanging.
*
* @template {unknown} T
*   Item type.
* @param {Array<T>} list
*   List to operate on.
* @param {Array<T>} items
*   Items to add to `list`.
* @returns {Array<T>}
*   Either `list` or `items`.
*/
function push(list$3, items) {
	if (list$3.length > 0) {
		splice(list$3, list$3.length, 0, items);
		return list$3;
	}
	return items;
}

//#endregion
//#region node_modules/micromark-util-combine-extensions/index.js
const hasOwnProperty = {}.hasOwnProperty;
/**
* Combine multiple syntax extensions into one.
*
* @param {ReadonlyArray<Extension>} extensions
*   List of syntax extensions.
* @returns {NormalizedExtension}
*   A single combined extension.
*/
function combineExtensions(extensions) {
	/** @type {NormalizedExtension} */
	const all$4 = {};
	let index$2 = -1;
	while (++index$2 < extensions.length) syntaxExtension(all$4, extensions[index$2]);
	return all$4;
}
/**
* Merge `extension` into `all`.
*
* @param {NormalizedExtension} all
*   Extension to merge into.
* @param {Extension} extension
*   Extension to merge.
* @returns {undefined}
*   Nothing.
*/
function syntaxExtension(all$4, extension$1) {
	/** @type {keyof Extension} */
	let hook;
	for (hook in extension$1) {
		/** @type {Record<string, unknown>} */
		const left = (hasOwnProperty.call(all$4, hook) ? all$4[hook] : void 0) || (all$4[hook] = {});
		/** @type {Record<string, unknown> | undefined} */
		const right = extension$1[hook];
		/** @type {string} */
		let code$3;
		if (right) for (code$3 in right) {
			if (!hasOwnProperty.call(left, code$3)) left[code$3] = [];
			const value = right[code$3];
			constructs(left[code$3], Array.isArray(value) ? value : value ? [value] : []);
		}
	}
}
/**
* Merge `list` into `existing` (both lists of constructs).
* Mutates `existing`.
*
* @param {Array<unknown>} existing
*   List of constructs to merge into.
* @param {Array<unknown>} list
*   List of constructs to merge.
* @returns {undefined}
*   Nothing.
*/
function constructs(existing, list$3) {
	let index$2 = -1;
	/** @type {Array<unknown>} */
	const before = [];
	while (++index$2 < list$3.length) (list$3[index$2].add === "after" ? existing : before).push(list$3[index$2]);
	splice(existing, 0, 0, before);
}

//#endregion
//#region node_modules/micromark-util-decode-numeric-character-reference/index.js
/**
* Turn the number (in string form as either hexa- or plain decimal) coming from
* a numeric character reference into a character.
*
* Sort of like `String.fromCodePoint(Number.parseInt(value, base))`, but makes
* non-characters and control characters safe.
*
* @param {string} value
*   Value to decode.
* @param {number} base
*   Numeric base.
* @returns {string}
*   Character.
*/
function decodeNumericCharacterReference(value, base) {
	const code$3 = Number.parseInt(value, base);
	if (code$3 < 9 || code$3 === 11 || code$3 > 13 && code$3 < 32 || code$3 > 126 && code$3 < 160 || code$3 > 55295 && code$3 < 57344 || code$3 > 64975 && code$3 < 65008 || (code$3 & 65535) === 65535 || (code$3 & 65535) === 65534 || code$3 > 1114111) return "�";
	return String.fromCodePoint(code$3);
}

//#endregion
//#region node_modules/micromark-util-normalize-identifier/index.js
/**
* Normalize an identifier (as found in references, definitions).
*
* Collapses markdown whitespace, trim, and then lower- and uppercase.
*
* Some characters are considered “uppercase”, such as U+03F4 (`ϴ`), but if their
* lowercase counterpart (U+03B8 (`θ`)) is uppercased will result in a different
* uppercase character (U+0398 (`Θ`)).
* So, to get a canonical form, we perform both lower- and uppercase.
*
* Using uppercase last makes sure keys will never interact with default
* prototypal values (such as `constructor`): nothing in the prototype of
* `Object` is uppercase.
*
* @param {string} value
*   Identifier to normalize.
* @returns {string}
*   Normalized identifier.
*/
function normalizeIdentifier(value) {
	return value.replace(/[\t\n\r ]+/g, " ").replace(/^ | $/g, "").toLowerCase().toUpperCase();
}

//#endregion
//#region node_modules/micromark-util-character/index.js
/**
* @import {Code} from 'micromark-util-types'
*/
/**
* Check whether the character code represents an ASCII alpha (`a` through `z`,
* case insensitive).
*
* An **ASCII alpha** is an ASCII upper alpha or ASCII lower alpha.
*
* An **ASCII upper alpha** is a character in the inclusive range U+0041 (`A`)
* to U+005A (`Z`).
*
* An **ASCII lower alpha** is a character in the inclusive range U+0061 (`a`)
* to U+007A (`z`).
*
* @param code
*   Code.
* @returns {boolean}
*   Whether it matches.
*/
const asciiAlpha = regexCheck(/[A-Za-z]/);
/**
* Check whether the character code represents an ASCII alphanumeric (`a`
* through `z`, case insensitive, or `0` through `9`).
*
* An **ASCII alphanumeric** is an ASCII digit (see `asciiDigit`) or ASCII alpha
* (see `asciiAlpha`).
*
* @param code
*   Code.
* @returns {boolean}
*   Whether it matches.
*/
const asciiAlphanumeric = regexCheck(/[\dA-Za-z]/);
/**
* Check whether the character code represents an ASCII atext.
*
* atext is an ASCII alphanumeric (see `asciiAlphanumeric`), or a character in
* the inclusive ranges U+0023 NUMBER SIGN (`#`) to U+0027 APOSTROPHE (`'`),
* U+002A ASTERISK (`*`), U+002B PLUS SIGN (`+`), U+002D DASH (`-`), U+002F
* SLASH (`/`), U+003D EQUALS TO (`=`), U+003F QUESTION MARK (`?`), U+005E
* CARET (`^`) to U+0060 GRAVE ACCENT (`` ` ``), or U+007B LEFT CURLY BRACE
* (`{`) to U+007E TILDE (`~`).
*
* See:
* **\[RFC5322]**:
* [Internet Message Format](https://tools.ietf.org/html/rfc5322).
* P. Resnick.
* IETF.
*
* @param code
*   Code.
* @returns {boolean}
*   Whether it matches.
*/
const asciiAtext = regexCheck(/[#-'*+\--9=?A-Z^-~]/);
/**
* Check whether a character code is an ASCII control character.
*
* An **ASCII control** is a character in the inclusive range U+0000 NULL (NUL)
* to U+001F (US), or U+007F (DEL).
*
* @param {Code} code
*   Code.
* @returns {boolean}
*   Whether it matches.
*/
function asciiControl(code$3) {
	return code$3 !== null && (code$3 < 32 || code$3 === 127);
}
/**
* Check whether the character code represents an ASCII digit (`0` through `9`).
*
* An **ASCII digit** is a character in the inclusive range U+0030 (`0`) to
* U+0039 (`9`).
*
* @param code
*   Code.
* @returns {boolean}
*   Whether it matches.
*/
const asciiDigit = regexCheck(/\d/);
/**
* Check whether the character code represents an ASCII hex digit (`a` through
* `f`, case insensitive, or `0` through `9`).
*
* An **ASCII hex digit** is an ASCII digit (see `asciiDigit`), ASCII upper hex
* digit, or an ASCII lower hex digit.
*
* An **ASCII upper hex digit** is a character in the inclusive range U+0041
* (`A`) to U+0046 (`F`).
*
* An **ASCII lower hex digit** is a character in the inclusive range U+0061
* (`a`) to U+0066 (`f`).
*
* @param code
*   Code.
* @returns {boolean}
*   Whether it matches.
*/
const asciiHexDigit = regexCheck(/[\dA-Fa-f]/);
/**
* Check whether the character code represents ASCII punctuation.
*
* An **ASCII punctuation** is a character in the inclusive ranges U+0021
* EXCLAMATION MARK (`!`) to U+002F SLASH (`/`), U+003A COLON (`:`) to U+0040 AT
* SIGN (`@`), U+005B LEFT SQUARE BRACKET (`[`) to U+0060 GRAVE ACCENT
* (`` ` ``), or U+007B LEFT CURLY BRACE (`{`) to U+007E TILDE (`~`).
*
* @param code
*   Code.
* @returns {boolean}
*   Whether it matches.
*/
const asciiPunctuation = regexCheck(/[!-/:-@[-`{-~]/);
/**
* Check whether a character code is a markdown line ending.
*
* A **markdown line ending** is the virtual characters M-0003 CARRIAGE RETURN
* LINE FEED (CRLF), M-0004 LINE FEED (LF) and M-0005 CARRIAGE RETURN (CR).
*
* In micromark, the actual character U+000A LINE FEED (LF) and U+000D CARRIAGE
* RETURN (CR) are replaced by these virtual characters depending on whether
* they occurred together.
*
* @param {Code} code
*   Code.
* @returns {boolean}
*   Whether it matches.
*/
function markdownLineEnding(code$3) {
	return code$3 !== null && code$3 < -2;
}
/**
* Check whether a character code is a markdown line ending (see
* `markdownLineEnding`) or markdown space (see `markdownSpace`).
*
* @param {Code} code
*   Code.
* @returns {boolean}
*   Whether it matches.
*/
function markdownLineEndingOrSpace(code$3) {
	return code$3 !== null && (code$3 < 0 || code$3 === 32);
}
/**
* Check whether a character code is a markdown space.
*
* A **markdown space** is the concrete character U+0020 SPACE (SP) and the
* virtual characters M-0001 VIRTUAL SPACE (VS) and M-0002 HORIZONTAL TAB (HT).
*
* In micromark, the actual character U+0009 CHARACTER TABULATION (HT) is
* replaced by one M-0002 HORIZONTAL TAB (HT) and between 0 and 3 M-0001 VIRTUAL
* SPACE (VS) characters, depending on the column at which the tab occurred.
*
* @param {Code} code
*   Code.
* @returns {boolean}
*   Whether it matches.
*/
function markdownSpace(code$3) {
	return code$3 === -2 || code$3 === -1 || code$3 === 32;
}
/**
* Check whether the character code represents Unicode punctuation.
*
* A **Unicode punctuation** is a character in the Unicode `Pc` (Punctuation,
* Connector), `Pd` (Punctuation, Dash), `Pe` (Punctuation, Close), `Pf`
* (Punctuation, Final quote), `Pi` (Punctuation, Initial quote), `Po`
* (Punctuation, Other), or `Ps` (Punctuation, Open) categories, or an ASCII
* punctuation (see `asciiPunctuation`).
*
* See:
* **\[UNICODE]**:
* [The Unicode Standard](https://www.unicode.org/versions/).
* Unicode Consortium.
*
* @param code
*   Code.
* @returns
*   Whether it matches.
*/
const unicodePunctuation = regexCheck(/\p{P}|\p{S}/u);
/**
* Check whether the character code represents Unicode whitespace.
*
* Note that this does handle micromark specific markdown whitespace characters.
* See `markdownLineEndingOrSpace` to check that.
*
* A **Unicode whitespace** is a character in the Unicode `Zs` (Separator,
* Space) category, or U+0009 CHARACTER TABULATION (HT), U+000A LINE FEED (LF),
* U+000C (FF), or U+000D CARRIAGE RETURN (CR) (**\[UNICODE]**).
*
* See:
* **\[UNICODE]**:
* [The Unicode Standard](https://www.unicode.org/versions/).
* Unicode Consortium.
*
* @param code
*   Code.
* @returns
*   Whether it matches.
*/
const unicodeWhitespace = regexCheck(/\s/);
/**
* Create a code check from a regex.
*
* @param {RegExp} regex
*   Expression.
* @returns {(code: Code) => boolean}
*   Check.
*/
function regexCheck(regex) {
	return check;
	/**
	* Check whether a code matches the bound regex.
	*
	* @param {Code} code
	*   Character code.
	* @returns {boolean}
	*   Whether the character code matches the bound regex.
	*/
	function check(code$3) {
		return code$3 !== null && code$3 > -1 && regex.test(String.fromCharCode(code$3));
	}
}

//#endregion
//#region node_modules/micromark-util-sanitize-uri/index.js
/**
* Normalize a URL.
*
* Encode unsafe characters with percent-encoding, skipping already encoded
* sequences.
*
* @param {string} value
*   URI to normalize.
* @returns {string}
*   Normalized URI.
*/
function normalizeUri(value) {
	/** @type {Array<string>} */
	const result = [];
	let index$2 = -1;
	let start = 0;
	let skip = 0;
	while (++index$2 < value.length) {
		const code$3 = value.charCodeAt(index$2);
		/** @type {string} */
		let replace$1 = "";
		if (code$3 === 37 && asciiAlphanumeric(value.charCodeAt(index$2 + 1)) && asciiAlphanumeric(value.charCodeAt(index$2 + 2))) skip = 2;
		else if (code$3 < 128) {
			if (!/[!#$&-;=?-Z_a-z~]/.test(String.fromCharCode(code$3))) replace$1 = String.fromCharCode(code$3);
		} else if (code$3 > 55295 && code$3 < 57344) {
			const next$1 = value.charCodeAt(index$2 + 1);
			if (code$3 < 56320 && next$1 > 56319 && next$1 < 57344) {
				replace$1 = String.fromCharCode(code$3, next$1);
				skip = 1;
			} else replace$1 = "�";
		} else replace$1 = String.fromCharCode(code$3);
		if (replace$1) {
			result.push(value.slice(start, index$2), encodeURIComponent(replace$1));
			start = index$2 + skip + 1;
			replace$1 = "";
		}
		if (skip) {
			index$2 += skip;
			skip = 0;
		}
	}
	return result.join("") + value.slice(start);
}

//#endregion
//#region node_modules/micromark-factory-space/index.js
/**
* Parse spaces and tabs.
*
* There is no `nok` parameter:
*
* *   spaces in markdown are often optional, in which case this factory can be
*     used and `ok` will be switched to whether spaces were found or not
* *   one line ending or space can be detected with `markdownSpace(code)` right
*     before using `factorySpace`
*
* ###### Examples
*
* Where `␉` represents a tab (plus how much it expands) and `␠` represents a
* single space.
*
* ```markdown
* ␉
* ␠␠␠␠
* ␉␠
* ```
*
* @param {Effects} effects
*   Context.
* @param {State} ok
*   State switched to when successful.
* @param {TokenType} type
*   Type (`' \t'`).
* @param {number | undefined} [max=Infinity]
*   Max (exclusive).
* @returns {State}
*   Start state.
*/
function factorySpace(effects, ok$2, type, max) {
	const limit = max ? max - 1 : Number.POSITIVE_INFINITY;
	let size = 0;
	return start;
	/** @type {State} */
	function start(code$3) {
		if (markdownSpace(code$3)) {
			effects.enter(type);
			return prefix(code$3);
		}
		return ok$2(code$3);
	}
	/** @type {State} */
	function prefix(code$3) {
		if (markdownSpace(code$3) && size++ < limit) {
			effects.consume(code$3);
			return prefix;
		}
		effects.exit(type);
		return ok$2(code$3);
	}
}

//#endregion
//#region node_modules/micromark/lib/initialize/content.js
/** @type {InitialConstruct} */
const content = { tokenize: initializeContent };
/**
* @this {TokenizeContext}
*   Context.
* @type {Initializer}
*   Content.
*/
function initializeContent(effects) {
	const contentStart = effects.attempt(this.parser.constructs.contentInitial, afterContentStartConstruct, paragraphInitial);
	/** @type {Token} */
	let previous$2;
	return contentStart;
	/** @type {State} */
	function afterContentStartConstruct(code$3) {
		if (code$3 === null) {
			effects.consume(code$3);
			return;
		}
		effects.enter("lineEnding");
		effects.consume(code$3);
		effects.exit("lineEnding");
		return factorySpace(effects, contentStart, "linePrefix");
	}
	/** @type {State} */
	function paragraphInitial(code$3) {
		effects.enter("paragraph");
		return lineStart(code$3);
	}
	/** @type {State} */
	function lineStart(code$3) {
		const token = effects.enter("chunkText", {
			contentType: "text",
			previous: previous$2
		});
		if (previous$2) previous$2.next = token;
		previous$2 = token;
		return data(code$3);
	}
	/** @type {State} */
	function data(code$3) {
		if (code$3 === null) {
			effects.exit("chunkText");
			effects.exit("paragraph");
			effects.consume(code$3);
			return;
		}
		if (markdownLineEnding(code$3)) {
			effects.consume(code$3);
			effects.exit("chunkText");
			return lineStart;
		}
		effects.consume(code$3);
		return data;
	}
}

//#endregion
//#region node_modules/micromark/lib/initialize/document.js
/** @type {InitialConstruct} */
const document$1 = { tokenize: initializeDocument };
/** @type {Construct} */
const containerConstruct = { tokenize: tokenizeContainer };
/**
* @this {TokenizeContext}
*   Self.
* @type {Initializer}
*   Initializer.
*/
function initializeDocument(effects) {
	const self$1 = this;
	/** @type {Array<StackItem>} */
	const stack = [];
	let continued = 0;
	/** @type {TokenizeContext | undefined} */
	let childFlow;
	/** @type {Token | undefined} */
	let childToken;
	/** @type {number} */
	let lineStartOffset;
	return start;
	/** @type {State} */
	function start(code$3) {
		if (continued < stack.length) {
			const item = stack[continued];
			self$1.containerState = item[1];
			return effects.attempt(item[0].continuation, documentContinue, checkNewContainers)(code$3);
		}
		return checkNewContainers(code$3);
	}
	/** @type {State} */
	function documentContinue(code$3) {
		continued++;
		if (self$1.containerState._closeFlow) {
			self$1.containerState._closeFlow = void 0;
			if (childFlow) closeFlow();
			const indexBeforeExits = self$1.events.length;
			let indexBeforeFlow = indexBeforeExits;
			/** @type {Point | undefined} */
			let point$4;
			while (indexBeforeFlow--) if (self$1.events[indexBeforeFlow][0] === "exit" && self$1.events[indexBeforeFlow][1].type === "chunkFlow") {
				point$4 = self$1.events[indexBeforeFlow][1].end;
				break;
			}
			exitContainers(continued);
			let index$2 = indexBeforeExits;
			while (index$2 < self$1.events.length) {
				self$1.events[index$2][1].end = { ...point$4 };
				index$2++;
			}
			splice(self$1.events, indexBeforeFlow + 1, 0, self$1.events.slice(indexBeforeExits));
			self$1.events.length = index$2;
			return checkNewContainers(code$3);
		}
		return start(code$3);
	}
	/** @type {State} */
	function checkNewContainers(code$3) {
		if (continued === stack.length) {
			if (!childFlow) return documentContinued(code$3);
			if (childFlow.currentConstruct && childFlow.currentConstruct.concrete) return flowStart(code$3);
			self$1.interrupt = Boolean(childFlow.currentConstruct && !childFlow._gfmTableDynamicInterruptHack);
		}
		self$1.containerState = {};
		return effects.check(containerConstruct, thereIsANewContainer, thereIsNoNewContainer)(code$3);
	}
	/** @type {State} */
	function thereIsANewContainer(code$3) {
		if (childFlow) closeFlow();
		exitContainers(continued);
		return documentContinued(code$3);
	}
	/** @type {State} */
	function thereIsNoNewContainer(code$3) {
		self$1.parser.lazy[self$1.now().line] = continued !== stack.length;
		lineStartOffset = self$1.now().offset;
		return flowStart(code$3);
	}
	/** @type {State} */
	function documentContinued(code$3) {
		self$1.containerState = {};
		return effects.attempt(containerConstruct, containerContinue, flowStart)(code$3);
	}
	/** @type {State} */
	function containerContinue(code$3) {
		continued++;
		stack.push([self$1.currentConstruct, self$1.containerState]);
		return documentContinued(code$3);
	}
	/** @type {State} */
	function flowStart(code$3) {
		if (code$3 === null) {
			if (childFlow) closeFlow();
			exitContainers(0);
			effects.consume(code$3);
			return;
		}
		childFlow = childFlow || self$1.parser.flow(self$1.now());
		effects.enter("chunkFlow", {
			_tokenizer: childFlow,
			contentType: "flow",
			previous: childToken
		});
		return flowContinue(code$3);
	}
	/** @type {State} */
	function flowContinue(code$3) {
		if (code$3 === null) {
			writeToChild(effects.exit("chunkFlow"), true);
			exitContainers(0);
			effects.consume(code$3);
			return;
		}
		if (markdownLineEnding(code$3)) {
			effects.consume(code$3);
			writeToChild(effects.exit("chunkFlow"));
			continued = 0;
			self$1.interrupt = void 0;
			return start;
		}
		effects.consume(code$3);
		return flowContinue;
	}
	/**
	* @param {Token} token
	*   Token.
	* @param {boolean | undefined} [endOfFile]
	*   Whether the token is at the end of the file (default: `false`).
	* @returns {undefined}
	*   Nothing.
	*/
	function writeToChild(token, endOfFile) {
		const stream = self$1.sliceStream(token);
		if (endOfFile) stream.push(null);
		token.previous = childToken;
		if (childToken) childToken.next = token;
		childToken = token;
		childFlow.defineSkip(token.start);
		childFlow.write(stream);
		if (self$1.parser.lazy[token.start.line]) {
			let index$2 = childFlow.events.length;
			while (index$2--) if (childFlow.events[index$2][1].start.offset < lineStartOffset && (!childFlow.events[index$2][1].end || childFlow.events[index$2][1].end.offset > lineStartOffset)) return;
			const indexBeforeExits = self$1.events.length;
			let indexBeforeFlow = indexBeforeExits;
			/** @type {boolean | undefined} */
			let seen;
			/** @type {Point | undefined} */
			let point$4;
			while (indexBeforeFlow--) if (self$1.events[indexBeforeFlow][0] === "exit" && self$1.events[indexBeforeFlow][1].type === "chunkFlow") {
				if (seen) {
					point$4 = self$1.events[indexBeforeFlow][1].end;
					break;
				}
				seen = true;
			}
			exitContainers(continued);
			index$2 = indexBeforeExits;
			while (index$2 < self$1.events.length) {
				self$1.events[index$2][1].end = { ...point$4 };
				index$2++;
			}
			splice(self$1.events, indexBeforeFlow + 1, 0, self$1.events.slice(indexBeforeExits));
			self$1.events.length = index$2;
		}
	}
	/**
	* @param {number} size
	*   Size.
	* @returns {undefined}
	*   Nothing.
	*/
	function exitContainers(size) {
		let index$2 = stack.length;
		while (index$2-- > size) {
			const entry = stack[index$2];
			self$1.containerState = entry[1];
			entry[0].exit.call(self$1, effects);
		}
		stack.length = size;
	}
	function closeFlow() {
		childFlow.write([null]);
		childToken = void 0;
		childFlow = void 0;
		self$1.containerState._closeFlow = void 0;
	}
}
/**
* @this {TokenizeContext}
*   Context.
* @type {Tokenizer}
*   Tokenizer.
*/
function tokenizeContainer(effects, ok$2, nok) {
	return factorySpace(effects, effects.attempt(this.parser.constructs.document, ok$2, nok), "linePrefix", this.parser.constructs.disable.null.includes("codeIndented") ? void 0 : 4);
}

//#endregion
//#region node_modules/micromark-util-classify-character/index.js
/**
* Classify whether a code represents whitespace, punctuation, or something
* else.
*
* Used for attention (emphasis, strong), whose sequences can open or close
* based on the class of surrounding characters.
*
* > 👉 **Note**: eof (`null`) is seen as whitespace.
*
* @param {Code} code
*   Code.
* @returns {typeof constants.characterGroupWhitespace | typeof constants.characterGroupPunctuation | undefined}
*   Group.
*/
function classifyCharacter(code$3) {
	if (code$3 === null || markdownLineEndingOrSpace(code$3) || unicodeWhitespace(code$3)) return 1;
	if (unicodePunctuation(code$3)) return 2;
}

//#endregion
//#region node_modules/micromark-util-resolve-all/index.js
/**
* @import {Event, Resolver, TokenizeContext} from 'micromark-util-types'
*/
/**
* Call all `resolveAll`s.
*
* @param {ReadonlyArray<{resolveAll?: Resolver | undefined}>} constructs
*   List of constructs, optionally with `resolveAll`s.
* @param {Array<Event>} events
*   List of events.
* @param {TokenizeContext} context
*   Context used by `tokenize`.
* @returns {Array<Event>}
*   Changed events.
*/
function resolveAll(constructs$1, events, context) {
	/** @type {Array<Resolver>} */
	const called = [];
	let index$2 = -1;
	while (++index$2 < constructs$1.length) {
		const resolve = constructs$1[index$2].resolveAll;
		if (resolve && !called.includes(resolve)) {
			events = resolve(events, context);
			called.push(resolve);
		}
	}
	return events;
}

//#endregion
//#region node_modules/micromark-core-commonmark/lib/attention.js
/** @type {Construct} */
const attention = {
	name: "attention",
	resolveAll: resolveAllAttention,
	tokenize: tokenizeAttention
};
/**
* Take all events and resolve attention to emphasis or strong.
*
* @type {Resolver}
*/
function resolveAllAttention(events, context) {
	let index$2 = -1;
	/** @type {number} */
	let open;
	/** @type {Token} */
	let group;
	/** @type {Token} */
	let text$9;
	/** @type {Token} */
	let openingSequence;
	/** @type {Token} */
	let closingSequence;
	/** @type {number} */
	let use;
	/** @type {Array<Event>} */
	let nextEvents;
	/** @type {number} */
	let offset;
	while (++index$2 < events.length) if (events[index$2][0] === "enter" && events[index$2][1].type === "attentionSequence" && events[index$2][1]._close) {
		open = index$2;
		while (open--) if (events[open][0] === "exit" && events[open][1].type === "attentionSequence" && events[open][1]._open && context.sliceSerialize(events[open][1]).charCodeAt(0) === context.sliceSerialize(events[index$2][1]).charCodeAt(0)) {
			if ((events[open][1]._close || events[index$2][1]._open) && (events[index$2][1].end.offset - events[index$2][1].start.offset) % 3 && !((events[open][1].end.offset - events[open][1].start.offset + events[index$2][1].end.offset - events[index$2][1].start.offset) % 3)) continue;
			use = events[open][1].end.offset - events[open][1].start.offset > 1 && events[index$2][1].end.offset - events[index$2][1].start.offset > 1 ? 2 : 1;
			const start = { ...events[open][1].end };
			const end = { ...events[index$2][1].start };
			movePoint(start, -use);
			movePoint(end, use);
			openingSequence = {
				type: use > 1 ? "strongSequence" : "emphasisSequence",
				start,
				end: { ...events[open][1].end }
			};
			closingSequence = {
				type: use > 1 ? "strongSequence" : "emphasisSequence",
				start: { ...events[index$2][1].start },
				end
			};
			text$9 = {
				type: use > 1 ? "strongText" : "emphasisText",
				start: { ...events[open][1].end },
				end: { ...events[index$2][1].start }
			};
			group = {
				type: use > 1 ? "strong" : "emphasis",
				start: { ...openingSequence.start },
				end: { ...closingSequence.end }
			};
			events[open][1].end = { ...openingSequence.start };
			events[index$2][1].start = { ...closingSequence.end };
			nextEvents = [];
			if (events[open][1].end.offset - events[open][1].start.offset) nextEvents = push(nextEvents, [[
				"enter",
				events[open][1],
				context
			], [
				"exit",
				events[open][1],
				context
			]]);
			nextEvents = push(nextEvents, [
				[
					"enter",
					group,
					context
				],
				[
					"enter",
					openingSequence,
					context
				],
				[
					"exit",
					openingSequence,
					context
				],
				[
					"enter",
					text$9,
					context
				]
			]);
			nextEvents = push(nextEvents, resolveAll(context.parser.constructs.insideSpan.null, events.slice(open + 1, index$2), context));
			nextEvents = push(nextEvents, [
				[
					"exit",
					text$9,
					context
				],
				[
					"enter",
					closingSequence,
					context
				],
				[
					"exit",
					closingSequence,
					context
				],
				[
					"exit",
					group,
					context
				]
			]);
			if (events[index$2][1].end.offset - events[index$2][1].start.offset) {
				offset = 2;
				nextEvents = push(nextEvents, [[
					"enter",
					events[index$2][1],
					context
				], [
					"exit",
					events[index$2][1],
					context
				]]);
			} else offset = 0;
			splice(events, open - 1, index$2 - open + 3, nextEvents);
			index$2 = open + nextEvents.length - offset - 2;
			break;
		}
	}
	index$2 = -1;
	while (++index$2 < events.length) if (events[index$2][1].type === "attentionSequence") events[index$2][1].type = "data";
	return events;
}
/**
* @this {TokenizeContext}
*   Context.
* @type {Tokenizer}
*/
function tokenizeAttention(effects, ok$2) {
	const attentionMarkers$1 = this.parser.constructs.attentionMarkers.null;
	const previous$2 = this.previous;
	const before = classifyCharacter(previous$2);
	/** @type {NonNullable<Code>} */
	let marker;
	return start;
	/**
	* Before a sequence.
	*
	* ```markdown
	* > | **
	*     ^
	* ```
	*
	* @type {State}
	*/
	function start(code$3) {
		marker = code$3;
		effects.enter("attentionSequence");
		return inside(code$3);
	}
	/**
	* In a sequence.
	*
	* ```markdown
	* > | **
	*     ^^
	* ```
	*
	* @type {State}
	*/
	function inside(code$3) {
		if (code$3 === marker) {
			effects.consume(code$3);
			return inside;
		}
		const token = effects.exit("attentionSequence");
		const after = classifyCharacter(code$3);
		const open = !after || after === 2 && before || attentionMarkers$1.includes(code$3);
		const close = !before || before === 2 && after || attentionMarkers$1.includes(previous$2);
		token._open = Boolean(marker === 42 ? open : open && (before || !close));
		token._close = Boolean(marker === 42 ? close : close && (after || !open));
		return ok$2(code$3);
	}
}
/**
* Move a point a bit.
*
* Note: `move` only works inside lines! It’s not possible to move past other
* chunks (replacement characters, tabs, or line endings).
*
* @param {Point} point
*   Point.
* @param {number} offset
*   Amount to move.
* @returns {undefined}
*   Nothing.
*/
function movePoint(point$4, offset) {
	point$4.column += offset;
	point$4.offset += offset;
	point$4._bufferIndex += offset;
}

//#endregion
//#region node_modules/micromark-core-commonmark/lib/autolink.js
/** @type {Construct} */
const autolink = {
	name: "autolink",
	tokenize: tokenizeAutolink
};
/**
* @this {TokenizeContext}
*   Context.
* @type {Tokenizer}
*/
function tokenizeAutolink(effects, ok$2, nok) {
	let size = 0;
	return start;
	/**
	* Start of an autolink.
	*
	* ```markdown
	* > | a<https://example.com>b
	*      ^
	* > | a<user@example.com>b
	*      ^
	* ```
	*
	* @type {State}
	*/
	function start(code$3) {
		effects.enter("autolink");
		effects.enter("autolinkMarker");
		effects.consume(code$3);
		effects.exit("autolinkMarker");
		effects.enter("autolinkProtocol");
		return open;
	}
	/**
	* After `<`, at protocol or atext.
	*
	* ```markdown
	* > | a<https://example.com>b
	*       ^
	* > | a<user@example.com>b
	*       ^
	* ```
	*
	* @type {State}
	*/
	function open(code$3) {
		if (asciiAlpha(code$3)) {
			effects.consume(code$3);
			return schemeOrEmailAtext;
		}
		if (code$3 === 64) return nok(code$3);
		return emailAtext(code$3);
	}
	/**
	* At second byte of protocol or atext.
	*
	* ```markdown
	* > | a<https://example.com>b
	*        ^
	* > | a<user@example.com>b
	*        ^
	* ```
	*
	* @type {State}
	*/
	function schemeOrEmailAtext(code$3) {
		if (code$3 === 43 || code$3 === 45 || code$3 === 46 || asciiAlphanumeric(code$3)) {
			size = 1;
			return schemeInsideOrEmailAtext(code$3);
		}
		return emailAtext(code$3);
	}
	/**
	* In ambiguous protocol or atext.
	*
	* ```markdown
	* > | a<https://example.com>b
	*        ^
	* > | a<user@example.com>b
	*        ^
	* ```
	*
	* @type {State}
	*/
	function schemeInsideOrEmailAtext(code$3) {
		if (code$3 === 58) {
			effects.consume(code$3);
			size = 0;
			return urlInside;
		}
		if ((code$3 === 43 || code$3 === 45 || code$3 === 46 || asciiAlphanumeric(code$3)) && size++ < 32) {
			effects.consume(code$3);
			return schemeInsideOrEmailAtext;
		}
		size = 0;
		return emailAtext(code$3);
	}
	/**
	* After protocol, in URL.
	*
	* ```markdown
	* > | a<https://example.com>b
	*             ^
	* ```
	*
	* @type {State}
	*/
	function urlInside(code$3) {
		if (code$3 === 62) {
			effects.exit("autolinkProtocol");
			effects.enter("autolinkMarker");
			effects.consume(code$3);
			effects.exit("autolinkMarker");
			effects.exit("autolink");
			return ok$2;
		}
		if (code$3 === null || code$3 === 32 || code$3 === 60 || asciiControl(code$3)) return nok(code$3);
		effects.consume(code$3);
		return urlInside;
	}
	/**
	* In email atext.
	*
	* ```markdown
	* > | a<user.name@example.com>b
	*              ^
	* ```
	*
	* @type {State}
	*/
	function emailAtext(code$3) {
		if (code$3 === 64) {
			effects.consume(code$3);
			return emailAtSignOrDot;
		}
		if (asciiAtext(code$3)) {
			effects.consume(code$3);
			return emailAtext;
		}
		return nok(code$3);
	}
	/**
	* In label, after at-sign or dot.
	*
	* ```markdown
	* > | a<user.name@example.com>b
	*                 ^       ^
	* ```
	*
	* @type {State}
	*/
	function emailAtSignOrDot(code$3) {
		return asciiAlphanumeric(code$3) ? emailLabel(code$3) : nok(code$3);
	}
	/**
	* In label, where `.` and `>` are allowed.
	*
	* ```markdown
	* > | a<user.name@example.com>b
	*                   ^
	* ```
	*
	* @type {State}
	*/
	function emailLabel(code$3) {
		if (code$3 === 46) {
			effects.consume(code$3);
			size = 0;
			return emailAtSignOrDot;
		}
		if (code$3 === 62) {
			effects.exit("autolinkProtocol").type = "autolinkEmail";
			effects.enter("autolinkMarker");
			effects.consume(code$3);
			effects.exit("autolinkMarker");
			effects.exit("autolink");
			return ok$2;
		}
		return emailValue(code$3);
	}
	/**
	* In label, where `.` and `>` are *not* allowed.
	*
	* Though, this is also used in `emailLabel` to parse other values.
	*
	* ```markdown
	* > | a<user.name@ex-ample.com>b
	*                    ^
	* ```
	*
	* @type {State}
	*/
	function emailValue(code$3) {
		if ((code$3 === 45 || asciiAlphanumeric(code$3)) && size++ < 63) {
			const next$1 = code$3 === 45 ? emailValue : emailLabel;
			effects.consume(code$3);
			return next$1;
		}
		return nok(code$3);
	}
}

//#endregion
//#region node_modules/micromark-core-commonmark/lib/blank-line.js
/** @type {Construct} */
const blankLine = {
	partial: true,
	tokenize: tokenizeBlankLine
};
/**
* @this {TokenizeContext}
*   Context.
* @type {Tokenizer}
*/
function tokenizeBlankLine(effects, ok$2, nok) {
	return start;
	/**
	* Start of blank line.
	*
	* > 👉 **Note**: `␠` represents a space character.
	*
	* ```markdown
	* > | ␠␠␊
	*     ^
	* > | ␊
	*     ^
	* ```
	*
	* @type {State}
	*/
	function start(code$3) {
		return markdownSpace(code$3) ? factorySpace(effects, after, "linePrefix")(code$3) : after(code$3);
	}
	/**
	* At eof/eol, after optional whitespace.
	*
	* > 👉 **Note**: `␠` represents a space character.
	*
	* ```markdown
	* > | ␠␠␊
	*       ^
	* > | ␊
	*     ^
	* ```
	*
	* @type {State}
	*/
	function after(code$3) {
		return code$3 === null || markdownLineEnding(code$3) ? ok$2(code$3) : nok(code$3);
	}
}

//#endregion
//#region node_modules/micromark-core-commonmark/lib/block-quote.js
/** @type {Construct} */
const blockQuote = {
	continuation: { tokenize: tokenizeBlockQuoteContinuation },
	exit: exit$1,
	name: "blockQuote",
	tokenize: tokenizeBlockQuoteStart
};
/**
* @this {TokenizeContext}
*   Context.
* @type {Tokenizer}
*/
function tokenizeBlockQuoteStart(effects, ok$2, nok) {
	const self$1 = this;
	return start;
	/**
	* Start of block quote.
	*
	* ```markdown
	* > | > a
	*     ^
	* ```
	*
	* @type {State}
	*/
	function start(code$3) {
		if (code$3 === 62) {
			const state = self$1.containerState;
			if (!state.open) {
				effects.enter("blockQuote", { _container: true });
				state.open = true;
			}
			effects.enter("blockQuotePrefix");
			effects.enter("blockQuoteMarker");
			effects.consume(code$3);
			effects.exit("blockQuoteMarker");
			return after;
		}
		return nok(code$3);
	}
	/**
	* After `>`, before optional whitespace.
	*
	* ```markdown
	* > | > a
	*      ^
	* ```
	*
	* @type {State}
	*/
	function after(code$3) {
		if (markdownSpace(code$3)) {
			effects.enter("blockQuotePrefixWhitespace");
			effects.consume(code$3);
			effects.exit("blockQuotePrefixWhitespace");
			effects.exit("blockQuotePrefix");
			return ok$2;
		}
		effects.exit("blockQuotePrefix");
		return ok$2(code$3);
	}
}
/**
* Start of block quote continuation.
*
* ```markdown
*   | > a
* > | > b
*     ^
* ```
*
* @this {TokenizeContext}
*   Context.
* @type {Tokenizer}
*/
function tokenizeBlockQuoteContinuation(effects, ok$2, nok) {
	const self$1 = this;
	return contStart;
	/**
	* Start of block quote continuation.
	*
	* Also used to parse the first block quote opening.
	*
	* ```markdown
	*   | > a
	* > | > b
	*     ^
	* ```
	*
	* @type {State}
	*/
	function contStart(code$3) {
		if (markdownSpace(code$3)) return factorySpace(effects, contBefore, "linePrefix", self$1.parser.constructs.disable.null.includes("codeIndented") ? void 0 : 4)(code$3);
		return contBefore(code$3);
	}
	/**
	* At `>`, after optional whitespace.
	*
	* Also used to parse the first block quote opening.
	*
	* ```markdown
	*   | > a
	* > | > b
	*     ^
	* ```
	*
	* @type {State}
	*/
	function contBefore(code$3) {
		return effects.attempt(blockQuote, ok$2, nok)(code$3);
	}
}
/** @type {Exiter} */
function exit$1(effects) {
	effects.exit("blockQuote");
}

//#endregion
//#region node_modules/micromark-core-commonmark/lib/character-escape.js
/** @type {Construct} */
const characterEscape = {
	name: "characterEscape",
	tokenize: tokenizeCharacterEscape
};
/**
* @this {TokenizeContext}
*   Context.
* @type {Tokenizer}
*/
function tokenizeCharacterEscape(effects, ok$2, nok) {
	return start;
	/**
	* Start of character escape.
	*
	* ```markdown
	* > | a\*b
	*      ^
	* ```
	*
	* @type {State}
	*/
	function start(code$3) {
		effects.enter("characterEscape");
		effects.enter("escapeMarker");
		effects.consume(code$3);
		effects.exit("escapeMarker");
		return inside;
	}
	/**
	* After `\`, at punctuation.
	*
	* ```markdown
	* > | a\*b
	*       ^
	* ```
	*
	* @type {State}
	*/
	function inside(code$3) {
		if (asciiPunctuation(code$3)) {
			effects.enter("characterEscapeValue");
			effects.consume(code$3);
			effects.exit("characterEscapeValue");
			effects.exit("characterEscape");
			return ok$2;
		}
		return nok(code$3);
	}
}

//#endregion
//#region node_modules/micromark-core-commonmark/lib/character-reference.js
/** @type {Construct} */
const characterReference = {
	name: "characterReference",
	tokenize: tokenizeCharacterReference
};
/**
* @this {TokenizeContext}
*   Context.
* @type {Tokenizer}
*/
function tokenizeCharacterReference(effects, ok$2, nok) {
	const self$1 = this;
	let size = 0;
	/** @type {number} */
	let max;
	/** @type {(code: Code) => boolean} */
	let test;
	return start;
	/**
	* Start of character reference.
	*
	* ```markdown
	* > | a&amp;b
	*      ^
	* > | a&#123;b
	*      ^
	* > | a&#x9;b
	*      ^
	* ```
	*
	* @type {State}
	*/
	function start(code$3) {
		effects.enter("characterReference");
		effects.enter("characterReferenceMarker");
		effects.consume(code$3);
		effects.exit("characterReferenceMarker");
		return open;
	}
	/**
	* After `&`, at `#` for numeric references or alphanumeric for named
	* references.
	*
	* ```markdown
	* > | a&amp;b
	*       ^
	* > | a&#123;b
	*       ^
	* > | a&#x9;b
	*       ^
	* ```
	*
	* @type {State}
	*/
	function open(code$3) {
		if (code$3 === 35) {
			effects.enter("characterReferenceMarkerNumeric");
			effects.consume(code$3);
			effects.exit("characterReferenceMarkerNumeric");
			return numeric;
		}
		effects.enter("characterReferenceValue");
		max = 31;
		test = asciiAlphanumeric;
		return value(code$3);
	}
	/**
	* After `#`, at `x` for hexadecimals or digit for decimals.
	*
	* ```markdown
	* > | a&#123;b
	*        ^
	* > | a&#x9;b
	*        ^
	* ```
	*
	* @type {State}
	*/
	function numeric(code$3) {
		if (code$3 === 88 || code$3 === 120) {
			effects.enter("characterReferenceMarkerHexadecimal");
			effects.consume(code$3);
			effects.exit("characterReferenceMarkerHexadecimal");
			effects.enter("characterReferenceValue");
			max = 6;
			test = asciiHexDigit;
			return value;
		}
		effects.enter("characterReferenceValue");
		max = 7;
		test = asciiDigit;
		return value(code$3);
	}
	/**
	* After markers (`&#x`, `&#`, or `&`), in value, before `;`.
	*
	* The character reference kind defines what and how many characters are
	* allowed.
	*
	* ```markdown
	* > | a&amp;b
	*       ^^^
	* > | a&#123;b
	*        ^^^
	* > | a&#x9;b
	*         ^
	* ```
	*
	* @type {State}
	*/
	function value(code$3) {
		if (code$3 === 59 && size) {
			const token = effects.exit("characterReferenceValue");
			if (test === asciiAlphanumeric && !decodeNamedCharacterReference(self$1.sliceSerialize(token))) return nok(code$3);
			effects.enter("characterReferenceMarker");
			effects.consume(code$3);
			effects.exit("characterReferenceMarker");
			effects.exit("characterReference");
			return ok$2;
		}
		if (test(code$3) && size++ < max) {
			effects.consume(code$3);
			return value;
		}
		return nok(code$3);
	}
}

//#endregion
//#region node_modules/micromark-core-commonmark/lib/code-fenced.js
/** @type {Construct} */
const nonLazyContinuation = {
	partial: true,
	tokenize: tokenizeNonLazyContinuation
};
/** @type {Construct} */
const codeFenced = {
	concrete: true,
	name: "codeFenced",
	tokenize: tokenizeCodeFenced
};
/**
* @this {TokenizeContext}
*   Context.
* @type {Tokenizer}
*/
function tokenizeCodeFenced(effects, ok$2, nok) {
	const self$1 = this;
	/** @type {Construct} */
	const closeStart = {
		partial: true,
		tokenize: tokenizeCloseStart
	};
	let initialPrefix = 0;
	let sizeOpen = 0;
	/** @type {NonNullable<Code>} */
	let marker;
	return start;
	/**
	* Start of code.
	*
	* ```markdown
	* > | ~~~js
	*     ^
	*   | alert(1)
	*   | ~~~
	* ```
	*
	* @type {State}
	*/
	function start(code$3) {
		return beforeSequenceOpen(code$3);
	}
	/**
	* In opening fence, after prefix, at sequence.
	*
	* ```markdown
	* > | ~~~js
	*     ^
	*   | alert(1)
	*   | ~~~
	* ```
	*
	* @type {State}
	*/
	function beforeSequenceOpen(code$3) {
		const tail = self$1.events[self$1.events.length - 1];
		initialPrefix = tail && tail[1].type === "linePrefix" ? tail[2].sliceSerialize(tail[1], true).length : 0;
		marker = code$3;
		effects.enter("codeFenced");
		effects.enter("codeFencedFence");
		effects.enter("codeFencedFenceSequence");
		return sequenceOpen(code$3);
	}
	/**
	* In opening fence sequence.
	*
	* ```markdown
	* > | ~~~js
	*      ^
	*   | alert(1)
	*   | ~~~
	* ```
	*
	* @type {State}
	*/
	function sequenceOpen(code$3) {
		if (code$3 === marker) {
			sizeOpen++;
			effects.consume(code$3);
			return sequenceOpen;
		}
		if (sizeOpen < 3) return nok(code$3);
		effects.exit("codeFencedFenceSequence");
		return markdownSpace(code$3) ? factorySpace(effects, infoBefore, "whitespace")(code$3) : infoBefore(code$3);
	}
	/**
	* In opening fence, after the sequence (and optional whitespace), before info.
	*
	* ```markdown
	* > | ~~~js
	*        ^
	*   | alert(1)
	*   | ~~~
	* ```
	*
	* @type {State}
	*/
	function infoBefore(code$3) {
		if (code$3 === null || markdownLineEnding(code$3)) {
			effects.exit("codeFencedFence");
			return self$1.interrupt ? ok$2(code$3) : effects.check(nonLazyContinuation, atNonLazyBreak, after)(code$3);
		}
		effects.enter("codeFencedFenceInfo");
		effects.enter("chunkString", { contentType: "string" });
		return info(code$3);
	}
	/**
	* In info.
	*
	* ```markdown
	* > | ~~~js
	*        ^
	*   | alert(1)
	*   | ~~~
	* ```
	*
	* @type {State}
	*/
	function info(code$3) {
		if (code$3 === null || markdownLineEnding(code$3)) {
			effects.exit("chunkString");
			effects.exit("codeFencedFenceInfo");
			return infoBefore(code$3);
		}
		if (markdownSpace(code$3)) {
			effects.exit("chunkString");
			effects.exit("codeFencedFenceInfo");
			return factorySpace(effects, metaBefore, "whitespace")(code$3);
		}
		if (code$3 === 96 && code$3 === marker) return nok(code$3);
		effects.consume(code$3);
		return info;
	}
	/**
	* In opening fence, after info and whitespace, before meta.
	*
	* ```markdown
	* > | ~~~js eval
	*           ^
	*   | alert(1)
	*   | ~~~
	* ```
	*
	* @type {State}
	*/
	function metaBefore(code$3) {
		if (code$3 === null || markdownLineEnding(code$3)) return infoBefore(code$3);
		effects.enter("codeFencedFenceMeta");
		effects.enter("chunkString", { contentType: "string" });
		return meta(code$3);
	}
	/**
	* In meta.
	*
	* ```markdown
	* > | ~~~js eval
	*           ^
	*   | alert(1)
	*   | ~~~
	* ```
	*
	* @type {State}
	*/
	function meta(code$3) {
		if (code$3 === null || markdownLineEnding(code$3)) {
			effects.exit("chunkString");
			effects.exit("codeFencedFenceMeta");
			return infoBefore(code$3);
		}
		if (code$3 === 96 && code$3 === marker) return nok(code$3);
		effects.consume(code$3);
		return meta;
	}
	/**
	* At eol/eof in code, before a non-lazy closing fence or content.
	*
	* ```markdown
	* > | ~~~js
	*          ^
	* > | alert(1)
	*             ^
	*   | ~~~
	* ```
	*
	* @type {State}
	*/
	function atNonLazyBreak(code$3) {
		return effects.attempt(closeStart, after, contentBefore)(code$3);
	}
	/**
	* Before code content, not a closing fence, at eol.
	*
	* ```markdown
	*   | ~~~js
	* > | alert(1)
	*             ^
	*   | ~~~
	* ```
	*
	* @type {State}
	*/
	function contentBefore(code$3) {
		effects.enter("lineEnding");
		effects.consume(code$3);
		effects.exit("lineEnding");
		return contentStart;
	}
	/**
	* Before code content, not a closing fence.
	*
	* ```markdown
	*   | ~~~js
	* > | alert(1)
	*     ^
	*   | ~~~
	* ```
	*
	* @type {State}
	*/
	function contentStart(code$3) {
		return initialPrefix > 0 && markdownSpace(code$3) ? factorySpace(effects, beforeContentChunk, "linePrefix", initialPrefix + 1)(code$3) : beforeContentChunk(code$3);
	}
	/**
	* Before code content, after optional prefix.
	*
	* ```markdown
	*   | ~~~js
	* > | alert(1)
	*     ^
	*   | ~~~
	* ```
	*
	* @type {State}
	*/
	function beforeContentChunk(code$3) {
		if (code$3 === null || markdownLineEnding(code$3)) return effects.check(nonLazyContinuation, atNonLazyBreak, after)(code$3);
		effects.enter("codeFlowValue");
		return contentChunk(code$3);
	}
	/**
	* In code content.
	*
	* ```markdown
	*   | ~~~js
	* > | alert(1)
	*     ^^^^^^^^
	*   | ~~~
	* ```
	*
	* @type {State}
	*/
	function contentChunk(code$3) {
		if (code$3 === null || markdownLineEnding(code$3)) {
			effects.exit("codeFlowValue");
			return beforeContentChunk(code$3);
		}
		effects.consume(code$3);
		return contentChunk;
	}
	/**
	* After code.
	*
	* ```markdown
	*   | ~~~js
	*   | alert(1)
	* > | ~~~
	*        ^
	* ```
	*
	* @type {State}
	*/
	function after(code$3) {
		effects.exit("codeFenced");
		return ok$2(code$3);
	}
	/**
	* @this {TokenizeContext}
	*   Context.
	* @type {Tokenizer}
	*/
	function tokenizeCloseStart(effects$1, ok$3, nok$1) {
		let size = 0;
		return startBefore;
		/**
		*
		*
		* @type {State}
		*/
		function startBefore(code$3) {
			effects$1.enter("lineEnding");
			effects$1.consume(code$3);
			effects$1.exit("lineEnding");
			return start$1;
		}
		/**
		* Before closing fence, at optional whitespace.
		*
		* ```markdown
		*   | ~~~js
		*   | alert(1)
		* > | ~~~
		*     ^
		* ```
		*
		* @type {State}
		*/
		function start$1(code$3) {
			effects$1.enter("codeFencedFence");
			return markdownSpace(code$3) ? factorySpace(effects$1, beforeSequenceClose, "linePrefix", self$1.parser.constructs.disable.null.includes("codeIndented") ? void 0 : 4)(code$3) : beforeSequenceClose(code$3);
		}
		/**
		* In closing fence, after optional whitespace, at sequence.
		*
		* ```markdown
		*   | ~~~js
		*   | alert(1)
		* > | ~~~
		*     ^
		* ```
		*
		* @type {State}
		*/
		function beforeSequenceClose(code$3) {
			if (code$3 === marker) {
				effects$1.enter("codeFencedFenceSequence");
				return sequenceClose(code$3);
			}
			return nok$1(code$3);
		}
		/**
		* In closing fence sequence.
		*
		* ```markdown
		*   | ~~~js
		*   | alert(1)
		* > | ~~~
		*     ^
		* ```
		*
		* @type {State}
		*/
		function sequenceClose(code$3) {
			if (code$3 === marker) {
				size++;
				effects$1.consume(code$3);
				return sequenceClose;
			}
			if (size >= sizeOpen) {
				effects$1.exit("codeFencedFenceSequence");
				return markdownSpace(code$3) ? factorySpace(effects$1, sequenceCloseAfter, "whitespace")(code$3) : sequenceCloseAfter(code$3);
			}
			return nok$1(code$3);
		}
		/**
		* After closing fence sequence, after optional whitespace.
		*
		* ```markdown
		*   | ~~~js
		*   | alert(1)
		* > | ~~~
		*        ^
		* ```
		*
		* @type {State}
		*/
		function sequenceCloseAfter(code$3) {
			if (code$3 === null || markdownLineEnding(code$3)) {
				effects$1.exit("codeFencedFence");
				return ok$3(code$3);
			}
			return nok$1(code$3);
		}
	}
}
/**
* @this {TokenizeContext}
*   Context.
* @type {Tokenizer}
*/
function tokenizeNonLazyContinuation(effects, ok$2, nok) {
	const self$1 = this;
	return start;
	/**
	*
	*
	* @type {State}
	*/
	function start(code$3) {
		if (code$3 === null) return nok(code$3);
		effects.enter("lineEnding");
		effects.consume(code$3);
		effects.exit("lineEnding");
		return lineStart;
	}
	/**
	*
	*
	* @type {State}
	*/
	function lineStart(code$3) {
		return self$1.parser.lazy[self$1.now().line] ? nok(code$3) : ok$2(code$3);
	}
}

//#endregion
//#region node_modules/micromark-core-commonmark/lib/code-indented.js
/** @type {Construct} */
const codeIndented = {
	name: "codeIndented",
	tokenize: tokenizeCodeIndented
};
/** @type {Construct} */
const furtherStart = {
	partial: true,
	tokenize: tokenizeFurtherStart
};
/**
* @this {TokenizeContext}
*   Context.
* @type {Tokenizer}
*/
function tokenizeCodeIndented(effects, ok$2, nok) {
	const self$1 = this;
	return start;
	/**
	* Start of code (indented).
	*
	* > **Parsing note**: it is not needed to check if this first line is a
	* > filled line (that it has a non-whitespace character), because blank lines
	* > are parsed already, so we never run into that.
	*
	* ```markdown
	* > |     aaa
	*     ^
	* ```
	*
	* @type {State}
	*/
	function start(code$3) {
		effects.enter("codeIndented");
		return factorySpace(effects, afterPrefix, "linePrefix", 5)(code$3);
	}
	/**
	* At start, after 1 or 4 spaces.
	*
	* ```markdown
	* > |     aaa
	*         ^
	* ```
	*
	* @type {State}
	*/
	function afterPrefix(code$3) {
		const tail = self$1.events[self$1.events.length - 1];
		return tail && tail[1].type === "linePrefix" && tail[2].sliceSerialize(tail[1], true).length >= 4 ? atBreak(code$3) : nok(code$3);
	}
	/**
	* At a break.
	*
	* ```markdown
	* > |     aaa
	*         ^  ^
	* ```
	*
	* @type {State}
	*/
	function atBreak(code$3) {
		if (code$3 === null) return after(code$3);
		if (markdownLineEnding(code$3)) return effects.attempt(furtherStart, atBreak, after)(code$3);
		effects.enter("codeFlowValue");
		return inside(code$3);
	}
	/**
	* In code content.
	*
	* ```markdown
	* > |     aaa
	*         ^^^^
	* ```
	*
	* @type {State}
	*/
	function inside(code$3) {
		if (code$3 === null || markdownLineEnding(code$3)) {
			effects.exit("codeFlowValue");
			return atBreak(code$3);
		}
		effects.consume(code$3);
		return inside;
	}
	/** @type {State} */
	function after(code$3) {
		effects.exit("codeIndented");
		return ok$2(code$3);
	}
}
/**
* @this {TokenizeContext}
*   Context.
* @type {Tokenizer}
*/
function tokenizeFurtherStart(effects, ok$2, nok) {
	const self$1 = this;
	return furtherStart$1;
	/**
	* At eol, trying to parse another indent.
	*
	* ```markdown
	* > |     aaa
	*            ^
	*   |     bbb
	* ```
	*
	* @type {State}
	*/
	function furtherStart$1(code$3) {
		if (self$1.parser.lazy[self$1.now().line]) return nok(code$3);
		if (markdownLineEnding(code$3)) {
			effects.enter("lineEnding");
			effects.consume(code$3);
			effects.exit("lineEnding");
			return furtherStart$1;
		}
		return factorySpace(effects, afterPrefix, "linePrefix", 5)(code$3);
	}
	/**
	* At start, after 1 or 4 spaces.
	*
	* ```markdown
	* > |     aaa
	*         ^
	* ```
	*
	* @type {State}
	*/
	function afterPrefix(code$3) {
		const tail = self$1.events[self$1.events.length - 1];
		return tail && tail[1].type === "linePrefix" && tail[2].sliceSerialize(tail[1], true).length >= 4 ? ok$2(code$3) : markdownLineEnding(code$3) ? furtherStart$1(code$3) : nok(code$3);
	}
}

//#endregion
//#region node_modules/micromark-core-commonmark/lib/code-text.js
/** @type {Construct} */
const codeText = {
	name: "codeText",
	previous: previous$1,
	resolve: resolveCodeText,
	tokenize: tokenizeCodeText
};
/** @type {Resolver} */
function resolveCodeText(events) {
	let tailExitIndex = events.length - 4;
	let headEnterIndex = 3;
	/** @type {number} */
	let index$2;
	/** @type {number | undefined} */
	let enter;
	if ((events[headEnterIndex][1].type === "lineEnding" || events[headEnterIndex][1].type === "space") && (events[tailExitIndex][1].type === "lineEnding" || events[tailExitIndex][1].type === "space")) {
		index$2 = headEnterIndex;
		while (++index$2 < tailExitIndex) if (events[index$2][1].type === "codeTextData") {
			events[headEnterIndex][1].type = "codeTextPadding";
			events[tailExitIndex][1].type = "codeTextPadding";
			headEnterIndex += 2;
			tailExitIndex -= 2;
			break;
		}
	}
	index$2 = headEnterIndex - 1;
	tailExitIndex++;
	while (++index$2 <= tailExitIndex) if (enter === void 0) {
		if (index$2 !== tailExitIndex && events[index$2][1].type !== "lineEnding") enter = index$2;
	} else if (index$2 === tailExitIndex || events[index$2][1].type === "lineEnding") {
		events[enter][1].type = "codeTextData";
		if (index$2 !== enter + 2) {
			events[enter][1].end = events[index$2 - 1][1].end;
			events.splice(enter + 2, index$2 - enter - 2);
			tailExitIndex -= index$2 - enter - 2;
			index$2 = enter + 2;
		}
		enter = void 0;
	}
	return events;
}
/**
* @this {TokenizeContext}
*   Context.
* @type {Previous}
*/
function previous$1(code$3) {
	return code$3 !== 96 || this.events[this.events.length - 1][1].type === "characterEscape";
}
/**
* @this {TokenizeContext}
*   Context.
* @type {Tokenizer}
*/
function tokenizeCodeText(effects, ok$2, nok) {
	let sizeOpen = 0;
	/** @type {number} */
	let size;
	/** @type {Token} */
	let token;
	return start;
	/**
	* Start of code (text).
	*
	* ```markdown
	* > | `a`
	*     ^
	* > | \`a`
	*      ^
	* ```
	*
	* @type {State}
	*/
	function start(code$3) {
		effects.enter("codeText");
		effects.enter("codeTextSequence");
		return sequenceOpen(code$3);
	}
	/**
	* In opening sequence.
	*
	* ```markdown
	* > | `a`
	*     ^
	* ```
	*
	* @type {State}
	*/
	function sequenceOpen(code$3) {
		if (code$3 === 96) {
			effects.consume(code$3);
			sizeOpen++;
			return sequenceOpen;
		}
		effects.exit("codeTextSequence");
		return between(code$3);
	}
	/**
	* Between something and something else.
	*
	* ```markdown
	* > | `a`
	*      ^^
	* ```
	*
	* @type {State}
	*/
	function between(code$3) {
		if (code$3 === null) return nok(code$3);
		if (code$3 === 32) {
			effects.enter("space");
			effects.consume(code$3);
			effects.exit("space");
			return between;
		}
		if (code$3 === 96) {
			token = effects.enter("codeTextSequence");
			size = 0;
			return sequenceClose(code$3);
		}
		if (markdownLineEnding(code$3)) {
			effects.enter("lineEnding");
			effects.consume(code$3);
			effects.exit("lineEnding");
			return between;
		}
		effects.enter("codeTextData");
		return data(code$3);
	}
	/**
	* In data.
	*
	* ```markdown
	* > | `a`
	*      ^
	* ```
	*
	* @type {State}
	*/
	function data(code$3) {
		if (code$3 === null || code$3 === 32 || code$3 === 96 || markdownLineEnding(code$3)) {
			effects.exit("codeTextData");
			return between(code$3);
		}
		effects.consume(code$3);
		return data;
	}
	/**
	* In closing sequence.
	*
	* ```markdown
	* > | `a`
	*       ^
	* ```
	*
	* @type {State}
	*/
	function sequenceClose(code$3) {
		if (code$3 === 96) {
			effects.consume(code$3);
			size++;
			return sequenceClose;
		}
		if (size === sizeOpen) {
			effects.exit("codeTextSequence");
			effects.exit("codeText");
			return ok$2(code$3);
		}
		token.type = "codeTextData";
		return data(code$3);
	}
}

//#endregion
//#region node_modules/micromark-util-subtokenize/lib/splice-buffer.js
/**
* Some of the internal operations of micromark do lots of editing
* operations on very large arrays. This runs into problems with two
* properties of most circa-2020 JavaScript interpreters:
*
*  - Array-length modifications at the high end of an array (push/pop) are
*    expected to be common and are implemented in (amortized) time
*    proportional to the number of elements added or removed, whereas
*    other operations (shift/unshift and splice) are much less efficient.
*  - Function arguments are passed on the stack, so adding tens of thousands
*    of elements to an array with `arr.push(...newElements)` will frequently
*    cause stack overflows. (see <https://stackoverflow.com/questions/22123769/rangeerror-maximum-call-stack-size-exceeded-why>)
*
* SpliceBuffers are an implementation of gap buffers, which are a
* generalization of the "queue made of two stacks" idea. The splice buffer
* maintains a cursor, and moving the cursor has cost proportional to the
* distance the cursor moves, but inserting, deleting, or splicing in
* new information at the cursor is as efficient as the push/pop operation.
* This allows for an efficient sequence of splices (or pushes, pops, shifts,
* or unshifts) as long such edits happen at the same part of the array or
* generally sweep through the array from the beginning to the end.
*
* The interface for splice buffers also supports large numbers of inputs by
* passing a single array argument rather passing multiple arguments on the
* function call stack.
*
* @template T
*   Item type.
*/
var SpliceBuffer = class {
	/**
	* @param {ReadonlyArray<T> | null | undefined} [initial]
	*   Initial items (optional).
	* @returns
	*   Splice buffer.
	*/
	constructor(initial) {
		/** @type {Array<T>} */
		this.left = initial ? [...initial] : [];
		/** @type {Array<T>} */
		this.right = [];
	}
	/**
	* Array access;
	* does not move the cursor.
	*
	* @param {number} index
	*   Index.
	* @return {T}
	*   Item.
	*/
	get(index$2) {
		if (index$2 < 0 || index$2 >= this.left.length + this.right.length) throw new RangeError("Cannot access index `" + index$2 + "` in a splice buffer of size `" + (this.left.length + this.right.length) + "`");
		if (index$2 < this.left.length) return this.left[index$2];
		return this.right[this.right.length - index$2 + this.left.length - 1];
	}
	/**
	* The length of the splice buffer, one greater than the largest index in the
	* array.
	*/
	get length() {
		return this.left.length + this.right.length;
	}
	/**
	* Remove and return `list[0]`;
	* moves the cursor to `0`.
	*
	* @returns {T | undefined}
	*   Item, optional.
	*/
	shift() {
		this.setCursor(0);
		return this.right.pop();
	}
	/**
	* Slice the buffer to get an array;
	* does not move the cursor.
	*
	* @param {number} start
	*   Start.
	* @param {number | null | undefined} [end]
	*   End (optional).
	* @returns {Array<T>}
	*   Array of items.
	*/
	slice(start, end) {
		/** @type {number} */
		const stop = end === null || end === void 0 ? Number.POSITIVE_INFINITY : end;
		if (stop < this.left.length) return this.left.slice(start, stop);
		if (start > this.left.length) return this.right.slice(this.right.length - stop + this.left.length, this.right.length - start + this.left.length).reverse();
		return this.left.slice(start).concat(this.right.slice(this.right.length - stop + this.left.length).reverse());
	}
	/**
	* Mimics the behavior of Array.prototype.splice() except for the change of
	* interface necessary to avoid segfaults when patching in very large arrays.
	*
	* This operation moves cursor is moved to `start` and results in the cursor
	* placed after any inserted items.
	*
	* @param {number} start
	*   Start;
	*   zero-based index at which to start changing the array;
	*   negative numbers count backwards from the end of the array and values
	*   that are out-of bounds are clamped to the appropriate end of the array.
	* @param {number | null | undefined} [deleteCount=0]
	*   Delete count (default: `0`);
	*   maximum number of elements to delete, starting from start.
	* @param {Array<T> | null | undefined} [items=[]]
	*   Items to include in place of the deleted items (default: `[]`).
	* @return {Array<T>}
	*   Any removed items.
	*/
	splice(start, deleteCount, items) {
		/** @type {number} */
		const count = deleteCount || 0;
		this.setCursor(Math.trunc(start));
		const removed = this.right.splice(this.right.length - count, Number.POSITIVE_INFINITY);
		if (items) chunkedPush(this.left, items);
		return removed.reverse();
	}
	/**
	* Remove and return the highest-numbered item in the array, so
	* `list[list.length - 1]`;
	* Moves the cursor to `length`.
	*
	* @returns {T | undefined}
	*   Item, optional.
	*/
	pop() {
		this.setCursor(Number.POSITIVE_INFINITY);
		return this.left.pop();
	}
	/**
	* Inserts a single item to the high-numbered side of the array;
	* moves the cursor to `length`.
	*
	* @param {T} item
	*   Item.
	* @returns {undefined}
	*   Nothing.
	*/
	push(item) {
		this.setCursor(Number.POSITIVE_INFINITY);
		this.left.push(item);
	}
	/**
	* Inserts many items to the high-numbered side of the array.
	* Moves the cursor to `length`.
	*
	* @param {Array<T>} items
	*   Items.
	* @returns {undefined}
	*   Nothing.
	*/
	pushMany(items) {
		this.setCursor(Number.POSITIVE_INFINITY);
		chunkedPush(this.left, items);
	}
	/**
	* Inserts a single item to the low-numbered side of the array;
	* Moves the cursor to `0`.
	*
	* @param {T} item
	*   Item.
	* @returns {undefined}
	*   Nothing.
	*/
	unshift(item) {
		this.setCursor(0);
		this.right.push(item);
	}
	/**
	* Inserts many items to the low-numbered side of the array;
	* moves the cursor to `0`.
	*
	* @param {Array<T>} items
	*   Items.
	* @returns {undefined}
	*   Nothing.
	*/
	unshiftMany(items) {
		this.setCursor(0);
		chunkedPush(this.right, items.reverse());
	}
	/**
	* Move the cursor to a specific position in the array. Requires
	* time proportional to the distance moved.
	*
	* If `n < 0`, the cursor will end up at the beginning.
	* If `n > length`, the cursor will end up at the end.
	*
	* @param {number} n
	*   Position.
	* @return {undefined}
	*   Nothing.
	*/
	setCursor(n) {
		if (n === this.left.length || n > this.left.length && this.right.length === 0 || n < 0 && this.left.length === 0) return;
		if (n < this.left.length) {
			const removed = this.left.splice(n, Number.POSITIVE_INFINITY);
			chunkedPush(this.right, removed.reverse());
		} else {
			const removed = this.right.splice(this.left.length + this.right.length - n, Number.POSITIVE_INFINITY);
			chunkedPush(this.left, removed.reverse());
		}
	}
};
/**
* Avoid stack overflow by pushing items onto the stack in segments
*
* @template T
*   Item type.
* @param {Array<T>} list
*   List to inject into.
* @param {ReadonlyArray<T>} right
*   Items to inject.
* @return {undefined}
*   Nothing.
*/
function chunkedPush(list$3, right) {
	/** @type {number} */
	let chunkStart = 0;
	if (right.length < 1e4) list$3.push(...right);
	else while (chunkStart < right.length) {
		list$3.push(...right.slice(chunkStart, chunkStart + 1e4));
		chunkStart += 1e4;
	}
}

//#endregion
//#region node_modules/micromark-util-subtokenize/index.js
/**
* Tokenize subcontent.
*
* @param {Array<Event>} eventsArray
*   List of events.
* @returns {boolean}
*   Whether subtokens were found.
*/
function subtokenize(eventsArray) {
	/** @type {Record<string, number>} */
	const jumps = {};
	let index$2 = -1;
	/** @type {Event} */
	let event;
	/** @type {number | undefined} */
	let lineIndex;
	/** @type {number} */
	let otherIndex;
	/** @type {Event} */
	let otherEvent;
	/** @type {Array<Event>} */
	let parameters;
	/** @type {Array<Event>} */
	let subevents;
	/** @type {boolean | undefined} */
	let more;
	const events = new SpliceBuffer(eventsArray);
	while (++index$2 < events.length) {
		while (index$2 in jumps) index$2 = jumps[index$2];
		event = events.get(index$2);
		if (index$2 && event[1].type === "chunkFlow" && events.get(index$2 - 1)[1].type === "listItemPrefix") {
			subevents = event[1]._tokenizer.events;
			otherIndex = 0;
			if (otherIndex < subevents.length && subevents[otherIndex][1].type === "lineEndingBlank") otherIndex += 2;
			if (otherIndex < subevents.length && subevents[otherIndex][1].type === "content") while (++otherIndex < subevents.length) {
				if (subevents[otherIndex][1].type === "content") break;
				if (subevents[otherIndex][1].type === "chunkText") {
					subevents[otherIndex][1]._isInFirstContentOfListItem = true;
					otherIndex++;
				}
			}
		}
		if (event[0] === "enter") {
			if (event[1].contentType) {
				Object.assign(jumps, subcontent(events, index$2));
				index$2 = jumps[index$2];
				more = true;
			}
		} else if (event[1]._container) {
			otherIndex = index$2;
			lineIndex = void 0;
			while (otherIndex--) {
				otherEvent = events.get(otherIndex);
				if (otherEvent[1].type === "lineEnding" || otherEvent[1].type === "lineEndingBlank") {
					if (otherEvent[0] === "enter") {
						if (lineIndex) events.get(lineIndex)[1].type = "lineEndingBlank";
						otherEvent[1].type = "lineEnding";
						lineIndex = otherIndex;
					}
				} else if (otherEvent[1].type === "linePrefix" || otherEvent[1].type === "listItemIndent") {} else break;
			}
			if (lineIndex) {
				event[1].end = { ...events.get(lineIndex)[1].start };
				parameters = events.slice(lineIndex, index$2);
				parameters.unshift(event);
				events.splice(lineIndex, index$2 - lineIndex + 1, parameters);
			}
		}
	}
	splice(eventsArray, 0, Number.POSITIVE_INFINITY, events.slice(0));
	return !more;
}
/**
* Tokenize embedded tokens.
*
* @param {SpliceBuffer<Event>} events
*   Events.
* @param {number} eventIndex
*   Index.
* @returns {Record<string, number>}
*   Gaps.
*/
function subcontent(events, eventIndex) {
	const token = events.get(eventIndex)[1];
	const context = events.get(eventIndex)[2];
	let startPosition = eventIndex - 1;
	/** @type {Array<number>} */
	const startPositions = [];
	let tokenizer = token._tokenizer;
	if (!tokenizer) {
		tokenizer = context.parser[token.contentType](token.start);
		if (token._contentTypeTextTrailing) tokenizer._contentTypeTextTrailing = true;
	}
	const childEvents = tokenizer.events;
	/** @type {Array<[number, number]>} */
	const jumps = [];
	/** @type {Record<string, number>} */
	const gaps = {};
	/** @type {Array<Chunk>} */
	let stream;
	/** @type {Token | undefined} */
	let previous$2;
	let index$2 = -1;
	/** @type {Token | undefined} */
	let current = token;
	let adjust = 0;
	let start = 0;
	const breaks = [start];
	while (current) {
		while (events.get(++startPosition)[1] !== current);
		startPositions.push(startPosition);
		if (!current._tokenizer) {
			stream = context.sliceStream(current);
			if (!current.next) stream.push(null);
			if (previous$2) tokenizer.defineSkip(current.start);
			if (current._isInFirstContentOfListItem) tokenizer._gfmTasklistFirstContentOfListItem = true;
			tokenizer.write(stream);
			if (current._isInFirstContentOfListItem) tokenizer._gfmTasklistFirstContentOfListItem = void 0;
		}
		previous$2 = current;
		current = current.next;
	}
	current = token;
	while (++index$2 < childEvents.length) if (childEvents[index$2][0] === "exit" && childEvents[index$2 - 1][0] === "enter" && childEvents[index$2][1].type === childEvents[index$2 - 1][1].type && childEvents[index$2][1].start.line !== childEvents[index$2][1].end.line) {
		start = index$2 + 1;
		breaks.push(start);
		current._tokenizer = void 0;
		current.previous = void 0;
		current = current.next;
	}
	tokenizer.events = [];
	if (current) {
		current._tokenizer = void 0;
		current.previous = void 0;
	} else breaks.pop();
	index$2 = breaks.length;
	while (index$2--) {
		const slice = childEvents.slice(breaks[index$2], breaks[index$2 + 1]);
		const start$1 = startPositions.pop();
		jumps.push([start$1, start$1 + slice.length - 1]);
		events.splice(start$1, 2, slice);
	}
	jumps.reverse();
	index$2 = -1;
	while (++index$2 < jumps.length) {
		gaps[adjust + jumps[index$2][0]] = adjust + jumps[index$2][1];
		adjust += jumps[index$2][1] - jumps[index$2][0] - 1;
	}
	return gaps;
}

//#endregion
//#region node_modules/micromark-core-commonmark/lib/content.js
/**
* No name because it must not be turned off.
* @type {Construct}
*/
const content$1 = {
	resolve: resolveContent,
	tokenize: tokenizeContent
};
/** @type {Construct} */
const continuationConstruct = {
	partial: true,
	tokenize: tokenizeContinuation
};
/**
* Content is transparent: it’s parsed right now. That way, definitions are also
* parsed right now: before text in paragraphs (specifically, media) are parsed.
*
* @type {Resolver}
*/
function resolveContent(events) {
	subtokenize(events);
	return events;
}
/**
* @this {TokenizeContext}
*   Context.
* @type {Tokenizer}
*/
function tokenizeContent(effects, ok$2) {
	/** @type {Token | undefined} */
	let previous$2;
	return chunkStart;
	/**
	* Before a content chunk.
	*
	* ```markdown
	* > | abc
	*     ^
	* ```
	*
	* @type {State}
	*/
	function chunkStart(code$3) {
		effects.enter("content");
		previous$2 = effects.enter("chunkContent", { contentType: "content" });
		return chunkInside(code$3);
	}
	/**
	* In a content chunk.
	*
	* ```markdown
	* > | abc
	*     ^^^
	* ```
	*
	* @type {State}
	*/
	function chunkInside(code$3) {
		if (code$3 === null) return contentEnd(code$3);
		if (markdownLineEnding(code$3)) return effects.check(continuationConstruct, contentContinue, contentEnd)(code$3);
		effects.consume(code$3);
		return chunkInside;
	}
	/**
	*
	*
	* @type {State}
	*/
	function contentEnd(code$3) {
		effects.exit("chunkContent");
		effects.exit("content");
		return ok$2(code$3);
	}
	/**
	*
	*
	* @type {State}
	*/
	function contentContinue(code$3) {
		effects.consume(code$3);
		effects.exit("chunkContent");
		previous$2.next = effects.enter("chunkContent", {
			contentType: "content",
			previous: previous$2
		});
		previous$2 = previous$2.next;
		return chunkInside;
	}
}
/**
* @this {TokenizeContext}
*   Context.
* @type {Tokenizer}
*/
function tokenizeContinuation(effects, ok$2, nok) {
	const self$1 = this;
	return startLookahead;
	/**
	*
	*
	* @type {State}
	*/
	function startLookahead(code$3) {
		effects.exit("chunkContent");
		effects.enter("lineEnding");
		effects.consume(code$3);
		effects.exit("lineEnding");
		return factorySpace(effects, prefixed, "linePrefix");
	}
	/**
	*
	*
	* @type {State}
	*/
	function prefixed(code$3) {
		if (code$3 === null || markdownLineEnding(code$3)) return nok(code$3);
		const tail = self$1.events[self$1.events.length - 1];
		if (!self$1.parser.constructs.disable.null.includes("codeIndented") && tail && tail[1].type === "linePrefix" && tail[2].sliceSerialize(tail[1], true).length >= 4) return ok$2(code$3);
		return effects.interrupt(self$1.parser.constructs.flow, nok, ok$2)(code$3);
	}
}

//#endregion
//#region node_modules/micromark-factory-destination/index.js
/**
* Parse destinations.
*
* ###### Examples
*
* ```markdown
* <a>
* <a\>b>
* <a b>
* <a)>
* a
* a\)b
* a(b)c
* a(b)
* ```
*
* @param {Effects} effects
*   Context.
* @param {State} ok
*   State switched to when successful.
* @param {State} nok
*   State switched to when unsuccessful.
* @param {TokenType} type
*   Type for whole (`<a>` or `b`).
* @param {TokenType} literalType
*   Type when enclosed (`<a>`).
* @param {TokenType} literalMarkerType
*   Type for enclosing (`<` and `>`).
* @param {TokenType} rawType
*   Type when not enclosed (`b`).
* @param {TokenType} stringType
*   Type for the value (`a` or `b`).
* @param {number | undefined} [max=Infinity]
*   Depth of nested parens (inclusive).
* @returns {State}
*   Start state.
*/
function factoryDestination(effects, ok$2, nok, type, literalType, literalMarkerType, rawType, stringType, max) {
	const limit = max || Number.POSITIVE_INFINITY;
	let balance = 0;
	return start;
	/**
	* Start of destination.
	*
	* ```markdown
	* > | <aa>
	*     ^
	* > | aa
	*     ^
	* ```
	*
	* @type {State}
	*/
	function start(code$3) {
		if (code$3 === 60) {
			effects.enter(type);
			effects.enter(literalType);
			effects.enter(literalMarkerType);
			effects.consume(code$3);
			effects.exit(literalMarkerType);
			return enclosedBefore;
		}
		if (code$3 === null || code$3 === 32 || code$3 === 41 || asciiControl(code$3)) return nok(code$3);
		effects.enter(type);
		effects.enter(rawType);
		effects.enter(stringType);
		effects.enter("chunkString", { contentType: "string" });
		return raw$1(code$3);
	}
	/**
	* After `<`, at an enclosed destination.
	*
	* ```markdown
	* > | <aa>
	*      ^
	* ```
	*
	* @type {State}
	*/
	function enclosedBefore(code$3) {
		if (code$3 === 62) {
			effects.enter(literalMarkerType);
			effects.consume(code$3);
			effects.exit(literalMarkerType);
			effects.exit(literalType);
			effects.exit(type);
			return ok$2;
		}
		effects.enter(stringType);
		effects.enter("chunkString", { contentType: "string" });
		return enclosed(code$3);
	}
	/**
	* In enclosed destination.
	*
	* ```markdown
	* > | <aa>
	*      ^
	* ```
	*
	* @type {State}
	*/
	function enclosed(code$3) {
		if (code$3 === 62) {
			effects.exit("chunkString");
			effects.exit(stringType);
			return enclosedBefore(code$3);
		}
		if (code$3 === null || code$3 === 60 || markdownLineEnding(code$3)) return nok(code$3);
		effects.consume(code$3);
		return code$3 === 92 ? enclosedEscape : enclosed;
	}
	/**
	* After `\`, at a special character.
	*
	* ```markdown
	* > | <a\*a>
	*        ^
	* ```
	*
	* @type {State}
	*/
	function enclosedEscape(code$3) {
		if (code$3 === 60 || code$3 === 62 || code$3 === 92) {
			effects.consume(code$3);
			return enclosed;
		}
		return enclosed(code$3);
	}
	/**
	* In raw destination.
	*
	* ```markdown
	* > | aa
	*     ^
	* ```
	*
	* @type {State}
	*/
	function raw$1(code$3) {
		if (!balance && (code$3 === null || code$3 === 41 || markdownLineEndingOrSpace(code$3))) {
			effects.exit("chunkString");
			effects.exit(stringType);
			effects.exit(rawType);
			effects.exit(type);
			return ok$2(code$3);
		}
		if (balance < limit && code$3 === 40) {
			effects.consume(code$3);
			balance++;
			return raw$1;
		}
		if (code$3 === 41) {
			effects.consume(code$3);
			balance--;
			return raw$1;
		}
		if (code$3 === null || code$3 === 32 || code$3 === 40 || asciiControl(code$3)) return nok(code$3);
		effects.consume(code$3);
		return code$3 === 92 ? rawEscape : raw$1;
	}
	/**
	* After `\`, at special character.
	*
	* ```markdown
	* > | a\*a
	*       ^
	* ```
	*
	* @type {State}
	*/
	function rawEscape(code$3) {
		if (code$3 === 40 || code$3 === 41 || code$3 === 92) {
			effects.consume(code$3);
			return raw$1;
		}
		return raw$1(code$3);
	}
}

//#endregion
//#region node_modules/micromark-factory-label/index.js
/**
* Parse labels.
*
* > 👉 **Note**: labels in markdown are capped at 999 characters in the string.
*
* ###### Examples
*
* ```markdown
* [a]
* [a
* b]
* [a\]b]
* ```
*
* @this {TokenizeContext}
*   Tokenize context.
* @param {Effects} effects
*   Context.
* @param {State} ok
*   State switched to when successful.
* @param {State} nok
*   State switched to when unsuccessful.
* @param {TokenType} type
*   Type of the whole label (`[a]`).
* @param {TokenType} markerType
*   Type for the markers (`[` and `]`).
* @param {TokenType} stringType
*   Type for the identifier (`a`).
* @returns {State}
*   Start state.
*/
function factoryLabel(effects, ok$2, nok, type, markerType, stringType) {
	const self$1 = this;
	let size = 0;
	/** @type {boolean} */
	let seen;
	return start;
	/**
	* Start of label.
	*
	* ```markdown
	* > | [a]
	*     ^
	* ```
	*
	* @type {State}
	*/
	function start(code$3) {
		effects.enter(type);
		effects.enter(markerType);
		effects.consume(code$3);
		effects.exit(markerType);
		effects.enter(stringType);
		return atBreak;
	}
	/**
	* In label, at something, before something else.
	*
	* ```markdown
	* > | [a]
	*      ^
	* ```
	*
	* @type {State}
	*/
	function atBreak(code$3) {
		if (size > 999 || code$3 === null || code$3 === 91 || code$3 === 93 && !seen || code$3 === 94 && !size && "_hiddenFootnoteSupport" in self$1.parser.constructs) return nok(code$3);
		if (code$3 === 93) {
			effects.exit(stringType);
			effects.enter(markerType);
			effects.consume(code$3);
			effects.exit(markerType);
			effects.exit(type);
			return ok$2;
		}
		if (markdownLineEnding(code$3)) {
			effects.enter("lineEnding");
			effects.consume(code$3);
			effects.exit("lineEnding");
			return atBreak;
		}
		effects.enter("chunkString", { contentType: "string" });
		return labelInside(code$3);
	}
	/**
	* In label, in text.
	*
	* ```markdown
	* > | [a]
	*      ^
	* ```
	*
	* @type {State}
	*/
	function labelInside(code$3) {
		if (code$3 === null || code$3 === 91 || code$3 === 93 || markdownLineEnding(code$3) || size++ > 999) {
			effects.exit("chunkString");
			return atBreak(code$3);
		}
		effects.consume(code$3);
		if (!seen) seen = !markdownSpace(code$3);
		return code$3 === 92 ? labelEscape : labelInside;
	}
	/**
	* After `\`, at a special character.
	*
	* ```markdown
	* > | [a\*a]
	*        ^
	* ```
	*
	* @type {State}
	*/
	function labelEscape(code$3) {
		if (code$3 === 91 || code$3 === 92 || code$3 === 93) {
			effects.consume(code$3);
			size++;
			return labelInside;
		}
		return labelInside(code$3);
	}
}

//#endregion
//#region node_modules/micromark-factory-title/index.js
/**
* Parse titles.
*
* ###### Examples
*
* ```markdown
* "a"
* 'b'
* (c)
* "a
* b"
* 'a
*     b'
* (a\)b)
* ```
*
* @param {Effects} effects
*   Context.
* @param {State} ok
*   State switched to when successful.
* @param {State} nok
*   State switched to when unsuccessful.
* @param {TokenType} type
*   Type of the whole title (`"a"`, `'b'`, `(c)`).
* @param {TokenType} markerType
*   Type for the markers (`"`, `'`, `(`, and `)`).
* @param {TokenType} stringType
*   Type for the value (`a`).
* @returns {State}
*   Start state.
*/
function factoryTitle(effects, ok$2, nok, type, markerType, stringType) {
	/** @type {NonNullable<Code>} */
	let marker;
	return start;
	/**
	* Start of title.
	*
	* ```markdown
	* > | "a"
	*     ^
	* ```
	*
	* @type {State}
	*/
	function start(code$3) {
		if (code$3 === 34 || code$3 === 39 || code$3 === 40) {
			effects.enter(type);
			effects.enter(markerType);
			effects.consume(code$3);
			effects.exit(markerType);
			marker = code$3 === 40 ? 41 : code$3;
			return begin;
		}
		return nok(code$3);
	}
	/**
	* After opening marker.
	*
	* This is also used at the closing marker.
	*
	* ```markdown
	* > | "a"
	*      ^
	* ```
	*
	* @type {State}
	*/
	function begin(code$3) {
		if (code$3 === marker) {
			effects.enter(markerType);
			effects.consume(code$3);
			effects.exit(markerType);
			effects.exit(type);
			return ok$2;
		}
		effects.enter(stringType);
		return atBreak(code$3);
	}
	/**
	* At something, before something else.
	*
	* ```markdown
	* > | "a"
	*      ^
	* ```
	*
	* @type {State}
	*/
	function atBreak(code$3) {
		if (code$3 === marker) {
			effects.exit(stringType);
			return begin(marker);
		}
		if (code$3 === null) return nok(code$3);
		if (markdownLineEnding(code$3)) {
			effects.enter("lineEnding");
			effects.consume(code$3);
			effects.exit("lineEnding");
			return factorySpace(effects, atBreak, "linePrefix");
		}
		effects.enter("chunkString", { contentType: "string" });
		return inside(code$3);
	}
	/**
	*
	*
	* @type {State}
	*/
	function inside(code$3) {
		if (code$3 === marker || code$3 === null || markdownLineEnding(code$3)) {
			effects.exit("chunkString");
			return atBreak(code$3);
		}
		effects.consume(code$3);
		return code$3 === 92 ? escape : inside;
	}
	/**
	* After `\`, at a special character.
	*
	* ```markdown
	* > | "a\*b"
	*      ^
	* ```
	*
	* @type {State}
	*/
	function escape(code$3) {
		if (code$3 === marker || code$3 === 92) {
			effects.consume(code$3);
			return inside;
		}
		return inside(code$3);
	}
}

//#endregion
//#region node_modules/micromark-factory-whitespace/index.js
/**
* Parse spaces and tabs.
*
* There is no `nok` parameter:
*
* *   line endings or spaces in markdown are often optional, in which case this
*     factory can be used and `ok` will be switched to whether spaces were found
*     or not
* *   one line ending or space can be detected with
*     `markdownLineEndingOrSpace(code)` right before using `factoryWhitespace`
*
* @param {Effects} effects
*   Context.
* @param {State} ok
*   State switched to when successful.
* @returns {State}
*   Start state.
*/
function factoryWhitespace(effects, ok$2) {
	/** @type {boolean} */
	let seen;
	return start;
	/** @type {State} */
	function start(code$3) {
		if (markdownLineEnding(code$3)) {
			effects.enter("lineEnding");
			effects.consume(code$3);
			effects.exit("lineEnding");
			seen = true;
			return start;
		}
		if (markdownSpace(code$3)) return factorySpace(effects, start, seen ? "linePrefix" : "lineSuffix")(code$3);
		return ok$2(code$3);
	}
}

//#endregion
//#region node_modules/micromark-core-commonmark/lib/definition.js
/** @type {Construct} */
const definition$1 = {
	name: "definition",
	tokenize: tokenizeDefinition
};
/** @type {Construct} */
const titleBefore = {
	partial: true,
	tokenize: tokenizeTitleBefore
};
/**
* @this {TokenizeContext}
*   Context.
* @type {Tokenizer}
*/
function tokenizeDefinition(effects, ok$2, nok) {
	const self$1 = this;
	/** @type {string} */
	let identifier;
	return start;
	/**
	* At start of a definition.
	*
	* ```markdown
	* > | [a]: b "c"
	*     ^
	* ```
	*
	* @type {State}
	*/
	function start(code$3) {
		effects.enter("definition");
		return before(code$3);
	}
	/**
	* After optional whitespace, at `[`.
	*
	* ```markdown
	* > | [a]: b "c"
	*     ^
	* ```
	*
	* @type {State}
	*/
	function before(code$3) {
		return factoryLabel.call(self$1, effects, labelAfter, nok, "definitionLabel", "definitionLabelMarker", "definitionLabelString")(code$3);
	}
	/**
	* After label.
	*
	* ```markdown
	* > | [a]: b "c"
	*        ^
	* ```
	*
	* @type {State}
	*/
	function labelAfter(code$3) {
		identifier = normalizeIdentifier(self$1.sliceSerialize(self$1.events[self$1.events.length - 1][1]).slice(1, -1));
		if (code$3 === 58) {
			effects.enter("definitionMarker");
			effects.consume(code$3);
			effects.exit("definitionMarker");
			return markerAfter;
		}
		return nok(code$3);
	}
	/**
	* After marker.
	*
	* ```markdown
	* > | [a]: b "c"
	*         ^
	* ```
	*
	* @type {State}
	*/
	function markerAfter(code$3) {
		return markdownLineEndingOrSpace(code$3) ? factoryWhitespace(effects, destinationBefore)(code$3) : destinationBefore(code$3);
	}
	/**
	* Before destination.
	*
	* ```markdown
	* > | [a]: b "c"
	*          ^
	* ```
	*
	* @type {State}
	*/
	function destinationBefore(code$3) {
		return factoryDestination(effects, destinationAfter, nok, "definitionDestination", "definitionDestinationLiteral", "definitionDestinationLiteralMarker", "definitionDestinationRaw", "definitionDestinationString")(code$3);
	}
	/**
	* After destination.
	*
	* ```markdown
	* > | [a]: b "c"
	*           ^
	* ```
	*
	* @type {State}
	*/
	function destinationAfter(code$3) {
		return effects.attempt(titleBefore, after, after)(code$3);
	}
	/**
	* After definition.
	*
	* ```markdown
	* > | [a]: b
	*           ^
	* > | [a]: b "c"
	*               ^
	* ```
	*
	* @type {State}
	*/
	function after(code$3) {
		return markdownSpace(code$3) ? factorySpace(effects, afterWhitespace, "whitespace")(code$3) : afterWhitespace(code$3);
	}
	/**
	* After definition, after optional whitespace.
	*
	* ```markdown
	* > | [a]: b
	*           ^
	* > | [a]: b "c"
	*               ^
	* ```
	*
	* @type {State}
	*/
	function afterWhitespace(code$3) {
		if (code$3 === null || markdownLineEnding(code$3)) {
			effects.exit("definition");
			self$1.parser.defined.push(identifier);
			return ok$2(code$3);
		}
		return nok(code$3);
	}
}
/**
* @this {TokenizeContext}
*   Context.
* @type {Tokenizer}
*/
function tokenizeTitleBefore(effects, ok$2, nok) {
	return titleBefore$1;
	/**
	* After destination, at whitespace.
	*
	* ```markdown
	* > | [a]: b
	*           ^
	* > | [a]: b "c"
	*           ^
	* ```
	*
	* @type {State}
	*/
	function titleBefore$1(code$3) {
		return markdownLineEndingOrSpace(code$3) ? factoryWhitespace(effects, beforeMarker)(code$3) : nok(code$3);
	}
	/**
	* At title.
	*
	* ```markdown
	*   | [a]: b
	* > | "c"
	*     ^
	* ```
	*
	* @type {State}
	*/
	function beforeMarker(code$3) {
		return factoryTitle(effects, titleAfter, nok, "definitionTitle", "definitionTitleMarker", "definitionTitleString")(code$3);
	}
	/**
	* After title.
	*
	* ```markdown
	* > | [a]: b "c"
	*               ^
	* ```
	*
	* @type {State}
	*/
	function titleAfter(code$3) {
		return markdownSpace(code$3) ? factorySpace(effects, titleAfterOptionalWhitespace, "whitespace")(code$3) : titleAfterOptionalWhitespace(code$3);
	}
	/**
	* After title, after optional whitespace.
	*
	* ```markdown
	* > | [a]: b "c"
	*               ^
	* ```
	*
	* @type {State}
	*/
	function titleAfterOptionalWhitespace(code$3) {
		return code$3 === null || markdownLineEnding(code$3) ? ok$2(code$3) : nok(code$3);
	}
}

//#endregion
//#region node_modules/micromark-core-commonmark/lib/hard-break-escape.js
/** @type {Construct} */
const hardBreakEscape = {
	name: "hardBreakEscape",
	tokenize: tokenizeHardBreakEscape
};
/**
* @this {TokenizeContext}
*   Context.
* @type {Tokenizer}
*/
function tokenizeHardBreakEscape(effects, ok$2, nok) {
	return start;
	/**
	* Start of a hard break (escape).
	*
	* ```markdown
	* > | a\
	*      ^
	*   | b
	* ```
	*
	* @type {State}
	*/
	function start(code$3) {
		effects.enter("hardBreakEscape");
		effects.consume(code$3);
		return after;
	}
	/**
	* After `\`, at eol.
	*
	* ```markdown
	* > | a\
	*       ^
	*   | b
	* ```
	*
	*  @type {State}
	*/
	function after(code$3) {
		if (markdownLineEnding(code$3)) {
			effects.exit("hardBreakEscape");
			return ok$2(code$3);
		}
		return nok(code$3);
	}
}

//#endregion
//#region node_modules/micromark-core-commonmark/lib/heading-atx.js
/** @type {Construct} */
const headingAtx = {
	name: "headingAtx",
	resolve: resolveHeadingAtx,
	tokenize: tokenizeHeadingAtx
};
/** @type {Resolver} */
function resolveHeadingAtx(events, context) {
	let contentEnd = events.length - 2;
	let contentStart = 3;
	/** @type {Token} */
	let content$2;
	/** @type {Token} */
	let text$9;
	if (events[contentStart][1].type === "whitespace") contentStart += 2;
	if (contentEnd - 2 > contentStart && events[contentEnd][1].type === "whitespace") contentEnd -= 2;
	if (events[contentEnd][1].type === "atxHeadingSequence" && (contentStart === contentEnd - 1 || contentEnd - 4 > contentStart && events[contentEnd - 2][1].type === "whitespace")) contentEnd -= contentStart + 1 === contentEnd ? 2 : 4;
	if (contentEnd > contentStart) {
		content$2 = {
			type: "atxHeadingText",
			start: events[contentStart][1].start,
			end: events[contentEnd][1].end
		};
		text$9 = {
			type: "chunkText",
			start: events[contentStart][1].start,
			end: events[contentEnd][1].end,
			contentType: "text"
		};
		splice(events, contentStart, contentEnd - contentStart + 1, [
			[
				"enter",
				content$2,
				context
			],
			[
				"enter",
				text$9,
				context
			],
			[
				"exit",
				text$9,
				context
			],
			[
				"exit",
				content$2,
				context
			]
		]);
	}
	return events;
}
/**
* @this {TokenizeContext}
*   Context.
* @type {Tokenizer}
*/
function tokenizeHeadingAtx(effects, ok$2, nok) {
	let size = 0;
	return start;
	/**
	* Start of a heading (atx).
	*
	* ```markdown
	* > | ## aa
	*     ^
	* ```
	*
	* @type {State}
	*/
	function start(code$3) {
		effects.enter("atxHeading");
		return before(code$3);
	}
	/**
	* After optional whitespace, at `#`.
	*
	* ```markdown
	* > | ## aa
	*     ^
	* ```
	*
	* @type {State}
	*/
	function before(code$3) {
		effects.enter("atxHeadingSequence");
		return sequenceOpen(code$3);
	}
	/**
	* In opening sequence.
	*
	* ```markdown
	* > | ## aa
	*     ^
	* ```
	*
	* @type {State}
	*/
	function sequenceOpen(code$3) {
		if (code$3 === 35 && size++ < 6) {
			effects.consume(code$3);
			return sequenceOpen;
		}
		if (code$3 === null || markdownLineEndingOrSpace(code$3)) {
			effects.exit("atxHeadingSequence");
			return atBreak(code$3);
		}
		return nok(code$3);
	}
	/**
	* After something, before something else.
	*
	* ```markdown
	* > | ## aa
	*       ^
	* ```
	*
	* @type {State}
	*/
	function atBreak(code$3) {
		if (code$3 === 35) {
			effects.enter("atxHeadingSequence");
			return sequenceFurther(code$3);
		}
		if (code$3 === null || markdownLineEnding(code$3)) {
			effects.exit("atxHeading");
			return ok$2(code$3);
		}
		if (markdownSpace(code$3)) return factorySpace(effects, atBreak, "whitespace")(code$3);
		effects.enter("atxHeadingText");
		return data(code$3);
	}
	/**
	* In further sequence (after whitespace).
	*
	* Could be normal “visible” hashes in the heading or a final sequence.
	*
	* ```markdown
	* > | ## aa ##
	*           ^
	* ```
	*
	* @type {State}
	*/
	function sequenceFurther(code$3) {
		if (code$3 === 35) {
			effects.consume(code$3);
			return sequenceFurther;
		}
		effects.exit("atxHeadingSequence");
		return atBreak(code$3);
	}
	/**
	* In text.
	*
	* ```markdown
	* > | ## aa
	*        ^
	* ```
	*
	* @type {State}
	*/
	function data(code$3) {
		if (code$3 === null || code$3 === 35 || markdownLineEndingOrSpace(code$3)) {
			effects.exit("atxHeadingText");
			return atBreak(code$3);
		}
		effects.consume(code$3);
		return data;
	}
}

//#endregion
//#region node_modules/micromark-util-html-tag-name/index.js
/**
* List of lowercase HTML “block” tag names.
*
* The list, when parsing HTML (flow), results in more relaxed rules (condition
* 6).
* Because they are known blocks, the HTML-like syntax doesn’t have to be
* strictly parsed.
* For tag names not in this list, a more strict algorithm (condition 7) is used
* to detect whether the HTML-like syntax is seen as HTML (flow) or not.
*
* This is copied from:
* <https://spec.commonmark.org/0.30/#html-blocks>.
*
* > 👉 **Note**: `search` was added in `CommonMark@0.31`.
*/
const htmlBlockNames = [
	"address",
	"article",
	"aside",
	"base",
	"basefont",
	"blockquote",
	"body",
	"caption",
	"center",
	"col",
	"colgroup",
	"dd",
	"details",
	"dialog",
	"dir",
	"div",
	"dl",
	"dt",
	"fieldset",
	"figcaption",
	"figure",
	"footer",
	"form",
	"frame",
	"frameset",
	"h1",
	"h2",
	"h3",
	"h4",
	"h5",
	"h6",
	"head",
	"header",
	"hr",
	"html",
	"iframe",
	"legend",
	"li",
	"link",
	"main",
	"menu",
	"menuitem",
	"nav",
	"noframes",
	"ol",
	"optgroup",
	"option",
	"p",
	"param",
	"search",
	"section",
	"summary",
	"table",
	"tbody",
	"td",
	"tfoot",
	"th",
	"thead",
	"title",
	"tr",
	"track",
	"ul"
];
/**
* List of lowercase HTML “raw” tag names.
*
* The list, when parsing HTML (flow), results in HTML that can include lines
* without exiting, until a closing tag also in this list is found (condition
* 1).
*
* This module is copied from:
* <https://spec.commonmark.org/0.30/#html-blocks>.
*
* > 👉 **Note**: `textarea` was added in `CommonMark@0.30`.
*/
const htmlRawNames = [
	"pre",
	"script",
	"style",
	"textarea"
];

//#endregion
//#region node_modules/micromark-core-commonmark/lib/html-flow.js
/** @type {Construct} */
const htmlFlow = {
	concrete: true,
	name: "htmlFlow",
	resolveTo: resolveToHtmlFlow,
	tokenize: tokenizeHtmlFlow
};
/** @type {Construct} */
const blankLineBefore = {
	partial: true,
	tokenize: tokenizeBlankLineBefore
};
const nonLazyContinuationStart = {
	partial: true,
	tokenize: tokenizeNonLazyContinuationStart
};
/** @type {Resolver} */
function resolveToHtmlFlow(events) {
	let index$2 = events.length;
	while (index$2--) if (events[index$2][0] === "enter" && events[index$2][1].type === "htmlFlow") break;
	if (index$2 > 1 && events[index$2 - 2][1].type === "linePrefix") {
		events[index$2][1].start = events[index$2 - 2][1].start;
		events[index$2 + 1][1].start = events[index$2 - 2][1].start;
		events.splice(index$2 - 2, 2);
	}
	return events;
}
/**
* @this {TokenizeContext}
*   Context.
* @type {Tokenizer}
*/
function tokenizeHtmlFlow(effects, ok$2, nok) {
	const self$1 = this;
	/** @type {number} */
	let marker;
	/** @type {boolean} */
	let closingTag;
	/** @type {string} */
	let buffer;
	/** @type {number} */
	let index$2;
	/** @type {Code} */
	let markerB;
	return start;
	/**
	* Start of HTML (flow).
	*
	* ```markdown
	* > | <x />
	*     ^
	* ```
	*
	* @type {State}
	*/
	function start(code$3) {
		return before(code$3);
	}
	/**
	* At `<`, after optional whitespace.
	*
	* ```markdown
	* > | <x />
	*     ^
	* ```
	*
	* @type {State}
	*/
	function before(code$3) {
		effects.enter("htmlFlow");
		effects.enter("htmlFlowData");
		effects.consume(code$3);
		return open;
	}
	/**
	* After `<`, at tag name or other stuff.
	*
	* ```markdown
	* > | <x />
	*      ^
	* > | <!doctype>
	*      ^
	* > | <!--xxx-->
	*      ^
	* ```
	*
	* @type {State}
	*/
	function open(code$3) {
		if (code$3 === 33) {
			effects.consume(code$3);
			return declarationOpen;
		}
		if (code$3 === 47) {
			effects.consume(code$3);
			closingTag = true;
			return tagCloseStart;
		}
		if (code$3 === 63) {
			effects.consume(code$3);
			marker = 3;
			return self$1.interrupt ? ok$2 : continuationDeclarationInside;
		}
		if (asciiAlpha(code$3)) {
			effects.consume(code$3);
			buffer = String.fromCharCode(code$3);
			return tagName;
		}
		return nok(code$3);
	}
	/**
	* After `<!`, at declaration, comment, or CDATA.
	*
	* ```markdown
	* > | <!doctype>
	*       ^
	* > | <!--xxx-->
	*       ^
	* > | <![CDATA[>&<]]>
	*       ^
	* ```
	*
	* @type {State}
	*/
	function declarationOpen(code$3) {
		if (code$3 === 45) {
			effects.consume(code$3);
			marker = 2;
			return commentOpenInside;
		}
		if (code$3 === 91) {
			effects.consume(code$3);
			marker = 5;
			index$2 = 0;
			return cdataOpenInside;
		}
		if (asciiAlpha(code$3)) {
			effects.consume(code$3);
			marker = 4;
			return self$1.interrupt ? ok$2 : continuationDeclarationInside;
		}
		return nok(code$3);
	}
	/**
	* After `<!-`, inside a comment, at another `-`.
	*
	* ```markdown
	* > | <!--xxx-->
	*        ^
	* ```
	*
	* @type {State}
	*/
	function commentOpenInside(code$3) {
		if (code$3 === 45) {
			effects.consume(code$3);
			return self$1.interrupt ? ok$2 : continuationDeclarationInside;
		}
		return nok(code$3);
	}
	/**
	* After `<![`, inside CDATA, expecting `CDATA[`.
	*
	* ```markdown
	* > | <![CDATA[>&<]]>
	*        ^^^^^^
	* ```
	*
	* @type {State}
	*/
	function cdataOpenInside(code$3) {
		if (code$3 === "CDATA[".charCodeAt(index$2++)) {
			effects.consume(code$3);
			if (index$2 === 6) return self$1.interrupt ? ok$2 : continuation;
			return cdataOpenInside;
		}
		return nok(code$3);
	}
	/**
	* After `</`, in closing tag, at tag name.
	*
	* ```markdown
	* > | </x>
	*       ^
	* ```
	*
	* @type {State}
	*/
	function tagCloseStart(code$3) {
		if (asciiAlpha(code$3)) {
			effects.consume(code$3);
			buffer = String.fromCharCode(code$3);
			return tagName;
		}
		return nok(code$3);
	}
	/**
	* In tag name.
	*
	* ```markdown
	* > | <ab>
	*      ^^
	* > | </ab>
	*       ^^
	* ```
	*
	* @type {State}
	*/
	function tagName(code$3) {
		if (code$3 === null || code$3 === 47 || code$3 === 62 || markdownLineEndingOrSpace(code$3)) {
			const slash = code$3 === 47;
			const name$1 = buffer.toLowerCase();
			if (!slash && !closingTag && htmlRawNames.includes(name$1)) {
				marker = 1;
				return self$1.interrupt ? ok$2(code$3) : continuation(code$3);
			}
			if (htmlBlockNames.includes(buffer.toLowerCase())) {
				marker = 6;
				if (slash) {
					effects.consume(code$3);
					return basicSelfClosing;
				}
				return self$1.interrupt ? ok$2(code$3) : continuation(code$3);
			}
			marker = 7;
			return self$1.interrupt && !self$1.parser.lazy[self$1.now().line] ? nok(code$3) : closingTag ? completeClosingTagAfter(code$3) : completeAttributeNameBefore(code$3);
		}
		if (code$3 === 45 || asciiAlphanumeric(code$3)) {
			effects.consume(code$3);
			buffer += String.fromCharCode(code$3);
			return tagName;
		}
		return nok(code$3);
	}
	/**
	* After closing slash of a basic tag name.
	*
	* ```markdown
	* > | <div/>
	*          ^
	* ```
	*
	* @type {State}
	*/
	function basicSelfClosing(code$3) {
		if (code$3 === 62) {
			effects.consume(code$3);
			return self$1.interrupt ? ok$2 : continuation;
		}
		return nok(code$3);
	}
	/**
	* After closing slash of a complete tag name.
	*
	* ```markdown
	* > | <x/>
	*        ^
	* ```
	*
	* @type {State}
	*/
	function completeClosingTagAfter(code$3) {
		if (markdownSpace(code$3)) {
			effects.consume(code$3);
			return completeClosingTagAfter;
		}
		return completeEnd(code$3);
	}
	/**
	* At an attribute name.
	*
	* At first, this state is used after a complete tag name, after whitespace,
	* where it expects optional attributes or the end of the tag.
	* It is also reused after attributes, when expecting more optional
	* attributes.
	*
	* ```markdown
	* > | <a />
	*        ^
	* > | <a :b>
	*        ^
	* > | <a _b>
	*        ^
	* > | <a b>
	*        ^
	* > | <a >
	*        ^
	* ```
	*
	* @type {State}
	*/
	function completeAttributeNameBefore(code$3) {
		if (code$3 === 47) {
			effects.consume(code$3);
			return completeEnd;
		}
		if (code$3 === 58 || code$3 === 95 || asciiAlpha(code$3)) {
			effects.consume(code$3);
			return completeAttributeName;
		}
		if (markdownSpace(code$3)) {
			effects.consume(code$3);
			return completeAttributeNameBefore;
		}
		return completeEnd(code$3);
	}
	/**
	* In attribute name.
	*
	* ```markdown
	* > | <a :b>
	*         ^
	* > | <a _b>
	*         ^
	* > | <a b>
	*         ^
	* ```
	*
	* @type {State}
	*/
	function completeAttributeName(code$3) {
		if (code$3 === 45 || code$3 === 46 || code$3 === 58 || code$3 === 95 || asciiAlphanumeric(code$3)) {
			effects.consume(code$3);
			return completeAttributeName;
		}
		return completeAttributeNameAfter(code$3);
	}
	/**
	* After attribute name, at an optional initializer, the end of the tag, or
	* whitespace.
	*
	* ```markdown
	* > | <a b>
	*         ^
	* > | <a b=c>
	*         ^
	* ```
	*
	* @type {State}
	*/
	function completeAttributeNameAfter(code$3) {
		if (code$3 === 61) {
			effects.consume(code$3);
			return completeAttributeValueBefore;
		}
		if (markdownSpace(code$3)) {
			effects.consume(code$3);
			return completeAttributeNameAfter;
		}
		return completeAttributeNameBefore(code$3);
	}
	/**
	* Before unquoted, double quoted, or single quoted attribute value, allowing
	* whitespace.
	*
	* ```markdown
	* > | <a b=c>
	*          ^
	* > | <a b="c">
	*          ^
	* ```
	*
	* @type {State}
	*/
	function completeAttributeValueBefore(code$3) {
		if (code$3 === null || code$3 === 60 || code$3 === 61 || code$3 === 62 || code$3 === 96) return nok(code$3);
		if (code$3 === 34 || code$3 === 39) {
			effects.consume(code$3);
			markerB = code$3;
			return completeAttributeValueQuoted;
		}
		if (markdownSpace(code$3)) {
			effects.consume(code$3);
			return completeAttributeValueBefore;
		}
		return completeAttributeValueUnquoted(code$3);
	}
	/**
	* In double or single quoted attribute value.
	*
	* ```markdown
	* > | <a b="c">
	*           ^
	* > | <a b='c'>
	*           ^
	* ```
	*
	* @type {State}
	*/
	function completeAttributeValueQuoted(code$3) {
		if (code$3 === markerB) {
			effects.consume(code$3);
			markerB = null;
			return completeAttributeValueQuotedAfter;
		}
		if (code$3 === null || markdownLineEnding(code$3)) return nok(code$3);
		effects.consume(code$3);
		return completeAttributeValueQuoted;
	}
	/**
	* In unquoted attribute value.
	*
	* ```markdown
	* > | <a b=c>
	*          ^
	* ```
	*
	* @type {State}
	*/
	function completeAttributeValueUnquoted(code$3) {
		if (code$3 === null || code$3 === 34 || code$3 === 39 || code$3 === 47 || code$3 === 60 || code$3 === 61 || code$3 === 62 || code$3 === 96 || markdownLineEndingOrSpace(code$3)) return completeAttributeNameAfter(code$3);
		effects.consume(code$3);
		return completeAttributeValueUnquoted;
	}
	/**
	* After double or single quoted attribute value, before whitespace or the
	* end of the tag.
	*
	* ```markdown
	* > | <a b="c">
	*            ^
	* ```
	*
	* @type {State}
	*/
	function completeAttributeValueQuotedAfter(code$3) {
		if (code$3 === 47 || code$3 === 62 || markdownSpace(code$3)) return completeAttributeNameBefore(code$3);
		return nok(code$3);
	}
	/**
	* In certain circumstances of a complete tag where only an `>` is allowed.
	*
	* ```markdown
	* > | <a b="c">
	*             ^
	* ```
	*
	* @type {State}
	*/
	function completeEnd(code$3) {
		if (code$3 === 62) {
			effects.consume(code$3);
			return completeAfter;
		}
		return nok(code$3);
	}
	/**
	* After `>` in a complete tag.
	*
	* ```markdown
	* > | <x>
	*        ^
	* ```
	*
	* @type {State}
	*/
	function completeAfter(code$3) {
		if (code$3 === null || markdownLineEnding(code$3)) return continuation(code$3);
		if (markdownSpace(code$3)) {
			effects.consume(code$3);
			return completeAfter;
		}
		return nok(code$3);
	}
	/**
	* In continuation of any HTML kind.
	*
	* ```markdown
	* > | <!--xxx-->
	*          ^
	* ```
	*
	* @type {State}
	*/
	function continuation(code$3) {
		if (code$3 === 45 && marker === 2) {
			effects.consume(code$3);
			return continuationCommentInside;
		}
		if (code$3 === 60 && marker === 1) {
			effects.consume(code$3);
			return continuationRawTagOpen;
		}
		if (code$3 === 62 && marker === 4) {
			effects.consume(code$3);
			return continuationClose;
		}
		if (code$3 === 63 && marker === 3) {
			effects.consume(code$3);
			return continuationDeclarationInside;
		}
		if (code$3 === 93 && marker === 5) {
			effects.consume(code$3);
			return continuationCdataInside;
		}
		if (markdownLineEnding(code$3) && (marker === 6 || marker === 7)) {
			effects.exit("htmlFlowData");
			return effects.check(blankLineBefore, continuationAfter, continuationStart)(code$3);
		}
		if (code$3 === null || markdownLineEnding(code$3)) {
			effects.exit("htmlFlowData");
			return continuationStart(code$3);
		}
		effects.consume(code$3);
		return continuation;
	}
	/**
	* In continuation, at eol.
	*
	* ```markdown
	* > | <x>
	*        ^
	*   | asd
	* ```
	*
	* @type {State}
	*/
	function continuationStart(code$3) {
		return effects.check(nonLazyContinuationStart, continuationStartNonLazy, continuationAfter)(code$3);
	}
	/**
	* In continuation, at eol, before non-lazy content.
	*
	* ```markdown
	* > | <x>
	*        ^
	*   | asd
	* ```
	*
	* @type {State}
	*/
	function continuationStartNonLazy(code$3) {
		effects.enter("lineEnding");
		effects.consume(code$3);
		effects.exit("lineEnding");
		return continuationBefore;
	}
	/**
	* In continuation, before non-lazy content.
	*
	* ```markdown
	*   | <x>
	* > | asd
	*     ^
	* ```
	*
	* @type {State}
	*/
	function continuationBefore(code$3) {
		if (code$3 === null || markdownLineEnding(code$3)) return continuationStart(code$3);
		effects.enter("htmlFlowData");
		return continuation(code$3);
	}
	/**
	* In comment continuation, after one `-`, expecting another.
	*
	* ```markdown
	* > | <!--xxx-->
	*             ^
	* ```
	*
	* @type {State}
	*/
	function continuationCommentInside(code$3) {
		if (code$3 === 45) {
			effects.consume(code$3);
			return continuationDeclarationInside;
		}
		return continuation(code$3);
	}
	/**
	* In raw continuation, after `<`, at `/`.
	*
	* ```markdown
	* > | <script>console.log(1)<\/script>
	*                            ^
	* ```
	*
	* @type {State}
	*/
	function continuationRawTagOpen(code$3) {
		if (code$3 === 47) {
			effects.consume(code$3);
			buffer = "";
			return continuationRawEndTag;
		}
		return continuation(code$3);
	}
	/**
	* In raw continuation, after `</`, in a raw tag name.
	*
	* ```markdown
	* > | <script>console.log(1)<\/script>
	*                             ^^^^^^
	* ```
	*
	* @type {State}
	*/
	function continuationRawEndTag(code$3) {
		if (code$3 === 62) {
			const name$1 = buffer.toLowerCase();
			if (htmlRawNames.includes(name$1)) {
				effects.consume(code$3);
				return continuationClose;
			}
			return continuation(code$3);
		}
		if (asciiAlpha(code$3) && buffer.length < 8) {
			effects.consume(code$3);
			buffer += String.fromCharCode(code$3);
			return continuationRawEndTag;
		}
		return continuation(code$3);
	}
	/**
	* In cdata continuation, after `]`, expecting `]>`.
	*
	* ```markdown
	* > | <![CDATA[>&<]]>
	*                  ^
	* ```
	*
	* @type {State}
	*/
	function continuationCdataInside(code$3) {
		if (code$3 === 93) {
			effects.consume(code$3);
			return continuationDeclarationInside;
		}
		return continuation(code$3);
	}
	/**
	* In declaration or instruction continuation, at `>`.
	*
	* ```markdown
	* > | <!-->
	*         ^
	* > | <?>
	*       ^
	* > | <!q>
	*        ^
	* > | <!--ab-->
	*             ^
	* > | <![CDATA[>&<]]>
	*                   ^
	* ```
	*
	* @type {State}
	*/
	function continuationDeclarationInside(code$3) {
		if (code$3 === 62) {
			effects.consume(code$3);
			return continuationClose;
		}
		if (code$3 === 45 && marker === 2) {
			effects.consume(code$3);
			return continuationDeclarationInside;
		}
		return continuation(code$3);
	}
	/**
	* In closed continuation: everything we get until the eol/eof is part of it.
	*
	* ```markdown
	* > | <!doctype>
	*               ^
	* ```
	*
	* @type {State}
	*/
	function continuationClose(code$3) {
		if (code$3 === null || markdownLineEnding(code$3)) {
			effects.exit("htmlFlowData");
			return continuationAfter(code$3);
		}
		effects.consume(code$3);
		return continuationClose;
	}
	/**
	* Done.
	*
	* ```markdown
	* > | <!doctype>
	*               ^
	* ```
	*
	* @type {State}
	*/
	function continuationAfter(code$3) {
		effects.exit("htmlFlow");
		return ok$2(code$3);
	}
}
/**
* @this {TokenizeContext}
*   Context.
* @type {Tokenizer}
*/
function tokenizeNonLazyContinuationStart(effects, ok$2, nok) {
	const self$1 = this;
	return start;
	/**
	* At eol, before continuation.
	*
	* ```markdown
	* > | * ```js
	*            ^
	*   | b
	* ```
	*
	* @type {State}
	*/
	function start(code$3) {
		if (markdownLineEnding(code$3)) {
			effects.enter("lineEnding");
			effects.consume(code$3);
			effects.exit("lineEnding");
			return after;
		}
		return nok(code$3);
	}
	/**
	* A continuation.
	*
	* ```markdown
	*   | * ```js
	* > | b
	*     ^
	* ```
	*
	* @type {State}
	*/
	function after(code$3) {
		return self$1.parser.lazy[self$1.now().line] ? nok(code$3) : ok$2(code$3);
	}
}
/**
* @this {TokenizeContext}
*   Context.
* @type {Tokenizer}
*/
function tokenizeBlankLineBefore(effects, ok$2, nok) {
	return start;
	/**
	* Before eol, expecting blank line.
	*
	* ```markdown
	* > | <div>
	*          ^
	*   |
	* ```
	*
	* @type {State}
	*/
	function start(code$3) {
		effects.enter("lineEnding");
		effects.consume(code$3);
		effects.exit("lineEnding");
		return effects.attempt(blankLine, ok$2, nok);
	}
}

//#endregion
//#region node_modules/micromark-core-commonmark/lib/html-text.js
/** @type {Construct} */
const htmlText = {
	name: "htmlText",
	tokenize: tokenizeHtmlText
};
/**
* @this {TokenizeContext}
*   Context.
* @type {Tokenizer}
*/
function tokenizeHtmlText(effects, ok$2, nok) {
	const self$1 = this;
	/** @type {NonNullable<Code> | undefined} */
	let marker;
	/** @type {number} */
	let index$2;
	/** @type {State} */
	let returnState;
	return start;
	/**
	* Start of HTML (text).
	*
	* ```markdown
	* > | a <b> c
	*       ^
	* ```
	*
	* @type {State}
	*/
	function start(code$3) {
		effects.enter("htmlText");
		effects.enter("htmlTextData");
		effects.consume(code$3);
		return open;
	}
	/**
	* After `<`, at tag name or other stuff.
	*
	* ```markdown
	* > | a <b> c
	*        ^
	* > | a <!doctype> c
	*        ^
	* > | a <!--b--> c
	*        ^
	* ```
	*
	* @type {State}
	*/
	function open(code$3) {
		if (code$3 === 33) {
			effects.consume(code$3);
			return declarationOpen;
		}
		if (code$3 === 47) {
			effects.consume(code$3);
			return tagCloseStart;
		}
		if (code$3 === 63) {
			effects.consume(code$3);
			return instruction;
		}
		if (asciiAlpha(code$3)) {
			effects.consume(code$3);
			return tagOpen;
		}
		return nok(code$3);
	}
	/**
	* After `<!`, at declaration, comment, or CDATA.
	*
	* ```markdown
	* > | a <!doctype> c
	*         ^
	* > | a <!--b--> c
	*         ^
	* > | a <![CDATA[>&<]]> c
	*         ^
	* ```
	*
	* @type {State}
	*/
	function declarationOpen(code$3) {
		if (code$3 === 45) {
			effects.consume(code$3);
			return commentOpenInside;
		}
		if (code$3 === 91) {
			effects.consume(code$3);
			index$2 = 0;
			return cdataOpenInside;
		}
		if (asciiAlpha(code$3)) {
			effects.consume(code$3);
			return declaration;
		}
		return nok(code$3);
	}
	/**
	* In a comment, after `<!-`, at another `-`.
	*
	* ```markdown
	* > | a <!--b--> c
	*          ^
	* ```
	*
	* @type {State}
	*/
	function commentOpenInside(code$3) {
		if (code$3 === 45) {
			effects.consume(code$3);
			return commentEnd;
		}
		return nok(code$3);
	}
	/**
	* In comment.
	*
	* ```markdown
	* > | a <!--b--> c
	*           ^
	* ```
	*
	* @type {State}
	*/
	function comment$3(code$3) {
		if (code$3 === null) return nok(code$3);
		if (code$3 === 45) {
			effects.consume(code$3);
			return commentClose;
		}
		if (markdownLineEnding(code$3)) {
			returnState = comment$3;
			return lineEndingBefore(code$3);
		}
		effects.consume(code$3);
		return comment$3;
	}
	/**
	* In comment, after `-`.
	*
	* ```markdown
	* > | a <!--b--> c
	*             ^
	* ```
	*
	* @type {State}
	*/
	function commentClose(code$3) {
		if (code$3 === 45) {
			effects.consume(code$3);
			return commentEnd;
		}
		return comment$3(code$3);
	}
	/**
	* In comment, after `--`.
	*
	* ```markdown
	* > | a <!--b--> c
	*              ^
	* ```
	*
	* @type {State}
	*/
	function commentEnd(code$3) {
		return code$3 === 62 ? end(code$3) : code$3 === 45 ? commentClose(code$3) : comment$3(code$3);
	}
	/**
	* After `<![`, in CDATA, expecting `CDATA[`.
	*
	* ```markdown
	* > | a <![CDATA[>&<]]> b
	*          ^^^^^^
	* ```
	*
	* @type {State}
	*/
	function cdataOpenInside(code$3) {
		if (code$3 === "CDATA[".charCodeAt(index$2++)) {
			effects.consume(code$3);
			return index$2 === 6 ? cdata : cdataOpenInside;
		}
		return nok(code$3);
	}
	/**
	* In CDATA.
	*
	* ```markdown
	* > | a <![CDATA[>&<]]> b
	*                ^^^
	* ```
	*
	* @type {State}
	*/
	function cdata(code$3) {
		if (code$3 === null) return nok(code$3);
		if (code$3 === 93) {
			effects.consume(code$3);
			return cdataClose;
		}
		if (markdownLineEnding(code$3)) {
			returnState = cdata;
			return lineEndingBefore(code$3);
		}
		effects.consume(code$3);
		return cdata;
	}
	/**
	* In CDATA, after `]`, at another `]`.
	*
	* ```markdown
	* > | a <![CDATA[>&<]]> b
	*                    ^
	* ```
	*
	* @type {State}
	*/
	function cdataClose(code$3) {
		if (code$3 === 93) {
			effects.consume(code$3);
			return cdataEnd;
		}
		return cdata(code$3);
	}
	/**
	* In CDATA, after `]]`, at `>`.
	*
	* ```markdown
	* > | a <![CDATA[>&<]]> b
	*                     ^
	* ```
	*
	* @type {State}
	*/
	function cdataEnd(code$3) {
		if (code$3 === 62) return end(code$3);
		if (code$3 === 93) {
			effects.consume(code$3);
			return cdataEnd;
		}
		return cdata(code$3);
	}
	/**
	* In declaration.
	*
	* ```markdown
	* > | a <!b> c
	*          ^
	* ```
	*
	* @type {State}
	*/
	function declaration(code$3) {
		if (code$3 === null || code$3 === 62) return end(code$3);
		if (markdownLineEnding(code$3)) {
			returnState = declaration;
			return lineEndingBefore(code$3);
		}
		effects.consume(code$3);
		return declaration;
	}
	/**
	* In instruction.
	*
	* ```markdown
	* > | a <?b?> c
	*         ^
	* ```
	*
	* @type {State}
	*/
	function instruction(code$3) {
		if (code$3 === null) return nok(code$3);
		if (code$3 === 63) {
			effects.consume(code$3);
			return instructionClose;
		}
		if (markdownLineEnding(code$3)) {
			returnState = instruction;
			return lineEndingBefore(code$3);
		}
		effects.consume(code$3);
		return instruction;
	}
	/**
	* In instruction, after `?`, at `>`.
	*
	* ```markdown
	* > | a <?b?> c
	*           ^
	* ```
	*
	* @type {State}
	*/
	function instructionClose(code$3) {
		return code$3 === 62 ? end(code$3) : instruction(code$3);
	}
	/**
	* After `</`, in closing tag, at tag name.
	*
	* ```markdown
	* > | a </b> c
	*         ^
	* ```
	*
	* @type {State}
	*/
	function tagCloseStart(code$3) {
		if (asciiAlpha(code$3)) {
			effects.consume(code$3);
			return tagClose;
		}
		return nok(code$3);
	}
	/**
	* After `</x`, in a tag name.
	*
	* ```markdown
	* > | a </b> c
	*          ^
	* ```
	*
	* @type {State}
	*/
	function tagClose(code$3) {
		if (code$3 === 45 || asciiAlphanumeric(code$3)) {
			effects.consume(code$3);
			return tagClose;
		}
		return tagCloseBetween(code$3);
	}
	/**
	* In closing tag, after tag name.
	*
	* ```markdown
	* > | a </b> c
	*          ^
	* ```
	*
	* @type {State}
	*/
	function tagCloseBetween(code$3) {
		if (markdownLineEnding(code$3)) {
			returnState = tagCloseBetween;
			return lineEndingBefore(code$3);
		}
		if (markdownSpace(code$3)) {
			effects.consume(code$3);
			return tagCloseBetween;
		}
		return end(code$3);
	}
	/**
	* After `<x`, in opening tag name.
	*
	* ```markdown
	* > | a <b> c
	*         ^
	* ```
	*
	* @type {State}
	*/
	function tagOpen(code$3) {
		if (code$3 === 45 || asciiAlphanumeric(code$3)) {
			effects.consume(code$3);
			return tagOpen;
		}
		if (code$3 === 47 || code$3 === 62 || markdownLineEndingOrSpace(code$3)) return tagOpenBetween(code$3);
		return nok(code$3);
	}
	/**
	* In opening tag, after tag name.
	*
	* ```markdown
	* > | a <b> c
	*         ^
	* ```
	*
	* @type {State}
	*/
	function tagOpenBetween(code$3) {
		if (code$3 === 47) {
			effects.consume(code$3);
			return end;
		}
		if (code$3 === 58 || code$3 === 95 || asciiAlpha(code$3)) {
			effects.consume(code$3);
			return tagOpenAttributeName;
		}
		if (markdownLineEnding(code$3)) {
			returnState = tagOpenBetween;
			return lineEndingBefore(code$3);
		}
		if (markdownSpace(code$3)) {
			effects.consume(code$3);
			return tagOpenBetween;
		}
		return end(code$3);
	}
	/**
	* In attribute name.
	*
	* ```markdown
	* > | a <b c> d
	*          ^
	* ```
	*
	* @type {State}
	*/
	function tagOpenAttributeName(code$3) {
		if (code$3 === 45 || code$3 === 46 || code$3 === 58 || code$3 === 95 || asciiAlphanumeric(code$3)) {
			effects.consume(code$3);
			return tagOpenAttributeName;
		}
		return tagOpenAttributeNameAfter(code$3);
	}
	/**
	* After attribute name, before initializer, the end of the tag, or
	* whitespace.
	*
	* ```markdown
	* > | a <b c> d
	*           ^
	* ```
	*
	* @type {State}
	*/
	function tagOpenAttributeNameAfter(code$3) {
		if (code$3 === 61) {
			effects.consume(code$3);
			return tagOpenAttributeValueBefore;
		}
		if (markdownLineEnding(code$3)) {
			returnState = tagOpenAttributeNameAfter;
			return lineEndingBefore(code$3);
		}
		if (markdownSpace(code$3)) {
			effects.consume(code$3);
			return tagOpenAttributeNameAfter;
		}
		return tagOpenBetween(code$3);
	}
	/**
	* Before unquoted, double quoted, or single quoted attribute value, allowing
	* whitespace.
	*
	* ```markdown
	* > | a <b c=d> e
	*            ^
	* ```
	*
	* @type {State}
	*/
	function tagOpenAttributeValueBefore(code$3) {
		if (code$3 === null || code$3 === 60 || code$3 === 61 || code$3 === 62 || code$3 === 96) return nok(code$3);
		if (code$3 === 34 || code$3 === 39) {
			effects.consume(code$3);
			marker = code$3;
			return tagOpenAttributeValueQuoted;
		}
		if (markdownLineEnding(code$3)) {
			returnState = tagOpenAttributeValueBefore;
			return lineEndingBefore(code$3);
		}
		if (markdownSpace(code$3)) {
			effects.consume(code$3);
			return tagOpenAttributeValueBefore;
		}
		effects.consume(code$3);
		return tagOpenAttributeValueUnquoted;
	}
	/**
	* In double or single quoted attribute value.
	*
	* ```markdown
	* > | a <b c="d"> e
	*             ^
	* ```
	*
	* @type {State}
	*/
	function tagOpenAttributeValueQuoted(code$3) {
		if (code$3 === marker) {
			effects.consume(code$3);
			marker = void 0;
			return tagOpenAttributeValueQuotedAfter;
		}
		if (code$3 === null) return nok(code$3);
		if (markdownLineEnding(code$3)) {
			returnState = tagOpenAttributeValueQuoted;
			return lineEndingBefore(code$3);
		}
		effects.consume(code$3);
		return tagOpenAttributeValueQuoted;
	}
	/**
	* In unquoted attribute value.
	*
	* ```markdown
	* > | a <b c=d> e
	*            ^
	* ```
	*
	* @type {State}
	*/
	function tagOpenAttributeValueUnquoted(code$3) {
		if (code$3 === null || code$3 === 34 || code$3 === 39 || code$3 === 60 || code$3 === 61 || code$3 === 96) return nok(code$3);
		if (code$3 === 47 || code$3 === 62 || markdownLineEndingOrSpace(code$3)) return tagOpenBetween(code$3);
		effects.consume(code$3);
		return tagOpenAttributeValueUnquoted;
	}
	/**
	* After double or single quoted attribute value, before whitespace or the end
	* of the tag.
	*
	* ```markdown
	* > | a <b c="d"> e
	*               ^
	* ```
	*
	* @type {State}
	*/
	function tagOpenAttributeValueQuotedAfter(code$3) {
		if (code$3 === 47 || code$3 === 62 || markdownLineEndingOrSpace(code$3)) return tagOpenBetween(code$3);
		return nok(code$3);
	}
	/**
	* In certain circumstances of a tag where only an `>` is allowed.
	*
	* ```markdown
	* > | a <b c="d"> e
	*               ^
	* ```
	*
	* @type {State}
	*/
	function end(code$3) {
		if (code$3 === 62) {
			effects.consume(code$3);
			effects.exit("htmlTextData");
			effects.exit("htmlText");
			return ok$2;
		}
		return nok(code$3);
	}
	/**
	* At eol.
	*
	* > 👉 **Note**: we can’t have blank lines in text, so no need to worry about
	* > empty tokens.
	*
	* ```markdown
	* > | a <!--a
	*            ^
	*   | b-->
	* ```
	*
	* @type {State}
	*/
	function lineEndingBefore(code$3) {
		effects.exit("htmlTextData");
		effects.enter("lineEnding");
		effects.consume(code$3);
		effects.exit("lineEnding");
		return lineEndingAfter;
	}
	/**
	* After eol, at optional whitespace.
	*
	* > 👉 **Note**: we can’t have blank lines in text, so no need to worry about
	* > empty tokens.
	*
	* ```markdown
	*   | a <!--a
	* > | b-->
	*     ^
	* ```
	*
	* @type {State}
	*/
	function lineEndingAfter(code$3) {
		return markdownSpace(code$3) ? factorySpace(effects, lineEndingAfterPrefix, "linePrefix", self$1.parser.constructs.disable.null.includes("codeIndented") ? void 0 : 4)(code$3) : lineEndingAfterPrefix(code$3);
	}
	/**
	* After eol, after optional whitespace.
	*
	* > 👉 **Note**: we can’t have blank lines in text, so no need to worry about
	* > empty tokens.
	*
	* ```markdown
	*   | a <!--a
	* > | b-->
	*     ^
	* ```
	*
	* @type {State}
	*/
	function lineEndingAfterPrefix(code$3) {
		effects.enter("htmlTextData");
		return returnState(code$3);
	}
}

//#endregion
//#region node_modules/micromark-core-commonmark/lib/label-end.js
/** @type {Construct} */
const labelEnd = {
	name: "labelEnd",
	resolveAll: resolveAllLabelEnd,
	resolveTo: resolveToLabelEnd,
	tokenize: tokenizeLabelEnd
};
/** @type {Construct} */
const resourceConstruct = { tokenize: tokenizeResource };
/** @type {Construct} */
const referenceFullConstruct = { tokenize: tokenizeReferenceFull };
/** @type {Construct} */
const referenceCollapsedConstruct = { tokenize: tokenizeReferenceCollapsed };
/** @type {Resolver} */
function resolveAllLabelEnd(events) {
	let index$2 = -1;
	/** @type {Array<Event>} */
	const newEvents = [];
	while (++index$2 < events.length) {
		const token = events[index$2][1];
		newEvents.push(events[index$2]);
		if (token.type === "labelImage" || token.type === "labelLink" || token.type === "labelEnd") {
			const offset = token.type === "labelImage" ? 4 : 2;
			token.type = "data";
			index$2 += offset;
		}
	}
	if (events.length !== newEvents.length) splice(events, 0, events.length, newEvents);
	return events;
}
/** @type {Resolver} */
function resolveToLabelEnd(events, context) {
	let index$2 = events.length;
	let offset = 0;
	/** @type {Token} */
	let token;
	/** @type {number | undefined} */
	let open;
	/** @type {number | undefined} */
	let close;
	/** @type {Array<Event>} */
	let media;
	while (index$2--) {
		token = events[index$2][1];
		if (open) {
			if (token.type === "link" || token.type === "labelLink" && token._inactive) break;
			if (events[index$2][0] === "enter" && token.type === "labelLink") token._inactive = true;
		} else if (close) {
			if (events[index$2][0] === "enter" && (token.type === "labelImage" || token.type === "labelLink") && !token._balanced) {
				open = index$2;
				if (token.type !== "labelLink") {
					offset = 2;
					break;
				}
			}
		} else if (token.type === "labelEnd") close = index$2;
	}
	const group = {
		type: events[open][1].type === "labelLink" ? "link" : "image",
		start: { ...events[open][1].start },
		end: { ...events[events.length - 1][1].end }
	};
	const label = {
		type: "label",
		start: { ...events[open][1].start },
		end: { ...events[close][1].end }
	};
	const text$9 = {
		type: "labelText",
		start: { ...events[open + offset + 2][1].end },
		end: { ...events[close - 2][1].start }
	};
	media = [[
		"enter",
		group,
		context
	], [
		"enter",
		label,
		context
	]];
	media = push(media, events.slice(open + 1, open + offset + 3));
	media = push(media, [[
		"enter",
		text$9,
		context
	]]);
	media = push(media, resolveAll(context.parser.constructs.insideSpan.null, events.slice(open + offset + 4, close - 3), context));
	media = push(media, [
		[
			"exit",
			text$9,
			context
		],
		events[close - 2],
		events[close - 1],
		[
			"exit",
			label,
			context
		]
	]);
	media = push(media, events.slice(close + 1));
	media = push(media, [[
		"exit",
		group,
		context
	]]);
	splice(events, open, events.length, media);
	return events;
}
/**
* @this {TokenizeContext}
*   Context.
* @type {Tokenizer}
*/
function tokenizeLabelEnd(effects, ok$2, nok) {
	const self$1 = this;
	let index$2 = self$1.events.length;
	/** @type {Token} */
	let labelStart;
	/** @type {boolean} */
	let defined;
	while (index$2--) if ((self$1.events[index$2][1].type === "labelImage" || self$1.events[index$2][1].type === "labelLink") && !self$1.events[index$2][1]._balanced) {
		labelStart = self$1.events[index$2][1];
		break;
	}
	return start;
	/**
	* Start of label end.
	*
	* ```markdown
	* > | [a](b) c
	*       ^
	* > | [a][b] c
	*       ^
	* > | [a][] b
	*       ^
	* > | [a] b
	* ```
	*
	* @type {State}
	*/
	function start(code$3) {
		if (!labelStart) return nok(code$3);
		if (labelStart._inactive) return labelEndNok(code$3);
		defined = self$1.parser.defined.includes(normalizeIdentifier(self$1.sliceSerialize({
			start: labelStart.end,
			end: self$1.now()
		})));
		effects.enter("labelEnd");
		effects.enter("labelMarker");
		effects.consume(code$3);
		effects.exit("labelMarker");
		effects.exit("labelEnd");
		return after;
	}
	/**
	* After `]`.
	*
	* ```markdown
	* > | [a](b) c
	*       ^
	* > | [a][b] c
	*       ^
	* > | [a][] b
	*       ^
	* > | [a] b
	*       ^
	* ```
	*
	* @type {State}
	*/
	function after(code$3) {
		if (code$3 === 40) return effects.attempt(resourceConstruct, labelEndOk, defined ? labelEndOk : labelEndNok)(code$3);
		if (code$3 === 91) return effects.attempt(referenceFullConstruct, labelEndOk, defined ? referenceNotFull : labelEndNok)(code$3);
		return defined ? labelEndOk(code$3) : labelEndNok(code$3);
	}
	/**
	* After `]`, at `[`, but not at a full reference.
	*
	* > 👉 **Note**: we only get here if the label is defined.
	*
	* ```markdown
	* > | [a][] b
	*        ^
	* > | [a] b
	*        ^
	* ```
	*
	* @type {State}
	*/
	function referenceNotFull(code$3) {
		return effects.attempt(referenceCollapsedConstruct, labelEndOk, labelEndNok)(code$3);
	}
	/**
	* Done, we found something.
	*
	* ```markdown
	* > | [a](b) c
	*           ^
	* > | [a][b] c
	*           ^
	* > | [a][] b
	*          ^
	* > | [a] b
	*        ^
	* ```
	*
	* @type {State}
	*/
	function labelEndOk(code$3) {
		return ok$2(code$3);
	}
	/**
	* Done, it’s nothing.
	*
	* There was an okay opening, but we didn’t match anything.
	*
	* ```markdown
	* > | [a](b c
	*        ^
	* > | [a][b c
	*        ^
	* > | [a] b
	*        ^
	* ```
	*
	* @type {State}
	*/
	function labelEndNok(code$3) {
		labelStart._balanced = true;
		return nok(code$3);
	}
}
/**
* @this {TokenizeContext}
*   Context.
* @type {Tokenizer}
*/
function tokenizeResource(effects, ok$2, nok) {
	return resourceStart;
	/**
	* At a resource.
	*
	* ```markdown
	* > | [a](b) c
	*        ^
	* ```
	*
	* @type {State}
	*/
	function resourceStart(code$3) {
		effects.enter("resource");
		effects.enter("resourceMarker");
		effects.consume(code$3);
		effects.exit("resourceMarker");
		return resourceBefore;
	}
	/**
	* In resource, after `(`, at optional whitespace.
	*
	* ```markdown
	* > | [a](b) c
	*         ^
	* ```
	*
	* @type {State}
	*/
	function resourceBefore(code$3) {
		return markdownLineEndingOrSpace(code$3) ? factoryWhitespace(effects, resourceOpen)(code$3) : resourceOpen(code$3);
	}
	/**
	* In resource, after optional whitespace, at `)` or a destination.
	*
	* ```markdown
	* > | [a](b) c
	*         ^
	* ```
	*
	* @type {State}
	*/
	function resourceOpen(code$3) {
		if (code$3 === 41) return resourceEnd(code$3);
		return factoryDestination(effects, resourceDestinationAfter, resourceDestinationMissing, "resourceDestination", "resourceDestinationLiteral", "resourceDestinationLiteralMarker", "resourceDestinationRaw", "resourceDestinationString", 32)(code$3);
	}
	/**
	* In resource, after destination, at optional whitespace.
	*
	* ```markdown
	* > | [a](b) c
	*          ^
	* ```
	*
	* @type {State}
	*/
	function resourceDestinationAfter(code$3) {
		return markdownLineEndingOrSpace(code$3) ? factoryWhitespace(effects, resourceBetween)(code$3) : resourceEnd(code$3);
	}
	/**
	* At invalid destination.
	*
	* ```markdown
	* > | [a](<<) b
	*         ^
	* ```
	*
	* @type {State}
	*/
	function resourceDestinationMissing(code$3) {
		return nok(code$3);
	}
	/**
	* In resource, after destination and whitespace, at `(` or title.
	*
	* ```markdown
	* > | [a](b ) c
	*           ^
	* ```
	*
	* @type {State}
	*/
	function resourceBetween(code$3) {
		if (code$3 === 34 || code$3 === 39 || code$3 === 40) return factoryTitle(effects, resourceTitleAfter, nok, "resourceTitle", "resourceTitleMarker", "resourceTitleString")(code$3);
		return resourceEnd(code$3);
	}
	/**
	* In resource, after title, at optional whitespace.
	*
	* ```markdown
	* > | [a](b "c") d
	*              ^
	* ```
	*
	* @type {State}
	*/
	function resourceTitleAfter(code$3) {
		return markdownLineEndingOrSpace(code$3) ? factoryWhitespace(effects, resourceEnd)(code$3) : resourceEnd(code$3);
	}
	/**
	* In resource, at `)`.
	*
	* ```markdown
	* > | [a](b) d
	*          ^
	* ```
	*
	* @type {State}
	*/
	function resourceEnd(code$3) {
		if (code$3 === 41) {
			effects.enter("resourceMarker");
			effects.consume(code$3);
			effects.exit("resourceMarker");
			effects.exit("resource");
			return ok$2;
		}
		return nok(code$3);
	}
}
/**
* @this {TokenizeContext}
*   Context.
* @type {Tokenizer}
*/
function tokenizeReferenceFull(effects, ok$2, nok) {
	const self$1 = this;
	return referenceFull;
	/**
	* In a reference (full), at the `[`.
	*
	* ```markdown
	* > | [a][b] d
	*        ^
	* ```
	*
	* @type {State}
	*/
	function referenceFull(code$3) {
		return factoryLabel.call(self$1, effects, referenceFullAfter, referenceFullMissing, "reference", "referenceMarker", "referenceString")(code$3);
	}
	/**
	* In a reference (full), after `]`.
	*
	* ```markdown
	* > | [a][b] d
	*          ^
	* ```
	*
	* @type {State}
	*/
	function referenceFullAfter(code$3) {
		return self$1.parser.defined.includes(normalizeIdentifier(self$1.sliceSerialize(self$1.events[self$1.events.length - 1][1]).slice(1, -1))) ? ok$2(code$3) : nok(code$3);
	}
	/**
	* In reference (full) that was missing.
	*
	* ```markdown
	* > | [a][b d
	*        ^
	* ```
	*
	* @type {State}
	*/
	function referenceFullMissing(code$3) {
		return nok(code$3);
	}
}
/**
* @this {TokenizeContext}
*   Context.
* @type {Tokenizer}
*/
function tokenizeReferenceCollapsed(effects, ok$2, nok) {
	return referenceCollapsedStart;
	/**
	* In reference (collapsed), at `[`.
	*
	* > 👉 **Note**: we only get here if the label is defined.
	*
	* ```markdown
	* > | [a][] d
	*        ^
	* ```
	*
	* @type {State}
	*/
	function referenceCollapsedStart(code$3) {
		effects.enter("reference");
		effects.enter("referenceMarker");
		effects.consume(code$3);
		effects.exit("referenceMarker");
		return referenceCollapsedOpen;
	}
	/**
	* In reference (collapsed), at `]`.
	*
	* > 👉 **Note**: we only get here if the label is defined.
	*
	* ```markdown
	* > | [a][] d
	*         ^
	* ```
	*
	*  @type {State}
	*/
	function referenceCollapsedOpen(code$3) {
		if (code$3 === 93) {
			effects.enter("referenceMarker");
			effects.consume(code$3);
			effects.exit("referenceMarker");
			effects.exit("reference");
			return ok$2;
		}
		return nok(code$3);
	}
}

//#endregion
//#region node_modules/micromark-core-commonmark/lib/label-start-image.js
/** @type {Construct} */
const labelStartImage = {
	name: "labelStartImage",
	resolveAll: labelEnd.resolveAll,
	tokenize: tokenizeLabelStartImage
};
/**
* @this {TokenizeContext}
*   Context.
* @type {Tokenizer}
*/
function tokenizeLabelStartImage(effects, ok$2, nok) {
	const self$1 = this;
	return start;
	/**
	* Start of label (image) start.
	*
	* ```markdown
	* > | a ![b] c
	*       ^
	* ```
	*
	* @type {State}
	*/
	function start(code$3) {
		effects.enter("labelImage");
		effects.enter("labelImageMarker");
		effects.consume(code$3);
		effects.exit("labelImageMarker");
		return open;
	}
	/**
	* After `!`, at `[`.
	*
	* ```markdown
	* > | a ![b] c
	*        ^
	* ```
	*
	* @type {State}
	*/
	function open(code$3) {
		if (code$3 === 91) {
			effects.enter("labelMarker");
			effects.consume(code$3);
			effects.exit("labelMarker");
			effects.exit("labelImage");
			return after;
		}
		return nok(code$3);
	}
	/**
	* After `![`.
	*
	* ```markdown
	* > | a ![b] c
	*         ^
	* ```
	*
	* This is needed in because, when GFM footnotes are enabled, images never
	* form when started with a `^`.
	* Instead, links form:
	*
	* ```markdown
	* ![^a](b)
	*
	* ![^a][b]
	*
	* [b]: c
	* ```
	*
	* ```html
	* <p>!<a href=\"b\">^a</a></p>
	* <p>!<a href=\"c\">^a</a></p>
	* ```
	*
	* @type {State}
	*/
	function after(code$3) {
		/* c8 ignore next 3 */
		return code$3 === 94 && "_hiddenFootnoteSupport" in self$1.parser.constructs ? nok(code$3) : ok$2(code$3);
	}
}

//#endregion
//#region node_modules/micromark-core-commonmark/lib/label-start-link.js
/** @type {Construct} */
const labelStartLink = {
	name: "labelStartLink",
	resolveAll: labelEnd.resolveAll,
	tokenize: tokenizeLabelStartLink
};
/**
* @this {TokenizeContext}
*   Context.
* @type {Tokenizer}
*/
function tokenizeLabelStartLink(effects, ok$2, nok) {
	const self$1 = this;
	return start;
	/**
	* Start of label (link) start.
	*
	* ```markdown
	* > | a [b] c
	*       ^
	* ```
	*
	* @type {State}
	*/
	function start(code$3) {
		effects.enter("labelLink");
		effects.enter("labelMarker");
		effects.consume(code$3);
		effects.exit("labelMarker");
		effects.exit("labelLink");
		return after;
	}
	/** @type {State} */
	function after(code$3) {
		/* c8 ignore next 3 */
		return code$3 === 94 && "_hiddenFootnoteSupport" in self$1.parser.constructs ? nok(code$3) : ok$2(code$3);
	}
}

//#endregion
//#region node_modules/micromark-core-commonmark/lib/line-ending.js
/** @type {Construct} */
const lineEnding = {
	name: "lineEnding",
	tokenize: tokenizeLineEnding
};
/**
* @this {TokenizeContext}
*   Context.
* @type {Tokenizer}
*/
function tokenizeLineEnding(effects, ok$2) {
	return start;
	/** @type {State} */
	function start(code$3) {
		effects.enter("lineEnding");
		effects.consume(code$3);
		effects.exit("lineEnding");
		return factorySpace(effects, ok$2, "linePrefix");
	}
}

//#endregion
//#region node_modules/micromark-core-commonmark/lib/thematic-break.js
/** @type {Construct} */
const thematicBreak$2 = {
	name: "thematicBreak",
	tokenize: tokenizeThematicBreak
};
/**
* @this {TokenizeContext}
*   Context.
* @type {Tokenizer}
*/
function tokenizeThematicBreak(effects, ok$2, nok) {
	let size = 0;
	/** @type {NonNullable<Code>} */
	let marker;
	return start;
	/**
	* Start of thematic break.
	*
	* ```markdown
	* > | ***
	*     ^
	* ```
	*
	* @type {State}
	*/
	function start(code$3) {
		effects.enter("thematicBreak");
		return before(code$3);
	}
	/**
	* After optional whitespace, at marker.
	*
	* ```markdown
	* > | ***
	*     ^
	* ```
	*
	* @type {State}
	*/
	function before(code$3) {
		marker = code$3;
		return atBreak(code$3);
	}
	/**
	* After something, before something else.
	*
	* ```markdown
	* > | ***
	*     ^
	* ```
	*
	* @type {State}
	*/
	function atBreak(code$3) {
		if (code$3 === marker) {
			effects.enter("thematicBreakSequence");
			return sequence(code$3);
		}
		if (size >= 3 && (code$3 === null || markdownLineEnding(code$3))) {
			effects.exit("thematicBreak");
			return ok$2(code$3);
		}
		return nok(code$3);
	}
	/**
	* In sequence.
	*
	* ```markdown
	* > | ***
	*     ^
	* ```
	*
	* @type {State}
	*/
	function sequence(code$3) {
		if (code$3 === marker) {
			effects.consume(code$3);
			size++;
			return sequence;
		}
		effects.exit("thematicBreakSequence");
		return markdownSpace(code$3) ? factorySpace(effects, atBreak, "whitespace")(code$3) : atBreak(code$3);
	}
}

//#endregion
//#region node_modules/micromark-core-commonmark/lib/list.js
/** @type {Construct} */
const list$2 = {
	continuation: { tokenize: tokenizeListContinuation },
	exit: tokenizeListEnd,
	name: "list",
	tokenize: tokenizeListStart
};
/** @type {Construct} */
const listItemPrefixWhitespaceConstruct = {
	partial: true,
	tokenize: tokenizeListItemPrefixWhitespace
};
/** @type {Construct} */
const indentConstruct = {
	partial: true,
	tokenize: tokenizeIndent$1
};
/**
* @this {TokenizeContext}
*   Context.
* @type {Tokenizer}
*/
function tokenizeListStart(effects, ok$2, nok) {
	const self$1 = this;
	const tail = self$1.events[self$1.events.length - 1];
	let initialSize = tail && tail[1].type === "linePrefix" ? tail[2].sliceSerialize(tail[1], true).length : 0;
	let size = 0;
	return start;
	/** @type {State} */
	function start(code$3) {
		const kind = self$1.containerState.type || (code$3 === 42 || code$3 === 43 || code$3 === 45 ? "listUnordered" : "listOrdered");
		if (kind === "listUnordered" ? !self$1.containerState.marker || code$3 === self$1.containerState.marker : asciiDigit(code$3)) {
			if (!self$1.containerState.type) {
				self$1.containerState.type = kind;
				effects.enter(kind, { _container: true });
			}
			if (kind === "listUnordered") {
				effects.enter("listItemPrefix");
				return code$3 === 42 || code$3 === 45 ? effects.check(thematicBreak$2, nok, atMarker)(code$3) : atMarker(code$3);
			}
			if (!self$1.interrupt || code$3 === 49) {
				effects.enter("listItemPrefix");
				effects.enter("listItemValue");
				return inside(code$3);
			}
		}
		return nok(code$3);
	}
	/** @type {State} */
	function inside(code$3) {
		if (asciiDigit(code$3) && ++size < 10) {
			effects.consume(code$3);
			return inside;
		}
		if ((!self$1.interrupt || size < 2) && (self$1.containerState.marker ? code$3 === self$1.containerState.marker : code$3 === 41 || code$3 === 46)) {
			effects.exit("listItemValue");
			return atMarker(code$3);
		}
		return nok(code$3);
	}
	/**
	* @type {State}
	**/
	function atMarker(code$3) {
		effects.enter("listItemMarker");
		effects.consume(code$3);
		effects.exit("listItemMarker");
		self$1.containerState.marker = self$1.containerState.marker || code$3;
		return effects.check(blankLine, self$1.interrupt ? nok : onBlank, effects.attempt(listItemPrefixWhitespaceConstruct, endOfPrefix, otherPrefix));
	}
	/** @type {State} */
	function onBlank(code$3) {
		self$1.containerState.initialBlankLine = true;
		initialSize++;
		return endOfPrefix(code$3);
	}
	/** @type {State} */
	function otherPrefix(code$3) {
		if (markdownSpace(code$3)) {
			effects.enter("listItemPrefixWhitespace");
			effects.consume(code$3);
			effects.exit("listItemPrefixWhitespace");
			return endOfPrefix;
		}
		return nok(code$3);
	}
	/** @type {State} */
	function endOfPrefix(code$3) {
		self$1.containerState.size = initialSize + self$1.sliceSerialize(effects.exit("listItemPrefix"), true).length;
		return ok$2(code$3);
	}
}
/**
* @this {TokenizeContext}
*   Context.
* @type {Tokenizer}
*/
function tokenizeListContinuation(effects, ok$2, nok) {
	const self$1 = this;
	self$1.containerState._closeFlow = void 0;
	return effects.check(blankLine, onBlank, notBlank);
	/** @type {State} */
	function onBlank(code$3) {
		self$1.containerState.furtherBlankLines = self$1.containerState.furtherBlankLines || self$1.containerState.initialBlankLine;
		return factorySpace(effects, ok$2, "listItemIndent", self$1.containerState.size + 1)(code$3);
	}
	/** @type {State} */
	function notBlank(code$3) {
		if (self$1.containerState.furtherBlankLines || !markdownSpace(code$3)) {
			self$1.containerState.furtherBlankLines = void 0;
			self$1.containerState.initialBlankLine = void 0;
			return notInCurrentItem(code$3);
		}
		self$1.containerState.furtherBlankLines = void 0;
		self$1.containerState.initialBlankLine = void 0;
		return effects.attempt(indentConstruct, ok$2, notInCurrentItem)(code$3);
	}
	/** @type {State} */
	function notInCurrentItem(code$3) {
		self$1.containerState._closeFlow = true;
		self$1.interrupt = void 0;
		return factorySpace(effects, effects.attempt(list$2, ok$2, nok), "linePrefix", self$1.parser.constructs.disable.null.includes("codeIndented") ? void 0 : 4)(code$3);
	}
}
/**
* @this {TokenizeContext}
*   Context.
* @type {Tokenizer}
*/
function tokenizeIndent$1(effects, ok$2, nok) {
	const self$1 = this;
	return factorySpace(effects, afterPrefix, "listItemIndent", self$1.containerState.size + 1);
	/** @type {State} */
	function afterPrefix(code$3) {
		const tail = self$1.events[self$1.events.length - 1];
		return tail && tail[1].type === "listItemIndent" && tail[2].sliceSerialize(tail[1], true).length === self$1.containerState.size ? ok$2(code$3) : nok(code$3);
	}
}
/**
* @this {TokenizeContext}
*   Context.
* @type {Exiter}
*/
function tokenizeListEnd(effects) {
	effects.exit(this.containerState.type);
}
/**
* @this {TokenizeContext}
*   Context.
* @type {Tokenizer}
*/
function tokenizeListItemPrefixWhitespace(effects, ok$2, nok) {
	const self$1 = this;
	return factorySpace(effects, afterPrefix, "listItemPrefixWhitespace", self$1.parser.constructs.disable.null.includes("codeIndented") ? void 0 : 5);
	/** @type {State} */
	function afterPrefix(code$3) {
		const tail = self$1.events[self$1.events.length - 1];
		return !markdownSpace(code$3) && tail && tail[1].type === "listItemPrefixWhitespace" ? ok$2(code$3) : nok(code$3);
	}
}

//#endregion
//#region node_modules/micromark-core-commonmark/lib/setext-underline.js
/** @type {Construct} */
const setextUnderline = {
	name: "setextUnderline",
	resolveTo: resolveToSetextUnderline,
	tokenize: tokenizeSetextUnderline
};
/** @type {Resolver} */
function resolveToSetextUnderline(events, context) {
	let index$2 = events.length;
	/** @type {number | undefined} */
	let content$2;
	/** @type {number | undefined} */
	let text$9;
	/** @type {number | undefined} */
	let definition$2;
	while (index$2--) if (events[index$2][0] === "enter") {
		if (events[index$2][1].type === "content") {
			content$2 = index$2;
			break;
		}
		if (events[index$2][1].type === "paragraph") text$9 = index$2;
	} else {
		if (events[index$2][1].type === "content") events.splice(index$2, 1);
		if (!definition$2 && events[index$2][1].type === "definition") definition$2 = index$2;
	}
	const heading$2 = {
		type: "setextHeading",
		start: { ...events[content$2][1].start },
		end: { ...events[events.length - 1][1].end }
	};
	events[text$9][1].type = "setextHeadingText";
	if (definition$2) {
		events.splice(text$9, 0, [
			"enter",
			heading$2,
			context
		]);
		events.splice(definition$2 + 1, 0, [
			"exit",
			events[content$2][1],
			context
		]);
		events[content$2][1].end = { ...events[definition$2][1].end };
	} else events[content$2][1] = heading$2;
	events.push([
		"exit",
		heading$2,
		context
	]);
	return events;
}
/**
* @this {TokenizeContext}
*   Context.
* @type {Tokenizer}
*/
function tokenizeSetextUnderline(effects, ok$2, nok) {
	const self$1 = this;
	/** @type {NonNullable<Code>} */
	let marker;
	return start;
	/**
	* At start of heading (setext) underline.
	*
	* ```markdown
	*   | aa
	* > | ==
	*     ^
	* ```
	*
	* @type {State}
	*/
	function start(code$3) {
		let index$2 = self$1.events.length;
		/** @type {boolean | undefined} */
		let paragraph$2;
		while (index$2--) if (self$1.events[index$2][1].type !== "lineEnding" && self$1.events[index$2][1].type !== "linePrefix" && self$1.events[index$2][1].type !== "content") {
			paragraph$2 = self$1.events[index$2][1].type === "paragraph";
			break;
		}
		if (!self$1.parser.lazy[self$1.now().line] && (self$1.interrupt || paragraph$2)) {
			effects.enter("setextHeadingLine");
			marker = code$3;
			return before(code$3);
		}
		return nok(code$3);
	}
	/**
	* After optional whitespace, at `-` or `=`.
	*
	* ```markdown
	*   | aa
	* > | ==
	*     ^
	* ```
	*
	* @type {State}
	*/
	function before(code$3) {
		effects.enter("setextHeadingLineSequence");
		return inside(code$3);
	}
	/**
	* In sequence.
	*
	* ```markdown
	*   | aa
	* > | ==
	*     ^
	* ```
	*
	* @type {State}
	*/
	function inside(code$3) {
		if (code$3 === marker) {
			effects.consume(code$3);
			return inside;
		}
		effects.exit("setextHeadingLineSequence");
		return markdownSpace(code$3) ? factorySpace(effects, after, "lineSuffix")(code$3) : after(code$3);
	}
	/**
	* After sequence, after optional whitespace.
	*
	* ```markdown
	*   | aa
	* > | ==
	*       ^
	* ```
	*
	* @type {State}
	*/
	function after(code$3) {
		if (code$3 === null || markdownLineEnding(code$3)) {
			effects.exit("setextHeadingLine");
			return ok$2(code$3);
		}
		return nok(code$3);
	}
}

//#endregion
//#region node_modules/micromark/lib/initialize/flow.js
/** @type {InitialConstruct} */
const flow = { tokenize: initializeFlow };
/**
* @this {TokenizeContext}
*   Self.
* @type {Initializer}
*   Initializer.
*/
function initializeFlow(effects) {
	const self$1 = this;
	const initial = effects.attempt(blankLine, atBlankEnding, effects.attempt(this.parser.constructs.flowInitial, afterConstruct, factorySpace(effects, effects.attempt(this.parser.constructs.flow, afterConstruct, effects.attempt(content$1, afterConstruct)), "linePrefix")));
	return initial;
	/** @type {State} */
	function atBlankEnding(code$3) {
		if (code$3 === null) {
			effects.consume(code$3);
			return;
		}
		effects.enter("lineEndingBlank");
		effects.consume(code$3);
		effects.exit("lineEndingBlank");
		self$1.currentConstruct = void 0;
		return initial;
	}
	/** @type {State} */
	function afterConstruct(code$3) {
		if (code$3 === null) {
			effects.consume(code$3);
			return;
		}
		effects.enter("lineEnding");
		effects.consume(code$3);
		effects.exit("lineEnding");
		self$1.currentConstruct = void 0;
		return initial;
	}
}

//#endregion
//#region node_modules/micromark/lib/initialize/text.js
/**
* @import {
*   Code,
*   InitialConstruct,
*   Initializer,
*   Resolver,
*   State,
*   TokenizeContext
* } from 'micromark-util-types'
*/
const resolver = { resolveAll: createResolver() };
const string = initializeFactory("string");
const text$6 = initializeFactory("text");
/**
* @param {'string' | 'text'} field
*   Field.
* @returns {InitialConstruct}
*   Construct.
*/
function initializeFactory(field) {
	return {
		resolveAll: createResolver(field === "text" ? resolveAllLineSuffixes : void 0),
		tokenize: initializeText
	};
	/**
	* @this {TokenizeContext}
	*   Context.
	* @type {Initializer}
	*/
	function initializeText(effects) {
		const self$1 = this;
		const constructs$1 = this.parser.constructs[field];
		const text$9 = effects.attempt(constructs$1, start, notText);
		return start;
		/** @type {State} */
		function start(code$3) {
			return atBreak(code$3) ? text$9(code$3) : notText(code$3);
		}
		/** @type {State} */
		function notText(code$3) {
			if (code$3 === null) {
				effects.consume(code$3);
				return;
			}
			effects.enter("data");
			effects.consume(code$3);
			return data;
		}
		/** @type {State} */
		function data(code$3) {
			if (atBreak(code$3)) {
				effects.exit("data");
				return text$9(code$3);
			}
			effects.consume(code$3);
			return data;
		}
		/**
		* @param {Code} code
		*   Code.
		* @returns {boolean}
		*   Whether the code is a break.
		*/
		function atBreak(code$3) {
			if (code$3 === null) return true;
			const list$3 = constructs$1[code$3];
			let index$2 = -1;
			if (list$3) while (++index$2 < list$3.length) {
				const item = list$3[index$2];
				if (!item.previous || item.previous.call(self$1, self$1.previous)) return true;
			}
			return false;
		}
	}
}
/**
* @param {Resolver | undefined} [extraResolver]
*   Resolver.
* @returns {Resolver}
*   Resolver.
*/
function createResolver(extraResolver) {
	return resolveAllText;
	/** @type {Resolver} */
	function resolveAllText(events, context) {
		let index$2 = -1;
		/** @type {number | undefined} */
		let enter;
		while (++index$2 <= events.length) if (enter === void 0) {
			if (events[index$2] && events[index$2][1].type === "data") {
				enter = index$2;
				index$2++;
			}
		} else if (!events[index$2] || events[index$2][1].type !== "data") {
			if (index$2 !== enter + 2) {
				events[enter][1].end = events[index$2 - 1][1].end;
				events.splice(enter + 2, index$2 - enter - 2);
				index$2 = enter + 2;
			}
			enter = void 0;
		}
		return extraResolver ? extraResolver(events, context) : events;
	}
}
/**
* A rather ugly set of instructions which again looks at chunks in the input
* stream.
* The reason to do this here is that it is *much* faster to parse in reverse.
* And that we can’t hook into `null` to split the line suffix before an EOF.
* To do: figure out if we can make this into a clean utility, or even in core.
* As it will be useful for GFMs literal autolink extension (and maybe even
* tables?)
*
* @type {Resolver}
*/
function resolveAllLineSuffixes(events, context) {
	let eventIndex = 0;
	while (++eventIndex <= events.length) if ((eventIndex === events.length || events[eventIndex][1].type === "lineEnding") && events[eventIndex - 1][1].type === "data") {
		const data = events[eventIndex - 1][1];
		const chunks = context.sliceStream(data);
		let index$2 = chunks.length;
		let bufferIndex = -1;
		let size = 0;
		/** @type {boolean | undefined} */
		let tabs;
		while (index$2--) {
			const chunk = chunks[index$2];
			if (typeof chunk === "string") {
				bufferIndex = chunk.length;
				while (chunk.charCodeAt(bufferIndex - 1) === 32) {
					size++;
					bufferIndex--;
				}
				if (bufferIndex) break;
				bufferIndex = -1;
			} else if (chunk === -2) {
				tabs = true;
				size++;
			} else if (chunk === -1) {} else {
				index$2++;
				break;
			}
		}
		if (context._contentTypeTextTrailing && eventIndex === events.length) size = 0;
		if (size) {
			const token = {
				type: eventIndex === events.length || tabs || size < 2 ? "lineSuffix" : "hardBreakTrailing",
				start: {
					_bufferIndex: index$2 ? bufferIndex : data.start._bufferIndex + bufferIndex,
					_index: data.start._index + index$2,
					line: data.end.line,
					column: data.end.column - size,
					offset: data.end.offset - size
				},
				end: { ...data.end }
			};
			data.end = { ...token.start };
			if (data.start.offset === data.end.offset) Object.assign(data, token);
			else {
				events.splice(eventIndex, 0, [
					"enter",
					token,
					context
				], [
					"exit",
					token,
					context
				]);
				eventIndex += 2;
			}
		}
		eventIndex++;
	}
	return events;
}

//#endregion
//#region node_modules/micromark/lib/constructs.js
var constructs_exports = /* @__PURE__ */ __export({
	attentionMarkers: () => attentionMarkers,
	contentInitial: () => contentInitial,
	disable: () => disable,
	document: () => document$2,
	flow: () => flow$1,
	flowInitial: () => flowInitial,
	insideSpan: () => insideSpan,
	string: () => string$1,
	text: () => text$7
});
/** @satisfies {Extension['document']} */
const document$2 = {
	[42]: list$2,
	[43]: list$2,
	[45]: list$2,
	[48]: list$2,
	[49]: list$2,
	[50]: list$2,
	[51]: list$2,
	[52]: list$2,
	[53]: list$2,
	[54]: list$2,
	[55]: list$2,
	[56]: list$2,
	[57]: list$2,
	[62]: blockQuote
};
/** @satisfies {Extension['contentInitial']} */
const contentInitial = { [91]: definition$1 };
/** @satisfies {Extension['flowInitial']} */
const flowInitial = {
	[-2]: codeIndented,
	[-1]: codeIndented,
	[32]: codeIndented
};
/** @satisfies {Extension['flow']} */
const flow$1 = {
	[35]: headingAtx,
	[42]: thematicBreak$2,
	[45]: [setextUnderline, thematicBreak$2],
	[60]: htmlFlow,
	[61]: setextUnderline,
	[95]: thematicBreak$2,
	[96]: codeFenced,
	[126]: codeFenced
};
/** @satisfies {Extension['string']} */
const string$1 = {
	[38]: characterReference,
	[92]: characterEscape
};
/** @satisfies {Extension['text']} */
const text$7 = {
	[-5]: lineEnding,
	[-4]: lineEnding,
	[-3]: lineEnding,
	[33]: labelStartImage,
	[38]: characterReference,
	[42]: attention,
	[60]: [autolink, htmlText],
	[91]: labelStartLink,
	[92]: [hardBreakEscape, characterEscape],
	[93]: labelEnd,
	[95]: attention,
	[96]: codeText
};
/** @satisfies {Extension['insideSpan']} */
const insideSpan = { null: [attention, resolver] };
/** @satisfies {Extension['attentionMarkers']} */
const attentionMarkers = { null: [42, 95] };
/** @satisfies {Extension['disable']} */
const disable = { null: [] };

//#endregion
//#region node_modules/micromark/lib/create-tokenizer.js
/**
* Create a tokenizer.
* Tokenizers deal with one type of data (e.g., containers, flow, text).
* The parser is the object dealing with it all.
* `initialize` works like other constructs, except that only its `tokenize`
* function is used, in which case it doesn’t receive an `ok` or `nok`.
* `from` can be given to set the point before the first character, although
* when further lines are indented, they must be set with `defineSkip`.
*
* @param {ParseContext} parser
*   Parser.
* @param {InitialConstruct} initialize
*   Construct.
* @param {Omit<Point, '_bufferIndex' | '_index'> | undefined} [from]
*   Point (optional).
* @returns {TokenizeContext}
*   Context.
*/
function createTokenizer(parser, initialize, from) {
	/** @type {Point} */
	let point$4 = {
		_bufferIndex: -1,
		_index: 0,
		line: from && from.line || 1,
		column: from && from.column || 1,
		offset: from && from.offset || 0
	};
	/** @type {Record<string, number>} */
	const columnStart = {};
	/** @type {Array<Construct>} */
	const resolveAllConstructs = [];
	/** @type {Array<Chunk>} */
	let chunks = [];
	/** @type {Array<Token>} */
	let stack = [];
	/**
	* Tools used for tokenizing.
	*
	* @type {Effects}
	*/
	const effects = {
		attempt: constructFactory(onsuccessfulconstruct),
		check: constructFactory(onsuccessfulcheck),
		consume,
		enter,
		exit: exit$2,
		interrupt: constructFactory(onsuccessfulcheck, { interrupt: true })
	};
	/**
	* State and tools for resolving and serializing.
	*
	* @type {TokenizeContext}
	*/
	const context = {
		code: null,
		containerState: {},
		defineSkip,
		events: [],
		now,
		parser,
		previous: null,
		sliceSerialize,
		sliceStream,
		write
	};
	/**
	* The state function.
	*
	* @type {State | undefined}
	*/
	let state = initialize.tokenize.call(context, effects);
	if (initialize.resolveAll) resolveAllConstructs.push(initialize);
	return context;
	/** @type {TokenizeContext['write']} */
	function write(slice) {
		chunks = push(chunks, slice);
		main();
		if (chunks[chunks.length - 1] !== null) return [];
		addResult(initialize, 0);
		context.events = resolveAll(resolveAllConstructs, context.events, context);
		return context.events;
	}
	/** @type {TokenizeContext['sliceSerialize']} */
	function sliceSerialize(token, expandTabs) {
		return serializeChunks(sliceStream(token), expandTabs);
	}
	/** @type {TokenizeContext['sliceStream']} */
	function sliceStream(token) {
		return sliceChunks(chunks, token);
	}
	/** @type {TokenizeContext['now']} */
	function now() {
		const { _bufferIndex, _index, line, column, offset } = point$4;
		return {
			_bufferIndex,
			_index,
			line,
			column,
			offset
		};
	}
	/** @type {TokenizeContext['defineSkip']} */
	function defineSkip(value) {
		columnStart[value.line] = value.column;
		accountForPotentialSkip();
	}
	/**
	* Main loop (note that `_index` and `_bufferIndex` in `point` are modified by
	* `consume`).
	* Here is where we walk through the chunks, which either include strings of
	* several characters, or numerical character codes.
	* The reason to do this in a loop instead of a call is so the stack can
	* drain.
	*
	* @returns {undefined}
	*   Nothing.
	*/
	function main() {
		/** @type {number} */
		let chunkIndex;
		while (point$4._index < chunks.length) {
			const chunk = chunks[point$4._index];
			if (typeof chunk === "string") {
				chunkIndex = point$4._index;
				if (point$4._bufferIndex < 0) point$4._bufferIndex = 0;
				while (point$4._index === chunkIndex && point$4._bufferIndex < chunk.length) go(chunk.charCodeAt(point$4._bufferIndex));
			} else go(chunk);
		}
	}
	/**
	* Deal with one code.
	*
	* @param {Code} code
	*   Code.
	* @returns {undefined}
	*   Nothing.
	*/
	function go(code$3) {
		state = state(code$3);
	}
	/** @type {Effects['consume']} */
	function consume(code$3) {
		if (markdownLineEnding(code$3)) {
			point$4.line++;
			point$4.column = 1;
			point$4.offset += code$3 === -3 ? 2 : 1;
			accountForPotentialSkip();
		} else if (code$3 !== -1) {
			point$4.column++;
			point$4.offset++;
		}
		if (point$4._bufferIndex < 0) point$4._index++;
		else {
			point$4._bufferIndex++;
			if (point$4._bufferIndex === chunks[point$4._index].length) {
				point$4._bufferIndex = -1;
				point$4._index++;
			}
		}
		context.previous = code$3;
	}
	/** @type {Effects['enter']} */
	function enter(type, fields) {
		/** @type {Token} */
		const token = fields || {};
		token.type = type;
		token.start = now();
		context.events.push([
			"enter",
			token,
			context
		]);
		stack.push(token);
		return token;
	}
	/** @type {Effects['exit']} */
	function exit$2(type) {
		const token = stack.pop();
		token.end = now();
		context.events.push([
			"exit",
			token,
			context
		]);
		return token;
	}
	/**
	* Use results.
	*
	* @type {ReturnHandle}
	*/
	function onsuccessfulconstruct(construct, info) {
		addResult(construct, info.from);
	}
	/**
	* Discard results.
	*
	* @type {ReturnHandle}
	*/
	function onsuccessfulcheck(_, info) {
		info.restore();
	}
	/**
	* Factory to attempt/check/interrupt.
	*
	* @param {ReturnHandle} onreturn
	*   Callback.
	* @param {{interrupt?: boolean | undefined} | undefined} [fields]
	*   Fields.
	*/
	function constructFactory(onreturn, fields) {
		return hook;
		/**
		* Handle either an object mapping codes to constructs, a list of
		* constructs, or a single construct.
		*
		* @param {Array<Construct> | ConstructRecord | Construct} constructs
		*   Constructs.
		* @param {State} returnState
		*   State.
		* @param {State | undefined} [bogusState]
		*   State.
		* @returns {State}
		*   State.
		*/
		function hook(constructs$1, returnState, bogusState) {
			/** @type {ReadonlyArray<Construct>} */
			let listOfConstructs;
			/** @type {number} */
			let constructIndex;
			/** @type {Construct} */
			let currentConstruct;
			/** @type {Info} */
			let info;
			return Array.isArray(constructs$1) ? handleListOfConstructs(constructs$1) : "tokenize" in constructs$1 ? handleListOfConstructs([constructs$1]) : handleMapOfConstructs(constructs$1);
			/**
			* Handle a list of construct.
			*
			* @param {ConstructRecord} map
			*   Constructs.
			* @returns {State}
			*   State.
			*/
			function handleMapOfConstructs(map$2) {
				return start;
				/** @type {State} */
				function start(code$3) {
					const left = code$3 !== null && map$2[code$3];
					const all$4 = code$3 !== null && map$2.null;
					return handleListOfConstructs([...Array.isArray(left) ? left : left ? [left] : [], ...Array.isArray(all$4) ? all$4 : all$4 ? [all$4] : []])(code$3);
				}
			}
			/**
			* Handle a list of construct.
			*
			* @param {ReadonlyArray<Construct>} list
			*   Constructs.
			* @returns {State}
			*   State.
			*/
			function handleListOfConstructs(list$3) {
				listOfConstructs = list$3;
				constructIndex = 0;
				if (list$3.length === 0) return bogusState;
				return handleConstruct(list$3[constructIndex]);
			}
			/**
			* Handle a single construct.
			*
			* @param {Construct} construct
			*   Construct.
			* @returns {State}
			*   State.
			*/
			function handleConstruct(construct) {
				return start;
				/** @type {State} */
				function start(code$3) {
					info = store();
					currentConstruct = construct;
					if (!construct.partial) context.currentConstruct = construct;
					if (construct.name && context.parser.constructs.disable.null.includes(construct.name)) return nok(code$3);
					return construct.tokenize.call(fields ? Object.assign(Object.create(context), fields) : context, effects, ok$2, nok)(code$3);
				}
			}
			/** @type {State} */
			function ok$2(code$3) {
				onreturn(currentConstruct, info);
				return returnState;
			}
			/** @type {State} */
			function nok(code$3) {
				info.restore();
				if (++constructIndex < listOfConstructs.length) return handleConstruct(listOfConstructs[constructIndex]);
				return bogusState;
			}
		}
	}
	/**
	* @param {Construct} construct
	*   Construct.
	* @param {number} from
	*   From.
	* @returns {undefined}
	*   Nothing.
	*/
	function addResult(construct, from$1) {
		if (construct.resolveAll && !resolveAllConstructs.includes(construct)) resolveAllConstructs.push(construct);
		if (construct.resolve) splice(context.events, from$1, context.events.length - from$1, construct.resolve(context.events.slice(from$1), context));
		if (construct.resolveTo) context.events = construct.resolveTo(context.events, context);
	}
	/**
	* Store state.
	*
	* @returns {Info}
	*   Info.
	*/
	function store() {
		const startPoint = now();
		const startPrevious = context.previous;
		const startCurrentConstruct = context.currentConstruct;
		const startEventsIndex = context.events.length;
		const startStack = Array.from(stack);
		return {
			from: startEventsIndex,
			restore
		};
		/**
		* Restore state.
		*
		* @returns {undefined}
		*   Nothing.
		*/
		function restore() {
			point$4 = startPoint;
			context.previous = startPrevious;
			context.currentConstruct = startCurrentConstruct;
			context.events.length = startEventsIndex;
			stack = startStack;
			accountForPotentialSkip();
		}
	}
	/**
	* Move the current point a bit forward in the line when it’s on a column
	* skip.
	*
	* @returns {undefined}
	*   Nothing.
	*/
	function accountForPotentialSkip() {
		if (point$4.line in columnStart && point$4.column < 2) {
			point$4.column = columnStart[point$4.line];
			point$4.offset += columnStart[point$4.line] - 1;
		}
	}
}
/**
* Get the chunks from a slice of chunks in the range of a token.
*
* @param {ReadonlyArray<Chunk>} chunks
*   Chunks.
* @param {Pick<Token, 'end' | 'start'>} token
*   Token.
* @returns {Array<Chunk>}
*   Chunks.
*/
function sliceChunks(chunks, token) {
	const startIndex = token.start._index;
	const startBufferIndex = token.start._bufferIndex;
	const endIndex = token.end._index;
	const endBufferIndex = token.end._bufferIndex;
	/** @type {Array<Chunk>} */
	let view;
	if (startIndex === endIndex) view = [chunks[startIndex].slice(startBufferIndex, endBufferIndex)];
	else {
		view = chunks.slice(startIndex, endIndex);
		if (startBufferIndex > -1) {
			const head = view[0];
			if (typeof head === "string") view[0] = head.slice(startBufferIndex);
			else view.shift();
		}
		if (endBufferIndex > 0) view.push(chunks[endIndex].slice(0, endBufferIndex));
	}
	return view;
}
/**
* Get the string value of a slice of chunks.
*
* @param {ReadonlyArray<Chunk>} chunks
*   Chunks.
* @param {boolean | undefined} [expandTabs=false]
*   Whether to expand tabs (default: `false`).
* @returns {string}
*   Result.
*/
function serializeChunks(chunks, expandTabs) {
	let index$2 = -1;
	/** @type {Array<string>} */
	const result = [];
	/** @type {boolean | undefined} */
	let atTab;
	while (++index$2 < chunks.length) {
		const chunk = chunks[index$2];
		/** @type {string} */
		let value;
		if (typeof chunk === "string") value = chunk;
		else switch (chunk) {
			case -5:
				value = "\r";
				break;
			case -4:
				value = "\n";
				break;
			case -3:
				value = "\r\n";
				break;
			case -2:
				value = expandTabs ? " " : "	";
				break;
			case -1:
				if (!expandTabs && atTab) continue;
				value = " ";
				break;
			default: value = String.fromCharCode(chunk);
		}
		atTab = chunk === -2;
		result.push(value);
	}
	return result.join("");
}

//#endregion
//#region node_modules/micromark/lib/parse.js
/**
* @param {ParseOptions | null | undefined} [options]
*   Configuration (optional).
* @returns {ParseContext}
*   Parser.
*/
function parse$2(options) {
	/** @type {ParseContext} */
	const parser = {
		constructs: combineExtensions([constructs_exports, ...(options || {}).extensions || []]),
		content: create$1(content),
		defined: [],
		document: create$1(document$1),
		flow: create$1(flow),
		lazy: {},
		string: create$1(string),
		text: create$1(text$6)
	};
	return parser;
	/**
	* @param {InitialConstruct} initial
	*   Construct to start with.
	* @returns {Create}
	*   Create a tokenizer.
	*/
	function create$1(initial) {
		return creator;
		/** @type {Create} */
		function creator(from) {
			return createTokenizer(parser, initial, from);
		}
	}
}

//#endregion
//#region node_modules/micromark/lib/postprocess.js
/**
* @param {Array<Event>} events
*   Events.
* @returns {Array<Event>}
*   Events.
*/
function postprocess(events) {
	while (!subtokenize(events));
	return events;
}

//#endregion
//#region node_modules/micromark/lib/preprocess.js
/**
* @import {Chunk, Code, Encoding, Value} from 'micromark-util-types'
*/
/**
* @callback Preprocessor
*   Preprocess a value.
* @param {Value} value
*   Value.
* @param {Encoding | null | undefined} [encoding]
*   Encoding when `value` is a typed array (optional).
* @param {boolean | null | undefined} [end=false]
*   Whether this is the last chunk (default: `false`).
* @returns {Array<Chunk>}
*   Chunks.
*/
const search$1 = /[\0\t\n\r]/g;
/**
* @returns {Preprocessor}
*   Preprocess a value.
*/
function preprocess() {
	let column = 1;
	let buffer = "";
	/** @type {boolean | undefined} */
	let start = true;
	/** @type {boolean | undefined} */
	let atCarriageReturn;
	return preprocessor;
	/** @type {Preprocessor} */
	function preprocessor(value, encoding, end) {
		/** @type {Array<Chunk>} */
		const chunks = [];
		/** @type {RegExpMatchArray | null} */
		let match;
		/** @type {number} */
		let next$1;
		/** @type {number} */
		let startPosition;
		/** @type {number} */
		let endPosition;
		/** @type {Code} */
		let code$3;
		value = buffer + (typeof value === "string" ? value.toString() : new TextDecoder(encoding || void 0).decode(value));
		startPosition = 0;
		buffer = "";
		if (start) {
			if (value.charCodeAt(0) === 65279) startPosition++;
			start = void 0;
		}
		while (startPosition < value.length) {
			search$1.lastIndex = startPosition;
			match = search$1.exec(value);
			endPosition = match && match.index !== void 0 ? match.index : value.length;
			code$3 = value.charCodeAt(endPosition);
			if (!match) {
				buffer = value.slice(startPosition);
				break;
			}
			if (code$3 === 10 && startPosition === endPosition && atCarriageReturn) {
				chunks.push(-3);
				atCarriageReturn = void 0;
			} else {
				if (atCarriageReturn) {
					chunks.push(-5);
					atCarriageReturn = void 0;
				}
				if (startPosition < endPosition) {
					chunks.push(value.slice(startPosition, endPosition));
					column += endPosition - startPosition;
				}
				switch (code$3) {
					case 0:
						chunks.push(65533);
						column++;
						break;
					case 9:
						next$1 = Math.ceil(column / 4) * 4;
						chunks.push(-2);
						while (column++ < next$1) chunks.push(-1);
						break;
					case 10:
						chunks.push(-4);
						column = 1;
						break;
					default:
						atCarriageReturn = true;
						column = 1;
				}
			}
			startPosition = endPosition + 1;
		}
		if (end) {
			if (atCarriageReturn) chunks.push(-5);
			if (buffer) chunks.push(buffer);
			chunks.push(null);
		}
		return chunks;
	}
}

//#endregion
//#region node_modules/micromark-util-decode-string/index.js
const characterEscapeOrReference = /\\([!-/:-@[-`{-~])|&(#(?:\d{1,7}|x[\da-f]{1,6})|[\da-z]{1,31});/gi;
/**
* Decode markdown strings (which occur in places such as fenced code info
* strings, destinations, labels, and titles).
*
* The “string” content type allows character escapes and -references.
* This decodes those.
*
* @param {string} value
*   Value to decode.
* @returns {string}
*   Decoded value.
*/
function decodeString(value) {
	return value.replace(characterEscapeOrReference, decode);
}
/**
* @param {string} $0
*   Match.
* @param {string} $1
*   Character escape.
* @param {string} $2
*   Character reference.
* @returns {string}
*   Decoded value
*/
function decode($0, $1, $2) {
	if ($1) return $1;
	if ($2.charCodeAt(0) === 35) {
		const head = $2.charCodeAt(1);
		const hex = head === 120 || head === 88;
		return decodeNumericCharacterReference($2.slice(hex ? 2 : 1), hex ? 16 : 10);
	}
	return decodeNamedCharacterReference($2) || $0;
}

//#endregion
//#region node_modules/mdast-util-from-markdown/lib/index.js
const own$6 = {}.hasOwnProperty;
/**
* Turn markdown into a syntax tree.
*
* @overload
* @param {Value} value
* @param {Encoding | null | undefined} [encoding]
* @param {Options | null | undefined} [options]
* @returns {Root}
*
* @overload
* @param {Value} value
* @param {Options | null | undefined} [options]
* @returns {Root}
*
* @param {Value} value
*   Markdown to parse.
* @param {Encoding | Options | null | undefined} [encoding]
*   Character encoding for when `value` is `Buffer`.
* @param {Options | null | undefined} [options]
*   Configuration.
* @returns {Root}
*   mdast tree.
*/
function fromMarkdown(value, encoding, options) {
	if (encoding && typeof encoding === "object") {
		options = encoding;
		encoding = void 0;
	}
	return compiler(options)(postprocess(parse$2(options).document().write(preprocess()(value, encoding, true))));
}
/**
* Note this compiler only understand complete buffering, not streaming.
*
* @param {Options | null | undefined} [options]
*/
function compiler(options) {
	/** @type {Config} */
	const config = {
		transforms: [],
		canContainEols: [
			"emphasis",
			"fragment",
			"heading",
			"paragraph",
			"strong"
		],
		enter: {
			autolink: opener(link$2),
			autolinkProtocol: onenterdata,
			autolinkEmail: onenterdata,
			atxHeading: opener(heading$2),
			blockQuote: opener(blockQuote$1),
			characterEscape: onenterdata,
			characterReference: onenterdata,
			codeFenced: opener(codeFlow),
			codeFencedFenceInfo: buffer,
			codeFencedFenceMeta: buffer,
			codeIndented: opener(codeFlow, buffer),
			codeText: opener(codeText$1, buffer),
			codeTextData: onenterdata,
			data: onenterdata,
			codeFlowValue: onenterdata,
			definition: opener(definition$2),
			definitionDestinationString: buffer,
			definitionLabelString: buffer,
			definitionTitleString: buffer,
			emphasis: opener(emphasis$2),
			hardBreakEscape: opener(hardBreak$2),
			hardBreakTrailing: opener(hardBreak$2),
			htmlFlow: opener(html$4, buffer),
			htmlFlowData: onenterdata,
			htmlText: opener(html$4, buffer),
			htmlTextData: onenterdata,
			image: opener(image$2),
			label: buffer,
			link: opener(link$2),
			listItem: opener(listItem$2),
			listItemValue: onenterlistitemvalue,
			listOrdered: opener(list$3, onenterlistordered),
			listUnordered: opener(list$3),
			paragraph: opener(paragraph$2),
			reference: onenterreference,
			referenceString: buffer,
			resourceDestinationString: buffer,
			resourceTitleString: buffer,
			setextHeading: opener(heading$2),
			strong: opener(strong$2),
			thematicBreak: opener(thematicBreak$3)
		},
		exit: {
			atxHeading: closer(),
			atxHeadingSequence: onexitatxheadingsequence,
			autolink: closer(),
			autolinkEmail: onexitautolinkemail,
			autolinkProtocol: onexitautolinkprotocol,
			blockQuote: closer(),
			characterEscapeValue: onexitdata,
			characterReferenceMarkerHexadecimal: onexitcharacterreferencemarker,
			characterReferenceMarkerNumeric: onexitcharacterreferencemarker,
			characterReferenceValue: onexitcharacterreferencevalue,
			characterReference: onexitcharacterreference,
			codeFenced: closer(onexitcodefenced),
			codeFencedFence: onexitcodefencedfence,
			codeFencedFenceInfo: onexitcodefencedfenceinfo,
			codeFencedFenceMeta: onexitcodefencedfencemeta,
			codeFlowValue: onexitdata,
			codeIndented: closer(onexitcodeindented),
			codeText: closer(onexitcodetext),
			codeTextData: onexitdata,
			data: onexitdata,
			definition: closer(),
			definitionDestinationString: onexitdefinitiondestinationstring,
			definitionLabelString: onexitdefinitionlabelstring,
			definitionTitleString: onexitdefinitiontitlestring,
			emphasis: closer(),
			hardBreakEscape: closer(onexithardbreak),
			hardBreakTrailing: closer(onexithardbreak),
			htmlFlow: closer(onexithtmlflow),
			htmlFlowData: onexitdata,
			htmlText: closer(onexithtmltext),
			htmlTextData: onexitdata,
			image: closer(onexitimage),
			label: onexitlabel,
			labelText: onexitlabeltext,
			lineEnding: onexitlineending,
			link: closer(onexitlink),
			listItem: closer(),
			listOrdered: closer(),
			listUnordered: closer(),
			paragraph: closer(),
			referenceString: onexitreferencestring,
			resourceDestinationString: onexitresourcedestinationstring,
			resourceTitleString: onexitresourcetitlestring,
			resource: onexitresource,
			setextHeading: closer(onexitsetextheading),
			setextHeadingLineSequence: onexitsetextheadinglinesequence,
			setextHeadingText: onexitsetextheadingtext,
			strong: closer(),
			thematicBreak: closer()
		}
	};
	configure(config, (options || {}).mdastExtensions || []);
	/** @type {CompileData} */
	const data = {};
	return compile;
	/**
	* Turn micromark events into an mdast tree.
	*
	* @param {Array<Event>} events
	*   Events.
	* @returns {Root}
	*   mdast tree.
	*/
	function compile(events) {
		/** @type {Root} */
		let tree = {
			type: "root",
			children: []
		};
		/** @type {Omit<CompileContext, 'sliceSerialize'>} */
		const context = {
			stack: [tree],
			tokenStack: [],
			config,
			enter,
			exit: exit$2,
			buffer,
			resume,
			data
		};
		/** @type {Array<number>} */
		const listStack = [];
		let index$2 = -1;
		while (++index$2 < events.length) if (events[index$2][1].type === "listOrdered" || events[index$2][1].type === "listUnordered") if (events[index$2][0] === "enter") listStack.push(index$2);
		else index$2 = prepareList(events, listStack.pop(), index$2);
		index$2 = -1;
		while (++index$2 < events.length) {
			const handler = config[events[index$2][0]];
			if (own$6.call(handler, events[index$2][1].type)) handler[events[index$2][1].type].call(Object.assign({ sliceSerialize: events[index$2][2].sliceSerialize }, context), events[index$2][1]);
		}
		if (context.tokenStack.length > 0) {
			const tail = context.tokenStack[context.tokenStack.length - 1];
			(tail[1] || defaultOnError).call(context, void 0, tail[0]);
		}
		tree.position = {
			start: point$1(events.length > 0 ? events[0][1].start : {
				line: 1,
				column: 1,
				offset: 0
			}),
			end: point$1(events.length > 0 ? events[events.length - 2][1].end : {
				line: 1,
				column: 1,
				offset: 0
			})
		};
		index$2 = -1;
		while (++index$2 < config.transforms.length) tree = config.transforms[index$2](tree) || tree;
		return tree;
	}
	/**
	* @param {Array<Event>} events
	* @param {number} start
	* @param {number} length
	* @returns {number}
	*/
	function prepareList(events, start, length) {
		let index$2 = start - 1;
		let containerBalance = -1;
		let listSpread = false;
		/** @type {Token | undefined} */
		let listItem$3;
		/** @type {number | undefined} */
		let lineIndex;
		/** @type {number | undefined} */
		let firstBlankLineIndex;
		/** @type {boolean | undefined} */
		let atMarker;
		while (++index$2 <= length) {
			const event = events[index$2];
			switch (event[1].type) {
				case "listUnordered":
				case "listOrdered":
				case "blockQuote":
					if (event[0] === "enter") containerBalance++;
					else containerBalance--;
					atMarker = void 0;
					break;
				case "lineEndingBlank":
					if (event[0] === "enter") {
						if (listItem$3 && !atMarker && !containerBalance && !firstBlankLineIndex) firstBlankLineIndex = index$2;
						atMarker = void 0;
					}
					break;
				case "linePrefix":
				case "listItemValue":
				case "listItemMarker":
				case "listItemPrefix":
				case "listItemPrefixWhitespace": break;
				default: atMarker = void 0;
			}
			if (!containerBalance && event[0] === "enter" && event[1].type === "listItemPrefix" || containerBalance === -1 && event[0] === "exit" && (event[1].type === "listUnordered" || event[1].type === "listOrdered")) {
				if (listItem$3) {
					let tailIndex = index$2;
					lineIndex = void 0;
					while (tailIndex--) {
						const tailEvent = events[tailIndex];
						if (tailEvent[1].type === "lineEnding" || tailEvent[1].type === "lineEndingBlank") {
							if (tailEvent[0] === "exit") continue;
							if (lineIndex) {
								events[lineIndex][1].type = "lineEndingBlank";
								listSpread = true;
							}
							tailEvent[1].type = "lineEnding";
							lineIndex = tailIndex;
						} else if (tailEvent[1].type === "linePrefix" || tailEvent[1].type === "blockQuotePrefix" || tailEvent[1].type === "blockQuotePrefixWhitespace" || tailEvent[1].type === "blockQuoteMarker" || tailEvent[1].type === "listItemIndent") {} else break;
					}
					if (firstBlankLineIndex && (!lineIndex || firstBlankLineIndex < lineIndex)) listItem$3._spread = true;
					listItem$3.end = Object.assign({}, lineIndex ? events[lineIndex][1].start : event[1].end);
					events.splice(lineIndex || index$2, 0, [
						"exit",
						listItem$3,
						event[2]
					]);
					index$2++;
					length++;
				}
				if (event[1].type === "listItemPrefix") {
					/** @type {Token} */
					const item = {
						type: "listItem",
						_spread: false,
						start: Object.assign({}, event[1].start),
						end: void 0
					};
					listItem$3 = item;
					events.splice(index$2, 0, [
						"enter",
						item,
						event[2]
					]);
					index$2++;
					length++;
					firstBlankLineIndex = void 0;
					atMarker = true;
				}
			}
		}
		events[start][1]._spread = listSpread;
		return length;
	}
	/**
	* Create an opener handle.
	*
	* @param {(token: Token) => Nodes} create
	*   Create a node.
	* @param {Handle | undefined} [and]
	*   Optional function to also run.
	* @returns {Handle}
	*   Handle.
	*/
	function opener(create$1, and) {
		return open;
		/**
		* @this {CompileContext}
		* @param {Token} token
		* @returns {undefined}
		*/
		function open(token) {
			enter.call(this, create$1(token), token);
			if (and) and.call(this, token);
		}
	}
	/**
	* @type {CompileContext['buffer']}
	*/
	function buffer() {
		this.stack.push({
			type: "fragment",
			children: []
		});
	}
	/**
	* @type {CompileContext['enter']}
	*/
	function enter(node$1, token, errorHandler) {
		this.stack[this.stack.length - 1].children.push(node$1);
		this.stack.push(node$1);
		this.tokenStack.push([token, errorHandler || void 0]);
		node$1.position = {
			start: point$1(token.start),
			end: void 0
		};
	}
	/**
	* Create a closer handle.
	*
	* @param {Handle | undefined} [and]
	*   Optional function to also run.
	* @returns {Handle}
	*   Handle.
	*/
	function closer(and) {
		return close;
		/**
		* @this {CompileContext}
		* @param {Token} token
		* @returns {undefined}
		*/
		function close(token) {
			if (and) and.call(this, token);
			exit$2.call(this, token);
		}
	}
	/**
	* @type {CompileContext['exit']}
	*/
	function exit$2(token, onExitError) {
		const node$1 = this.stack.pop();
		const open = this.tokenStack.pop();
		if (!open) throw new Error("Cannot close `" + token.type + "` (" + stringifyPosition({
			start: token.start,
			end: token.end
		}) + "): it’s not open");
		else if (open[0].type !== token.type) if (onExitError) onExitError.call(this, token, open[0]);
		else (open[1] || defaultOnError).call(this, token, open[0]);
		node$1.position.end = point$1(token.end);
	}
	/**
	* @type {CompileContext['resume']}
	*/
	function resume() {
		return toString(this.stack.pop());
	}
	/**
	* @this {CompileContext}
	* @type {Handle}
	*/
	function onenterlistordered() {
		this.data.expectingFirstListItemValue = true;
	}
	/**
	* @this {CompileContext}
	* @type {Handle}
	*/
	function onenterlistitemvalue(token) {
		if (this.data.expectingFirstListItemValue) {
			const ancestor = this.stack[this.stack.length - 2];
			ancestor.start = Number.parseInt(this.sliceSerialize(token), 10);
			this.data.expectingFirstListItemValue = void 0;
		}
	}
	/**
	* @this {CompileContext}
	* @type {Handle}
	*/
	function onexitcodefencedfenceinfo() {
		const data$1 = this.resume();
		const node$1 = this.stack[this.stack.length - 1];
		node$1.lang = data$1;
	}
	/**
	* @this {CompileContext}
	* @type {Handle}
	*/
	function onexitcodefencedfencemeta() {
		const data$1 = this.resume();
		const node$1 = this.stack[this.stack.length - 1];
		node$1.meta = data$1;
	}
	/**
	* @this {CompileContext}
	* @type {Handle}
	*/
	function onexitcodefencedfence() {
		if (this.data.flowCodeInside) return;
		this.buffer();
		this.data.flowCodeInside = true;
	}
	/**
	* @this {CompileContext}
	* @type {Handle}
	*/
	function onexitcodefenced() {
		const data$1 = this.resume();
		const node$1 = this.stack[this.stack.length - 1];
		node$1.value = data$1.replace(/^(\r?\n|\r)|(\r?\n|\r)$/g, "");
		this.data.flowCodeInside = void 0;
	}
	/**
	* @this {CompileContext}
	* @type {Handle}
	*/
	function onexitcodeindented() {
		const data$1 = this.resume();
		const node$1 = this.stack[this.stack.length - 1];
		node$1.value = data$1.replace(/(\r?\n|\r)$/g, "");
	}
	/**
	* @this {CompileContext}
	* @type {Handle}
	*/
	function onexitdefinitionlabelstring(token) {
		const label = this.resume();
		const node$1 = this.stack[this.stack.length - 1];
		node$1.label = label;
		node$1.identifier = normalizeIdentifier(this.sliceSerialize(token)).toLowerCase();
	}
	/**
	* @this {CompileContext}
	* @type {Handle}
	*/
	function onexitdefinitiontitlestring() {
		const data$1 = this.resume();
		const node$1 = this.stack[this.stack.length - 1];
		node$1.title = data$1;
	}
	/**
	* @this {CompileContext}
	* @type {Handle}
	*/
	function onexitdefinitiondestinationstring() {
		const data$1 = this.resume();
		const node$1 = this.stack[this.stack.length - 1];
		node$1.url = data$1;
	}
	/**
	* @this {CompileContext}
	* @type {Handle}
	*/
	function onexitatxheadingsequence(token) {
		const node$1 = this.stack[this.stack.length - 1];
		if (!node$1.depth) node$1.depth = this.sliceSerialize(token).length;
	}
	/**
	* @this {CompileContext}
	* @type {Handle}
	*/
	function onexitsetextheadingtext() {
		this.data.setextHeadingSlurpLineEnding = true;
	}
	/**
	* @this {CompileContext}
	* @type {Handle}
	*/
	function onexitsetextheadinglinesequence(token) {
		const node$1 = this.stack[this.stack.length - 1];
		node$1.depth = this.sliceSerialize(token).codePointAt(0) === 61 ? 1 : 2;
	}
	/**
	* @this {CompileContext}
	* @type {Handle}
	*/
	function onexitsetextheading() {
		this.data.setextHeadingSlurpLineEnding = void 0;
	}
	/**
	* @this {CompileContext}
	* @type {Handle}
	*/
	function onenterdata(token) {
		/** @type {Array<Nodes>} */
		const siblings = this.stack[this.stack.length - 1].children;
		let tail = siblings[siblings.length - 1];
		if (!tail || tail.type !== "text") {
			tail = text$9();
			tail.position = {
				start: point$1(token.start),
				end: void 0
			};
			siblings.push(tail);
		}
		this.stack.push(tail);
	}
	/**
	* @this {CompileContext}
	* @type {Handle}
	*/
	function onexitdata(token) {
		const tail = this.stack.pop();
		tail.value += this.sliceSerialize(token);
		tail.position.end = point$1(token.end);
	}
	/**
	* @this {CompileContext}
	* @type {Handle}
	*/
	function onexitlineending(token) {
		const context = this.stack[this.stack.length - 1];
		if (this.data.atHardBreak) {
			const tail = context.children[context.children.length - 1];
			tail.position.end = point$1(token.end);
			this.data.atHardBreak = void 0;
			return;
		}
		if (!this.data.setextHeadingSlurpLineEnding && config.canContainEols.includes(context.type)) {
			onenterdata.call(this, token);
			onexitdata.call(this, token);
		}
	}
	/**
	* @this {CompileContext}
	* @type {Handle}
	*/
	function onexithardbreak() {
		this.data.atHardBreak = true;
	}
	/**
	* @this {CompileContext}
	* @type {Handle}
	*/
	function onexithtmlflow() {
		const data$1 = this.resume();
		const node$1 = this.stack[this.stack.length - 1];
		node$1.value = data$1;
	}
	/**
	* @this {CompileContext}
	* @type {Handle}
	*/
	function onexithtmltext() {
		const data$1 = this.resume();
		const node$1 = this.stack[this.stack.length - 1];
		node$1.value = data$1;
	}
	/**
	* @this {CompileContext}
	* @type {Handle}
	*/
	function onexitcodetext() {
		const data$1 = this.resume();
		const node$1 = this.stack[this.stack.length - 1];
		node$1.value = data$1;
	}
	/**
	* @this {CompileContext}
	* @type {Handle}
	*/
	function onexitlink() {
		const node$1 = this.stack[this.stack.length - 1];
		if (this.data.inReference) {
			/** @type {ReferenceType} */
			const referenceType = this.data.referenceType || "shortcut";
			node$1.type += "Reference";
			node$1.referenceType = referenceType;
			delete node$1.url;
			delete node$1.title;
		} else {
			delete node$1.identifier;
			delete node$1.label;
		}
		this.data.referenceType = void 0;
	}
	/**
	* @this {CompileContext}
	* @type {Handle}
	*/
	function onexitimage() {
		const node$1 = this.stack[this.stack.length - 1];
		if (this.data.inReference) {
			/** @type {ReferenceType} */
			const referenceType = this.data.referenceType || "shortcut";
			node$1.type += "Reference";
			node$1.referenceType = referenceType;
			delete node$1.url;
			delete node$1.title;
		} else {
			delete node$1.identifier;
			delete node$1.label;
		}
		this.data.referenceType = void 0;
	}
	/**
	* @this {CompileContext}
	* @type {Handle}
	*/
	function onexitlabeltext(token) {
		const string$2 = this.sliceSerialize(token);
		const ancestor = this.stack[this.stack.length - 2];
		ancestor.label = decodeString(string$2);
		ancestor.identifier = normalizeIdentifier(string$2).toLowerCase();
	}
	/**
	* @this {CompileContext}
	* @type {Handle}
	*/
	function onexitlabel() {
		const fragment$1 = this.stack[this.stack.length - 1];
		const value = this.resume();
		const node$1 = this.stack[this.stack.length - 1];
		this.data.inReference = true;
		if (node$1.type === "link") node$1.children = fragment$1.children;
		else node$1.alt = value;
	}
	/**
	* @this {CompileContext}
	* @type {Handle}
	*/
	function onexitresourcedestinationstring() {
		const data$1 = this.resume();
		const node$1 = this.stack[this.stack.length - 1];
		node$1.url = data$1;
	}
	/**
	* @this {CompileContext}
	* @type {Handle}
	*/
	function onexitresourcetitlestring() {
		const data$1 = this.resume();
		const node$1 = this.stack[this.stack.length - 1];
		node$1.title = data$1;
	}
	/**
	* @this {CompileContext}
	* @type {Handle}
	*/
	function onexitresource() {
		this.data.inReference = void 0;
	}
	/**
	* @this {CompileContext}
	* @type {Handle}
	*/
	function onenterreference() {
		this.data.referenceType = "collapsed";
	}
	/**
	* @this {CompileContext}
	* @type {Handle}
	*/
	function onexitreferencestring(token) {
		const label = this.resume();
		const node$1 = this.stack[this.stack.length - 1];
		node$1.label = label;
		node$1.identifier = normalizeIdentifier(this.sliceSerialize(token)).toLowerCase();
		this.data.referenceType = "full";
	}
	/**
	* @this {CompileContext}
	* @type {Handle}
	*/
	function onexitcharacterreferencemarker(token) {
		this.data.characterReferenceType = token.type;
	}
	/**
	* @this {CompileContext}
	* @type {Handle}
	*/
	function onexitcharacterreferencevalue(token) {
		const data$1 = this.sliceSerialize(token);
		const type = this.data.characterReferenceType;
		/** @type {string} */
		let value;
		if (type) {
			value = decodeNumericCharacterReference(data$1, type === "characterReferenceMarkerNumeric" ? 10 : 16);
			this.data.characterReferenceType = void 0;
		} else value = decodeNamedCharacterReference(data$1);
		const tail = this.stack[this.stack.length - 1];
		tail.value += value;
	}
	/**
	* @this {CompileContext}
	* @type {Handle}
	*/
	function onexitcharacterreference(token) {
		const tail = this.stack.pop();
		tail.position.end = point$1(token.end);
	}
	/**
	* @this {CompileContext}
	* @type {Handle}
	*/
	function onexitautolinkprotocol(token) {
		onexitdata.call(this, token);
		const node$1 = this.stack[this.stack.length - 1];
		node$1.url = this.sliceSerialize(token);
	}
	/**
	* @this {CompileContext}
	* @type {Handle}
	*/
	function onexitautolinkemail(token) {
		onexitdata.call(this, token);
		const node$1 = this.stack[this.stack.length - 1];
		node$1.url = "mailto:" + this.sliceSerialize(token);
	}
	/** @returns {Blockquote} */
	function blockQuote$1() {
		return {
			type: "blockquote",
			children: []
		};
	}
	/** @returns {Code} */
	function codeFlow() {
		return {
			type: "code",
			lang: null,
			meta: null,
			value: ""
		};
	}
	/** @returns {InlineCode} */
	function codeText$1() {
		return {
			type: "inlineCode",
			value: ""
		};
	}
	/** @returns {Definition} */
	function definition$2() {
		return {
			type: "definition",
			identifier: "",
			label: null,
			title: null,
			url: ""
		};
	}
	/** @returns {Emphasis} */
	function emphasis$2() {
		return {
			type: "emphasis",
			children: []
		};
	}
	/** @returns {Heading} */
	function heading$2() {
		return {
			type: "heading",
			depth: 0,
			children: []
		};
	}
	/** @returns {Break} */
	function hardBreak$2() {
		return { type: "break" };
	}
	/** @returns {Html} */
	function html$4() {
		return {
			type: "html",
			value: ""
		};
	}
	/** @returns {Image} */
	function image$2() {
		return {
			type: "image",
			title: null,
			url: "",
			alt: null
		};
	}
	/** @returns {Link} */
	function link$2() {
		return {
			type: "link",
			title: null,
			url: "",
			children: []
		};
	}
	/**
	* @param {Token} token
	* @returns {List}
	*/
	function list$3(token) {
		return {
			type: "list",
			ordered: token.type === "listOrdered",
			start: null,
			spread: token._spread,
			children: []
		};
	}
	/**
	* @param {Token} token
	* @returns {ListItem}
	*/
	function listItem$2(token) {
		return {
			type: "listItem",
			spread: token._spread,
			checked: null,
			children: []
		};
	}
	/** @returns {Paragraph} */
	function paragraph$2() {
		return {
			type: "paragraph",
			children: []
		};
	}
	/** @returns {Strong} */
	function strong$2() {
		return {
			type: "strong",
			children: []
		};
	}
	/** @returns {Text} */
	function text$9() {
		return {
			type: "text",
			value: ""
		};
	}
	/** @returns {ThematicBreak} */
	function thematicBreak$3() {
		return { type: "thematicBreak" };
	}
}
/**
* Copy a point-like value.
*
* @param {Point} d
*   Point-like value.
* @returns {Point}
*   unist point.
*/
function point$1(d) {
	return {
		line: d.line,
		column: d.column,
		offset: d.offset
	};
}
/**
* @param {Config} combined
* @param {Array<Array<Extension> | Extension>} extensions
* @returns {undefined}
*/
function configure(combined, extensions) {
	let index$2 = -1;
	while (++index$2 < extensions.length) {
		const value = extensions[index$2];
		if (Array.isArray(value)) configure(combined, value);
		else extension(combined, value);
	}
}
/**
* @param {Config} combined
* @param {Extension} extension
* @returns {undefined}
*/
function extension(combined, extension$1) {
	/** @type {keyof Extension} */
	let key;
	for (key in extension$1) if (own$6.call(extension$1, key)) switch (key) {
		case "canContainEols": {
			const right = extension$1[key];
			if (right) combined[key].push(...right);
			break;
		}
		case "transforms": {
			const right = extension$1[key];
			if (right) combined[key].push(...right);
			break;
		}
		case "enter":
		case "exit": {
			const right = extension$1[key];
			if (right) Object.assign(combined[key], right);
			break;
		}
	}
}
/** @type {OnEnterError} */
function defaultOnError(left, right) {
	if (left) throw new Error("Cannot close `" + left.type + "` (" + stringifyPosition({
		start: left.start,
		end: left.end
	}) + "): a different token (`" + right.type + "`, " + stringifyPosition({
		start: right.start,
		end: right.end
	}) + ") is open");
	else throw new Error("Cannot close document, a token (`" + right.type + "`, " + stringifyPosition({
		start: right.start,
		end: right.end
	}) + ") is still open");
}

//#endregion
//#region node_modules/remark-parse/lib/index.js
/**
* Aadd support for parsing from markdown.
*
* @param {Readonly<Options> | null | undefined} [options]
*   Configuration (optional).
* @returns {undefined}
*   Nothing.
*/
function remarkParse(options) {
	/** @type {Processor} */
	const self$1 = this;
	self$1.parser = parser;
	/**
	* @type {Parser}
	*/
	function parser(doc) {
		return fromMarkdown(doc, {
			...self$1.data("settings"),
			...options,
			extensions: self$1.data("micromarkExtensions") || [],
			mdastExtensions: self$1.data("fromMarkdownExtensions") || []
		});
	}
}

//#endregion
//#region node_modules/mdast-util-to-hast/lib/handlers/blockquote.js
/**
* @import {Element} from 'hast'
* @import {Blockquote} from 'mdast'
* @import {State} from '../state.js'
*/
/**
* Turn an mdast `blockquote` node into hast.
*
* @param {State} state
*   Info passed around.
* @param {Blockquote} node
*   mdast node.
* @returns {Element}
*   hast node.
*/
function blockquote$1(state, node$1) {
	/** @type {Element} */
	const result = {
		type: "element",
		tagName: "blockquote",
		properties: {},
		children: state.wrap(state.all(node$1), true)
	};
	state.patch(node$1, result);
	return state.applyData(node$1, result);
}

//#endregion
//#region node_modules/mdast-util-to-hast/lib/handlers/break.js
/**
* @import {Element, Text} from 'hast'
* @import {Break} from 'mdast'
* @import {State} from '../state.js'
*/
/**
* Turn an mdast `break` node into hast.
*
* @param {State} state
*   Info passed around.
* @param {Break} node
*   mdast node.
* @returns {Array<Element | Text>}
*   hast element content.
*/
function hardBreak$1(state, node$1) {
	/** @type {Element} */
	const result = {
		type: "element",
		tagName: "br",
		properties: {},
		children: []
	};
	state.patch(node$1, result);
	return [state.applyData(node$1, result), {
		type: "text",
		value: "\n"
	}];
}

//#endregion
//#region node_modules/mdast-util-to-hast/lib/handlers/code.js
/**
* @import {Element, Properties} from 'hast'
* @import {Code} from 'mdast'
* @import {State} from '../state.js'
*/
/**
* Turn an mdast `code` node into hast.
*
* @param {State} state
*   Info passed around.
* @param {Code} node
*   mdast node.
* @returns {Element}
*   hast node.
*/
function code$2(state, node$1) {
	const value = node$1.value ? node$1.value + "\n" : "";
	/** @type {Properties} */
	const properties$1 = {};
	const language = node$1.lang ? node$1.lang.split(/\s+/) : [];
	if (language.length > 0) properties$1.className = ["language-" + language[0]];
	/** @type {Element} */
	let result = {
		type: "element",
		tagName: "code",
		properties: properties$1,
		children: [{
			type: "text",
			value
		}]
	};
	if (node$1.meta) result.data = { meta: node$1.meta };
	state.patch(node$1, result);
	result = state.applyData(node$1, result);
	result = {
		type: "element",
		tagName: "pre",
		properties: {},
		children: [result]
	};
	state.patch(node$1, result);
	return result;
}

//#endregion
//#region node_modules/mdast-util-to-hast/lib/handlers/delete.js
/**
* @import {Element} from 'hast'
* @import {Delete} from 'mdast'
* @import {State} from '../state.js'
*/
/**
* Turn an mdast `delete` node into hast.
*
* @param {State} state
*   Info passed around.
* @param {Delete} node
*   mdast node.
* @returns {Element}
*   hast node.
*/
function strikethrough(state, node$1) {
	/** @type {Element} */
	const result = {
		type: "element",
		tagName: "del",
		properties: {},
		children: state.all(node$1)
	};
	state.patch(node$1, result);
	return state.applyData(node$1, result);
}

//#endregion
//#region node_modules/mdast-util-to-hast/lib/handlers/emphasis.js
/**
* @import {Element} from 'hast'
* @import {Emphasis} from 'mdast'
* @import {State} from '../state.js'
*/
/**
* Turn an mdast `emphasis` node into hast.
*
* @param {State} state
*   Info passed around.
* @param {Emphasis} node
*   mdast node.
* @returns {Element}
*   hast node.
*/
function emphasis$1(state, node$1) {
	/** @type {Element} */
	const result = {
		type: "element",
		tagName: "em",
		properties: {},
		children: state.all(node$1)
	};
	state.patch(node$1, result);
	return state.applyData(node$1, result);
}

//#endregion
//#region node_modules/mdast-util-to-hast/lib/handlers/footnote-reference.js
/**
* Turn an mdast `footnoteReference` node into hast.
*
* @param {State} state
*   Info passed around.
* @param {FootnoteReference} node
*   mdast node.
* @returns {Element}
*   hast node.
*/
function footnoteReference$1(state, node$1) {
	const clobberPrefix = typeof state.options.clobberPrefix === "string" ? state.options.clobberPrefix : "user-content-";
	const id = String(node$1.identifier).toUpperCase();
	const safeId = normalizeUri(id.toLowerCase());
	const index$2 = state.footnoteOrder.indexOf(id);
	/** @type {number} */
	let counter;
	let reuseCounter = state.footnoteCounts.get(id);
	if (reuseCounter === void 0) {
		reuseCounter = 0;
		state.footnoteOrder.push(id);
		counter = state.footnoteOrder.length;
	} else counter = index$2 + 1;
	reuseCounter += 1;
	state.footnoteCounts.set(id, reuseCounter);
	/** @type {Element} */
	const link$2 = {
		type: "element",
		tagName: "a",
		properties: {
			href: "#" + clobberPrefix + "fn-" + safeId,
			id: clobberPrefix + "fnref-" + safeId + (reuseCounter > 1 ? "-" + reuseCounter : ""),
			dataFootnoteRef: true,
			ariaDescribedBy: ["footnote-label"]
		},
		children: [{
			type: "text",
			value: String(counter)
		}]
	};
	state.patch(node$1, link$2);
	/** @type {Element} */
	const sup = {
		type: "element",
		tagName: "sup",
		properties: {},
		children: [link$2]
	};
	state.patch(node$1, sup);
	return state.applyData(node$1, sup);
}

//#endregion
//#region node_modules/mdast-util-to-hast/lib/handlers/heading.js
/**
* @import {Element} from 'hast'
* @import {Heading} from 'mdast'
* @import {State} from '../state.js'
*/
/**
* Turn an mdast `heading` node into hast.
*
* @param {State} state
*   Info passed around.
* @param {Heading} node
*   mdast node.
* @returns {Element}
*   hast node.
*/
function heading$1(state, node$1) {
	/** @type {Element} */
	const result = {
		type: "element",
		tagName: "h" + node$1.depth,
		properties: {},
		children: state.all(node$1)
	};
	state.patch(node$1, result);
	return state.applyData(node$1, result);
}

//#endregion
//#region node_modules/mdast-util-to-hast/lib/handlers/html.js
/**
* @import {Element} from 'hast'
* @import {Html} from 'mdast'
* @import {State} from '../state.js'
* @import {Raw} from '../../index.js'
*/
/**
* Turn an mdast `html` node into hast (`raw` node in dangerous mode, otherwise
* nothing).
*
* @param {State} state
*   Info passed around.
* @param {Html} node
*   mdast node.
* @returns {Element | Raw | undefined}
*   hast node.
*/
function html$2(state, node$1) {
	if (state.options.allowDangerousHtml) {
		/** @type {Raw} */
		const result = {
			type: "raw",
			value: node$1.value
		};
		state.patch(node$1, result);
		return state.applyData(node$1, result);
	}
}

//#endregion
//#region node_modules/mdast-util-to-hast/lib/revert.js
/**
* @import {ElementContent} from 'hast'
* @import {Reference, Nodes} from 'mdast'
* @import {State} from './state.js'
*/
/**
* Return the content of a reference without definition as plain text.
*
* @param {State} state
*   Info passed around.
* @param {Extract<Nodes, Reference>} node
*   Reference node (image, link).
* @returns {Array<ElementContent>}
*   hast content.
*/
function revert(state, node$1) {
	const subtype = node$1.referenceType;
	let suffix = "]";
	if (subtype === "collapsed") suffix += "[]";
	else if (subtype === "full") suffix += "[" + (node$1.label || node$1.identifier) + "]";
	if (node$1.type === "imageReference") return [{
		type: "text",
		value: "![" + node$1.alt + suffix
	}];
	const contents = state.all(node$1);
	const head = contents[0];
	if (head && head.type === "text") head.value = "[" + head.value;
	else contents.unshift({
		type: "text",
		value: "["
	});
	const tail = contents[contents.length - 1];
	if (tail && tail.type === "text") tail.value += suffix;
	else contents.push({
		type: "text",
		value: suffix
	});
	return contents;
}

//#endregion
//#region node_modules/mdast-util-to-hast/lib/handlers/image-reference.js
/**
* Turn an mdast `imageReference` node into hast.
*
* @param {State} state
*   Info passed around.
* @param {ImageReference} node
*   mdast node.
* @returns {Array<ElementContent> | ElementContent}
*   hast node.
*/
function imageReference$1(state, node$1) {
	const id = String(node$1.identifier).toUpperCase();
	const definition$2 = state.definitionById.get(id);
	if (!definition$2) return revert(state, node$1);
	/** @type {Properties} */
	const properties$1 = {
		src: normalizeUri(definition$2.url || ""),
		alt: node$1.alt
	};
	if (definition$2.title !== null && definition$2.title !== void 0) properties$1.title = definition$2.title;
	/** @type {Element} */
	const result = {
		type: "element",
		tagName: "img",
		properties: properties$1,
		children: []
	};
	state.patch(node$1, result);
	return state.applyData(node$1, result);
}

//#endregion
//#region node_modules/mdast-util-to-hast/lib/handlers/image.js
/**
* Turn an mdast `image` node into hast.
*
* @param {State} state
*   Info passed around.
* @param {Image} node
*   mdast node.
* @returns {Element}
*   hast node.
*/
function image$1(state, node$1) {
	/** @type {Properties} */
	const properties$1 = { src: normalizeUri(node$1.url) };
	if (node$1.alt !== null && node$1.alt !== void 0) properties$1.alt = node$1.alt;
	if (node$1.title !== null && node$1.title !== void 0) properties$1.title = node$1.title;
	/** @type {Element} */
	const result = {
		type: "element",
		tagName: "img",
		properties: properties$1,
		children: []
	};
	state.patch(node$1, result);
	return state.applyData(node$1, result);
}

//#endregion
//#region node_modules/mdast-util-to-hast/lib/handlers/inline-code.js
/**
* @import {Element, Text} from 'hast'
* @import {InlineCode} from 'mdast'
* @import {State} from '../state.js'
*/
/**
* Turn an mdast `inlineCode` node into hast.
*
* @param {State} state
*   Info passed around.
* @param {InlineCode} node
*   mdast node.
* @returns {Element}
*   hast node.
*/
function inlineCode$1(state, node$1) {
	/** @type {Text} */
	const text$9 = {
		type: "text",
		value: node$1.value.replace(/\r?\n|\r/g, " ")
	};
	state.patch(node$1, text$9);
	/** @type {Element} */
	const result = {
		type: "element",
		tagName: "code",
		properties: {},
		children: [text$9]
	};
	state.patch(node$1, result);
	return state.applyData(node$1, result);
}

//#endregion
//#region node_modules/mdast-util-to-hast/lib/handlers/link-reference.js
/**
* Turn an mdast `linkReference` node into hast.
*
* @param {State} state
*   Info passed around.
* @param {LinkReference} node
*   mdast node.
* @returns {Array<ElementContent> | ElementContent}
*   hast node.
*/
function linkReference$1(state, node$1) {
	const id = String(node$1.identifier).toUpperCase();
	const definition$2 = state.definitionById.get(id);
	if (!definition$2) return revert(state, node$1);
	/** @type {Properties} */
	const properties$1 = { href: normalizeUri(definition$2.url || "") };
	if (definition$2.title !== null && definition$2.title !== void 0) properties$1.title = definition$2.title;
	/** @type {Element} */
	const result = {
		type: "element",
		tagName: "a",
		properties: properties$1,
		children: state.all(node$1)
	};
	state.patch(node$1, result);
	return state.applyData(node$1, result);
}

//#endregion
//#region node_modules/mdast-util-to-hast/lib/handlers/link.js
/**
* Turn an mdast `link` node into hast.
*
* @param {State} state
*   Info passed around.
* @param {Link} node
*   mdast node.
* @returns {Element}
*   hast node.
*/
function link$1(state, node$1) {
	/** @type {Properties} */
	const properties$1 = { href: normalizeUri(node$1.url) };
	if (node$1.title !== null && node$1.title !== void 0) properties$1.title = node$1.title;
	/** @type {Element} */
	const result = {
		type: "element",
		tagName: "a",
		properties: properties$1,
		children: state.all(node$1)
	};
	state.patch(node$1, result);
	return state.applyData(node$1, result);
}

//#endregion
//#region node_modules/mdast-util-to-hast/lib/handlers/list-item.js
/**
* @import {ElementContent, Element, Properties} from 'hast'
* @import {ListItem, Parents} from 'mdast'
* @import {State} from '../state.js'
*/
/**
* Turn an mdast `listItem` node into hast.
*
* @param {State} state
*   Info passed around.
* @param {ListItem} node
*   mdast node.
* @param {Parents | undefined} parent
*   Parent of `node`.
* @returns {Element}
*   hast node.
*/
function listItem$1(state, node$1, parent) {
	const results = state.all(node$1);
	const loose = parent ? listLoose(parent) : listItemLoose(node$1);
	/** @type {Properties} */
	const properties$1 = {};
	/** @type {Array<ElementContent>} */
	const children$1 = [];
	if (typeof node$1.checked === "boolean") {
		const head = results[0];
		/** @type {Element} */
		let paragraph$2;
		if (head && head.type === "element" && head.tagName === "p") paragraph$2 = head;
		else {
			paragraph$2 = {
				type: "element",
				tagName: "p",
				properties: {},
				children: []
			};
			results.unshift(paragraph$2);
		}
		if (paragraph$2.children.length > 0) paragraph$2.children.unshift({
			type: "text",
			value: " "
		});
		paragraph$2.children.unshift({
			type: "element",
			tagName: "input",
			properties: {
				type: "checkbox",
				checked: node$1.checked,
				disabled: true
			},
			children: []
		});
		properties$1.className = ["task-list-item"];
	}
	let index$2 = -1;
	while (++index$2 < results.length) {
		const child = results[index$2];
		if (loose || index$2 !== 0 || child.type !== "element" || child.tagName !== "p") children$1.push({
			type: "text",
			value: "\n"
		});
		if (child.type === "element" && child.tagName === "p" && !loose) children$1.push(...child.children);
		else children$1.push(child);
	}
	const tail = results[results.length - 1];
	if (tail && (loose || tail.type !== "element" || tail.tagName !== "p")) children$1.push({
		type: "text",
		value: "\n"
	});
	/** @type {Element} */
	const result = {
		type: "element",
		tagName: "li",
		properties: properties$1,
		children: children$1
	};
	state.patch(node$1, result);
	return state.applyData(node$1, result);
}
/**
* @param {Parents} node
* @return {Boolean}
*/
function listLoose(node$1) {
	let loose = false;
	if (node$1.type === "list") {
		loose = node$1.spread || false;
		const children$1 = node$1.children;
		let index$2 = -1;
		while (!loose && ++index$2 < children$1.length) loose = listItemLoose(children$1[index$2]);
	}
	return loose;
}
/**
* @param {ListItem} node
* @return {Boolean}
*/
function listItemLoose(node$1) {
	const spread = node$1.spread;
	return spread === null || spread === void 0 ? node$1.children.length > 1 : spread;
}

//#endregion
//#region node_modules/mdast-util-to-hast/lib/handlers/list.js
/**
* @import {Element, Properties} from 'hast'
* @import {List} from 'mdast'
* @import {State} from '../state.js'
*/
/**
* Turn an mdast `list` node into hast.
*
* @param {State} state
*   Info passed around.
* @param {List} node
*   mdast node.
* @returns {Element}
*   hast node.
*/
function list$1(state, node$1) {
	/** @type {Properties} */
	const properties$1 = {};
	const results = state.all(node$1);
	let index$2 = -1;
	if (typeof node$1.start === "number" && node$1.start !== 1) properties$1.start = node$1.start;
	while (++index$2 < results.length) {
		const child = results[index$2];
		if (child.type === "element" && child.tagName === "li" && child.properties && Array.isArray(child.properties.className) && child.properties.className.includes("task-list-item")) {
			properties$1.className = ["contains-task-list"];
			break;
		}
	}
	/** @type {Element} */
	const result = {
		type: "element",
		tagName: node$1.ordered ? "ol" : "ul",
		properties: properties$1,
		children: state.wrap(results, true)
	};
	state.patch(node$1, result);
	return state.applyData(node$1, result);
}

//#endregion
//#region node_modules/mdast-util-to-hast/lib/handlers/paragraph.js
/**
* @import {Element} from 'hast'
* @import {Paragraph} from 'mdast'
* @import {State} from '../state.js'
*/
/**
* Turn an mdast `paragraph` node into hast.
*
* @param {State} state
*   Info passed around.
* @param {Paragraph} node
*   mdast node.
* @returns {Element}
*   hast node.
*/
function paragraph$1(state, node$1) {
	/** @type {Element} */
	const result = {
		type: "element",
		tagName: "p",
		properties: {},
		children: state.all(node$1)
	};
	state.patch(node$1, result);
	return state.applyData(node$1, result);
}

//#endregion
//#region node_modules/mdast-util-to-hast/lib/handlers/root.js
/**
* @import {Parents as HastParents, Root as HastRoot} from 'hast'
* @import {Root as MdastRoot} from 'mdast'
* @import {State} from '../state.js'
*/
/**
* Turn an mdast `root` node into hast.
*
* @param {State} state
*   Info passed around.
* @param {MdastRoot} node
*   mdast node.
* @returns {HastParents}
*   hast node.
*/
function root$4(state, node$1) {
	/** @type {HastRoot} */
	const result = {
		type: "root",
		children: state.wrap(state.all(node$1))
	};
	state.patch(node$1, result);
	return state.applyData(node$1, result);
}

//#endregion
//#region node_modules/mdast-util-to-hast/lib/handlers/strong.js
/**
* @import {Element} from 'hast'
* @import {Strong} from 'mdast'
* @import {State} from '../state.js'
*/
/**
* Turn an mdast `strong` node into hast.
*
* @param {State} state
*   Info passed around.
* @param {Strong} node
*   mdast node.
* @returns {Element}
*   hast node.
*/
function strong$1(state, node$1) {
	/** @type {Element} */
	const result = {
		type: "element",
		tagName: "strong",
		properties: {},
		children: state.all(node$1)
	};
	state.patch(node$1, result);
	return state.applyData(node$1, result);
}

//#endregion
//#region node_modules/mdast-util-to-hast/lib/handlers/table.js
/**
* Turn an mdast `table` node into hast.
*
* @param {State} state
*   Info passed around.
* @param {Table} node
*   mdast node.
* @returns {Element}
*   hast node.
*/
function table(state, node$1) {
	const rows = state.all(node$1);
	const firstRow = rows.shift();
	/** @type {Array<Element>} */
	const tableContent = [];
	if (firstRow) {
		/** @type {Element} */
		const head = {
			type: "element",
			tagName: "thead",
			properties: {},
			children: state.wrap([firstRow], true)
		};
		state.patch(node$1.children[0], head);
		tableContent.push(head);
	}
	if (rows.length > 0) {
		/** @type {Element} */
		const body = {
			type: "element",
			tagName: "tbody",
			properties: {},
			children: state.wrap(rows, true)
		};
		const start = pointStart(node$1.children[1]);
		const end = pointEnd(node$1.children[node$1.children.length - 1]);
		if (start && end) body.position = {
			start,
			end
		};
		tableContent.push(body);
	}
	/** @type {Element} */
	const result = {
		type: "element",
		tagName: "table",
		properties: {},
		children: state.wrap(tableContent, true)
	};
	state.patch(node$1, result);
	return state.applyData(node$1, result);
}

//#endregion
//#region node_modules/mdast-util-to-hast/lib/handlers/table-row.js
/**
* @import {Element, ElementContent, Properties} from 'hast'
* @import {Parents, TableRow} from 'mdast'
* @import {State} from '../state.js'
*/
/**
* Turn an mdast `tableRow` node into hast.
*
* @param {State} state
*   Info passed around.
* @param {TableRow} node
*   mdast node.
* @param {Parents | undefined} parent
*   Parent of `node`.
* @returns {Element}
*   hast node.
*/
function tableRow(state, node$1, parent) {
	const siblings = parent ? parent.children : void 0;
	const tagName = (siblings ? siblings.indexOf(node$1) : 1) === 0 ? "th" : "td";
	const align = parent && parent.type === "table" ? parent.align : void 0;
	const length = align ? align.length : node$1.children.length;
	let cellIndex = -1;
	/** @type {Array<ElementContent>} */
	const cells = [];
	while (++cellIndex < length) {
		const cell = node$1.children[cellIndex];
		/** @type {Properties} */
		const properties$1 = {};
		const alignValue = align ? align[cellIndex] : void 0;
		if (alignValue) properties$1.align = alignValue;
		/** @type {Element} */
		let result$1 = {
			type: "element",
			tagName,
			properties: properties$1,
			children: []
		};
		if (cell) {
			result$1.children = state.all(cell);
			state.patch(cell, result$1);
			result$1 = state.applyData(cell, result$1);
		}
		cells.push(result$1);
	}
	/** @type {Element} */
	const result = {
		type: "element",
		tagName: "tr",
		properties: {},
		children: state.wrap(cells, true)
	};
	state.patch(node$1, result);
	return state.applyData(node$1, result);
}

//#endregion
//#region node_modules/mdast-util-to-hast/lib/handlers/table-cell.js
/**
* @import {Element} from 'hast'
* @import {TableCell} from 'mdast'
* @import {State} from '../state.js'
*/
/**
* Turn an mdast `tableCell` node into hast.
*
* @param {State} state
*   Info passed around.
* @param {TableCell} node
*   mdast node.
* @returns {Element}
*   hast node.
*/
function tableCell(state, node$1) {
	/** @type {Element} */
	const result = {
		type: "element",
		tagName: "td",
		properties: {},
		children: state.all(node$1)
	};
	state.patch(node$1, result);
	return state.applyData(node$1, result);
}

//#endregion
//#region node_modules/trim-lines/index.js
const tab = 9;
const space = 32;
/**
* Remove initial and final spaces and tabs at the line breaks in `value`.
* Does not trim initial and final spaces and tabs of the value itself.
*
* @param {string} value
*   Value to trim.
* @returns {string}
*   Trimmed value.
*/
function trimLines(value) {
	const source = String(value);
	const search$2 = /\r?\n|\r/g;
	let match = search$2.exec(source);
	let last = 0;
	/** @type {Array<string>} */
	const lines = [];
	while (match) {
		lines.push(trimLine(source.slice(last, match.index), last > 0, true), match[0]);
		last = match.index + match[0].length;
		match = search$2.exec(source);
	}
	lines.push(trimLine(source.slice(last), last > 0, false));
	return lines.join("");
}
/**
* @param {string} value
*   Line to trim.
* @param {boolean} start
*   Whether to trim the start of the line.
* @param {boolean} end
*   Whether to trim the end of the line.
* @returns {string}
*   Trimmed line.
*/
function trimLine(value, start, end) {
	let startIndex = 0;
	let endIndex = value.length;
	if (start) {
		let code$3 = value.codePointAt(startIndex);
		while (code$3 === tab || code$3 === space) {
			startIndex++;
			code$3 = value.codePointAt(startIndex);
		}
	}
	if (end) {
		let code$3 = value.codePointAt(endIndex - 1);
		while (code$3 === tab || code$3 === space) {
			endIndex--;
			code$3 = value.codePointAt(endIndex - 1);
		}
	}
	return endIndex > startIndex ? value.slice(startIndex, endIndex) : "";
}

//#endregion
//#region node_modules/mdast-util-to-hast/lib/handlers/text.js
/**
* Turn an mdast `text` node into hast.
*
* @param {State} state
*   Info passed around.
* @param {MdastText} node
*   mdast node.
* @returns {HastElement | HastText}
*   hast node.
*/
function text$5(state, node$1) {
	/** @type {HastText} */
	const result = {
		type: "text",
		value: trimLines(String(node$1.value))
	};
	state.patch(node$1, result);
	return state.applyData(node$1, result);
}

//#endregion
//#region node_modules/mdast-util-to-hast/lib/handlers/thematic-break.js
/**
* @import {Element} from 'hast'
* @import {ThematicBreak} from 'mdast'
* @import {State} from '../state.js'
*/
/**
* Turn an mdast `thematicBreak` node into hast.
*
* @param {State} state
*   Info passed around.
* @param {ThematicBreak} node
*   mdast node.
* @returns {Element}
*   hast node.
*/
function thematicBreak$1(state, node$1) {
	/** @type {Element} */
	const result = {
		type: "element",
		tagName: "hr",
		properties: {},
		children: []
	};
	state.patch(node$1, result);
	return state.applyData(node$1, result);
}

//#endregion
//#region node_modules/mdast-util-to-hast/lib/handlers/index.js
/**
* Default handlers for nodes.
*
* @satisfies {Handlers}
*/
const handlers = {
	blockquote: blockquote$1,
	break: hardBreak$1,
	code: code$2,
	delete: strikethrough,
	emphasis: emphasis$1,
	footnoteReference: footnoteReference$1,
	heading: heading$1,
	html: html$2,
	imageReference: imageReference$1,
	image: image$1,
	inlineCode: inlineCode$1,
	linkReference: linkReference$1,
	link: link$1,
	listItem: listItem$1,
	list: list$1,
	paragraph: paragraph$1,
	root: root$4,
	strong: strong$1,
	table,
	tableCell,
	tableRow,
	text: text$5,
	thematicBreak: thematicBreak$1,
	toml: ignore,
	yaml: ignore,
	definition: ignore,
	footnoteDefinition: ignore
};
function ignore() {}

//#endregion
//#region node_modules/@ungap/structured-clone/esm/types.js
const VOID = -1;
const PRIMITIVE = 0;
const ARRAY = 1;
const OBJECT = 2;
const DATE = 3;
const REGEXP = 4;
const MAP = 5;
const SET = 6;
const ERROR = 7;
const BIGINT = 8;

//#endregion
//#region node_modules/@ungap/structured-clone/esm/deserialize.js
const env = typeof self === "object" ? self : globalThis;
const guard = (name$1, init) => {
	switch (name$1) {
		case "Function":
		case "SharedWorker":
		case "Worker":
		case "eval":
		case "setInterval":
		case "setTimeout": throw new TypeError("unable to deserialize " + name$1);
	}
	return new env[name$1](init);
};
const deserializer = ($$1, _) => {
	const as = (out, index$2) => {
		$$1.set(index$2, out);
		return out;
	};
	const unpair = (index$2) => {
		if ($$1.has(index$2)) return $$1.get(index$2);
		const [type, value] = _[index$2];
		switch (type) {
			case PRIMITIVE:
			case VOID: return as(value, index$2);
			case ARRAY: {
				const arr = as([], index$2);
				for (const index$3 of value) arr.push(unpair(index$3));
				return arr;
			}
			case OBJECT: {
				const object = as({}, index$2);
				for (const [key, index$3] of value) object[unpair(key)] = unpair(index$3);
				return object;
			}
			case DATE: return as(new Date(value), index$2);
			case REGEXP: {
				const { source, flags } = value;
				return as(new RegExp(source, flags), index$2);
			}
			case MAP: {
				const map$2 = as(/* @__PURE__ */ new Map(), index$2);
				for (const [key, index$3] of value) map$2.set(unpair(key), unpair(index$3));
				return map$2;
			}
			case SET: {
				const set = as(/* @__PURE__ */ new Set(), index$2);
				for (const index$3 of value) set.add(unpair(index$3));
				return set;
			}
			case ERROR: {
				const { name: name$1, message } = value;
				return as(typeof env[name$1] === "function" ? guard(name$1, message) : new Error(message), index$2);
			}
			case BIGINT: return as(BigInt(value), index$2);
			case "BigInt": return as(Object(BigInt(value)), index$2);
			case "ArrayBuffer": return as(new Uint8Array(value).buffer, value);
			case "DataView": {
				const { buffer } = new Uint8Array(value);
				return as(new DataView(buffer), value);
			}
		}
		return as(guard(type, value), index$2);
	};
	return unpair;
};
/**
* @typedef {Array<string,any>} Record a type representation
*/
/**
* Returns a deserialized value from a serialized array of Records.
* @param {Record[]} serialized a previously serialized value.
* @returns {any}
*/
const deserialize = (serialized) => deserializer(/* @__PURE__ */ new Map(), serialized)(0);

//#endregion
//#region node_modules/@ungap/structured-clone/esm/serialize.js
const EMPTY = "";
const { toString: toString$1 } = {};
const { keys } = Object;
const typeOf = (value) => {
	const type = typeof value;
	if (type !== "object" || !value) return [PRIMITIVE, type];
	const asString = toString$1.call(value).slice(8, -1);
	switch (asString) {
		case "Array": return [ARRAY, EMPTY];
		case "Object": return [OBJECT, EMPTY];
		case "Date": return [DATE, EMPTY];
		case "RegExp": return [REGEXP, EMPTY];
		case "Map": return [MAP, EMPTY];
		case "Set": return [SET, EMPTY];
		case "DataView": return [ARRAY, asString];
	}
	if (asString.includes("Array")) return [ARRAY, asString];
	if (value instanceof Error) return [ERROR, value.name || "Error"];
	return [OBJECT, asString];
};
const shouldSkip = ([TYPE, type]) => TYPE === PRIMITIVE && (type === "function" || type === "symbol");
const serializer = (strict, json, $$1, _) => {
	const as = (out, value) => {
		const index$2 = _.push(out) - 1;
		$$1.set(value, index$2);
		return index$2;
	};
	const pair = (value) => {
		if ($$1.has(value)) return $$1.get(value);
		let [TYPE, type] = typeOf(value);
		switch (TYPE) {
			case PRIMITIVE: {
				let entry = value;
				switch (type) {
					case "bigint":
						TYPE = BIGINT;
						entry = value.toString();
						break;
					case "function":
					case "symbol":
						if (strict) throw new TypeError("unable to serialize " + type);
						entry = null;
						break;
					case "undefined": return as([VOID], value);
				}
				return as([TYPE, entry], value);
			}
			case ARRAY: {
				if (type) {
					let spread = value;
					if (type === "DataView") spread = new Uint8Array(value.buffer);
					else if (type === "ArrayBuffer") spread = new Uint8Array(value);
					return as([type, [...spread]], value);
				}
				const arr = [];
				const index$2 = as([TYPE, arr], value);
				for (const entry of value) arr.push(pair(entry));
				return index$2;
			}
			case OBJECT: {
				if (type) switch (type) {
					case "BigInt": return as([type, value.toString()], value);
					case "Boolean":
					case "Number":
					case "String": return as([type, value.valueOf()], value);
				}
				if (json && "toJSON" in value) return pair(value.toJSON());
				const entries = [];
				const index$2 = as([TYPE, entries], value);
				for (const key of keys(value)) if (strict || !shouldSkip(typeOf(value[key]))) entries.push([pair(key), pair(value[key])]);
				return index$2;
			}
			case DATE: return as([TYPE, isNaN(value.getTime()) ? EMPTY : value.toISOString()], value);
			case REGEXP: {
				const { source, flags } = value;
				return as([TYPE, {
					source,
					flags
				}], value);
			}
			case MAP: {
				const entries = [];
				const index$2 = as([TYPE, entries], value);
				for (const [key, entry] of value) if (strict || !(shouldSkip(typeOf(key)) || shouldSkip(typeOf(entry)))) entries.push([pair(key), pair(entry)]);
				return index$2;
			}
			case SET: {
				const entries = [];
				const index$2 = as([TYPE, entries], value);
				for (const entry of value) if (strict || !shouldSkip(typeOf(entry))) entries.push(pair(entry));
				return index$2;
			}
		}
		const { message } = value;
		return as([TYPE, {
			name: type,
			message
		}], value);
	};
	return pair;
};
/**
* @typedef {Array<string,any>} Record a type representation
*/
/**
* Returns an array of serialized Records.
* @param {any} value a serializable value.
* @param {{json?: boolean, lossy?: boolean}?} options an object with a `lossy` or `json` property that,
*  if `true`, will not throw errors on incompatible types, and behave more
*  like JSON stringify would behave. Symbol and Function will be discarded.
* @returns {Record[]}
*/
const serialize$1 = (value, { json, lossy } = {}) => {
	const _ = [];
	return serializer(!(json || lossy), !!json, /* @__PURE__ */ new Map(), _)(value), _;
};

//#endregion
//#region node_modules/@ungap/structured-clone/esm/index.js
/**
* @typedef {Array<string,any>} Record a type representation
*/
/**
* Returns an array of serialized Records.
* @param {any} any a serializable value.
* @param {{transfer?: any[], json?: boolean, lossy?: boolean}?} options an object with
* a transfer option (ignored when polyfilled) and/or non standard fields that
* fallback to the polyfill if present.
* @returns {Record[]}
*/
var esm_default = typeof structuredClone === "function" ? (any, options) => options && ("json" in options || "lossy" in options) ? deserialize(serialize$1(any, options)) : structuredClone(any) : (any, options) => deserialize(serialize$1(any, options));

//#endregion
//#region node_modules/mdast-util-to-hast/lib/footer.js
/**
* Generate the default content that GitHub uses on backreferences.
*
* @param {number} _
*   Index of the definition in the order that they are first referenced,
*   0-indexed.
* @param {number} rereferenceIndex
*   Index of calls to the same definition, 0-indexed.
* @returns {Array<ElementContent>}
*   Content.
*/
function defaultFootnoteBackContent(_, rereferenceIndex) {
	/** @type {Array<ElementContent>} */
	const result = [{
		type: "text",
		value: "↩"
	}];
	if (rereferenceIndex > 1) result.push({
		type: "element",
		tagName: "sup",
		properties: {},
		children: [{
			type: "text",
			value: String(rereferenceIndex)
		}]
	});
	return result;
}
/**
* Generate the default label that GitHub uses on backreferences.
*
* @param {number} referenceIndex
*   Index of the definition in the order that they are first referenced,
*   0-indexed.
* @param {number} rereferenceIndex
*   Index of calls to the same definition, 0-indexed.
* @returns {string}
*   Label.
*/
function defaultFootnoteBackLabel(referenceIndex, rereferenceIndex) {
	return "Back to reference " + (referenceIndex + 1) + (rereferenceIndex > 1 ? "-" + rereferenceIndex : "");
}
/**
* Generate a hast footer for called footnote definitions.
*
* @param {State} state
*   Info passed around.
* @returns {Element | undefined}
*   `section` element or `undefined`.
*/
function footer(state) {
	const clobberPrefix = typeof state.options.clobberPrefix === "string" ? state.options.clobberPrefix : "user-content-";
	const footnoteBackContent = state.options.footnoteBackContent || defaultFootnoteBackContent;
	const footnoteBackLabel = state.options.footnoteBackLabel || defaultFootnoteBackLabel;
	const footnoteLabel = state.options.footnoteLabel || "Footnotes";
	const footnoteLabelTagName = state.options.footnoteLabelTagName || "h2";
	const footnoteLabelProperties = state.options.footnoteLabelProperties || { className: ["sr-only"] };
	/** @type {Array<ElementContent>} */
	const listItems = [];
	let referenceIndex = -1;
	while (++referenceIndex < state.footnoteOrder.length) {
		const definition$2 = state.footnoteById.get(state.footnoteOrder[referenceIndex]);
		if (!definition$2) continue;
		const content$2 = state.all(definition$2);
		const id = String(definition$2.identifier).toUpperCase();
		const safeId = normalizeUri(id.toLowerCase());
		let rereferenceIndex = 0;
		/** @type {Array<ElementContent>} */
		const backReferences = [];
		const counts = state.footnoteCounts.get(id);
		while (counts !== void 0 && ++rereferenceIndex <= counts) {
			if (backReferences.length > 0) backReferences.push({
				type: "text",
				value: " "
			});
			let children$1 = typeof footnoteBackContent === "string" ? footnoteBackContent : footnoteBackContent(referenceIndex, rereferenceIndex);
			if (typeof children$1 === "string") children$1 = {
				type: "text",
				value: children$1
			};
			backReferences.push({
				type: "element",
				tagName: "a",
				properties: {
					href: "#" + clobberPrefix + "fnref-" + safeId + (rereferenceIndex > 1 ? "-" + rereferenceIndex : ""),
					dataFootnoteBackref: "",
					ariaLabel: typeof footnoteBackLabel === "string" ? footnoteBackLabel : footnoteBackLabel(referenceIndex, rereferenceIndex),
					className: ["data-footnote-backref"]
				},
				children: Array.isArray(children$1) ? children$1 : [children$1]
			});
		}
		const tail = content$2[content$2.length - 1];
		if (tail && tail.type === "element" && tail.tagName === "p") {
			const tailTail = tail.children[tail.children.length - 1];
			if (tailTail && tailTail.type === "text") tailTail.value += " ";
			else tail.children.push({
				type: "text",
				value: " "
			});
			tail.children.push(...backReferences);
		} else content$2.push(...backReferences);
		/** @type {Element} */
		const listItem$2 = {
			type: "element",
			tagName: "li",
			properties: { id: clobberPrefix + "fn-" + safeId },
			children: state.wrap(content$2, true)
		};
		state.patch(definition$2, listItem$2);
		listItems.push(listItem$2);
	}
	if (listItems.length === 0) return;
	return {
		type: "element",
		tagName: "section",
		properties: {
			dataFootnotes: true,
			className: ["footnotes"]
		},
		children: [
			{
				type: "element",
				tagName: footnoteLabelTagName,
				properties: {
					...esm_default(footnoteLabelProperties),
					id: "footnote-label"
				},
				children: [{
					type: "text",
					value: footnoteLabel
				}]
			},
			{
				type: "text",
				value: "\n"
			},
			{
				type: "element",
				tagName: "ol",
				properties: {},
				children: state.wrap(listItems, true)
			},
			{
				type: "text",
				value: "\n"
			}
		]
	};
}

//#endregion
//#region node_modules/unist-util-is/lib/index.js
/**
* Generate an assertion from a test.
*
* Useful if you’re going to test many nodes, for example when creating a
* utility where something else passes a compatible test.
*
* The created function is a bit faster because it expects valid input only:
* a `node`, `index`, and `parent`.
*
* @param {Test} test
*   *   when nullish, checks if `node` is a `Node`.
*   *   when `string`, works like passing `(node) => node.type === test`.
*   *   when `function` checks if function passed the node is true.
*   *   when `object`, checks that all keys in test are in node, and that they have (strictly) equal values.
*   *   when `array`, checks if any one of the subtests pass.
* @returns {Check}
*   An assertion.
*/
const convert = (function(test) {
	if (test === null || test === void 0) return ok$1;
	if (typeof test === "function") return castFactory(test);
	if (typeof test === "object") return Array.isArray(test) ? anyFactory(test) : propertiesFactory(test);
	if (typeof test === "string") return typeFactory(test);
	throw new Error("Expected function, string, or object as test");
});
/**
* @param {Array<Props | TestFunction | string>} tests
* @returns {Check}
*/
function anyFactory(tests) {
	/** @type {Array<Check>} */
	const checks$1 = [];
	let index$2 = -1;
	while (++index$2 < tests.length) checks$1[index$2] = convert(tests[index$2]);
	return castFactory(any);
	/**
	* @this {unknown}
	* @type {TestFunction}
	*/
	function any(...parameters) {
		let index$3 = -1;
		while (++index$3 < checks$1.length) if (checks$1[index$3].apply(this, parameters)) return true;
		return false;
	}
}
/**
* Turn an object into a test for a node with a certain fields.
*
* @param {Props} check
* @returns {Check}
*/
function propertiesFactory(check) {
	const checkAsRecord = check;
	return castFactory(all$4);
	/**
	* @param {Node} node
	* @returns {boolean}
	*/
	function all$4(node$1) {
		const nodeAsRecord = node$1;
		/** @type {string} */
		let key;
		for (key in check) if (nodeAsRecord[key] !== checkAsRecord[key]) return false;
		return true;
	}
}
/**
* Turn a string into a test for a node with a certain type.
*
* @param {string} check
* @returns {Check}
*/
function typeFactory(check) {
	return castFactory(type);
	/**
	* @param {Node} node
	*/
	function type(node$1) {
		return node$1 && node$1.type === check;
	}
}
/**
* Turn a custom test into a test for a node that passes that test.
*
* @param {TestFunction} testFunction
* @returns {Check}
*/
function castFactory(testFunction) {
	return check;
	/**
	* @this {unknown}
	* @type {Check}
	*/
	function check(value, index$2, parent) {
		return Boolean(looksLikeANode(value) && testFunction.call(this, value, typeof index$2 === "number" ? index$2 : void 0, parent || void 0));
	}
}
function ok$1() {
	return true;
}
/**
* @param {unknown} value
* @returns {value is Node}
*/
function looksLikeANode(value) {
	return value !== null && typeof value === "object" && "type" in value;
}

//#endregion
//#region node_modules/unist-util-visit-parents/lib/color.node.js
/**
* @param {string} d
* @returns {string}
*/
function color(d) {
	return "\x1B[33m" + d + "\x1B[39m";
}

//#endregion
//#region node_modules/unist-util-visit-parents/lib/index.js
/** @type {Readonly<ActionTuple>} */
const empty = [];
/**
* Continue traversing as normal.
*/
const CONTINUE = true;
/**
* Stop traversing immediately.
*/
const EXIT = false;
/**
* Do not traverse this node’s children.
*/
const SKIP = "skip";
/**
* Visit nodes, with ancestral information.
*
* This algorithm performs *depth-first* *tree traversal* in *preorder*
* (**NLR**) or if `reverse` is given, in *reverse preorder* (**NRL**).
*
* You can choose for which nodes `visitor` is called by passing a `test`.
* For complex tests, you should test yourself in `visitor`, as it will be
* faster and will have improved type information.
*
* Walking the tree is an intensive task.
* Make use of the return values of the visitor when possible.
* Instead of walking a tree multiple times, walk it once, use `unist-util-is`
* to check if a node matches, and then perform different operations.
*
* You can change the tree.
* See `Visitor` for more info.
*
* @overload
* @param {Tree} tree
* @param {Check} check
* @param {BuildVisitor<Tree, Check>} visitor
* @param {boolean | null | undefined} [reverse]
* @returns {undefined}
*
* @overload
* @param {Tree} tree
* @param {BuildVisitor<Tree>} visitor
* @param {boolean | null | undefined} [reverse]
* @returns {undefined}
*
* @param {UnistNode} tree
*   Tree to traverse.
* @param {Visitor | Test} test
*   `unist-util-is`-compatible test
* @param {Visitor | boolean | null | undefined} [visitor]
*   Handle each node.
* @param {boolean | null | undefined} [reverse]
*   Traverse in reverse preorder (NRL) instead of the default preorder (NLR).
* @returns {undefined}
*   Nothing.
*
* @template {UnistNode} Tree
*   Node type.
* @template {Test} Check
*   `unist-util-is`-compatible test.
*/
function visitParents(tree, test, visitor, reverse) {
	/** @type {Test} */
	let check;
	if (typeof test === "function" && typeof visitor !== "function") {
		reverse = visitor;
		visitor = test;
	} else check = test;
	const is = convert(check);
	const step = reverse ? -1 : 1;
	factory(tree, void 0, [])();
	/**
	* @param {UnistNode} node
	* @param {number | undefined} index
	* @param {Array<UnistParent>} parents
	*/
	function factory(node$1, index$2, parents) {
		const value = node$1 && typeof node$1 === "object" ? node$1 : {};
		if (typeof value.type === "string") {
			const name$1 = typeof value.tagName === "string" ? value.tagName : typeof value.name === "string" ? value.name : void 0;
			Object.defineProperty(visit$1, "name", { value: "node (" + color(node$1.type + (name$1 ? "<" + name$1 + ">" : "")) + ")" });
		}
		return visit$1;
		function visit$1() {
			/** @type {Readonly<ActionTuple>} */
			let result = empty;
			/** @type {Readonly<ActionTuple>} */
			let subresult;
			/** @type {number} */
			let offset;
			/** @type {Array<UnistParent>} */
			let grandparents;
			if (!test || is(node$1, index$2, parents[parents.length - 1] || void 0)) {
				result = toResult(visitor(node$1, parents));
				if (result[0] === EXIT) return result;
			}
			if ("children" in node$1 && node$1.children) {
				const nodeAsParent = node$1;
				if (nodeAsParent.children && result[0] !== SKIP) {
					offset = (reverse ? nodeAsParent.children.length : -1) + step;
					grandparents = parents.concat(nodeAsParent);
					while (offset > -1 && offset < nodeAsParent.children.length) {
						const child = nodeAsParent.children[offset];
						subresult = factory(child, offset, grandparents)();
						if (subresult[0] === EXIT) return subresult;
						offset = typeof subresult[1] === "number" ? subresult[1] : offset + step;
					}
				}
			}
			return result;
		}
	}
}
/**
* Turn a return value into a clean result.
*
* @param {VisitorResult} value
*   Valid return values from visitors.
* @returns {Readonly<ActionTuple>}
*   Clean result.
*/
function toResult(value) {
	if (Array.isArray(value)) return value;
	if (typeof value === "number") return [CONTINUE, value];
	return value === null || value === void 0 ? empty : [value];
}

//#endregion
//#region node_modules/unist-util-visit/lib/index.js
/**
* Visit nodes.
*
* This algorithm performs *depth-first* *tree traversal* in *preorder*
* (**NLR**) or if `reverse` is given, in *reverse preorder* (**NRL**).
*
* You can choose for which nodes `visitor` is called by passing a `test`.
* For complex tests, you should test yourself in `visitor`, as it will be
* faster and will have improved type information.
*
* Walking the tree is an intensive task.
* Make use of the return values of the visitor when possible.
* Instead of walking a tree multiple times, walk it once, use `unist-util-is`
* to check if a node matches, and then perform different operations.
*
* You can change the tree.
* See `Visitor` for more info.
*
* @overload
* @param {Tree} tree
* @param {Check} check
* @param {BuildVisitor<Tree, Check>} visitor
* @param {boolean | null | undefined} [reverse]
* @returns {undefined}
*
* @overload
* @param {Tree} tree
* @param {BuildVisitor<Tree>} visitor
* @param {boolean | null | undefined} [reverse]
* @returns {undefined}
*
* @param {UnistNode} tree
*   Tree to traverse.
* @param {Visitor | Test} testOrVisitor
*   `unist-util-is`-compatible test (optional, omit to pass a visitor).
* @param {Visitor | boolean | null | undefined} [visitorOrReverse]
*   Handle each node (when test is omitted, pass `reverse`).
* @param {boolean | null | undefined} [maybeReverse=false]
*   Traverse in reverse preorder (NRL) instead of the default preorder (NLR).
* @returns {undefined}
*   Nothing.
*
* @template {UnistNode} Tree
*   Node type.
* @template {Test} Check
*   `unist-util-is`-compatible test.
*/
function visit(tree, testOrVisitor, visitorOrReverse, maybeReverse) {
	/** @type {boolean | null | undefined} */
	let reverse;
	/** @type {Test} */
	let test;
	/** @type {Visitor} */
	let visitor;
	if (typeof testOrVisitor === "function" && typeof visitorOrReverse !== "function") {
		test = void 0;
		visitor = testOrVisitor;
		reverse = visitorOrReverse;
	} else {
		test = testOrVisitor;
		visitor = visitorOrReverse;
		reverse = maybeReverse;
	}
	visitParents(tree, test, overload, reverse);
	/**
	* @param {UnistNode} node
	* @param {Array<UnistParent>} parents
	*/
	function overload(node$1, parents) {
		const parent = parents[parents.length - 1];
		const index$2 = parent ? parent.children.indexOf(node$1) : void 0;
		return visitor(node$1, index$2, parent);
	}
}

//#endregion
//#region node_modules/mdast-util-to-hast/lib/state.js
const own$5 = {}.hasOwnProperty;
/** @type {Options} */
const emptyOptions$2 = {};
/**
* Create `state` from an mdast tree.
*
* @param {MdastNodes} tree
*   mdast node to transform.
* @param {Options | null | undefined} [options]
*   Configuration (optional).
* @returns {State}
*   `state` function.
*/
function createState(tree, options) {
	const settings = options || emptyOptions$2;
	/** @type {Map<string, MdastDefinition>} */
	const definitionById = /* @__PURE__ */ new Map();
	/** @type {Map<string, MdastFootnoteDefinition>} */
	const footnoteById = /* @__PURE__ */ new Map();
	/** @type {State} */
	const state = {
		all: all$4,
		applyData,
		definitionById,
		footnoteById,
		footnoteCounts: /* @__PURE__ */ new Map(),
		footnoteOrder: [],
		handlers: {
			...handlers,
			...settings.handlers
		},
		one: one$4,
		options: settings,
		patch: patch$3,
		wrap: wrap$1
	};
	visit(tree, function(node$1) {
		if (node$1.type === "definition" || node$1.type === "footnoteDefinition") {
			const map$2 = node$1.type === "definition" ? definitionById : footnoteById;
			const id = String(node$1.identifier).toUpperCase();
			if (!map$2.has(id)) map$2.set(id, node$1);
		}
	});
	return state;
	/**
	* Transform an mdast node into a hast node.
	*
	* @param {MdastNodes} node
	*   mdast node.
	* @param {MdastParents | undefined} [parent]
	*   Parent of `node`.
	* @returns {Array<HastElementContent> | HastElementContent | undefined}
	*   Resulting hast node.
	*/
	function one$4(node$1, parent) {
		const type = node$1.type;
		const handle$1 = state.handlers[type];
		if (own$5.call(state.handlers, type) && handle$1) return handle$1(state, node$1, parent);
		if (state.options.passThrough && state.options.passThrough.includes(type)) {
			if ("children" in node$1) {
				const { children: children$1,...shallow } = node$1;
				const result = esm_default(shallow);
				result.children = state.all(node$1);
				return result;
			}
			return esm_default(node$1);
		}
		return (state.options.unknownHandler || defaultUnknownHandler)(state, node$1, parent);
	}
	/**
	* Transform the children of an mdast node into hast nodes.
	*
	* @param {MdastNodes} parent
	*   mdast node to compile
	* @returns {Array<HastElementContent>}
	*   Resulting hast nodes.
	*/
	function all$4(parent) {
		/** @type {Array<HastElementContent>} */
		const values = [];
		if ("children" in parent) {
			const nodes = parent.children;
			let index$2 = -1;
			while (++index$2 < nodes.length) {
				const result = state.one(nodes[index$2], parent);
				if (result) {
					if (index$2 && nodes[index$2 - 1].type === "break") {
						if (!Array.isArray(result) && result.type === "text") result.value = trimMarkdownSpaceStart(result.value);
						if (!Array.isArray(result) && result.type === "element") {
							const head = result.children[0];
							if (head && head.type === "text") head.value = trimMarkdownSpaceStart(head.value);
						}
					}
					if (Array.isArray(result)) values.push(...result);
					else values.push(result);
				}
			}
		}
		return values;
	}
}
/**
* Copy a node’s positional info.
*
* @param {MdastNodes} from
*   mdast node to copy from.
* @param {HastNodes} to
*   hast node to copy into.
* @returns {undefined}
*   Nothing.
*/
function patch$3(from, to) {
	if (from.position) to.position = position(from);
}
/**
* Honor the `data` of `from` and maybe generate an element instead of `to`.
*
* @template {HastNodes} Type
*   Node type.
* @param {MdastNodes} from
*   mdast node to use data from.
* @param {Type} to
*   hast node to change.
* @returns {HastElement | Type}
*   Nothing.
*/
function applyData(from, to) {
	/** @type {HastElement | Type} */
	let result = to;
	if (from && from.data) {
		const hName = from.data.hName;
		const hChildren = from.data.hChildren;
		const hProperties = from.data.hProperties;
		if (typeof hName === "string") if (result.type === "element") result.tagName = hName;
		else result = {
			type: "element",
			tagName: hName,
			properties: {},
			children: "children" in result ? result.children : [result]
		};
		if (result.type === "element" && hProperties) Object.assign(result.properties, esm_default(hProperties));
		if ("children" in result && result.children && hChildren !== null && hChildren !== void 0) result.children = hChildren;
	}
	return result;
}
/**
* Transform an unknown node.
*
* @param {State} state
*   Info passed around.
* @param {MdastNodes} node
*   Unknown mdast node.
* @returns {HastElement | HastText}
*   Resulting hast node.
*/
function defaultUnknownHandler(state, node$1) {
	const data = node$1.data || {};
	/** @type {HastElement | HastText} */
	const result = "value" in node$1 && !(own$5.call(data, "hProperties") || own$5.call(data, "hChildren")) ? {
		type: "text",
		value: node$1.value
	} : {
		type: "element",
		tagName: "div",
		properties: {},
		children: state.all(node$1)
	};
	state.patch(node$1, result);
	return state.applyData(node$1, result);
}
/**
* Wrap `nodes` with line endings between each node.
*
* @template {HastRootContent} Type
*   Node type.
* @param {Array<Type>} nodes
*   List of nodes to wrap.
* @param {boolean | undefined} [loose=false]
*   Whether to add line endings at start and end (default: `false`).
* @returns {Array<HastText | Type>}
*   Wrapped nodes.
*/
function wrap$1(nodes, loose) {
	/** @type {Array<HastText | Type>} */
	const result = [];
	let index$2 = -1;
	if (loose) result.push({
		type: "text",
		value: "\n"
	});
	while (++index$2 < nodes.length) {
		if (index$2) result.push({
			type: "text",
			value: "\n"
		});
		result.push(nodes[index$2]);
	}
	if (loose && nodes.length > 0) result.push({
		type: "text",
		value: "\n"
	});
	return result;
}
/**
* Trim spaces and tabs at the start of `value`.
*
* @param {string} value
*   Value to trim.
* @returns {string}
*   Result.
*/
function trimMarkdownSpaceStart(value) {
	let index$2 = 0;
	let code$3 = value.charCodeAt(index$2);
	while (code$3 === 9 || code$3 === 32) {
		index$2++;
		code$3 = value.charCodeAt(index$2);
	}
	return value.slice(index$2);
}

//#endregion
//#region node_modules/mdast-util-to-hast/lib/index.js
/**
* Transform mdast to hast.
*
* ##### Notes
*
* ###### HTML
*
* Raw HTML is available in mdast as `html` nodes and can be embedded in hast
* as semistandard `raw` nodes.
* Most utilities ignore `raw` nodes but two notable ones don’t:
*
* *   `hast-util-to-html` also has an option `allowDangerousHtml` which will
*     output the raw HTML.
*     This is typically discouraged as noted by the option name but is useful
*     if you completely trust authors
* *   `hast-util-raw` can handle the raw embedded HTML strings by parsing them
*     into standard hast nodes (`element`, `text`, etc).
*     This is a heavy task as it needs a full HTML parser, but it is the only
*     way to support untrusted content
*
* ###### Footnotes
*
* Many options supported here relate to footnotes.
* Footnotes are not specified by CommonMark, which we follow by default.
* They are supported by GitHub, so footnotes can be enabled in markdown with
* `mdast-util-gfm`.
*
* The options `footnoteBackLabel` and `footnoteLabel` define natural language
* that explains footnotes, which is hidden for sighted users but shown to
* assistive technology.
* When your page is not in English, you must define translated values.
*
* Back references use ARIA attributes, but the section label itself uses a
* heading that is hidden with an `sr-only` class.
* To show it to sighted users, define different attributes in
* `footnoteLabelProperties`.
*
* ###### Clobbering
*
* Footnotes introduces a problem, as it links footnote calls to footnote
* definitions on the page through `id` attributes generated from user content,
* which results in DOM clobbering.
*
* DOM clobbering is this:
*
* ```html
* <p id=x></p>
* <script>alert(x) // `x` now refers to the DOM `p#x` element<\/script>
* ```
*
* Elements by their ID are made available by browsers on the `window` object,
* which is a security risk.
* Using a prefix solves this problem.
*
* More information on how to handle clobbering and the prefix is explained in
* Example: headings (DOM clobbering) in `rehype-sanitize`.
*
* ###### Unknown nodes
*
* Unknown nodes are nodes with a type that isn’t in `handlers` or `passThrough`.
* The default behavior for unknown nodes is:
*
* *   when the node has a `value` (and doesn’t have `data.hName`,
*     `data.hProperties`, or `data.hChildren`, see later), create a hast `text`
*     node
* *   otherwise, create a `<div>` element (which could be changed with
*     `data.hName`), with its children mapped from mdast to hast as well
*
* This behavior can be changed by passing an `unknownHandler`.
*
* @param {MdastNodes} tree
*   mdast tree.
* @param {Options | null | undefined} [options]
*   Configuration (optional).
* @returns {HastNodes}
*   hast tree.
*/
function toHast(tree, options) {
	const state = createState(tree, options);
	const node$1 = state.one(tree, void 0);
	const foot = footer(state);
	/** @type {HastNodes} */
	const result = Array.isArray(node$1) ? {
		type: "root",
		children: node$1
	} : node$1 || {
		type: "root",
		children: []
	};
	if (foot) {
		/* @__PURE__ */ ok("children" in result);
		result.children.push({
			type: "text",
			value: "\n"
		}, foot);
	}
	return result;
}

//#endregion
//#region node_modules/remark-rehype/lib/index.js
/**
* Turn markdown into HTML.
*
* ##### Notes
*
* ###### Signature
*
* * if a processor is given,
*   runs the (rehype) plugins used on it with a hast tree,
*   then discards the result (*bridge mode*)
* * otherwise,
*   returns a hast tree,
*   the plugins used after `remarkRehype` are rehype plugins (*mutate mode*)
*
* > 👉 **Note**:
* > It’s highly unlikely that you want to pass a `processor`.
*
* ###### HTML
*
* Raw HTML is available in mdast as `html` nodes and can be embedded in hast
* as semistandard `raw` nodes.
* Most plugins ignore `raw` nodes but two notable ones don’t:
*
* * `rehype-stringify` also has an option `allowDangerousHtml` which will
*   output the raw HTML.
*   This is typically discouraged as noted by the option name but is useful if
*   you completely trust authors
* * `rehype-raw` can handle the raw embedded HTML strings by parsing them
*   into standard hast nodes (`element`, `text`, etc);
*   this is a heavy task as it needs a full HTML parser,
*   but it is the only way to support untrusted content
*
* ###### Footnotes
*
* Many options supported here relate to footnotes.
* Footnotes are not specified by CommonMark,
* which we follow by default.
* They are supported by GitHub,
* so footnotes can be enabled in markdown with `remark-gfm`.
*
* The options `footnoteBackLabel` and `footnoteLabel` define natural language
* that explains footnotes,
* which is hidden for sighted users but shown to assistive technology.
* When your page is not in English,
* you must define translated values.
*
* Back references use ARIA attributes,
* but the section label itself uses a heading that is hidden with an
* `sr-only` class.
* To show it to sighted users,
* define different attributes in `footnoteLabelProperties`.
*
* ###### Clobbering
*
* Footnotes introduces a problem,
* as it links footnote calls to footnote definitions on the page through `id`
* attributes generated from user content,
* which results in DOM clobbering.
*
* DOM clobbering is this:
*
* ```html
* <p id=x></p>
* <script>alert(x) // `x` now refers to the DOM `p#x` element<\/script>
* ```
*
* Elements by their ID are made available by browsers on the `window` object,
* which is a security risk.
* Using a prefix solves this problem.
*
* More information on how to handle clobbering and the prefix is explained in
* *Example: headings (DOM clobbering)* in `rehype-sanitize`.
*
* ###### Unknown nodes
*
* Unknown nodes are nodes with a type that isn’t in `handlers` or `passThrough`.
* The default behavior for unknown nodes is:
*
* * when the node has a `value`
*   (and doesn’t have `data.hName`, `data.hProperties`, or `data.hChildren`,
*   see later),
*   create a hast `text` node
* * otherwise,
*   create a `<div>` element (which could be changed with `data.hName`),
*   with its children mapped from mdast to hast as well
*
* This behavior can be changed by passing an `unknownHandler`.
*
* @overload
* @param {Processor} processor
* @param {Readonly<Options> | null | undefined} [options]
* @returns {TransformBridge}
*
* @overload
* @param {Readonly<Options> | null | undefined} [options]
* @returns {TransformMutate}
*
* @overload
* @param {Readonly<Options> | Processor | null | undefined} [destination]
* @param {Readonly<Options> | null | undefined} [options]
* @returns {TransformBridge | TransformMutate}
*
* @param {Readonly<Options> | Processor | null | undefined} [destination]
*   Processor or configuration (optional).
* @param {Readonly<Options> | null | undefined} [options]
*   When a processor was given,
*   configuration (optional).
* @returns {TransformBridge | TransformMutate}
*   Transform.
*/
function remarkRehype(destination, options) {
	if (destination && "run" in destination)
 /**
	* @type {TransformBridge}
	*/
	return async function(tree, file) {
		const hastTree = toHast(tree, {
			file,
			...options
		});
		await destination.run(hastTree, file);
	};
	/**
	* @type {TransformMutate}
	*/
	return function(tree, file) {
		return toHast(tree, {
			file,
			...destination || options
		});
	};
}

//#endregion
//#region node_modules/bail/index.js
/**
* Throw a given error.
*
* @param {Error|null|undefined} [error]
*   Maybe error.
* @returns {asserts error is null|undefined}
*/
function bail(error) {
	if (error) throw error;
}

//#endregion
//#region node_modules/extend/index.js
var require_extend = /* @__PURE__ */ __commonJS({ "node_modules/extend/index.js": ((exports, module) => {
	var hasOwn = Object.prototype.hasOwnProperty;
	var toStr = Object.prototype.toString;
	var defineProperty = Object.defineProperty;
	var gOPD = Object.getOwnPropertyDescriptor;
	var isArray = function isArray$1(arr) {
		if (typeof Array.isArray === "function") return Array.isArray(arr);
		return toStr.call(arr) === "[object Array]";
	};
	var isPlainObject$1 = function isPlainObject$2(obj) {
		if (!obj || toStr.call(obj) !== "[object Object]") return false;
		var hasOwnConstructor = hasOwn.call(obj, "constructor");
		var hasIsPrototypeOf = obj.constructor && obj.constructor.prototype && hasOwn.call(obj.constructor.prototype, "isPrototypeOf");
		if (obj.constructor && !hasOwnConstructor && !hasIsPrototypeOf) return false;
		var key;
		for (key in obj);
		return typeof key === "undefined" || hasOwn.call(obj, key);
	};
	var setProperty = function setProperty$1(target, options) {
		if (defineProperty && options.name === "__proto__") defineProperty(target, options.name, {
			enumerable: true,
			configurable: true,
			value: options.newValue,
			writable: true
		});
		else target[options.name] = options.newValue;
	};
	var getProperty = function getProperty$1(obj, name$1) {
		if (name$1 === "__proto__") {
			if (!hasOwn.call(obj, name$1)) return;
			else if (gOPD) return gOPD(obj, name$1).value;
		}
		return obj[name$1];
	};
	module.exports = function extend$1() {
		var options, name$1, src, copy, copyIsArray, clone;
		var target = arguments[0];
		var i = 1;
		var length = arguments.length;
		var deep = false;
		if (typeof target === "boolean") {
			deep = target;
			target = arguments[1] || {};
			i = 2;
		}
		if (target == null || typeof target !== "object" && typeof target !== "function") target = {};
		for (; i < length; ++i) {
			options = arguments[i];
			if (options != null) for (name$1 in options) {
				src = getProperty(target, name$1);
				copy = getProperty(options, name$1);
				if (target !== copy) {
					if (deep && copy && (isPlainObject$1(copy) || (copyIsArray = isArray(copy)))) {
						if (copyIsArray) {
							copyIsArray = false;
							clone = src && isArray(src) ? src : [];
						} else clone = src && isPlainObject$1(src) ? src : {};
						setProperty(target, {
							name: name$1,
							newValue: extend$1(deep, clone, copy)
						});
					} else if (typeof copy !== "undefined") setProperty(target, {
						name: name$1,
						newValue: copy
					});
				}
			}
		}
		return target;
	};
}) });

//#endregion
//#region node_modules/is-plain-obj/index.js
function isPlainObject(value) {
	if (typeof value !== "object" || value === null) return false;
	const prototype = Object.getPrototypeOf(value);
	return (prototype === null || prototype === Object.prototype || Object.getPrototypeOf(prototype) === null) && !(Symbol.toStringTag in value) && !(Symbol.iterator in value);
}

//#endregion
//#region node_modules/trough/lib/index.js
/**
* @typedef {(error?: Error | null | undefined, ...output: Array<any>) => void} Callback
*   Callback.
*
* @typedef {(...input: Array<any>) => any} Middleware
*   Ware.
*
* @typedef Pipeline
*   Pipeline.
* @property {Run} run
*   Run the pipeline.
* @property {Use} use
*   Add middleware.
*
* @typedef {(...input: Array<any>) => void} Run
*   Call all middleware.
*
*   Calls `done` on completion with either an error or the output of the
*   last middleware.
*
*   > 👉 **Note**: as the length of input defines whether async functions get a
*   > `next` function,
*   > it’s recommended to keep `input` at one value normally.

*
* @typedef {(fn: Middleware) => Pipeline} Use
*   Add middleware.
*/
/**
* Create new middleware.
*
* @returns {Pipeline}
*   Pipeline.
*/
function trough() {
	/** @type {Array<Middleware>} */
	const fns = [];
	/** @type {Pipeline} */
	const pipeline = {
		run,
		use
	};
	return pipeline;
	/** @type {Run} */
	function run(...values) {
		let middlewareIndex = -1;
		/** @type {Callback} */
		const callback = values.pop();
		if (typeof callback !== "function") throw new TypeError("Expected function as last argument, not " + callback);
		next$1(null, ...values);
		/**
		* Run the next `fn`, or we’re done.
		*
		* @param {Error | null | undefined} error
		* @param {Array<any>} output
		*/
		function next$1(error, ...output) {
			const fn = fns[++middlewareIndex];
			let index$2 = -1;
			if (error) {
				callback(error);
				return;
			}
			while (++index$2 < values.length) if (output[index$2] === null || output[index$2] === void 0) output[index$2] = values[index$2];
			values = output;
			if (fn) wrap(fn, next$1)(...output);
			else callback(null, ...output);
		}
	}
	/** @type {Use} */
	function use(middelware) {
		if (typeof middelware !== "function") throw new TypeError("Expected `middelware` to be a function, not " + middelware);
		fns.push(middelware);
		return pipeline;
	}
}
/**
* Wrap `middleware` into a uniform interface.
*
* You can pass all input to the resulting function.
* `callback` is then called with the output of `middleware`.
*
* If `middleware` accepts more arguments than the later given in input,
* an extra `done` function is passed to it after that input,
* which must be called by `middleware`.
*
* The first value in `input` is the main input value.
* All other input values are the rest input values.
* The values given to `callback` are the input values,
* merged with every non-nullish output value.
*
* * if `middleware` throws an error,
*   returns a promise that is rejected,
*   or calls the given `done` function with an error,
*   `callback` is called with that error
* * if `middleware` returns a value or returns a promise that is resolved,
*   that value is the main output value
* * if `middleware` calls `done`,
*   all non-nullish values except for the first one (the error) overwrite the
*   output values
*
* @param {Middleware} middleware
*   Function to wrap.
* @param {Callback} callback
*   Callback called with the output of `middleware`.
* @returns {Run}
*   Wrapped middleware.
*/
function wrap(middleware, callback) {
	/** @type {boolean} */
	let called;
	return wrapped;
	/**
	* Call `middleware`.
	* @this {any}
	* @param {Array<any>} parameters
	* @returns {void}
	*/
	function wrapped(...parameters) {
		const fnExpectsCallback = middleware.length > parameters.length;
		/** @type {any} */
		let result;
		if (fnExpectsCallback) parameters.push(done);
		try {
			result = middleware.apply(this, parameters);
		} catch (error) {
			const exception = error;
			if (fnExpectsCallback && called) throw exception;
			return done(exception);
		}
		if (!fnExpectsCallback) if (result && result.then && typeof result.then === "function") result.then(then, done);
		else if (result instanceof Error) done(result);
		else then(result);
	}
	/**
	* Call `callback`, only once.
	*
	* @type {Callback}
	*/
	function done(error, ...output) {
		if (!called) {
			called = true;
			callback(error, ...output);
		}
	}
	/**
	* Call `done` with one value.
	*
	* @param {any} [value]
	*/
	function then(value) {
		done(null, value);
	}
}

//#endregion
//#region src/client/shims/path.ts
function normalize$1(value) {
	const parts = [];
	for (const part of value.split("/")) {
		if (part.length === 0 || part === ".") continue;
		if (part === "..") {
			parts.pop();
			continue;
		}
		parts.push(part);
	}
	return parts.join("/");
}
const sep = "/";
function basename(value, suffix = "") {
	const normalized = value.replace(/\\/g, "/").split("/").at(-1) ?? "";
	return suffix.length > 0 && normalized.endsWith(suffix) ? normalized.slice(0, -suffix.length) : normalized;
}
function dirname(value) {
	const normalized = value.replace(/\\/g, "/");
	const index$2 = normalized.lastIndexOf("/");
	if (index$2 < 0) return ".";
	return normalized.slice(0, index$2) || "/";
}
function extname(value) {
	const name$1 = basename(value);
	const index$2 = name$1.lastIndexOf(".");
	return index$2 <= 0 ? "" : name$1.slice(index$2);
}
function join(...values) {
	return normalize$1(values.filter((value) => value.length > 0).join("/"));
}
var path_default = {
	basename,
	dirname,
	extname,
	join,
	sep
};

//#endregion
//#region src/client/shims/process.ts
const processShim = { cwd: () => "" };
const cwd = processShim.cwd;
var process_default = processShim;

//#endregion
//#region src/client/shims/url.ts
function fileURLToPath(value) {
	const url = typeof value === "string" ? new URL(value) : value;
	return decodeURIComponent(url.pathname);
}

//#endregion
//#region node_modules/vfile/lib/minurl.shared.js
/**
* Checks if a value has the shape of a WHATWG URL object.
*
* Using a symbol or instanceof would not be able to recognize URL objects
* coming from other implementations (e.g. in Electron), so instead we are
* checking some well known properties for a lack of a better test.
*
* We use `href` and `protocol` as they are the only properties that are
* easy to retrieve and calculate due to the lazy nature of the getters.
*
* We check for auth attribute to distinguish legacy url instance with
* WHATWG URL instance.
*
* @param {unknown} fileUrlOrPath
*   File path or URL.
* @returns {fileUrlOrPath is URL}
*   Whether it’s a URL.
*/
function isUrl(fileUrlOrPath) {
	return Boolean(fileUrlOrPath !== null && typeof fileUrlOrPath === "object" && "href" in fileUrlOrPath && fileUrlOrPath.href && "protocol" in fileUrlOrPath && fileUrlOrPath.protocol && fileUrlOrPath.auth === void 0);
}

//#endregion
//#region node_modules/vfile/lib/index.js
/**
* Order of setting (least specific to most), we need this because otherwise
* `{stem: 'a', path: '~/b.js'}` would throw, as a path is needed before a
* stem can be set.
*/
const order = [
	"history",
	"path",
	"basename",
	"stem",
	"extname",
	"dirname"
];
var VFile = class {
	/**
	* Create a new virtual file.
	*
	* `options` is treated as:
	*
	* *   `string` or `Uint8Array` — `{value: options}`
	* *   `URL` — `{path: options}`
	* *   `VFile` — shallow copies its data over to the new file
	* *   `object` — all fields are shallow copied over to the new file
	*
	* Path related fields are set in the following order (least specific to
	* most specific): `history`, `path`, `basename`, `stem`, `extname`,
	* `dirname`.
	*
	* You cannot set `dirname` or `extname` without setting either `history`,
	* `path`, `basename`, or `stem` too.
	*
	* @param {Compatible | null | undefined} [value]
	*   File value.
	* @returns
	*   New instance.
	*/
	constructor(value) {
		/** @type {Options | VFile} */
		let options;
		if (!value) options = {};
		else if (isUrl(value)) options = { path: value };
		else if (typeof value === "string" || isUint8Array$1(value)) options = { value };
		else options = value;
		/**
		* Base of `path` (default: `process.cwd()` or `'/'` in browsers).
		*
		* @type {string}
		*/
		this.cwd = "cwd" in options ? "" : process_default.cwd();
		/**
		* Place to store custom info (default: `{}`).
		*
		* It’s OK to store custom data directly on the file but moving it to
		* `data` is recommended.
		*
		* @type {Data}
		*/
		this.data = {};
		/**
		* List of file paths the file moved between.
		*
		* The first is the original path and the last is the current path.
		*
		* @type {Array<string>}
		*/
		this.history = [];
		/**
		* List of messages associated with the file.
		*
		* @type {Array<VFileMessage>}
		*/
		this.messages = [];
		/**
		* Raw value.
		*
		* @type {Value}
		*/
		this.value;
		/**
		* Source map.
		*
		* This type is equivalent to the `RawSourceMap` type from the `source-map`
		* module.
		*
		* @type {Map | null | undefined}
		*/
		this.map;
		/**
		* Custom, non-string, compiled, representation.
		*
		* This is used by unified to store non-string results.
		* One example is when turning markdown into React nodes.
		*
		* @type {unknown}
		*/
		this.result;
		/**
		* Whether a file was saved to disk.
		*
		* This is used by vfile reporters.
		*
		* @type {boolean}
		*/
		this.stored;
		let index$2 = -1;
		while (++index$2 < order.length) {
			const field$1 = order[index$2];
			if (field$1 in options && options[field$1] !== void 0 && options[field$1] !== null) this[field$1] = field$1 === "history" ? [...options[field$1]] : options[field$1];
		}
		/** @type {string} */
		let field;
		for (field in options) if (!order.includes(field)) this[field] = options[field];
	}
	/**
	* Get the basename (including extname) (example: `'index.min.js'`).
	*
	* @returns {string | undefined}
	*   Basename.
	*/
	get basename() {
		return typeof this.path === "string" ? path_default.basename(this.path) : void 0;
	}
	/**
	* Set basename (including extname) (`'index.min.js'`).
	*
	* Cannot contain path separators (`'/'` on unix, macOS, and browsers, `'\'`
	* on windows).
	* Cannot be nullified (use `file.path = file.dirname` instead).
	*
	* @param {string} basename
	*   Basename.
	* @returns {undefined}
	*   Nothing.
	*/
	set basename(basename$1) {
		assertNonEmpty(basename$1, "basename");
		assertPart(basename$1, "basename");
		this.path = path_default.join(this.dirname || "", basename$1);
	}
	/**
	* Get the parent path (example: `'~'`).
	*
	* @returns {string | undefined}
	*   Dirname.
	*/
	get dirname() {
		return typeof this.path === "string" ? path_default.dirname(this.path) : void 0;
	}
	/**
	* Set the parent path (example: `'~'`).
	*
	* Cannot be set if there’s no `path` yet.
	*
	* @param {string | undefined} dirname
	*   Dirname.
	* @returns {undefined}
	*   Nothing.
	*/
	set dirname(dirname$1) {
		assertPath(this.basename, "dirname");
		this.path = path_default.join(dirname$1 || "", this.basename);
	}
	/**
	* Get the extname (including dot) (example: `'.js'`).
	*
	* @returns {string | undefined}
	*   Extname.
	*/
	get extname() {
		return typeof this.path === "string" ? path_default.extname(this.path) : void 0;
	}
	/**
	* Set the extname (including dot) (example: `'.js'`).
	*
	* Cannot contain path separators (`'/'` on unix, macOS, and browsers, `'\'`
	* on windows).
	* Cannot be set if there’s no `path` yet.
	*
	* @param {string | undefined} extname
	*   Extname.
	* @returns {undefined}
	*   Nothing.
	*/
	set extname(extname$1) {
		assertPart(extname$1, "extname");
		assertPath(this.dirname, "extname");
		if (extname$1) {
			if (extname$1.codePointAt(0) !== 46) throw new Error("`extname` must start with `.`");
			if (extname$1.includes(".", 1)) throw new Error("`extname` cannot contain multiple dots");
		}
		this.path = path_default.join(this.dirname, this.stem + (extname$1 || ""));
	}
	/**
	* Get the full path (example: `'~/index.min.js'`).
	*
	* @returns {string}
	*   Path.
	*/
	get path() {
		return this.history[this.history.length - 1];
	}
	/**
	* Set the full path (example: `'~/index.min.js'`).
	*
	* Cannot be nullified.
	* You can set a file URL (a `URL` object with a `file:` protocol) which will
	* be turned into a path with `url.fileURLToPath`.
	*
	* @param {URL | string} path
	*   Path.
	* @returns {undefined}
	*   Nothing.
	*/
	set path(path$1) {
		if (isUrl(path$1)) path$1 = fileURLToPath(path$1);
		assertNonEmpty(path$1, "path");
		if (this.path !== path$1) this.history.push(path$1);
	}
	/**
	* Get the stem (basename w/o extname) (example: `'index.min'`).
	*
	* @returns {string | undefined}
	*   Stem.
	*/
	get stem() {
		return typeof this.path === "string" ? path_default.basename(this.path, this.extname) : void 0;
	}
	/**
	* Set the stem (basename w/o extname) (example: `'index.min'`).
	*
	* Cannot contain path separators (`'/'` on unix, macOS, and browsers, `'\'`
	* on windows).
	* Cannot be nullified (use `file.path = file.dirname` instead).
	*
	* @param {string} stem
	*   Stem.
	* @returns {undefined}
	*   Nothing.
	*/
	set stem(stem) {
		assertNonEmpty(stem, "stem");
		assertPart(stem, "stem");
		this.path = path_default.join(this.dirname || "", stem + (this.extname || ""));
	}
	/**
	* Create a fatal message for `reason` associated with the file.
	*
	* The `fatal` field of the message is set to `true` (error; file not usable)
	* and the `file` field is set to the current file path.
	* The message is added to the `messages` field on `file`.
	*
	* > 🪦 **Note**: also has obsolete signatures.
	*
	* @overload
	* @param {string} reason
	* @param {MessageOptions | null | undefined} [options]
	* @returns {never}
	*
	* @overload
	* @param {string} reason
	* @param {Node | NodeLike | null | undefined} parent
	* @param {string | null | undefined} [origin]
	* @returns {never}
	*
	* @overload
	* @param {string} reason
	* @param {Point | Position | null | undefined} place
	* @param {string | null | undefined} [origin]
	* @returns {never}
	*
	* @overload
	* @param {string} reason
	* @param {string | null | undefined} [origin]
	* @returns {never}
	*
	* @overload
	* @param {Error | VFileMessage} cause
	* @param {Node | NodeLike | null | undefined} parent
	* @param {string | null | undefined} [origin]
	* @returns {never}
	*
	* @overload
	* @param {Error | VFileMessage} cause
	* @param {Point | Position | null | undefined} place
	* @param {string | null | undefined} [origin]
	* @returns {never}
	*
	* @overload
	* @param {Error | VFileMessage} cause
	* @param {string | null | undefined} [origin]
	* @returns {never}
	*
	* @param {Error | VFileMessage | string} causeOrReason
	*   Reason for message, should use markdown.
	* @param {Node | NodeLike | MessageOptions | Point | Position | string | null | undefined} [optionsOrParentOrPlace]
	*   Configuration (optional).
	* @param {string | null | undefined} [origin]
	*   Place in code where the message originates (example:
	*   `'my-package:my-rule'` or `'my-rule'`).
	* @returns {never}
	*   Never.
	* @throws {VFileMessage}
	*   Message.
	*/
	fail(causeOrReason, optionsOrParentOrPlace, origin) {
		const message = this.message(causeOrReason, optionsOrParentOrPlace, origin);
		message.fatal = true;
		throw message;
	}
	/**
	* Create an info message for `reason` associated with the file.
	*
	* The `fatal` field of the message is set to `undefined` (info; change
	* likely not needed) and the `file` field is set to the current file path.
	* The message is added to the `messages` field on `file`.
	*
	* > 🪦 **Note**: also has obsolete signatures.
	*
	* @overload
	* @param {string} reason
	* @param {MessageOptions | null | undefined} [options]
	* @returns {VFileMessage}
	*
	* @overload
	* @param {string} reason
	* @param {Node | NodeLike | null | undefined} parent
	* @param {string | null | undefined} [origin]
	* @returns {VFileMessage}
	*
	* @overload
	* @param {string} reason
	* @param {Point | Position | null | undefined} place
	* @param {string | null | undefined} [origin]
	* @returns {VFileMessage}
	*
	* @overload
	* @param {string} reason
	* @param {string | null | undefined} [origin]
	* @returns {VFileMessage}
	*
	* @overload
	* @param {Error | VFileMessage} cause
	* @param {Node | NodeLike | null | undefined} parent
	* @param {string | null | undefined} [origin]
	* @returns {VFileMessage}
	*
	* @overload
	* @param {Error | VFileMessage} cause
	* @param {Point | Position | null | undefined} place
	* @param {string | null | undefined} [origin]
	* @returns {VFileMessage}
	*
	* @overload
	* @param {Error | VFileMessage} cause
	* @param {string | null | undefined} [origin]
	* @returns {VFileMessage}
	*
	* @param {Error | VFileMessage | string} causeOrReason
	*   Reason for message, should use markdown.
	* @param {Node | NodeLike | MessageOptions | Point | Position | string | null | undefined} [optionsOrParentOrPlace]
	*   Configuration (optional).
	* @param {string | null | undefined} [origin]
	*   Place in code where the message originates (example:
	*   `'my-package:my-rule'` or `'my-rule'`).
	* @returns {VFileMessage}
	*   Message.
	*/
	info(causeOrReason, optionsOrParentOrPlace, origin) {
		const message = this.message(causeOrReason, optionsOrParentOrPlace, origin);
		message.fatal = void 0;
		return message;
	}
	/**
	* Create a message for `reason` associated with the file.
	*
	* The `fatal` field of the message is set to `false` (warning; change may be
	* needed) and the `file` field is set to the current file path.
	* The message is added to the `messages` field on `file`.
	*
	* > 🪦 **Note**: also has obsolete signatures.
	*
	* @overload
	* @param {string} reason
	* @param {MessageOptions | null | undefined} [options]
	* @returns {VFileMessage}
	*
	* @overload
	* @param {string} reason
	* @param {Node | NodeLike | null | undefined} parent
	* @param {string | null | undefined} [origin]
	* @returns {VFileMessage}
	*
	* @overload
	* @param {string} reason
	* @param {Point | Position | null | undefined} place
	* @param {string | null | undefined} [origin]
	* @returns {VFileMessage}
	*
	* @overload
	* @param {string} reason
	* @param {string | null | undefined} [origin]
	* @returns {VFileMessage}
	*
	* @overload
	* @param {Error | VFileMessage} cause
	* @param {Node | NodeLike | null | undefined} parent
	* @param {string | null | undefined} [origin]
	* @returns {VFileMessage}
	*
	* @overload
	* @param {Error | VFileMessage} cause
	* @param {Point | Position | null | undefined} place
	* @param {string | null | undefined} [origin]
	* @returns {VFileMessage}
	*
	* @overload
	* @param {Error | VFileMessage} cause
	* @param {string | null | undefined} [origin]
	* @returns {VFileMessage}
	*
	* @param {Error | VFileMessage | string} causeOrReason
	*   Reason for message, should use markdown.
	* @param {Node | NodeLike | MessageOptions | Point | Position | string | null | undefined} [optionsOrParentOrPlace]
	*   Configuration (optional).
	* @param {string | null | undefined} [origin]
	*   Place in code where the message originates (example:
	*   `'my-package:my-rule'` or `'my-rule'`).
	* @returns {VFileMessage}
	*   Message.
	*/
	message(causeOrReason, optionsOrParentOrPlace, origin) {
		const message = new VFileMessage(causeOrReason, optionsOrParentOrPlace, origin);
		if (this.path) {
			message.name = this.path + ":" + message.name;
			message.file = this.path;
		}
		message.fatal = false;
		this.messages.push(message);
		return message;
	}
	/**
	* Serialize the file.
	*
	* > **Note**: which encodings are supported depends on the engine.
	* > For info on Node.js, see:
	* > <https://nodejs.org/api/util.html#whatwg-supported-encodings>.
	*
	* @param {string | null | undefined} [encoding='utf8']
	*   Character encoding to understand `value` as when it’s a `Uint8Array`
	*   (default: `'utf-8'`).
	* @returns {string}
	*   Serialized file.
	*/
	toString(encoding) {
		if (this.value === void 0) return "";
		if (typeof this.value === "string") return this.value;
		return new TextDecoder(encoding || void 0).decode(this.value);
	}
};
/**
* Assert that `part` is not a path (as in, does not contain `path.sep`).
*
* @param {string | null | undefined} part
*   File path part.
* @param {string} name
*   Part name.
* @returns {undefined}
*   Nothing.
*/
function assertPart(part, name$1) {
	if (part && part.includes(path_default.sep)) throw new Error("`" + name$1 + "` cannot be a path: did not expect `" + path_default.sep + "`");
}
/**
* Assert that `part` is not empty.
*
* @param {string | undefined} part
*   Thing.
* @param {string} name
*   Part name.
* @returns {asserts part is string}
*   Nothing.
*/
function assertNonEmpty(part, name$1) {
	if (!part) throw new Error("`" + name$1 + "` cannot be empty");
}
/**
* Assert `path` exists.
*
* @param {string | undefined} path
*   Path.
* @param {string} name
*   Dependency name.
* @returns {asserts path is string}
*   Nothing.
*/
function assertPath(path$1, name$1) {
	if (!path$1) throw new Error("Setting `" + name$1 + "` requires `path` to be set too");
}
/**
* Assert `value` is an `Uint8Array`.
*
* @param {unknown} value
*   thing.
* @returns {value is Uint8Array}
*   Whether `value` is an `Uint8Array`.
*/
function isUint8Array$1(value) {
	return Boolean(value && typeof value === "object" && "byteLength" in value && "byteOffset" in value);
}

//#endregion
//#region node_modules/unified/lib/callable-instance.js
const CallableInstance = (function(property) {
	const proto$1 = this.constructor.prototype;
	const value = proto$1[property];
	/** @type {(...parameters: Array<unknown>) => unknown} */
	const apply$1 = function() {
		return value.apply(apply$1, arguments);
	};
	Object.setPrototypeOf(apply$1, proto$1);
	return apply$1;
});

//#endregion
//#region node_modules/unified/lib/index.js
var import_extend = /* @__PURE__ */ __toESM(require_extend(), 1);
const own$4 = {}.hasOwnProperty;
/**
* @template {Node | undefined} [ParseTree=undefined]
*   Output of `parse` (optional).
* @template {Node | undefined} [HeadTree=undefined]
*   Input for `run` (optional).
* @template {Node | undefined} [TailTree=undefined]
*   Output for `run` (optional).
* @template {Node | undefined} [CompileTree=undefined]
*   Input of `stringify` (optional).
* @template {CompileResults | undefined} [CompileResult=undefined]
*   Output of `stringify` (optional).
* @extends {CallableInstance<[], Processor<ParseTree, HeadTree, TailTree, CompileTree, CompileResult>>}
*/
var Processor = class Processor extends CallableInstance {
	/**
	* Create a processor.
	*/
	constructor() {
		super("copy");
		/**
		* Compiler to use (deprecated).
		*
		* @deprecated
		*   Use `compiler` instead.
		* @type {(
		*   Compiler<
		*     CompileTree extends undefined ? Node : CompileTree,
		*     CompileResult extends undefined ? CompileResults : CompileResult
		*   > |
		*   undefined
		* )}
		*/
		this.Compiler = void 0;
		/**
		* Parser to use (deprecated).
		*
		* @deprecated
		*   Use `parser` instead.
		* @type {(
		*   Parser<ParseTree extends undefined ? Node : ParseTree> |
		*   undefined
		* )}
		*/
		this.Parser = void 0;
		/**
		* Internal list of configured plugins.
		*
		* @deprecated
		*   This is a private internal property and should not be used.
		* @type {Array<PluginTuple<Array<unknown>>>}
		*/
		this.attachers = [];
		/**
		* Compiler to use.
		*
		* @type {(
		*   Compiler<
		*     CompileTree extends undefined ? Node : CompileTree,
		*     CompileResult extends undefined ? CompileResults : CompileResult
		*   > |
		*   undefined
		* )}
		*/
		this.compiler = void 0;
		/**
		* Internal state to track where we are while freezing.
		*
		* @deprecated
		*   This is a private internal property and should not be used.
		* @type {number}
		*/
		this.freezeIndex = -1;
		/**
		* Internal state to track whether we’re frozen.
		*
		* @deprecated
		*   This is a private internal property and should not be used.
		* @type {boolean | undefined}
		*/
		this.frozen = void 0;
		/**
		* Internal state.
		*
		* @deprecated
		*   This is a private internal property and should not be used.
		* @type {Data}
		*/
		this.namespace = {};
		/**
		* Parser to use.
		*
		* @type {(
		*   Parser<ParseTree extends undefined ? Node : ParseTree> |
		*   undefined
		* )}
		*/
		this.parser = void 0;
		/**
		* Internal list of configured transformers.
		*
		* @deprecated
		*   This is a private internal property and should not be used.
		* @type {Pipeline}
		*/
		this.transformers = trough();
	}
	/**
	* Copy a processor.
	*
	* @deprecated
	*   This is a private internal method and should not be used.
	* @returns {Processor<ParseTree, HeadTree, TailTree, CompileTree, CompileResult>}
	*   New *unfrozen* processor ({@linkcode Processor}) that is
	*   configured to work the same as its ancestor.
	*   When the descendant processor is configured in the future it does not
	*   affect the ancestral processor.
	*/
	copy() {
		const destination = new Processor();
		let index$2 = -1;
		while (++index$2 < this.attachers.length) {
			const attacher = this.attachers[index$2];
			destination.use(...attacher);
		}
		destination.data((0, import_extend.default)(true, {}, this.namespace));
		return destination;
	}
	/**
	* Configure the processor with info available to all plugins.
	* Information is stored in an object.
	*
	* Typically, options can be given to a specific plugin, but sometimes it
	* makes sense to have information shared with several plugins.
	* For example, a list of HTML elements that are self-closing, which is
	* needed during all phases.
	*
	* > **Note**: setting information cannot occur on *frozen* processors.
	* > Call the processor first to create a new unfrozen processor.
	*
	* > **Note**: to register custom data in TypeScript, augment the
	* > {@linkcode Data} interface.
	*
	* @example
	*   This example show how to get and set info:
	*
	*   ```js
	*   import {unified} from 'unified'
	*
	*   const processor = unified().data('alpha', 'bravo')
	*
	*   processor.data('alpha') // => 'bravo'
	*
	*   processor.data() // => {alpha: 'bravo'}
	*
	*   processor.data({charlie: 'delta'})
	*
	*   processor.data() // => {charlie: 'delta'}
	*   ```
	*
	* @template {keyof Data} Key
	*
	* @overload
	* @returns {Data}
	*
	* @overload
	* @param {Data} dataset
	* @returns {Processor<ParseTree, HeadTree, TailTree, CompileTree, CompileResult>}
	*
	* @overload
	* @param {Key} key
	* @returns {Data[Key]}
	*
	* @overload
	* @param {Key} key
	* @param {Data[Key]} value
	* @returns {Processor<ParseTree, HeadTree, TailTree, CompileTree, CompileResult>}
	*
	* @param {Data | Key} [key]
	*   Key to get or set, or entire dataset to set, or nothing to get the
	*   entire dataset (optional).
	* @param {Data[Key]} [value]
	*   Value to set (optional).
	* @returns {unknown}
	*   The current processor when setting, the value at `key` when getting, or
	*   the entire dataset when getting without key.
	*/
	data(key, value) {
		if (typeof key === "string") {
			if (arguments.length === 2) {
				assertUnfrozen("data", this.frozen);
				this.namespace[key] = value;
				return this;
			}
			return own$4.call(this.namespace, key) && this.namespace[key] || void 0;
		}
		if (key) {
			assertUnfrozen("data", this.frozen);
			this.namespace = key;
			return this;
		}
		return this.namespace;
	}
	/**
	* Freeze a processor.
	*
	* Frozen processors are meant to be extended and not to be configured
	* directly.
	*
	* When a processor is frozen it cannot be unfrozen.
	* New processors working the same way can be created by calling the
	* processor.
	*
	* It’s possible to freeze processors explicitly by calling `.freeze()`.
	* Processors freeze automatically when `.parse()`, `.run()`, `.runSync()`,
	* `.stringify()`, `.process()`, or `.processSync()` are called.
	*
	* @returns {Processor<ParseTree, HeadTree, TailTree, CompileTree, CompileResult>}
	*   The current processor.
	*/
	freeze() {
		if (this.frozen) return this;
		const self$1 = this;
		while (++this.freezeIndex < this.attachers.length) {
			const [attacher, ...options] = this.attachers[this.freezeIndex];
			if (options[0] === false) continue;
			if (options[0] === true) options[0] = void 0;
			const transformer = attacher.call(self$1, ...options);
			if (typeof transformer === "function") this.transformers.use(transformer);
		}
		this.frozen = true;
		this.freezeIndex = Number.POSITIVE_INFINITY;
		return this;
	}
	/**
	* Parse text to a syntax tree.
	*
	* > **Note**: `parse` freezes the processor if not already *frozen*.
	*
	* > **Note**: `parse` performs the parse phase, not the run phase or other
	* > phases.
	*
	* @param {Compatible | undefined} [file]
	*   file to parse (optional); typically `string` or `VFile`; any value
	*   accepted as `x` in `new VFile(x)`.
	* @returns {ParseTree extends undefined ? Node : ParseTree}
	*   Syntax tree representing `file`.
	*/
	parse(file) {
		this.freeze();
		const realFile = vfile(file);
		const parser = this.parser || this.Parser;
		assertParser("parse", parser);
		return parser(String(realFile), realFile);
	}
	/**
	* Process the given file as configured on the processor.
	*
	* > **Note**: `process` freezes the processor if not already *frozen*.
	*
	* > **Note**: `process` performs the parse, run, and stringify phases.
	*
	* @overload
	* @param {Compatible | undefined} file
	* @param {ProcessCallback<VFileWithOutput<CompileResult>>} done
	* @returns {undefined}
	*
	* @overload
	* @param {Compatible | undefined} [file]
	* @returns {Promise<VFileWithOutput<CompileResult>>}
	*
	* @param {Compatible | undefined} [file]
	*   File (optional); typically `string` or `VFile`]; any value accepted as
	*   `x` in `new VFile(x)`.
	* @param {ProcessCallback<VFileWithOutput<CompileResult>> | undefined} [done]
	*   Callback (optional).
	* @returns {Promise<VFile> | undefined}
	*   Nothing if `done` is given.
	*   Otherwise a promise, rejected with a fatal error or resolved with the
	*   processed file.
	*
	*   The parsed, transformed, and compiled value is available at
	*   `file.value` (see note).
	*
	*   > **Note**: unified typically compiles by serializing: most
	*   > compilers return `string` (or `Uint8Array`).
	*   > Some compilers, such as the one configured with
	*   > [`rehype-react`][rehype-react], return other values (in this case, a
	*   > React tree).
	*   > If you’re using a compiler that doesn’t serialize, expect different
	*   > result values.
	*   >
	*   > To register custom results in TypeScript, add them to
	*   > {@linkcode CompileResultMap}.
	*
	*   [rehype-react]: https://github.com/rehypejs/rehype-react
	*/
	process(file, done) {
		const self$1 = this;
		this.freeze();
		assertParser("process", this.parser || this.Parser);
		assertCompiler("process", this.compiler || this.Compiler);
		return done ? executor(void 0, done) : new Promise(executor);
		/**
		* @param {((file: VFileWithOutput<CompileResult>) => undefined | void) | undefined} resolve
		* @param {(error: Error | undefined) => undefined | void} reject
		* @returns {undefined}
		*/
		function executor(resolve, reject) {
			const realFile = vfile(file);
			const parseTree = self$1.parse(realFile);
			self$1.run(parseTree, realFile, function(error, tree, file$1) {
				if (error || !tree || !file$1) return realDone(error);
				const compileTree = tree;
				const compileResult = self$1.stringify(compileTree, file$1);
				if (looksLikeAValue(compileResult)) file$1.value = compileResult;
				else file$1.result = compileResult;
				realDone(error, file$1);
			});
			/**
			* @param {Error | undefined} error
			* @param {VFileWithOutput<CompileResult> | undefined} [file]
			* @returns {undefined}
			*/
			function realDone(error, file$1) {
				if (error || !file$1) reject(error);
				else if (resolve) resolve(file$1);
				else {
					/* @__PURE__ */ ok(done, "`done` is defined if `resolve` is not");
					done(void 0, file$1);
				}
			}
		}
	}
	/**
	* Process the given file as configured on the processor.
	*
	* An error is thrown if asynchronous transforms are configured.
	*
	* > **Note**: `processSync` freezes the processor if not already *frozen*.
	*
	* > **Note**: `processSync` performs the parse, run, and stringify phases.
	*
	* @param {Compatible | undefined} [file]
	*   File (optional); typically `string` or `VFile`; any value accepted as
	*   `x` in `new VFile(x)`.
	* @returns {VFileWithOutput<CompileResult>}
	*   The processed file.
	*
	*   The parsed, transformed, and compiled value is available at
	*   `file.value` (see note).
	*
	*   > **Note**: unified typically compiles by serializing: most
	*   > compilers return `string` (or `Uint8Array`).
	*   > Some compilers, such as the one configured with
	*   > [`rehype-react`][rehype-react], return other values (in this case, a
	*   > React tree).
	*   > If you’re using a compiler that doesn’t serialize, expect different
	*   > result values.
	*   >
	*   > To register custom results in TypeScript, add them to
	*   > {@linkcode CompileResultMap}.
	*
	*   [rehype-react]: https://github.com/rehypejs/rehype-react
	*/
	processSync(file) {
		/** @type {boolean} */
		let complete = false;
		/** @type {VFileWithOutput<CompileResult> | undefined} */
		let result;
		this.freeze();
		assertParser("processSync", this.parser || this.Parser);
		assertCompiler("processSync", this.compiler || this.Compiler);
		this.process(file, realDone);
		assertDone("processSync", "process", complete);
		/* @__PURE__ */ ok(result, "we either bailed on an error or have a tree");
		return result;
		/**
		* @type {ProcessCallback<VFileWithOutput<CompileResult>>}
		*/
		function realDone(error, file$1) {
			complete = true;
			bail(error);
			result = file$1;
		}
	}
	/**
	* Run *transformers* on a syntax tree.
	*
	* > **Note**: `run` freezes the processor if not already *frozen*.
	*
	* > **Note**: `run` performs the run phase, not other phases.
	*
	* @overload
	* @param {HeadTree extends undefined ? Node : HeadTree} tree
	* @param {RunCallback<TailTree extends undefined ? Node : TailTree>} done
	* @returns {undefined}
	*
	* @overload
	* @param {HeadTree extends undefined ? Node : HeadTree} tree
	* @param {Compatible | undefined} file
	* @param {RunCallback<TailTree extends undefined ? Node : TailTree>} done
	* @returns {undefined}
	*
	* @overload
	* @param {HeadTree extends undefined ? Node : HeadTree} tree
	* @param {Compatible | undefined} [file]
	* @returns {Promise<TailTree extends undefined ? Node : TailTree>}
	*
	* @param {HeadTree extends undefined ? Node : HeadTree} tree
	*   Tree to transform and inspect.
	* @param {(
	*   RunCallback<TailTree extends undefined ? Node : TailTree> |
	*   Compatible
	* )} [file]
	*   File associated with `node` (optional); any value accepted as `x` in
	*   `new VFile(x)`.
	* @param {RunCallback<TailTree extends undefined ? Node : TailTree>} [done]
	*   Callback (optional).
	* @returns {Promise<TailTree extends undefined ? Node : TailTree> | undefined}
	*   Nothing if `done` is given.
	*   Otherwise, a promise rejected with a fatal error or resolved with the
	*   transformed tree.
	*/
	run(tree, file, done) {
		assertNode(tree);
		this.freeze();
		const transformers = this.transformers;
		if (!done && typeof file === "function") {
			done = file;
			file = void 0;
		}
		return done ? executor(void 0, done) : new Promise(executor);
		/**
		* @param {(
		*   ((tree: TailTree extends undefined ? Node : TailTree) => undefined | void) |
		*   undefined
		* )} resolve
		* @param {(error: Error) => undefined | void} reject
		* @returns {undefined}
		*/
		function executor(resolve, reject) {
			/* @__PURE__ */ ok(typeof file !== "function", "`file` can’t be a `done` anymore, we checked");
			const realFile = vfile(file);
			transformers.run(tree, realFile, realDone);
			/**
			* @param {Error | undefined} error
			* @param {Node} outputTree
			* @param {VFile} file
			* @returns {undefined}
			*/
			function realDone(error, outputTree, file$1) {
				const resultingTree = outputTree || tree;
				if (error) reject(error);
				else if (resolve) resolve(resultingTree);
				else {
					/* @__PURE__ */ ok(done, "`done` is defined if `resolve` is not");
					done(void 0, resultingTree, file$1);
				}
			}
		}
	}
	/**
	* Run *transformers* on a syntax tree.
	*
	* An error is thrown if asynchronous transforms are configured.
	*
	* > **Note**: `runSync` freezes the processor if not already *frozen*.
	*
	* > **Note**: `runSync` performs the run phase, not other phases.
	*
	* @param {HeadTree extends undefined ? Node : HeadTree} tree
	*   Tree to transform and inspect.
	* @param {Compatible | undefined} [file]
	*   File associated with `node` (optional); any value accepted as `x` in
	*   `new VFile(x)`.
	* @returns {TailTree extends undefined ? Node : TailTree}
	*   Transformed tree.
	*/
	runSync(tree, file) {
		/** @type {boolean} */
		let complete = false;
		/** @type {(TailTree extends undefined ? Node : TailTree) | undefined} */
		let result;
		this.run(tree, file, realDone);
		assertDone("runSync", "run", complete);
		/* @__PURE__ */ ok(result, "we either bailed on an error or have a tree");
		return result;
		/**
		* @type {RunCallback<TailTree extends undefined ? Node : TailTree>}
		*/
		function realDone(error, tree$1) {
			bail(error);
			result = tree$1;
			complete = true;
		}
	}
	/**
	* Compile a syntax tree.
	*
	* > **Note**: `stringify` freezes the processor if not already *frozen*.
	*
	* > **Note**: `stringify` performs the stringify phase, not the run phase
	* > or other phases.
	*
	* @param {CompileTree extends undefined ? Node : CompileTree} tree
	*   Tree to compile.
	* @param {Compatible | undefined} [file]
	*   File associated with `node` (optional); any value accepted as `x` in
	*   `new VFile(x)`.
	* @returns {CompileResult extends undefined ? Value : CompileResult}
	*   Textual representation of the tree (see note).
	*
	*   > **Note**: unified typically compiles by serializing: most compilers
	*   > return `string` (or `Uint8Array`).
	*   > Some compilers, such as the one configured with
	*   > [`rehype-react`][rehype-react], return other values (in this case, a
	*   > React tree).
	*   > If you’re using a compiler that doesn’t serialize, expect different
	*   > result values.
	*   >
	*   > To register custom results in TypeScript, add them to
	*   > {@linkcode CompileResultMap}.
	*
	*   [rehype-react]: https://github.com/rehypejs/rehype-react
	*/
	stringify(tree, file) {
		this.freeze();
		const realFile = vfile(file);
		const compiler$1 = this.compiler || this.Compiler;
		assertCompiler("stringify", compiler$1);
		assertNode(tree);
		return compiler$1(tree, realFile);
	}
	/**
	* Configure the processor to use a plugin, a list of usable values, or a
	* preset.
	*
	* If the processor is already using a plugin, the previous plugin
	* configuration is changed based on the options that are passed in.
	* In other words, the plugin is not added a second time.
	*
	* > **Note**: `use` cannot be called on *frozen* processors.
	* > Call the processor first to create a new unfrozen processor.
	*
	* @example
	*   There are many ways to pass plugins to `.use()`.
	*   This example gives an overview:
	*
	*   ```js
	*   import {unified} from 'unified'
	*
	*   unified()
	*     // Plugin with options:
	*     .use(pluginA, {x: true, y: true})
	*     // Passing the same plugin again merges configuration (to `{x: true, y: false, z: true}`):
	*     .use(pluginA, {y: false, z: true})
	*     // Plugins:
	*     .use([pluginB, pluginC])
	*     // Two plugins, the second with options:
	*     .use([pluginD, [pluginE, {}]])
	*     // Preset with plugins and settings:
	*     .use({plugins: [pluginF, [pluginG, {}]], settings: {position: false}})
	*     // Settings only:
	*     .use({settings: {position: false}})
	*   ```
	*
	* @template {Array<unknown>} [Parameters=[]]
	* @template {Node | string | undefined} [Input=undefined]
	* @template [Output=Input]
	*
	* @overload
	* @param {Preset | null | undefined} [preset]
	* @returns {Processor<ParseTree, HeadTree, TailTree, CompileTree, CompileResult>}
	*
	* @overload
	* @param {PluggableList} list
	* @returns {Processor<ParseTree, HeadTree, TailTree, CompileTree, CompileResult>}
	*
	* @overload
	* @param {Plugin<Parameters, Input, Output>} plugin
	* @param {...(Parameters | [boolean])} parameters
	* @returns {UsePlugin<ParseTree, HeadTree, TailTree, CompileTree, CompileResult, Input, Output>}
	*
	* @param {PluggableList | Plugin | Preset | null | undefined} value
	*   Usable value.
	* @param {...unknown} parameters
	*   Parameters, when a plugin is given as a usable value.
	* @returns {Processor<ParseTree, HeadTree, TailTree, CompileTree, CompileResult>}
	*   Current processor.
	*/
	use(value, ...parameters) {
		const attachers = this.attachers;
		const namespace = this.namespace;
		assertUnfrozen("use", this.frozen);
		if (value === null || value === void 0) {} else if (typeof value === "function") addPlugin(value, parameters);
		else if (typeof value === "object") if (Array.isArray(value)) addList(value);
		else addPreset(value);
		else throw new TypeError("Expected usable value, not `" + value + "`");
		return this;
		/**
		* @param {Pluggable} value
		* @returns {undefined}
		*/
		function add(value$1) {
			if (typeof value$1 === "function") addPlugin(value$1, []);
			else if (typeof value$1 === "object") if (Array.isArray(value$1)) {
				const [plugin, ...parameters$1] = value$1;
				addPlugin(plugin, parameters$1);
			} else addPreset(value$1);
			else throw new TypeError("Expected usable value, not `" + value$1 + "`");
		}
		/**
		* @param {Preset} result
		* @returns {undefined}
		*/
		function addPreset(result) {
			if (!("plugins" in result) && !("settings" in result)) throw new Error("Expected usable value but received an empty preset, which is probably a mistake: presets typically come with `plugins` and sometimes with `settings`, but this has neither");
			addList(result.plugins);
			if (result.settings) namespace.settings = (0, import_extend.default)(true, namespace.settings, result.settings);
		}
		/**
		* @param {PluggableList | null | undefined} plugins
		* @returns {undefined}
		*/
		function addList(plugins) {
			let index$2 = -1;
			if (plugins === null || plugins === void 0) {} else if (Array.isArray(plugins)) while (++index$2 < plugins.length) {
				const thing = plugins[index$2];
				add(thing);
			}
			else throw new TypeError("Expected a list of plugins, not `" + plugins + "`");
		}
		/**
		* @param {Plugin} plugin
		* @param {Array<unknown>} parameters
		* @returns {undefined}
		*/
		function addPlugin(plugin, parameters$1) {
			let index$2 = -1;
			let entryIndex = -1;
			while (++index$2 < attachers.length) if (attachers[index$2][0] === plugin) {
				entryIndex = index$2;
				break;
			}
			if (entryIndex === -1) attachers.push([plugin, ...parameters$1]);
			else if (parameters$1.length > 0) {
				let [primary, ...rest] = parameters$1;
				const currentPrimary = attachers[entryIndex][1];
				if (isPlainObject(currentPrimary) && isPlainObject(primary)) primary = (0, import_extend.default)(true, currentPrimary, primary);
				attachers[entryIndex] = [
					plugin,
					primary,
					...rest
				];
			}
		}
	}
};
/**
* Create a new processor.
*
* @example
*   This example shows how a new processor can be created (from `remark`) and linked
*   to **stdin**(4) and **stdout**(4).
*
*   ```js
*   import process from 'node:process'
*   import concatStream from 'concat-stream'
*   import {remark} from 'remark'
*
*   process.stdin.pipe(
*     concatStream(function (buf) {
*       process.stdout.write(String(remark().processSync(buf)))
*     })
*   )
*   ```
*
* @returns
*   New *unfrozen* processor (`processor`).
*
*   This processor is configured to work the same as its ancestor.
*   When the descendant processor is configured in the future it does not
*   affect the ancestral processor.
*/
const unified = new Processor().freeze();
/**
* Assert a parser is available.
*
* @param {string} name
* @param {unknown} value
* @returns {asserts value is Parser}
*/
function assertParser(name$1, value) {
	if (typeof value !== "function") throw new TypeError("Cannot `" + name$1 + "` without `parser`");
}
/**
* Assert a compiler is available.
*
* @param {string} name
* @param {unknown} value
* @returns {asserts value is Compiler}
*/
function assertCompiler(name$1, value) {
	if (typeof value !== "function") throw new TypeError("Cannot `" + name$1 + "` without `compiler`");
}
/**
* Assert the processor is not frozen.
*
* @param {string} name
* @param {unknown} frozen
* @returns {asserts frozen is false}
*/
function assertUnfrozen(name$1, frozen) {
	if (frozen) throw new Error("Cannot call `" + name$1 + "` on a frozen processor.\nCreate a new processor first, by calling it: use `processor()` instead of `processor`.");
}
/**
* Assert `node` is a unist node.
*
* @param {unknown} node
* @returns {asserts node is Node}
*/
function assertNode(node$1) {
	if (!isPlainObject(node$1) || typeof node$1.type !== "string") throw new TypeError("Expected node, got `" + node$1 + "`");
}
/**
* Assert that `complete` is `true`.
*
* @param {string} name
* @param {string} asyncName
* @param {unknown} complete
* @returns {asserts complete is true}
*/
function assertDone(name$1, asyncName, complete) {
	if (!complete) throw new Error("`" + name$1 + "` finished async. Use `" + asyncName + "` instead");
}
/**
* @param {Compatible | undefined} [value]
* @returns {VFile}
*/
function vfile(value) {
	return looksLikeAVFile(value) ? value : new VFile(value);
}
/**
* @param {Compatible | undefined} [value]
* @returns {value is VFile}
*/
function looksLikeAVFile(value) {
	return Boolean(value && typeof value === "object" && "message" in value && "messages" in value);
}
/**
* @param {unknown} [value]
* @returns {value is Value}
*/
function looksLikeAValue(value) {
	return typeof value === "string" || isUint8Array(value);
}
/**
* Assert `value` is an `Uint8Array`.
*
* @param {unknown} value
*   thing.
* @returns {value is Uint8Array}
*   Whether `value` is an `Uint8Array`.
*/
function isUint8Array(value) {
	return Boolean(value && typeof value === "object" && "byteLength" in value && "byteOffset" in value);
}

//#endregion
//#region node_modules/react-markdown/lib/index.js
/** @type {PluggableList} */
const emptyPlugins = [];
/** @type {Readonly<RemarkRehypeOptions>} */
const emptyRemarkRehypeOptions = { allowDangerousHtml: true };
const safeProtocol$1 = /^(https?|ircs?|mailto|xmpp)$/i;
/** @type {ReadonlyArray<Readonly<Deprecation>>} */
const deprecations = [
	{
		from: "astPlugins",
		id: "remove-buggy-html-in-markdown-parser"
	},
	{
		from: "allowDangerousHtml",
		id: "remove-buggy-html-in-markdown-parser"
	},
	{
		from: "allowNode",
		id: "replace-allownode-allowedtypes-and-disallowedtypes",
		to: "allowElement"
	},
	{
		from: "allowedTypes",
		id: "replace-allownode-allowedtypes-and-disallowedtypes",
		to: "allowedElements"
	},
	{
		from: "className",
		id: "remove-classname"
	},
	{
		from: "disallowedTypes",
		id: "replace-allownode-allowedtypes-and-disallowedtypes",
		to: "disallowedElements"
	},
	{
		from: "escapeHtml",
		id: "remove-buggy-html-in-markdown-parser"
	},
	{
		from: "includeElementIndex",
		id: "#remove-includeelementindex"
	},
	{
		from: "includeNodeIndex",
		id: "change-includenodeindex-to-includeelementindex"
	},
	{
		from: "linkTarget",
		id: "remove-linktarget"
	},
	{
		from: "plugins",
		id: "change-plugins-to-remarkplugins",
		to: "remarkPlugins"
	},
	{
		from: "rawSourcePos",
		id: "#remove-rawsourcepos"
	},
	{
		from: "renderers",
		id: "change-renderers-to-components",
		to: "components"
	},
	{
		from: "source",
		id: "change-source-to-children",
		to: "children"
	},
	{
		from: "sourcePos",
		id: "#remove-sourcepos"
	},
	{
		from: "transformImageUri",
		id: "#add-urltransform",
		to: "urlTransform"
	},
	{
		from: "transformLinkUri",
		id: "#add-urltransform",
		to: "urlTransform"
	}
];
/**
* Component to render markdown.
*
* This is a synchronous component.
* When using async plugins,
* see {@linkcode MarkdownAsync} or {@linkcode MarkdownHooks}.
*
* @param {Readonly<Options>} options
*   Props.
* @returns {ReactElement}
*   React element.
*/
function Markdown(options) {
	const processor = createProcessor(options);
	const file = createFile(options);
	return post(processor.runSync(processor.parse(file), file), options);
}
/**
* Set up the `unified` processor.
*
* @param {Readonly<Options>} options
*   Props.
* @returns {Processor<MdastRoot, MdastRoot, Root, undefined, undefined>}
*   Result.
*/
function createProcessor(options) {
	const rehypePlugins = options.rehypePlugins || emptyPlugins;
	const remarkPlugins = options.remarkPlugins || emptyPlugins;
	const remarkRehypeOptions = options.remarkRehypeOptions ? {
		...options.remarkRehypeOptions,
		...emptyRemarkRehypeOptions
	} : emptyRemarkRehypeOptions;
	return unified().use(remarkParse).use(remarkPlugins).use(remarkRehype, remarkRehypeOptions).use(rehypePlugins);
}
/**
* Set up the virtual file.
*
* @param {Readonly<Options>} options
*   Props.
* @returns {VFile}
*   Result.
*/
function createFile(options) {
	const children$1 = options.children || "";
	const file = new VFile();
	if (typeof children$1 === "string") file.value = children$1;
	else /* @__PURE__ */ unreachable("Unexpected value `" + children$1 + "` for `children` prop, expected `string`");
	return file;
}
/**
* Process the result from unified some more.
*
* @param {Nodes} tree
*   Tree.
* @param {Readonly<Options>} options
*   Props.
* @returns {ReactElement}
*   React element.
*/
function post(tree, options) {
	const allowedElements = options.allowedElements;
	const allowElement = options.allowElement;
	const components$1 = options.components;
	const disallowedElements = options.disallowedElements;
	const skipHtml = options.skipHtml;
	const unwrapDisallowed = options.unwrapDisallowed;
	const urlTransform = options.urlTransform || defaultUrlTransform;
	for (const deprecation of deprecations) if (Object.hasOwn(options, deprecation.from)) /* @__PURE__ */ unreachable("Unexpected `" + deprecation.from + "` prop, " + (deprecation.to ? "use `" + deprecation.to + "` instead" : "remove it") + " (see <https://github.com/remarkjs/react-markdown/blob/main/changelog.md#" + deprecation.id + "> for more info)");
	if (allowedElements && disallowedElements) /* @__PURE__ */ unreachable("Unexpected combined `allowedElements` and `disallowedElements`, expected one or the other");
	visit(tree, transform$1);
	return toJsxRuntime(tree, {
		Fragment: react_jsx_runtime.Fragment,
		components: components$1,
		ignoreInvalidStyle: true,
		jsx: react_jsx_runtime.jsx,
		jsxs: react_jsx_runtime.jsxs,
		passKeys: true,
		passNode: true
	});
	/** @type {BuildVisitor<Root>} */
	function transform$1(node$1, index$2, parent) {
		if (node$1.type === "raw" && parent && typeof index$2 === "number") {
			if (skipHtml) parent.children.splice(index$2, 1);
			else parent.children[index$2] = {
				type: "text",
				value: node$1.value
			};
			return index$2;
		}
		if (node$1.type === "element") {
			/** @type {string} */
			let key;
			for (key in urlAttributes) if (Object.hasOwn(urlAttributes, key) && Object.hasOwn(node$1.properties, key)) {
				const value = node$1.properties[key];
				const test = urlAttributes[key];
				if (test === null || test.includes(node$1.tagName)) node$1.properties[key] = urlTransform(String(value || ""), key, node$1);
			}
		}
		if (node$1.type === "element") {
			let remove = allowedElements ? !allowedElements.includes(node$1.tagName) : disallowedElements ? disallowedElements.includes(node$1.tagName) : false;
			if (!remove && allowElement && typeof index$2 === "number") remove = !allowElement(node$1, index$2, parent);
			if (remove && parent && typeof index$2 === "number") {
				if (unwrapDisallowed && node$1.children) parent.children.splice(index$2, 1, ...node$1.children);
				else parent.children.splice(index$2, 1);
				return index$2;
			}
		}
	}
}
/**
* Make a URL safe.
*
* @satisfies {UrlTransform}
* @param {string} value
*   URL.
* @returns {string}
*   Safe URL.
*/
function defaultUrlTransform(value) {
	const colon = value.indexOf(":");
	const questionMark = value.indexOf("?");
	const numberSign = value.indexOf("#");
	const slash = value.indexOf("/");
	if (colon === -1 || slash !== -1 && colon > slash || questionMark !== -1 && colon > questionMark || numberSign !== -1 && colon > numberSign || safeProtocol$1.test(value.slice(0, colon))) return value;
	return "";
}

//#endregion
//#region node_modules/hast-util-parse-selector/lib/index.js
/**
* @typedef {import('hast').Element} Element
* @typedef {import('hast').Properties} Properties
*/
/**
* @template {string} SimpleSelector
*   Selector type.
* @template {string} DefaultTagName
*   Default tag name.
* @typedef {(
*   SimpleSelector extends ''
*     ? DefaultTagName
*     : SimpleSelector extends `${infer TagName}.${infer Rest}`
*     ? ExtractTagName<TagName, DefaultTagName>
*     : SimpleSelector extends `${infer TagName}#${infer Rest}`
*     ? ExtractTagName<TagName, DefaultTagName>
*     : SimpleSelector extends string
*     ? SimpleSelector
*     : DefaultTagName
* )} ExtractTagName
*   Extract tag name from a simple selector.
*/
const search = /[#.]/g;
/**
* Create a hast element from a simple CSS selector.
*
* @template {string} Selector
*   Type of selector.
* @template {string} [DefaultTagName='div']
*   Type of default tag name (default: `'div'`).
* @param {Selector | null | undefined} [selector]
*   Simple CSS selector (optional).
*
*   Can contain a tag name (`foo`), classes (`.bar`), and an ID (`#baz`).
*   Multiple classes are allowed.
*   Uses the last ID if multiple IDs are found.
* @param {DefaultTagName | null | undefined} [defaultTagName='div']
*   Tag name to use if `selector` does not specify one (default: `'div'`).
* @returns {Element & {tagName: ExtractTagName<Selector, DefaultTagName>}}
*   Built element.
*/
function parseSelector(selector, defaultTagName) {
	const value = selector || "";
	/** @type {Properties} */
	const props = {};
	let start = 0;
	/** @type {string | undefined} */
	let previous$2;
	/** @type {string | undefined} */
	let tagName;
	while (start < value.length) {
		search.lastIndex = start;
		const match = search.exec(value);
		const subvalue = value.slice(start, match ? match.index : value.length);
		if (subvalue) {
			if (!previous$2) tagName = subvalue;
			else if (previous$2 === "#") props.id = subvalue;
			else if (Array.isArray(props.className)) props.className.push(subvalue);
			else props.className = [subvalue];
			start += subvalue.length;
		}
		if (match) {
			previous$2 = match[0];
			start++;
		}
	}
	return {
		type: "element",
		tagName: tagName || defaultTagName || "div",
		properties: props,
		children: []
	};
}

//#endregion
//#region node_modules/hastscript/lib/create-h.js
/**
* @param {Schema} schema
*   Schema to use.
* @param {string} defaultTagName
*   Default tag name.
* @param {ReadonlyArray<string> | undefined} [caseSensitive]
*   Case-sensitive tag names (default: `undefined`).
* @returns
*   `h`.
*/
function createH(schema, defaultTagName, caseSensitive) {
	const adjust = caseSensitive ? createAdjustMap(caseSensitive) : void 0;
	/**
	* Hyperscript compatible DSL for creating virtual hast trees.
	*
	* @overload
	* @param {null | undefined} [selector]
	* @param {...Child} children
	* @returns {Root}
	*
	* @overload
	* @param {string} selector
	* @param {Properties} properties
	* @param {...Child} children
	* @returns {Element}
	*
	* @overload
	* @param {string} selector
	* @param {...Child} children
	* @returns {Element}
	*
	* @param {string | null | undefined} [selector]
	*   Selector.
	* @param {Child | Properties | null | undefined} [properties]
	*   Properties (or first child) (default: `undefined`).
	* @param {...Child} children
	*   Children.
	* @returns {Result}
	*   Result.
	*/
	function h$1(selector, properties$1, ...children$1) {
		/** @type {Result} */
		let node$1;
		if (selector === null || selector === void 0) {
			node$1 = {
				type: "root",
				children: []
			};
			const child = properties$1;
			children$1.unshift(child);
		} else {
			node$1 = parseSelector(selector, defaultTagName);
			const lower = node$1.tagName.toLowerCase();
			node$1.tagName = (adjust ? adjust.get(lower) : void 0) || lower;
			if (isChild(properties$1)) children$1.unshift(properties$1);
			else for (const [key, value] of Object.entries(properties$1)) addProperty(schema, node$1.properties, key, value);
		}
		for (const child of children$1) addChild(node$1.children, child);
		if (node$1.type === "element" && node$1.tagName === "template") {
			node$1.content = {
				type: "root",
				children: node$1.children
			};
			node$1.children = [];
		}
		return node$1;
	}
	return h$1;
}
/**
* Check if something is properties or a child.
*
* @param {Child | Properties} value
*   Value to check.
* @returns {value is Child}
*   Whether `value` is definitely a child.
*/
function isChild(value) {
	if (value === null || typeof value !== "object" || Array.isArray(value)) return true;
	if (typeof value.type !== "string") return false;
	const record = value;
	const keys$1 = Object.keys(value);
	for (const key of keys$1) {
		const value$1 = record[key];
		if (value$1 && typeof value$1 === "object") {
			if (!Array.isArray(value$1)) return true;
			const list$3 = value$1;
			for (const item of list$3) if (typeof item !== "number" && typeof item !== "string") return true;
		}
	}
	if ("children" in value && Array.isArray(value.children)) return true;
	return false;
}
/**
* @param {Schema} schema
*   Schema.
* @param {Properties} properties
*   Properties object.
* @param {string} key
*   Property name.
* @param {PropertyValue | Style} value
*   Property value.
* @returns {undefined}
*   Nothing.
*/
function addProperty(schema, properties$1, key, value) {
	const info = find(schema, key);
	/** @type {PropertyValue} */
	let result;
	if (value === null || value === void 0) return;
	if (typeof value === "number") {
		if (Number.isNaN(value)) return;
		result = value;
	} else if (typeof value === "boolean") result = value;
	else if (typeof value === "string") if (info.spaceSeparated) result = parse$1(value);
	else if (info.commaSeparated) result = parse(value);
	else if (info.commaOrSpaceSeparated) result = parse$1(parse(value).join(" "));
	else result = parsePrimitive(info, info.property, value);
	else if (Array.isArray(value)) result = [...value];
	else result = info.property === "style" ? style(value) : String(value);
	if (Array.isArray(result)) {
		/** @type {Array<number | string>} */
		const finalResult = [];
		for (const item of result) finalResult.push(parsePrimitive(info, info.property, item));
		result = finalResult;
	}
	if (info.property === "className" && Array.isArray(properties$1.className)) result = properties$1.className.concat(result);
	properties$1[info.property] = result;
}
/**
* @param {Array<RootContent>} nodes
*   Children.
* @param {Child} value
*   Child.
* @returns {undefined}
*   Nothing.
*/
function addChild(nodes, value) {
	if (value === null || value === void 0) {} else if (typeof value === "number" || typeof value === "string") nodes.push({
		type: "text",
		value: String(value)
	});
	else if (Array.isArray(value)) for (const child of value) addChild(nodes, child);
	else if (typeof value === "object" && "type" in value) if (value.type === "root") addChild(nodes, value.children);
	else nodes.push(value);
	else throw new Error("Expected node, nodes, or string, got `" + value + "`");
}
/**
* Parse a single primitives.
*
* @param {Info} info
*   Property information.
* @param {string} name
*   Property name.
* @param {PrimitiveValue} value
*   Property value.
* @returns {PrimitiveValue}
*   Property value.
*/
function parsePrimitive(info, name$1, value) {
	if (typeof value === "string") {
		if (info.number && value && !Number.isNaN(Number(value))) return Number(value);
		if ((info.boolean || info.overloadedBoolean) && (value === "" || normalize(value) === normalize(name$1))) return true;
	}
	return value;
}
/**
* Serialize a `style` object as a string.
*
* @param {Style} styles
*   Style object.
* @returns {string}
*   CSS string.
*/
function style(styles) {
	/** @type {Array<string>} */
	const result = [];
	for (const [key, value] of Object.entries(styles)) result.push([key, value].join(": "));
	return result.join("; ");
}
/**
* Create a map to adjust casing.
*
* @param {ReadonlyArray<string>} values
*   List of properly cased keys.
* @returns {Map<string, string>}
*   Map of lowercase keys to uppercase keys.
*/
function createAdjustMap(values) {
	/** @type {Map<string, string>} */
	const result = /* @__PURE__ */ new Map();
	for (const value of values) result.set(value.toLowerCase(), value);
	return result;
}

//#endregion
//#region node_modules/hastscript/lib/svg-case-sensitive-tag-names.js
/**
* List of case-sensitive SVG tag names.
*
* @type {ReadonlyArray<string>}
*/
const svgCaseSensitiveTagNames = [
	"altGlyph",
	"altGlyphDef",
	"altGlyphItem",
	"animateColor",
	"animateMotion",
	"animateTransform",
	"clipPath",
	"feBlend",
	"feColorMatrix",
	"feComponentTransfer",
	"feComposite",
	"feConvolveMatrix",
	"feDiffuseLighting",
	"feDisplacementMap",
	"feDistantLight",
	"feDropShadow",
	"feFlood",
	"feFuncA",
	"feFuncB",
	"feFuncG",
	"feFuncR",
	"feGaussianBlur",
	"feImage",
	"feMerge",
	"feMergeNode",
	"feMorphology",
	"feOffset",
	"fePointLight",
	"feSpecularLighting",
	"feSpotLight",
	"feTile",
	"feTurbulence",
	"foreignObject",
	"glyphRef",
	"linearGradient",
	"radialGradient",
	"solidColor",
	"textArea",
	"textPath"
];

//#endregion
//#region node_modules/hastscript/lib/index.js
/** @type {ReturnType<createH>} */
const h = createH(html$1, "div");
/** @type {ReturnType<createH>} */
const s = createH(svg, "g", svgCaseSensitiveTagNames);

//#endregion
//#region node_modules/vfile-location/lib/index.js
/**
* @import {VFile, Value} from 'vfile'
* @import {Location} from 'vfile-location'
*/
/**
* Create an index of the given document to translate between line/column and
* offset based positional info.
*
* Also implemented in Rust in [`wooorm/markdown-rs`][markdown-rs].
*
* [markdown-rs]: https://github.com/wooorm/markdown-rs/blob/main/src/util/location.rs
*
* @param {VFile | Value} file
*   File to index.
* @returns {Location}
*   Accessors for index.
*/
function location(file) {
	const value = String(file);
	/**
	* List, where each index is a line number (0-based), and each value is the
	* byte index *after* where the line ends.
	*
	* @type {Array<number>}
	*/
	const indices = [];
	return {
		toOffset,
		toPoint
	};
	/** @type {Location['toPoint']} */
	function toPoint(offset) {
		if (typeof offset === "number" && offset > -1 && offset <= value.length) {
			let index$2 = 0;
			while (true) {
				let end = indices[index$2];
				if (end === void 0) {
					const eol = next(value, indices[index$2 - 1]);
					end = eol === -1 ? value.length + 1 : eol + 1;
					indices[index$2] = end;
				}
				if (end > offset) return {
					line: index$2 + 1,
					column: offset - (index$2 > 0 ? indices[index$2 - 1] : 0) + 1,
					offset
				};
				index$2++;
			}
		}
	}
	/** @type {Location['toOffset']} */
	function toOffset(point$4) {
		if (point$4 && typeof point$4.line === "number" && typeof point$4.column === "number" && !Number.isNaN(point$4.line) && !Number.isNaN(point$4.column)) {
			while (indices.length < point$4.line) {
				const from = indices[indices.length - 1];
				const eol = next(value, from);
				const end = eol === -1 ? value.length + 1 : eol + 1;
				if (from === end) break;
				indices.push(end);
			}
			const offset = (point$4.line > 1 ? indices[point$4.line - 2] : 0) + point$4.column - 1;
			if (offset < indices[point$4.line - 1]) return offset;
		}
	}
}
/**
* @param {string} value
* @param {number} from
*/
function next(value, from) {
	const cr = value.indexOf("\r", from);
	const lf = value.indexOf("\n", from);
	if (lf === -1) return cr;
	if (cr === -1 || cr + 1 === lf) return lf;
	return cr < lf ? cr : lf;
}

//#endregion
//#region node_modules/web-namespaces/index.js
/**
* Map of web namespaces.
*
* @type {Record<string, string>}
*/
const webNamespaces = {
	html: "http://www.w3.org/1999/xhtml",
	mathml: "http://www.w3.org/1998/Math/MathML",
	svg: "http://www.w3.org/2000/svg",
	xlink: "http://www.w3.org/1999/xlink",
	xml: "http://www.w3.org/XML/1998/namespace",
	xmlns: "http://www.w3.org/2000/xmlns/"
};

//#endregion
//#region node_modules/hast-util-from-parse5/lib/index.js
const own$3 = {}.hasOwnProperty;
/** @type {unknown} */
const proto = Object.prototype;
/**
* Transform a `parse5` AST to hast.
*
* @param {DefaultTreeAdapterMap['node']} tree
*   `parse5` tree to transform.
* @param {Options | null | undefined} [options]
*   Configuration (optional).
* @returns {Nodes}
*   hast tree.
*/
function fromParse5(tree, options) {
	const settings = options || {};
	return one$1({
		file: settings.file || void 0,
		location: false,
		schema: settings.space === "svg" ? svg : html$1,
		verbose: settings.verbose || false
	}, tree);
}
/**
* Transform a node.
*
* @param {State} state
*   Info passed around about the current state.
* @param {DefaultTreeAdapterMap['node']} node
*   p5 node.
* @returns {Nodes}
*   hast node.
*/
function one$1(state, node$1) {
	/** @type {Nodes} */
	let result;
	switch (node$1.nodeName) {
		case "#comment": {
			const reference = node$1;
			result = {
				type: "comment",
				value: reference.data
			};
			patch$2(state, reference, result);
			return result;
		}
		case "#document":
		case "#document-fragment": {
			const reference = node$1;
			const quirksMode = "mode" in reference ? reference.mode === "quirks" || reference.mode === "limited-quirks" : false;
			result = {
				type: "root",
				children: all$2(state, node$1.childNodes),
				data: { quirksMode }
			};
			if (state.file && state.location) {
				const document$3 = String(state.file);
				const loc = location(document$3);
				const start = loc.toPoint(0);
				const end = loc.toPoint(document$3.length);
				/* @__PURE__ */ ok(start, "expected `start`");
				/* @__PURE__ */ ok(end, "expected `end`");
				result.position = {
					start,
					end
				};
			}
			return result;
		}
		case "#documentType": {
			const reference = node$1;
			result = { type: "doctype" };
			patch$2(state, reference, result);
			return result;
		}
		case "#text": {
			const reference = node$1;
			result = {
				type: "text",
				value: reference.value
			};
			patch$2(state, reference, result);
			return result;
		}
		default:
			result = element$3(state, node$1);
			return result;
	}
}
/**
* Transform children.
*
* @param {State} state
*   Info passed around about the current state.
* @param {Array<DefaultTreeAdapterMap['node']>} nodes
*   Nodes.
* @returns {Array<RootContent>}
*   hast nodes.
*/
function all$2(state, nodes) {
	let index$2 = -1;
	/** @type {Array<RootContent>} */
	const results = [];
	while (++index$2 < nodes.length) {
		const result = one$1(state, nodes[index$2]);
		results.push(result);
	}
	return results;
}
/**
* Transform an element.
*
* @param {State} state
*   Info passed around about the current state.
* @param {DefaultTreeAdapterMap['element']} node
*   `parse5` node to transform.
* @returns {Element}
*   hast node.
*/
function element$3(state, node$1) {
	const schema = state.schema;
	state.schema = node$1.namespaceURI === webNamespaces.svg ? svg : html$1;
	let index$2 = -1;
	/** @type {Record<string, string>} */
	const properties$1 = {};
	while (++index$2 < node$1.attrs.length) {
		const attribute = node$1.attrs[index$2];
		const name$1 = (attribute.prefix ? attribute.prefix + ":" : "") + attribute.name;
		if (!own$3.call(proto, name$1)) properties$1[name$1] = attribute.value;
	}
	const result = (state.schema.space === "svg" ? s : h)(node$1.tagName, properties$1, all$2(state, node$1.childNodes));
	patch$2(state, node$1, result);
	if (result.tagName === "template") {
		const reference = node$1;
		const pos = reference.sourceCodeLocation;
		const startTag$1 = pos && pos.startTag && position$1(pos.startTag);
		const endTag$1 = pos && pos.endTag && position$1(pos.endTag);
		const content$2 = one$1(state, reference.content);
		if (startTag$1 && endTag$1 && state.file) content$2.position = {
			start: startTag$1.end,
			end: endTag$1.start
		};
		result.content = content$2;
	}
	state.schema = schema;
	return result;
}
/**
* Patch positional info from `from` onto `to`.
*
* @param {State} state
*   Info passed around about the current state.
* @param {DefaultTreeAdapterMap['node']} from
*   p5 node.
* @param {Nodes} to
*   hast node.
* @returns {undefined}
*   Nothing.
*/
function patch$2(state, from, to) {
	if ("sourceCodeLocation" in from && from.sourceCodeLocation && state.file) {
		const position$3 = createLocation(state, to, from.sourceCodeLocation);
		if (position$3) {
			state.location = true;
			to.position = position$3;
		}
	}
}
/**
* Create clean positional information.
*
* @param {State} state
*   Info passed around about the current state.
* @param {Nodes} node
*   hast node.
* @param {Token.ElementLocation} location
*   p5 location info.
* @returns {Position | undefined}
*   Position, or nothing.
*/
function createLocation(state, node$1, location$1) {
	const result = position$1(location$1);
	if (node$1.type === "element") {
		const tail = node$1.children[node$1.children.length - 1];
		if (result && !location$1.endTag && tail && tail.position && tail.position.end) result.end = Object.assign({}, tail.position.end);
		if (state.verbose) {
			/** @type {Record<string, Position | undefined>} */
			const properties$1 = {};
			/** @type {string} */
			let key;
			if (location$1.attrs) {
				for (key in location$1.attrs) if (own$3.call(location$1.attrs, key)) properties$1[find(state.schema, key).property] = position$1(location$1.attrs[key]);
			}
			/* @__PURE__ */ ok(location$1.startTag, "a start tag should exist");
			const opening = position$1(location$1.startTag);
			const closing = location$1.endTag ? position$1(location$1.endTag) : void 0;
			/** @type {ElementData['position']} */
			const data = { opening };
			if (closing) data.closing = closing;
			data.properties = properties$1;
			node$1.data = { position: data };
		}
	}
	return result;
}
/**
* Turn a p5 location into a position.
*
* @param {Token.Location} loc
*   Location.
* @returns {Position | undefined}
*   Position or nothing.
*/
function position$1(loc) {
	const start = point({
		line: loc.startLine,
		column: loc.startCol,
		offset: loc.startOffset
	});
	const end = point({
		line: loc.endLine,
		column: loc.endCol,
		offset: loc.endOffset
	});
	return start || end ? {
		start,
		end
	} : void 0;
}
/**
* Filter out invalid points.
*
* @param {Point} point
*   Point with potentially `undefined` values.
* @returns {Point | undefined}
*   Point or nothing.
*/
function point(point$4) {
	return point$4.line && point$4.column ? point$4 : void 0;
}

//#endregion
//#region node_modules/zwitch/index.js
/**
* @callback Handler
*   Handle a value, with a certain ID field set to a certain value.
*   The ID field is passed to `zwitch`, and it’s value is this function’s
*   place on the `handlers` record.
* @param {...any} parameters
*   Arbitrary parameters passed to the zwitch.
*   The first will be an object with a certain ID field set to a certain value.
* @returns {any}
*   Anything!
*/
/**
* @callback UnknownHandler
*   Handle values that do have a certain ID field, but it’s set to a value
*   that is not listed in the `handlers` record.
* @param {unknown} value
*   An object with a certain ID field set to an unknown value.
* @param {...any} rest
*   Arbitrary parameters passed to the zwitch.
* @returns {any}
*   Anything!
*/
/**
* @callback InvalidHandler
*   Handle values that do not have a certain ID field.
* @param {unknown} value
*   Any unknown value.
* @param {...any} rest
*   Arbitrary parameters passed to the zwitch.
* @returns {void|null|undefined|never}
*   This should crash or return nothing.
*/
/**
* @template {InvalidHandler} [Invalid=InvalidHandler]
* @template {UnknownHandler} [Unknown=UnknownHandler]
* @template {Record<string, Handler>} [Handlers=Record<string, Handler>]
* @typedef Options
*   Configuration (required).
* @property {Invalid} [invalid]
*   Handler to use for invalid values.
* @property {Unknown} [unknown]
*   Handler to use for unknown values.
* @property {Handlers} [handlers]
*   Handlers to use.
*/
const own$2 = {}.hasOwnProperty;
/**
* Handle values based on a field.
*
* @template {InvalidHandler} [Invalid=InvalidHandler]
* @template {UnknownHandler} [Unknown=UnknownHandler]
* @template {Record<string, Handler>} [Handlers=Record<string, Handler>]
* @param {string} key
*   Field to switch on.
* @param {Options<Invalid, Unknown, Handlers>} [options]
*   Configuration (required).
* @returns {{unknown: Unknown, invalid: Invalid, handlers: Handlers, (...parameters: Parameters<Handlers[keyof Handlers]>): ReturnType<Handlers[keyof Handlers]>, (...parameters: Parameters<Unknown>): ReturnType<Unknown>}}
*/
function zwitch(key, options) {
	const settings = options || {};
	/**
	* Handle one value.
	*
	* Based on the bound `key`, a respective handler will be called.
	* If `value` is not an object, or doesn’t have a `key` property, the special
	* “invalid” handler will be called.
	* If `value` has an unknown `key`, the special “unknown” handler will be
	* called.
	*
	* All arguments, and the context object, are passed through to the handler,
	* and it’s result is returned.
	*
	* @this {unknown}
	*   Any context object.
	* @param {unknown} [value]
	*   Any value.
	* @param {...unknown} parameters
	*   Arbitrary parameters passed to the zwitch.
	* @property {Handler} invalid
	*   Handle for values that do not have a certain ID field.
	* @property {Handler} unknown
	*   Handle values that do have a certain ID field, but it’s set to a value
	*   that is not listed in the `handlers` record.
	* @property {Handlers} handlers
	*   Record of handlers.
	* @returns {unknown}
	*   Anything.
	*/
	function one$4(value, ...parameters) {
		/** @type {Handler|undefined} */
		let fn = one$4.invalid;
		const handlers$1 = one$4.handlers;
		if (value && own$2.call(value, key)) {
			const id = String(value[key]);
			fn = own$2.call(handlers$1, id) ? handlers$1[id] : one$4.unknown;
		}
		if (fn) return fn.call(this, value, ...parameters);
	}
	one$4.handlers = settings.handlers || {};
	one$4.invalid = settings.invalid;
	one$4.unknown = settings.unknown;
	return one$4;
}

//#endregion
//#region node_modules/hast-util-to-parse5/lib/index.js
/** @type {Options} */
const emptyOptions$1 = {};
const own$1 = {}.hasOwnProperty;
const one = zwitch("type", { handlers: {
	root: root$3,
	element: element$2,
	text: text$4,
	comment: comment$2,
	doctype: doctype$2
} });
/**
* Transform a hast tree to a `parse5` AST.
*
* @param {Nodes} tree
*   Tree to transform.
* @param {Options | null | undefined} [options]
*   Configuration (optional).
* @returns {Parse5Nodes}
*   `parse5` node.
*/
function toParse5(tree, options) {
	const space$1 = (options || emptyOptions$1).space;
	return one(tree, space$1 === "svg" ? svg : html$1);
}
/**
* @param {Root} node
*   Node (hast) to transform.
* @param {Schema} schema
*   Current schema.
* @returns {Parse5Document}
*   Parse5 node.
*/
function root$3(node$1, schema) {
	/** @type {Parse5Document} */
	const result = {
		nodeName: "#document",
		mode: (node$1.data || {}).quirksMode ? "quirks" : "no-quirks",
		childNodes: []
	};
	result.childNodes = all$1(node$1.children, result, schema);
	patch$1(node$1, result);
	return result;
}
/**
* @param {Root} node
*   Node (hast) to transform.
* @param {Schema} schema
*   Current schema.
* @returns {Parse5Fragment}
*   Parse5 node.
*/
function fragment(node$1, schema) {
	/** @type {Parse5Fragment} */
	const result = {
		nodeName: "#document-fragment",
		childNodes: []
	};
	result.childNodes = all$1(node$1.children, result, schema);
	patch$1(node$1, result);
	return result;
}
/**
* @param {Doctype} node
*   Node (hast) to transform.
* @returns {Parse5Doctype}
*   Parse5 node.
*/
function doctype$2(node$1) {
	/** @type {Parse5Doctype} */
	const result = {
		nodeName: "#documentType",
		name: "html",
		publicId: "",
		systemId: "",
		parentNode: null
	};
	patch$1(node$1, result);
	return result;
}
/**
* @param {Text} node
*   Node (hast) to transform.
* @returns {Parse5Text}
*   Parse5 node.
*/
function text$4(node$1) {
	/** @type {Parse5Text} */
	const result = {
		nodeName: "#text",
		value: node$1.value,
		parentNode: null
	};
	patch$1(node$1, result);
	return result;
}
/**
* @param {Comment} node
*   Node (hast) to transform.
* @returns {Parse5Comment}
*   Parse5 node.
*/
function comment$2(node$1) {
	/** @type {Parse5Comment} */
	const result = {
		nodeName: "#comment",
		data: node$1.value,
		parentNode: null
	};
	patch$1(node$1, result);
	return result;
}
/**
* @param {Element} node
*   Node (hast) to transform.
* @param {Schema} schema
*   Current schema.
* @returns {Parse5Element}
*   Parse5 node.
*/
function element$2(node$1, schema) {
	const parentSchema = schema;
	let currentSchema = parentSchema;
	if (node$1.type === "element" && node$1.tagName.toLowerCase() === "svg" && parentSchema.space === "html") currentSchema = svg;
	/** @type {Array<Parse5Attribute>} */
	const attrs = [];
	/** @type {string} */
	let prop;
	if (node$1.properties) {
		for (prop in node$1.properties) if (prop !== "children" && own$1.call(node$1.properties, prop)) {
			const result$1 = createProperty(currentSchema, prop, node$1.properties[prop]);
			if (result$1) attrs.push(result$1);
		}
	}
	const space$1 = currentSchema.space;
	/* @__PURE__ */ ok(space$1);
	/** @type {Parse5Element} */
	const result = {
		nodeName: node$1.tagName,
		tagName: node$1.tagName,
		attrs,
		namespaceURI: webNamespaces[space$1],
		childNodes: [],
		parentNode: null
	};
	result.childNodes = all$1(node$1.children, result, currentSchema);
	patch$1(node$1, result);
	if (node$1.tagName === "template" && node$1.content) result.content = fragment(node$1.content, currentSchema);
	return result;
}
/**
* Handle a property.
*
* @param {Schema} schema
*   Current schema.
* @param {string} prop
*   Key.
* @param {Array<number | string> | boolean | number | string | null | undefined} value
*   hast property value.
* @returns {Parse5Attribute | undefined}
*   Field for runtime, optional.
*/
function createProperty(schema, prop, value) {
	const info = find(schema, prop);
	if (value === false || value === null || value === void 0 || typeof value === "number" && Number.isNaN(value) || !value && info.boolean) return;
	if (Array.isArray(value)) value = info.commaSeparated ? stringify(value) : stringify$1(value);
	/** @type {Parse5Attribute} */
	const attribute = {
		name: info.attribute,
		value: value === true ? "" : String(value)
	};
	if (info.space && info.space !== "html" && info.space !== "svg") {
		const index$2 = attribute.name.indexOf(":");
		if (index$2 < 0) attribute.prefix = "";
		else {
			attribute.name = attribute.name.slice(index$2 + 1);
			attribute.prefix = info.attribute.slice(0, index$2);
		}
		attribute.namespace = webNamespaces[info.space];
	}
	return attribute;
}
/**
* Transform all hast nodes.
*
* @param {Array<RootContent>} children
*   List of children.
* @param {Parse5Parent} parentNode
*   `parse5` parent node.
* @param {Schema} schema
*   Current schema.
* @returns {Array<Parse5Content>}
*   Transformed children.
*/
function all$1(children$1, parentNode, schema) {
	let index$2 = -1;
	/** @type {Array<Parse5Content>} */
	const results = [];
	if (children$1) while (++index$2 < children$1.length) {
		/** @type {Parse5Content} */
		const child = one(children$1[index$2], schema);
		child.parentNode = parentNode;
		results.push(child);
	}
	return results;
}
/**
* Add position info from `from` to `to`.
*
* @param {Nodes} from
*   hast node.
* @param {Parse5Nodes} to
*   `parse5` node.
* @returns {undefined}
*   Nothing.
*/
function patch$1(from, to) {
	const position$3 = from.position;
	if (position$3 && position$3.start && position$3.end) {
		/* @__PURE__ */ ok(typeof position$3.start.offset === "number");
		/* @__PURE__ */ ok(typeof position$3.end.offset === "number");
		to.sourceCodeLocation = {
			startLine: position$3.start.line,
			startCol: position$3.start.column,
			startOffset: position$3.start.offset,
			endLine: position$3.end.line,
			endCol: position$3.end.column,
			endOffset: position$3.end.offset
		};
	}
}

//#endregion
//#region node_modules/html-void-elements/index.js
/**
* List of HTML void tag names.
*
* @type {Array<string>}
*/
const htmlVoidElements = [
	"area",
	"base",
	"basefont",
	"bgsound",
	"br",
	"col",
	"command",
	"embed",
	"frame",
	"hr",
	"image",
	"img",
	"input",
	"keygen",
	"link",
	"meta",
	"param",
	"source",
	"track",
	"wbr"
];

//#endregion
//#region node_modules/hast-util-raw/node_modules/parse5/dist/common/unicode.js
const UNDEFINED_CODE_POINTS = new Set([
	65534,
	65535,
	131070,
	131071,
	196606,
	196607,
	262142,
	262143,
	327678,
	327679,
	393214,
	393215,
	458750,
	458751,
	524286,
	524287,
	589822,
	589823,
	655358,
	655359,
	720894,
	720895,
	786430,
	786431,
	851966,
	851967,
	917502,
	917503,
	983038,
	983039,
	1048574,
	1048575,
	1114110,
	1114111
]);
const REPLACEMENT_CHARACTER = "�";
var CODE_POINTS;
(function(CODE_POINTS$1) {
	CODE_POINTS$1[CODE_POINTS$1["EOF"] = -1] = "EOF";
	CODE_POINTS$1[CODE_POINTS$1["NULL"] = 0] = "NULL";
	CODE_POINTS$1[CODE_POINTS$1["TABULATION"] = 9] = "TABULATION";
	CODE_POINTS$1[CODE_POINTS$1["CARRIAGE_RETURN"] = 13] = "CARRIAGE_RETURN";
	CODE_POINTS$1[CODE_POINTS$1["LINE_FEED"] = 10] = "LINE_FEED";
	CODE_POINTS$1[CODE_POINTS$1["FORM_FEED"] = 12] = "FORM_FEED";
	CODE_POINTS$1[CODE_POINTS$1["SPACE"] = 32] = "SPACE";
	CODE_POINTS$1[CODE_POINTS$1["EXCLAMATION_MARK"] = 33] = "EXCLAMATION_MARK";
	CODE_POINTS$1[CODE_POINTS$1["QUOTATION_MARK"] = 34] = "QUOTATION_MARK";
	CODE_POINTS$1[CODE_POINTS$1["AMPERSAND"] = 38] = "AMPERSAND";
	CODE_POINTS$1[CODE_POINTS$1["APOSTROPHE"] = 39] = "APOSTROPHE";
	CODE_POINTS$1[CODE_POINTS$1["HYPHEN_MINUS"] = 45] = "HYPHEN_MINUS";
	CODE_POINTS$1[CODE_POINTS$1["SOLIDUS"] = 47] = "SOLIDUS";
	CODE_POINTS$1[CODE_POINTS$1["DIGIT_0"] = 48] = "DIGIT_0";
	CODE_POINTS$1[CODE_POINTS$1["DIGIT_9"] = 57] = "DIGIT_9";
	CODE_POINTS$1[CODE_POINTS$1["SEMICOLON"] = 59] = "SEMICOLON";
	CODE_POINTS$1[CODE_POINTS$1["LESS_THAN_SIGN"] = 60] = "LESS_THAN_SIGN";
	CODE_POINTS$1[CODE_POINTS$1["EQUALS_SIGN"] = 61] = "EQUALS_SIGN";
	CODE_POINTS$1[CODE_POINTS$1["GREATER_THAN_SIGN"] = 62] = "GREATER_THAN_SIGN";
	CODE_POINTS$1[CODE_POINTS$1["QUESTION_MARK"] = 63] = "QUESTION_MARK";
	CODE_POINTS$1[CODE_POINTS$1["LATIN_CAPITAL_A"] = 65] = "LATIN_CAPITAL_A";
	CODE_POINTS$1[CODE_POINTS$1["LATIN_CAPITAL_Z"] = 90] = "LATIN_CAPITAL_Z";
	CODE_POINTS$1[CODE_POINTS$1["RIGHT_SQUARE_BRACKET"] = 93] = "RIGHT_SQUARE_BRACKET";
	CODE_POINTS$1[CODE_POINTS$1["GRAVE_ACCENT"] = 96] = "GRAVE_ACCENT";
	CODE_POINTS$1[CODE_POINTS$1["LATIN_SMALL_A"] = 97] = "LATIN_SMALL_A";
	CODE_POINTS$1[CODE_POINTS$1["LATIN_SMALL_Z"] = 122] = "LATIN_SMALL_Z";
})(CODE_POINTS || (CODE_POINTS = {}));
const SEQUENCES = {
	DASH_DASH: "--",
	CDATA_START: "[CDATA[",
	DOCTYPE: "doctype",
	SCRIPT: "script",
	PUBLIC: "public",
	SYSTEM: "system"
};
function isSurrogate(cp) {
	return cp >= 55296 && cp <= 57343;
}
function isSurrogatePair(cp) {
	return cp >= 56320 && cp <= 57343;
}
function getSurrogatePairCodePoint(cp1, cp2) {
	return (cp1 - 55296) * 1024 + 9216 + cp2;
}
function isControlCodePoint(cp) {
	return cp !== 32 && cp !== 10 && cp !== 13 && cp !== 9 && cp !== 12 && cp >= 1 && cp <= 31 || cp >= 127 && cp <= 159;
}
function isUndefinedCodePoint(cp) {
	return cp >= 64976 && cp <= 65007 || UNDEFINED_CODE_POINTS.has(cp);
}

//#endregion
//#region node_modules/hast-util-raw/node_modules/parse5/dist/common/error-codes.js
var ERR;
(function(ERR$1) {
	ERR$1["controlCharacterInInputStream"] = "control-character-in-input-stream";
	ERR$1["noncharacterInInputStream"] = "noncharacter-in-input-stream";
	ERR$1["surrogateInInputStream"] = "surrogate-in-input-stream";
	ERR$1["nonVoidHtmlElementStartTagWithTrailingSolidus"] = "non-void-html-element-start-tag-with-trailing-solidus";
	ERR$1["endTagWithAttributes"] = "end-tag-with-attributes";
	ERR$1["endTagWithTrailingSolidus"] = "end-tag-with-trailing-solidus";
	ERR$1["unexpectedSolidusInTag"] = "unexpected-solidus-in-tag";
	ERR$1["unexpectedNullCharacter"] = "unexpected-null-character";
	ERR$1["unexpectedQuestionMarkInsteadOfTagName"] = "unexpected-question-mark-instead-of-tag-name";
	ERR$1["invalidFirstCharacterOfTagName"] = "invalid-first-character-of-tag-name";
	ERR$1["unexpectedEqualsSignBeforeAttributeName"] = "unexpected-equals-sign-before-attribute-name";
	ERR$1["missingEndTagName"] = "missing-end-tag-name";
	ERR$1["unexpectedCharacterInAttributeName"] = "unexpected-character-in-attribute-name";
	ERR$1["unknownNamedCharacterReference"] = "unknown-named-character-reference";
	ERR$1["missingSemicolonAfterCharacterReference"] = "missing-semicolon-after-character-reference";
	ERR$1["unexpectedCharacterAfterDoctypeSystemIdentifier"] = "unexpected-character-after-doctype-system-identifier";
	ERR$1["unexpectedCharacterInUnquotedAttributeValue"] = "unexpected-character-in-unquoted-attribute-value";
	ERR$1["eofBeforeTagName"] = "eof-before-tag-name";
	ERR$1["eofInTag"] = "eof-in-tag";
	ERR$1["missingAttributeValue"] = "missing-attribute-value";
	ERR$1["missingWhitespaceBetweenAttributes"] = "missing-whitespace-between-attributes";
	ERR$1["missingWhitespaceAfterDoctypePublicKeyword"] = "missing-whitespace-after-doctype-public-keyword";
	ERR$1["missingWhitespaceBetweenDoctypePublicAndSystemIdentifiers"] = "missing-whitespace-between-doctype-public-and-system-identifiers";
	ERR$1["missingWhitespaceAfterDoctypeSystemKeyword"] = "missing-whitespace-after-doctype-system-keyword";
	ERR$1["missingQuoteBeforeDoctypePublicIdentifier"] = "missing-quote-before-doctype-public-identifier";
	ERR$1["missingQuoteBeforeDoctypeSystemIdentifier"] = "missing-quote-before-doctype-system-identifier";
	ERR$1["missingDoctypePublicIdentifier"] = "missing-doctype-public-identifier";
	ERR$1["missingDoctypeSystemIdentifier"] = "missing-doctype-system-identifier";
	ERR$1["abruptDoctypePublicIdentifier"] = "abrupt-doctype-public-identifier";
	ERR$1["abruptDoctypeSystemIdentifier"] = "abrupt-doctype-system-identifier";
	ERR$1["cdataInHtmlContent"] = "cdata-in-html-content";
	ERR$1["incorrectlyOpenedComment"] = "incorrectly-opened-comment";
	ERR$1["eofInScriptHtmlCommentLikeText"] = "eof-in-script-html-comment-like-text";
	ERR$1["eofInDoctype"] = "eof-in-doctype";
	ERR$1["nestedComment"] = "nested-comment";
	ERR$1["abruptClosingOfEmptyComment"] = "abrupt-closing-of-empty-comment";
	ERR$1["eofInComment"] = "eof-in-comment";
	ERR$1["incorrectlyClosedComment"] = "incorrectly-closed-comment";
	ERR$1["eofInCdata"] = "eof-in-cdata";
	ERR$1["absenceOfDigitsInNumericCharacterReference"] = "absence-of-digits-in-numeric-character-reference";
	ERR$1["nullCharacterReference"] = "null-character-reference";
	ERR$1["surrogateCharacterReference"] = "surrogate-character-reference";
	ERR$1["characterReferenceOutsideUnicodeRange"] = "character-reference-outside-unicode-range";
	ERR$1["controlCharacterReference"] = "control-character-reference";
	ERR$1["noncharacterCharacterReference"] = "noncharacter-character-reference";
	ERR$1["missingWhitespaceBeforeDoctypeName"] = "missing-whitespace-before-doctype-name";
	ERR$1["missingDoctypeName"] = "missing-doctype-name";
	ERR$1["invalidCharacterSequenceAfterDoctypeName"] = "invalid-character-sequence-after-doctype-name";
	ERR$1["duplicateAttribute"] = "duplicate-attribute";
	ERR$1["nonConformingDoctype"] = "non-conforming-doctype";
	ERR$1["missingDoctype"] = "missing-doctype";
	ERR$1["misplacedDoctype"] = "misplaced-doctype";
	ERR$1["endTagWithoutMatchingOpenElement"] = "end-tag-without-matching-open-element";
	ERR$1["closingOfElementWithOpenChildElements"] = "closing-of-element-with-open-child-elements";
	ERR$1["disallowedContentInNoscriptInHead"] = "disallowed-content-in-noscript-in-head";
	ERR$1["openElementsLeftAfterEof"] = "open-elements-left-after-eof";
	ERR$1["abandonedHeadElementChild"] = "abandoned-head-element-child";
	ERR$1["misplacedStartTagForHeadElement"] = "misplaced-start-tag-for-head-element";
	ERR$1["nestedNoscriptInHead"] = "nested-noscript-in-head";
	ERR$1["eofInElementThatCanContainOnlyText"] = "eof-in-element-that-can-contain-only-text";
})(ERR || (ERR = {}));

//#endregion
//#region node_modules/hast-util-raw/node_modules/parse5/dist/tokenizer/preprocessor.js
const DEFAULT_BUFFER_WATERLINE = 65536;
var Preprocessor = class {
	constructor(handler) {
		this.handler = handler;
		this.html = "";
		this.pos = -1;
		this.lastGapPos = -2;
		this.gapStack = [];
		this.skipNextNewLine = false;
		this.lastChunkWritten = false;
		this.endOfChunkHit = false;
		this.bufferWaterline = DEFAULT_BUFFER_WATERLINE;
		this.isEol = false;
		this.lineStartPos = 0;
		this.droppedBufferSize = 0;
		this.line = 1;
		this.lastErrOffset = -1;
	}
	/** The column on the current line. If we just saw a gap (eg. a surrogate pair), return the index before. */
	get col() {
		return this.pos - this.lineStartPos + Number(this.lastGapPos !== this.pos);
	}
	get offset() {
		return this.droppedBufferSize + this.pos;
	}
	getError(code$3, cpOffset) {
		const { line, col, offset } = this;
		const startCol = col + cpOffset;
		const startOffset = offset + cpOffset;
		return {
			code: code$3,
			startLine: line,
			endLine: line,
			startCol,
			endCol: startCol,
			startOffset,
			endOffset: startOffset
		};
	}
	_err(code$3) {
		if (this.handler.onParseError && this.lastErrOffset !== this.offset) {
			this.lastErrOffset = this.offset;
			this.handler.onParseError(this.getError(code$3, 0));
		}
	}
	_addGap() {
		this.gapStack.push(this.lastGapPos);
		this.lastGapPos = this.pos;
	}
	_processSurrogate(cp) {
		if (this.pos !== this.html.length - 1) {
			const nextCp = this.html.charCodeAt(this.pos + 1);
			if (isSurrogatePair(nextCp)) {
				this.pos++;
				this._addGap();
				return getSurrogatePairCodePoint(cp, nextCp);
			}
		} else if (!this.lastChunkWritten) {
			this.endOfChunkHit = true;
			return CODE_POINTS.EOF;
		}
		this._err(ERR.surrogateInInputStream);
		return cp;
	}
	willDropParsedChunk() {
		return this.pos > this.bufferWaterline;
	}
	dropParsedChunk() {
		if (this.willDropParsedChunk()) {
			this.html = this.html.substring(this.pos);
			this.lineStartPos -= this.pos;
			this.droppedBufferSize += this.pos;
			this.pos = 0;
			this.lastGapPos = -2;
			this.gapStack.length = 0;
		}
	}
	write(chunk, isLastChunk) {
		if (this.html.length > 0) this.html += chunk;
		else this.html = chunk;
		this.endOfChunkHit = false;
		this.lastChunkWritten = isLastChunk;
	}
	insertHtmlAtCurrentPos(chunk) {
		this.html = this.html.substring(0, this.pos + 1) + chunk + this.html.substring(this.pos + 1);
		this.endOfChunkHit = false;
	}
	startsWith(pattern, caseSensitive) {
		if (this.pos + pattern.length > this.html.length) {
			this.endOfChunkHit = !this.lastChunkWritten;
			return false;
		}
		if (caseSensitive) return this.html.startsWith(pattern, this.pos);
		for (let i = 0; i < pattern.length; i++) if ((this.html.charCodeAt(this.pos + i) | 32) !== pattern.charCodeAt(i)) return false;
		return true;
	}
	peek(offset) {
		const pos = this.pos + offset;
		if (pos >= this.html.length) {
			this.endOfChunkHit = !this.lastChunkWritten;
			return CODE_POINTS.EOF;
		}
		const code$3 = this.html.charCodeAt(pos);
		return code$3 === CODE_POINTS.CARRIAGE_RETURN ? CODE_POINTS.LINE_FEED : code$3;
	}
	advance() {
		this.pos++;
		if (this.isEol) {
			this.isEol = false;
			this.line++;
			this.lineStartPos = this.pos;
		}
		if (this.pos >= this.html.length) {
			this.endOfChunkHit = !this.lastChunkWritten;
			return CODE_POINTS.EOF;
		}
		let cp = this.html.charCodeAt(this.pos);
		if (cp === CODE_POINTS.CARRIAGE_RETURN) {
			this.isEol = true;
			this.skipNextNewLine = true;
			return CODE_POINTS.LINE_FEED;
		}
		if (cp === CODE_POINTS.LINE_FEED) {
			this.isEol = true;
			if (this.skipNextNewLine) {
				this.line--;
				this.skipNextNewLine = false;
				this._addGap();
				return this.advance();
			}
		}
		this.skipNextNewLine = false;
		if (isSurrogate(cp)) cp = this._processSurrogate(cp);
		if (!(this.handler.onParseError === null || cp > 31 && cp < 127 || cp === CODE_POINTS.LINE_FEED || cp === CODE_POINTS.CARRIAGE_RETURN || cp > 159 && cp < 64976)) this._checkForProblematicCharacters(cp);
		return cp;
	}
	_checkForProblematicCharacters(cp) {
		if (isControlCodePoint(cp)) this._err(ERR.controlCharacterInInputStream);
		else if (isUndefinedCodePoint(cp)) this._err(ERR.noncharacterInInputStream);
	}
	retreat(count) {
		this.pos -= count;
		while (this.pos < this.lastGapPos) {
			this.lastGapPos = this.gapStack.pop();
			this.pos--;
		}
		this.isEol = false;
	}
};

//#endregion
//#region node_modules/hast-util-raw/node_modules/parse5/dist/common/token.js
var TokenType;
(function(TokenType$1) {
	TokenType$1[TokenType$1["CHARACTER"] = 0] = "CHARACTER";
	TokenType$1[TokenType$1["NULL_CHARACTER"] = 1] = "NULL_CHARACTER";
	TokenType$1[TokenType$1["WHITESPACE_CHARACTER"] = 2] = "WHITESPACE_CHARACTER";
	TokenType$1[TokenType$1["START_TAG"] = 3] = "START_TAG";
	TokenType$1[TokenType$1["END_TAG"] = 4] = "END_TAG";
	TokenType$1[TokenType$1["COMMENT"] = 5] = "COMMENT";
	TokenType$1[TokenType$1["DOCTYPE"] = 6] = "DOCTYPE";
	TokenType$1[TokenType$1["EOF"] = 7] = "EOF";
	TokenType$1[TokenType$1["HIBERNATION"] = 8] = "HIBERNATION";
})(TokenType || (TokenType = {}));
function getTokenAttr(token, attrName) {
	for (let i = token.attrs.length - 1; i >= 0; i--) if (token.attrs[i].name === attrName) return token.attrs[i].value;
	return null;
}

//#endregion
//#region node_modules/hast-util-raw/node_modules/entities/dist/esm/generated/decode-data-html.js
const htmlDecodeTree = /* @__PURE__ */ new Uint16Array(/* @__PURE__ */ "ᵁ<Õıʊҝջאٵ۞ޢߖࠏ੊ઑඡ๭༉༦჊ረዡᐕᒝᓃᓟᔥ\0\0\0\0\0\0ᕫᛍᦍᰒᷝ὾⁠↰⊍⏀⏻⑂⠤⤒ⴈ⹈⿎〖㊺㘹㞬㣾㨨㩱㫠㬮ࠀEMabcfglmnoprstu\\bfms¦³¹ÈÏlig耻Æ䃆P耻&䀦cute耻Á䃁reve;䄂Āiyx}rc耻Â䃂;䐐r;쀀𝔄rave耻À䃀pha;䎑acr;䄀d;橓Āgp¡on;䄄f;쀀𝔸plyFunction;恡ing耻Å䃅Ācs¾Ãr;쀀𝒜ign;扔ilde耻Ã䃃ml耻Ä䃄ЀaceforsuåûþėĜĢħĪĀcrêòkslash;或Ŷöø;櫧ed;挆y;䐑ƀcrtąċĔause;戵noullis;愬a;䎒r;쀀𝔅pf;쀀𝔹eve;䋘còēmpeq;扎܀HOacdefhilorsuōőŖƀƞƢƵƷƺǜȕɳɸɾcy;䐧PY耻©䂩ƀcpyŝŢźute;䄆Ā;iŧŨ拒talDifferentialD;慅leys;愭ȀaeioƉƎƔƘron;䄌dil耻Ç䃇rc;䄈nint;戰ot;䄊ĀdnƧƭilla;䂸terDot;䂷òſi;䎧rcleȀDMPTǇǋǑǖot;抙inus;抖lus;投imes;抗oĀcsǢǸkwiseContourIntegral;戲eCurlyĀDQȃȏoubleQuote;思uote;怙ȀlnpuȞȨɇɕonĀ;eȥȦ户;橴ƀgitȯȶȺruent;扡nt;戯ourIntegral;戮ĀfrɌɎ;愂oduct;成nterClockwiseContourIntegral;戳oss;樯cr;쀀𝒞pĀ;Cʄʅ拓ap;才րDJSZacefiosʠʬʰʴʸˋ˗ˡ˦̳ҍĀ;oŹʥtrahd;椑cy;䐂cy;䐅cy;䐏ƀgrsʿ˄ˇger;怡r;憡hv;櫤Āayː˕ron;䄎;䐔lĀ;t˝˞戇a;䎔r;쀀𝔇Āaf˫̧Ācm˰̢riticalȀADGT̖̜̀̆cute;䂴oŴ̋̍;䋙bleAcute;䋝rave;䁠ilde;䋜ond;拄ferentialD;慆Ѱ̽\0\0\0͔͂\0Ѕf;쀀𝔻ƀ;DE͈͉͍䂨ot;惜qual;扐blèCDLRUVͣͲ΂ϏϢϸontourIntegraìȹoɴ͹\0\0ͻ»͉nArrow;懓Āeo·ΤftƀARTΐΖΡrrow;懐ightArrow;懔eåˊngĀLRΫτeftĀARγιrrow;柸ightArrow;柺ightArrow;柹ightĀATϘϞrrow;懒ee;抨pɁϩ\0\0ϯrrow;懑ownArrow;懕erticalBar;戥ǹABLRTaВЪаўѿͼrrowƀ;BUНОТ憓ar;椓pArrow;懵reve;䌑eft˒к\0ц\0ѐightVector;楐eeVector;楞ectorĀ;Bљњ憽ar;楖ightǔѧ\0ѱeeVector;楟ectorĀ;BѺѻ懁ar;楗eeĀ;A҆҇护rrow;憧ĀctҒҗr;쀀𝒟rok;䄐ࠀNTacdfglmopqstuxҽӀӄӋӞӢӧӮӵԡԯԶՒ՝ՠեG;䅊H耻Ð䃐cute耻É䃉ƀaiyӒӗӜron;䄚rc耻Ê䃊;䐭ot;䄖r;쀀𝔈rave耻È䃈ement;戈ĀapӺӾcr;䄒tyɓԆ\0\0ԒmallSquare;旻erySmallSquare;斫ĀgpԦԪon;䄘f;쀀𝔼silon;䎕uĀaiԼՉlĀ;TՂՃ橵ilde;扂librium;懌Āci՗՚r;愰m;橳a;䎗ml耻Ë䃋Āipժկsts;戃onentialE;慇ʀcfiosօֈ֍ֲ׌y;䐤r;쀀𝔉lledɓ֗\0\0֣mallSquare;旼erySmallSquare;斪Ͱֺ\0ֿ\0\0ׄf;쀀𝔽All;戀riertrf;愱cò׋؀JTabcdfgorstר׬ׯ׺؀ؒؖ؛؝أ٬ٲcy;䐃耻>䀾mmaĀ;d׷׸䎓;䏜reve;䄞ƀeiy؇،ؐdil;䄢rc;䄜;䐓ot;䄠r;쀀𝔊;拙pf;쀀𝔾eater̀EFGLSTصلَٖٛ٦qualĀ;Lؾؿ扥ess;招ullEqual;执reater;檢ess;扷lantEqual;橾ilde;扳cr;쀀𝒢;扫ЀAacfiosuڅڋږڛڞڪھۊRDcy;䐪Āctڐڔek;䋇;䁞irc;䄤r;愌lbertSpace;愋ǰگ\0ڲf;愍izontalLine;攀Āctۃۅòکrok;䄦mpńېۘownHumðįqual;扏܀EJOacdfgmnostuۺ۾܃܇܎ܚܞܡܨ݄ݸދޏޕcy;䐕lig;䄲cy;䐁cute耻Í䃍Āiyܓܘrc耻Î䃎;䐘ot;䄰r;愑rave耻Ì䃌ƀ;apܠܯܿĀcgܴܷr;䄪inaryI;慈lieóϝǴ݉\0ݢĀ;eݍݎ戬Āgrݓݘral;戫section;拂isibleĀCTݬݲomma;恣imes;恢ƀgptݿރވon;䄮f;쀀𝕀a;䎙cr;愐ilde;䄨ǫޚ\0ޞcy;䐆l耻Ï䃏ʀcfosuެ޷޼߂ߐĀiyޱ޵rc;䄴;䐙r;쀀𝔍pf;쀀𝕁ǣ߇\0ߌr;쀀𝒥rcy;䐈kcy;䐄΀HJacfosߤߨ߽߬߱ࠂࠈcy;䐥cy;䐌ppa;䎚Āey߶߻dil;䄶;䐚r;쀀𝔎pf;쀀𝕂cr;쀀𝒦րJTaceflmostࠥࠩࠬࡐࡣ঳সে্਷ੇcy;䐉耻<䀼ʀcmnpr࠷࠼ࡁࡄࡍute;䄹bda;䎛g;柪lacetrf;愒r;憞ƀaeyࡗ࡜ࡡron;䄽dil;䄻;䐛Āfsࡨ॰tԀACDFRTUVarࡾࢩࢱࣦ࣠ࣼयज़ΐ४Ānrࢃ࢏gleBracket;柨rowƀ;BR࢙࢚࢞憐ar;懤ightArrow;懆eiling;挈oǵࢷ\0ࣃbleBracket;柦nǔࣈ\0࣒eeVector;楡ectorĀ;Bࣛࣜ懃ar;楙loor;挊ightĀAV࣯ࣵrrow;憔ector;楎Āerँगeƀ;AVउऊऐ抣rrow;憤ector;楚iangleƀ;BEतथऩ抲ar;槏qual;抴pƀDTVषूौownVector;楑eeVector;楠ectorĀ;Bॖॗ憿ar;楘ectorĀ;B॥०憼ar;楒ightáΜs̀EFGLSTॾঋকঝঢভqualGreater;拚ullEqual;扦reater;扶ess;檡lantEqual;橽ilde;扲r;쀀𝔏Ā;eঽা拘ftarrow;懚idot;䄿ƀnpw৔ਖਛgȀLRlr৞৷ਂਐeftĀAR০৬rrow;柵ightArrow;柷ightArrow;柶eftĀarγਊightáοightáϊf;쀀𝕃erĀLRਢਬeftArrow;憙ightArrow;憘ƀchtਾੀੂòࡌ;憰rok;䅁;扪Ѐacefiosuਗ਼੝੠੷੼અઋ઎p;椅y;䐜Ādl੥੯iumSpace;恟lintrf;愳r;쀀𝔐nusPlus;戓pf;쀀𝕄cò੶;䎜ҀJacefostuણધભીଔଙඑ඗ඞcy;䐊cute;䅃ƀaey઴હાron;䅇dil;䅅;䐝ƀgswે૰଎ativeƀMTV૓૟૨ediumSpace;怋hiĀcn૦૘ë૙eryThiî૙tedĀGL૸ଆreaterGreateòٳessLesóੈLine;䀊r;쀀𝔑ȀBnptଢନଷ଺reak;恠BreakingSpace;䂠f;愕ڀ;CDEGHLNPRSTV୕ୖ୪୼஡௫ఄ౞಄ದ೘ൡඅ櫬Āou୛୤ngruent;扢pCap;扭oubleVerticalBar;戦ƀlqxஃஊ஛ement;戉ualĀ;Tஒஓ扠ilde;쀀≂̸ists;戄reater΀;EFGLSTஶஷ஽௉௓௘௥扯qual;扱ullEqual;쀀≧̸reater;쀀≫̸ess;批lantEqual;쀀⩾̸ilde;扵umpń௲௽ownHump;쀀≎̸qual;쀀≏̸eĀfsఊధtTriangleƀ;BEచఛడ拪ar;쀀⧏̸qual;括s̀;EGLSTవశ఼ౄోౘ扮qual;扰reater;扸ess;쀀≪̸lantEqual;쀀⩽̸ilde;扴estedĀGL౨౹reaterGreater;쀀⪢̸essLess;쀀⪡̸recedesƀ;ESಒಓಛ技qual;쀀⪯̸lantEqual;拠ĀeiಫಹverseElement;戌ghtTriangleƀ;BEೋೌ೒拫ar;쀀⧐̸qual;拭ĀquೝഌuareSuĀbp೨೹setĀ;E೰ೳ쀀⊏̸qual;拢ersetĀ;Eഃആ쀀⊐̸qual;拣ƀbcpഓതൎsetĀ;Eഛഞ쀀⊂⃒qual;抈ceedsȀ;ESTലള഻െ抁qual;쀀⪰̸lantEqual;拡ilde;쀀≿̸ersetĀ;E൘൛쀀⊃⃒qual;抉ildeȀ;EFT൮൯൵ൿ扁qual;扄ullEqual;扇ilde;扉erticalBar;戤cr;쀀𝒩ilde耻Ñ䃑;䎝܀Eacdfgmoprstuvලෂ෉෕ෛ෠෧෼ขภยา฿ไlig;䅒cute耻Ó䃓Āiy෎ීrc耻Ô䃔;䐞blac;䅐r;쀀𝔒rave耻Ò䃒ƀaei෮ෲ෶cr;䅌ga;䎩cron;䎟pf;쀀𝕆enCurlyĀDQฎบoubleQuote;怜uote;怘;橔Āclวฬr;쀀𝒪ash耻Ø䃘iŬื฼de耻Õ䃕es;樷ml耻Ö䃖erĀBP๋๠Āar๐๓r;怾acĀek๚๜;揞et;掴arenthesis;揜Ҁacfhilors๿ງຊຏຒດຝະ໼rtialD;戂y;䐟r;쀀𝔓i;䎦;䎠usMinus;䂱Āipຢອncareplanåڝf;愙Ȁ;eio຺ູ໠໤檻cedesȀ;EST່້໏໚扺qual;檯lantEqual;扼ilde;找me;怳Ādp໩໮uct;戏ortionĀ;aȥ໹l;戝Āci༁༆r;쀀𝒫;䎨ȀUfos༑༖༛༟OT耻\"䀢r;쀀𝔔pf;愚cr;쀀𝒬؀BEacefhiorsu༾གྷཇའཱིྦྷྪྭ႖ႩႴႾarr;椐G耻®䂮ƀcnrཎནབute;䅔g;柫rĀ;tཛྷཝ憠l;椖ƀaeyཧཬཱron;䅘dil;䅖;䐠Ā;vླྀཹ愜erseĀEUྂྙĀlq྇ྎement;戋uilibrium;懋pEquilibrium;楯r»ཹo;䎡ghtЀACDFTUVa࿁࿫࿳ဢဨၛႇϘĀnr࿆࿒gleBracket;柩rowƀ;BL࿜࿝࿡憒ar;懥eftArrow;懄eiling;按oǵ࿹\0စbleBracket;柧nǔည\0နeeVector;楝ectorĀ;Bဝသ懂ar;楕loor;挋Āerိ၃eƀ;AVဵံြ抢rrow;憦ector;楛iangleƀ;BEၐၑၕ抳ar;槐qual;抵pƀDTVၣၮၸownVector;楏eeVector;楜ectorĀ;Bႂႃ憾ar;楔ectorĀ;B႑႒懀ar;楓Āpuႛ႞f;愝ndImplies;楰ightarrow;懛ĀchႹႼr;愛;憱leDelayed;槴ڀHOacfhimoqstuფჱჷჽᄙᄞᅑᅖᅡᅧᆵᆻᆿĀCcჩხHcy;䐩y;䐨FTcy;䐬cute;䅚ʀ;aeiyᄈᄉᄎᄓᄗ檼ron;䅠dil;䅞rc;䅜;䐡r;쀀𝔖ortȀDLRUᄪᄴᄾᅉownArrow»ОeftArrow»࢚ightArrow»࿝pArrow;憑gma;䎣allCircle;战pf;쀀𝕊ɲᅭ\0\0ᅰt;戚areȀ;ISUᅻᅼᆉᆯ斡ntersection;抓uĀbpᆏᆞsetĀ;Eᆗᆘ抏qual;抑ersetĀ;Eᆨᆩ抐qual;抒nion;抔cr;쀀𝒮ar;拆ȀbcmpᇈᇛሉላĀ;sᇍᇎ拐etĀ;Eᇍᇕqual;抆ĀchᇠህeedsȀ;ESTᇭᇮᇴᇿ扻qual;檰lantEqual;扽ilde;承Tháྌ;我ƀ;esሒሓሣ拑rsetĀ;Eሜም抃qual;抇et»ሓրHRSacfhiorsሾቄ቉ቕ቞ቱቶኟዂወዑORN耻Þ䃞ADE;愢ĀHc቎ቒcy;䐋y;䐦Ābuቚቜ;䀉;䎤ƀaeyብቪቯron;䅤dil;䅢;䐢r;쀀𝔗Āeiቻ኉ǲኀ\0ኇefore;戴a;䎘Ācn኎ኘkSpace;쀀  Space;怉ldeȀ;EFTካኬኲኼ戼qual;扃ullEqual;扅ilde;扈pf;쀀𝕋ipleDot;惛Āctዖዛr;쀀𝒯rok;䅦ૡዷጎጚጦ\0ጬጱ\0\0\0\0\0ጸጽ፷ᎅ\0᏿ᐄᐊᐐĀcrዻጁute耻Ú䃚rĀ;oጇገ憟cir;楉rǣጓ\0጖y;䐎ve;䅬Āiyጞጣrc耻Û䃛;䐣blac;䅰r;쀀𝔘rave耻Ù䃙acr;䅪Ādiፁ፩erĀBPፈ፝Āarፍፐr;䁟acĀekፗፙ;揟et;掵arenthesis;揝onĀ;P፰፱拃lus;抎Āgp፻፿on;䅲f;쀀𝕌ЀADETadps᎕ᎮᎸᏄϨᏒᏗᏳrrowƀ;BDᅐᎠᎤar;椒ownArrow;懅ownArrow;憕quilibrium;楮eeĀ;AᏋᏌ报rrow;憥ownáϳerĀLRᏞᏨeftArrow;憖ightArrow;憗iĀ;lᏹᏺ䏒on;䎥ing;䅮cr;쀀𝒰ilde;䅨ml耻Ü䃜ҀDbcdefosvᐧᐬᐰᐳᐾᒅᒊᒐᒖash;披ar;櫫y;䐒ashĀ;lᐻᐼ抩;櫦Āerᑃᑅ;拁ƀbtyᑌᑐᑺar;怖Ā;iᑏᑕcalȀBLSTᑡᑥᑪᑴar;戣ine;䁼eparator;杘ilde;所ThinSpace;怊r;쀀𝔙pf;쀀𝕍cr;쀀𝒱dash;抪ʀcefosᒧᒬᒱᒶᒼirc;䅴dge;拀r;쀀𝔚pf;쀀𝕎cr;쀀𝒲Ȁfiosᓋᓐᓒᓘr;쀀𝔛;䎞pf;쀀𝕏cr;쀀𝒳ҀAIUacfosuᓱᓵᓹᓽᔄᔏᔔᔚᔠcy;䐯cy;䐇cy;䐮cute耻Ý䃝Āiyᔉᔍrc;䅶;䐫r;쀀𝔜pf;쀀𝕐cr;쀀𝒴ml;䅸ЀHacdefosᔵᔹᔿᕋᕏᕝᕠᕤcy;䐖cute;䅹Āayᕄᕉron;䅽;䐗ot;䅻ǲᕔ\0ᕛoWidtè૙a;䎖r;愨pf;愤cr;쀀𝒵௡ᖃᖊᖐ\0ᖰᖶᖿ\0\0\0\0ᗆᗛᗫᙟ᙭\0ᚕ᚛ᚲᚹ\0ᚾcute耻á䃡reve;䄃̀;Ediuyᖜᖝᖡᖣᖨᖭ戾;쀀∾̳;房rc耻â䃢te肻´̆;䐰lig耻æ䃦Ā;r²ᖺ;쀀𝔞rave耻à䃠ĀepᗊᗖĀfpᗏᗔsym;愵èᗓha;䎱ĀapᗟcĀclᗤᗧr;䄁g;樿ɤᗰ\0\0ᘊʀ;adsvᗺᗻᗿᘁᘇ戧nd;橕;橜lope;橘;橚΀;elmrszᘘᘙᘛᘞᘿᙏᙙ戠;榤e»ᘙsdĀ;aᘥᘦ戡ѡᘰᘲᘴᘶᘸᘺᘼᘾ;榨;榩;榪;榫;榬;榭;榮;榯tĀ;vᙅᙆ戟bĀ;dᙌᙍ抾;榝Āptᙔᙗh;戢»¹arr;捼Āgpᙣᙧon;䄅f;쀀𝕒΀;Eaeiop዁ᙻᙽᚂᚄᚇᚊ;橰cir;橯;扊d;手s;䀧roxĀ;e዁ᚒñᚃing耻å䃥ƀctyᚡᚦᚨr;쀀𝒶;䀪mpĀ;e዁ᚯñʈilde耻ã䃣ml耻ä䃤Āciᛂᛈoninôɲnt;樑ࠀNabcdefiklnoprsu᛭ᛱᜰ᜼ᝃᝈ᝸᝽០៦ᠹᡐᜍ᤽᥈ᥰot;櫭Ācrᛶ᜞kȀcepsᜀᜅᜍᜓong;扌psilon;䏶rime;怵imĀ;e᜚᜛戽q;拍Ŷᜢᜦee;抽edĀ;gᜬᜭ挅e»ᜭrkĀ;t፜᜷brk;掶Āoyᜁᝁ;䐱quo;怞ʀcmprtᝓ᝛ᝡᝤᝨausĀ;eĊĉptyv;榰séᜌnoõēƀahwᝯ᝱ᝳ;䎲;愶een;扬r;쀀𝔟g΀costuvwឍឝឳេ៕៛៞ƀaiuបពរðݠrc;旯p»፱ƀdptឤឨឭot;樀lus;樁imes;樂ɱឹ\0\0ើcup;樆ar;昅riangleĀdu៍្own;施p;斳plus;樄eåᑄåᒭarow;植ƀako៭ᠦᠵĀcn៲ᠣkƀlst៺֫᠂ozenge;槫riangleȀ;dlr᠒᠓᠘᠝斴own;斾eft;旂ight;斸k;搣Ʊᠫ\0ᠳƲᠯ\0ᠱ;斒;斑4;斓ck;斈ĀeoᠾᡍĀ;qᡃᡆ쀀=⃥uiv;쀀≡⃥t;挐Ȁptwxᡙᡞᡧᡬf;쀀𝕓Ā;tᏋᡣom»Ꮜtie;拈؀DHUVbdhmptuvᢅᢖᢪᢻᣗᣛᣬ᣿ᤅᤊᤐᤡȀLRlrᢎᢐᢒᢔ;敗;敔;敖;敓ʀ;DUduᢡᢢᢤᢦᢨ敐;敦;敩;敤;敧ȀLRlrᢳᢵᢷᢹ;敝;敚;敜;教΀;HLRhlrᣊᣋᣍᣏᣑᣓᣕ救;敬;散;敠;敫;敢;敟ox;槉ȀLRlrᣤᣦᣨᣪ;敕;敒;攐;攌ʀ;DUduڽ᣷᣹᣻᣽;敥;敨;攬;攴inus;抟lus;択imes;抠ȀLRlrᤙᤛᤝ᤟;敛;敘;攘;攔΀;HLRhlrᤰᤱᤳᤵᤷ᤻᤹攂;敪;敡;敞;攼;攤;攜Āevģ᥂bar耻¦䂦Ȁceioᥑᥖᥚᥠr;쀀𝒷mi;恏mĀ;e᜚᜜lƀ;bhᥨᥩᥫ䁜;槅sub;柈Ŭᥴ᥾lĀ;e᥹᥺怢t»᥺pƀ;Eeįᦅᦇ;檮Ā;qۜۛೡᦧ\0᧨ᨑᨕᨲ\0ᨷᩐ\0\0᪴\0\0᫁\0\0ᬡᬮ᭍᭒\0᯽\0ᰌƀcpr᦭ᦲ᧝ute;䄇̀;abcdsᦿᧀᧄ᧊᧕᧙戩nd;橄rcup;橉Āau᧏᧒p;橋p;橇ot;橀;쀀∩︀Āeo᧢᧥t;恁îړȀaeiu᧰᧻ᨁᨅǰ᧵\0᧸s;橍on;䄍dil耻ç䃧rc;䄉psĀ;sᨌᨍ橌m;橐ot;䄋ƀdmnᨛᨠᨦil肻¸ƭptyv;榲t脀¢;eᨭᨮ䂢räƲr;쀀𝔠ƀceiᨽᩀᩍy;䑇ckĀ;mᩇᩈ朓ark»ᩈ;䏇r΀;Ecefms᩟᩠ᩢᩫ᪤᪪᪮旋;槃ƀ;elᩩᩪᩭ䋆q;扗eɡᩴ\0\0᪈rrowĀlr᩼᪁eft;憺ight;憻ʀRSacd᪒᪔᪖᪚᪟»ཇ;擈st;抛irc;抚ash;抝nint;樐id;櫯cir;槂ubsĀ;u᪻᪼晣it»᪼ˬ᫇᫔᫺\0ᬊonĀ;eᫍᫎ䀺Ā;qÇÆɭ᫙\0\0᫢aĀ;t᫞᫟䀬;䁀ƀ;fl᫨᫩᫫戁îᅠeĀmx᫱᫶ent»᫩eóɍǧ᫾\0ᬇĀ;dኻᬂot;橭nôɆƀfryᬐᬔᬗ;쀀𝕔oäɔ脀©;sŕᬝr;愗Āaoᬥᬩrr;憵ss;朗Ācuᬲᬷr;쀀𝒸Ābpᬼ᭄Ā;eᭁᭂ櫏;櫑Ā;eᭉᭊ櫐;櫒dot;拯΀delprvw᭠᭬᭷ᮂᮬᯔ᯹arrĀlr᭨᭪;椸;椵ɰ᭲\0\0᭵r;拞c;拟arrĀ;p᭿ᮀ憶;椽̀;bcdosᮏᮐᮖᮡᮥᮨ截rcap;橈Āauᮛᮞp;橆p;橊ot;抍r;橅;쀀∪︀Ȁalrv᮵ᮿᯞᯣrrĀ;mᮼᮽ憷;椼yƀevwᯇᯔᯘqɰᯎ\0\0ᯒreã᭳uã᭵ee;拎edge;拏en耻¤䂤earrowĀlrᯮ᯳eft»ᮀight»ᮽeäᯝĀciᰁᰇoninôǷnt;戱lcty;挭ঀAHabcdefhijlorstuwz᰸᰻᰿ᱝᱩᱵᲊᲞᲬᲷ᳻᳿ᴍᵻᶑᶫᶻ᷆᷍rò΁ar;楥Ȁglrs᱈ᱍ᱒᱔ger;怠eth;愸òᄳhĀ;vᱚᱛ怐»ऊūᱡᱧarow;椏aã̕Āayᱮᱳron;䄏;䐴ƀ;ao̲ᱼᲄĀgrʿᲁr;懊tseq;橷ƀglmᲑᲔᲘ耻°䂰ta;䎴ptyv;榱ĀirᲣᲨsht;楿;쀀𝔡arĀlrᲳᲵ»ࣜ»သʀaegsv᳂͸᳖᳜᳠mƀ;oș᳊᳔ndĀ;ș᳑uit;晦amma;䏝in;拲ƀ;io᳧᳨᳸䃷de脀÷;o᳧ᳰntimes;拇nø᳷cy;䑒cɯᴆ\0\0ᴊrn;挞op;挍ʀlptuwᴘᴝᴢᵉᵕlar;䀤f;쀀𝕕ʀ;emps̋ᴭᴷᴽᵂqĀ;d͒ᴳot;扑inus;戸lus;戔quare;抡blebarwedgåúnƀadhᄮᵝᵧownarrowóᲃarpoonĀlrᵲᵶefôᲴighôᲶŢᵿᶅkaro÷གɯᶊ\0\0ᶎrn;挟op;挌ƀcotᶘᶣᶦĀryᶝᶡ;쀀𝒹;䑕l;槶rok;䄑Ādrᶰᶴot;拱iĀ;fᶺ᠖斿Āah᷀᷃ròЩaòྦangle;榦Āci᷒ᷕy;䑟grarr;柿ऀDacdefglmnopqrstuxḁḉḙḸոḼṉṡṾấắẽỡἪἷὄ὎὚ĀDoḆᴴoôᲉĀcsḎḔute耻é䃩ter;橮ȀaioyḢḧḱḶron;䄛rĀ;cḭḮ扖耻ê䃪lon;払;䑍ot;䄗ĀDrṁṅot;扒;쀀𝔢ƀ;rsṐṑṗ檚ave耻è䃨Ā;dṜṝ檖ot;檘Ȁ;ilsṪṫṲṴ檙nters;揧;愓Ā;dṹṺ檕ot;檗ƀapsẅẉẗcr;䄓tyƀ;svẒẓẕ戅et»ẓpĀ1;ẝẤĳạả;怄;怅怃ĀgsẪẬ;䅋p;怂ĀgpẴẸon;䄙f;쀀𝕖ƀalsỄỎỒrĀ;sỊị拕l;槣us;橱iƀ;lvỚớở䎵on»ớ;䏵ȀcsuvỪỳἋἣĀioữḱrc»Ḯɩỹ\0\0ỻíՈantĀglἂἆtr»ṝess»Ṻƀaeiἒ἖Ἒls;䀽st;扟vĀ;DȵἠD;橸parsl;槥ĀDaἯἳot;打rr;楱ƀcdiἾὁỸr;愯oô͒ĀahὉὋ;䎷耻ð䃰Āmrὓὗl耻ë䃫o;悬ƀcipὡὤὧl;䀡sôծĀeoὬὴctatioîՙnentialåչৡᾒ\0ᾞ\0ᾡᾧ\0\0ῆῌ\0ΐ\0ῦῪ \0 ⁚llingdotseñṄy;䑄male;晀ƀilrᾭᾳ῁lig;耀ﬃɩᾹ\0\0᾽g;耀ﬀig;耀ﬄ;쀀𝔣lig;耀ﬁlig;쀀fjƀaltῙ῜ῡt;晭ig;耀ﬂns;斱of;䆒ǰ΅\0ῳf;쀀𝕗ĀakֿῷĀ;vῼ´拔;櫙artint;樍Āao‌⁕Ācs‑⁒α‚‰‸⁅⁈\0⁐β•‥‧‪‬\0‮耻½䂽;慓耻¼䂼;慕;慙;慛Ƴ‴\0‶;慔;慖ʴ‾⁁\0\0⁃耻¾䂾;慗;慜5;慘ƶ⁌\0⁎;慚;慝8;慞l;恄wn;挢cr;쀀𝒻ࢀEabcdefgijlnorstv₂₉₟₥₰₴⃰⃵⃺⃿℃ℒℸ̗ℾ⅒↞Ā;lٍ₇;檌ƀcmpₐₕ₝ute;䇵maĀ;dₜ᳚䎳;檆reve;䄟Āiy₪₮rc;䄝;䐳ot;䄡Ȁ;lqsؾق₽⃉ƀ;qsؾٌ⃄lanô٥Ȁ;cdl٥⃒⃥⃕c;檩otĀ;o⃜⃝檀Ā;l⃢⃣檂;檄Ā;e⃪⃭쀀⋛︀s;檔r;쀀𝔤Ā;gٳ؛mel;愷cy;䑓Ȁ;Eajٚℌℎℐ;檒;檥;檤ȀEaesℛℝ℩ℴ;扩pĀ;p℣ℤ檊rox»ℤĀ;q℮ℯ檈Ā;q℮ℛim;拧pf;쀀𝕘Āci⅃ⅆr;愊mƀ;el٫ⅎ⅐;檎;檐茀>;cdlqr׮ⅠⅪⅮⅳⅹĀciⅥⅧ;檧r;橺ot;拗Par;榕uest;橼ʀadelsↄⅪ←ٖ↛ǰ↉\0↎proø₞r;楸qĀlqؿ↖lesó₈ií٫Āen↣↭rtneqq;쀀≩︀Å↪ԀAabcefkosy⇄⇇⇱⇵⇺∘∝∯≨≽ròΠȀilmr⇐⇔⇗⇛rsðᒄf»․ilôکĀdr⇠⇤cy;䑊ƀ;cwࣴ⇫⇯ir;楈;憭ar;意irc;䄥ƀalr∁∎∓rtsĀ;u∉∊晥it»∊lip;怦con;抹r;쀀𝔥sĀew∣∩arow;椥arow;椦ʀamopr∺∾≃≞≣rr;懿tht;戻kĀlr≉≓eftarrow;憩ightarrow;憪f;쀀𝕙bar;怕ƀclt≯≴≸r;쀀𝒽asè⇴rok;䄧Ābp⊂⊇ull;恃hen»ᱛૡ⊣\0⊪\0⊸⋅⋎\0⋕⋳\0\0⋸⌢⍧⍢⍿\0⎆⎪⎴cute耻í䃭ƀ;iyݱ⊰⊵rc耻î䃮;䐸Ācx⊼⊿y;䐵cl耻¡䂡ĀfrΟ⋉;쀀𝔦rave耻ì䃬Ȁ;inoܾ⋝⋩⋮Āin⋢⋦nt;樌t;戭fin;槜ta;愩lig;䄳ƀaop⋾⌚⌝ƀcgt⌅⌈⌗r;䄫ƀelpܟ⌏⌓inåގarôܠh;䄱f;抷ed;䆵ʀ;cfotӴ⌬⌱⌽⍁are;愅inĀ;t⌸⌹戞ie;槝doô⌙ʀ;celpݗ⍌⍐⍛⍡al;抺Āgr⍕⍙eróᕣã⍍arhk;樗rod;樼Ȁcgpt⍯⍲⍶⍻y;䑑on;䄯f;쀀𝕚a;䎹uest耻¿䂿Āci⎊⎏r;쀀𝒾nʀ;EdsvӴ⎛⎝⎡ӳ;拹ot;拵Ā;v⎦⎧拴;拳Ā;iݷ⎮lde;䄩ǫ⎸\0⎼cy;䑖l耻ï䃯̀cfmosu⏌⏗⏜⏡⏧⏵Āiy⏑⏕rc;䄵;䐹r;쀀𝔧ath;䈷pf;쀀𝕛ǣ⏬\0⏱r;쀀𝒿rcy;䑘kcy;䑔Ѐacfghjos␋␖␢␧␭␱␵␻ppaĀ;v␓␔䎺;䏰Āey␛␠dil;䄷;䐺r;쀀𝔨reen;䄸cy;䑅cy;䑜pf;쀀𝕜cr;쀀𝓀஀ABEHabcdefghjlmnoprstuv⑰⒁⒆⒍⒑┎┽╚▀♎♞♥♹♽⚚⚲⛘❝❨➋⟀⠁⠒ƀart⑷⑺⑼rò৆òΕail;椛arr;椎Ā;gঔ⒋;檋ar;楢ॣ⒥\0⒪\0⒱\0\0\0\0\0⒵Ⓔ\0ⓆⓈⓍ\0⓹ute;䄺mptyv;榴raîࡌbda;䎻gƀ;dlࢎⓁⓃ;榑åࢎ;檅uo耻«䂫rЀ;bfhlpst࢙ⓞⓦⓩ⓫⓮⓱⓵Ā;f࢝ⓣs;椟s;椝ë≒p;憫l;椹im;楳l;憢ƀ;ae⓿─┄檫il;椙Ā;s┉┊檭;쀀⪭︀ƀabr┕┙┝rr;椌rk;杲Āak┢┬cĀek┨┪;䁻;䁛Āes┱┳;榋lĀdu┹┻;榏;榍Ȁaeuy╆╋╖╘ron;䄾Ādi═╔il;䄼ìࢰâ┩;䐻Ȁcqrs╣╦╭╽a;椶uoĀ;rนᝆĀdu╲╷har;楧shar;楋h;憲ʀ;fgqs▋▌উ◳◿扤tʀahlrt▘▤▷◂◨rrowĀ;t࢙□aé⓶arpoonĀdu▯▴own»њp»०eftarrows;懇ightƀahs◍◖◞rrowĀ;sࣴࢧarpoonó྘quigarro÷⇰hreetimes;拋ƀ;qs▋ও◺lanôবʀ;cdgsব☊☍☝☨c;檨otĀ;o☔☕橿Ā;r☚☛檁;檃Ā;e☢☥쀀⋚︀s;檓ʀadegs☳☹☽♉♋pproøⓆot;拖qĀgq♃♅ôউgtò⒌ôছiíলƀilr♕࣡♚sht;楼;쀀𝔩Ā;Eজ♣;檑š♩♶rĀdu▲♮Ā;l॥♳;楪lk;斄cy;䑙ʀ;achtੈ⚈⚋⚑⚖rò◁orneòᴈard;楫ri;旺Āio⚟⚤dot;䅀ustĀ;a⚬⚭掰che»⚭ȀEaes⚻⚽⛉⛔;扨pĀ;p⛃⛄檉rox»⛄Ā;q⛎⛏檇Ā;q⛎⚻im;拦Ѐabnoptwz⛩⛴⛷✚✯❁❇❐Ānr⛮⛱g;柬r;懽rëࣁgƀlmr⛿✍✔eftĀar০✇ightá৲apsto;柼ightá৽parrowĀlr✥✩efô⓭ight;憬ƀafl✶✹✽r;榅;쀀𝕝us;樭imes;樴š❋❏st;戗áፎƀ;ef❗❘᠀旊nge»❘arĀ;l❤❥䀨t;榓ʀachmt❳❶❼➅➇ròࢨorneòᶌarĀ;d྘➃;業;怎ri;抿̀achiqt➘➝ੀ➢➮➻quo;怹r;쀀𝓁mƀ;egল➪➬;檍;檏Ābu┪➳oĀ;rฟ➹;怚rok;䅂萀<;cdhilqrࠫ⟒☹⟜⟠⟥⟪⟰Āci⟗⟙;檦r;橹reå◲mes;拉arr;楶uest;橻ĀPi⟵⟹ar;榖ƀ;ef⠀भ᠛旃rĀdu⠇⠍shar;楊har;楦Āen⠗⠡rtneqq;쀀≨︀Å⠞܀Dacdefhilnopsu⡀⡅⢂⢎⢓⢠⢥⢨⣚⣢⣤ઃ⣳⤂Dot;戺Ȁclpr⡎⡒⡣⡽r耻¯䂯Āet⡗⡙;時Ā;e⡞⡟朠se»⡟Ā;sျ⡨toȀ;dluျ⡳⡷⡻owîҌefôएðᏑker;斮Āoy⢇⢌mma;権;䐼ash;怔asuredangle»ᘦr;쀀𝔪o;愧ƀcdn⢯⢴⣉ro耻µ䂵Ȁ;acdᑤ⢽⣀⣄sôᚧir;櫰ot肻·Ƶusƀ;bd⣒ᤃ⣓戒Ā;uᴼ⣘;横ţ⣞⣡p;櫛ò−ðઁĀdp⣩⣮els;抧f;쀀𝕞Āct⣸⣽r;쀀𝓂pos»ᖝƀ;lm⤉⤊⤍䎼timap;抸ఀGLRVabcdefghijlmoprstuvw⥂⥓⥾⦉⦘⧚⧩⨕⨚⩘⩝⪃⪕⪤⪨⬄⬇⭄⭿⮮ⰴⱧⱼ⳩Āgt⥇⥋;쀀⋙̸Ā;v⥐௏쀀≫⃒ƀelt⥚⥲⥶ftĀar⥡⥧rrow;懍ightarrow;懎;쀀⋘̸Ā;v⥻ే쀀≪⃒ightarrow;懏ĀDd⦎⦓ash;抯ash;抮ʀbcnpt⦣⦧⦬⦱⧌la»˞ute;䅄g;쀀∠⃒ʀ;Eiop඄⦼⧀⧅⧈;쀀⩰̸d;쀀≋̸s;䅉roø඄urĀ;a⧓⧔普lĀ;s⧓ସǳ⧟\0⧣p肻\xA0ଷmpĀ;e௹ఀʀaeouy⧴⧾⨃⨐⨓ǰ⧹\0⧻;橃on;䅈dil;䅆ngĀ;dൾ⨊ot;쀀⩭̸p;橂;䐽ash;怓΀;Aadqsxஒ⨩⨭⨻⩁⩅⩐rr;懗rĀhr⨳⨶k;椤Ā;oᏲᏰot;쀀≐̸uiöୣĀei⩊⩎ar;椨í஘istĀ;s஠டr;쀀𝔫ȀEest௅⩦⩹⩼ƀ;qs஼⩭௡ƀ;qs஼௅⩴lanô௢ií௪Ā;rஶ⪁»ஷƀAap⪊⪍⪑rò⥱rr;憮ar;櫲ƀ;svྍ⪜ྌĀ;d⪡⪢拼;拺cy;䑚΀AEadest⪷⪺⪾⫂⫅⫶⫹rò⥦;쀀≦̸rr;憚r;急Ȁ;fqs఻⫎⫣⫯tĀar⫔⫙rro÷⫁ightarro÷⪐ƀ;qs఻⪺⫪lanôౕĀ;sౕ⫴»శiíౝĀ;rవ⫾iĀ;eచథiäඐĀpt⬌⬑f;쀀𝕟膀¬;in⬙⬚⬶䂬nȀ;Edvஉ⬤⬨⬮;쀀⋹̸ot;쀀⋵̸ǡஉ⬳⬵;拷;拶iĀ;vಸ⬼ǡಸ⭁⭃;拾;拽ƀaor⭋⭣⭩rȀ;ast୻⭕⭚⭟lleì୻l;쀀⫽⃥;쀀∂̸lint;樔ƀ;ceಒ⭰⭳uåಥĀ;cಘ⭸Ā;eಒ⭽ñಘȀAait⮈⮋⮝⮧rò⦈rrƀ;cw⮔⮕⮙憛;쀀⤳̸;쀀↝̸ghtarrow»⮕riĀ;eೋೖ΀chimpqu⮽⯍⯙⬄୸⯤⯯Ȁ;cerല⯆ഷ⯉uå൅;쀀𝓃ortɭ⬅\0\0⯖ará⭖mĀ;e൮⯟Ā;q൴൳suĀbp⯫⯭å೸åഋƀbcp⯶ⰑⰙȀ;Ees⯿ⰀഢⰄ抄;쀀⫅̸etĀ;eഛⰋqĀ;qണⰀcĀ;eലⰗñസȀ;EesⰢⰣൟⰧ抅;쀀⫆̸etĀ;e൘ⰮqĀ;qൠⰣȀgilrⰽⰿⱅⱇìௗlde耻ñ䃱çృiangleĀlrⱒⱜeftĀ;eచⱚñదightĀ;eೋⱥñ೗Ā;mⱬⱭ䎽ƀ;esⱴⱵⱹ䀣ro;愖p;怇ҀDHadgilrsⲏⲔⲙⲞⲣⲰⲶⳓⳣash;抭arr;椄p;쀀≍⃒ash;抬ĀetⲨⲬ;쀀≥⃒;쀀>⃒nfin;槞ƀAetⲽⳁⳅrr;椂;쀀≤⃒Ā;rⳊⳍ쀀<⃒ie;쀀⊴⃒ĀAtⳘⳜrr;椃rie;쀀⊵⃒im;쀀∼⃒ƀAan⳰⳴ⴂrr;懖rĀhr⳺⳽k;椣Ā;oᏧᏥear;椧ቓ᪕\0\0\0\0\0\0\0\0\0\0\0\0\0ⴭ\0ⴸⵈⵠⵥ⵲ⶄᬇ\0\0ⶍⶫ\0ⷈⷎ\0ⷜ⸙⸫⸾⹃Ācsⴱ᪗ute耻ó䃳ĀiyⴼⵅrĀ;c᪞ⵂ耻ô䃴;䐾ʀabios᪠ⵒⵗǈⵚlac;䅑v;樸old;榼lig;䅓Ācr⵩⵭ir;榿;쀀𝔬ͯ⵹\0\0⵼\0ⶂn;䋛ave耻ò䃲;槁Ābmⶈ෴ar;榵Ȁacitⶕ⶘ⶥⶨrò᪀Āir⶝ⶠr;榾oss;榻nå๒;槀ƀaeiⶱⶵⶹcr;䅍ga;䏉ƀcdnⷀⷅǍron;䎿;榶pf;쀀𝕠ƀaelⷔ⷗ǒr;榷rp;榹΀;adiosvⷪⷫⷮ⸈⸍⸐⸖戨rò᪆Ȁ;efmⷷⷸ⸂⸅橝rĀ;oⷾⷿ愴f»ⷿ耻ª䂪耻º䂺gof;抶r;橖lope;橗;橛ƀclo⸟⸡⸧ò⸁ash耻ø䃸l;折iŬⸯ⸴de耻õ䃵esĀ;aǛ⸺s;樶ml耻ö䃶bar;挽ૡ⹞\0⹽\0⺀⺝\0⺢⺹\0\0⻋ຜ\0⼓\0\0⼫⾼\0⿈rȀ;astЃ⹧⹲຅脀¶;l⹭⹮䂶leìЃɩ⹸\0\0⹻m;櫳;櫽y;䐿rʀcimpt⺋⺏⺓ᡥ⺗nt;䀥od;䀮il;怰enk;怱r;쀀𝔭ƀimo⺨⺰⺴Ā;v⺭⺮䏆;䏕maô੶ne;明ƀ;tv⺿⻀⻈䏀chfork»´;䏖Āau⻏⻟nĀck⻕⻝kĀ;h⇴⻛;愎ö⇴sҀ;abcdemst⻳⻴ᤈ⻹⻽⼄⼆⼊⼎䀫cir;樣ir;樢Āouᵀ⼂;樥;橲n肻±ຝim;樦wo;樧ƀipu⼙⼠⼥ntint;樕f;쀀𝕡nd耻£䂣Ԁ;Eaceinosu່⼿⽁⽄⽇⾁⾉⾒⽾⾶;檳p;檷uå໙Ā;c໎⽌̀;acens່⽙⽟⽦⽨⽾pproø⽃urlyeñ໙ñ໎ƀaes⽯⽶⽺pprox;檹qq;檵im;拨iíໟmeĀ;s⾈ຮ怲ƀEas⽸⾐⽺ð⽵ƀdfp໬⾙⾯ƀals⾠⾥⾪lar;挮ine;挒urf;挓Ā;t໻⾴ï໻rel;抰Āci⿀⿅r;쀀𝓅;䏈ncsp;怈̀fiopsu⿚⋢⿟⿥⿫⿱r;쀀𝔮pf;쀀𝕢rime;恗cr;쀀𝓆ƀaeo⿸〉〓tĀei⿾々rnionóڰnt;樖stĀ;e【】䀿ñἙô༔઀ABHabcdefhilmnoprstux぀けさすムㄎㄫㅇㅢㅲㆎ㈆㈕㈤㈩㉘㉮㉲㊐㊰㊷ƀartぇおがròႳòϝail;検aròᱥar;楤΀cdenqrtとふへみわゔヌĀeuねぱ;쀀∽̱te;䅕iãᅮmptyv;榳gȀ;del࿑らるろ;榒;榥å࿑uo耻»䂻rր;abcfhlpstw࿜ガクシスゼゾダッデナp;極Ā;f࿠ゴs;椠;椳s;椞ë≝ð✮l;楅im;楴l;憣;憝Āaiパフil;椚oĀ;nホボ戶aló༞ƀabrョリヮrò៥rk;杳ĀakンヽcĀekヹ・;䁽;䁝Āes㄂㄄;榌lĀduㄊㄌ;榎;榐Ȁaeuyㄗㄜㄧㄩron;䅙Ādiㄡㄥil;䅗ì࿲âヺ;䑀Ȁclqsㄴㄷㄽㅄa;椷dhar;楩uoĀ;rȎȍh;憳ƀacgㅎㅟངlȀ;ipsླྀㅘㅛႜnåႻarôྩt;断ƀilrㅩဣㅮsht;楽;쀀𝔯ĀaoㅷㆆrĀduㅽㅿ»ѻĀ;l႑ㆄ;楬Ā;vㆋㆌ䏁;䏱ƀgns㆕ㇹㇼht̀ahlrstㆤㆰ㇂㇘㇤㇮rrowĀ;t࿜ㆭaéトarpoonĀduㆻㆿowîㅾp»႒eftĀah㇊㇐rrowó࿪arpoonóՑightarrows;應quigarro÷ニhreetimes;拌g;䋚ingdotseñἲƀahm㈍㈐㈓rò࿪aòՑ;怏oustĀ;a㈞㈟掱che»㈟mid;櫮Ȁabpt㈲㈽㉀㉒Ānr㈷㈺g;柭r;懾rëဃƀafl㉇㉊㉎r;榆;쀀𝕣us;樮imes;樵Āap㉝㉧rĀ;g㉣㉤䀩t;榔olint;樒arò㇣Ȁachq㉻㊀Ⴜ㊅quo;怺r;쀀𝓇Ābu・㊊oĀ;rȔȓƀhir㊗㊛㊠reåㇸmes;拊iȀ;efl㊪ၙᠡ㊫方tri;槎luhar;楨;愞ൡ㋕㋛㋟㌬㌸㍱\0㍺㎤\0\0㏬㏰\0㐨㑈㑚㒭㒱㓊㓱\0㘖\0\0㘳cute;䅛quï➺Ԁ;Eaceinpsyᇭ㋳㋵㋿㌂㌋㌏㌟㌦㌩;檴ǰ㋺\0㋼;檸on;䅡uåᇾĀ;dᇳ㌇il;䅟rc;䅝ƀEas㌖㌘㌛;檶p;檺im;择olint;樓iíሄ;䑁otƀ;be㌴ᵇ㌵担;橦΀Aacmstx㍆㍊㍗㍛㍞㍣㍭rr;懘rĀhr㍐㍒ë∨Ā;oਸ਼਴t耻§䂧i;䀻war;椩mĀin㍩ðnuóñt;朶rĀ;o㍶⁕쀀𝔰Ȁacoy㎂㎆㎑㎠rp;景Āhy㎋㎏cy;䑉;䑈rtɭ㎙\0\0㎜iäᑤaraì⹯耻­䂭Āgm㎨㎴maƀ;fv㎱㎲㎲䏃;䏂Ѐ;deglnprካ㏅㏉㏎㏖㏞㏡㏦ot;橪Ā;q኱ኰĀ;E㏓㏔檞;檠Ā;E㏛㏜檝;檟e;扆lus;樤arr;楲aròᄽȀaeit㏸㐈㐏㐗Āls㏽㐄lsetmé㍪hp;樳parsl;槤Ādlᑣ㐔e;挣Ā;e㐜㐝檪Ā;s㐢㐣檬;쀀⪬︀ƀflp㐮㐳㑂tcy;䑌Ā;b㐸㐹䀯Ā;a㐾㐿槄r;挿f;쀀𝕤aĀdr㑍ЂesĀ;u㑔㑕晠it»㑕ƀcsu㑠㑹㒟Āau㑥㑯pĀ;sᆈ㑫;쀀⊓︀pĀ;sᆴ㑵;쀀⊔︀uĀbp㑿㒏ƀ;esᆗᆜ㒆etĀ;eᆗ㒍ñᆝƀ;esᆨᆭ㒖etĀ;eᆨ㒝ñᆮƀ;afᅻ㒦ְrť㒫ֱ»ᅼaròᅈȀcemt㒹㒾㓂㓅r;쀀𝓈tmîñiì㐕aræᆾĀar㓎㓕rĀ;f㓔ឿ昆Āan㓚㓭ightĀep㓣㓪psiloîỠhé⺯s»⡒ʀbcmnp㓻㕞ሉ㖋㖎Ҁ;Edemnprs㔎㔏㔑㔕㔞㔣㔬㔱㔶抂;櫅ot;檽Ā;dᇚ㔚ot;櫃ult;櫁ĀEe㔨㔪;櫋;把lus;檿arr;楹ƀeiu㔽㕒㕕tƀ;en㔎㕅㕋qĀ;qᇚ㔏eqĀ;q㔫㔨m;櫇Ābp㕚㕜;櫕;櫓c̀;acensᇭ㕬㕲㕹㕻㌦pproø㋺urlyeñᇾñᇳƀaes㖂㖈㌛pproø㌚qñ㌗g;晪ڀ123;Edehlmnps㖩㖬㖯ሜ㖲㖴㗀㗉㗕㗚㗟㗨㗭耻¹䂹耻²䂲耻³䂳;櫆Āos㖹㖼t;檾ub;櫘Ā;dሢ㗅ot;櫄sĀou㗏㗒l;柉b;櫗arr;楻ult;櫂ĀEe㗤㗦;櫌;抋lus;櫀ƀeiu㗴㘉㘌tƀ;enሜ㗼㘂qĀ;qሢ㖲eqĀ;q㗧㗤m;櫈Ābp㘑㘓;櫔;櫖ƀAan㘜㘠㘭rr;懙rĀhr㘦㘨ë∮Ā;oਫ਩war;椪lig耻ß䃟௡㙑㙝㙠ዎ㙳㙹\0㙾㛂\0\0\0\0\0㛛㜃\0㜉㝬\0\0\0㞇ɲ㙖\0\0㙛get;挖;䏄rë๟ƀaey㙦㙫㙰ron;䅥dil;䅣;䑂lrec;挕r;쀀𝔱Ȁeiko㚆㚝㚵㚼ǲ㚋\0㚑eĀ4fኄኁaƀ;sv㚘㚙㚛䎸ym;䏑Ācn㚢㚲kĀas㚨㚮pproø዁im»ኬsðኞĀas㚺㚮ð዁rn耻þ䃾Ǭ̟㛆⋧es膀×;bd㛏㛐㛘䃗Ā;aᤏ㛕r;樱;樰ƀeps㛡㛣㜀á⩍Ȁ;bcf҆㛬㛰㛴ot;挶ir;櫱Ā;o㛹㛼쀀𝕥rk;櫚á㍢rime;怴ƀaip㜏㜒㝤dåቈ΀adempst㜡㝍㝀㝑㝗㝜㝟ngleʀ;dlqr㜰㜱㜶㝀㝂斵own»ᶻeftĀ;e⠀㜾ñम;扜ightĀ;e㊪㝋ñၚot;旬inus;樺lus;樹b;槍ime;樻ezium;揢ƀcht㝲㝽㞁Āry㝷㝻;쀀𝓉;䑆cy;䑛rok;䅧Āio㞋㞎xô᝷headĀlr㞗㞠eftarro÷ࡏightarrow»ཝऀAHabcdfghlmoprstuw㟐㟓㟗㟤㟰㟼㠎㠜㠣㠴㡑㡝㡫㢩㣌㣒㣪㣶ròϭar;楣Ācr㟜㟢ute耻ú䃺òᅐrǣ㟪\0㟭y;䑞ve;䅭Āiy㟵㟺rc耻û䃻;䑃ƀabh㠃㠆㠋ròᎭlac;䅱aòᏃĀir㠓㠘sht;楾;쀀𝔲rave耻ù䃹š㠧㠱rĀlr㠬㠮»ॗ»ႃlk;斀Āct㠹㡍ɯ㠿\0\0㡊rnĀ;e㡅㡆挜r»㡆op;挏ri;旸Āal㡖㡚cr;䅫肻¨͉Āgp㡢㡦on;䅳f;쀀𝕦̀adhlsuᅋ㡸㡽፲㢑㢠ownáᎳarpoonĀlr㢈㢌efô㠭ighô㠯iƀ;hl㢙㢚㢜䏅»ᏺon»㢚parrows;懈ƀcit㢰㣄㣈ɯ㢶\0\0㣁rnĀ;e㢼㢽挝r»㢽op;挎ng;䅯ri;旹cr;쀀𝓊ƀdir㣙㣝㣢ot;拰lde;䅩iĀ;f㜰㣨»᠓Āam㣯㣲rò㢨l耻ü䃼angle;榧ހABDacdeflnoprsz㤜㤟㤩㤭㦵㦸㦽㧟㧤㧨㧳㧹㧽㨁㨠ròϷarĀ;v㤦㤧櫨;櫩asèϡĀnr㤲㤷grt;榜΀eknprst㓣㥆㥋㥒㥝㥤㦖appá␕othinçẖƀhir㓫⻈㥙opô⾵Ā;hᎷ㥢ïㆍĀiu㥩㥭gmá㎳Ābp㥲㦄setneqĀ;q㥽㦀쀀⊊︀;쀀⫋︀setneqĀ;q㦏㦒쀀⊋︀;쀀⫌︀Āhr㦛㦟etá㚜iangleĀlr㦪㦯eft»थight»ၑy;䐲ash»ံƀelr㧄㧒㧗ƀ;beⷪ㧋㧏ar;抻q;扚lip;拮Ābt㧜ᑨaòᑩr;쀀𝔳tré㦮suĀbp㧯㧱»ജ»൙pf;쀀𝕧roð໻tré㦴Ācu㨆㨋r;쀀𝓋Ābp㨐㨘nĀEe㦀㨖»㥾nĀEe㦒㨞»㦐igzag;榚΀cefoprs㨶㨻㩖㩛㩔㩡㩪irc;䅵Ādi㩀㩑Ābg㩅㩉ar;機eĀ;qᗺ㩏;扙erp;愘r;쀀𝔴pf;쀀𝕨Ā;eᑹ㩦atèᑹcr;쀀𝓌ૣណ㪇\0㪋\0㪐㪛\0\0㪝㪨㪫㪯\0\0㫃㫎\0㫘ៜ៟tré៑r;쀀𝔵ĀAa㪔㪗ròσrò৶;䎾ĀAa㪡㪤ròθrò৫að✓is;拻ƀdptឤ㪵㪾Āfl㪺ឩ;쀀𝕩imåឲĀAa㫇㫊ròώròਁĀcq㫒ីr;쀀𝓍Āpt៖㫜ré។Ѐacefiosu㫰㫽㬈㬌㬑㬕㬛㬡cĀuy㫶㫻te耻ý䃽;䑏Āiy㬂㬆rc;䅷;䑋n耻¥䂥r;쀀𝔶cy;䑗pf;쀀𝕪cr;쀀𝓎Ācm㬦㬩y;䑎l耻ÿ䃿Ԁacdefhiosw㭂㭈㭔㭘㭤㭩㭭㭴㭺㮀cute;䅺Āay㭍㭒ron;䅾;䐷ot;䅼Āet㭝㭡træᕟa;䎶r;쀀𝔷cy;䐶grarr;懝pf;쀀𝕫cr;쀀𝓏Ājn㮅㮇;怍j;怌".split("").map((c) => c.charCodeAt(0)));

//#endregion
//#region node_modules/hast-util-raw/node_modules/entities/dist/esm/decode-codepoint.js
var _a;
const decodeMap = new Map([
	[0, 65533],
	[128, 8364],
	[130, 8218],
	[131, 402],
	[132, 8222],
	[133, 8230],
	[134, 8224],
	[135, 8225],
	[136, 710],
	[137, 8240],
	[138, 352],
	[139, 8249],
	[140, 338],
	[142, 381],
	[145, 8216],
	[146, 8217],
	[147, 8220],
	[148, 8221],
	[149, 8226],
	[150, 8211],
	[151, 8212],
	[152, 732],
	[153, 8482],
	[154, 353],
	[155, 8250],
	[156, 339],
	[158, 382],
	[159, 376]
]);
/**
* Polyfill for `String.fromCodePoint`. It is used to create a string from a Unicode code point.
*/
const fromCodePoint = (_a = String.fromCodePoint) !== null && _a !== void 0 ? _a : function(codePoint) {
	let output = "";
	if (codePoint > 65535) {
		codePoint -= 65536;
		output += String.fromCharCode(codePoint >>> 10 & 1023 | 55296);
		codePoint = 56320 | codePoint & 1023;
	}
	output += String.fromCharCode(codePoint);
	return output;
};
/**
* Replace the given code point with a replacement character if it is a
* surrogate or is outside the valid range. Otherwise return the code
* point unchanged.
*/
function replaceCodePoint(codePoint) {
	var _a$1;
	if (codePoint >= 55296 && codePoint <= 57343 || codePoint > 1114111) return 65533;
	return (_a$1 = decodeMap.get(codePoint)) !== null && _a$1 !== void 0 ? _a$1 : codePoint;
}

//#endregion
//#region node_modules/hast-util-raw/node_modules/entities/dist/esm/decode.js
var CharCodes;
(function(CharCodes$1) {
	CharCodes$1[CharCodes$1["NUM"] = 35] = "NUM";
	CharCodes$1[CharCodes$1["SEMI"] = 59] = "SEMI";
	CharCodes$1[CharCodes$1["EQUALS"] = 61] = "EQUALS";
	CharCodes$1[CharCodes$1["ZERO"] = 48] = "ZERO";
	CharCodes$1[CharCodes$1["NINE"] = 57] = "NINE";
	CharCodes$1[CharCodes$1["LOWER_A"] = 97] = "LOWER_A";
	CharCodes$1[CharCodes$1["LOWER_F"] = 102] = "LOWER_F";
	CharCodes$1[CharCodes$1["LOWER_X"] = 120] = "LOWER_X";
	CharCodes$1[CharCodes$1["LOWER_Z"] = 122] = "LOWER_Z";
	CharCodes$1[CharCodes$1["UPPER_A"] = 65] = "UPPER_A";
	CharCodes$1[CharCodes$1["UPPER_F"] = 70] = "UPPER_F";
	CharCodes$1[CharCodes$1["UPPER_Z"] = 90] = "UPPER_Z";
})(CharCodes || (CharCodes = {}));
/** Bit that needs to be set to convert an upper case ASCII character to lower case */
const TO_LOWER_BIT = 32;
var BinTrieFlags;
(function(BinTrieFlags$1) {
	BinTrieFlags$1[BinTrieFlags$1["VALUE_LENGTH"] = 49152] = "VALUE_LENGTH";
	BinTrieFlags$1[BinTrieFlags$1["BRANCH_LENGTH"] = 16256] = "BRANCH_LENGTH";
	BinTrieFlags$1[BinTrieFlags$1["JUMP_TABLE"] = 127] = "JUMP_TABLE";
})(BinTrieFlags || (BinTrieFlags = {}));
function isNumber(code$3) {
	return code$3 >= CharCodes.ZERO && code$3 <= CharCodes.NINE;
}
function isHexadecimalCharacter(code$3) {
	return code$3 >= CharCodes.UPPER_A && code$3 <= CharCodes.UPPER_F || code$3 >= CharCodes.LOWER_A && code$3 <= CharCodes.LOWER_F;
}
function isAsciiAlphaNumeric$1(code$3) {
	return code$3 >= CharCodes.UPPER_A && code$3 <= CharCodes.UPPER_Z || code$3 >= CharCodes.LOWER_A && code$3 <= CharCodes.LOWER_Z || isNumber(code$3);
}
/**
* Checks if the given character is a valid end character for an entity in an attribute.
*
* Attribute values that aren't terminated properly aren't parsed, and shouldn't lead to a parser error.
* See the example in https://html.spec.whatwg.org/multipage/parsing.html#named-character-reference-state
*/
function isEntityInAttributeInvalidEnd(code$3) {
	return code$3 === CharCodes.EQUALS || isAsciiAlphaNumeric$1(code$3);
}
var EntityDecoderState;
(function(EntityDecoderState$1) {
	EntityDecoderState$1[EntityDecoderState$1["EntityStart"] = 0] = "EntityStart";
	EntityDecoderState$1[EntityDecoderState$1["NumericStart"] = 1] = "NumericStart";
	EntityDecoderState$1[EntityDecoderState$1["NumericDecimal"] = 2] = "NumericDecimal";
	EntityDecoderState$1[EntityDecoderState$1["NumericHex"] = 3] = "NumericHex";
	EntityDecoderState$1[EntityDecoderState$1["NamedEntity"] = 4] = "NamedEntity";
})(EntityDecoderState || (EntityDecoderState = {}));
var DecodingMode;
(function(DecodingMode$1) {
	/** Entities in text nodes that can end with any character. */
	DecodingMode$1[DecodingMode$1["Legacy"] = 0] = "Legacy";
	/** Only allow entities terminated with a semicolon. */
	DecodingMode$1[DecodingMode$1["Strict"] = 1] = "Strict";
	/** Entities in attributes have limitations on ending characters. */
	DecodingMode$1[DecodingMode$1["Attribute"] = 2] = "Attribute";
})(DecodingMode || (DecodingMode = {}));
/**
* Token decoder with support of writing partial entities.
*/
var EntityDecoder = class {
	constructor(decodeTree, emitCodePoint, errors) {
		this.decodeTree = decodeTree;
		this.emitCodePoint = emitCodePoint;
		this.errors = errors;
		/** The current state of the decoder. */
		this.state = EntityDecoderState.EntityStart;
		/** Characters that were consumed while parsing an entity. */
		this.consumed = 1;
		/**
		* The result of the entity.
		*
		* Either the result index of a numeric entity, or the codepoint of a
		* numeric entity.
		*/
		this.result = 0;
		/** The current index in the decode tree. */
		this.treeIndex = 0;
		/** The number of characters that were consumed in excess. */
		this.excess = 1;
		/** The mode in which the decoder is operating. */
		this.decodeMode = DecodingMode.Strict;
	}
	/** Resets the instance to make it reusable. */
	startEntity(decodeMode) {
		this.decodeMode = decodeMode;
		this.state = EntityDecoderState.EntityStart;
		this.result = 0;
		this.treeIndex = 0;
		this.excess = 1;
		this.consumed = 1;
	}
	/**
	* Write an entity to the decoder. This can be called multiple times with partial entities.
	* If the entity is incomplete, the decoder will return -1.
	*
	* Mirrors the implementation of `getDecoder`, but with the ability to stop decoding if the
	* entity is incomplete, and resume when the next string is written.
	*
	* @param input The string containing the entity (or a continuation of the entity).
	* @param offset The offset at which the entity begins. Should be 0 if this is not the first call.
	* @returns The number of characters that were consumed, or -1 if the entity is incomplete.
	*/
	write(input, offset) {
		switch (this.state) {
			case EntityDecoderState.EntityStart:
				if (input.charCodeAt(offset) === CharCodes.NUM) {
					this.state = EntityDecoderState.NumericStart;
					this.consumed += 1;
					return this.stateNumericStart(input, offset + 1);
				}
				this.state = EntityDecoderState.NamedEntity;
				return this.stateNamedEntity(input, offset);
			case EntityDecoderState.NumericStart: return this.stateNumericStart(input, offset);
			case EntityDecoderState.NumericDecimal: return this.stateNumericDecimal(input, offset);
			case EntityDecoderState.NumericHex: return this.stateNumericHex(input, offset);
			case EntityDecoderState.NamedEntity: return this.stateNamedEntity(input, offset);
		}
	}
	/**
	* Switches between the numeric decimal and hexadecimal states.
	*
	* Equivalent to the `Numeric character reference state` in the HTML spec.
	*
	* @param input The string containing the entity (or a continuation of the entity).
	* @param offset The current offset.
	* @returns The number of characters that were consumed, or -1 if the entity is incomplete.
	*/
	stateNumericStart(input, offset) {
		if (offset >= input.length) return -1;
		if ((input.charCodeAt(offset) | TO_LOWER_BIT) === CharCodes.LOWER_X) {
			this.state = EntityDecoderState.NumericHex;
			this.consumed += 1;
			return this.stateNumericHex(input, offset + 1);
		}
		this.state = EntityDecoderState.NumericDecimal;
		return this.stateNumericDecimal(input, offset);
	}
	addToNumericResult(input, start, end, base) {
		if (start !== end) {
			const digitCount = end - start;
			this.result = this.result * Math.pow(base, digitCount) + Number.parseInt(input.substr(start, digitCount), base);
			this.consumed += digitCount;
		}
	}
	/**
	* Parses a hexadecimal numeric entity.
	*
	* Equivalent to the `Hexademical character reference state` in the HTML spec.
	*
	* @param input The string containing the entity (or a continuation of the entity).
	* @param offset The current offset.
	* @returns The number of characters that were consumed, or -1 if the entity is incomplete.
	*/
	stateNumericHex(input, offset) {
		const startIndex = offset;
		while (offset < input.length) {
			const char = input.charCodeAt(offset);
			if (isNumber(char) || isHexadecimalCharacter(char)) offset += 1;
			else {
				this.addToNumericResult(input, startIndex, offset, 16);
				return this.emitNumericEntity(char, 3);
			}
		}
		this.addToNumericResult(input, startIndex, offset, 16);
		return -1;
	}
	/**
	* Parses a decimal numeric entity.
	*
	* Equivalent to the `Decimal character reference state` in the HTML spec.
	*
	* @param input The string containing the entity (or a continuation of the entity).
	* @param offset The current offset.
	* @returns The number of characters that were consumed, or -1 if the entity is incomplete.
	*/
	stateNumericDecimal(input, offset) {
		const startIndex = offset;
		while (offset < input.length) {
			const char = input.charCodeAt(offset);
			if (isNumber(char)) offset += 1;
			else {
				this.addToNumericResult(input, startIndex, offset, 10);
				return this.emitNumericEntity(char, 2);
			}
		}
		this.addToNumericResult(input, startIndex, offset, 10);
		return -1;
	}
	/**
	* Validate and emit a numeric entity.
	*
	* Implements the logic from the `Hexademical character reference start
	* state` and `Numeric character reference end state` in the HTML spec.
	*
	* @param lastCp The last code point of the entity. Used to see if the
	*               entity was terminated with a semicolon.
	* @param expectedLength The minimum number of characters that should be
	*                       consumed. Used to validate that at least one digit
	*                       was consumed.
	* @returns The number of characters that were consumed.
	*/
	emitNumericEntity(lastCp, expectedLength) {
		var _a$1;
		if (this.consumed <= expectedLength) {
			(_a$1 = this.errors) === null || _a$1 === void 0 || _a$1.absenceOfDigitsInNumericCharacterReference(this.consumed);
			return 0;
		}
		if (lastCp === CharCodes.SEMI) this.consumed += 1;
		else if (this.decodeMode === DecodingMode.Strict) return 0;
		this.emitCodePoint(replaceCodePoint(this.result), this.consumed);
		if (this.errors) {
			if (lastCp !== CharCodes.SEMI) this.errors.missingSemicolonAfterCharacterReference();
			this.errors.validateNumericCharacterReference(this.result);
		}
		return this.consumed;
	}
	/**
	* Parses a named entity.
	*
	* Equivalent to the `Named character reference state` in the HTML spec.
	*
	* @param input The string containing the entity (or a continuation of the entity).
	* @param offset The current offset.
	* @returns The number of characters that were consumed, or -1 if the entity is incomplete.
	*/
	stateNamedEntity(input, offset) {
		const { decodeTree } = this;
		let current = decodeTree[this.treeIndex];
		let valueLength = (current & BinTrieFlags.VALUE_LENGTH) >> 14;
		for (; offset < input.length; offset++, this.excess++) {
			const char = input.charCodeAt(offset);
			this.treeIndex = determineBranch(decodeTree, current, this.treeIndex + Math.max(1, valueLength), char);
			if (this.treeIndex < 0) return this.result === 0 || this.decodeMode === DecodingMode.Attribute && (valueLength === 0 || isEntityInAttributeInvalidEnd(char)) ? 0 : this.emitNotTerminatedNamedEntity();
			current = decodeTree[this.treeIndex];
			valueLength = (current & BinTrieFlags.VALUE_LENGTH) >> 14;
			if (valueLength !== 0) {
				if (char === CharCodes.SEMI) return this.emitNamedEntityData(this.treeIndex, valueLength, this.consumed + this.excess);
				if (this.decodeMode !== DecodingMode.Strict) {
					this.result = this.treeIndex;
					this.consumed += this.excess;
					this.excess = 0;
				}
			}
		}
		return -1;
	}
	/**
	* Emit a named entity that was not terminated with a semicolon.
	*
	* @returns The number of characters consumed.
	*/
	emitNotTerminatedNamedEntity() {
		var _a$1;
		const { result, decodeTree } = this;
		const valueLength = (decodeTree[result] & BinTrieFlags.VALUE_LENGTH) >> 14;
		this.emitNamedEntityData(result, valueLength, this.consumed);
		(_a$1 = this.errors) === null || _a$1 === void 0 || _a$1.missingSemicolonAfterCharacterReference();
		return this.consumed;
	}
	/**
	* Emit a named entity.
	*
	* @param result The index of the entity in the decode tree.
	* @param valueLength The number of bytes in the entity.
	* @param consumed The number of characters consumed.
	*
	* @returns The number of characters consumed.
	*/
	emitNamedEntityData(result, valueLength, consumed) {
		const { decodeTree } = this;
		this.emitCodePoint(valueLength === 1 ? decodeTree[result] & ~BinTrieFlags.VALUE_LENGTH : decodeTree[result + 1], consumed);
		if (valueLength === 3) this.emitCodePoint(decodeTree[result + 2], consumed);
		return consumed;
	}
	/**
	* Signal to the parser that the end of the input was reached.
	*
	* Remaining data will be emitted and relevant errors will be produced.
	*
	* @returns The number of characters consumed.
	*/
	end() {
		var _a$1;
		switch (this.state) {
			case EntityDecoderState.NamedEntity: return this.result !== 0 && (this.decodeMode !== DecodingMode.Attribute || this.result === this.treeIndex) ? this.emitNotTerminatedNamedEntity() : 0;
			case EntityDecoderState.NumericDecimal: return this.emitNumericEntity(0, 2);
			case EntityDecoderState.NumericHex: return this.emitNumericEntity(0, 3);
			case EntityDecoderState.NumericStart:
				(_a$1 = this.errors) === null || _a$1 === void 0 || _a$1.absenceOfDigitsInNumericCharacterReference(this.consumed);
				return 0;
			case EntityDecoderState.EntityStart: return 0;
		}
	}
};
/**
* Determines the branch of the current node that is taken given the current
* character. This function is used to traverse the trie.
*
* @param decodeTree The trie.
* @param current The current node.
* @param nodeIdx The index right after the current node and its value.
* @param char The current character.
* @returns The index of the next node, or -1 if no branch is taken.
*/
function determineBranch(decodeTree, current, nodeIndex, char) {
	const branchCount = (current & BinTrieFlags.BRANCH_LENGTH) >> 7;
	const jumpOffset = current & BinTrieFlags.JUMP_TABLE;
	if (branchCount === 0) return jumpOffset !== 0 && char === jumpOffset ? nodeIndex : -1;
	if (jumpOffset) {
		const value = char - jumpOffset;
		return value < 0 || value >= branchCount ? -1 : decodeTree[nodeIndex + value] - 1;
	}
	let lo = nodeIndex;
	let hi = lo + branchCount - 1;
	while (lo <= hi) {
		const mid = lo + hi >>> 1;
		const midValue = decodeTree[mid];
		if (midValue < char) lo = mid + 1;
		else if (midValue > char) hi = mid - 1;
		else return decodeTree[mid + branchCount];
	}
	return -1;
}

//#endregion
//#region node_modules/hast-util-raw/node_modules/parse5/dist/common/html.js
/** All valid namespaces in HTML. */
var NS$1;
(function(NS$2) {
	NS$2["HTML"] = "http://www.w3.org/1999/xhtml";
	NS$2["MATHML"] = "http://www.w3.org/1998/Math/MathML";
	NS$2["SVG"] = "http://www.w3.org/2000/svg";
	NS$2["XLINK"] = "http://www.w3.org/1999/xlink";
	NS$2["XML"] = "http://www.w3.org/XML/1998/namespace";
	NS$2["XMLNS"] = "http://www.w3.org/2000/xmlns/";
})(NS$1 || (NS$1 = {}));
var ATTRS;
(function(ATTRS$1) {
	ATTRS$1["TYPE"] = "type";
	ATTRS$1["ACTION"] = "action";
	ATTRS$1["ENCODING"] = "encoding";
	ATTRS$1["PROMPT"] = "prompt";
	ATTRS$1["NAME"] = "name";
	ATTRS$1["COLOR"] = "color";
	ATTRS$1["FACE"] = "face";
	ATTRS$1["SIZE"] = "size";
})(ATTRS || (ATTRS = {}));
/**
* The mode of the document.
*
* @see {@link https://dom.spec.whatwg.org/#concept-document-limited-quirks}
*/
var DOCUMENT_MODE;
(function(DOCUMENT_MODE$1) {
	DOCUMENT_MODE$1["NO_QUIRKS"] = "no-quirks";
	DOCUMENT_MODE$1["QUIRKS"] = "quirks";
	DOCUMENT_MODE$1["LIMITED_QUIRKS"] = "limited-quirks";
})(DOCUMENT_MODE || (DOCUMENT_MODE = {}));
var TAG_NAMES;
(function(TAG_NAMES$1) {
	TAG_NAMES$1["A"] = "a";
	TAG_NAMES$1["ADDRESS"] = "address";
	TAG_NAMES$1["ANNOTATION_XML"] = "annotation-xml";
	TAG_NAMES$1["APPLET"] = "applet";
	TAG_NAMES$1["AREA"] = "area";
	TAG_NAMES$1["ARTICLE"] = "article";
	TAG_NAMES$1["ASIDE"] = "aside";
	TAG_NAMES$1["B"] = "b";
	TAG_NAMES$1["BASE"] = "base";
	TAG_NAMES$1["BASEFONT"] = "basefont";
	TAG_NAMES$1["BGSOUND"] = "bgsound";
	TAG_NAMES$1["BIG"] = "big";
	TAG_NAMES$1["BLOCKQUOTE"] = "blockquote";
	TAG_NAMES$1["BODY"] = "body";
	TAG_NAMES$1["BR"] = "br";
	TAG_NAMES$1["BUTTON"] = "button";
	TAG_NAMES$1["CAPTION"] = "caption";
	TAG_NAMES$1["CENTER"] = "center";
	TAG_NAMES$1["CODE"] = "code";
	TAG_NAMES$1["COL"] = "col";
	TAG_NAMES$1["COLGROUP"] = "colgroup";
	TAG_NAMES$1["DD"] = "dd";
	TAG_NAMES$1["DESC"] = "desc";
	TAG_NAMES$1["DETAILS"] = "details";
	TAG_NAMES$1["DIALOG"] = "dialog";
	TAG_NAMES$1["DIR"] = "dir";
	TAG_NAMES$1["DIV"] = "div";
	TAG_NAMES$1["DL"] = "dl";
	TAG_NAMES$1["DT"] = "dt";
	TAG_NAMES$1["EM"] = "em";
	TAG_NAMES$1["EMBED"] = "embed";
	TAG_NAMES$1["FIELDSET"] = "fieldset";
	TAG_NAMES$1["FIGCAPTION"] = "figcaption";
	TAG_NAMES$1["FIGURE"] = "figure";
	TAG_NAMES$1["FONT"] = "font";
	TAG_NAMES$1["FOOTER"] = "footer";
	TAG_NAMES$1["FOREIGN_OBJECT"] = "foreignObject";
	TAG_NAMES$1["FORM"] = "form";
	TAG_NAMES$1["FRAME"] = "frame";
	TAG_NAMES$1["FRAMESET"] = "frameset";
	TAG_NAMES$1["H1"] = "h1";
	TAG_NAMES$1["H2"] = "h2";
	TAG_NAMES$1["H3"] = "h3";
	TAG_NAMES$1["H4"] = "h4";
	TAG_NAMES$1["H5"] = "h5";
	TAG_NAMES$1["H6"] = "h6";
	TAG_NAMES$1["HEAD"] = "head";
	TAG_NAMES$1["HEADER"] = "header";
	TAG_NAMES$1["HGROUP"] = "hgroup";
	TAG_NAMES$1["HR"] = "hr";
	TAG_NAMES$1["HTML"] = "html";
	TAG_NAMES$1["I"] = "i";
	TAG_NAMES$1["IMG"] = "img";
	TAG_NAMES$1["IMAGE"] = "image";
	TAG_NAMES$1["INPUT"] = "input";
	TAG_NAMES$1["IFRAME"] = "iframe";
	TAG_NAMES$1["KEYGEN"] = "keygen";
	TAG_NAMES$1["LABEL"] = "label";
	TAG_NAMES$1["LI"] = "li";
	TAG_NAMES$1["LINK"] = "link";
	TAG_NAMES$1["LISTING"] = "listing";
	TAG_NAMES$1["MAIN"] = "main";
	TAG_NAMES$1["MALIGNMARK"] = "malignmark";
	TAG_NAMES$1["MARQUEE"] = "marquee";
	TAG_NAMES$1["MATH"] = "math";
	TAG_NAMES$1["MENU"] = "menu";
	TAG_NAMES$1["META"] = "meta";
	TAG_NAMES$1["MGLYPH"] = "mglyph";
	TAG_NAMES$1["MI"] = "mi";
	TAG_NAMES$1["MO"] = "mo";
	TAG_NAMES$1["MN"] = "mn";
	TAG_NAMES$1["MS"] = "ms";
	TAG_NAMES$1["MTEXT"] = "mtext";
	TAG_NAMES$1["NAV"] = "nav";
	TAG_NAMES$1["NOBR"] = "nobr";
	TAG_NAMES$1["NOFRAMES"] = "noframes";
	TAG_NAMES$1["NOEMBED"] = "noembed";
	TAG_NAMES$1["NOSCRIPT"] = "noscript";
	TAG_NAMES$1["OBJECT"] = "object";
	TAG_NAMES$1["OL"] = "ol";
	TAG_NAMES$1["OPTGROUP"] = "optgroup";
	TAG_NAMES$1["OPTION"] = "option";
	TAG_NAMES$1["P"] = "p";
	TAG_NAMES$1["PARAM"] = "param";
	TAG_NAMES$1["PLAINTEXT"] = "plaintext";
	TAG_NAMES$1["PRE"] = "pre";
	TAG_NAMES$1["RB"] = "rb";
	TAG_NAMES$1["RP"] = "rp";
	TAG_NAMES$1["RT"] = "rt";
	TAG_NAMES$1["RTC"] = "rtc";
	TAG_NAMES$1["RUBY"] = "ruby";
	TAG_NAMES$1["S"] = "s";
	TAG_NAMES$1["SCRIPT"] = "script";
	TAG_NAMES$1["SEARCH"] = "search";
	TAG_NAMES$1["SECTION"] = "section";
	TAG_NAMES$1["SELECT"] = "select";
	TAG_NAMES$1["SOURCE"] = "source";
	TAG_NAMES$1["SMALL"] = "small";
	TAG_NAMES$1["SPAN"] = "span";
	TAG_NAMES$1["STRIKE"] = "strike";
	TAG_NAMES$1["STRONG"] = "strong";
	TAG_NAMES$1["STYLE"] = "style";
	TAG_NAMES$1["SUB"] = "sub";
	TAG_NAMES$1["SUMMARY"] = "summary";
	TAG_NAMES$1["SUP"] = "sup";
	TAG_NAMES$1["TABLE"] = "table";
	TAG_NAMES$1["TBODY"] = "tbody";
	TAG_NAMES$1["TEMPLATE"] = "template";
	TAG_NAMES$1["TEXTAREA"] = "textarea";
	TAG_NAMES$1["TFOOT"] = "tfoot";
	TAG_NAMES$1["TD"] = "td";
	TAG_NAMES$1["TH"] = "th";
	TAG_NAMES$1["THEAD"] = "thead";
	TAG_NAMES$1["TITLE"] = "title";
	TAG_NAMES$1["TR"] = "tr";
	TAG_NAMES$1["TRACK"] = "track";
	TAG_NAMES$1["TT"] = "tt";
	TAG_NAMES$1["U"] = "u";
	TAG_NAMES$1["UL"] = "ul";
	TAG_NAMES$1["SVG"] = "svg";
	TAG_NAMES$1["VAR"] = "var";
	TAG_NAMES$1["WBR"] = "wbr";
	TAG_NAMES$1["XMP"] = "xmp";
})(TAG_NAMES || (TAG_NAMES = {}));
/**
* Tag IDs are numeric IDs for known tag names.
*
* We use tag IDs to improve the performance of tag name comparisons.
*/
var TAG_ID;
(function(TAG_ID$1) {
	TAG_ID$1[TAG_ID$1["UNKNOWN"] = 0] = "UNKNOWN";
	TAG_ID$1[TAG_ID$1["A"] = 1] = "A";
	TAG_ID$1[TAG_ID$1["ADDRESS"] = 2] = "ADDRESS";
	TAG_ID$1[TAG_ID$1["ANNOTATION_XML"] = 3] = "ANNOTATION_XML";
	TAG_ID$1[TAG_ID$1["APPLET"] = 4] = "APPLET";
	TAG_ID$1[TAG_ID$1["AREA"] = 5] = "AREA";
	TAG_ID$1[TAG_ID$1["ARTICLE"] = 6] = "ARTICLE";
	TAG_ID$1[TAG_ID$1["ASIDE"] = 7] = "ASIDE";
	TAG_ID$1[TAG_ID$1["B"] = 8] = "B";
	TAG_ID$1[TAG_ID$1["BASE"] = 9] = "BASE";
	TAG_ID$1[TAG_ID$1["BASEFONT"] = 10] = "BASEFONT";
	TAG_ID$1[TAG_ID$1["BGSOUND"] = 11] = "BGSOUND";
	TAG_ID$1[TAG_ID$1["BIG"] = 12] = "BIG";
	TAG_ID$1[TAG_ID$1["BLOCKQUOTE"] = 13] = "BLOCKQUOTE";
	TAG_ID$1[TAG_ID$1["BODY"] = 14] = "BODY";
	TAG_ID$1[TAG_ID$1["BR"] = 15] = "BR";
	TAG_ID$1[TAG_ID$1["BUTTON"] = 16] = "BUTTON";
	TAG_ID$1[TAG_ID$1["CAPTION"] = 17] = "CAPTION";
	TAG_ID$1[TAG_ID$1["CENTER"] = 18] = "CENTER";
	TAG_ID$1[TAG_ID$1["CODE"] = 19] = "CODE";
	TAG_ID$1[TAG_ID$1["COL"] = 20] = "COL";
	TAG_ID$1[TAG_ID$1["COLGROUP"] = 21] = "COLGROUP";
	TAG_ID$1[TAG_ID$1["DD"] = 22] = "DD";
	TAG_ID$1[TAG_ID$1["DESC"] = 23] = "DESC";
	TAG_ID$1[TAG_ID$1["DETAILS"] = 24] = "DETAILS";
	TAG_ID$1[TAG_ID$1["DIALOG"] = 25] = "DIALOG";
	TAG_ID$1[TAG_ID$1["DIR"] = 26] = "DIR";
	TAG_ID$1[TAG_ID$1["DIV"] = 27] = "DIV";
	TAG_ID$1[TAG_ID$1["DL"] = 28] = "DL";
	TAG_ID$1[TAG_ID$1["DT"] = 29] = "DT";
	TAG_ID$1[TAG_ID$1["EM"] = 30] = "EM";
	TAG_ID$1[TAG_ID$1["EMBED"] = 31] = "EMBED";
	TAG_ID$1[TAG_ID$1["FIELDSET"] = 32] = "FIELDSET";
	TAG_ID$1[TAG_ID$1["FIGCAPTION"] = 33] = "FIGCAPTION";
	TAG_ID$1[TAG_ID$1["FIGURE"] = 34] = "FIGURE";
	TAG_ID$1[TAG_ID$1["FONT"] = 35] = "FONT";
	TAG_ID$1[TAG_ID$1["FOOTER"] = 36] = "FOOTER";
	TAG_ID$1[TAG_ID$1["FOREIGN_OBJECT"] = 37] = "FOREIGN_OBJECT";
	TAG_ID$1[TAG_ID$1["FORM"] = 38] = "FORM";
	TAG_ID$1[TAG_ID$1["FRAME"] = 39] = "FRAME";
	TAG_ID$1[TAG_ID$1["FRAMESET"] = 40] = "FRAMESET";
	TAG_ID$1[TAG_ID$1["H1"] = 41] = "H1";
	TAG_ID$1[TAG_ID$1["H2"] = 42] = "H2";
	TAG_ID$1[TAG_ID$1["H3"] = 43] = "H3";
	TAG_ID$1[TAG_ID$1["H4"] = 44] = "H4";
	TAG_ID$1[TAG_ID$1["H5"] = 45] = "H5";
	TAG_ID$1[TAG_ID$1["H6"] = 46] = "H6";
	TAG_ID$1[TAG_ID$1["HEAD"] = 47] = "HEAD";
	TAG_ID$1[TAG_ID$1["HEADER"] = 48] = "HEADER";
	TAG_ID$1[TAG_ID$1["HGROUP"] = 49] = "HGROUP";
	TAG_ID$1[TAG_ID$1["HR"] = 50] = "HR";
	TAG_ID$1[TAG_ID$1["HTML"] = 51] = "HTML";
	TAG_ID$1[TAG_ID$1["I"] = 52] = "I";
	TAG_ID$1[TAG_ID$1["IMG"] = 53] = "IMG";
	TAG_ID$1[TAG_ID$1["IMAGE"] = 54] = "IMAGE";
	TAG_ID$1[TAG_ID$1["INPUT"] = 55] = "INPUT";
	TAG_ID$1[TAG_ID$1["IFRAME"] = 56] = "IFRAME";
	TAG_ID$1[TAG_ID$1["KEYGEN"] = 57] = "KEYGEN";
	TAG_ID$1[TAG_ID$1["LABEL"] = 58] = "LABEL";
	TAG_ID$1[TAG_ID$1["LI"] = 59] = "LI";
	TAG_ID$1[TAG_ID$1["LINK"] = 60] = "LINK";
	TAG_ID$1[TAG_ID$1["LISTING"] = 61] = "LISTING";
	TAG_ID$1[TAG_ID$1["MAIN"] = 62] = "MAIN";
	TAG_ID$1[TAG_ID$1["MALIGNMARK"] = 63] = "MALIGNMARK";
	TAG_ID$1[TAG_ID$1["MARQUEE"] = 64] = "MARQUEE";
	TAG_ID$1[TAG_ID$1["MATH"] = 65] = "MATH";
	TAG_ID$1[TAG_ID$1["MENU"] = 66] = "MENU";
	TAG_ID$1[TAG_ID$1["META"] = 67] = "META";
	TAG_ID$1[TAG_ID$1["MGLYPH"] = 68] = "MGLYPH";
	TAG_ID$1[TAG_ID$1["MI"] = 69] = "MI";
	TAG_ID$1[TAG_ID$1["MO"] = 70] = "MO";
	TAG_ID$1[TAG_ID$1["MN"] = 71] = "MN";
	TAG_ID$1[TAG_ID$1["MS"] = 72] = "MS";
	TAG_ID$1[TAG_ID$1["MTEXT"] = 73] = "MTEXT";
	TAG_ID$1[TAG_ID$1["NAV"] = 74] = "NAV";
	TAG_ID$1[TAG_ID$1["NOBR"] = 75] = "NOBR";
	TAG_ID$1[TAG_ID$1["NOFRAMES"] = 76] = "NOFRAMES";
	TAG_ID$1[TAG_ID$1["NOEMBED"] = 77] = "NOEMBED";
	TAG_ID$1[TAG_ID$1["NOSCRIPT"] = 78] = "NOSCRIPT";
	TAG_ID$1[TAG_ID$1["OBJECT"] = 79] = "OBJECT";
	TAG_ID$1[TAG_ID$1["OL"] = 80] = "OL";
	TAG_ID$1[TAG_ID$1["OPTGROUP"] = 81] = "OPTGROUP";
	TAG_ID$1[TAG_ID$1["OPTION"] = 82] = "OPTION";
	TAG_ID$1[TAG_ID$1["P"] = 83] = "P";
	TAG_ID$1[TAG_ID$1["PARAM"] = 84] = "PARAM";
	TAG_ID$1[TAG_ID$1["PLAINTEXT"] = 85] = "PLAINTEXT";
	TAG_ID$1[TAG_ID$1["PRE"] = 86] = "PRE";
	TAG_ID$1[TAG_ID$1["RB"] = 87] = "RB";
	TAG_ID$1[TAG_ID$1["RP"] = 88] = "RP";
	TAG_ID$1[TAG_ID$1["RT"] = 89] = "RT";
	TAG_ID$1[TAG_ID$1["RTC"] = 90] = "RTC";
	TAG_ID$1[TAG_ID$1["RUBY"] = 91] = "RUBY";
	TAG_ID$1[TAG_ID$1["S"] = 92] = "S";
	TAG_ID$1[TAG_ID$1["SCRIPT"] = 93] = "SCRIPT";
	TAG_ID$1[TAG_ID$1["SEARCH"] = 94] = "SEARCH";
	TAG_ID$1[TAG_ID$1["SECTION"] = 95] = "SECTION";
	TAG_ID$1[TAG_ID$1["SELECT"] = 96] = "SELECT";
	TAG_ID$1[TAG_ID$1["SOURCE"] = 97] = "SOURCE";
	TAG_ID$1[TAG_ID$1["SMALL"] = 98] = "SMALL";
	TAG_ID$1[TAG_ID$1["SPAN"] = 99] = "SPAN";
	TAG_ID$1[TAG_ID$1["STRIKE"] = 100] = "STRIKE";
	TAG_ID$1[TAG_ID$1["STRONG"] = 101] = "STRONG";
	TAG_ID$1[TAG_ID$1["STYLE"] = 102] = "STYLE";
	TAG_ID$1[TAG_ID$1["SUB"] = 103] = "SUB";
	TAG_ID$1[TAG_ID$1["SUMMARY"] = 104] = "SUMMARY";
	TAG_ID$1[TAG_ID$1["SUP"] = 105] = "SUP";
	TAG_ID$1[TAG_ID$1["TABLE"] = 106] = "TABLE";
	TAG_ID$1[TAG_ID$1["TBODY"] = 107] = "TBODY";
	TAG_ID$1[TAG_ID$1["TEMPLATE"] = 108] = "TEMPLATE";
	TAG_ID$1[TAG_ID$1["TEXTAREA"] = 109] = "TEXTAREA";
	TAG_ID$1[TAG_ID$1["TFOOT"] = 110] = "TFOOT";
	TAG_ID$1[TAG_ID$1["TD"] = 111] = "TD";
	TAG_ID$1[TAG_ID$1["TH"] = 112] = "TH";
	TAG_ID$1[TAG_ID$1["THEAD"] = 113] = "THEAD";
	TAG_ID$1[TAG_ID$1["TITLE"] = 114] = "TITLE";
	TAG_ID$1[TAG_ID$1["TR"] = 115] = "TR";
	TAG_ID$1[TAG_ID$1["TRACK"] = 116] = "TRACK";
	TAG_ID$1[TAG_ID$1["TT"] = 117] = "TT";
	TAG_ID$1[TAG_ID$1["U"] = 118] = "U";
	TAG_ID$1[TAG_ID$1["UL"] = 119] = "UL";
	TAG_ID$1[TAG_ID$1["SVG"] = 120] = "SVG";
	TAG_ID$1[TAG_ID$1["VAR"] = 121] = "VAR";
	TAG_ID$1[TAG_ID$1["WBR"] = 122] = "WBR";
	TAG_ID$1[TAG_ID$1["XMP"] = 123] = "XMP";
})(TAG_ID || (TAG_ID = {}));
const TAG_NAME_TO_ID = new Map([
	[TAG_NAMES.A, TAG_ID.A],
	[TAG_NAMES.ADDRESS, TAG_ID.ADDRESS],
	[TAG_NAMES.ANNOTATION_XML, TAG_ID.ANNOTATION_XML],
	[TAG_NAMES.APPLET, TAG_ID.APPLET],
	[TAG_NAMES.AREA, TAG_ID.AREA],
	[TAG_NAMES.ARTICLE, TAG_ID.ARTICLE],
	[TAG_NAMES.ASIDE, TAG_ID.ASIDE],
	[TAG_NAMES.B, TAG_ID.B],
	[TAG_NAMES.BASE, TAG_ID.BASE],
	[TAG_NAMES.BASEFONT, TAG_ID.BASEFONT],
	[TAG_NAMES.BGSOUND, TAG_ID.BGSOUND],
	[TAG_NAMES.BIG, TAG_ID.BIG],
	[TAG_NAMES.BLOCKQUOTE, TAG_ID.BLOCKQUOTE],
	[TAG_NAMES.BODY, TAG_ID.BODY],
	[TAG_NAMES.BR, TAG_ID.BR],
	[TAG_NAMES.BUTTON, TAG_ID.BUTTON],
	[TAG_NAMES.CAPTION, TAG_ID.CAPTION],
	[TAG_NAMES.CENTER, TAG_ID.CENTER],
	[TAG_NAMES.CODE, TAG_ID.CODE],
	[TAG_NAMES.COL, TAG_ID.COL],
	[TAG_NAMES.COLGROUP, TAG_ID.COLGROUP],
	[TAG_NAMES.DD, TAG_ID.DD],
	[TAG_NAMES.DESC, TAG_ID.DESC],
	[TAG_NAMES.DETAILS, TAG_ID.DETAILS],
	[TAG_NAMES.DIALOG, TAG_ID.DIALOG],
	[TAG_NAMES.DIR, TAG_ID.DIR],
	[TAG_NAMES.DIV, TAG_ID.DIV],
	[TAG_NAMES.DL, TAG_ID.DL],
	[TAG_NAMES.DT, TAG_ID.DT],
	[TAG_NAMES.EM, TAG_ID.EM],
	[TAG_NAMES.EMBED, TAG_ID.EMBED],
	[TAG_NAMES.FIELDSET, TAG_ID.FIELDSET],
	[TAG_NAMES.FIGCAPTION, TAG_ID.FIGCAPTION],
	[TAG_NAMES.FIGURE, TAG_ID.FIGURE],
	[TAG_NAMES.FONT, TAG_ID.FONT],
	[TAG_NAMES.FOOTER, TAG_ID.FOOTER],
	[TAG_NAMES.FOREIGN_OBJECT, TAG_ID.FOREIGN_OBJECT],
	[TAG_NAMES.FORM, TAG_ID.FORM],
	[TAG_NAMES.FRAME, TAG_ID.FRAME],
	[TAG_NAMES.FRAMESET, TAG_ID.FRAMESET],
	[TAG_NAMES.H1, TAG_ID.H1],
	[TAG_NAMES.H2, TAG_ID.H2],
	[TAG_NAMES.H3, TAG_ID.H3],
	[TAG_NAMES.H4, TAG_ID.H4],
	[TAG_NAMES.H5, TAG_ID.H5],
	[TAG_NAMES.H6, TAG_ID.H6],
	[TAG_NAMES.HEAD, TAG_ID.HEAD],
	[TAG_NAMES.HEADER, TAG_ID.HEADER],
	[TAG_NAMES.HGROUP, TAG_ID.HGROUP],
	[TAG_NAMES.HR, TAG_ID.HR],
	[TAG_NAMES.HTML, TAG_ID.HTML],
	[TAG_NAMES.I, TAG_ID.I],
	[TAG_NAMES.IMG, TAG_ID.IMG],
	[TAG_NAMES.IMAGE, TAG_ID.IMAGE],
	[TAG_NAMES.INPUT, TAG_ID.INPUT],
	[TAG_NAMES.IFRAME, TAG_ID.IFRAME],
	[TAG_NAMES.KEYGEN, TAG_ID.KEYGEN],
	[TAG_NAMES.LABEL, TAG_ID.LABEL],
	[TAG_NAMES.LI, TAG_ID.LI],
	[TAG_NAMES.LINK, TAG_ID.LINK],
	[TAG_NAMES.LISTING, TAG_ID.LISTING],
	[TAG_NAMES.MAIN, TAG_ID.MAIN],
	[TAG_NAMES.MALIGNMARK, TAG_ID.MALIGNMARK],
	[TAG_NAMES.MARQUEE, TAG_ID.MARQUEE],
	[TAG_NAMES.MATH, TAG_ID.MATH],
	[TAG_NAMES.MENU, TAG_ID.MENU],
	[TAG_NAMES.META, TAG_ID.META],
	[TAG_NAMES.MGLYPH, TAG_ID.MGLYPH],
	[TAG_NAMES.MI, TAG_ID.MI],
	[TAG_NAMES.MO, TAG_ID.MO],
	[TAG_NAMES.MN, TAG_ID.MN],
	[TAG_NAMES.MS, TAG_ID.MS],
	[TAG_NAMES.MTEXT, TAG_ID.MTEXT],
	[TAG_NAMES.NAV, TAG_ID.NAV],
	[TAG_NAMES.NOBR, TAG_ID.NOBR],
	[TAG_NAMES.NOFRAMES, TAG_ID.NOFRAMES],
	[TAG_NAMES.NOEMBED, TAG_ID.NOEMBED],
	[TAG_NAMES.NOSCRIPT, TAG_ID.NOSCRIPT],
	[TAG_NAMES.OBJECT, TAG_ID.OBJECT],
	[TAG_NAMES.OL, TAG_ID.OL],
	[TAG_NAMES.OPTGROUP, TAG_ID.OPTGROUP],
	[TAG_NAMES.OPTION, TAG_ID.OPTION],
	[TAG_NAMES.P, TAG_ID.P],
	[TAG_NAMES.PARAM, TAG_ID.PARAM],
	[TAG_NAMES.PLAINTEXT, TAG_ID.PLAINTEXT],
	[TAG_NAMES.PRE, TAG_ID.PRE],
	[TAG_NAMES.RB, TAG_ID.RB],
	[TAG_NAMES.RP, TAG_ID.RP],
	[TAG_NAMES.RT, TAG_ID.RT],
	[TAG_NAMES.RTC, TAG_ID.RTC],
	[TAG_NAMES.RUBY, TAG_ID.RUBY],
	[TAG_NAMES.S, TAG_ID.S],
	[TAG_NAMES.SCRIPT, TAG_ID.SCRIPT],
	[TAG_NAMES.SEARCH, TAG_ID.SEARCH],
	[TAG_NAMES.SECTION, TAG_ID.SECTION],
	[TAG_NAMES.SELECT, TAG_ID.SELECT],
	[TAG_NAMES.SOURCE, TAG_ID.SOURCE],
	[TAG_NAMES.SMALL, TAG_ID.SMALL],
	[TAG_NAMES.SPAN, TAG_ID.SPAN],
	[TAG_NAMES.STRIKE, TAG_ID.STRIKE],
	[TAG_NAMES.STRONG, TAG_ID.STRONG],
	[TAG_NAMES.STYLE, TAG_ID.STYLE],
	[TAG_NAMES.SUB, TAG_ID.SUB],
	[TAG_NAMES.SUMMARY, TAG_ID.SUMMARY],
	[TAG_NAMES.SUP, TAG_ID.SUP],
	[TAG_NAMES.TABLE, TAG_ID.TABLE],
	[TAG_NAMES.TBODY, TAG_ID.TBODY],
	[TAG_NAMES.TEMPLATE, TAG_ID.TEMPLATE],
	[TAG_NAMES.TEXTAREA, TAG_ID.TEXTAREA],
	[TAG_NAMES.TFOOT, TAG_ID.TFOOT],
	[TAG_NAMES.TD, TAG_ID.TD],
	[TAG_NAMES.TH, TAG_ID.TH],
	[TAG_NAMES.THEAD, TAG_ID.THEAD],
	[TAG_NAMES.TITLE, TAG_ID.TITLE],
	[TAG_NAMES.TR, TAG_ID.TR],
	[TAG_NAMES.TRACK, TAG_ID.TRACK],
	[TAG_NAMES.TT, TAG_ID.TT],
	[TAG_NAMES.U, TAG_ID.U],
	[TAG_NAMES.UL, TAG_ID.UL],
	[TAG_NAMES.SVG, TAG_ID.SVG],
	[TAG_NAMES.VAR, TAG_ID.VAR],
	[TAG_NAMES.WBR, TAG_ID.WBR],
	[TAG_NAMES.XMP, TAG_ID.XMP]
]);
function getTagID(tagName) {
	var _a$1;
	return (_a$1 = TAG_NAME_TO_ID.get(tagName)) !== null && _a$1 !== void 0 ? _a$1 : TAG_ID.UNKNOWN;
}
const $ = TAG_ID;
const SPECIAL_ELEMENTS = {
	[NS$1.HTML]: new Set([
		$.ADDRESS,
		$.APPLET,
		$.AREA,
		$.ARTICLE,
		$.ASIDE,
		$.BASE,
		$.BASEFONT,
		$.BGSOUND,
		$.BLOCKQUOTE,
		$.BODY,
		$.BR,
		$.BUTTON,
		$.CAPTION,
		$.CENTER,
		$.COL,
		$.COLGROUP,
		$.DD,
		$.DETAILS,
		$.DIR,
		$.DIV,
		$.DL,
		$.DT,
		$.EMBED,
		$.FIELDSET,
		$.FIGCAPTION,
		$.FIGURE,
		$.FOOTER,
		$.FORM,
		$.FRAME,
		$.FRAMESET,
		$.H1,
		$.H2,
		$.H3,
		$.H4,
		$.H5,
		$.H6,
		$.HEAD,
		$.HEADER,
		$.HGROUP,
		$.HR,
		$.HTML,
		$.IFRAME,
		$.IMG,
		$.INPUT,
		$.LI,
		$.LINK,
		$.LISTING,
		$.MAIN,
		$.MARQUEE,
		$.MENU,
		$.META,
		$.NAV,
		$.NOEMBED,
		$.NOFRAMES,
		$.NOSCRIPT,
		$.OBJECT,
		$.OL,
		$.P,
		$.PARAM,
		$.PLAINTEXT,
		$.PRE,
		$.SCRIPT,
		$.SECTION,
		$.SELECT,
		$.SOURCE,
		$.STYLE,
		$.SUMMARY,
		$.TABLE,
		$.TBODY,
		$.TD,
		$.TEMPLATE,
		$.TEXTAREA,
		$.TFOOT,
		$.TH,
		$.THEAD,
		$.TITLE,
		$.TR,
		$.TRACK,
		$.UL,
		$.WBR,
		$.XMP
	]),
	[NS$1.MATHML]: new Set([
		$.MI,
		$.MO,
		$.MN,
		$.MS,
		$.MTEXT,
		$.ANNOTATION_XML
	]),
	[NS$1.SVG]: new Set([
		$.TITLE,
		$.FOREIGN_OBJECT,
		$.DESC
	]),
	[NS$1.XLINK]: /* @__PURE__ */ new Set(),
	[NS$1.XML]: /* @__PURE__ */ new Set(),
	[NS$1.XMLNS]: /* @__PURE__ */ new Set()
};
const NUMBERED_HEADERS = new Set([
	$.H1,
	$.H2,
	$.H3,
	$.H4,
	$.H5,
	$.H6
]);
const UNESCAPED_TEXT = new Set([
	TAG_NAMES.STYLE,
	TAG_NAMES.SCRIPT,
	TAG_NAMES.XMP,
	TAG_NAMES.IFRAME,
	TAG_NAMES.NOEMBED,
	TAG_NAMES.NOFRAMES,
	TAG_NAMES.PLAINTEXT
]);

//#endregion
//#region node_modules/hast-util-raw/node_modules/parse5/dist/tokenizer/index.js
var State;
(function(State$1) {
	State$1[State$1["DATA"] = 0] = "DATA";
	State$1[State$1["RCDATA"] = 1] = "RCDATA";
	State$1[State$1["RAWTEXT"] = 2] = "RAWTEXT";
	State$1[State$1["SCRIPT_DATA"] = 3] = "SCRIPT_DATA";
	State$1[State$1["PLAINTEXT"] = 4] = "PLAINTEXT";
	State$1[State$1["TAG_OPEN"] = 5] = "TAG_OPEN";
	State$1[State$1["END_TAG_OPEN"] = 6] = "END_TAG_OPEN";
	State$1[State$1["TAG_NAME"] = 7] = "TAG_NAME";
	State$1[State$1["RCDATA_LESS_THAN_SIGN"] = 8] = "RCDATA_LESS_THAN_SIGN";
	State$1[State$1["RCDATA_END_TAG_OPEN"] = 9] = "RCDATA_END_TAG_OPEN";
	State$1[State$1["RCDATA_END_TAG_NAME"] = 10] = "RCDATA_END_TAG_NAME";
	State$1[State$1["RAWTEXT_LESS_THAN_SIGN"] = 11] = "RAWTEXT_LESS_THAN_SIGN";
	State$1[State$1["RAWTEXT_END_TAG_OPEN"] = 12] = "RAWTEXT_END_TAG_OPEN";
	State$1[State$1["RAWTEXT_END_TAG_NAME"] = 13] = "RAWTEXT_END_TAG_NAME";
	State$1[State$1["SCRIPT_DATA_LESS_THAN_SIGN"] = 14] = "SCRIPT_DATA_LESS_THAN_SIGN";
	State$1[State$1["SCRIPT_DATA_END_TAG_OPEN"] = 15] = "SCRIPT_DATA_END_TAG_OPEN";
	State$1[State$1["SCRIPT_DATA_END_TAG_NAME"] = 16] = "SCRIPT_DATA_END_TAG_NAME";
	State$1[State$1["SCRIPT_DATA_ESCAPE_START"] = 17] = "SCRIPT_DATA_ESCAPE_START";
	State$1[State$1["SCRIPT_DATA_ESCAPE_START_DASH"] = 18] = "SCRIPT_DATA_ESCAPE_START_DASH";
	State$1[State$1["SCRIPT_DATA_ESCAPED"] = 19] = "SCRIPT_DATA_ESCAPED";
	State$1[State$1["SCRIPT_DATA_ESCAPED_DASH"] = 20] = "SCRIPT_DATA_ESCAPED_DASH";
	State$1[State$1["SCRIPT_DATA_ESCAPED_DASH_DASH"] = 21] = "SCRIPT_DATA_ESCAPED_DASH_DASH";
	State$1[State$1["SCRIPT_DATA_ESCAPED_LESS_THAN_SIGN"] = 22] = "SCRIPT_DATA_ESCAPED_LESS_THAN_SIGN";
	State$1[State$1["SCRIPT_DATA_ESCAPED_END_TAG_OPEN"] = 23] = "SCRIPT_DATA_ESCAPED_END_TAG_OPEN";
	State$1[State$1["SCRIPT_DATA_ESCAPED_END_TAG_NAME"] = 24] = "SCRIPT_DATA_ESCAPED_END_TAG_NAME";
	State$1[State$1["SCRIPT_DATA_DOUBLE_ESCAPE_START"] = 25] = "SCRIPT_DATA_DOUBLE_ESCAPE_START";
	State$1[State$1["SCRIPT_DATA_DOUBLE_ESCAPED"] = 26] = "SCRIPT_DATA_DOUBLE_ESCAPED";
	State$1[State$1["SCRIPT_DATA_DOUBLE_ESCAPED_DASH"] = 27] = "SCRIPT_DATA_DOUBLE_ESCAPED_DASH";
	State$1[State$1["SCRIPT_DATA_DOUBLE_ESCAPED_DASH_DASH"] = 28] = "SCRIPT_DATA_DOUBLE_ESCAPED_DASH_DASH";
	State$1[State$1["SCRIPT_DATA_DOUBLE_ESCAPED_LESS_THAN_SIGN"] = 29] = "SCRIPT_DATA_DOUBLE_ESCAPED_LESS_THAN_SIGN";
	State$1[State$1["SCRIPT_DATA_DOUBLE_ESCAPE_END"] = 30] = "SCRIPT_DATA_DOUBLE_ESCAPE_END";
	State$1[State$1["BEFORE_ATTRIBUTE_NAME"] = 31] = "BEFORE_ATTRIBUTE_NAME";
	State$1[State$1["ATTRIBUTE_NAME"] = 32] = "ATTRIBUTE_NAME";
	State$1[State$1["AFTER_ATTRIBUTE_NAME"] = 33] = "AFTER_ATTRIBUTE_NAME";
	State$1[State$1["BEFORE_ATTRIBUTE_VALUE"] = 34] = "BEFORE_ATTRIBUTE_VALUE";
	State$1[State$1["ATTRIBUTE_VALUE_DOUBLE_QUOTED"] = 35] = "ATTRIBUTE_VALUE_DOUBLE_QUOTED";
	State$1[State$1["ATTRIBUTE_VALUE_SINGLE_QUOTED"] = 36] = "ATTRIBUTE_VALUE_SINGLE_QUOTED";
	State$1[State$1["ATTRIBUTE_VALUE_UNQUOTED"] = 37] = "ATTRIBUTE_VALUE_UNQUOTED";
	State$1[State$1["AFTER_ATTRIBUTE_VALUE_QUOTED"] = 38] = "AFTER_ATTRIBUTE_VALUE_QUOTED";
	State$1[State$1["SELF_CLOSING_START_TAG"] = 39] = "SELF_CLOSING_START_TAG";
	State$1[State$1["BOGUS_COMMENT"] = 40] = "BOGUS_COMMENT";
	State$1[State$1["MARKUP_DECLARATION_OPEN"] = 41] = "MARKUP_DECLARATION_OPEN";
	State$1[State$1["COMMENT_START"] = 42] = "COMMENT_START";
	State$1[State$1["COMMENT_START_DASH"] = 43] = "COMMENT_START_DASH";
	State$1[State$1["COMMENT"] = 44] = "COMMENT";
	State$1[State$1["COMMENT_LESS_THAN_SIGN"] = 45] = "COMMENT_LESS_THAN_SIGN";
	State$1[State$1["COMMENT_LESS_THAN_SIGN_BANG"] = 46] = "COMMENT_LESS_THAN_SIGN_BANG";
	State$1[State$1["COMMENT_LESS_THAN_SIGN_BANG_DASH"] = 47] = "COMMENT_LESS_THAN_SIGN_BANG_DASH";
	State$1[State$1["COMMENT_LESS_THAN_SIGN_BANG_DASH_DASH"] = 48] = "COMMENT_LESS_THAN_SIGN_BANG_DASH_DASH";
	State$1[State$1["COMMENT_END_DASH"] = 49] = "COMMENT_END_DASH";
	State$1[State$1["COMMENT_END"] = 50] = "COMMENT_END";
	State$1[State$1["COMMENT_END_BANG"] = 51] = "COMMENT_END_BANG";
	State$1[State$1["DOCTYPE"] = 52] = "DOCTYPE";
	State$1[State$1["BEFORE_DOCTYPE_NAME"] = 53] = "BEFORE_DOCTYPE_NAME";
	State$1[State$1["DOCTYPE_NAME"] = 54] = "DOCTYPE_NAME";
	State$1[State$1["AFTER_DOCTYPE_NAME"] = 55] = "AFTER_DOCTYPE_NAME";
	State$1[State$1["AFTER_DOCTYPE_PUBLIC_KEYWORD"] = 56] = "AFTER_DOCTYPE_PUBLIC_KEYWORD";
	State$1[State$1["BEFORE_DOCTYPE_PUBLIC_IDENTIFIER"] = 57] = "BEFORE_DOCTYPE_PUBLIC_IDENTIFIER";
	State$1[State$1["DOCTYPE_PUBLIC_IDENTIFIER_DOUBLE_QUOTED"] = 58] = "DOCTYPE_PUBLIC_IDENTIFIER_DOUBLE_QUOTED";
	State$1[State$1["DOCTYPE_PUBLIC_IDENTIFIER_SINGLE_QUOTED"] = 59] = "DOCTYPE_PUBLIC_IDENTIFIER_SINGLE_QUOTED";
	State$1[State$1["AFTER_DOCTYPE_PUBLIC_IDENTIFIER"] = 60] = "AFTER_DOCTYPE_PUBLIC_IDENTIFIER";
	State$1[State$1["BETWEEN_DOCTYPE_PUBLIC_AND_SYSTEM_IDENTIFIERS"] = 61] = "BETWEEN_DOCTYPE_PUBLIC_AND_SYSTEM_IDENTIFIERS";
	State$1[State$1["AFTER_DOCTYPE_SYSTEM_KEYWORD"] = 62] = "AFTER_DOCTYPE_SYSTEM_KEYWORD";
	State$1[State$1["BEFORE_DOCTYPE_SYSTEM_IDENTIFIER"] = 63] = "BEFORE_DOCTYPE_SYSTEM_IDENTIFIER";
	State$1[State$1["DOCTYPE_SYSTEM_IDENTIFIER_DOUBLE_QUOTED"] = 64] = "DOCTYPE_SYSTEM_IDENTIFIER_DOUBLE_QUOTED";
	State$1[State$1["DOCTYPE_SYSTEM_IDENTIFIER_SINGLE_QUOTED"] = 65] = "DOCTYPE_SYSTEM_IDENTIFIER_SINGLE_QUOTED";
	State$1[State$1["AFTER_DOCTYPE_SYSTEM_IDENTIFIER"] = 66] = "AFTER_DOCTYPE_SYSTEM_IDENTIFIER";
	State$1[State$1["BOGUS_DOCTYPE"] = 67] = "BOGUS_DOCTYPE";
	State$1[State$1["CDATA_SECTION"] = 68] = "CDATA_SECTION";
	State$1[State$1["CDATA_SECTION_BRACKET"] = 69] = "CDATA_SECTION_BRACKET";
	State$1[State$1["CDATA_SECTION_END"] = 70] = "CDATA_SECTION_END";
	State$1[State$1["CHARACTER_REFERENCE"] = 71] = "CHARACTER_REFERENCE";
	State$1[State$1["AMBIGUOUS_AMPERSAND"] = 72] = "AMBIGUOUS_AMPERSAND";
})(State || (State = {}));
const TokenizerMode = {
	DATA: State.DATA,
	RCDATA: State.RCDATA,
	RAWTEXT: State.RAWTEXT,
	SCRIPT_DATA: State.SCRIPT_DATA,
	PLAINTEXT: State.PLAINTEXT,
	CDATA_SECTION: State.CDATA_SECTION
};
function isAsciiDigit(cp) {
	return cp >= CODE_POINTS.DIGIT_0 && cp <= CODE_POINTS.DIGIT_9;
}
function isAsciiUpper(cp) {
	return cp >= CODE_POINTS.LATIN_CAPITAL_A && cp <= CODE_POINTS.LATIN_CAPITAL_Z;
}
function isAsciiLower(cp) {
	return cp >= CODE_POINTS.LATIN_SMALL_A && cp <= CODE_POINTS.LATIN_SMALL_Z;
}
function isAsciiLetter(cp) {
	return isAsciiLower(cp) || isAsciiUpper(cp);
}
function isAsciiAlphaNumeric(cp) {
	return isAsciiLetter(cp) || isAsciiDigit(cp);
}
function toAsciiLower(cp) {
	return cp + 32;
}
function isWhitespace(cp) {
	return cp === CODE_POINTS.SPACE || cp === CODE_POINTS.LINE_FEED || cp === CODE_POINTS.TABULATION || cp === CODE_POINTS.FORM_FEED;
}
function isScriptDataDoubleEscapeSequenceEnd(cp) {
	return isWhitespace(cp) || cp === CODE_POINTS.SOLIDUS || cp === CODE_POINTS.GREATER_THAN_SIGN;
}
function getErrorForNumericCharacterReference(code$3) {
	if (code$3 === CODE_POINTS.NULL) return ERR.nullCharacterReference;
	else if (code$3 > 1114111) return ERR.characterReferenceOutsideUnicodeRange;
	else if (isSurrogate(code$3)) return ERR.surrogateCharacterReference;
	else if (isUndefinedCodePoint(code$3)) return ERR.noncharacterCharacterReference;
	else if (isControlCodePoint(code$3) || code$3 === CODE_POINTS.CARRIAGE_RETURN) return ERR.controlCharacterReference;
	return null;
}
var Tokenizer = class {
	constructor(options, handler) {
		this.options = options;
		this.handler = handler;
		this.paused = false;
		/** Ensures that the parsing loop isn't run multiple times at once. */
		this.inLoop = false;
		/**
		* Indicates that the current adjusted node exists, is not an element in the HTML namespace,
		* and that it is not an integration point for either MathML or HTML.
		*
		* @see {@link https://html.spec.whatwg.org/multipage/parsing.html#tree-construction}
		*/
		this.inForeignNode = false;
		this.lastStartTagName = "";
		this.active = false;
		this.state = State.DATA;
		this.returnState = State.DATA;
		this.entityStartPos = 0;
		this.consumedAfterSnapshot = -1;
		this.currentCharacterToken = null;
		this.currentToken = null;
		this.currentAttr = {
			name: "",
			value: ""
		};
		this.preprocessor = new Preprocessor(handler);
		this.currentLocation = this.getCurrentLocation(-1);
		this.entityDecoder = new EntityDecoder(htmlDecodeTree, (cp, consumed) => {
			this.preprocessor.pos = this.entityStartPos + consumed - 1;
			this._flushCodePointConsumedAsCharacterReference(cp);
		}, handler.onParseError ? {
			missingSemicolonAfterCharacterReference: () => {
				this._err(ERR.missingSemicolonAfterCharacterReference, 1);
			},
			absenceOfDigitsInNumericCharacterReference: (consumed) => {
				this._err(ERR.absenceOfDigitsInNumericCharacterReference, this.entityStartPos - this.preprocessor.pos + consumed);
			},
			validateNumericCharacterReference: (code$3) => {
				const error = getErrorForNumericCharacterReference(code$3);
				if (error) this._err(error, 1);
			}
		} : void 0);
	}
	_err(code$3, cpOffset = 0) {
		var _a$1, _b;
		(_b = (_a$1 = this.handler).onParseError) === null || _b === void 0 || _b.call(_a$1, this.preprocessor.getError(code$3, cpOffset));
	}
	getCurrentLocation(offset) {
		if (!this.options.sourceCodeLocationInfo) return null;
		return {
			startLine: this.preprocessor.line,
			startCol: this.preprocessor.col - offset,
			startOffset: this.preprocessor.offset - offset,
			endLine: -1,
			endCol: -1,
			endOffset: -1
		};
	}
	_runParsingLoop() {
		if (this.inLoop) return;
		this.inLoop = true;
		while (this.active && !this.paused) {
			this.consumedAfterSnapshot = 0;
			const cp = this._consume();
			if (!this._ensureHibernation()) this._callState(cp);
		}
		this.inLoop = false;
	}
	pause() {
		this.paused = true;
	}
	resume(writeCallback) {
		if (!this.paused) throw new Error("Parser was already resumed");
		this.paused = false;
		if (this.inLoop) return;
		this._runParsingLoop();
		if (!this.paused) writeCallback === null || writeCallback === void 0 || writeCallback();
	}
	write(chunk, isLastChunk, writeCallback) {
		this.active = true;
		this.preprocessor.write(chunk, isLastChunk);
		this._runParsingLoop();
		if (!this.paused) writeCallback === null || writeCallback === void 0 || writeCallback();
	}
	insertHtmlAtCurrentPos(chunk) {
		this.active = true;
		this.preprocessor.insertHtmlAtCurrentPos(chunk);
		this._runParsingLoop();
	}
	_ensureHibernation() {
		if (this.preprocessor.endOfChunkHit) {
			this.preprocessor.retreat(this.consumedAfterSnapshot);
			this.consumedAfterSnapshot = 0;
			this.active = false;
			return true;
		}
		return false;
	}
	_consume() {
		this.consumedAfterSnapshot++;
		return this.preprocessor.advance();
	}
	_advanceBy(count) {
		this.consumedAfterSnapshot += count;
		for (let i = 0; i < count; i++) this.preprocessor.advance();
	}
	_consumeSequenceIfMatch(pattern, caseSensitive) {
		if (this.preprocessor.startsWith(pattern, caseSensitive)) {
			this._advanceBy(pattern.length - 1);
			return true;
		}
		return false;
	}
	_createStartTagToken() {
		this.currentToken = {
			type: TokenType.START_TAG,
			tagName: "",
			tagID: TAG_ID.UNKNOWN,
			selfClosing: false,
			ackSelfClosing: false,
			attrs: [],
			location: this.getCurrentLocation(1)
		};
	}
	_createEndTagToken() {
		this.currentToken = {
			type: TokenType.END_TAG,
			tagName: "",
			tagID: TAG_ID.UNKNOWN,
			selfClosing: false,
			ackSelfClosing: false,
			attrs: [],
			location: this.getCurrentLocation(2)
		};
	}
	_createCommentToken(offset) {
		this.currentToken = {
			type: TokenType.COMMENT,
			data: "",
			location: this.getCurrentLocation(offset)
		};
	}
	_createDoctypeToken(initialName) {
		this.currentToken = {
			type: TokenType.DOCTYPE,
			name: initialName,
			forceQuirks: false,
			publicId: null,
			systemId: null,
			location: this.currentLocation
		};
	}
	_createCharacterToken(type, chars) {
		this.currentCharacterToken = {
			type,
			chars,
			location: this.currentLocation
		};
	}
	_createAttr(attrNameFirstCh) {
		this.currentAttr = {
			name: attrNameFirstCh,
			value: ""
		};
		this.currentLocation = this.getCurrentLocation(0);
	}
	_leaveAttrName() {
		var _a$1;
		var _b;
		const token = this.currentToken;
		if (getTokenAttr(token, this.currentAttr.name) === null) {
			token.attrs.push(this.currentAttr);
			if (token.location && this.currentLocation) {
				const attrLocations = (_a$1 = (_b = token.location).attrs) !== null && _a$1 !== void 0 ? _a$1 : _b.attrs = Object.create(null);
				attrLocations[this.currentAttr.name] = this.currentLocation;
				this._leaveAttrValue();
			}
		} else this._err(ERR.duplicateAttribute);
	}
	_leaveAttrValue() {
		if (this.currentLocation) {
			this.currentLocation.endLine = this.preprocessor.line;
			this.currentLocation.endCol = this.preprocessor.col;
			this.currentLocation.endOffset = this.preprocessor.offset;
		}
	}
	prepareToken(ct) {
		this._emitCurrentCharacterToken(ct.location);
		this.currentToken = null;
		if (ct.location) {
			ct.location.endLine = this.preprocessor.line;
			ct.location.endCol = this.preprocessor.col + 1;
			ct.location.endOffset = this.preprocessor.offset + 1;
		}
		this.currentLocation = this.getCurrentLocation(-1);
	}
	emitCurrentTagToken() {
		const ct = this.currentToken;
		this.prepareToken(ct);
		ct.tagID = getTagID(ct.tagName);
		if (ct.type === TokenType.START_TAG) {
			this.lastStartTagName = ct.tagName;
			this.handler.onStartTag(ct);
		} else {
			if (ct.attrs.length > 0) this._err(ERR.endTagWithAttributes);
			if (ct.selfClosing) this._err(ERR.endTagWithTrailingSolidus);
			this.handler.onEndTag(ct);
		}
		this.preprocessor.dropParsedChunk();
	}
	emitCurrentComment(ct) {
		this.prepareToken(ct);
		this.handler.onComment(ct);
		this.preprocessor.dropParsedChunk();
	}
	emitCurrentDoctype(ct) {
		this.prepareToken(ct);
		this.handler.onDoctype(ct);
		this.preprocessor.dropParsedChunk();
	}
	_emitCurrentCharacterToken(nextLocation) {
		if (this.currentCharacterToken) {
			if (nextLocation && this.currentCharacterToken.location) {
				this.currentCharacterToken.location.endLine = nextLocation.startLine;
				this.currentCharacterToken.location.endCol = nextLocation.startCol;
				this.currentCharacterToken.location.endOffset = nextLocation.startOffset;
			}
			switch (this.currentCharacterToken.type) {
				case TokenType.CHARACTER:
					this.handler.onCharacter(this.currentCharacterToken);
					break;
				case TokenType.NULL_CHARACTER:
					this.handler.onNullCharacter(this.currentCharacterToken);
					break;
				case TokenType.WHITESPACE_CHARACTER:
					this.handler.onWhitespaceCharacter(this.currentCharacterToken);
					break;
			}
			this.currentCharacterToken = null;
		}
	}
	_emitEOFToken() {
		const location$1 = this.getCurrentLocation(0);
		if (location$1) {
			location$1.endLine = location$1.startLine;
			location$1.endCol = location$1.startCol;
			location$1.endOffset = location$1.startOffset;
		}
		this._emitCurrentCharacterToken(location$1);
		this.handler.onEof({
			type: TokenType.EOF,
			location: location$1
		});
		this.active = false;
	}
	_appendCharToCurrentCharacterToken(type, ch) {
		if (this.currentCharacterToken) if (this.currentCharacterToken.type === type) {
			this.currentCharacterToken.chars += ch;
			return;
		} else {
			this.currentLocation = this.getCurrentLocation(0);
			this._emitCurrentCharacterToken(this.currentLocation);
			this.preprocessor.dropParsedChunk();
		}
		this._createCharacterToken(type, ch);
	}
	_emitCodePoint(cp) {
		const type = isWhitespace(cp) ? TokenType.WHITESPACE_CHARACTER : cp === CODE_POINTS.NULL ? TokenType.NULL_CHARACTER : TokenType.CHARACTER;
		this._appendCharToCurrentCharacterToken(type, String.fromCodePoint(cp));
	}
	_emitChars(ch) {
		this._appendCharToCurrentCharacterToken(TokenType.CHARACTER, ch);
	}
	_startCharacterReference() {
		this.returnState = this.state;
		this.state = State.CHARACTER_REFERENCE;
		this.entityStartPos = this.preprocessor.pos;
		this.entityDecoder.startEntity(this._isCharacterReferenceInAttribute() ? DecodingMode.Attribute : DecodingMode.Legacy);
	}
	_isCharacterReferenceInAttribute() {
		return this.returnState === State.ATTRIBUTE_VALUE_DOUBLE_QUOTED || this.returnState === State.ATTRIBUTE_VALUE_SINGLE_QUOTED || this.returnState === State.ATTRIBUTE_VALUE_UNQUOTED;
	}
	_flushCodePointConsumedAsCharacterReference(cp) {
		if (this._isCharacterReferenceInAttribute()) this.currentAttr.value += String.fromCodePoint(cp);
		else this._emitCodePoint(cp);
	}
	_callState(cp) {
		switch (this.state) {
			case State.DATA:
				this._stateData(cp);
				break;
			case State.RCDATA:
				this._stateRcdata(cp);
				break;
			case State.RAWTEXT:
				this._stateRawtext(cp);
				break;
			case State.SCRIPT_DATA:
				this._stateScriptData(cp);
				break;
			case State.PLAINTEXT:
				this._statePlaintext(cp);
				break;
			case State.TAG_OPEN:
				this._stateTagOpen(cp);
				break;
			case State.END_TAG_OPEN:
				this._stateEndTagOpen(cp);
				break;
			case State.TAG_NAME:
				this._stateTagName(cp);
				break;
			case State.RCDATA_LESS_THAN_SIGN:
				this._stateRcdataLessThanSign(cp);
				break;
			case State.RCDATA_END_TAG_OPEN:
				this._stateRcdataEndTagOpen(cp);
				break;
			case State.RCDATA_END_TAG_NAME:
				this._stateRcdataEndTagName(cp);
				break;
			case State.RAWTEXT_LESS_THAN_SIGN:
				this._stateRawtextLessThanSign(cp);
				break;
			case State.RAWTEXT_END_TAG_OPEN:
				this._stateRawtextEndTagOpen(cp);
				break;
			case State.RAWTEXT_END_TAG_NAME:
				this._stateRawtextEndTagName(cp);
				break;
			case State.SCRIPT_DATA_LESS_THAN_SIGN:
				this._stateScriptDataLessThanSign(cp);
				break;
			case State.SCRIPT_DATA_END_TAG_OPEN:
				this._stateScriptDataEndTagOpen(cp);
				break;
			case State.SCRIPT_DATA_END_TAG_NAME:
				this._stateScriptDataEndTagName(cp);
				break;
			case State.SCRIPT_DATA_ESCAPE_START:
				this._stateScriptDataEscapeStart(cp);
				break;
			case State.SCRIPT_DATA_ESCAPE_START_DASH:
				this._stateScriptDataEscapeStartDash(cp);
				break;
			case State.SCRIPT_DATA_ESCAPED:
				this._stateScriptDataEscaped(cp);
				break;
			case State.SCRIPT_DATA_ESCAPED_DASH:
				this._stateScriptDataEscapedDash(cp);
				break;
			case State.SCRIPT_DATA_ESCAPED_DASH_DASH:
				this._stateScriptDataEscapedDashDash(cp);
				break;
			case State.SCRIPT_DATA_ESCAPED_LESS_THAN_SIGN:
				this._stateScriptDataEscapedLessThanSign(cp);
				break;
			case State.SCRIPT_DATA_ESCAPED_END_TAG_OPEN:
				this._stateScriptDataEscapedEndTagOpen(cp);
				break;
			case State.SCRIPT_DATA_ESCAPED_END_TAG_NAME:
				this._stateScriptDataEscapedEndTagName(cp);
				break;
			case State.SCRIPT_DATA_DOUBLE_ESCAPE_START:
				this._stateScriptDataDoubleEscapeStart(cp);
				break;
			case State.SCRIPT_DATA_DOUBLE_ESCAPED:
				this._stateScriptDataDoubleEscaped(cp);
				break;
			case State.SCRIPT_DATA_DOUBLE_ESCAPED_DASH:
				this._stateScriptDataDoubleEscapedDash(cp);
				break;
			case State.SCRIPT_DATA_DOUBLE_ESCAPED_DASH_DASH:
				this._stateScriptDataDoubleEscapedDashDash(cp);
				break;
			case State.SCRIPT_DATA_DOUBLE_ESCAPED_LESS_THAN_SIGN:
				this._stateScriptDataDoubleEscapedLessThanSign(cp);
				break;
			case State.SCRIPT_DATA_DOUBLE_ESCAPE_END:
				this._stateScriptDataDoubleEscapeEnd(cp);
				break;
			case State.BEFORE_ATTRIBUTE_NAME:
				this._stateBeforeAttributeName(cp);
				break;
			case State.ATTRIBUTE_NAME:
				this._stateAttributeName(cp);
				break;
			case State.AFTER_ATTRIBUTE_NAME:
				this._stateAfterAttributeName(cp);
				break;
			case State.BEFORE_ATTRIBUTE_VALUE:
				this._stateBeforeAttributeValue(cp);
				break;
			case State.ATTRIBUTE_VALUE_DOUBLE_QUOTED:
				this._stateAttributeValueDoubleQuoted(cp);
				break;
			case State.ATTRIBUTE_VALUE_SINGLE_QUOTED:
				this._stateAttributeValueSingleQuoted(cp);
				break;
			case State.ATTRIBUTE_VALUE_UNQUOTED:
				this._stateAttributeValueUnquoted(cp);
				break;
			case State.AFTER_ATTRIBUTE_VALUE_QUOTED:
				this._stateAfterAttributeValueQuoted(cp);
				break;
			case State.SELF_CLOSING_START_TAG:
				this._stateSelfClosingStartTag(cp);
				break;
			case State.BOGUS_COMMENT:
				this._stateBogusComment(cp);
				break;
			case State.MARKUP_DECLARATION_OPEN:
				this._stateMarkupDeclarationOpen(cp);
				break;
			case State.COMMENT_START:
				this._stateCommentStart(cp);
				break;
			case State.COMMENT_START_DASH:
				this._stateCommentStartDash(cp);
				break;
			case State.COMMENT:
				this._stateComment(cp);
				break;
			case State.COMMENT_LESS_THAN_SIGN:
				this._stateCommentLessThanSign(cp);
				break;
			case State.COMMENT_LESS_THAN_SIGN_BANG:
				this._stateCommentLessThanSignBang(cp);
				break;
			case State.COMMENT_LESS_THAN_SIGN_BANG_DASH:
				this._stateCommentLessThanSignBangDash(cp);
				break;
			case State.COMMENT_LESS_THAN_SIGN_BANG_DASH_DASH:
				this._stateCommentLessThanSignBangDashDash(cp);
				break;
			case State.COMMENT_END_DASH:
				this._stateCommentEndDash(cp);
				break;
			case State.COMMENT_END:
				this._stateCommentEnd(cp);
				break;
			case State.COMMENT_END_BANG:
				this._stateCommentEndBang(cp);
				break;
			case State.DOCTYPE:
				this._stateDoctype(cp);
				break;
			case State.BEFORE_DOCTYPE_NAME:
				this._stateBeforeDoctypeName(cp);
				break;
			case State.DOCTYPE_NAME:
				this._stateDoctypeName(cp);
				break;
			case State.AFTER_DOCTYPE_NAME:
				this._stateAfterDoctypeName(cp);
				break;
			case State.AFTER_DOCTYPE_PUBLIC_KEYWORD:
				this._stateAfterDoctypePublicKeyword(cp);
				break;
			case State.BEFORE_DOCTYPE_PUBLIC_IDENTIFIER:
				this._stateBeforeDoctypePublicIdentifier(cp);
				break;
			case State.DOCTYPE_PUBLIC_IDENTIFIER_DOUBLE_QUOTED:
				this._stateDoctypePublicIdentifierDoubleQuoted(cp);
				break;
			case State.DOCTYPE_PUBLIC_IDENTIFIER_SINGLE_QUOTED:
				this._stateDoctypePublicIdentifierSingleQuoted(cp);
				break;
			case State.AFTER_DOCTYPE_PUBLIC_IDENTIFIER:
				this._stateAfterDoctypePublicIdentifier(cp);
				break;
			case State.BETWEEN_DOCTYPE_PUBLIC_AND_SYSTEM_IDENTIFIERS:
				this._stateBetweenDoctypePublicAndSystemIdentifiers(cp);
				break;
			case State.AFTER_DOCTYPE_SYSTEM_KEYWORD:
				this._stateAfterDoctypeSystemKeyword(cp);
				break;
			case State.BEFORE_DOCTYPE_SYSTEM_IDENTIFIER:
				this._stateBeforeDoctypeSystemIdentifier(cp);
				break;
			case State.DOCTYPE_SYSTEM_IDENTIFIER_DOUBLE_QUOTED:
				this._stateDoctypeSystemIdentifierDoubleQuoted(cp);
				break;
			case State.DOCTYPE_SYSTEM_IDENTIFIER_SINGLE_QUOTED:
				this._stateDoctypeSystemIdentifierSingleQuoted(cp);
				break;
			case State.AFTER_DOCTYPE_SYSTEM_IDENTIFIER:
				this._stateAfterDoctypeSystemIdentifier(cp);
				break;
			case State.BOGUS_DOCTYPE:
				this._stateBogusDoctype(cp);
				break;
			case State.CDATA_SECTION:
				this._stateCdataSection(cp);
				break;
			case State.CDATA_SECTION_BRACKET:
				this._stateCdataSectionBracket(cp);
				break;
			case State.CDATA_SECTION_END:
				this._stateCdataSectionEnd(cp);
				break;
			case State.CHARACTER_REFERENCE:
				this._stateCharacterReference();
				break;
			case State.AMBIGUOUS_AMPERSAND:
				this._stateAmbiguousAmpersand(cp);
				break;
			default: throw new Error("Unknown state");
		}
	}
	_stateData(cp) {
		switch (cp) {
			case CODE_POINTS.LESS_THAN_SIGN:
				this.state = State.TAG_OPEN;
				break;
			case CODE_POINTS.AMPERSAND:
				this._startCharacterReference();
				break;
			case CODE_POINTS.NULL:
				this._err(ERR.unexpectedNullCharacter);
				this._emitCodePoint(cp);
				break;
			case CODE_POINTS.EOF:
				this._emitEOFToken();
				break;
			default: this._emitCodePoint(cp);
		}
	}
	_stateRcdata(cp) {
		switch (cp) {
			case CODE_POINTS.AMPERSAND:
				this._startCharacterReference();
				break;
			case CODE_POINTS.LESS_THAN_SIGN:
				this.state = State.RCDATA_LESS_THAN_SIGN;
				break;
			case CODE_POINTS.NULL:
				this._err(ERR.unexpectedNullCharacter);
				this._emitChars(REPLACEMENT_CHARACTER);
				break;
			case CODE_POINTS.EOF:
				this._emitEOFToken();
				break;
			default: this._emitCodePoint(cp);
		}
	}
	_stateRawtext(cp) {
		switch (cp) {
			case CODE_POINTS.LESS_THAN_SIGN:
				this.state = State.RAWTEXT_LESS_THAN_SIGN;
				break;
			case CODE_POINTS.NULL:
				this._err(ERR.unexpectedNullCharacter);
				this._emitChars(REPLACEMENT_CHARACTER);
				break;
			case CODE_POINTS.EOF:
				this._emitEOFToken();
				break;
			default: this._emitCodePoint(cp);
		}
	}
	_stateScriptData(cp) {
		switch (cp) {
			case CODE_POINTS.LESS_THAN_SIGN:
				this.state = State.SCRIPT_DATA_LESS_THAN_SIGN;
				break;
			case CODE_POINTS.NULL:
				this._err(ERR.unexpectedNullCharacter);
				this._emitChars(REPLACEMENT_CHARACTER);
				break;
			case CODE_POINTS.EOF:
				this._emitEOFToken();
				break;
			default: this._emitCodePoint(cp);
		}
	}
	_statePlaintext(cp) {
		switch (cp) {
			case CODE_POINTS.NULL:
				this._err(ERR.unexpectedNullCharacter);
				this._emitChars(REPLACEMENT_CHARACTER);
				break;
			case CODE_POINTS.EOF:
				this._emitEOFToken();
				break;
			default: this._emitCodePoint(cp);
		}
	}
	_stateTagOpen(cp) {
		if (isAsciiLetter(cp)) {
			this._createStartTagToken();
			this.state = State.TAG_NAME;
			this._stateTagName(cp);
		} else switch (cp) {
			case CODE_POINTS.EXCLAMATION_MARK:
				this.state = State.MARKUP_DECLARATION_OPEN;
				break;
			case CODE_POINTS.SOLIDUS:
				this.state = State.END_TAG_OPEN;
				break;
			case CODE_POINTS.QUESTION_MARK:
				this._err(ERR.unexpectedQuestionMarkInsteadOfTagName);
				this._createCommentToken(1);
				this.state = State.BOGUS_COMMENT;
				this._stateBogusComment(cp);
				break;
			case CODE_POINTS.EOF:
				this._err(ERR.eofBeforeTagName);
				this._emitChars("<");
				this._emitEOFToken();
				break;
			default:
				this._err(ERR.invalidFirstCharacterOfTagName);
				this._emitChars("<");
				this.state = State.DATA;
				this._stateData(cp);
		}
	}
	_stateEndTagOpen(cp) {
		if (isAsciiLetter(cp)) {
			this._createEndTagToken();
			this.state = State.TAG_NAME;
			this._stateTagName(cp);
		} else switch (cp) {
			case CODE_POINTS.GREATER_THAN_SIGN:
				this._err(ERR.missingEndTagName);
				this.state = State.DATA;
				break;
			case CODE_POINTS.EOF:
				this._err(ERR.eofBeforeTagName);
				this._emitChars("</");
				this._emitEOFToken();
				break;
			default:
				this._err(ERR.invalidFirstCharacterOfTagName);
				this._createCommentToken(2);
				this.state = State.BOGUS_COMMENT;
				this._stateBogusComment(cp);
		}
	}
	_stateTagName(cp) {
		const token = this.currentToken;
		switch (cp) {
			case CODE_POINTS.SPACE:
			case CODE_POINTS.LINE_FEED:
			case CODE_POINTS.TABULATION:
			case CODE_POINTS.FORM_FEED:
				this.state = State.BEFORE_ATTRIBUTE_NAME;
				break;
			case CODE_POINTS.SOLIDUS:
				this.state = State.SELF_CLOSING_START_TAG;
				break;
			case CODE_POINTS.GREATER_THAN_SIGN:
				this.state = State.DATA;
				this.emitCurrentTagToken();
				break;
			case CODE_POINTS.NULL:
				this._err(ERR.unexpectedNullCharacter);
				token.tagName += REPLACEMENT_CHARACTER;
				break;
			case CODE_POINTS.EOF:
				this._err(ERR.eofInTag);
				this._emitEOFToken();
				break;
			default: token.tagName += String.fromCodePoint(isAsciiUpper(cp) ? toAsciiLower(cp) : cp);
		}
	}
	_stateRcdataLessThanSign(cp) {
		if (cp === CODE_POINTS.SOLIDUS) this.state = State.RCDATA_END_TAG_OPEN;
		else {
			this._emitChars("<");
			this.state = State.RCDATA;
			this._stateRcdata(cp);
		}
	}
	_stateRcdataEndTagOpen(cp) {
		if (isAsciiLetter(cp)) {
			this.state = State.RCDATA_END_TAG_NAME;
			this._stateRcdataEndTagName(cp);
		} else {
			this._emitChars("</");
			this.state = State.RCDATA;
			this._stateRcdata(cp);
		}
	}
	handleSpecialEndTag(_cp) {
		if (!this.preprocessor.startsWith(this.lastStartTagName, false)) return !this._ensureHibernation();
		this._createEndTagToken();
		const token = this.currentToken;
		token.tagName = this.lastStartTagName;
		switch (this.preprocessor.peek(this.lastStartTagName.length)) {
			case CODE_POINTS.SPACE:
			case CODE_POINTS.LINE_FEED:
			case CODE_POINTS.TABULATION:
			case CODE_POINTS.FORM_FEED:
				this._advanceBy(this.lastStartTagName.length);
				this.state = State.BEFORE_ATTRIBUTE_NAME;
				return false;
			case CODE_POINTS.SOLIDUS:
				this._advanceBy(this.lastStartTagName.length);
				this.state = State.SELF_CLOSING_START_TAG;
				return false;
			case CODE_POINTS.GREATER_THAN_SIGN:
				this._advanceBy(this.lastStartTagName.length);
				this.emitCurrentTagToken();
				this.state = State.DATA;
				return false;
			default: return !this._ensureHibernation();
		}
	}
	_stateRcdataEndTagName(cp) {
		if (this.handleSpecialEndTag(cp)) {
			this._emitChars("</");
			this.state = State.RCDATA;
			this._stateRcdata(cp);
		}
	}
	_stateRawtextLessThanSign(cp) {
		if (cp === CODE_POINTS.SOLIDUS) this.state = State.RAWTEXT_END_TAG_OPEN;
		else {
			this._emitChars("<");
			this.state = State.RAWTEXT;
			this._stateRawtext(cp);
		}
	}
	_stateRawtextEndTagOpen(cp) {
		if (isAsciiLetter(cp)) {
			this.state = State.RAWTEXT_END_TAG_NAME;
			this._stateRawtextEndTagName(cp);
		} else {
			this._emitChars("</");
			this.state = State.RAWTEXT;
			this._stateRawtext(cp);
		}
	}
	_stateRawtextEndTagName(cp) {
		if (this.handleSpecialEndTag(cp)) {
			this._emitChars("</");
			this.state = State.RAWTEXT;
			this._stateRawtext(cp);
		}
	}
	_stateScriptDataLessThanSign(cp) {
		switch (cp) {
			case CODE_POINTS.SOLIDUS:
				this.state = State.SCRIPT_DATA_END_TAG_OPEN;
				break;
			case CODE_POINTS.EXCLAMATION_MARK:
				this.state = State.SCRIPT_DATA_ESCAPE_START;
				this._emitChars("<!");
				break;
			default:
				this._emitChars("<");
				this.state = State.SCRIPT_DATA;
				this._stateScriptData(cp);
		}
	}
	_stateScriptDataEndTagOpen(cp) {
		if (isAsciiLetter(cp)) {
			this.state = State.SCRIPT_DATA_END_TAG_NAME;
			this._stateScriptDataEndTagName(cp);
		} else {
			this._emitChars("</");
			this.state = State.SCRIPT_DATA;
			this._stateScriptData(cp);
		}
	}
	_stateScriptDataEndTagName(cp) {
		if (this.handleSpecialEndTag(cp)) {
			this._emitChars("</");
			this.state = State.SCRIPT_DATA;
			this._stateScriptData(cp);
		}
	}
	_stateScriptDataEscapeStart(cp) {
		if (cp === CODE_POINTS.HYPHEN_MINUS) {
			this.state = State.SCRIPT_DATA_ESCAPE_START_DASH;
			this._emitChars("-");
		} else {
			this.state = State.SCRIPT_DATA;
			this._stateScriptData(cp);
		}
	}
	_stateScriptDataEscapeStartDash(cp) {
		if (cp === CODE_POINTS.HYPHEN_MINUS) {
			this.state = State.SCRIPT_DATA_ESCAPED_DASH_DASH;
			this._emitChars("-");
		} else {
			this.state = State.SCRIPT_DATA;
			this._stateScriptData(cp);
		}
	}
	_stateScriptDataEscaped(cp) {
		switch (cp) {
			case CODE_POINTS.HYPHEN_MINUS:
				this.state = State.SCRIPT_DATA_ESCAPED_DASH;
				this._emitChars("-");
				break;
			case CODE_POINTS.LESS_THAN_SIGN:
				this.state = State.SCRIPT_DATA_ESCAPED_LESS_THAN_SIGN;
				break;
			case CODE_POINTS.NULL:
				this._err(ERR.unexpectedNullCharacter);
				this._emitChars(REPLACEMENT_CHARACTER);
				break;
			case CODE_POINTS.EOF:
				this._err(ERR.eofInScriptHtmlCommentLikeText);
				this._emitEOFToken();
				break;
			default: this._emitCodePoint(cp);
		}
	}
	_stateScriptDataEscapedDash(cp) {
		switch (cp) {
			case CODE_POINTS.HYPHEN_MINUS:
				this.state = State.SCRIPT_DATA_ESCAPED_DASH_DASH;
				this._emitChars("-");
				break;
			case CODE_POINTS.LESS_THAN_SIGN:
				this.state = State.SCRIPT_DATA_ESCAPED_LESS_THAN_SIGN;
				break;
			case CODE_POINTS.NULL:
				this._err(ERR.unexpectedNullCharacter);
				this.state = State.SCRIPT_DATA_ESCAPED;
				this._emitChars(REPLACEMENT_CHARACTER);
				break;
			case CODE_POINTS.EOF:
				this._err(ERR.eofInScriptHtmlCommentLikeText);
				this._emitEOFToken();
				break;
			default:
				this.state = State.SCRIPT_DATA_ESCAPED;
				this._emitCodePoint(cp);
		}
	}
	_stateScriptDataEscapedDashDash(cp) {
		switch (cp) {
			case CODE_POINTS.HYPHEN_MINUS:
				this._emitChars("-");
				break;
			case CODE_POINTS.LESS_THAN_SIGN:
				this.state = State.SCRIPT_DATA_ESCAPED_LESS_THAN_SIGN;
				break;
			case CODE_POINTS.GREATER_THAN_SIGN:
				this.state = State.SCRIPT_DATA;
				this._emitChars(">");
				break;
			case CODE_POINTS.NULL:
				this._err(ERR.unexpectedNullCharacter);
				this.state = State.SCRIPT_DATA_ESCAPED;
				this._emitChars(REPLACEMENT_CHARACTER);
				break;
			case CODE_POINTS.EOF:
				this._err(ERR.eofInScriptHtmlCommentLikeText);
				this._emitEOFToken();
				break;
			default:
				this.state = State.SCRIPT_DATA_ESCAPED;
				this._emitCodePoint(cp);
		}
	}
	_stateScriptDataEscapedLessThanSign(cp) {
		if (cp === CODE_POINTS.SOLIDUS) this.state = State.SCRIPT_DATA_ESCAPED_END_TAG_OPEN;
		else if (isAsciiLetter(cp)) {
			this._emitChars("<");
			this.state = State.SCRIPT_DATA_DOUBLE_ESCAPE_START;
			this._stateScriptDataDoubleEscapeStart(cp);
		} else {
			this._emitChars("<");
			this.state = State.SCRIPT_DATA_ESCAPED;
			this._stateScriptDataEscaped(cp);
		}
	}
	_stateScriptDataEscapedEndTagOpen(cp) {
		if (isAsciiLetter(cp)) {
			this.state = State.SCRIPT_DATA_ESCAPED_END_TAG_NAME;
			this._stateScriptDataEscapedEndTagName(cp);
		} else {
			this._emitChars("</");
			this.state = State.SCRIPT_DATA_ESCAPED;
			this._stateScriptDataEscaped(cp);
		}
	}
	_stateScriptDataEscapedEndTagName(cp) {
		if (this.handleSpecialEndTag(cp)) {
			this._emitChars("</");
			this.state = State.SCRIPT_DATA_ESCAPED;
			this._stateScriptDataEscaped(cp);
		}
	}
	_stateScriptDataDoubleEscapeStart(cp) {
		if (this.preprocessor.startsWith(SEQUENCES.SCRIPT, false) && isScriptDataDoubleEscapeSequenceEnd(this.preprocessor.peek(SEQUENCES.SCRIPT.length))) {
			this._emitCodePoint(cp);
			for (let i = 0; i < SEQUENCES.SCRIPT.length; i++) this._emitCodePoint(this._consume());
			this.state = State.SCRIPT_DATA_DOUBLE_ESCAPED;
		} else if (!this._ensureHibernation()) {
			this.state = State.SCRIPT_DATA_ESCAPED;
			this._stateScriptDataEscaped(cp);
		}
	}
	_stateScriptDataDoubleEscaped(cp) {
		switch (cp) {
			case CODE_POINTS.HYPHEN_MINUS:
				this.state = State.SCRIPT_DATA_DOUBLE_ESCAPED_DASH;
				this._emitChars("-");
				break;
			case CODE_POINTS.LESS_THAN_SIGN:
				this.state = State.SCRIPT_DATA_DOUBLE_ESCAPED_LESS_THAN_SIGN;
				this._emitChars("<");
				break;
			case CODE_POINTS.NULL:
				this._err(ERR.unexpectedNullCharacter);
				this._emitChars(REPLACEMENT_CHARACTER);
				break;
			case CODE_POINTS.EOF:
				this._err(ERR.eofInScriptHtmlCommentLikeText);
				this._emitEOFToken();
				break;
			default: this._emitCodePoint(cp);
		}
	}
	_stateScriptDataDoubleEscapedDash(cp) {
		switch (cp) {
			case CODE_POINTS.HYPHEN_MINUS:
				this.state = State.SCRIPT_DATA_DOUBLE_ESCAPED_DASH_DASH;
				this._emitChars("-");
				break;
			case CODE_POINTS.LESS_THAN_SIGN:
				this.state = State.SCRIPT_DATA_DOUBLE_ESCAPED_LESS_THAN_SIGN;
				this._emitChars("<");
				break;
			case CODE_POINTS.NULL:
				this._err(ERR.unexpectedNullCharacter);
				this.state = State.SCRIPT_DATA_DOUBLE_ESCAPED;
				this._emitChars(REPLACEMENT_CHARACTER);
				break;
			case CODE_POINTS.EOF:
				this._err(ERR.eofInScriptHtmlCommentLikeText);
				this._emitEOFToken();
				break;
			default:
				this.state = State.SCRIPT_DATA_DOUBLE_ESCAPED;
				this._emitCodePoint(cp);
		}
	}
	_stateScriptDataDoubleEscapedDashDash(cp) {
		switch (cp) {
			case CODE_POINTS.HYPHEN_MINUS:
				this._emitChars("-");
				break;
			case CODE_POINTS.LESS_THAN_SIGN:
				this.state = State.SCRIPT_DATA_DOUBLE_ESCAPED_LESS_THAN_SIGN;
				this._emitChars("<");
				break;
			case CODE_POINTS.GREATER_THAN_SIGN:
				this.state = State.SCRIPT_DATA;
				this._emitChars(">");
				break;
			case CODE_POINTS.NULL:
				this._err(ERR.unexpectedNullCharacter);
				this.state = State.SCRIPT_DATA_DOUBLE_ESCAPED;
				this._emitChars(REPLACEMENT_CHARACTER);
				break;
			case CODE_POINTS.EOF:
				this._err(ERR.eofInScriptHtmlCommentLikeText);
				this._emitEOFToken();
				break;
			default:
				this.state = State.SCRIPT_DATA_DOUBLE_ESCAPED;
				this._emitCodePoint(cp);
		}
	}
	_stateScriptDataDoubleEscapedLessThanSign(cp) {
		if (cp === CODE_POINTS.SOLIDUS) {
			this.state = State.SCRIPT_DATA_DOUBLE_ESCAPE_END;
			this._emitChars("/");
		} else {
			this.state = State.SCRIPT_DATA_DOUBLE_ESCAPED;
			this._stateScriptDataDoubleEscaped(cp);
		}
	}
	_stateScriptDataDoubleEscapeEnd(cp) {
		if (this.preprocessor.startsWith(SEQUENCES.SCRIPT, false) && isScriptDataDoubleEscapeSequenceEnd(this.preprocessor.peek(SEQUENCES.SCRIPT.length))) {
			this._emitCodePoint(cp);
			for (let i = 0; i < SEQUENCES.SCRIPT.length; i++) this._emitCodePoint(this._consume());
			this.state = State.SCRIPT_DATA_ESCAPED;
		} else if (!this._ensureHibernation()) {
			this.state = State.SCRIPT_DATA_DOUBLE_ESCAPED;
			this._stateScriptDataDoubleEscaped(cp);
		}
	}
	_stateBeforeAttributeName(cp) {
		switch (cp) {
			case CODE_POINTS.SPACE:
			case CODE_POINTS.LINE_FEED:
			case CODE_POINTS.TABULATION:
			case CODE_POINTS.FORM_FEED: break;
			case CODE_POINTS.SOLIDUS:
			case CODE_POINTS.GREATER_THAN_SIGN:
			case CODE_POINTS.EOF:
				this.state = State.AFTER_ATTRIBUTE_NAME;
				this._stateAfterAttributeName(cp);
				break;
			case CODE_POINTS.EQUALS_SIGN:
				this._err(ERR.unexpectedEqualsSignBeforeAttributeName);
				this._createAttr("=");
				this.state = State.ATTRIBUTE_NAME;
				break;
			default:
				this._createAttr("");
				this.state = State.ATTRIBUTE_NAME;
				this._stateAttributeName(cp);
		}
	}
	_stateAttributeName(cp) {
		switch (cp) {
			case CODE_POINTS.SPACE:
			case CODE_POINTS.LINE_FEED:
			case CODE_POINTS.TABULATION:
			case CODE_POINTS.FORM_FEED:
			case CODE_POINTS.SOLIDUS:
			case CODE_POINTS.GREATER_THAN_SIGN:
			case CODE_POINTS.EOF:
				this._leaveAttrName();
				this.state = State.AFTER_ATTRIBUTE_NAME;
				this._stateAfterAttributeName(cp);
				break;
			case CODE_POINTS.EQUALS_SIGN:
				this._leaveAttrName();
				this.state = State.BEFORE_ATTRIBUTE_VALUE;
				break;
			case CODE_POINTS.QUOTATION_MARK:
			case CODE_POINTS.APOSTROPHE:
			case CODE_POINTS.LESS_THAN_SIGN:
				this._err(ERR.unexpectedCharacterInAttributeName);
				this.currentAttr.name += String.fromCodePoint(cp);
				break;
			case CODE_POINTS.NULL:
				this._err(ERR.unexpectedNullCharacter);
				this.currentAttr.name += REPLACEMENT_CHARACTER;
				break;
			default: this.currentAttr.name += String.fromCodePoint(isAsciiUpper(cp) ? toAsciiLower(cp) : cp);
		}
	}
	_stateAfterAttributeName(cp) {
		switch (cp) {
			case CODE_POINTS.SPACE:
			case CODE_POINTS.LINE_FEED:
			case CODE_POINTS.TABULATION:
			case CODE_POINTS.FORM_FEED: break;
			case CODE_POINTS.SOLIDUS:
				this.state = State.SELF_CLOSING_START_TAG;
				break;
			case CODE_POINTS.EQUALS_SIGN:
				this.state = State.BEFORE_ATTRIBUTE_VALUE;
				break;
			case CODE_POINTS.GREATER_THAN_SIGN:
				this.state = State.DATA;
				this.emitCurrentTagToken();
				break;
			case CODE_POINTS.EOF:
				this._err(ERR.eofInTag);
				this._emitEOFToken();
				break;
			default:
				this._createAttr("");
				this.state = State.ATTRIBUTE_NAME;
				this._stateAttributeName(cp);
		}
	}
	_stateBeforeAttributeValue(cp) {
		switch (cp) {
			case CODE_POINTS.SPACE:
			case CODE_POINTS.LINE_FEED:
			case CODE_POINTS.TABULATION:
			case CODE_POINTS.FORM_FEED: break;
			case CODE_POINTS.QUOTATION_MARK:
				this.state = State.ATTRIBUTE_VALUE_DOUBLE_QUOTED;
				break;
			case CODE_POINTS.APOSTROPHE:
				this.state = State.ATTRIBUTE_VALUE_SINGLE_QUOTED;
				break;
			case CODE_POINTS.GREATER_THAN_SIGN:
				this._err(ERR.missingAttributeValue);
				this.state = State.DATA;
				this.emitCurrentTagToken();
				break;
			default:
				this.state = State.ATTRIBUTE_VALUE_UNQUOTED;
				this._stateAttributeValueUnquoted(cp);
		}
	}
	_stateAttributeValueDoubleQuoted(cp) {
		switch (cp) {
			case CODE_POINTS.QUOTATION_MARK:
				this.state = State.AFTER_ATTRIBUTE_VALUE_QUOTED;
				break;
			case CODE_POINTS.AMPERSAND:
				this._startCharacterReference();
				break;
			case CODE_POINTS.NULL:
				this._err(ERR.unexpectedNullCharacter);
				this.currentAttr.value += REPLACEMENT_CHARACTER;
				break;
			case CODE_POINTS.EOF:
				this._err(ERR.eofInTag);
				this._emitEOFToken();
				break;
			default: this.currentAttr.value += String.fromCodePoint(cp);
		}
	}
	_stateAttributeValueSingleQuoted(cp) {
		switch (cp) {
			case CODE_POINTS.APOSTROPHE:
				this.state = State.AFTER_ATTRIBUTE_VALUE_QUOTED;
				break;
			case CODE_POINTS.AMPERSAND:
				this._startCharacterReference();
				break;
			case CODE_POINTS.NULL:
				this._err(ERR.unexpectedNullCharacter);
				this.currentAttr.value += REPLACEMENT_CHARACTER;
				break;
			case CODE_POINTS.EOF:
				this._err(ERR.eofInTag);
				this._emitEOFToken();
				break;
			default: this.currentAttr.value += String.fromCodePoint(cp);
		}
	}
	_stateAttributeValueUnquoted(cp) {
		switch (cp) {
			case CODE_POINTS.SPACE:
			case CODE_POINTS.LINE_FEED:
			case CODE_POINTS.TABULATION:
			case CODE_POINTS.FORM_FEED:
				this._leaveAttrValue();
				this.state = State.BEFORE_ATTRIBUTE_NAME;
				break;
			case CODE_POINTS.AMPERSAND:
				this._startCharacterReference();
				break;
			case CODE_POINTS.GREATER_THAN_SIGN:
				this._leaveAttrValue();
				this.state = State.DATA;
				this.emitCurrentTagToken();
				break;
			case CODE_POINTS.NULL:
				this._err(ERR.unexpectedNullCharacter);
				this.currentAttr.value += REPLACEMENT_CHARACTER;
				break;
			case CODE_POINTS.QUOTATION_MARK:
			case CODE_POINTS.APOSTROPHE:
			case CODE_POINTS.LESS_THAN_SIGN:
			case CODE_POINTS.EQUALS_SIGN:
			case CODE_POINTS.GRAVE_ACCENT:
				this._err(ERR.unexpectedCharacterInUnquotedAttributeValue);
				this.currentAttr.value += String.fromCodePoint(cp);
				break;
			case CODE_POINTS.EOF:
				this._err(ERR.eofInTag);
				this._emitEOFToken();
				break;
			default: this.currentAttr.value += String.fromCodePoint(cp);
		}
	}
	_stateAfterAttributeValueQuoted(cp) {
		switch (cp) {
			case CODE_POINTS.SPACE:
			case CODE_POINTS.LINE_FEED:
			case CODE_POINTS.TABULATION:
			case CODE_POINTS.FORM_FEED:
				this._leaveAttrValue();
				this.state = State.BEFORE_ATTRIBUTE_NAME;
				break;
			case CODE_POINTS.SOLIDUS:
				this._leaveAttrValue();
				this.state = State.SELF_CLOSING_START_TAG;
				break;
			case CODE_POINTS.GREATER_THAN_SIGN:
				this._leaveAttrValue();
				this.state = State.DATA;
				this.emitCurrentTagToken();
				break;
			case CODE_POINTS.EOF:
				this._err(ERR.eofInTag);
				this._emitEOFToken();
				break;
			default:
				this._err(ERR.missingWhitespaceBetweenAttributes);
				this.state = State.BEFORE_ATTRIBUTE_NAME;
				this._stateBeforeAttributeName(cp);
		}
	}
	_stateSelfClosingStartTag(cp) {
		switch (cp) {
			case CODE_POINTS.GREATER_THAN_SIGN: {
				const token = this.currentToken;
				token.selfClosing = true;
				this.state = State.DATA;
				this.emitCurrentTagToken();
				break;
			}
			case CODE_POINTS.EOF:
				this._err(ERR.eofInTag);
				this._emitEOFToken();
				break;
			default:
				this._err(ERR.unexpectedSolidusInTag);
				this.state = State.BEFORE_ATTRIBUTE_NAME;
				this._stateBeforeAttributeName(cp);
		}
	}
	_stateBogusComment(cp) {
		const token = this.currentToken;
		switch (cp) {
			case CODE_POINTS.GREATER_THAN_SIGN:
				this.state = State.DATA;
				this.emitCurrentComment(token);
				break;
			case CODE_POINTS.EOF:
				this.emitCurrentComment(token);
				this._emitEOFToken();
				break;
			case CODE_POINTS.NULL:
				this._err(ERR.unexpectedNullCharacter);
				token.data += REPLACEMENT_CHARACTER;
				break;
			default: token.data += String.fromCodePoint(cp);
		}
	}
	_stateMarkupDeclarationOpen(cp) {
		if (this._consumeSequenceIfMatch(SEQUENCES.DASH_DASH, true)) {
			this._createCommentToken(SEQUENCES.DASH_DASH.length + 1);
			this.state = State.COMMENT_START;
		} else if (this._consumeSequenceIfMatch(SEQUENCES.DOCTYPE, false)) {
			this.currentLocation = this.getCurrentLocation(SEQUENCES.DOCTYPE.length + 1);
			this.state = State.DOCTYPE;
		} else if (this._consumeSequenceIfMatch(SEQUENCES.CDATA_START, true)) if (this.inForeignNode) this.state = State.CDATA_SECTION;
		else {
			this._err(ERR.cdataInHtmlContent);
			this._createCommentToken(SEQUENCES.CDATA_START.length + 1);
			this.currentToken.data = "[CDATA[";
			this.state = State.BOGUS_COMMENT;
		}
		else if (!this._ensureHibernation()) {
			this._err(ERR.incorrectlyOpenedComment);
			this._createCommentToken(2);
			this.state = State.BOGUS_COMMENT;
			this._stateBogusComment(cp);
		}
	}
	_stateCommentStart(cp) {
		switch (cp) {
			case CODE_POINTS.HYPHEN_MINUS:
				this.state = State.COMMENT_START_DASH;
				break;
			case CODE_POINTS.GREATER_THAN_SIGN: {
				this._err(ERR.abruptClosingOfEmptyComment);
				this.state = State.DATA;
				const token = this.currentToken;
				this.emitCurrentComment(token);
				break;
			}
			default:
				this.state = State.COMMENT;
				this._stateComment(cp);
		}
	}
	_stateCommentStartDash(cp) {
		const token = this.currentToken;
		switch (cp) {
			case CODE_POINTS.HYPHEN_MINUS:
				this.state = State.COMMENT_END;
				break;
			case CODE_POINTS.GREATER_THAN_SIGN:
				this._err(ERR.abruptClosingOfEmptyComment);
				this.state = State.DATA;
				this.emitCurrentComment(token);
				break;
			case CODE_POINTS.EOF:
				this._err(ERR.eofInComment);
				this.emitCurrentComment(token);
				this._emitEOFToken();
				break;
			default:
				token.data += "-";
				this.state = State.COMMENT;
				this._stateComment(cp);
		}
	}
	_stateComment(cp) {
		const token = this.currentToken;
		switch (cp) {
			case CODE_POINTS.HYPHEN_MINUS:
				this.state = State.COMMENT_END_DASH;
				break;
			case CODE_POINTS.LESS_THAN_SIGN:
				token.data += "<";
				this.state = State.COMMENT_LESS_THAN_SIGN;
				break;
			case CODE_POINTS.NULL:
				this._err(ERR.unexpectedNullCharacter);
				token.data += REPLACEMENT_CHARACTER;
				break;
			case CODE_POINTS.EOF:
				this._err(ERR.eofInComment);
				this.emitCurrentComment(token);
				this._emitEOFToken();
				break;
			default: token.data += String.fromCodePoint(cp);
		}
	}
	_stateCommentLessThanSign(cp) {
		const token = this.currentToken;
		switch (cp) {
			case CODE_POINTS.EXCLAMATION_MARK:
				token.data += "!";
				this.state = State.COMMENT_LESS_THAN_SIGN_BANG;
				break;
			case CODE_POINTS.LESS_THAN_SIGN:
				token.data += "<";
				break;
			default:
				this.state = State.COMMENT;
				this._stateComment(cp);
		}
	}
	_stateCommentLessThanSignBang(cp) {
		if (cp === CODE_POINTS.HYPHEN_MINUS) this.state = State.COMMENT_LESS_THAN_SIGN_BANG_DASH;
		else {
			this.state = State.COMMENT;
			this._stateComment(cp);
		}
	}
	_stateCommentLessThanSignBangDash(cp) {
		if (cp === CODE_POINTS.HYPHEN_MINUS) this.state = State.COMMENT_LESS_THAN_SIGN_BANG_DASH_DASH;
		else {
			this.state = State.COMMENT_END_DASH;
			this._stateCommentEndDash(cp);
		}
	}
	_stateCommentLessThanSignBangDashDash(cp) {
		if (cp !== CODE_POINTS.GREATER_THAN_SIGN && cp !== CODE_POINTS.EOF) this._err(ERR.nestedComment);
		this.state = State.COMMENT_END;
		this._stateCommentEnd(cp);
	}
	_stateCommentEndDash(cp) {
		const token = this.currentToken;
		switch (cp) {
			case CODE_POINTS.HYPHEN_MINUS:
				this.state = State.COMMENT_END;
				break;
			case CODE_POINTS.EOF:
				this._err(ERR.eofInComment);
				this.emitCurrentComment(token);
				this._emitEOFToken();
				break;
			default:
				token.data += "-";
				this.state = State.COMMENT;
				this._stateComment(cp);
		}
	}
	_stateCommentEnd(cp) {
		const token = this.currentToken;
		switch (cp) {
			case CODE_POINTS.GREATER_THAN_SIGN:
				this.state = State.DATA;
				this.emitCurrentComment(token);
				break;
			case CODE_POINTS.EXCLAMATION_MARK:
				this.state = State.COMMENT_END_BANG;
				break;
			case CODE_POINTS.HYPHEN_MINUS:
				token.data += "-";
				break;
			case CODE_POINTS.EOF:
				this._err(ERR.eofInComment);
				this.emitCurrentComment(token);
				this._emitEOFToken();
				break;
			default:
				token.data += "--";
				this.state = State.COMMENT;
				this._stateComment(cp);
		}
	}
	_stateCommentEndBang(cp) {
		const token = this.currentToken;
		switch (cp) {
			case CODE_POINTS.HYPHEN_MINUS:
				token.data += "--!";
				this.state = State.COMMENT_END_DASH;
				break;
			case CODE_POINTS.GREATER_THAN_SIGN:
				this._err(ERR.incorrectlyClosedComment);
				this.state = State.DATA;
				this.emitCurrentComment(token);
				break;
			case CODE_POINTS.EOF:
				this._err(ERR.eofInComment);
				this.emitCurrentComment(token);
				this._emitEOFToken();
				break;
			default:
				token.data += "--!";
				this.state = State.COMMENT;
				this._stateComment(cp);
		}
	}
	_stateDoctype(cp) {
		switch (cp) {
			case CODE_POINTS.SPACE:
			case CODE_POINTS.LINE_FEED:
			case CODE_POINTS.TABULATION:
			case CODE_POINTS.FORM_FEED:
				this.state = State.BEFORE_DOCTYPE_NAME;
				break;
			case CODE_POINTS.GREATER_THAN_SIGN:
				this.state = State.BEFORE_DOCTYPE_NAME;
				this._stateBeforeDoctypeName(cp);
				break;
			case CODE_POINTS.EOF: {
				this._err(ERR.eofInDoctype);
				this._createDoctypeToken(null);
				const token = this.currentToken;
				token.forceQuirks = true;
				this.emitCurrentDoctype(token);
				this._emitEOFToken();
				break;
			}
			default:
				this._err(ERR.missingWhitespaceBeforeDoctypeName);
				this.state = State.BEFORE_DOCTYPE_NAME;
				this._stateBeforeDoctypeName(cp);
		}
	}
	_stateBeforeDoctypeName(cp) {
		if (isAsciiUpper(cp)) {
			this._createDoctypeToken(String.fromCharCode(toAsciiLower(cp)));
			this.state = State.DOCTYPE_NAME;
		} else switch (cp) {
			case CODE_POINTS.SPACE:
			case CODE_POINTS.LINE_FEED:
			case CODE_POINTS.TABULATION:
			case CODE_POINTS.FORM_FEED: break;
			case CODE_POINTS.NULL:
				this._err(ERR.unexpectedNullCharacter);
				this._createDoctypeToken(REPLACEMENT_CHARACTER);
				this.state = State.DOCTYPE_NAME;
				break;
			case CODE_POINTS.GREATER_THAN_SIGN: {
				this._err(ERR.missingDoctypeName);
				this._createDoctypeToken(null);
				const token = this.currentToken;
				token.forceQuirks = true;
				this.emitCurrentDoctype(token);
				this.state = State.DATA;
				break;
			}
			case CODE_POINTS.EOF: {
				this._err(ERR.eofInDoctype);
				this._createDoctypeToken(null);
				const token = this.currentToken;
				token.forceQuirks = true;
				this.emitCurrentDoctype(token);
				this._emitEOFToken();
				break;
			}
			default:
				this._createDoctypeToken(String.fromCodePoint(cp));
				this.state = State.DOCTYPE_NAME;
		}
	}
	_stateDoctypeName(cp) {
		const token = this.currentToken;
		switch (cp) {
			case CODE_POINTS.SPACE:
			case CODE_POINTS.LINE_FEED:
			case CODE_POINTS.TABULATION:
			case CODE_POINTS.FORM_FEED:
				this.state = State.AFTER_DOCTYPE_NAME;
				break;
			case CODE_POINTS.GREATER_THAN_SIGN:
				this.state = State.DATA;
				this.emitCurrentDoctype(token);
				break;
			case CODE_POINTS.NULL:
				this._err(ERR.unexpectedNullCharacter);
				token.name += REPLACEMENT_CHARACTER;
				break;
			case CODE_POINTS.EOF:
				this._err(ERR.eofInDoctype);
				token.forceQuirks = true;
				this.emitCurrentDoctype(token);
				this._emitEOFToken();
				break;
			default: token.name += String.fromCodePoint(isAsciiUpper(cp) ? toAsciiLower(cp) : cp);
		}
	}
	_stateAfterDoctypeName(cp) {
		const token = this.currentToken;
		switch (cp) {
			case CODE_POINTS.SPACE:
			case CODE_POINTS.LINE_FEED:
			case CODE_POINTS.TABULATION:
			case CODE_POINTS.FORM_FEED: break;
			case CODE_POINTS.GREATER_THAN_SIGN:
				this.state = State.DATA;
				this.emitCurrentDoctype(token);
				break;
			case CODE_POINTS.EOF:
				this._err(ERR.eofInDoctype);
				token.forceQuirks = true;
				this.emitCurrentDoctype(token);
				this._emitEOFToken();
				break;
			default: if (this._consumeSequenceIfMatch(SEQUENCES.PUBLIC, false)) this.state = State.AFTER_DOCTYPE_PUBLIC_KEYWORD;
			else if (this._consumeSequenceIfMatch(SEQUENCES.SYSTEM, false)) this.state = State.AFTER_DOCTYPE_SYSTEM_KEYWORD;
			else if (!this._ensureHibernation()) {
				this._err(ERR.invalidCharacterSequenceAfterDoctypeName);
				token.forceQuirks = true;
				this.state = State.BOGUS_DOCTYPE;
				this._stateBogusDoctype(cp);
			}
		}
	}
	_stateAfterDoctypePublicKeyword(cp) {
		const token = this.currentToken;
		switch (cp) {
			case CODE_POINTS.SPACE:
			case CODE_POINTS.LINE_FEED:
			case CODE_POINTS.TABULATION:
			case CODE_POINTS.FORM_FEED:
				this.state = State.BEFORE_DOCTYPE_PUBLIC_IDENTIFIER;
				break;
			case CODE_POINTS.QUOTATION_MARK:
				this._err(ERR.missingWhitespaceAfterDoctypePublicKeyword);
				token.publicId = "";
				this.state = State.DOCTYPE_PUBLIC_IDENTIFIER_DOUBLE_QUOTED;
				break;
			case CODE_POINTS.APOSTROPHE:
				this._err(ERR.missingWhitespaceAfterDoctypePublicKeyword);
				token.publicId = "";
				this.state = State.DOCTYPE_PUBLIC_IDENTIFIER_SINGLE_QUOTED;
				break;
			case CODE_POINTS.GREATER_THAN_SIGN:
				this._err(ERR.missingDoctypePublicIdentifier);
				token.forceQuirks = true;
				this.state = State.DATA;
				this.emitCurrentDoctype(token);
				break;
			case CODE_POINTS.EOF:
				this._err(ERR.eofInDoctype);
				token.forceQuirks = true;
				this.emitCurrentDoctype(token);
				this._emitEOFToken();
				break;
			default:
				this._err(ERR.missingQuoteBeforeDoctypePublicIdentifier);
				token.forceQuirks = true;
				this.state = State.BOGUS_DOCTYPE;
				this._stateBogusDoctype(cp);
		}
	}
	_stateBeforeDoctypePublicIdentifier(cp) {
		const token = this.currentToken;
		switch (cp) {
			case CODE_POINTS.SPACE:
			case CODE_POINTS.LINE_FEED:
			case CODE_POINTS.TABULATION:
			case CODE_POINTS.FORM_FEED: break;
			case CODE_POINTS.QUOTATION_MARK:
				token.publicId = "";
				this.state = State.DOCTYPE_PUBLIC_IDENTIFIER_DOUBLE_QUOTED;
				break;
			case CODE_POINTS.APOSTROPHE:
				token.publicId = "";
				this.state = State.DOCTYPE_PUBLIC_IDENTIFIER_SINGLE_QUOTED;
				break;
			case CODE_POINTS.GREATER_THAN_SIGN:
				this._err(ERR.missingDoctypePublicIdentifier);
				token.forceQuirks = true;
				this.state = State.DATA;
				this.emitCurrentDoctype(token);
				break;
			case CODE_POINTS.EOF:
				this._err(ERR.eofInDoctype);
				token.forceQuirks = true;
				this.emitCurrentDoctype(token);
				this._emitEOFToken();
				break;
			default:
				this._err(ERR.missingQuoteBeforeDoctypePublicIdentifier);
				token.forceQuirks = true;
				this.state = State.BOGUS_DOCTYPE;
				this._stateBogusDoctype(cp);
		}
	}
	_stateDoctypePublicIdentifierDoubleQuoted(cp) {
		const token = this.currentToken;
		switch (cp) {
			case CODE_POINTS.QUOTATION_MARK:
				this.state = State.AFTER_DOCTYPE_PUBLIC_IDENTIFIER;
				break;
			case CODE_POINTS.NULL:
				this._err(ERR.unexpectedNullCharacter);
				token.publicId += REPLACEMENT_CHARACTER;
				break;
			case CODE_POINTS.GREATER_THAN_SIGN:
				this._err(ERR.abruptDoctypePublicIdentifier);
				token.forceQuirks = true;
				this.emitCurrentDoctype(token);
				this.state = State.DATA;
				break;
			case CODE_POINTS.EOF:
				this._err(ERR.eofInDoctype);
				token.forceQuirks = true;
				this.emitCurrentDoctype(token);
				this._emitEOFToken();
				break;
			default: token.publicId += String.fromCodePoint(cp);
		}
	}
	_stateDoctypePublicIdentifierSingleQuoted(cp) {
		const token = this.currentToken;
		switch (cp) {
			case CODE_POINTS.APOSTROPHE:
				this.state = State.AFTER_DOCTYPE_PUBLIC_IDENTIFIER;
				break;
			case CODE_POINTS.NULL:
				this._err(ERR.unexpectedNullCharacter);
				token.publicId += REPLACEMENT_CHARACTER;
				break;
			case CODE_POINTS.GREATER_THAN_SIGN:
				this._err(ERR.abruptDoctypePublicIdentifier);
				token.forceQuirks = true;
				this.emitCurrentDoctype(token);
				this.state = State.DATA;
				break;
			case CODE_POINTS.EOF:
				this._err(ERR.eofInDoctype);
				token.forceQuirks = true;
				this.emitCurrentDoctype(token);
				this._emitEOFToken();
				break;
			default: token.publicId += String.fromCodePoint(cp);
		}
	}
	_stateAfterDoctypePublicIdentifier(cp) {
		const token = this.currentToken;
		switch (cp) {
			case CODE_POINTS.SPACE:
			case CODE_POINTS.LINE_FEED:
			case CODE_POINTS.TABULATION:
			case CODE_POINTS.FORM_FEED:
				this.state = State.BETWEEN_DOCTYPE_PUBLIC_AND_SYSTEM_IDENTIFIERS;
				break;
			case CODE_POINTS.GREATER_THAN_SIGN:
				this.state = State.DATA;
				this.emitCurrentDoctype(token);
				break;
			case CODE_POINTS.QUOTATION_MARK:
				this._err(ERR.missingWhitespaceBetweenDoctypePublicAndSystemIdentifiers);
				token.systemId = "";
				this.state = State.DOCTYPE_SYSTEM_IDENTIFIER_DOUBLE_QUOTED;
				break;
			case CODE_POINTS.APOSTROPHE:
				this._err(ERR.missingWhitespaceBetweenDoctypePublicAndSystemIdentifiers);
				token.systemId = "";
				this.state = State.DOCTYPE_SYSTEM_IDENTIFIER_SINGLE_QUOTED;
				break;
			case CODE_POINTS.EOF:
				this._err(ERR.eofInDoctype);
				token.forceQuirks = true;
				this.emitCurrentDoctype(token);
				this._emitEOFToken();
				break;
			default:
				this._err(ERR.missingQuoteBeforeDoctypeSystemIdentifier);
				token.forceQuirks = true;
				this.state = State.BOGUS_DOCTYPE;
				this._stateBogusDoctype(cp);
		}
	}
	_stateBetweenDoctypePublicAndSystemIdentifiers(cp) {
		const token = this.currentToken;
		switch (cp) {
			case CODE_POINTS.SPACE:
			case CODE_POINTS.LINE_FEED:
			case CODE_POINTS.TABULATION:
			case CODE_POINTS.FORM_FEED: break;
			case CODE_POINTS.GREATER_THAN_SIGN:
				this.emitCurrentDoctype(token);
				this.state = State.DATA;
				break;
			case CODE_POINTS.QUOTATION_MARK:
				token.systemId = "";
				this.state = State.DOCTYPE_SYSTEM_IDENTIFIER_DOUBLE_QUOTED;
				break;
			case CODE_POINTS.APOSTROPHE:
				token.systemId = "";
				this.state = State.DOCTYPE_SYSTEM_IDENTIFIER_SINGLE_QUOTED;
				break;
			case CODE_POINTS.EOF:
				this._err(ERR.eofInDoctype);
				token.forceQuirks = true;
				this.emitCurrentDoctype(token);
				this._emitEOFToken();
				break;
			default:
				this._err(ERR.missingQuoteBeforeDoctypeSystemIdentifier);
				token.forceQuirks = true;
				this.state = State.BOGUS_DOCTYPE;
				this._stateBogusDoctype(cp);
		}
	}
	_stateAfterDoctypeSystemKeyword(cp) {
		const token = this.currentToken;
		switch (cp) {
			case CODE_POINTS.SPACE:
			case CODE_POINTS.LINE_FEED:
			case CODE_POINTS.TABULATION:
			case CODE_POINTS.FORM_FEED:
				this.state = State.BEFORE_DOCTYPE_SYSTEM_IDENTIFIER;
				break;
			case CODE_POINTS.QUOTATION_MARK:
				this._err(ERR.missingWhitespaceAfterDoctypeSystemKeyword);
				token.systemId = "";
				this.state = State.DOCTYPE_SYSTEM_IDENTIFIER_DOUBLE_QUOTED;
				break;
			case CODE_POINTS.APOSTROPHE:
				this._err(ERR.missingWhitespaceAfterDoctypeSystemKeyword);
				token.systemId = "";
				this.state = State.DOCTYPE_SYSTEM_IDENTIFIER_SINGLE_QUOTED;
				break;
			case CODE_POINTS.GREATER_THAN_SIGN:
				this._err(ERR.missingDoctypeSystemIdentifier);
				token.forceQuirks = true;
				this.state = State.DATA;
				this.emitCurrentDoctype(token);
				break;
			case CODE_POINTS.EOF:
				this._err(ERR.eofInDoctype);
				token.forceQuirks = true;
				this.emitCurrentDoctype(token);
				this._emitEOFToken();
				break;
			default:
				this._err(ERR.missingQuoteBeforeDoctypeSystemIdentifier);
				token.forceQuirks = true;
				this.state = State.BOGUS_DOCTYPE;
				this._stateBogusDoctype(cp);
		}
	}
	_stateBeforeDoctypeSystemIdentifier(cp) {
		const token = this.currentToken;
		switch (cp) {
			case CODE_POINTS.SPACE:
			case CODE_POINTS.LINE_FEED:
			case CODE_POINTS.TABULATION:
			case CODE_POINTS.FORM_FEED: break;
			case CODE_POINTS.QUOTATION_MARK:
				token.systemId = "";
				this.state = State.DOCTYPE_SYSTEM_IDENTIFIER_DOUBLE_QUOTED;
				break;
			case CODE_POINTS.APOSTROPHE:
				token.systemId = "";
				this.state = State.DOCTYPE_SYSTEM_IDENTIFIER_SINGLE_QUOTED;
				break;
			case CODE_POINTS.GREATER_THAN_SIGN:
				this._err(ERR.missingDoctypeSystemIdentifier);
				token.forceQuirks = true;
				this.state = State.DATA;
				this.emitCurrentDoctype(token);
				break;
			case CODE_POINTS.EOF:
				this._err(ERR.eofInDoctype);
				token.forceQuirks = true;
				this.emitCurrentDoctype(token);
				this._emitEOFToken();
				break;
			default:
				this._err(ERR.missingQuoteBeforeDoctypeSystemIdentifier);
				token.forceQuirks = true;
				this.state = State.BOGUS_DOCTYPE;
				this._stateBogusDoctype(cp);
		}
	}
	_stateDoctypeSystemIdentifierDoubleQuoted(cp) {
		const token = this.currentToken;
		switch (cp) {
			case CODE_POINTS.QUOTATION_MARK:
				this.state = State.AFTER_DOCTYPE_SYSTEM_IDENTIFIER;
				break;
			case CODE_POINTS.NULL:
				this._err(ERR.unexpectedNullCharacter);
				token.systemId += REPLACEMENT_CHARACTER;
				break;
			case CODE_POINTS.GREATER_THAN_SIGN:
				this._err(ERR.abruptDoctypeSystemIdentifier);
				token.forceQuirks = true;
				this.emitCurrentDoctype(token);
				this.state = State.DATA;
				break;
			case CODE_POINTS.EOF:
				this._err(ERR.eofInDoctype);
				token.forceQuirks = true;
				this.emitCurrentDoctype(token);
				this._emitEOFToken();
				break;
			default: token.systemId += String.fromCodePoint(cp);
		}
	}
	_stateDoctypeSystemIdentifierSingleQuoted(cp) {
		const token = this.currentToken;
		switch (cp) {
			case CODE_POINTS.APOSTROPHE:
				this.state = State.AFTER_DOCTYPE_SYSTEM_IDENTIFIER;
				break;
			case CODE_POINTS.NULL:
				this._err(ERR.unexpectedNullCharacter);
				token.systemId += REPLACEMENT_CHARACTER;
				break;
			case CODE_POINTS.GREATER_THAN_SIGN:
				this._err(ERR.abruptDoctypeSystemIdentifier);
				token.forceQuirks = true;
				this.emitCurrentDoctype(token);
				this.state = State.DATA;
				break;
			case CODE_POINTS.EOF:
				this._err(ERR.eofInDoctype);
				token.forceQuirks = true;
				this.emitCurrentDoctype(token);
				this._emitEOFToken();
				break;
			default: token.systemId += String.fromCodePoint(cp);
		}
	}
	_stateAfterDoctypeSystemIdentifier(cp) {
		const token = this.currentToken;
		switch (cp) {
			case CODE_POINTS.SPACE:
			case CODE_POINTS.LINE_FEED:
			case CODE_POINTS.TABULATION:
			case CODE_POINTS.FORM_FEED: break;
			case CODE_POINTS.GREATER_THAN_SIGN:
				this.emitCurrentDoctype(token);
				this.state = State.DATA;
				break;
			case CODE_POINTS.EOF:
				this._err(ERR.eofInDoctype);
				token.forceQuirks = true;
				this.emitCurrentDoctype(token);
				this._emitEOFToken();
				break;
			default:
				this._err(ERR.unexpectedCharacterAfterDoctypeSystemIdentifier);
				this.state = State.BOGUS_DOCTYPE;
				this._stateBogusDoctype(cp);
		}
	}
	_stateBogusDoctype(cp) {
		const token = this.currentToken;
		switch (cp) {
			case CODE_POINTS.GREATER_THAN_SIGN:
				this.emitCurrentDoctype(token);
				this.state = State.DATA;
				break;
			case CODE_POINTS.NULL:
				this._err(ERR.unexpectedNullCharacter);
				break;
			case CODE_POINTS.EOF:
				this.emitCurrentDoctype(token);
				this._emitEOFToken();
				break;
			default:
		}
	}
	_stateCdataSection(cp) {
		switch (cp) {
			case CODE_POINTS.RIGHT_SQUARE_BRACKET:
				this.state = State.CDATA_SECTION_BRACKET;
				break;
			case CODE_POINTS.EOF:
				this._err(ERR.eofInCdata);
				this._emitEOFToken();
				break;
			default: this._emitCodePoint(cp);
		}
	}
	_stateCdataSectionBracket(cp) {
		if (cp === CODE_POINTS.RIGHT_SQUARE_BRACKET) this.state = State.CDATA_SECTION_END;
		else {
			this._emitChars("]");
			this.state = State.CDATA_SECTION;
			this._stateCdataSection(cp);
		}
	}
	_stateCdataSectionEnd(cp) {
		switch (cp) {
			case CODE_POINTS.GREATER_THAN_SIGN:
				this.state = State.DATA;
				break;
			case CODE_POINTS.RIGHT_SQUARE_BRACKET:
				this._emitChars("]");
				break;
			default:
				this._emitChars("]]");
				this.state = State.CDATA_SECTION;
				this._stateCdataSection(cp);
		}
	}
	_stateCharacterReference() {
		let length = this.entityDecoder.write(this.preprocessor.html, this.preprocessor.pos);
		if (length < 0) if (this.preprocessor.lastChunkWritten) length = this.entityDecoder.end();
		else {
			this.active = false;
			this.preprocessor.pos = this.preprocessor.html.length - 1;
			this.consumedAfterSnapshot = 0;
			this.preprocessor.endOfChunkHit = true;
			return;
		}
		if (length === 0) {
			this.preprocessor.pos = this.entityStartPos;
			this._flushCodePointConsumedAsCharacterReference(CODE_POINTS.AMPERSAND);
			this.state = !this._isCharacterReferenceInAttribute() && isAsciiAlphaNumeric(this.preprocessor.peek(1)) ? State.AMBIGUOUS_AMPERSAND : this.returnState;
		} else this.state = this.returnState;
	}
	_stateAmbiguousAmpersand(cp) {
		if (isAsciiAlphaNumeric(cp)) this._flushCodePointConsumedAsCharacterReference(cp);
		else {
			if (cp === CODE_POINTS.SEMICOLON) this._err(ERR.unknownNamedCharacterReference);
			this.state = this.returnState;
			this._callState(cp);
		}
	}
};

//#endregion
//#region node_modules/hast-util-raw/node_modules/parse5/dist/parser/open-element-stack.js
const IMPLICIT_END_TAG_REQUIRED = new Set([
	TAG_ID.DD,
	TAG_ID.DT,
	TAG_ID.LI,
	TAG_ID.OPTGROUP,
	TAG_ID.OPTION,
	TAG_ID.P,
	TAG_ID.RB,
	TAG_ID.RP,
	TAG_ID.RT,
	TAG_ID.RTC
]);
const IMPLICIT_END_TAG_REQUIRED_THOROUGHLY = new Set([
	...IMPLICIT_END_TAG_REQUIRED,
	TAG_ID.CAPTION,
	TAG_ID.COLGROUP,
	TAG_ID.TBODY,
	TAG_ID.TD,
	TAG_ID.TFOOT,
	TAG_ID.TH,
	TAG_ID.THEAD,
	TAG_ID.TR
]);
const SCOPING_ELEMENTS_HTML = new Set([
	TAG_ID.APPLET,
	TAG_ID.CAPTION,
	TAG_ID.HTML,
	TAG_ID.MARQUEE,
	TAG_ID.OBJECT,
	TAG_ID.TABLE,
	TAG_ID.TD,
	TAG_ID.TEMPLATE,
	TAG_ID.TH
]);
const SCOPING_ELEMENTS_HTML_LIST = new Set([
	...SCOPING_ELEMENTS_HTML,
	TAG_ID.OL,
	TAG_ID.UL
]);
const SCOPING_ELEMENTS_HTML_BUTTON = new Set([...SCOPING_ELEMENTS_HTML, TAG_ID.BUTTON]);
const SCOPING_ELEMENTS_MATHML = new Set([
	TAG_ID.ANNOTATION_XML,
	TAG_ID.MI,
	TAG_ID.MN,
	TAG_ID.MO,
	TAG_ID.MS,
	TAG_ID.MTEXT
]);
const SCOPING_ELEMENTS_SVG = new Set([
	TAG_ID.DESC,
	TAG_ID.FOREIGN_OBJECT,
	TAG_ID.TITLE
]);
const TABLE_ROW_CONTEXT = new Set([
	TAG_ID.TR,
	TAG_ID.TEMPLATE,
	TAG_ID.HTML
]);
const TABLE_BODY_CONTEXT = new Set([
	TAG_ID.TBODY,
	TAG_ID.TFOOT,
	TAG_ID.THEAD,
	TAG_ID.TEMPLATE,
	TAG_ID.HTML
]);
const TABLE_CONTEXT = new Set([
	TAG_ID.TABLE,
	TAG_ID.TEMPLATE,
	TAG_ID.HTML
]);
const TABLE_CELLS = new Set([TAG_ID.TD, TAG_ID.TH]);
var OpenElementStack = class {
	get currentTmplContentOrNode() {
		return this._isInTemplate() ? this.treeAdapter.getTemplateContent(this.current) : this.current;
	}
	constructor(document$3, treeAdapter, handler) {
		this.treeAdapter = treeAdapter;
		this.handler = handler;
		this.items = [];
		this.tagIDs = [];
		this.stackTop = -1;
		this.tmplCount = 0;
		this.currentTagId = TAG_ID.UNKNOWN;
		this.current = document$3;
	}
	_indexOf(element$5) {
		return this.items.lastIndexOf(element$5, this.stackTop);
	}
	_isInTemplate() {
		return this.currentTagId === TAG_ID.TEMPLATE && this.treeAdapter.getNamespaceURI(this.current) === NS$1.HTML;
	}
	_updateCurrentElement() {
		this.current = this.items[this.stackTop];
		this.currentTagId = this.tagIDs[this.stackTop];
	}
	push(element$5, tagID) {
		this.stackTop++;
		this.items[this.stackTop] = element$5;
		this.current = element$5;
		this.tagIDs[this.stackTop] = tagID;
		this.currentTagId = tagID;
		if (this._isInTemplate()) this.tmplCount++;
		this.handler.onItemPush(element$5, tagID, true);
	}
	pop() {
		const popped = this.current;
		if (this.tmplCount > 0 && this._isInTemplate()) this.tmplCount--;
		this.stackTop--;
		this._updateCurrentElement();
		this.handler.onItemPop(popped, true);
	}
	replace(oldElement, newElement) {
		const idx = this._indexOf(oldElement);
		this.items[idx] = newElement;
		if (idx === this.stackTop) this.current = newElement;
	}
	insertAfter(referenceElement, newElement, newElementID) {
		const insertionIdx = this._indexOf(referenceElement) + 1;
		this.items.splice(insertionIdx, 0, newElement);
		this.tagIDs.splice(insertionIdx, 0, newElementID);
		this.stackTop++;
		if (insertionIdx === this.stackTop) this._updateCurrentElement();
		if (this.current && this.currentTagId !== void 0) this.handler.onItemPush(this.current, this.currentTagId, insertionIdx === this.stackTop);
	}
	popUntilTagNamePopped(tagName) {
		let targetIdx = this.stackTop + 1;
		do
			targetIdx = this.tagIDs.lastIndexOf(tagName, targetIdx - 1);
		while (targetIdx > 0 && this.treeAdapter.getNamespaceURI(this.items[targetIdx]) !== NS$1.HTML);
		this.shortenToLength(Math.max(targetIdx, 0));
	}
	shortenToLength(idx) {
		while (this.stackTop >= idx) {
			const popped = this.current;
			if (this.tmplCount > 0 && this._isInTemplate()) this.tmplCount -= 1;
			this.stackTop--;
			this._updateCurrentElement();
			this.handler.onItemPop(popped, this.stackTop < idx);
		}
	}
	popUntilElementPopped(element$5) {
		const idx = this._indexOf(element$5);
		this.shortenToLength(Math.max(idx, 0));
	}
	popUntilPopped(tagNames, targetNS) {
		const idx = this._indexOfTagNames(tagNames, targetNS);
		this.shortenToLength(Math.max(idx, 0));
	}
	popUntilNumberedHeaderPopped() {
		this.popUntilPopped(NUMBERED_HEADERS, NS$1.HTML);
	}
	popUntilTableCellPopped() {
		this.popUntilPopped(TABLE_CELLS, NS$1.HTML);
	}
	popAllUpToHtmlElement() {
		this.tmplCount = 0;
		this.shortenToLength(1);
	}
	_indexOfTagNames(tagNames, namespace) {
		for (let i = this.stackTop; i >= 0; i--) if (tagNames.has(this.tagIDs[i]) && this.treeAdapter.getNamespaceURI(this.items[i]) === namespace) return i;
		return -1;
	}
	clearBackTo(tagNames, targetNS) {
		const idx = this._indexOfTagNames(tagNames, targetNS);
		this.shortenToLength(idx + 1);
	}
	clearBackToTableContext() {
		this.clearBackTo(TABLE_CONTEXT, NS$1.HTML);
	}
	clearBackToTableBodyContext() {
		this.clearBackTo(TABLE_BODY_CONTEXT, NS$1.HTML);
	}
	clearBackToTableRowContext() {
		this.clearBackTo(TABLE_ROW_CONTEXT, NS$1.HTML);
	}
	remove(element$5) {
		const idx = this._indexOf(element$5);
		if (idx >= 0) if (idx === this.stackTop) this.pop();
		else {
			this.items.splice(idx, 1);
			this.tagIDs.splice(idx, 1);
			this.stackTop--;
			this._updateCurrentElement();
			this.handler.onItemPop(element$5, false);
		}
	}
	tryPeekProperlyNestedBodyElement() {
		return this.stackTop >= 1 && this.tagIDs[1] === TAG_ID.BODY ? this.items[1] : null;
	}
	contains(element$5) {
		return this._indexOf(element$5) > -1;
	}
	getCommonAncestor(element$5) {
		const elementIdx = this._indexOf(element$5) - 1;
		return elementIdx >= 0 ? this.items[elementIdx] : null;
	}
	isRootHtmlElementCurrent() {
		return this.stackTop === 0 && this.tagIDs[0] === TAG_ID.HTML;
	}
	hasInDynamicScope(tagName, htmlScope) {
		for (let i = this.stackTop; i >= 0; i--) {
			const tn = this.tagIDs[i];
			switch (this.treeAdapter.getNamespaceURI(this.items[i])) {
				case NS$1.HTML:
					if (tn === tagName) return true;
					if (htmlScope.has(tn)) return false;
					break;
				case NS$1.SVG:
					if (SCOPING_ELEMENTS_SVG.has(tn)) return false;
					break;
				case NS$1.MATHML:
					if (SCOPING_ELEMENTS_MATHML.has(tn)) return false;
					break;
			}
		}
		return true;
	}
	hasInScope(tagName) {
		return this.hasInDynamicScope(tagName, SCOPING_ELEMENTS_HTML);
	}
	hasInListItemScope(tagName) {
		return this.hasInDynamicScope(tagName, SCOPING_ELEMENTS_HTML_LIST);
	}
	hasInButtonScope(tagName) {
		return this.hasInDynamicScope(tagName, SCOPING_ELEMENTS_HTML_BUTTON);
	}
	hasNumberedHeaderInScope() {
		for (let i = this.stackTop; i >= 0; i--) {
			const tn = this.tagIDs[i];
			switch (this.treeAdapter.getNamespaceURI(this.items[i])) {
				case NS$1.HTML:
					if (NUMBERED_HEADERS.has(tn)) return true;
					if (SCOPING_ELEMENTS_HTML.has(tn)) return false;
					break;
				case NS$1.SVG:
					if (SCOPING_ELEMENTS_SVG.has(tn)) return false;
					break;
				case NS$1.MATHML:
					if (SCOPING_ELEMENTS_MATHML.has(tn)) return false;
					break;
			}
		}
		return true;
	}
	hasInTableScope(tagName) {
		for (let i = this.stackTop; i >= 0; i--) {
			if (this.treeAdapter.getNamespaceURI(this.items[i]) !== NS$1.HTML) continue;
			switch (this.tagIDs[i]) {
				case tagName: return true;
				case TAG_ID.TABLE:
				case TAG_ID.HTML: return false;
			}
		}
		return true;
	}
	hasTableBodyContextInTableScope() {
		for (let i = this.stackTop; i >= 0; i--) {
			if (this.treeAdapter.getNamespaceURI(this.items[i]) !== NS$1.HTML) continue;
			switch (this.tagIDs[i]) {
				case TAG_ID.TBODY:
				case TAG_ID.THEAD:
				case TAG_ID.TFOOT: return true;
				case TAG_ID.TABLE:
				case TAG_ID.HTML: return false;
			}
		}
		return true;
	}
	hasInSelectScope(tagName) {
		for (let i = this.stackTop; i >= 0; i--) {
			if (this.treeAdapter.getNamespaceURI(this.items[i]) !== NS$1.HTML) continue;
			switch (this.tagIDs[i]) {
				case tagName: return true;
				case TAG_ID.OPTION:
				case TAG_ID.OPTGROUP: break;
				default: return false;
			}
		}
		return true;
	}
	generateImpliedEndTags() {
		while (this.currentTagId !== void 0 && IMPLICIT_END_TAG_REQUIRED.has(this.currentTagId)) this.pop();
	}
	generateImpliedEndTagsThoroughly() {
		while (this.currentTagId !== void 0 && IMPLICIT_END_TAG_REQUIRED_THOROUGHLY.has(this.currentTagId)) this.pop();
	}
	generateImpliedEndTagsWithExclusion(exclusionId) {
		while (this.currentTagId !== void 0 && this.currentTagId !== exclusionId && IMPLICIT_END_TAG_REQUIRED_THOROUGHLY.has(this.currentTagId)) this.pop();
	}
};

//#endregion
//#region node_modules/hast-util-raw/node_modules/parse5/dist/parser/formatting-element-list.js
const NOAH_ARK_CAPACITY = 3;
var EntryType;
(function(EntryType$1) {
	EntryType$1[EntryType$1["Marker"] = 0] = "Marker";
	EntryType$1[EntryType$1["Element"] = 1] = "Element";
})(EntryType || (EntryType = {}));
const MARKER = { type: EntryType.Marker };
var FormattingElementList = class {
	constructor(treeAdapter) {
		this.treeAdapter = treeAdapter;
		this.entries = [];
		this.bookmark = null;
	}
	_getNoahArkConditionCandidates(newElement, neAttrs) {
		const candidates = [];
		const neAttrsLength = neAttrs.length;
		const neTagName = this.treeAdapter.getTagName(newElement);
		const neNamespaceURI = this.treeAdapter.getNamespaceURI(newElement);
		for (let i = 0; i < this.entries.length; i++) {
			const entry = this.entries[i];
			if (entry.type === EntryType.Marker) break;
			const { element: element$5 } = entry;
			if (this.treeAdapter.getTagName(element$5) === neTagName && this.treeAdapter.getNamespaceURI(element$5) === neNamespaceURI) {
				const elementAttrs = this.treeAdapter.getAttrList(element$5);
				if (elementAttrs.length === neAttrsLength) candidates.push({
					idx: i,
					attrs: elementAttrs
				});
			}
		}
		return candidates;
	}
	_ensureNoahArkCondition(newElement) {
		if (this.entries.length < NOAH_ARK_CAPACITY) return;
		const neAttrs = this.treeAdapter.getAttrList(newElement);
		const candidates = this._getNoahArkConditionCandidates(newElement, neAttrs);
		if (candidates.length < NOAH_ARK_CAPACITY) return;
		const neAttrsMap = new Map(neAttrs.map((neAttr) => [neAttr.name, neAttr.value]));
		let validCandidates = 0;
		for (let i = 0; i < candidates.length; i++) {
			const candidate = candidates[i];
			if (candidate.attrs.every((cAttr) => neAttrsMap.get(cAttr.name) === cAttr.value)) {
				validCandidates += 1;
				if (validCandidates >= NOAH_ARK_CAPACITY) this.entries.splice(candidate.idx, 1);
			}
		}
	}
	insertMarker() {
		this.entries.unshift(MARKER);
	}
	pushElement(element$5, token) {
		this._ensureNoahArkCondition(element$5);
		this.entries.unshift({
			type: EntryType.Element,
			element: element$5,
			token
		});
	}
	insertElementAfterBookmark(element$5, token) {
		const bookmarkIdx = this.entries.indexOf(this.bookmark);
		this.entries.splice(bookmarkIdx, 0, {
			type: EntryType.Element,
			element: element$5,
			token
		});
	}
	removeEntry(entry) {
		const entryIndex = this.entries.indexOf(entry);
		if (entryIndex !== -1) this.entries.splice(entryIndex, 1);
	}
	/**
	* Clears the list of formatting elements up to the last marker.
	*
	* @see https://html.spec.whatwg.org/multipage/parsing.html#clear-the-list-of-active-formatting-elements-up-to-the-last-marker
	*/
	clearToLastMarker() {
		const markerIdx = this.entries.indexOf(MARKER);
		if (markerIdx === -1) this.entries.length = 0;
		else this.entries.splice(0, markerIdx + 1);
	}
	getElementEntryInScopeWithTagName(tagName) {
		const entry = this.entries.find((entry$1) => entry$1.type === EntryType.Marker || this.treeAdapter.getTagName(entry$1.element) === tagName);
		return entry && entry.type === EntryType.Element ? entry : null;
	}
	getElementEntry(element$5) {
		return this.entries.find((entry) => entry.type === EntryType.Element && entry.element === element$5);
	}
};

//#endregion
//#region node_modules/hast-util-raw/node_modules/parse5/dist/tree-adapters/default.js
const defaultTreeAdapter = {
	createDocument() {
		return {
			nodeName: "#document",
			mode: DOCUMENT_MODE.NO_QUIRKS,
			childNodes: []
		};
	},
	createDocumentFragment() {
		return {
			nodeName: "#document-fragment",
			childNodes: []
		};
	},
	createElement(tagName, namespaceURI, attrs) {
		return {
			nodeName: tagName,
			tagName,
			attrs,
			namespaceURI,
			childNodes: [],
			parentNode: null
		};
	},
	createCommentNode(data) {
		return {
			nodeName: "#comment",
			data,
			parentNode: null
		};
	},
	createTextNode(value) {
		return {
			nodeName: "#text",
			value,
			parentNode: null
		};
	},
	appendChild(parentNode, newNode) {
		parentNode.childNodes.push(newNode);
		newNode.parentNode = parentNode;
	},
	insertBefore(parentNode, newNode, referenceNode) {
		const insertionIdx = parentNode.childNodes.indexOf(referenceNode);
		parentNode.childNodes.splice(insertionIdx, 0, newNode);
		newNode.parentNode = parentNode;
	},
	setTemplateContent(templateElement, contentElement) {
		templateElement.content = contentElement;
	},
	getTemplateContent(templateElement) {
		return templateElement.content;
	},
	setDocumentType(document$3, name$1, publicId, systemId) {
		const doctypeNode = document$3.childNodes.find((node$1) => node$1.nodeName === "#documentType");
		if (doctypeNode) {
			doctypeNode.name = name$1;
			doctypeNode.publicId = publicId;
			doctypeNode.systemId = systemId;
		} else {
			const node$1 = {
				nodeName: "#documentType",
				name: name$1,
				publicId,
				systemId,
				parentNode: null
			};
			defaultTreeAdapter.appendChild(document$3, node$1);
		}
	},
	setDocumentMode(document$3, mode) {
		document$3.mode = mode;
	},
	getDocumentMode(document$3) {
		return document$3.mode;
	},
	detachNode(node$1) {
		if (node$1.parentNode) {
			const idx = node$1.parentNode.childNodes.indexOf(node$1);
			node$1.parentNode.childNodes.splice(idx, 1);
			node$1.parentNode = null;
		}
	},
	insertText(parentNode, text$9) {
		if (parentNode.childNodes.length > 0) {
			const prevNode = parentNode.childNodes[parentNode.childNodes.length - 1];
			if (defaultTreeAdapter.isTextNode(prevNode)) {
				prevNode.value += text$9;
				return;
			}
		}
		defaultTreeAdapter.appendChild(parentNode, defaultTreeAdapter.createTextNode(text$9));
	},
	insertTextBefore(parentNode, text$9, referenceNode) {
		const prevNode = parentNode.childNodes[parentNode.childNodes.indexOf(referenceNode) - 1];
		if (prevNode && defaultTreeAdapter.isTextNode(prevNode)) prevNode.value += text$9;
		else defaultTreeAdapter.insertBefore(parentNode, defaultTreeAdapter.createTextNode(text$9), referenceNode);
	},
	adoptAttributes(recipient, attrs) {
		const recipientAttrsMap = new Set(recipient.attrs.map((attr) => attr.name));
		for (let j = 0; j < attrs.length; j++) if (!recipientAttrsMap.has(attrs[j].name)) recipient.attrs.push(attrs[j]);
	},
	getFirstChild(node$1) {
		return node$1.childNodes[0];
	},
	getChildNodes(node$1) {
		return node$1.childNodes;
	},
	getParentNode(node$1) {
		return node$1.parentNode;
	},
	getAttrList(element$5) {
		return element$5.attrs;
	},
	getTagName(element$5) {
		return element$5.tagName;
	},
	getNamespaceURI(element$5) {
		return element$5.namespaceURI;
	},
	getTextNodeContent(textNode) {
		return textNode.value;
	},
	getCommentNodeContent(commentNode) {
		return commentNode.data;
	},
	getDocumentTypeNodeName(doctypeNode) {
		return doctypeNode.name;
	},
	getDocumentTypeNodePublicId(doctypeNode) {
		return doctypeNode.publicId;
	},
	getDocumentTypeNodeSystemId(doctypeNode) {
		return doctypeNode.systemId;
	},
	isTextNode(node$1) {
		return node$1.nodeName === "#text";
	},
	isCommentNode(node$1) {
		return node$1.nodeName === "#comment";
	},
	isDocumentTypeNode(node$1) {
		return node$1.nodeName === "#documentType";
	},
	isElementNode(node$1) {
		return Object.prototype.hasOwnProperty.call(node$1, "tagName");
	},
	setNodeSourceCodeLocation(node$1, location$1) {
		node$1.sourceCodeLocation = location$1;
	},
	getNodeSourceCodeLocation(node$1) {
		return node$1.sourceCodeLocation;
	},
	updateNodeSourceCodeLocation(node$1, endLocation) {
		node$1.sourceCodeLocation = {
			...node$1.sourceCodeLocation,
			...endLocation
		};
	}
};

//#endregion
//#region node_modules/hast-util-raw/node_modules/parse5/dist/common/doctype.js
const VALID_DOCTYPE_NAME = "html";
const VALID_SYSTEM_ID = "about:legacy-compat";
const QUIRKS_MODE_SYSTEM_ID = "http://www.ibm.com/data/dtd/v11/ibmxhtml1-transitional.dtd";
const QUIRKS_MODE_PUBLIC_ID_PREFIXES = [
	"+//silmaril//dtd html pro v0r11 19970101//",
	"-//as//dtd html 3.0 aswedit + extensions//",
	"-//advasoft ltd//dtd html 3.0 aswedit + extensions//",
	"-//ietf//dtd html 2.0 level 1//",
	"-//ietf//dtd html 2.0 level 2//",
	"-//ietf//dtd html 2.0 strict level 1//",
	"-//ietf//dtd html 2.0 strict level 2//",
	"-//ietf//dtd html 2.0 strict//",
	"-//ietf//dtd html 2.0//",
	"-//ietf//dtd html 2.1e//",
	"-//ietf//dtd html 3.0//",
	"-//ietf//dtd html 3.2 final//",
	"-//ietf//dtd html 3.2//",
	"-//ietf//dtd html 3//",
	"-//ietf//dtd html level 0//",
	"-//ietf//dtd html level 1//",
	"-//ietf//dtd html level 2//",
	"-//ietf//dtd html level 3//",
	"-//ietf//dtd html strict level 0//",
	"-//ietf//dtd html strict level 1//",
	"-//ietf//dtd html strict level 2//",
	"-//ietf//dtd html strict level 3//",
	"-//ietf//dtd html strict//",
	"-//ietf//dtd html//",
	"-//metrius//dtd metrius presentational//",
	"-//microsoft//dtd internet explorer 2.0 html strict//",
	"-//microsoft//dtd internet explorer 2.0 html//",
	"-//microsoft//dtd internet explorer 2.0 tables//",
	"-//microsoft//dtd internet explorer 3.0 html strict//",
	"-//microsoft//dtd internet explorer 3.0 html//",
	"-//microsoft//dtd internet explorer 3.0 tables//",
	"-//netscape comm. corp.//dtd html//",
	"-//netscape comm. corp.//dtd strict html//",
	"-//o'reilly and associates//dtd html 2.0//",
	"-//o'reilly and associates//dtd html extended 1.0//",
	"-//o'reilly and associates//dtd html extended relaxed 1.0//",
	"-//sq//dtd html 2.0 hotmetal + extensions//",
	"-//softquad software//dtd hotmetal pro 6.0::19990601::extensions to html 4.0//",
	"-//softquad//dtd hotmetal pro 4.0::19971010::extensions to html 4.0//",
	"-//spyglass//dtd html 2.0 extended//",
	"-//sun microsystems corp.//dtd hotjava html//",
	"-//sun microsystems corp.//dtd hotjava strict html//",
	"-//w3c//dtd html 3 1995-03-24//",
	"-//w3c//dtd html 3.2 draft//",
	"-//w3c//dtd html 3.2 final//",
	"-//w3c//dtd html 3.2//",
	"-//w3c//dtd html 3.2s draft//",
	"-//w3c//dtd html 4.0 frameset//",
	"-//w3c//dtd html 4.0 transitional//",
	"-//w3c//dtd html experimental 19960712//",
	"-//w3c//dtd html experimental 970421//",
	"-//w3c//dtd w3 html//",
	"-//w3o//dtd w3 html 3.0//",
	"-//webtechs//dtd mozilla html 2.0//",
	"-//webtechs//dtd mozilla html//"
];
const QUIRKS_MODE_NO_SYSTEM_ID_PUBLIC_ID_PREFIXES = [
	...QUIRKS_MODE_PUBLIC_ID_PREFIXES,
	"-//w3c//dtd html 4.01 frameset//",
	"-//w3c//dtd html 4.01 transitional//"
];
const QUIRKS_MODE_PUBLIC_IDS = new Set([
	"-//w3o//dtd w3 html strict 3.0//en//",
	"-/w3c/dtd html 4.0 transitional/en",
	"html"
]);
const LIMITED_QUIRKS_PUBLIC_ID_PREFIXES = ["-//w3c//dtd xhtml 1.0 frameset//", "-//w3c//dtd xhtml 1.0 transitional//"];
const LIMITED_QUIRKS_WITH_SYSTEM_ID_PUBLIC_ID_PREFIXES = [
	...LIMITED_QUIRKS_PUBLIC_ID_PREFIXES,
	"-//w3c//dtd html 4.01 frameset//",
	"-//w3c//dtd html 4.01 transitional//"
];
function hasPrefix(publicId, prefixes) {
	return prefixes.some((prefix) => publicId.startsWith(prefix));
}
function isConforming(token) {
	return token.name === VALID_DOCTYPE_NAME && token.publicId === null && (token.systemId === null || token.systemId === VALID_SYSTEM_ID);
}
function getDocumentMode(token) {
	if (token.name !== VALID_DOCTYPE_NAME) return DOCUMENT_MODE.QUIRKS;
	const { systemId } = token;
	if (systemId && systemId.toLowerCase() === QUIRKS_MODE_SYSTEM_ID) return DOCUMENT_MODE.QUIRKS;
	let { publicId } = token;
	if (publicId !== null) {
		publicId = publicId.toLowerCase();
		if (QUIRKS_MODE_PUBLIC_IDS.has(publicId)) return DOCUMENT_MODE.QUIRKS;
		let prefixes = systemId === null ? QUIRKS_MODE_NO_SYSTEM_ID_PUBLIC_ID_PREFIXES : QUIRKS_MODE_PUBLIC_ID_PREFIXES;
		if (hasPrefix(publicId, prefixes)) return DOCUMENT_MODE.QUIRKS;
		prefixes = systemId === null ? LIMITED_QUIRKS_PUBLIC_ID_PREFIXES : LIMITED_QUIRKS_WITH_SYSTEM_ID_PUBLIC_ID_PREFIXES;
		if (hasPrefix(publicId, prefixes)) return DOCUMENT_MODE.LIMITED_QUIRKS;
	}
	return DOCUMENT_MODE.NO_QUIRKS;
}

//#endregion
//#region node_modules/hast-util-raw/node_modules/parse5/dist/common/foreign-content.js
const MIME_TYPES = {
	TEXT_HTML: "text/html",
	APPLICATION_XML: "application/xhtml+xml"
};
const DEFINITION_URL_ATTR = "definitionurl";
const ADJUSTED_DEFINITION_URL_ATTR = "definitionURL";
const SVG_ATTRS_ADJUSTMENT_MAP = new Map([
	"attributeName",
	"attributeType",
	"baseFrequency",
	"baseProfile",
	"calcMode",
	"clipPathUnits",
	"diffuseConstant",
	"edgeMode",
	"filterUnits",
	"glyphRef",
	"gradientTransform",
	"gradientUnits",
	"kernelMatrix",
	"kernelUnitLength",
	"keyPoints",
	"keySplines",
	"keyTimes",
	"lengthAdjust",
	"limitingConeAngle",
	"markerHeight",
	"markerUnits",
	"markerWidth",
	"maskContentUnits",
	"maskUnits",
	"numOctaves",
	"pathLength",
	"patternContentUnits",
	"patternTransform",
	"patternUnits",
	"pointsAtX",
	"pointsAtY",
	"pointsAtZ",
	"preserveAlpha",
	"preserveAspectRatio",
	"primitiveUnits",
	"refX",
	"refY",
	"repeatCount",
	"repeatDur",
	"requiredExtensions",
	"requiredFeatures",
	"specularConstant",
	"specularExponent",
	"spreadMethod",
	"startOffset",
	"stdDeviation",
	"stitchTiles",
	"surfaceScale",
	"systemLanguage",
	"tableValues",
	"targetX",
	"targetY",
	"textLength",
	"viewBox",
	"viewTarget",
	"xChannelSelector",
	"yChannelSelector",
	"zoomAndPan"
].map((attr) => [attr.toLowerCase(), attr]));
const XML_ATTRS_ADJUSTMENT_MAP = new Map([
	["xlink:actuate", {
		prefix: "xlink",
		name: "actuate",
		namespace: NS$1.XLINK
	}],
	["xlink:arcrole", {
		prefix: "xlink",
		name: "arcrole",
		namespace: NS$1.XLINK
	}],
	["xlink:href", {
		prefix: "xlink",
		name: "href",
		namespace: NS$1.XLINK
	}],
	["xlink:role", {
		prefix: "xlink",
		name: "role",
		namespace: NS$1.XLINK
	}],
	["xlink:show", {
		prefix: "xlink",
		name: "show",
		namespace: NS$1.XLINK
	}],
	["xlink:title", {
		prefix: "xlink",
		name: "title",
		namespace: NS$1.XLINK
	}],
	["xlink:type", {
		prefix: "xlink",
		name: "type",
		namespace: NS$1.XLINK
	}],
	["xml:lang", {
		prefix: "xml",
		name: "lang",
		namespace: NS$1.XML
	}],
	["xml:space", {
		prefix: "xml",
		name: "space",
		namespace: NS$1.XML
	}],
	["xmlns", {
		prefix: "",
		name: "xmlns",
		namespace: NS$1.XMLNS
	}],
	["xmlns:xlink", {
		prefix: "xmlns",
		name: "xlink",
		namespace: NS$1.XMLNS
	}]
]);
const SVG_TAG_NAMES_ADJUSTMENT_MAP = new Map([
	"altGlyph",
	"altGlyphDef",
	"altGlyphItem",
	"animateColor",
	"animateMotion",
	"animateTransform",
	"clipPath",
	"feBlend",
	"feColorMatrix",
	"feComponentTransfer",
	"feComposite",
	"feConvolveMatrix",
	"feDiffuseLighting",
	"feDisplacementMap",
	"feDistantLight",
	"feFlood",
	"feFuncA",
	"feFuncB",
	"feFuncG",
	"feFuncR",
	"feGaussianBlur",
	"feImage",
	"feMerge",
	"feMergeNode",
	"feMorphology",
	"feOffset",
	"fePointLight",
	"feSpecularLighting",
	"feSpotLight",
	"feTile",
	"feTurbulence",
	"foreignObject",
	"glyphRef",
	"linearGradient",
	"radialGradient",
	"textPath"
].map((tn) => [tn.toLowerCase(), tn]));
const EXITS_FOREIGN_CONTENT = new Set([
	TAG_ID.B,
	TAG_ID.BIG,
	TAG_ID.BLOCKQUOTE,
	TAG_ID.BODY,
	TAG_ID.BR,
	TAG_ID.CENTER,
	TAG_ID.CODE,
	TAG_ID.DD,
	TAG_ID.DIV,
	TAG_ID.DL,
	TAG_ID.DT,
	TAG_ID.EM,
	TAG_ID.EMBED,
	TAG_ID.H1,
	TAG_ID.H2,
	TAG_ID.H3,
	TAG_ID.H4,
	TAG_ID.H5,
	TAG_ID.H6,
	TAG_ID.HEAD,
	TAG_ID.HR,
	TAG_ID.I,
	TAG_ID.IMG,
	TAG_ID.LI,
	TAG_ID.LISTING,
	TAG_ID.MENU,
	TAG_ID.META,
	TAG_ID.NOBR,
	TAG_ID.OL,
	TAG_ID.P,
	TAG_ID.PRE,
	TAG_ID.RUBY,
	TAG_ID.S,
	TAG_ID.SMALL,
	TAG_ID.SPAN,
	TAG_ID.STRONG,
	TAG_ID.STRIKE,
	TAG_ID.SUB,
	TAG_ID.SUP,
	TAG_ID.TABLE,
	TAG_ID.TT,
	TAG_ID.U,
	TAG_ID.UL,
	TAG_ID.VAR
]);
function causesExit(startTagToken) {
	const tn = startTagToken.tagID;
	return tn === TAG_ID.FONT && startTagToken.attrs.some(({ name: name$1 }) => name$1 === ATTRS.COLOR || name$1 === ATTRS.SIZE || name$1 === ATTRS.FACE) || EXITS_FOREIGN_CONTENT.has(tn);
}
function adjustTokenMathMLAttrs(token) {
	for (let i = 0; i < token.attrs.length; i++) if (token.attrs[i].name === DEFINITION_URL_ATTR) {
		token.attrs[i].name = ADJUSTED_DEFINITION_URL_ATTR;
		break;
	}
}
function adjustTokenSVGAttrs(token) {
	for (let i = 0; i < token.attrs.length; i++) {
		const adjustedAttrName = SVG_ATTRS_ADJUSTMENT_MAP.get(token.attrs[i].name);
		if (adjustedAttrName != null) token.attrs[i].name = adjustedAttrName;
	}
}
function adjustTokenXMLAttrs(token) {
	for (let i = 0; i < token.attrs.length; i++) {
		const adjustedAttrEntry = XML_ATTRS_ADJUSTMENT_MAP.get(token.attrs[i].name);
		if (adjustedAttrEntry) {
			token.attrs[i].prefix = adjustedAttrEntry.prefix;
			token.attrs[i].name = adjustedAttrEntry.name;
			token.attrs[i].namespace = adjustedAttrEntry.namespace;
		}
	}
}
function adjustTokenSVGTagName(token) {
	const adjustedTagName = SVG_TAG_NAMES_ADJUSTMENT_MAP.get(token.tagName);
	if (adjustedTagName != null) {
		token.tagName = adjustedTagName;
		token.tagID = getTagID(token.tagName);
	}
}
function isMathMLTextIntegrationPoint(tn, ns) {
	return ns === NS$1.MATHML && (tn === TAG_ID.MI || tn === TAG_ID.MO || tn === TAG_ID.MN || tn === TAG_ID.MS || tn === TAG_ID.MTEXT);
}
function isHtmlIntegrationPoint(tn, ns, attrs) {
	if (ns === NS$1.MATHML && tn === TAG_ID.ANNOTATION_XML) {
		for (let i = 0; i < attrs.length; i++) if (attrs[i].name === ATTRS.ENCODING) {
			const value = attrs[i].value.toLowerCase();
			return value === MIME_TYPES.TEXT_HTML || value === MIME_TYPES.APPLICATION_XML;
		}
	}
	return ns === NS$1.SVG && (tn === TAG_ID.FOREIGN_OBJECT || tn === TAG_ID.DESC || tn === TAG_ID.TITLE);
}
function isIntegrationPoint(tn, ns, attrs, foreignNS) {
	return (!foreignNS || foreignNS === NS$1.HTML) && isHtmlIntegrationPoint(tn, ns, attrs) || (!foreignNS || foreignNS === NS$1.MATHML) && isMathMLTextIntegrationPoint(tn, ns);
}

//#endregion
//#region node_modules/hast-util-raw/node_modules/parse5/dist/parser/index.js
const HIDDEN_INPUT_TYPE = "hidden";
const AA_OUTER_LOOP_ITER = 8;
const AA_INNER_LOOP_ITER = 3;
var InsertionMode;
(function(InsertionMode$1) {
	InsertionMode$1[InsertionMode$1["INITIAL"] = 0] = "INITIAL";
	InsertionMode$1[InsertionMode$1["BEFORE_HTML"] = 1] = "BEFORE_HTML";
	InsertionMode$1[InsertionMode$1["BEFORE_HEAD"] = 2] = "BEFORE_HEAD";
	InsertionMode$1[InsertionMode$1["IN_HEAD"] = 3] = "IN_HEAD";
	InsertionMode$1[InsertionMode$1["IN_HEAD_NO_SCRIPT"] = 4] = "IN_HEAD_NO_SCRIPT";
	InsertionMode$1[InsertionMode$1["AFTER_HEAD"] = 5] = "AFTER_HEAD";
	InsertionMode$1[InsertionMode$1["IN_BODY"] = 6] = "IN_BODY";
	InsertionMode$1[InsertionMode$1["TEXT"] = 7] = "TEXT";
	InsertionMode$1[InsertionMode$1["IN_TABLE"] = 8] = "IN_TABLE";
	InsertionMode$1[InsertionMode$1["IN_TABLE_TEXT"] = 9] = "IN_TABLE_TEXT";
	InsertionMode$1[InsertionMode$1["IN_CAPTION"] = 10] = "IN_CAPTION";
	InsertionMode$1[InsertionMode$1["IN_COLUMN_GROUP"] = 11] = "IN_COLUMN_GROUP";
	InsertionMode$1[InsertionMode$1["IN_TABLE_BODY"] = 12] = "IN_TABLE_BODY";
	InsertionMode$1[InsertionMode$1["IN_ROW"] = 13] = "IN_ROW";
	InsertionMode$1[InsertionMode$1["IN_CELL"] = 14] = "IN_CELL";
	InsertionMode$1[InsertionMode$1["IN_SELECT"] = 15] = "IN_SELECT";
	InsertionMode$1[InsertionMode$1["IN_SELECT_IN_TABLE"] = 16] = "IN_SELECT_IN_TABLE";
	InsertionMode$1[InsertionMode$1["IN_TEMPLATE"] = 17] = "IN_TEMPLATE";
	InsertionMode$1[InsertionMode$1["AFTER_BODY"] = 18] = "AFTER_BODY";
	InsertionMode$1[InsertionMode$1["IN_FRAMESET"] = 19] = "IN_FRAMESET";
	InsertionMode$1[InsertionMode$1["AFTER_FRAMESET"] = 20] = "AFTER_FRAMESET";
	InsertionMode$1[InsertionMode$1["AFTER_AFTER_BODY"] = 21] = "AFTER_AFTER_BODY";
	InsertionMode$1[InsertionMode$1["AFTER_AFTER_FRAMESET"] = 22] = "AFTER_AFTER_FRAMESET";
})(InsertionMode || (InsertionMode = {}));
const BASE_LOC = {
	startLine: -1,
	startCol: -1,
	startOffset: -1,
	endLine: -1,
	endCol: -1,
	endOffset: -1
};
const TABLE_STRUCTURE_TAGS = new Set([
	TAG_ID.TABLE,
	TAG_ID.TBODY,
	TAG_ID.TFOOT,
	TAG_ID.THEAD,
	TAG_ID.TR
]);
const defaultParserOptions = {
	scriptingEnabled: true,
	sourceCodeLocationInfo: false,
	treeAdapter: defaultTreeAdapter,
	onParseError: null
};
var Parser = class {
	constructor(options, document$3, fragmentContext = null, scriptHandler = null) {
		this.fragmentContext = fragmentContext;
		this.scriptHandler = scriptHandler;
		this.currentToken = null;
		this.stopped = false;
		/** @internal */
		this.insertionMode = InsertionMode.INITIAL;
		/** @internal */
		this.originalInsertionMode = InsertionMode.INITIAL;
		/** @internal */
		this.headElement = null;
		/** @internal */
		this.formElement = null;
		/** Indicates that the current node is not an element in the HTML namespace */
		this.currentNotInHTML = false;
		/**
		* The template insertion mode stack is maintained from the left.
		* Ie. the topmost element will always have index 0.
		*
		* @internal
		*/
		this.tmplInsertionModeStack = [];
		/** @internal */
		this.pendingCharacterTokens = [];
		/** @internal */
		this.hasNonWhitespacePendingCharacterToken = false;
		/** @internal */
		this.framesetOk = true;
		/** @internal */
		this.skipNextNewLine = false;
		/** @internal */
		this.fosterParentingEnabled = false;
		this.options = {
			...defaultParserOptions,
			...options
		};
		this.treeAdapter = this.options.treeAdapter;
		this.onParseError = this.options.onParseError;
		if (this.onParseError) this.options.sourceCodeLocationInfo = true;
		this.document = document$3 !== null && document$3 !== void 0 ? document$3 : this.treeAdapter.createDocument();
		this.tokenizer = new Tokenizer(this.options, this);
		this.activeFormattingElements = new FormattingElementList(this.treeAdapter);
		this.fragmentContextID = fragmentContext ? getTagID(this.treeAdapter.getTagName(fragmentContext)) : TAG_ID.UNKNOWN;
		this._setContextModes(fragmentContext !== null && fragmentContext !== void 0 ? fragmentContext : this.document, this.fragmentContextID);
		this.openElements = new OpenElementStack(this.document, this.treeAdapter, this);
	}
	static parse(html$4, options) {
		const parser = new this(options);
		parser.tokenizer.write(html$4, true);
		return parser.document;
	}
	static getFragmentParser(fragmentContext, options) {
		const opts = {
			...defaultParserOptions,
			...options
		};
		fragmentContext !== null && fragmentContext !== void 0 || (fragmentContext = opts.treeAdapter.createElement(TAG_NAMES.TEMPLATE, NS$1.HTML, []));
		const documentMock = opts.treeAdapter.createElement("documentmock", NS$1.HTML, []);
		const parser = new this(opts, documentMock, fragmentContext);
		if (parser.fragmentContextID === TAG_ID.TEMPLATE) parser.tmplInsertionModeStack.unshift(InsertionMode.IN_TEMPLATE);
		parser._initTokenizerForFragmentParsing();
		parser._insertFakeRootElement();
		parser._resetInsertionMode();
		parser._findFormInFragmentContext();
		return parser;
	}
	getFragment() {
		const rootElement = this.treeAdapter.getFirstChild(this.document);
		const fragment$1 = this.treeAdapter.createDocumentFragment();
		this._adoptNodes(rootElement, fragment$1);
		return fragment$1;
	}
	/** @internal */
	_err(token, code$3, beforeToken) {
		var _a$1;
		if (!this.onParseError) return;
		const loc = (_a$1 = token.location) !== null && _a$1 !== void 0 ? _a$1 : BASE_LOC;
		const err = {
			code: code$3,
			startLine: loc.startLine,
			startCol: loc.startCol,
			startOffset: loc.startOffset,
			endLine: beforeToken ? loc.startLine : loc.endLine,
			endCol: beforeToken ? loc.startCol : loc.endCol,
			endOffset: beforeToken ? loc.startOffset : loc.endOffset
		};
		this.onParseError(err);
	}
	/** @internal */
	onItemPush(node$1, tid, isTop) {
		var _a$1, _b;
		(_b = (_a$1 = this.treeAdapter).onItemPush) === null || _b === void 0 || _b.call(_a$1, node$1);
		if (isTop && this.openElements.stackTop > 0) this._setContextModes(node$1, tid);
	}
	/** @internal */
	onItemPop(node$1, isTop) {
		var _a$1, _b;
		if (this.options.sourceCodeLocationInfo) this._setEndLocation(node$1, this.currentToken);
		(_b = (_a$1 = this.treeAdapter).onItemPop) === null || _b === void 0 || _b.call(_a$1, node$1, this.openElements.current);
		if (isTop) {
			let current;
			let currentTagId;
			if (this.openElements.stackTop === 0 && this.fragmentContext) {
				current = this.fragmentContext;
				currentTagId = this.fragmentContextID;
			} else ({current, currentTagId} = this.openElements);
			this._setContextModes(current, currentTagId);
		}
	}
	_setContextModes(current, tid) {
		const isHTML = current === this.document || current && this.treeAdapter.getNamespaceURI(current) === NS$1.HTML;
		this.currentNotInHTML = !isHTML;
		this.tokenizer.inForeignNode = !isHTML && current !== void 0 && tid !== void 0 && !this._isIntegrationPoint(tid, current);
	}
	/** @protected */
	_switchToTextParsing(currentToken, nextTokenizerState) {
		this._insertElement(currentToken, NS$1.HTML);
		this.tokenizer.state = nextTokenizerState;
		this.originalInsertionMode = this.insertionMode;
		this.insertionMode = InsertionMode.TEXT;
	}
	switchToPlaintextParsing() {
		this.insertionMode = InsertionMode.TEXT;
		this.originalInsertionMode = InsertionMode.IN_BODY;
		this.tokenizer.state = TokenizerMode.PLAINTEXT;
	}
	/** @protected */
	_getAdjustedCurrentElement() {
		return this.openElements.stackTop === 0 && this.fragmentContext ? this.fragmentContext : this.openElements.current;
	}
	/** @protected */
	_findFormInFragmentContext() {
		let node$1 = this.fragmentContext;
		while (node$1) {
			if (this.treeAdapter.getTagName(node$1) === TAG_NAMES.FORM) {
				this.formElement = node$1;
				break;
			}
			node$1 = this.treeAdapter.getParentNode(node$1);
		}
	}
	_initTokenizerForFragmentParsing() {
		if (!this.fragmentContext || this.treeAdapter.getNamespaceURI(this.fragmentContext) !== NS$1.HTML) return;
		switch (this.fragmentContextID) {
			case TAG_ID.TITLE:
			case TAG_ID.TEXTAREA:
				this.tokenizer.state = TokenizerMode.RCDATA;
				break;
			case TAG_ID.STYLE:
			case TAG_ID.XMP:
			case TAG_ID.IFRAME:
			case TAG_ID.NOEMBED:
			case TAG_ID.NOFRAMES:
			case TAG_ID.NOSCRIPT:
				this.tokenizer.state = TokenizerMode.RAWTEXT;
				break;
			case TAG_ID.SCRIPT:
				this.tokenizer.state = TokenizerMode.SCRIPT_DATA;
				break;
			case TAG_ID.PLAINTEXT:
				this.tokenizer.state = TokenizerMode.PLAINTEXT;
				break;
			default:
		}
	}
	/** @protected */
	_setDocumentType(token) {
		const name$1 = token.name || "";
		const publicId = token.publicId || "";
		const systemId = token.systemId || "";
		this.treeAdapter.setDocumentType(this.document, name$1, publicId, systemId);
		if (token.location) {
			const docTypeNode = this.treeAdapter.getChildNodes(this.document).find((node$1) => this.treeAdapter.isDocumentTypeNode(node$1));
			if (docTypeNode) this.treeAdapter.setNodeSourceCodeLocation(docTypeNode, token.location);
		}
	}
	/** @protected */
	_attachElementToTree(element$5, location$1) {
		if (this.options.sourceCodeLocationInfo) {
			const loc = location$1 && {
				...location$1,
				startTag: location$1
			};
			this.treeAdapter.setNodeSourceCodeLocation(element$5, loc);
		}
		if (this._shouldFosterParentOnInsertion()) this._fosterParentElement(element$5);
		else {
			const parent = this.openElements.currentTmplContentOrNode;
			this.treeAdapter.appendChild(parent !== null && parent !== void 0 ? parent : this.document, element$5);
		}
	}
	/**
	* For self-closing tags. Add an element to the tree, but skip adding it
	* to the stack.
	*/
	/** @protected */
	_appendElement(token, namespaceURI) {
		const element$5 = this.treeAdapter.createElement(token.tagName, namespaceURI, token.attrs);
		this._attachElementToTree(element$5, token.location);
	}
	/** @protected */
	_insertElement(token, namespaceURI) {
		const element$5 = this.treeAdapter.createElement(token.tagName, namespaceURI, token.attrs);
		this._attachElementToTree(element$5, token.location);
		this.openElements.push(element$5, token.tagID);
	}
	/** @protected */
	_insertFakeElement(tagName, tagID) {
		const element$5 = this.treeAdapter.createElement(tagName, NS$1.HTML, []);
		this._attachElementToTree(element$5, null);
		this.openElements.push(element$5, tagID);
	}
	/** @protected */
	_insertTemplate(token) {
		const tmpl = this.treeAdapter.createElement(token.tagName, NS$1.HTML, token.attrs);
		const content$2 = this.treeAdapter.createDocumentFragment();
		this.treeAdapter.setTemplateContent(tmpl, content$2);
		this._attachElementToTree(tmpl, token.location);
		this.openElements.push(tmpl, token.tagID);
		if (this.options.sourceCodeLocationInfo) this.treeAdapter.setNodeSourceCodeLocation(content$2, null);
	}
	/** @protected */
	_insertFakeRootElement() {
		const element$5 = this.treeAdapter.createElement(TAG_NAMES.HTML, NS$1.HTML, []);
		if (this.options.sourceCodeLocationInfo) this.treeAdapter.setNodeSourceCodeLocation(element$5, null);
		this.treeAdapter.appendChild(this.openElements.current, element$5);
		this.openElements.push(element$5, TAG_ID.HTML);
	}
	/** @protected */
	_appendCommentNode(token, parent) {
		const commentNode = this.treeAdapter.createCommentNode(token.data);
		this.treeAdapter.appendChild(parent, commentNode);
		if (this.options.sourceCodeLocationInfo) this.treeAdapter.setNodeSourceCodeLocation(commentNode, token.location);
	}
	/** @protected */
	_insertCharacters(token) {
		let parent;
		let beforeElement;
		if (this._shouldFosterParentOnInsertion()) {
			({parent, beforeElement} = this._findFosterParentingLocation());
			if (beforeElement) this.treeAdapter.insertTextBefore(parent, token.chars, beforeElement);
			else this.treeAdapter.insertText(parent, token.chars);
		} else {
			parent = this.openElements.currentTmplContentOrNode;
			this.treeAdapter.insertText(parent, token.chars);
		}
		if (!token.location) return;
		const siblings = this.treeAdapter.getChildNodes(parent);
		const textNode = siblings[(beforeElement ? siblings.lastIndexOf(beforeElement) : siblings.length) - 1];
		if (this.treeAdapter.getNodeSourceCodeLocation(textNode)) {
			const { endLine, endCol, endOffset } = token.location;
			this.treeAdapter.updateNodeSourceCodeLocation(textNode, {
				endLine,
				endCol,
				endOffset
			});
		} else if (this.options.sourceCodeLocationInfo) this.treeAdapter.setNodeSourceCodeLocation(textNode, token.location);
	}
	/** @protected */
	_adoptNodes(donor, recipient) {
		for (let child = this.treeAdapter.getFirstChild(donor); child; child = this.treeAdapter.getFirstChild(donor)) {
			this.treeAdapter.detachNode(child);
			this.treeAdapter.appendChild(recipient, child);
		}
	}
	/** @protected */
	_setEndLocation(element$5, closingToken) {
		if (this.treeAdapter.getNodeSourceCodeLocation(element$5) && closingToken.location) {
			const ctLoc = closingToken.location;
			const tn = this.treeAdapter.getTagName(element$5);
			const endLoc = closingToken.type === TokenType.END_TAG && tn === closingToken.tagName ? {
				endTag: { ...ctLoc },
				endLine: ctLoc.endLine,
				endCol: ctLoc.endCol,
				endOffset: ctLoc.endOffset
			} : {
				endLine: ctLoc.startLine,
				endCol: ctLoc.startCol,
				endOffset: ctLoc.startOffset
			};
			this.treeAdapter.updateNodeSourceCodeLocation(element$5, endLoc);
		}
	}
	shouldProcessStartTagTokenInForeignContent(token) {
		if (!this.currentNotInHTML) return false;
		let current;
		let currentTagId;
		if (this.openElements.stackTop === 0 && this.fragmentContext) {
			current = this.fragmentContext;
			currentTagId = this.fragmentContextID;
		} else ({current, currentTagId} = this.openElements);
		if (token.tagID === TAG_ID.SVG && this.treeAdapter.getTagName(current) === TAG_NAMES.ANNOTATION_XML && this.treeAdapter.getNamespaceURI(current) === NS$1.MATHML) return false;
		return this.tokenizer.inForeignNode || (token.tagID === TAG_ID.MGLYPH || token.tagID === TAG_ID.MALIGNMARK) && currentTagId !== void 0 && !this._isIntegrationPoint(currentTagId, current, NS$1.HTML);
	}
	/** @protected */
	_processToken(token) {
		switch (token.type) {
			case TokenType.CHARACTER:
				this.onCharacter(token);
				break;
			case TokenType.NULL_CHARACTER:
				this.onNullCharacter(token);
				break;
			case TokenType.COMMENT:
				this.onComment(token);
				break;
			case TokenType.DOCTYPE:
				this.onDoctype(token);
				break;
			case TokenType.START_TAG:
				this._processStartTag(token);
				break;
			case TokenType.END_TAG:
				this.onEndTag(token);
				break;
			case TokenType.EOF:
				this.onEof(token);
				break;
			case TokenType.WHITESPACE_CHARACTER:
				this.onWhitespaceCharacter(token);
				break;
		}
	}
	/** @protected */
	_isIntegrationPoint(tid, element$5, foreignNS) {
		const ns = this.treeAdapter.getNamespaceURI(element$5);
		const attrs = this.treeAdapter.getAttrList(element$5);
		return isIntegrationPoint(tid, ns, attrs, foreignNS);
	}
	/** @protected */
	_reconstructActiveFormattingElements() {
		const listLength = this.activeFormattingElements.entries.length;
		if (listLength) {
			const endIndex = this.activeFormattingElements.entries.findIndex((entry) => entry.type === EntryType.Marker || this.openElements.contains(entry.element));
			const unopenIdx = endIndex === -1 ? listLength - 1 : endIndex - 1;
			for (let i = unopenIdx; i >= 0; i--) {
				const entry = this.activeFormattingElements.entries[i];
				this._insertElement(entry.token, this.treeAdapter.getNamespaceURI(entry.element));
				entry.element = this.openElements.current;
			}
		}
	}
	/** @protected */
	_closeTableCell() {
		this.openElements.generateImpliedEndTags();
		this.openElements.popUntilTableCellPopped();
		this.activeFormattingElements.clearToLastMarker();
		this.insertionMode = InsertionMode.IN_ROW;
	}
	/** @protected */
	_closePElement() {
		this.openElements.generateImpliedEndTagsWithExclusion(TAG_ID.P);
		this.openElements.popUntilTagNamePopped(TAG_ID.P);
	}
	/** @protected */
	_resetInsertionMode() {
		for (let i = this.openElements.stackTop; i >= 0; i--) switch (i === 0 && this.fragmentContext ? this.fragmentContextID : this.openElements.tagIDs[i]) {
			case TAG_ID.TR:
				this.insertionMode = InsertionMode.IN_ROW;
				return;
			case TAG_ID.TBODY:
			case TAG_ID.THEAD:
			case TAG_ID.TFOOT:
				this.insertionMode = InsertionMode.IN_TABLE_BODY;
				return;
			case TAG_ID.CAPTION:
				this.insertionMode = InsertionMode.IN_CAPTION;
				return;
			case TAG_ID.COLGROUP:
				this.insertionMode = InsertionMode.IN_COLUMN_GROUP;
				return;
			case TAG_ID.TABLE:
				this.insertionMode = InsertionMode.IN_TABLE;
				return;
			case TAG_ID.BODY:
				this.insertionMode = InsertionMode.IN_BODY;
				return;
			case TAG_ID.FRAMESET:
				this.insertionMode = InsertionMode.IN_FRAMESET;
				return;
			case TAG_ID.SELECT:
				this._resetInsertionModeForSelect(i);
				return;
			case TAG_ID.TEMPLATE:
				this.insertionMode = this.tmplInsertionModeStack[0];
				return;
			case TAG_ID.HTML:
				this.insertionMode = this.headElement ? InsertionMode.AFTER_HEAD : InsertionMode.BEFORE_HEAD;
				return;
			case TAG_ID.TD:
			case TAG_ID.TH:
				if (i > 0) {
					this.insertionMode = InsertionMode.IN_CELL;
					return;
				}
				break;
			case TAG_ID.HEAD:
				if (i > 0) {
					this.insertionMode = InsertionMode.IN_HEAD;
					return;
				}
				break;
		}
		this.insertionMode = InsertionMode.IN_BODY;
	}
	/** @protected */
	_resetInsertionModeForSelect(selectIdx) {
		if (selectIdx > 0) for (let i = selectIdx - 1; i > 0; i--) {
			const tn = this.openElements.tagIDs[i];
			if (tn === TAG_ID.TEMPLATE) break;
			else if (tn === TAG_ID.TABLE) {
				this.insertionMode = InsertionMode.IN_SELECT_IN_TABLE;
				return;
			}
		}
		this.insertionMode = InsertionMode.IN_SELECT;
	}
	/** @protected */
	_isElementCausesFosterParenting(tn) {
		return TABLE_STRUCTURE_TAGS.has(tn);
	}
	/** @protected */
	_shouldFosterParentOnInsertion() {
		return this.fosterParentingEnabled && this.openElements.currentTagId !== void 0 && this._isElementCausesFosterParenting(this.openElements.currentTagId);
	}
	/** @protected */
	_findFosterParentingLocation() {
		for (let i = this.openElements.stackTop; i >= 0; i--) {
			const openElement = this.openElements.items[i];
			switch (this.openElements.tagIDs[i]) {
				case TAG_ID.TEMPLATE:
					if (this.treeAdapter.getNamespaceURI(openElement) === NS$1.HTML) return {
						parent: this.treeAdapter.getTemplateContent(openElement),
						beforeElement: null
					};
					break;
				case TAG_ID.TABLE: {
					const parent = this.treeAdapter.getParentNode(openElement);
					if (parent) return {
						parent,
						beforeElement: openElement
					};
					return {
						parent: this.openElements.items[i - 1],
						beforeElement: null
					};
				}
				default:
			}
		}
		return {
			parent: this.openElements.items[0],
			beforeElement: null
		};
	}
	/** @protected */
	_fosterParentElement(element$5) {
		const location$1 = this._findFosterParentingLocation();
		if (location$1.beforeElement) this.treeAdapter.insertBefore(location$1.parent, element$5, location$1.beforeElement);
		else this.treeAdapter.appendChild(location$1.parent, element$5);
	}
	/** @protected */
	_isSpecialElement(element$5, id) {
		return SPECIAL_ELEMENTS[this.treeAdapter.getNamespaceURI(element$5)].has(id);
	}
	/** @internal */
	onCharacter(token) {
		this.skipNextNewLine = false;
		if (this.tokenizer.inForeignNode) {
			characterInForeignContent(this, token);
			return;
		}
		switch (this.insertionMode) {
			case InsertionMode.INITIAL:
				tokenInInitialMode(this, token);
				break;
			case InsertionMode.BEFORE_HTML:
				tokenBeforeHtml(this, token);
				break;
			case InsertionMode.BEFORE_HEAD:
				tokenBeforeHead(this, token);
				break;
			case InsertionMode.IN_HEAD:
				tokenInHead(this, token);
				break;
			case InsertionMode.IN_HEAD_NO_SCRIPT:
				tokenInHeadNoScript(this, token);
				break;
			case InsertionMode.AFTER_HEAD:
				tokenAfterHead(this, token);
				break;
			case InsertionMode.IN_BODY:
			case InsertionMode.IN_CAPTION:
			case InsertionMode.IN_CELL:
			case InsertionMode.IN_TEMPLATE:
				characterInBody(this, token);
				break;
			case InsertionMode.TEXT:
			case InsertionMode.IN_SELECT:
			case InsertionMode.IN_SELECT_IN_TABLE:
				this._insertCharacters(token);
				break;
			case InsertionMode.IN_TABLE:
			case InsertionMode.IN_TABLE_BODY:
			case InsertionMode.IN_ROW:
				characterInTable(this, token);
				break;
			case InsertionMode.IN_TABLE_TEXT:
				characterInTableText(this, token);
				break;
			case InsertionMode.IN_COLUMN_GROUP:
				tokenInColumnGroup(this, token);
				break;
			case InsertionMode.AFTER_BODY:
				tokenAfterBody(this, token);
				break;
			case InsertionMode.AFTER_AFTER_BODY:
				tokenAfterAfterBody(this, token);
				break;
			default:
		}
	}
	/** @internal */
	onNullCharacter(token) {
		this.skipNextNewLine = false;
		if (this.tokenizer.inForeignNode) {
			nullCharacterInForeignContent(this, token);
			return;
		}
		switch (this.insertionMode) {
			case InsertionMode.INITIAL:
				tokenInInitialMode(this, token);
				break;
			case InsertionMode.BEFORE_HTML:
				tokenBeforeHtml(this, token);
				break;
			case InsertionMode.BEFORE_HEAD:
				tokenBeforeHead(this, token);
				break;
			case InsertionMode.IN_HEAD:
				tokenInHead(this, token);
				break;
			case InsertionMode.IN_HEAD_NO_SCRIPT:
				tokenInHeadNoScript(this, token);
				break;
			case InsertionMode.AFTER_HEAD:
				tokenAfterHead(this, token);
				break;
			case InsertionMode.TEXT:
				this._insertCharacters(token);
				break;
			case InsertionMode.IN_TABLE:
			case InsertionMode.IN_TABLE_BODY:
			case InsertionMode.IN_ROW:
				characterInTable(this, token);
				break;
			case InsertionMode.IN_COLUMN_GROUP:
				tokenInColumnGroup(this, token);
				break;
			case InsertionMode.AFTER_BODY:
				tokenAfterBody(this, token);
				break;
			case InsertionMode.AFTER_AFTER_BODY:
				tokenAfterAfterBody(this, token);
				break;
			default:
		}
	}
	/** @internal */
	onComment(token) {
		this.skipNextNewLine = false;
		if (this.currentNotInHTML) {
			appendComment(this, token);
			return;
		}
		switch (this.insertionMode) {
			case InsertionMode.INITIAL:
			case InsertionMode.BEFORE_HTML:
			case InsertionMode.BEFORE_HEAD:
			case InsertionMode.IN_HEAD:
			case InsertionMode.IN_HEAD_NO_SCRIPT:
			case InsertionMode.AFTER_HEAD:
			case InsertionMode.IN_BODY:
			case InsertionMode.IN_TABLE:
			case InsertionMode.IN_CAPTION:
			case InsertionMode.IN_COLUMN_GROUP:
			case InsertionMode.IN_TABLE_BODY:
			case InsertionMode.IN_ROW:
			case InsertionMode.IN_CELL:
			case InsertionMode.IN_SELECT:
			case InsertionMode.IN_SELECT_IN_TABLE:
			case InsertionMode.IN_TEMPLATE:
			case InsertionMode.IN_FRAMESET:
			case InsertionMode.AFTER_FRAMESET:
				appendComment(this, token);
				break;
			case InsertionMode.IN_TABLE_TEXT:
				tokenInTableText(this, token);
				break;
			case InsertionMode.AFTER_BODY:
				appendCommentToRootHtmlElement(this, token);
				break;
			case InsertionMode.AFTER_AFTER_BODY:
			case InsertionMode.AFTER_AFTER_FRAMESET:
				appendCommentToDocument(this, token);
				break;
			default:
		}
	}
	/** @internal */
	onDoctype(token) {
		this.skipNextNewLine = false;
		switch (this.insertionMode) {
			case InsertionMode.INITIAL:
				doctypeInInitialMode(this, token);
				break;
			case InsertionMode.BEFORE_HEAD:
			case InsertionMode.IN_HEAD:
			case InsertionMode.IN_HEAD_NO_SCRIPT:
			case InsertionMode.AFTER_HEAD:
				this._err(token, ERR.misplacedDoctype);
				break;
			case InsertionMode.IN_TABLE_TEXT:
				tokenInTableText(this, token);
				break;
			default:
		}
	}
	/** @internal */
	onStartTag(token) {
		this.skipNextNewLine = false;
		this.currentToken = token;
		this._processStartTag(token);
		if (token.selfClosing && !token.ackSelfClosing) this._err(token, ERR.nonVoidHtmlElementStartTagWithTrailingSolidus);
	}
	/**
	* Processes a given start tag.
	*
	* `onStartTag` checks if a self-closing tag was recognized. When a token
	* is moved inbetween multiple insertion modes, this check for self-closing
	* could lead to false positives. To avoid this, `_processStartTag` is used
	* for nested calls.
	*
	* @param token The token to process.
	* @protected
	*/
	_processStartTag(token) {
		if (this.shouldProcessStartTagTokenInForeignContent(token)) startTagInForeignContent(this, token);
		else this._startTagOutsideForeignContent(token);
	}
	/** @protected */
	_startTagOutsideForeignContent(token) {
		switch (this.insertionMode) {
			case InsertionMode.INITIAL:
				tokenInInitialMode(this, token);
				break;
			case InsertionMode.BEFORE_HTML:
				startTagBeforeHtml(this, token);
				break;
			case InsertionMode.BEFORE_HEAD:
				startTagBeforeHead(this, token);
				break;
			case InsertionMode.IN_HEAD:
				startTagInHead(this, token);
				break;
			case InsertionMode.IN_HEAD_NO_SCRIPT:
				startTagInHeadNoScript(this, token);
				break;
			case InsertionMode.AFTER_HEAD:
				startTagAfterHead(this, token);
				break;
			case InsertionMode.IN_BODY:
				startTagInBody(this, token);
				break;
			case InsertionMode.IN_TABLE:
				startTagInTable(this, token);
				break;
			case InsertionMode.IN_TABLE_TEXT:
				tokenInTableText(this, token);
				break;
			case InsertionMode.IN_CAPTION:
				startTagInCaption(this, token);
				break;
			case InsertionMode.IN_COLUMN_GROUP:
				startTagInColumnGroup(this, token);
				break;
			case InsertionMode.IN_TABLE_BODY:
				startTagInTableBody(this, token);
				break;
			case InsertionMode.IN_ROW:
				startTagInRow(this, token);
				break;
			case InsertionMode.IN_CELL:
				startTagInCell(this, token);
				break;
			case InsertionMode.IN_SELECT:
				startTagInSelect(this, token);
				break;
			case InsertionMode.IN_SELECT_IN_TABLE:
				startTagInSelectInTable(this, token);
				break;
			case InsertionMode.IN_TEMPLATE:
				startTagInTemplate(this, token);
				break;
			case InsertionMode.AFTER_BODY:
				startTagAfterBody(this, token);
				break;
			case InsertionMode.IN_FRAMESET:
				startTagInFrameset(this, token);
				break;
			case InsertionMode.AFTER_FRAMESET:
				startTagAfterFrameset(this, token);
				break;
			case InsertionMode.AFTER_AFTER_BODY:
				startTagAfterAfterBody(this, token);
				break;
			case InsertionMode.AFTER_AFTER_FRAMESET:
				startTagAfterAfterFrameset(this, token);
				break;
			default:
		}
	}
	/** @internal */
	onEndTag(token) {
		this.skipNextNewLine = false;
		this.currentToken = token;
		if (this.currentNotInHTML) endTagInForeignContent(this, token);
		else this._endTagOutsideForeignContent(token);
	}
	/** @protected */
	_endTagOutsideForeignContent(token) {
		switch (this.insertionMode) {
			case InsertionMode.INITIAL:
				tokenInInitialMode(this, token);
				break;
			case InsertionMode.BEFORE_HTML:
				endTagBeforeHtml(this, token);
				break;
			case InsertionMode.BEFORE_HEAD:
				endTagBeforeHead(this, token);
				break;
			case InsertionMode.IN_HEAD:
				endTagInHead(this, token);
				break;
			case InsertionMode.IN_HEAD_NO_SCRIPT:
				endTagInHeadNoScript(this, token);
				break;
			case InsertionMode.AFTER_HEAD:
				endTagAfterHead(this, token);
				break;
			case InsertionMode.IN_BODY:
				endTagInBody(this, token);
				break;
			case InsertionMode.TEXT:
				endTagInText(this, token);
				break;
			case InsertionMode.IN_TABLE:
				endTagInTable(this, token);
				break;
			case InsertionMode.IN_TABLE_TEXT:
				tokenInTableText(this, token);
				break;
			case InsertionMode.IN_CAPTION:
				endTagInCaption(this, token);
				break;
			case InsertionMode.IN_COLUMN_GROUP:
				endTagInColumnGroup(this, token);
				break;
			case InsertionMode.IN_TABLE_BODY:
				endTagInTableBody(this, token);
				break;
			case InsertionMode.IN_ROW:
				endTagInRow(this, token);
				break;
			case InsertionMode.IN_CELL:
				endTagInCell(this, token);
				break;
			case InsertionMode.IN_SELECT:
				endTagInSelect(this, token);
				break;
			case InsertionMode.IN_SELECT_IN_TABLE:
				endTagInSelectInTable(this, token);
				break;
			case InsertionMode.IN_TEMPLATE:
				endTagInTemplate(this, token);
				break;
			case InsertionMode.AFTER_BODY:
				endTagAfterBody(this, token);
				break;
			case InsertionMode.IN_FRAMESET:
				endTagInFrameset(this, token);
				break;
			case InsertionMode.AFTER_FRAMESET:
				endTagAfterFrameset(this, token);
				break;
			case InsertionMode.AFTER_AFTER_BODY:
				tokenAfterAfterBody(this, token);
				break;
			default:
		}
	}
	/** @internal */
	onEof(token) {
		switch (this.insertionMode) {
			case InsertionMode.INITIAL:
				tokenInInitialMode(this, token);
				break;
			case InsertionMode.BEFORE_HTML:
				tokenBeforeHtml(this, token);
				break;
			case InsertionMode.BEFORE_HEAD:
				tokenBeforeHead(this, token);
				break;
			case InsertionMode.IN_HEAD:
				tokenInHead(this, token);
				break;
			case InsertionMode.IN_HEAD_NO_SCRIPT:
				tokenInHeadNoScript(this, token);
				break;
			case InsertionMode.AFTER_HEAD:
				tokenAfterHead(this, token);
				break;
			case InsertionMode.IN_BODY:
			case InsertionMode.IN_TABLE:
			case InsertionMode.IN_CAPTION:
			case InsertionMode.IN_COLUMN_GROUP:
			case InsertionMode.IN_TABLE_BODY:
			case InsertionMode.IN_ROW:
			case InsertionMode.IN_CELL:
			case InsertionMode.IN_SELECT:
			case InsertionMode.IN_SELECT_IN_TABLE:
				eofInBody(this, token);
				break;
			case InsertionMode.TEXT:
				eofInText(this, token);
				break;
			case InsertionMode.IN_TABLE_TEXT:
				tokenInTableText(this, token);
				break;
			case InsertionMode.IN_TEMPLATE:
				eofInTemplate(this, token);
				break;
			case InsertionMode.AFTER_BODY:
			case InsertionMode.IN_FRAMESET:
			case InsertionMode.AFTER_FRAMESET:
			case InsertionMode.AFTER_AFTER_BODY:
			case InsertionMode.AFTER_AFTER_FRAMESET:
				stopParsing(this, token);
				break;
			default:
		}
	}
	/** @internal */
	onWhitespaceCharacter(token) {
		if (this.skipNextNewLine) {
			this.skipNextNewLine = false;
			if (token.chars.charCodeAt(0) === CODE_POINTS.LINE_FEED) {
				if (token.chars.length === 1) return;
				token.chars = token.chars.substr(1);
			}
		}
		if (this.tokenizer.inForeignNode) {
			this._insertCharacters(token);
			return;
		}
		switch (this.insertionMode) {
			case InsertionMode.IN_HEAD:
			case InsertionMode.IN_HEAD_NO_SCRIPT:
			case InsertionMode.AFTER_HEAD:
			case InsertionMode.TEXT:
			case InsertionMode.IN_COLUMN_GROUP:
			case InsertionMode.IN_SELECT:
			case InsertionMode.IN_SELECT_IN_TABLE:
			case InsertionMode.IN_FRAMESET:
			case InsertionMode.AFTER_FRAMESET:
				this._insertCharacters(token);
				break;
			case InsertionMode.IN_BODY:
			case InsertionMode.IN_CAPTION:
			case InsertionMode.IN_CELL:
			case InsertionMode.IN_TEMPLATE:
			case InsertionMode.AFTER_BODY:
			case InsertionMode.AFTER_AFTER_BODY:
			case InsertionMode.AFTER_AFTER_FRAMESET:
				whitespaceCharacterInBody(this, token);
				break;
			case InsertionMode.IN_TABLE:
			case InsertionMode.IN_TABLE_BODY:
			case InsertionMode.IN_ROW:
				characterInTable(this, token);
				break;
			case InsertionMode.IN_TABLE_TEXT:
				whitespaceCharacterInTableText(this, token);
				break;
			default:
		}
	}
};
function aaObtainFormattingElementEntry(p, token) {
	let formattingElementEntry = p.activeFormattingElements.getElementEntryInScopeWithTagName(token.tagName);
	if (formattingElementEntry) {
		if (!p.openElements.contains(formattingElementEntry.element)) {
			p.activeFormattingElements.removeEntry(formattingElementEntry);
			formattingElementEntry = null;
		} else if (!p.openElements.hasInScope(token.tagID)) formattingElementEntry = null;
	} else genericEndTagInBody(p, token);
	return formattingElementEntry;
}
function aaObtainFurthestBlock(p, formattingElementEntry) {
	let furthestBlock = null;
	let idx = p.openElements.stackTop;
	for (; idx >= 0; idx--) {
		const element$5 = p.openElements.items[idx];
		if (element$5 === formattingElementEntry.element) break;
		if (p._isSpecialElement(element$5, p.openElements.tagIDs[idx])) furthestBlock = element$5;
	}
	if (!furthestBlock) {
		p.openElements.shortenToLength(Math.max(idx, 0));
		p.activeFormattingElements.removeEntry(formattingElementEntry);
	}
	return furthestBlock;
}
function aaInnerLoop(p, furthestBlock, formattingElement) {
	let lastElement = furthestBlock;
	let nextElement = p.openElements.getCommonAncestor(furthestBlock);
	for (let i = 0, element$5 = nextElement; element$5 !== formattingElement; i++, element$5 = nextElement) {
		nextElement = p.openElements.getCommonAncestor(element$5);
		const elementEntry = p.activeFormattingElements.getElementEntry(element$5);
		const counterOverflow = elementEntry && i >= AA_INNER_LOOP_ITER;
		if (!elementEntry || counterOverflow) {
			if (counterOverflow) p.activeFormattingElements.removeEntry(elementEntry);
			p.openElements.remove(element$5);
		} else {
			element$5 = aaRecreateElementFromEntry(p, elementEntry);
			if (lastElement === furthestBlock) p.activeFormattingElements.bookmark = elementEntry;
			p.treeAdapter.detachNode(lastElement);
			p.treeAdapter.appendChild(element$5, lastElement);
			lastElement = element$5;
		}
	}
	return lastElement;
}
function aaRecreateElementFromEntry(p, elementEntry) {
	const ns = p.treeAdapter.getNamespaceURI(elementEntry.element);
	const newElement = p.treeAdapter.createElement(elementEntry.token.tagName, ns, elementEntry.token.attrs);
	p.openElements.replace(elementEntry.element, newElement);
	elementEntry.element = newElement;
	return newElement;
}
function aaInsertLastNodeInCommonAncestor(p, commonAncestor, lastElement) {
	const tid = getTagID(p.treeAdapter.getTagName(commonAncestor));
	if (p._isElementCausesFosterParenting(tid)) p._fosterParentElement(lastElement);
	else {
		const ns = p.treeAdapter.getNamespaceURI(commonAncestor);
		if (tid === TAG_ID.TEMPLATE && ns === NS$1.HTML) commonAncestor = p.treeAdapter.getTemplateContent(commonAncestor);
		p.treeAdapter.appendChild(commonAncestor, lastElement);
	}
}
function aaReplaceFormattingElement(p, furthestBlock, formattingElementEntry) {
	const ns = p.treeAdapter.getNamespaceURI(formattingElementEntry.element);
	const { token } = formattingElementEntry;
	const newElement = p.treeAdapter.createElement(token.tagName, ns, token.attrs);
	p._adoptNodes(furthestBlock, newElement);
	p.treeAdapter.appendChild(furthestBlock, newElement);
	p.activeFormattingElements.insertElementAfterBookmark(newElement, token);
	p.activeFormattingElements.removeEntry(formattingElementEntry);
	p.openElements.remove(formattingElementEntry.element);
	p.openElements.insertAfter(furthestBlock, newElement, token.tagID);
}
function callAdoptionAgency(p, token) {
	for (let i = 0; i < AA_OUTER_LOOP_ITER; i++) {
		const formattingElementEntry = aaObtainFormattingElementEntry(p, token);
		if (!formattingElementEntry) break;
		const furthestBlock = aaObtainFurthestBlock(p, formattingElementEntry);
		if (!furthestBlock) break;
		p.activeFormattingElements.bookmark = formattingElementEntry;
		const lastElement = aaInnerLoop(p, furthestBlock, formattingElementEntry.element);
		const commonAncestor = p.openElements.getCommonAncestor(formattingElementEntry.element);
		p.treeAdapter.detachNode(lastElement);
		if (commonAncestor) aaInsertLastNodeInCommonAncestor(p, commonAncestor, lastElement);
		aaReplaceFormattingElement(p, furthestBlock, formattingElementEntry);
	}
}
function appendComment(p, token) {
	p._appendCommentNode(token, p.openElements.currentTmplContentOrNode);
}
function appendCommentToRootHtmlElement(p, token) {
	p._appendCommentNode(token, p.openElements.items[0]);
}
function appendCommentToDocument(p, token) {
	p._appendCommentNode(token, p.document);
}
function stopParsing(p, token) {
	p.stopped = true;
	if (token.location) {
		const target = p.fragmentContext ? 0 : 2;
		for (let i = p.openElements.stackTop; i >= target; i--) p._setEndLocation(p.openElements.items[i], token);
		if (!p.fragmentContext && p.openElements.stackTop >= 0) {
			const htmlElement = p.openElements.items[0];
			const htmlLocation = p.treeAdapter.getNodeSourceCodeLocation(htmlElement);
			if (htmlLocation && !htmlLocation.endTag) {
				p._setEndLocation(htmlElement, token);
				if (p.openElements.stackTop >= 1) {
					const bodyElement = p.openElements.items[1];
					const bodyLocation = p.treeAdapter.getNodeSourceCodeLocation(bodyElement);
					if (bodyLocation && !bodyLocation.endTag) p._setEndLocation(bodyElement, token);
				}
			}
		}
	}
}
function doctypeInInitialMode(p, token) {
	p._setDocumentType(token);
	const mode = token.forceQuirks ? DOCUMENT_MODE.QUIRKS : getDocumentMode(token);
	if (!isConforming(token)) p._err(token, ERR.nonConformingDoctype);
	p.treeAdapter.setDocumentMode(p.document, mode);
	p.insertionMode = InsertionMode.BEFORE_HTML;
}
function tokenInInitialMode(p, token) {
	p._err(token, ERR.missingDoctype, true);
	p.treeAdapter.setDocumentMode(p.document, DOCUMENT_MODE.QUIRKS);
	p.insertionMode = InsertionMode.BEFORE_HTML;
	p._processToken(token);
}
function startTagBeforeHtml(p, token) {
	if (token.tagID === TAG_ID.HTML) {
		p._insertElement(token, NS$1.HTML);
		p.insertionMode = InsertionMode.BEFORE_HEAD;
	} else tokenBeforeHtml(p, token);
}
function endTagBeforeHtml(p, token) {
	const tn = token.tagID;
	if (tn === TAG_ID.HTML || tn === TAG_ID.HEAD || tn === TAG_ID.BODY || tn === TAG_ID.BR) tokenBeforeHtml(p, token);
}
function tokenBeforeHtml(p, token) {
	p._insertFakeRootElement();
	p.insertionMode = InsertionMode.BEFORE_HEAD;
	p._processToken(token);
}
function startTagBeforeHead(p, token) {
	switch (token.tagID) {
		case TAG_ID.HTML:
			startTagInBody(p, token);
			break;
		case TAG_ID.HEAD:
			p._insertElement(token, NS$1.HTML);
			p.headElement = p.openElements.current;
			p.insertionMode = InsertionMode.IN_HEAD;
			break;
		default: tokenBeforeHead(p, token);
	}
}
function endTagBeforeHead(p, token) {
	const tn = token.tagID;
	if (tn === TAG_ID.HEAD || tn === TAG_ID.BODY || tn === TAG_ID.HTML || tn === TAG_ID.BR) tokenBeforeHead(p, token);
	else p._err(token, ERR.endTagWithoutMatchingOpenElement);
}
function tokenBeforeHead(p, token) {
	p._insertFakeElement(TAG_NAMES.HEAD, TAG_ID.HEAD);
	p.headElement = p.openElements.current;
	p.insertionMode = InsertionMode.IN_HEAD;
	p._processToken(token);
}
function startTagInHead(p, token) {
	switch (token.tagID) {
		case TAG_ID.HTML:
			startTagInBody(p, token);
			break;
		case TAG_ID.BASE:
		case TAG_ID.BASEFONT:
		case TAG_ID.BGSOUND:
		case TAG_ID.LINK:
		case TAG_ID.META:
			p._appendElement(token, NS$1.HTML);
			token.ackSelfClosing = true;
			break;
		case TAG_ID.TITLE:
			p._switchToTextParsing(token, TokenizerMode.RCDATA);
			break;
		case TAG_ID.NOSCRIPT:
			if (p.options.scriptingEnabled) p._switchToTextParsing(token, TokenizerMode.RAWTEXT);
			else {
				p._insertElement(token, NS$1.HTML);
				p.insertionMode = InsertionMode.IN_HEAD_NO_SCRIPT;
			}
			break;
		case TAG_ID.NOFRAMES:
		case TAG_ID.STYLE:
			p._switchToTextParsing(token, TokenizerMode.RAWTEXT);
			break;
		case TAG_ID.SCRIPT:
			p._switchToTextParsing(token, TokenizerMode.SCRIPT_DATA);
			break;
		case TAG_ID.TEMPLATE:
			p._insertTemplate(token);
			p.activeFormattingElements.insertMarker();
			p.framesetOk = false;
			p.insertionMode = InsertionMode.IN_TEMPLATE;
			p.tmplInsertionModeStack.unshift(InsertionMode.IN_TEMPLATE);
			break;
		case TAG_ID.HEAD:
			p._err(token, ERR.misplacedStartTagForHeadElement);
			break;
		default: tokenInHead(p, token);
	}
}
function endTagInHead(p, token) {
	switch (token.tagID) {
		case TAG_ID.HEAD:
			p.openElements.pop();
			p.insertionMode = InsertionMode.AFTER_HEAD;
			break;
		case TAG_ID.BODY:
		case TAG_ID.BR:
		case TAG_ID.HTML:
			tokenInHead(p, token);
			break;
		case TAG_ID.TEMPLATE:
			templateEndTagInHead(p, token);
			break;
		default: p._err(token, ERR.endTagWithoutMatchingOpenElement);
	}
}
function templateEndTagInHead(p, token) {
	if (p.openElements.tmplCount > 0) {
		p.openElements.generateImpliedEndTagsThoroughly();
		if (p.openElements.currentTagId !== TAG_ID.TEMPLATE) p._err(token, ERR.closingOfElementWithOpenChildElements);
		p.openElements.popUntilTagNamePopped(TAG_ID.TEMPLATE);
		p.activeFormattingElements.clearToLastMarker();
		p.tmplInsertionModeStack.shift();
		p._resetInsertionMode();
	} else p._err(token, ERR.endTagWithoutMatchingOpenElement);
}
function tokenInHead(p, token) {
	p.openElements.pop();
	p.insertionMode = InsertionMode.AFTER_HEAD;
	p._processToken(token);
}
function startTagInHeadNoScript(p, token) {
	switch (token.tagID) {
		case TAG_ID.HTML:
			startTagInBody(p, token);
			break;
		case TAG_ID.BASEFONT:
		case TAG_ID.BGSOUND:
		case TAG_ID.HEAD:
		case TAG_ID.LINK:
		case TAG_ID.META:
		case TAG_ID.NOFRAMES:
		case TAG_ID.STYLE:
			startTagInHead(p, token);
			break;
		case TAG_ID.NOSCRIPT:
			p._err(token, ERR.nestedNoscriptInHead);
			break;
		default: tokenInHeadNoScript(p, token);
	}
}
function endTagInHeadNoScript(p, token) {
	switch (token.tagID) {
		case TAG_ID.NOSCRIPT:
			p.openElements.pop();
			p.insertionMode = InsertionMode.IN_HEAD;
			break;
		case TAG_ID.BR:
			tokenInHeadNoScript(p, token);
			break;
		default: p._err(token, ERR.endTagWithoutMatchingOpenElement);
	}
}
function tokenInHeadNoScript(p, token) {
	const errCode = token.type === TokenType.EOF ? ERR.openElementsLeftAfterEof : ERR.disallowedContentInNoscriptInHead;
	p._err(token, errCode);
	p.openElements.pop();
	p.insertionMode = InsertionMode.IN_HEAD;
	p._processToken(token);
}
function startTagAfterHead(p, token) {
	switch (token.tagID) {
		case TAG_ID.HTML:
			startTagInBody(p, token);
			break;
		case TAG_ID.BODY:
			p._insertElement(token, NS$1.HTML);
			p.framesetOk = false;
			p.insertionMode = InsertionMode.IN_BODY;
			break;
		case TAG_ID.FRAMESET:
			p._insertElement(token, NS$1.HTML);
			p.insertionMode = InsertionMode.IN_FRAMESET;
			break;
		case TAG_ID.BASE:
		case TAG_ID.BASEFONT:
		case TAG_ID.BGSOUND:
		case TAG_ID.LINK:
		case TAG_ID.META:
		case TAG_ID.NOFRAMES:
		case TAG_ID.SCRIPT:
		case TAG_ID.STYLE:
		case TAG_ID.TEMPLATE:
		case TAG_ID.TITLE:
			p._err(token, ERR.abandonedHeadElementChild);
			p.openElements.push(p.headElement, TAG_ID.HEAD);
			startTagInHead(p, token);
			p.openElements.remove(p.headElement);
			break;
		case TAG_ID.HEAD:
			p._err(token, ERR.misplacedStartTagForHeadElement);
			break;
		default: tokenAfterHead(p, token);
	}
}
function endTagAfterHead(p, token) {
	switch (token.tagID) {
		case TAG_ID.BODY:
		case TAG_ID.HTML:
		case TAG_ID.BR:
			tokenAfterHead(p, token);
			break;
		case TAG_ID.TEMPLATE:
			templateEndTagInHead(p, token);
			break;
		default: p._err(token, ERR.endTagWithoutMatchingOpenElement);
	}
}
function tokenAfterHead(p, token) {
	p._insertFakeElement(TAG_NAMES.BODY, TAG_ID.BODY);
	p.insertionMode = InsertionMode.IN_BODY;
	modeInBody(p, token);
}
function modeInBody(p, token) {
	switch (token.type) {
		case TokenType.CHARACTER:
			characterInBody(p, token);
			break;
		case TokenType.WHITESPACE_CHARACTER:
			whitespaceCharacterInBody(p, token);
			break;
		case TokenType.COMMENT:
			appendComment(p, token);
			break;
		case TokenType.START_TAG:
			startTagInBody(p, token);
			break;
		case TokenType.END_TAG:
			endTagInBody(p, token);
			break;
		case TokenType.EOF:
			eofInBody(p, token);
			break;
		default:
	}
}
function whitespaceCharacterInBody(p, token) {
	p._reconstructActiveFormattingElements();
	p._insertCharacters(token);
}
function characterInBody(p, token) {
	p._reconstructActiveFormattingElements();
	p._insertCharacters(token);
	p.framesetOk = false;
}
function htmlStartTagInBody(p, token) {
	if (p.openElements.tmplCount === 0) p.treeAdapter.adoptAttributes(p.openElements.items[0], token.attrs);
}
function bodyStartTagInBody(p, token) {
	const bodyElement = p.openElements.tryPeekProperlyNestedBodyElement();
	if (bodyElement && p.openElements.tmplCount === 0) {
		p.framesetOk = false;
		p.treeAdapter.adoptAttributes(bodyElement, token.attrs);
	}
}
function framesetStartTagInBody(p, token) {
	const bodyElement = p.openElements.tryPeekProperlyNestedBodyElement();
	if (p.framesetOk && bodyElement) {
		p.treeAdapter.detachNode(bodyElement);
		p.openElements.popAllUpToHtmlElement();
		p._insertElement(token, NS$1.HTML);
		p.insertionMode = InsertionMode.IN_FRAMESET;
	}
}
function addressStartTagInBody(p, token) {
	if (p.openElements.hasInButtonScope(TAG_ID.P)) p._closePElement();
	p._insertElement(token, NS$1.HTML);
}
function numberedHeaderStartTagInBody(p, token) {
	if (p.openElements.hasInButtonScope(TAG_ID.P)) p._closePElement();
	if (p.openElements.currentTagId !== void 0 && NUMBERED_HEADERS.has(p.openElements.currentTagId)) p.openElements.pop();
	p._insertElement(token, NS$1.HTML);
}
function preStartTagInBody(p, token) {
	if (p.openElements.hasInButtonScope(TAG_ID.P)) p._closePElement();
	p._insertElement(token, NS$1.HTML);
	p.skipNextNewLine = true;
	p.framesetOk = false;
}
function formStartTagInBody(p, token) {
	const inTemplate = p.openElements.tmplCount > 0;
	if (!p.formElement || inTemplate) {
		if (p.openElements.hasInButtonScope(TAG_ID.P)) p._closePElement();
		p._insertElement(token, NS$1.HTML);
		if (!inTemplate) p.formElement = p.openElements.current;
	}
}
function listItemStartTagInBody(p, token) {
	p.framesetOk = false;
	const tn = token.tagID;
	for (let i = p.openElements.stackTop; i >= 0; i--) {
		const elementId = p.openElements.tagIDs[i];
		if (tn === TAG_ID.LI && elementId === TAG_ID.LI || (tn === TAG_ID.DD || tn === TAG_ID.DT) && (elementId === TAG_ID.DD || elementId === TAG_ID.DT)) {
			p.openElements.generateImpliedEndTagsWithExclusion(elementId);
			p.openElements.popUntilTagNamePopped(elementId);
			break;
		}
		if (elementId !== TAG_ID.ADDRESS && elementId !== TAG_ID.DIV && elementId !== TAG_ID.P && p._isSpecialElement(p.openElements.items[i], elementId)) break;
	}
	if (p.openElements.hasInButtonScope(TAG_ID.P)) p._closePElement();
	p._insertElement(token, NS$1.HTML);
}
function plaintextStartTagInBody(p, token) {
	if (p.openElements.hasInButtonScope(TAG_ID.P)) p._closePElement();
	p._insertElement(token, NS$1.HTML);
	p.tokenizer.state = TokenizerMode.PLAINTEXT;
}
function buttonStartTagInBody(p, token) {
	if (p.openElements.hasInScope(TAG_ID.BUTTON)) {
		p.openElements.generateImpliedEndTags();
		p.openElements.popUntilTagNamePopped(TAG_ID.BUTTON);
	}
	p._reconstructActiveFormattingElements();
	p._insertElement(token, NS$1.HTML);
	p.framesetOk = false;
}
function aStartTagInBody(p, token) {
	const activeElementEntry = p.activeFormattingElements.getElementEntryInScopeWithTagName(TAG_NAMES.A);
	if (activeElementEntry) {
		callAdoptionAgency(p, token);
		p.openElements.remove(activeElementEntry.element);
		p.activeFormattingElements.removeEntry(activeElementEntry);
	}
	p._reconstructActiveFormattingElements();
	p._insertElement(token, NS$1.HTML);
	p.activeFormattingElements.pushElement(p.openElements.current, token);
}
function bStartTagInBody(p, token) {
	p._reconstructActiveFormattingElements();
	p._insertElement(token, NS$1.HTML);
	p.activeFormattingElements.pushElement(p.openElements.current, token);
}
function nobrStartTagInBody(p, token) {
	p._reconstructActiveFormattingElements();
	if (p.openElements.hasInScope(TAG_ID.NOBR)) {
		callAdoptionAgency(p, token);
		p._reconstructActiveFormattingElements();
	}
	p._insertElement(token, NS$1.HTML);
	p.activeFormattingElements.pushElement(p.openElements.current, token);
}
function appletStartTagInBody(p, token) {
	p._reconstructActiveFormattingElements();
	p._insertElement(token, NS$1.HTML);
	p.activeFormattingElements.insertMarker();
	p.framesetOk = false;
}
function tableStartTagInBody(p, token) {
	if (p.treeAdapter.getDocumentMode(p.document) !== DOCUMENT_MODE.QUIRKS && p.openElements.hasInButtonScope(TAG_ID.P)) p._closePElement();
	p._insertElement(token, NS$1.HTML);
	p.framesetOk = false;
	p.insertionMode = InsertionMode.IN_TABLE;
}
function areaStartTagInBody(p, token) {
	p._reconstructActiveFormattingElements();
	p._appendElement(token, NS$1.HTML);
	p.framesetOk = false;
	token.ackSelfClosing = true;
}
function isHiddenInput(token) {
	const inputType = getTokenAttr(token, ATTRS.TYPE);
	return inputType != null && inputType.toLowerCase() === HIDDEN_INPUT_TYPE;
}
function inputStartTagInBody(p, token) {
	p._reconstructActiveFormattingElements();
	p._appendElement(token, NS$1.HTML);
	if (!isHiddenInput(token)) p.framesetOk = false;
	token.ackSelfClosing = true;
}
function paramStartTagInBody(p, token) {
	p._appendElement(token, NS$1.HTML);
	token.ackSelfClosing = true;
}
function hrStartTagInBody(p, token) {
	if (p.openElements.hasInButtonScope(TAG_ID.P)) p._closePElement();
	p._appendElement(token, NS$1.HTML);
	p.framesetOk = false;
	token.ackSelfClosing = true;
}
function imageStartTagInBody(p, token) {
	token.tagName = TAG_NAMES.IMG;
	token.tagID = TAG_ID.IMG;
	areaStartTagInBody(p, token);
}
function textareaStartTagInBody(p, token) {
	p._insertElement(token, NS$1.HTML);
	p.skipNextNewLine = true;
	p.tokenizer.state = TokenizerMode.RCDATA;
	p.originalInsertionMode = p.insertionMode;
	p.framesetOk = false;
	p.insertionMode = InsertionMode.TEXT;
}
function xmpStartTagInBody(p, token) {
	if (p.openElements.hasInButtonScope(TAG_ID.P)) p._closePElement();
	p._reconstructActiveFormattingElements();
	p.framesetOk = false;
	p._switchToTextParsing(token, TokenizerMode.RAWTEXT);
}
function iframeStartTagInBody(p, token) {
	p.framesetOk = false;
	p._switchToTextParsing(token, TokenizerMode.RAWTEXT);
}
function rawTextStartTagInBody(p, token) {
	p._switchToTextParsing(token, TokenizerMode.RAWTEXT);
}
function selectStartTagInBody(p, token) {
	p._reconstructActiveFormattingElements();
	p._insertElement(token, NS$1.HTML);
	p.framesetOk = false;
	p.insertionMode = p.insertionMode === InsertionMode.IN_TABLE || p.insertionMode === InsertionMode.IN_CAPTION || p.insertionMode === InsertionMode.IN_TABLE_BODY || p.insertionMode === InsertionMode.IN_ROW || p.insertionMode === InsertionMode.IN_CELL ? InsertionMode.IN_SELECT_IN_TABLE : InsertionMode.IN_SELECT;
}
function optgroupStartTagInBody(p, token) {
	if (p.openElements.currentTagId === TAG_ID.OPTION) p.openElements.pop();
	p._reconstructActiveFormattingElements();
	p._insertElement(token, NS$1.HTML);
}
function rbStartTagInBody(p, token) {
	if (p.openElements.hasInScope(TAG_ID.RUBY)) p.openElements.generateImpliedEndTags();
	p._insertElement(token, NS$1.HTML);
}
function rtStartTagInBody(p, token) {
	if (p.openElements.hasInScope(TAG_ID.RUBY)) p.openElements.generateImpliedEndTagsWithExclusion(TAG_ID.RTC);
	p._insertElement(token, NS$1.HTML);
}
function mathStartTagInBody(p, token) {
	p._reconstructActiveFormattingElements();
	adjustTokenMathMLAttrs(token);
	adjustTokenXMLAttrs(token);
	if (token.selfClosing) p._appendElement(token, NS$1.MATHML);
	else p._insertElement(token, NS$1.MATHML);
	token.ackSelfClosing = true;
}
function svgStartTagInBody(p, token) {
	p._reconstructActiveFormattingElements();
	adjustTokenSVGAttrs(token);
	adjustTokenXMLAttrs(token);
	if (token.selfClosing) p._appendElement(token, NS$1.SVG);
	else p._insertElement(token, NS$1.SVG);
	token.ackSelfClosing = true;
}
function genericStartTagInBody(p, token) {
	p._reconstructActiveFormattingElements();
	p._insertElement(token, NS$1.HTML);
}
function startTagInBody(p, token) {
	switch (token.tagID) {
		case TAG_ID.I:
		case TAG_ID.S:
		case TAG_ID.B:
		case TAG_ID.U:
		case TAG_ID.EM:
		case TAG_ID.TT:
		case TAG_ID.BIG:
		case TAG_ID.CODE:
		case TAG_ID.FONT:
		case TAG_ID.SMALL:
		case TAG_ID.STRIKE:
		case TAG_ID.STRONG:
			bStartTagInBody(p, token);
			break;
		case TAG_ID.A:
			aStartTagInBody(p, token);
			break;
		case TAG_ID.H1:
		case TAG_ID.H2:
		case TAG_ID.H3:
		case TAG_ID.H4:
		case TAG_ID.H5:
		case TAG_ID.H6:
			numberedHeaderStartTagInBody(p, token);
			break;
		case TAG_ID.P:
		case TAG_ID.DL:
		case TAG_ID.OL:
		case TAG_ID.UL:
		case TAG_ID.DIV:
		case TAG_ID.DIR:
		case TAG_ID.NAV:
		case TAG_ID.MAIN:
		case TAG_ID.MENU:
		case TAG_ID.ASIDE:
		case TAG_ID.CENTER:
		case TAG_ID.FIGURE:
		case TAG_ID.FOOTER:
		case TAG_ID.HEADER:
		case TAG_ID.HGROUP:
		case TAG_ID.DIALOG:
		case TAG_ID.DETAILS:
		case TAG_ID.ADDRESS:
		case TAG_ID.ARTICLE:
		case TAG_ID.SEARCH:
		case TAG_ID.SECTION:
		case TAG_ID.SUMMARY:
		case TAG_ID.FIELDSET:
		case TAG_ID.BLOCKQUOTE:
		case TAG_ID.FIGCAPTION:
			addressStartTagInBody(p, token);
			break;
		case TAG_ID.LI:
		case TAG_ID.DD:
		case TAG_ID.DT:
			listItemStartTagInBody(p, token);
			break;
		case TAG_ID.BR:
		case TAG_ID.IMG:
		case TAG_ID.WBR:
		case TAG_ID.AREA:
		case TAG_ID.EMBED:
		case TAG_ID.KEYGEN:
			areaStartTagInBody(p, token);
			break;
		case TAG_ID.HR:
			hrStartTagInBody(p, token);
			break;
		case TAG_ID.RB:
		case TAG_ID.RTC:
			rbStartTagInBody(p, token);
			break;
		case TAG_ID.RT:
		case TAG_ID.RP:
			rtStartTagInBody(p, token);
			break;
		case TAG_ID.PRE:
		case TAG_ID.LISTING:
			preStartTagInBody(p, token);
			break;
		case TAG_ID.XMP:
			xmpStartTagInBody(p, token);
			break;
		case TAG_ID.SVG:
			svgStartTagInBody(p, token);
			break;
		case TAG_ID.HTML:
			htmlStartTagInBody(p, token);
			break;
		case TAG_ID.BASE:
		case TAG_ID.LINK:
		case TAG_ID.META:
		case TAG_ID.STYLE:
		case TAG_ID.TITLE:
		case TAG_ID.SCRIPT:
		case TAG_ID.BGSOUND:
		case TAG_ID.BASEFONT:
		case TAG_ID.TEMPLATE:
			startTagInHead(p, token);
			break;
		case TAG_ID.BODY:
			bodyStartTagInBody(p, token);
			break;
		case TAG_ID.FORM:
			formStartTagInBody(p, token);
			break;
		case TAG_ID.NOBR:
			nobrStartTagInBody(p, token);
			break;
		case TAG_ID.MATH:
			mathStartTagInBody(p, token);
			break;
		case TAG_ID.TABLE:
			tableStartTagInBody(p, token);
			break;
		case TAG_ID.INPUT:
			inputStartTagInBody(p, token);
			break;
		case TAG_ID.PARAM:
		case TAG_ID.TRACK:
		case TAG_ID.SOURCE:
			paramStartTagInBody(p, token);
			break;
		case TAG_ID.IMAGE:
			imageStartTagInBody(p, token);
			break;
		case TAG_ID.BUTTON:
			buttonStartTagInBody(p, token);
			break;
		case TAG_ID.APPLET:
		case TAG_ID.OBJECT:
		case TAG_ID.MARQUEE:
			appletStartTagInBody(p, token);
			break;
		case TAG_ID.IFRAME:
			iframeStartTagInBody(p, token);
			break;
		case TAG_ID.SELECT:
			selectStartTagInBody(p, token);
			break;
		case TAG_ID.OPTION:
		case TAG_ID.OPTGROUP:
			optgroupStartTagInBody(p, token);
			break;
		case TAG_ID.NOEMBED:
		case TAG_ID.NOFRAMES:
			rawTextStartTagInBody(p, token);
			break;
		case TAG_ID.FRAMESET:
			framesetStartTagInBody(p, token);
			break;
		case TAG_ID.TEXTAREA:
			textareaStartTagInBody(p, token);
			break;
		case TAG_ID.NOSCRIPT:
			if (p.options.scriptingEnabled) rawTextStartTagInBody(p, token);
			else genericStartTagInBody(p, token);
			break;
		case TAG_ID.PLAINTEXT:
			plaintextStartTagInBody(p, token);
			break;
		case TAG_ID.COL:
		case TAG_ID.TH:
		case TAG_ID.TD:
		case TAG_ID.TR:
		case TAG_ID.HEAD:
		case TAG_ID.FRAME:
		case TAG_ID.TBODY:
		case TAG_ID.TFOOT:
		case TAG_ID.THEAD:
		case TAG_ID.CAPTION:
		case TAG_ID.COLGROUP: break;
		default: genericStartTagInBody(p, token);
	}
}
function bodyEndTagInBody(p, token) {
	if (p.openElements.hasInScope(TAG_ID.BODY)) {
		p.insertionMode = InsertionMode.AFTER_BODY;
		if (p.options.sourceCodeLocationInfo) {
			const bodyElement = p.openElements.tryPeekProperlyNestedBodyElement();
			if (bodyElement) p._setEndLocation(bodyElement, token);
		}
	}
}
function htmlEndTagInBody(p, token) {
	if (p.openElements.hasInScope(TAG_ID.BODY)) {
		p.insertionMode = InsertionMode.AFTER_BODY;
		endTagAfterBody(p, token);
	}
}
function addressEndTagInBody(p, token) {
	const tn = token.tagID;
	if (p.openElements.hasInScope(tn)) {
		p.openElements.generateImpliedEndTags();
		p.openElements.popUntilTagNamePopped(tn);
	}
}
function formEndTagInBody(p) {
	const inTemplate = p.openElements.tmplCount > 0;
	const { formElement } = p;
	if (!inTemplate) p.formElement = null;
	if ((formElement || inTemplate) && p.openElements.hasInScope(TAG_ID.FORM)) {
		p.openElements.generateImpliedEndTags();
		if (inTemplate) p.openElements.popUntilTagNamePopped(TAG_ID.FORM);
		else if (formElement) p.openElements.remove(formElement);
	}
}
function pEndTagInBody(p) {
	if (!p.openElements.hasInButtonScope(TAG_ID.P)) p._insertFakeElement(TAG_NAMES.P, TAG_ID.P);
	p._closePElement();
}
function liEndTagInBody(p) {
	if (p.openElements.hasInListItemScope(TAG_ID.LI)) {
		p.openElements.generateImpliedEndTagsWithExclusion(TAG_ID.LI);
		p.openElements.popUntilTagNamePopped(TAG_ID.LI);
	}
}
function ddEndTagInBody(p, token) {
	const tn = token.tagID;
	if (p.openElements.hasInScope(tn)) {
		p.openElements.generateImpliedEndTagsWithExclusion(tn);
		p.openElements.popUntilTagNamePopped(tn);
	}
}
function numberedHeaderEndTagInBody(p) {
	if (p.openElements.hasNumberedHeaderInScope()) {
		p.openElements.generateImpliedEndTags();
		p.openElements.popUntilNumberedHeaderPopped();
	}
}
function appletEndTagInBody(p, token) {
	const tn = token.tagID;
	if (p.openElements.hasInScope(tn)) {
		p.openElements.generateImpliedEndTags();
		p.openElements.popUntilTagNamePopped(tn);
		p.activeFormattingElements.clearToLastMarker();
	}
}
function brEndTagInBody(p) {
	p._reconstructActiveFormattingElements();
	p._insertFakeElement(TAG_NAMES.BR, TAG_ID.BR);
	p.openElements.pop();
	p.framesetOk = false;
}
function genericEndTagInBody(p, token) {
	const tn = token.tagName;
	const tid = token.tagID;
	for (let i = p.openElements.stackTop; i > 0; i--) {
		const element$5 = p.openElements.items[i];
		const elementId = p.openElements.tagIDs[i];
		if (tid === elementId && (tid !== TAG_ID.UNKNOWN || p.treeAdapter.getTagName(element$5) === tn)) {
			p.openElements.generateImpliedEndTagsWithExclusion(tid);
			if (p.openElements.stackTop >= i) p.openElements.shortenToLength(i);
			break;
		}
		if (p._isSpecialElement(element$5, elementId)) break;
	}
}
function endTagInBody(p, token) {
	switch (token.tagID) {
		case TAG_ID.A:
		case TAG_ID.B:
		case TAG_ID.I:
		case TAG_ID.S:
		case TAG_ID.U:
		case TAG_ID.EM:
		case TAG_ID.TT:
		case TAG_ID.BIG:
		case TAG_ID.CODE:
		case TAG_ID.FONT:
		case TAG_ID.NOBR:
		case TAG_ID.SMALL:
		case TAG_ID.STRIKE:
		case TAG_ID.STRONG:
			callAdoptionAgency(p, token);
			break;
		case TAG_ID.P:
			pEndTagInBody(p);
			break;
		case TAG_ID.DL:
		case TAG_ID.UL:
		case TAG_ID.OL:
		case TAG_ID.DIR:
		case TAG_ID.DIV:
		case TAG_ID.NAV:
		case TAG_ID.PRE:
		case TAG_ID.MAIN:
		case TAG_ID.MENU:
		case TAG_ID.ASIDE:
		case TAG_ID.BUTTON:
		case TAG_ID.CENTER:
		case TAG_ID.FIGURE:
		case TAG_ID.FOOTER:
		case TAG_ID.HEADER:
		case TAG_ID.HGROUP:
		case TAG_ID.DIALOG:
		case TAG_ID.ADDRESS:
		case TAG_ID.ARTICLE:
		case TAG_ID.DETAILS:
		case TAG_ID.SEARCH:
		case TAG_ID.SECTION:
		case TAG_ID.SUMMARY:
		case TAG_ID.LISTING:
		case TAG_ID.FIELDSET:
		case TAG_ID.BLOCKQUOTE:
		case TAG_ID.FIGCAPTION:
			addressEndTagInBody(p, token);
			break;
		case TAG_ID.LI:
			liEndTagInBody(p);
			break;
		case TAG_ID.DD:
		case TAG_ID.DT:
			ddEndTagInBody(p, token);
			break;
		case TAG_ID.H1:
		case TAG_ID.H2:
		case TAG_ID.H3:
		case TAG_ID.H4:
		case TAG_ID.H5:
		case TAG_ID.H6:
			numberedHeaderEndTagInBody(p);
			break;
		case TAG_ID.BR:
			brEndTagInBody(p);
			break;
		case TAG_ID.BODY:
			bodyEndTagInBody(p, token);
			break;
		case TAG_ID.HTML:
			htmlEndTagInBody(p, token);
			break;
		case TAG_ID.FORM:
			formEndTagInBody(p);
			break;
		case TAG_ID.APPLET:
		case TAG_ID.OBJECT:
		case TAG_ID.MARQUEE:
			appletEndTagInBody(p, token);
			break;
		case TAG_ID.TEMPLATE:
			templateEndTagInHead(p, token);
			break;
		default: genericEndTagInBody(p, token);
	}
}
function eofInBody(p, token) {
	if (p.tmplInsertionModeStack.length > 0) eofInTemplate(p, token);
	else stopParsing(p, token);
}
function endTagInText(p, token) {
	var _a$1;
	if (token.tagID === TAG_ID.SCRIPT) (_a$1 = p.scriptHandler) === null || _a$1 === void 0 || _a$1.call(p, p.openElements.current);
	p.openElements.pop();
	p.insertionMode = p.originalInsertionMode;
}
function eofInText(p, token) {
	p._err(token, ERR.eofInElementThatCanContainOnlyText);
	p.openElements.pop();
	p.insertionMode = p.originalInsertionMode;
	p.onEof(token);
}
function characterInTable(p, token) {
	if (p.openElements.currentTagId !== void 0 && TABLE_STRUCTURE_TAGS.has(p.openElements.currentTagId)) {
		p.pendingCharacterTokens.length = 0;
		p.hasNonWhitespacePendingCharacterToken = false;
		p.originalInsertionMode = p.insertionMode;
		p.insertionMode = InsertionMode.IN_TABLE_TEXT;
		switch (token.type) {
			case TokenType.CHARACTER:
				characterInTableText(p, token);
				break;
			case TokenType.WHITESPACE_CHARACTER:
				whitespaceCharacterInTableText(p, token);
				break;
		}
	} else tokenInTable(p, token);
}
function captionStartTagInTable(p, token) {
	p.openElements.clearBackToTableContext();
	p.activeFormattingElements.insertMarker();
	p._insertElement(token, NS$1.HTML);
	p.insertionMode = InsertionMode.IN_CAPTION;
}
function colgroupStartTagInTable(p, token) {
	p.openElements.clearBackToTableContext();
	p._insertElement(token, NS$1.HTML);
	p.insertionMode = InsertionMode.IN_COLUMN_GROUP;
}
function colStartTagInTable(p, token) {
	p.openElements.clearBackToTableContext();
	p._insertFakeElement(TAG_NAMES.COLGROUP, TAG_ID.COLGROUP);
	p.insertionMode = InsertionMode.IN_COLUMN_GROUP;
	startTagInColumnGroup(p, token);
}
function tbodyStartTagInTable(p, token) {
	p.openElements.clearBackToTableContext();
	p._insertElement(token, NS$1.HTML);
	p.insertionMode = InsertionMode.IN_TABLE_BODY;
}
function tdStartTagInTable(p, token) {
	p.openElements.clearBackToTableContext();
	p._insertFakeElement(TAG_NAMES.TBODY, TAG_ID.TBODY);
	p.insertionMode = InsertionMode.IN_TABLE_BODY;
	startTagInTableBody(p, token);
}
function tableStartTagInTable(p, token) {
	if (p.openElements.hasInTableScope(TAG_ID.TABLE)) {
		p.openElements.popUntilTagNamePopped(TAG_ID.TABLE);
		p._resetInsertionMode();
		p._processStartTag(token);
	}
}
function inputStartTagInTable(p, token) {
	if (isHiddenInput(token)) p._appendElement(token, NS$1.HTML);
	else tokenInTable(p, token);
	token.ackSelfClosing = true;
}
function formStartTagInTable(p, token) {
	if (!p.formElement && p.openElements.tmplCount === 0) {
		p._insertElement(token, NS$1.HTML);
		p.formElement = p.openElements.current;
		p.openElements.pop();
	}
}
function startTagInTable(p, token) {
	switch (token.tagID) {
		case TAG_ID.TD:
		case TAG_ID.TH:
		case TAG_ID.TR:
			tdStartTagInTable(p, token);
			break;
		case TAG_ID.STYLE:
		case TAG_ID.SCRIPT:
		case TAG_ID.TEMPLATE:
			startTagInHead(p, token);
			break;
		case TAG_ID.COL:
			colStartTagInTable(p, token);
			break;
		case TAG_ID.FORM:
			formStartTagInTable(p, token);
			break;
		case TAG_ID.TABLE:
			tableStartTagInTable(p, token);
			break;
		case TAG_ID.TBODY:
		case TAG_ID.TFOOT:
		case TAG_ID.THEAD:
			tbodyStartTagInTable(p, token);
			break;
		case TAG_ID.INPUT:
			inputStartTagInTable(p, token);
			break;
		case TAG_ID.CAPTION:
			captionStartTagInTable(p, token);
			break;
		case TAG_ID.COLGROUP:
			colgroupStartTagInTable(p, token);
			break;
		default: tokenInTable(p, token);
	}
}
function endTagInTable(p, token) {
	switch (token.tagID) {
		case TAG_ID.TABLE:
			if (p.openElements.hasInTableScope(TAG_ID.TABLE)) {
				p.openElements.popUntilTagNamePopped(TAG_ID.TABLE);
				p._resetInsertionMode();
			}
			break;
		case TAG_ID.TEMPLATE:
			templateEndTagInHead(p, token);
			break;
		case TAG_ID.BODY:
		case TAG_ID.CAPTION:
		case TAG_ID.COL:
		case TAG_ID.COLGROUP:
		case TAG_ID.HTML:
		case TAG_ID.TBODY:
		case TAG_ID.TD:
		case TAG_ID.TFOOT:
		case TAG_ID.TH:
		case TAG_ID.THEAD:
		case TAG_ID.TR: break;
		default: tokenInTable(p, token);
	}
}
function tokenInTable(p, token) {
	const savedFosterParentingState = p.fosterParentingEnabled;
	p.fosterParentingEnabled = true;
	modeInBody(p, token);
	p.fosterParentingEnabled = savedFosterParentingState;
}
function whitespaceCharacterInTableText(p, token) {
	p.pendingCharacterTokens.push(token);
}
function characterInTableText(p, token) {
	p.pendingCharacterTokens.push(token);
	p.hasNonWhitespacePendingCharacterToken = true;
}
function tokenInTableText(p, token) {
	let i = 0;
	if (p.hasNonWhitespacePendingCharacterToken) for (; i < p.pendingCharacterTokens.length; i++) tokenInTable(p, p.pendingCharacterTokens[i]);
	else for (; i < p.pendingCharacterTokens.length; i++) p._insertCharacters(p.pendingCharacterTokens[i]);
	p.insertionMode = p.originalInsertionMode;
	p._processToken(token);
}
const TABLE_VOID_ELEMENTS = new Set([
	TAG_ID.CAPTION,
	TAG_ID.COL,
	TAG_ID.COLGROUP,
	TAG_ID.TBODY,
	TAG_ID.TD,
	TAG_ID.TFOOT,
	TAG_ID.TH,
	TAG_ID.THEAD,
	TAG_ID.TR
]);
function startTagInCaption(p, token) {
	const tn = token.tagID;
	if (TABLE_VOID_ELEMENTS.has(tn)) {
		if (p.openElements.hasInTableScope(TAG_ID.CAPTION)) {
			p.openElements.generateImpliedEndTags();
			p.openElements.popUntilTagNamePopped(TAG_ID.CAPTION);
			p.activeFormattingElements.clearToLastMarker();
			p.insertionMode = InsertionMode.IN_TABLE;
			startTagInTable(p, token);
		}
	} else startTagInBody(p, token);
}
function endTagInCaption(p, token) {
	const tn = token.tagID;
	switch (tn) {
		case TAG_ID.CAPTION:
		case TAG_ID.TABLE:
			if (p.openElements.hasInTableScope(TAG_ID.CAPTION)) {
				p.openElements.generateImpliedEndTags();
				p.openElements.popUntilTagNamePopped(TAG_ID.CAPTION);
				p.activeFormattingElements.clearToLastMarker();
				p.insertionMode = InsertionMode.IN_TABLE;
				if (tn === TAG_ID.TABLE) endTagInTable(p, token);
			}
			break;
		case TAG_ID.BODY:
		case TAG_ID.COL:
		case TAG_ID.COLGROUP:
		case TAG_ID.HTML:
		case TAG_ID.TBODY:
		case TAG_ID.TD:
		case TAG_ID.TFOOT:
		case TAG_ID.TH:
		case TAG_ID.THEAD:
		case TAG_ID.TR: break;
		default: endTagInBody(p, token);
	}
}
function startTagInColumnGroup(p, token) {
	switch (token.tagID) {
		case TAG_ID.HTML:
			startTagInBody(p, token);
			break;
		case TAG_ID.COL:
			p._appendElement(token, NS$1.HTML);
			token.ackSelfClosing = true;
			break;
		case TAG_ID.TEMPLATE:
			startTagInHead(p, token);
			break;
		default: tokenInColumnGroup(p, token);
	}
}
function endTagInColumnGroup(p, token) {
	switch (token.tagID) {
		case TAG_ID.COLGROUP:
			if (p.openElements.currentTagId === TAG_ID.COLGROUP) {
				p.openElements.pop();
				p.insertionMode = InsertionMode.IN_TABLE;
			}
			break;
		case TAG_ID.TEMPLATE:
			templateEndTagInHead(p, token);
			break;
		case TAG_ID.COL: break;
		default: tokenInColumnGroup(p, token);
	}
}
function tokenInColumnGroup(p, token) {
	if (p.openElements.currentTagId === TAG_ID.COLGROUP) {
		p.openElements.pop();
		p.insertionMode = InsertionMode.IN_TABLE;
		p._processToken(token);
	}
}
function startTagInTableBody(p, token) {
	switch (token.tagID) {
		case TAG_ID.TR:
			p.openElements.clearBackToTableBodyContext();
			p._insertElement(token, NS$1.HTML);
			p.insertionMode = InsertionMode.IN_ROW;
			break;
		case TAG_ID.TH:
		case TAG_ID.TD:
			p.openElements.clearBackToTableBodyContext();
			p._insertFakeElement(TAG_NAMES.TR, TAG_ID.TR);
			p.insertionMode = InsertionMode.IN_ROW;
			startTagInRow(p, token);
			break;
		case TAG_ID.CAPTION:
		case TAG_ID.COL:
		case TAG_ID.COLGROUP:
		case TAG_ID.TBODY:
		case TAG_ID.TFOOT:
		case TAG_ID.THEAD:
			if (p.openElements.hasTableBodyContextInTableScope()) {
				p.openElements.clearBackToTableBodyContext();
				p.openElements.pop();
				p.insertionMode = InsertionMode.IN_TABLE;
				startTagInTable(p, token);
			}
			break;
		default: startTagInTable(p, token);
	}
}
function endTagInTableBody(p, token) {
	const tn = token.tagID;
	switch (token.tagID) {
		case TAG_ID.TBODY:
		case TAG_ID.TFOOT:
		case TAG_ID.THEAD:
			if (p.openElements.hasInTableScope(tn)) {
				p.openElements.clearBackToTableBodyContext();
				p.openElements.pop();
				p.insertionMode = InsertionMode.IN_TABLE;
			}
			break;
		case TAG_ID.TABLE:
			if (p.openElements.hasTableBodyContextInTableScope()) {
				p.openElements.clearBackToTableBodyContext();
				p.openElements.pop();
				p.insertionMode = InsertionMode.IN_TABLE;
				endTagInTable(p, token);
			}
			break;
		case TAG_ID.BODY:
		case TAG_ID.CAPTION:
		case TAG_ID.COL:
		case TAG_ID.COLGROUP:
		case TAG_ID.HTML:
		case TAG_ID.TD:
		case TAG_ID.TH:
		case TAG_ID.TR: break;
		default: endTagInTable(p, token);
	}
}
function startTagInRow(p, token) {
	switch (token.tagID) {
		case TAG_ID.TH:
		case TAG_ID.TD:
			p.openElements.clearBackToTableRowContext();
			p._insertElement(token, NS$1.HTML);
			p.insertionMode = InsertionMode.IN_CELL;
			p.activeFormattingElements.insertMarker();
			break;
		case TAG_ID.CAPTION:
		case TAG_ID.COL:
		case TAG_ID.COLGROUP:
		case TAG_ID.TBODY:
		case TAG_ID.TFOOT:
		case TAG_ID.THEAD:
		case TAG_ID.TR:
			if (p.openElements.hasInTableScope(TAG_ID.TR)) {
				p.openElements.clearBackToTableRowContext();
				p.openElements.pop();
				p.insertionMode = InsertionMode.IN_TABLE_BODY;
				startTagInTableBody(p, token);
			}
			break;
		default: startTagInTable(p, token);
	}
}
function endTagInRow(p, token) {
	switch (token.tagID) {
		case TAG_ID.TR:
			if (p.openElements.hasInTableScope(TAG_ID.TR)) {
				p.openElements.clearBackToTableRowContext();
				p.openElements.pop();
				p.insertionMode = InsertionMode.IN_TABLE_BODY;
			}
			break;
		case TAG_ID.TABLE:
			if (p.openElements.hasInTableScope(TAG_ID.TR)) {
				p.openElements.clearBackToTableRowContext();
				p.openElements.pop();
				p.insertionMode = InsertionMode.IN_TABLE_BODY;
				endTagInTableBody(p, token);
			}
			break;
		case TAG_ID.TBODY:
		case TAG_ID.TFOOT:
		case TAG_ID.THEAD:
			if (p.openElements.hasInTableScope(token.tagID) || p.openElements.hasInTableScope(TAG_ID.TR)) {
				p.openElements.clearBackToTableRowContext();
				p.openElements.pop();
				p.insertionMode = InsertionMode.IN_TABLE_BODY;
				endTagInTableBody(p, token);
			}
			break;
		case TAG_ID.BODY:
		case TAG_ID.CAPTION:
		case TAG_ID.COL:
		case TAG_ID.COLGROUP:
		case TAG_ID.HTML:
		case TAG_ID.TD:
		case TAG_ID.TH: break;
		default: endTagInTable(p, token);
	}
}
function startTagInCell(p, token) {
	const tn = token.tagID;
	if (TABLE_VOID_ELEMENTS.has(tn)) {
		if (p.openElements.hasInTableScope(TAG_ID.TD) || p.openElements.hasInTableScope(TAG_ID.TH)) {
			p._closeTableCell();
			startTagInRow(p, token);
		}
	} else startTagInBody(p, token);
}
function endTagInCell(p, token) {
	const tn = token.tagID;
	switch (tn) {
		case TAG_ID.TD:
		case TAG_ID.TH:
			if (p.openElements.hasInTableScope(tn)) {
				p.openElements.generateImpliedEndTags();
				p.openElements.popUntilTagNamePopped(tn);
				p.activeFormattingElements.clearToLastMarker();
				p.insertionMode = InsertionMode.IN_ROW;
			}
			break;
		case TAG_ID.TABLE:
		case TAG_ID.TBODY:
		case TAG_ID.TFOOT:
		case TAG_ID.THEAD:
		case TAG_ID.TR:
			if (p.openElements.hasInTableScope(tn)) {
				p._closeTableCell();
				endTagInRow(p, token);
			}
			break;
		case TAG_ID.BODY:
		case TAG_ID.CAPTION:
		case TAG_ID.COL:
		case TAG_ID.COLGROUP:
		case TAG_ID.HTML: break;
		default: endTagInBody(p, token);
	}
}
function startTagInSelect(p, token) {
	switch (token.tagID) {
		case TAG_ID.HTML:
			startTagInBody(p, token);
			break;
		case TAG_ID.OPTION:
			if (p.openElements.currentTagId === TAG_ID.OPTION) p.openElements.pop();
			p._insertElement(token, NS$1.HTML);
			break;
		case TAG_ID.OPTGROUP:
			if (p.openElements.currentTagId === TAG_ID.OPTION) p.openElements.pop();
			if (p.openElements.currentTagId === TAG_ID.OPTGROUP) p.openElements.pop();
			p._insertElement(token, NS$1.HTML);
			break;
		case TAG_ID.HR:
			if (p.openElements.currentTagId === TAG_ID.OPTION) p.openElements.pop();
			if (p.openElements.currentTagId === TAG_ID.OPTGROUP) p.openElements.pop();
			p._appendElement(token, NS$1.HTML);
			token.ackSelfClosing = true;
			break;
		case TAG_ID.INPUT:
		case TAG_ID.KEYGEN:
		case TAG_ID.TEXTAREA:
		case TAG_ID.SELECT:
			if (p.openElements.hasInSelectScope(TAG_ID.SELECT)) {
				p.openElements.popUntilTagNamePopped(TAG_ID.SELECT);
				p._resetInsertionMode();
				if (token.tagID !== TAG_ID.SELECT) p._processStartTag(token);
			}
			break;
		case TAG_ID.SCRIPT:
		case TAG_ID.TEMPLATE:
			startTagInHead(p, token);
			break;
		default:
	}
}
function endTagInSelect(p, token) {
	switch (token.tagID) {
		case TAG_ID.OPTGROUP:
			if (p.openElements.stackTop > 0 && p.openElements.currentTagId === TAG_ID.OPTION && p.openElements.tagIDs[p.openElements.stackTop - 1] === TAG_ID.OPTGROUP) p.openElements.pop();
			if (p.openElements.currentTagId === TAG_ID.OPTGROUP) p.openElements.pop();
			break;
		case TAG_ID.OPTION:
			if (p.openElements.currentTagId === TAG_ID.OPTION) p.openElements.pop();
			break;
		case TAG_ID.SELECT:
			if (p.openElements.hasInSelectScope(TAG_ID.SELECT)) {
				p.openElements.popUntilTagNamePopped(TAG_ID.SELECT);
				p._resetInsertionMode();
			}
			break;
		case TAG_ID.TEMPLATE:
			templateEndTagInHead(p, token);
			break;
		default:
	}
}
function startTagInSelectInTable(p, token) {
	const tn = token.tagID;
	if (tn === TAG_ID.CAPTION || tn === TAG_ID.TABLE || tn === TAG_ID.TBODY || tn === TAG_ID.TFOOT || tn === TAG_ID.THEAD || tn === TAG_ID.TR || tn === TAG_ID.TD || tn === TAG_ID.TH) {
		p.openElements.popUntilTagNamePopped(TAG_ID.SELECT);
		p._resetInsertionMode();
		p._processStartTag(token);
	} else startTagInSelect(p, token);
}
function endTagInSelectInTable(p, token) {
	const tn = token.tagID;
	if (tn === TAG_ID.CAPTION || tn === TAG_ID.TABLE || tn === TAG_ID.TBODY || tn === TAG_ID.TFOOT || tn === TAG_ID.THEAD || tn === TAG_ID.TR || tn === TAG_ID.TD || tn === TAG_ID.TH) {
		if (p.openElements.hasInTableScope(tn)) {
			p.openElements.popUntilTagNamePopped(TAG_ID.SELECT);
			p._resetInsertionMode();
			p.onEndTag(token);
		}
	} else endTagInSelect(p, token);
}
function startTagInTemplate(p, token) {
	switch (token.tagID) {
		case TAG_ID.BASE:
		case TAG_ID.BASEFONT:
		case TAG_ID.BGSOUND:
		case TAG_ID.LINK:
		case TAG_ID.META:
		case TAG_ID.NOFRAMES:
		case TAG_ID.SCRIPT:
		case TAG_ID.STYLE:
		case TAG_ID.TEMPLATE:
		case TAG_ID.TITLE:
			startTagInHead(p, token);
			break;
		case TAG_ID.CAPTION:
		case TAG_ID.COLGROUP:
		case TAG_ID.TBODY:
		case TAG_ID.TFOOT:
		case TAG_ID.THEAD:
			p.tmplInsertionModeStack[0] = InsertionMode.IN_TABLE;
			p.insertionMode = InsertionMode.IN_TABLE;
			startTagInTable(p, token);
			break;
		case TAG_ID.COL:
			p.tmplInsertionModeStack[0] = InsertionMode.IN_COLUMN_GROUP;
			p.insertionMode = InsertionMode.IN_COLUMN_GROUP;
			startTagInColumnGroup(p, token);
			break;
		case TAG_ID.TR:
			p.tmplInsertionModeStack[0] = InsertionMode.IN_TABLE_BODY;
			p.insertionMode = InsertionMode.IN_TABLE_BODY;
			startTagInTableBody(p, token);
			break;
		case TAG_ID.TD:
		case TAG_ID.TH:
			p.tmplInsertionModeStack[0] = InsertionMode.IN_ROW;
			p.insertionMode = InsertionMode.IN_ROW;
			startTagInRow(p, token);
			break;
		default:
			p.tmplInsertionModeStack[0] = InsertionMode.IN_BODY;
			p.insertionMode = InsertionMode.IN_BODY;
			startTagInBody(p, token);
	}
}
function endTagInTemplate(p, token) {
	if (token.tagID === TAG_ID.TEMPLATE) templateEndTagInHead(p, token);
}
function eofInTemplate(p, token) {
	if (p.openElements.tmplCount > 0) {
		p.openElements.popUntilTagNamePopped(TAG_ID.TEMPLATE);
		p.activeFormattingElements.clearToLastMarker();
		p.tmplInsertionModeStack.shift();
		p._resetInsertionMode();
		p.onEof(token);
	} else stopParsing(p, token);
}
function startTagAfterBody(p, token) {
	if (token.tagID === TAG_ID.HTML) startTagInBody(p, token);
	else tokenAfterBody(p, token);
}
function endTagAfterBody(p, token) {
	var _a$1;
	if (token.tagID === TAG_ID.HTML) {
		if (!p.fragmentContext) p.insertionMode = InsertionMode.AFTER_AFTER_BODY;
		if (p.options.sourceCodeLocationInfo && p.openElements.tagIDs[0] === TAG_ID.HTML) {
			p._setEndLocation(p.openElements.items[0], token);
			const bodyElement = p.openElements.items[1];
			if (bodyElement && !((_a$1 = p.treeAdapter.getNodeSourceCodeLocation(bodyElement)) === null || _a$1 === void 0 ? void 0 : _a$1.endTag)) p._setEndLocation(bodyElement, token);
		}
	} else tokenAfterBody(p, token);
}
function tokenAfterBody(p, token) {
	p.insertionMode = InsertionMode.IN_BODY;
	modeInBody(p, token);
}
function startTagInFrameset(p, token) {
	switch (token.tagID) {
		case TAG_ID.HTML:
			startTagInBody(p, token);
			break;
		case TAG_ID.FRAMESET:
			p._insertElement(token, NS$1.HTML);
			break;
		case TAG_ID.FRAME:
			p._appendElement(token, NS$1.HTML);
			token.ackSelfClosing = true;
			break;
		case TAG_ID.NOFRAMES:
			startTagInHead(p, token);
			break;
		default:
	}
}
function endTagInFrameset(p, token) {
	if (token.tagID === TAG_ID.FRAMESET && !p.openElements.isRootHtmlElementCurrent()) {
		p.openElements.pop();
		if (!p.fragmentContext && p.openElements.currentTagId !== TAG_ID.FRAMESET) p.insertionMode = InsertionMode.AFTER_FRAMESET;
	}
}
function startTagAfterFrameset(p, token) {
	switch (token.tagID) {
		case TAG_ID.HTML:
			startTagInBody(p, token);
			break;
		case TAG_ID.NOFRAMES:
			startTagInHead(p, token);
			break;
		default:
	}
}
function endTagAfterFrameset(p, token) {
	if (token.tagID === TAG_ID.HTML) p.insertionMode = InsertionMode.AFTER_AFTER_FRAMESET;
}
function startTagAfterAfterBody(p, token) {
	if (token.tagID === TAG_ID.HTML) startTagInBody(p, token);
	else tokenAfterAfterBody(p, token);
}
function tokenAfterAfterBody(p, token) {
	p.insertionMode = InsertionMode.IN_BODY;
	modeInBody(p, token);
}
function startTagAfterAfterFrameset(p, token) {
	switch (token.tagID) {
		case TAG_ID.HTML:
			startTagInBody(p, token);
			break;
		case TAG_ID.NOFRAMES:
			startTagInHead(p, token);
			break;
		default:
	}
}
function nullCharacterInForeignContent(p, token) {
	token.chars = REPLACEMENT_CHARACTER;
	p._insertCharacters(token);
}
function characterInForeignContent(p, token) {
	p._insertCharacters(token);
	p.framesetOk = false;
}
function popUntilHtmlOrIntegrationPoint(p) {
	while (p.treeAdapter.getNamespaceURI(p.openElements.current) !== NS$1.HTML && p.openElements.currentTagId !== void 0 && !p._isIntegrationPoint(p.openElements.currentTagId, p.openElements.current)) p.openElements.pop();
}
function startTagInForeignContent(p, token) {
	if (causesExit(token)) {
		popUntilHtmlOrIntegrationPoint(p);
		p._startTagOutsideForeignContent(token);
	} else {
		const current = p._getAdjustedCurrentElement();
		const currentNs = p.treeAdapter.getNamespaceURI(current);
		if (currentNs === NS$1.MATHML) adjustTokenMathMLAttrs(token);
		else if (currentNs === NS$1.SVG) {
			adjustTokenSVGTagName(token);
			adjustTokenSVGAttrs(token);
		}
		adjustTokenXMLAttrs(token);
		if (token.selfClosing) p._appendElement(token, currentNs);
		else p._insertElement(token, currentNs);
		token.ackSelfClosing = true;
	}
}
function endTagInForeignContent(p, token) {
	if (token.tagID === TAG_ID.P || token.tagID === TAG_ID.BR) {
		popUntilHtmlOrIntegrationPoint(p);
		p._endTagOutsideForeignContent(token);
		return;
	}
	for (let i = p.openElements.stackTop; i > 0; i--) {
		const element$5 = p.openElements.items[i];
		if (p.treeAdapter.getNamespaceURI(element$5) === NS$1.HTML) {
			p._endTagOutsideForeignContent(token);
			break;
		}
		const tagName = p.treeAdapter.getTagName(element$5);
		if (tagName.toLowerCase() === token.tagName) {
			token.tagName = tagName;
			p.openElements.shortenToLength(i);
			break;
		}
	}
}

//#endregion
//#region node_modules/hast-util-raw/node_modules/parse5/dist/serializer/index.js
const VOID_ELEMENTS = new Set([
	TAG_NAMES.AREA,
	TAG_NAMES.BASE,
	TAG_NAMES.BASEFONT,
	TAG_NAMES.BGSOUND,
	TAG_NAMES.BR,
	TAG_NAMES.COL,
	TAG_NAMES.EMBED,
	TAG_NAMES.FRAME,
	TAG_NAMES.HR,
	TAG_NAMES.IMG,
	TAG_NAMES.INPUT,
	TAG_NAMES.KEYGEN,
	TAG_NAMES.LINK,
	TAG_NAMES.META,
	TAG_NAMES.PARAM,
	TAG_NAMES.SOURCE,
	TAG_NAMES.TRACK,
	TAG_NAMES.WBR
]);

//#endregion
//#region node_modules/hast-util-raw/lib/index.js
const gfmTagfilterExpression = /<(\/?)(iframe|noembed|noframes|plaintext|script|style|textarea|title|xmp)(?=[\t\n\f\r />])/gi;
const knownMdxNames = new Set([
	"mdxFlowExpression",
	"mdxJsxFlowElement",
	"mdxJsxTextElement",
	"mdxTextExpression",
	"mdxjsEsm"
]);
/** @type {ParserOptions<DefaultTreeAdapterMap>} */
const parseOptions = {
	sourceCodeLocationInfo: true,
	scriptingEnabled: false
};
/**
* Pass a hast tree through an HTML parser, which will fix nesting, and turn
* raw nodes into actual nodes.
*
* @param {Nodes} tree
*   Original hast tree to transform.
* @param {Options | null | undefined} [options]
*   Configuration (optional).
* @returns {Nodes}
*   Parsed again tree.
*/
function raw(tree, options) {
	const document$3 = documentMode(tree);
	/** @type {(node: Nodes, state: State) => undefined} */
	const one$4 = zwitch("type", {
		handlers: {
			root: root$2,
			element: element$1,
			text: text$3,
			comment: comment$1,
			doctype: doctype$1,
			raw: handleRaw
		},
		unknown
	});
	/** @type {State} */
	const state = {
		parser: document$3 ? new Parser(parseOptions) : Parser.getFragmentParser(void 0, parseOptions),
		handle(node$1) {
			one$4(node$1, state);
		},
		stitches: false,
		options: options || {}
	};
	one$4(tree, state);
	resetTokenizer(state, pointStart());
	const result = fromParse5(document$3 ? state.parser.document : state.parser.getFragment(), { file: state.options.file });
	if (state.stitches) visit(result, "comment", function(node$1, index$2, parent) {
		const stitch$1 = node$1;
		if (stitch$1.value.stitch && parent && index$2 !== void 0) {
			/** @type {Array<RootContent>} */
			const siblings = parent.children;
			siblings[index$2] = stitch$1.value.stitch;
			return index$2;
		}
	});
	if (result.type === "root" && result.children.length === 1 && result.children[0].type === tree.type) return result.children[0];
	return result;
}
/**
* Transform all nodes
*
* @param {Array<RootContent>} nodes
*   hast content.
* @param {State} state
*   Info passed around about the current state.
* @returns {undefined}
*   Nothing.
*/
function all(nodes, state) {
	let index$2 = -1;
	/* istanbul ignore else - invalid nodes, see rehypejs/rehype-raw#7. */
	if (nodes) while (++index$2 < nodes.length) state.handle(nodes[index$2]);
}
/**
* Transform a root.
*
* @param {Root} node
*   hast root node.
* @param {State} state
*   Info passed around about the current state.
* @returns {undefined}
*   Nothing.
*/
function root$2(node$1, state) {
	all(node$1.children, state);
}
/**
* Transform an element.
*
* @param {Element} node
*   hast element node.
* @param {State} state
*   Info passed around about the current state.
* @returns {undefined}
*   Nothing.
*/
function element$1(node$1, state) {
	startTag(node$1, state);
	all(node$1.children, state);
	endTag(node$1, state);
}
/**
* Transform a text.
*
* @param {Text} node
*   hast text node.
* @param {State} state
*   Info passed around about the current state.
* @returns {undefined}
*   Nothing.
*/
function text$3(node$1, state) {
	if (state.parser.tokenizer.state > 4) state.parser.tokenizer.state = 0;
	/** @type {Token.CharacterToken} */
	const token = {
		type: TokenType.CHARACTER,
		chars: node$1.value,
		location: createParse5Location(node$1)
	};
	resetTokenizer(state, pointStart(node$1));
	state.parser.currentToken = token;
	state.parser._processToken(state.parser.currentToken);
}
/**
* Transform a doctype.
*
* @param {Doctype} node
*   hast doctype node.
* @param {State} state
*   Info passed around about the current state.
* @returns {undefined}
*   Nothing.
*/
function doctype$1(node$1, state) {
	/** @type {Token.DoctypeToken} */
	const token = {
		type: TokenType.DOCTYPE,
		name: "html",
		forceQuirks: false,
		publicId: "",
		systemId: "",
		location: createParse5Location(node$1)
	};
	resetTokenizer(state, pointStart(node$1));
	state.parser.currentToken = token;
	state.parser._processToken(state.parser.currentToken);
}
/**
* Transform a stitch.
*
* @param {Nodes} node
*   unknown node.
* @param {State} state
*   Info passed around about the current state.
* @returns {undefined}
*   Nothing.
*/
function stitch(node$1, state) {
	state.stitches = true;
	/** @type {Nodes} */
	const clone = cloneWithoutChildren(node$1);
	if ("children" in node$1 && "children" in clone) clone.children = raw({
		type: "root",
		children: node$1.children
	}, state.options).children;
	comment$1({
		type: "comment",
		value: { stitch: clone }
	}, state);
}
/**
* Transform a comment (or stitch).
*
* @param {Comment | Stitch} node
*   hast comment node.
* @param {State} state
*   Info passed around about the current state.
* @returns {undefined}
*   Nothing.
*/
function comment$1(node$1, state) {
	/** @type {string} */
	const data = node$1.value;
	/** @type {Token.CommentToken} */
	const token = {
		type: TokenType.COMMENT,
		data,
		location: createParse5Location(node$1)
	};
	resetTokenizer(state, pointStart(node$1));
	state.parser.currentToken = token;
	state.parser._processToken(state.parser.currentToken);
}
/**
* Transform a raw node.
*
* @param {Raw} node
*   hast raw node.
* @param {State} state
*   Info passed around about the current state.
* @returns {undefined}
*   Nothing.
*/
function handleRaw(node$1, state) {
	state.parser.tokenizer.preprocessor.html = "";
	state.parser.tokenizer.preprocessor.pos = -1;
	state.parser.tokenizer.preprocessor.lastGapPos = -2;
	state.parser.tokenizer.preprocessor.gapStack = [];
	state.parser.tokenizer.preprocessor.skipNextNewLine = false;
	state.parser.tokenizer.preprocessor.lastChunkWritten = false;
	state.parser.tokenizer.preprocessor.endOfChunkHit = false;
	state.parser.tokenizer.preprocessor.isEol = false;
	setPoint(state, pointStart(node$1));
	state.parser.tokenizer.write(state.options.tagfilter ? node$1.value.replace(gfmTagfilterExpression, "&lt;$1$2") : node$1.value, false);
	state.parser.tokenizer._runParsingLoop();
	/* c8 ignore next 12 -- removed in <https://github.com/inikulin/parse5/pull/897> */
	if (state.parser.tokenizer.state === 72 || state.parser.tokenizer.state === 78) {
		state.parser.tokenizer.preprocessor.lastChunkWritten = true;
		/** @type {number} */
		const cp = state.parser.tokenizer._consume();
		state.parser.tokenizer._callState(cp);
	}
}
/**
* Crash on an unknown node.
*
* @param {unknown} node_
*   unknown node.
* @param {State} state
*   Info passed around about the current state.
* @returns {undefined}
*   Never.
*/
function unknown(node_, state) {
	const node$1 = node_;
	if (state.options.passThrough && state.options.passThrough.includes(node$1.type)) stitch(node$1, state);
	else {
		let extra = "";
		if (knownMdxNames.has(node$1.type)) extra = ". It looks like you are using MDX nodes with `hast-util-raw` (or `rehype-raw`). If you use this because you are using remark or rehype plugins that inject `'html'` nodes, then please raise an issue with that plugin, as its a bad and slow idea. If you use this because you are using markdown syntax, then you have to configure this utility (or plugin) to pass through these nodes (see `passThrough` in docs), but you can also migrate to use the MDX syntax";
		throw new Error("Cannot compile `" + node$1.type + "` node" + extra);
	}
}
/**
* Reset the tokenizer of a parser.
*
* @param {State} state
*   Info passed around about the current state.
* @param {Point | undefined} point
*   Point.
* @returns {undefined}
*   Nothing.
*/
function resetTokenizer(state, point$4) {
	setPoint(state, point$4);
	/** @type {Token.CharacterToken} */
	const token = state.parser.tokenizer.currentCharacterToken;
	if (token && token.location) {
		token.location.endLine = state.parser.tokenizer.preprocessor.line;
		token.location.endCol = state.parser.tokenizer.preprocessor.col + 1;
		token.location.endOffset = state.parser.tokenizer.preprocessor.offset + 1;
		state.parser.currentToken = token;
		state.parser._processToken(state.parser.currentToken);
	}
	state.parser.tokenizer.paused = false;
	state.parser.tokenizer.inLoop = false;
	state.parser.tokenizer.active = false;
	state.parser.tokenizer.returnState = TokenizerMode.DATA;
	state.parser.tokenizer.charRefCode = -1;
	state.parser.tokenizer.consumedAfterSnapshot = -1;
	state.parser.tokenizer.currentLocation = null;
	state.parser.tokenizer.currentCharacterToken = null;
	state.parser.tokenizer.currentToken = null;
	state.parser.tokenizer.currentAttr = {
		name: "",
		value: ""
	};
}
/**
* Set current location.
*
* @param {State} state
*   Info passed around about the current state.
* @param {Point | undefined} point
*   Point.
* @returns {undefined}
*   Nothing.
*/
function setPoint(state, point$4) {
	if (point$4 && point$4.offset !== void 0) {
		/** @type {Token.Location} */
		const location$1 = {
			startLine: point$4.line,
			startCol: point$4.column,
			startOffset: point$4.offset,
			endLine: -1,
			endCol: -1,
			endOffset: -1
		};
		state.parser.tokenizer.preprocessor.lineStartPos = -point$4.column + 1;
		state.parser.tokenizer.preprocessor.droppedBufferSize = point$4.offset;
		state.parser.tokenizer.preprocessor.line = point$4.line;
		state.parser.tokenizer.currentLocation = location$1;
	}
}
/**
* Emit a start tag.
*
* @param {Element} node
*   Element.
* @param {State} state
*   Info passed around about the current state.
* @returns {undefined}
*   Nothing.
*/
function startTag(node$1, state) {
	const tagName = node$1.tagName.toLowerCase();
	if (state.parser.tokenizer.state === TokenizerMode.PLAINTEXT) return;
	resetTokenizer(state, pointStart(node$1));
	const current = state.parser.openElements.current;
	let ns = "namespaceURI" in current ? current.namespaceURI : webNamespaces.html;
	if (ns === webNamespaces.html && tagName === "svg") ns = webNamespaces.svg;
	const result = toParse5({
		...node$1,
		children: []
	}, { space: ns === webNamespaces.svg ? "svg" : "html" });
	/** @type {Token.TagToken} */
	const tag = {
		type: TokenType.START_TAG,
		tagName,
		tagID: getTagID(tagName),
		selfClosing: false,
		ackSelfClosing: false,
		attrs: "attrs" in result ? result.attrs : [],
		location: createParse5Location(node$1)
	};
	state.parser.currentToken = tag;
	state.parser._processToken(state.parser.currentToken);
	state.parser.tokenizer.lastStartTagName = tagName;
}
/**
* Emit an end tag.
*
* @param {Element} node
*   Element.
* @param {State} state
*   Info passed around about the current state.
* @returns {undefined}
*   Nothing.
*/
function endTag(node$1, state) {
	const tagName = node$1.tagName.toLowerCase();
	if (!state.parser.tokenizer.inForeignNode && htmlVoidElements.includes(tagName)) return;
	if (state.parser.tokenizer.state === TokenizerMode.PLAINTEXT) return;
	resetTokenizer(state, pointEnd(node$1));
	/** @type {Token.TagToken} */
	const tag = {
		type: TokenType.END_TAG,
		tagName,
		tagID: getTagID(tagName),
		selfClosing: false,
		ackSelfClosing: false,
		attrs: [],
		location: createParse5Location(node$1)
	};
	state.parser.currentToken = tag;
	state.parser._processToken(state.parser.currentToken);
	if (tagName === state.parser.tokenizer.lastStartTagName && (state.parser.tokenizer.state === TokenizerMode.RCDATA || state.parser.tokenizer.state === TokenizerMode.RAWTEXT || state.parser.tokenizer.state === TokenizerMode.SCRIPT_DATA)) state.parser.tokenizer.state = TokenizerMode.DATA;
}
/**
* Check if `node` represents a whole document or a fragment.
*
* @param {Nodes} node
*   hast node.
* @returns {boolean}
*   Whether this represents a whole document or a fragment.
*/
function documentMode(node$1) {
	const head = node$1.type === "root" ? node$1.children[0] : node$1;
	return Boolean(head && (head.type === "doctype" || head.type === "element" && head.tagName.toLowerCase() === "html"));
}
/**
* Get a `parse5` location from a node.
*
* @param {Nodes | Stitch} node
*   hast node.
* @returns {Token.Location}
*   `parse5` location.
*/
function createParse5Location(node$1) {
	const start = pointStart(node$1) || {
		line: void 0,
		column: void 0,
		offset: void 0
	};
	const end = pointEnd(node$1) || {
		line: void 0,
		column: void 0,
		offset: void 0
	};
	return {
		startLine: start.line,
		startCol: start.column,
		startOffset: start.offset,
		endLine: end.line,
		endCol: end.column,
		endOffset: end.offset
	};
}
/**
* @template {Nodes} NodeType
*   Node type.
* @param {NodeType} node
*   Node to clone.
* @returns {NodeType}
*   Cloned node, without children.
*/
function cloneWithoutChildren(node$1) {
	return "children" in node$1 ? esm_default({
		...node$1,
		children: []
	}) : esm_default(node$1);
}

//#endregion
//#region node_modules/rehype-raw/lib/index.js
/**
* Parse the tree (and raw nodes) again, keeping positional info okay.
*
* @param {Options | null | undefined}  [options]
*   Configuration (optional).
* @returns
*   Transform.
*/
function rehypeRaw(options) {
	/**
	* @param {Root} tree
	*   Tree.
	* @param {VFile} file
	*   File.
	* @returns {Root}
	*   New tree.
	*/
	return function(tree, file) {
		return raw(tree, {
			...options,
			file
		});
	};
}

//#endregion
//#region node_modules/hast-util-sanitize/lib/schema.js
/**
* @import {Schema} from 'hast-util-sanitize'
*/
const aria = [
	"ariaDescribedBy",
	"ariaLabel",
	"ariaLabelledBy"
];
/**
* Default schema.
*
* Follows GitHub style sanitation.
*
* @type {Schema}
*/
const defaultSchema = {
	ancestors: {
		tbody: ["table"],
		td: ["table"],
		th: ["table"],
		thead: ["table"],
		tfoot: ["table"],
		tr: ["table"]
	},
	attributes: {
		a: [
			...aria,
			"dataFootnoteBackref",
			"dataFootnoteRef",
			["className", "data-footnote-backref"],
			"href"
		],
		blockquote: ["cite"],
		code: [["className", /^language-./]],
		del: ["cite"],
		div: ["itemScope", "itemType"],
		dl: [...aria],
		h2: [["className", "sr-only"]],
		img: [
			...aria,
			"longDesc",
			"src"
		],
		input: [["disabled", true], ["type", "checkbox"]],
		ins: ["cite"],
		li: [["className", "task-list-item"]],
		ol: [...aria, ["className", "contains-task-list"]],
		q: ["cite"],
		section: ["dataFootnotes", ["className", "footnotes"]],
		source: ["srcSet"],
		summary: [...aria],
		table: [...aria],
		ul: [...aria, ["className", "contains-task-list"]],
		"*": [
			"abbr",
			"accept",
			"acceptCharset",
			"accessKey",
			"action",
			"align",
			"alt",
			"axis",
			"border",
			"cellPadding",
			"cellSpacing",
			"char",
			"charOff",
			"charSet",
			"checked",
			"clear",
			"colSpan",
			"color",
			"cols",
			"compact",
			"coords",
			"dateTime",
			"dir",
			"encType",
			"frame",
			"hSpace",
			"headers",
			"height",
			"hrefLang",
			"htmlFor",
			"id",
			"isMap",
			"itemProp",
			"label",
			"lang",
			"maxLength",
			"media",
			"method",
			"multiple",
			"name",
			"noHref",
			"noShade",
			"noWrap",
			"open",
			"prompt",
			"readOnly",
			"rev",
			"rowSpan",
			"rows",
			"rules",
			"scope",
			"selected",
			"shape",
			"size",
			"span",
			"start",
			"summary",
			"tabIndex",
			"title",
			"useMap",
			"vAlign",
			"value",
			"width"
		]
	},
	clobber: [
		"ariaDescribedBy",
		"ariaLabelledBy",
		"id",
		"name"
	],
	clobberPrefix: "user-content-",
	protocols: {
		cite: ["http", "https"],
		href: [
			"http",
			"https",
			"irc",
			"ircs",
			"mailto",
			"xmpp"
		],
		longDesc: ["http", "https"],
		src: ["http", "https"]
	},
	required: { input: {
		disabled: true,
		type: "checkbox"
	} },
	strip: ["script"],
	tagNames: [
		"a",
		"b",
		"blockquote",
		"br",
		"code",
		"dd",
		"del",
		"details",
		"div",
		"dl",
		"dt",
		"em",
		"h1",
		"h2",
		"h3",
		"h4",
		"h5",
		"h6",
		"hr",
		"i",
		"img",
		"input",
		"ins",
		"kbd",
		"li",
		"ol",
		"p",
		"picture",
		"pre",
		"q",
		"rp",
		"rt",
		"ruby",
		"s",
		"samp",
		"section",
		"source",
		"span",
		"strike",
		"strong",
		"sub",
		"summary",
		"sup",
		"table",
		"tbody",
		"td",
		"tfoot",
		"th",
		"thead",
		"tr",
		"tt",
		"ul",
		"var"
	]
};

//#endregion
//#region node_modules/hast-util-sanitize/lib/index.js
const own = {}.hasOwnProperty;
/**
* Sanitize a tree.
*
* @param {Readonly<Nodes>} node
*   Unsafe tree.
* @param {Readonly<Schema> | null | undefined} [options]
*   Configuration (default: `defaultSchema`).
* @returns {Nodes}
*   New, safe tree.
*/
function sanitize(node$1, options) {
	/** @type {Nodes} */
	let result = {
		type: "root",
		children: []
	};
	const replace$1 = transform({
		schema: options ? {
			...defaultSchema,
			...options
		} : defaultSchema,
		stack: []
	}, node$1);
	if (replace$1) if (Array.isArray(replace$1)) if (replace$1.length === 1) result = replace$1[0];
	else result.children = replace$1;
	else result = replace$1;
	return result;
}
/**
* Sanitize `node`.
*
* @param {State} state
*   Info passed around.
* @param {Readonly<unknown>} node
*   Unsafe node.
* @returns {Array<ElementContent> | Nodes | undefined}
*   Safe result.
*/
function transform(state, node$1) {
	if (node$1 && typeof node$1 === "object") {
		const unsafe = node$1;
		switch (typeof unsafe.type === "string" ? unsafe.type : "") {
			case "comment": return comment(state, unsafe);
			case "doctype": return doctype(state, unsafe);
			case "element": return element(state, unsafe);
			case "root": return root$1(state, unsafe);
			case "text": return text$2(state, unsafe);
			default:
		}
	}
}
/**
* Make a safe comment.
*
* @param {State} state
*   Info passed around.
* @param {Readonly<Record<string, Readonly<unknown>>>} unsafe
*   Unsafe comment-like value.
* @returns {Comment | undefined}
*   Safe comment (if with `allowComments`).
*/
function comment(state, unsafe) {
	if (state.schema.allowComments) {
		const result = typeof unsafe.value === "string" ? unsafe.value : "";
		const index$2 = result.indexOf("-->");
		/** @type {Comment} */
		const node$1 = {
			type: "comment",
			value: index$2 < 0 ? result : result.slice(0, index$2)
		};
		patch(node$1, unsafe);
		return node$1;
	}
}
/**
* Make a safe doctype.
*
* @param {State} state
*   Info passed around.
* @param {Readonly<Record<string, Readonly<unknown>>>} unsafe
*   Unsafe doctype-like value.
* @returns {Doctype | undefined}
*   Safe doctype (if with `allowDoctypes`).
*/
function doctype(state, unsafe) {
	if (state.schema.allowDoctypes) {
		/** @type {Doctype} */
		const node$1 = { type: "doctype" };
		patch(node$1, unsafe);
		return node$1;
	}
}
/**
* Make a safe element.
*
* @param {State} state
*   Info passed around.
* @param {Readonly<Record<string, Readonly<unknown>>>} unsafe
*   Unsafe element-like value.
* @returns {Array<ElementContent> | Element | undefined}
*   Safe element.
*/
function element(state, unsafe) {
	const name$1 = typeof unsafe.tagName === "string" ? unsafe.tagName : "";
	state.stack.push(name$1);
	const content$2 = children(state, unsafe.children);
	const properties_ = properties(state, unsafe.properties);
	state.stack.pop();
	let safeElement = false;
	if (name$1 && name$1 !== "*" && (!state.schema.tagNames || state.schema.tagNames.includes(name$1))) {
		safeElement = true;
		if (state.schema.ancestors && own.call(state.schema.ancestors, name$1)) {
			const ancestors = state.schema.ancestors[name$1];
			let index$2 = -1;
			safeElement = false;
			while (++index$2 < ancestors.length) if (state.stack.includes(ancestors[index$2])) safeElement = true;
		}
	}
	if (!safeElement) return state.schema.strip && !state.schema.strip.includes(name$1) ? content$2 : void 0;
	/** @type {Element} */
	const node$1 = {
		type: "element",
		tagName: name$1,
		properties: properties_,
		children: content$2
	};
	patch(node$1, unsafe);
	return node$1;
}
/**
* Make a safe root.
*
* @param {State} state
*   Info passed around.
* @param {Readonly<Record<string, Readonly<unknown>>>} unsafe
*   Unsafe root-like value.
* @returns {Root}
*   Safe root.
*/
function root$1(state, unsafe) {
	/** @type {Root} */
	const node$1 = {
		type: "root",
		children: children(state, unsafe.children)
	};
	patch(node$1, unsafe);
	return node$1;
}
/**
* Make a safe text.
*
* @param {State} _
*   Info passed around.
* @param {Readonly<Record<string, Readonly<unknown>>>} unsafe
*   Unsafe text-like value.
* @returns {Text}
*   Safe text.
*/
function text$2(_, unsafe) {
	/** @type {Text} */
	const node$1 = {
		type: "text",
		value: typeof unsafe.value === "string" ? unsafe.value : ""
	};
	patch(node$1, unsafe);
	return node$1;
}
/**
* Make children safe.
*
* @param {State} state
*   Info passed around.
* @param {Readonly<unknown>} children
*   Unsafe value.
* @returns {Array<Nodes>}
*   Safe children.
*/
function children(state, children$1) {
	/** @type {Array<Nodes>} */
	const results = [];
	if (Array.isArray(children$1)) {
		const childrenUnknown = children$1;
		let index$2 = -1;
		while (++index$2 < childrenUnknown.length) {
			const value = transform(state, childrenUnknown[index$2]);
			if (value) if (Array.isArray(value)) results.push(...value);
			else results.push(value);
		}
	}
	return results;
}
/**
* Make element properties safe.
*
* @param {State} state
*   Info passed around.
* @param {Readonly<unknown>} properties
*   Unsafe value.
* @returns {Properties}
*   Safe value.
*/
function properties(state, properties$1) {
	const tagName = state.stack[state.stack.length - 1];
	const attributes = state.schema.attributes;
	const required = state.schema.required;
	const specific = attributes && own.call(attributes, tagName) ? attributes[tagName] : void 0;
	const defaults = attributes && own.call(attributes, "*") ? attributes["*"] : void 0;
	const properties_ = properties$1 && typeof properties$1 === "object" ? properties$1 : {};
	/** @type {Properties} */
	const result = {};
	/** @type {string} */
	let key;
	for (key in properties_) if (own.call(properties_, key)) {
		const unsafe = properties_[key];
		let safe = propertyValue(state, findDefinition(specific, key), key, unsafe);
		if (safe === null || safe === void 0) safe = propertyValue(state, findDefinition(defaults, key), key, unsafe);
		if (safe !== null && safe !== void 0) result[key] = safe;
	}
	if (required && own.call(required, tagName)) {
		const properties$2 = required[tagName];
		for (key in properties$2) if (own.call(properties$2, key) && !own.call(result, key)) result[key] = properties$2[key];
	}
	return result;
}
/**
* Sanitize a property value.
*
* @param {State} state
*   Info passed around.
* @param {Readonly<PropertyDefinition> | undefined} definition
*   Definition.
* @param {string} key
*   Field name.
* @param {Readonly<unknown>} value
*   Unsafe value (but an array).
* @returns {Array<number | string> | boolean | number | string | undefined}
*   Safe value.
*/
function propertyValue(state, definition$2, key, value) {
	return definition$2 ? Array.isArray(value) ? propertyValueMany(state, definition$2, key, value) : propertyValuePrimitive(state, definition$2, key, value) : void 0;
}
/**
* Sanitize a property value which is a list.
*
* @param {State} state
*   Info passed around.
* @param {Readonly<PropertyDefinition>} definition
*   Definition.
* @param {string} key
*   Field name.
* @param {Readonly<Array<Readonly<unknown>>>} values
*   Unsafe value (but an array).
* @returns {Array<number | string>}
*   Safe value.
*/
function propertyValueMany(state, definition$2, key, values) {
	let index$2 = -1;
	/** @type {Array<number | string>} */
	const result = [];
	while (++index$2 < values.length) {
		const value = propertyValuePrimitive(state, definition$2, key, values[index$2]);
		if (typeof value === "number" || typeof value === "string") result.push(value);
	}
	return result;
}
/**
* Sanitize a property value which is a primitive.
*
* @param {State} state
*   Info passed around.
* @param {Readonly<PropertyDefinition>} definition
*   Definition.
* @param {string} key
*   Field name.
* @param {Readonly<unknown>} value
*   Unsafe value (but not an array).
* @returns {boolean | number | string | undefined}
*   Safe value.
*/
function propertyValuePrimitive(state, definition$2, key, value) {
	if (typeof value !== "boolean" && typeof value !== "number" && typeof value !== "string") return;
	if (!safeProtocol(state, key, value)) return;
	if (typeof definition$2 === "object" && definition$2.length > 1) {
		let ok$2 = false;
		let index$2 = 0;
		while (++index$2 < definition$2.length) {
			const allowed = definition$2[index$2];
			if (allowed && typeof allowed === "object" && "flags" in allowed) {
				if (allowed.test(String(value))) {
					ok$2 = true;
					break;
				}
			} else if (allowed === value) {
				ok$2 = true;
				break;
			}
		}
		if (!ok$2) return;
	}
	return state.schema.clobber && state.schema.clobberPrefix && state.schema.clobber.includes(key) ? state.schema.clobberPrefix + value : value;
}
/**
* Check whether `value` is a safe URL.
*
* @param {State} state
*   Info passed around.
* @param {string} key
*   Field name.
* @param {Readonly<unknown>} value
*   Unsafe value.
* @returns {boolean}
*   Whether it’s a safe value.
*/
function safeProtocol(state, key, value) {
	const protocols = state.schema.protocols && own.call(state.schema.protocols, key) ? state.schema.protocols[key] : void 0;
	if (!protocols || protocols.length === 0) return true;
	const url = String(value);
	const colon = url.indexOf(":");
	const questionMark = url.indexOf("?");
	const numberSign = url.indexOf("#");
	const slash = url.indexOf("/");
	if (colon < 0 || slash > -1 && colon > slash || questionMark > -1 && colon > questionMark || numberSign > -1 && colon > numberSign) return true;
	let index$2 = -1;
	while (++index$2 < protocols.length) {
		const protocol = protocols[index$2];
		if (colon === protocol.length && url.slice(0, protocol.length) === protocol) return true;
	}
	return false;
}
/**
* Add data and position.
*
* @param {Nodes} node
*   Node to patch safe data and position on.
* @param {Readonly<Record<string, Readonly<unknown>>>} unsafe
*   Unsafe node-like value.
* @returns {undefined}
*   Nothing.
*/
function patch(node$1, unsafe) {
	const cleanPosition = position(unsafe);
	if (unsafe.data) node$1.data = esm_default(unsafe.data);
	if (cleanPosition) node$1.position = cleanPosition;
}
/**
*
* @param {Readonly<Array<PropertyDefinition>> | undefined} definitions
* @param {string} key
* @returns {Readonly<PropertyDefinition> | undefined}
*/
function findDefinition(definitions, key) {
	/** @type {PropertyDefinition | undefined} */
	let dataDefault;
	let index$2 = -1;
	if (definitions) while (++index$2 < definitions.length) {
		const entry = definitions[index$2];
		const name$1 = typeof entry === "string" ? entry : entry[0];
		if (name$1 === key) return entry;
		if (name$1 === "data*") dataDefault = entry;
	}
	if (key.length > 4 && key.slice(0, 4).toLowerCase() === "data") return dataDefault;
}

//#endregion
//#region node_modules/rehype-sanitize/lib/index.js
/**
* Sanitize HTML.
*
* @param {Schema | null | undefined} [options]
*   Configuration (optional).
* @returns
*   Transform.
*/
function rehypeSanitize(options) {
	/**
	* @param {Root} tree
	*   Tree.
	* @returns {Root}
	*   New tree.
	*/
	return function(tree) {
		return sanitize(tree, options);
	};
}

//#endregion
//#region node_modules/ccount/index.js
/**
* Count how often a character (or substring) is used in a string.
*
* @param {string} value
*   Value to search in.
* @param {string} character
*   Character (or substring) to look for.
* @return {number}
*   Number of times `character` occurred in `value`.
*/
function ccount(value, character) {
	const source = String(value);
	if (typeof character !== "string") throw new TypeError("Expected character");
	let count = 0;
	let index$2 = source.indexOf(character);
	while (index$2 !== -1) {
		count++;
		index$2 = source.indexOf(character, index$2 + character.length);
	}
	return count;
}

//#endregion
//#region node_modules/escape-string-regexp/index.js
function escapeStringRegexp(string$2) {
	if (typeof string$2 !== "string") throw new TypeError("Expected a string");
	return string$2.replace(/[|\\{}()[\]^$+*?.]/g, "\\$&").replace(/-/g, "\\x2d");
}

//#endregion
//#region node_modules/mdast-util-find-and-replace/lib/index.js
/**
* Find patterns in a tree and replace them.
*
* The algorithm searches the tree in *preorder* for complete values in `Text`
* nodes.
* Partial matches are not supported.
*
* @param {Nodes} tree
*   Tree to change.
* @param {FindAndReplaceList | FindAndReplaceTuple} list
*   Patterns to find.
* @param {Options | null | undefined} [options]
*   Configuration (when `find` is not `Find`).
* @returns {undefined}
*   Nothing.
*/
function findAndReplace(tree, list$3, options) {
	const ignored = convert((options || {}).ignore || []);
	const pairs = toPairs(list$3);
	let pairIndex = -1;
	while (++pairIndex < pairs.length) visitParents(tree, "text", visitor);
	/** @type {BuildVisitor<Root, 'text'>} */
	function visitor(node$1, parents) {
		let index$2 = -1;
		/** @type {Parents | undefined} */
		let grandparent;
		while (++index$2 < parents.length) {
			const parent = parents[index$2];
			/** @type {Array<Nodes> | undefined} */
			const siblings = grandparent ? grandparent.children : void 0;
			if (ignored(parent, siblings ? siblings.indexOf(parent) : void 0, grandparent)) return;
			grandparent = parent;
		}
		if (grandparent) return handler(node$1, parents);
	}
	/**
	* Handle a text node which is not in an ignored parent.
	*
	* @param {Text} node
	*   Text node.
	* @param {Array<Parents>} parents
	*   Parents.
	* @returns {VisitorResult}
	*   Result.
	*/
	function handler(node$1, parents) {
		const parent = parents[parents.length - 1];
		const find$1 = pairs[pairIndex][0];
		const replace$1 = pairs[pairIndex][1];
		let start = 0;
		const index$2 = parent.children.indexOf(node$1);
		let change = false;
		/** @type {Array<PhrasingContent>} */
		let nodes = [];
		find$1.lastIndex = 0;
		let match = find$1.exec(node$1.value);
		while (match) {
			const position$3 = match.index;
			/** @type {RegExpMatchObject} */
			const matchObject = {
				index: match.index,
				input: match.input,
				stack: [...parents, node$1]
			};
			let value = replace$1(...match, matchObject);
			if (typeof value === "string") value = value.length > 0 ? {
				type: "text",
				value
			} : void 0;
			if (value === false) find$1.lastIndex = position$3 + 1;
			else {
				if (start !== position$3) nodes.push({
					type: "text",
					value: node$1.value.slice(start, position$3)
				});
				if (Array.isArray(value)) nodes.push(...value);
				else if (value) nodes.push(value);
				start = position$3 + match[0].length;
				change = true;
			}
			if (!find$1.global) break;
			match = find$1.exec(node$1.value);
		}
		if (change) {
			if (start < node$1.value.length) nodes.push({
				type: "text",
				value: node$1.value.slice(start)
			});
			parent.children.splice(index$2, 1, ...nodes);
		} else nodes = [node$1];
		return index$2 + nodes.length;
	}
}
/**
* Turn a tuple or a list of tuples into pairs.
*
* @param {FindAndReplaceList | FindAndReplaceTuple} tupleOrList
*   Schema.
* @returns {Pairs}
*   Clean pairs.
*/
function toPairs(tupleOrList) {
	/** @type {Pairs} */
	const result = [];
	if (!Array.isArray(tupleOrList)) throw new TypeError("Expected find and replace tuple or list of tuples");
	/** @type {FindAndReplaceList} */
	const list$3 = !tupleOrList[0] || Array.isArray(tupleOrList[0]) ? tupleOrList : [tupleOrList];
	let index$2 = -1;
	while (++index$2 < list$3.length) {
		const tuple = list$3[index$2];
		result.push([toExpression(tuple[0]), toFunction(tuple[1])]);
	}
	return result;
}
/**
* Turn a find into an expression.
*
* @param {Find} find
*   Find.
* @returns {RegExp}
*   Expression.
*/
function toExpression(find$1) {
	return typeof find$1 === "string" ? new RegExp(escapeStringRegexp(find$1), "g") : find$1;
}
/**
* Turn a replace into a function.
*
* @param {Replace} replace
*   Replace.
* @returns {ReplaceFunction}
*   Function.
*/
function toFunction(replace$1) {
	return typeof replace$1 === "function" ? replace$1 : function() {
		return replace$1;
	};
}

//#endregion
//#region node_modules/mdast-util-gfm-autolink-literal/lib/index.js
/** @type {ConstructName} */
const inConstruct = "phrasing";
/** @type {Array<ConstructName>} */
const notInConstruct = [
	"autolink",
	"link",
	"image",
	"label"
];
/**
* Create an extension for `mdast-util-from-markdown` to enable GFM autolink
* literals in markdown.
*
* @returns {FromMarkdownExtension}
*   Extension for `mdast-util-to-markdown` to enable GFM autolink literals.
*/
function gfmAutolinkLiteralFromMarkdown() {
	return {
		transforms: [transformGfmAutolinkLiterals],
		enter: {
			literalAutolink: enterLiteralAutolink,
			literalAutolinkEmail: enterLiteralAutolinkValue,
			literalAutolinkHttp: enterLiteralAutolinkValue,
			literalAutolinkWww: enterLiteralAutolinkValue
		},
		exit: {
			literalAutolink: exitLiteralAutolink,
			literalAutolinkEmail: exitLiteralAutolinkEmail,
			literalAutolinkHttp: exitLiteralAutolinkHttp,
			literalAutolinkWww: exitLiteralAutolinkWww
		}
	};
}
/**
* Create an extension for `mdast-util-to-markdown` to enable GFM autolink
* literals in markdown.
*
* @returns {ToMarkdownExtension}
*   Extension for `mdast-util-to-markdown` to enable GFM autolink literals.
*/
function gfmAutolinkLiteralToMarkdown() {
	return { unsafe: [
		{
			character: "@",
			before: "[+\\-.\\w]",
			after: "[\\-.\\w]",
			inConstruct,
			notInConstruct
		},
		{
			character: ".",
			before: "[Ww]",
			after: "[\\-.\\w]",
			inConstruct,
			notInConstruct
		},
		{
			character: ":",
			before: "[ps]",
			after: "\\/",
			inConstruct,
			notInConstruct
		}
	] };
}
/**
* @this {CompileContext}
* @type {FromMarkdownHandle}
*/
function enterLiteralAutolink(token) {
	this.enter({
		type: "link",
		title: null,
		url: "",
		children: []
	}, token);
}
/**
* @this {CompileContext}
* @type {FromMarkdownHandle}
*/
function enterLiteralAutolinkValue(token) {
	this.config.enter.autolinkProtocol.call(this, token);
}
/**
* @this {CompileContext}
* @type {FromMarkdownHandle}
*/
function exitLiteralAutolinkHttp(token) {
	this.config.exit.autolinkProtocol.call(this, token);
}
/**
* @this {CompileContext}
* @type {FromMarkdownHandle}
*/
function exitLiteralAutolinkWww(token) {
	this.config.exit.data.call(this, token);
	const node$1 = this.stack[this.stack.length - 1];
	/* @__PURE__ */ ok(node$1.type === "link");
	node$1.url = "http://" + this.sliceSerialize(token);
}
/**
* @this {CompileContext}
* @type {FromMarkdownHandle}
*/
function exitLiteralAutolinkEmail(token) {
	this.config.exit.autolinkEmail.call(this, token);
}
/**
* @this {CompileContext}
* @type {FromMarkdownHandle}
*/
function exitLiteralAutolink(token) {
	this.exit(token);
}
/** @type {FromMarkdownTransform} */
function transformGfmAutolinkLiterals(tree) {
	findAndReplace(tree, [[/(https?:\/\/|www(?=\.))([-.\w]+)([^ \t\r\n]*)/gi, findUrl], [/(?<=^|\s|\p{P}|\p{S})([-.\w+]+)@([-\w]+(?:\.[-\w]+)+)/gu, findEmail]], { ignore: ["link", "linkReference"] });
}
/**
* @type {ReplaceFunction}
* @param {string} _
* @param {string} protocol
* @param {string} domain
* @param {string} path
* @param {RegExpMatchObject} match
* @returns {Array<PhrasingContent> | Link | false}
*/
function findUrl(_, protocol, domain$1, path$1, match) {
	let prefix = "";
	if (!previous(match)) return false;
	if (/^w/i.test(protocol)) {
		domain$1 = protocol + domain$1;
		protocol = "";
		prefix = "http://";
	}
	if (!isCorrectDomain(domain$1)) return false;
	const parts = splitUrl(domain$1 + path$1);
	if (!parts[0]) return false;
	/** @type {Link} */
	const result = {
		type: "link",
		title: null,
		url: prefix + protocol + parts[0],
		children: [{
			type: "text",
			value: protocol + parts[0]
		}]
	};
	if (parts[1]) return [result, {
		type: "text",
		value: parts[1]
	}];
	return result;
}
/**
* @type {ReplaceFunction}
* @param {string} _
* @param {string} atext
* @param {string} label
* @param {RegExpMatchObject} match
* @returns {Link | false}
*/
function findEmail(_, atext, label, match) {
	if (!previous(match, true) || /[-\d_]$/.test(label)) return false;
	return {
		type: "link",
		title: null,
		url: "mailto:" + atext + "@" + label,
		children: [{
			type: "text",
			value: atext + "@" + label
		}]
	};
}
/**
* @param {string} domain
* @returns {boolean}
*/
function isCorrectDomain(domain$1) {
	const parts = domain$1.split(".");
	if (parts.length < 2 || parts[parts.length - 1] && (/_/.test(parts[parts.length - 1]) || !/[a-zA-Z\d]/.test(parts[parts.length - 1])) || parts[parts.length - 2] && (/_/.test(parts[parts.length - 2]) || !/[a-zA-Z\d]/.test(parts[parts.length - 2]))) return false;
	return true;
}
/**
* @param {string} url
* @returns {[string, string | undefined]}
*/
function splitUrl(url) {
	const trailExec = /[!"&'),.:;<>?\]}]+$/.exec(url);
	if (!trailExec) return [url, void 0];
	url = url.slice(0, trailExec.index);
	let trail$1 = trailExec[0];
	let closingParenIndex = trail$1.indexOf(")");
	const openingParens = ccount(url, "(");
	let closingParens = ccount(url, ")");
	while (closingParenIndex !== -1 && openingParens > closingParens) {
		url += trail$1.slice(0, closingParenIndex + 1);
		trail$1 = trail$1.slice(closingParenIndex + 1);
		closingParenIndex = trail$1.indexOf(")");
		closingParens++;
	}
	return [url, trail$1];
}
/**
* @param {RegExpMatchObject} match
* @param {boolean | null | undefined} [email=false]
* @returns {boolean}
*/
function previous(match, email) {
	const code$3 = match.input.charCodeAt(match.index - 1);
	return (match.index === 0 || unicodeWhitespace(code$3) || unicodePunctuation(code$3)) && (!email || code$3 !== 47);
}

//#endregion
//#region node_modules/mdast-util-gfm-footnote/lib/index.js
footnoteReference.peek = footnoteReferencePeek;
/**
* @this {CompileContext}
* @type {FromMarkdownHandle}
*/
function enterFootnoteCallString() {
	this.buffer();
}
/**
* @this {CompileContext}
* @type {FromMarkdownHandle}
*/
function enterFootnoteCall(token) {
	this.enter({
		type: "footnoteReference",
		identifier: "",
		label: ""
	}, token);
}
/**
* @this {CompileContext}
* @type {FromMarkdownHandle}
*/
function enterFootnoteDefinitionLabelString() {
	this.buffer();
}
/**
* @this {CompileContext}
* @type {FromMarkdownHandle}
*/
function enterFootnoteDefinition(token) {
	this.enter({
		type: "footnoteDefinition",
		identifier: "",
		label: "",
		children: []
	}, token);
}
/**
* @this {CompileContext}
* @type {FromMarkdownHandle}
*/
function exitFootnoteCallString(token) {
	const label = this.resume();
	const node$1 = this.stack[this.stack.length - 1];
	/* @__PURE__ */ ok(node$1.type === "footnoteReference");
	node$1.identifier = normalizeIdentifier(this.sliceSerialize(token)).toLowerCase();
	node$1.label = label;
}
/**
* @this {CompileContext}
* @type {FromMarkdownHandle}
*/
function exitFootnoteCall(token) {
	this.exit(token);
}
/**
* @this {CompileContext}
* @type {FromMarkdownHandle}
*/
function exitFootnoteDefinitionLabelString(token) {
	const label = this.resume();
	const node$1 = this.stack[this.stack.length - 1];
	/* @__PURE__ */ ok(node$1.type === "footnoteDefinition");
	node$1.identifier = normalizeIdentifier(this.sliceSerialize(token)).toLowerCase();
	node$1.label = label;
}
/**
* @this {CompileContext}
* @type {FromMarkdownHandle}
*/
function exitFootnoteDefinition(token) {
	this.exit(token);
}
/** @type {ToMarkdownHandle} */
function footnoteReferencePeek() {
	return "[";
}
/**
* @type {ToMarkdownHandle}
* @param {FootnoteReference} node
*/
function footnoteReference(node$1, _, state, info) {
	const tracker = state.createTracker(info);
	let value = tracker.move("[^");
	const exit$2 = state.enter("footnoteReference");
	const subexit = state.enter("reference");
	value += tracker.move(state.safe(state.associationId(node$1), {
		after: "]",
		before: value
	}));
	subexit();
	exit$2();
	value += tracker.move("]");
	return value;
}
/**
* Create an extension for `mdast-util-from-markdown` to enable GFM footnotes
* in markdown.
*
* @returns {FromMarkdownExtension}
*   Extension for `mdast-util-from-markdown`.
*/
function gfmFootnoteFromMarkdown() {
	return {
		enter: {
			gfmFootnoteCallString: enterFootnoteCallString,
			gfmFootnoteCall: enterFootnoteCall,
			gfmFootnoteDefinitionLabelString: enterFootnoteDefinitionLabelString,
			gfmFootnoteDefinition: enterFootnoteDefinition
		},
		exit: {
			gfmFootnoteCallString: exitFootnoteCallString,
			gfmFootnoteCall: exitFootnoteCall,
			gfmFootnoteDefinitionLabelString: exitFootnoteDefinitionLabelString,
			gfmFootnoteDefinition: exitFootnoteDefinition
		}
	};
}
/**
* Create an extension for `mdast-util-to-markdown` to enable GFM footnotes
* in markdown.
*
* @param {ToMarkdownOptions | null | undefined} [options]
*   Configuration (optional).
* @returns {ToMarkdownExtension}
*   Extension for `mdast-util-to-markdown`.
*/
function gfmFootnoteToMarkdown(options) {
	let firstLineBlank = false;
	if (options && options.firstLineBlank) firstLineBlank = true;
	return {
		handlers: {
			footnoteDefinition,
			footnoteReference
		},
		unsafe: [{
			character: "[",
			inConstruct: [
				"label",
				"phrasing",
				"reference"
			]
		}]
	};
	/**
	* @type {ToMarkdownHandle}
	* @param {FootnoteDefinition} node
	*/
	function footnoteDefinition(node$1, _, state, info) {
		const tracker = state.createTracker(info);
		let value = tracker.move("[^");
		const exit$2 = state.enter("footnoteDefinition");
		const subexit = state.enter("label");
		value += tracker.move(state.safe(state.associationId(node$1), {
			before: value,
			after: "]"
		}));
		subexit();
		value += tracker.move("]:");
		if (node$1.children && node$1.children.length > 0) {
			tracker.shift(4);
			value += tracker.move((firstLineBlank ? "\n" : " ") + state.indentLines(state.containerFlow(node$1, tracker.current()), firstLineBlank ? mapAll : mapExceptFirst));
		}
		exit$2();
		return value;
	}
}
/** @type {Map} */
function mapExceptFirst(line, index$2, blank) {
	return index$2 === 0 ? line : mapAll(line, index$2, blank);
}
/** @type {Map} */
function mapAll(line, index$2, blank) {
	return (blank ? "" : "    ") + line;
}

//#endregion
//#region node_modules/mdast-util-gfm-strikethrough/lib/index.js
/**
* @typedef {import('mdast').Delete} Delete
*
* @typedef {import('mdast-util-from-markdown').CompileContext} CompileContext
* @typedef {import('mdast-util-from-markdown').Extension} FromMarkdownExtension
* @typedef {import('mdast-util-from-markdown').Handle} FromMarkdownHandle
*
* @typedef {import('mdast-util-to-markdown').ConstructName} ConstructName
* @typedef {import('mdast-util-to-markdown').Handle} ToMarkdownHandle
* @typedef {import('mdast-util-to-markdown').Options} ToMarkdownExtension
*/
/**
* List of constructs that occur in phrasing (paragraphs, headings), but cannot
* contain strikethrough.
* So they sort of cancel each other out.
* Note: could use a better name.
*
* Note: keep in sync with: <https://github.com/syntax-tree/mdast-util-to-markdown/blob/8ce8dbf/lib/unsafe.js#L14>
*
* @type {Array<ConstructName>}
*/
const constructsWithoutStrikethrough = [
	"autolink",
	"destinationLiteral",
	"destinationRaw",
	"reference",
	"titleQuote",
	"titleApostrophe"
];
handleDelete.peek = peekDelete;
/**
* Create an extension for `mdast-util-from-markdown` to enable GFM
* strikethrough in markdown.
*
* @returns {FromMarkdownExtension}
*   Extension for `mdast-util-from-markdown` to enable GFM strikethrough.
*/
function gfmStrikethroughFromMarkdown() {
	return {
		canContainEols: ["delete"],
		enter: { strikethrough: enterStrikethrough },
		exit: { strikethrough: exitStrikethrough }
	};
}
/**
* Create an extension for `mdast-util-to-markdown` to enable GFM
* strikethrough in markdown.
*
* @returns {ToMarkdownExtension}
*   Extension for `mdast-util-to-markdown` to enable GFM strikethrough.
*/
function gfmStrikethroughToMarkdown() {
	return {
		unsafe: [{
			character: "~",
			inConstruct: "phrasing",
			notInConstruct: constructsWithoutStrikethrough
		}],
		handlers: { delete: handleDelete }
	};
}
/**
* @this {CompileContext}
* @type {FromMarkdownHandle}
*/
function enterStrikethrough(token) {
	this.enter({
		type: "delete",
		children: []
	}, token);
}
/**
* @this {CompileContext}
* @type {FromMarkdownHandle}
*/
function exitStrikethrough(token) {
	this.exit(token);
}
/**
* @type {ToMarkdownHandle}
* @param {Delete} node
*/
function handleDelete(node$1, _, state, info) {
	const tracker = state.createTracker(info);
	const exit$2 = state.enter("strikethrough");
	let value = tracker.move("~~");
	value += state.containerPhrasing(node$1, {
		...tracker.current(),
		before: value,
		after: "~"
	});
	value += tracker.move("~~");
	exit$2();
	return value;
}
/** @type {ToMarkdownHandle} */
function peekDelete() {
	return "~";
}

//#endregion
//#region node_modules/markdown-table/index.js
/**
* @typedef {Options} MarkdownTableOptions
*   Configuration.
*/
/**
* @typedef Options
*   Configuration.
* @property {boolean | null | undefined} [alignDelimiters=true]
*   Whether to align the delimiters (default: `true`);
*   they are aligned by default:
*
*   ```markdown
*   | Alpha | B     |
*   | ----- | ----- |
*   | C     | Delta |
*   ```
*
*   Pass `false` to make them staggered:
*
*   ```markdown
*   | Alpha | B |
*   | - | - |
*   | C | Delta |
*   ```
* @property {ReadonlyArray<string | null | undefined> | string | null | undefined} [align]
*   How to align columns (default: `''`);
*   one style for all columns or styles for their respective columns;
*   each style is either `'l'` (left), `'r'` (right), or `'c'` (center);
*   other values are treated as `''`, which doesn’t place the colon in the
*   alignment row but does align left;
*   *only the lowercased first character is used, so `Right` is fine.*
* @property {boolean | null | undefined} [delimiterEnd=true]
*   Whether to end each row with the delimiter (default: `true`).
*
*   > 👉 **Note**: please don’t use this: it could create fragile structures
*   > that aren’t understandable to some markdown parsers.
*
*   When `true`, there are ending delimiters:
*
*   ```markdown
*   | Alpha | B     |
*   | ----- | ----- |
*   | C     | Delta |
*   ```
*
*   When `false`, there are no ending delimiters:
*
*   ```markdown
*   | Alpha | B
*   | ----- | -----
*   | C     | Delta
*   ```
* @property {boolean | null | undefined} [delimiterStart=true]
*   Whether to begin each row with the delimiter (default: `true`).
*
*   > 👉 **Note**: please don’t use this: it could create fragile structures
*   > that aren’t understandable to some markdown parsers.
*
*   When `true`, there are starting delimiters:
*
*   ```markdown
*   | Alpha | B     |
*   | ----- | ----- |
*   | C     | Delta |
*   ```
*
*   When `false`, there are no starting delimiters:
*
*   ```markdown
*   Alpha | B     |
*   ----- | ----- |
*   C     | Delta |
*   ```
* @property {boolean | null | undefined} [padding=true]
*   Whether to add a space of padding between delimiters and cells
*   (default: `true`).
*
*   When `true`, there is padding:
*
*   ```markdown
*   | Alpha | B     |
*   | ----- | ----- |
*   | C     | Delta |
*   ```
*
*   When `false`, there is no padding:
*
*   ```markdown
*   |Alpha|B    |
*   |-----|-----|
*   |C    |Delta|
*   ```
* @property {((value: string) => number) | null | undefined} [stringLength]
*   Function to detect the length of table cell content (optional);
*   this is used when aligning the delimiters (`|`) between table cells;
*   full-width characters and emoji mess up delimiter alignment when viewing
*   the markdown source;
*   to fix this, you can pass this function,
*   which receives the cell content and returns its “visible” size;
*   note that what is and isn’t visible depends on where the text is displayed.
*
*   Without such a function, the following:
*
*   ```js
*   markdownTable([
*     ['Alpha', 'Bravo'],
*     ['中文', 'Charlie'],
*     ['👩‍❤️‍👩', 'Delta']
*   ])
*   ```
*
*   Yields:
*
*   ```markdown
*   | Alpha | Bravo |
*   | - | - |
*   | 中文 | Charlie |
*   | 👩‍❤️‍👩 | Delta |
*   ```
*
*   With [`string-width`](https://github.com/sindresorhus/string-width):
*
*   ```js
*   import stringWidth from 'string-width'
*
*   markdownTable(
*     [
*       ['Alpha', 'Bravo'],
*       ['中文', 'Charlie'],
*       ['👩‍❤️‍👩', 'Delta']
*     ],
*     {stringLength: stringWidth}
*   )
*   ```
*
*   Yields:
*
*   ```markdown
*   | Alpha | Bravo   |
*   | ----- | ------- |
*   | 中文  | Charlie |
*   | 👩‍❤️‍👩    | Delta   |
*   ```
*/
/**
* @param {string} value
*   Cell value.
* @returns {number}
*   Cell size.
*/
function defaultStringLength(value) {
	return value.length;
}
/**
* Generate a markdown
* ([GFM](https://docs.github.com/en/github/writing-on-github/working-with-advanced-formatting/organizing-information-with-tables))
* table.
*
* @param {ReadonlyArray<ReadonlyArray<string | null | undefined>>} table
*   Table data (matrix of strings).
* @param {Readonly<Options> | null | undefined} [options]
*   Configuration (optional).
* @returns {string}
*   Result.
*/
function markdownTable(table$1, options) {
	const settings = options || {};
	const align = (settings.align || []).concat();
	const stringLength = settings.stringLength || defaultStringLength;
	/** @type {Array<number>} Character codes as symbols for alignment per column. */
	const alignments = [];
	/** @type {Array<Array<string>>} Cells per row. */
	const cellMatrix = [];
	/** @type {Array<Array<number>>} Sizes of each cell per row. */
	const sizeMatrix = [];
	/** @type {Array<number>} */
	const longestCellByColumn = [];
	let mostCellsPerRow = 0;
	let rowIndex = -1;
	while (++rowIndex < table$1.length) {
		/** @type {Array<string>} */
		const row$1 = [];
		/** @type {Array<number>} */
		const sizes$1 = [];
		let columnIndex$1 = -1;
		if (table$1[rowIndex].length > mostCellsPerRow) mostCellsPerRow = table$1[rowIndex].length;
		while (++columnIndex$1 < table$1[rowIndex].length) {
			const cell = serialize(table$1[rowIndex][columnIndex$1]);
			if (settings.alignDelimiters !== false) {
				const size = stringLength(cell);
				sizes$1[columnIndex$1] = size;
				if (longestCellByColumn[columnIndex$1] === void 0 || size > longestCellByColumn[columnIndex$1]) longestCellByColumn[columnIndex$1] = size;
			}
			row$1.push(cell);
		}
		cellMatrix[rowIndex] = row$1;
		sizeMatrix[rowIndex] = sizes$1;
	}
	let columnIndex = -1;
	if (typeof align === "object" && "length" in align) while (++columnIndex < mostCellsPerRow) alignments[columnIndex] = toAlignment(align[columnIndex]);
	else {
		const code$3 = toAlignment(align);
		while (++columnIndex < mostCellsPerRow) alignments[columnIndex] = code$3;
	}
	columnIndex = -1;
	/** @type {Array<string>} */
	const row = [];
	/** @type {Array<number>} */
	const sizes = [];
	while (++columnIndex < mostCellsPerRow) {
		const code$3 = alignments[columnIndex];
		let before = "";
		let after = "";
		if (code$3 === 99) {
			before = ":";
			after = ":";
		} else if (code$3 === 108) before = ":";
		else if (code$3 === 114) after = ":";
		let size = settings.alignDelimiters === false ? 1 : Math.max(1, longestCellByColumn[columnIndex] - before.length - after.length);
		const cell = before + "-".repeat(size) + after;
		if (settings.alignDelimiters !== false) {
			size = before.length + size + after.length;
			if (size > longestCellByColumn[columnIndex]) longestCellByColumn[columnIndex] = size;
			sizes[columnIndex] = size;
		}
		row[columnIndex] = cell;
	}
	cellMatrix.splice(1, 0, row);
	sizeMatrix.splice(1, 0, sizes);
	rowIndex = -1;
	/** @type {Array<string>} */
	const lines = [];
	while (++rowIndex < cellMatrix.length) {
		const row$1 = cellMatrix[rowIndex];
		const sizes$1 = sizeMatrix[rowIndex];
		columnIndex = -1;
		/** @type {Array<string>} */
		const line = [];
		while (++columnIndex < mostCellsPerRow) {
			const cell = row$1[columnIndex] || "";
			let before = "";
			let after = "";
			if (settings.alignDelimiters !== false) {
				const size = longestCellByColumn[columnIndex] - (sizes$1[columnIndex] || 0);
				const code$3 = alignments[columnIndex];
				if (code$3 === 114) before = " ".repeat(size);
				else if (code$3 === 99) if (size % 2) {
					before = " ".repeat(size / 2 + .5);
					after = " ".repeat(size / 2 - .5);
				} else {
					before = " ".repeat(size / 2);
					after = before;
				}
				else after = " ".repeat(size);
			}
			if (settings.delimiterStart !== false && !columnIndex) line.push("|");
			if (settings.padding !== false && !(settings.alignDelimiters === false && cell === "") && (settings.delimiterStart !== false || columnIndex)) line.push(" ");
			if (settings.alignDelimiters !== false) line.push(before);
			line.push(cell);
			if (settings.alignDelimiters !== false) line.push(after);
			if (settings.padding !== false) line.push(" ");
			if (settings.delimiterEnd !== false || columnIndex !== mostCellsPerRow - 1) line.push("|");
		}
		lines.push(settings.delimiterEnd === false ? line.join("").replace(/ +$/, "") : line.join(""));
	}
	return lines.join("\n");
}
/**
* @param {string | null | undefined} [value]
*   Value to serialize.
* @returns {string}
*   Result.
*/
function serialize(value) {
	return value === null || value === void 0 ? "" : String(value);
}
/**
* @param {string | null | undefined} value
*   Value.
* @returns {number}
*   Alignment.
*/
function toAlignment(value) {
	const code$3 = typeof value === "string" ? value.codePointAt(0) : 0;
	return code$3 === 67 || code$3 === 99 ? 99 : code$3 === 76 || code$3 === 108 ? 108 : code$3 === 82 || code$3 === 114 ? 114 : 0;
}

//#endregion
//#region node_modules/mdast-util-to-markdown/lib/handle/blockquote.js
/**
* @import {Blockquote, Parents} from 'mdast'
* @import {Info, Map, State} from 'mdast-util-to-markdown'
*/
/**
* @param {Blockquote} node
* @param {Parents | undefined} _
* @param {State} state
* @param {Info} info
* @returns {string}
*/
function blockquote(node$1, _, state, info) {
	const exit$2 = state.enter("blockquote");
	const tracker = state.createTracker(info);
	tracker.move("> ");
	tracker.shift(2);
	const value = state.indentLines(state.containerFlow(node$1, tracker.current()), map$1);
	exit$2();
	return value;
}
/** @type {Map} */
function map$1(line, _, blank) {
	return ">" + (blank ? "" : " ") + line;
}

//#endregion
//#region node_modules/mdast-util-to-markdown/lib/util/pattern-in-scope.js
/**
* @import {ConstructName, Unsafe} from 'mdast-util-to-markdown'
*/
/**
* @param {Array<ConstructName>} stack
* @param {Unsafe} pattern
* @returns {boolean}
*/
function patternInScope(stack, pattern) {
	return listInScope(stack, pattern.inConstruct, true) && !listInScope(stack, pattern.notInConstruct, false);
}
/**
* @param {Array<ConstructName>} stack
* @param {Unsafe['inConstruct']} list
* @param {boolean} none
* @returns {boolean}
*/
function listInScope(stack, list$3, none) {
	if (typeof list$3 === "string") list$3 = [list$3];
	if (!list$3 || list$3.length === 0) return none;
	let index$2 = -1;
	while (++index$2 < list$3.length) if (stack.includes(list$3[index$2])) return true;
	return false;
}

//#endregion
//#region node_modules/mdast-util-to-markdown/lib/handle/break.js
/**
* @param {Break} _
* @param {Parents | undefined} _1
* @param {State} state
* @param {Info} info
* @returns {string}
*/
function hardBreak(_, _1, state, info) {
	let index$2 = -1;
	while (++index$2 < state.unsafe.length) if (state.unsafe[index$2].character === "\n" && patternInScope(state.stack, state.unsafe[index$2])) return /[ \t]/.test(info.before) ? "" : " ";
	return "\\\n";
}

//#endregion
//#region node_modules/longest-streak/index.js
/**
* Get the count of the longest repeating streak of `substring` in `value`.
*
* @param {string} value
*   Content to search in.
* @param {string} substring
*   Substring to look for, typically one character.
* @returns {number}
*   Count of most frequent adjacent `substring`s in `value`.
*/
function longestStreak(value, substring) {
	const source = String(value);
	let index$2 = source.indexOf(substring);
	let expected = index$2;
	let count = 0;
	let max = 0;
	if (typeof substring !== "string") throw new TypeError("Expected substring");
	while (index$2 !== -1) {
		if (index$2 === expected) {
			if (++count > max) max = count;
		} else count = 1;
		expected = index$2 + substring.length;
		index$2 = source.indexOf(substring, expected);
	}
	return max;
}

//#endregion
//#region node_modules/mdast-util-to-markdown/lib/util/format-code-as-indented.js
/**
* @import {State} from 'mdast-util-to-markdown'
* @import {Code} from 'mdast'
*/
/**
* @param {Code} node
* @param {State} state
* @returns {boolean}
*/
function formatCodeAsIndented(node$1, state) {
	return Boolean(state.options.fences === false && node$1.value && !node$1.lang && /[^ \r\n]/.test(node$1.value) && !/^[\t ]*(?:[\r\n]|$)|(?:^|[\r\n])[\t ]*$/.test(node$1.value));
}

//#endregion
//#region node_modules/mdast-util-to-markdown/lib/util/check-fence.js
/**
* @import {Options, State} from 'mdast-util-to-markdown'
*/
/**
* @param {State} state
* @returns {Exclude<Options['fence'], null | undefined>}
*/
function checkFence(state) {
	const marker = state.options.fence || "`";
	if (marker !== "`" && marker !== "~") throw new Error("Cannot serialize code with `" + marker + "` for `options.fence`, expected `` ` `` or `~`");
	return marker;
}

//#endregion
//#region node_modules/mdast-util-to-markdown/lib/handle/code.js
/**
* @param {Code} node
* @param {Parents | undefined} _
* @param {State} state
* @param {Info} info
* @returns {string}
*/
function code$1(node$1, _, state, info) {
	const marker = checkFence(state);
	const raw$1 = node$1.value || "";
	const suffix = marker === "`" ? "GraveAccent" : "Tilde";
	if (formatCodeAsIndented(node$1, state)) {
		const exit$3 = state.enter("codeIndented");
		const value$1 = state.indentLines(raw$1, map);
		exit$3();
		return value$1;
	}
	const tracker = state.createTracker(info);
	const sequence = marker.repeat(Math.max(longestStreak(raw$1, marker) + 1, 3));
	const exit$2 = state.enter("codeFenced");
	let value = tracker.move(sequence);
	if (node$1.lang) {
		const subexit = state.enter(`codeFencedLang${suffix}`);
		value += tracker.move(state.safe(node$1.lang, {
			before: value,
			after: " ",
			encode: ["`"],
			...tracker.current()
		}));
		subexit();
	}
	if (node$1.lang && node$1.meta) {
		const subexit = state.enter(`codeFencedMeta${suffix}`);
		value += tracker.move(" ");
		value += tracker.move(state.safe(node$1.meta, {
			before: value,
			after: "\n",
			encode: ["`"],
			...tracker.current()
		}));
		subexit();
	}
	value += tracker.move("\n");
	if (raw$1) value += tracker.move(raw$1 + "\n");
	value += tracker.move(sequence);
	exit$2();
	return value;
}
/** @type {Map} */
function map(line, _, blank) {
	return (blank ? "" : "    ") + line;
}

//#endregion
//#region node_modules/mdast-util-to-markdown/lib/util/check-quote.js
/**
* @import {Options, State} from 'mdast-util-to-markdown'
*/
/**
* @param {State} state
* @returns {Exclude<Options['quote'], null | undefined>}
*/
function checkQuote(state) {
	const marker = state.options.quote || "\"";
	if (marker !== "\"" && marker !== "'") throw new Error("Cannot serialize title with `" + marker + "` for `options.quote`, expected `\"`, or `'`");
	return marker;
}

//#endregion
//#region node_modules/mdast-util-to-markdown/lib/handle/definition.js
/**
* @param {Definition} node
* @param {Parents | undefined} _
* @param {State} state
* @param {Info} info
* @returns {string}
*/
function definition(node$1, _, state, info) {
	const quote = checkQuote(state);
	const suffix = quote === "\"" ? "Quote" : "Apostrophe";
	const exit$2 = state.enter("definition");
	let subexit = state.enter("label");
	const tracker = state.createTracker(info);
	let value = tracker.move("[");
	value += tracker.move(state.safe(state.associationId(node$1), {
		before: value,
		after: "]",
		...tracker.current()
	}));
	value += tracker.move("]: ");
	subexit();
	if (!node$1.url || /[\0- \u007F]/.test(node$1.url)) {
		subexit = state.enter("destinationLiteral");
		value += tracker.move("<");
		value += tracker.move(state.safe(node$1.url, {
			before: value,
			after: ">",
			...tracker.current()
		}));
		value += tracker.move(">");
	} else {
		subexit = state.enter("destinationRaw");
		value += tracker.move(state.safe(node$1.url, {
			before: value,
			after: node$1.title ? " " : "\n",
			...tracker.current()
		}));
	}
	subexit();
	if (node$1.title) {
		subexit = state.enter(`title${suffix}`);
		value += tracker.move(" " + quote);
		value += tracker.move(state.safe(node$1.title, {
			before: value,
			after: quote,
			...tracker.current()
		}));
		value += tracker.move(quote);
		subexit();
	}
	exit$2();
	return value;
}

//#endregion
//#region node_modules/mdast-util-to-markdown/lib/util/check-emphasis.js
/**
* @import {Options, State} from 'mdast-util-to-markdown'
*/
/**
* @param {State} state
* @returns {Exclude<Options['emphasis'], null | undefined>}
*/
function checkEmphasis(state) {
	const marker = state.options.emphasis || "*";
	if (marker !== "*" && marker !== "_") throw new Error("Cannot serialize emphasis with `" + marker + "` for `options.emphasis`, expected `*`, or `_`");
	return marker;
}

//#endregion
//#region node_modules/mdast-util-to-markdown/lib/util/encode-character-reference.js
/**
* Encode a code point as a character reference.
*
* @param {number} code
*   Code point to encode.
* @returns {string}
*   Encoded character reference.
*/
function encodeCharacterReference(code$3) {
	return "&#x" + code$3.toString(16).toUpperCase() + ";";
}

//#endregion
//#region node_modules/mdast-util-to-markdown/lib/util/encode-info.js
/**
* Check whether to encode (as a character reference) the characters
* surrounding an attention run.
*
* Which characters are around an attention run influence whether it works or
* not.
*
* See <https://github.com/orgs/syntax-tree/discussions/60> for more info.
* See this markdown in a particular renderer to see what works:
*
* ```markdown
* |                         | A (letter inside) | B (punctuation inside) | C (whitespace inside) | D (nothing inside) |
* | ----------------------- | ----------------- | ---------------------- | --------------------- | ------------------ |
* | 1 (letter outside)      | x*y*z             | x*.*z                  | x* *z                 | x**z               |
* | 2 (punctuation outside) | .*y*.             | .*.*.                  | .* *.                 | .**.               |
* | 3 (whitespace outside)  | x *y* z           | x *.* z                | x * * z               | x ** z             |
* | 4 (nothing outside)     | *x*               | *.*                    | * *                   | **                 |
* ```
*
* @param {number} outside
*   Code point on the outer side of the run.
* @param {number} inside
*   Code point on the inner side of the run.
* @param {'*' | '_'} marker
*   Marker of the run.
*   Underscores are handled more strictly (they form less often) than
*   asterisks.
* @returns {EncodeSides}
*   Whether to encode characters.
*/
function encodeInfo(outside, inside, marker) {
	const outsideKind = classifyCharacter(outside);
	const insideKind = classifyCharacter(inside);
	if (outsideKind === void 0) return insideKind === void 0 ? marker === "_" ? {
		inside: true,
		outside: true
	} : {
		inside: false,
		outside: false
	} : insideKind === 1 ? {
		inside: true,
		outside: true
	} : {
		inside: false,
		outside: true
	};
	if (outsideKind === 1) return insideKind === void 0 ? {
		inside: false,
		outside: false
	} : insideKind === 1 ? {
		inside: true,
		outside: true
	} : {
		inside: false,
		outside: false
	};
	return insideKind === void 0 ? {
		inside: false,
		outside: false
	} : insideKind === 1 ? {
		inside: true,
		outside: false
	} : {
		inside: false,
		outside: false
	};
}

//#endregion
//#region node_modules/mdast-util-to-markdown/lib/handle/emphasis.js
emphasis.peek = emphasisPeek;
/**
* @param {Emphasis} node
* @param {Parents | undefined} _
* @param {State} state
* @param {Info} info
* @returns {string}
*/
function emphasis(node$1, _, state, info) {
	const marker = checkEmphasis(state);
	const exit$2 = state.enter("emphasis");
	const tracker = state.createTracker(info);
	const before = tracker.move(marker);
	let between = tracker.move(state.containerPhrasing(node$1, {
		after: marker,
		before,
		...tracker.current()
	}));
	const betweenHead = between.charCodeAt(0);
	const open = encodeInfo(info.before.charCodeAt(info.before.length - 1), betweenHead, marker);
	if (open.inside) between = encodeCharacterReference(betweenHead) + between.slice(1);
	const betweenTail = between.charCodeAt(between.length - 1);
	const close = encodeInfo(info.after.charCodeAt(0), betweenTail, marker);
	if (close.inside) between = between.slice(0, -1) + encodeCharacterReference(betweenTail);
	const after = tracker.move(marker);
	exit$2();
	state.attentionEncodeSurroundingInfo = {
		after: close.outside,
		before: open.outside
	};
	return before + between + after;
}
/**
* @param {Emphasis} _
* @param {Parents | undefined} _1
* @param {State} state
* @returns {string}
*/
function emphasisPeek(_, _1, state) {
	return state.options.emphasis || "*";
}

//#endregion
//#region node_modules/mdast-util-to-markdown/lib/util/format-heading-as-setext.js
/**
* @param {Heading} node
* @param {State} state
* @returns {boolean}
*/
function formatHeadingAsSetext(node$1, state) {
	let literalWithBreak = false;
	visit(node$1, function(node$2) {
		if ("value" in node$2 && /\r?\n|\r/.test(node$2.value) || node$2.type === "break") {
			literalWithBreak = true;
			return EXIT;
		}
	});
	return Boolean((!node$1.depth || node$1.depth < 3) && toString(node$1) && (state.options.setext || literalWithBreak));
}

//#endregion
//#region node_modules/mdast-util-to-markdown/lib/handle/heading.js
/**
* @param {Heading} node
* @param {Parents | undefined} _
* @param {State} state
* @param {Info} info
* @returns {string}
*/
function heading(node$1, _, state, info) {
	const rank = Math.max(Math.min(6, node$1.depth || 1), 1);
	const tracker = state.createTracker(info);
	if (formatHeadingAsSetext(node$1, state)) {
		const exit$3 = state.enter("headingSetext");
		const subexit$1 = state.enter("phrasing");
		const value$1 = state.containerPhrasing(node$1, {
			...tracker.current(),
			before: "\n",
			after: "\n"
		});
		subexit$1();
		exit$3();
		return value$1 + "\n" + (rank === 1 ? "=" : "-").repeat(value$1.length - (Math.max(value$1.lastIndexOf("\r"), value$1.lastIndexOf("\n")) + 1));
	}
	const sequence = "#".repeat(rank);
	const exit$2 = state.enter("headingAtx");
	const subexit = state.enter("phrasing");
	tracker.move(sequence + " ");
	let value = state.containerPhrasing(node$1, {
		before: "# ",
		after: "\n",
		...tracker.current()
	});
	if (/^[\t ]/.test(value)) value = encodeCharacterReference(value.charCodeAt(0)) + value.slice(1);
	value = value ? sequence + " " + value : sequence;
	if (state.options.closeAtx) value += " " + sequence;
	subexit();
	exit$2();
	return value;
}

//#endregion
//#region node_modules/mdast-util-to-markdown/lib/handle/html.js
/**
* @import {Html} from 'mdast'
*/
html.peek = htmlPeek;
/**
* @param {Html} node
* @returns {string}
*/
function html(node$1) {
	return node$1.value || "";
}
/**
* @returns {string}
*/
function htmlPeek() {
	return "<";
}

//#endregion
//#region node_modules/mdast-util-to-markdown/lib/handle/image.js
image.peek = imagePeek;
/**
* @param {Image} node
* @param {Parents | undefined} _
* @param {State} state
* @param {Info} info
* @returns {string}
*/
function image(node$1, _, state, info) {
	const quote = checkQuote(state);
	const suffix = quote === "\"" ? "Quote" : "Apostrophe";
	const exit$2 = state.enter("image");
	let subexit = state.enter("label");
	const tracker = state.createTracker(info);
	let value = tracker.move("![");
	value += tracker.move(state.safe(node$1.alt, {
		before: value,
		after: "]",
		...tracker.current()
	}));
	value += tracker.move("](");
	subexit();
	if (!node$1.url && node$1.title || /[\0- \u007F]/.test(node$1.url)) {
		subexit = state.enter("destinationLiteral");
		value += tracker.move("<");
		value += tracker.move(state.safe(node$1.url, {
			before: value,
			after: ">",
			...tracker.current()
		}));
		value += tracker.move(">");
	} else {
		subexit = state.enter("destinationRaw");
		value += tracker.move(state.safe(node$1.url, {
			before: value,
			after: node$1.title ? " " : ")",
			...tracker.current()
		}));
	}
	subexit();
	if (node$1.title) {
		subexit = state.enter(`title${suffix}`);
		value += tracker.move(" " + quote);
		value += tracker.move(state.safe(node$1.title, {
			before: value,
			after: quote,
			...tracker.current()
		}));
		value += tracker.move(quote);
		subexit();
	}
	value += tracker.move(")");
	exit$2();
	return value;
}
/**
* @returns {string}
*/
function imagePeek() {
	return "!";
}

//#endregion
//#region node_modules/mdast-util-to-markdown/lib/handle/image-reference.js
/**
* @import {Info, State} from 'mdast-util-to-markdown'
* @import {ImageReference, Parents} from 'mdast'
*/
imageReference.peek = imageReferencePeek;
/**
* @param {ImageReference} node
* @param {Parents | undefined} _
* @param {State} state
* @param {Info} info
* @returns {string}
*/
function imageReference(node$1, _, state, info) {
	const type = node$1.referenceType;
	const exit$2 = state.enter("imageReference");
	let subexit = state.enter("label");
	const tracker = state.createTracker(info);
	let value = tracker.move("![");
	const alt = state.safe(node$1.alt, {
		before: value,
		after: "]",
		...tracker.current()
	});
	value += tracker.move(alt + "][");
	subexit();
	const stack = state.stack;
	state.stack = [];
	subexit = state.enter("reference");
	const reference = state.safe(state.associationId(node$1), {
		before: value,
		after: "]",
		...tracker.current()
	});
	subexit();
	state.stack = stack;
	exit$2();
	if (type === "full" || !alt || alt !== reference) value += tracker.move(reference + "]");
	else if (type === "shortcut") value = value.slice(0, -1);
	else value += tracker.move("]");
	return value;
}
/**
* @returns {string}
*/
function imageReferencePeek() {
	return "!";
}

//#endregion
//#region node_modules/mdast-util-to-markdown/lib/handle/inline-code.js
/**
* @import {State} from 'mdast-util-to-markdown'
* @import {InlineCode, Parents} from 'mdast'
*/
inlineCode.peek = inlineCodePeek;
/**
* @param {InlineCode} node
* @param {Parents | undefined} _
* @param {State} state
* @returns {string}
*/
function inlineCode(node$1, _, state) {
	let value = node$1.value || "";
	let sequence = "`";
	let index$2 = -1;
	while ((/* @__PURE__ */ new RegExp("(^|[^`])" + sequence + "([^`]|$)")).test(value)) sequence += "`";
	if (/[^ \r\n]/.test(value) && (/^[ \r\n]/.test(value) && /[ \r\n]$/.test(value) || /^`|`$/.test(value))) value = " " + value + " ";
	while (++index$2 < state.unsafe.length) {
		const pattern = state.unsafe[index$2];
		const expression = state.compilePattern(pattern);
		/** @type {RegExpExecArray | null} */
		let match;
		if (!pattern.atBreak) continue;
		while (match = expression.exec(value)) {
			let position$3 = match.index;
			if (value.charCodeAt(position$3) === 10 && value.charCodeAt(position$3 - 1) === 13) position$3--;
			value = value.slice(0, position$3) + " " + value.slice(match.index + 1);
		}
	}
	return sequence + value + sequence;
}
/**
* @returns {string}
*/
function inlineCodePeek() {
	return "`";
}

//#endregion
//#region node_modules/mdast-util-to-markdown/lib/util/format-link-as-autolink.js
/**
* @param {Link} node
* @param {State} state
* @returns {boolean}
*/
function formatLinkAsAutolink(node$1, state) {
	const raw$1 = toString(node$1);
	return Boolean(!state.options.resourceLink && node$1.url && !node$1.title && node$1.children && node$1.children.length === 1 && node$1.children[0].type === "text" && (raw$1 === node$1.url || "mailto:" + raw$1 === node$1.url) && /^[a-z][a-z+.-]+:/i.test(node$1.url) && !/[\0- <>\u007F]/.test(node$1.url));
}

//#endregion
//#region node_modules/mdast-util-to-markdown/lib/handle/link.js
link.peek = linkPeek;
/**
* @param {Link} node
* @param {Parents | undefined} _
* @param {State} state
* @param {Info} info
* @returns {string}
*/
function link(node$1, _, state, info) {
	const quote = checkQuote(state);
	const suffix = quote === "\"" ? "Quote" : "Apostrophe";
	const tracker = state.createTracker(info);
	/** @type {Exit} */
	let exit$2;
	/** @type {Exit} */
	let subexit;
	if (formatLinkAsAutolink(node$1, state)) {
		const stack = state.stack;
		state.stack = [];
		exit$2 = state.enter("autolink");
		let value$1 = tracker.move("<");
		value$1 += tracker.move(state.containerPhrasing(node$1, {
			before: value$1,
			after: ">",
			...tracker.current()
		}));
		value$1 += tracker.move(">");
		exit$2();
		state.stack = stack;
		return value$1;
	}
	exit$2 = state.enter("link");
	subexit = state.enter("label");
	let value = tracker.move("[");
	value += tracker.move(state.containerPhrasing(node$1, {
		before: value,
		after: "](",
		...tracker.current()
	}));
	value += tracker.move("](");
	subexit();
	if (!node$1.url && node$1.title || /[\0- \u007F]/.test(node$1.url)) {
		subexit = state.enter("destinationLiteral");
		value += tracker.move("<");
		value += tracker.move(state.safe(node$1.url, {
			before: value,
			after: ">",
			...tracker.current()
		}));
		value += tracker.move(">");
	} else {
		subexit = state.enter("destinationRaw");
		value += tracker.move(state.safe(node$1.url, {
			before: value,
			after: node$1.title ? " " : ")",
			...tracker.current()
		}));
	}
	subexit();
	if (node$1.title) {
		subexit = state.enter(`title${suffix}`);
		value += tracker.move(" " + quote);
		value += tracker.move(state.safe(node$1.title, {
			before: value,
			after: quote,
			...tracker.current()
		}));
		value += tracker.move(quote);
		subexit();
	}
	value += tracker.move(")");
	exit$2();
	return value;
}
/**
* @param {Link} node
* @param {Parents | undefined} _
* @param {State} state
* @returns {string}
*/
function linkPeek(node$1, _, state) {
	return formatLinkAsAutolink(node$1, state) ? "<" : "[";
}

//#endregion
//#region node_modules/mdast-util-to-markdown/lib/handle/link-reference.js
/**
* @import {Info, State} from 'mdast-util-to-markdown'
* @import {LinkReference, Parents} from 'mdast'
*/
linkReference.peek = linkReferencePeek;
/**
* @param {LinkReference} node
* @param {Parents | undefined} _
* @param {State} state
* @param {Info} info
* @returns {string}
*/
function linkReference(node$1, _, state, info) {
	const type = node$1.referenceType;
	const exit$2 = state.enter("linkReference");
	let subexit = state.enter("label");
	const tracker = state.createTracker(info);
	let value = tracker.move("[");
	const text$9 = state.containerPhrasing(node$1, {
		before: value,
		after: "]",
		...tracker.current()
	});
	value += tracker.move(text$9 + "][");
	subexit();
	const stack = state.stack;
	state.stack = [];
	subexit = state.enter("reference");
	const reference = state.safe(state.associationId(node$1), {
		before: value,
		after: "]",
		...tracker.current()
	});
	subexit();
	state.stack = stack;
	exit$2();
	if (type === "full" || !text$9 || text$9 !== reference) value += tracker.move(reference + "]");
	else if (type === "shortcut") value = value.slice(0, -1);
	else value += tracker.move("]");
	return value;
}
/**
* @returns {string}
*/
function linkReferencePeek() {
	return "[";
}

//#endregion
//#region node_modules/mdast-util-to-markdown/lib/util/check-bullet.js
/**
* @import {Options, State} from 'mdast-util-to-markdown'
*/
/**
* @param {State} state
* @returns {Exclude<Options['bullet'], null | undefined>}
*/
function checkBullet(state) {
	const marker = state.options.bullet || "*";
	if (marker !== "*" && marker !== "+" && marker !== "-") throw new Error("Cannot serialize items with `" + marker + "` for `options.bullet`, expected `*`, `+`, or `-`");
	return marker;
}

//#endregion
//#region node_modules/mdast-util-to-markdown/lib/util/check-bullet-other.js
/**
* @param {State} state
* @returns {Exclude<Options['bullet'], null | undefined>}
*/
function checkBulletOther(state) {
	const bullet = checkBullet(state);
	const bulletOther = state.options.bulletOther;
	if (!bulletOther) return bullet === "*" ? "-" : "*";
	if (bulletOther !== "*" && bulletOther !== "+" && bulletOther !== "-") throw new Error("Cannot serialize items with `" + bulletOther + "` for `options.bulletOther`, expected `*`, `+`, or `-`");
	if (bulletOther === bullet) throw new Error("Expected `bullet` (`" + bullet + "`) and `bulletOther` (`" + bulletOther + "`) to be different");
	return bulletOther;
}

//#endregion
//#region node_modules/mdast-util-to-markdown/lib/util/check-bullet-ordered.js
/**
* @import {Options, State} from 'mdast-util-to-markdown'
*/
/**
* @param {State} state
* @returns {Exclude<Options['bulletOrdered'], null | undefined>}
*/
function checkBulletOrdered(state) {
	const marker = state.options.bulletOrdered || ".";
	if (marker !== "." && marker !== ")") throw new Error("Cannot serialize items with `" + marker + "` for `options.bulletOrdered`, expected `.` or `)`");
	return marker;
}

//#endregion
//#region node_modules/mdast-util-to-markdown/lib/util/check-rule.js
/**
* @import {Options, State} from 'mdast-util-to-markdown'
*/
/**
* @param {State} state
* @returns {Exclude<Options['rule'], null | undefined>}
*/
function checkRule(state) {
	const marker = state.options.rule || "*";
	if (marker !== "*" && marker !== "-" && marker !== "_") throw new Error("Cannot serialize rules with `" + marker + "` for `options.rule`, expected `*`, `-`, or `_`");
	return marker;
}

//#endregion
//#region node_modules/mdast-util-to-markdown/lib/handle/list.js
/**
* @param {List} node
* @param {Parents | undefined} parent
* @param {State} state
* @param {Info} info
* @returns {string}
*/
function list(node$1, parent, state, info) {
	const exit$2 = state.enter("list");
	const bulletCurrent = state.bulletCurrent;
	/** @type {string} */
	let bullet = node$1.ordered ? checkBulletOrdered(state) : checkBullet(state);
	/** @type {string} */
	const bulletOther = node$1.ordered ? bullet === "." ? ")" : "." : checkBulletOther(state);
	let useDifferentMarker = parent && state.bulletLastUsed ? bullet === state.bulletLastUsed : false;
	if (!node$1.ordered) {
		const firstListItem = node$1.children ? node$1.children[0] : void 0;
		if ((bullet === "*" || bullet === "-") && firstListItem && (!firstListItem.children || !firstListItem.children[0]) && state.stack[state.stack.length - 1] === "list" && state.stack[state.stack.length - 2] === "listItem" && state.stack[state.stack.length - 3] === "list" && state.stack[state.stack.length - 4] === "listItem" && state.indexStack[state.indexStack.length - 1] === 0 && state.indexStack[state.indexStack.length - 2] === 0 && state.indexStack[state.indexStack.length - 3] === 0) useDifferentMarker = true;
		if (checkRule(state) === bullet && firstListItem) {
			let index$2 = -1;
			while (++index$2 < node$1.children.length) {
				const item = node$1.children[index$2];
				if (item && item.type === "listItem" && item.children && item.children[0] && item.children[0].type === "thematicBreak") {
					useDifferentMarker = true;
					break;
				}
			}
		}
	}
	if (useDifferentMarker) bullet = bulletOther;
	state.bulletCurrent = bullet;
	const value = state.containerFlow(node$1, info);
	state.bulletLastUsed = bullet;
	state.bulletCurrent = bulletCurrent;
	exit$2();
	return value;
}

//#endregion
//#region node_modules/mdast-util-to-markdown/lib/util/check-list-item-indent.js
/**
* @import {Options, State} from 'mdast-util-to-markdown'
*/
/**
* @param {State} state
* @returns {Exclude<Options['listItemIndent'], null | undefined>}
*/
function checkListItemIndent(state) {
	const style$1 = state.options.listItemIndent || "one";
	if (style$1 !== "tab" && style$1 !== "one" && style$1 !== "mixed") throw new Error("Cannot serialize items with `" + style$1 + "` for `options.listItemIndent`, expected `tab`, `one`, or `mixed`");
	return style$1;
}

//#endregion
//#region node_modules/mdast-util-to-markdown/lib/handle/list-item.js
/**
* @param {ListItem} node
* @param {Parents | undefined} parent
* @param {State} state
* @param {Info} info
* @returns {string}
*/
function listItem(node$1, parent, state, info) {
	const listItemIndent = checkListItemIndent(state);
	let bullet = state.bulletCurrent || checkBullet(state);
	if (parent && parent.type === "list" && parent.ordered) bullet = (typeof parent.start === "number" && parent.start > -1 ? parent.start : 1) + (state.options.incrementListMarker === false ? 0 : parent.children.indexOf(node$1)) + bullet;
	let size = bullet.length + 1;
	if (listItemIndent === "tab" || listItemIndent === "mixed" && (parent && parent.type === "list" && parent.spread || node$1.spread)) size = Math.ceil(size / 4) * 4;
	const tracker = state.createTracker(info);
	tracker.move(bullet + " ".repeat(size - bullet.length));
	tracker.shift(size);
	const exit$2 = state.enter("listItem");
	const value = state.indentLines(state.containerFlow(node$1, tracker.current()), map$2);
	exit$2();
	return value;
	/** @type {Map} */
	function map$2(line, index$2, blank) {
		if (index$2) return (blank ? "" : " ".repeat(size)) + line;
		return (blank ? bullet : bullet + " ".repeat(size - bullet.length)) + line;
	}
}

//#endregion
//#region node_modules/mdast-util-to-markdown/lib/handle/paragraph.js
/**
* @import {Info, State} from 'mdast-util-to-markdown'
* @import {Paragraph, Parents} from 'mdast'
*/
/**
* @param {Paragraph} node
* @param {Parents | undefined} _
* @param {State} state
* @param {Info} info
* @returns {string}
*/
function paragraph(node$1, _, state, info) {
	const exit$2 = state.enter("paragraph");
	const subexit = state.enter("phrasing");
	const value = state.containerPhrasing(node$1, info);
	subexit();
	exit$2();
	return value;
}

//#endregion
//#region node_modules/mdast-util-phrasing/lib/index.js
/**
* Check if the given value is *phrasing content*.
*
* > 👉 **Note**: Excludes `html`, which can be both phrasing or flow.
*
* @param node
*   Thing to check, typically `Node`.
* @returns
*   Whether `value` is phrasing content.
*/
const phrasing = convert([
	"break",
	"delete",
	"emphasis",
	"footnote",
	"footnoteReference",
	"image",
	"imageReference",
	"inlineCode",
	"inlineMath",
	"link",
	"linkReference",
	"mdxJsxTextElement",
	"mdxTextExpression",
	"strong",
	"text",
	"textDirective"
]);

//#endregion
//#region node_modules/mdast-util-to-markdown/lib/handle/root.js
/**
* @param {Root} node
* @param {Parents | undefined} _
* @param {State} state
* @param {Info} info
* @returns {string}
*/
function root(node$1, _, state, info) {
	return (node$1.children.some(function(d) {
		return phrasing(d);
	}) ? state.containerPhrasing : state.containerFlow).call(state, node$1, info);
}

//#endregion
//#region node_modules/mdast-util-to-markdown/lib/util/check-strong.js
/**
* @import {Options, State} from 'mdast-util-to-markdown'
*/
/**
* @param {State} state
* @returns {Exclude<Options['strong'], null | undefined>}
*/
function checkStrong(state) {
	const marker = state.options.strong || "*";
	if (marker !== "*" && marker !== "_") throw new Error("Cannot serialize strong with `" + marker + "` for `options.strong`, expected `*`, or `_`");
	return marker;
}

//#endregion
//#region node_modules/mdast-util-to-markdown/lib/handle/strong.js
strong.peek = strongPeek;
/**
* @param {Strong} node
* @param {Parents | undefined} _
* @param {State} state
* @param {Info} info
* @returns {string}
*/
function strong(node$1, _, state, info) {
	const marker = checkStrong(state);
	const exit$2 = state.enter("strong");
	const tracker = state.createTracker(info);
	const before = tracker.move(marker + marker);
	let between = tracker.move(state.containerPhrasing(node$1, {
		after: marker,
		before,
		...tracker.current()
	}));
	const betweenHead = between.charCodeAt(0);
	const open = encodeInfo(info.before.charCodeAt(info.before.length - 1), betweenHead, marker);
	if (open.inside) between = encodeCharacterReference(betweenHead) + between.slice(1);
	const betweenTail = between.charCodeAt(between.length - 1);
	const close = encodeInfo(info.after.charCodeAt(0), betweenTail, marker);
	if (close.inside) between = between.slice(0, -1) + encodeCharacterReference(betweenTail);
	const after = tracker.move(marker + marker);
	exit$2();
	state.attentionEncodeSurroundingInfo = {
		after: close.outside,
		before: open.outside
	};
	return before + between + after;
}
/**
* @param {Strong} _
* @param {Parents | undefined} _1
* @param {State} state
* @returns {string}
*/
function strongPeek(_, _1, state) {
	return state.options.strong || "*";
}

//#endregion
//#region node_modules/mdast-util-to-markdown/lib/handle/text.js
/**
* @import {Info, State} from 'mdast-util-to-markdown'
* @import {Parents, Text} from 'mdast'
*/
/**
* @param {Text} node
* @param {Parents | undefined} _
* @param {State} state
* @param {Info} info
* @returns {string}
*/
function text$1(node$1, _, state, info) {
	return state.safe(node$1.value, info);
}

//#endregion
//#region node_modules/mdast-util-to-markdown/lib/util/check-rule-repetition.js
/**
* @import {Options, State} from 'mdast-util-to-markdown'
*/
/**
* @param {State} state
* @returns {Exclude<Options['ruleRepetition'], null | undefined>}
*/
function checkRuleRepetition(state) {
	const repetition = state.options.ruleRepetition || 3;
	if (repetition < 3) throw new Error("Cannot serialize rules with repetition `" + repetition + "` for `options.ruleRepetition`, expected `3` or more");
	return repetition;
}

//#endregion
//#region node_modules/mdast-util-to-markdown/lib/handle/thematic-break.js
/**
* @param {ThematicBreak} _
* @param {Parents | undefined} _1
* @param {State} state
* @returns {string}
*/
function thematicBreak(_, _1, state) {
	const value = (checkRule(state) + (state.options.ruleSpaces ? " " : "")).repeat(checkRuleRepetition(state));
	return state.options.ruleSpaces ? value.slice(0, -1) : value;
}

//#endregion
//#region node_modules/mdast-util-to-markdown/lib/handle/index.js
/**
* Default (CommonMark) handlers.
*/
const handle = {
	blockquote,
	break: hardBreak,
	code: code$1,
	definition,
	emphasis,
	hardBreak,
	heading,
	html,
	image,
	imageReference,
	inlineCode,
	link,
	linkReference,
	list,
	listItem,
	paragraph,
	root,
	strong,
	text: text$1,
	thematicBreak
};

//#endregion
//#region node_modules/mdast-util-gfm-table/lib/index.js
/**
* Create an extension for `mdast-util-from-markdown` to enable GFM tables in
* markdown.
*
* @returns {FromMarkdownExtension}
*   Extension for `mdast-util-from-markdown` to enable GFM tables.
*/
function gfmTableFromMarkdown() {
	return {
		enter: {
			table: enterTable,
			tableData: enterCell,
			tableHeader: enterCell,
			tableRow: enterRow
		},
		exit: {
			codeText: exitCodeText,
			table: exitTable,
			tableData: exit,
			tableHeader: exit,
			tableRow: exit
		}
	};
}
/**
* @this {CompileContext}
* @type {FromMarkdownHandle}
*/
function enterTable(token) {
	const align = token._align;
	/* @__PURE__ */ ok(align, "expected `_align` on table");
	this.enter({
		type: "table",
		align: align.map(function(d) {
			return d === "none" ? null : d;
		}),
		children: []
	}, token);
	this.data.inTable = true;
}
/**
* @this {CompileContext}
* @type {FromMarkdownHandle}
*/
function exitTable(token) {
	this.exit(token);
	this.data.inTable = void 0;
}
/**
* @this {CompileContext}
* @type {FromMarkdownHandle}
*/
function enterRow(token) {
	this.enter({
		type: "tableRow",
		children: []
	}, token);
}
/**
* @this {CompileContext}
* @type {FromMarkdownHandle}
*/
function exit(token) {
	this.exit(token);
}
/**
* @this {CompileContext}
* @type {FromMarkdownHandle}
*/
function enterCell(token) {
	this.enter({
		type: "tableCell",
		children: []
	}, token);
}
/**
* @this {CompileContext}
* @type {FromMarkdownHandle}
*/
function exitCodeText(token) {
	let value = this.resume();
	if (this.data.inTable) value = value.replace(/\\([\\|])/g, replace);
	const node$1 = this.stack[this.stack.length - 1];
	/* @__PURE__ */ ok(node$1.type === "inlineCode");
	node$1.value = value;
	this.exit(token);
}
/**
* @param {string} $0
* @param {string} $1
* @returns {string}
*/
function replace($0, $1) {
	return $1 === "|" ? $1 : $0;
}
/**
* Create an extension for `mdast-util-to-markdown` to enable GFM tables in
* markdown.
*
* @param {Options | null | undefined} [options]
*   Configuration.
* @returns {ToMarkdownExtension}
*   Extension for `mdast-util-to-markdown` to enable GFM tables.
*/
function gfmTableToMarkdown(options) {
	const settings = options || {};
	const padding = settings.tableCellPadding;
	const alignDelimiters = settings.tablePipeAlign;
	const stringLength = settings.stringLength;
	const around = padding ? " " : "|";
	return {
		unsafe: [
			{
				character: "\r",
				inConstruct: "tableCell"
			},
			{
				character: "\n",
				inConstruct: "tableCell"
			},
			{
				atBreak: true,
				character: "|",
				after: "[	 :-]"
			},
			{
				character: "|",
				inConstruct: "tableCell"
			},
			{
				atBreak: true,
				character: ":",
				after: "-"
			},
			{
				atBreak: true,
				character: "-",
				after: "[:|-]"
			}
		],
		handlers: {
			inlineCode: inlineCodeWithTable,
			table: handleTable,
			tableCell: handleTableCell,
			tableRow: handleTableRow
		}
	};
	/**
	* @type {ToMarkdownHandle}
	* @param {Table} node
	*/
	function handleTable(node$1, _, state, info) {
		return serializeData(handleTableAsData(node$1, state, info), node$1.align);
	}
	/**
	* This function isn’t really used normally, because we handle rows at the
	* table level.
	* But, if someone passes in a table row, this ensures we make somewhat sense.
	*
	* @type {ToMarkdownHandle}
	* @param {TableRow} node
	*/
	function handleTableRow(node$1, _, state, info) {
		const value = serializeData([handleTableRowAsData(node$1, state, info)]);
		return value.slice(0, value.indexOf("\n"));
	}
	/**
	* @type {ToMarkdownHandle}
	* @param {TableCell} node
	*/
	function handleTableCell(node$1, _, state, info) {
		const exit$2 = state.enter("tableCell");
		const subexit = state.enter("phrasing");
		const value = state.containerPhrasing(node$1, {
			...info,
			before: around,
			after: around
		});
		subexit();
		exit$2();
		return value;
	}
	/**
	* @param {Array<Array<string>>} matrix
	* @param {Array<string | null | undefined> | null | undefined} [align]
	*/
	function serializeData(matrix, align) {
		return markdownTable(matrix, {
			align,
			alignDelimiters,
			padding,
			stringLength
		});
	}
	/**
	* @param {Table} node
	* @param {State} state
	* @param {Info} info
	*/
	function handleTableAsData(node$1, state, info) {
		const children$1 = node$1.children;
		let index$2 = -1;
		/** @type {Array<Array<string>>} */
		const result = [];
		const subexit = state.enter("table");
		while (++index$2 < children$1.length) result[index$2] = handleTableRowAsData(children$1[index$2], state, info);
		subexit();
		return result;
	}
	/**
	* @param {TableRow} node
	* @param {State} state
	* @param {Info} info
	*/
	function handleTableRowAsData(node$1, state, info) {
		const children$1 = node$1.children;
		let index$2 = -1;
		/** @type {Array<string>} */
		const result = [];
		const subexit = state.enter("tableRow");
		while (++index$2 < children$1.length) result[index$2] = handleTableCell(children$1[index$2], node$1, state, info);
		subexit();
		return result;
	}
	/**
	* @type {ToMarkdownHandle}
	* @param {InlineCode} node
	*/
	function inlineCodeWithTable(node$1, parent, state) {
		let value = handle.inlineCode(node$1, parent, state);
		if (state.stack.includes("tableCell")) value = value.replace(/\|/g, "\\$&");
		return value;
	}
}

//#endregion
//#region node_modules/mdast-util-gfm-task-list-item/lib/index.js
/**
* Create an extension for `mdast-util-from-markdown` to enable GFM task
* list items in markdown.
*
* @returns {FromMarkdownExtension}
*   Extension for `mdast-util-from-markdown` to enable GFM task list items.
*/
function gfmTaskListItemFromMarkdown() {
	return { exit: {
		taskListCheckValueChecked: exitCheck,
		taskListCheckValueUnchecked: exitCheck,
		paragraph: exitParagraphWithTaskListItem
	} };
}
/**
* Create an extension for `mdast-util-to-markdown` to enable GFM task list
* items in markdown.
*
* @returns {ToMarkdownExtension}
*   Extension for `mdast-util-to-markdown` to enable GFM task list items.
*/
function gfmTaskListItemToMarkdown() {
	return {
		unsafe: [{
			atBreak: true,
			character: "-",
			after: "[:|-]"
		}],
		handlers: { listItem: listItemWithTaskListItem }
	};
}
/**
* @this {CompileContext}
* @type {FromMarkdownHandle}
*/
function exitCheck(token) {
	const node$1 = this.stack[this.stack.length - 2];
	/* @__PURE__ */ ok(node$1.type === "listItem");
	node$1.checked = token.type === "taskListCheckValueChecked";
}
/**
* @this {CompileContext}
* @type {FromMarkdownHandle}
*/
function exitParagraphWithTaskListItem(token) {
	const parent = this.stack[this.stack.length - 2];
	if (parent && parent.type === "listItem" && typeof parent.checked === "boolean") {
		const node$1 = this.stack[this.stack.length - 1];
		/* @__PURE__ */ ok(node$1.type === "paragraph");
		const head = node$1.children[0];
		if (head && head.type === "text") {
			const siblings = parent.children;
			let index$2 = -1;
			/** @type {Paragraph | undefined} */
			let firstParaghraph;
			while (++index$2 < siblings.length) {
				const sibling = siblings[index$2];
				if (sibling.type === "paragraph") {
					firstParaghraph = sibling;
					break;
				}
			}
			if (firstParaghraph === node$1) {
				head.value = head.value.slice(1);
				if (head.value.length === 0) node$1.children.shift();
				else if (node$1.position && head.position && typeof head.position.start.offset === "number") {
					head.position.start.column++;
					head.position.start.offset++;
					node$1.position.start = Object.assign({}, head.position.start);
				}
			}
		}
	}
	this.exit(token);
}
/**
* @type {ToMarkdownHandle}
* @param {ListItem} node
*/
function listItemWithTaskListItem(node$1, parent, state, info) {
	const head = node$1.children[0];
	const checkable = typeof node$1.checked === "boolean" && head && head.type === "paragraph";
	const checkbox = "[" + (node$1.checked ? "x" : " ") + "] ";
	const tracker = state.createTracker(info);
	if (checkable) tracker.move(checkbox);
	let value = handle.listItem(node$1, parent, state, {
		...info,
		...tracker.current()
	});
	if (checkable) value = value.replace(/^(?:[*+-]|\d+\.)([\r\n]| {1,3})/, check);
	return value;
	/**
	* @param {string} $0
	* @returns {string}
	*/
	function check($0) {
		return $0 + checkbox;
	}
}

//#endregion
//#region node_modules/mdast-util-gfm/lib/index.js
/**
* Create an extension for `mdast-util-from-markdown` to enable GFM (autolink
* literals, footnotes, strikethrough, tables, tasklists).
*
* @returns {Array<FromMarkdownExtension>}
*   Extension for `mdast-util-from-markdown` to enable GFM (autolink literals,
*   footnotes, strikethrough, tables, tasklists).
*/
function gfmFromMarkdown() {
	return [
		gfmAutolinkLiteralFromMarkdown(),
		gfmFootnoteFromMarkdown(),
		gfmStrikethroughFromMarkdown(),
		gfmTableFromMarkdown(),
		gfmTaskListItemFromMarkdown()
	];
}
/**
* Create an extension for `mdast-util-to-markdown` to enable GFM (autolink
* literals, footnotes, strikethrough, tables, tasklists).
*
* @param {Options | null | undefined} [options]
*   Configuration (optional).
* @returns {ToMarkdownExtension}
*   Extension for `mdast-util-to-markdown` to enable GFM (autolink literals,
*   footnotes, strikethrough, tables, tasklists).
*/
function gfmToMarkdown(options) {
	return { extensions: [
		gfmAutolinkLiteralToMarkdown(),
		gfmFootnoteToMarkdown(options),
		gfmStrikethroughToMarkdown(),
		gfmTableToMarkdown(options),
		gfmTaskListItemToMarkdown()
	] };
}

//#endregion
//#region node_modules/micromark-extension-gfm-autolink-literal/lib/syntax.js
const wwwPrefix = {
	tokenize: tokenizeWwwPrefix,
	partial: true
};
const domain = {
	tokenize: tokenizeDomain,
	partial: true
};
const path = {
	tokenize: tokenizePath,
	partial: true
};
const trail = {
	tokenize: tokenizeTrail,
	partial: true
};
const emailDomainDotTrail = {
	tokenize: tokenizeEmailDomainDotTrail,
	partial: true
};
const wwwAutolink = {
	name: "wwwAutolink",
	tokenize: tokenizeWwwAutolink,
	previous: previousWww
};
const protocolAutolink = {
	name: "protocolAutolink",
	tokenize: tokenizeProtocolAutolink,
	previous: previousProtocol
};
const emailAutolink = {
	name: "emailAutolink",
	tokenize: tokenizeEmailAutolink,
	previous: previousEmail
};
/** @type {ConstructRecord} */
const text = {};
/**
* Create an extension for `micromark` to support GitHub autolink literal
* syntax.
*
* @returns {Extension}
*   Extension for `micromark` that can be passed in `extensions` to enable GFM
*   autolink literal syntax.
*/
function gfmAutolinkLiteral() {
	return { text };
}
/** @type {Code} */
let code = 48;
while (code < 123) {
	text[code] = emailAutolink;
	code++;
	if (code === 58) code = 65;
	else if (code === 91) code = 97;
}
text[43] = emailAutolink;
text[45] = emailAutolink;
text[46] = emailAutolink;
text[95] = emailAutolink;
text[72] = [emailAutolink, protocolAutolink];
text[104] = [emailAutolink, protocolAutolink];
text[87] = [emailAutolink, wwwAutolink];
text[119] = [emailAutolink, wwwAutolink];
/**
* Email autolink literal.
*
* ```markdown
* > | a contact@example.org b
*       ^^^^^^^^^^^^^^^^^^^
* ```
*
* @this {TokenizeContext}
* @type {Tokenizer}
*/
function tokenizeEmailAutolink(effects, ok$2, nok) {
	const self$1 = this;
	/** @type {boolean | undefined} */
	let dot;
	/** @type {boolean} */
	let data;
	return start;
	/**
	* Start of email autolink literal.
	*
	* ```markdown
	* > | a contact@example.org b
	*       ^
	* ```
	*
	* @type {State}
	*/
	function start(code$3) {
		if (!gfmAtext(code$3) || !previousEmail.call(self$1, self$1.previous) || previousUnbalanced(self$1.events)) return nok(code$3);
		effects.enter("literalAutolink");
		effects.enter("literalAutolinkEmail");
		return atext(code$3);
	}
	/**
	* In email atext.
	*
	* ```markdown
	* > | a contact@example.org b
	*       ^
	* ```
	*
	* @type {State}
	*/
	function atext(code$3) {
		if (gfmAtext(code$3)) {
			effects.consume(code$3);
			return atext;
		}
		if (code$3 === 64) {
			effects.consume(code$3);
			return emailDomain;
		}
		return nok(code$3);
	}
	/**
	* In email domain.
	*
	* The reference code is a bit overly complex as it handles the `@`, of which
	* there may be just one.
	* Source: <https://github.com/github/cmark-gfm/blob/ef1cfcb/extensions/autolink.c#L318>
	*
	* ```markdown
	* > | a contact@example.org b
	*               ^
	* ```
	*
	* @type {State}
	*/
	function emailDomain(code$3) {
		if (code$3 === 46) return effects.check(emailDomainDotTrail, emailDomainAfter, emailDomainDot)(code$3);
		if (code$3 === 45 || code$3 === 95 || asciiAlphanumeric(code$3)) {
			data = true;
			effects.consume(code$3);
			return emailDomain;
		}
		return emailDomainAfter(code$3);
	}
	/**
	* In email domain, on dot that is not a trail.
	*
	* ```markdown
	* > | a contact@example.org b
	*                      ^
	* ```
	*
	* @type {State}
	*/
	function emailDomainDot(code$3) {
		effects.consume(code$3);
		dot = true;
		return emailDomain;
	}
	/**
	* After email domain.
	*
	* ```markdown
	* > | a contact@example.org b
	*                          ^
	* ```
	*
	* @type {State}
	*/
	function emailDomainAfter(code$3) {
		if (data && dot && asciiAlpha(self$1.previous)) {
			effects.exit("literalAutolinkEmail");
			effects.exit("literalAutolink");
			return ok$2(code$3);
		}
		return nok(code$3);
	}
}
/**
* `www` autolink literal.
*
* ```markdown
* > | a www.example.org b
*       ^^^^^^^^^^^^^^^
* ```
*
* @this {TokenizeContext}
* @type {Tokenizer}
*/
function tokenizeWwwAutolink(effects, ok$2, nok) {
	const self$1 = this;
	return wwwStart;
	/**
	* Start of www autolink literal.
	*
	* ```markdown
	* > | www.example.com/a?b#c
	*     ^
	* ```
	*
	* @type {State}
	*/
	function wwwStart(code$3) {
		if (code$3 !== 87 && code$3 !== 119 || !previousWww.call(self$1, self$1.previous) || previousUnbalanced(self$1.events)) return nok(code$3);
		effects.enter("literalAutolink");
		effects.enter("literalAutolinkWww");
		return effects.check(wwwPrefix, effects.attempt(domain, effects.attempt(path, wwwAfter), nok), nok)(code$3);
	}
	/**
	* After a www autolink literal.
	*
	* ```markdown
	* > | www.example.com/a?b#c
	*                          ^
	* ```
	*
	* @type {State}
	*/
	function wwwAfter(code$3) {
		effects.exit("literalAutolinkWww");
		effects.exit("literalAutolink");
		return ok$2(code$3);
	}
}
/**
* Protocol autolink literal.
*
* ```markdown
* > | a https://example.org b
*       ^^^^^^^^^^^^^^^^^^^
* ```
*
* @this {TokenizeContext}
* @type {Tokenizer}
*/
function tokenizeProtocolAutolink(effects, ok$2, nok) {
	const self$1 = this;
	let buffer = "";
	let seen = false;
	return protocolStart;
	/**
	* Start of protocol autolink literal.
	*
	* ```markdown
	* > | https://example.com/a?b#c
	*     ^
	* ```
	*
	* @type {State}
	*/
	function protocolStart(code$3) {
		if ((code$3 === 72 || code$3 === 104) && previousProtocol.call(self$1, self$1.previous) && !previousUnbalanced(self$1.events)) {
			effects.enter("literalAutolink");
			effects.enter("literalAutolinkHttp");
			buffer += String.fromCodePoint(code$3);
			effects.consume(code$3);
			return protocolPrefixInside;
		}
		return nok(code$3);
	}
	/**
	* In protocol.
	*
	* ```markdown
	* > | https://example.com/a?b#c
	*     ^^^^^
	* ```
	*
	* @type {State}
	*/
	function protocolPrefixInside(code$3) {
		if (asciiAlpha(code$3) && buffer.length < 5) {
			buffer += String.fromCodePoint(code$3);
			effects.consume(code$3);
			return protocolPrefixInside;
		}
		if (code$3 === 58) {
			const protocol = buffer.toLowerCase();
			if (protocol === "http" || protocol === "https") {
				effects.consume(code$3);
				return protocolSlashesInside;
			}
		}
		return nok(code$3);
	}
	/**
	* In slashes.
	*
	* ```markdown
	* > | https://example.com/a?b#c
	*           ^^
	* ```
	*
	* @type {State}
	*/
	function protocolSlashesInside(code$3) {
		if (code$3 === 47) {
			effects.consume(code$3);
			if (seen) return afterProtocol;
			seen = true;
			return protocolSlashesInside;
		}
		return nok(code$3);
	}
	/**
	* After protocol, before domain.
	*
	* ```markdown
	* > | https://example.com/a?b#c
	*             ^
	* ```
	*
	* @type {State}
	*/
	function afterProtocol(code$3) {
		return code$3 === null || asciiControl(code$3) || markdownLineEndingOrSpace(code$3) || unicodeWhitespace(code$3) || unicodePunctuation(code$3) ? nok(code$3) : effects.attempt(domain, effects.attempt(path, protocolAfter), nok)(code$3);
	}
	/**
	* After a protocol autolink literal.
	*
	* ```markdown
	* > | https://example.com/a?b#c
	*                              ^
	* ```
	*
	* @type {State}
	*/
	function protocolAfter(code$3) {
		effects.exit("literalAutolinkHttp");
		effects.exit("literalAutolink");
		return ok$2(code$3);
	}
}
/**
* `www` prefix.
*
* ```markdown
* > | a www.example.org b
*       ^^^^
* ```
*
* @this {TokenizeContext}
* @type {Tokenizer}
*/
function tokenizeWwwPrefix(effects, ok$2, nok) {
	let size = 0;
	return wwwPrefixInside;
	/**
	* In www prefix.
	*
	* ```markdown
	* > | www.example.com
	*     ^^^^
	* ```
	*
	* @type {State}
	*/
	function wwwPrefixInside(code$3) {
		if ((code$3 === 87 || code$3 === 119) && size < 3) {
			size++;
			effects.consume(code$3);
			return wwwPrefixInside;
		}
		if (code$3 === 46 && size === 3) {
			effects.consume(code$3);
			return wwwPrefixAfter;
		}
		return nok(code$3);
	}
	/**
	* After www prefix.
	*
	* ```markdown
	* > | www.example.com
	*         ^
	* ```
	*
	* @type {State}
	*/
	function wwwPrefixAfter(code$3) {
		return code$3 === null ? nok(code$3) : ok$2(code$3);
	}
}
/**
* Domain.
*
* ```markdown
* > | a https://example.org b
*               ^^^^^^^^^^^
* ```
*
* @this {TokenizeContext}
* @type {Tokenizer}
*/
function tokenizeDomain(effects, ok$2, nok) {
	/** @type {boolean | undefined} */
	let underscoreInLastSegment;
	/** @type {boolean | undefined} */
	let underscoreInLastLastSegment;
	/** @type {boolean | undefined} */
	let seen;
	return domainInside;
	/**
	* In domain.
	*
	* ```markdown
	* > | https://example.com/a
	*             ^^^^^^^^^^^
	* ```
	*
	* @type {State}
	*/
	function domainInside(code$3) {
		if (code$3 === 46 || code$3 === 95) return effects.check(trail, domainAfter, domainAtPunctuation)(code$3);
		if (code$3 === null || markdownLineEndingOrSpace(code$3) || unicodeWhitespace(code$3) || code$3 !== 45 && unicodePunctuation(code$3)) return domainAfter(code$3);
		seen = true;
		effects.consume(code$3);
		return domainInside;
	}
	/**
	* In domain, at potential trailing punctuation, that was not trailing.
	*
	* ```markdown
	* > | https://example.com
	*                    ^
	* ```
	*
	* @type {State}
	*/
	function domainAtPunctuation(code$3) {
		if (code$3 === 95) underscoreInLastSegment = true;
		else {
			underscoreInLastLastSegment = underscoreInLastSegment;
			underscoreInLastSegment = void 0;
		}
		effects.consume(code$3);
		return domainInside;
	}
	/**
	* After domain.
	*
	* ```markdown
	* > | https://example.com/a
	*                        ^
	* ```
	*
	* @type {State} */
	function domainAfter(code$3) {
		if (underscoreInLastLastSegment || underscoreInLastSegment || !seen) return nok(code$3);
		return ok$2(code$3);
	}
}
/**
* Path.
*
* ```markdown
* > | a https://example.org/stuff b
*                          ^^^^^^
* ```
*
* @this {TokenizeContext}
* @type {Tokenizer}
*/
function tokenizePath(effects, ok$2) {
	let sizeOpen = 0;
	let sizeClose = 0;
	return pathInside;
	/**
	* In path.
	*
	* ```markdown
	* > | https://example.com/a
	*                        ^^
	* ```
	*
	* @type {State}
	*/
	function pathInside(code$3) {
		if (code$3 === 40) {
			sizeOpen++;
			effects.consume(code$3);
			return pathInside;
		}
		if (code$3 === 41 && sizeClose < sizeOpen) return pathAtPunctuation(code$3);
		if (code$3 === 33 || code$3 === 34 || code$3 === 38 || code$3 === 39 || code$3 === 41 || code$3 === 42 || code$3 === 44 || code$3 === 46 || code$3 === 58 || code$3 === 59 || code$3 === 60 || code$3 === 63 || code$3 === 93 || code$3 === 95 || code$3 === 126) return effects.check(trail, ok$2, pathAtPunctuation)(code$3);
		if (code$3 === null || markdownLineEndingOrSpace(code$3) || unicodeWhitespace(code$3)) return ok$2(code$3);
		effects.consume(code$3);
		return pathInside;
	}
	/**
	* In path, at potential trailing punctuation, that was not trailing.
	*
	* ```markdown
	* > | https://example.com/a"b
	*                          ^
	* ```
	*
	* @type {State}
	*/
	function pathAtPunctuation(code$3) {
		if (code$3 === 41) sizeClose++;
		effects.consume(code$3);
		return pathInside;
	}
}
/**
* Trail.
*
* This calls `ok` if this *is* the trail, followed by an end, which means
* the entire trail is not part of the link.
* It calls `nok` if this *is* part of the link.
*
* ```markdown
* > | https://example.com").
*                        ^^^
* ```
*
* @this {TokenizeContext}
* @type {Tokenizer}
*/
function tokenizeTrail(effects, ok$2, nok) {
	return trail$1;
	/**
	* In trail of domain or path.
	*
	* ```markdown
	* > | https://example.com").
	*                        ^
	* ```
	*
	* @type {State}
	*/
	function trail$1(code$3) {
		if (code$3 === 33 || code$3 === 34 || code$3 === 39 || code$3 === 41 || code$3 === 42 || code$3 === 44 || code$3 === 46 || code$3 === 58 || code$3 === 59 || code$3 === 63 || code$3 === 95 || code$3 === 126) {
			effects.consume(code$3);
			return trail$1;
		}
		if (code$3 === 38) {
			effects.consume(code$3);
			return trailCharacterReferenceStart;
		}
		if (code$3 === 93) {
			effects.consume(code$3);
			return trailBracketAfter;
		}
		if (code$3 === 60 || code$3 === null || markdownLineEndingOrSpace(code$3) || unicodeWhitespace(code$3)) return ok$2(code$3);
		return nok(code$3);
	}
	/**
	* In trail, after `]`.
	*
	* > 👉 **Note**: this deviates from `cmark-gfm` to fix a bug.
	* > See end of <https://github.com/github/cmark-gfm/issues/278> for more.
	*
	* ```markdown
	* > | https://example.com](
	*                         ^
	* ```
	*
	* @type {State}
	*/
	function trailBracketAfter(code$3) {
		if (code$3 === null || code$3 === 40 || code$3 === 91 || markdownLineEndingOrSpace(code$3) || unicodeWhitespace(code$3)) return ok$2(code$3);
		return trail$1(code$3);
	}
	/**
	* In character-reference like trail, after `&`.
	*
	* ```markdown
	* > | https://example.com&amp;).
	*                         ^
	* ```
	*
	* @type {State}
	*/
	function trailCharacterReferenceStart(code$3) {
		return asciiAlpha(code$3) ? trailCharacterReferenceInside(code$3) : nok(code$3);
	}
	/**
	* In character-reference like trail.
	*
	* ```markdown
	* > | https://example.com&amp;).
	*                         ^
	* ```
	*
	* @type {State}
	*/
	function trailCharacterReferenceInside(code$3) {
		if (code$3 === 59) {
			effects.consume(code$3);
			return trail$1;
		}
		if (asciiAlpha(code$3)) {
			effects.consume(code$3);
			return trailCharacterReferenceInside;
		}
		return nok(code$3);
	}
}
/**
* Dot in email domain trail.
*
* This calls `ok` if this *is* the trail, followed by an end, which means
* the trail is not part of the link.
* It calls `nok` if this *is* part of the link.
*
* ```markdown
* > | contact@example.org.
*                        ^
* ```
*
* @this {TokenizeContext}
* @type {Tokenizer}
*/
function tokenizeEmailDomainDotTrail(effects, ok$2, nok) {
	return start;
	/**
	* Dot.
	*
	* ```markdown
	* > | contact@example.org.
	*                    ^   ^
	* ```
	*
	* @type {State}
	*/
	function start(code$3) {
		effects.consume(code$3);
		return after;
	}
	/**
	* After dot.
	*
	* ```markdown
	* > | contact@example.org.
	*                     ^   ^
	* ```
	*
	* @type {State}
	*/
	function after(code$3) {
		return asciiAlphanumeric(code$3) ? nok(code$3) : ok$2(code$3);
	}
}
/**
* See:
* <https://github.com/github/cmark-gfm/blob/ef1cfcb/extensions/autolink.c#L156>.
*
* @type {Previous}
*/
function previousWww(code$3) {
	return code$3 === null || code$3 === 40 || code$3 === 42 || code$3 === 95 || code$3 === 91 || code$3 === 93 || code$3 === 126 || markdownLineEndingOrSpace(code$3);
}
/**
* See:
* <https://github.com/github/cmark-gfm/blob/ef1cfcb/extensions/autolink.c#L214>.
*
* @type {Previous}
*/
function previousProtocol(code$3) {
	return !asciiAlpha(code$3);
}
/**
* @this {TokenizeContext}
* @type {Previous}
*/
function previousEmail(code$3) {
	return !(code$3 === 47 || gfmAtext(code$3));
}
/**
* @param {Code} code
* @returns {boolean}
*/
function gfmAtext(code$3) {
	return code$3 === 43 || code$3 === 45 || code$3 === 46 || code$3 === 95 || asciiAlphanumeric(code$3);
}
/**
* @param {Array<Event>} events
* @returns {boolean}
*/
function previousUnbalanced(events) {
	let index$2 = events.length;
	let result = false;
	while (index$2--) {
		const token = events[index$2][1];
		if ((token.type === "labelLink" || token.type === "labelImage") && !token._balanced) {
			result = true;
			break;
		}
		if (token._gfmAutolinkLiteralWalkedInto) {
			result = false;
			break;
		}
	}
	if (events.length > 0 && !result) events[events.length - 1][1]._gfmAutolinkLiteralWalkedInto = true;
	return result;
}

//#endregion
//#region node_modules/micromark-extension-gfm-footnote/lib/syntax.js
const indent = {
	tokenize: tokenizeIndent,
	partial: true
};
/**
* Create an extension for `micromark` to enable GFM footnote syntax.
*
* @returns {Extension}
*   Extension for `micromark` that can be passed in `extensions` to
*   enable GFM footnote syntax.
*/
function gfmFootnote() {
	/** @type {Extension} */
	return {
		document: { [91]: {
			name: "gfmFootnoteDefinition",
			tokenize: tokenizeDefinitionStart,
			continuation: { tokenize: tokenizeDefinitionContinuation },
			exit: gfmFootnoteDefinitionEnd
		} },
		text: {
			[91]: {
				name: "gfmFootnoteCall",
				tokenize: tokenizeGfmFootnoteCall
			},
			[93]: {
				name: "gfmPotentialFootnoteCall",
				add: "after",
				tokenize: tokenizePotentialGfmFootnoteCall,
				resolveTo: resolveToPotentialGfmFootnoteCall
			}
		}
	};
}
/**
* @this {TokenizeContext}
* @type {Tokenizer}
*/
function tokenizePotentialGfmFootnoteCall(effects, ok$2, nok) {
	const self$1 = this;
	let index$2 = self$1.events.length;
	const defined = self$1.parser.gfmFootnotes || (self$1.parser.gfmFootnotes = []);
	/** @type {Token} */
	let labelStart;
	while (index$2--) {
		const token = self$1.events[index$2][1];
		if (token.type === "labelImage") {
			labelStart = token;
			break;
		}
		if (token.type === "gfmFootnoteCall" || token.type === "labelLink" || token.type === "label" || token.type === "image" || token.type === "link") break;
	}
	return start;
	/**
	* @type {State}
	*/
	function start(code$3) {
		if (!labelStart || !labelStart._balanced) return nok(code$3);
		const id = normalizeIdentifier(self$1.sliceSerialize({
			start: labelStart.end,
			end: self$1.now()
		}));
		if (id.codePointAt(0) !== 94 || !defined.includes(id.slice(1))) return nok(code$3);
		effects.enter("gfmFootnoteCallLabelMarker");
		effects.consume(code$3);
		effects.exit("gfmFootnoteCallLabelMarker");
		return ok$2(code$3);
	}
}
/** @type {Resolver} */
function resolveToPotentialGfmFootnoteCall(events, context) {
	let index$2 = events.length;
	while (index$2--) if (events[index$2][1].type === "labelImage" && events[index$2][0] === "enter") {
		events[index$2][1];
		break;
	}
	events[index$2 + 1][1].type = "data";
	events[index$2 + 3][1].type = "gfmFootnoteCallLabelMarker";
	/** @type {Token} */
	const call$1 = {
		type: "gfmFootnoteCall",
		start: Object.assign({}, events[index$2 + 3][1].start),
		end: Object.assign({}, events[events.length - 1][1].end)
	};
	/** @type {Token} */
	const marker = {
		type: "gfmFootnoteCallMarker",
		start: Object.assign({}, events[index$2 + 3][1].end),
		end: Object.assign({}, events[index$2 + 3][1].end)
	};
	marker.end.column++;
	marker.end.offset++;
	marker.end._bufferIndex++;
	/** @type {Token} */
	const string$2 = {
		type: "gfmFootnoteCallString",
		start: Object.assign({}, marker.end),
		end: Object.assign({}, events[events.length - 1][1].start)
	};
	/** @type {Token} */
	const chunk = {
		type: "chunkString",
		contentType: "string",
		start: Object.assign({}, string$2.start),
		end: Object.assign({}, string$2.end)
	};
	/** @type {Array<Event>} */
	const replacement = [
		events[index$2 + 1],
		events[index$2 + 2],
		[
			"enter",
			call$1,
			context
		],
		events[index$2 + 3],
		events[index$2 + 4],
		[
			"enter",
			marker,
			context
		],
		[
			"exit",
			marker,
			context
		],
		[
			"enter",
			string$2,
			context
		],
		[
			"enter",
			chunk,
			context
		],
		[
			"exit",
			chunk,
			context
		],
		[
			"exit",
			string$2,
			context
		],
		events[events.length - 2],
		events[events.length - 1],
		[
			"exit",
			call$1,
			context
		]
	];
	events.splice(index$2, events.length - index$2 + 1, ...replacement);
	return events;
}
/**
* @this {TokenizeContext}
* @type {Tokenizer}
*/
function tokenizeGfmFootnoteCall(effects, ok$2, nok) {
	const self$1 = this;
	const defined = self$1.parser.gfmFootnotes || (self$1.parser.gfmFootnotes = []);
	let size = 0;
	/** @type {boolean} */
	let data;
	return start;
	/**
	* Start of footnote label.
	*
	* ```markdown
	* > | a [^b] c
	*       ^
	* ```
	*
	* @type {State}
	*/
	function start(code$3) {
		effects.enter("gfmFootnoteCall");
		effects.enter("gfmFootnoteCallLabelMarker");
		effects.consume(code$3);
		effects.exit("gfmFootnoteCallLabelMarker");
		return callStart;
	}
	/**
	* After `[`, at `^`.
	*
	* ```markdown
	* > | a [^b] c
	*        ^
	* ```
	*
	* @type {State}
	*/
	function callStart(code$3) {
		if (code$3 !== 94) return nok(code$3);
		effects.enter("gfmFootnoteCallMarker");
		effects.consume(code$3);
		effects.exit("gfmFootnoteCallMarker");
		effects.enter("gfmFootnoteCallString");
		effects.enter("chunkString").contentType = "string";
		return callData;
	}
	/**
	* In label.
	*
	* ```markdown
	* > | a [^b] c
	*         ^
	* ```
	*
	* @type {State}
	*/
	function callData(code$3) {
		if (size > 999 || code$3 === 93 && !data || code$3 === null || code$3 === 91 || markdownLineEndingOrSpace(code$3)) return nok(code$3);
		if (code$3 === 93) {
			effects.exit("chunkString");
			const token = effects.exit("gfmFootnoteCallString");
			if (!defined.includes(normalizeIdentifier(self$1.sliceSerialize(token)))) return nok(code$3);
			effects.enter("gfmFootnoteCallLabelMarker");
			effects.consume(code$3);
			effects.exit("gfmFootnoteCallLabelMarker");
			effects.exit("gfmFootnoteCall");
			return ok$2;
		}
		if (!markdownLineEndingOrSpace(code$3)) data = true;
		size++;
		effects.consume(code$3);
		return code$3 === 92 ? callEscape : callData;
	}
	/**
	* On character after escape.
	*
	* ```markdown
	* > | a [^b\c] d
	*           ^
	* ```
	*
	* @type {State}
	*/
	function callEscape(code$3) {
		if (code$3 === 91 || code$3 === 92 || code$3 === 93) {
			effects.consume(code$3);
			size++;
			return callData;
		}
		return callData(code$3);
	}
}
/**
* @this {TokenizeContext}
* @type {Tokenizer}
*/
function tokenizeDefinitionStart(effects, ok$2, nok) {
	const self$1 = this;
	const defined = self$1.parser.gfmFootnotes || (self$1.parser.gfmFootnotes = []);
	/** @type {string} */
	let identifier;
	let size = 0;
	/** @type {boolean | undefined} */
	let data;
	return start;
	/**
	* Start of GFM footnote definition.
	*
	* ```markdown
	* > | [^a]: b
	*     ^
	* ```
	*
	* @type {State}
	*/
	function start(code$3) {
		effects.enter("gfmFootnoteDefinition")._container = true;
		effects.enter("gfmFootnoteDefinitionLabel");
		effects.enter("gfmFootnoteDefinitionLabelMarker");
		effects.consume(code$3);
		effects.exit("gfmFootnoteDefinitionLabelMarker");
		return labelAtMarker;
	}
	/**
	* In label, at caret.
	*
	* ```markdown
	* > | [^a]: b
	*      ^
	* ```
	*
	* @type {State}
	*/
	function labelAtMarker(code$3) {
		if (code$3 === 94) {
			effects.enter("gfmFootnoteDefinitionMarker");
			effects.consume(code$3);
			effects.exit("gfmFootnoteDefinitionMarker");
			effects.enter("gfmFootnoteDefinitionLabelString");
			effects.enter("chunkString").contentType = "string";
			return labelInside;
		}
		return nok(code$3);
	}
	/**
	* In label.
	*
	* > 👉 **Note**: `cmark-gfm` prevents whitespace from occurring in footnote
	* > definition labels.
	*
	* ```markdown
	* > | [^a]: b
	*       ^
	* ```
	*
	* @type {State}
	*/
	function labelInside(code$3) {
		if (size > 999 || code$3 === 93 && !data || code$3 === null || code$3 === 91 || markdownLineEndingOrSpace(code$3)) return nok(code$3);
		if (code$3 === 93) {
			effects.exit("chunkString");
			const token = effects.exit("gfmFootnoteDefinitionLabelString");
			identifier = normalizeIdentifier(self$1.sliceSerialize(token));
			effects.enter("gfmFootnoteDefinitionLabelMarker");
			effects.consume(code$3);
			effects.exit("gfmFootnoteDefinitionLabelMarker");
			effects.exit("gfmFootnoteDefinitionLabel");
			return labelAfter;
		}
		if (!markdownLineEndingOrSpace(code$3)) data = true;
		size++;
		effects.consume(code$3);
		return code$3 === 92 ? labelEscape : labelInside;
	}
	/**
	* After `\`, at a special character.
	*
	* > 👉 **Note**: `cmark-gfm` currently does not support escaped brackets:
	* > <https://github.com/github/cmark-gfm/issues/240>
	*
	* ```markdown
	* > | [^a\*b]: c
	*         ^
	* ```
	*
	* @type {State}
	*/
	function labelEscape(code$3) {
		if (code$3 === 91 || code$3 === 92 || code$3 === 93) {
			effects.consume(code$3);
			size++;
			return labelInside;
		}
		return labelInside(code$3);
	}
	/**
	* After definition label.
	*
	* ```markdown
	* > | [^a]: b
	*         ^
	* ```
	*
	* @type {State}
	*/
	function labelAfter(code$3) {
		if (code$3 === 58) {
			effects.enter("definitionMarker");
			effects.consume(code$3);
			effects.exit("definitionMarker");
			if (!defined.includes(identifier)) defined.push(identifier);
			return factorySpace(effects, whitespaceAfter, "gfmFootnoteDefinitionWhitespace");
		}
		return nok(code$3);
	}
	/**
	* After definition prefix.
	*
	* ```markdown
	* > | [^a]: b
	*           ^
	* ```
	*
	* @type {State}
	*/
	function whitespaceAfter(code$3) {
		return ok$2(code$3);
	}
}
/**
* @this {TokenizeContext}
* @type {Tokenizer}
*/
function tokenizeDefinitionContinuation(effects, ok$2, nok) {
	return effects.check(blankLine, ok$2, effects.attempt(indent, ok$2, nok));
}
/** @type {Exiter} */
function gfmFootnoteDefinitionEnd(effects) {
	effects.exit("gfmFootnoteDefinition");
}
/**
* @this {TokenizeContext}
* @type {Tokenizer}
*/
function tokenizeIndent(effects, ok$2, nok) {
	const self$1 = this;
	return factorySpace(effects, afterPrefix, "gfmFootnoteDefinitionIndent", 5);
	/**
	* @type {State}
	*/
	function afterPrefix(code$3) {
		const tail = self$1.events[self$1.events.length - 1];
		return tail && tail[1].type === "gfmFootnoteDefinitionIndent" && tail[2].sliceSerialize(tail[1], true).length === 4 ? ok$2(code$3) : nok(code$3);
	}
}

//#endregion
//#region node_modules/micromark-extension-gfm-strikethrough/lib/syntax.js
/**
* Create an extension for `micromark` to enable GFM strikethrough syntax.
*
* @param {Options | null | undefined} [options={}]
*   Configuration.
* @returns {Extension}
*   Extension for `micromark` that can be passed in `extensions`, to
*   enable GFM strikethrough syntax.
*/
function gfmStrikethrough(options) {
	let single = (options || {}).singleTilde;
	const tokenizer = {
		name: "strikethrough",
		tokenize: tokenizeStrikethrough,
		resolveAll: resolveAllStrikethrough
	};
	if (single === null || single === void 0) single = true;
	return {
		text: { [126]: tokenizer },
		insideSpan: { null: [tokenizer] },
		attentionMarkers: { null: [126] }
	};
	/**
	* Take events and resolve strikethrough.
	*
	* @type {Resolver}
	*/
	function resolveAllStrikethrough(events, context) {
		let index$2 = -1;
		while (++index$2 < events.length) if (events[index$2][0] === "enter" && events[index$2][1].type === "strikethroughSequenceTemporary" && events[index$2][1]._close) {
			let open = index$2;
			while (open--) if (events[open][0] === "exit" && events[open][1].type === "strikethroughSequenceTemporary" && events[open][1]._open && events[index$2][1].end.offset - events[index$2][1].start.offset === events[open][1].end.offset - events[open][1].start.offset) {
				events[index$2][1].type = "strikethroughSequence";
				events[open][1].type = "strikethroughSequence";
				/** @type {Token} */
				const strikethrough$1 = {
					type: "strikethrough",
					start: Object.assign({}, events[open][1].start),
					end: Object.assign({}, events[index$2][1].end)
				};
				/** @type {Token} */
				const text$9 = {
					type: "strikethroughText",
					start: Object.assign({}, events[open][1].end),
					end: Object.assign({}, events[index$2][1].start)
				};
				/** @type {Array<Event>} */
				const nextEvents = [
					[
						"enter",
						strikethrough$1,
						context
					],
					[
						"enter",
						events[open][1],
						context
					],
					[
						"exit",
						events[open][1],
						context
					],
					[
						"enter",
						text$9,
						context
					]
				];
				const insideSpan$1 = context.parser.constructs.insideSpan.null;
				if (insideSpan$1) splice(nextEvents, nextEvents.length, 0, resolveAll(insideSpan$1, events.slice(open + 1, index$2), context));
				splice(nextEvents, nextEvents.length, 0, [
					[
						"exit",
						text$9,
						context
					],
					[
						"enter",
						events[index$2][1],
						context
					],
					[
						"exit",
						events[index$2][1],
						context
					],
					[
						"exit",
						strikethrough$1,
						context
					]
				]);
				splice(events, open - 1, index$2 - open + 3, nextEvents);
				index$2 = open + nextEvents.length - 2;
				break;
			}
		}
		index$2 = -1;
		while (++index$2 < events.length) if (events[index$2][1].type === "strikethroughSequenceTemporary") events[index$2][1].type = "data";
		return events;
	}
	/**
	* @this {TokenizeContext}
	* @type {Tokenizer}
	*/
	function tokenizeStrikethrough(effects, ok$2, nok) {
		const previous$2 = this.previous;
		const events = this.events;
		let size = 0;
		return start;
		/** @type {State} */
		function start(code$3) {
			if (previous$2 === 126 && events[events.length - 1][1].type !== "characterEscape") return nok(code$3);
			effects.enter("strikethroughSequenceTemporary");
			return more(code$3);
		}
		/** @type {State} */
		function more(code$3) {
			const before = classifyCharacter(previous$2);
			if (code$3 === 126) {
				if (size > 1) return nok(code$3);
				effects.consume(code$3);
				size++;
				return more;
			}
			if (size < 2 && !single) return nok(code$3);
			const token = effects.exit("strikethroughSequenceTemporary");
			const after = classifyCharacter(code$3);
			token._open = !after || after === 2 && Boolean(before);
			token._close = !before || before === 2 && Boolean(after);
			return ok$2(code$3);
		}
	}
}

//#endregion
//#region node_modules/micromark-extension-gfm-table/lib/edit-map.js
/**
* @import {Event} from 'micromark-util-types'
*/
/**
* @typedef {[number, number, Array<Event>]} Change
* @typedef {[number, number, number]} Jump
*/
/**
* Tracks a bunch of edits.
*/
var EditMap = class {
	/**
	* Create a new edit map.
	*/
	constructor() {
		/**
		* Record of changes.
		*
		* @type {Array<Change>}
		*/
		this.map = [];
	}
	/**
	* Create an edit: a remove and/or add at a certain place.
	*
	* @param {number} index
	* @param {number} remove
	* @param {Array<Event>} add
	* @returns {undefined}
	*/
	add(index$2, remove, add) {
		addImplementation(this, index$2, remove, add);
	}
	/**
	* Done, change the events.
	*
	* @param {Array<Event>} events
	* @returns {undefined}
	*/
	consume(events) {
		this.map.sort(function(a, b) {
			return a[0] - b[0];
		});
		/* c8 ignore next 3 -- `resolve` is never called without tables, so without edits. */
		if (this.map.length === 0) return;
		let index$2 = this.map.length;
		/** @type {Array<Array<Event>>} */
		const vecs = [];
		while (index$2 > 0) {
			index$2 -= 1;
			vecs.push(events.slice(this.map[index$2][0] + this.map[index$2][1]), this.map[index$2][2]);
			events.length = this.map[index$2][0];
		}
		vecs.push(events.slice());
		events.length = 0;
		let slice = vecs.pop();
		while (slice) {
			for (const element$5 of slice) events.push(element$5);
			slice = vecs.pop();
		}
		this.map.length = 0;
	}
};
/**
* Create an edit.
*
* @param {EditMap} editMap
* @param {number} at
* @param {number} remove
* @param {Array<Event>} add
* @returns {undefined}
*/
function addImplementation(editMap, at, remove, add) {
	let index$2 = 0;
	/* c8 ignore next 3 -- `resolve` is never called without tables, so without edits. */
	if (remove === 0 && add.length === 0) return;
	while (index$2 < editMap.map.length) {
		if (editMap.map[index$2][0] === at) {
			editMap.map[index$2][1] += remove;
			editMap.map[index$2][2].push(...add);
			return;
		}
		index$2 += 1;
	}
	editMap.map.push([
		at,
		remove,
		add
	]);
}

//#endregion
//#region node_modules/micromark-extension-gfm-table/lib/infer.js
/**
* @import {Event} from 'micromark-util-types'
*/
/**
* @typedef {'center' | 'left' | 'none' | 'right'} Align
*/
/**
* Figure out the alignment of a GFM table.
*
* @param {Readonly<Array<Event>>} events
*   List of events.
* @param {number} index
*   Table enter event.
* @returns {Array<Align>}
*   List of aligns.
*/
function gfmTableAlign(events, index$2) {
	let inDelimiterRow = false;
	/** @type {Array<Align>} */
	const align = [];
	while (index$2 < events.length) {
		const event = events[index$2];
		if (inDelimiterRow) {
			if (event[0] === "enter") {
				if (event[1].type === "tableContent") align.push(events[index$2 + 1][1].type === "tableDelimiterMarker" ? "left" : "none");
			} else if (event[1].type === "tableContent") {
				if (events[index$2 - 1][1].type === "tableDelimiterMarker") {
					const alignIndex = align.length - 1;
					align[alignIndex] = align[alignIndex] === "left" ? "center" : "right";
				}
			} else if (event[1].type === "tableDelimiterRow") break;
		} else if (event[0] === "enter" && event[1].type === "tableDelimiterRow") inDelimiterRow = true;
		index$2 += 1;
	}
	return align;
}

//#endregion
//#region node_modules/micromark-extension-gfm-table/lib/syntax.js
/**
* Create an HTML extension for `micromark` to support GitHub tables syntax.
*
* @returns {Extension}
*   Extension for `micromark` that can be passed in `extensions` to enable GFM
*   table syntax.
*/
function gfmTable() {
	return { flow: { null: {
		name: "table",
		tokenize: tokenizeTable,
		resolveAll: resolveTable
	} } };
}
/**
* @this {TokenizeContext}
* @type {Tokenizer}
*/
function tokenizeTable(effects, ok$2, nok) {
	const self$1 = this;
	let size = 0;
	let sizeB = 0;
	/** @type {boolean | undefined} */
	let seen;
	return start;
	/**
	* Start of a GFM table.
	*
	* If there is a valid table row or table head before, then we try to parse
	* another row.
	* Otherwise, we try to parse a head.
	*
	* ```markdown
	* > | | a |
	*     ^
	*   | | - |
	* > | | b |
	*     ^
	* ```
	* @type {State}
	*/
	function start(code$3) {
		let index$2 = self$1.events.length - 1;
		while (index$2 > -1) {
			const type = self$1.events[index$2][1].type;
			if (type === "lineEnding" || type === "linePrefix") index$2--;
			else break;
		}
		const tail = index$2 > -1 ? self$1.events[index$2][1].type : null;
		const next$1 = tail === "tableHead" || tail === "tableRow" ? bodyRowStart : headRowBefore;
		if (next$1 === bodyRowStart && self$1.parser.lazy[self$1.now().line]) return nok(code$3);
		return next$1(code$3);
	}
	/**
	* Before table head row.
	*
	* ```markdown
	* > | | a |
	*     ^
	*   | | - |
	*   | | b |
	* ```
	*
	* @type {State}
	*/
	function headRowBefore(code$3) {
		effects.enter("tableHead");
		effects.enter("tableRow");
		return headRowStart(code$3);
	}
	/**
	* Before table head row, after whitespace.
	*
	* ```markdown
	* > | | a |
	*     ^
	*   | | - |
	*   | | b |
	* ```
	*
	* @type {State}
	*/
	function headRowStart(code$3) {
		if (code$3 === 124) return headRowBreak(code$3);
		seen = true;
		sizeB += 1;
		return headRowBreak(code$3);
	}
	/**
	* At break in table head row.
	*
	* ```markdown
	* > | | a |
	*     ^
	*       ^
	*         ^
	*   | | - |
	*   | | b |
	* ```
	*
	* @type {State}
	*/
	function headRowBreak(code$3) {
		if (code$3 === null) return nok(code$3);
		if (markdownLineEnding(code$3)) {
			if (sizeB > 1) {
				sizeB = 0;
				self$1.interrupt = true;
				effects.exit("tableRow");
				effects.enter("lineEnding");
				effects.consume(code$3);
				effects.exit("lineEnding");
				return headDelimiterStart;
			}
			return nok(code$3);
		}
		if (markdownSpace(code$3)) return factorySpace(effects, headRowBreak, "whitespace")(code$3);
		sizeB += 1;
		if (seen) {
			seen = false;
			size += 1;
		}
		if (code$3 === 124) {
			effects.enter("tableCellDivider");
			effects.consume(code$3);
			effects.exit("tableCellDivider");
			seen = true;
			return headRowBreak;
		}
		effects.enter("data");
		return headRowData(code$3);
	}
	/**
	* In table head row data.
	*
	* ```markdown
	* > | | a |
	*       ^
	*   | | - |
	*   | | b |
	* ```
	*
	* @type {State}
	*/
	function headRowData(code$3) {
		if (code$3 === null || code$3 === 124 || markdownLineEndingOrSpace(code$3)) {
			effects.exit("data");
			return headRowBreak(code$3);
		}
		effects.consume(code$3);
		return code$3 === 92 ? headRowEscape : headRowData;
	}
	/**
	* In table head row escape.
	*
	* ```markdown
	* > | | a\-b |
	*         ^
	*   | | ---- |
	*   | | c    |
	* ```
	*
	* @type {State}
	*/
	function headRowEscape(code$3) {
		if (code$3 === 92 || code$3 === 124) {
			effects.consume(code$3);
			return headRowData;
		}
		return headRowData(code$3);
	}
	/**
	* Before delimiter row.
	*
	* ```markdown
	*   | | a |
	* > | | - |
	*     ^
	*   | | b |
	* ```
	*
	* @type {State}
	*/
	function headDelimiterStart(code$3) {
		self$1.interrupt = false;
		if (self$1.parser.lazy[self$1.now().line]) return nok(code$3);
		effects.enter("tableDelimiterRow");
		seen = false;
		if (markdownSpace(code$3)) return factorySpace(effects, headDelimiterBefore, "linePrefix", self$1.parser.constructs.disable.null.includes("codeIndented") ? void 0 : 4)(code$3);
		return headDelimiterBefore(code$3);
	}
	/**
	* Before delimiter row, after optional whitespace.
	*
	* Reused when a `|` is found later, to parse another cell.
	*
	* ```markdown
	*   | | a |
	* > | | - |
	*     ^
	*   | | b |
	* ```
	*
	* @type {State}
	*/
	function headDelimiterBefore(code$3) {
		if (code$3 === 45 || code$3 === 58) return headDelimiterValueBefore(code$3);
		if (code$3 === 124) {
			seen = true;
			effects.enter("tableCellDivider");
			effects.consume(code$3);
			effects.exit("tableCellDivider");
			return headDelimiterCellBefore;
		}
		return headDelimiterNok(code$3);
	}
	/**
	* After `|`, before delimiter cell.
	*
	* ```markdown
	*   | | a |
	* > | | - |
	*      ^
	* ```
	*
	* @type {State}
	*/
	function headDelimiterCellBefore(code$3) {
		if (markdownSpace(code$3)) return factorySpace(effects, headDelimiterValueBefore, "whitespace")(code$3);
		return headDelimiterValueBefore(code$3);
	}
	/**
	* Before delimiter cell value.
	*
	* ```markdown
	*   | | a |
	* > | | - |
	*       ^
	* ```
	*
	* @type {State}
	*/
	function headDelimiterValueBefore(code$3) {
		if (code$3 === 58) {
			sizeB += 1;
			seen = true;
			effects.enter("tableDelimiterMarker");
			effects.consume(code$3);
			effects.exit("tableDelimiterMarker");
			return headDelimiterLeftAlignmentAfter;
		}
		if (code$3 === 45) {
			sizeB += 1;
			return headDelimiterLeftAlignmentAfter(code$3);
		}
		if (code$3 === null || markdownLineEnding(code$3)) return headDelimiterCellAfter(code$3);
		return headDelimiterNok(code$3);
	}
	/**
	* After delimiter cell left alignment marker.
	*
	* ```markdown
	*   | | a  |
	* > | | :- |
	*        ^
	* ```
	*
	* @type {State}
	*/
	function headDelimiterLeftAlignmentAfter(code$3) {
		if (code$3 === 45) {
			effects.enter("tableDelimiterFiller");
			return headDelimiterFiller(code$3);
		}
		return headDelimiterNok(code$3);
	}
	/**
	* In delimiter cell filler.
	*
	* ```markdown
	*   | | a |
	* > | | - |
	*       ^
	* ```
	*
	* @type {State}
	*/
	function headDelimiterFiller(code$3) {
		if (code$3 === 45) {
			effects.consume(code$3);
			return headDelimiterFiller;
		}
		if (code$3 === 58) {
			seen = true;
			effects.exit("tableDelimiterFiller");
			effects.enter("tableDelimiterMarker");
			effects.consume(code$3);
			effects.exit("tableDelimiterMarker");
			return headDelimiterRightAlignmentAfter;
		}
		effects.exit("tableDelimiterFiller");
		return headDelimiterRightAlignmentAfter(code$3);
	}
	/**
	* After delimiter cell right alignment marker.
	*
	* ```markdown
	*   | |  a |
	* > | | -: |
	*         ^
	* ```
	*
	* @type {State}
	*/
	function headDelimiterRightAlignmentAfter(code$3) {
		if (markdownSpace(code$3)) return factorySpace(effects, headDelimiterCellAfter, "whitespace")(code$3);
		return headDelimiterCellAfter(code$3);
	}
	/**
	* After delimiter cell.
	*
	* ```markdown
	*   | |  a |
	* > | | -: |
	*          ^
	* ```
	*
	* @type {State}
	*/
	function headDelimiterCellAfter(code$3) {
		if (code$3 === 124) return headDelimiterBefore(code$3);
		if (code$3 === null || markdownLineEnding(code$3)) {
			if (!seen || size !== sizeB) return headDelimiterNok(code$3);
			effects.exit("tableDelimiterRow");
			effects.exit("tableHead");
			return ok$2(code$3);
		}
		return headDelimiterNok(code$3);
	}
	/**
	* In delimiter row, at a disallowed byte.
	*
	* ```markdown
	*   | | a |
	* > | | x |
	*       ^
	* ```
	*
	* @type {State}
	*/
	function headDelimiterNok(code$3) {
		return nok(code$3);
	}
	/**
	* Before table body row.
	*
	* ```markdown
	*   | | a |
	*   | | - |
	* > | | b |
	*     ^
	* ```
	*
	* @type {State}
	*/
	function bodyRowStart(code$3) {
		effects.enter("tableRow");
		return bodyRowBreak(code$3);
	}
	/**
	* At break in table body row.
	*
	* ```markdown
	*   | | a |
	*   | | - |
	* > | | b |
	*     ^
	*       ^
	*         ^
	* ```
	*
	* @type {State}
	*/
	function bodyRowBreak(code$3) {
		if (code$3 === 124) {
			effects.enter("tableCellDivider");
			effects.consume(code$3);
			effects.exit("tableCellDivider");
			return bodyRowBreak;
		}
		if (code$3 === null || markdownLineEnding(code$3)) {
			effects.exit("tableRow");
			return ok$2(code$3);
		}
		if (markdownSpace(code$3)) return factorySpace(effects, bodyRowBreak, "whitespace")(code$3);
		effects.enter("data");
		return bodyRowData(code$3);
	}
	/**
	* In table body row data.
	*
	* ```markdown
	*   | | a |
	*   | | - |
	* > | | b |
	*       ^
	* ```
	*
	* @type {State}
	*/
	function bodyRowData(code$3) {
		if (code$3 === null || code$3 === 124 || markdownLineEndingOrSpace(code$3)) {
			effects.exit("data");
			return bodyRowBreak(code$3);
		}
		effects.consume(code$3);
		return code$3 === 92 ? bodyRowEscape : bodyRowData;
	}
	/**
	* In table body row escape.
	*
	* ```markdown
	*   | | a    |
	*   | | ---- |
	* > | | b\-c |
	*         ^
	* ```
	*
	* @type {State}
	*/
	function bodyRowEscape(code$3) {
		if (code$3 === 92 || code$3 === 124) {
			effects.consume(code$3);
			return bodyRowData;
		}
		return bodyRowData(code$3);
	}
}
/** @type {Resolver} */
function resolveTable(events, context) {
	let index$2 = -1;
	let inFirstCellAwaitingPipe = true;
	/** @type {RowKind} */
	let rowKind = 0;
	/** @type {Range} */
	let lastCell = [
		0,
		0,
		0,
		0
	];
	/** @type {Range} */
	let cell = [
		0,
		0,
		0,
		0
	];
	let afterHeadAwaitingFirstBodyRow = false;
	let lastTableEnd = 0;
	/** @type {Token | undefined} */
	let currentTable;
	/** @type {Token | undefined} */
	let currentBody;
	/** @type {Token | undefined} */
	let currentCell;
	const map$2 = new EditMap();
	while (++index$2 < events.length) {
		const event = events[index$2];
		const token = event[1];
		if (event[0] === "enter") {
			if (token.type === "tableHead") {
				afterHeadAwaitingFirstBodyRow = false;
				if (lastTableEnd !== 0) {
					flushTableEnd(map$2, context, lastTableEnd, currentTable, currentBody);
					currentBody = void 0;
					lastTableEnd = 0;
				}
				currentTable = {
					type: "table",
					start: Object.assign({}, token.start),
					end: Object.assign({}, token.end)
				};
				map$2.add(index$2, 0, [[
					"enter",
					currentTable,
					context
				]]);
			} else if (token.type === "tableRow" || token.type === "tableDelimiterRow") {
				inFirstCellAwaitingPipe = true;
				currentCell = void 0;
				lastCell = [
					0,
					0,
					0,
					0
				];
				cell = [
					0,
					index$2 + 1,
					0,
					0
				];
				if (afterHeadAwaitingFirstBodyRow) {
					afterHeadAwaitingFirstBodyRow = false;
					currentBody = {
						type: "tableBody",
						start: Object.assign({}, token.start),
						end: Object.assign({}, token.end)
					};
					map$2.add(index$2, 0, [[
						"enter",
						currentBody,
						context
					]]);
				}
				rowKind = token.type === "tableDelimiterRow" ? 2 : currentBody ? 3 : 1;
			} else if (rowKind && (token.type === "data" || token.type === "tableDelimiterMarker" || token.type === "tableDelimiterFiller")) {
				inFirstCellAwaitingPipe = false;
				if (cell[2] === 0) {
					if (lastCell[1] !== 0) {
						cell[0] = cell[1];
						currentCell = flushCell(map$2, context, lastCell, rowKind, void 0, currentCell);
						lastCell = [
							0,
							0,
							0,
							0
						];
					}
					cell[2] = index$2;
				}
			} else if (token.type === "tableCellDivider") if (inFirstCellAwaitingPipe) inFirstCellAwaitingPipe = false;
			else {
				if (lastCell[1] !== 0) {
					cell[0] = cell[1];
					currentCell = flushCell(map$2, context, lastCell, rowKind, void 0, currentCell);
				}
				lastCell = cell;
				cell = [
					lastCell[1],
					index$2,
					0,
					0
				];
			}
		} else if (token.type === "tableHead") {
			afterHeadAwaitingFirstBodyRow = true;
			lastTableEnd = index$2;
		} else if (token.type === "tableRow" || token.type === "tableDelimiterRow") {
			lastTableEnd = index$2;
			if (lastCell[1] !== 0) {
				cell[0] = cell[1];
				currentCell = flushCell(map$2, context, lastCell, rowKind, index$2, currentCell);
			} else if (cell[1] !== 0) currentCell = flushCell(map$2, context, cell, rowKind, index$2, currentCell);
			rowKind = 0;
		} else if (rowKind && (token.type === "data" || token.type === "tableDelimiterMarker" || token.type === "tableDelimiterFiller")) cell[3] = index$2;
	}
	if (lastTableEnd !== 0) flushTableEnd(map$2, context, lastTableEnd, currentTable, currentBody);
	map$2.consume(context.events);
	index$2 = -1;
	while (++index$2 < context.events.length) {
		const event = context.events[index$2];
		if (event[0] === "enter" && event[1].type === "table") event[1]._align = gfmTableAlign(context.events, index$2);
	}
	return events;
}
/**
* Generate a cell.
*
* @param {EditMap} map
* @param {Readonly<TokenizeContext>} context
* @param {Readonly<Range>} range
* @param {RowKind} rowKind
* @param {number | undefined} rowEnd
* @param {Token | undefined} previousCell
* @returns {Token | undefined}
*/
function flushCell(map$2, context, range, rowKind, rowEnd, previousCell) {
	const groupName = rowKind === 1 ? "tableHeader" : rowKind === 2 ? "tableDelimiter" : "tableData";
	const valueName = "tableContent";
	if (range[0] !== 0) {
		previousCell.end = Object.assign({}, getPoint(context.events, range[0]));
		map$2.add(range[0], 0, [[
			"exit",
			previousCell,
			context
		]]);
	}
	const now = getPoint(context.events, range[1]);
	previousCell = {
		type: groupName,
		start: Object.assign({}, now),
		end: Object.assign({}, now)
	};
	map$2.add(range[1], 0, [[
		"enter",
		previousCell,
		context
	]]);
	if (range[2] !== 0) {
		const relatedStart = getPoint(context.events, range[2]);
		const relatedEnd = getPoint(context.events, range[3]);
		/** @type {Token} */
		const valueToken = {
			type: valueName,
			start: Object.assign({}, relatedStart),
			end: Object.assign({}, relatedEnd)
		};
		map$2.add(range[2], 0, [[
			"enter",
			valueToken,
			context
		]]);
		if (rowKind !== 2) {
			const start = context.events[range[2]];
			const end = context.events[range[3]];
			start[1].end = Object.assign({}, end[1].end);
			start[1].type = "chunkText";
			start[1].contentType = "text";
			if (range[3] > range[2] + 1) {
				const a = range[2] + 1;
				const b = range[3] - range[2] - 1;
				map$2.add(a, b, []);
			}
		}
		map$2.add(range[3] + 1, 0, [[
			"exit",
			valueToken,
			context
		]]);
	}
	if (rowEnd !== void 0) {
		previousCell.end = Object.assign({}, getPoint(context.events, rowEnd));
		map$2.add(rowEnd, 0, [[
			"exit",
			previousCell,
			context
		]]);
		previousCell = void 0;
	}
	return previousCell;
}
/**
* Generate table end (and table body end).
*
* @param {Readonly<EditMap>} map
* @param {Readonly<TokenizeContext>} context
* @param {number} index
* @param {Token} table
* @param {Token | undefined} tableBody
*/
function flushTableEnd(map$2, context, index$2, table$1, tableBody) {
	/** @type {Array<Event>} */
	const exits = [];
	const related = getPoint(context.events, index$2);
	if (tableBody) {
		tableBody.end = Object.assign({}, related);
		exits.push([
			"exit",
			tableBody,
			context
		]);
	}
	table$1.end = Object.assign({}, related);
	exits.push([
		"exit",
		table$1,
		context
	]);
	map$2.add(index$2 + 1, 0, exits);
}
/**
* @param {Readonly<Array<Event>>} events
* @param {number} index
* @returns {Readonly<Point>}
*/
function getPoint(events, index$2) {
	const event = events[index$2];
	const side = event[0] === "enter" ? "start" : "end";
	return event[1][side];
}

//#endregion
//#region node_modules/micromark-extension-gfm-task-list-item/lib/syntax.js
const tasklistCheck = {
	name: "tasklistCheck",
	tokenize: tokenizeTasklistCheck
};
/**
* Create an HTML extension for `micromark` to support GFM task list items
* syntax.
*
* @returns {Extension}
*   Extension for `micromark` that can be passed in `htmlExtensions` to
*   support GFM task list items when serializing to HTML.
*/
function gfmTaskListItem() {
	return { text: { [91]: tasklistCheck } };
}
/**
* @this {TokenizeContext}
* @type {Tokenizer}
*/
function tokenizeTasklistCheck(effects, ok$2, nok) {
	const self$1 = this;
	return open;
	/**
	* At start of task list item check.
	*
	* ```markdown
	* > | * [x] y.
	*       ^
	* ```
	*
	* @type {State}
	*/
	function open(code$3) {
		if (self$1.previous !== null || !self$1._gfmTasklistFirstContentOfListItem) return nok(code$3);
		effects.enter("taskListCheck");
		effects.enter("taskListCheckMarker");
		effects.consume(code$3);
		effects.exit("taskListCheckMarker");
		return inside;
	}
	/**
	* In task list item check.
	*
	* ```markdown
	* > | * [x] y.
	*        ^
	* ```
	*
	* @type {State}
	*/
	function inside(code$3) {
		if (markdownLineEndingOrSpace(code$3)) {
			effects.enter("taskListCheckValueUnchecked");
			effects.consume(code$3);
			effects.exit("taskListCheckValueUnchecked");
			return close;
		}
		if (code$3 === 88 || code$3 === 120) {
			effects.enter("taskListCheckValueChecked");
			effects.consume(code$3);
			effects.exit("taskListCheckValueChecked");
			return close;
		}
		return nok(code$3);
	}
	/**
	* At close of task list item check.
	*
	* ```markdown
	* > | * [x] y.
	*         ^
	* ```
	*
	* @type {State}
	*/
	function close(code$3) {
		if (code$3 === 93) {
			effects.enter("taskListCheckMarker");
			effects.consume(code$3);
			effects.exit("taskListCheckMarker");
			effects.exit("taskListCheck");
			return after;
		}
		return nok(code$3);
	}
	/**
	* @type {State}
	*/
	function after(code$3) {
		if (markdownLineEnding(code$3)) return ok$2(code$3);
		if (markdownSpace(code$3)) return effects.check({ tokenize: spaceThenNonSpace }, ok$2, nok)(code$3);
		return nok(code$3);
	}
}
/**
* @this {TokenizeContext}
* @type {Tokenizer}
*/
function spaceThenNonSpace(effects, ok$2, nok) {
	return factorySpace(effects, after, "whitespace");
	/**
	* After whitespace, after task list item check.
	*
	* ```markdown
	* > | * [x] y.
	*           ^
	* ```
	*
	* @type {State}
	*/
	function after(code$3) {
		return code$3 === null ? nok(code$3) : ok$2(code$3);
	}
}

//#endregion
//#region node_modules/micromark-extension-gfm/index.js
/**
* Create an extension for `micromark` to enable GFM syntax.
*
* @param {Options | null | undefined} [options]
*   Configuration (optional).
*
*   Passed to `micromark-extens-gfm-strikethrough`.
* @returns {Extension}
*   Extension for `micromark` that can be passed in `extensions` to enable GFM
*   syntax.
*/
function gfm(options) {
	return combineExtensions([
		gfmAutolinkLiteral(),
		gfmFootnote(),
		gfmStrikethrough(options),
		gfmTable(),
		gfmTaskListItem()
	]);
}

//#endregion
//#region node_modules/remark-gfm/lib/index.js
/** @type {Options} */
const emptyOptions = {};
/**
* Add support GFM (autolink literals, footnotes, strikethrough, tables,
* tasklists).
*
* @param {Options | null | undefined} [options]
*   Configuration (optional).
* @returns {undefined}
*   Nothing.
*/
function remarkGfm(options) {
	const self$1 = this;
	const settings = options || emptyOptions;
	const data = self$1.data();
	const micromarkExtensions = data.micromarkExtensions || (data.micromarkExtensions = []);
	const fromMarkdownExtensions = data.fromMarkdownExtensions || (data.fromMarkdownExtensions = []);
	const toMarkdownExtensions = data.toMarkdownExtensions || (data.toMarkdownExtensions = []);
	micromarkExtensions.push(gfm(settings));
	fromMarkdownExtensions.push(gfmFromMarkdown());
	toMarkdownExtensions.push(gfmToMarkdown(settings));
}

//#endregion
//#region src/client/ReadmeRenderer.tsx
const SAFE_REPOSITORY_PART = /^[A-Za-z0-9_.-]+$/;
const CONTROL_OR_BACKSLASH = /[\u0000-\u001f\u007f\\]/;
const DISALLOWED_TAGS = new Set([
	"audio",
	"embed",
	"form",
	"iframe",
	"input",
	"math",
	"object",
	"script",
	"source",
	"style",
	"svg",
	"video"
]);
const readmeSchema = {
	...defaultSchema,
	tagNames: [...new Set([
		...defaultSchema.tagNames ?? [],
		"div",
		"details",
		"summary",
		"kbd",
		"sub",
		"sup"
	])].filter((tagName) => !DISALLOWED_TAGS.has(tagName)),
	attributes: {
		...defaultSchema.attributes,
		"*": (defaultSchema.attributes?.["*"] ?? []).filter((attribute) => attribute !== "id"),
		p: [...defaultSchema.attributes?.p ?? [], [
			"align",
			"left",
			"center",
			"right"
		]],
		div: [...defaultSchema.attributes?.div ?? [], [
			"align",
			"left",
			"center",
			"right"
		]],
		a: [
			...defaultSchema.attributes?.a ?? [],
			"href",
			"title"
		],
		img: [
			...defaultSchema.attributes?.img ?? [],
			"src",
			"alt",
			"title",
			"width",
			"height",
			[
				"align",
				"left",
				"center",
				"right"
			]
		]
	},
	protocols: {
		...defaultSchema.protocols,
		href: [
			"http",
			"https",
			"mailto"
		],
		src: ["http", "https"]
	},
	clobberPrefix: "readme-"
};
function repositoryParts(repositoryUrl) {
	if (repositoryUrl === null) return null;
	try {
		const url = new URL(repositoryUrl);
		if (url.protocol !== "https:" || url.hostname.toLocaleLowerCase() !== "github.com") return null;
		const [owner, rawRepo] = url.pathname.split("/").filter(Boolean);
		const repo = rawRepo?.replace(/\.git$/i, "");
		if (owner === void 0 || repo === void 0 || !SAFE_REPOSITORY_PART.test(owner) || !SAFE_REPOSITORY_PART.test(repo)) return null;
		return {
			owner,
			repo
		};
	} catch {
		return null;
	}
}
function sourceContext(source) {
	if (source === null) return null;
	const match = /^([^/@]+)\/([^/@]+)@([^/]+)\/(.+)$/.exec(source);
	if (match === null) return null;
	const [, owner, repo, ref, path$1] = match;
	if (owner === void 0 || repo === void 0 || ref === void 0 || path$1 === void 0 || !SAFE_REPOSITORY_PART.test(owner) || !SAFE_REPOSITORY_PART.test(repo) || ref.length === 0 || path$1.length === 0) return null;
	return {
		owner,
		repo,
		ref,
		path: path$1
	};
}
function readmeGitHubContext(source, repositoryUrl, ref) {
	const fromSource = sourceContext(source);
	if (fromSource !== null) return fromSource;
	const repository = repositoryParts(repositoryUrl);
	if (repository === null || source === null || source.includes("/") || CONTROL_OR_BACKSLASH.test(source)) return null;
	return {
		...repository,
		ref: ref ?? "HEAD",
		path: source
	};
}
function splitSuffix(value) {
	const query = value.indexOf("?");
	const fragment$1 = value.indexOf("#");
	const index$2 = query < 0 ? fragment$1 : fragment$1 < 0 ? query : Math.min(query, fragment$1);
	return index$2 < 0 ? {
		path: value,
		suffix: ""
	} : {
		path: value.slice(0, index$2),
		suffix: value.slice(index$2)
	};
}
function normalizedPath(value, basePath) {
	const { path: path$1 } = splitSuffix(value);
	const segments = [...value.startsWith("/") ? [] : basePath.split("/").slice(0, -1)];
	for (const raw$1 of path$1.replace(/^\/?/, "").split("/")) {
		if (raw$1.length === 0 || raw$1 === ".") continue;
		let segment;
		try {
			segment = decodeURIComponent(raw$1);
		} catch {
			return null;
		}
		if (segment.includes("/") || segment.includes("\\") || CONTROL_OR_BACKSLASH.test(segment)) return null;
		if (segment === "..") {
			if (segments.length === 0) return null;
			segments.pop();
			continue;
		}
		segments.push(segment);
	}
	return segments.length === 0 ? null : segments.map((segment) => encodeURIComponent(segment)).join("/");
}
function absoluteUrl(value, kind) {
	try {
		const url = new URL(value);
		const protocol = url.protocol.toLocaleLowerCase();
		if (protocol === "http:" || protocol === "https:") return url.href;
		if (kind === "link" && protocol === "mailto:") return url.href;
	} catch {}
	return null;
}
function resolveReadmeUrl(value, kind, context) {
	const url = value.trim();
	if (url.length === 0 || CONTROL_OR_BACKSLASH.test(url) || url.startsWith("//")) return null;
	const absolute = absoluteUrl(url, kind);
	if (absolute !== null) return absolute;
	if (/^[A-Za-z][A-Za-z0-9+.-]*:/.test(url) || context === null) return null;
	const relative = url.startsWith("#") || url.startsWith("?") ? context.path + url : url;
	const normalized = normalizedPath(relative, context.path);
	if (normalized === null) return null;
	const { suffix } = splitSuffix(relative);
	const ref = context.ref.split("/").map((segment) => encodeURIComponent(segment)).join("/");
	const owner = encodeURIComponent(context.owner);
	const repo = encodeURIComponent(context.repo);
	return kind === "image" ? `https://raw.githubusercontent.com/${owner}/${repo}/${ref}/${normalized}${suffix}` : `https://github.com/${owner}/${repo}/blob/${ref}/${normalized}${suffix}`;
}
function visitElements(node$1, visit$1) {
	if (node$1.type === "element") visit$1(node$1);
	if ("children" in node$1) for (const child of node$1.children) visitElements(child, visit$1);
}
const rehypeResolveReadmeUrls = ({ context }) => (tree) => {
	visitElements(tree, (element$5) => {
		const href = element$5.properties.href;
		if (typeof href === "string") {
			const resolved = resolveReadmeUrl(href, "link", context);
			if (resolved === null) delete element$5.properties.href;
			else element$5.properties.href = resolved;
		}
		const src = element$5.properties.src;
		if (typeof src === "string") {
			const resolved = resolveReadmeUrl(src, "image", context);
			if (resolved === null) delete element$5.properties.src;
			else element$5.properties.src = resolved;
		}
	});
};
const components = {
	a: ({ node: _node,...props }) => /* @__PURE__ */ (0, react_jsx_runtime.jsx)("a", {
		...props,
		target: "_blank",
		rel: "noreferrer noopener"
	}),
	img: ({ node: _node,...props }) => /* @__PURE__ */ (0, react_jsx_runtime.jsx)("img", {
		...props,
		loading: "lazy",
		decoding: "async",
		referrerPolicy: "no-referrer"
	})
};
function RichReadme({ value, source, repositoryUrl, gitRef }) {
	const context = readmeGitHubContext(source, repositoryUrl, gitRef);
	const urlTransform = (url, key) => resolveReadmeUrl(url, key === "src" ? "image" : "link", context);
	return /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Markdown, {
		remarkPlugins: [remarkGfm],
		rehypePlugins: [
			rehypeRaw,
			[rehypeResolveReadmeUrls, { context }],
			[rehypeSanitize, readmeSchema]
		],
		urlTransform,
		components,
		children: value
	});
}

//#endregion
//#region \0plugin-console-css:src/client/PluginManageSettingsTab.module.css.mjs
const css = ".gHlwVW_section{width:100%;min-width:0;max-width:880px;color:var(--dsw-alias-label-primary);flex-direction:column;gap:12px;display:flex}.gHlwVW_header,.gHlwVW_viewTabs,.gHlwVW_toolbar,.gHlwVW_listHeader,.gHlwVW_row,.gHlwVW_rowOpen,.gHlwVW_rowActions,.gHlwVW_iconActions,.gHlwVW_detailHeader,.gHlwVW_detailActionRow,.gHlwVW_detailFacts,.gHlwVW_pagination,.gHlwVW_modalHeader,.gHlwVW_modalActions,.gHlwVW_checkRow{align-items:center;display:flex}.gHlwVW_header{justify-content:space-between;gap:12px}.gHlwVW_header h3,.gHlwVW_header p,.gHlwVW_detailTitle h3,.gHlwVW_detailTitle p,.gHlwVW_detailDescription,.gHlwVW_readmeHeading h4,.gHlwVW_readmeHeading span,.gHlwVW_modal h3,.gHlwVW_modalLead,.gHlwVW_warningList h4,.gHlwVW_status,.gHlwVW_failure,.gHlwVW_errorBanner,.gHlwVW_banner,.gHlwVW_stale,.gHlwVW_inlineWarnings,.gHlwVW_markdown p{margin:0}.gHlwVW_header h3{font-size:15px;font-weight:650;line-height:22px}.gHlwVW_header p,.gHlwVW_status,.gHlwVW_muted,.gHlwVW_listHeader,.gHlwVW_rowMeta,.gHlwVW_detailTitle p,.gHlwVW_readmeHeading span,.gHlwVW_stale,.gHlwVW_failure,.gHlwVW_errorBanner,.gHlwVW_banner,.gHlwVW_capability{color:var(--dsw-alias-label-tertiary);font-size:12px;line-height:18px}.gHlwVW_capability{border:1px solid var(--dsw-alias-border-l2);white-space:nowrap;border-radius:5px;padding:3px 7px}.gHlwVW_capability[data-ready=true]{border-color:color-mix(in srgb, var(--dsw-alias-state-success-primary) 45%, var(--dsw-alias-border-l2));color:var(--dsw-alias-state-success-primary)}.gHlwVW_viewTabs{border-bottom:1px solid var(--dsw-alias-border-l2);gap:2px}.gHlwVW_viewTab{color:var(--dsw-alias-label-tertiary);font:inherit;cursor:pointer;background:0 0;border:0;border-bottom:2px solid #0000;padding:6px 10px;font-size:13px;line-height:20px}.gHlwVW_viewTab:hover,.gHlwVW_viewTab[data-active=true]{color:var(--dsw-alias-label-primary)}.gHlwVW_viewTab[data-active=true]{border-bottom-color:var(--dsw-alias-state-business-primary);font-weight:600}.gHlwVW_tabCount{color:var(--dsw-alias-label-tertiary);font-variant-numeric:tabular-nums;font-size:11px}.gHlwVW_banner,.gHlwVW_errorBanner{border:1px solid var(--dsw-alias-border-l2);border-left:3px solid var(--dsw-alias-state-success-primary);background:var(--dsw-alias-bg-layer-1);justify-content:space-between;gap:10px;padding:8px 10px}.gHlwVW_errorBanner{border-left-color:var(--dsw-alias-state-error-primary);color:var(--dsw-alias-state-error-primary)}.gHlwVW_toolbar{flex-wrap:wrap;gap:8px}.gHlwVW_search{min-width:180px;color:var(--dsw-alias-label-tertiary);flex:240px;align-items:center;display:flex;position:relative}.gHlwVW_search>svg{pointer-events:none;position:absolute;left:11px}.gHlwVW_search input,.gHlwVW_selectLabel select{box-sizing:border-box;border:1px solid var(--dsw-alias-border-l2);background:var(--dsw-alias-bg-layer-1);height:36px;color:var(--dsw-alias-label-primary);font:inherit;border-radius:7px;outline:none;font-size:13px}.gHlwVW_search input{width:100%;padding:0 10px 0 34px}.gHlwVW_search input:focus-visible,.gHlwVW_selectLabel select:focus-visible{border-color:var(--dsw-alias-state-business-primary);box-shadow:0 0 0 2px color-mix(in srgb, var(--dsw-alias-state-business-primary) 18%, transparent)}.gHlwVW_selectLabel{color:var(--dsw-alias-label-tertiary);align-items:center;gap:6px;font-size:12px;display:inline-flex}.gHlwVW_selectLabel select{min-width:140px;padding:0 8px}.gHlwVW_iconButton,.gHlwVW_iconButtonDanger,.gHlwVW_ghostButton,.gHlwVW_primaryButton,.gHlwVW_dangerButton,.gHlwVW_backButton{border:1px solid var(--dsw-alias-border-l2);min-height:28px;color:var(--dsw-alias-label-secondary);font:inherit;cursor:pointer;background:0 0;border-radius:6px;justify-content:center;align-items:center;gap:5px;font-size:12px;line-height:18px;text-decoration:none;display:inline-flex}.gHlwVW_iconButton,.gHlwVW_iconButtonDanger{width:30px;min-width:30px;padding:0}.gHlwVW_ghostButton,.gHlwVW_primaryButton,.gHlwVW_dangerButton,.gHlwVW_backButton{padding:4px 9px}.gHlwVW_iconButton:hover,.gHlwVW_ghostButton:hover,.gHlwVW_backButton:hover{background:var(--dsw-alias-interactive-bg-hover);color:var(--dsw-alias-label-primary)}.gHlwVW_iconButtonDanger,.gHlwVW_dangerButton{border-color:color-mix(in srgb, var(--dsw-alias-state-error-primary) 45%, var(--dsw-alias-border-l2));color:var(--dsw-alias-state-error-primary)}.gHlwVW_iconButtonDanger:hover,.gHlwVW_dangerButton:hover{background:color-mix(in srgb, var(--dsw-alias-state-error-primary) 10%, transparent)}.gHlwVW_primaryButton{border-color:var(--dsw-alias-state-business-primary);background:var(--dsw-alias-state-business-primary);color:var(--dsw-alias-label-white,#fff)}.gHlwVW_primaryButton:hover{filter:brightness(1.08)}button:disabled{cursor:default;opacity:.48}.gHlwVW_listHeader{justify-content:space-between;gap:10px;min-height:22px}.gHlwVW_listHeader>span:first-child{color:var(--dsw-alias-label-secondary);font-variant-numeric:tabular-nums}.gHlwVW_list{border:1px solid var(--dsw-alias-border-l2);border-radius:8px;flex-direction:column;gap:1px;margin:0;padding:0;list-style:none;display:flex;overflow:hidden}.gHlwVW_row{background:var(--dsw-alias-bg-layer-1);justify-content:space-between;gap:10px;min-width:0;padding:11px 12px}.gHlwVW_row+.gHlwVW_row{border-top:1px solid var(--dsw-alias-border-l2)}.gHlwVW_row:hover{background:var(--dsw-alias-interactive-bg-hover)}.gHlwVW_rowOpen{min-width:0;color:inherit;font:inherit;text-align:left;cursor:pointer;background:0 0;border:0;flex:auto;justify-content:flex-start;gap:10px;padding:0}.gHlwVW_avatar,.gHlwVW_avatarFallback{border-radius:7px;flex:none;width:32px;height:32px}.gHlwVW_avatar{object-fit:cover}.gHlwVW_avatarFallback{background:var(--dsw-alias-bg-layer-3);color:var(--dsw-alias-label-secondary);justify-content:center;align-items:center;font-size:13px;font-weight:650;display:inline-flex}.gHlwVW_rowBody{flex-direction:column;flex:auto;gap:3px;min-width:0;display:flex}.gHlwVW_rowHeading{align-items:center;gap:7px;min-width:0;display:flex}.gHlwVW_rowHeading strong{text-overflow:ellipsis;white-space:nowrap;min-width:0;font-size:13px;line-height:19px;overflow:hidden}.gHlwVW_rowDescription{color:var(--dsw-alias-label-secondary);text-overflow:ellipsis;white-space:nowrap;font-size:12px;line-height:18px;overflow:hidden}.gHlwVW_rowMeta{font-variant-numeric:tabular-nums;flex-wrap:wrap;gap:4px 10px;display:flex}.gHlwVW_rowActions,.gHlwVW_iconActions{flex:none;gap:6px}.gHlwVW_categoryBadge,.gHlwVW_sourceBadge,.gHlwVW_stateBadge{border:1px solid var(--dsw-alias-border-l2);min-height:18px;color:var(--dsw-alias-label-tertiary);white-space:nowrap;border-radius:4px;align-items:center;padding:1px 5px;font-size:10px;line-height:15px;display:inline-flex}.gHlwVW_sourceBadge[data-kind=npm]{border-color:color-mix(in srgb, #cb3837 45%, var(--dsw-alias-border-l2));color:#c43a3a}.gHlwVW_sourceBadge[data-kind=github]{color:var(--dsw-alias-label-secondary)}.gHlwVW_stateBadge[data-state=active]{border-color:color-mix(in srgb, var(--dsw-alias-state-success-primary) 45%, var(--dsw-alias-border-l2));color:var(--dsw-alias-state-success-primary)}.gHlwVW_stateBadge[data-state=paused],.gHlwVW_stateBadge[data-state=partially-paused],.gHlwVW_stateBadge[data-state^=pending]{border-color:color-mix(in srgb, var(--dsw-alias-state-warning-primary,#bc7a00) 45%, var(--dsw-alias-border-l2));color:var(--dsw-alias-state-warning-primary,#bc7a00)}.gHlwVW_updateMeta{color:var(--dsw-alias-state-business-primary)}.gHlwVW_pagination{color:var(--dsw-alias-label-tertiary);font-variant-numeric:tabular-nums;justify-content:center;gap:10px;font-size:12px}.gHlwVW_detail{border-top:1px solid var(--dsw-alias-border-l2);flex-direction:column;gap:13px;min-width:0;padding-top:12px;display:flex}.gHlwVW_backButton{border:0;align-self:flex-start;padding-left:0}.gHlwVW_detailHeader{gap:10px}.gHlwVW_detailHeader .gHlwVW_avatar,.gHlwVW_detailHeader .gHlwVW_avatarFallback{width:40px;height:40px}.gHlwVW_detailTitle{flex:auto;min-width:0}.gHlwVW_detailTitle h3{overflow-wrap:anywhere;font-size:16px;line-height:22px}.gHlwVW_detailDescription{color:var(--dsw-alias-label-secondary);font-size:13px;line-height:20px}.gHlwVW_detailFacts{color:var(--dsw-alias-label-tertiary);flex-wrap:wrap;gap:5px 12px;font-size:12px}.gHlwVW_verified{color:var(--dsw-alias-state-success-primary)}.gHlwVW_unverified{color:var(--dsw-alias-state-warning-primary,#bc7a00)}.gHlwVW_detailActionRow{flex-wrap:wrap;gap:8px}.gHlwVW_spec,.gHlwVW_breakable{overflow-wrap:anywhere;font-family:var(--ds-font-family-code);font-size:11px}.gHlwVW_spec{min-width:0;color:var(--dsw-alias-label-tertiary);flex:220px}.gHlwVW_metaGrid{border-top:1px solid var(--dsw-alias-border-l2);border-bottom:1px solid var(--dsw-alias-border-l2);grid-template-columns:100px minmax(0,1fr);gap:7px 10px;margin:0;padding:10px 0;display:grid}.gHlwVW_metaGrid div{display:contents}.gHlwVW_metaGrid dt{color:var(--dsw-alias-label-tertiary);font-size:11px;line-height:17px}.gHlwVW_metaGrid dd{min-width:0;color:var(--dsw-alias-label-secondary);margin:0;font-size:12px;line-height:17px}.gHlwVW_inlineWarnings{color:var(--dsw-alias-state-warning-primary,#bc7a00);padding-left:18px;font-size:12px;line-height:18px}.gHlwVW_readmeHeading{border-bottom:1px solid var(--dsw-alias-border-l2);justify-content:space-between;align-items:baseline;gap:10px;padding-bottom:6px;display:flex}.gHlwVW_readmeHeading h4{font-size:13px;line-height:20px}.gHlwVW_readmeContent{flex-direction:column;gap:8px;min-width:0;display:flex}.gHlwVW_readmeMode{border:1px solid var(--dsw-alias-border-l2);border-radius:6px;align-self:flex-start;display:inline-flex;overflow:hidden}.gHlwVW_readmeModeButton{min-width:56px;min-height:28px;color:var(--dsw-alias-label-tertiary);font:inherit;cursor:pointer;background:0 0;border:0;padding:4px 9px;font-size:12px;line-height:18px}.gHlwVW_readmeModeButton+.gHlwVW_readmeModeButton{border-left:1px solid var(--dsw-alias-border-l2)}.gHlwVW_readmeModeButton:hover,.gHlwVW_readmeModeButton[data-active=true]{background:var(--dsw-alias-interactive-bg-hover);color:var(--dsw-alias-label-primary)}.gHlwVW_readmeModeButton[data-active=true]{font-weight:600}.gHlwVW_readmeSource{box-sizing:border-box;border:1px solid var(--dsw-alias-border-l2);background:var(--dsw-alias-bg-layer-1);max-width:100%;max-height:520px;color:var(--dsw-alias-label-secondary);font-family:var(--ds-font-family-code);overflow-wrap:anywhere;white-space:pre-wrap;border-radius:6px;margin:0;padding:10px;font-size:11px;line-height:17px;overflow:auto}.gHlwVW_markdown{overflow-wrap:anywhere;min-width:0;color:var(--dsw-alias-label-secondary);font-size:13px;line-height:20px}.gHlwVW_markdown h1,.gHlwVW_markdown h2,.gHlwVW_markdown h3,.gHlwVW_markdown h4{color:var(--dsw-alias-label-primary);line-height:1.35}.gHlwVW_markdown h1{font-size:20px}.gHlwVW_markdown h2{font-size:17px}.gHlwVW_markdown h3{font-size:15px}.gHlwVW_markdown h4{font-size:13px}.gHlwVW_markdown pre{border:1px solid var(--dsw-alias-border-l2);background:var(--dsw-alias-bg-layer-1);font-family:var(--ds-font-family-code);border-radius:6px;padding:9px;font-size:11px;line-height:17px;overflow:auto}.gHlwVW_markdown code{font-family:var(--ds-font-family-code);font-size:.92em}.gHlwVW_markdown img{max-width:100%;height:auto;display:inline-block}.gHlwVW_markdown p[align=center],.gHlwVW_markdown div[align=center]{text-align:center}.gHlwVW_markdown p[align=right],.gHlwVW_markdown div[align=right]{text-align:right}.gHlwVW_markdown details{border:1px solid var(--dsw-alias-border-l2);border-radius:6px;padding:7px 9px}.gHlwVW_markdown summary{cursor:pointer;color:var(--dsw-alias-label-primary)}.gHlwVW_markdown blockquote{border-left:3px solid var(--dsw-alias-border-l2);color:var(--dsw-alias-label-tertiary);margin-left:0;padding-left:10px}.gHlwVW_markdown table{border-collapse:collapse;max-width:100%;display:block;overflow:auto}.gHlwVW_markdown th,.gHlwVW_markdown td{border:1px solid var(--dsw-alias-border-l2);padding:5px 8px}.gHlwVW_modalBackdrop{z-index:1000;background:#00000073;justify-content:center;align-items:center;padding:18px;display:flex;position:fixed;inset:0}.gHlwVW_modal{border:1px solid var(--dsw-alias-border-l1);background:var(--dsw-alias-bg-layer-3);width:min(520px,100%);max-height:min(700px,90vh);box-shadow:var(--ds-shadow-lv3,0 12px 35px #00000040);border-radius:8px;padding:16px;overflow:auto}.gHlwVW_modalHeader{justify-content:space-between;gap:10px}.gHlwVW_modalHeader h3{font-size:15px;line-height:22px}.gHlwVW_modalLead{color:var(--dsw-alias-label-primary);margin-top:12px;font-size:14px;line-height:20px}.gHlwVW_warningList{border-left:3px solid var(--dsw-alias-state-warning-primary,#bc7a00);color:var(--dsw-alias-label-secondary);margin-top:12px;padding-left:10px;font-size:12px;line-height:19px}.gHlwVW_warningList h4{color:var(--dsw-alias-label-primary);font-size:12px}.gHlwVW_warningList ul{margin:5px 0 0;padding-left:17px}.gHlwVW_checkRow{color:var(--dsw-alias-label-secondary);align-items:flex-start;gap:8px;margin-top:14px;font-size:12px;line-height:18px}.gHlwVW_checkRow input{margin-top:2px}.gHlwVW_modalActions{justify-content:flex-end;gap:8px;margin-top:16px}.gHlwVW_failure{color:var(--dsw-alias-state-error-primary);flex-wrap:wrap;align-items:center;gap:8px;display:flex}.gHlwVW_visuallyHidden{clip:rect(0 0 0 0);clip-path:inset(50%);white-space:nowrap;width:1px;height:1px;position:absolute;overflow:hidden}@media (width<=680px){.gHlwVW_row{flex-direction:column;align-items:flex-start}.gHlwVW_rowActions,.gHlwVW_iconActions{align-self:flex-end}.gHlwVW_selectLabel{flex:150px}.gHlwVW_selectLabel select{flex:auto;min-width:0}.gHlwVW_metaGrid{grid-template-columns:86px minmax(0,1fr)}}@media (width<=380px){.gHlwVW_toolbar>.gHlwVW_search,.gHlwVW_toolbar>.gHlwVW_selectLabel,.gHlwVW_toolbar>.gHlwVW_iconButton{flex-basis:100%}.gHlwVW_search{min-width:0}.gHlwVW_selectLabel{justify-content:space-between}.gHlwVW_selectLabel select{max-width:65%}.gHlwVW_rowActions,.gHlwVW_iconActions{flex-wrap:wrap;justify-content:flex-end;width:100%}.gHlwVW_rowActions .gHlwVW_primaryButton,.gHlwVW_rowActions .gHlwVW_ghostButton,.gHlwVW_iconActions .gHlwVW_ghostButton{text-overflow:ellipsis;max-width:100%;overflow:hidden}}";
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
	"readmeContent": "gHlwVW_readmeContent",
	"readmeHeading": "gHlwVW_readmeHeading",
	"readmeMode": "gHlwVW_readmeMode",
	"readmeModeButton": "gHlwVW_readmeModeButton",
	"readmeSource": "gHlwVW_readmeSource",
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
	return Object.entries(values).reduce((text$9, [key, value]) => text$9.replaceAll(`{${key}}`, String(value)), template);
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
		case "paused": return t("paused");
		case "partially-paused": return t("partiallyPaused");
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
		case "pnpm-command-unavailable": return t("reasonPnpmUnavailable");
		case "system-package-protected": return t("reasonProtected");
		case "package-not-installed": return t("reasonMissing");
		case "already-paused": return t("reasonAlreadyPaused");
		case "already-active": return t("reasonAlreadyActive");
		case "plugin-entry-unavailable": return t("reasonEntryUnavailable");
		case "self-pause-protected": return t("reasonSelfPause");
		case "restart-required-before-next-change": return t("reasonRestart");
		case "profile-changed": return t("reasonChanged");
		case "artifact-repository-mismatch": return t("reasonRepository");
		case "installed-version-invalid": return t("reasonVersion");
		case "plan-state-changed": return t("reasonState");
		case "composition-validation-failed": return t("reasonState");
		case "activation-validation-failed": return t("reasonState");
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
function OwnerAvatar({ owner, name: name$1 }) {
	const [failed, setFailed] = (0, react.useState)(false);
	if (failed || !/^[A-Za-z0-9_.-]+$/.test(owner)) return /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
		className: PluginManageSettingsTab_module_css_default.avatarFallback,
		"aria-hidden": "true",
		children: name$1.trim().slice(0, 1).toUpperCase() || "?"
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
function InstalledRow({ item, t, onOpen, onUpdate, onRemove, onPause, onResume, working }) {
	const pending = item.state.startsWith("pending-");
	const paused = item.state === "paused" || item.state === "partially-paused";
	const canUpdate = item.updateAvailable && !working && !pending && !item.system;
	const canRemove = item.directDependency && !item.system && !working && item.state !== "pending-removal" && item.state !== "pending-update";
	const canToggle = item.packageName !== "dsh-plugin-console" && item.directDependency && !item.system && !working && !pending && item.runtimeEntries.length > 0;
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
				canToggle && !paused ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
					className: PluginManageSettingsTab_module_css_default.iconButton,
					type: "button",
					title: t("ariaPause"),
					"aria-label": t("ariaPause"),
					onClick: onPause,
					children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(__deepseek_ai_dsh_client_ui_primitives.IconPauseOutline16, { "aria-hidden": "true" })
				}) : null,
				canToggle && paused ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
					className: PluginManageSettingsTab_module_css_default.iconButton,
					type: "button",
					title: t("ariaResume"),
					"aria-label": t("ariaResume"),
					onClick: onResume,
					children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(__deepseek_ai_dsh_client_ui_primitives.IconPlayOutline16, { "aria-hidden": "true" })
				}) : null,
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
function isMarkdownSource(source) {
	if (source === null) return true;
	const file = source.split("/").at(-1)?.toLocaleLowerCase() ?? "";
	return /\.(?:md|markdown|mdx)$/.test(file);
}
function Readme({ value, source, repositoryUrl, gitRef, t }) {
	const markdown = isMarkdownSource(source);
	const [mode, setMode] = (0, react.useState)(markdown ? "rendered" : "source");
	if (value === null || value.trim().length === 0) return null;
	return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
		className: PluginManageSettingsTab_module_css_default.readmeContent,
		children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
			className: PluginManageSettingsTab_module_css_default.readmeMode,
			role: "group",
			"aria-label": t("usage"),
			children: [markdown ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
				className: PluginManageSettingsTab_module_css_default.readmeModeButton,
				type: "button",
				"data-active": mode === "rendered" ? "true" : void 0,
				onClick: () => setMode("rendered"),
				children: t("readmeRendered")
			}) : null, /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
				className: PluginManageSettingsTab_module_css_default.readmeModeButton,
				type: "button",
				"data-active": mode === "source" ? "true" : void 0,
				onClick: () => setMode("source"),
				children: t("readmeSourceView")
			})]
		}), mode === "rendered" && markdown ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
			className: PluginManageSettingsTab_module_css_default.markdown,
			children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(RichReadme, {
				value,
				source,
				repositoryUrl,
				gitRef
			})
		}) : /* @__PURE__ */ (0, react_jsx_runtime.jsx)("pre", {
			className: PluginManageSettingsTab_module_css_default.readmeSource,
			children: value
		})]
	});
}
function ReviewDialog({ review, t, working, onCancel, onConfirm }) {
	const [acknowledged, setAcknowledged] = (0, react.useState)(false);
	const closeRef = (0, react.useRef)(null);
	const modalRef = (0, react.useRef)(null);
	const titleId = (0, react.useId)();
	const requiresAck = review.plan.action === "install" || review.plan.action === "update";
	const workingLabel = review.plan.action === "install" ? t("installing") : review.plan.action === "update" ? t("updating") : review.plan.action === "remove" ? t("removing") : review.plan.action === "pause" ? t("pausing") : t("resuming");
	const reviewSpec = review.plan.sourceSpec ?? (review.plan.action === "pause" || review.plan.action === "resume" ? t("activationSpec") : t("removeSpec"));
	(0, react.useEffect)(() => {
		closeRef.current?.focus();
		const onKeyDown = (event) => {
			if (event.key === "Escape" && !working) {
				event.preventDefault();
				onCancel();
				return;
			}
			if (event.key !== "Tab") return;
			const focusable = [...modalRef.current?.querySelectorAll("button, input, a[href]") ?? []].filter((element$5) => !element$5.hasAttribute("disabled") && element$5.tabIndex >= 0);
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
							children: reviewSpec
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
						children: working ? workingLabel : t("confirm")
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
			}) : /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Readme, {
				value: detail.readme,
				source: detail.readmeSource,
				repositoryUrl: detail.repositoryUrl,
				gitRef: detail.commitSha,
				t
			})
		]
	});
}
function InstalledDetailView({ detail, t, working, onBack, onUpdate, onRemove, onPause, onResume }) {
	const paused = detail.state === "paused" || detail.state === "partially-paused";
	const canToggle = detail.packageName !== "dsh-plugin-console" && !detail.system && detail.directDependency && !detail.state.startsWith("pending-") && detail.runtimeEntries.length > 0;
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
					canToggle && !paused ? /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("button", {
						className: PluginManageSettingsTab_module_css_default.ghostButton,
						type: "button",
						disabled: working,
						onClick: onPause,
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(__deepseek_ai_dsh_client_ui_primitives.IconPauseOutline16, { "aria-hidden": "true" }), working ? t("pausing") : t("pause")]
					}) : null,
					canToggle && paused ? /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("button", {
						className: PluginManageSettingsTab_module_css_default.ghostButton,
						type: "button",
						disabled: working,
						onClick: onResume,
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(__deepseek_ai_dsh_client_ui_primitives.IconPlayOutline16, { "aria-hidden": "true" }), working ? t("resuming") : t("resume")]
					}) : null,
					detail.updateAvailable ? /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("button", {
						className: PluginManageSettingsTab_module_css_default.primaryButton,
						type: "button",
						disabled: working,
						onClick: onUpdate,
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(__deepseek_ai_dsh_client_ui_primitives.IconRefreshOutline16, { "aria-hidden": "true" }), working ? t("updating") : t("update")]
					}) : null,
					!detail.system && detail.directDependency && detail.state !== "pending-removal" && detail.state !== "pending-update" ? /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("button", {
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
			}) : /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Readme, {
				value: detail.readme,
				source: detail.readmeFile,
				repositoryUrl: detail.repositoryUrl,
				gitRef: detail.requestedSpec?.match(/#([0-9a-f]{40})$/i)?.[1] ?? null,
				t
			})
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
			} else setOperationError(interpolate(t("operationFailed", { message: "" }), { message: result.detail ?? reasonLabel(result.code, t) }));
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
				children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("h3", { children: t("nav") }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", { children: capabilities === null ? t("loading") : interpolate(t("profile", { name: capabilities.profileName }), { name: capabilities.profileName }) })] }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
					className: PluginManageSettingsTab_module_css_default.capability,
					"data-ready": capabilities?.profileWritable && capabilities.dshAvailable && capabilities.pnpmAvailable ? "true" : "false",
					children: capabilities?.profileWritable && capabilities.dshAvailable && capabilities.pnpmAvailable ? t("dshReady") : capabilities === null ? t("loading") : t("dshMissing")
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
				}, t("reviewRemove")),
				onPause: () => startPlan({
					action: "pause",
					packageName: installedDetail.packageName
				}, t("reviewPause")),
				onResume: () => startPlan({
					action: "resume",
					packageName: installedDetail.packageName
				}, t("reviewResume"))
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
						onPause: () => startPlan({
							action: "pause",
							packageName: item.packageName
						}, t("reviewPause")),
						onResume: () => startPlan({
							action: "resume",
							packageName: item.packageName
						}, t("reviewResume")),
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
	nav: "插件管理",
	tab: "插件管理视图",
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
	pause: "暂停使用",
	pausing: "暂停中…",
	resume: "恢复使用",
	resuming: "恢复中…",
	openRepository: "打开仓库",
	details: "插件详情",
	usage: "使用说明",
	noReadme: "该插件没有提供可读取的 README。",
	readmeSource: "文档来源：{source}",
	readmeRendered: "预览",
	readmeSourceView: "源码",
	packageName: "包名",
	version: "版本",
	author: "作者",
	license: "许可证",
	source: "安装来源",
	bundleLayer: "Bundle 层",
	clientLayer: "Web 客户端",
	runtime: "运行状态",
	active: "已生效",
	paused: "已暂停",
	partiallyPaused: "部分暂停",
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
	activationSpec: "profile Loader 禁用配置",
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
	reviewPause: "确认暂停使用这个插件？",
	reviewResume: "确认恢复使用这个插件？",
	reviewTarget: "目标版本",
	reviewSpec: "精确来源",
	reviewWarnings: "操作说明",
	warningTrusted: "插件代码会在 DSH Host 进程中运行，请确认来源可信。",
	warningRestart: "profile 变更会持久化；重启后会按新状态重新组合。",
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
	reasonPnpmUnavailable: "pnpm 命令不可用",
	reasonProtected: "系统组件不能修改",
	reasonMissing: "没有找到该插件",
	reasonAlreadyPaused: "该插件已经暂停",
	reasonAlreadyActive: "该插件已经启用",
	reasonEntryUnavailable: "没有找到可暂停的 Loader 条目",
	reasonSelfPause: "不能从管理器中暂停管理器自身",
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
	ariaRemove: "删除插件",
	ariaPause: "暂停使用插件",
	ariaResume: "恢复使用插件"
};
const en = {
	nav: "Plugin manager",
	tab: "Plugin manager views",
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
	pause: "Pause",
	pausing: "Pausing…",
	resume: "Resume",
	resuming: "Resuming…",
	openRepository: "Open repository",
	details: "Plugin details",
	usage: "Usage",
	noReadme: "This plugin did not provide a readable README.",
	readmeSource: "Documentation source: {source}",
	readmeRendered: "Preview",
	readmeSourceView: "Source",
	packageName: "Package",
	version: "Version",
	author: "Author",
	license: "License",
	source: "Install source",
	bundleLayer: "Bundle layer",
	clientLayer: "Web client",
	runtime: "Runtime",
	active: "Active",
	paused: "Paused",
	partiallyPaused: "Partially paused",
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
	activationSpec: "profile Loader disabled patch",
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
	reviewPause: "Pause this plugin?",
	reviewResume: "Resume this plugin?",
	reviewTarget: "Target version",
	reviewSpec: "Exact source",
	reviewWarnings: "Operation notes",
	warningTrusted: "Plugin code runs inside the DSH Host process. Verify the source before continuing.",
	warningRestart: "The profile change is persisted and the new composition applies after restart.",
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
	reasonPnpmUnavailable: "The pnpm command is unavailable",
	reasonProtected: "System components cannot be changed",
	reasonMissing: "The plugin was not found",
	reasonAlreadyPaused: "The plugin is already paused",
	reasonAlreadyActive: "The plugin is already active",
	reasonEntryUnavailable: "No pausable Loader entry was found",
	reasonSelfPause: "The manager cannot pause itself from this page",
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
	ariaRemove: "Remove plugin",
	ariaPause: "Pause plugin",
	ariaResume: "Resume plugin"
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
	ctx.slots.inject("settings.section", () => ctx.slots.register({
		name: "settings.section",
		id: "plugin-manager",
		order: 20,
		label: () => t("nav"),
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