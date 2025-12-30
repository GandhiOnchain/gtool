var global$3 = globalThis;
const supportsAdoptingStyleSheets = global$3.ShadowRoot && (global$3.ShadyCSS === void 0 || global$3.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype;
var constructionToken = Symbol();
var cssTagCache = /* @__PURE__ */ new WeakMap();
var CSSResult = class {
	constructor(cssText, strings, safeToken) {
		this["_$cssResult$"] = true;
		if (safeToken !== constructionToken) throw new Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
		this.cssText = cssText;
		this._strings = strings;
	}
	get styleSheet() {
		let styleSheet = this._styleSheet;
		const strings = this._strings;
		if (supportsAdoptingStyleSheets && styleSheet === void 0) {
			const cacheable = strings !== void 0 && strings.length === 1;
			if (cacheable) styleSheet = cssTagCache.get(strings);
			if (styleSheet === void 0) {
				(this._styleSheet = styleSheet = new CSSStyleSheet()).replaceSync(this.cssText);
				if (cacheable) cssTagCache.set(strings, styleSheet);
			}
		}
		return styleSheet;
	}
	toString() {
		return this.cssText;
	}
};
var textFromCSSResult = (value) => {
	if (value["_$cssResult$"] === true) return value.cssText;
	else if (typeof value === "number") return value;
	else throw new Error(`Value passed to 'css' function must be a 'css' function result: ${value}. Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.`);
};
const unsafeCSS = (value) => new CSSResult(typeof value === "string" ? value : String(value), void 0, constructionToken);
const css = (strings, ...values) => {
	const cssText = strings.length === 1 ? strings[0] : values.reduce((acc, v, idx) => acc + textFromCSSResult(v) + strings[idx + 1], strings[0]);
	return new CSSResult(cssText, strings, constructionToken);
};
const adoptStyles = (renderRoot, styles) => {
	if (supportsAdoptingStyleSheets) renderRoot.adoptedStyleSheets = styles.map((s) => s instanceof CSSStyleSheet ? s : s.styleSheet);
	else for (const s of styles) {
		const style = document.createElement("style");
		const nonce = global$3["litNonce"];
		if (nonce !== void 0) style.setAttribute("nonce", nonce);
		style.textContent = s.cssText;
		renderRoot.appendChild(style);
	}
};
var cssResultFromStyleSheet = (sheet) => {
	let cssText = "";
	for (const rule of sheet.cssRules) cssText += rule.cssText;
	return unsafeCSS(cssText);
};
const getCompatibleStyle = supportsAdoptingStyleSheets || false ? (s) => s : (s) => s instanceof CSSStyleSheet ? cssResultFromStyleSheet(s) : s;
var { is, defineProperty, getOwnPropertyDescriptor, getOwnPropertyNames, getOwnPropertySymbols, getPrototypeOf } = Object;
var global$2 = globalThis;
var issueWarning$2;
var trustedTypes$1 = global$2.trustedTypes;
var emptyStringForBooleanAttribute = trustedTypes$1 ? trustedTypes$1.emptyScript : "";
var polyfillSupport$2 = global$2.reactiveElementPolyfillSupportDevMode;
global$2.litIssuedWarnings ??= /* @__PURE__ */ new Set();
issueWarning$2 = (code, warning) => {
	warning += ` See https://lit.dev/msg/${code} for more information.`;
	if (!global$2.litIssuedWarnings.has(warning) && !global$2.litIssuedWarnings.has(code)) {
		console.warn(warning);
		global$2.litIssuedWarnings.add(warning);
	}
};
queueMicrotask(() => {
	issueWarning$2("dev-mode", `Lit is in dev mode. Not recommended for production!`);
	if (global$2.ShadyDOM?.inUse && polyfillSupport$2 === void 0) issueWarning$2("polyfill-support-missing", "Shadow DOM is being polyfilled via `ShadyDOM` but the `polyfill-support` module has not been loaded.");
});
var debugLogEvent$1 = (event) => {
	if (!global$2.emitLitDebugLogEvents) return;
	global$2.dispatchEvent(new CustomEvent("lit-debug", { detail: event }));
};
var JSCompiler_renameProperty$1 = (prop, _obj) => prop;
const defaultConverter = {
	toAttribute(value, type) {
		switch (type) {
			case Boolean:
				value = value ? emptyStringForBooleanAttribute : null;
				break;
			case Object:
			case Array:
				value = value == null ? value : JSON.stringify(value);
				break;
		}
		return value;
	},
	fromAttribute(value, type) {
		let fromValue = value;
		switch (type) {
			case Boolean:
				fromValue = value !== null;
				break;
			case Number:
				fromValue = value === null ? null : Number(value);
				break;
			case Object:
			case Array:
				try {
					fromValue = JSON.parse(value);
				} catch (e) {
					fromValue = null;
				}
				break;
		}
		return fromValue;
	}
};
const notEqual = (value, old) => !is(value, old);
var defaultPropertyDeclaration = {
	attribute: true,
	type: String,
	converter: defaultConverter,
	reflect: false,
	useDefault: false,
	hasChanged: notEqual
};
Symbol.metadata ??= Symbol("metadata");
global$2.litPropertyMetadata ??= /* @__PURE__ */ new WeakMap();
var ReactiveElement = class extends HTMLElement {
	static addInitializer(initializer) {
		this.__prepare();
		(this._initializers ??= []).push(initializer);
	}
	static get observedAttributes() {
		this.finalize();
		return this.__attributeToPropertyMap && [...this.__attributeToPropertyMap.keys()];
	}
	static createProperty(name, options = defaultPropertyDeclaration) {
		if (options.state) options.attribute = false;
		this.__prepare();
		if (this.prototype.hasOwnProperty(name)) {
			options = Object.create(options);
			options.wrapped = true;
		}
		this.elementProperties.set(name, options);
		if (!options.noAccessor) {
			const key = Symbol.for(`${String(name)} (@property() cache)`);
			const descriptor = this.getPropertyDescriptor(name, key, options);
			if (descriptor !== void 0) defineProperty(this.prototype, name, descriptor);
		}
	}
	static getPropertyDescriptor(name, key, options) {
		const { get, set } = getOwnPropertyDescriptor(this.prototype, name) ?? {
			get() {
				return this[key];
			},
			set(v) {
				this[key] = v;
			}
		};
		if (get == null) {
			if ("value" in (getOwnPropertyDescriptor(this.prototype, name) ?? {})) throw new Error(`Field ${JSON.stringify(String(name))} on ${this.name} was declared as a reactive property but it's actually declared as a value on the prototype. Usually this is due to using @property or @state on a method.`);
			issueWarning$2("reactive-property-without-getter", `Field ${JSON.stringify(String(name))} on ${this.name} was declared as a reactive property but it does not have a getter. This will be an error in a future version of Lit.`);
		}
		return {
			get,
			set(value) {
				const oldValue = get?.call(this);
				set?.call(this, value);
				this.requestUpdate(name, oldValue, options);
			},
			configurable: true,
			enumerable: true
		};
	}
	static getPropertyOptions(name) {
		return this.elementProperties.get(name) ?? defaultPropertyDeclaration;
	}
	static __prepare() {
		if (this.hasOwnProperty(JSCompiler_renameProperty$1("elementProperties", this))) return;
		const superCtor = getPrototypeOf(this);
		superCtor.finalize();
		if (superCtor._initializers !== void 0) this._initializers = [...superCtor._initializers];
		this.elementProperties = new Map(superCtor.elementProperties);
	}
	static finalize() {
		if (this.hasOwnProperty(JSCompiler_renameProperty$1("finalized", this))) return;
		this.finalized = true;
		this.__prepare();
		if (this.hasOwnProperty(JSCompiler_renameProperty$1("properties", this))) {
			const props = this.properties;
			const propKeys = [...getOwnPropertyNames(props), ...getOwnPropertySymbols(props)];
			for (const p of propKeys) this.createProperty(p, props[p]);
		}
		const metadata = this[Symbol.metadata];
		if (metadata !== null) {
			const properties = litPropertyMetadata.get(metadata);
			if (properties !== void 0) for (const [p, options] of properties) this.elementProperties.set(p, options);
		}
		this.__attributeToPropertyMap = /* @__PURE__ */ new Map();
		for (const [p, options] of this.elementProperties) {
			const attr = this.__attributeNameForProperty(p, options);
			if (attr !== void 0) this.__attributeToPropertyMap.set(attr, p);
		}
		this.elementStyles = this.finalizeStyles(this.styles);
		if (this.hasOwnProperty("createProperty")) issueWarning$2("no-override-create-property", "Overriding ReactiveElement.createProperty() is deprecated. The override will not be called with standard decorators");
		if (this.hasOwnProperty("getPropertyDescriptor")) issueWarning$2("no-override-get-property-descriptor", "Overriding ReactiveElement.getPropertyDescriptor() is deprecated. The override will not be called with standard decorators");
	}
	static finalizeStyles(styles) {
		const elementStyles = [];
		if (Array.isArray(styles)) {
			const set = new Set(styles.flat(Infinity).reverse());
			for (const s of set) elementStyles.unshift(getCompatibleStyle(s));
		} else if (styles !== void 0) elementStyles.push(getCompatibleStyle(styles));
		return elementStyles;
	}
	static __attributeNameForProperty(name, options) {
		const attribute = options.attribute;
		return attribute === false ? void 0 : typeof attribute === "string" ? attribute : typeof name === "string" ? name.toLowerCase() : void 0;
	}
	constructor() {
		super();
		this.__instanceProperties = void 0;
		this.isUpdatePending = false;
		this.hasUpdated = false;
		this.__reflectingProperty = null;
		this.__initialize();
	}
	__initialize() {
		this.__updatePromise = new Promise((res) => this.enableUpdating = res);
		this._$changedProperties = /* @__PURE__ */ new Map();
		this.__saveInstanceProperties();
		this.requestUpdate();
		this.constructor._initializers?.forEach((i) => i(this));
	}
	addController(controller) {
		(this.__controllers ??= /* @__PURE__ */ new Set()).add(controller);
		if (this.renderRoot !== void 0 && this.isConnected) controller.hostConnected?.();
	}
	removeController(controller) {
		this.__controllers?.delete(controller);
	}
	__saveInstanceProperties() {
		const instanceProperties = /* @__PURE__ */ new Map();
		const elementProperties = this.constructor.elementProperties;
		for (const p of elementProperties.keys()) if (this.hasOwnProperty(p)) {
			instanceProperties.set(p, this[p]);
			delete this[p];
		}
		if (instanceProperties.size > 0) this.__instanceProperties = instanceProperties;
	}
	createRenderRoot() {
		const renderRoot = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
		adoptStyles(renderRoot, this.constructor.elementStyles);
		return renderRoot;
	}
	connectedCallback() {
		this.renderRoot ??= this.createRenderRoot();
		this.enableUpdating(true);
		this.__controllers?.forEach((c) => c.hostConnected?.());
	}
	enableUpdating(_requestedUpdate) {}
	disconnectedCallback() {
		this.__controllers?.forEach((c) => c.hostDisconnected?.());
	}
	attributeChangedCallback(name, _old, value) {
		this._$attributeToProperty(name, value);
	}
	__propertyToAttribute(name, value) {
		const options = this.constructor.elementProperties.get(name);
		const attr = this.constructor.__attributeNameForProperty(name, options);
		if (attr !== void 0 && options.reflect === true) {
			const attrValue = (options.converter?.toAttribute !== void 0 ? options.converter : defaultConverter).toAttribute(value, options.type);
			if (this.constructor.enabledWarnings.includes("migration") && attrValue === void 0) issueWarning$2("undefined-attribute-value", `The attribute value for the ${name} property is undefined on element ${this.localName}. The attribute will be removed, but in the previous version of \`ReactiveElement\`, the attribute would not have changed.`);
			this.__reflectingProperty = name;
			if (attrValue == null) this.removeAttribute(attr);
			else this.setAttribute(attr, attrValue);
			this.__reflectingProperty = null;
		}
	}
	_$attributeToProperty(name, value) {
		const ctor = this.constructor;
		const propName = ctor.__attributeToPropertyMap.get(name);
		if (propName !== void 0 && this.__reflectingProperty !== propName) {
			const options = ctor.getPropertyOptions(propName);
			const converter = typeof options.converter === "function" ? { fromAttribute: options.converter } : options.converter?.fromAttribute !== void 0 ? options.converter : defaultConverter;
			this.__reflectingProperty = propName;
			const convertedValue = converter.fromAttribute(value, options.type);
			this[propName] = convertedValue ?? this.__defaultValues?.get(propName) ?? convertedValue;
			this.__reflectingProperty = null;
		}
	}
	requestUpdate(name, oldValue, options) {
		if (name !== void 0) {
			if (name instanceof Event) issueWarning$2(``, `The requestUpdate() method was called with an Event as the property name. This is probably a mistake caused by binding this.requestUpdate as an event listener. Instead bind a function that will call it with no arguments: () => this.requestUpdate()`);
			const ctor = this.constructor;
			const newValue = this[name];
			options ??= ctor.getPropertyOptions(name);
			if ((options.hasChanged ?? notEqual)(newValue, oldValue) || options.useDefault && options.reflect && newValue === this.__defaultValues?.get(name) && !this.hasAttribute(ctor.__attributeNameForProperty(name, options))) this._$changeProperty(name, oldValue, options);
			else return;
		}
		if (this.isUpdatePending === false) this.__updatePromise = this.__enqueueUpdate();
	}
	_$changeProperty(name, oldValue, { useDefault, reflect, wrapped }, initializeValue) {
		if (useDefault && !(this.__defaultValues ??= /* @__PURE__ */ new Map()).has(name)) {
			this.__defaultValues.set(name, initializeValue ?? oldValue ?? this[name]);
			if (wrapped !== true || initializeValue !== void 0) return;
		}
		if (!this._$changedProperties.has(name)) {
			if (!this.hasUpdated && !useDefault) oldValue = void 0;
			this._$changedProperties.set(name, oldValue);
		}
		if (reflect === true && this.__reflectingProperty !== name) (this.__reflectingProperties ??= /* @__PURE__ */ new Set()).add(name);
	}
	async __enqueueUpdate() {
		this.isUpdatePending = true;
		try {
			await this.__updatePromise;
		} catch (e) {
			Promise.reject(e);
		}
		const result = this.scheduleUpdate();
		if (result != null) await result;
		return !this.isUpdatePending;
	}
	scheduleUpdate() {
		const result = this.performUpdate();
		if (this.constructor.enabledWarnings.includes("async-perform-update") && typeof result?.then === "function") issueWarning$2("async-perform-update", `Element ${this.localName} returned a Promise from performUpdate(). This behavior is deprecated and will be removed in a future version of ReactiveElement.`);
		return result;
	}
	performUpdate() {
		if (!this.isUpdatePending) return;
		debugLogEvent$1?.({ kind: "update" });
		if (!this.hasUpdated) {
			this.renderRoot ??= this.createRenderRoot();
			{
				const shadowedProperties = [...this.constructor.elementProperties.keys()].filter((p) => this.hasOwnProperty(p) && p in getPrototypeOf(this));
				if (shadowedProperties.length) throw new Error(`The following properties on element ${this.localName} will not trigger updates as expected because they are set using class fields: ${shadowedProperties.join(", ")}. Native class fields and some compiled output will overwrite accessors used for detecting changes. See https://lit.dev/msg/class-field-shadowing for more information.`);
			}
			if (this.__instanceProperties) {
				for (const [p, value] of this.__instanceProperties) this[p] = value;
				this.__instanceProperties = void 0;
			}
			const elementProperties = this.constructor.elementProperties;
			if (elementProperties.size > 0) for (const [p, options] of elementProperties) {
				const { wrapped } = options;
				const value = this[p];
				if (wrapped === true && !this._$changedProperties.has(p) && value !== void 0) this._$changeProperty(p, void 0, options, value);
			}
		}
		let shouldUpdate = false;
		const changedProperties = this._$changedProperties;
		try {
			shouldUpdate = this.shouldUpdate(changedProperties);
			if (shouldUpdate) {
				this.willUpdate(changedProperties);
				this.__controllers?.forEach((c) => c.hostUpdate?.());
				this.update(changedProperties);
			} else this.__markUpdated();
		} catch (e) {
			shouldUpdate = false;
			this.__markUpdated();
			throw e;
		}
		if (shouldUpdate) this._$didUpdate(changedProperties);
	}
	willUpdate(_changedProperties) {}
	_$didUpdate(changedProperties) {
		this.__controllers?.forEach((c) => c.hostUpdated?.());
		if (!this.hasUpdated) {
			this.hasUpdated = true;
			this.firstUpdated(changedProperties);
		}
		this.updated(changedProperties);
		if (this.isUpdatePending && this.constructor.enabledWarnings.includes("change-in-update")) issueWarning$2("change-in-update", `Element ${this.localName} scheduled an update (generally because a property was set) after an update completed, causing a new update to be scheduled. This is inefficient and should be avoided unless the next update can only be scheduled as a side effect of the previous update.`);
	}
	__markUpdated() {
		this._$changedProperties = /* @__PURE__ */ new Map();
		this.isUpdatePending = false;
	}
	get updateComplete() {
		return this.getUpdateComplete();
	}
	getUpdateComplete() {
		return this.__updatePromise;
	}
	shouldUpdate(_changedProperties) {
		return true;
	}
	update(_changedProperties) {
		this.__reflectingProperties &&= this.__reflectingProperties.forEach((p) => this.__propertyToAttribute(p, this[p]));
		this.__markUpdated();
	}
	updated(_changedProperties) {}
	firstUpdated(_changedProperties) {}
};
ReactiveElement.elementStyles = [];
ReactiveElement.shadowRootOptions = { mode: "open" };
ReactiveElement[JSCompiler_renameProperty$1("elementProperties", ReactiveElement)] = /* @__PURE__ */ new Map();
ReactiveElement[JSCompiler_renameProperty$1("finalized", ReactiveElement)] = /* @__PURE__ */ new Map();
polyfillSupport$2?.({ ReactiveElement });
{
	ReactiveElement.enabledWarnings = ["change-in-update", "async-perform-update"];
	const ensureOwnWarnings = function(ctor) {
		if (!ctor.hasOwnProperty(JSCompiler_renameProperty$1("enabledWarnings", ctor))) ctor.enabledWarnings = ctor.enabledWarnings.slice();
	};
	ReactiveElement.enableWarning = function(warning) {
		ensureOwnWarnings(this);
		if (!this.enabledWarnings.includes(warning)) this.enabledWarnings.push(warning);
	};
	ReactiveElement.disableWarning = function(warning) {
		ensureOwnWarnings(this);
		const i = this.enabledWarnings.indexOf(warning);
		if (i >= 0) this.enabledWarnings.splice(i, 1);
	};
}
(global$2.reactiveElementVersions ??= []).push("2.1.1");
if (global$2.reactiveElementVersions.length > 1) queueMicrotask(() => {
	issueWarning$2("multiple-versions", "Multiple versions of Lit loaded. Loading multiple versions is not recommended.");
});
var global$1 = globalThis;
var debugLogEvent = (event) => {
	if (!global$1.emitLitDebugLogEvents) return;
	global$1.dispatchEvent(new CustomEvent("lit-debug", { detail: event }));
};
var debugLogRenderId = 0;
var issueWarning$1;
global$1.litIssuedWarnings ??= /* @__PURE__ */ new Set();
issueWarning$1 = (code, warning) => {
	warning += code ? ` See https://lit.dev/msg/${code} for more information.` : "";
	if (!global$1.litIssuedWarnings.has(warning) && !global$1.litIssuedWarnings.has(code)) {
		console.warn(warning);
		global$1.litIssuedWarnings.add(warning);
	}
};
queueMicrotask(() => {
	issueWarning$1("dev-mode", `Lit is in dev mode. Not recommended for production!`);
});
var wrap = global$1.ShadyDOM?.inUse && global$1.ShadyDOM?.noPatch === true ? global$1.ShadyDOM.wrap : (node) => node;
var trustedTypes = global$1.trustedTypes;
var policy = trustedTypes ? trustedTypes.createPolicy("lit-html", { createHTML: (s) => s }) : void 0;
var identityFunction = (value) => value;
var noopSanitizer = (_node, _name, _type) => identityFunction;
var setSanitizer = (newSanitizer) => {
	if (sanitizerFactoryInternal !== noopSanitizer) throw new Error("Attempted to overwrite existing lit-html security policy. setSanitizeDOMValueFactory should be called at most once.");
	sanitizerFactoryInternal = newSanitizer;
};
var _testOnlyClearSanitizerFactoryDoNotCallOrElse = () => {
	sanitizerFactoryInternal = noopSanitizer;
};
var createSanitizer = (node, name, type) => {
	return sanitizerFactoryInternal(node, name, type);
};
var boundAttributeSuffix = "$lit$";
var marker = `lit$${Math.random().toFixed(9).slice(2)}$`;
var markerMatch = "?" + marker;
var nodeMarker = `<${markerMatch}>`;
var d = document;
var createMarker = () => d.createComment("");
var isPrimitive = (value) => value === null || typeof value != "object" && typeof value != "function";
var isArray = Array.isArray;
var isIterable = (value) => isArray(value) || typeof value?.[Symbol.iterator] === "function";
var SPACE_CHAR = `[ \t\n\f\r]`;
var ATTR_VALUE_CHAR = `[^ \t\n\f\r"'\`<>=]`;
var NAME_CHAR = `[^\\s"'>=/]`;
var textEndRegex = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g;
var commentEndRegex = /-->/g;
var comment2EndRegex = />/g;
var tagEndRegex = new RegExp(`>|${SPACE_CHAR}(?:(${NAME_CHAR}+)(${SPACE_CHAR}*=${SPACE_CHAR}*(?:${ATTR_VALUE_CHAR}|("|')|))|$)`, "g");
var singleQuoteAttrEndRegex = /'/g;
var doubleQuoteAttrEndRegex = /"/g;
var rawTextElement = /^(?:script|style|textarea|title)$/i;
var tag = (type) => (strings, ...values) => {
	if (strings.some((s) => s === void 0)) console.warn("Some template strings are undefined.\nThis is probably caused by illegal octal escape sequences.");
	if (values.some((val) => val?.["_$litStatic$"])) issueWarning$1("", "Static values 'literal' or 'unsafeStatic' cannot be used as values to non-static templates.\nPlease use the static 'html' tag function. See https://lit.dev/docs/templates/expressions/#static-expressions");
	return {
		["_$litType$"]: type,
		strings,
		values
	};
};
const html = tag(1);
const svg = tag(2);
tag(3);
const noChange = Symbol.for("lit-noChange");
const nothing = Symbol.for("lit-nothing");
var templateCache = /* @__PURE__ */ new WeakMap();
var walker = d.createTreeWalker(d, 129);
var sanitizerFactoryInternal = noopSanitizer;
function trustFromTemplateString(tsa, stringFromTSA) {
	if (!isArray(tsa) || !tsa.hasOwnProperty("raw")) {
		let message = "invalid template strings array";
		message = `
          Internal Error: expected template strings to be an array
          with a 'raw' field. Faking a template strings array by
          calling html or svg like an ordinary function is effectively
          the same as calling unsafeHtml and can lead to major security
          issues, e.g. opening your code up to XSS attacks.
          If you're using the html or svg tagged template functions normally
          and still seeing this error, please file a bug at
          https://github.com/lit/lit/issues/new?template=bug_report.md
          and include information about your build tooling, if any.
        `.trim().replace(/\n */g, "\n");
		throw new Error(message);
	}
	return policy !== void 0 ? policy.createHTML(stringFromTSA) : stringFromTSA;
}
var getTemplateHtml = (strings, type) => {
	const l = strings.length - 1;
	const attrNames = [];
	let html$1 = type === 2 ? "<svg>" : type === 3 ? "<math>" : "";
	let rawTextEndRegex;
	let regex = textEndRegex;
	for (let i = 0; i < l; i++) {
		const s = strings[i];
		let attrNameEndIndex = -1;
		let attrName;
		let lastIndex = 0;
		let match;
		while (lastIndex < s.length) {
			regex.lastIndex = lastIndex;
			match = regex.exec(s);
			if (match === null) break;
			lastIndex = regex.lastIndex;
			if (regex === textEndRegex) {
				if (match[1] === "!--") regex = commentEndRegex;
				else if (match[1] !== void 0) regex = comment2EndRegex;
				else if (match[2] !== void 0) {
					if (rawTextElement.test(match[2])) rawTextEndRegex = new RegExp(`</${match[2]}`, "g");
					regex = tagEndRegex;
				} else if (match[3] !== void 0) throw new Error("Bindings in tag names are not supported. Please use static templates instead. See https://lit.dev/docs/templates/expressions/#static-expressions");
			} else if (regex === tagEndRegex) if (match[0] === ">") {
				regex = rawTextEndRegex ?? textEndRegex;
				attrNameEndIndex = -1;
			} else if (match[1] === void 0) attrNameEndIndex = -2;
			else {
				attrNameEndIndex = regex.lastIndex - match[2].length;
				attrName = match[1];
				regex = match[3] === void 0 ? tagEndRegex : match[3] === "\"" ? doubleQuoteAttrEndRegex : singleQuoteAttrEndRegex;
			}
			else if (regex === doubleQuoteAttrEndRegex || regex === singleQuoteAttrEndRegex) regex = tagEndRegex;
			else if (regex === commentEndRegex || regex === comment2EndRegex) regex = textEndRegex;
			else {
				regex = tagEndRegex;
				rawTextEndRegex = void 0;
			}
		}
		console.assert(attrNameEndIndex === -1 || regex === tagEndRegex || regex === singleQuoteAttrEndRegex || regex === doubleQuoteAttrEndRegex, "unexpected parse state B");
		const end = regex === tagEndRegex && strings[i + 1].startsWith("/>") ? " " : "";
		html$1 += regex === textEndRegex ? s + nodeMarker : attrNameEndIndex >= 0 ? (attrNames.push(attrName), s.slice(0, attrNameEndIndex) + boundAttributeSuffix + s.slice(attrNameEndIndex)) + marker + end : s + marker + (attrNameEndIndex === -2 ? i : end);
	}
	const htmlResult = html$1 + (strings[l] || "<?>") + (type === 2 ? "</svg>" : type === 3 ? "</math>" : "");
	return [trustFromTemplateString(strings, htmlResult), attrNames];
};
var Template = class Template {
	constructor({ strings, ["_$litType$"]: type }, options) {
		this.parts = [];
		let node;
		let nodeIndex = 0;
		let attrNameIndex = 0;
		const partCount = strings.length - 1;
		const parts = this.parts;
		const [html$1, attrNames] = getTemplateHtml(strings, type);
		this.el = Template.createElement(html$1, options);
		walker.currentNode = this.el.content;
		if (type === 2 || type === 3) {
			const wrapper = this.el.content.firstChild;
			wrapper.replaceWith(...wrapper.childNodes);
		}
		while ((node = walker.nextNode()) !== null && parts.length < partCount) {
			if (node.nodeType === 1) {
				{
					const tag$1 = node.localName;
					if (/^(?:textarea|template)$/i.test(tag$1) && node.innerHTML.includes(marker)) {
						const m = `Expressions are not supported inside \`${tag$1}\` elements. See https://lit.dev/msg/expression-in-${tag$1} for more information.`;
						if (tag$1 === "template") throw new Error(m);
						else issueWarning$1("", m);
					}
				}
				if (node.hasAttributes()) {
					for (const name of node.getAttributeNames()) if (name.endsWith("$lit$")) {
						const realName = attrNames[attrNameIndex++];
						const statics = node.getAttribute(name).split(marker);
						const m = /([.?@])?(.*)/.exec(realName);
						parts.push({
							type: 1,
							index: nodeIndex,
							name: m[2],
							strings: statics,
							ctor: m[1] === "." ? PropertyPart : m[1] === "?" ? BooleanAttributePart : m[1] === "@" ? EventPart : AttributePart
						});
						node.removeAttribute(name);
					} else if (name.startsWith(marker)) {
						parts.push({
							type: 6,
							index: nodeIndex
						});
						node.removeAttribute(name);
					}
				}
				if (rawTextElement.test(node.tagName)) {
					const strings$1 = node.textContent.split(marker);
					const lastIndex = strings$1.length - 1;
					if (lastIndex > 0) {
						node.textContent = trustedTypes ? trustedTypes.emptyScript : "";
						for (let i = 0; i < lastIndex; i++) {
							node.append(strings$1[i], createMarker());
							walker.nextNode();
							parts.push({
								type: 2,
								index: ++nodeIndex
							});
						}
						node.append(strings$1[lastIndex], createMarker());
					}
				}
			} else if (node.nodeType === 8) if (node.data === markerMatch) parts.push({
				type: 2,
				index: nodeIndex
			});
			else {
				let i = -1;
				while ((i = node.data.indexOf(marker, i + 1)) !== -1) {
					parts.push({
						type: 7,
						index: nodeIndex
					});
					i += marker.length - 1;
				}
			}
			nodeIndex++;
		}
		if (attrNames.length !== attrNameIndex) throw new Error("Detected duplicate attribute bindings. This occurs if your template has duplicate attributes on an element tag. For example \"<input ?disabled=${true} ?disabled=${false}>\" contains a duplicate \"disabled\" attribute. The error was detected in the following template: \n`" + strings.join("${...}") + "`");
		debugLogEvent && debugLogEvent({
			kind: "template prep",
			template: this,
			clonableTemplate: this.el,
			parts: this.parts,
			strings
		});
	}
	static createElement(html$1, _options) {
		const el = d.createElement("template");
		el.innerHTML = html$1;
		return el;
	}
};
function resolveDirective(part, value, parent = part, attributeIndex) {
	if (value === noChange) return value;
	let currentDirective = attributeIndex !== void 0 ? parent.__directives?.[attributeIndex] : parent.__directive;
	const nextDirectiveConstructor = isPrimitive(value) ? void 0 : value["_$litDirective$"];
	if (currentDirective?.constructor !== nextDirectiveConstructor) {
		currentDirective?.["_$notifyDirectiveConnectionChanged"]?.(false);
		if (nextDirectiveConstructor === void 0) currentDirective = void 0;
		else {
			currentDirective = new nextDirectiveConstructor(part);
			currentDirective._$initialize(part, parent, attributeIndex);
		}
		if (attributeIndex !== void 0) (parent.__directives ??= [])[attributeIndex] = currentDirective;
		else parent.__directive = currentDirective;
	}
	if (currentDirective !== void 0) value = resolveDirective(part, currentDirective._$resolve(part, value.values), currentDirective, attributeIndex);
	return value;
}
var TemplateInstance = class {
	constructor(template, parent) {
		this._$parts = [];
		this._$disconnectableChildren = void 0;
		this._$template = template;
		this._$parent = parent;
	}
	get parentNode() {
		return this._$parent.parentNode;
	}
	get _$isConnected() {
		return this._$parent._$isConnected;
	}
	_clone(options) {
		const { el: { content }, parts } = this._$template;
		const fragment = (options?.creationScope ?? d).importNode(content, true);
		walker.currentNode = fragment;
		let node = walker.nextNode();
		let nodeIndex = 0;
		let partIndex = 0;
		let templatePart = parts[0];
		while (templatePart !== void 0) {
			if (nodeIndex === templatePart.index) {
				let part;
				if (templatePart.type === 2) part = new ChildPart(node, node.nextSibling, this, options);
				else if (templatePart.type === 1) part = new templatePart.ctor(node, templatePart.name, templatePart.strings, this, options);
				else if (templatePart.type === 6) part = new ElementPart(node, this, options);
				this._$parts.push(part);
				templatePart = parts[++partIndex];
			}
			if (nodeIndex !== templatePart?.index) {
				node = walker.nextNode();
				nodeIndex++;
			}
		}
		walker.currentNode = d;
		return fragment;
	}
	_update(values) {
		let i = 0;
		for (const part of this._$parts) {
			if (part !== void 0) {
				debugLogEvent && debugLogEvent({
					kind: "set part",
					part,
					value: values[i],
					valueIndex: i,
					values,
					templateInstance: this
				});
				if (part.strings !== void 0) {
					part._$setValue(values, part, i);
					i += part.strings.length - 2;
				} else part._$setValue(values[i]);
			}
			i++;
		}
	}
};
var ChildPart = class ChildPart {
	get _$isConnected() {
		return this._$parent?._$isConnected ?? this.__isConnected;
	}
	constructor(startNode, endNode, parent, options) {
		this.type = 2;
		this._$committedValue = nothing;
		this._$disconnectableChildren = void 0;
		this._$startNode = startNode;
		this._$endNode = endNode;
		this._$parent = parent;
		this.options = options;
		this.__isConnected = options?.isConnected ?? true;
		this._textSanitizer = void 0;
	}
	get parentNode() {
		let parentNode = wrap(this._$startNode).parentNode;
		const parent = this._$parent;
		if (parent !== void 0 && parentNode?.nodeType === 11) parentNode = parent.parentNode;
		return parentNode;
	}
	get startNode() {
		return this._$startNode;
	}
	get endNode() {
		return this._$endNode;
	}
	_$setValue(value, directiveParent = this) {
		if (this.parentNode === null) throw new Error(`This \`ChildPart\` has no \`parentNode\` and therefore cannot accept a value. This likely means the element containing the part was manipulated in an unsupported way outside of Lit's control such that the part's marker nodes were ejected from DOM. For example, setting the element's \`innerHTML\` or \`textContent\` can do this.`);
		value = resolveDirective(this, value, directiveParent);
		if (isPrimitive(value)) {
			if (value === nothing || value == null || value === "") {
				if (this._$committedValue !== nothing) {
					debugLogEvent && debugLogEvent({
						kind: "commit nothing to child",
						start: this._$startNode,
						end: this._$endNode,
						parent: this._$parent,
						options: this.options
					});
					this._$clear();
				}
				this._$committedValue = nothing;
			} else if (value !== this._$committedValue && value !== noChange) this._commitText(value);
		} else if (value["_$litType$"] !== void 0) this._commitTemplateResult(value);
		else if (value.nodeType !== void 0) {
			if (this.options?.host === value) {
				this._commitText("[probable mistake: rendered a template's host in itself (commonly caused by writing ${this} in a template]");
				console.warn(`Attempted to render the template host`, value, `inside itself. This is almost always a mistake, and in dev mode `, `we render some warning text. In production however, we'll `, `render it, which will usually result in an error, and sometimes `, `in the element disappearing from the DOM.`);
				return;
			}
			this._commitNode(value);
		} else if (isIterable(value)) this._commitIterable(value);
		else this._commitText(value);
	}
	_insert(node) {
		return wrap(wrap(this._$startNode).parentNode).insertBefore(node, this._$endNode);
	}
	_commitNode(value) {
		if (this._$committedValue !== value) {
			this._$clear();
			if (sanitizerFactoryInternal !== noopSanitizer) {
				const parentNodeName = this._$startNode.parentNode?.nodeName;
				if (parentNodeName === "STYLE" || parentNodeName === "SCRIPT") {
					let message = "Forbidden";
					if (parentNodeName === "STYLE") message = "Lit does not support binding inside style nodes. This is a security risk, as style injection attacks can exfiltrate data and spoof UIs. Consider instead using css`...` literals to compose styles, and do dynamic styling with css custom properties, ::parts, <slot>s, and by mutating the DOM rather than stylesheets.";
					else message = "Lit does not support binding inside script nodes. This is a security risk, as it could allow arbitrary code execution.";
					throw new Error(message);
				}
			}
			debugLogEvent && debugLogEvent({
				kind: "commit node",
				start: this._$startNode,
				parent: this._$parent,
				value,
				options: this.options
			});
			this._$committedValue = this._insert(value);
		}
	}
	_commitText(value) {
		if (this._$committedValue !== nothing && isPrimitive(this._$committedValue)) {
			const node = wrap(this._$startNode).nextSibling;
			if (this._textSanitizer === void 0) this._textSanitizer = createSanitizer(node, "data", "property");
			value = this._textSanitizer(value);
			debugLogEvent && debugLogEvent({
				kind: "commit text",
				node,
				value,
				options: this.options
			});
			node.data = value;
		} else {
			const textNode = d.createTextNode("");
			this._commitNode(textNode);
			if (this._textSanitizer === void 0) this._textSanitizer = createSanitizer(textNode, "data", "property");
			value = this._textSanitizer(value);
			debugLogEvent && debugLogEvent({
				kind: "commit text",
				node: textNode,
				value,
				options: this.options
			});
			textNode.data = value;
		}
		this._$committedValue = value;
	}
	_commitTemplateResult(result) {
		const { values, ["_$litType$"]: type } = result;
		const template = typeof type === "number" ? this._$getTemplate(result) : (type.el === void 0 && (type.el = Template.createElement(trustFromTemplateString(type.h, type.h[0]), this.options)), type);
		if (this._$committedValue?._$template === template) {
			debugLogEvent && debugLogEvent({
				kind: "template updating",
				template,
				instance: this._$committedValue,
				parts: this._$committedValue._$parts,
				options: this.options,
				values
			});
			this._$committedValue._update(values);
		} else {
			const instance = new TemplateInstance(template, this);
			const fragment = instance._clone(this.options);
			debugLogEvent && debugLogEvent({
				kind: "template instantiated",
				template,
				instance,
				parts: instance._$parts,
				options: this.options,
				fragment,
				values
			});
			instance._update(values);
			debugLogEvent && debugLogEvent({
				kind: "template instantiated and updated",
				template,
				instance,
				parts: instance._$parts,
				options: this.options,
				fragment,
				values
			});
			this._commitNode(fragment);
			this._$committedValue = instance;
		}
	}
	_$getTemplate(result) {
		let template = templateCache.get(result.strings);
		if (template === void 0) templateCache.set(result.strings, template = new Template(result));
		return template;
	}
	_commitIterable(value) {
		if (!isArray(this._$committedValue)) {
			this._$committedValue = [];
			this._$clear();
		}
		const itemParts = this._$committedValue;
		let partIndex = 0;
		let itemPart;
		for (const item of value) {
			if (partIndex === itemParts.length) itemParts.push(itemPart = new ChildPart(this._insert(createMarker()), this._insert(createMarker()), this, this.options));
			else itemPart = itemParts[partIndex];
			itemPart._$setValue(item);
			partIndex++;
		}
		if (partIndex < itemParts.length) {
			this._$clear(itemPart && wrap(itemPart._$endNode).nextSibling, partIndex);
			itemParts.length = partIndex;
		}
	}
	_$clear(start = wrap(this._$startNode).nextSibling, from) {
		this._$notifyConnectionChanged?.(false, true, from);
		while (start !== this._$endNode) {
			const n = wrap(start).nextSibling;
			wrap(start).remove();
			start = n;
		}
	}
	setConnected(isConnected) {
		if (this._$parent === void 0) {
			this.__isConnected = isConnected;
			this._$notifyConnectionChanged?.(isConnected);
		} else throw new Error("part.setConnected() may only be called on a RootPart returned from render().");
	}
};
var AttributePart = class {
	get tagName() {
		return this.element.tagName;
	}
	get _$isConnected() {
		return this._$parent._$isConnected;
	}
	constructor(element, name, strings, parent, options) {
		this.type = 1;
		this._$committedValue = nothing;
		this._$disconnectableChildren = void 0;
		this.element = element;
		this.name = name;
		this._$parent = parent;
		this.options = options;
		if (strings.length > 2 || strings[0] !== "" || strings[1] !== "") {
			this._$committedValue = new Array(strings.length - 1).fill(/* @__PURE__ */ new String());
			this.strings = strings;
		} else this._$committedValue = nothing;
		this._sanitizer = void 0;
	}
	_$setValue(value, directiveParent = this, valueIndex, noCommit) {
		const strings = this.strings;
		let change = false;
		if (strings === void 0) {
			value = resolveDirective(this, value, directiveParent, 0);
			change = !isPrimitive(value) || value !== this._$committedValue && value !== noChange;
			if (change) this._$committedValue = value;
		} else {
			const values = value;
			value = strings[0];
			let i, v;
			for (i = 0; i < strings.length - 1; i++) {
				v = resolveDirective(this, values[valueIndex + i], directiveParent, i);
				if (v === noChange) v = this._$committedValue[i];
				change ||= !isPrimitive(v) || v !== this._$committedValue[i];
				if (v === nothing) value = nothing;
				else if (value !== nothing) value += (v ?? "") + strings[i + 1];
				this._$committedValue[i] = v;
			}
		}
		if (change && !noCommit) this._commitValue(value);
	}
	_commitValue(value) {
		if (value === nothing) wrap(this.element).removeAttribute(this.name);
		else {
			if (this._sanitizer === void 0) this._sanitizer = sanitizerFactoryInternal(this.element, this.name, "attribute");
			value = this._sanitizer(value ?? "");
			debugLogEvent && debugLogEvent({
				kind: "commit attribute",
				element: this.element,
				name: this.name,
				value,
				options: this.options
			});
			wrap(this.element).setAttribute(this.name, value ?? "");
		}
	}
};
var PropertyPart = class extends AttributePart {
	constructor() {
		super(...arguments);
		this.type = 3;
	}
	_commitValue(value) {
		if (this._sanitizer === void 0) this._sanitizer = sanitizerFactoryInternal(this.element, this.name, "property");
		value = this._sanitizer(value);
		debugLogEvent && debugLogEvent({
			kind: "commit property",
			element: this.element,
			name: this.name,
			value,
			options: this.options
		});
		this.element[this.name] = value === nothing ? void 0 : value;
	}
};
var BooleanAttributePart = class extends AttributePart {
	constructor() {
		super(...arguments);
		this.type = 4;
	}
	_commitValue(value) {
		debugLogEvent && debugLogEvent({
			kind: "commit boolean attribute",
			element: this.element,
			name: this.name,
			value: !!(value && value !== nothing),
			options: this.options
		});
		wrap(this.element).toggleAttribute(this.name, !!value && value !== nothing);
	}
};
var EventPart = class extends AttributePart {
	constructor(element, name, strings, parent, options) {
		super(element, name, strings, parent, options);
		this.type = 5;
		if (this.strings !== void 0) throw new Error(`A \`<${element.localName}>\` has a \`@${name}=...\` listener with invalid content. Event listeners in templates must have exactly one expression and no surrounding text.`);
	}
	_$setValue(newListener, directiveParent = this) {
		newListener = resolveDirective(this, newListener, directiveParent, 0) ?? nothing;
		if (newListener === noChange) return;
		const oldListener = this._$committedValue;
		const shouldRemoveListener = newListener === nothing && oldListener !== nothing || newListener.capture !== oldListener.capture || newListener.once !== oldListener.once || newListener.passive !== oldListener.passive;
		const shouldAddListener = newListener !== nothing && (oldListener === nothing || shouldRemoveListener);
		debugLogEvent && debugLogEvent({
			kind: "commit event listener",
			element: this.element,
			name: this.name,
			value: newListener,
			options: this.options,
			removeListener: shouldRemoveListener,
			addListener: shouldAddListener,
			oldListener
		});
		if (shouldRemoveListener) this.element.removeEventListener(this.name, this, oldListener);
		if (shouldAddListener) this.element.addEventListener(this.name, this, newListener);
		this._$committedValue = newListener;
	}
	handleEvent(event) {
		if (typeof this._$committedValue === "function") this._$committedValue.call(this.options?.host ?? this.element, event);
		else this._$committedValue.handleEvent(event);
	}
};
var ElementPart = class {
	constructor(element, parent, options) {
		this.element = element;
		this.type = 6;
		this._$disconnectableChildren = void 0;
		this._$parent = parent;
		this.options = options;
	}
	get _$isConnected() {
		return this._$parent._$isConnected;
	}
	_$setValue(value) {
		debugLogEvent && debugLogEvent({
			kind: "commit to element binding",
			element: this.element,
			value,
			options: this.options
		});
		resolveDirective(this, value);
	}
};
const _$LH = {
	_boundAttributeSuffix: boundAttributeSuffix,
	_marker: marker,
	_markerMatch: markerMatch,
	_HTML_RESULT: 1,
	_getTemplateHtml: getTemplateHtml,
	_TemplateInstance: TemplateInstance,
	_isIterable: isIterable,
	_resolveDirective: resolveDirective,
	_ChildPart: ChildPart,
	_AttributePart: AttributePart,
	_BooleanAttributePart: BooleanAttributePart,
	_EventPart: EventPart,
	_PropertyPart: PropertyPart,
	_ElementPart: ElementPart
};
var polyfillSupport$1 = global$1.litHtmlPolyfillSupportDevMode;
polyfillSupport$1?.(Template, ChildPart);
(global$1.litHtmlVersions ??= []).push("3.3.1");
if (global$1.litHtmlVersions.length > 1) queueMicrotask(() => {
	issueWarning$1("multiple-versions", "Multiple versions of Lit loaded. Loading multiple versions is not recommended.");
});
const render = (value, container, options) => {
	if (container == null) throw new TypeError(`The container to render into may not be ${container}`);
	const renderId = debugLogRenderId++;
	const partOwnerNode = options?.renderBefore ?? container;
	let part = partOwnerNode["_$litPart$"];
	debugLogEvent && debugLogEvent({
		kind: "begin render",
		id: renderId,
		value,
		container,
		options,
		part
	});
	if (part === void 0) {
		const endNode = options?.renderBefore ?? null;
		partOwnerNode["_$litPart$"] = part = new ChildPart(container.insertBefore(createMarker(), endNode), endNode, void 0, options ?? {});
	}
	part._$setValue(value);
	debugLogEvent && debugLogEvent({
		kind: "end render",
		id: renderId,
		value,
		container,
		options,
		part
	});
	return part;
};
render.setSanitizer = setSanitizer;
render.createSanitizer = createSanitizer;
render._testOnlyClearSanitizerFactoryDoNotCallOrElse = _testOnlyClearSanitizerFactoryDoNotCallOrElse;
var JSCompiler_renameProperty = (prop, _obj) => prop;
var global = globalThis;
var issueWarning;
global.litIssuedWarnings ??= /* @__PURE__ */ new Set();
issueWarning = (code, warning) => {
	warning += ` See https://lit.dev/msg/${code} for more information.`;
	if (!global.litIssuedWarnings.has(warning) && !global.litIssuedWarnings.has(code)) {
		console.warn(warning);
		global.litIssuedWarnings.add(warning);
	}
};
var LitElement = class extends ReactiveElement {
	constructor() {
		super(...arguments);
		this.renderOptions = { host: this };
		this.__childPart = void 0;
	}
	createRenderRoot() {
		const renderRoot = super.createRenderRoot();
		this.renderOptions.renderBefore ??= renderRoot.firstChild;
		return renderRoot;
	}
	update(changedProperties) {
		const value = this.render();
		if (!this.hasUpdated) this.renderOptions.isConnected = this.isConnected;
		super.update(changedProperties);
		this.__childPart = render(value, this.renderRoot, this.renderOptions);
	}
	connectedCallback() {
		super.connectedCallback();
		this.__childPart?.setConnected(true);
	}
	disconnectedCallback() {
		super.disconnectedCallback();
		this.__childPart?.setConnected(false);
	}
	render() {
		return noChange;
	}
};
LitElement["_$litElement$"] = true;
LitElement[JSCompiler_renameProperty("finalized", LitElement)] = true;
global.litElementHydrateSupport?.({ LitElement });
var polyfillSupport = global.litElementPolyfillSupportDevMode;
polyfillSupport?.({ LitElement });
(global.litElementVersions ??= []).push("4.2.1");
if (global.litElementVersions.length > 1) queueMicrotask(() => {
	issueWarning("multiple-versions", "Multiple versions of Lit loaded. Loading multiple versions is not recommended.");
});
export { nothing as a, notEqual as c, noChange as i, css as l, _$LH as n, svg as o, html as r, defaultConverter as s, LitElement as t, unsafeCSS as u };
