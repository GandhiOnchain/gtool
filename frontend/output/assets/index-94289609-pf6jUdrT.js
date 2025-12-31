const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/alchemy-provider-0b2e9f09-DqMyS5BS.js","assets/alchemy-provider-0b2e9f09-DPLDZ2BA.js","assets/index-olLYy6KR.js","assets/index-C8isLxo-.css","assets/alchemy-websocket-provider-2f8b1006-OIs8Wzhb.js"])))=>i.map(i=>d[i]);
import { Ca as isHexString, Ja as __export, Pa as __vitePreload, Sa as hexValue, ba as BigNumber, ha as formatUnits, xa as hexStripZeros } from "./index-olLYy6KR.js";
function bind(fn, thisArg) {
	return function wrap() {
		return fn.apply(thisArg, arguments);
	};
}
var { toString } = Object.prototype;
var { getPrototypeOf } = Object;
var { iterator, toStringTag } = Symbol;
var kindOf = ((cache) => (thing) => {
	const str = toString.call(thing);
	return cache[str] || (cache[str] = str.slice(8, -1).toLowerCase());
})(Object.create(null));
var kindOfTest = (type) => {
	type = type.toLowerCase();
	return (thing) => kindOf(thing) === type;
};
var typeOfTest = (type) => (thing) => typeof thing === type;
var { isArray } = Array;
var isUndefined = typeOfTest("undefined");
function isBuffer(val) {
	return val !== null && !isUndefined(val) && val.constructor !== null && !isUndefined(val.constructor) && isFunction$1(val.constructor.isBuffer) && val.constructor.isBuffer(val);
}
var isArrayBuffer = kindOfTest("ArrayBuffer");
function isArrayBufferView(val) {
	let result;
	if (typeof ArrayBuffer !== "undefined" && ArrayBuffer.isView) result = ArrayBuffer.isView(val);
	else result = val && val.buffer && isArrayBuffer(val.buffer);
	return result;
}
var isString = typeOfTest("string");
var isFunction$1 = typeOfTest("function");
var isNumber = typeOfTest("number");
var isObject = (thing) => thing !== null && typeof thing === "object";
var isBoolean = (thing) => thing === true || thing === false;
var isPlainObject = (val) => {
	if (kindOf(val) !== "object") return false;
	const prototype$2 = getPrototypeOf(val);
	return (prototype$2 === null || prototype$2 === Object.prototype || Object.getPrototypeOf(prototype$2) === null) && !(toStringTag in val) && !(iterator in val);
};
var isEmptyObject = (val) => {
	if (!isObject(val) || isBuffer(val)) return false;
	try {
		return Object.keys(val).length === 0 && Object.getPrototypeOf(val) === Object.prototype;
	} catch (e) {
		return false;
	}
};
var isDate = kindOfTest("Date");
var isFile = kindOfTest("File");
var isBlob = kindOfTest("Blob");
var isFileList = kindOfTest("FileList");
var isStream = (val) => isObject(val) && isFunction$1(val.pipe);
var isFormData = (thing) => {
	let kind;
	return thing && (typeof FormData === "function" && thing instanceof FormData || isFunction$1(thing.append) && ((kind = kindOf(thing)) === "formdata" || kind === "object" && isFunction$1(thing.toString) && thing.toString() === "[object FormData]"));
};
var isURLSearchParams = kindOfTest("URLSearchParams");
var [isReadableStream, isRequest, isResponse, isHeaders] = [
	"ReadableStream",
	"Request",
	"Response",
	"Headers"
].map(kindOfTest);
var trim = (str) => str.trim ? str.trim() : str.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, "");
function forEach(obj, fn, { allOwnKeys = false } = {}) {
	if (obj === null || typeof obj === "undefined") return;
	let i;
	let l;
	if (typeof obj !== "object") obj = [obj];
	if (isArray(obj)) for (i = 0, l = obj.length; i < l; i++) fn.call(null, obj[i], i, obj);
	else {
		if (isBuffer(obj)) return;
		const keys = allOwnKeys ? Object.getOwnPropertyNames(obj) : Object.keys(obj);
		const len = keys.length;
		let key;
		for (i = 0; i < len; i++) {
			key = keys[i];
			fn.call(null, obj[key], key, obj);
		}
	}
}
function findKey(obj, key) {
	if (isBuffer(obj)) return null;
	key = key.toLowerCase();
	const keys = Object.keys(obj);
	let i = keys.length;
	let _key;
	while (i-- > 0) {
		_key = keys[i];
		if (key === _key.toLowerCase()) return _key;
	}
	return null;
}
var _global = (() => {
	if (typeof globalThis !== "undefined") return globalThis;
	return typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : global;
})();
var isContextDefined = (context) => !isUndefined(context) && context !== _global;
function merge() {
	const { caseless, skipUndefined } = isContextDefined(this) && this || {};
	const result = {};
	const assignValue = (val, key) => {
		const targetKey = caseless && findKey(result, key) || key;
		if (isPlainObject(result[targetKey]) && isPlainObject(val)) result[targetKey] = merge(result[targetKey], val);
		else if (isPlainObject(val)) result[targetKey] = merge({}, val);
		else if (isArray(val)) result[targetKey] = val.slice();
		else if (!skipUndefined || !isUndefined(val)) result[targetKey] = val;
	};
	for (let i = 0, l = arguments.length; i < l; i++) arguments[i] && forEach(arguments[i], assignValue);
	return result;
}
var extend = (a, b, thisArg, { allOwnKeys } = {}) => {
	forEach(b, (val, key) => {
		if (thisArg && isFunction$1(val)) a[key] = bind(val, thisArg);
		else a[key] = val;
	}, { allOwnKeys });
	return a;
};
var stripBOM = (content) => {
	if (content.charCodeAt(0) === 65279) content = content.slice(1);
	return content;
};
var inherits = (constructor, superConstructor, props, descriptors$1) => {
	constructor.prototype = Object.create(superConstructor.prototype, descriptors$1);
	constructor.prototype.constructor = constructor;
	Object.defineProperty(constructor, "super", { value: superConstructor.prototype });
	props && Object.assign(constructor.prototype, props);
};
var toFlatObject = (sourceObj, destObj, filter, propFilter) => {
	let props;
	let i;
	let prop;
	const merged = {};
	destObj = destObj || {};
	if (sourceObj == null) return destObj;
	do {
		props = Object.getOwnPropertyNames(sourceObj);
		i = props.length;
		while (i-- > 0) {
			prop = props[i];
			if ((!propFilter || propFilter(prop, sourceObj, destObj)) && !merged[prop]) {
				destObj[prop] = sourceObj[prop];
				merged[prop] = true;
			}
		}
		sourceObj = filter !== false && getPrototypeOf(sourceObj);
	} while (sourceObj && (!filter || filter(sourceObj, destObj)) && sourceObj !== Object.prototype);
	return destObj;
};
var endsWith = (str, searchString, position) => {
	str = String(str);
	if (position === void 0 || position > str.length) position = str.length;
	position -= searchString.length;
	const lastIndex = str.indexOf(searchString, position);
	return lastIndex !== -1 && lastIndex === position;
};
var toArray = (thing) => {
	if (!thing) return null;
	if (isArray(thing)) return thing;
	let i = thing.length;
	if (!isNumber(i)) return null;
	const arr = new Array(i);
	while (i-- > 0) arr[i] = thing[i];
	return arr;
};
var isTypedArray = ((TypedArray) => {
	return (thing) => {
		return TypedArray && thing instanceof TypedArray;
	};
})(typeof Uint8Array !== "undefined" && getPrototypeOf(Uint8Array));
var forEachEntry = (obj, fn) => {
	const _iterator = (obj && obj[iterator]).call(obj);
	let result;
	while ((result = _iterator.next()) && !result.done) {
		const pair = result.value;
		fn.call(obj, pair[0], pair[1]);
	}
};
var matchAll = (regExp, str) => {
	let matches;
	const arr = [];
	while ((matches = regExp.exec(str)) !== null) arr.push(matches);
	return arr;
};
var isHTMLForm = kindOfTest("HTMLFormElement");
var toCamelCase = (str) => {
	return str.toLowerCase().replace(/[-_\s]([a-z\d])(\w*)/g, function replacer(m, p1, p2) {
		return p1.toUpperCase() + p2;
	});
};
var hasOwnProperty = (({ hasOwnProperty: hasOwnProperty$1 }) => (obj, prop) => hasOwnProperty$1.call(obj, prop))(Object.prototype);
var isRegExp = kindOfTest("RegExp");
var reduceDescriptors = (obj, reducer) => {
	const descriptors$1 = Object.getOwnPropertyDescriptors(obj);
	const reducedDescriptors = {};
	forEach(descriptors$1, (descriptor, name) => {
		let ret;
		if ((ret = reducer(descriptor, name, obj)) !== false) reducedDescriptors[name] = ret || descriptor;
	});
	Object.defineProperties(obj, reducedDescriptors);
};
var freezeMethods = (obj) => {
	reduceDescriptors(obj, (descriptor, name) => {
		if (isFunction$1(obj) && [
			"arguments",
			"caller",
			"callee"
		].indexOf(name) !== -1) return false;
		const value = obj[name];
		if (!isFunction$1(value)) return;
		descriptor.enumerable = false;
		if ("writable" in descriptor) {
			descriptor.writable = false;
			return;
		}
		if (!descriptor.set) descriptor.set = () => {
			throw Error("Can not rewrite read-only method '" + name + "'");
		};
	});
};
var toObjectSet = (arrayOrString, delimiter) => {
	const obj = {};
	const define = (arr) => {
		arr.forEach((value) => {
			obj[value] = true;
		});
	};
	isArray(arrayOrString) ? define(arrayOrString) : define(String(arrayOrString).split(delimiter));
	return obj;
};
var noop$1 = () => {};
var toFiniteNumber = (value, defaultValue) => {
	return value != null && Number.isFinite(value = +value) ? value : defaultValue;
};
function isSpecCompliantForm(thing) {
	return !!(thing && isFunction$1(thing.append) && thing[toStringTag] === "FormData" && thing[iterator]);
}
var toJSONObject = (obj) => {
	const stack = new Array(10);
	const visit = (source, i) => {
		if (isObject(source)) {
			if (stack.indexOf(source) >= 0) return;
			if (isBuffer(source)) return source;
			if (!("toJSON" in source)) {
				stack[i] = source;
				const target = isArray(source) ? [] : {};
				forEach(source, (value, key) => {
					const reducedValue = visit(value, i + 1);
					!isUndefined(reducedValue) && (target[key] = reducedValue);
				});
				stack[i] = void 0;
				return target;
			}
		}
		return source;
	};
	return visit(obj, 0);
};
var isAsyncFn = kindOfTest("AsyncFunction");
var isThenable = (thing) => thing && (isObject(thing) || isFunction$1(thing)) && isFunction$1(thing.then) && isFunction$1(thing.catch);
var _setImmediate = ((setImmediateSupported, postMessageSupported) => {
	if (setImmediateSupported) return setImmediate;
	return postMessageSupported ? ((token, callbacks) => {
		_global.addEventListener("message", ({ source, data }) => {
			if (source === _global && data === token) callbacks.length && callbacks.shift()();
		}, false);
		return (cb) => {
			callbacks.push(cb);
			_global.postMessage(token, "*");
		};
	})(`axios@${Math.random()}`, []) : (cb) => setTimeout(cb);
})(typeof setImmediate === "function", isFunction$1(_global.postMessage));
var asap = typeof queueMicrotask !== "undefined" ? queueMicrotask.bind(_global) : typeof process !== "undefined" && process.nextTick || _setImmediate;
var isIterable = (thing) => thing != null && isFunction$1(thing[iterator]);
var utils_default = {
	isArray,
	isArrayBuffer,
	isBuffer,
	isFormData,
	isArrayBufferView,
	isString,
	isNumber,
	isBoolean,
	isObject,
	isPlainObject,
	isEmptyObject,
	isReadableStream,
	isRequest,
	isResponse,
	isHeaders,
	isUndefined,
	isDate,
	isFile,
	isBlob,
	isRegExp,
	isFunction: isFunction$1,
	isStream,
	isURLSearchParams,
	isTypedArray,
	isFileList,
	forEach,
	merge,
	extend,
	trim,
	stripBOM,
	inherits,
	toFlatObject,
	kindOf,
	kindOfTest,
	endsWith,
	toArray,
	forEachEntry,
	matchAll,
	isHTMLForm,
	hasOwnProperty,
	hasOwnProp: hasOwnProperty,
	reduceDescriptors,
	freezeMethods,
	toObjectSet,
	toCamelCase,
	noop: noop$1,
	toFiniteNumber,
	findKey,
	global: _global,
	isContextDefined,
	isSpecCompliantForm,
	toJSONObject,
	isAsyncFn,
	isThenable,
	setImmediate: _setImmediate,
	asap,
	isIterable
};
function AxiosError(message, code, config, request, response) {
	Error.call(this);
	if (Error.captureStackTrace) Error.captureStackTrace(this, this.constructor);
	else this.stack = (/* @__PURE__ */ new Error()).stack;
	this.message = message;
	this.name = "AxiosError";
	code && (this.code = code);
	config && (this.config = config);
	request && (this.request = request);
	if (response) {
		this.response = response;
		this.status = response.status ? response.status : null;
	}
}
utils_default.inherits(AxiosError, Error, { toJSON: function toJSON() {
	return {
		message: this.message,
		name: this.name,
		description: this.description,
		number: this.number,
		fileName: this.fileName,
		lineNumber: this.lineNumber,
		columnNumber: this.columnNumber,
		stack: this.stack,
		config: utils_default.toJSONObject(this.config),
		code: this.code,
		status: this.status
	};
} });
var prototype$1 = AxiosError.prototype;
var descriptors = {};
[
	"ERR_BAD_OPTION_VALUE",
	"ERR_BAD_OPTION",
	"ECONNABORTED",
	"ETIMEDOUT",
	"ERR_NETWORK",
	"ERR_FR_TOO_MANY_REDIRECTS",
	"ERR_DEPRECATED",
	"ERR_BAD_RESPONSE",
	"ERR_BAD_REQUEST",
	"ERR_CANCELED",
	"ERR_NOT_SUPPORT",
	"ERR_INVALID_URL"
].forEach((code) => {
	descriptors[code] = { value: code };
});
Object.defineProperties(AxiosError, descriptors);
Object.defineProperty(prototype$1, "isAxiosError", { value: true });
AxiosError.from = (error, code, config, request, response, customProps) => {
	const axiosError = Object.create(prototype$1);
	utils_default.toFlatObject(error, axiosError, function filter(obj) {
		return obj !== Error.prototype;
	}, (prop) => {
		return prop !== "isAxiosError";
	});
	const msg = error && error.message ? error.message : "Error";
	const errCode = code == null && error ? error.code : code;
	AxiosError.call(axiosError, msg, errCode, config, request, response);
	if (error && axiosError.cause == null) Object.defineProperty(axiosError, "cause", {
		value: error,
		configurable: true
	});
	axiosError.name = error && error.name || "Error";
	customProps && Object.assign(axiosError, customProps);
	return axiosError;
};
var AxiosError_default = AxiosError;
function isVisitable(thing) {
	return utils_default.isPlainObject(thing) || utils_default.isArray(thing);
}
function removeBrackets(key) {
	return utils_default.endsWith(key, "[]") ? key.slice(0, -2) : key;
}
function renderKey(path, key, dots) {
	if (!path) return key;
	return path.concat(key).map(function each(token, i) {
		token = removeBrackets(token);
		return !dots && i ? "[" + token + "]" : token;
	}).join(dots ? "." : "");
}
function isFlatArray(arr) {
	return utils_default.isArray(arr) && !arr.some(isVisitable);
}
var predicates = utils_default.toFlatObject(utils_default, {}, null, function filter(prop) {
	return /^is[A-Z]/.test(prop);
});
function toFormData(obj, formData, options) {
	if (!utils_default.isObject(obj)) throw new TypeError("target must be an object");
	formData = formData || new FormData();
	options = utils_default.toFlatObject(options, {
		metaTokens: true,
		dots: false,
		indexes: false
	}, false, function defined(option, source) {
		return !utils_default.isUndefined(source[option]);
	});
	const metaTokens = options.metaTokens;
	const visitor = options.visitor || defaultVisitor;
	const dots = options.dots;
	const indexes = options.indexes;
	const useBlob = (options.Blob || typeof Blob !== "undefined" && Blob) && utils_default.isSpecCompliantForm(formData);
	if (!utils_default.isFunction(visitor)) throw new TypeError("visitor must be a function");
	function convertValue(value) {
		if (value === null) return "";
		if (utils_default.isDate(value)) return value.toISOString();
		if (utils_default.isBoolean(value)) return value.toString();
		if (!useBlob && utils_default.isBlob(value)) throw new AxiosError_default("Blob is not supported. Use a Buffer instead.");
		if (utils_default.isArrayBuffer(value) || utils_default.isTypedArray(value)) return useBlob && typeof Blob === "function" ? new Blob([value]) : Buffer.from(value);
		return value;
	}
	function defaultVisitor(value, key, path) {
		let arr = value;
		if (value && !path && typeof value === "object") {
			if (utils_default.endsWith(key, "{}")) {
				key = metaTokens ? key : key.slice(0, -2);
				value = JSON.stringify(value);
			} else if (utils_default.isArray(value) && isFlatArray(value) || (utils_default.isFileList(value) || utils_default.endsWith(key, "[]")) && (arr = utils_default.toArray(value))) {
				key = removeBrackets(key);
				arr.forEach(function each(el, index) {
					!(utils_default.isUndefined(el) || el === null) && formData.append(indexes === true ? renderKey([key], index, dots) : indexes === null ? key : key + "[]", convertValue(el));
				});
				return false;
			}
		}
		if (isVisitable(value)) return true;
		formData.append(renderKey(path, key, dots), convertValue(value));
		return false;
	}
	const stack = [];
	const exposedHelpers = Object.assign(predicates, {
		defaultVisitor,
		convertValue,
		isVisitable
	});
	function build(value, path) {
		if (utils_default.isUndefined(value)) return;
		if (stack.indexOf(value) !== -1) throw Error("Circular reference detected in " + path.join("."));
		stack.push(value);
		utils_default.forEach(value, function each(el, key) {
			if ((!(utils_default.isUndefined(el) || el === null) && visitor.call(formData, el, utils_default.isString(key) ? key.trim() : key, path, exposedHelpers)) === true) build(el, path ? path.concat(key) : [key]);
		});
		stack.pop();
	}
	if (!utils_default.isObject(obj)) throw new TypeError("data must be an object");
	build(obj);
	return formData;
}
var toFormData_default = toFormData;
function encode$1(str) {
	const charMap = {
		"!": "%21",
		"'": "%27",
		"(": "%28",
		")": "%29",
		"~": "%7E",
		"%20": "+",
		"%00": "\0"
	};
	return encodeURIComponent(str).replace(/[!'()~]|%20|%00/g, function replacer(match) {
		return charMap[match];
	});
}
function AxiosURLSearchParams(params, options) {
	this._pairs = [];
	params && toFormData_default(params, this, options);
}
var prototype = AxiosURLSearchParams.prototype;
prototype.append = function append(name, value) {
	this._pairs.push([name, value]);
};
prototype.toString = function toString$1(encoder) {
	const _encode = encoder ? function(value) {
		return encoder.call(this, value, encode$1);
	} : encode$1;
	return this._pairs.map(function each(pair) {
		return _encode(pair[0]) + "=" + _encode(pair[1]);
	}, "").join("&");
};
var AxiosURLSearchParams_default = AxiosURLSearchParams;
function encode(val) {
	return encodeURIComponent(val).replace(/%3A/gi, ":").replace(/%24/g, "$").replace(/%2C/gi, ",").replace(/%20/g, "+");
}
function buildURL(url, params, options) {
	if (!params) return url;
	const _encode = options && options.encode || encode;
	if (utils_default.isFunction(options)) options = { serialize: options };
	const serializeFn = options && options.serialize;
	let serializedParams;
	if (serializeFn) serializedParams = serializeFn(params, options);
	else serializedParams = utils_default.isURLSearchParams(params) ? params.toString() : new AxiosURLSearchParams_default(params, options).toString(_encode);
	if (serializedParams) {
		const hashmarkIndex = url.indexOf("#");
		if (hashmarkIndex !== -1) url = url.slice(0, hashmarkIndex);
		url += (url.indexOf("?") === -1 ? "?" : "&") + serializedParams;
	}
	return url;
}
var InterceptorManager = class {
	constructor() {
		this.handlers = [];
	}
	use(fulfilled, rejected, options) {
		this.handlers.push({
			fulfilled,
			rejected,
			synchronous: options ? options.synchronous : false,
			runWhen: options ? options.runWhen : null
		});
		return this.handlers.length - 1;
	}
	eject(id) {
		if (this.handlers[id]) this.handlers[id] = null;
	}
	clear() {
		if (this.handlers) this.handlers = [];
	}
	forEach(fn) {
		utils_default.forEach(this.handlers, function forEachHandler(h) {
			if (h !== null) fn(h);
		});
	}
};
var InterceptorManager_default = InterceptorManager;
var transitional_default = {
	silentJSONParsing: true,
	forcedJSONParsing: true,
	clarifyTimeoutError: false
};
var browser_default = {
	isBrowser: true,
	classes: {
		URLSearchParams: typeof URLSearchParams !== "undefined" ? URLSearchParams : AxiosURLSearchParams_default,
		FormData: typeof FormData !== "undefined" ? FormData : null,
		Blob: typeof Blob !== "undefined" ? Blob : null
	},
	protocols: [
		"http",
		"https",
		"file",
		"blob",
		"url",
		"data"
	]
};
var utils_exports = /* @__PURE__ */ __export({
	hasBrowserEnv: () => hasBrowserEnv,
	hasStandardBrowserEnv: () => hasStandardBrowserEnv,
	hasStandardBrowserWebWorkerEnv: () => hasStandardBrowserWebWorkerEnv,
	navigator: () => _navigator,
	origin: () => origin
});
var hasBrowserEnv = typeof window !== "undefined" && typeof document !== "undefined";
var _navigator = typeof navigator === "object" && navigator || void 0;
var hasStandardBrowserEnv = hasBrowserEnv && (!_navigator || [
	"ReactNative",
	"NativeScript",
	"NS"
].indexOf(_navigator.product) < 0);
var hasStandardBrowserWebWorkerEnv = (() => {
	return typeof WorkerGlobalScope !== "undefined" && self instanceof WorkerGlobalScope && typeof self.importScripts === "function";
})();
var origin = hasBrowserEnv && window.location.href || "http://localhost";
var platform_default = {
	...utils_exports,
	...browser_default
};
function toURLEncodedForm(data, options) {
	return toFormData_default(data, new platform_default.classes.URLSearchParams(), {
		visitor: function(value, key, path, helpers) {
			if (platform_default.isNode && utils_default.isBuffer(value)) {
				this.append(key, value.toString("base64"));
				return false;
			}
			return helpers.defaultVisitor.apply(this, arguments);
		},
		...options
	});
}
function parsePropPath(name) {
	return utils_default.matchAll(/\w+|\[(\w*)]/g, name).map((match) => {
		return match[0] === "[]" ? "" : match[1] || match[0];
	});
}
function arrayToObject(arr) {
	const obj = {};
	const keys = Object.keys(arr);
	let i;
	const len = keys.length;
	let key;
	for (i = 0; i < len; i++) {
		key = keys[i];
		obj[key] = arr[key];
	}
	return obj;
}
function formDataToJSON(formData) {
	function buildPath(path, value, target, index) {
		let name = path[index++];
		if (name === "__proto__") return true;
		const isNumericKey = Number.isFinite(+name);
		const isLast = index >= path.length;
		name = !name && utils_default.isArray(target) ? target.length : name;
		if (isLast) {
			if (utils_default.hasOwnProp(target, name)) target[name] = [target[name], value];
			else target[name] = value;
			return !isNumericKey;
		}
		if (!target[name] || !utils_default.isObject(target[name])) target[name] = [];
		if (buildPath(path, value, target[name], index) && utils_default.isArray(target[name])) target[name] = arrayToObject(target[name]);
		return !isNumericKey;
	}
	if (utils_default.isFormData(formData) && utils_default.isFunction(formData.entries)) {
		const obj = {};
		utils_default.forEachEntry(formData, (name, value) => {
			buildPath(parsePropPath(name), value, obj, 0);
		});
		return obj;
	}
	return null;
}
var formDataToJSON_default = formDataToJSON;
function stringifySafely(rawValue, parser, encoder) {
	if (utils_default.isString(rawValue)) try {
		(parser || JSON.parse)(rawValue);
		return utils_default.trim(rawValue);
	} catch (e) {
		if (e.name !== "SyntaxError") throw e;
	}
	return (encoder || JSON.stringify)(rawValue);
}
var defaults = {
	transitional: transitional_default,
	adapter: [
		"xhr",
		"http",
		"fetch"
	],
	transformRequest: [function transformRequest(data, headers) {
		const contentType = headers.getContentType() || "";
		const hasJSONContentType = contentType.indexOf("application/json") > -1;
		const isObjectPayload = utils_default.isObject(data);
		if (isObjectPayload && utils_default.isHTMLForm(data)) data = new FormData(data);
		if (utils_default.isFormData(data)) return hasJSONContentType ? JSON.stringify(formDataToJSON_default(data)) : data;
		if (utils_default.isArrayBuffer(data) || utils_default.isBuffer(data) || utils_default.isStream(data) || utils_default.isFile(data) || utils_default.isBlob(data) || utils_default.isReadableStream(data)) return data;
		if (utils_default.isArrayBufferView(data)) return data.buffer;
		if (utils_default.isURLSearchParams(data)) {
			headers.setContentType("application/x-www-form-urlencoded;charset=utf-8", false);
			return data.toString();
		}
		let isFileList$1;
		if (isObjectPayload) {
			if (contentType.indexOf("application/x-www-form-urlencoded") > -1) return toURLEncodedForm(data, this.formSerializer).toString();
			if ((isFileList$1 = utils_default.isFileList(data)) || contentType.indexOf("multipart/form-data") > -1) {
				const _FormData = this.env && this.env.FormData;
				return toFormData_default(isFileList$1 ? { "files[]": data } : data, _FormData && new _FormData(), this.formSerializer);
			}
		}
		if (isObjectPayload || hasJSONContentType) {
			headers.setContentType("application/json", false);
			return stringifySafely(data);
		}
		return data;
	}],
	transformResponse: [function transformResponse(data) {
		const transitional = this.transitional || defaults.transitional;
		const forcedJSONParsing = transitional && transitional.forcedJSONParsing;
		const JSONRequested = this.responseType === "json";
		if (utils_default.isResponse(data) || utils_default.isReadableStream(data)) return data;
		if (data && utils_default.isString(data) && (forcedJSONParsing && !this.responseType || JSONRequested)) {
			const strictJSONParsing = !(transitional && transitional.silentJSONParsing) && JSONRequested;
			try {
				return JSON.parse(data, this.parseReviver);
			} catch (e) {
				if (strictJSONParsing) {
					if (e.name === "SyntaxError") throw AxiosError_default.from(e, AxiosError_default.ERR_BAD_RESPONSE, this, null, this.response);
					throw e;
				}
			}
		}
		return data;
	}],
	timeout: 0,
	xsrfCookieName: "XSRF-TOKEN",
	xsrfHeaderName: "X-XSRF-TOKEN",
	maxContentLength: -1,
	maxBodyLength: -1,
	env: {
		FormData: platform_default.classes.FormData,
		Blob: platform_default.classes.Blob
	},
	validateStatus: function validateStatus(status) {
		return status >= 200 && status < 300;
	},
	headers: { common: {
		"Accept": "application/json, text/plain, */*",
		"Content-Type": void 0
	} }
};
utils_default.forEach([
	"delete",
	"get",
	"head",
	"post",
	"put",
	"patch"
], (method) => {
	defaults.headers[method] = {};
});
var defaults_default = defaults;
var ignoreDuplicateOf = utils_default.toObjectSet([
	"age",
	"authorization",
	"content-length",
	"content-type",
	"etag",
	"expires",
	"from",
	"host",
	"if-modified-since",
	"if-unmodified-since",
	"last-modified",
	"location",
	"max-forwards",
	"proxy-authorization",
	"referer",
	"retry-after",
	"user-agent"
]);
var parseHeaders_default = (rawHeaders) => {
	const parsed = {};
	let key;
	let val;
	let i;
	rawHeaders && rawHeaders.split("\n").forEach(function parser(line) {
		i = line.indexOf(":");
		key = line.substring(0, i).trim().toLowerCase();
		val = line.substring(i + 1).trim();
		if (!key || parsed[key] && ignoreDuplicateOf[key]) return;
		if (key === "set-cookie") if (parsed[key]) parsed[key].push(val);
		else parsed[key] = [val];
		else parsed[key] = parsed[key] ? parsed[key] + ", " + val : val;
	});
	return parsed;
};
var $internals = Symbol("internals");
function normalizeHeader(header) {
	return header && String(header).trim().toLowerCase();
}
function normalizeValue(value) {
	if (value === false || value == null) return value;
	return utils_default.isArray(value) ? value.map(normalizeValue) : String(value);
}
function parseTokens(str) {
	const tokens = Object.create(null);
	const tokensRE = /([^\s,;=]+)\s*(?:=\s*([^,;]+))?/g;
	let match;
	while (match = tokensRE.exec(str)) tokens[match[1]] = match[2];
	return tokens;
}
var isValidHeaderName = (str) => /^[-_a-zA-Z0-9^`|~,!#$%&'*+.]+$/.test(str.trim());
function matchHeaderValue(context, value, header, filter, isHeaderNameFilter) {
	if (utils_default.isFunction(filter)) return filter.call(this, value, header);
	if (isHeaderNameFilter) value = header;
	if (!utils_default.isString(value)) return;
	if (utils_default.isString(filter)) return value.indexOf(filter) !== -1;
	if (utils_default.isRegExp(filter)) return filter.test(value);
}
function formatHeader(header) {
	return header.trim().toLowerCase().replace(/([a-z\d])(\w*)/g, (w, char, str) => {
		return char.toUpperCase() + str;
	});
}
function buildAccessors(obj, header) {
	const accessorName = utils_default.toCamelCase(" " + header);
	[
		"get",
		"set",
		"has"
	].forEach((methodName) => {
		Object.defineProperty(obj, methodName + accessorName, {
			value: function(arg1, arg2, arg3) {
				return this[methodName].call(this, header, arg1, arg2, arg3);
			},
			configurable: true
		});
	});
}
var AxiosHeaders = class {
	constructor(headers) {
		headers && this.set(headers);
	}
	set(header, valueOrRewrite, rewrite) {
		const self$1 = this;
		function setHeader(_value, _header, _rewrite) {
			const lHeader = normalizeHeader(_header);
			if (!lHeader) throw new Error("header name must be a non-empty string");
			const key = utils_default.findKey(self$1, lHeader);
			if (!key || self$1[key] === void 0 || _rewrite === true || _rewrite === void 0 && self$1[key] !== false) self$1[key || _header] = normalizeValue(_value);
		}
		const setHeaders = (headers, _rewrite) => utils_default.forEach(headers, (_value, _header) => setHeader(_value, _header, _rewrite));
		if (utils_default.isPlainObject(header) || header instanceof this.constructor) setHeaders(header, valueOrRewrite);
		else if (utils_default.isString(header) && (header = header.trim()) && !isValidHeaderName(header)) setHeaders(parseHeaders_default(header), valueOrRewrite);
		else if (utils_default.isObject(header) && utils_default.isIterable(header)) {
			let obj = {}, dest, key;
			for (const entry of header) {
				if (!utils_default.isArray(entry)) throw TypeError("Object iterator must return a key-value pair");
				obj[key = entry[0]] = (dest = obj[key]) ? utils_default.isArray(dest) ? [...dest, entry[1]] : [dest, entry[1]] : entry[1];
			}
			setHeaders(obj, valueOrRewrite);
		} else header != null && setHeader(valueOrRewrite, header, rewrite);
		return this;
	}
	get(header, parser) {
		header = normalizeHeader(header);
		if (header) {
			const key = utils_default.findKey(this, header);
			if (key) {
				const value = this[key];
				if (!parser) return value;
				if (parser === true) return parseTokens(value);
				if (utils_default.isFunction(parser)) return parser.call(this, value, key);
				if (utils_default.isRegExp(parser)) return parser.exec(value);
				throw new TypeError("parser must be boolean|regexp|function");
			}
		}
	}
	has(header, matcher) {
		header = normalizeHeader(header);
		if (header) {
			const key = utils_default.findKey(this, header);
			return !!(key && this[key] !== void 0 && (!matcher || matchHeaderValue(this, this[key], key, matcher)));
		}
		return false;
	}
	delete(header, matcher) {
		const self$1 = this;
		let deleted = false;
		function deleteHeader(_header) {
			_header = normalizeHeader(_header);
			if (_header) {
				const key = utils_default.findKey(self$1, _header);
				if (key && (!matcher || matchHeaderValue(self$1, self$1[key], key, matcher))) {
					delete self$1[key];
					deleted = true;
				}
			}
		}
		if (utils_default.isArray(header)) header.forEach(deleteHeader);
		else deleteHeader(header);
		return deleted;
	}
	clear(matcher) {
		const keys = Object.keys(this);
		let i = keys.length;
		let deleted = false;
		while (i--) {
			const key = keys[i];
			if (!matcher || matchHeaderValue(this, this[key], key, matcher, true)) {
				delete this[key];
				deleted = true;
			}
		}
		return deleted;
	}
	normalize(format) {
		const self$1 = this;
		const headers = {};
		utils_default.forEach(this, (value, header) => {
			const key = utils_default.findKey(headers, header);
			if (key) {
				self$1[key] = normalizeValue(value);
				delete self$1[header];
				return;
			}
			const normalized = format ? formatHeader(header) : String(header).trim();
			if (normalized !== header) delete self$1[header];
			self$1[normalized] = normalizeValue(value);
			headers[normalized] = true;
		});
		return this;
	}
	concat(...targets) {
		return this.constructor.concat(this, ...targets);
	}
	toJSON(asStrings) {
		const obj = Object.create(null);
		utils_default.forEach(this, (value, header) => {
			value != null && value !== false && (obj[header] = asStrings && utils_default.isArray(value) ? value.join(", ") : value);
		});
		return obj;
	}
	[Symbol.iterator]() {
		return Object.entries(this.toJSON())[Symbol.iterator]();
	}
	toString() {
		return Object.entries(this.toJSON()).map(([header, value]) => header + ": " + value).join("\n");
	}
	getSetCookie() {
		return this.get("set-cookie") || [];
	}
	get [Symbol.toStringTag]() {
		return "AxiosHeaders";
	}
	static from(thing) {
		return thing instanceof this ? thing : new this(thing);
	}
	static concat(first, ...targets) {
		const computed = new this(first);
		targets.forEach((target) => computed.set(target));
		return computed;
	}
	static accessor(header) {
		const accessors = (this[$internals] = this[$internals] = { accessors: {} }).accessors;
		const prototype$2 = this.prototype;
		function defineAccessor(_header) {
			const lHeader = normalizeHeader(_header);
			if (!accessors[lHeader]) {
				buildAccessors(prototype$2, _header);
				accessors[lHeader] = true;
			}
		}
		utils_default.isArray(header) ? header.forEach(defineAccessor) : defineAccessor(header);
		return this;
	}
};
AxiosHeaders.accessor([
	"Content-Type",
	"Content-Length",
	"Accept",
	"Accept-Encoding",
	"User-Agent",
	"Authorization"
]);
utils_default.reduceDescriptors(AxiosHeaders.prototype, ({ value }, key) => {
	let mapped = key[0].toUpperCase() + key.slice(1);
	return {
		get: () => value,
		set(headerValue) {
			this[mapped] = headerValue;
		}
	};
});
utils_default.freezeMethods(AxiosHeaders);
var AxiosHeaders_default = AxiosHeaders;
function transformData(fns, response) {
	const config = this || defaults_default;
	const context = response || config;
	const headers = AxiosHeaders_default.from(context.headers);
	let data = context.data;
	utils_default.forEach(fns, function transform(fn) {
		data = fn.call(config, data, headers.normalize(), response ? response.status : void 0);
	});
	headers.normalize();
	return data;
}
function isCancel(value) {
	return !!(value && value.__CANCEL__);
}
function CanceledError(message, config, request) {
	AxiosError_default.call(this, message == null ? "canceled" : message, AxiosError_default.ERR_CANCELED, config, request);
	this.name = "CanceledError";
}
utils_default.inherits(CanceledError, AxiosError_default, { __CANCEL__: true });
var CanceledError_default = CanceledError;
function settle(resolve, reject, response) {
	const validateStatus = response.config.validateStatus;
	if (!response.status || !validateStatus || validateStatus(response.status)) resolve(response);
	else reject(new AxiosError_default("Request failed with status code " + response.status, [AxiosError_default.ERR_BAD_REQUEST, AxiosError_default.ERR_BAD_RESPONSE][Math.floor(response.status / 100) - 4], response.config, response.request, response));
}
function parseProtocol(url) {
	const match = /^([-+\w]{1,25})(:?\/\/|:)/.exec(url);
	return match && match[1] || "";
}
function speedometer(samplesCount, min) {
	samplesCount = samplesCount || 10;
	const bytes = new Array(samplesCount);
	const timestamps = new Array(samplesCount);
	let head = 0;
	let tail = 0;
	let firstSampleTS;
	min = min !== void 0 ? min : 1e3;
	return function push(chunkLength) {
		const now = Date.now();
		const startedAt = timestamps[tail];
		if (!firstSampleTS) firstSampleTS = now;
		bytes[head] = chunkLength;
		timestamps[head] = now;
		let i = tail;
		let bytesCount = 0;
		while (i !== head) {
			bytesCount += bytes[i++];
			i = i % samplesCount;
		}
		head = (head + 1) % samplesCount;
		if (head === tail) tail = (tail + 1) % samplesCount;
		if (now - firstSampleTS < min) return;
		const passed = startedAt && now - startedAt;
		return passed ? Math.round(bytesCount * 1e3 / passed) : void 0;
	};
}
var speedometer_default = speedometer;
function throttle(fn, freq) {
	let timestamp = 0;
	let threshold = 1e3 / freq;
	let lastArgs;
	let timer;
	const invoke = (args, now = Date.now()) => {
		timestamp = now;
		lastArgs = null;
		if (timer) {
			clearTimeout(timer);
			timer = null;
		}
		fn(...args);
	};
	const throttled = (...args) => {
		const now = Date.now();
		const passed = now - timestamp;
		if (passed >= threshold) invoke(args, now);
		else {
			lastArgs = args;
			if (!timer) timer = setTimeout(() => {
				timer = null;
				invoke(lastArgs);
			}, threshold - passed);
		}
	};
	const flush = () => lastArgs && invoke(lastArgs);
	return [throttled, flush];
}
var throttle_default = throttle;
const progressEventReducer = (listener, isDownloadStream, freq = 3) => {
	let bytesNotified = 0;
	const _speedometer = speedometer_default(50, 250);
	return throttle_default((e) => {
		const loaded = e.loaded;
		const total = e.lengthComputable ? e.total : void 0;
		const progressBytes = loaded - bytesNotified;
		const rate = _speedometer(progressBytes);
		const inRange = loaded <= total;
		bytesNotified = loaded;
		const data = {
			loaded,
			total,
			progress: total ? loaded / total : void 0,
			bytes: progressBytes,
			rate: rate ? rate : void 0,
			estimated: rate && total && inRange ? (total - loaded) / rate : void 0,
			event: e,
			lengthComputable: total != null,
			[isDownloadStream ? "download" : "upload"]: true
		};
		listener(data);
	}, freq);
};
const progressEventDecorator = (total, throttled) => {
	const lengthComputable = total != null;
	return [(loaded) => throttled[0]({
		lengthComputable,
		total,
		loaded
	}), throttled[1]];
};
const asyncDecorator = (fn) => (...args) => utils_default.asap(() => fn(...args));
var isURLSameOrigin_default = platform_default.hasStandardBrowserEnv ? ((origin$1, isMSIE) => (url) => {
	url = new URL(url, platform_default.origin);
	return origin$1.protocol === url.protocol && origin$1.host === url.host && (isMSIE || origin$1.port === url.port);
})(new URL(platform_default.origin), platform_default.navigator && /(msie|trident)/i.test(platform_default.navigator.userAgent)) : () => true;
var cookies_default = platform_default.hasStandardBrowserEnv ? {
	write(name, value, expires, path, domain, secure) {
		const cookie = [name + "=" + encodeURIComponent(value)];
		utils_default.isNumber(expires) && cookie.push("expires=" + new Date(expires).toGMTString());
		utils_default.isString(path) && cookie.push("path=" + path);
		utils_default.isString(domain) && cookie.push("domain=" + domain);
		secure === true && cookie.push("secure");
		document.cookie = cookie.join("; ");
	},
	read(name) {
		const match = document.cookie.match(/* @__PURE__ */ new RegExp("(^|;\\s*)(" + name + ")=([^;]*)"));
		return match ? decodeURIComponent(match[3]) : null;
	},
	remove(name) {
		this.write(name, "", Date.now() - 864e5);
	}
} : {
	write() {},
	read() {
		return null;
	},
	remove() {}
};
function isAbsoluteURL(url) {
	return /^([a-z][a-z\d+\-.]*:)?\/\//i.test(url);
}
function combineURLs(baseURL, relativeURL) {
	return relativeURL ? baseURL.replace(/\/?\/$/, "") + "/" + relativeURL.replace(/^\/+/, "") : baseURL;
}
function buildFullPath(baseURL, requestedURL, allowAbsoluteUrls) {
	let isRelativeUrl = !isAbsoluteURL(requestedURL);
	if (baseURL && (isRelativeUrl || allowAbsoluteUrls == false)) return combineURLs(baseURL, requestedURL);
	return requestedURL;
}
var headersToObject = (thing) => thing instanceof AxiosHeaders_default ? { ...thing } : thing;
function mergeConfig(config1, config2) {
	config2 = config2 || {};
	const config = {};
	function getMergedValue(target, source, prop, caseless) {
		if (utils_default.isPlainObject(target) && utils_default.isPlainObject(source)) return utils_default.merge.call({ caseless }, target, source);
		else if (utils_default.isPlainObject(source)) return utils_default.merge({}, source);
		else if (utils_default.isArray(source)) return source.slice();
		return source;
	}
	function mergeDeepProperties(a, b, prop, caseless) {
		if (!utils_default.isUndefined(b)) return getMergedValue(a, b, prop, caseless);
		else if (!utils_default.isUndefined(a)) return getMergedValue(void 0, a, prop, caseless);
	}
	function valueFromConfig2(a, b) {
		if (!utils_default.isUndefined(b)) return getMergedValue(void 0, b);
	}
	function defaultToConfig2(a, b) {
		if (!utils_default.isUndefined(b)) return getMergedValue(void 0, b);
		else if (!utils_default.isUndefined(a)) return getMergedValue(void 0, a);
	}
	function mergeDirectKeys(a, b, prop) {
		if (prop in config2) return getMergedValue(a, b);
		else if (prop in config1) return getMergedValue(void 0, a);
	}
	const mergeMap = {
		url: valueFromConfig2,
		method: valueFromConfig2,
		data: valueFromConfig2,
		baseURL: defaultToConfig2,
		transformRequest: defaultToConfig2,
		transformResponse: defaultToConfig2,
		paramsSerializer: defaultToConfig2,
		timeout: defaultToConfig2,
		timeoutMessage: defaultToConfig2,
		withCredentials: defaultToConfig2,
		withXSRFToken: defaultToConfig2,
		adapter: defaultToConfig2,
		responseType: defaultToConfig2,
		xsrfCookieName: defaultToConfig2,
		xsrfHeaderName: defaultToConfig2,
		onUploadProgress: defaultToConfig2,
		onDownloadProgress: defaultToConfig2,
		decompress: defaultToConfig2,
		maxContentLength: defaultToConfig2,
		maxBodyLength: defaultToConfig2,
		beforeRedirect: defaultToConfig2,
		transport: defaultToConfig2,
		httpAgent: defaultToConfig2,
		httpsAgent: defaultToConfig2,
		cancelToken: defaultToConfig2,
		socketPath: defaultToConfig2,
		responseEncoding: defaultToConfig2,
		validateStatus: mergeDirectKeys,
		headers: (a, b, prop) => mergeDeepProperties(headersToObject(a), headersToObject(b), prop, true)
	};
	utils_default.forEach(Object.keys({
		...config1,
		...config2
	}), function computeConfigValue(prop) {
		const merge$1 = mergeMap[prop] || mergeDeepProperties;
		const configValue = merge$1(config1[prop], config2[prop], prop);
		utils_default.isUndefined(configValue) && merge$1 !== mergeDirectKeys || (config[prop] = configValue);
	});
	return config;
}
var resolveConfig_default = (config) => {
	const newConfig = mergeConfig({}, config);
	let { data, withXSRFToken, xsrfHeaderName, xsrfCookieName, headers, auth } = newConfig;
	newConfig.headers = headers = AxiosHeaders_default.from(headers);
	newConfig.url = buildURL(buildFullPath(newConfig.baseURL, newConfig.url, newConfig.allowAbsoluteUrls), config.params, config.paramsSerializer);
	if (auth) headers.set("Authorization", "Basic " + btoa((auth.username || "") + ":" + (auth.password ? unescape(encodeURIComponent(auth.password)) : "")));
	if (utils_default.isFormData(data)) {
		if (platform_default.hasStandardBrowserEnv || platform_default.hasStandardBrowserWebWorkerEnv) headers.setContentType(void 0);
		else if (utils_default.isFunction(data.getHeaders)) {
			const formHeaders = data.getHeaders();
			const allowedHeaders = ["content-type", "content-length"];
			Object.entries(formHeaders).forEach(([key, val]) => {
				if (allowedHeaders.includes(key.toLowerCase())) headers.set(key, val);
			});
		}
	}
	if (platform_default.hasStandardBrowserEnv) {
		withXSRFToken && utils_default.isFunction(withXSRFToken) && (withXSRFToken = withXSRFToken(newConfig));
		if (withXSRFToken || withXSRFToken !== false && isURLSameOrigin_default(newConfig.url)) {
			const xsrfValue = xsrfHeaderName && xsrfCookieName && cookies_default.read(xsrfCookieName);
			if (xsrfValue) headers.set(xsrfHeaderName, xsrfValue);
		}
	}
	return newConfig;
};
var xhr_default = typeof XMLHttpRequest !== "undefined" && function(config) {
	return new Promise(function dispatchXhrRequest(resolve, reject) {
		const _config = resolveConfig_default(config);
		let requestData = _config.data;
		const requestHeaders = AxiosHeaders_default.from(_config.headers).normalize();
		let { responseType, onUploadProgress, onDownloadProgress } = _config;
		let onCanceled;
		let uploadThrottled, downloadThrottled;
		let flushUpload, flushDownload;
		function done() {
			flushUpload && flushUpload();
			flushDownload && flushDownload();
			_config.cancelToken && _config.cancelToken.unsubscribe(onCanceled);
			_config.signal && _config.signal.removeEventListener("abort", onCanceled);
		}
		let request = new XMLHttpRequest();
		request.open(_config.method.toUpperCase(), _config.url, true);
		request.timeout = _config.timeout;
		function onloadend() {
			if (!request) return;
			const responseHeaders = AxiosHeaders_default.from("getAllResponseHeaders" in request && request.getAllResponseHeaders());
			const response = {
				data: !responseType || responseType === "text" || responseType === "json" ? request.responseText : request.response,
				status: request.status,
				statusText: request.statusText,
				headers: responseHeaders,
				config,
				request
			};
			settle(function _resolve(value) {
				resolve(value);
				done();
			}, function _reject(err) {
				reject(err);
				done();
			}, response);
			request = null;
		}
		if ("onloadend" in request) request.onloadend = onloadend;
		else request.onreadystatechange = function handleLoad() {
			if (!request || request.readyState !== 4) return;
			if (request.status === 0 && !(request.responseURL && request.responseURL.indexOf("file:") === 0)) return;
			setTimeout(onloadend);
		};
		request.onabort = function handleAbort() {
			if (!request) return;
			reject(new AxiosError_default("Request aborted", AxiosError_default.ECONNABORTED, config, request));
			request = null;
		};
		request.onerror = function handleError(event) {
			const msg = event && event.message ? event.message : "Network Error";
			const err = new AxiosError_default(msg, AxiosError_default.ERR_NETWORK, config, request);
			err.event = event || null;
			reject(err);
			request = null;
		};
		request.ontimeout = function handleTimeout() {
			let timeoutErrorMessage = _config.timeout ? "timeout of " + _config.timeout + "ms exceeded" : "timeout exceeded";
			const transitional = _config.transitional || transitional_default;
			if (_config.timeoutErrorMessage) timeoutErrorMessage = _config.timeoutErrorMessage;
			reject(new AxiosError_default(timeoutErrorMessage, transitional.clarifyTimeoutError ? AxiosError_default.ETIMEDOUT : AxiosError_default.ECONNABORTED, config, request));
			request = null;
		};
		requestData === void 0 && requestHeaders.setContentType(null);
		if ("setRequestHeader" in request) utils_default.forEach(requestHeaders.toJSON(), function setRequestHeader(val, key) {
			request.setRequestHeader(key, val);
		});
		if (!utils_default.isUndefined(_config.withCredentials)) request.withCredentials = !!_config.withCredentials;
		if (responseType && responseType !== "json") request.responseType = _config.responseType;
		if (onDownloadProgress) {
			[downloadThrottled, flushDownload] = progressEventReducer(onDownloadProgress, true);
			request.addEventListener("progress", downloadThrottled);
		}
		if (onUploadProgress && request.upload) {
			[uploadThrottled, flushUpload] = progressEventReducer(onUploadProgress);
			request.upload.addEventListener("progress", uploadThrottled);
			request.upload.addEventListener("loadend", flushUpload);
		}
		if (_config.cancelToken || _config.signal) {
			onCanceled = (cancel) => {
				if (!request) return;
				reject(!cancel || cancel.type ? new CanceledError_default(null, config, request) : cancel);
				request.abort();
				request = null;
			};
			_config.cancelToken && _config.cancelToken.subscribe(onCanceled);
			if (_config.signal) _config.signal.aborted ? onCanceled() : _config.signal.addEventListener("abort", onCanceled);
		}
		const protocol = parseProtocol(_config.url);
		if (protocol && platform_default.protocols.indexOf(protocol) === -1) {
			reject(new AxiosError_default("Unsupported protocol " + protocol + ":", AxiosError_default.ERR_BAD_REQUEST, config));
			return;
		}
		request.send(requestData || null);
	});
};
var composeSignals = (signals, timeout) => {
	const { length } = signals = signals ? signals.filter(Boolean) : [];
	if (timeout || length) {
		let controller = new AbortController();
		let aborted;
		const onabort = function(reason) {
			if (!aborted) {
				aborted = true;
				unsubscribe();
				const err = reason instanceof Error ? reason : this.reason;
				controller.abort(err instanceof AxiosError_default ? err : new CanceledError_default(err instanceof Error ? err.message : err));
			}
		};
		let timer = timeout && setTimeout(() => {
			timer = null;
			onabort(new AxiosError_default(`timeout ${timeout} of ms exceeded`, AxiosError_default.ETIMEDOUT));
		}, timeout);
		const unsubscribe = () => {
			if (signals) {
				timer && clearTimeout(timer);
				timer = null;
				signals.forEach((signal$1) => {
					signal$1.unsubscribe ? signal$1.unsubscribe(onabort) : signal$1.removeEventListener("abort", onabort);
				});
				signals = null;
			}
		};
		signals.forEach((signal$1) => signal$1.addEventListener("abort", onabort));
		const { signal } = controller;
		signal.unsubscribe = () => utils_default.asap(unsubscribe);
		return signal;
	}
};
var composeSignals_default = composeSignals;
const streamChunk = function* (chunk, chunkSize) {
	let len = chunk.byteLength;
	if (!chunkSize || len < chunkSize) {
		yield chunk;
		return;
	}
	let pos = 0;
	let end;
	while (pos < len) {
		end = pos + chunkSize;
		yield chunk.slice(pos, end);
		pos = end;
	}
};
const readBytes = async function* (iterable, chunkSize) {
	for await (const chunk of readStream(iterable)) yield* streamChunk(chunk, chunkSize);
};
var readStream = async function* (stream) {
	if (stream[Symbol.asyncIterator]) {
		yield* stream;
		return;
	}
	const reader = stream.getReader();
	try {
		for (;;) {
			const { done, value } = await reader.read();
			if (done) break;
			yield value;
		}
	} finally {
		await reader.cancel();
	}
};
const trackStream = (stream, chunkSize, onProgress, onFinish) => {
	const iterator$1 = readBytes(stream, chunkSize);
	let bytes = 0;
	let done;
	let _onFinish = (e) => {
		if (!done) {
			done = true;
			onFinish && onFinish(e);
		}
	};
	return new ReadableStream({
		async pull(controller) {
			try {
				const { done: done$1, value } = await iterator$1.next();
				if (done$1) {
					_onFinish();
					controller.close();
					return;
				}
				let len = value.byteLength;
				if (onProgress) {
					let loadedBytes = bytes += len;
					onProgress(loadedBytes);
				}
				controller.enqueue(new Uint8Array(value));
			} catch (err) {
				_onFinish(err);
				throw err;
			}
		},
		cancel(reason) {
			_onFinish(reason);
			return iterator$1.return();
		}
	}, { highWaterMark: 2 });
};
var DEFAULT_CHUNK_SIZE = 64 * 1024;
var { isFunction } = utils_default;
var globalFetchAPI = (({ Request, Response }) => ({
	Request,
	Response
}))(utils_default.global);
var { ReadableStream: ReadableStream$1, TextEncoder } = utils_default.global;
var test = (fn, ...args) => {
	try {
		return !!fn(...args);
	} catch (e) {
		return false;
	}
};
var factory = (env) => {
	env = utils_default.merge.call({ skipUndefined: true }, globalFetchAPI, env);
	const { fetch: envFetch, Request, Response } = env;
	const isFetchSupported = envFetch ? isFunction(envFetch) : typeof fetch === "function";
	const isRequestSupported = isFunction(Request);
	const isResponseSupported = isFunction(Response);
	if (!isFetchSupported) return false;
	const isReadableStreamSupported = isFetchSupported && isFunction(ReadableStream$1);
	const encodeText = isFetchSupported && (typeof TextEncoder === "function" ? ((encoder) => (str) => encoder.encode(str))(new TextEncoder()) : async (str) => new Uint8Array(await new Request(str).arrayBuffer()));
	const supportsRequestStream = isRequestSupported && isReadableStreamSupported && test(() => {
		let duplexAccessed = false;
		const hasContentType = new Request(platform_default.origin, {
			body: new ReadableStream$1(),
			method: "POST",
			get duplex() {
				duplexAccessed = true;
				return "half";
			}
		}).headers.has("Content-Type");
		return duplexAccessed && !hasContentType;
	});
	const supportsResponseStream = isResponseSupported && isReadableStreamSupported && test(() => utils_default.isReadableStream(new Response("").body));
	const resolvers = { stream: supportsResponseStream && ((res) => res.body) };
	isFetchSupported && [
		"text",
		"arrayBuffer",
		"blob",
		"formData",
		"stream"
	].forEach((type) => {
		!resolvers[type] && (resolvers[type] = (res, config) => {
			let method = res && res[type];
			if (method) return method.call(res);
			throw new AxiosError_default(`Response type '${type}' is not supported`, AxiosError_default.ERR_NOT_SUPPORT, config);
		});
	});
	const getBodyLength = async (body) => {
		if (body == null) return 0;
		if (utils_default.isBlob(body)) return body.size;
		if (utils_default.isSpecCompliantForm(body)) return (await new Request(platform_default.origin, {
			method: "POST",
			body
		}).arrayBuffer()).byteLength;
		if (utils_default.isArrayBufferView(body) || utils_default.isArrayBuffer(body)) return body.byteLength;
		if (utils_default.isURLSearchParams(body)) body = body + "";
		if (utils_default.isString(body)) return (await encodeText(body)).byteLength;
	};
	const resolveBodyLength = async (headers, body) => {
		const length = utils_default.toFiniteNumber(headers.getContentLength());
		return length == null ? getBodyLength(body) : length;
	};
	return async (config) => {
		let { url, method, data, signal, cancelToken, timeout, onDownloadProgress, onUploadProgress, responseType, headers, withCredentials = "same-origin", fetchOptions } = resolveConfig_default(config);
		let _fetch = envFetch || fetch;
		responseType = responseType ? (responseType + "").toLowerCase() : "text";
		let composedSignal = composeSignals_default([signal, cancelToken && cancelToken.toAbortSignal()], timeout);
		let request = null;
		const unsubscribe = composedSignal && composedSignal.unsubscribe && (() => {
			composedSignal.unsubscribe();
		});
		let requestContentLength;
		try {
			if (onUploadProgress && supportsRequestStream && method !== "get" && method !== "head" && (requestContentLength = await resolveBodyLength(headers, data)) !== 0) {
				let _request = new Request(url, {
					method: "POST",
					body: data,
					duplex: "half"
				});
				let contentTypeHeader;
				if (utils_default.isFormData(data) && (contentTypeHeader = _request.headers.get("content-type"))) headers.setContentType(contentTypeHeader);
				if (_request.body) {
					const [onProgress, flush] = progressEventDecorator(requestContentLength, progressEventReducer(asyncDecorator(onUploadProgress)));
					data = trackStream(_request.body, DEFAULT_CHUNK_SIZE, onProgress, flush);
				}
			}
			if (!utils_default.isString(withCredentials)) withCredentials = withCredentials ? "include" : "omit";
			const isCredentialsSupported = isRequestSupported && "credentials" in Request.prototype;
			const resolvedOptions = {
				...fetchOptions,
				signal: composedSignal,
				method: method.toUpperCase(),
				headers: headers.normalize().toJSON(),
				body: data,
				duplex: "half",
				credentials: isCredentialsSupported ? withCredentials : void 0
			};
			request = isRequestSupported && new Request(url, resolvedOptions);
			let response = await (isRequestSupported ? _fetch(request, fetchOptions) : _fetch(url, resolvedOptions));
			const isStreamResponse = supportsResponseStream && (responseType === "stream" || responseType === "response");
			if (supportsResponseStream && (onDownloadProgress || isStreamResponse && unsubscribe)) {
				const options = {};
				[
					"status",
					"statusText",
					"headers"
				].forEach((prop) => {
					options[prop] = response[prop];
				});
				const responseContentLength = utils_default.toFiniteNumber(response.headers.get("content-length"));
				const [onProgress, flush] = onDownloadProgress && progressEventDecorator(responseContentLength, progressEventReducer(asyncDecorator(onDownloadProgress), true)) || [];
				response = new Response(trackStream(response.body, DEFAULT_CHUNK_SIZE, onProgress, () => {
					flush && flush();
					unsubscribe && unsubscribe();
				}), options);
			}
			responseType = responseType || "text";
			let responseData = await resolvers[utils_default.findKey(resolvers, responseType) || "text"](response, config);
			!isStreamResponse && unsubscribe && unsubscribe();
			return await new Promise((resolve, reject) => {
				settle(resolve, reject, {
					data: responseData,
					headers: AxiosHeaders_default.from(response.headers),
					status: response.status,
					statusText: response.statusText,
					config,
					request
				});
			});
		} catch (err) {
			unsubscribe && unsubscribe();
			if (err && err.name === "TypeError" && /Load failed|fetch/i.test(err.message)) throw Object.assign(new AxiosError_default("Network Error", AxiosError_default.ERR_NETWORK, config, request), { cause: err.cause || err });
			throw AxiosError_default.from(err, err && err.code, config, request);
		}
	};
};
var seedCache = /* @__PURE__ */ new Map();
const getFetch = (config) => {
	let env = config ? config.env : {};
	const { fetch: fetch$1, Request, Response } = env;
	const seeds = [
		Request,
		Response,
		fetch$1
	];
	let len = seeds.length, i = len, seed, target, map = seedCache;
	while (i--) {
		seed = seeds[i];
		target = map.get(seed);
		target === void 0 && map.set(seed, target = i ? /* @__PURE__ */ new Map() : factory(env));
		map = target;
	}
	return target;
};
getFetch();
var knownAdapters = {
	http: null,
	xhr: xhr_default,
	fetch: { get: getFetch }
};
utils_default.forEach(knownAdapters, (fn, value) => {
	if (fn) {
		try {
			Object.defineProperty(fn, "name", { value });
		} catch (e) {}
		Object.defineProperty(fn, "adapterName", { value });
	}
});
var renderReason = (reason) => `- ${reason}`;
var isResolvedHandle = (adapter$1) => utils_default.isFunction(adapter$1) || adapter$1 === null || adapter$1 === false;
var adapters_default = {
	getAdapter: (adapters, config) => {
		adapters = utils_default.isArray(adapters) ? adapters : [adapters];
		const { length } = adapters;
		let nameOrAdapter;
		let adapter$1;
		const rejectedReasons = {};
		for (let i = 0; i < length; i++) {
			nameOrAdapter = adapters[i];
			let id;
			adapter$1 = nameOrAdapter;
			if (!isResolvedHandle(nameOrAdapter)) {
				adapter$1 = knownAdapters[(id = String(nameOrAdapter)).toLowerCase()];
				if (adapter$1 === void 0) throw new AxiosError_default(`Unknown adapter '${id}'`);
			}
			if (adapter$1 && (utils_default.isFunction(adapter$1) || (adapter$1 = adapter$1.get(config)))) break;
			rejectedReasons[id || "#" + i] = adapter$1;
		}
		if (!adapter$1) {
			const reasons = Object.entries(rejectedReasons).map(([id, state]) => `adapter ${id} ` + (state === false ? "is not supported by the environment" : "is not available in the build"));
			let s = length ? reasons.length > 1 ? "since :\n" + reasons.map(renderReason).join("\n") : " " + renderReason(reasons[0]) : "as no adapter specified";
			throw new AxiosError_default(`There is no suitable adapter to dispatch the request ` + s, "ERR_NOT_SUPPORT");
		}
		return adapter$1;
	},
	adapters: knownAdapters
};
function throwIfCancellationRequested(config) {
	if (config.cancelToken) config.cancelToken.throwIfRequested();
	if (config.signal && config.signal.aborted) throw new CanceledError_default(null, config);
}
function dispatchRequest(config) {
	throwIfCancellationRequested(config);
	config.headers = AxiosHeaders_default.from(config.headers);
	config.data = transformData.call(config, config.transformRequest);
	if ([
		"post",
		"put",
		"patch"
	].indexOf(config.method) !== -1) config.headers.setContentType("application/x-www-form-urlencoded", false);
	return adapters_default.getAdapter(config.adapter || defaults_default.adapter, config)(config).then(function onAdapterResolution(response) {
		throwIfCancellationRequested(config);
		response.data = transformData.call(config, config.transformResponse, response);
		response.headers = AxiosHeaders_default.from(response.headers);
		return response;
	}, function onAdapterRejection(reason) {
		if (!isCancel(reason)) {
			throwIfCancellationRequested(config);
			if (reason && reason.response) {
				reason.response.data = transformData.call(config, config.transformResponse, reason.response);
				reason.response.headers = AxiosHeaders_default.from(reason.response.headers);
			}
		}
		return Promise.reject(reason);
	});
}
const VERSION$1 = "1.12.2";
var validators$1 = {};
[
	"object",
	"boolean",
	"number",
	"function",
	"string",
	"symbol"
].forEach((type, i) => {
	validators$1[type] = function validator(thing) {
		return typeof thing === type || "a" + (i < 1 ? "n " : " ") + type;
	};
});
var deprecatedWarnings = {};
validators$1.transitional = function transitional(validator, version$2, message) {
	function formatMessage(opt, desc) {
		return "[Axios v" + VERSION$1 + "] Transitional option '" + opt + "'" + desc + (message ? ". " + message : "");
	}
	return (value, opt, opts) => {
		if (validator === false) throw new AxiosError_default(formatMessage(opt, " has been removed" + (version$2 ? " in " + version$2 : "")), AxiosError_default.ERR_DEPRECATED);
		if (version$2 && !deprecatedWarnings[opt]) {
			deprecatedWarnings[opt] = true;
			console.warn(formatMessage(opt, " has been deprecated since v" + version$2 + " and will be removed in the near future"));
		}
		return validator ? validator(value, opt, opts) : true;
	};
};
validators$1.spelling = function spelling(correctSpelling) {
	return (value, opt) => {
		console.warn(`${opt} is likely a misspelling of ${correctSpelling}`);
		return true;
	};
};
function assertOptions(options, schema, allowUnknown) {
	if (typeof options !== "object") throw new AxiosError_default("options must be an object", AxiosError_default.ERR_BAD_OPTION_VALUE);
	const keys = Object.keys(options);
	let i = keys.length;
	while (i-- > 0) {
		const opt = keys[i];
		const validator = schema[opt];
		if (validator) {
			const value = options[opt];
			const result = value === void 0 || validator(value, opt, options);
			if (result !== true) throw new AxiosError_default("option " + opt + " must be " + result, AxiosError_default.ERR_BAD_OPTION_VALUE);
			continue;
		}
		if (allowUnknown !== true) throw new AxiosError_default("Unknown option " + opt, AxiosError_default.ERR_BAD_OPTION);
	}
}
var validator_default = {
	assertOptions,
	validators: validators$1
};
var validators = validator_default.validators;
var Axios = class {
	constructor(instanceConfig) {
		this.defaults = instanceConfig || {};
		this.interceptors = {
			request: new InterceptorManager_default(),
			response: new InterceptorManager_default()
		};
	}
	async request(configOrUrl, config) {
		try {
			return await this._request(configOrUrl, config);
		} catch (err) {
			if (err instanceof Error) {
				let dummy = {};
				Error.captureStackTrace ? Error.captureStackTrace(dummy) : dummy = /* @__PURE__ */ new Error();
				const stack = dummy.stack ? dummy.stack.replace(/^.+\n/, "") : "";
				try {
					if (!err.stack) err.stack = stack;
					else if (stack && !String(err.stack).endsWith(stack.replace(/^.+\n.+\n/, ""))) err.stack += "\n" + stack;
				} catch (e) {}
			}
			throw err;
		}
	}
	_request(configOrUrl, config) {
		if (typeof configOrUrl === "string") {
			config = config || {};
			config.url = configOrUrl;
		} else config = configOrUrl || {};
		config = mergeConfig(this.defaults, config);
		const { transitional, paramsSerializer, headers } = config;
		if (transitional !== void 0) validator_default.assertOptions(transitional, {
			silentJSONParsing: validators.transitional(validators.boolean),
			forcedJSONParsing: validators.transitional(validators.boolean),
			clarifyTimeoutError: validators.transitional(validators.boolean)
		}, false);
		if (paramsSerializer != null) if (utils_default.isFunction(paramsSerializer)) config.paramsSerializer = { serialize: paramsSerializer };
		else validator_default.assertOptions(paramsSerializer, {
			encode: validators.function,
			serialize: validators.function
		}, true);
		if (config.allowAbsoluteUrls !== void 0) {} else if (this.defaults.allowAbsoluteUrls !== void 0) config.allowAbsoluteUrls = this.defaults.allowAbsoluteUrls;
		else config.allowAbsoluteUrls = true;
		validator_default.assertOptions(config, {
			baseUrl: validators.spelling("baseURL"),
			withXsrfToken: validators.spelling("withXSRFToken")
		}, true);
		config.method = (config.method || this.defaults.method || "get").toLowerCase();
		let contextHeaders = headers && utils_default.merge(headers.common, headers[config.method]);
		headers && utils_default.forEach([
			"delete",
			"get",
			"head",
			"post",
			"put",
			"patch",
			"common"
		], (method) => {
			delete headers[method];
		});
		config.headers = AxiosHeaders_default.concat(contextHeaders, headers);
		const requestInterceptorChain = [];
		let synchronousRequestInterceptors = true;
		this.interceptors.request.forEach(function unshiftRequestInterceptors(interceptor) {
			if (typeof interceptor.runWhen === "function" && interceptor.runWhen(config) === false) return;
			synchronousRequestInterceptors = synchronousRequestInterceptors && interceptor.synchronous;
			requestInterceptorChain.unshift(interceptor.fulfilled, interceptor.rejected);
		});
		const responseInterceptorChain = [];
		this.interceptors.response.forEach(function pushResponseInterceptors(interceptor) {
			responseInterceptorChain.push(interceptor.fulfilled, interceptor.rejected);
		});
		let promise;
		let i = 0;
		let len;
		if (!synchronousRequestInterceptors) {
			const chain = [dispatchRequest.bind(this), void 0];
			chain.unshift(...requestInterceptorChain);
			chain.push(...responseInterceptorChain);
			len = chain.length;
			promise = Promise.resolve(config);
			while (i < len) promise = promise.then(chain[i++], chain[i++]);
			return promise;
		}
		len = requestInterceptorChain.length;
		let newConfig = config;
		while (i < len) {
			const onFulfilled = requestInterceptorChain[i++];
			const onRejected = requestInterceptorChain[i++];
			try {
				newConfig = onFulfilled(newConfig);
			} catch (error) {
				onRejected.call(this, error);
				break;
			}
		}
		try {
			promise = dispatchRequest.call(this, newConfig);
		} catch (error) {
			return Promise.reject(error);
		}
		i = 0;
		len = responseInterceptorChain.length;
		while (i < len) promise = promise.then(responseInterceptorChain[i++], responseInterceptorChain[i++]);
		return promise;
	}
	getUri(config) {
		config = mergeConfig(this.defaults, config);
		const fullPath = buildFullPath(config.baseURL, config.url, config.allowAbsoluteUrls);
		return buildURL(fullPath, config.params, config.paramsSerializer);
	}
};
utils_default.forEach([
	"delete",
	"get",
	"head",
	"options"
], function forEachMethodNoData(method) {
	Axios.prototype[method] = function(url, config) {
		return this.request(mergeConfig(config || {}, {
			method,
			url,
			data: (config || {}).data
		}));
	};
});
utils_default.forEach([
	"post",
	"put",
	"patch"
], function forEachMethodWithData(method) {
	function generateHTTPMethod(isForm) {
		return function httpMethod(url, data, config) {
			return this.request(mergeConfig(config || {}, {
				method,
				headers: isForm ? { "Content-Type": "multipart/form-data" } : {},
				url,
				data
			}));
		};
	}
	Axios.prototype[method] = generateHTTPMethod();
	Axios.prototype[method + "Form"] = generateHTTPMethod(true);
});
var Axios_default = Axios;
var CancelToken_default = class CancelToken {
	constructor(executor) {
		if (typeof executor !== "function") throw new TypeError("executor must be a function.");
		let resolvePromise;
		this.promise = new Promise(function promiseExecutor(resolve) {
			resolvePromise = resolve;
		});
		const token = this;
		this.promise.then((cancel) => {
			if (!token._listeners) return;
			let i = token._listeners.length;
			while (i-- > 0) token._listeners[i](cancel);
			token._listeners = null;
		});
		this.promise.then = (onfulfilled) => {
			let _resolve;
			const promise = new Promise((resolve) => {
				token.subscribe(resolve);
				_resolve = resolve;
			}).then(onfulfilled);
			promise.cancel = function reject() {
				token.unsubscribe(_resolve);
			};
			return promise;
		};
		executor(function cancel(message, config, request) {
			if (token.reason) return;
			token.reason = new CanceledError_default(message, config, request);
			resolvePromise(token.reason);
		});
	}
	throwIfRequested() {
		if (this.reason) throw this.reason;
	}
	subscribe(listener) {
		if (this.reason) {
			listener(this.reason);
			return;
		}
		if (this._listeners) this._listeners.push(listener);
		else this._listeners = [listener];
	}
	unsubscribe(listener) {
		if (!this._listeners) return;
		const index = this._listeners.indexOf(listener);
		if (index !== -1) this._listeners.splice(index, 1);
	}
	toAbortSignal() {
		const controller = new AbortController();
		const abort = (err) => {
			controller.abort(err);
		};
		this.subscribe(abort);
		controller.signal.unsubscribe = () => this.unsubscribe(abort);
		return controller.signal;
	}
	static source() {
		let cancel;
		return {
			token: new CancelToken(function executor(c) {
				cancel = c;
			}),
			cancel
		};
	}
};
function spread(callback) {
	return function wrap(arr) {
		return callback.apply(null, arr);
	};
}
function isAxiosError(payload) {
	return utils_default.isObject(payload) && payload.isAxiosError === true;
}
var HttpStatusCode = {
	Continue: 100,
	SwitchingProtocols: 101,
	Processing: 102,
	EarlyHints: 103,
	Ok: 200,
	Created: 201,
	Accepted: 202,
	NonAuthoritativeInformation: 203,
	NoContent: 204,
	ResetContent: 205,
	PartialContent: 206,
	MultiStatus: 207,
	AlreadyReported: 208,
	ImUsed: 226,
	MultipleChoices: 300,
	MovedPermanently: 301,
	Found: 302,
	SeeOther: 303,
	NotModified: 304,
	UseProxy: 305,
	Unused: 306,
	TemporaryRedirect: 307,
	PermanentRedirect: 308,
	BadRequest: 400,
	Unauthorized: 401,
	PaymentRequired: 402,
	Forbidden: 403,
	NotFound: 404,
	MethodNotAllowed: 405,
	NotAcceptable: 406,
	ProxyAuthenticationRequired: 407,
	RequestTimeout: 408,
	Conflict: 409,
	Gone: 410,
	LengthRequired: 411,
	PreconditionFailed: 412,
	PayloadTooLarge: 413,
	UriTooLong: 414,
	UnsupportedMediaType: 415,
	RangeNotSatisfiable: 416,
	ExpectationFailed: 417,
	ImATeapot: 418,
	MisdirectedRequest: 421,
	UnprocessableEntity: 422,
	Locked: 423,
	FailedDependency: 424,
	TooEarly: 425,
	UpgradeRequired: 426,
	PreconditionRequired: 428,
	TooManyRequests: 429,
	RequestHeaderFieldsTooLarge: 431,
	UnavailableForLegalReasons: 451,
	InternalServerError: 500,
	NotImplemented: 501,
	BadGateway: 502,
	ServiceUnavailable: 503,
	GatewayTimeout: 504,
	HttpVersionNotSupported: 505,
	VariantAlsoNegotiates: 506,
	InsufficientStorage: 507,
	LoopDetected: 508,
	NotExtended: 510,
	NetworkAuthenticationRequired: 511
};
Object.entries(HttpStatusCode).forEach(([key, value]) => {
	HttpStatusCode[value] = key;
});
var HttpStatusCode_default = HttpStatusCode;
function createInstance(defaultConfig) {
	const context = new Axios_default(defaultConfig);
	const instance = bind(Axios_default.prototype.request, context);
	utils_default.extend(instance, Axios_default.prototype, context, { allOwnKeys: true });
	utils_default.extend(instance, context, null, { allOwnKeys: true });
	instance.create = function create(instanceConfig) {
		return createInstance(mergeConfig(defaultConfig, instanceConfig));
	};
	return instance;
}
var axios = createInstance(defaults_default);
axios.Axios = Axios_default;
axios.CanceledError = CanceledError_default;
axios.CancelToken = CancelToken_default;
axios.isCancel = isCancel;
axios.VERSION = VERSION$1;
axios.toFormData = toFormData_default;
axios.AxiosError = AxiosError_default;
axios.Cancel = axios.CanceledError;
axios.all = function all(promises) {
	return Promise.all(promises);
};
axios.spread = spread;
axios.isAxiosError = isAxiosError;
axios.mergeConfig = mergeConfig;
axios.AxiosHeaders = AxiosHeaders_default;
axios.formToJSON = (thing) => formDataToJSON_default(utils_default.isHTMLForm(thing) ? new FormData(thing) : thing);
axios.getAdapter = adapters_default.getAdapter;
axios.HttpStatusCode = HttpStatusCode_default;
axios.default = axios;
var axios_default = axios;
var Network;
(function(Network$1) {
	Network$1["ETH_MAINNET"] = "eth-mainnet";
	Network$1["ETH_GOERLI"] = "eth-goerli";
	Network$1["ETH_SEPOLIA"] = "eth-sepolia";
	Network$1["ETH_HOLESKY"] = "eth-holesky";
	Network$1["ETH_HOODI"] = "eth-hoodi";
	Network$1["OPT_MAINNET"] = "opt-mainnet";
	Network$1["OPT_GOERLI"] = "opt-goerli";
	Network$1["OPT_SEPOLIA"] = "opt-sepolia";
	Network$1["ARB_MAINNET"] = "arb-mainnet";
	Network$1["ARB_GOERLI"] = "arb-goerli";
	Network$1["ARB_SEPOLIA"] = "arb-sepolia";
	Network$1["MATIC_MAINNET"] = "polygon-mainnet";
	Network$1["MATIC_MUMBAI"] = "polygon-mumbai";
	Network$1["MATIC_AMOY"] = "polygon-amoy";
	Network$1["ASTAR_MAINNET"] = "astar-mainnet";
	Network$1["POLYGONZKEVM_MAINNET"] = "polygonzkevm-mainnet";
	Network$1["POLYGONZKEVM_TESTNET"] = "polygonzkevm-testnet";
	Network$1["POLYGONZKEVM_CARDONA"] = "polygonzkevm-cardona";
	Network$1["BASE_MAINNET"] = "base-mainnet";
	Network$1["BASE_GOERLI"] = "base-goerli";
	Network$1["BASE_SEPOLIA"] = "base-sepolia";
	Network$1["ZKSYNC_MAINNET"] = "zksync-mainnet";
	Network$1["ZKSYNC_SEPOLIA"] = "zksync-sepolia";
	Network$1["SHAPE_MAINNET"] = "shape-mainnet";
	Network$1["SHAPE_SEPOLIA"] = "shape-sepolia";
	Network$1["LINEA_MAINNET"] = "linea-mainnet";
	Network$1["LINEA_SEPOLIA"] = "linea-sepolia";
	Network$1["FANTOM_MAINNET"] = "fantom-mainnet";
	Network$1["FANTOM_TESTNET"] = "fantom-testnet";
	Network$1["ZETACHAIN_MAINNET"] = "zetachain-mainnet";
	Network$1["ZETACHAIN_TESTNET"] = "zetachain-testnet";
	Network$1["ARBNOVA_MAINNET"] = "arbnova-mainnet";
	Network$1["BLAST_MAINNET"] = "blast-mainnet";
	Network$1["BLAST_SEPOLIA"] = "blast-sepolia";
	Network$1["MANTLE_MAINNET"] = "mantle-mainnet";
	Network$1["MANTLE_SEPOLIA"] = "mantle-sepolia";
	Network$1["SCROLL_MAINNET"] = "scroll-mainnet";
	Network$1["SCROLL_SEPOLIA"] = "scroll-sepolia";
	Network$1["GNOSIS_MAINNET"] = "gnosis-mainnet";
	Network$1["GNOSIS_CHIADO"] = "gnosis-chiado";
	Network$1["BNB_MAINNET"] = "bnb-mainnet";
	Network$1["BNB_TESTNET"] = "bnb-testnet";
	Network$1["AVAX_MAINNET"] = "avax-mainnet";
	Network$1["AVAX_FUJI"] = "avax-fuji";
	Network$1["CELO_MAINNET"] = "celo-mainnet";
	Network$1["CELO_ALFAJORES"] = "celo-alfajores";
	Network$1["CELO_BAKLAVA"] = "celo-baklava";
	Network$1["METIS_MAINNET"] = "metis-mainnet";
	Network$1["OPBNB_MAINNET"] = "opbnb-mainnet";
	Network$1["OPBNB_TESTNET"] = "opbnb-testnet";
	Network$1["BERACHAIN_BARTIO"] = "berachain-bartio";
	Network$1["BERACHAIN_MAINNET"] = "berachain-mainnet";
	Network$1["BERACHAIN_BEPOLIA"] = "berachain-bepolia";
	Network$1["SONEIUM_MAINNET"] = "soneium-mainnet";
	Network$1["SONEIUM_MINATO"] = "soneium-minato";
	Network$1["WORLDCHAIN_MAINNET"] = "worldchain-mainnet";
	Network$1["WORLDCHAIN_SEPOLIA"] = "worldchain-sepolia";
	Network$1["ROOTSTOCK_MAINNET"] = "rootstock-mainnet";
	Network$1["ROOTSTOCK_TESTNET"] = "rootstock-testnet";
	Network$1["FLOW_MAINNET"] = "flow-mainnet";
	Network$1["FLOW_TESTNET"] = "flow-testnet";
	Network$1["ZORA_MAINNET"] = "zora-mainnet";
	Network$1["ZORA_SEPOLIA"] = "zora-sepolia";
	Network$1["FRAX_MAINNET"] = "frax-mainnet";
	Network$1["FRAX_SEPOLIA"] = "frax-sepolia";
	Network$1["POLYNOMIAL_MAINNET"] = "polynomial-mainnet";
	Network$1["POLYNOMIAL_SEPOLIA"] = "polynomial-sepolia";
	Network$1["CROSSFI_MAINNET"] = "crossfi-mainnet";
	Network$1["CROSSFI_TESTNET"] = "crossfi-testnet";
	Network$1["APECHAIN_MAINNET"] = "apechain-mainnet";
	Network$1["APECHAIN_CURTIS"] = "apechain-curtis";
	Network$1["LENS_MAINNET"] = "lens-mainnet";
	Network$1["LENS_SEPOLIA"] = "lens-sepolia";
	Network$1["GEIST_MAINNET"] = "geist-mainnet";
	Network$1["GEIST_POLTER"] = "geist-polter";
	Network$1["LUMIA_PRISM"] = "lumia-prism";
	Network$1["LUMIA_TESTNET"] = "lumia-testnet";
	Network$1["UNICHAIN_MAINNET"] = "unichain-mainnet";
	Network$1["UNICHAIN_SEPOLIA"] = "unichain-sepolia";
	Network$1["SONIC_MAINNET"] = "sonic-mainnet";
	Network$1["SONIC_BLAZE"] = "sonic-blaze";
	Network$1["XMTP_TESTNET"] = "xmtp-testnet";
	Network$1["ABSTRACT_MAINNET"] = "abstract-mainnet";
	Network$1["ABSTRACT_TESTNET"] = "abstract-testnet";
	Network$1["DEGEN_MAINNET"] = "degen-mainnet";
	Network$1["INK_MAINNET"] = "ink-mainnet";
	Network$1["INK_SEPOLIA"] = "ink-sepolia";
	Network$1["SEI_MAINNET"] = "sei-mainnet";
	Network$1["SEI_TESTNET"] = "sei-testnet";
	Network$1["RONIN_MAINNET"] = "ronin-mainnet";
	Network$1["RONIN_SAIGON"] = "ronin-saigon";
	Network$1["MONAD_TESTNET"] = "monad-testnet";
	Network$1["SETTLUS_SEPTESTNET"] = "settlus-septestnet";
	Network$1["SETTLUS_MAINNET"] = "settlus-mainnet";
	Network$1["SOLANA_MAINNET"] = "solana-mainnet";
	Network$1["SOLANA_DEVNET"] = "solana-devnet";
	Network$1["GENSYN_TESTNET"] = "gensyn-testnet";
	Network$1["SUPERSEED_MAINNET"] = "superseed-mainnet";
	Network$1["SUPERSEED_SEPOLIA"] = "superseed-sepolia";
	Network$1["TEA_SEPOLIA"] = "tea-sepolia";
	Network$1["ANIME_MAINNET"] = "anime-mainnet";
	Network$1["ANIME_SEPOLIA"] = "anime-sepolia";
	Network$1["STORY_MAINNET"] = "story-mainnet";
	Network$1["STORY_AENEID"] = "story-aeneid";
	Network$1["MEGAETH_TESTNET"] = "megaeth-testnet";
	Network$1["BOTANIX_MAINNET"] = "botanix-mainnet";
	Network$1["BOTANIX_TESTNET"] = "botanix-testnet";
	Network$1["HUMANITY_MAINNET"] = "humanity-mainnet";
	Network$1["RISE_TESTNET"] = "rise-testnet";
	Network$1["HYPERLIQUID_MAINNET"] = "hyperliquid-mainnet";
})(Network || (Network = {}));
var TokenBalanceType;
(function(TokenBalanceType$1) {
	TokenBalanceType$1["DEFAULT_TOKENS"] = "DEFAULT_TOKENS";
	TokenBalanceType$1["ERC20"] = "erc20";
})(TokenBalanceType || (TokenBalanceType = {}));
var AssetTransfersCategory;
(function(AssetTransfersCategory$1) {
	AssetTransfersCategory$1["EXTERNAL"] = "external";
	AssetTransfersCategory$1["INTERNAL"] = "internal";
	AssetTransfersCategory$1["ERC20"] = "erc20";
	AssetTransfersCategory$1["ERC721"] = "erc721";
	AssetTransfersCategory$1["ERC1155"] = "erc1155";
	AssetTransfersCategory$1["SPECIALNFT"] = "specialnft";
})(AssetTransfersCategory || (AssetTransfersCategory = {}));
var GetTransfersForOwnerTransferType;
(function(GetTransfersForOwnerTransferType$1) {
	GetTransfersForOwnerTransferType$1["TO"] = "TO";
	GetTransfersForOwnerTransferType$1["FROM"] = "FROM";
})(GetTransfersForOwnerTransferType || (GetTransfersForOwnerTransferType = {}));
var SortingOrder;
(function(SortingOrder$1) {
	SortingOrder$1["ASCENDING"] = "asc";
	SortingOrder$1["DESCENDING"] = "desc";
})(SortingOrder || (SortingOrder = {}));
var OpenSeaSafelistRequestStatus;
(function(OpenSeaSafelistRequestStatus$1) {
	OpenSeaSafelistRequestStatus$1["VERIFIED"] = "verified";
	OpenSeaSafelistRequestStatus$1["APPROVED"] = "approved";
	OpenSeaSafelistRequestStatus$1["REQUESTED"] = "requested";
	OpenSeaSafelistRequestStatus$1["NOT_REQUESTED"] = "not_requested";
})(OpenSeaSafelistRequestStatus || (OpenSeaSafelistRequestStatus = {}));
var AlchemySubscription;
(function(AlchemySubscription$1) {
	AlchemySubscription$1["PENDING_TRANSACTIONS"] = "alchemy_pendingTransactions";
	AlchemySubscription$1["MINED_TRANSACTIONS"] = "alchemy_minedTransactions";
})(AlchemySubscription || (AlchemySubscription = {}));
var SimulateAssetType;
(function(SimulateAssetType$1) {
	SimulateAssetType$1["NATIVE"] = "NATIVE";
	SimulateAssetType$1["ERC20"] = "ERC20";
	SimulateAssetType$1["ERC721"] = "ERC721";
	SimulateAssetType$1["ERC1155"] = "ERC1155";
	SimulateAssetType$1["SPECIAL_NFT"] = "SPECIAL_NFT";
})(SimulateAssetType || (SimulateAssetType = {}));
var SimulateChangeType;
(function(SimulateChangeType$1) {
	SimulateChangeType$1["APPROVE"] = "APPROVE";
	SimulateChangeType$1["TRANSFER"] = "TRANSFER";
})(SimulateChangeType || (SimulateChangeType = {}));
var DecodingAuthority;
(function(DecodingAuthority$1) {
	DecodingAuthority$1["ETHERSCAN"] = "ETHERSCAN";
})(DecodingAuthority || (DecodingAuthority = {}));
var DebugCallType;
(function(DebugCallType$1) {
	DebugCallType$1["CREATE"] = "CREATE";
	DebugCallType$1["CALL"] = "CALL";
	DebugCallType$1["STATICCALL"] = "STATICCALL";
	DebugCallType$1["DELEGATECALL"] = "DELEGATECALL";
})(DebugCallType || (DebugCallType = {}));
var GasOptimizedTransactionStatus;
(function(GasOptimizedTransactionStatus$1) {
	GasOptimizedTransactionStatus$1["UNSPECIFIED"] = "TRANSACTION_JOB_STATUS_UNSPECIFIED";
	GasOptimizedTransactionStatus$1["IN_PROGRESS"] = "IN_PROGRESS";
	GasOptimizedTransactionStatus$1["COMPLETE"] = "COMPLETE";
	GasOptimizedTransactionStatus$1["ABANDONED"] = "ABANDONED";
})(GasOptimizedTransactionStatus || (GasOptimizedTransactionStatus = {}));
var WebhookVersion;
(function(WebhookVersion$1) {
	WebhookVersion$1["V1"] = "V1";
	WebhookVersion$1["V2"] = "V2";
})(WebhookVersion || (WebhookVersion = {}));
var WebhookType;
(function(WebhookType$1) {
	WebhookType$1["MINED_TRANSACTION"] = "MINED_TRANSACTION";
	WebhookType$1["DROPPED_TRANSACTION"] = "DROPPED_TRANSACTION";
	WebhookType$1["ADDRESS_ACTIVITY"] = "ADDRESS_ACTIVITY";
	WebhookType$1["NFT_ACTIVITY"] = "NFT_ACTIVITY";
	WebhookType$1["NFT_METADATA_UPDATE"] = "NFT_METADATA_UPDATE";
	WebhookType$1["GRAPHQL"] = "GRAPHQL";
})(WebhookType || (WebhookType = {}));
var CommitmentLevel;
(function(CommitmentLevel$1) {
	CommitmentLevel$1["PENDING"] = "pending";
	CommitmentLevel$1["LATEST"] = "latest";
	CommitmentLevel$1["SAFE"] = "safe";
	CommitmentLevel$1["FINALIZED"] = "finalized";
	CommitmentLevel$1["EARLIEST"] = "earliest";
})(CommitmentLevel || (CommitmentLevel = {}));
var DebugTracerType;
(function(DebugTracerType$1) {
	DebugTracerType$1["CALL_TRACER"] = "callTracer";
	DebugTracerType$1["PRESTATE_TRACER"] = "prestateTracer";
})(DebugTracerType || (DebugTracerType = {}));
var NftTokenType;
(function(NftTokenType$1) {
	NftTokenType$1["ERC721"] = "ERC721";
	NftTokenType$1["ERC1155"] = "ERC1155";
	NftTokenType$1["NO_SUPPORTED_NFT_STANDARD"] = "NO_SUPPORTED_NFT_STANDARD";
	NftTokenType$1["NOT_A_CONTRACT"] = "NOT_A_CONTRACT";
	NftTokenType$1["UNKNOWN"] = "UNKNOWN";
})(NftTokenType || (NftTokenType = {}));
var NftSpamClassification;
(function(NftSpamClassification$1) {
	NftSpamClassification$1["Erc721TooManyOwners"] = "Erc721TooManyOwners";
	NftSpamClassification$1["Erc721TooManyTokens"] = "Erc721TooManyTokens";
	NftSpamClassification$1["Erc721DishonestTotalSupply"] = "Erc721DishonestTotalSupply";
	NftSpamClassification$1["MostlyHoneyPotOwners"] = "MostlyHoneyPotOwners";
	NftSpamClassification$1["OwnedByMostHoneyPots"] = "OwnedByMostHoneyPots";
	NftSpamClassification$1["LowDistinctOwnersPercent"] = "LowDistinctOwnersPercent";
	NftSpamClassification$1["HighHoneyPotOwnerPercent"] = "HighHoneyPotOwnerPercent";
	NftSpamClassification$1["HighHoneyPotPercent"] = "HighHoneyPotPercent";
	NftSpamClassification$1["HoneyPotsOwnMultipleTokens"] = "HoneyPotsOwnMultipleTokens";
	NftSpamClassification$1["NoSalesActivity"] = "NoSalesActivity";
	NftSpamClassification$1["HighAirdropPercent"] = "HighAirdropPercent";
	NftSpamClassification$1["Unknown"] = "Unknown";
})(NftSpamClassification || (NftSpamClassification = {}));
var NftFilters;
(function(NftFilters$1) {
	NftFilters$1["SPAM"] = "SPAM";
	NftFilters$1["AIRDROPS"] = "AIRDROPS";
})(NftFilters || (NftFilters = {}));
var NftOrdering;
(function(NftOrdering$1) {
	NftOrdering$1["TRANSFERTIME"] = "TRANSFERTIME";
})(NftOrdering || (NftOrdering = {}));
var NftSaleMarketplace;
(function(NftSaleMarketplace$1) {
	NftSaleMarketplace$1["SEAPORT"] = "seaport";
	NftSaleMarketplace$1["LOOKSRARE"] = "looksrare";
	NftSaleMarketplace$1["X2Y2"] = "x2y2";
	NftSaleMarketplace$1["WYVERN"] = "wyvern";
	NftSaleMarketplace$1["CRYPTOPUNKS"] = "cryptopunks";
	NftSaleMarketplace$1["BLUR"] = "blur";
	NftSaleMarketplace$1["UNKNOWN"] = "unknown";
})(NftSaleMarketplace || (NftSaleMarketplace = {}));
var NftSaleTakerType;
(function(NftSaleTakerType$1) {
	NftSaleTakerType$1["BUYER"] = "buyer";
	NftSaleTakerType$1["SELLER"] = "seller";
})(NftSaleTakerType || (NftSaleTakerType = {}));
var NftRefreshState;
(function(NftRefreshState$1) {
	NftRefreshState$1["DOES_NOT_EXIST"] = "does_not_exist";
	NftRefreshState$1["ALREADY_QUEUED"] = "already_queued";
	NftRefreshState$1["IN_PROGRESS"] = "in_progress";
	NftRefreshState$1["FINISHED"] = "finished";
	NftRefreshState$1["QUEUED"] = "queued";
	NftRefreshState$1["QUEUE_FAILED"] = "queue_failed";
})(NftRefreshState || (NftRefreshState = {}));
var NftCollectionMarketplace;
(function(NftCollectionMarketplace$1) {
	NftCollectionMarketplace$1["OPENSEA"] = "OpenSea";
})(NftCollectionMarketplace || (NftCollectionMarketplace = {}));
var HistoricalPriceInterval;
(function(HistoricalPriceInterval$1) {
	HistoricalPriceInterval$1["FIVE_MINUTE"] = "5m";
	HistoricalPriceInterval$1["ONE_HOUR"] = "1h";
	HistoricalPriceInterval$1["ONE_DAY"] = "1d";
})(HistoricalPriceInterval || (HistoricalPriceInterval = {}));
/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
function __awaiter$1(thisArg, _arguments, P, generator) {
	function adopt(value) {
		return value instanceof P ? value : new P(function(resolve) {
			resolve(value);
		});
	}
	return new (P || (P = Promise))(function(resolve, reject) {
		function fulfilled(value) {
			try {
				step(generator.next(value));
			} catch (e) {
				reject(e);
			}
		}
		function rejected(value) {
			try {
				step(generator["throw"](value));
			} catch (e) {
				reject(e);
			}
		}
		function step(result) {
			result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
		}
		step((generator = generator.apply(thisArg, _arguments || [])).next());
	});
}
function __values(o) {
	var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
	if (m) return m.call(o);
	if (o && typeof o.length === "number") return { next: function() {
		if (o && i >= o.length) o = void 0;
		return {
			value: o && o[i++],
			done: !o
		};
	} };
	throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
}
function __await(v) {
	return this instanceof __await ? (this.v = v, this) : new __await(v);
}
function __asyncGenerator(thisArg, _arguments, generator) {
	if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
	var g = generator.apply(thisArg, _arguments || []), i, q = [];
	return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function() {
		return this;
	}, i;
	function verb(n) {
		if (g[n]) i[n] = function(v) {
			return new Promise(function(a, b) {
				q.push([
					n,
					v,
					a,
					b
				]) > 1 || resume(n, v);
			});
		};
	}
	function resume(n, v) {
		try {
			step(g[n](v));
		} catch (e) {
			settle$1(q[0][3], e);
		}
	}
	function step(r) {
		r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle$1(q[0][2], r);
	}
	function fulfill(value) {
		resume("next", value);
	}
	function reject(value) {
		resume("throw", value);
	}
	function settle$1(f, v) {
		if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]);
	}
}
function __asyncValues(o) {
	if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
	var m = o[Symbol.asyncIterator], i;
	return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function() {
		return this;
	}, i);
	function verb(n) {
		i[n] = o[n] && function(v) {
			return new Promise(function(resolve, reject) {
				v = o[n](v), settle$1(resolve, reject, v.done, v.value);
			});
		};
	}
	function settle$1(resolve, reject, d, v) {
		Promise.resolve(v).then(function(v$1) {
			resolve({
				value: v$1,
				done: d
			});
		}, reject);
	}
}
var DEFAULT_ALCHEMY_API_KEY = "demo";
var DEFAULT_NETWORK = Network.ETH_MAINNET;
function getAlchemyHttpUrl(network, apiKey) {
	return `https://${network}.g.alchemy.com/v2/${apiKey}`;
}
function getAlchemyNftHttpUrl(network, apiKey) {
	return `https://${network}.g.alchemy.com/nft/v3/${apiKey}`;
}
function getAlchemyWsUrl(network, apiKey) {
	return `wss://${network}.g.alchemy.com/v2/${apiKey}`;
}
function getAlchemyWebhookHttpUrl() {
	return "https://dashboard.alchemy.com/api";
}
function getPricesBaseUrl(apiKey) {
	return `https://api.g.alchemy.com/prices/v1/${apiKey}`;
}
function getDataBaseUrl(apiKey) {
	return `https://api.g.alchemy.com/data/v1/${apiKey}`;
}
var AlchemyApiType;
(function(AlchemyApiType$1) {
	AlchemyApiType$1[AlchemyApiType$1["BASE"] = 0] = "BASE";
	AlchemyApiType$1[AlchemyApiType$1["NFT"] = 1] = "NFT";
	AlchemyApiType$1[AlchemyApiType$1["WEBHOOK"] = 2] = "WEBHOOK";
	AlchemyApiType$1[AlchemyApiType$1["PRICES"] = 3] = "PRICES";
	AlchemyApiType$1[AlchemyApiType$1["PORTFOLIO"] = 4] = "PORTFOLIO";
})(AlchemyApiType || (AlchemyApiType = {}));
var EthersNetwork = {
	[Network.ETH_MAINNET]: "mainnet",
	[Network.ETH_GOERLI]: "goerli",
	[Network.ETH_SEPOLIA]: "sepolia",
	[Network.ETH_HOLESKY]: "holesky",
	[Network.ETH_HOODI]: "hoodi",
	[Network.OPT_MAINNET]: "opt-mainnet",
	[Network.OPT_GOERLI]: "optimism-goerli",
	[Network.OPT_SEPOLIA]: "optimism-sepolia",
	[Network.ARB_MAINNET]: "arbitrum",
	[Network.ARB_GOERLI]: "arbitrum-goerli",
	[Network.ARB_SEPOLIA]: "arbitrum-sepolia",
	[Network.MATIC_MAINNET]: "matic",
	[Network.MATIC_MUMBAI]: "maticmum",
	[Network.MATIC_AMOY]: "maticamoy",
	[Network.SOLANA_MAINNET]: null,
	[Network.SOLANA_DEVNET]: null,
	[Network.ASTAR_MAINNET]: "astar-mainnet",
	[Network.POLYGONZKEVM_MAINNET]: "polygonzkevm-mainnet",
	[Network.POLYGONZKEVM_TESTNET]: "polygonzkevm-testnet",
	[Network.POLYGONZKEVM_CARDONA]: "polygonzkevm-cardona",
	[Network.BASE_MAINNET]: "base-mainnet",
	[Network.BASE_GOERLI]: "base-goerli",
	[Network.BASE_SEPOLIA]: "base-sepolia",
	[Network.ZKSYNC_MAINNET]: "zksync-mainnet",
	[Network.ZKSYNC_SEPOLIA]: "zksync-sepolia",
	[Network.SHAPE_MAINNET]: "shape-mainnet",
	[Network.SHAPE_SEPOLIA]: "shape-sepolia",
	[Network.LINEA_MAINNET]: "linea-mainnet",
	[Network.LINEA_SEPOLIA]: "linea-sepolia",
	[Network.FANTOM_MAINNET]: "fantom-mainnet",
	[Network.FANTOM_TESTNET]: "fantom-testnet",
	[Network.ZETACHAIN_MAINNET]: "zetachain-mainnet",
	[Network.ZETACHAIN_TESTNET]: "zetachain-testnet",
	[Network.ARBNOVA_MAINNET]: "arbnova-mainnet",
	[Network.BLAST_MAINNET]: "blast-mainnet",
	[Network.BLAST_SEPOLIA]: "blast-sepolia",
	[Network.MANTLE_MAINNET]: "mantle-mainnet",
	[Network.MANTLE_SEPOLIA]: "mantle-sepolia",
	[Network.SCROLL_MAINNET]: "scroll-mainnet",
	[Network.SCROLL_SEPOLIA]: "scroll-sepolia",
	[Network.GNOSIS_MAINNET]: "gnosis-mainnet",
	[Network.GNOSIS_CHIADO]: "gnosis-chiado",
	[Network.BNB_MAINNET]: "bnb-mainnet",
	[Network.BNB_TESTNET]: "bnb-testnet",
	[Network.AVAX_MAINNET]: "avax-mainnet",
	[Network.AVAX_FUJI]: "avax-fuji",
	[Network.CELO_MAINNET]: "celo-mainnet",
	[Network.CELO_ALFAJORES]: "celo-alfajores",
	[Network.CELO_BAKLAVA]: "celo-baklava",
	[Network.METIS_MAINNET]: "metis-mainnet",
	[Network.OPBNB_MAINNET]: "opbnb-mainnet",
	[Network.OPBNB_TESTNET]: "opbnb-testnet",
	[Network.BERACHAIN_BARTIO]: "berachain-bartio",
	[Network.BERACHAIN_MAINNET]: "berachain-mainnet",
	[Network.BERACHAIN_BEPOLIA]: "berachain-bepolia",
	[Network.SONEIUM_MAINNET]: "soneium-mainnet",
	[Network.SONEIUM_MINATO]: "soneium-minato",
	[Network.WORLDCHAIN_MAINNET]: "worldchain-mainnet",
	[Network.WORLDCHAIN_SEPOLIA]: "worldchain-sepolia",
	[Network.ROOTSTOCK_MAINNET]: "rootstock-mainnet",
	[Network.ROOTSTOCK_TESTNET]: "rootstock-testnet",
	[Network.FLOW_MAINNET]: "flow-mainnet",
	[Network.FLOW_TESTNET]: "flow-testnet",
	[Network.ZORA_MAINNET]: "zora-mainnet",
	[Network.ZORA_SEPOLIA]: "zora-sepolia",
	[Network.FRAX_MAINNET]: "frax-mainnet",
	[Network.FRAX_SEPOLIA]: "frax-sepolia",
	[Network.POLYNOMIAL_MAINNET]: "polynomial-mainnet",
	[Network.POLYNOMIAL_SEPOLIA]: "polynomial-sepolia",
	[Network.CROSSFI_MAINNET]: "crossfi-mainnet",
	[Network.CROSSFI_TESTNET]: "crossfi-testnet",
	[Network.APECHAIN_MAINNET]: "apechain-mainnet",
	[Network.APECHAIN_CURTIS]: "apechain-curtis",
	[Network.LENS_MAINNET]: "lens-mainnet",
	[Network.LENS_SEPOLIA]: "lens-sepolia",
	[Network.GEIST_MAINNET]: "geist-mainnet",
	[Network.GEIST_POLTER]: "geist-polter",
	[Network.LUMIA_PRISM]: "lumia-prism",
	[Network.LUMIA_TESTNET]: "lumia-testnet",
	[Network.UNICHAIN_MAINNET]: "unichain-mainnet",
	[Network.UNICHAIN_SEPOLIA]: "unichain-sepolia",
	[Network.SONIC_MAINNET]: "sonic-mainnet",
	[Network.SONIC_BLAZE]: "sonic-blaze",
	[Network.XMTP_TESTNET]: "xmtp-testnet",
	[Network.ABSTRACT_MAINNET]: "abstract-mainnet",
	[Network.ABSTRACT_TESTNET]: "abstract-testnet",
	[Network.DEGEN_MAINNET]: "degen-mainnet",
	[Network.INK_MAINNET]: "ink-mainnet",
	[Network.INK_SEPOLIA]: "ink-sepolia",
	[Network.SEI_MAINNET]: "sei-mainnet",
	[Network.SEI_TESTNET]: "sei-testnet",
	[Network.RONIN_MAINNET]: "ronin-mainnet",
	[Network.RONIN_SAIGON]: "ronin-saigon",
	[Network.MONAD_TESTNET]: "monad-testnet",
	[Network.SETTLUS_MAINNET]: "settlus-mainnet",
	[Network.SETTLUS_SEPTESTNET]: "settlus-septestnet",
	[Network.GENSYN_TESTNET]: "gensyn-testnet",
	[Network.SUPERSEED_MAINNET]: "superseed-mainnet",
	[Network.SUPERSEED_SEPOLIA]: "superseed-sepolia",
	[Network.TEA_SEPOLIA]: "tea-sepolia",
	[Network.ANIME_MAINNET]: "anime-mainnet",
	[Network.ANIME_SEPOLIA]: "anime-sepolia",
	[Network.STORY_MAINNET]: "story-mainnet",
	[Network.STORY_AENEID]: "story-aeneid",
	[Network.MEGAETH_TESTNET]: "megaeth-testnet",
	[Network.BOTANIX_MAINNET]: "botanix-mainnet",
	[Network.BOTANIX_TESTNET]: "botanix-testnet",
	[Network.HUMANITY_MAINNET]: "humanity-mainnet",
	[Network.RISE_TESTNET]: "rise-testnet",
	[Network.HYPERLIQUID_MAINNET]: "hyperliquid-mainnet"
};
var CustomNetworks = {
	"arbitrum-goerli": {
		chainId: 421613,
		name: "arbitrum-goerli"
	},
	"arbitrum-sepolia": {
		chainId: 421614,
		name: "arbitrum-sepolia"
	},
	"astar-mainnet": {
		chainId: 592,
		name: "astar-mainnet"
	},
	sepolia: {
		chainId: 11155111,
		name: "sepolia"
	},
	holesky: {
		chainId: 17e3,
		name: "holesky"
	},
	hoodi: {
		chainId: 560048,
		name: "hoodi"
	},
	"opt-mainnet": {
		chainId: 10,
		name: "opt-mainnet"
	},
	"optimism-sepolia": {
		chainId: 11155420,
		name: "optimism-sepolia"
	},
	"polygonzkevm-mainnet": {
		chainId: 1101,
		name: "polygonzkevm-mainnet"
	},
	"polygonzkevm-testnet": {
		chainId: 1442,
		name: "polygonzkevm-testnet"
	},
	"polygonzkevm-cardona": {
		chainId: 2442,
		name: "polygonzkevm-cardona"
	},
	"base-mainnet": {
		chainId: 8453,
		name: "base-mainnet"
	},
	"base-goerli": {
		chainId: 84531,
		name: "base-goerli"
	},
	"base-sepolia": {
		chainId: 84532,
		name: "base-sepolia"
	},
	maticamoy: {
		chainId: 80002,
		name: "maticamoy"
	},
	"zksync-mainnet": {
		chainId: 324,
		name: "zksync-mainnet"
	},
	"zksync-sepolia": {
		chainId: 300,
		name: "zksync-sepolia"
	},
	"shape-mainnet": {
		chainId: 360,
		name: "shape-mainnet"
	},
	"shape-sepolia": {
		chainId: 11011,
		name: "shape-sepolia"
	},
	"linea-mainnet": {
		chainId: 59144,
		name: "linea-mainnet"
	},
	"linea-sepolia": {
		chainId: 59141,
		name: "linea-sepolia"
	},
	"fantom-mainnet": {
		chainId: 250,
		name: "fantom-mainnet"
	},
	"fantom-testnet": {
		chainId: 4002,
		name: "fantom-testnet"
	},
	"zetachain-mainnet": {
		chainId: 7e3,
		name: "zetachain-mainnet"
	},
	"zetachain-testnet": {
		chainId: 7001,
		name: "zetachain-testnet"
	},
	"arbnova-mainnet": {
		chainId: 42170,
		name: "arbnova-mainnet"
	},
	"blast-mainnet": {
		chainId: 81457,
		name: "blast-mainnet"
	},
	"blast-sepolia": {
		chainId: 168587773,
		name: "blast-sepolia"
	},
	"mantle-mainnet": {
		chainId: 5e3,
		name: "mantle-mainnet"
	},
	"mantle-sepolia": {
		chainId: 5003,
		name: "mantle-sepolia"
	},
	"scroll-mainnet": {
		chainId: 534352,
		name: "scroll-mainnet"
	},
	"scroll-sepolia": {
		chainId: 534351,
		name: "scroll-sepolia"
	},
	"gnosis-mainnet": {
		chainId: 100,
		name: "gnosis-mainnet"
	},
	"gnosis-chiado": {
		chainId: 10200,
		name: "gnosis-chiado"
	},
	"bnb-mainnet": {
		chainId: 56,
		name: "bnb-mainnet"
	},
	"bnb-testnet": {
		chainId: 97,
		name: "bnb-testnet"
	},
	"avax-mainnet": {
		chainId: 43114,
		name: "avax-mainnet"
	},
	"avax-fuji": {
		chainId: 43113,
		name: "avax-fuji"
	},
	"celo-mainnet": {
		chainId: 42220,
		name: "celo-mainnet"
	},
	"celo-alfajores": {
		chainId: 44787,
		name: "celo-alfajores"
	},
	"celo-baklava": {
		chainId: 62320,
		name: "celo-baklava"
	},
	"metis-mainnet": {
		chainId: 1088,
		name: "metis-mainnet"
	},
	"opbnb-mainnet": {
		chainId: 204,
		name: "opbnb-mainnet"
	},
	"opbnb-testnet": {
		chainId: 5611,
		name: "opbnb-testnet"
	},
	"berachain-bartio": {
		chainId: 80084,
		name: "berachain-bartio"
	},
	"berachain-mainnet": {
		chainId: 80094,
		name: "berachain-mainnet"
	},
	"berachain-bepolia": {
		chainId: 80069,
		name: "berachain-bepolia"
	},
	"soneium-mainnet": {
		chainId: 1868,
		name: "soneium-mainnet"
	},
	"soneium-minato": {
		chainId: 1946,
		name: "soneium-minato"
	},
	"worldchain-mainnet": {
		chainId: 480,
		name: "worldchain-mainnet"
	},
	"worldchain-sepolia": {
		chainId: 4801,
		name: "worldchain-sepolia"
	},
	"rootstock-mainnet": {
		chainId: 30,
		name: "rootstock-mainnet"
	},
	"rootstock-testnet": {
		chainId: 31,
		name: "rootstock-testnet"
	},
	"flow-mainnet": {
		chainId: 747,
		name: "flow-mainnet"
	},
	"flow-testnet": {
		chainId: 545,
		name: "flow-testnet"
	},
	"zora-mainnet": {
		chainId: 7777777,
		name: "zora-mainnet"
	},
	"zora-sepolia": {
		chainId: 999999999,
		name: "zora-sepolia"
	},
	"frax-mainnet": {
		chainId: 252,
		name: "frax-mainnet"
	},
	"frax-sepolia": {
		chainId: 2522,
		name: "frax-sepolia"
	},
	"polynomial-mainnet": {
		chainId: 8008,
		name: "polynomial-mainnet"
	},
	"polynomial-sepolia": {
		chainId: 8009,
		name: "polynomial-sepolia"
	},
	"crossfi-mainnet": {
		chainId: 4158,
		name: "crossfi-mainnet"
	},
	"crossfi-testnet": {
		chainId: 4157,
		name: "crossfi-testnet"
	},
	"apechain-mainnet": {
		chainId: 33139,
		name: "apechain-mainnet"
	},
	"apechain-curtis": {
		chainId: 33111,
		name: "apechain-curtis"
	},
	"lens-mainnet": {
		chainId: 232,
		name: "lens-mainnet"
	},
	"lens-sepolia": {
		chainId: 37111,
		name: "lens-sepolia"
	},
	"geist-mainnet": {
		chainId: 63157,
		name: "geist-mainnet"
	},
	"geist-polter": {
		chainId: 631571,
		name: "geist-polter"
	},
	"lumia-prism": {
		chainId: 994873017,
		name: "lumia-prism"
	},
	"lumia-testnet": {
		chainId: 1952959480,
		name: "lumia-testnet"
	},
	"unichain-mainnet": {
		chainId: 130,
		name: "unichain-mainnet"
	},
	"unichain-sepolia": {
		chainId: 1301,
		name: "unichain-sepolia"
	},
	"sonic-mainnet": {
		chainId: 146,
		name: "sonic-mainnet"
	},
	"sonic-blaze": {
		chainId: 57054,
		name: "sonic-blaze"
	},
	"xmtp-testnet": {
		chainId: 241320161,
		name: "xmtp-testnet"
	},
	"abstract-mainnet": {
		chainId: 2741,
		name: "abstract-mainnet"
	},
	"abstract-testnet": {
		chainId: 11124,
		name: "abstract-testnet"
	},
	"degen-mainnet": {
		chainId: 666666666,
		name: "degen-mainnet"
	},
	"ink-mainnet": {
		chainId: 57073,
		name: "ink-mainnet"
	},
	"ink-sepolia": {
		chainId: 763373,
		name: "ink-sepolia"
	},
	"sei-mainnet": {
		chainId: 1329,
		name: "sei-mainnet"
	},
	"sei-testnet": {
		chainId: 1328,
		name: "sei-testnet"
	},
	"ronin-mainnet": {
		chainId: 2020,
		name: "ronin-mainnet"
	},
	"ronin-saigon": {
		chainId: 2021,
		name: "ronin-saigon"
	},
	"monad-testnet": {
		chainId: 10143,
		name: "monad-testnet"
	},
	"settlus-mainnet": {
		chainId: 5371,
		name: "settlus-mainnet"
	},
	"settlus-septestnet": {
		chainId: 5373,
		name: "settlus-septestnet"
	},
	"gensyn-testnet": {
		chainId: 685685,
		name: "gensyn-testnet"
	},
	"superseed-mainnet": {
		chainId: 5330,
		name: "superseed-mainnet"
	},
	"superseed-sepolia": {
		chainId: 53302,
		name: "superseed-sepolia"
	},
	"tea-sepolia": {
		chainId: 10218,
		name: "tea-sepolia"
	},
	"anime-mainnet": {
		chainId: 69e3,
		name: "anime-mainnet"
	},
	"anime-sepolia": {
		chainId: 6900,
		name: "anime-sepolia"
	},
	"story-mainnet": {
		chainId: 1514,
		name: "story-mainnet"
	},
	"story-aeneid": {
		chainId: 1315,
		name: "story-aeneid"
	},
	"megaeth-testnet": {
		chainId: 6342,
		name: "megaeth-testnet"
	},
	"botanix-mainnet": {
		chainId: 3636,
		name: "botanix-mainnet"
	},
	"botanix-testnet": {
		chainId: 3637,
		name: "botanix-testnet"
	},
	"humanity-mainnet": {
		chainId: 6985385,
		name: "humanity-mainnet"
	},
	"rise-testnet": {
		chainId: 11155931,
		name: "rise-testnet"
	},
	"hyperliquid-mainnet": {
		chainId: 999,
		name: "hyperliquid-mainnet"
	}
};
function noop() {}
var ETH_NULL_ADDRESS = "0x0000000000000000000000000000000000000000";
var AlchemyConfig = class {
	constructor(config) {
		this.apiKey = (config === null || config === void 0 ? void 0 : config.apiKey) || "demo";
		this.network = (config === null || config === void 0 ? void 0 : config.network) || DEFAULT_NETWORK;
		this.maxRetries = (config === null || config === void 0 ? void 0 : config.maxRetries) || 5;
		this.url = config === null || config === void 0 ? void 0 : config.url;
		this.authToken = config === null || config === void 0 ? void 0 : config.authToken;
		this.batchRequests = (config === null || config === void 0 ? void 0 : config.batchRequests) || false;
		this.requestTimeout = (config === null || config === void 0 ? void 0 : config.requestTimeout) || 0;
		this.connectionInfoOverrides = config === null || config === void 0 ? void 0 : config.connectionInfoOverrides;
	}
	_getRequestUrl(apiType) {
		if (this.url !== void 0) return this.url;
		else if (apiType === AlchemyApiType.NFT) return getAlchemyNftHttpUrl(this.network, this.apiKey);
		else if (apiType === AlchemyApiType.WEBHOOK) return getAlchemyWebhookHttpUrl();
		else if (apiType === AlchemyApiType.PRICES) return getPricesBaseUrl(this.apiKey);
		else if (apiType === AlchemyApiType.PORTFOLIO) return getDataBaseUrl(this.apiKey);
		else return getAlchemyHttpUrl(this.network, this.apiKey);
	}
	getProvider() {
		if (!this._baseAlchemyProvider) this._baseAlchemyProvider = (() => __awaiter$1(this, void 0, void 0, function* () {
			const { AlchemyProvider } = yield __vitePreload(() => import("./alchemy-provider-0b2e9f09-DqMyS5BS.js"), __vite__mapDeps([0,1,2,3]));
			return new AlchemyProvider(this);
		}))();
		return this._baseAlchemyProvider;
	}
	getWebSocketProvider() {
		if (!this._baseAlchemyWssProvider) this._baseAlchemyWssProvider = (() => __awaiter$1(this, void 0, void 0, function* () {
			const { AlchemyWebSocketProvider } = yield __vitePreload(() => import("./alchemy-websocket-provider-2f8b1006-OIs8Wzhb.js"), __vite__mapDeps([4,2,3,1]));
			return new AlchemyWebSocketProvider(this);
		}))();
		return this._baseAlchemyWssProvider;
	}
};
var version$1 = "logger/5.7.0";
var _permanentCensorErrors = false;
var _censorErrors = false;
var LogLevels = {
	debug: 1,
	"default": 2,
	info: 2,
	warning: 3,
	error: 4,
	off: 5
};
var _logLevel = LogLevels["default"];
var _globalLogger = null;
function _checkNormalize() {
	try {
		const missing = [];
		[
			"NFD",
			"NFC",
			"NFKD",
			"NFKC"
		].forEach((form) => {
			try {
				if ("test".normalize(form) !== "test") throw new Error("bad normalize");
			} catch (error) {
				missing.push(form);
			}
		});
		if (missing.length) throw new Error("missing " + missing.join(", "));
		if (String.fromCharCode(233).normalize("NFD") !== String.fromCharCode(101, 769)) throw new Error("broken implementation");
	} catch (error) {
		return error.message;
	}
	return null;
}
var _normalizeError = _checkNormalize();
var LogLevel$1;
(function(LogLevel$2) {
	LogLevel$2["DEBUG"] = "DEBUG";
	LogLevel$2["INFO"] = "INFO";
	LogLevel$2["WARNING"] = "WARNING";
	LogLevel$2["ERROR"] = "ERROR";
	LogLevel$2["OFF"] = "OFF";
})(LogLevel$1 || (LogLevel$1 = {}));
var ErrorCode;
(function(ErrorCode$1) {
	ErrorCode$1["UNKNOWN_ERROR"] = "UNKNOWN_ERROR";
	ErrorCode$1["NOT_IMPLEMENTED"] = "NOT_IMPLEMENTED";
	ErrorCode$1["UNSUPPORTED_OPERATION"] = "UNSUPPORTED_OPERATION";
	ErrorCode$1["NETWORK_ERROR"] = "NETWORK_ERROR";
	ErrorCode$1["SERVER_ERROR"] = "SERVER_ERROR";
	ErrorCode$1["TIMEOUT"] = "TIMEOUT";
	ErrorCode$1["BUFFER_OVERRUN"] = "BUFFER_OVERRUN";
	ErrorCode$1["NUMERIC_FAULT"] = "NUMERIC_FAULT";
	ErrorCode$1["MISSING_NEW"] = "MISSING_NEW";
	ErrorCode$1["INVALID_ARGUMENT"] = "INVALID_ARGUMENT";
	ErrorCode$1["MISSING_ARGUMENT"] = "MISSING_ARGUMENT";
	ErrorCode$1["UNEXPECTED_ARGUMENT"] = "UNEXPECTED_ARGUMENT";
	ErrorCode$1["CALL_EXCEPTION"] = "CALL_EXCEPTION";
	ErrorCode$1["INSUFFICIENT_FUNDS"] = "INSUFFICIENT_FUNDS";
	ErrorCode$1["NONCE_EXPIRED"] = "NONCE_EXPIRED";
	ErrorCode$1["REPLACEMENT_UNDERPRICED"] = "REPLACEMENT_UNDERPRICED";
	ErrorCode$1["UNPREDICTABLE_GAS_LIMIT"] = "UNPREDICTABLE_GAS_LIMIT";
	ErrorCode$1["TRANSACTION_REPLACED"] = "TRANSACTION_REPLACED";
	ErrorCode$1["ACTION_REJECTED"] = "ACTION_REJECTED";
})(ErrorCode || (ErrorCode = {}));
var HEX = "0123456789abcdef";
var Logger$1 = class Logger$1 {
	constructor(version$2) {
		Object.defineProperty(this, "version", {
			enumerable: true,
			value: version$2,
			writable: false
		});
	}
	_log(logLevel, args) {
		const level = logLevel.toLowerCase();
		if (LogLevels[level] == null) this.throwArgumentError("invalid log level name", "logLevel", logLevel);
		if (_logLevel > LogLevels[level]) return;
		console.log.apply(console, args);
	}
	debug(...args) {
		this._log(Logger$1.levels.DEBUG, args);
	}
	info(...args) {
		this._log(Logger$1.levels.INFO, args);
	}
	warn(...args) {
		this._log(Logger$1.levels.WARNING, args);
	}
	makeError(message, code, params) {
		if (_censorErrors) return this.makeError("censored error", code, {});
		if (!code) code = Logger$1.errors.UNKNOWN_ERROR;
		if (!params) params = {};
		const messageDetails = [];
		Object.keys(params).forEach((key) => {
			const value = params[key];
			try {
				if (value instanceof Uint8Array) {
					let hex = "";
					for (let i = 0; i < value.length; i++) {
						hex += HEX[value[i] >> 4];
						hex += HEX[value[i] & 15];
					}
					messageDetails.push(key + "=Uint8Array(0x" + hex + ")");
				} else messageDetails.push(key + "=" + JSON.stringify(value));
			} catch (error$1) {
				messageDetails.push(key + "=" + JSON.stringify(params[key].toString()));
			}
		});
		messageDetails.push(`code=${code}`);
		messageDetails.push(`version=${this.version}`);
		const reason = message;
		let url = "";
		switch (code) {
			case ErrorCode.NUMERIC_FAULT: {
				url = "NUMERIC_FAULT";
				const fault = message;
				switch (fault) {
					case "overflow":
					case "underflow":
					case "division-by-zero":
						url += "-" + fault;
						break;
					case "negative-power":
					case "negative-width":
						url += "-unsupported";
						break;
					case "unbound-bitwise-result":
						url += "-unbound-result";
						break;
				}
				break;
			}
			case ErrorCode.CALL_EXCEPTION:
			case ErrorCode.INSUFFICIENT_FUNDS:
			case ErrorCode.MISSING_NEW:
			case ErrorCode.NONCE_EXPIRED:
			case ErrorCode.REPLACEMENT_UNDERPRICED:
			case ErrorCode.TRANSACTION_REPLACED:
			case ErrorCode.UNPREDICTABLE_GAS_LIMIT:
				url = code;
				break;
		}
		if (url) message += " [ See: https://links.ethers.org/v5-errors-" + url + " ]";
		if (messageDetails.length) message += " (" + messageDetails.join(", ") + ")";
		const error = new Error(message);
		error.reason = reason;
		error.code = code;
		Object.keys(params).forEach(function(key) {
			error[key] = params[key];
		});
		return error;
	}
	throwError(message, code, params) {
		throw this.makeError(message, code, params);
	}
	throwArgumentError(message, name, value) {
		return this.throwError(message, Logger$1.errors.INVALID_ARGUMENT, {
			argument: name,
			value
		});
	}
	assert(condition, message, code, params) {
		if (!!condition) return;
		this.throwError(message, code, params);
	}
	assertArgument(condition, message, name, value) {
		if (!!condition) return;
		this.throwArgumentError(message, name, value);
	}
	checkNormalize(message) {
		if (_normalizeError) this.throwError("platform missing String.prototype.normalize", Logger$1.errors.UNSUPPORTED_OPERATION, {
			operation: "String.prototype.normalize",
			form: _normalizeError
		});
	}
	checkSafeUint53(value, message) {
		if (typeof value !== "number") return;
		if (message == null) message = "value not safe";
		if (value < 0 || value >= 9007199254740991) this.throwError(message, Logger$1.errors.NUMERIC_FAULT, {
			operation: "checkSafeInteger",
			fault: "out-of-safe-range",
			value
		});
		if (value % 1) this.throwError(message, Logger$1.errors.NUMERIC_FAULT, {
			operation: "checkSafeInteger",
			fault: "non-integer",
			value
		});
	}
	checkArgumentCount(count, expectedCount, message) {
		if (message) message = ": " + message;
		else message = "";
		if (count < expectedCount) this.throwError("missing argument" + message, Logger$1.errors.MISSING_ARGUMENT, {
			count,
			expectedCount
		});
		if (count > expectedCount) this.throwError("too many arguments" + message, Logger$1.errors.UNEXPECTED_ARGUMENT, {
			count,
			expectedCount
		});
	}
	checkNew(target, kind) {
		if (target === Object || target == null) this.throwError("missing new", Logger$1.errors.MISSING_NEW, { name: kind.name });
	}
	checkAbstract(target, kind) {
		if (target === kind) this.throwError("cannot instantiate abstract class " + JSON.stringify(kind.name) + " directly; use a sub-class", Logger$1.errors.UNSUPPORTED_OPERATION, {
			name: target.name,
			operation: "new"
		});
		else if (target === Object || target == null) this.throwError("missing new", Logger$1.errors.MISSING_NEW, { name: kind.name });
	}
	static globalLogger() {
		if (!_globalLogger) _globalLogger = new Logger$1(version$1);
		return _globalLogger;
	}
	static setCensorship(censorship, permanent) {
		if (!censorship && permanent) this.globalLogger().throwError("cannot permanently disable censorship", Logger$1.errors.UNSUPPORTED_OPERATION, { operation: "setCensorship" });
		if (_permanentCensorErrors) {
			if (!censorship) return;
			this.globalLogger().throwError("error censorship permanent", Logger$1.errors.UNSUPPORTED_OPERATION, { operation: "setCensorship" });
		}
		_censorErrors = !!censorship;
		_permanentCensorErrors = !!permanent;
	}
	static setLogLevel(logLevel) {
		const level = LogLevels[logLevel.toLowerCase()];
		if (level == null) {
			Logger$1.globalLogger().warn("invalid log level - " + logLevel);
			return;
		}
		_logLevel = level;
	}
	static from(version$2) {
		return new Logger$1(version$2);
	}
};
Logger$1.errors = ErrorCode;
Logger$1.levels = LogLevel$1;
var version = "properties/5.7.0";
var __awaiter = function(thisArg, _arguments, P, generator) {
	function adopt(value) {
		return value instanceof P ? value : new P(function(resolve) {
			resolve(value);
		});
	}
	return new (P || (P = Promise))(function(resolve, reject) {
		function fulfilled(value) {
			try {
				step(generator.next(value));
			} catch (e) {
				reject(e);
			}
		}
		function rejected(value) {
			try {
				step(generator["throw"](value));
			} catch (e) {
				reject(e);
			}
		}
		function step(result) {
			result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
		}
		step((generator = generator.apply(thisArg, _arguments || [])).next());
	});
};
var logger = new Logger$1(version);
function defineReadOnly(object, name, value) {
	Object.defineProperty(object, name, {
		enumerable: true,
		value,
		writable: false
	});
}
function resolveProperties(object) {
	return __awaiter(this, void 0, void 0, function* () {
		const promises = Object.keys(object).map((key) => {
			const value = object[key];
			return Promise.resolve(value).then((v) => ({
				key,
				value: v
			}));
		});
		return (yield Promise.all(promises)).reduce((accum, result) => {
			accum[result.key] = result.value;
			return accum;
		}, {});
	});
}
var opaque = {
	bigint: true,
	boolean: true,
	"function": true,
	number: true,
	string: true
};
function _isFrozen(object) {
	if (object === void 0 || object === null || opaque[typeof object]) return true;
	if (Array.isArray(object) || typeof object === "object") {
		if (!Object.isFrozen(object)) return false;
		const keys = Object.keys(object);
		for (let i = 0; i < keys.length; i++) {
			let value = null;
			try {
				value = object[keys[i]];
			} catch (error) {
				continue;
			}
			if (!_isFrozen(value)) return false;
		}
		return true;
	}
	return logger.throwArgumentError(`Cannot deepCopy ${typeof object}`, "object", object);
}
function _deepCopy(object) {
	if (_isFrozen(object)) return object;
	if (Array.isArray(object)) return Object.freeze(object.map((item) => deepCopy(item)));
	if (typeof object === "object") {
		const result = {};
		for (const key in object) {
			const value = object[key];
			if (value === void 0) continue;
			defineReadOnly(result, key, deepCopy(value));
		}
		return result;
	}
	return logger.throwArgumentError(`Cannot deepCopy ${typeof object}`, "object", object);
}
function deepCopy(object) {
	return _deepCopy(object);
}
function fromHex(hexString) {
	return BigNumber.from(hexString).toNumber();
}
function toHex(num) {
	return hexValue(num);
}
function formatBlock(block) {
	if (typeof block === "string") return block;
	else if (Number.isInteger(block)) return toHex(block);
	return block.toString();
}
function stringToEnum(x, enumb) {
	return Object.values(enumb).includes(x) ? x : null;
}
function getNftContractForNftFromRaw(rawNftContract) {
	return nullsToUndefined(Object.assign(Object.assign({}, getNftContractFromRaw(rawNftContract)), { spamClassifications: rawNftContract.spamClassifications.map(parseNftSpamClassification) }));
}
function getNftContractsForOwnerFromRaw(rawNftContract) {
	return nullsToUndefined(Object.assign(Object.assign({}, getNftContractFromRaw(rawNftContract)), {
		displayNft: rawNftContract.displayNft,
		image: rawNftContract.image,
		totalBalance: rawNftContract.totalBalance,
		numDistinctTokensOwned: rawNftContract.numDistinctTokensOwned,
		isSpam: rawNftContract.isSpam
	}));
}
function getNftContractFromRaw(rawNftContract) {
	var _a;
	return nullsToUndefined(Object.assign(Object.assign({}, rawNftContract), {
		tokenType: parseNftTokenType(rawNftContract.tokenType),
		openSeaMetadata: Object.assign(Object.assign({}, rawNftContract.openSeaMetadata), { safelistRequestStatus: ((_a = rawNftContract.openSeaMetadata) === null || _a === void 0 ? void 0 : _a.safelistRequestStatus) ? stringToEnum(rawNftContract.openSeaMetadata.safelistRequestStatus, OpenSeaSafelistRequestStatus) : null })
	}));
}
function getNftCollectionFromRaw(rawNftCollection) {
	return nullsToUndefined(Object.assign(Object.assign({}, rawNftCollection), { floorPrice: Object.assign(Object.assign({}, rawNftCollection.floorPrice), { marketplace: parseNftCollectionMarketplace(rawNftCollection.floorPrice.marketplace) }) }));
}
function getBaseNftFromRaw(rawBaseNft, contractAddress) {
	return {
		contractAddress: contractAddress ? contractAddress : rawBaseNft.contractAddress,
		tokenId: rawBaseNft.tokenId
	};
}
function getNftFromRaw(rawNft) {
	return nullsToUndefined(Object.assign(Object.assign({}, rawNft), {
		contract: getNftContractForNftFromRaw(rawNft.contract),
		tokenType: parseNftTokenType(rawNft.tokenType),
		acquiredAt: rawNft.acquiredAt,
		collection: rawNft.collection,
		mint: rawNft.mint
	}));
}
function getNftSalesFromRaw(rawNftSales) {
	return nullsToUndefined({
		nftSales: rawNftSales.nftSales.map((rawNftSale) => Object.assign(Object.assign({}, rawNftSale), {
			marketplace: parseNftSaleMarketplace(rawNftSale.marketplace),
			taker: parseNftTaker(rawNftSale.taker)
		})),
		validAt: rawNftSales.validAt,
		pageKey: rawNftSales.pageKey
	});
}
function parseNftSaleMarketplace(marketplace) {
	switch (marketplace) {
		case "looksrare": return NftSaleMarketplace.LOOKSRARE;
		case "seaport": return NftSaleMarketplace.SEAPORT;
		case "x2y2": return NftSaleMarketplace.X2Y2;
		case "wyvern": return NftSaleMarketplace.WYVERN;
		case "cryptopunks": return NftSaleMarketplace.CRYPTOPUNKS;
		case "blur": return NftSaleMarketplace.BLUR;
		default: return NftSaleMarketplace.UNKNOWN;
	}
}
function parseNftCollectionMarketplace(marketplace) {
	switch (marketplace) {
		case "OpenSea": return NftCollectionMarketplace.OPENSEA;
		default: return;
	}
}
function parseNftTaker(taker) {
	switch (taker.toLowerCase()) {
		case "buyer": return NftSaleTakerType.BUYER;
		case "seller": return NftSaleTakerType.SELLER;
		default: throw new Error(`Unsupported NftSaleTakerType ${taker}`);
	}
}
function parseNftSpamClassification(s) {
	const res = stringToEnum(s, NftSpamClassification);
	if (res == null) return NftSpamClassification.Unknown;
	return res;
}
function parseNftTokenType(tokenType) {
	switch (tokenType) {
		case "erc721":
		case "ERC721": return NftTokenType.ERC721;
		case "erc1155":
		case "ERC1155": return NftTokenType.ERC1155;
		case "no_supported_nft_standard":
		case "NO_SUPPORTED_NFT_STANDARD": return NftTokenType.NO_SUPPORTED_NFT_STANDARD;
		case "not_a_contract":
		case "NOT_A_CONTRACT": return NftTokenType.NOT_A_CONTRACT;
		default: return NftTokenType.UNKNOWN;
	}
}
var IS_BROWSER = typeof window !== "undefined" && window !== null;
function nullsToUndefined(obj) {
	if (obj === null || obj === void 0) return;
	if (obj.constructor.name === "Object" || Array.isArray(obj)) for (const key in obj) obj[key] = nullsToUndefined(obj[key]);
	return obj;
}
function getAssetTransfers(config, params, srcMethod = "getAssetTransfers") {
	return __awaiter$1(this, void 0, void 0, function* () {
		const provider = yield config.getProvider();
		if (params.fromAddress) params.fromAddress = yield provider._getAddress(params.fromAddress);
		if (params.toAddress) params.toAddress = yield provider._getAddress(params.toAddress);
		return provider._send("alchemy_getAssetTransfers", [Object.assign(Object.assign({}, params), {
			fromBlock: params.fromBlock != null ? formatBlock(params.fromBlock) : void 0,
			toBlock: params.toBlock != null ? formatBlock(params.toBlock) : void 0,
			maxCount: params.maxCount != null ? toHex(params.maxCount) : void 0
		})], srcMethod);
	});
}
function getTransactionReceipts(config, params, srcMethod = "getTransactionReceipts") {
	return __awaiter$1(this, void 0, void 0, function* () {
		return (yield config.getProvider())._send("alchemy_getTransactionReceipts", [params], srcMethod);
	});
}
function getLogs(config, filter) {
	return __awaiter$1(this, void 0, void 0, function* () {
		const provider = yield config.getProvider();
		yield provider.getNetwork();
		const params = yield resolveProperties({ filter: getFilter(config, filter) });
		const logs = yield provider.send("eth_getLogs", [params.filter]);
		logs.forEach((log) => {
			if (log.removed == null) log.removed = false;
		});
		return arrayOf(provider.formatter.filterLog.bind(provider.formatter))(logs);
	});
}
function getFilter(config, filter) {
	return __awaiter$1(this, void 0, void 0, function* () {
		const provider = yield config.getProvider();
		const resolvedFilter = yield filter;
		let result = {};
		["blockHash", "topics"].forEach((key) => {
			if (resolvedFilter[key] == null) return;
			result[key] = resolvedFilter[key];
		});
		["fromBlock", "toBlock"].forEach((key) => {
			if (resolvedFilter[key] == null) return;
			result[key] = provider._getBlockTag(resolvedFilter[key]);
		});
		result = provider.formatter.filter(yield resolveProperties(result));
		if (Array.isArray(resolvedFilter.address)) result.address = yield Promise.all(resolvedFilter.address.map((address) => __awaiter$1(this, void 0, void 0, function* () {
			return provider._getAddress(address);
		})));
		else if (resolvedFilter.address != null) result.address = yield provider._getAddress(resolvedFilter.address);
		return result;
	});
}
function arrayOf(format) {
	return function(array) {
		if (!Array.isArray(array)) throw new Error("not an array");
		const result = [];
		array.forEach((value) => {
			result.push(format(value));
		});
		return result;
	};
}
var CoreNamespace = class {
	constructor(config) {
		this.config = config;
	}
	getBalance(addressOrName, blockTag) {
		return __awaiter$1(this, void 0, void 0, function* () {
			return (yield this.config.getProvider()).getBalance(addressOrName, blockTag);
		});
	}
	isContractAddress(address) {
		return __awaiter$1(this, void 0, void 0, function* () {
			return (yield (yield this.config.getProvider()).getCode(address)) !== "0x";
		});
	}
	getCode(addressOrName, blockTag) {
		return __awaiter$1(this, void 0, void 0, function* () {
			return (yield this.config.getProvider()).getCode(addressOrName, blockTag);
		});
	}
	getStorageAt(addressOrName, position, blockTag) {
		return __awaiter$1(this, void 0, void 0, function* () {
			return (yield this.config.getProvider()).getStorageAt(addressOrName, position, blockTag);
		});
	}
	getTransactionCount(addressOrName, blockTag) {
		return __awaiter$1(this, void 0, void 0, function* () {
			return (yield this.config.getProvider()).getTransactionCount(addressOrName, blockTag);
		});
	}
	getBlock(blockHashOrBlockTag) {
		return __awaiter$1(this, void 0, void 0, function* () {
			return (yield this.config.getProvider()).getBlock(blockHashOrBlockTag);
		});
	}
	getBlockWithTransactions(blockHashOrBlockTag) {
		return __awaiter$1(this, void 0, void 0, function* () {
			return (yield this.config.getProvider()).getBlockWithTransactions(blockHashOrBlockTag);
		});
	}
	getNetwork() {
		return __awaiter$1(this, void 0, void 0, function* () {
			return (yield this.config.getProvider()).getNetwork();
		});
	}
	getBlockNumber() {
		return __awaiter$1(this, void 0, void 0, function* () {
			return (yield this.config.getProvider()).getBlockNumber();
		});
	}
	getGasPrice() {
		return __awaiter$1(this, void 0, void 0, function* () {
			return (yield this.config.getProvider()).getGasPrice();
		});
	}
	getFeeData() {
		return __awaiter$1(this, void 0, void 0, function* () {
			return (yield this.config.getProvider()).getFeeData();
		});
	}
	ready() {
		return __awaiter$1(this, void 0, void 0, function* () {
			return (yield this.config.getProvider()).ready;
		});
	}
	call(transaction, blockTag) {
		return __awaiter$1(this, void 0, void 0, function* () {
			return (yield this.config.getProvider()).call(transaction, blockTag);
		});
	}
	estimateGas(transaction) {
		return __awaiter$1(this, void 0, void 0, function* () {
			return (yield this.config.getProvider()).estimateGas(transaction);
		});
	}
	getTransaction(transactionHash) {
		return __awaiter$1(this, void 0, void 0, function* () {
			return (yield this.config.getProvider()).getTransaction(transactionHash);
		});
	}
	getTransactionReceipt(transactionHash) {
		return __awaiter$1(this, void 0, void 0, function* () {
			return (yield this.config.getProvider()).getTransactionReceipt(transactionHash);
		});
	}
	sendTransaction(signedTransaction) {
		return __awaiter$1(this, void 0, void 0, function* () {
			return (yield this.config.getProvider()).sendTransaction(signedTransaction);
		});
	}
	waitForTransaction(transactionHash, confirmations, timeout) {
		return __awaiter$1(this, void 0, void 0, function* () {
			return (yield this.config.getProvider()).waitForTransaction(transactionHash, confirmations, timeout);
		});
	}
	getLogs(filter) {
		return __awaiter$1(this, void 0, void 0, function* () {
			return getLogs(this.config, filter);
		});
	}
	send(method, params) {
		return __awaiter$1(this, void 0, void 0, function* () {
			return (yield this.config.getProvider()).send(method, params);
		});
	}
	findContractDeployer(contractAddress) {
		var _a;
		return __awaiter$1(this, void 0, void 0, function* () {
			const provider = yield this.config.getProvider();
			const currentBlockNum = yield provider.getBlockNumber();
			if ((yield provider.getCode(contractAddress, currentBlockNum)) === "0x") throw new Error(`Contract '${contractAddress}' does not exist`);
			const firstBlock = yield binarySearchFirstBlock(0, currentBlockNum + 1, contractAddress, this.config);
			const matchingReceipt = (_a = (yield getTransactionReceipts(this.config, { blockNumber: toHex(firstBlock) }, "findContractDeployer")).receipts) === null || _a === void 0 ? void 0 : _a.find((receipt) => receipt.contractAddress === contractAddress.toLowerCase());
			return {
				deployerAddress: matchingReceipt === null || matchingReceipt === void 0 ? void 0 : matchingReceipt.from,
				blockNumber: firstBlock
			};
		});
	}
	getTokenBalances(addressOrName, contractAddressesOrOptions) {
		return __awaiter$1(this, void 0, void 0, function* () {
			const provider = yield this.config.getProvider();
			const address = yield provider._getAddress(addressOrName);
			if (Array.isArray(contractAddressesOrOptions)) {
				if (contractAddressesOrOptions.length > 1500) throw new Error("You cannot pass in more than 1500 contract addresses to getTokenBalances()");
				if (contractAddressesOrOptions.length === 0) throw new Error("getTokenBalances() requires at least one contractAddress when using an array");
				return provider._send("alchemy_getTokenBalances", [address, contractAddressesOrOptions], "getTokenBalances");
			} else {
				const tokenType = contractAddressesOrOptions === void 0 ? TokenBalanceType.ERC20 : contractAddressesOrOptions.type;
				const params = [address, tokenType];
				if ((contractAddressesOrOptions === null || contractAddressesOrOptions === void 0 ? void 0 : contractAddressesOrOptions.type) === TokenBalanceType.ERC20 && contractAddressesOrOptions.pageKey) params.push({ pageKey: contractAddressesOrOptions.pageKey });
				return provider._send("alchemy_getTokenBalances", params, "getTokenBalances");
			}
		});
	}
	getTokensForOwner(addressOrName, options) {
		var _a;
		return __awaiter$1(this, void 0, void 0, function* () {
			const provider = yield this.config.getProvider();
			const params = [yield provider._getAddress(addressOrName), (_a = options === null || options === void 0 ? void 0 : options.contractAddresses) !== null && _a !== void 0 ? _a : TokenBalanceType.ERC20];
			if (options === null || options === void 0 ? void 0 : options.pageKey) params.push({ pageKey: options.pageKey });
			const response = yield provider._send("alchemy_getTokenBalances", params, "getTokensForOwner");
			const formattedBalances = response.tokenBalances.map((balance) => ({
				contractAddress: balance.contractAddress,
				rawBalance: BigNumber.from(balance.tokenBalance).toString()
			}));
			const metadata = (yield Promise.allSettled(response.tokenBalances.map((token) => provider._send("alchemy_getTokenMetadata", [token.contractAddress], "getTokensForOwner")))).map((p) => p.status === "fulfilled" ? p.value : {
				name: null,
				symbol: null,
				decimals: null,
				logo: null
			});
			return {
				tokens: formattedBalances.map((balance, index) => Object.assign(Object.assign(Object.assign({}, balance), metadata[index]), { balance: metadata[index].decimals !== null ? formatUnits(balance.rawBalance, metadata[index].decimals) : void 0 })).map((t) => nullsToUndefined(t)),
				pageKey: response.pageKey
			};
		});
	}
	getTokenMetadata(address) {
		return __awaiter$1(this, void 0, void 0, function* () {
			return (yield this.config.getProvider())._send("alchemy_getTokenMetadata", [address], "getTokenMetadata");
		});
	}
	getAssetTransfers(params) {
		return __awaiter$1(this, void 0, void 0, function* () {
			return getAssetTransfers(this.config, params);
		});
	}
	getTransactionReceipts(params) {
		return __awaiter$1(this, void 0, void 0, function* () {
			return getTransactionReceipts(this.config, params);
		});
	}
	resolveName(name) {
		return __awaiter$1(this, void 0, void 0, function* () {
			return (yield this.config.getProvider()).resolveName(name);
		});
	}
	lookupAddress(address) {
		return __awaiter$1(this, void 0, void 0, function* () {
			return (yield this.config.getProvider()).lookupAddress(address);
		});
	}
};
function binarySearchFirstBlock(start, end, address, config) {
	return __awaiter$1(this, void 0, void 0, function* () {
		if (start >= end) return end;
		const mid = Math.floor((start + end) / 2);
		if ((yield (yield config.getProvider()).getCode(address, mid)) === "0x") return binarySearchFirstBlock(mid + 1, end, address, config);
		return binarySearchFirstBlock(start, mid, address, config);
	});
}
var DebugNamespace = class {
	constructor(config) {
		this.config = config;
	}
	traceCall(transaction, blockIdentifier, tracer) {
		return __awaiter$1(this, void 0, void 0, function* () {
			const provider = yield this.config.getProvider();
			const params = [
				transaction,
				blockIdentifier,
				parseTracerParams(tracer)
			];
			return provider._send("debug_traceCall", params, "traceCall");
		});
	}
	traceTransaction(transactionHash, tracer, timeout) {
		return __awaiter$1(this, void 0, void 0, function* () {
			const provider = yield this.config.getProvider();
			const params = [transactionHash, parseTracerParams(tracer, timeout)];
			return provider._send("debug_traceTransaction", params, "traceTransaction");
		});
	}
	traceBlock(blockIdentifier, tracer) {
		return __awaiter$1(this, void 0, void 0, function* () {
			const provider = yield this.config.getProvider();
			let method;
			let params;
			if (isHexString(blockIdentifier, 32)) {
				method = "debug_traceBlockByHash";
				params = [blockIdentifier, parseTracerParams(tracer)];
			} else {
				method = "debug_traceBlockByNumber";
				params = [typeof blockIdentifier === "number" ? hexStripZeros(hexValue(blockIdentifier)) : blockIdentifier, parseTracerParams(tracer)];
			}
			return provider._send(method, params, "traceBlock");
		});
	}
};
function parseTracerParams(tracer, timeout) {
	return Object.assign({ tracer: tracer.type }, tracer.onlyTopCall !== void 0 && { tracerConfig: {
		onlyTopCall: tracer.onlyTopCall,
		timeout
	} });
}
function sanitizeTokenType(tokenType) {
	if (tokenType === NftTokenType.ERC1155 || tokenType === NftTokenType.ERC721) return tokenType;
}
var LogLevel;
(function(LogLevel$2) {
	LogLevel$2[LogLevel$2["DEBUG"] = 0] = "DEBUG";
	LogLevel$2[LogLevel$2["INFO"] = 1] = "INFO";
	LogLevel$2[LogLevel$2["WARN"] = 2] = "WARN";
	LogLevel$2[LogLevel$2["ERROR"] = 3] = "ERROR";
	LogLevel$2[LogLevel$2["SILENT"] = 4] = "SILENT";
})(LogLevel || (LogLevel = {}));
LogLevel.DEBUG, LogLevel.INFO, LogLevel.WARN, LogLevel.ERROR, LogLevel.SILENT;
var logLevelToConsoleFn = {
	[LogLevel.DEBUG]: "log",
	[LogLevel.INFO]: "info",
	[LogLevel.WARN]: "warn",
	[LogLevel.ERROR]: "error"
};
var DEFAULT_LOG_LEVEL = LogLevel.INFO;
function logDebug(message, ...args) {
	loggerClient.debug(message, args);
}
function logInfo(message, ...args) {
	loggerClient.info(message, args);
}
function logWarn(message, ...args) {
	loggerClient.warn(message, args);
}
var Logger = class {
	constructor() {
		this._logLevel = DEFAULT_LOG_LEVEL;
	}
	get logLevel() {
		return this._logLevel;
	}
	set logLevel(val) {
		if (!(val in LogLevel)) throw new TypeError(`Invalid value "${val}" assigned to \`logLevel\``);
		this._logLevel = val;
	}
	debug(...args) {
		this._log(LogLevel.DEBUG, ...args);
	}
	info(...args) {
		this._log(LogLevel.INFO, ...args);
	}
	warn(...args) {
		this._log(LogLevel.WARN, ...args);
	}
	error(...args) {
		this._log(LogLevel.ERROR, ...args);
	}
	_log(logLevel, ...args) {
		if (logLevel < this._logLevel) return;
		const now = (/* @__PURE__ */ new Date()).toISOString();
		const method = logLevelToConsoleFn[logLevel];
		if (method) console[method](`[${now}] Alchemy:`, ...args.map(stringify));
		else throw new Error(`Logger received an invalid logLevel (value: ${logLevel})`);
	}
};
function stringify(obj) {
	if (typeof obj === "string") return obj;
	else try {
		return JSON.stringify(obj);
	} catch (e) {
		return obj;
	}
}
var loggerClient = new Logger();
var VERSION = "3.6.3";
function sendAxiosRequest(baseUrl, restApiName, methodName, params, overrides) {
	var _a;
	const requestUrl = baseUrl + "/" + restApiName;
	const config = Object.assign(Object.assign({}, overrides), {
		headers: Object.assign(Object.assign(Object.assign({}, overrides === null || overrides === void 0 ? void 0 : overrides.headers), !IS_BROWSER && { "Accept-Encoding": "gzip" }), {
			"Alchemy-Ethers-Sdk-Version": VERSION,
			"Alchemy-Ethers-Sdk-Method": methodName
		}),
		method: (_a = overrides === null || overrides === void 0 ? void 0 : overrides.method) !== null && _a !== void 0 ? _a : "GET",
		url: requestUrl,
		params
	});
	return axios_default(config);
}
var DEFAULT_BACKOFF_INITIAL_DELAY_MS = 1e3;
var DEFAULT_BACKOFF_MULTIPLIER = 1.5;
var DEFAULT_BACKOFF_MAX_DELAY_MS = 30 * 1e3;
var ExponentialBackoff = class {
	constructor(maxAttempts = 5) {
		this.maxAttempts = maxAttempts;
		this.initialDelayMs = DEFAULT_BACKOFF_INITIAL_DELAY_MS;
		this.backoffMultiplier = DEFAULT_BACKOFF_MULTIPLIER;
		this.maxDelayMs = DEFAULT_BACKOFF_MAX_DELAY_MS;
		this.numAttempts = 0;
		this.currentDelayMs = 0;
		this.isInBackoff = false;
	}
	backoff() {
		if (this.numAttempts >= this.maxAttempts) return Promise.reject(/* @__PURE__ */ new Error(`Exceeded maximum number of attempts: ${this.maxAttempts}`));
		if (this.isInBackoff) return Promise.reject(/* @__PURE__ */ new Error("A backoff operation is already in progress"));
		const backoffDelayWithJitterMs = this.withJitterMs(this.currentDelayMs);
		if (backoffDelayWithJitterMs > 0) logDebug("ExponentialBackoff.backoff", `Backing off for ${backoffDelayWithJitterMs}ms`);
		this.currentDelayMs *= this.backoffMultiplier;
		this.currentDelayMs = Math.max(this.currentDelayMs, this.initialDelayMs);
		this.currentDelayMs = Math.min(this.currentDelayMs, this.maxDelayMs);
		this.numAttempts += 1;
		return new Promise((resolve) => {
			this.isInBackoff = true;
			setTimeout(() => {
				this.isInBackoff = false;
				resolve();
			}, backoffDelayWithJitterMs);
		});
	}
	withJitterMs(delayMs) {
		return Math.min(delayMs + (Math.random() - .5) * delayMs, this.maxDelayMs);
	}
};
function requestHttpWithBackoff(config, apiType, restApiName, methodName, params, overrides) {
	return __awaiter$1(this, void 0, void 0, function* () {
		let lastError = void 0;
		const backoff = new ExponentialBackoff(config.maxRetries);
		for (let attempt = 0; attempt < config.maxRetries + 1; attempt++) try {
			if (lastError !== void 0) logInfo("requestHttp", `Retrying after error: ${lastError.message}`);
			try {
				yield backoff.backoff();
			} catch (err) {
				break;
			}
			const response = yield sendAxiosRequest(config._getRequestUrl(apiType), restApiName, methodName, params, Object.assign(Object.assign({}, overrides), { timeout: config.requestTimeout }));
			if (response.status === 200) {
				logDebug(restApiName, `Successful request: ${restApiName}`);
				return response.data;
			} else {
				logInfo(restApiName, `Request failed: ${restApiName}, ${response.status}, ${response.data}`);
				lastError = /* @__PURE__ */ new Error(response.status + ": " + response.data);
			}
		} catch (err) {
			if (!axios_default.isAxiosError(err) || err.response === void 0) throw err;
			lastError = /* @__PURE__ */ new Error(err.response.status + ": " + JSON.stringify(err.response.data));
			if (!isRetryableHttpError(err, apiType)) break;
		}
		return Promise.reject(lastError);
	});
}
function isRetryableHttpError(err, apiType) {
	const retryableCodes = apiType === AlchemyApiType.WEBHOOK ? [429, 500] : [429];
	return err.response !== void 0 && retryableCodes.includes(err.response.status);
}
function paginateEndpoint(config, apiType, restApiName, methodName, reqPageKey, resPageKey, params) {
	return __asyncGenerator(this, arguments, function* paginateEndpoint_1() {
		let hasNext = true;
		const requestParams = Object.assign({}, params);
		while (hasNext) {
			const response = yield __await(requestHttpWithBackoff(config, apiType, restApiName, methodName, requestParams));
			yield yield __await(response);
			if (response[resPageKey] !== null) requestParams[reqPageKey] = response[resPageKey];
			else hasNext = false;
		}
	});
}
function getNftMetadata(config, contractAddress, tokenId, options, srcMethod = "getNftMetadata") {
	return __awaiter$1(this, void 0, void 0, function* () {
		const response = yield requestHttpWithBackoff(config, AlchemyApiType.NFT, "getNFTMetadata", srcMethod, {
			contractAddress,
			tokenId: BigNumber.from(tokenId).toString(),
			tokenType: sanitizeTokenType(options === null || options === void 0 ? void 0 : options.tokenType),
			tokenUriTimeoutInMs: options === null || options === void 0 ? void 0 : options.tokenUriTimeoutInMs,
			refreshCache: options === null || options === void 0 ? void 0 : options.refreshCache
		});
		return getNftFromRaw(response);
	});
}
function getNftMetadataBatch(config, tokens, options) {
	return __awaiter$1(this, void 0, void 0, function* () {
		const data = {
			tokens,
			tokenUriTimeoutInMs: options === null || options === void 0 ? void 0 : options.tokenUriTimeoutInMs,
			refreshCache: options === null || options === void 0 ? void 0 : options.refreshCache
		};
		return { nfts: (yield requestHttpWithBackoff(config, AlchemyApiType.NFT, "getNFTMetadataBatch", "getNftMetadataBatch", {}, {
			method: "POST",
			data
		})).nfts.map((nft) => getNftFromRaw(nft)) };
	});
}
function getContractMetadata(config, contractAddress, srcMethod = "getContractMetadata") {
	return __awaiter$1(this, void 0, void 0, function* () {
		const response = yield requestHttpWithBackoff(config, AlchemyApiType.NFT, "getContractMetadata", srcMethod, { contractAddress });
		return getNftContractFromRaw(response);
	});
}
function getContractMetadataBatch(config, contractAddresses) {
	return __awaiter$1(this, void 0, void 0, function* () {
		return { contracts: (yield requestHttpWithBackoff(config, AlchemyApiType.NFT, "getContractMetadataBatch", "getContractMetadataBatch", {}, {
			method: "POST",
			data: { contractAddresses }
		})).contracts.map(getNftContractFromRaw) };
	});
}
function getCollectionMetadata(config, collectionSlug, srcMethod = "getCollectionMetadata") {
	return __awaiter$1(this, void 0, void 0, function* () {
		const response = yield requestHttpWithBackoff(config, AlchemyApiType.NFT, "getCollectionMetadata", srcMethod, { collectionSlug });
		return getNftCollectionFromRaw(response);
	});
}
function getNftsForOwnerIterator(config, owner, options, srcMethod = "getNftsForOwnerIterator") {
	return __asyncGenerator(this, arguments, function* getNftsForOwnerIterator_1() {
		var e_1, _a;
		const withMetadata = omitMetadataToWithMetadata(options === null || options === void 0 ? void 0 : options.omitMetadata);
		try {
			for (var _b = __asyncValues(paginateEndpoint(config, AlchemyApiType.NFT, "getNFTsForOwner", srcMethod, "pageKey", "pageKey", {
				contractAddresses: options === null || options === void 0 ? void 0 : options.contractAddresses,
				pageKey: options === null || options === void 0 ? void 0 : options.pageKey,
				excludeFilters: options === null || options === void 0 ? void 0 : options.excludeFilters,
				includeFilters: options === null || options === void 0 ? void 0 : options.includeFilters,
				owner,
				withMetadata,
				tokenUriTimeoutInMs: options === null || options === void 0 ? void 0 : options.tokenUriTimeoutInMs,
				orderBy: options === null || options === void 0 ? void 0 : options.orderBy
			})), _c; _c = yield __await(_b.next()), !_c.done;) {
				const response = _c.value;
				for (const ownedNft of response.ownedNfts) yield yield __await(Object.assign(Object.assign({}, nftFromGetNftResponse(ownedNft)), { balance: ownedNft.balance }));
			}
		} catch (e_1_1) {
			e_1 = { error: e_1_1 };
		} finally {
			try {
				if (_c && !_c.done && (_a = _b.return)) yield __await(_a.call(_b));
			} finally {
				if (e_1) throw e_1.error;
			}
		}
	});
}
function getNftsForOwner(config, owner, options, srcMethod = "getNftsForOwner") {
	return __awaiter$1(this, void 0, void 0, function* () {
		const withMetadata = omitMetadataToWithMetadata(options === null || options === void 0 ? void 0 : options.omitMetadata);
		const response = yield requestHttpWithBackoff(config, AlchemyApiType.NFT, "getNFTsForOwner", srcMethod, {
			contractAddresses: options === null || options === void 0 ? void 0 : options.contractAddresses,
			pageKey: options === null || options === void 0 ? void 0 : options.pageKey,
			excludeFilters: options === null || options === void 0 ? void 0 : options.excludeFilters,
			includeFilters: options === null || options === void 0 ? void 0 : options.includeFilters,
			owner,
			pageSize: options === null || options === void 0 ? void 0 : options.pageSize,
			withMetadata,
			tokenUriTimeoutInMs: options === null || options === void 0 ? void 0 : options.tokenUriTimeoutInMs,
			orderBy: options === null || options === void 0 ? void 0 : options.orderBy
		});
		if (withMetadata) return nullsToUndefined({
			ownedNfts: response.ownedNfts.map((res) => Object.assign(Object.assign({}, getNftFromRaw(res)), { balance: res.balance })),
			pageKey: response.pageKey,
			totalCount: response.totalCount,
			validAt: response.validAt
		});
		return nullsToUndefined({
			ownedNfts: response.ownedNfts.map((res) => Object.assign(Object.assign({}, getBaseNftFromRaw(res)), { balance: res.balance })),
			pageKey: response.pageKey,
			totalCount: response.totalCount,
			validAt: response.validAt
		});
	});
}
function getNftsForContract(config, contractAddress, options, srcMethod = "getNftsForContract") {
	var _a;
	return __awaiter$1(this, void 0, void 0, function* () {
		const withMetadata = omitMetadataToWithMetadata(options === null || options === void 0 ? void 0 : options.omitMetadata);
		const response = yield requestHttpWithBackoff(config, AlchemyApiType.NFT, "getNFTsForContract", srcMethod, {
			contractAddress,
			pageKey: options === null || options === void 0 ? void 0 : options.pageKey,
			withMetadata,
			limit: (_a = options === null || options === void 0 ? void 0 : options.pageSize) !== null && _a !== void 0 ? _a : void 0,
			tokenUriTimeoutInMs: options === null || options === void 0 ? void 0 : options.tokenUriTimeoutInMs
		});
		if (withMetadata) return nullsToUndefined({
			nfts: response.nfts.map((res) => getNftFromRaw(res)),
			pageKey: response.pageKey
		});
		return nullsToUndefined({
			nfts: response.nfts.map((res) => getBaseNftFromRaw(res, contractAddress)),
			pageKey: response.pageKey
		});
	});
}
function getNftsForContractIterator(config, contractAddress, options, srcMethod = "getNftsForContractIterator") {
	return __asyncGenerator(this, arguments, function* getNftsForContractIterator_1() {
		var e_2, _a;
		const withMetadata = omitMetadataToWithMetadata(options === null || options === void 0 ? void 0 : options.omitMetadata);
		try {
			for (var _b = __asyncValues(paginateEndpoint(config, AlchemyApiType.NFT, "getNFTsForContract", srcMethod, "pageKey", "pageKey", {
				contractAddress,
				pageKey: options === null || options === void 0 ? void 0 : options.pageKey,
				withMetadata
			})), _c; _c = yield __await(_b.next()), !_c.done;) {
				const response = _c.value;
				for (const nft of response.nfts) yield yield __await(nftFromGetNftContractResponse(nft, contractAddress));
			}
		} catch (e_2_1) {
			e_2 = { error: e_2_1 };
		} finally {
			try {
				if (_c && !_c.done && (_a = _b.return)) yield __await(_a.call(_b));
			} finally {
				if (e_2) throw e_2.error;
			}
		}
	});
}
function getOwnersForContract(config, contractAddress, options, srcMethod = "getOwnersForContract") {
	return __awaiter$1(this, void 0, void 0, function* () {
		const response = yield requestHttpWithBackoff(config, AlchemyApiType.NFT, "getOwnersForContract", srcMethod, Object.assign(Object.assign({}, options), { contractAddress }));
		if (options === null || options === void 0 ? void 0 : options.withTokenBalances) return nullsToUndefined({
			owners: response.owners,
			pageKey: response.pageKey
		});
		return nullsToUndefined({
			owners: response.owners,
			pageKey: response.pageKey
		});
	});
}
function getContractsForOwner(config, owner, options, srcMethod = "getContractsForOwner") {
	return __awaiter$1(this, void 0, void 0, function* () {
		const response = yield requestHttpWithBackoff(config, AlchemyApiType.NFT, "getContractsForOwner", srcMethod, {
			owner,
			excludeFilters: options === null || options === void 0 ? void 0 : options.excludeFilters,
			includeFilters: options === null || options === void 0 ? void 0 : options.includeFilters,
			pageKey: options === null || options === void 0 ? void 0 : options.pageKey,
			pageSize: options === null || options === void 0 ? void 0 : options.pageSize,
			orderBy: options === null || options === void 0 ? void 0 : options.orderBy
		});
		return nullsToUndefined({
			contracts: response.contracts.map(getNftContractsForOwnerFromRaw),
			pageKey: response.pageKey,
			totalCount: response.totalCount
		});
	});
}
function getOwnersForNft(config, contractAddress, tokenId, options, srcMethod = "getOwnersForNft") {
	return __awaiter$1(this, void 0, void 0, function* () {
		return requestHttpWithBackoff(config, AlchemyApiType.NFT, "getOwnersForNFT", srcMethod, Object.assign({
			contractAddress,
			tokenId: BigNumber.from(tokenId).toString()
		}, options));
	});
}
function getMintedNfts(config, owner, options) {
	return __awaiter$1(this, void 0, void 0, function* () {
		const ownerAddress = yield (yield config.getProvider())._getAddress(owner);
		const category = nftTokenTypeToCategory(options === null || options === void 0 ? void 0 : options.tokenType);
		const params = {
			fromBlock: "0x0",
			fromAddress: ETH_NULL_ADDRESS,
			toAddress: ownerAddress,
			excludeZeroValue: true,
			contractAddresses: options === null || options === void 0 ? void 0 : options.contractAddresses,
			category,
			maxCount: 100,
			pageKey: options === null || options === void 0 ? void 0 : options.pageKey
		};
		const response = yield getAssetTransfers(config, params, "getMintedNfts");
		return getNftsForTransfers(config, response);
	});
}
function getTransfersForOwner(config, owner, transferType, options) {
	return __awaiter$1(this, void 0, void 0, function* () {
		const ownerAddress = yield (yield config.getProvider())._getAddress(owner);
		const category = nftTokenTypeToCategory(options === null || options === void 0 ? void 0 : options.tokenType);
		const params = {
			fromBlock: "0x0",
			excludeZeroValue: true,
			contractAddresses: options === null || options === void 0 ? void 0 : options.contractAddresses,
			category,
			maxCount: 100,
			pageKey: options === null || options === void 0 ? void 0 : options.pageKey
		};
		if (transferType === GetTransfersForOwnerTransferType.TO) params.toAddress = ownerAddress;
		else params.fromAddress = ownerAddress;
		const transfersResponse = yield getAssetTransfers(config, params, "getTransfersForOwner");
		return getNftsForTransfers(config, transfersResponse);
	});
}
function getTransfersForContract(config, contract, options) {
	return __awaiter$1(this, void 0, void 0, function* () {
		const category = [
			AssetTransfersCategory.ERC721,
			AssetTransfersCategory.ERC1155,
			AssetTransfersCategory.SPECIALNFT
		];
		const provider = yield config.getProvider();
		const fromBlock = (options === null || options === void 0 ? void 0 : options.fromBlock) ? provider.formatter.blockTag(yield provider._getBlockTag(options.fromBlock)) : "0x0";
		const toBlock = (options === null || options === void 0 ? void 0 : options.toBlock) ? provider.formatter.blockTag(yield provider._getBlockTag(options.toBlock)) : void 0;
		const params = {
			fromBlock,
			toBlock,
			excludeZeroValue: true,
			contractAddresses: [contract],
			order: options === null || options === void 0 ? void 0 : options.order,
			category,
			maxCount: 100,
			pageKey: options === null || options === void 0 ? void 0 : options.pageKey
		};
		const transfersResponse = yield getAssetTransfers(config, params, "getTransfersForContract");
		return getNftsForTransfers(config, transfersResponse);
	});
}
function nftTokenTypeToCategory(tokenType) {
	switch (tokenType) {
		case NftTokenType.ERC721: return [AssetTransfersCategory.ERC721];
		case NftTokenType.ERC1155: return [AssetTransfersCategory.ERC1155];
		default: return [
			AssetTransfersCategory.ERC721,
			AssetTransfersCategory.ERC1155,
			AssetTransfersCategory.SPECIALNFT
		];
	}
}
function parse1155Transfer(transfer) {
	return transfer.erc1155Metadata.map((metadata) => ({
		contractAddress: transfer.rawContract.address,
		tokenId: metadata.tokenId,
		tokenType: NftTokenType.ERC1155
	}));
}
function verifyNftOwnership(config, owner, contractAddresses, srcMethod = "verifyNftOwnership") {
	return __awaiter$1(this, void 0, void 0, function* () {
		if (typeof contractAddresses === "string") return (yield getNftsForOwner(config, owner, {
			contractAddresses: [contractAddresses],
			omitMetadata: true
		}, srcMethod)).ownedNfts.length > 0;
		else {
			if (contractAddresses.length === 0) throw new Error("Must provide at least one contract address");
			const response = yield getNftsForOwner(config, owner, {
				contractAddresses,
				omitMetadata: true
			}, srcMethod);
			const result = contractAddresses.reduce((acc, curr) => {
				acc[curr] = false;
				return acc;
			}, {});
			for (const nft of response.ownedNfts) result[nft.contractAddress] = true;
			return result;
		}
	});
}
function isSpamContract(config, contractAddress, srcMethod = "isSpamContract") {
	return __awaiter$1(this, void 0, void 0, function* () {
		return requestHttpWithBackoff(config, AlchemyApiType.NFT, "isSpamContract", srcMethod, { contractAddress });
	});
}
function getSpamContracts(config, srcMethod = "getSpamContracts") {
	return __awaiter$1(this, void 0, void 0, function* () {
		return requestHttpWithBackoff(config, AlchemyApiType.NFT, "getSpamContracts", srcMethod, void 0);
	});
}
function reportSpam(config, contractAddress, srcMethod = "reportSpam") {
	return __awaiter$1(this, void 0, void 0, function* () {
		requestHttpWithBackoff(config, AlchemyApiType.NFT, "reportSpam", srcMethod, { contractAddress });
	});
}
function isAirdropNft(config, contractAddress, tokenId, srcMethod = "isAirdropNft") {
	return __awaiter$1(this, void 0, void 0, function* () {
		return requestHttpWithBackoff(config, AlchemyApiType.NFT, "isAirdropNFT", srcMethod, {
			contractAddress,
			tokenId
		});
	});
}
function getFloorPrice(config, contractAddress, srcMethod = "getFloorPrice") {
	return __awaiter$1(this, void 0, void 0, function* () {
		const response = yield requestHttpWithBackoff(config, AlchemyApiType.NFT, "getFloorPrice", srcMethod, { contractAddress });
		return nullsToUndefined(response);
	});
}
function getNftSales(config, options = {}, srcMethod = "getNftSales") {
	return __awaiter$1(this, void 0, void 0, function* () {
		const params = Object.assign({}, options);
		const response = yield requestHttpWithBackoff(config, AlchemyApiType.NFT, "getNFTSales", srcMethod, {
			fromBlock: params === null || params === void 0 ? void 0 : params.fromBlock,
			toBlock: params === null || params === void 0 ? void 0 : params.toBlock,
			order: params === null || params === void 0 ? void 0 : params.order,
			marketplace: params === null || params === void 0 ? void 0 : params.marketplace,
			contractAddress: params === null || params === void 0 ? void 0 : params.contractAddress,
			tokenId: (params === null || params === void 0 ? void 0 : params.tokenId) ? BigNumber.from(params === null || params === void 0 ? void 0 : params.tokenId).toString() : void 0,
			sellerAddress: params === null || params === void 0 ? void 0 : params.sellerAddress,
			buyerAddress: params === null || params === void 0 ? void 0 : params.buyerAddress,
			taker: params === null || params === void 0 ? void 0 : params.taker,
			limit: params === null || params === void 0 ? void 0 : params.limit,
			pageKey: params === null || params === void 0 ? void 0 : params.pageKey
		});
		return getNftSalesFromRaw(response);
	});
}
function computeRarity(config, contractAddress, tokenId, srcMethod = "computeRarity") {
	return __awaiter$1(this, void 0, void 0, function* () {
		const response = yield requestHttpWithBackoff(config, AlchemyApiType.NFT, "computeRarity", srcMethod, {
			contractAddress,
			tokenId: BigNumber.from(tokenId).toString()
		});
		return nullsToUndefined(response);
	});
}
function searchContractMetadata(config, query, srcMethod = "searchContractMetadata") {
	return __awaiter$1(this, void 0, void 0, function* () {
		return { contracts: (yield requestHttpWithBackoff(config, AlchemyApiType.NFT, "searchContractMetadata", srcMethod, { query })).contracts.map(getNftContractFromRaw) };
	});
}
function summarizeNftAttributes(config, contractAddress, srcMethod = "summarizeNftAttributes") {
	return __awaiter$1(this, void 0, void 0, function* () {
		return requestHttpWithBackoff(config, AlchemyApiType.NFT, "summarizeNFTAttributes", srcMethod, { contractAddress });
	});
}
function refreshNftMetadata(config, contractAddress, tokenId, srcMethod = "refreshNftMetadata") {
	return __awaiter$1(this, void 0, void 0, function* () {
		const tokenIdString = BigNumber.from(tokenId).toString();
		const first = yield getNftMetadata(config, contractAddress, tokenIdString, void 0, srcMethod);
		const second = yield refresh(config, contractAddress, tokenIdString, srcMethod);
		return first.timeLastUpdated !== second.timeLastUpdated;
	});
}
function refreshContract(config, contractAddress, srcMethod = "refreshContract") {
	return __awaiter$1(this, void 0, void 0, function* () {
		const response = yield requestHttpWithBackoff(config, AlchemyApiType.NFT, "reingestContract", srcMethod, { contractAddress });
		return {
			contractAddress: response.contractAddress,
			refreshState: parseReingestionState(response.reingestionState),
			progress: response.progress
		};
	});
}
function refresh(config, contractAddress, tokenId, srcMethod) {
	return __awaiter$1(this, void 0, void 0, function* () {
		const response = yield requestHttpWithBackoff(config, AlchemyApiType.NFT, "getNFTMetadata", srcMethod, {
			contractAddress,
			tokenId: BigNumber.from(tokenId).toString(),
			refreshCache: true
		});
		return getNftFromRaw(response);
	});
}
function nftFromGetNftResponse(ownedNft) {
	if (isNftWithMetadata(ownedNft)) return getNftFromRaw(ownedNft);
	else return getBaseNftFromRaw(ownedNft);
}
function nftFromGetNftContractResponse(ownedNft, contractAddress) {
	if (isNftWithMetadata(ownedNft)) return getNftFromRaw(ownedNft);
	else return getBaseNftFromRaw(ownedNft, contractAddress);
}
function isNftWithMetadata(response) {
	return response.name !== void 0;
}
function getNftsForTransfers(config, response) {
	return __awaiter$1(this, void 0, void 0, function* () {
		const metadataTransfers = response.transfers.filter((transfer) => transfer.rawContract.address !== null).flatMap((transfer) => {
			var _a;
			const tokens = getTokensFromTransfer(transfer);
			const metadata = {
				from: transfer.from,
				to: (_a = transfer.to) !== null && _a !== void 0 ? _a : void 0,
				transactionHash: transfer.hash,
				blockNumber: transfer.blockNum
			};
			return tokens.map((token) => ({
				metadata,
				token
			}));
		});
		if (metadataTransfers.length === 0) return { nfts: [] };
		const batchSize = 100;
		const requestBatches = [];
		for (let i = 0; i < metadataTransfers.length; i += batchSize) requestBatches.push(metadataTransfers.slice(i, i + batchSize));
		const nfts = (yield Promise.all(requestBatches.map((batch) => getNftMetadataBatch(config, batch.map((transfer) => transfer.token))))).map((r) => r.nfts).flat();
		const nftsByTokenId = /* @__PURE__ */ new Map();
		nfts.forEach((nft) => {
			const key = `${nft.contract.address.toLowerCase()}-${BigNumber.from(nft.tokenId).toString()}`;
			nftsByTokenId.set(key, nft);
		});
		return {
			nfts: metadataTransfers.map((t) => {
				const key = `${t.token.contractAddress.toLowerCase()}-${BigNumber.from(t.token.tokenId).toString()}`;
				return Object.assign(Object.assign({}, nftsByTokenId.get(key)), t.metadata);
			}),
			pageKey: response.pageKey
		};
	});
}
function getTokensFromTransfer(transfer) {
	if (transfer.category === AssetTransfersCategory.ERC1155) return parse1155Transfer(transfer);
	else return [{
		contractAddress: transfer.rawContract.address,
		tokenId: transfer.tokenId,
		tokenType: transfer.category === AssetTransfersCategory.ERC721 ? NftTokenType.ERC721 : void 0
	}];
}
function omitMetadataToWithMetadata(omitMetadata) {
	return omitMetadata === void 0 ? true : !omitMetadata;
}
function parseReingestionState(reingestionState) {
	switch (reingestionState) {
		case "does_not_exist": return NftRefreshState.DOES_NOT_EXIST;
		case "already_queued": return NftRefreshState.ALREADY_QUEUED;
		case "in_progress": return NftRefreshState.IN_PROGRESS;
		case "finished": return NftRefreshState.FINISHED;
		case "queued": return NftRefreshState.QUEUED;
		case "queue_failed": return NftRefreshState.QUEUE_FAILED;
		default: throw new Error("Unknown reingestion state: " + reingestionState);
	}
}
var NftNamespace = class {
	constructor(config) {
		this.config = config;
	}
	getNftMetadata(contractAddress, tokenId, optionsOrTokenType, tokenUriTimeoutInMs) {
		let options;
		if (typeof optionsOrTokenType === "object") options = {
			tokenType: optionsOrTokenType.tokenType,
			tokenUriTimeoutInMs: optionsOrTokenType.tokenUriTimeoutInMs,
			refreshCache: optionsOrTokenType.refreshCache
		};
		else options = {
			tokenType: optionsOrTokenType,
			tokenUriTimeoutInMs
		};
		return getNftMetadata(this.config, contractAddress, tokenId, options);
	}
	getNftMetadataBatch(tokens, options) {
		return getNftMetadataBatch(this.config, tokens, options);
	}
	getContractMetadata(contractAddress) {
		return getContractMetadata(this.config, contractAddress);
	}
	getContractMetadataBatch(contractAddresses) {
		return getContractMetadataBatch(this.config, contractAddresses);
	}
	getCollectionMetadata(collectionSlug) {
		return getCollectionMetadata(this.config, collectionSlug);
	}
	getNftsForOwnerIterator(owner, options) {
		return getNftsForOwnerIterator(this.config, owner, options);
	}
	getNftsForOwner(owner, options) {
		return getNftsForOwner(this.config, owner, options);
	}
	getNftsForContract(contractAddress, options) {
		return getNftsForContract(this.config, contractAddress, options);
	}
	getNftsForContractIterator(contractAddress, options) {
		return getNftsForContractIterator(this.config, contractAddress, options);
	}
	getOwnersForContract(contractAddress, options) {
		return getOwnersForContract(this.config, contractAddress, options);
	}
	getOwnersForNft(contractAddress, tokenId, options) {
		return getOwnersForNft(this.config, contractAddress, tokenId, options);
	}
	getContractsForOwner(owner, options) {
		return getContractsForOwner(this.config, owner, options);
	}
	getTransfersForOwner(owner, category, options) {
		return getTransfersForOwner(this.config, owner, category, options);
	}
	getTransfersForContract(contract, options) {
		return getTransfersForContract(this.config, contract, options);
	}
	getMintedNfts(owner, options) {
		return __awaiter$1(this, void 0, void 0, function* () {
			return getMintedNfts(this.config, owner, options);
		});
	}
	verifyNftOwnership(owner, contractAddress) {
		return verifyNftOwnership(this.config, owner, contractAddress);
	}
	isSpamContract(contractAddress) {
		return isSpamContract(this.config, contractAddress);
	}
	getSpamContracts() {
		return getSpamContracts(this.config);
	}
	reportSpam(contractAddress) {
		return reportSpam(this.config, contractAddress);
	}
	isAirdropNft(contractAddress, tokenId) {
		return isAirdropNft(this.config, contractAddress, tokenId);
	}
	getFloorPrice(contractAddress) {
		return getFloorPrice(this.config, contractAddress);
	}
	getNftSales(options) {
		return getNftSales(this.config, options);
	}
	computeRarity(contractAddress, tokenId) {
		return computeRarity(this.config, contractAddress, tokenId);
	}
	searchContractMetadata(query) {
		return searchContractMetadata(this.config, query);
	}
	summarizeNftAttributes(contractAddress) {
		return summarizeNftAttributes(this.config, contractAddress);
	}
	refreshNftMetadata(contractAddress, tokenId) {
		return refreshNftMetadata(this.config, contractAddress, tokenId);
	}
	refreshContract(contractAddress) {
		return refreshContract(this.config, contractAddress);
	}
};
var NotifyNamespace = class {
	constructor(config) {
		this.config = config;
	}
	getAllWebhooks() {
		return __awaiter$1(this, void 0, void 0, function* () {
			this.verifyConfig();
			const response = yield this.sendWebhookRequest("team-webhooks", "getAllWebhooks", {});
			return {
				webhooks: parseRawWebhookResponse(response),
				totalCount: response.data.length
			};
		});
	}
	getAddresses(webhookOrId, options) {
		return __awaiter$1(this, void 0, void 0, function* () {
			this.verifyConfig();
			const webhookId = typeof webhookOrId === "string" ? webhookOrId : webhookOrId.id;
			const response = yield this.sendWebhookRequest("webhook-addresses", "getAddresses", {
				webhook_id: webhookId,
				limit: options === null || options === void 0 ? void 0 : options.limit,
				after: options === null || options === void 0 ? void 0 : options.pageKey
			});
			return parseRawAddressActivityResponse(response);
		});
	}
	getGraphqlQuery(webhookOrId) {
		return __awaiter$1(this, void 0, void 0, function* () {
			this.verifyConfig();
			const webhookId = typeof webhookOrId === "string" ? webhookOrId : webhookOrId.id;
			const response = yield this.sendWebhookRequest("dashboard-webhook-graphql-query", "getGraphqlQuery", { webhook_id: webhookId });
			return parseRawCustomGraphqlWebhookResponse(response);
		});
	}
	getNftFilters(webhookOrId, options) {
		return __awaiter$1(this, void 0, void 0, function* () {
			this.verifyConfig();
			const webhookId = typeof webhookOrId === "string" ? webhookOrId : webhookOrId.id;
			const response = yield this.sendWebhookRequest("webhook-nft-filters", "getNftFilters", {
				webhook_id: webhookId,
				limit: options === null || options === void 0 ? void 0 : options.limit,
				after: options === null || options === void 0 ? void 0 : options.pageKey
			});
			return parseRawNftFiltersResponse(response);
		});
	}
	updateWebhook(webhookOrId, update) {
		return __awaiter$1(this, void 0, void 0, function* () {
			const webhookId = typeof webhookOrId === "string" ? webhookOrId : webhookOrId.id;
			let restApiName;
			let methodName;
			let method;
			let data;
			if ("isActive" in update) {
				restApiName = "update-webhook";
				methodName = "updateWebhook";
				method = "PUT";
				data = {
					webhook_id: webhookId,
					is_active: update.isActive
				};
			} else if ("addFilters" in update || "removeFilters" in update) {
				restApiName = "update-webhook-nft-filters";
				methodName = "updateWebhookNftFilters";
				method = "PATCH";
				data = {
					webhook_id: webhookId,
					nft_filters_to_add: update.addFilters ? update.addFilters.map(nftFilterToParam) : [],
					nft_filters_to_remove: update.removeFilters ? update.removeFilters.map(nftFilterToParam) : []
				};
			} else if ("addMetadataFilters" in update || "removeMetadataFilters" in update) {
				restApiName = "update-webhook-nft-metadata-filters";
				methodName = "updateWebhookNftMetadataFilters";
				method = "PATCH";
				data = {
					webhook_id: webhookId,
					nft_metadata_filters_to_add: update.addMetadataFilters ? update.addMetadataFilters.map(nftFilterToParam) : [],
					nft_metadata_filters_to_remove: update.removeMetadataFilters ? update.removeMetadataFilters.map(nftFilterToParam) : []
				};
			} else if ("addAddresses" in update || "removeAddresses" in update) {
				restApiName = "update-webhook-addresses";
				methodName = "webhook:updateWebhookAddresses";
				method = "PATCH";
				data = {
					webhook_id: webhookId,
					addresses_to_add: yield this.resolveAddresses(update.addAddresses),
					addresses_to_remove: yield this.resolveAddresses(update.removeAddresses)
				};
			} else if ("newAddresses" in update) {
				restApiName = "update-webhook-addresses";
				methodName = "webhook:updateWebhookAddress";
				method = "PUT";
				data = {
					webhook_id: webhookId,
					addresses: yield this.resolveAddresses(update.newAddresses)
				};
			} else throw new Error("Invalid `update` param passed into `updateWebhook`");
			yield this.sendWebhookRequest(restApiName, methodName, {}, {
				method,
				data
			});
		});
	}
	createWebhook(url, type, params) {
		return __awaiter$1(this, void 0, void 0, function* () {
			let appId;
			if (type === WebhookType.MINED_TRANSACTION || type === WebhookType.DROPPED_TRANSACTION || type === WebhookType.GRAPHQL) {
				if (!("appId" in params)) throw new Error("Transaction and GraphQL Webhooks require an app id.");
				appId = params.appId;
			}
			let network = NETWORK_TO_WEBHOOK_NETWORK.get(this.config.network);
			let nftFilterObj;
			let addresses;
			let graphqlQuery;
			let skipEmptyMessages;
			if (type === WebhookType.NFT_ACTIVITY || type === WebhookType.NFT_METADATA_UPDATE) {
				if (!("filters" in params) || params.filters.length === 0) throw new Error("Nft Activity Webhooks require a non-empty array input.");
				network = params.network ? NETWORK_TO_WEBHOOK_NETWORK.get(params.network) : network;
				const filters = params.filters.map((filter) => filter.tokenId ? {
					contract_address: filter.contractAddress,
					token_id: BigNumber.from(filter.tokenId).toString()
				} : { contract_address: filter.contractAddress });
				nftFilterObj = type === WebhookType.NFT_ACTIVITY ? { nft_filters: filters } : { nft_metadata_filters: filters };
			} else if (type === WebhookType.ADDRESS_ACTIVITY) {
				if (params === void 0 || !("addresses" in params) || params.addresses.length === 0) throw new Error("Address Activity Webhooks require a non-empty array input.");
				network = params.network ? NETWORK_TO_WEBHOOK_NETWORK.get(params.network) : network;
				addresses = yield this.resolveAddresses(params.addresses);
			} else if (type == WebhookType.GRAPHQL) {
				if (params === void 0 || !("graphqlQuery" in params) || params.graphqlQuery.length === 0) throw new Error("Custom Webhooks require a non-empty graphql query.");
				network = params.network ? NETWORK_TO_WEBHOOK_NETWORK.get(params.network) : network;
				graphqlQuery = params.graphqlQuery;
				skipEmptyMessages = params.skipEmptyMessages;
			}
			const data = Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({
				network,
				webhook_type: type,
				webhook_url: url
			}, appId && { app_id: appId }), params.name && { name: params.name }), nftFilterObj), addresses && { addresses }), graphqlQuery && { graphql_query: {
				query: graphqlQuery,
				skip_empty_messages: !!skipEmptyMessages
			} });
			const response = yield this.sendWebhookRequest("create-webhook", "createWebhook", {}, {
				method: "POST",
				data
			});
			return parseRawWebhook(response.data);
		});
	}
	deleteWebhook(webhookOrId) {
		return __awaiter$1(this, void 0, void 0, function* () {
			this.verifyConfig();
			const webhookId = typeof webhookOrId === "string" ? webhookOrId : webhookOrId.id;
			if ("message" in (yield this.sendWebhookRequest("delete-webhook", "deleteWebhook", { webhook_id: webhookId }, { method: "DELETE" }))) throw new Error(`Webhook not found. Failed to delete webhook: ${webhookId}`);
		});
	}
	verifyConfig() {
		if (this.config.authToken === void 0) throw new Error("Using the Notify API requires setting the Alchemy Auth Token in the settings object when initializing Alchemy.");
	}
	sendWebhookRequest(restApiName, methodName, params, overrides) {
		return requestHttpWithBackoff(this.config, AlchemyApiType.WEBHOOK, restApiName, methodName, params, Object.assign(Object.assign({}, overrides), { headers: Object.assign({ "X-Alchemy-Token": this.config.authToken }, overrides === null || overrides === void 0 ? void 0 : overrides.headers) }));
	}
	resolveAddresses(addresses) {
		return __awaiter$1(this, void 0, void 0, function* () {
			if (addresses === void 0) return [];
			const resolvedAddresses = [];
			const provider = yield this.config.getProvider();
			for (const address of addresses) {
				const rawAddress = yield provider.resolveName(address);
				if (rawAddress === null) throw new Error(`Unable to resolve the ENS address: ${address}`);
				resolvedAddresses.push(rawAddress);
			}
			return resolvedAddresses;
		});
	}
};
var WEBHOOK_NETWORK_TO_NETWORK = Object.fromEntries(Object.entries(Network));
var NETWORK_TO_WEBHOOK_NETWORK = Object.keys(Network).reduce((map, key) => {
	if (key in WEBHOOK_NETWORK_TO_NETWORK) map.set(WEBHOOK_NETWORK_TO_NETWORK[key], key);
	return map;
}, /* @__PURE__ */ new Map());
function parseRawWebhookResponse(response) {
	return response.data.map(parseRawWebhook);
}
function parseRawWebhook(rawWebhook) {
	return Object.assign(Object.assign({
		id: rawWebhook.id,
		network: WEBHOOK_NETWORK_TO_NETWORK[rawWebhook.network],
		type: rawWebhook.webhook_type,
		url: rawWebhook.webhook_url,
		isActive: rawWebhook.is_active,
		timeCreated: new Date(rawWebhook.time_created).toISOString(),
		signingKey: rawWebhook.signing_key,
		version: rawWebhook.version
	}, rawWebhook.app_id !== void 0 && { appId: rawWebhook.app_id }), rawWebhook.name !== void 0 && { name: rawWebhook.name });
}
function parseRawAddressActivityResponse(response) {
	return {
		addresses: response.data,
		totalCount: response.pagination.total_count,
		pageKey: response.pagination.cursors.after
	};
}
function parseRawCustomGraphqlWebhookResponse(response) {
	return { graphqlQuery: response.data.graphql_query };
}
function parseRawNftFiltersResponse(response) {
	return {
		filters: response.data.map((f) => f.token_id ? {
			contractAddress: f.contract_address,
			tokenId: BigNumber.from(f.token_id).toString()
		} : { contractAddress: f.contract_address }),
		totalCount: response.pagination.total_count,
		pageKey: response.pagination.cursors.after
	};
}
function nftFilterToParam(filter) {
	return filter.tokenId ? {
		contract_address: filter.contractAddress,
		token_id: BigNumber.from(filter.tokenId).toString()
	} : { contract_address: filter.contractAddress };
}
function getTokensByWallet(config, addresses, withMetadata = true, withPrices = true, includeNativeTokens = true, srcMethod = "getTokensByWallet") {
	return __awaiter$1(this, void 0, void 0, function* () {
		const data = {
			addresses,
			withMetadata,
			withPrices,
			includeNativeTokens
		};
		const response = yield requestHttpWithBackoff(config, AlchemyApiType.PORTFOLIO, "assets/tokens/by-address", srcMethod, {}, {
			data,
			method: "POST"
		});
		return nullsToUndefined(response);
	});
}
function getTokenBalancesByWallet(config, addresses, includeNativeTokens = true, srcMethod = "getTokenBalancesByWallet") {
	return __awaiter$1(this, void 0, void 0, function* () {
		const data = {
			addresses,
			includeNativeTokens
		};
		const response = yield requestHttpWithBackoff(config, AlchemyApiType.PORTFOLIO, "assets/tokens/balances/by-address", srcMethod, {}, {
			method: "POST",
			data
		});
		return nullsToUndefined(response);
	});
}
function getNftsByWallet(config, addresses, withMetadata = true, pageKey = void 0, pageSize = void 0, srcMethod = "getNftsByWallet") {
	return __awaiter$1(this, void 0, void 0, function* () {
		const data = {
			addresses,
			withMetadata,
			pageKey,
			pageSize
		};
		const response = yield requestHttpWithBackoff(config, AlchemyApiType.PORTFOLIO, "assets/nfts/by-address", srcMethod, {}, {
			method: "POST",
			data
		});
		return nullsToUndefined(response);
	});
}
function getNftCollectionsByWallet(config, addresses, withMetadata = true, pageKey = void 0, pageSize = void 0, srcMethod = "getNftCollectionsByWallet") {
	return __awaiter$1(this, void 0, void 0, function* () {
		const data = {
			addresses,
			pageKey,
			pageSize,
			withMetadata
		};
		const response = yield requestHttpWithBackoff(config, AlchemyApiType.PORTFOLIO, "assets/nfts/contracts/by-address", srcMethod, {}, {
			method: "POST",
			data
		});
		return nullsToUndefined(response);
	});
}
function getTransactionsByWallet(config, addresses, before = void 0, after = void 0, limit = void 0, srcMethod = "getTransactionsByWallet") {
	return __awaiter$1(this, void 0, void 0, function* () {
		const data = {
			addresses,
			before,
			after,
			limit
		};
		const response = yield requestHttpWithBackoff(config, AlchemyApiType.PORTFOLIO, "transactions/history/by-address", srcMethod, {}, {
			method: "POST",
			data
		});
		return nullsToUndefined(response);
	});
}
var PortfolioNamespace = class {
	constructor(config) {
		this.config = config;
	}
	getTokensByWallet(addresses, withMetadata = true, withPrices = true, includeNativeTokens = true) {
		return getTokensByWallet(this.config, addresses, withMetadata, withPrices, includeNativeTokens);
	}
	getTokenBalancesByWallet(addresses, includeNativeTokens = true) {
		return getTokenBalancesByWallet(this.config, addresses, includeNativeTokens);
	}
	getNftsByWallet(addresses, withMetadata = true, pageKey, pageSize) {
		return getNftsByWallet(this.config, addresses, withMetadata, pageKey, pageSize);
	}
	getNftCollectionsByWallet(addresses, withMetadata = true, pageKey, pageSize) {
		return getNftCollectionsByWallet(this.config, addresses, withMetadata, pageKey, pageSize);
	}
	getTransactionsByWallet(addresses, before, after, limit) {
		return getTransactionsByWallet(this.config, addresses, before, after, limit);
	}
};
function getTokenPriceByAddress(config, addresses, srcMethod = "getTokenPriceByAddress") {
	return __awaiter$1(this, void 0, void 0, function* () {
		const response = yield requestHttpWithBackoff(config, AlchemyApiType.PRICES, "tokens/by-address", srcMethod, {}, {
			method: "POST",
			data: { addresses }
		});
		return nullsToUndefined(response);
	});
}
function getTokenPriceBySymbol(config, symbols, srcMethod = "getTokenPriceBySymbol") {
	return __awaiter$1(this, void 0, void 0, function* () {
		const response = yield requestHttpWithBackoff(config, AlchemyApiType.PRICES, "tokens/by-symbol", srcMethod, { symbols }, { paramsSerializer: (params) => {
			const searchParams = new URLSearchParams();
			Object.entries(params).forEach(([key, value]) => {
				value.forEach((v) => searchParams.append(key, v));
			});
			return searchParams.toString();
		} });
		return nullsToUndefined(response);
	});
}
function getHistoricalPriceBySymbol(config, symbol, startTime, endTime, interval, srcMethod = "getHistoricalPriceBySymbol") {
	return __awaiter$1(this, void 0, void 0, function* () {
		const response = yield requestHttpWithBackoff(config, AlchemyApiType.PRICES, "tokens/historical", srcMethod, {}, {
			method: "POST",
			data: {
				symbol,
				startTime,
				endTime,
				interval
			}
		});
		return nullsToUndefined(response);
	});
}
function getHistoricalPriceByAddress(config, network, address, startTime, endTime, interval, srcMethod = "getHistoricalPriceByAddress") {
	return __awaiter$1(this, void 0, void 0, function* () {
		const response = yield requestHttpWithBackoff(config, AlchemyApiType.PRICES, "tokens/historical", srcMethod, {}, {
			method: "POST",
			data: {
				network,
				address,
				startTime,
				endTime,
				interval
			}
		});
		return nullsToUndefined(response);
	});
}
var PricesNamespace = class {
	constructor(config) {
		this.config = config;
	}
	getTokenPriceByAddress(addresses) {
		return getTokenPriceByAddress(this.config, addresses);
	}
	getTokenPriceBySymbol(symbols) {
		return getTokenPriceBySymbol(this.config, symbols);
	}
	getHistoricalPriceBySymbol(symbol, startTime, endTime, interval) {
		return getHistoricalPriceBySymbol(this.config, symbol, startTime, endTime, interval);
	}
	getHistoricalPriceByAddress(network, address, startTime, endTime, interval) {
		return getHistoricalPriceByAddress(this.config, network, address, startTime, endTime, interval);
	}
};
var GAS_OPTIMIZED_TX_FEE_MULTIPLES = [
	.9,
	1,
	1.1,
	1.2,
	1.3
];
var TransactNamespace = class {
	constructor(config) {
		this.config = config;
	}
	sendPrivateTransaction(signedTransaction, maxBlockNumber, options) {
		return __awaiter$1(this, void 0, void 0, function* () {
			const provider = yield this.config.getProvider();
			const hexBlockNumber = maxBlockNumber ? toHex(maxBlockNumber) : void 0;
			return provider._send("eth_sendPrivateTransaction", [{
				tx: signedTransaction,
				maxBlockNumber: hexBlockNumber,
				preferences: options
			}], "sendPrivateTransaction");
		});
	}
	cancelPrivateTransaction(transactionHash) {
		return __awaiter$1(this, void 0, void 0, function* () {
			return (yield this.config.getProvider())._send("eth_cancelPrivateTransaction", [{ txHash: transactionHash }], "cancelPrivateTransaction");
		});
	}
	simulateAssetChangesBundle(transactions, blockIdentifier) {
		return __awaiter$1(this, void 0, void 0, function* () {
			const provider = yield this.config.getProvider();
			const params = blockIdentifier !== void 0 ? [transactions, blockIdentifier] : [transactions];
			const res = yield provider._send("alchemy_simulateAssetChangesBundle", params, "simulateAssetChangesBundle");
			return nullsToUndefined(res);
		});
	}
	simulateAssetChanges(transaction, blockIdentifier) {
		return __awaiter$1(this, void 0, void 0, function* () {
			const provider = yield this.config.getProvider();
			const params = blockIdentifier !== void 0 ? [transaction, blockIdentifier] : [transaction];
			const res = yield provider._send("alchemy_simulateAssetChanges", params, "simulateAssetChanges");
			return nullsToUndefined(res);
		});
	}
	simulateExecutionBundle(transactions, blockIdentifier) {
		return __awaiter$1(this, void 0, void 0, function* () {
			const provider = yield this.config.getProvider();
			const params = blockIdentifier !== void 0 ? [transactions, blockIdentifier] : [transactions];
			const res = provider._send("alchemy_simulateExecutionBundle", params, "simulateExecutionBundle");
			return nullsToUndefined(res);
		});
	}
	simulateExecution(transaction, blockIdentifier) {
		return __awaiter$1(this, void 0, void 0, function* () {
			const provider = yield this.config.getProvider();
			const params = blockIdentifier !== void 0 ? [transaction, blockIdentifier] : [transaction];
			const res = provider._send("alchemy_simulateExecution", params, "simulateExecution");
			return nullsToUndefined(res);
		});
	}
	getTransaction(transactionHash) {
		return __awaiter$1(this, void 0, void 0, function* () {
			return (yield this.config.getProvider()).getTransaction(transactionHash);
		});
	}
	sendTransaction(signedTransaction) {
		return __awaiter$1(this, void 0, void 0, function* () {
			return (yield this.config.getProvider()).sendTransaction(signedTransaction);
		});
	}
	estimateGas(transaction) {
		return __awaiter$1(this, void 0, void 0, function* () {
			return (yield this.config.getProvider()).estimateGas(transaction);
		});
	}
	getMaxPriorityFeePerGas() {
		return __awaiter$1(this, void 0, void 0, function* () {
			const feeHex = yield (yield this.config.getProvider())._send("eth_maxPriorityFeePerGas", [], "getMaxPriorityFeePerGas");
			return fromHex(feeHex);
		});
	}
	waitForTransaction(transactionHash, confirmations, timeout) {
		return __awaiter$1(this, void 0, void 0, function* () {
			return (yield this.config.getProvider()).waitForTransaction(transactionHash, confirmations, timeout);
		});
	}
	sendGasOptimizedTransaction(transactionOrSignedTxs, wallet) {
		return __awaiter$1(this, void 0, void 0, function* () {
			if (Array.isArray(transactionOrSignedTxs)) return this._sendGasOptimizedTransaction(transactionOrSignedTxs, "sendGasOptimizedTransactionPreSigned");
			let gasLimit;
			let priorityFee;
			let baseFee;
			const provider = yield this.config.getProvider();
			try {
				gasLimit = yield this.estimateGas(transactionOrSignedTxs);
				priorityFee = yield this.getMaxPriorityFeePerGas();
				baseFee = (yield provider.getBlock("latest")).baseFeePerGas.toNumber();
			} catch (e) {
				throw new Error(`Failed to estimate gas for transaction: ${e}`);
			}
			const gasSpreadTransactions = generateGasSpreadTransactions(transactionOrSignedTxs, gasLimit.toNumber(), baseFee, priorityFee);
			const signedTransactions = yield Promise.all(gasSpreadTransactions.map((tx) => wallet.signTransaction(tx)));
			return this._sendGasOptimizedTransaction(signedTransactions, "sendGasOptimizedTransactionGenerated");
		});
	}
	getGasOptimizedTransactionStatus(trackingId) {
		return __awaiter$1(this, void 0, void 0, function* () {
			return (yield this.config.getProvider())._send("alchemy_getGasOptimizedTransactionStatus", [trackingId], "getGasOptimizedTransactionStatus");
		});
	}
	_sendGasOptimizedTransaction(signedTransactions, methodName) {
		return __awaiter$1(this, void 0, void 0, function* () {
			return (yield this.config.getProvider())._send("alchemy_sendGasOptimizedTransaction", [{ rawTransactions: signedTransactions }], methodName);
		});
	}
};
function generateGasSpreadTransactions(transaction, gasLimit, baseFee, priorityFee) {
	return GAS_OPTIMIZED_TX_FEE_MULTIPLES.map((feeMultiplier) => {
		return Object.assign(Object.assign({}, transaction), {
			gasLimit,
			maxFeePerGas: Math.round(baseFee * feeMultiplier + priorityFee * feeMultiplier),
			maxPriorityFeePerGas: Math.round(feeMultiplier * priorityFee)
		});
	});
}
var ALCHEMY_PENDING_TRANSACTIONS_EVENT_TYPE = "alchemy-pending-transactions";
var ALCHEMY_MINED_TRANSACTIONS_EVENT_TYPE = "alchemy-mined-transactions";
var ALCHEMY_EVENT_TYPES = [ALCHEMY_PENDING_TRANSACTIONS_EVENT_TYPE, ALCHEMY_MINED_TRANSACTIONS_EVENT_TYPE];
var Event = class {
	constructor(tag, listener, once) {
		this.listener = listener;
		this.tag = tag;
		this.once = once;
		this._lastBlockNumber = -2;
		this._inflight = false;
	}
	get event() {
		switch (this.type) {
			case "tx": return this.hash;
			case "filter": return this.filter;
			default: return this.tag;
		}
	}
	get type() {
		return this.tag.split(":")[0];
	}
	get hash() {
		const comps = this.tag.split(":");
		if (comps[0] !== "tx") throw new Error("Not a transaction event");
		return comps[1];
	}
	get filter() {
		const comps = this.tag.split(":");
		if (comps[0] !== "filter") throw new Error("Not a transaction event");
		const address = comps[1];
		const topics = deserializeTopics(comps[2]);
		const filter = {};
		if (topics.length > 0) filter.topics = topics;
		if (address && address !== "*") filter.address = address;
		return filter;
	}
	pollable() {
		return this.tag.indexOf(":") >= 0 || [
			"block",
			"network",
			"pending",
			"poll"
		].indexOf(this.tag) >= 0;
	}
};
var EthersEvent = class extends Event {
	get fromAddress() {
		const comps = this.tag.split(":");
		if (comps[0] !== "alchemy-pending-transactions") return;
		if (comps[1] && comps[1] !== "*") return deserializeAddressField(comps[1]);
		else return;
	}
	get toAddress() {
		const comps = this.tag.split(":");
		if (comps[0] !== "alchemy-pending-transactions") return;
		if (comps[2] && comps[2] !== "*") return deserializeAddressField(comps[2]);
		else return;
	}
	get hashesOnly() {
		const comps = this.tag.split(":");
		if (!ALCHEMY_EVENT_TYPES.includes(comps[0])) return;
		if (comps[3] && comps[3] !== "*") return comps[3] === "true";
		else return;
	}
	get includeRemoved() {
		const comps = this.tag.split(":");
		if (comps[0] !== "alchemy-mined-transactions") return;
		if (comps[2] && comps[2] !== "*") return comps[2] === "true";
		else return;
	}
	get addresses() {
		const comps = this.tag.split(":");
		if (comps[0] !== "alchemy-mined-transactions") return;
		if (comps[1] && comps[1] !== "*") return deserializeAddressesField(comps[1]);
		else return;
	}
};
function isAlchemyEvent(event) {
	return typeof event === "object" && "method" in event;
}
function getAlchemyEventTag(event) {
	if (!isAlchemyEvent(event)) throw new Error("Event tag requires AlchemyEventType");
	if (event.method === AlchemySubscription.PENDING_TRANSACTIONS) return serializePendingTransactionsEvent(event);
	else if (event.method === AlchemySubscription.MINED_TRANSACTIONS) return serializeMinedTransactionsEvent(event);
	else throw new Error(`Unrecognized AlchemyFilterEvent: ${event}`);
}
function verifyAlchemyEventName(eventName) {
	if (!Object.values(AlchemySubscription).includes(eventName.method)) throw new Error(`Invalid method name ${eventName.method}. Accepted method names: ${Object.values(AlchemySubscription)}`);
}
function serializePendingTransactionsEvent(event) {
	const fromAddress = serializeAddressField(event.fromAddress);
	const toAddress = serializeAddressField(event.toAddress);
	const hashesOnly = serializeBooleanField(event.hashesOnly);
	return ALCHEMY_PENDING_TRANSACTIONS_EVENT_TYPE + ":" + fromAddress + ":" + toAddress + ":" + hashesOnly;
}
function serializeMinedTransactionsEvent(event) {
	const addresses = serializeAddressesField(event.addresses);
	const includeRemoved = serializeBooleanField(event.includeRemoved);
	const hashesOnly = serializeBooleanField(event.hashesOnly);
	return ALCHEMY_MINED_TRANSACTIONS_EVENT_TYPE + ":" + addresses + ":" + includeRemoved + ":" + hashesOnly;
}
function serializeAddressesField(addresses) {
	if (addresses === void 0) return "*";
	return addresses.map((filter) => serializeAddressField(filter.to) + "," + serializeAddressField(filter.from)).join("|");
}
function serializeAddressField(field) {
	if (field === void 0) return "*";
	else if (Array.isArray(field)) return field.join("|");
	else return field;
}
function serializeBooleanField(field) {
	if (field === void 0) return "*";
	else return field.toString();
}
function deserializeTopics(data) {
	if (data === "") return [];
	return data.split(/&/g).map((topic) => {
		if (topic === "") return [];
		const comps = topic.split("|").map((topic$1) => {
			return topic$1 === "null" ? null : topic$1;
		});
		return comps.length === 1 ? comps[0] : comps;
	});
}
function deserializeAddressField(data) {
	if (data === "") return;
	const addresses = data.split("|");
	return addresses.length === 1 ? addresses[0] : addresses;
}
function deserializeAddressesField(data) {
	if (data === "") return;
	return data.split("|").map((addressStr) => addressStr.split(",")).map((addressPair) => Object.assign(Object.assign({}, addressPair[0] !== "*" && { to: addressPair[0] }), addressPair[1] !== "*" && { from: addressPair[1] }));
}
var WebSocketNamespace = class {
	constructor(config) {
		this.config = config;
	}
	on(eventName, listener) {
		__awaiter$1(this, void 0, void 0, function* () {
			const provider = yield this.config.getWebSocketProvider();
			const processedEvent = yield this._resolveEnsAlchemyEvent(eventName);
			provider.on(processedEvent, listener);
		});
		return this;
	}
	once(eventName, listener) {
		__awaiter$1(this, void 0, void 0, function* () {
			const provider = yield this.config.getWebSocketProvider();
			const processedEvent = yield this._resolveEnsAlchemyEvent(eventName);
			provider.once(processedEvent, listener);
		});
		return this;
	}
	off(eventName, listener) {
		__awaiter$1(this, void 0, void 0, function* () {
			const provider = yield this.config.getWebSocketProvider();
			const processedEvent = yield this._resolveEnsAlchemyEvent(eventName);
			return provider.off(processedEvent, listener);
		});
		return this;
	}
	removeAllListeners(eventName) {
		__awaiter$1(this, void 0, void 0, function* () {
			const provider = yield this.config.getWebSocketProvider();
			const processedEvent = eventName ? yield this._resolveEnsAlchemyEvent(eventName) : void 0;
			provider.removeAllListeners(processedEvent);
		});
		return this;
	}
	listenerCount(eventName) {
		return __awaiter$1(this, void 0, void 0, function* () {
			const provider = yield this.config.getWebSocketProvider();
			const processedEvent = eventName ? yield this._resolveEnsAlchemyEvent(eventName) : void 0;
			return provider.listenerCount(processedEvent);
		});
	}
	listeners(eventName) {
		return __awaiter$1(this, void 0, void 0, function* () {
			const provider = yield this.config.getWebSocketProvider();
			const processedEvent = eventName ? yield this._resolveEnsAlchemyEvent(eventName) : void 0;
			return provider.listeners(processedEvent);
		});
	}
	_resolveEnsAlchemyEvent(eventName) {
		return __awaiter$1(this, void 0, void 0, function* () {
			if (!isAlchemyEvent(eventName)) return eventName;
			if (eventName.method === AlchemySubscription.MINED_TRANSACTIONS && eventName.addresses) {
				const processedAddresses = [];
				for (const address of eventName.addresses) {
					if (address.to) address.to = yield this._resolveNameOrError(address.to);
					if (address.from) address.from = yield this._resolveNameOrError(address.from);
					processedAddresses.push(address);
				}
				eventName.addresses = processedAddresses;
			} else if (eventName.method === AlchemySubscription.PENDING_TRANSACTIONS) {
				if (eventName.fromAddress) if (typeof eventName.fromAddress === "string") eventName.fromAddress = yield this._resolveNameOrError(eventName.fromAddress);
				else eventName.fromAddress = yield Promise.all(eventName.fromAddress.map((address) => this._resolveNameOrError(address)));
				if (eventName.toAddress) if (typeof eventName.toAddress === "string") eventName.toAddress = yield this._resolveNameOrError(eventName.toAddress);
				else eventName.toAddress = yield Promise.all(eventName.toAddress.map((address) => this._resolveNameOrError(address)));
			}
			return eventName;
		});
	}
	_resolveNameOrError(name) {
		return __awaiter$1(this, void 0, void 0, function* () {
			const resolved = yield (yield this.config.getProvider()).resolveName(name);
			if (resolved === null) throw new Error(`Unable to resolve the ENS address: ${name}`);
			return resolved;
		});
	}
};
var Alchemy = class {
	constructor(settings) {
		this.config = new AlchemyConfig(settings);
		this.core = new CoreNamespace(this.config);
		this.nft = new NftNamespace(this.config);
		this.ws = new WebSocketNamespace(this.config);
		this.transact = new TransactNamespace(this.config);
		this.notify = new NotifyNamespace(this.config);
		this.debug = new DebugNamespace(this.config);
		this.prices = new PricesNamespace(this.config);
		this.portfolio = new PortfolioNamespace(this.config);
	}
};
export { toHex as C, noop as S, getAlchemyEventTag as _, AlchemySubscription as a, isAlchemyEvent as b, DEFAULT_NETWORK as c, IS_BROWSER as d, Network as f, fromHex as g, deepCopy as h, Alchemy as i, EthersEvent as l, __awaiter$1 as m, ALCHEMY_MINED_TRANSACTIONS_EVENT_TYPE as n, CustomNetworks as o, VERSION as p, ALCHEMY_PENDING_TRANSACTIONS_EVENT_TYPE as r, DEFAULT_ALCHEMY_API_KEY as s, ALCHEMY_EVENT_TYPES as t, EthersNetwork as u, getAlchemyHttpUrl as v, verifyAlchemyEventName as w, logWarn as x, getAlchemyWsUrl as y };
