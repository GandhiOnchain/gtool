import { Co as fetchJson, _ as getAlchemyHttpUrl, a as CustomNetworks, b as logWarn, d as Network, f as VERSION, l as EthersNetwork, m as deepCopy, o as DEFAULT_ALCHEMY_API_KEY, p as __awaiter$1, s as DEFAULT_NETWORK, u as IS_BROWSER, v as getAlchemyWsUrl, wo as getNetwork, xo as JsonRpcProvider } from "./index-BWcXUVGx.js";
var RequestBatcher = class {
	constructor(sendBatchFn, maxBatchSize = 100) {
		this.sendBatchFn = sendBatchFn;
		this.maxBatchSize = maxBatchSize;
		this.pendingBatch = [];
	}
	enqueueRequest(request) {
		return __awaiter$1(this, void 0, void 0, function* () {
			const inflightRequest = {
				request,
				resolve: void 0,
				reject: void 0
			};
			const promise = new Promise((resolve, reject) => {
				inflightRequest.resolve = resolve;
				inflightRequest.reject = reject;
			});
			this.pendingBatch.push(inflightRequest);
			if (this.pendingBatch.length === this.maxBatchSize) this.sendBatchRequest();
			else if (!this.pendingBatchTimer) this.pendingBatchTimer = setTimeout(() => this.sendBatchRequest(), 10);
			return promise;
		});
	}
	sendBatchRequest() {
		return __awaiter$1(this, void 0, void 0, function* () {
			const batch = this.pendingBatch;
			this.pendingBatch = [];
			if (this.pendingBatchTimer) {
				clearTimeout(this.pendingBatchTimer);
				this.pendingBatchTimer = void 0;
			}
			const request = batch.map((inflight) => inflight.request);
			return this.sendBatchFn(request).then((result) => {
				batch.forEach((inflightRequest, index) => {
					const payload = result[index];
					if (payload.error) {
						const error = new Error(payload.error.message);
						error.code = payload.error.code;
						error.data = payload.error.data;
						inflightRequest.reject(error);
					} else inflightRequest.resolve(payload.result);
				});
			}, (error) => {
				batch.forEach((inflightRequest) => {
					inflightRequest.reject(error);
				});
			});
		});
	}
};
var AlchemyProvider = class AlchemyProvider extends JsonRpcProvider {
	constructor(config) {
		const apiKey = AlchemyProvider.getApiKey(config.apiKey);
		const alchemyNetwork = AlchemyProvider.getAlchemyNetwork(config.network);
		let connection = AlchemyProvider.getAlchemyConnectionInfo(alchemyNetwork, apiKey, "http");
		if (config.url !== void 0) connection.url = config.url;
		connection.throttleLimit = config.maxRetries;
		if (config.connectionInfoOverrides) connection = Object.assign(Object.assign({}, connection), config.connectionInfoOverrides);
		const ethersNetwork = EthersNetwork[alchemyNetwork];
		if (!ethersNetwork) throw new Error(`Unsupported network: ${alchemyNetwork}`);
		super(connection, ethersNetwork);
		this.apiKey = config.apiKey;
		this.maxRetries = config.maxRetries;
		this.batchRequests = config.batchRequests;
		const batcherConnection = Object.assign(Object.assign({}, this.connection), { headers: Object.assign(Object.assign({}, this.connection.headers), { "Alchemy-Ethers-Sdk-Method": "batchSend" }) });
		const sendBatchFn = (requests) => {
			return fetchJson(batcherConnection, JSON.stringify(requests));
		};
		this.batcher = new RequestBatcher(sendBatchFn);
		this.modifyFormatter();
	}
	static getApiKey(apiKey) {
		if (apiKey == null) return DEFAULT_ALCHEMY_API_KEY;
		if (apiKey && typeof apiKey !== "string") throw new Error(`Invalid apiKey '${apiKey}' provided. apiKey must be a string.`);
		return apiKey;
	}
	static getNetwork(network) {
		if (typeof network === "string" && network in CustomNetworks) return CustomNetworks[network];
		return getNetwork(network);
	}
	static getAlchemyNetwork(network) {
		if (network === void 0) return DEFAULT_NETWORK;
		if (typeof network === "number") throw new Error(`Invalid network '${network}' provided. Network must be a string.`);
		if (!Object.values(Network).includes(network)) throw new Error(`Invalid network '${network}' provided. Network must be one of: ${Object.values(Network).join(", ")}.`);
		return network;
	}
	static getAlchemyConnectionInfo(network, apiKey, type) {
		const url = type === "http" ? getAlchemyHttpUrl(network, apiKey) : getAlchemyWsUrl(network, apiKey);
		return {
			headers: IS_BROWSER ? { "Alchemy-Ethers-Sdk-Version": VERSION } : {
				"Alchemy-Ethers-Sdk-Version": VERSION,
				"Accept-Encoding": "gzip"
			},
			allowGzip: true,
			url
		};
	}
	detectNetwork() {
		const _super = Object.create(null, { detectNetwork: { get: () => super.detectNetwork } });
		return __awaiter$1(this, void 0, void 0, function* () {
			let network = this.network;
			if (network == null) {
				network = yield _super.detectNetwork.call(this);
				if (!network) throw new Error("No network detected");
			}
			return network;
		});
	}
	_startPending() {
		logWarn("WARNING: Alchemy Provider does not support pending filters");
	}
	isCommunityResource() {
		return this.apiKey === DEFAULT_ALCHEMY_API_KEY;
	}
	send(method, params) {
		return this._send(method, params, "send");
	}
	_send(method, params, methodName) {
		const request = {
			method,
			params,
			id: this._nextId++,
			jsonrpc: "2.0"
		};
		const connection = Object.assign({}, this.connection);
		connection.headers["Alchemy-Ethers-Sdk-Method"] = methodName;
		if (this.batchRequests) return this.batcher.enqueueRequest(request);
		this.emit("debug", {
			action: "request",
			request: deepCopy(request),
			provider: this
		});
		const cache = ["eth_chainId", "eth_blockNumber"].indexOf(method) >= 0;
		if (cache && this._cache[method]) return this._cache[method];
		const result = fetchJson(this.connection, JSON.stringify(request), getResult).then((result$1) => {
			this.emit("debug", {
				action: "response",
				request,
				response: result$1,
				provider: this
			});
			return result$1;
		}, (error) => {
			this.emit("debug", {
				action: "response",
				error,
				request,
				provider: this
			});
			throw error;
		});
		if (cache) {
			this._cache[method] = result;
			setTimeout(() => {
				this._cache[method] = null;
			}, 0);
		}
		return result;
	}
	modifyFormatter() {
		this.formatter.formats["receiptLog"]["removed"] = (val) => {
			if (typeof val === "boolean") return val;
		};
	}
};
function getResult(payload) {
	if (payload.error) {
		const error = new Error(payload.error.message);
		error.code = payload.error.code;
		error.data = payload.error.data;
		throw error;
	}
	return payload.result;
}
export { AlchemyProvider as t };
