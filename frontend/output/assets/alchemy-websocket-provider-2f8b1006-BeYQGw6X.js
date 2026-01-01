import { C as verifyAlchemyEventName, Do as Logger, Eo as defineReadOnly, Jo as __esmMin, S as toHex, So as version$1, To as BigNumber, Xo as __toCommonJS, Yo as __export, Zo as __toESM, a as CustomNetworks, c as EthersEvent, f as VERSION, g as getAlchemyEventTag, h as fromHex, i as AlchemySubscription, l as EthersNetwork, n as ALCHEMY_MINED_TRANSACTIONS_EVENT_TYPE, o as DEFAULT_ALCHEMY_API_KEY, p as __awaiter$1, qo as __commonJSMin, r as ALCHEMY_PENDING_TRANSACTIONS_EVENT_TYPE, t as ALCHEMY_EVENT_TYPES, wo as getNetwork, x as noop, xo as JsonRpcProvider, y as isAlchemyEvent } from "./index-B3QHgmE4.js";
import { t as AlchemyProvider } from "./alchemy-provider-0b2e9f09-CjWlAiLT.js";
var WS = null;
try {
	WS = WebSocket;
	if (WS == null) throw new Error("inject please");
} catch (error) {
	const logger$1 = new Logger(version$1);
	WS = function() {
		logger$1.throwError("WebSockets not supported in this environment", Logger.errors.UNSUPPORTED_OPERATION, { operation: "new WebSocket()" });
	};
}
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
var logger = new Logger(version$1);
var NextId = 1;
var WebSocketProvider = class extends JsonRpcProvider {
	constructor(url, network) {
		if (network === "any") logger.throwError("WebSocketProvider does not support 'any' network yet", Logger.errors.UNSUPPORTED_OPERATION, { operation: "network:any" });
		if (typeof url === "string") super(url, network);
		else super("_websocket", network);
		this._pollingInterval = -1;
		this._wsReady = false;
		if (typeof url === "string") defineReadOnly(this, "_websocket", new WS(this.connection.url));
		else defineReadOnly(this, "_websocket", url);
		defineReadOnly(this, "_requests", {});
		defineReadOnly(this, "_subs", {});
		defineReadOnly(this, "_subIds", {});
		defineReadOnly(this, "_detectNetwork", super.detectNetwork());
		this.websocket.onopen = () => {
			this._wsReady = true;
			Object.keys(this._requests).forEach((id) => {
				this.websocket.send(this._requests[id].payload);
			});
		};
		this.websocket.onmessage = (messageEvent) => {
			const data = messageEvent.data;
			const result = JSON.parse(data);
			if (result.id != null) {
				const id = String(result.id);
				const request = this._requests[id];
				delete this._requests[id];
				if (result.result !== void 0) {
					request.callback(null, result.result);
					this.emit("debug", {
						action: "response",
						request: JSON.parse(request.payload),
						response: result.result,
						provider: this
					});
				} else {
					let error = null;
					if (result.error) {
						error = new Error(result.error.message || "unknown error");
						defineReadOnly(error, "code", result.error.code || null);
						defineReadOnly(error, "response", data);
					} else error = /* @__PURE__ */ new Error("unknown error");
					request.callback(error, void 0);
					this.emit("debug", {
						action: "response",
						error,
						request: JSON.parse(request.payload),
						provider: this
					});
				}
			} else if (result.method === "eth_subscription") {
				const sub = this._subs[result.params.subscription];
				if (sub) sub.processFunc(result.params.result);
			} else console.warn("this should not happen");
		};
		const fauxPoll = setInterval(() => {
			this.emit("poll");
		}, 1e3);
		if (fauxPoll.unref) fauxPoll.unref();
	}
	get websocket() {
		return this._websocket;
	}
	detectNetwork() {
		return this._detectNetwork;
	}
	get pollingInterval() {
		return 0;
	}
	resetEventsBlock(blockNumber) {
		logger.throwError("cannot reset events block on WebSocketProvider", Logger.errors.UNSUPPORTED_OPERATION, { operation: "resetEventBlock" });
	}
	set pollingInterval(value) {
		logger.throwError("cannot set polling interval on WebSocketProvider", Logger.errors.UNSUPPORTED_OPERATION, { operation: "setPollingInterval" });
	}
	poll() {
		return __awaiter(this, void 0, void 0, function* () {
			return null;
		});
	}
	set polling(value) {
		if (!value) return;
		logger.throwError("cannot set polling on WebSocketProvider", Logger.errors.UNSUPPORTED_OPERATION, { operation: "setPolling" });
	}
	send(method, params) {
		const rid = NextId++;
		return new Promise((resolve, reject) => {
			function callback(error, result) {
				if (error) return reject(error);
				return resolve(result);
			}
			const payload = JSON.stringify({
				method,
				params,
				id: rid,
				jsonrpc: "2.0"
			});
			this.emit("debug", {
				action: "request",
				request: JSON.parse(payload),
				provider: this
			});
			this._requests[String(rid)] = {
				callback,
				payload
			};
			if (this._wsReady) this.websocket.send(payload);
		});
	}
	static defaultUrl() {
		return "ws://localhost:8546";
	}
	_subscribe(tag, param, processFunc) {
		return __awaiter(this, void 0, void 0, function* () {
			let subIdPromise = this._subIds[tag];
			if (subIdPromise == null) {
				subIdPromise = Promise.all(param).then((param$1) => {
					return this.send("eth_subscribe", param$1);
				});
				this._subIds[tag] = subIdPromise;
			}
			const subId = yield subIdPromise;
			this._subs[subId] = {
				tag,
				processFunc
			};
		});
	}
	_startEvent(event) {
		switch (event.type) {
			case "block":
				this._subscribe("block", ["newHeads"], (result) => {
					const blockNumber = BigNumber.from(result.number).toNumber();
					this._emitted.block = blockNumber;
					this.emit("block", blockNumber);
				});
				break;
			case "pending":
				this._subscribe("pending", ["newPendingTransactions"], (result) => {
					this.emit("pending", result);
				});
				break;
			case "filter":
				this._subscribe(event.tag, ["logs", this._getFilter(event.filter)], (result) => {
					if (result.removed == null) result.removed = false;
					this.emit(event.filter, this.formatter.filterLog(result));
				});
				break;
			case "tx": {
				const emitReceipt = (event$1) => {
					const hash = event$1.hash;
					this.getTransactionReceipt(hash).then((receipt) => {
						if (!receipt) return;
						this.emit(hash, receipt);
					});
				};
				emitReceipt(event);
				this._subscribe("tx", ["newHeads"], (result) => {
					this._events.filter((e) => e.type === "tx").forEach(emitReceipt);
				});
				break;
			}
			case "debug":
			case "poll":
			case "willPoll":
			case "didPoll":
			case "error": break;
			default:
				console.log("unhandled:", event);
				break;
		}
	}
	_stopEvent(event) {
		let tag = event.tag;
		if (event.type === "tx") {
			if (this._events.filter((e) => e.type === "tx").length) return;
			tag = "tx";
		} else if (this.listenerCount(event.event)) return;
		const subId = this._subIds[tag];
		if (!subId) return;
		delete this._subIds[tag];
		subId.then((subId$1) => {
			if (!this._subs[subId$1]) return;
			delete this._subs[subId$1];
			this.send("eth_unsubscribe", [subId$1]);
		});
	}
	destroy() {
		return __awaiter(this, void 0, void 0, function* () {
			if (this.websocket.readyState === WS.CONNECTING) yield new Promise((resolve) => {
				this.websocket.onopen = function() {
					resolve(true);
				};
				this.websocket.onerror = function() {
					resolve(false);
				};
			});
			this.websocket.close(1e3);
		});
	}
};
var require_dist = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	var SHOULD_RECONNECT_FALSE_MESSAGE = "Provided shouldReconnect() returned false. Closing permanently.";
	var SHOULD_RECONNECT_PROMISE_FALSE_MESSAGE = "Provided shouldReconnect() resolved to false. Closing permanently.";
	var SturdyWebSocket$1 = function() {
		function SturdyWebSocket$2(url, protocolsOrOptions, options) {
			if (options === void 0) options = {};
			this.url = url;
			this.onclose = null;
			this.onerror = null;
			this.onmessage = null;
			this.onopen = null;
			this.ondown = null;
			this.onreopen = null;
			this.CONNECTING = SturdyWebSocket$2.CONNECTING;
			this.OPEN = SturdyWebSocket$2.OPEN;
			this.CLOSING = SturdyWebSocket$2.CLOSING;
			this.CLOSED = SturdyWebSocket$2.CLOSED;
			this.hasBeenOpened = false;
			this.isClosed = false;
			this.messageBuffer = [];
			this.nextRetryTime = 0;
			this.reconnectCount = 0;
			this.lastKnownExtensions = "";
			this.lastKnownProtocol = "";
			this.listeners = {};
			if (protocolsOrOptions == null || typeof protocolsOrOptions === "string" || Array.isArray(protocolsOrOptions)) this.protocols = protocolsOrOptions;
			else options = protocolsOrOptions;
			this.options = applyDefaultOptions(options);
			if (!this.options.wsConstructor) if (typeof WebSocket !== "undefined") this.options.wsConstructor = WebSocket;
			else throw new Error("WebSocket not present in global scope and no wsConstructor option was provided.");
			this.openNewWebSocket();
		}
		Object.defineProperty(SturdyWebSocket$2.prototype, "binaryType", {
			get: function() {
				return this.binaryTypeInternal || "blob";
			},
			set: function(binaryType) {
				this.binaryTypeInternal = binaryType;
				if (this.ws) this.ws.binaryType = binaryType;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(SturdyWebSocket$2.prototype, "bufferedAmount", {
			get: function() {
				var sum = this.ws ? this.ws.bufferedAmount : 0;
				var hasUnknownAmount = false;
				this.messageBuffer.forEach(function(data) {
					var byteLength = getDataByteLength(data);
					if (byteLength != null) sum += byteLength;
					else hasUnknownAmount = true;
				});
				if (hasUnknownAmount) this.debugLog("Some buffered data had unknown length. bufferedAmount() return value may be below the correct amount.");
				return sum;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(SturdyWebSocket$2.prototype, "extensions", {
			get: function() {
				return this.ws ? this.ws.extensions : this.lastKnownExtensions;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(SturdyWebSocket$2.prototype, "protocol", {
			get: function() {
				return this.ws ? this.ws.protocol : this.lastKnownProtocol;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(SturdyWebSocket$2.prototype, "readyState", {
			get: function() {
				return this.isClosed ? SturdyWebSocket$2.CLOSED : SturdyWebSocket$2.OPEN;
			},
			enumerable: true,
			configurable: true
		});
		SturdyWebSocket$2.prototype.close = function(code, reason) {
			this.disposeSocket(code, reason);
			this.shutdown();
			this.debugLog("WebSocket permanently closed by client.");
		};
		SturdyWebSocket$2.prototype.send = function(data) {
			if (this.isClosed) throw new Error("WebSocket is already in CLOSING or CLOSED state.");
			else if (this.ws && this.ws.readyState === this.OPEN) this.ws.send(data);
			else this.messageBuffer.push(data);
		};
		SturdyWebSocket$2.prototype.reconnect = function() {
			if (this.isClosed) throw new Error("Cannot call reconnect() on socket which is permanently closed.");
			this.disposeSocket(1e3, "Client requested reconnect.");
			this.handleClose(void 0);
		};
		SturdyWebSocket$2.prototype.addEventListener = function(type, listener) {
			if (!this.listeners[type]) this.listeners[type] = [];
			this.listeners[type].push(listener);
		};
		SturdyWebSocket$2.prototype.dispatchEvent = function(event) {
			return this.dispatchEventOfType(event.type, event);
		};
		SturdyWebSocket$2.prototype.removeEventListener = function(type, listener) {
			if (this.listeners[type]) this.listeners[type] = this.listeners[type].filter(function(l) {
				return l !== listener;
			});
		};
		SturdyWebSocket$2.prototype.openNewWebSocket = function() {
			var _this = this;
			if (this.isClosed) return;
			var _a = this.options, connectTimeout = _a.connectTimeout, wsConstructor = _a.wsConstructor;
			this.debugLog("Opening new WebSocket to " + this.url + ".");
			var ws = new wsConstructor(this.url, this.protocols);
			ws.onclose = function(event) {
				return _this.handleClose(event);
			};
			ws.onerror = function(event) {
				return _this.handleError(event);
			};
			ws.onmessage = function(event) {
				return _this.handleMessage(event);
			};
			ws.onopen = function(event) {
				return _this.handleOpen(event);
			};
			this.connectTimeoutId = setTimeout(function() {
				_this.clearConnectTimeout();
				_this.disposeSocket();
				_this.handleClose(void 0);
			}, connectTimeout);
			this.ws = ws;
		};
		SturdyWebSocket$2.prototype.handleOpen = function(event) {
			var _this = this;
			if (!this.ws || this.isClosed) return;
			var allClearResetTime = this.options.allClearResetTime;
			this.debugLog("WebSocket opened.");
			if (this.binaryTypeInternal != null) this.ws.binaryType = this.binaryTypeInternal;
			else this.binaryTypeInternal = this.ws.binaryType;
			this.clearConnectTimeout();
			if (this.hasBeenOpened) this.dispatchEventOfType("reopen", event);
			else {
				this.dispatchEventOfType("open", event);
				this.hasBeenOpened = true;
			}
			this.messageBuffer.forEach(function(message) {
				return _this.send(message);
			});
			this.messageBuffer = [];
			this.allClearTimeoutId = setTimeout(function() {
				_this.clearAllClearTimeout();
				_this.nextRetryTime = 0;
				_this.reconnectCount = 0;
				var openTime = allClearResetTime / 1e3 | 0;
				_this.debugLog("WebSocket remained open for " + openTime + " seconds. Resetting retry time and count.");
			}, allClearResetTime);
		};
		SturdyWebSocket$2.prototype.handleMessage = function(event) {
			if (this.isClosed) return;
			this.dispatchEventOfType("message", event);
		};
		SturdyWebSocket$2.prototype.handleClose = function(event) {
			var _this = this;
			if (this.isClosed) return;
			var _a = this.options, maxReconnectAttempts = _a.maxReconnectAttempts, shouldReconnect = _a.shouldReconnect;
			this.clearConnectTimeout();
			this.clearAllClearTimeout();
			if (this.ws) {
				this.lastKnownExtensions = this.ws.extensions;
				this.lastKnownProtocol = this.ws.protocol;
				this.disposeSocket();
			}
			this.dispatchEventOfType("down", event);
			if (this.reconnectCount >= maxReconnectAttempts) {
				this.stopReconnecting(event, this.getTooManyFailedReconnectsMessage());
				return;
			}
			var willReconnect = !event || shouldReconnect(event);
			if (typeof willReconnect === "boolean") this.handleWillReconnect(willReconnect, event, SHOULD_RECONNECT_FALSE_MESSAGE);
			else willReconnect.then(function(willReconnectResolved) {
				if (_this.isClosed) return;
				_this.handleWillReconnect(willReconnectResolved, event, SHOULD_RECONNECT_PROMISE_FALSE_MESSAGE);
			});
		};
		SturdyWebSocket$2.prototype.handleError = function(event) {
			this.dispatchEventOfType("error", event);
			this.debugLog("WebSocket encountered an error.");
		};
		SturdyWebSocket$2.prototype.handleWillReconnect = function(willReconnect, event, denialReason) {
			if (willReconnect) this.reestablishConnection();
			else this.stopReconnecting(event, denialReason);
		};
		SturdyWebSocket$2.prototype.reestablishConnection = function() {
			var _this = this;
			var _a = this.options, minReconnectDelay = _a.minReconnectDelay, maxReconnectDelay = _a.maxReconnectDelay, reconnectBackoffFactor = _a.reconnectBackoffFactor;
			this.reconnectCount++;
			var retryTime = this.nextRetryTime;
			this.nextRetryTime = Math.max(minReconnectDelay, Math.min(this.nextRetryTime * reconnectBackoffFactor, maxReconnectDelay));
			setTimeout(function() {
				return _this.openNewWebSocket();
			}, retryTime);
			var retryTimeSeconds = retryTime / 1e3 | 0;
			this.debugLog("WebSocket was closed. Re-opening in " + retryTimeSeconds + " seconds.");
		};
		SturdyWebSocket$2.prototype.stopReconnecting = function(event, debugReason) {
			this.debugLog(debugReason);
			this.shutdown();
			if (event) this.dispatchEventOfType("close", event);
		};
		SturdyWebSocket$2.prototype.shutdown = function() {
			this.isClosed = true;
			this.clearAllTimeouts();
			this.messageBuffer = [];
			this.disposeSocket();
		};
		SturdyWebSocket$2.prototype.disposeSocket = function(closeCode, reason) {
			if (!this.ws) return;
			this.ws.onerror = noop$1;
			this.ws.onclose = noop$1;
			this.ws.onmessage = noop$1;
			this.ws.onopen = noop$1;
			this.ws.close(closeCode, reason);
			this.ws = void 0;
		};
		SturdyWebSocket$2.prototype.clearAllTimeouts = function() {
			this.clearConnectTimeout();
			this.clearAllClearTimeout();
		};
		SturdyWebSocket$2.prototype.clearConnectTimeout = function() {
			if (this.connectTimeoutId != null) {
				clearTimeout(this.connectTimeoutId);
				this.connectTimeoutId = void 0;
			}
		};
		SturdyWebSocket$2.prototype.clearAllClearTimeout = function() {
			if (this.allClearTimeoutId != null) {
				clearTimeout(this.allClearTimeoutId);
				this.allClearTimeoutId = void 0;
			}
		};
		SturdyWebSocket$2.prototype.dispatchEventOfType = function(type, event) {
			var _this = this;
			switch (type) {
				case "close":
					if (this.onclose) this.onclose(event);
					break;
				case "error":
					if (this.onerror) this.onerror(event);
					break;
				case "message":
					if (this.onmessage) this.onmessage(event);
					break;
				case "open":
					if (this.onopen) this.onopen(event);
					break;
				case "down":
					if (this.ondown) this.ondown(event);
					break;
				case "reopen":
					if (this.onreopen) this.onreopen(event);
					break;
			}
			if (type in this.listeners) this.listeners[type].slice().forEach(function(listener) {
				return _this.callListener(listener, event);
			});
			return !event || !event.defaultPrevented;
		};
		SturdyWebSocket$2.prototype.callListener = function(listener, event) {
			if (typeof listener === "function") listener.call(this, event);
			else listener.handleEvent.call(this, event);
		};
		SturdyWebSocket$2.prototype.debugLog = function(message) {
			if (this.options.debug) console.log(message);
		};
		SturdyWebSocket$2.prototype.getTooManyFailedReconnectsMessage = function() {
			var maxReconnectAttempts = this.options.maxReconnectAttempts;
			return "Failed to reconnect after " + maxReconnectAttempts + " " + pluralize("attempt", maxReconnectAttempts) + ". Closing permanently.";
		};
		SturdyWebSocket$2.DEFAULT_OPTIONS = {
			allClearResetTime: 5e3,
			connectTimeout: 5e3,
			debug: false,
			minReconnectDelay: 1e3,
			maxReconnectDelay: 3e4,
			maxReconnectAttempts: Number.POSITIVE_INFINITY,
			reconnectBackoffFactor: 1.5,
			shouldReconnect: function() {
				return true;
			},
			wsConstructor: void 0
		};
		SturdyWebSocket$2.CONNECTING = 0;
		SturdyWebSocket$2.OPEN = 1;
		SturdyWebSocket$2.CLOSING = 2;
		SturdyWebSocket$2.CLOSED = 3;
		return SturdyWebSocket$2;
	}();
	exports.default = SturdyWebSocket$1;
	function applyDefaultOptions(options) {
		var result = {};
		Object.keys(SturdyWebSocket$1.DEFAULT_OPTIONS).forEach(function(key) {
			var value = options[key];
			result[key] = value === void 0 ? SturdyWebSocket$1.DEFAULT_OPTIONS[key] : value;
		});
		return result;
	}
	function getDataByteLength(data) {
		if (typeof data === "string") return 2 * data.length;
		else if (data instanceof ArrayBuffer) return data.byteLength;
		else if (data instanceof Blob) return data.size;
		else return;
	}
	function pluralize(s, n) {
		return n === 1 ? s : s + "s";
	}
	function noop$1() {}
}));
var require_global = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var naiveFallback = function() {
		if (typeof self === "object" && self) return self;
		if (typeof window === "object" && window) return window;
		throw new Error("Unable to resolve global `this`");
	};
	module.exports = (function() {
		if (this) return this;
		if (typeof globalThis === "object" && globalThis) return globalThis;
		try {
			Object.defineProperty(Object.prototype, "__global__", {
				get: function() {
					return this;
				},
				configurable: true
			});
		} catch (error) {
			return naiveFallback();
		}
		try {
			if (!__global__) return naiveFallback();
			return __global__;
		} finally {
			delete Object.prototype.__global__;
		}
	})();
}));
var package_exports = /* @__PURE__ */ __export({
	author: () => author,
	browser: () => browser,
	config: () => config,
	contributors: () => contributors,
	default: () => package_default,
	dependencies: () => dependencies,
	description: () => description,
	devDependencies: () => devDependencies,
	directories: () => directories,
	engines: () => engines,
	homepage: () => homepage,
	keywords: () => keywords,
	license: () => license,
	main: () => main,
	name: () => name,
	repository: () => repository,
	scripts: () => scripts,
	version: () => version
});
var name, description, keywords, author, contributors, version, repository, homepage, engines, dependencies, devDependencies, config, scripts, main, directories, browser, license, package_default;
var init_package = __esmMin((() => {
	name = "websocket";
	description = "Websocket Client & Server Library implementing the WebSocket protocol as specified in RFC 6455.";
	keywords = [
		"websocket",
		"websockets",
		"socket",
		"networking",
		"comet",
		"push",
		"RFC-6455",
		"realtime",
		"server",
		"client"
	];
	author = "Brian McKelvey <theturtle32@gmail.com> (https://github.com/theturtle32)";
	contributors = ["Iñaki Baz Castillo <ibc@aliax.net> (http://dev.sipdoc.net)"];
	version = "1.0.35";
	repository = {
		"type": "git",
		"url": "https://github.com/theturtle32/WebSocket-Node.git"
	};
	homepage = "https://github.com/theturtle32/WebSocket-Node";
	engines = { "node": ">=4.0.0" };
	dependencies = {
		"bufferutil": "^4.0.1",
		"debug": "^2.2.0",
		"es5-ext": "^0.10.63",
		"typedarray-to-buffer": "^3.1.5",
		"utf-8-validate": "^5.0.2",
		"yaeti": "^0.0.6"
	};
	devDependencies = {
		"buffer-equal": "^1.0.0",
		"gulp": "^4.0.2",
		"gulp-jshint": "^2.0.4",
		"jshint-stylish": "^2.2.1",
		"jshint": "^2.0.0",
		"tape": "^4.9.1"
	};
	config = { "verbose": false };
	scripts = {
		"test": "tape test/unit/*.js",
		"gulp": "gulp"
	};
	main = "index";
	directories = { "lib": "./lib" };
	browser = "lib/browser.js";
	license = "Apache-2.0";
	package_default = {
		name,
		description,
		keywords,
		author,
		contributors,
		version,
		repository,
		homepage,
		engines,
		dependencies,
		devDependencies,
		config,
		scripts,
		main,
		directories,
		browser,
		license
	};
}));
var require_version = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	module.exports = (init_package(), __toCommonJS(package_exports).default).version;
}));
var require_browser = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var _globalThis;
	if (typeof globalThis === "object") _globalThis = globalThis;
	else try {
		_globalThis = require_global();
	} catch (error) {} finally {
		if (!_globalThis && typeof window !== "undefined") _globalThis = window;
		if (!_globalThis) throw new Error("Could not determine global this");
	}
	var NativeWebSocket = _globalThis.WebSocket || _globalThis.MozWebSocket;
	var websocket_version = require_version();
	function W3CWebSocket(uri, protocols) {
		var native_instance;
		if (protocols) native_instance = new NativeWebSocket(uri, protocols);
		else native_instance = new NativeWebSocket(uri);
		return native_instance;
	}
	if (NativeWebSocket) [
		"CONNECTING",
		"OPEN",
		"CLOSING",
		"CLOSED"
	].forEach(function(prop) {
		Object.defineProperty(W3CWebSocket, prop, { get: function() {
			return NativeWebSocket[prop];
		} });
	});
	module.exports = {
		"w3cwebsocket": NativeWebSocket ? W3CWebSocket : null,
		"version": websocket_version
	};
}));
var import_dist = /* @__PURE__ */ __toESM(require_dist());
var WebsocketBackfiller = class {
	constructor(provider) {
		this.provider = provider;
		this.maxBackfillBlocks = 120;
	}
	getNewHeadsBackfill(isCancelled, previousHeads, fromBlockNumber) {
		return __awaiter$1(this, void 0, void 0, function* () {
			throwIfCancelled(isCancelled);
			const toBlockNumber = yield this.getBlockNumber();
			throwIfCancelled(isCancelled);
			if (previousHeads.length === 0) return this.getHeadEventsInRange(Math.max(fromBlockNumber, toBlockNumber - this.maxBackfillBlocks) + 1, toBlockNumber + 1);
			const lastSeenBlockNumber = fromHex(previousHeads[previousHeads.length - 1].number);
			const minBlockNumber = toBlockNumber - this.maxBackfillBlocks + 1;
			if (lastSeenBlockNumber <= minBlockNumber) return this.getHeadEventsInRange(minBlockNumber, toBlockNumber + 1);
			const reorgHeads = yield this.getReorgHeads(isCancelled, previousHeads);
			throwIfCancelled(isCancelled);
			const intermediateHeads = yield this.getHeadEventsInRange(lastSeenBlockNumber + 1, toBlockNumber + 1);
			throwIfCancelled(isCancelled);
			return [...reorgHeads, ...intermediateHeads];
		});
	}
	getLogsBackfill(isCancelled, filter, previousLogs, fromBlockNumber) {
		return __awaiter$1(this, void 0, void 0, function* () {
			throwIfCancelled(isCancelled);
			const toBlockNumber = yield this.getBlockNumber();
			throwIfCancelled(isCancelled);
			if (previousLogs.length === 0) return this.getLogsInRange(filter, Math.max(fromBlockNumber, toBlockNumber - this.maxBackfillBlocks) + 1, toBlockNumber + 1);
			const lastSeenBlockNumber = fromHex(previousLogs[previousLogs.length - 1].blockNumber);
			const minBlockNumber = toBlockNumber - this.maxBackfillBlocks + 1;
			if (lastSeenBlockNumber < minBlockNumber) return this.getLogsInRange(filter, minBlockNumber, toBlockNumber + 1);
			const commonAncestor = yield this.getCommonAncestor(isCancelled, previousLogs);
			throwIfCancelled(isCancelled);
			const removedLogs = previousLogs.filter((log) => fromHex(log.blockNumber) > commonAncestor.blockNumber).map((log) => Object.assign(Object.assign({}, log), { removed: true }));
			const fromBlockInclusive = commonAncestor.blockNumber === Number.NEGATIVE_INFINITY ? fromHex(previousLogs[0].blockNumber) : commonAncestor.blockNumber;
			let addedLogs = yield this.getLogsInRange(filter, fromBlockInclusive, toBlockNumber + 1);
			addedLogs = addedLogs.filter((log) => log && (fromHex(log.blockNumber) > commonAncestor.blockNumber || fromHex(log.logIndex) > commonAncestor.logIndex));
			throwIfCancelled(isCancelled);
			return [...removedLogs, ...addedLogs];
		});
	}
	setMaxBackfillBlock(newMax) {
		this.maxBackfillBlocks = newMax;
	}
	getBlockNumber() {
		return __awaiter$1(this, void 0, void 0, function* () {
			const blockNumberHex = yield this.provider.send("eth_blockNumber");
			return fromHex(blockNumberHex);
		});
	}
	getHeadEventsInRange(fromBlockInclusive, toBlockExclusive) {
		return __awaiter$1(this, void 0, void 0, function* () {
			if (fromBlockInclusive >= toBlockExclusive) return [];
			const batchParts = [];
			for (let i = fromBlockInclusive; i < toBlockExclusive; i++) batchParts.push({
				method: "eth_getBlockByNumber",
				params: [toHex(i), false]
			});
			return (yield this.provider.sendBatch(batchParts)).map(toNewHeadsEvent);
		});
	}
	getReorgHeads(isCancelled, previousHeads) {
		return __awaiter$1(this, void 0, void 0, function* () {
			const result = [];
			for (let i = previousHeads.length - 1; i >= 0; i--) {
				const oldEvent = previousHeads[i];
				const blockHead = yield this.getBlockByNumber(fromHex(oldEvent.number));
				throwIfCancelled(isCancelled);
				if (oldEvent.hash === blockHead.hash) break;
				result.push(toNewHeadsEvent(blockHead));
			}
			return result.reverse();
		});
	}
	getBlockByNumber(blockNumber) {
		return __awaiter$1(this, void 0, void 0, function* () {
			return this.provider.send("eth_getBlockByNumber", [toHex(blockNumber), false]);
		});
	}
	getCommonAncestor(isCancelled, previousLogs) {
		return __awaiter$1(this, void 0, void 0, function* () {
			let blockHead = yield this.getBlockByNumber(fromHex(previousLogs[previousLogs.length - 1].blockNumber));
			throwIfCancelled(isCancelled);
			for (let i = previousLogs.length - 1; i >= 0; i--) {
				const oldLog = previousLogs[i];
				if (oldLog.blockNumber !== blockHead.number) blockHead = yield this.getBlockByNumber(fromHex(oldLog.blockNumber));
				if (oldLog.blockHash === blockHead.hash) return {
					blockNumber: fromHex(oldLog.blockNumber),
					logIndex: fromHex(oldLog.logIndex)
				};
			}
			return {
				blockNumber: Number.NEGATIVE_INFINITY,
				logIndex: Number.NEGATIVE_INFINITY
			};
		});
	}
	getLogsInRange(filter, fromBlockInclusive, toBlockExclusive) {
		return __awaiter$1(this, void 0, void 0, function* () {
			if (fromBlockInclusive >= toBlockExclusive) return [];
			const rangeFilter = Object.assign(Object.assign({}, filter), {
				fromBlock: toHex(fromBlockInclusive),
				toBlock: toHex(toBlockExclusive - 1)
			});
			return this.provider.send("eth_getLogs", [rangeFilter]);
		});
	}
};
function toNewHeadsEvent(head) {
	const result = Object.assign({}, head);
	delete result.totalDifficulty;
	delete result.transactions;
	delete result.uncles;
	return result;
}
function dedupeNewHeads(events) {
	return dedupe(events, (event) => event.hash);
}
function dedupeLogs(events) {
	return dedupe(events, (event) => `${event.blockHash}/${event.logIndex}`);
}
function dedupe(items, getKey) {
	const keysSeen = /* @__PURE__ */ new Set();
	const result = [];
	items.forEach((item) => {
		const key = getKey(item);
		if (!keysSeen.has(key)) {
			keysSeen.add(key);
			result.push(item);
		}
	});
	return result;
}
var CANCELLED = /* @__PURE__ */ new Error("Cancelled");
function throwIfCancelled(isCancelled) {
	if (isCancelled()) throw CANCELLED;
}
var HEARTBEAT_INTERVAL = 3e4;
var HEARTBEAT_WAIT_TIME = 1e4;
var BACKFILL_TIMEOUT = 6e4;
var AlchemyWebSocketProvider = class extends WebSocketProvider {
	constructor(config$1, wsConstructor) {
		var _a;
		const apiKey = AlchemyProvider.getApiKey(config$1.apiKey);
		const alchemyNetwork = AlchemyProvider.getAlchemyNetwork(config$1.network);
		const connection = AlchemyProvider.getAlchemyConnectionInfo(alchemyNetwork, apiKey, "wss");
		const protocol = `alchemy-sdk-${VERSION}`;
		const ws = new import_dist.default((_a = config$1.url) !== null && _a !== void 0 ? _a : connection.url, protocol, { wsConstructor: wsConstructor !== null && wsConstructor !== void 0 ? wsConstructor : getWebsocketConstructor() });
		const ethersNetwork = EthersNetwork[alchemyNetwork];
		super(ws, ethersNetwork !== null && ethersNetwork !== void 0 ? ethersNetwork : void 0);
		this._events = [];
		this.virtualSubscriptionsById = /* @__PURE__ */ new Map();
		this.virtualIdsByPhysicalId = /* @__PURE__ */ new Map();
		this.handleMessage = (event) => {
			const message = JSON.parse(event.data);
			if (!isSubscriptionEvent(message)) return;
			const physicalId = message.params.subscription;
			const virtualId = this.virtualIdsByPhysicalId.get(physicalId);
			if (!virtualId) return;
			const subscription = this.virtualSubscriptionsById.get(virtualId);
			if (subscription.method !== "eth_subscribe") return;
			switch (subscription.params[0]) {
				case "newHeads": {
					const newHeadsSubscription = subscription;
					const newHeadsMessage = message;
					const { isBackfilling, backfillBuffer } = newHeadsSubscription;
					const { result } = newHeadsMessage.params;
					if (isBackfilling) addToNewHeadsEventsBuffer(backfillBuffer, result);
					else if (physicalId !== virtualId) this.emitAndRememberEvent(virtualId, result, getNewHeadsBlockNumber);
					else this.rememberEvent(virtualId, result, getNewHeadsBlockNumber);
					break;
				}
				case "logs": {
					const logsSubscription = subscription;
					const logsMessage = message;
					const { isBackfilling, backfillBuffer } = logsSubscription;
					const { result } = logsMessage.params;
					if (isBackfilling) addToLogsEventsBuffer(backfillBuffer, result);
					else if (virtualId !== physicalId) this.emitAndRememberEvent(virtualId, result, getLogsBlockNumber);
					else this.rememberEvent(virtualId, result, getLogsBlockNumber);
					break;
				}
				default: if (physicalId !== virtualId) {
					const { result } = message.params;
					this.emitEvent(virtualId, result);
				}
			}
		};
		this.handleReopen = () => {
			this.virtualIdsByPhysicalId.clear();
			const { cancel, isCancelled } = makeCancelToken();
			this.cancelBackfill = cancel;
			for (const subscription of this.virtualSubscriptionsById.values()) __awaiter$1(this, void 0, void 0, function* () {
				try {
					yield this.resubscribeAndBackfill(isCancelled, subscription);
				} catch (error) {
					if (!isCancelled()) console.error(`Error while backfilling "${subscription.params[0]}" subscription. Some events may be missing.`, error);
				}
			});
			this.startHeartbeat();
		};
		this.stopHeartbeatAndBackfill = () => {
			if (this.heartbeatIntervalId != null) {
				clearInterval(this.heartbeatIntervalId);
				this.heartbeatIntervalId = void 0;
			}
			this.cancelBackfill();
		};
		this.apiKey = apiKey;
		this.backfiller = new WebsocketBackfiller(this);
		this.addSocketListeners();
		this.startHeartbeat();
		this.cancelBackfill = noop;
	}
	static getNetwork(network) {
		if (typeof network === "string" && network in CustomNetworks) return CustomNetworks[network];
		return getNetwork(network);
	}
	on(eventName, listener) {
		return this._addEventListener(eventName, listener, false);
	}
	once(eventName, listener) {
		return this._addEventListener(eventName, listener, true);
	}
	off(eventName, listener) {
		if (isAlchemyEvent(eventName)) return this._off(eventName, listener);
		else return super.off(eventName, listener);
	}
	removeAllListeners(eventName) {
		if (eventName !== void 0 && isAlchemyEvent(eventName)) return this._removeAllListeners(eventName);
		else return super.removeAllListeners(eventName);
	}
	listenerCount(eventName) {
		if (eventName !== void 0 && isAlchemyEvent(eventName)) return this._listenerCount(eventName);
		else return super.listenerCount(eventName);
	}
	listeners(eventName) {
		if (eventName !== void 0 && isAlchemyEvent(eventName)) return this._listeners(eventName);
		else return super.listeners(eventName);
	}
	_addEventListener(eventName, listener, once) {
		if (isAlchemyEvent(eventName)) {
			verifyAlchemyEventName(eventName);
			const event = new EthersEvent(getAlchemyEventTag(eventName), listener, once);
			this._events.push(event);
			this._startEvent(event);
			return this;
		} else return super._addEventListener(eventName, listener, once);
	}
	_startEvent(event) {
		if ([
			...ALCHEMY_EVENT_TYPES,
			"block",
			"filter"
		].includes(event.type)) this.customStartEvent(event);
		else super._startEvent(event);
	}
	_subscribe(tag, param, processFunc, event) {
		return __awaiter$1(this, void 0, void 0, function* () {
			let subIdPromise = this._subIds[tag];
			const startingBlockNumber = yield this.getBlockNumber();
			if (subIdPromise == null) {
				subIdPromise = Promise.all(param).then((param$1) => {
					return this.send("eth_subscribe", param$1);
				});
				this._subIds[tag] = subIdPromise;
			}
			const subId = yield subIdPromise;
			const resolvedParams = yield Promise.all(param);
			this.virtualSubscriptionsById.set(subId, {
				event,
				method: "eth_subscribe",
				params: resolvedParams,
				startingBlockNumber,
				virtualId: subId,
				physicalId: subId,
				sentEvents: [],
				isBackfilling: false,
				backfillBuffer: []
			});
			this.virtualIdsByPhysicalId.set(subId, subId);
			this._subs[subId] = {
				tag,
				processFunc
			};
		});
	}
	emit(eventName, ...args) {
		if (isAlchemyEvent(eventName)) {
			let result = false;
			const stopped = [];
			const eventTag = getAlchemyEventTag(eventName);
			this._events = this._events.filter((event) => {
				if (event.tag !== eventTag) return true;
				setTimeout(() => {
					event.listener.apply(this, args);
				}, 0);
				result = true;
				if (event.once) {
					stopped.push(event);
					return false;
				}
				return true;
			});
			stopped.forEach((event) => {
				this._stopEvent(event);
			});
			return result;
		} else return super.emit(eventName, ...args);
	}
	sendBatch(parts) {
		return __awaiter$1(this, void 0, void 0, function* () {
			let nextId = 0;
			const payload = parts.map(({ method, params }) => {
				return {
					method,
					params,
					jsonrpc: "2.0",
					id: `alchemy-sdk:${nextId++}`
				};
			});
			return this.sendBatchConcurrently(payload);
		});
	}
	destroy() {
		this.removeSocketListeners();
		this.stopHeartbeatAndBackfill();
		return super.destroy();
	}
	isCommunityResource() {
		return this.apiKey === DEFAULT_ALCHEMY_API_KEY;
	}
	_stopEvent(event) {
		let tag = event.tag;
		if (ALCHEMY_EVENT_TYPES.includes(event.type)) {
			if (this._events.filter((e) => ALCHEMY_EVENT_TYPES.includes(e.type)).length) return;
		} else if (event.type === "tx") {
			if (this._events.filter((e) => e.type === "tx").length) return;
			tag = "tx";
		} else if (this.listenerCount(event.event)) return;
		const subId = this._subIds[tag];
		if (!subId) return;
		delete this._subIds[tag];
		subId.then((subId$1) => {
			if (!this._subs[subId$1]) return;
			delete this._subs[subId$1];
			this.send("eth_unsubscribe", [subId$1]);
		});
	}
	addSocketListeners() {
		this._websocket.addEventListener("message", this.handleMessage);
		this._websocket.addEventListener("reopen", this.handleReopen);
		this._websocket.addEventListener("down", this.stopHeartbeatAndBackfill);
	}
	removeSocketListeners() {
		this._websocket.removeEventListener("message", this.handleMessage);
		this._websocket.removeEventListener("reopen", this.handleReopen);
		this._websocket.removeEventListener("down", this.stopHeartbeatAndBackfill);
	}
	resubscribeAndBackfill(isCancelled, subscription) {
		return __awaiter$1(this, void 0, void 0, function* () {
			const { virtualId, method, params, sentEvents, backfillBuffer, startingBlockNumber } = subscription;
			subscription.isBackfilling = true;
			backfillBuffer.length = 0;
			try {
				const physicalId = yield this.send(method, params);
				throwIfCancelled(isCancelled);
				subscription.physicalId = physicalId;
				this.virtualIdsByPhysicalId.set(physicalId, virtualId);
				switch (params[0]) {
					case "newHeads": {
						const backfillEvents = yield withBackoffRetries(() => withTimeout(this.backfiller.getNewHeadsBackfill(isCancelled, sentEvents, startingBlockNumber), BACKFILL_TIMEOUT), 5, () => !isCancelled());
						throwIfCancelled(isCancelled);
						dedupeNewHeads([...backfillEvents, ...backfillBuffer]).forEach((event) => this.emitNewHeadsEvent(virtualId, event));
						break;
					}
					case "logs": {
						const filter = params[1] || {};
						const backfillEvents = yield withBackoffRetries(() => withTimeout(this.backfiller.getLogsBackfill(isCancelled, filter, sentEvents, startingBlockNumber), BACKFILL_TIMEOUT), 5, () => !isCancelled());
						throwIfCancelled(isCancelled);
						dedupeLogs([...backfillEvents, ...backfillBuffer]).forEach((event) => this.emitLogsEvent(virtualId, event));
						break;
					}
					default: break;
				}
			} finally {
				subscription.isBackfilling = false;
				backfillBuffer.length = 0;
			}
		});
	}
	emitNewHeadsEvent(virtualId, result) {
		this.emitAndRememberEvent(virtualId, result, getNewHeadsBlockNumber);
	}
	emitLogsEvent(virtualId, result) {
		this.emitAndRememberEvent(virtualId, result, getLogsBlockNumber);
	}
	emitAndRememberEvent(virtualId, result, getBlockNumber) {
		this.rememberEvent(virtualId, result, getBlockNumber);
		this.emitEvent(virtualId, result);
	}
	emitEvent(virtualId, result) {
		const subscription = this.virtualSubscriptionsById.get(virtualId);
		if (!subscription) return;
		this.emitGenericEvent(subscription, result);
	}
	rememberEvent(virtualId, result, getBlockNumber) {
		const subscription = this.virtualSubscriptionsById.get(virtualId);
		if (!subscription) return;
		addToPastEventsBuffer(subscription.sentEvents, Object.assign({}, result), getBlockNumber);
	}
	emitGenericEvent(subscription, result) {
		this.emitProcessFn(subscription.event)(result);
	}
	startHeartbeat() {
		if (this.heartbeatIntervalId != null) return;
		this.heartbeatIntervalId = setInterval(() => __awaiter$1(this, void 0, void 0, function* () {
			try {
				yield withTimeout(this.send("net_version"), HEARTBEAT_WAIT_TIME);
			} catch (_a) {
				this._websocket.reconnect();
			}
		}), HEARTBEAT_INTERVAL);
	}
	sendBatchConcurrently(payload) {
		return __awaiter$1(this, void 0, void 0, function* () {
			return Promise.all(payload.map((req) => this.send(req.method, req.params)));
		});
	}
	customStartEvent(event) {
		if (event.type === "alchemy-pending-transactions") {
			const { fromAddress, toAddress, hashesOnly } = event;
			this._subscribe(event.tag, [AlchemySubscription.PENDING_TRANSACTIONS, {
				fromAddress,
				toAddress,
				hashesOnly
			}], this.emitProcessFn(event), event);
		} else if (event.type === "alchemy-mined-transactions") {
			const { addresses, includeRemoved, hashesOnly } = event;
			this._subscribe(event.tag, [AlchemySubscription.MINED_TRANSACTIONS, {
				addresses,
				includeRemoved,
				hashesOnly
			}], this.emitProcessFn(event), event);
		} else if (event.type === "block") this._subscribe("block", ["newHeads"], this.emitProcessFn(event), event);
		else if (event.type === "filter") this._subscribe(event.tag, ["logs", this._getFilter(event.filter)], this.emitProcessFn(event), event);
	}
	emitProcessFn(event) {
		switch (event.type) {
			case ALCHEMY_PENDING_TRANSACTIONS_EVENT_TYPE: return (result) => this.emit({
				method: AlchemySubscription.PENDING_TRANSACTIONS,
				fromAddress: event.fromAddress,
				toAddress: event.toAddress,
				hashesOnly: event.hashesOnly
			}, result);
			case ALCHEMY_MINED_TRANSACTIONS_EVENT_TYPE: return (result) => this.emit({
				method: AlchemySubscription.MINED_TRANSACTIONS,
				addresses: event.addresses,
				includeRemoved: event.includeRemoved,
				hashesOnly: event.hashesOnly
			}, result);
			case "block": return (result) => {
				const blockNumber = BigNumber.from(result.number).toNumber();
				this._emitted.block = blockNumber;
				this.emit("block", blockNumber);
			};
			case "filter": return (result) => {
				if (result.removed == null) result.removed = false;
				this.emit(event.filter, this.formatter.filterLog(result));
			};
			default: throw new Error("Invalid event type to `emitProcessFn()`");
		}
	}
	_off(eventName, listener) {
		if (listener == null) return this.removeAllListeners(eventName);
		const stopped = [];
		let found = false;
		const eventTag = getAlchemyEventTag(eventName);
		this._events = this._events.filter((event) => {
			if (event.tag !== eventTag || event.listener != listener) return true;
			if (found) return true;
			found = true;
			stopped.push(event);
			return false;
		});
		stopped.forEach((event) => {
			this._stopEvent(event);
		});
		return this;
	}
	_removeAllListeners(eventName) {
		let stopped = [];
		if (eventName == null) {
			stopped = this._events;
			this._events = [];
		} else {
			const eventTag = getAlchemyEventTag(eventName);
			this._events = this._events.filter((event) => {
				if (event.tag !== eventTag) return true;
				stopped.push(event);
				return false;
			});
		}
		stopped.forEach((event) => {
			this._stopEvent(event);
		});
		return this;
	}
	_listenerCount(eventName) {
		if (!eventName) return this._events.length;
		const eventTag = getAlchemyEventTag(eventName);
		return this._events.filter((event) => {
			return event.tag === eventTag;
		}).length;
	}
	_listeners(eventName) {
		if (eventName == null) return this._events.map((event) => event.listener);
		const eventTag = getAlchemyEventTag(eventName);
		return this._events.filter((event) => event.tag === eventTag).map((event) => event.listener);
	}
};
function getWebsocketConstructor() {
	return isNodeEnvironment() ? require_browser().w3cwebsocket : WebSocket;
}
function isNodeEnvironment() {
	return typeof process !== "undefined" && process != null && process.versions != null && process.versions.node != null;
}
function makeCancelToken() {
	let cancelled = false;
	return {
		cancel: () => cancelled = true,
		isCancelled: () => cancelled
	};
}
var MIN_RETRY_DELAY = 1e3;
var MAX_RETRY_DELAY = 3e4;
function withBackoffRetries(f, retryCount, shouldRetry = () => true) {
	return __awaiter$1(this, void 0, void 0, function* () {
		let nextWaitTime = 0;
		let i = 0;
		while (true) try {
			return yield f();
		} catch (error) {
			i++;
			if (i >= retryCount || !shouldRetry(error)) throw error;
			yield delay(nextWaitTime);
			if (!shouldRetry(error)) throw error;
			nextWaitTime = nextWaitTime === 0 ? MIN_RETRY_DELAY : Math.min(MAX_RETRY_DELAY, 2 * nextWaitTime);
		}
	});
}
function delay(ms) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}
function withTimeout(promise, ms) {
	return Promise.race([promise, new Promise((_, reject) => setTimeout(() => reject(/* @__PURE__ */ new Error("Timeout")), ms))]);
}
function getNewHeadsBlockNumber(event) {
	return fromHex(event.number);
}
function getLogsBlockNumber(event) {
	return fromHex(event.blockNumber);
}
function isResponse(message) {
	return Array.isArray(message) || message.jsonrpc === "2.0" && message.id !== void 0;
}
function isSubscriptionEvent(message) {
	return !isResponse(message);
}
function addToNewHeadsEventsBuffer(pastEvents, event) {
	addToPastEventsBuffer(pastEvents, event, getNewHeadsBlockNumber);
}
function addToLogsEventsBuffer(pastEvents, event) {
	addToPastEventsBuffer(pastEvents, event, getLogsBlockNumber);
}
function addToPastEventsBuffer(pastEvents, event, getBlockNumber) {
	const currentBlockNumber = getBlockNumber(event);
	const firstGoodIndex = pastEvents.findIndex((e) => getBlockNumber(e) > currentBlockNumber - 10);
	if (firstGoodIndex === -1) pastEvents.length = 0;
	else pastEvents.splice(0, firstGoodIndex);
	pastEvents.push(event);
}
export { AlchemyWebSocketProvider };
