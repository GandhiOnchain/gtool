const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/secp256k1-DfgUDMF_.js","assets/index-CP7HEn1x.js","assets/index-iNW_OW14.css","assets/utils-ZuoTBGam.js","assets/basic-Bx7U79E3.js","assets/lit-COTpoEUt.js","assets/wui-text-woI85XpB.js","assets/ConstantsUtil-BkAzooxe.js","assets/ConnectorUtil-CLFmfGhi.js","assets/w3m-modal-C3aiu4Ji.js","assets/SIWXUtil-Ce1Ig_GN.js"])))=>i.map(i=>d[i]);
import { $t as require_events, At as import_browser, Bt as IEvents, Ct as formatJsonRpcError, Dt as payloadId, Et as getBigIntRpcId, Gt as Qo$1, Ht as bases, Io as __vitePreload, Jt as safeJsonStringify, Kt as sn, Mt as y$1, Nt as h$1, Ot as A$1, Qt as detect, Rt as i, St as isJsonRpcResult, Tt as formatJsonRpcResult, Ut as Po$2, Vt as C$3, Wt as Qe$3, Xt as require_cjs$1, Yt as require_cjs$2, Zo as __toESM, Zt as require_cjs, _t as f$2, bt as isJsonRpcRequest, gt as f, jt as k, kt as E$1, qt as safeJsonParse, vt as o, wt as formatJsonRpcRequest, xt as isJsonRpcResponse, yt as isJsonRpcError, zt as r } from "./index-CP7HEn1x.js";
import { A as StorageUtil, C as EventsController, D as withErrorBoundary, F as ConstantsUtil, I as subscribeKey, L as proxy, M as MELD_PUBLIC_KEY, N as ONRAMP_PROVIDERS, O as OptionsController, P as NetworkUtil, R as ref, S as ApiController, T as AssetUtil, _ as SnackController, b as ThemeController, c as setColorTheme, d as AccountController, f as BlockchainApiController, g as ConnectionController, h as PublicStateController, j as ConstantsUtil$1, k as CoreHelperUtil, l as setThemeVariables, m as SendController, p as ChainController, u as ModalController, w as AlertController, x as RouterController, y as ConnectorController, z as subscribe } from "./ConstantsUtil-BkAzooxe.js";
import "./lit-COTpoEUt.js";
import { t as SIWXUtil } from "./SIWXUtil-Ce1Ig_GN.js";
import { i as ConstantsUtil$2, n as WalletUtil, r as HelpersUtil } from "./ConnectorUtil-CLFmfGhi.js";
import { a as isLE, c as toBytes$1, d as wrapXOFConstructorWithOpts, f as abytes, g as aoutput, h as anumber, l as u32, n as byteSwap32, p as aexists, t as Hash, u as wrapConstructor } from "./utils-ZuoTBGam.js";
const ParseUtil = {
	validateCaipAddress(address) {
		if (address.split(":")?.length !== 3) throw new Error("Invalid CAIP Address");
		return address;
	},
	parseCaipAddress(caipAddress) {
		const parts = caipAddress.split(":");
		if (parts.length !== 3) throw new Error(`Invalid CAIP-10 address: ${caipAddress}`);
		const [chainNamespace, chainId, address] = parts;
		if (!chainNamespace || !chainId || !address) throw new Error(`Invalid CAIP-10 address: ${caipAddress}`);
		return {
			chainNamespace,
			chainId,
			address
		};
	},
	parseCaipNetworkId(caipNetworkId) {
		const parts = caipNetworkId.split(":");
		if (parts.length !== 2) throw new Error(`Invalid CAIP-2 network id: ${caipNetworkId}`);
		const [chainNamespace, chainId] = parts;
		if (!chainNamespace || !chainId) throw new Error(`Invalid CAIP-2 network id: ${caipNetworkId}`);
		return {
			chainNamespace,
			chainId
		};
	}
};
const USDC_CURRENCY_DEFAULT = {
	id: "2b92315d-eab7-5bef-84fa-089a131333f5",
	name: "USD Coin",
	symbol: "USDC",
	networks: [{
		name: "ethereum-mainnet",
		display_name: "Ethereum",
		chain_id: "1",
		contract_address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"
	}, {
		name: "polygon-mainnet",
		display_name: "Polygon",
		chain_id: "137",
		contract_address: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174"
	}]
};
const USD_CURRENCY_DEFAULT = {
	id: "USD",
	payment_method_limits: [{
		id: "card",
		min: "10.00",
		max: "7500.00"
	}, {
		id: "ach_bank_account",
		min: "10.00",
		max: "25000.00"
	}]
};
var state$2 = proxy({
	providers: ONRAMP_PROVIDERS,
	selectedProvider: null,
	error: null,
	purchaseCurrency: USDC_CURRENCY_DEFAULT,
	paymentCurrency: USD_CURRENCY_DEFAULT,
	purchaseCurrencies: [USDC_CURRENCY_DEFAULT],
	paymentCurrencies: [],
	quotesLoading: false
});
const OnRampController = withErrorBoundary({
	state: state$2,
	subscribe(callback) {
		return subscribe(state$2, () => callback(state$2));
	},
	subscribeKey(key, callback) {
		return subscribeKey(state$2, key, callback);
	},
	setSelectedProvider(provider) {
		if (provider && provider.name === "meld") {
			const currency = ChainController.state.activeChain === ConstantsUtil.CHAIN.SOLANA ? "SOL" : "USDC";
			const address = AccountController.state.address ?? "";
			const url = new URL(provider.url);
			url.searchParams.append("publicKey", MELD_PUBLIC_KEY);
			url.searchParams.append("destinationCurrencyCode", currency);
			url.searchParams.append("walletAddress", address);
			url.searchParams.append("externalCustomerId", OptionsController.state.projectId);
			state$2.selectedProvider = {
				...provider,
				url: url.toString()
			};
		} else state$2.selectedProvider = provider;
	},
	setOnrampProviders(providers) {
		if (Array.isArray(providers) && providers.every((item) => typeof item === "string")) {
			const validOnramp = providers;
			state$2.providers = ONRAMP_PROVIDERS.filter((provider) => validOnramp.includes(provider.name));
		} else state$2.providers = [];
	},
	setPurchaseCurrency(currency) {
		state$2.purchaseCurrency = currency;
	},
	setPaymentCurrency(currency) {
		state$2.paymentCurrency = currency;
	},
	setPurchaseAmount(amount) {
		OnRampController.state.purchaseAmount = amount;
	},
	setPaymentAmount(amount) {
		OnRampController.state.paymentAmount = amount;
	},
	async getAvailableCurrencies() {
		const options = await BlockchainApiController.getOnrampOptions();
		state$2.purchaseCurrencies = options.purchaseCurrencies;
		state$2.paymentCurrencies = options.paymentCurrencies;
		state$2.paymentCurrency = options.paymentCurrencies[0] || USD_CURRENCY_DEFAULT;
		state$2.purchaseCurrency = options.purchaseCurrencies[0] || USDC_CURRENCY_DEFAULT;
		await ApiController.fetchCurrencyImages(options.paymentCurrencies.map((currency) => currency.id));
		await ApiController.fetchTokenImages(options.purchaseCurrencies.map((currency) => currency.symbol));
	},
	async getQuote() {
		state$2.quotesLoading = true;
		try {
			const quote = await BlockchainApiController.getOnrampQuote({
				purchaseCurrency: state$2.purchaseCurrency,
				paymentCurrency: state$2.paymentCurrency,
				amount: state$2.paymentAmount?.toString() || "0",
				network: state$2.purchaseCurrency?.symbol
			});
			state$2.quotesLoading = false;
			state$2.purchaseAmount = Number(quote?.purchaseAmount.amount);
			return quote;
		} catch (error) {
			state$2.error = error.message;
			state$2.quotesLoading = false;
			return null;
		} finally {
			state$2.quotesLoading = false;
		}
	},
	resetState() {
		state$2.selectedProvider = null;
		state$2.error = null;
		state$2.purchaseCurrency = USDC_CURRENCY_DEFAULT;
		state$2.paymentCurrency = USD_CURRENCY_DEFAULT;
		state$2.purchaseCurrencies = [USDC_CURRENCY_DEFAULT];
		state$2.paymentCurrencies = [];
		state$2.paymentAmount = void 0;
		state$2.purchaseAmount = void 0;
		state$2.quotesLoading = false;
	}
});
var SLIP44_MSB = 2147483648;
const EnsUtil = { convertEVMChainIdToCoinType(chainId) {
	if (chainId >= 2147483648) throw new Error("Invalid chainId");
	return (SLIP44_MSB | chainId) >>> 0;
} };
var state$1 = proxy({
	suggestions: [],
	loading: false
});
const EnsController = withErrorBoundary({
	state: state$1,
	subscribe(callback) {
		return subscribe(state$1, () => callback(state$1));
	},
	subscribeKey(key, callback) {
		return subscribeKey(state$1, key, callback);
	},
	async resolveName(name) {
		try {
			return await BlockchainApiController.lookupEnsName(name);
		} catch (e) {
			const error = e;
			throw new Error(error?.reasons?.[0]?.description || "Error resolving name");
		}
	},
	async isNameRegistered(name) {
		try {
			await BlockchainApiController.lookupEnsName(name);
			return true;
		} catch {
			return false;
		}
	},
	async getSuggestions(value) {
		try {
			state$1.loading = true;
			state$1.suggestions = [];
			state$1.suggestions = (await BlockchainApiController.getEnsNameSuggestions(value)).suggestions.map((suggestion) => ({
				...suggestion,
				name: suggestion.name
			})) || [];
			return state$1.suggestions;
		} catch (e) {
			const errorMessage = EnsController.parseEnsApiError(e, "Error fetching name suggestions");
			throw new Error(errorMessage);
		} finally {
			state$1.loading = false;
		}
	},
	async getNamesForAddress(address) {
		try {
			if (!ChainController.state.activeCaipNetwork) return [];
			const cachedEns = StorageUtil.getEnsFromCacheForAddress(address);
			if (cachedEns) return cachedEns;
			const response = await BlockchainApiController.reverseLookupEnsName({ address });
			StorageUtil.updateEnsCache({
				address,
				ens: response,
				timestamp: Date.now()
			});
			return response;
		} catch (e) {
			const errorMessage = EnsController.parseEnsApiError(e, "Error fetching names for address");
			throw new Error(errorMessage);
		}
	},
	async registerName(name) {
		const network = ChainController.state.activeCaipNetwork;
		if (!network) throw new Error("Network not found");
		const address = AccountController.state.address;
		const emailConnector = ConnectorController.getAuthConnector();
		if (!address || !emailConnector) throw new Error("Address or auth connector not found");
		state$1.loading = true;
		try {
			const message = JSON.stringify({
				name,
				attributes: {},
				timestamp: Math.floor(Date.now() / 1e3)
			});
			RouterController.pushTransactionStack({ onCancel() {
				RouterController.replace("RegisterAccountName");
			} });
			const signature = await ConnectionController.signMessage(message);
			state$1.loading = false;
			const networkId = network.id;
			if (!networkId) throw new Error("Network not found");
			const coinType = EnsUtil.convertEVMChainIdToCoinType(Number(networkId));
			await BlockchainApiController.registerEnsName({
				coinType,
				address,
				signature,
				message
			});
			AccountController.setProfileName(name, network.chainNamespace);
			RouterController.replace("RegisterAccountNameSuccess");
		} catch (e) {
			const errorMessage = EnsController.parseEnsApiError(e, `Error registering name ${name}`);
			RouterController.replace("RegisterAccountName");
			throw new Error(errorMessage);
		} finally {
			state$1.loading = false;
		}
	},
	validateName(name) {
		return /^[a-zA-Z0-9-]{4,}$/u.test(name);
	},
	parseEnsApiError(error, defaultError) {
		return error?.reasons?.[0]?.description || defaultError;
	}
});
const PresetsUtil = {
	ConnectorExplorerIds: {
		[ConstantsUtil.CONNECTOR_ID.COINBASE]: "fd20dc426fb37566d803205b19bbc1d4096b248ac04548e3cfb6b3a38bd033aa",
		[ConstantsUtil.CONNECTOR_ID.COINBASE_SDK]: "fd20dc426fb37566d803205b19bbc1d4096b248ac04548e3cfb6b3a38bd033aa",
		[ConstantsUtil.CONNECTOR_ID.SAFE]: "225affb176778569276e484e1b92637ad061b01e13a048b35a9d280c3b58970f",
		[ConstantsUtil.CONNECTOR_ID.LEDGER]: "19177a98252e07ddfc9af2083ba8e07ef627cb6103467ffebb3f8f4205fd7927",
		[ConstantsUtil.CONNECTOR_ID.OKX]: "971e689d0a5be527bac79629b4ee9b925e82208e5168b733496a09c0faed0709",
		[ConstantsUtil$2.METMASK_CONNECTOR_NAME]: "c57ca95b47569778a828d19178114f4db188b89b763c899ba0be274e97267d96",
		[ConstantsUtil$2.TRUST_CONNECTOR_NAME]: "4622a2b2d6af1c9844944291e5e7351a6aa24cd7b23099efac1b2fd875da31a0",
		[ConstantsUtil$2.SOLFLARE_CONNECTOR_NAME]: "1ca0bdd4747578705b1939af023d120677c64fe6ca76add81fda36e350605e79",
		[ConstantsUtil$2.PHANTOM_CONNECTOR_NAME]: "a797aa35c0fadbfc1a53e7f675162ed5226968b44a19ee3d24385c64d1d3c393",
		[ConstantsUtil$2.COIN98_CONNECTOR_NAME]: "2a3c89040ac3b723a1972a33a125b1db11e258a6975d3a61252cd64e6ea5ea01",
		[ConstantsUtil$2.MAGIC_EDEN_CONNECTOR_NAME]: "8b830a2b724a9c3fbab63af6f55ed29c9dfa8a55e732dc88c80a196a2ba136c6",
		[ConstantsUtil$2.BACKPACK_CONNECTOR_NAME]: "2bd8c14e035c2d48f184aaa168559e86b0e3433228d3c4075900a221785019b0",
		[ConstantsUtil$2.BITGET_CONNECTOR_NAME]: "38f5d18bd8522c244bdd70cb4a68e0e718865155811c043f052fb9f1c51de662",
		[ConstantsUtil$2.FRONTIER_CONNECTOR_NAME]: "85db431492aa2e8672e93f4ea7acf10c88b97b867b0d373107af63dc4880f041",
		[ConstantsUtil$2.XVERSE_CONNECTOR_NAME]: "2a87d74ae02e10bdd1f51f7ce6c4e1cc53cd5f2c0b6b5ad0d7b3007d2b13de7b",
		[ConstantsUtil$2.LEATHER_CONNECTOR_NAME]: "483afe1df1df63daf313109971ff3ef8356ddf1cc4e45877d205eee0b7893a13"
	},
	NetworkImageIds: {
		1: "ba0ba0cd-17c6-4806-ad93-f9d174f17900",
		42161: "3bff954d-5cb0-47a0-9a23-d20192e74600",
		43114: "30c46e53-e989-45fb-4549-be3bd4eb3b00",
		56: "93564157-2e8e-4ce7-81df-b264dbee9b00",
		250: "06b26297-fe0c-4733-5d6b-ffa5498aac00",
		10: "ab9c186a-c52f-464b-2906-ca59d760a400",
		137: "41d04d42-da3b-4453-8506-668cc0727900",
		5e3: "e86fae9b-b770-4eea-e520-150e12c81100",
		295: "6a97d510-cac8-4e58-c7ce-e8681b044c00",
		11155111: "e909ea0a-f92a-4512-c8fc-748044ea6800",
		84532: "a18a7ecd-e307-4360-4746-283182228e00",
		1301: "4eeea7ef-0014-4649-5d1d-07271a80f600",
		130: "2257980a-3463-48c6-cbac-a42d2a956e00",
		10143: "0a728e83-bacb-46db-7844-948f05434900",
		100: "02b53f6a-e3d4-479e-1cb4-21178987d100",
		9001: "f926ff41-260d-4028-635e-91913fc28e00",
		324: "b310f07f-4ef7-49f3-7073-2a0a39685800",
		314: "5a73b3dd-af74-424e-cae0-0de859ee9400",
		4689: "34e68754-e536-40da-c153-6ef2e7188a00",
		1088: "3897a66d-40b9-4833-162f-a2c90531c900",
		1284: "161038da-44ae-4ec7-1208-0ea569454b00",
		1285: "f1d73bb6-5450-4e18-38f7-fb6484264a00",
		7777777: "845c60df-d429-4991-e687-91ae45791600",
		42220: "ab781bbc-ccc6-418d-d32d-789b15da1f00",
		8453: "7289c336-3981-4081-c5f4-efc26ac64a00",
		1313161554: "3ff73439-a619-4894-9262-4470c773a100",
		2020: "b8101fc0-9c19-4b6f-ec65-f6dfff106e00",
		2021: "b8101fc0-9c19-4b6f-ec65-f6dfff106e00",
		80094: "e329c2c9-59b0-4a02-83e4-212ff3779900",
		2741: "fc2427d1-5af9-4a9c-8da5-6f94627cd900",
		"5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp": "a1b58899-f671-4276-6a5e-56ca5bd59700",
		"4uhcVJyU9pJkvQyS88uRDiswHXSCkY3z": "a1b58899-f671-4276-6a5e-56ca5bd59700",
		EtWTRABZaYq6iMfeYKouRu166VU2xqa1: "a1b58899-f671-4276-6a5e-56ca5bd59700",
		"000000000019d6689c085ae165831e93": "0b4838db-0161-4ffe-022d-532bf03dba00",
		"000000000933ea01ad0ee984209779ba": "39354064-d79b-420b-065d-f980c4b78200"
	},
	ConnectorImageIds: {
		[ConstantsUtil.CONNECTOR_ID.COINBASE]: "0c2840c3-5b04-4c44-9661-fbd4b49e1800",
		[ConstantsUtil.CONNECTOR_ID.COINBASE_SDK]: "0c2840c3-5b04-4c44-9661-fbd4b49e1800",
		[ConstantsUtil.CONNECTOR_ID.SAFE]: "461db637-8616-43ce-035a-d89b8a1d5800",
		[ConstantsUtil.CONNECTOR_ID.LEDGER]: "54a1aa77-d202-4f8d-0fb2-5d2bb6db0300",
		[ConstantsUtil.CONNECTOR_ID.WALLET_CONNECT]: "ef1a1fcf-7fe8-4d69-bd6d-fda1345b4400",
		[ConstantsUtil.CONNECTOR_ID.INJECTED]: "07ba87ed-43aa-4adf-4540-9e6a2b9cae00"
	},
	ConnectorNamesMap: {
		[ConstantsUtil.CONNECTOR_ID.INJECTED]: "Browser Wallet",
		[ConstantsUtil.CONNECTOR_ID.WALLET_CONNECT]: "WalletConnect",
		[ConstantsUtil.CONNECTOR_ID.COINBASE]: "Coinbase",
		[ConstantsUtil.CONNECTOR_ID.COINBASE_SDK]: "Coinbase",
		[ConstantsUtil.CONNECTOR_ID.LEDGER]: "Ledger",
		[ConstantsUtil.CONNECTOR_ID.SAFE]: "Safe"
	},
	ConnectorTypesMap: {
		[ConstantsUtil.CONNECTOR_ID.INJECTED]: "INJECTED",
		[ConstantsUtil.CONNECTOR_ID.WALLET_CONNECT]: "WALLET_CONNECT",
		[ConstantsUtil.CONNECTOR_ID.EIP6963]: "ANNOUNCED",
		[ConstantsUtil.CONNECTOR_ID.AUTH]: "AUTH"
	},
	WalletConnectRpcChainIds: [
		1,
		5,
		11155111,
		10,
		420,
		42161,
		421613,
		137,
		80001,
		42220,
		1313161554,
		1313161555,
		56,
		97,
		43114,
		43113,
		100,
		8453,
		84531,
		7777777,
		999,
		324,
		280
	]
};
const ErrorUtil = {
	EmbeddedWalletAbortController: new AbortController(),
	UniversalProviderErrors: {
		UNAUTHORIZED_DOMAIN_NOT_ALLOWED: {
			message: "Unauthorized: origin not allowed",
			alertErrorKey: "INVALID_APP_CONFIGURATION"
		},
		JWT_VALIDATION_ERROR: {
			message: "JWT validation error: JWT Token is not yet valid",
			alertErrorKey: "JWT_TOKEN_NOT_VALID"
		},
		INVALID_KEY: {
			message: "Unauthorized: invalid key",
			alertErrorKey: "INVALID_PROJECT_ID"
		}
	},
	ALERT_ERRORS: {
		SWITCH_NETWORK_NOT_FOUND: {
			shortMessage: "Network Not Found",
			longMessage: "Network not found - please make sure it is included in 'networks' array in createAppKit function"
		},
		INVALID_APP_CONFIGURATION: {
			shortMessage: "Invalid App Configuration",
			longMessage: () => `Origin ${isSafe() ? window.origin : "unknown"} not found on Allowlist - update configuration on cloud.reown.com`
		},
		IFRAME_LOAD_FAILED: {
			shortMessage: "Network Error - Could not load embedded wallet",
			longMessage: () => "There was an issue loading the embedded wallet. Please try again later."
		},
		IFRAME_REQUEST_TIMEOUT: {
			shortMessage: "Embedded Wallet Request Timed Out",
			longMessage: () => "There was an issue doing the request to the embedded wallet. Please try again later."
		},
		UNVERIFIED_DOMAIN: {
			shortMessage: "Invalid App Configuration",
			longMessage: () => "There was an issue loading the embedded wallet. Please verify that your domain is allowed at cloud.reown.com"
		},
		JWT_TOKEN_NOT_VALID: {
			shortMessage: "Session Expired",
			longMessage: "Invalid session found on UniversalProvider - please check your time settings and connect again"
		},
		INVALID_PROJECT_ID: {
			shortMessage: "Invalid App Configuration",
			longMessage: "Invalid Project ID - update configuration"
		},
		PROJECT_ID_NOT_CONFIGURED: {
			shortMessage: "Project ID Not Configured",
			longMessage: "Project ID Not Configured - update configuration on cloud.reown.com"
		}
	}
};
function isSafe() {
	return typeof window !== "undefined";
}
const LoggerUtil = { createLogger(onError, level = "error") {
	const loggerOptions = k({ level });
	const { logger } = A$1({ opts: loggerOptions });
	logger.error = (...args) => {
		for (const arg of args) if (arg instanceof Error) {
			onError(arg, ...args);
			return;
		}
		onError(void 0, ...args);
	};
	return logger;
} };
function isHex$2(value, { strict = true } = {}) {
	if (!value) return false;
	if (typeof value !== "string") return false;
	return strict ? /^0x[0-9a-fA-F]*$/.test(value) : value.startsWith("0x");
}
function size$3(value) {
	if (isHex$2(value, { strict: false })) return Math.ceil((value.length - 2) / 2);
	return value.length;
}
const version$2 = "2.37.6";
var errorConfig$2 = {
	getDocsUrl: ({ docsBaseUrl, docsPath = "", docsSlug }) => docsPath ? `${docsBaseUrl ?? "https://viem.sh"}${docsPath}${docsSlug ? `#${docsSlug}` : ""}` : void 0,
	version: `viem@${version$2}`
};
var BaseError$2 = class BaseError$2 extends Error {
	constructor(shortMessage, args = {}) {
		const details = (() => {
			if (args.cause instanceof BaseError$2) return args.cause.details;
			if (args.cause?.message) return args.cause.message;
			return args.details;
		})();
		const docsPath = (() => {
			if (args.cause instanceof BaseError$2) return args.cause.docsPath || args.docsPath;
			return args.docsPath;
		})();
		const docsUrl = errorConfig$2.getDocsUrl?.({
			...args,
			docsPath
		});
		const message = [
			shortMessage || "An error occurred.",
			"",
			...args.metaMessages ? [...args.metaMessages, ""] : [],
			...docsUrl ? [`Docs: ${docsUrl}`] : [],
			...details ? [`Details: ${details}`] : [],
			...errorConfig$2.version ? [`Version: ${errorConfig$2.version}`] : []
		].join("\n");
		super(message, args.cause ? { cause: args.cause } : void 0);
		Object.defineProperty(this, "details", {
			enumerable: true,
			configurable: true,
			writable: true,
			value: void 0
		});
		Object.defineProperty(this, "docsPath", {
			enumerable: true,
			configurable: true,
			writable: true,
			value: void 0
		});
		Object.defineProperty(this, "metaMessages", {
			enumerable: true,
			configurable: true,
			writable: true,
			value: void 0
		});
		Object.defineProperty(this, "shortMessage", {
			enumerable: true,
			configurable: true,
			writable: true,
			value: void 0
		});
		Object.defineProperty(this, "version", {
			enumerable: true,
			configurable: true,
			writable: true,
			value: void 0
		});
		Object.defineProperty(this, "name", {
			enumerable: true,
			configurable: true,
			writable: true,
			value: "BaseError"
		});
		this.details = details;
		this.docsPath = docsPath;
		this.metaMessages = args.metaMessages;
		this.name = args.name ?? this.name;
		this.shortMessage = shortMessage;
		this.version = version$2;
	}
	walk(fn$2) {
		return walk$2(this, fn$2);
	}
};
function walk$2(err, fn$2) {
	if (fn$2?.(err)) return err;
	if (err && typeof err === "object" && "cause" in err && err.cause !== void 0) return walk$2(err.cause, fn$2);
	return fn$2 ? null : err;
}
var SizeExceedsPaddingSizeError$2 = class extends BaseError$2 {
	constructor({ size: size$4, targetSize, type }) {
		super(`${type.charAt(0).toUpperCase()}${type.slice(1).toLowerCase()} size (${size$4}) exceeds padding size (${targetSize}).`, { name: "SizeExceedsPaddingSizeError" });
	}
};
function pad$2(hexOrBytes, { dir, size: size$4 = 32 } = {}) {
	if (typeof hexOrBytes === "string") return padHex$2(hexOrBytes, {
		dir,
		size: size$4
	});
	return padBytes$2(hexOrBytes, {
		dir,
		size: size$4
	});
}
function padHex$2(hex_, { dir, size: size$4 = 32 } = {}) {
	if (size$4 === null) return hex_;
	const hex = hex_.replace("0x", "");
	if (hex.length > size$4 * 2) throw new SizeExceedsPaddingSizeError$2({
		size: Math.ceil(hex.length / 2),
		targetSize: size$4,
		type: "hex"
	});
	return `0x${hex[dir === "right" ? "padEnd" : "padStart"](size$4 * 2, "0")}`;
}
function padBytes$2(bytes, { dir, size: size$4 = 32 } = {}) {
	if (size$4 === null) return bytes;
	if (bytes.length > size$4) throw new SizeExceedsPaddingSizeError$2({
		size: bytes.length,
		targetSize: size$4,
		type: "bytes"
	});
	const paddedBytes = new Uint8Array(size$4);
	for (let i$2 = 0; i$2 < size$4; i$2++) {
		const padEnd = dir === "right";
		paddedBytes[padEnd ? i$2 : size$4 - i$2 - 1] = bytes[padEnd ? i$2 : bytes.length - i$2 - 1];
	}
	return paddedBytes;
}
var SizeOverflowError$2 = class extends BaseError$2 {
	constructor({ givenSize, maxSize }) {
		super(`Size cannot exceed ${maxSize} bytes. Given size: ${givenSize} bytes.`, { name: "SizeOverflowError" });
	}
};
function assertSize$2(hexOrBytes, { size: size$4 }) {
	if (size$3(hexOrBytes) > size$4) throw new SizeOverflowError$2({
		givenSize: size$3(hexOrBytes),
		maxSize: size$4
	});
}
var hexes$2 = /* @__PURE__ */ Array.from({ length: 256 }, (_v, i$2) => i$2.toString(16).padStart(2, "0"));
function bytesToHex$2(value, opts = {}) {
	let string$2 = "";
	for (let i$2 = 0; i$2 < value.length; i$2++) string$2 += hexes$2[value[i$2]];
	const hex = `0x${string$2}`;
	if (typeof opts.size === "number") {
		assertSize$2(hex, { size: opts.size });
		return pad$2(hex, {
			dir: "right",
			size: opts.size
		});
	}
	return hex;
}
var encoder$3 = /* @__PURE__ */ new TextEncoder();
function stringToHex$2(value_, opts = {}) {
	const value = encoder$3.encode(value_);
	return bytesToHex$2(value, opts);
}
var LruMap$1 = class extends Map {
	constructor(size$4) {
		super();
		Object.defineProperty(this, "maxSize", {
			enumerable: true,
			configurable: true,
			writable: true,
			value: void 0
		});
		this.maxSize = size$4;
	}
	get(key) {
		const value = super.get(key);
		if (super.has(key) && value !== void 0) {
			this.delete(key);
			super.set(key, value);
		}
		return value;
	}
	set(key, value) {
		super.set(key, value);
		if (this.maxSize && this.size > this.maxSize) {
			const firstKey = this.keys().next().value;
			if (firstKey) this.delete(firstKey);
		}
		return this;
	}
};
const stringify = (value, replacer, space) => JSON.stringify(value, (key, value_) => {
	const value$1 = typeof value_ === "bigint" ? value_.toString() : value_;
	return typeof replacer === "function" ? replacer(key, value$1) : value$1;
}, space);
const gweiUnits = {
	ether: -9,
	wei: 9
};
function formatUnits(value, decimals) {
	let display = value.toString();
	const negative = display.startsWith("-");
	if (negative) display = display.slice(1);
	display = display.padStart(decimals, "0");
	let [integer, fraction] = [display.slice(0, display.length - decimals), display.slice(display.length - decimals)];
	fraction = fraction.replace(/(0+)$/, "");
	return `${negative ? "-" : ""}${integer || "0"}${fraction ? `.${fraction}` : ""}`;
}
function formatGwei(wei, unit = "wei") {
	return formatUnits(wei, gweiUnits[unit]);
}
const getUrl = (url) => url;
var HttpRequestError = class extends BaseError$2 {
	constructor({ body, cause, details, headers, status, url }) {
		super("HTTP request failed.", {
			cause,
			details,
			metaMessages: [
				status && `Status: ${status}`,
				`URL: ${getUrl(url)}`,
				body && `Request body: ${stringify(body)}`
			].filter(Boolean),
			name: "HttpRequestError"
		});
		Object.defineProperty(this, "body", {
			enumerable: true,
			configurable: true,
			writable: true,
			value: void 0
		});
		Object.defineProperty(this, "headers", {
			enumerable: true,
			configurable: true,
			writable: true,
			value: void 0
		});
		Object.defineProperty(this, "status", {
			enumerable: true,
			configurable: true,
			writable: true,
			value: void 0
		});
		Object.defineProperty(this, "url", {
			enumerable: true,
			configurable: true,
			writable: true,
			value: void 0
		});
		this.body = body;
		this.headers = headers;
		this.status = status;
		this.url = url;
	}
};
var RpcRequestError = class extends BaseError$2 {
	constructor({ body, error, url }) {
		super("RPC Request failed.", {
			cause: error,
			details: error.message,
			metaMessages: [`URL: ${getUrl(url)}`, `Request body: ${stringify(body)}`],
			name: "RpcRequestError"
		});
		Object.defineProperty(this, "code", {
			enumerable: true,
			configurable: true,
			writable: true,
			value: void 0
		});
		Object.defineProperty(this, "data", {
			enumerable: true,
			configurable: true,
			writable: true,
			value: void 0
		});
		this.code = error.code;
		this.data = error.data;
	}
};
var TimeoutError = class extends BaseError$2 {
	constructor({ body, url }) {
		super("The request took too long to respond.", {
			details: "The request timed out.",
			metaMessages: [`URL: ${getUrl(url)}`, `Request body: ${stringify(body)}`],
			name: "TimeoutError"
		});
	}
};
var RpcError = class extends BaseError$2 {
	constructor(cause, { code, docsPath, metaMessages, name, shortMessage }) {
		super(shortMessage, {
			cause,
			docsPath,
			metaMessages: metaMessages || cause?.metaMessages,
			name: name || "RpcError"
		});
		Object.defineProperty(this, "code", {
			enumerable: true,
			configurable: true,
			writable: true,
			value: void 0
		});
		this.name = name || cause.name;
		this.code = cause instanceof RpcRequestError ? cause.code : code ?? -1;
	}
};
var ProviderRpcError = class extends RpcError {
	constructor(cause, options) {
		super(cause, options);
		Object.defineProperty(this, "data", {
			enumerable: true,
			configurable: true,
			writable: true,
			value: void 0
		});
		this.data = options.data;
	}
};
var ParseRpcError = class ParseRpcError extends RpcError {
	constructor(cause) {
		super(cause, {
			code: ParseRpcError.code,
			name: "ParseRpcError",
			shortMessage: "Invalid JSON was received by the server. An error occurred on the server while parsing the JSON text."
		});
	}
};
Object.defineProperty(ParseRpcError, "code", {
	enumerable: true,
	configurable: true,
	writable: true,
	value: -32700
});
var InvalidRequestRpcError = class InvalidRequestRpcError extends RpcError {
	constructor(cause) {
		super(cause, {
			code: InvalidRequestRpcError.code,
			name: "InvalidRequestRpcError",
			shortMessage: "JSON is not a valid request object."
		});
	}
};
Object.defineProperty(InvalidRequestRpcError, "code", {
	enumerable: true,
	configurable: true,
	writable: true,
	value: -32600
});
var MethodNotFoundRpcError = class MethodNotFoundRpcError extends RpcError {
	constructor(cause, { method } = {}) {
		super(cause, {
			code: MethodNotFoundRpcError.code,
			name: "MethodNotFoundRpcError",
			shortMessage: `The method${method ? ` "${method}"` : ""} does not exist / is not available.`
		});
	}
};
Object.defineProperty(MethodNotFoundRpcError, "code", {
	enumerable: true,
	configurable: true,
	writable: true,
	value: -32601
});
var InvalidParamsRpcError = class InvalidParamsRpcError extends RpcError {
	constructor(cause) {
		super(cause, {
			code: InvalidParamsRpcError.code,
			name: "InvalidParamsRpcError",
			shortMessage: ["Invalid parameters were provided to the RPC method.", "Double check you have provided the correct parameters."].join("\n")
		});
	}
};
Object.defineProperty(InvalidParamsRpcError, "code", {
	enumerable: true,
	configurable: true,
	writable: true,
	value: -32602
});
var InternalRpcError = class InternalRpcError extends RpcError {
	constructor(cause) {
		super(cause, {
			code: InternalRpcError.code,
			name: "InternalRpcError",
			shortMessage: "An internal error was received."
		});
	}
};
Object.defineProperty(InternalRpcError, "code", {
	enumerable: true,
	configurable: true,
	writable: true,
	value: -32603
});
var InvalidInputRpcError = class InvalidInputRpcError extends RpcError {
	constructor(cause) {
		super(cause, {
			code: InvalidInputRpcError.code,
			name: "InvalidInputRpcError",
			shortMessage: ["Missing or invalid parameters.", "Double check you have provided the correct parameters."].join("\n")
		});
	}
};
Object.defineProperty(InvalidInputRpcError, "code", {
	enumerable: true,
	configurable: true,
	writable: true,
	value: -32e3
});
var ResourceNotFoundRpcError = class ResourceNotFoundRpcError extends RpcError {
	constructor(cause) {
		super(cause, {
			code: ResourceNotFoundRpcError.code,
			name: "ResourceNotFoundRpcError",
			shortMessage: "Requested resource not found."
		});
		Object.defineProperty(this, "name", {
			enumerable: true,
			configurable: true,
			writable: true,
			value: "ResourceNotFoundRpcError"
		});
	}
};
Object.defineProperty(ResourceNotFoundRpcError, "code", {
	enumerable: true,
	configurable: true,
	writable: true,
	value: -32001
});
var ResourceUnavailableRpcError = class ResourceUnavailableRpcError extends RpcError {
	constructor(cause) {
		super(cause, {
			code: ResourceUnavailableRpcError.code,
			name: "ResourceUnavailableRpcError",
			shortMessage: "Requested resource not available."
		});
	}
};
Object.defineProperty(ResourceUnavailableRpcError, "code", {
	enumerable: true,
	configurable: true,
	writable: true,
	value: -32002
});
var TransactionRejectedRpcError = class TransactionRejectedRpcError extends RpcError {
	constructor(cause) {
		super(cause, {
			code: TransactionRejectedRpcError.code,
			name: "TransactionRejectedRpcError",
			shortMessage: "Transaction creation failed."
		});
	}
};
Object.defineProperty(TransactionRejectedRpcError, "code", {
	enumerable: true,
	configurable: true,
	writable: true,
	value: -32003
});
var MethodNotSupportedRpcError = class MethodNotSupportedRpcError extends RpcError {
	constructor(cause, { method } = {}) {
		super(cause, {
			code: MethodNotSupportedRpcError.code,
			name: "MethodNotSupportedRpcError",
			shortMessage: `Method${method ? ` "${method}"` : ""} is not supported.`
		});
	}
};
Object.defineProperty(MethodNotSupportedRpcError, "code", {
	enumerable: true,
	configurable: true,
	writable: true,
	value: -32004
});
var LimitExceededRpcError = class LimitExceededRpcError extends RpcError {
	constructor(cause) {
		super(cause, {
			code: LimitExceededRpcError.code,
			name: "LimitExceededRpcError",
			shortMessage: "Request exceeds defined limit."
		});
	}
};
Object.defineProperty(LimitExceededRpcError, "code", {
	enumerable: true,
	configurable: true,
	writable: true,
	value: -32005
});
var JsonRpcVersionUnsupportedError = class JsonRpcVersionUnsupportedError extends RpcError {
	constructor(cause) {
		super(cause, {
			code: JsonRpcVersionUnsupportedError.code,
			name: "JsonRpcVersionUnsupportedError",
			shortMessage: "Version of JSON-RPC protocol is not supported."
		});
	}
};
Object.defineProperty(JsonRpcVersionUnsupportedError, "code", {
	enumerable: true,
	configurable: true,
	writable: true,
	value: -32006
});
var UserRejectedRequestError = class UserRejectedRequestError extends ProviderRpcError {
	constructor(cause) {
		super(cause, {
			code: UserRejectedRequestError.code,
			name: "UserRejectedRequestError",
			shortMessage: "User rejected the request."
		});
	}
};
Object.defineProperty(UserRejectedRequestError, "code", {
	enumerable: true,
	configurable: true,
	writable: true,
	value: 4001
});
var UnauthorizedProviderError = class UnauthorizedProviderError extends ProviderRpcError {
	constructor(cause) {
		super(cause, {
			code: UnauthorizedProviderError.code,
			name: "UnauthorizedProviderError",
			shortMessage: "The requested method and/or account has not been authorized by the user."
		});
	}
};
Object.defineProperty(UnauthorizedProviderError, "code", {
	enumerable: true,
	configurable: true,
	writable: true,
	value: 4100
});
var UnsupportedProviderMethodError = class UnsupportedProviderMethodError extends ProviderRpcError {
	constructor(cause, { method } = {}) {
		super(cause, {
			code: UnsupportedProviderMethodError.code,
			name: "UnsupportedProviderMethodError",
			shortMessage: `The Provider does not support the requested method${method ? ` " ${method}"` : ""}.`
		});
	}
};
Object.defineProperty(UnsupportedProviderMethodError, "code", {
	enumerable: true,
	configurable: true,
	writable: true,
	value: 4200
});
var ProviderDisconnectedError = class ProviderDisconnectedError extends ProviderRpcError {
	constructor(cause) {
		super(cause, {
			code: ProviderDisconnectedError.code,
			name: "ProviderDisconnectedError",
			shortMessage: "The Provider is disconnected from all chains."
		});
	}
};
Object.defineProperty(ProviderDisconnectedError, "code", {
	enumerable: true,
	configurable: true,
	writable: true,
	value: 4900
});
var ChainDisconnectedError = class ChainDisconnectedError extends ProviderRpcError {
	constructor(cause) {
		super(cause, {
			code: ChainDisconnectedError.code,
			name: "ChainDisconnectedError",
			shortMessage: "The Provider is not connected to the requested chain."
		});
	}
};
Object.defineProperty(ChainDisconnectedError, "code", {
	enumerable: true,
	configurable: true,
	writable: true,
	value: 4901
});
var SwitchChainError = class SwitchChainError extends ProviderRpcError {
	constructor(cause) {
		super(cause, {
			code: SwitchChainError.code,
			name: "SwitchChainError",
			shortMessage: "An error occurred when attempting to switch chain."
		});
	}
};
Object.defineProperty(SwitchChainError, "code", {
	enumerable: true,
	configurable: true,
	writable: true,
	value: 4902
});
var UnsupportedNonOptionalCapabilityError = class UnsupportedNonOptionalCapabilityError extends ProviderRpcError {
	constructor(cause) {
		super(cause, {
			code: UnsupportedNonOptionalCapabilityError.code,
			name: "UnsupportedNonOptionalCapabilityError",
			shortMessage: "This Wallet does not support a capability that was not marked as optional."
		});
	}
};
Object.defineProperty(UnsupportedNonOptionalCapabilityError, "code", {
	enumerable: true,
	configurable: true,
	writable: true,
	value: 5700
});
var UnsupportedChainIdError = class UnsupportedChainIdError extends ProviderRpcError {
	constructor(cause) {
		super(cause, {
			code: UnsupportedChainIdError.code,
			name: "UnsupportedChainIdError",
			shortMessage: "This Wallet does not support the requested chain ID."
		});
	}
};
Object.defineProperty(UnsupportedChainIdError, "code", {
	enumerable: true,
	configurable: true,
	writable: true,
	value: 5710
});
var DuplicateIdError = class DuplicateIdError extends ProviderRpcError {
	constructor(cause) {
		super(cause, {
			code: DuplicateIdError.code,
			name: "DuplicateIdError",
			shortMessage: "There is already a bundle submitted with this ID."
		});
	}
};
Object.defineProperty(DuplicateIdError, "code", {
	enumerable: true,
	configurable: true,
	writable: true,
	value: 5720
});
var UnknownBundleIdError = class UnknownBundleIdError extends ProviderRpcError {
	constructor(cause) {
		super(cause, {
			code: UnknownBundleIdError.code,
			name: "UnknownBundleIdError",
			shortMessage: "This bundle id is unknown / has not been submitted"
		});
	}
};
Object.defineProperty(UnknownBundleIdError, "code", {
	enumerable: true,
	configurable: true,
	writable: true,
	value: 5730
});
var BundleTooLargeError = class BundleTooLargeError extends ProviderRpcError {
	constructor(cause) {
		super(cause, {
			code: BundleTooLargeError.code,
			name: "BundleTooLargeError",
			shortMessage: "The call bundle is too large for the Wallet to process."
		});
	}
};
Object.defineProperty(BundleTooLargeError, "code", {
	enumerable: true,
	configurable: true,
	writable: true,
	value: 5740
});
var AtomicReadyWalletRejectedUpgradeError = class AtomicReadyWalletRejectedUpgradeError extends ProviderRpcError {
	constructor(cause) {
		super(cause, {
			code: AtomicReadyWalletRejectedUpgradeError.code,
			name: "AtomicReadyWalletRejectedUpgradeError",
			shortMessage: "The Wallet can support atomicity after an upgrade, but the user rejected the upgrade."
		});
	}
};
Object.defineProperty(AtomicReadyWalletRejectedUpgradeError, "code", {
	enumerable: true,
	configurable: true,
	writable: true,
	value: 5750
});
var AtomicityNotSupportedError = class AtomicityNotSupportedError extends ProviderRpcError {
	constructor(cause) {
		super(cause, {
			code: AtomicityNotSupportedError.code,
			name: "AtomicityNotSupportedError",
			shortMessage: "The wallet does not support atomic execution but the request requires it."
		});
	}
};
Object.defineProperty(AtomicityNotSupportedError, "code", {
	enumerable: true,
	configurable: true,
	writable: true,
	value: 5760
});
var UnknownRpcError = class extends RpcError {
	constructor(cause) {
		super(cause, {
			name: "UnknownRpcError",
			shortMessage: "An unknown RPC error occurred."
		});
	}
};
var ExecutionRevertedError = class extends BaseError$2 {
	constructor({ cause, message } = {}) {
		const reason = message?.replace("execution reverted: ", "")?.replace("execution reverted", "");
		super(`Execution reverted ${reason ? `with reason: ${reason}` : "for an unknown reason"}.`, {
			cause,
			name: "ExecutionRevertedError"
		});
	}
};
Object.defineProperty(ExecutionRevertedError, "code", {
	enumerable: true,
	configurable: true,
	writable: true,
	value: 3
});
Object.defineProperty(ExecutionRevertedError, "nodeMessage", {
	enumerable: true,
	configurable: true,
	writable: true,
	value: /execution reverted/
});
var FeeCapTooHighError = class extends BaseError$2 {
	constructor({ cause, maxFeePerGas } = {}) {
		super(`The fee cap (\`maxFeePerGas\`${maxFeePerGas ? ` = ${formatGwei(maxFeePerGas)} gwei` : ""}) cannot be higher than the maximum allowed value (2^256-1).`, {
			cause,
			name: "FeeCapTooHighError"
		});
	}
};
Object.defineProperty(FeeCapTooHighError, "nodeMessage", {
	enumerable: true,
	configurable: true,
	writable: true,
	value: /max fee per gas higher than 2\^256-1|fee cap higher than 2\^256-1/
});
var FeeCapTooLowError = class extends BaseError$2 {
	constructor({ cause, maxFeePerGas } = {}) {
		super(`The fee cap (\`maxFeePerGas\`${maxFeePerGas ? ` = ${formatGwei(maxFeePerGas)}` : ""} gwei) cannot be lower than the block base fee.`, {
			cause,
			name: "FeeCapTooLowError"
		});
	}
};
Object.defineProperty(FeeCapTooLowError, "nodeMessage", {
	enumerable: true,
	configurable: true,
	writable: true,
	value: /max fee per gas less than block base fee|fee cap less than block base fee|transaction is outdated/
});
var NonceTooHighError = class extends BaseError$2 {
	constructor({ cause, nonce } = {}) {
		super(`Nonce provided for the transaction ${nonce ? `(${nonce}) ` : ""}is higher than the next one expected.`, {
			cause,
			name: "NonceTooHighError"
		});
	}
};
Object.defineProperty(NonceTooHighError, "nodeMessage", {
	enumerable: true,
	configurable: true,
	writable: true,
	value: /nonce too high/
});
var NonceTooLowError = class extends BaseError$2 {
	constructor({ cause, nonce } = {}) {
		super([`Nonce provided for the transaction ${nonce ? `(${nonce}) ` : ""}is lower than the current nonce of the account.`, "Try increasing the nonce or find the latest nonce with `getTransactionCount`."].join("\n"), {
			cause,
			name: "NonceTooLowError"
		});
	}
};
Object.defineProperty(NonceTooLowError, "nodeMessage", {
	enumerable: true,
	configurable: true,
	writable: true,
	value: /nonce too low|transaction already imported|already known/
});
var NonceMaxValueError = class extends BaseError$2 {
	constructor({ cause, nonce } = {}) {
		super(`Nonce provided for the transaction ${nonce ? `(${nonce}) ` : ""}exceeds the maximum allowed nonce.`, {
			cause,
			name: "NonceMaxValueError"
		});
	}
};
Object.defineProperty(NonceMaxValueError, "nodeMessage", {
	enumerable: true,
	configurable: true,
	writable: true,
	value: /nonce has max value/
});
var InsufficientFundsError = class extends BaseError$2 {
	constructor({ cause } = {}) {
		super(["The total cost (gas * gas fee + value) of executing this transaction exceeds the balance of the account."].join("\n"), {
			cause,
			metaMessages: [
				"This error could arise when the account does not have enough funds to:",
				" - pay for the total gas fee,",
				" - pay for the value to send.",
				" ",
				"The cost of the transaction is calculated as `gas * gas fee + value`, where:",
				" - `gas` is the amount of gas needed for transaction to execute,",
				" - `gas fee` is the gas fee,",
				" - `value` is the amount of ether to send to the recipient."
			],
			name: "InsufficientFundsError"
		});
	}
};
Object.defineProperty(InsufficientFundsError, "nodeMessage", {
	enumerable: true,
	configurable: true,
	writable: true,
	value: /insufficient funds|exceeds transaction sender account balance/
});
var IntrinsicGasTooHighError = class extends BaseError$2 {
	constructor({ cause, gas } = {}) {
		super(`The amount of gas ${gas ? `(${gas}) ` : ""}provided for the transaction exceeds the limit allowed for the block.`, {
			cause,
			name: "IntrinsicGasTooHighError"
		});
	}
};
Object.defineProperty(IntrinsicGasTooHighError, "nodeMessage", {
	enumerable: true,
	configurable: true,
	writable: true,
	value: /intrinsic gas too high|gas limit reached/
});
var IntrinsicGasTooLowError = class extends BaseError$2 {
	constructor({ cause, gas } = {}) {
		super(`The amount of gas ${gas ? `(${gas}) ` : ""}provided for the transaction is too low.`, {
			cause,
			name: "IntrinsicGasTooLowError"
		});
	}
};
Object.defineProperty(IntrinsicGasTooLowError, "nodeMessage", {
	enumerable: true,
	configurable: true,
	writable: true,
	value: /intrinsic gas too low/
});
var TransactionTypeNotSupportedError = class extends BaseError$2 {
	constructor({ cause }) {
		super("The transaction type is not supported for this chain.", {
			cause,
			name: "TransactionTypeNotSupportedError"
		});
	}
};
Object.defineProperty(TransactionTypeNotSupportedError, "nodeMessage", {
	enumerable: true,
	configurable: true,
	writable: true,
	value: /transaction type not valid/
});
var TipAboveFeeCapError = class extends BaseError$2 {
	constructor({ cause, maxPriorityFeePerGas, maxFeePerGas } = {}) {
		super([`The provided tip (\`maxPriorityFeePerGas\`${maxPriorityFeePerGas ? ` = ${formatGwei(maxPriorityFeePerGas)} gwei` : ""}) cannot be higher than the fee cap (\`maxFeePerGas\`${maxFeePerGas ? ` = ${formatGwei(maxFeePerGas)} gwei` : ""}).`].join("\n"), {
			cause,
			name: "TipAboveFeeCapError"
		});
	}
};
Object.defineProperty(TipAboveFeeCapError, "nodeMessage", {
	enumerable: true,
	configurable: true,
	writable: true,
	value: /max priority fee per gas higher than max fee per gas|tip higher than fee cap/
});
function withResolvers() {
	let resolve = () => void 0;
	let reject = () => void 0;
	return {
		promise: new Promise((resolve_, reject_) => {
			resolve = resolve_;
			reject = reject_;
		}),
		resolve,
		reject
	};
}
var schedulerCache = /* @__PURE__ */ new Map();
function createBatchScheduler({ fn: fn$2, id, shouldSplitBatch, wait: wait$1 = 0, sort }) {
	const exec = async () => {
		const scheduler = getScheduler();
		flush();
		const args = scheduler.map(({ args: args$1 }) => args$1);
		if (args.length === 0) return;
		fn$2(args).then((data) => {
			if (sort && Array.isArray(data)) data.sort(sort);
			for (let i$2 = 0; i$2 < scheduler.length; i$2++) {
				const { resolve } = scheduler[i$2];
				resolve?.([data[i$2], data]);
			}
		}).catch((err) => {
			for (let i$2 = 0; i$2 < scheduler.length; i$2++) {
				const { reject } = scheduler[i$2];
				reject?.(err);
			}
		});
	};
	const flush = () => schedulerCache.delete(id);
	const getBatchedArgs = () => getScheduler().map(({ args }) => args);
	const getScheduler = () => schedulerCache.get(id) || [];
	const setScheduler = (item) => schedulerCache.set(id, [...getScheduler(), item]);
	return {
		flush,
		async schedule(args) {
			const { promise, resolve, reject } = withResolvers();
			if (shouldSplitBatch?.([...getBatchedArgs(), args])) exec();
			if (getScheduler().length > 0) {
				setScheduler({
					args,
					resolve,
					reject
				});
				return promise;
			}
			setScheduler({
				args,
				resolve,
				reject
			});
			setTimeout(exec, wait$1);
			return promise;
		}
	};
}
async function wait(time) {
	return new Promise((res) => setTimeout(res, time));
}
function withRetry(fn$2, { delay: delay_ = 100, retryCount = 2, shouldRetry: shouldRetry$1 = () => true } = {}) {
	return new Promise((resolve, reject) => {
		const attemptRetry = async ({ count = 0 } = {}) => {
			const retry = async ({ error }) => {
				const delay = typeof delay_ === "function" ? delay_({
					count,
					error
				}) : delay_;
				if (delay) await wait(delay);
				attemptRetry({ count: count + 1 });
			};
			try {
				const data = await fn$2();
				resolve(data);
			} catch (err) {
				if (count < retryCount && await shouldRetry$1({
					count,
					error: err
				})) return retry({ error: err });
				reject(err);
			}
		};
		attemptRetry();
	});
}
var index = 256;
var buffer;
function uid(length = 11) {
	if (!buffer || index + length > 256 * 2) {
		buffer = "";
		index = 0;
		for (let i$2 = 0; i$2 < 256; i$2++) buffer += (256 + Math.random() * 256 | 0).toString(16).substring(1);
	}
	return buffer.substring(index, index++ + length);
}
const promiseCache = /* @__PURE__ */ new LruMap$1(8192);
function withDedupe(fn$2, { enabled = true, id }) {
	if (!enabled || !id) return fn$2();
	if (promiseCache.get(id)) return promiseCache.get(id);
	const promise = fn$2().finally(() => promiseCache.delete(id));
	promiseCache.set(id, promise);
	return promise;
}
function buildRequest(request, options = {}) {
	return async (args, overrideOptions = {}) => {
		const { dedupe = false, methods, retryDelay = 150, retryCount = 3, uid: uid$1 } = {
			...options,
			...overrideOptions
		};
		const { method } = args;
		if (methods?.exclude?.includes(method)) throw new MethodNotSupportedRpcError(/* @__PURE__ */ new Error("method not supported"), { method });
		if (methods?.include && !methods.include.includes(method)) throw new MethodNotSupportedRpcError(/* @__PURE__ */ new Error("method not supported"), { method });
		const requestId = dedupe ? stringToHex$2(`${uid$1}.${stringify(args)}`) : void 0;
		return withDedupe(() => withRetry(async () => {
			try {
				return await request(args);
			} catch (err_) {
				const err = err_;
				switch (err.code) {
					case ParseRpcError.code: throw new ParseRpcError(err);
					case InvalidRequestRpcError.code: throw new InvalidRequestRpcError(err);
					case MethodNotFoundRpcError.code: throw new MethodNotFoundRpcError(err, { method: args.method });
					case InvalidParamsRpcError.code: throw new InvalidParamsRpcError(err);
					case InternalRpcError.code: throw new InternalRpcError(err);
					case InvalidInputRpcError.code: throw new InvalidInputRpcError(err);
					case ResourceNotFoundRpcError.code: throw new ResourceNotFoundRpcError(err);
					case ResourceUnavailableRpcError.code: throw new ResourceUnavailableRpcError(err);
					case TransactionRejectedRpcError.code: throw new TransactionRejectedRpcError(err);
					case MethodNotSupportedRpcError.code: throw new MethodNotSupportedRpcError(err, { method: args.method });
					case LimitExceededRpcError.code: throw new LimitExceededRpcError(err);
					case JsonRpcVersionUnsupportedError.code: throw new JsonRpcVersionUnsupportedError(err);
					case UserRejectedRequestError.code: throw new UserRejectedRequestError(err);
					case UnauthorizedProviderError.code: throw new UnauthorizedProviderError(err);
					case UnsupportedProviderMethodError.code: throw new UnsupportedProviderMethodError(err);
					case ProviderDisconnectedError.code: throw new ProviderDisconnectedError(err);
					case ChainDisconnectedError.code: throw new ChainDisconnectedError(err);
					case SwitchChainError.code: throw new SwitchChainError(err);
					case UnsupportedNonOptionalCapabilityError.code: throw new UnsupportedNonOptionalCapabilityError(err);
					case UnsupportedChainIdError.code: throw new UnsupportedChainIdError(err);
					case DuplicateIdError.code: throw new DuplicateIdError(err);
					case UnknownBundleIdError.code: throw new UnknownBundleIdError(err);
					case BundleTooLargeError.code: throw new BundleTooLargeError(err);
					case AtomicReadyWalletRejectedUpgradeError.code: throw new AtomicReadyWalletRejectedUpgradeError(err);
					case AtomicityNotSupportedError.code: throw new AtomicityNotSupportedError(err);
					case 5e3: throw new UserRejectedRequestError(err);
					default:
						if (err_ instanceof BaseError$2) throw err_;
						throw new UnknownRpcError(err);
				}
			}
		}, {
			delay: ({ count, error }) => {
				if (error && error instanceof HttpRequestError) {
					const retryAfter = error?.headers?.get("Retry-After");
					if (retryAfter?.match(/\d/)) return Number.parseInt(retryAfter, 10) * 1e3;
				}
				return ~~(1 << count) * retryDelay;
			},
			retryCount,
			shouldRetry: ({ error }) => shouldRetry(error)
		}), {
			enabled: dedupe,
			id: requestId
		});
	};
}
function shouldRetry(error) {
	if ("code" in error && typeof error.code === "number") {
		if (error.code === -1) return true;
		if (error.code === LimitExceededRpcError.code) return true;
		if (error.code === InternalRpcError.code) return true;
		return false;
	}
	if (error instanceof HttpRequestError && error.status) {
		if (error.status === 403) return true;
		if (error.status === 408) return true;
		if (error.status === 413) return true;
		if (error.status === 429) return true;
		if (error.status === 500) return true;
		if (error.status === 502) return true;
		if (error.status === 503) return true;
		if (error.status === 504) return true;
		return false;
	}
	return true;
}
function withTimeout(fn$2, { errorInstance = /* @__PURE__ */ new Error("timed out"), timeout, signal }) {
	return new Promise((resolve, reject) => {
		(async () => {
			let timeoutId;
			try {
				const controller$2 = new AbortController();
				if (timeout > 0) timeoutId = setTimeout(() => {
					if (signal) controller$2.abort();
					else reject(errorInstance);
				}, timeout);
				resolve(await fn$2({ signal: controller$2?.signal || null }));
			} catch (err) {
				if (err?.name === "AbortError") reject(errorInstance);
				reject(err);
			} finally {
				clearTimeout(timeoutId);
			}
		})();
	});
}
function createIdStore() {
	return {
		current: 0,
		take() {
			return this.current++;
		},
		reset() {
			this.current = 0;
		}
	};
}
const idCache = /* @__PURE__ */ createIdStore();
function getHttpRpcClient(url, options = {}) {
	return { async request(params) {
		const { body, fetchFn = options.fetchFn ?? fetch, onRequest = options.onRequest, onResponse = options.onResponse, timeout = options.timeout ?? 1e4 } = params;
		const fetchOptions = {
			...options.fetchOptions ?? {},
			...params.fetchOptions ?? {}
		};
		const { headers, method, signal: signal_ } = fetchOptions;
		try {
			const response = await withTimeout(async ({ signal }) => {
				const init = {
					...fetchOptions,
					body: Array.isArray(body) ? stringify(body.map((body$1) => ({
						jsonrpc: "2.0",
						id: body$1.id ?? idCache.take(),
						...body$1
					}))) : stringify({
						jsonrpc: "2.0",
						id: body.id ?? idCache.take(),
						...body
					}),
					headers: {
						"Content-Type": "application/json",
						...headers
					},
					method: method || "POST",
					signal: signal_ || (timeout > 0 ? signal : null)
				};
				const request = new Request(url, init);
				const args = await onRequest?.(request, init) ?? {
					...init,
					url
				};
				return await fetchFn(args.url ?? url, args);
			}, {
				errorInstance: new TimeoutError({
					body,
					url
				}),
				timeout,
				signal: true
			});
			if (onResponse) await onResponse(response);
			let data;
			if (response.headers.get("Content-Type")?.startsWith("application/json")) data = await response.json();
			else {
				data = await response.text();
				try {
					data = JSON.parse(data || "{}");
				} catch (err) {
					if (response.ok) throw err;
					data = { error: data };
				}
			}
			if (!response.ok) throw new HttpRequestError({
				body,
				details: stringify(data.error) || response.statusText,
				headers: response.headers,
				status: response.status,
				url
			});
			return data;
		} catch (err) {
			if (err instanceof HttpRequestError) throw err;
			if (err instanceof TimeoutError) throw err;
			throw new HttpRequestError({
				body,
				cause: err,
				url
			});
		}
	} };
}
function createTransport({ key, methods, name, request, retryCount = 3, retryDelay = 150, timeout, type }, value) {
	const uid$1 = uid();
	return {
		config: {
			key,
			methods,
			name,
			request,
			retryCount,
			retryDelay,
			timeout,
			type
		},
		request: buildRequest(request, {
			methods,
			retryCount,
			retryDelay,
			uid: uid$1
		}),
		value
	};
}
function fallback(transports_, config = {}) {
	const { key = "fallback", name = "Fallback", rank = false, shouldThrow: shouldThrow_ = shouldThrow, retryCount, retryDelay } = config;
	return (({ chain, pollingInterval = 4e3, timeout,...rest }) => {
		let transports = transports_;
		let onResponse = () => {};
		const transport = createTransport({
			key,
			name,
			async request({ method, params }) {
				let includes;
				const fetch$1 = async (i$2 = 0) => {
					const transport$1 = transports[i$2]({
						...rest,
						chain,
						retryCount: 0,
						timeout
					});
					try {
						const response = await transport$1.request({
							method,
							params
						});
						onResponse({
							method,
							params,
							response,
							transport: transport$1,
							status: "success"
						});
						return response;
					} catch (err) {
						onResponse({
							error: err,
							method,
							params,
							transport: transport$1,
							status: "error"
						});
						if (shouldThrow_(err)) throw err;
						if (i$2 === transports.length - 1) throw err;
						includes ??= transports.slice(i$2 + 1).some((transport$2) => {
							const { include, exclude } = transport$2({ chain }).config.methods || {};
							if (include) return include.includes(method);
							if (exclude) return !exclude.includes(method);
							return true;
						});
						if (!includes) throw err;
						return fetch$1(i$2 + 1);
					}
				};
				return fetch$1();
			},
			retryCount,
			retryDelay,
			type: "fallback"
		}, {
			onResponse: (fn$2) => onResponse = fn$2,
			transports: transports.map((fn$2) => fn$2({
				chain,
				retryCount: 0
			}))
		});
		if (rank) {
			const rankOptions = typeof rank === "object" ? rank : {};
			rankTransports({
				chain,
				interval: rankOptions.interval ?? pollingInterval,
				onTransports: (transports_$1) => transports = transports_$1,
				ping: rankOptions.ping,
				sampleCount: rankOptions.sampleCount,
				timeout: rankOptions.timeout,
				transports,
				weights: rankOptions.weights
			});
		}
		return transport;
	});
}
function shouldThrow(error) {
	if ("code" in error && typeof error.code === "number") {
		if (error.code === TransactionRejectedRpcError.code || error.code === UserRejectedRequestError.code || ExecutionRevertedError.nodeMessage.test(error.message) || error.code === 5e3) return true;
	}
	return false;
}
function rankTransports({ chain, interval = 4e3, onTransports, ping, sampleCount = 10, timeout = 1e3, transports, weights = {} }) {
	const { stability: stabilityWeight = .7, latency: latencyWeight = .3 } = weights;
	const samples = [];
	const rankTransports_ = async () => {
		const sample = await Promise.all(transports.map(async (transport) => {
			const transport_ = transport({
				chain,
				retryCount: 0,
				timeout
			});
			const start = Date.now();
			let end;
			let success;
			try {
				await (ping ? ping({ transport: transport_ }) : transport_.request({ method: "net_listening" }));
				success = 1;
			} catch {
				success = 0;
			} finally {
				end = Date.now();
			}
			return {
				latency: end - start,
				success
			};
		}));
		samples.push(sample);
		if (samples.length > sampleCount) samples.shift();
		const maxLatency = Math.max(...samples.map((sample$1) => Math.max(...sample$1.map(({ latency }) => latency))));
		const scores = transports.map((_, i$2) => {
			const latencies = samples.map((sample$1) => sample$1[i$2].latency);
			const latencyScore = 1 - latencies.reduce((acc, latency) => acc + latency, 0) / latencies.length / maxLatency;
			const successes = samples.map((sample$1) => sample$1[i$2].success);
			const stabilityScore = successes.reduce((acc, success) => acc + success, 0) / successes.length;
			if (stabilityScore === 0) return [0, i$2];
			return [latencyWeight * latencyScore + stabilityWeight * stabilityScore, i$2];
		}).sort((a$1, b$3) => b$3[0] - a$1[0]);
		onTransports(scores.map(([, i$2]) => transports[i$2]));
		await wait(interval);
		rankTransports_();
	};
	rankTransports_();
}
var UrlRequiredError = class extends BaseError$2 {
	constructor() {
		super("No URL was provided to the Transport. Please provide a valid RPC URL to the Transport.", {
			docsPath: "/docs/clients/intro",
			name: "UrlRequiredError"
		});
	}
};
function http(url, config = {}) {
	const { batch, fetchFn, fetchOptions, key = "http", methods, name = "HTTP JSON-RPC", onFetchRequest, onFetchResponse, retryDelay, raw } = config;
	return ({ chain, retryCount: retryCount_, timeout: timeout_ }) => {
		const { batchSize = 1e3, wait: wait$1 = 0 } = typeof batch === "object" ? batch : {};
		const retryCount = config.retryCount ?? retryCount_;
		const timeout = timeout_ ?? config.timeout ?? 1e4;
		const url_ = url || chain?.rpcUrls.default.http[0];
		if (!url_) throw new UrlRequiredError();
		const rpcClient = getHttpRpcClient(url_, {
			fetchFn,
			fetchOptions,
			onRequest: onFetchRequest,
			onResponse: onFetchResponse,
			timeout
		});
		return createTransport({
			key,
			methods,
			name,
			async request({ method, params }) {
				const body = {
					method,
					params
				};
				const { schedule } = createBatchScheduler({
					id: url_,
					wait: wait$1,
					shouldSplitBatch(requests) {
						return requests.length > batchSize;
					},
					fn: (body$1) => rpcClient.request({ body: body$1 }),
					sort: (a$1, b$3) => a$1.id - b$3.id
				});
				const fn$2 = async (body$1) => batch ? schedule(body$1) : [await rpcClient.request({ body: body$1 })];
				const [{ error, result }] = await fn$2(body);
				if (raw) return {
					error,
					result
				};
				if (error) throw new RpcRequestError({
					body,
					error,
					url: url_
				});
				return result;
			},
			retryCount,
			retryDelay,
			timeout,
			type: "http"
		}, {
			fetchOptions,
			url: url_
		});
	};
}
var RPC_URL_HOST = "rpc.walletconnect.org";
function getBlockchainApiRpcUrl(caipNetworkId, projectId) {
	const url = new URL("https://rpc.walletconnect.org/v1/");
	url.searchParams.set("chainId", caipNetworkId);
	url.searchParams.set("projectId", projectId);
	return url.toString();
}
var WC_HTTP_RPC_SUPPORTED_CHAINS = [
	"near:mainnet",
	"solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp",
	"eip155:1101",
	"eip155:56",
	"eip155:42161",
	"eip155:7777777",
	"eip155:59144",
	"eip155:324",
	"solana:EtWTRABZaYq6iMfeYKouRu166VU2xqa1",
	"eip155:5000",
	"solana:4sgjmw1sunhzsxgspuhpqldx6wiyjntz",
	"eip155:80084",
	"eip155:5003",
	"eip155:100",
	"eip155:8453",
	"eip155:42220",
	"eip155:1313161555",
	"eip155:17000",
	"eip155:1",
	"eip155:300",
	"eip155:1313161554",
	"eip155:1329",
	"eip155:84532",
	"eip155:421614",
	"eip155:11155111",
	"eip155:8217",
	"eip155:43114",
	"solana:4uhcVJyU9pJkvQyS88uRDiswHXSCkY3z",
	"eip155:999999999",
	"eip155:11155420",
	"eip155:80002",
	"eip155:97",
	"eip155:43113",
	"eip155:137",
	"eip155:10",
	"eip155:1301",
	"bip122:000000000019d6689c085ae165831e93",
	"bip122:000000000933ea01ad0ee984209779ba"
];
const CaipNetworksUtil = {
	extendRpcUrlWithProjectId(rpcUrl, projectId) {
		let isReownUrl = false;
		try {
			isReownUrl = new URL(rpcUrl).host === RPC_URL_HOST;
		} catch (e) {
			isReownUrl = false;
		}
		if (isReownUrl) {
			const url = new URL(rpcUrl);
			if (!url.searchParams.has("projectId")) url.searchParams.set("projectId", projectId);
			return url.toString();
		}
		return rpcUrl;
	},
	isCaipNetwork(network) {
		return "chainNamespace" in network && "caipNetworkId" in network;
	},
	getChainNamespace(network) {
		if (this.isCaipNetwork(network)) return network.chainNamespace;
		return ConstantsUtil.CHAIN.EVM;
	},
	getCaipNetworkId(network) {
		if (this.isCaipNetwork(network)) return network.caipNetworkId;
		return `${ConstantsUtil.CHAIN.EVM}:${network.id}`;
	},
	getDefaultRpcUrl(caipNetwork, caipNetworkId, projectId) {
		const defaultRpcUrl = caipNetwork.rpcUrls?.default?.http?.[0];
		if (WC_HTTP_RPC_SUPPORTED_CHAINS.includes(caipNetworkId)) return getBlockchainApiRpcUrl(caipNetworkId, projectId);
		return defaultRpcUrl || "";
	},
	extendCaipNetwork(caipNetwork, { customNetworkImageUrls, projectId, customRpcUrls }) {
		const chainNamespace = this.getChainNamespace(caipNetwork);
		const caipNetworkId = this.getCaipNetworkId(caipNetwork);
		const networkDefaultRpcUrl = caipNetwork.rpcUrls.default.http?.[0];
		const reownRpcUrl = this.getDefaultRpcUrl(caipNetwork, caipNetworkId, projectId);
		const chainDefaultRpcUrl = caipNetwork?.rpcUrls?.["chainDefault"]?.http?.[0] || networkDefaultRpcUrl;
		const customRpcUrlsOfNetwork = customRpcUrls?.[caipNetworkId]?.map((i$2) => i$2.url) || [];
		const rpcUrls = [...customRpcUrlsOfNetwork, reownRpcUrl];
		const rpcUrlsWithoutReown = [...customRpcUrlsOfNetwork];
		if (chainDefaultRpcUrl && !rpcUrlsWithoutReown.includes(chainDefaultRpcUrl)) rpcUrlsWithoutReown.push(chainDefaultRpcUrl);
		return {
			...caipNetwork,
			chainNamespace,
			caipNetworkId,
			assets: {
				imageId: PresetsUtil.NetworkImageIds[caipNetwork.id],
				imageUrl: customNetworkImageUrls?.[caipNetwork.id]
			},
			rpcUrls: {
				...caipNetwork.rpcUrls,
				default: { http: rpcUrls },
				chainDefault: { http: rpcUrlsWithoutReown }
			}
		};
	},
	extendCaipNetworks(caipNetworks, { customNetworkImageUrls, projectId, customRpcUrls }) {
		return caipNetworks.map((caipNetwork) => CaipNetworksUtil.extendCaipNetwork(caipNetwork, {
			customNetworkImageUrls,
			customRpcUrls,
			projectId
		}));
	},
	getViemTransport(caipNetwork, projectId, customRpcUrls) {
		const transports = [];
		customRpcUrls?.forEach((rpcUrl) => {
			transports.push(http(rpcUrl.url, rpcUrl.config));
		});
		if (WC_HTTP_RPC_SUPPORTED_CHAINS.includes(caipNetwork.caipNetworkId)) transports.push(http(getBlockchainApiRpcUrl(caipNetwork.caipNetworkId, projectId), { fetchOptions: { headers: { "Content-Type": "text/plain" } } }));
		caipNetwork?.rpcUrls?.default?.http?.forEach((rpcUrl) => {
			transports.push(http(rpcUrl));
		});
		return fallback(transports);
	},
	extendWagmiTransports(caipNetwork, projectId, transport) {
		if (WC_HTTP_RPC_SUPPORTED_CHAINS.includes(caipNetwork.caipNetworkId)) {
			const reownRpcUrl = this.getDefaultRpcUrl(caipNetwork, caipNetwork.caipNetworkId, projectId);
			return fallback([transport, http(reownRpcUrl)]);
		}
		return transport;
	},
	getUnsupportedNetwork(caipNetworkId) {
		return {
			id: caipNetworkId.split(":")[1],
			caipNetworkId,
			name: ConstantsUtil.UNSUPPORTED_NETWORK_NAME,
			chainNamespace: caipNetworkId.split(":")[0],
			nativeCurrency: {
				name: "",
				decimals: 0,
				symbol: ""
			},
			rpcUrls: { default: { http: [] } }
		};
	},
	getCaipNetworkFromStorage(defaultCaipNetwork) {
		const caipNetworkIdFromStorage = StorageUtil.getActiveCaipNetworkId();
		const caipNetworks = ChainController.getAllRequestedCaipNetworks();
		const availableNamespaces = Array.from(ChainController.state.chains?.keys() || []);
		const namespace = caipNetworkIdFromStorage?.split(":")[0];
		const isNamespaceAvailable = namespace ? availableNamespaces.includes(namespace) : false;
		const caipNetwork = caipNetworks?.find((cn$2) => cn$2.caipNetworkId === caipNetworkIdFromStorage);
		if (isNamespaceAvailable && !caipNetwork && caipNetworkIdFromStorage) return this.getUnsupportedNetwork(caipNetworkIdFromStorage);
		if (caipNetwork) return caipNetwork;
		if (defaultCaipNetwork) return defaultCaipNetwork;
		return caipNetworks?.[0];
	}
};
var CLEAN_PROVIDERS_STATE = {
	eip155: void 0,
	solana: void 0,
	polkadot: void 0,
	bip122: void 0,
	cosmos: void 0
};
var state = proxy({
	providers: { ...CLEAN_PROVIDERS_STATE },
	providerIds: { ...CLEAN_PROVIDERS_STATE }
});
const ProviderUtil = {
	state,
	subscribeKey(key, callback) {
		return subscribeKey(state, key, callback);
	},
	subscribe(callback) {
		return subscribe(state, () => {
			callback(state);
		});
	},
	subscribeProviders(callback) {
		return subscribe(state.providers, () => callback(state.providers));
	},
	setProvider(chainNamespace, provider) {
		if (provider) state.providers[chainNamespace] = ref(provider);
	},
	getProvider(chainNamespace) {
		return state.providers[chainNamespace];
	},
	setProviderId(chainNamespace, providerId) {
		if (providerId) state.providerIds[chainNamespace] = providerId;
	},
	getProviderId(chainNamespace) {
		if (!chainNamespace) return;
		return state.providerIds[chainNamespace];
	},
	reset() {
		state.providers = { ...CLEAN_PROVIDERS_STATE };
		state.providerIds = { ...CLEAN_PROVIDERS_STATE };
	},
	resetChain(chainNamespace) {
		state.providers[chainNamespace] = void 0;
		state.providerIds[chainNamespace] = void 0;
	}
};
require_events();
var a = Object.defineProperty, u$1 = (e, s, r$1) => s in e ? a(e, s, {
	enumerable: !0,
	configurable: !0,
	writable: !0,
	value: r$1
}) : e[s] = r$1, c$1 = (e, s, r$1) => u$1(e, typeof s != "symbol" ? s + "" : s, r$1);
var h$2 = class extends IEvents {
	constructor(s) {
		super(), this.opts = s, c$1(this, "protocol", "wc"), c$1(this, "version", 2);
	}
};
var p$1 = Object.defineProperty, b$2 = (e, s, r$1) => s in e ? p$1(e, s, {
	enumerable: !0,
	configurable: !0,
	writable: !0,
	value: r$1
}) : e[s] = r$1, v$2 = (e, s, r$1) => b$2(e, typeof s != "symbol" ? s + "" : s, r$1);
var I$1 = class extends IEvents {
	constructor(s, r$1) {
		super(), this.core = s, this.logger = r$1, v$2(this, "records", /* @__PURE__ */ new Map());
	}
};
var y$2 = class {
	constructor(s, r$1) {
		this.logger = s, this.core = r$1;
	}
};
var m = class extends IEvents {
	constructor(s, r$1) {
		super(), this.relayer = s, this.logger = r$1;
	}
};
var d$1 = class extends IEvents {
	constructor(s) {
		super();
	}
};
var f$1 = class {
	constructor(s, r$1, t, q$2) {
		this.core = s, this.logger = r$1, this.name = t;
	}
};
var P = class extends IEvents {
	constructor(s, r$1) {
		super(), this.relayer = s, this.logger = r$1;
	}
};
var S$1 = class extends IEvents {
	constructor(s, r$1) {
		super(), this.core = s, this.logger = r$1;
	}
};
var M$2 = class {
	constructor(s, r$1, t) {
		this.core = s, this.logger = r$1, this.store = t;
	}
};
var O$1 = class {
	constructor(s, r$1) {
		this.projectId = s, this.logger = r$1;
	}
};
var R$1 = class {
	constructor(s, r$1, t) {
		this.core = s, this.logger = r$1, this.telemetryEnabled = t;
	}
};
var T = Object.defineProperty, k$3 = (e, s, r$1) => s in e ? T(e, s, {
	enumerable: !0,
	configurable: !0,
	writable: !0,
	value: r$1
}) : e[s] = r$1, i$1 = (e, s, r$1) => k$3(e, typeof s != "symbol" ? s + "" : s, r$1);
var J = class {
	constructor(s) {
		this.opts = s, i$1(this, "protocol", "wc"), i$1(this, "version", 2);
	}
};
var V$1 = class {
	constructor(s) {
		this.client = s;
	}
};
function isHex$1(value, { strict = true } = {}) {
	if (!value) return false;
	if (typeof value !== "string") return false;
	return strict ? /^0x[0-9a-fA-F]*$/.test(value) : value.startsWith("0x");
}
function size$1(value) {
	if (isHex$1(value, { strict: false })) return Math.ceil((value.length - 2) / 2);
	return value.length;
}
const version$1 = "2.23.2";
var errorConfig$1 = {
	getDocsUrl: ({ docsBaseUrl, docsPath = "", docsSlug }) => docsPath ? `${docsBaseUrl ?? "https://viem.sh"}${docsPath}${docsSlug ? `#${docsSlug}` : ""}` : void 0,
	version: `viem@${version$1}`
};
var BaseError$1 = class BaseError$1 extends Error {
	constructor(shortMessage, args = {}) {
		const details = (() => {
			if (args.cause instanceof BaseError$1) return args.cause.details;
			if (args.cause?.message) return args.cause.message;
			return args.details;
		})();
		const docsPath = (() => {
			if (args.cause instanceof BaseError$1) return args.cause.docsPath || args.docsPath;
			return args.docsPath;
		})();
		const docsUrl = errorConfig$1.getDocsUrl?.({
			...args,
			docsPath
		});
		const message = [
			shortMessage || "An error occurred.",
			"",
			...args.metaMessages ? [...args.metaMessages, ""] : [],
			...docsUrl ? [`Docs: ${docsUrl}`] : [],
			...details ? [`Details: ${details}`] : [],
			...errorConfig$1.version ? [`Version: ${errorConfig$1.version}`] : []
		].join("\n");
		super(message, args.cause ? { cause: args.cause } : void 0);
		Object.defineProperty(this, "details", {
			enumerable: true,
			configurable: true,
			writable: true,
			value: void 0
		});
		Object.defineProperty(this, "docsPath", {
			enumerable: true,
			configurable: true,
			writable: true,
			value: void 0
		});
		Object.defineProperty(this, "metaMessages", {
			enumerable: true,
			configurable: true,
			writable: true,
			value: void 0
		});
		Object.defineProperty(this, "shortMessage", {
			enumerable: true,
			configurable: true,
			writable: true,
			value: void 0
		});
		Object.defineProperty(this, "version", {
			enumerable: true,
			configurable: true,
			writable: true,
			value: void 0
		});
		Object.defineProperty(this, "name", {
			enumerable: true,
			configurable: true,
			writable: true,
			value: "BaseError"
		});
		this.details = details;
		this.docsPath = docsPath;
		this.metaMessages = args.metaMessages;
		this.name = args.name ?? this.name;
		this.shortMessage = shortMessage;
		this.version = version$1;
	}
	walk(fn$2) {
		return walk$1(this, fn$2);
	}
};
function walk$1(err, fn$2) {
	if (fn$2?.(err)) return err;
	if (err && typeof err === "object" && "cause" in err && err.cause !== void 0) return walk$1(err.cause, fn$2);
	return fn$2 ? null : err;
}
var SizeExceedsPaddingSizeError$1 = class extends BaseError$1 {
	constructor({ size: size$4, targetSize, type }) {
		super(`${type.charAt(0).toUpperCase()}${type.slice(1).toLowerCase()} size (${size$4}) exceeds padding size (${targetSize}).`, { name: "SizeExceedsPaddingSizeError" });
	}
};
function pad$1(hexOrBytes, { dir, size: size$4 = 32 } = {}) {
	if (typeof hexOrBytes === "string") return padHex$1(hexOrBytes, {
		dir,
		size: size$4
	});
	return padBytes$1(hexOrBytes, {
		dir,
		size: size$4
	});
}
function padHex$1(hex_, { dir, size: size$4 = 32 } = {}) {
	if (size$4 === null) return hex_;
	const hex = hex_.replace("0x", "");
	if (hex.length > size$4 * 2) throw new SizeExceedsPaddingSizeError$1({
		size: Math.ceil(hex.length / 2),
		targetSize: size$4,
		type: "hex"
	});
	return `0x${hex[dir === "right" ? "padEnd" : "padStart"](size$4 * 2, "0")}`;
}
function padBytes$1(bytes, { dir, size: size$4 = 32 } = {}) {
	if (size$4 === null) return bytes;
	if (bytes.length > size$4) throw new SizeExceedsPaddingSizeError$1({
		size: bytes.length,
		targetSize: size$4,
		type: "bytes"
	});
	const paddedBytes = new Uint8Array(size$4);
	for (let i$2 = 0; i$2 < size$4; i$2++) {
		const padEnd = dir === "right";
		paddedBytes[padEnd ? i$2 : size$4 - i$2 - 1] = bytes[padEnd ? i$2 : bytes.length - i$2 - 1];
	}
	return paddedBytes;
}
var IntegerOutOfRangeError$1 = class extends BaseError$1 {
	constructor({ max, min, signed, size: size$4, value }) {
		super(`Number "${value}" is not in safe ${size$4 ? `${size$4 * 8}-bit ${signed ? "signed" : "unsigned"} ` : ""}integer range ${max ? `(${min} to ${max})` : `(above ${min})`}`, { name: "IntegerOutOfRangeError" });
	}
};
var SizeOverflowError$1 = class extends BaseError$1 {
	constructor({ givenSize, maxSize }) {
		super(`Size cannot exceed ${maxSize} bytes. Given size: ${givenSize} bytes.`, { name: "SizeOverflowError" });
	}
};
function assertSize$1(hexOrBytes, { size: size$4 }) {
	if (size$1(hexOrBytes) > size$4) throw new SizeOverflowError$1({
		givenSize: size$1(hexOrBytes),
		maxSize: size$4
	});
}
function hexToBigInt(hex, opts = {}) {
	const { signed } = opts;
	if (opts.size) assertSize$1(hex, { size: opts.size });
	const value = BigInt(hex);
	if (!signed) return value;
	const size$4 = (hex.length - 2) / 2;
	const max = (1n << BigInt(size$4) * 8n - 1n) - 1n;
	if (value <= max) return value;
	return value - BigInt(`0x${"f".padStart(size$4 * 2, "f")}`) - 1n;
}
function hexToNumber(hex, opts = {}) {
	return Number(hexToBigInt(hex, opts));
}
var hexes$1 = /* @__PURE__ */ Array.from({ length: 256 }, (_v, i$2) => i$2.toString(16).padStart(2, "0"));
function toHex$1(value, opts = {}) {
	if (typeof value === "number" || typeof value === "bigint") return numberToHex$1(value, opts);
	if (typeof value === "string") return stringToHex$1(value, opts);
	if (typeof value === "boolean") return boolToHex$1(value, opts);
	return bytesToHex$1(value, opts);
}
function boolToHex$1(value, opts = {}) {
	const hex = `0x${Number(value)}`;
	if (typeof opts.size === "number") {
		assertSize$1(hex, { size: opts.size });
		return pad$1(hex, { size: opts.size });
	}
	return hex;
}
function bytesToHex$1(value, opts = {}) {
	let string$2 = "";
	for (let i$2 = 0; i$2 < value.length; i$2++) string$2 += hexes$1[value[i$2]];
	const hex = `0x${string$2}`;
	if (typeof opts.size === "number") {
		assertSize$1(hex, { size: opts.size });
		return pad$1(hex, {
			dir: "right",
			size: opts.size
		});
	}
	return hex;
}
function numberToHex$1(value_, opts = {}) {
	const { signed, size: size$4 } = opts;
	const value = BigInt(value_);
	let maxValue;
	if (size$4) if (signed) maxValue = (1n << BigInt(size$4) * 8n - 1n) - 1n;
	else maxValue = 2n ** (BigInt(size$4) * 8n) - 1n;
	else if (typeof value_ === "number") maxValue = BigInt(Number.MAX_SAFE_INTEGER);
	const minValue = typeof maxValue === "bigint" && signed ? -maxValue - 1n : 0;
	if (maxValue && value > maxValue || value < minValue) {
		const suffix = typeof value_ === "bigint" ? "n" : "";
		throw new IntegerOutOfRangeError$1({
			max: maxValue ? `${maxValue}${suffix}` : void 0,
			min: `${minValue}${suffix}`,
			signed,
			size: size$4,
			value: `${value_}${suffix}`
		});
	}
	const hex = `0x${(signed && value < 0 ? (1n << BigInt(size$4 * 8)) + BigInt(value) : value).toString(16)}`;
	if (size$4) return pad$1(hex, { size: size$4 });
	return hex;
}
var encoder$2 = /* @__PURE__ */ new TextEncoder();
function stringToHex$1(value_, opts = {}) {
	const value = encoder$2.encode(value_);
	return bytesToHex$1(value, opts);
}
var encoder$1 = /* @__PURE__ */ new TextEncoder();
function toBytes(value, opts = {}) {
	if (typeof value === "number" || typeof value === "bigint") return numberToBytes(value, opts);
	if (typeof value === "boolean") return boolToBytes(value, opts);
	if (isHex$1(value)) return hexToBytes(value, opts);
	return stringToBytes(value, opts);
}
function boolToBytes(value, opts = {}) {
	const bytes = new Uint8Array(1);
	bytes[0] = Number(value);
	if (typeof opts.size === "number") {
		assertSize$1(bytes, { size: opts.size });
		return pad$1(bytes, { size: opts.size });
	}
	return bytes;
}
var charCodeMap = {
	zero: 48,
	nine: 57,
	A: 65,
	F: 70,
	a: 97,
	f: 102
};
function charCodeToBase16(char) {
	if (char >= charCodeMap.zero && char <= charCodeMap.nine) return char - charCodeMap.zero;
	if (char >= charCodeMap.A && char <= charCodeMap.F) return char - (charCodeMap.A - 10);
	if (char >= charCodeMap.a && char <= charCodeMap.f) return char - (charCodeMap.a - 10);
}
function hexToBytes(hex_, opts = {}) {
	let hex = hex_;
	if (opts.size) {
		assertSize$1(hex, { size: opts.size });
		hex = pad$1(hex, {
			dir: "right",
			size: opts.size
		});
	}
	let hexString = hex.slice(2);
	if (hexString.length % 2) hexString = `0${hexString}`;
	const length = hexString.length / 2;
	const bytes = new Uint8Array(length);
	for (let index$1 = 0, j$1 = 0; index$1 < length; index$1++) {
		const nibbleLeft = charCodeToBase16(hexString.charCodeAt(j$1++));
		const nibbleRight = charCodeToBase16(hexString.charCodeAt(j$1++));
		if (nibbleLeft === void 0 || nibbleRight === void 0) throw new BaseError$1(`Invalid byte sequence ("${hexString[j$1 - 2]}${hexString[j$1 - 1]}" in "${hexString}").`);
		bytes[index$1] = nibbleLeft * 16 + nibbleRight;
	}
	return bytes;
}
function numberToBytes(value, opts) {
	const hex = numberToHex$1(value, opts);
	return hexToBytes(hex);
}
function stringToBytes(value, opts = {}) {
	const bytes = encoder$1.encode(value);
	if (typeof opts.size === "number") {
		assertSize$1(bytes, { size: opts.size });
		return pad$1(bytes, {
			dir: "right",
			size: opts.size
		});
	}
	return bytes;
}
var U32_MASK64 = /* @__PURE__ */ BigInt(2 ** 32 - 1);
var _32n = /* @__PURE__ */ BigInt(32);
function fromBig(n$1, le$3 = false) {
	if (le$3) return {
		h: Number(n$1 & U32_MASK64),
		l: Number(n$1 >> _32n & U32_MASK64)
	};
	return {
		h: Number(n$1 >> _32n & U32_MASK64) | 0,
		l: Number(n$1 & U32_MASK64) | 0
	};
}
function split(lst, le$3 = false) {
	let Ah = new Uint32Array(lst.length);
	let Al = new Uint32Array(lst.length);
	for (let i$2 = 0; i$2 < lst.length; i$2++) {
		const { h: h$3, l: l$2 } = fromBig(lst[i$2], le$3);
		[Ah[i$2], Al[i$2]] = [h$3, l$2];
	}
	return [Ah, Al];
}
var rotlSH = (h$3, l$2, s) => h$3 << s | l$2 >>> 32 - s;
var rotlSL = (h$3, l$2, s) => l$2 << s | h$3 >>> 32 - s;
var rotlBH = (h$3, l$2, s) => l$2 << s - 32 | h$3 >>> 64 - s;
var rotlBL = (h$3, l$2, s) => h$3 << s - 32 | l$2 >>> 64 - s;
var SHA3_PI = [];
var SHA3_ROTL = [];
var _SHA3_IOTA = [];
var _0n = /* @__PURE__ */ BigInt(0);
var _1n = /* @__PURE__ */ BigInt(1);
var _2n = /* @__PURE__ */ BigInt(2);
var _7n = /* @__PURE__ */ BigInt(7);
var _256n = /* @__PURE__ */ BigInt(256);
var _0x71n = /* @__PURE__ */ BigInt(113);
for (let round = 0, R$3 = _1n, x$1 = 1, y$4 = 0; round < 24; round++) {
	[x$1, y$4] = [y$4, (2 * x$1 + 3 * y$4) % 5];
	SHA3_PI.push(2 * (5 * y$4 + x$1));
	SHA3_ROTL.push((round + 1) * (round + 2) / 2 % 64);
	let t = _0n;
	for (let j$1 = 0; j$1 < 7; j$1++) {
		R$3 = (R$3 << _1n ^ (R$3 >> _7n) * _0x71n) % _256n;
		if (R$3 & _2n) t ^= _1n << (_1n << /* @__PURE__ */ BigInt(j$1)) - _1n;
	}
	_SHA3_IOTA.push(t);
}
var [SHA3_IOTA_H, SHA3_IOTA_L] = /* @__PURE__ */ split(_SHA3_IOTA, true);
var rotlH = (h$3, l$2, s) => s > 32 ? rotlBH(h$3, l$2, s) : rotlSH(h$3, l$2, s);
var rotlL = (h$3, l$2, s) => s > 32 ? rotlBL(h$3, l$2, s) : rotlSL(h$3, l$2, s);
function keccakP(s, rounds = 24) {
	const B$2 = new Uint32Array(10);
	for (let round = 24 - rounds; round < 24; round++) {
		for (let x$1 = 0; x$1 < 10; x$1++) B$2[x$1] = s[x$1] ^ s[x$1 + 10] ^ s[x$1 + 20] ^ s[x$1 + 30] ^ s[x$1 + 40];
		for (let x$1 = 0; x$1 < 10; x$1 += 2) {
			const idx1 = (x$1 + 8) % 10;
			const idx0 = (x$1 + 2) % 10;
			const B0 = B$2[idx0];
			const B1 = B$2[idx0 + 1];
			const Th = rotlH(B0, B1, 1) ^ B$2[idx1];
			const Tl = rotlL(B0, B1, 1) ^ B$2[idx1 + 1];
			for (let y$4 = 0; y$4 < 50; y$4 += 10) {
				s[x$1 + y$4] ^= Th;
				s[x$1 + y$4 + 1] ^= Tl;
			}
		}
		let curH = s[2];
		let curL = s[3];
		for (let t = 0; t < 24; t++) {
			const shift = SHA3_ROTL[t];
			const Th = rotlH(curH, curL, shift);
			const Tl = rotlL(curH, curL, shift);
			const PI = SHA3_PI[t];
			curH = s[PI];
			curL = s[PI + 1];
			s[PI] = Th;
			s[PI + 1] = Tl;
		}
		for (let y$4 = 0; y$4 < 50; y$4 += 10) {
			for (let x$1 = 0; x$1 < 10; x$1++) B$2[x$1] = s[y$4 + x$1];
			for (let x$1 = 0; x$1 < 10; x$1++) s[y$4 + x$1] ^= ~B$2[(x$1 + 2) % 10] & B$2[(x$1 + 4) % 10];
		}
		s[0] ^= SHA3_IOTA_H[round];
		s[1] ^= SHA3_IOTA_L[round];
	}
	B$2.fill(0);
}
var Keccak = class Keccak extends Hash {
	constructor(blockLen, suffix, outputLen, enableXOF = false, rounds = 24) {
		super();
		this.blockLen = blockLen;
		this.suffix = suffix;
		this.outputLen = outputLen;
		this.enableXOF = enableXOF;
		this.rounds = rounds;
		this.pos = 0;
		this.posOut = 0;
		this.finished = false;
		this.destroyed = false;
		anumber(outputLen);
		if (0 >= this.blockLen || this.blockLen >= 200) throw new Error("Sha3 supports only keccak-f1600 function");
		this.state = new Uint8Array(200);
		this.state32 = u32(this.state);
	}
	keccak() {
		if (!isLE) byteSwap32(this.state32);
		keccakP(this.state32, this.rounds);
		if (!isLE) byteSwap32(this.state32);
		this.posOut = 0;
		this.pos = 0;
	}
	update(data) {
		aexists(this);
		const { blockLen, state: state$3 } = this;
		data = toBytes$1(data);
		const len = data.length;
		for (let pos = 0; pos < len;) {
			const take = Math.min(blockLen - this.pos, len - pos);
			for (let i$2 = 0; i$2 < take; i$2++) state$3[this.pos++] ^= data[pos++];
			if (this.pos === blockLen) this.keccak();
		}
		return this;
	}
	finish() {
		if (this.finished) return;
		this.finished = true;
		const { state: state$3, suffix, pos, blockLen } = this;
		state$3[pos] ^= suffix;
		if ((suffix & 128) !== 0 && pos === blockLen - 1) this.keccak();
		state$3[blockLen - 1] ^= 128;
		this.keccak();
	}
	writeInto(out) {
		aexists(this, false);
		abytes(out);
		this.finish();
		const bufferOut = this.state;
		const { blockLen } = this;
		for (let pos = 0, len = out.length; pos < len;) {
			if (this.posOut >= blockLen) this.keccak();
			const take = Math.min(blockLen - this.posOut, len - pos);
			out.set(bufferOut.subarray(this.posOut, this.posOut + take), pos);
			this.posOut += take;
			pos += take;
		}
		return out;
	}
	xofInto(out) {
		if (!this.enableXOF) throw new Error("XOF is not possible for this instance");
		return this.writeInto(out);
	}
	xof(bytes) {
		anumber(bytes);
		return this.xofInto(new Uint8Array(bytes));
	}
	digestInto(out) {
		aoutput(out, this);
		if (this.finished) throw new Error("digest() was already called");
		this.writeInto(out);
		this.destroy();
		return out;
	}
	digest() {
		return this.digestInto(new Uint8Array(this.outputLen));
	}
	destroy() {
		this.destroyed = true;
		this.state.fill(0);
	}
	_cloneInto(to$2) {
		const { blockLen, suffix, outputLen, rounds, enableXOF } = this;
		to$2 || (to$2 = new Keccak(blockLen, suffix, outputLen, enableXOF, rounds));
		to$2.state32.set(this.state32);
		to$2.pos = this.pos;
		to$2.posOut = this.posOut;
		to$2.finished = this.finished;
		to$2.rounds = rounds;
		to$2.suffix = suffix;
		to$2.outputLen = outputLen;
		to$2.enableXOF = enableXOF;
		to$2.destroyed = this.destroyed;
		return to$2;
	}
};
var gen = (suffix, blockLen, outputLen) => wrapConstructor(() => new Keccak(blockLen, suffix, outputLen));
const keccak_256 = /* @__PURE__ */ gen(1, 136, 256 / 8);
function keccak256(value, to_) {
	const to$2 = to_ || "hex";
	const bytes = keccak_256(isHex$1(value, { strict: false }) ? toBytes(value) : value);
	if (to$2 === "bytes") return bytes;
	return toHex$1(bytes);
}
var LruMap = class extends Map {
	constructor(size$4) {
		super();
		Object.defineProperty(this, "maxSize", {
			enumerable: true,
			configurable: true,
			writable: true,
			value: void 0
		});
		this.maxSize = size$4;
	}
	get(key) {
		const value = super.get(key);
		if (super.has(key) && value !== void 0) {
			this.delete(key);
			super.set(key, value);
		}
		return value;
	}
	set(key, value) {
		super.set(key, value);
		if (this.maxSize && this.size > this.maxSize) {
			const firstKey = this.keys().next().value;
			if (firstKey) this.delete(firstKey);
		}
		return this;
	}
};
var checksumAddressCache = /* @__PURE__ */ new LruMap(8192);
function checksumAddress(address_, chainId) {
	if (checksumAddressCache.has(`${address_}.${chainId}`)) return checksumAddressCache.get(`${address_}.${chainId}`);
	const hexAddress = chainId ? `${chainId}${address_.toLowerCase()}` : address_.substring(2).toLowerCase();
	const hash = keccak256(stringToBytes(hexAddress), "bytes");
	const address = (chainId ? hexAddress.substring(`${chainId}0x`.length) : hexAddress).split("");
	for (let i$2 = 0; i$2 < 40; i$2 += 2) {
		if (hash[i$2 >> 1] >> 4 >= 8 && address[i$2]) address[i$2] = address[i$2].toUpperCase();
		if ((hash[i$2 >> 1] & 15) >= 8 && address[i$2 + 1]) address[i$2 + 1] = address[i$2 + 1].toUpperCase();
	}
	const result = `0x${address.join("")}`;
	checksumAddressCache.set(`${address_}.${chainId}`, result);
	return result;
}
function publicKeyToAddress(publicKey) {
	const address = keccak256(`0x${publicKey.substring(4)}`).substring(26);
	return checksumAddress(`0x${address}`);
}
async function recoverPublicKey({ hash, signature }) {
	const hashHex = isHex$1(hash) ? hash : toHex$1(hash);
	const { secp256k1 } = await __vitePreload(async () => {
		const { secp256k1: secp256k1$1 } = await import("./secp256k1-DfgUDMF_.js");
		return { secp256k1: secp256k1$1 };
	}, __vite__mapDeps([0,1,2,3]));
	return `0x${(() => {
		if (typeof signature === "object" && "r" in signature && "s" in signature) {
			const { r: r$1, s, v: v$3, yParity } = signature;
			const recoveryBit$1 = toRecoveryBit(Number(yParity ?? v$3));
			return new secp256k1.Signature(hexToBigInt(r$1), hexToBigInt(s)).addRecoveryBit(recoveryBit$1);
		}
		const signatureHex = isHex$1(signature) ? signature : toHex$1(signature);
		const yParityOrV = hexToNumber(`0x${signatureHex.slice(130)}`);
		const recoveryBit = toRecoveryBit(yParityOrV);
		return secp256k1.Signature.fromCompact(signatureHex.substring(2, 130)).addRecoveryBit(recoveryBit);
	})().recoverPublicKey(hashHex.substring(2)).toHex(false)}`;
}
function toRecoveryBit(yParityOrV) {
	if (yParityOrV === 0 || yParityOrV === 1) return yParityOrV;
	if (yParityOrV === 27) return 0;
	if (yParityOrV === 28) return 1;
	throw new Error("Invalid yParityOrV value");
}
async function recoverAddress({ hash, signature }) {
	return publicKeyToAddress(await recoverPublicKey({
		hash,
		signature
	}));
}
var import_cjs$5 = /* @__PURE__ */ __toESM(require_cjs$2());
var import_cjs$4 = /* @__PURE__ */ __toESM(require_cjs$1());
var import_cjs$3 = /* @__PURE__ */ __toESM(require_cjs());
function base(ALPHABET$1) {
	if (ALPHABET$1.length >= 255) throw new TypeError("Alphabet too long");
	const BASE_MAP = new Uint8Array(256);
	for (let j$1 = 0; j$1 < BASE_MAP.length; j$1++) BASE_MAP[j$1] = 255;
	for (let i$2 = 0; i$2 < ALPHABET$1.length; i$2++) {
		const x$1 = ALPHABET$1.charAt(i$2);
		const xc$1 = x$1.charCodeAt(0);
		if (BASE_MAP[xc$1] !== 255) throw new TypeError(x$1 + " is ambiguous");
		BASE_MAP[xc$1] = i$2;
	}
	const BASE = ALPHABET$1.length;
	const LEADER = ALPHABET$1.charAt(0);
	const FACTOR = Math.log(BASE) / Math.log(256);
	const iFACTOR = Math.log(256) / Math.log(BASE);
	function encode(source) {
		if (source instanceof Uint8Array) {} else if (ArrayBuffer.isView(source)) source = new Uint8Array(source.buffer, source.byteOffset, source.byteLength);
		else if (Array.isArray(source)) source = Uint8Array.from(source);
		if (!(source instanceof Uint8Array)) throw new TypeError("Expected Uint8Array");
		if (source.length === 0) return "";
		let zeroes = 0;
		let length = 0;
		let pbegin = 0;
		const pend = source.length;
		while (pbegin !== pend && source[pbegin] === 0) {
			pbegin++;
			zeroes++;
		}
		const size$4 = (pend - pbegin) * iFACTOR + 1 >>> 0;
		const b58 = new Uint8Array(size$4);
		while (pbegin !== pend) {
			let carry = source[pbegin];
			let i$2 = 0;
			for (let it1 = size$4 - 1; (carry !== 0 || i$2 < length) && it1 !== -1; it1--, i$2++) {
				carry += 256 * b58[it1] >>> 0;
				b58[it1] = carry % BASE >>> 0;
				carry = carry / BASE >>> 0;
			}
			if (carry !== 0) throw new Error("Non-zero carry");
			length = i$2;
			pbegin++;
		}
		let it2 = size$4 - length;
		while (it2 !== size$4 && b58[it2] === 0) it2++;
		let str = LEADER.repeat(zeroes);
		for (; it2 < size$4; ++it2) str += ALPHABET$1.charAt(b58[it2]);
		return str;
	}
	function decodeUnsafe(source) {
		if (typeof source !== "string") throw new TypeError("Expected String");
		if (source.length === 0) return new Uint8Array();
		let psz = 0;
		let zeroes = 0;
		let length = 0;
		while (source[psz] === LEADER) {
			zeroes++;
			psz++;
		}
		const size$4 = (source.length - psz) * FACTOR + 1 >>> 0;
		const b256 = new Uint8Array(size$4);
		while (psz < source.length) {
			const charCode = source.charCodeAt(psz);
			if (charCode > 255) return;
			let carry = BASE_MAP[charCode];
			if (carry === 255) return;
			let i$2 = 0;
			for (let it3 = size$4 - 1; (carry !== 0 || i$2 < length) && it3 !== -1; it3--, i$2++) {
				carry += BASE * b256[it3] >>> 0;
				b256[it3] = carry % 256 >>> 0;
				carry = carry / 256 >>> 0;
			}
			if (carry !== 0) throw new Error("Non-zero carry");
			length = i$2;
			psz++;
		}
		let it4 = size$4 - length;
		while (it4 !== size$4 && b256[it4] === 0) it4++;
		const vch = new Uint8Array(zeroes + (size$4 - it4));
		let j$1 = zeroes;
		while (it4 !== size$4) vch[j$1++] = b256[it4++];
		return vch;
	}
	function decode(string$2) {
		const buffer$1 = decodeUnsafe(string$2);
		if (buffer$1) return buffer$1;
		throw new Error("Non-base" + BASE + " character");
	}
	return {
		encode,
		decodeUnsafe,
		decode
	};
}
var esm_default = base("123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz");
function allocUnsafe$1(size$4 = 0) {
	if (globalThis.Buffer != null && globalThis.Buffer.allocUnsafe != null) return globalThis.Buffer.allocUnsafe(size$4);
	return new Uint8Array(size$4);
}
function concat(arrays, length) {
	if (!length) length = arrays.reduce((acc, curr) => acc + curr.length, 0);
	const output = allocUnsafe$1(length);
	let offset = 0;
	for (const arr of arrays) {
		output.set(arr, offset);
		offset += arr.length;
	}
	return output;
}
function createCodec$1(name, prefix, encode, decode) {
	return {
		name,
		prefix,
		encoder: {
			name,
			prefix,
			encode
		},
		decoder: { decode }
	};
}
var string$1 = createCodec$1("utf8", "u", (buf) => {
	return "u" + new TextDecoder("utf8").decode(buf);
}, (str) => {
	return new TextEncoder().encode(str.substring(1));
});
var ascii$1 = createCodec$1("ascii", "a", (buf) => {
	let string$2 = "a";
	for (let i$2 = 0; i$2 < buf.length; i$2++) string$2 += String.fromCharCode(buf[i$2]);
	return string$2;
}, (str) => {
	str = str.substring(1);
	const buf = allocUnsafe$1(str.length);
	for (let i$2 = 0; i$2 < str.length; i$2++) buf[i$2] = str.charCodeAt(i$2);
	return buf;
});
var bases_default$1 = {
	utf8: string$1,
	"utf-8": string$1,
	hex: bases.base16,
	latin1: ascii$1,
	ascii: ascii$1,
	binary: ascii$1,
	...bases
};
function fromString(string$2, encoding = "utf8") {
	const base$1 = bases_default$1[encoding];
	if (!base$1) throw new Error(`Unsupported encoding "${encoding}"`);
	if ((encoding === "utf8" || encoding === "utf-8") && globalThis.Buffer != null && globalThis.Buffer.from != null) return globalThis.Buffer.from(string$2, "utf8");
	return base$1.decoder.decode(`${base$1.prefix}${string$2}`);
}
function toString$1(array, encoding = "utf8") {
	const base$1 = bases_default$1[encoding];
	if (!base$1) throw new Error(`Unsupported encoding "${encoding}"`);
	if ((encoding === "utf8" || encoding === "utf-8") && globalThis.Buffer != null && globalThis.Buffer.from != null) return globalThis.Buffer.from(array.buffer, array.byteOffset, array.byteLength).toString("utf8");
	return base$1.encoder.encode(array).substring(1);
}
function Ne(t) {
	const [e, n$1] = t.split(":");
	return {
		namespace: e,
		reference: n$1
	};
}
function ue$2(t, e) {
	return t.includes(":") ? [t] : e.chains || [];
}
var Zo = Object.defineProperty, Yo$1 = Object.defineProperties, Go$1 = Object.getOwnPropertyDescriptors, Tn$1 = Object.getOwnPropertySymbols, Wo$1 = Object.prototype.hasOwnProperty, Xo$1 = Object.prototype.propertyIsEnumerable, Rn$1 = (t, e, n$1) => e in t ? Zo(t, e, {
	enumerable: !0,
	configurable: !0,
	writable: !0,
	value: n$1
}) : t[e] = n$1, _n$1 = (t, e) => {
	for (var n$1 in e || (e = {})) Wo$1.call(e, n$1) && Rn$1(t, n$1, e[n$1]);
	if (Tn$1) for (var n$1 of Tn$1(e)) Xo$1.call(e, n$1) && Rn$1(t, n$1, e[n$1]);
	return t;
}, Jo$1 = (t, e) => Yo$1(t, Go$1(e)), Y$2 = {
	reactNative: "react-native",
	node: "node",
	browser: "browser",
	unknown: "unknown"
};
function _e$2() {
	return typeof process < "u" && typeof process.versions < "u" && typeof process.versions.node < "u";
}
function pt$1() {
	return !(0, import_cjs$4.getDocument)() && !!(0, import_cjs$4.getNavigator)() && navigator.product === "ReactNative";
}
function ei() {
	return pt$1() && typeof global < "u" && typeof (global == null ? void 0 : global.Platform) < "u" && (global == null ? void 0 : global.Platform.OS) === "android";
}
function ni() {
	return pt$1() && typeof global < "u" && typeof (global == null ? void 0 : global.Platform) < "u" && (global == null ? void 0 : global.Platform.OS) === "ios";
}
function Tt$1() {
	return !_e$2() && !!(0, import_cjs$4.getNavigator)() && !!(0, import_cjs$4.getDocument)();
}
function xt$2() {
	return pt$1() ? Y$2.reactNative : _e$2() ? Y$2.node : Tt$1() ? Y$2.browser : Y$2.unknown;
}
function ri() {
	var t;
	try {
		return pt$1() && typeof global < "u" && typeof (global == null ? void 0 : global.Application) < "u" ? (t = global.Application) == null ? void 0 : t.applicationId : void 0;
	} catch {
		return;
	}
}
function Cn$1(t, e) {
	const n$1 = new URLSearchParams(t);
	for (const r$1 of Object.keys(e).sort()) if (e.hasOwnProperty(r$1)) {
		const o$1 = e[r$1];
		o$1 !== void 0 && n$1.set(r$1, o$1);
	}
	return n$1.toString();
}
function oi(t) {
	var e, n$1;
	const r$1 = Pn();
	try {
		return t != null && t.url && r$1.url && new URL(t.url).host !== new URL(r$1.url).host && (console.warn(`The configured WalletConnect 'metadata.url':${t.url} differs from the actual page url:${r$1.url}. This is probably unintended and can lead to issues.`), t.url = r$1.url), (e = t?.icons) != null && e.length && t.icons.length > 0 && (t.icons = t.icons.filter((o$1) => o$1 !== "")), Jo$1(_n$1(_n$1({}, r$1), t), {
			url: t?.url || r$1.url,
			name: t?.name || r$1.name,
			description: t?.description || r$1.description,
			icons: (n$1 = t?.icons) != null && n$1.length && t.icons.length > 0 ? t.icons : r$1.icons
		});
	} catch (o$1) {
		return console.warn("Error populating app metadata", o$1), t || r$1;
	}
}
function Pn() {
	return (0, import_cjs$5.getWindowMetadata)() || {
		name: "",
		description: "",
		url: "",
		icons: [""]
	};
}
function kn$1() {
	if (xt$2() === Y$2.reactNative && typeof global < "u" && typeof (global == null ? void 0 : global.Platform) < "u") {
		const { OS: n$1, Version: r$1 } = global.Platform;
		return [n$1, r$1].join("-");
	}
	const t = detect();
	if (t === null) return "unknown";
	const e = t.os ? t.os.replace(" ", "").toLowerCase() : "unknown";
	return t.type === "browser" ? [
		e,
		t.name,
		t.version
	].join("-") : [e, t.version].join("-");
}
function Vn$1() {
	var t;
	const e = xt$2();
	return e === Y$2.browser ? [e, ((t = (0, import_cjs$4.getLocation)()) == null ? void 0 : t.host) || "unknown"].join(":") : e;
}
function Mn(t, e, n$1) {
	const r$1 = kn$1(), o$1 = Vn$1();
	return [
		[t, e].join("-"),
		["js", n$1].join("-"),
		r$1,
		o$1
	].join("/");
}
function si({ protocol: t, version: e, relayUrl: n$1, sdkVersion: r$1, auth: o$1, projectId: i$2, useOnCloseEvent: s, bundleId: c$2, packageName: a$1 }) {
	const u$2 = n$1.split("?"), l$2 = Mn(t, e, r$1), f$4 = {
		auth: o$1,
		ua: l$2,
		projectId: i$2,
		useOnCloseEvent: s || void 0,
		packageName: a$1 || void 0,
		bundleId: c$2 || void 0
	}, h$3 = Cn$1(u$2[1] || "", f$4);
	return u$2[0] + "?" + h$3;
}
function gt$2(t, e) {
	return t.filter((n$1) => e.includes(n$1)).length === t.length;
}
function fi(t) {
	return Object.fromEntries(t.entries());
}
function li(t) {
	return new Map(Object.entries(t));
}
function gi(t = import_cjs$3.FIVE_MINUTES, e) {
	const n$1 = (0, import_cjs$3.toMiliseconds)(t || import_cjs$3.FIVE_MINUTES);
	let r$1, o$1, i$2, s;
	return {
		resolve: (c$2) => {
			i$2 && r$1 && (clearTimeout(i$2), r$1(c$2), s = Promise.resolve(c$2));
		},
		reject: (c$2) => {
			i$2 && o$1 && (clearTimeout(i$2), o$1(c$2));
		},
		done: () => new Promise((c$2, a$1) => {
			if (s) return c$2(s);
			i$2 = setTimeout(() => {
				const u$2 = new Error(e);
				s = Promise.reject(u$2), a$1(u$2);
			}, n$1), r$1 = c$2, o$1 = a$1;
		})
	};
}
function yi(t, e, n$1) {
	return new Promise(async (r$1, o$1) => {
		const i$2 = setTimeout(() => o$1(new Error(n$1)), e);
		try {
			const s = await t;
			r$1(s);
		} catch (s) {
			o$1(s);
		}
		clearTimeout(i$2);
	});
}
function $e$2(t, e) {
	if (typeof e == "string" && e.startsWith(`${t}:`)) return e;
	if (t.toLowerCase() === "topic") {
		if (typeof e != "string") throw new Error("Value must be \"string\" for expirer target type: topic");
		return `topic:${e}`;
	} else if (t.toLowerCase() === "id") {
		if (typeof e != "number") throw new Error("Value must be \"number\" for expirer target type: id");
		return `id:${e}`;
	}
	throw new Error(`Unknown expirer target type: ${t}`);
}
function mi(t) {
	return $e$2("topic", t);
}
function wi(t) {
	return $e$2("id", t);
}
function bi(t) {
	const [e, n$1] = t.split(":"), r$1 = {
		id: void 0,
		topic: void 0
	};
	if (e === "topic" && typeof n$1 == "string") r$1.topic = n$1;
	else if (e === "id" && Number.isInteger(Number(n$1))) r$1.id = Number(n$1);
	else throw new Error(`Invalid target, expected id:number or topic:string, got ${e}:${n$1}`);
	return r$1;
}
function Ei(t, e) {
	return (0, import_cjs$3.fromMiliseconds)((e || Date.now()) + (0, import_cjs$3.toMiliseconds)(t));
}
function vi(t) {
	return Date.now() >= (0, import_cjs$3.toMiliseconds)(t);
}
function xi(t, e) {
	return `${t}${e ? `:${e}` : ""}`;
}
function ot(t = [], e = []) {
	return [...new Set([...t, ...e])];
}
async function Si({ id: t, topic: e, wcDeepLink: n$1 }) {
	var r$1;
	try {
		if (!n$1) return;
		const o$1 = typeof n$1 == "string" ? JSON.parse(n$1) : n$1, i$2 = o$1?.href;
		if (typeof i$2 != "string") return;
		const s = Kn$1(i$2, t, e), c$2 = xt$2();
		if (c$2 === Y$2.browser) {
			if (!((r$1 = (0, import_cjs$4.getDocument)()) != null && r$1.hasFocus())) {
				console.warn("Document does not have focus, skipping deeplink.");
				return;
			}
			Fn$1(s);
		} else c$2 === Y$2.reactNative && typeof (global == null ? void 0 : global.Linking) < "u" && await global.Linking.openURL(s);
	} catch (o$1) {
		console.error(o$1);
	}
}
function Kn$1(t, e, n$1) {
	const r$1 = `requestId=${e}&sessionTopic=${n$1}`;
	t.endsWith("/") && (t = t.slice(0, -1));
	let o$1 = `${t}`;
	if (t.startsWith("https://t.me")) {
		const i$2 = t.includes("?") ? "&startapp=" : "?startapp=";
		o$1 = `${o$1}${i$2}${Yn$1(r$1, !0)}`;
	} else o$1 = `${o$1}/wc?${r$1}`;
	return o$1;
}
function Fn$1(t) {
	let e = "_self";
	Zn$1() ? e = "_top" : (zn$1() || t.startsWith("https://") || t.startsWith("http://")) && (e = "_blank"), window.open(t, e, "noreferrer noopener");
}
async function Oi(t, e) {
	let n$1 = "";
	try {
		if (Tt$1() && (n$1 = localStorage.getItem(e), n$1)) return n$1;
		n$1 = await t.getItem(e);
	} catch (r$1) {
		console.error(r$1);
	}
	return n$1;
}
function Ai(t, e) {
	if (!t.includes(e)) return null;
	const n$1 = t.split(/([&,?,=])/), r$1 = n$1.indexOf(e);
	return n$1[r$1 + 2];
}
function Bi() {
	return typeof crypto < "u" && crypto != null && crypto.randomUUID ? crypto.randomUUID() : "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/gu, (t) => {
		const e = Math.random() * 16 | 0;
		return (t === "x" ? e : e & 3 | 8).toString(16);
	});
}
function Ii() {
	return typeof process < "u" && {}.IS_VITEST === "true";
}
function zn$1() {
	return typeof window < "u" && (!!window.TelegramWebviewProxy || !!window.Telegram || !!window.TelegramWebviewProxyProto);
}
function Zn$1() {
	try {
		return window.self !== window.top;
	} catch {
		return !1;
	}
}
function Yn$1(t, e = !1) {
	const n$1 = Buffer.from(t).toString("base64");
	return e ? n$1.replace(/[=]/g, "") : n$1;
}
function je$2(t) {
	return Buffer.from(t, "base64").toString("utf-8");
}
function Ni(t) {
	return new Promise((e) => setTimeout(e, t));
}
function Wt$2(t) {
	if (!Number.isSafeInteger(t) || t < 0) throw new Error("positive integer expected, got " + t);
}
function Ui$1(t) {
	return t instanceof Uint8Array || ArrayBuffer.isView(t) && t.constructor.name === "Uint8Array";
}
function Xt$2(t, ...e) {
	if (!Ui$1(t)) throw new Error("Uint8Array expected");
	if (e.length > 0 && !e.includes(t.length)) throw new Error("Uint8Array expected of length " + e + ", got length=" + t.length);
}
function Ce$2(t) {
	if (typeof t != "function" || typeof t.create != "function") throw new Error("Hash should be wrapped by utils.wrapConstructor");
	Wt$2(t.outputLen), Wt$2(t.blockLen);
}
function Rt$2(t, e = !0) {
	if (t.destroyed) throw new Error("Hash instance has been destroyed");
	if (e && t.finished) throw new Error("Hash#digest() has already been called");
}
function Gn$1(t, e) {
	Xt$2(t);
	const n$1 = e.outputLen;
	if (t.length < n$1) throw new Error("digestInto() expects output buffer of length at least " + n$1);
}
var le$2 = BigInt(2 ** 32 - 1), Wn$1 = BigInt(32);
function Ti$1(t, e = !1) {
	return e ? {
		h: Number(t & le$2),
		l: Number(t >> Wn$1 & le$2)
	} : {
		h: Number(t >> Wn$1 & le$2) | 0,
		l: Number(t & le$2) | 0
	};
}
function Ri$1(t, e = !1) {
	let n$1 = new Uint32Array(t.length), r$1 = new Uint32Array(t.length);
	for (let o$1 = 0; o$1 < t.length; o$1++) {
		const { h: i$2, l: s } = Ti$1(t[o$1], e);
		[n$1[o$1], r$1[o$1]] = [i$2, s];
	}
	return [n$1, r$1];
}
var _i$1 = (t, e, n$1) => t << n$1 | e >>> 32 - n$1, $i$1 = (t, e, n$1) => e << n$1 | t >>> 32 - n$1, Li$1 = (t, e, n$1) => e << n$1 - 32 | t >>> 64 - n$1, ji$1 = (t, e, n$1) => t << n$1 - 32 | e >>> 64 - n$1, _t$2 = typeof globalThis == "object" && "crypto" in globalThis ? globalThis.crypto : void 0;
function Ci$1(t) {
	return new Uint32Array(t.buffer, t.byteOffset, Math.floor(t.byteLength / 4));
}
function Pe$2(t) {
	return new DataView(t.buffer, t.byteOffset, t.byteLength);
}
function ct$1(t, e) {
	return t << 32 - e | t >>> e;
}
var Xn$1 = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
function Pi$1(t) {
	return t << 24 & 4278190080 | t << 8 & 16711680 | t >>> 8 & 65280 | t >>> 24 & 255;
}
function Jn$1(t) {
	for (let e = 0; e < t.length; e++) t[e] = Pi$1(t[e]);
}
function ki$1(t) {
	if (typeof t != "string") throw new Error("utf8ToBytes expected string, got " + typeof t);
	return new Uint8Array(new TextEncoder().encode(t));
}
function $t$1(t) {
	return typeof t == "string" && (t = ki$1(t)), Xt$2(t), t;
}
function Vi$1(...t) {
	let e = 0;
	for (let r$1 = 0; r$1 < t.length; r$1++) {
		const o$1 = t[r$1];
		Xt$2(o$1), e += o$1.length;
	}
	const n$1 = new Uint8Array(e);
	for (let r$1 = 0, o$1 = 0; r$1 < t.length; r$1++) {
		const i$2 = t[r$1];
		n$1.set(i$2, o$1), o$1 += i$2.length;
	}
	return n$1;
}
var ke$3 = class {
	clone() {
		return this._cloneInto();
	}
};
function Qn$1(t) {
	const e = (r$1) => t().update($t$1(r$1)).digest(), n$1 = t();
	return e.outputLen = n$1.outputLen, e.blockLen = n$1.blockLen, e.create = () => t(), e;
}
function Lt$2(t = 32) {
	if (_t$2 && typeof _t$2.getRandomValues == "function") return _t$2.getRandomValues(new Uint8Array(t));
	if (_t$2 && typeof _t$2.randomBytes == "function") return _t$2.randomBytes(t);
	throw new Error("crypto.getRandomValues must be defined");
}
var tr$1 = [], er$1 = [], nr$1 = [], Mi$1 = BigInt(0), Jt$2 = BigInt(1), Di$1 = BigInt(2), Hi = BigInt(7), qi$1 = BigInt(256), Ki$1 = BigInt(113);
for (let t = 0, e = Jt$2, n$1 = 1, r$1 = 0; t < 24; t++) {
	[n$1, r$1] = [r$1, (2 * n$1 + 3 * r$1) % 5], tr$1.push(2 * (5 * r$1 + n$1)), er$1.push((t + 1) * (t + 2) / 2 % 64);
	let o$1 = Mi$1;
	for (let i$2 = 0; i$2 < 7; i$2++) e = (e << Jt$2 ^ (e >> Hi) * Ki$1) % qi$1, e & Di$1 && (o$1 ^= Jt$2 << (Jt$2 << BigInt(i$2)) - Jt$2);
	nr$1.push(o$1);
}
var [Fi$1, zi$1] = Ri$1(nr$1, !0), rr$1 = (t, e, n$1) => n$1 > 32 ? Li$1(t, e, n$1) : _i$1(t, e, n$1), or$1 = (t, e, n$1) => n$1 > 32 ? ji$1(t, e, n$1) : $i$1(t, e, n$1);
function Zi(t, e = 24) {
	const n$1 = new Uint32Array(10);
	for (let r$1 = 24 - e; r$1 < 24; r$1++) {
		for (let s = 0; s < 10; s++) n$1[s] = t[s] ^ t[s + 10] ^ t[s + 20] ^ t[s + 30] ^ t[s + 40];
		for (let s = 0; s < 10; s += 2) {
			const c$2 = (s + 8) % 10, a$1 = (s + 2) % 10, u$2 = n$1[a$1], l$2 = n$1[a$1 + 1], f$4 = rr$1(u$2, l$2, 1) ^ n$1[c$2], h$3 = or$1(u$2, l$2, 1) ^ n$1[c$2 + 1];
			for (let y$4 = 0; y$4 < 50; y$4 += 10) t[s + y$4] ^= f$4, t[s + y$4 + 1] ^= h$3;
		}
		let o$1 = t[2], i$2 = t[3];
		for (let s = 0; s < 24; s++) {
			const c$2 = er$1[s], a$1 = rr$1(o$1, i$2, c$2), u$2 = or$1(o$1, i$2, c$2), l$2 = tr$1[s];
			o$1 = t[l$2], i$2 = t[l$2 + 1], t[l$2] = a$1, t[l$2 + 1] = u$2;
		}
		for (let s = 0; s < 50; s += 10) {
			for (let c$2 = 0; c$2 < 10; c$2++) n$1[c$2] = t[s + c$2];
			for (let c$2 = 0; c$2 < 10; c$2++) t[s + c$2] ^= ~n$1[(c$2 + 2) % 10] & n$1[(c$2 + 4) % 10];
		}
		t[0] ^= Fi$1[r$1], t[1] ^= zi$1[r$1];
	}
	n$1.fill(0);
}
var En$1 = class En$1 extends ke$3 {
	constructor(e, n$1, r$1, o$1 = !1, i$2 = 24) {
		if (super(), this.blockLen = e, this.suffix = n$1, this.outputLen = r$1, this.enableXOF = o$1, this.rounds = i$2, this.pos = 0, this.posOut = 0, this.finished = !1, this.destroyed = !1, Wt$2(r$1), 0 >= this.blockLen || this.blockLen >= 200) throw new Error("Sha3 supports only keccak-f1600 function");
		this.state = new Uint8Array(200), this.state32 = Ci$1(this.state);
	}
	keccak() {
		Xn$1 || Jn$1(this.state32), Zi(this.state32, this.rounds), Xn$1 || Jn$1(this.state32), this.posOut = 0, this.pos = 0;
	}
	update(e) {
		Rt$2(this);
		const { blockLen: n$1, state: r$1 } = this;
		e = $t$1(e);
		const o$1 = e.length;
		for (let i$2 = 0; i$2 < o$1;) {
			const s = Math.min(n$1 - this.pos, o$1 - i$2);
			for (let c$2 = 0; c$2 < s; c$2++) r$1[this.pos++] ^= e[i$2++];
			this.pos === n$1 && this.keccak();
		}
		return this;
	}
	finish() {
		if (this.finished) return;
		this.finished = !0;
		const { state: e, suffix: n$1, pos: r$1, blockLen: o$1 } = this;
		e[r$1] ^= n$1, n$1 & 128 && r$1 === o$1 - 1 && this.keccak(), e[o$1 - 1] ^= 128, this.keccak();
	}
	writeInto(e) {
		Rt$2(this, !1), Xt$2(e), this.finish();
		const n$1 = this.state, { blockLen: r$1 } = this;
		for (let o$1 = 0, i$2 = e.length; o$1 < i$2;) {
			this.posOut >= r$1 && this.keccak();
			const s = Math.min(r$1 - this.posOut, i$2 - o$1);
			e.set(n$1.subarray(this.posOut, this.posOut + s), o$1), this.posOut += s, o$1 += s;
		}
		return e;
	}
	xofInto(e) {
		if (!this.enableXOF) throw new Error("XOF is not possible for this instance");
		return this.writeInto(e);
	}
	xof(e) {
		return Wt$2(e), this.xofInto(new Uint8Array(e));
	}
	digestInto(e) {
		if (Gn$1(e, this), this.finished) throw new Error("digest() was already called");
		return this.writeInto(e), this.destroy(), e;
	}
	digest() {
		return this.digestInto(new Uint8Array(this.outputLen));
	}
	destroy() {
		this.destroyed = !0, this.state.fill(0);
	}
	_cloneInto(e) {
		const { blockLen: n$1, suffix: r$1, outputLen: o$1, rounds: i$2, enableXOF: s } = this;
		return e || (e = new En$1(n$1, r$1, o$1, s, i$2)), e.state32.set(this.state32), e.pos = this.pos, e.posOut = this.posOut, e.finished = this.finished, e.rounds = i$2, e.suffix = r$1, e.outputLen = o$1, e.enableXOF = s, e.destroyed = this.destroyed, e;
	}
}, Yi$1 = (t, e, n$1) => Qn$1(() => new En$1(e, t, n$1)), Gi$1 = Yi$1(1, 136, 256 / 8);
function Ve$2(t) {
	const e = `Ethereum Signed Message:
${t.length}`, n$1 = new TextEncoder().encode(e + t);
	return "0x" + Buffer.from(Gi$1(n$1)).toString("hex");
}
async function ir$1(t, e, n$1, r$1, o$1, i$2) {
	switch (n$1.t) {
		case "eip191": return await sr$1(t, e, n$1.s);
		case "eip1271": return await cr$1(t, e, n$1.s, r$1, o$1, i$2);
		default: throw new Error(`verifySignature failed: Attempted to verify CacaoSignature with unknown type: ${n$1.t}`);
	}
}
async function sr$1(t, e, n$1) {
	return (await recoverAddress({
		hash: Ve$2(e),
		signature: n$1
	})).toLowerCase() === t.toLowerCase();
}
async function cr$1(t, e, n$1, r$1, o$1, i$2) {
	const s = Ne(r$1);
	if (!s.namespace || !s.reference) throw new Error(`isValidEip1271Signature failed: chainId must be in CAIP-2 format, received: ${r$1}`);
	try {
		const c$2 = "0x1626ba7e", a$1 = "0000000000000000000000000000000000000000000000000000000000000040", u$2 = "0000000000000000000000000000000000000000000000000000000000000041", l$2 = n$1.substring(2), f$4 = Ve$2(e).substring(2), h$3 = c$2 + f$4 + a$1 + u$2 + l$2, y$4 = await fetch(`${i$2 || "https://rpc.walletconnect.org/v1"}/?chainId=${r$1}&projectId=${o$1}`, {
			method: "POST",
			body: JSON.stringify({
				id: Xi(),
				jsonrpc: "2.0",
				method: "eth_call",
				params: [{
					to: t,
					data: h$3
				}, "latest"]
			})
		}), { result: E$4 } = await y$4.json();
		return E$4 ? E$4.slice(0, 10).toLowerCase() === c$2.toLowerCase() : !1;
	} catch (c$2) {
		return console.error("isValidEip1271Signature: ", c$2), !1;
	}
}
function Xi() {
	return Date.now() + Math.floor(Math.random() * 1e3);
}
function Ji(t) {
	const e = atob(t), n$1 = new Uint8Array(e.length);
	for (let s = 0; s < e.length; s++) n$1[s] = e.charCodeAt(s);
	const r$1 = n$1[0];
	if (r$1 === 0) throw new Error("No signatures found");
	const o$1 = 1 + r$1 * 64;
	if (n$1.length < o$1) throw new Error("Transaction data too short for claimed signature count");
	if (n$1.length < 100) throw new Error("Transaction too short");
	const i$2 = Buffer.from(t, "base64").slice(1, 65);
	return esm_default.encode(i$2);
}
var Qi = Object.defineProperty, ts$1 = Object.defineProperties, es = Object.getOwnPropertyDescriptors, ar$1 = Object.getOwnPropertySymbols, ns = Object.prototype.hasOwnProperty, rs = Object.prototype.propertyIsEnumerable, ur$1 = (t, e, n$1) => e in t ? Qi(t, e, {
	enumerable: !0,
	configurable: !0,
	writable: !0,
	value: n$1
}) : t[e] = n$1, Me$3 = (t, e) => {
	for (var n$1 in e || (e = {})) ns.call(e, n$1) && ur$1(t, n$1, e[n$1]);
	if (ar$1) for (var n$1 of ar$1(e)) rs.call(e, n$1) && ur$1(t, n$1, e[n$1]);
	return t;
}, fr$1 = (t, e) => ts$1(t, es(e)), de$2 = (t) => t?.split(":"), lr$1 = (t) => {
	const e = t && de$2(t);
	if (e) return t.includes("did:pkh:") ? e[3] : e[1];
}, dr = (t) => {
	const e = t && de$2(t);
	if (e) return e[2] + ":" + e[3];
}, De$1 = (t) => {
	const e = t && de$2(t);
	if (e) return e.pop();
};
async function is(t) {
	const { cacao: e, projectId: n$1 } = t, { s: r$1, p: o$1 } = e, i$2 = hr(o$1, o$1.iss), s = De$1(o$1.iss);
	return await ir$1(s, i$2, r$1, dr(o$1.iss), n$1);
}
var hr = (t, e) => {
	const n$1 = `${t.domain} wants you to sign in with your Ethereum account:`, r$1 = De$1(e);
	if (!t.aud && !t.uri) throw new Error("Either `aud` or `uri` is required to construct the message");
	let o$1 = t.statement || void 0;
	const i$2 = `URI: ${t.aud || t.uri}`, s = `Version: ${t.version}`, c$2 = `Chain ID: ${lr$1(e)}`, a$1 = `Nonce: ${t.nonce}`, u$2 = `Issued At: ${t.iat}`, l$2 = t.exp ? `Expiration Time: ${t.exp}` : void 0, f$4 = t.nbf ? `Not Before: ${t.nbf}` : void 0, h$3 = t.requestId ? `Request ID: ${t.requestId}` : void 0, y$4 = t.resources ? `Resources:${t.resources.map((p$2) => `
- ${p$2}`).join("")}` : void 0, E$4 = pe$1(t.resources);
	if (E$4) {
		const p$2 = yt$2(E$4);
		o$1 = Ke$3(o$1, p$2);
	}
	return [
		n$1,
		r$1,
		"",
		o$1,
		"",
		i$2,
		s,
		c$2,
		a$1,
		u$2,
		l$2,
		f$4,
		h$3,
		y$4
	].filter((p$2) => p$2 != null).join(`
`);
};
function mr$1(t) {
	return Buffer.from(JSON.stringify(t)).toString("base64");
}
function wr$1(t) {
	return JSON.parse(Buffer.from(t, "base64").toString("utf-8"));
}
function at$1(t) {
	if (!t) throw new Error("No recap provided, value is undefined");
	if (!t.att) throw new Error("No `att` property found");
	const e = Object.keys(t.att);
	if (!(e != null && e.length)) throw new Error("No resources found in `att` property");
	e.forEach((n$1) => {
		const r$1 = t.att[n$1];
		if (Array.isArray(r$1)) throw new Error(`Resource must be an object: ${n$1}`);
		if (typeof r$1 != "object") throw new Error(`Resource must be an object: ${n$1}`);
		if (!Object.keys(r$1).length) throw new Error(`Resource object is empty: ${n$1}`);
		Object.keys(r$1).forEach((o$1) => {
			const i$2 = r$1[o$1];
			if (!Array.isArray(i$2)) throw new Error(`Ability limits ${o$1} must be an array of objects, found: ${i$2}`);
			if (!i$2.length) throw new Error(`Value of ${o$1} is empty array, must be an array with objects`);
			i$2.forEach((s) => {
				if (typeof s != "object") throw new Error(`Ability limits (${o$1}) must be an array of objects, found: ${s}`);
			});
		});
	});
}
function br$1(t, e, n$1, r$1 = {}) {
	return n$1?.sort((o$1, i$2) => o$1.localeCompare(i$2)), { att: { [t]: He$2(e, n$1, r$1) } };
}
function He$2(t, e, n$1 = {}) {
	e = e?.sort((o$1, i$2) => o$1.localeCompare(i$2));
	const r$1 = e.map((o$1) => ({ [`${t}/${o$1}`]: [n$1] }));
	return Object.assign({}, ...r$1);
}
function he$2(t) {
	return at$1(t), `urn:recap:${mr$1(t).replace(/=/g, "")}`;
}
function yt$2(t) {
	const e = wr$1(t.replace("urn:recap:", ""));
	return at$1(e), e;
}
function fs(t, e, n$1) {
	const r$1 = br$1(t, e, n$1);
	return he$2(r$1);
}
function qe$2(t) {
	return t && t.includes("urn:recap:");
}
function ls(t, e) {
	const n$1 = yt$2(t), r$1 = yt$2(e), o$1 = vr$1(n$1, r$1);
	return he$2(o$1);
}
function vr$1(t, e) {
	at$1(t), at$1(e);
	const n$1 = Object.keys(t.att).concat(Object.keys(e.att)).sort((o$1, i$2) => o$1.localeCompare(i$2)), r$1 = { att: {} };
	return n$1.forEach((o$1) => {
		var i$2, s;
		Object.keys(((i$2 = t.att) == null ? void 0 : i$2[o$1]) || {}).concat(Object.keys(((s = e.att) == null ? void 0 : s[o$1]) || {})).sort((c$2, a$1) => c$2.localeCompare(a$1)).forEach((c$2) => {
			var a$1, u$2;
			r$1.att[o$1] = fr$1(Me$3({}, r$1.att[o$1]), { [c$2]: ((a$1 = t.att[o$1]) == null ? void 0 : a$1[c$2]) || ((u$2 = e.att[o$1]) == null ? void 0 : u$2[c$2]) });
		});
	}), r$1;
}
function Ke$3(t = "", e) {
	at$1(e);
	const n$1 = "I further authorize the stated URI to perform the following actions on my behalf: ";
	if (t.includes(n$1)) return t;
	const r$1 = [];
	let o$1 = 0;
	Object.keys(e.att).forEach((c$2) => {
		const a$1 = Object.keys(e.att[c$2]).map((f$4) => ({
			ability: f$4.split("/")[0],
			action: f$4.split("/")[1]
		}));
		a$1.sort((f$4, h$3) => f$4.action.localeCompare(h$3.action));
		const u$2 = {};
		a$1.forEach((f$4) => {
			u$2[f$4.ability] || (u$2[f$4.ability] = []), u$2[f$4.ability].push(f$4.action);
		});
		const l$2 = Object.keys(u$2).map((f$4) => (o$1++, `(${o$1}) '${f$4}': '${u$2[f$4].join("', '")}' for '${c$2}'.`));
		r$1.push(l$2.join(", ").replace(".,", "."));
	});
	const i$2 = r$1.join(" "), s = `${n$1}${i$2}`;
	return `${t ? t + " " : ""}${s}`;
}
function ds(t) {
	var e;
	const n$1 = yt$2(t);
	at$1(n$1);
	const r$1 = (e = n$1.att) == null ? void 0 : e.eip155;
	return r$1 ? Object.keys(r$1).map((o$1) => o$1.split("/")[1]) : [];
}
function hs(t) {
	const e = yt$2(t);
	at$1(e);
	const n$1 = [];
	return Object.values(e.att).forEach((r$1) => {
		Object.values(r$1).forEach((o$1) => {
			var i$2;
			(i$2 = o$1?.[0]) != null && i$2.chains && n$1.push(o$1[0].chains);
		});
	}), [...new Set(n$1.flat())];
}
function pe$1(t) {
	if (!t) return;
	const e = t?.[t.length - 1];
	return qe$2(e) ? e : void 0;
}
function Fe$2(t) {
	if (!Number.isSafeInteger(t) || t < 0) throw new Error("positive integer expected, got " + t);
}
function Sr$1(t) {
	return t instanceof Uint8Array || ArrayBuffer.isView(t) && t.constructor.name === "Uint8Array";
}
function tt$1(t, ...e) {
	if (!Sr$1(t)) throw new Error("Uint8Array expected");
	if (e.length > 0 && !e.includes(t.length)) throw new Error("Uint8Array expected of length " + e + ", got length=" + t.length);
}
function Or$1(t, e = !0) {
	if (t.destroyed) throw new Error("Hash instance has been destroyed");
	if (e && t.finished) throw new Error("Hash#digest() has already been called");
}
function ps$1(t, e) {
	tt$1(t);
	const n$1 = e.outputLen;
	if (t.length < n$1) throw new Error("digestInto() expects output buffer of length at least " + n$1);
}
function Ar$1(t) {
	if (typeof t != "boolean") throw new Error(`boolean expected, not ${t}`);
}
var mt$2 = (t) => new Uint32Array(t.buffer, t.byteOffset, Math.floor(t.byteLength / 4)), gs = (t) => new DataView(t.buffer, t.byteOffset, t.byteLength);
if (!(new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68)) throw new Error("Non little-endian hardware is not supported");
function ms$1(t) {
	if (typeof t != "string") throw new Error("string expected");
	return new Uint8Array(new TextEncoder().encode(t));
}
function ze$2(t) {
	if (typeof t == "string") t = ms$1(t);
	else if (Sr$1(t)) t = Ze$3(t);
	else throw new Error("Uint8Array expected, got " + typeof t);
	return t;
}
function ws$1(t, e) {
	if (e == null || typeof e != "object") throw new Error("options must be defined");
	return Object.assign(t, e);
}
function bs$1(t, e) {
	if (t.length !== e.length) return !1;
	let n$1 = 0;
	for (let r$1 = 0; r$1 < t.length; r$1++) n$1 |= t[r$1] ^ e[r$1];
	return n$1 === 0;
}
var Es$1 = (t, e) => {
	function n$1(r$1, ...o$1) {
		if (tt$1(r$1), t.nonceLength !== void 0) {
			const l$2 = o$1[0];
			if (!l$2) throw new Error("nonce / iv required");
			t.varSizeNonce ? tt$1(l$2) : tt$1(l$2, t.nonceLength);
		}
		const i$2 = t.tagLength;
		i$2 && o$1[1] !== void 0 && tt$1(o$1[1]);
		const s = e(r$1, ...o$1), c$2 = (l$2, f$4) => {
			if (f$4 !== void 0) {
				if (l$2 !== 2) throw new Error("cipher output not supported");
				tt$1(f$4);
			}
		};
		let a$1 = !1;
		return {
			encrypt(l$2, f$4) {
				if (a$1) throw new Error("cannot encrypt() twice with same key + nonce");
				return a$1 = !0, tt$1(l$2), c$2(s.encrypt.length, f$4), s.encrypt(l$2, f$4);
			},
			decrypt(l$2, f$4) {
				if (tt$1(l$2), i$2 && l$2.length < i$2) throw new Error("invalid ciphertext length: smaller than tagLength=" + i$2);
				return c$2(s.decrypt.length, f$4), s.decrypt(l$2, f$4);
			}
		};
	}
	return Object.assign(n$1, t), n$1;
};
function Br$1(t, e, n$1 = !0) {
	if (e === void 0) return new Uint8Array(t);
	if (e.length !== t) throw new Error("invalid output length, expected " + t + ", got: " + e.length);
	if (n$1 && !vs$1(e)) throw new Error("invalid output, must be aligned");
	return e;
}
function Ir$1(t, e, n$1, r$1) {
	if (typeof t.setBigUint64 == "function") return t.setBigUint64(e, n$1, r$1);
	const o$1 = BigInt(32), i$2 = BigInt(4294967295), s = Number(n$1 >> o$1 & i$2), c$2 = Number(n$1 & i$2), a$1 = r$1 ? 4 : 0, u$2 = r$1 ? 0 : 4;
	t.setUint32(e + a$1, s, r$1), t.setUint32(e + u$2, c$2, r$1);
}
function vs$1(t) {
	return t.byteOffset % 4 === 0;
}
function Ze$3(t) {
	return Uint8Array.from(t);
}
function jt$2(...t) {
	for (let e = 0; e < t.length; e++) t[e].fill(0);
}
var Nr$1 = (t) => Uint8Array.from(t.split("").map((e) => e.charCodeAt(0))), xs$1 = Nr$1("expand 16-byte k"), Ss$1 = Nr$1("expand 32-byte k"), Os$1 = mt$2(xs$1), As$1 = mt$2(Ss$1);
function V$3(t, e) {
	return t << e | t >>> 32 - e;
}
function Ye$2(t) {
	return t.byteOffset % 4 === 0;
}
var Ur$1 = 2 ** 32 - 1, Tr$1 = new Uint32Array();
function Is$1(t, e, n$1, r$1, o$1, i$2, s, c$2) {
	const a$1 = o$1.length, u$2 = new Uint8Array(64), l$2 = mt$2(u$2), f$4 = Ye$2(o$1) && Ye$2(i$2), h$3 = f$4 ? mt$2(o$1) : Tr$1, y$4 = f$4 ? mt$2(i$2) : Tr$1;
	for (let E$4 = 0; E$4 < a$1; s++) {
		if (t(e, n$1, r$1, l$2, s, c$2), s >= Ur$1) throw new Error("arx: counter overflow");
		const p$2 = Math.min(64, a$1 - E$4);
		if (f$4 && p$2 === 64) {
			const d$2 = E$4 / 4;
			if (E$4 % 4 !== 0) throw new Error("arx: invalid block position");
			for (let v$3 = 0, m$1; v$3 < 16; v$3++) m$1 = d$2 + v$3, y$4[m$1] = h$3[m$1] ^ l$2[v$3];
			E$4 += 64;
			continue;
		}
		for (let d$2 = 0, v$3; d$2 < p$2; d$2++) v$3 = E$4 + d$2, i$2[v$3] = o$1[v$3] ^ u$2[d$2];
		E$4 += p$2;
	}
}
function Ns$1(t, e) {
	const { allowShortKeys: n$1, extendNonceFn: r$1, counterLength: o$1, counterRight: i$2, rounds: s } = ws$1({
		allowShortKeys: !1,
		counterLength: 8,
		counterRight: !1,
		rounds: 20
	}, e);
	if (typeof t != "function") throw new Error("core must be a function");
	return Fe$2(o$1), Fe$2(s), Ar$1(i$2), Ar$1(n$1), (c$2, a$1, u$2, l$2, f$4 = 0) => {
		tt$1(c$2), tt$1(a$1), tt$1(u$2);
		const h$3 = u$2.length;
		if (l$2 === void 0 && (l$2 = new Uint8Array(h$3)), tt$1(l$2), Fe$2(f$4), f$4 < 0 || f$4 >= Ur$1) throw new Error("arx: counter overflow");
		if (l$2.length < h$3) throw new Error(`arx: output (${l$2.length}) is shorter than data (${h$3})`);
		const y$4 = [];
		let E$4 = c$2.length, p$2, d$2;
		if (E$4 === 32) y$4.push(p$2 = Ze$3(c$2)), d$2 = As$1;
		else if (E$4 === 16 && n$1) p$2 = new Uint8Array(32), p$2.set(c$2), p$2.set(c$2, 16), d$2 = Os$1, y$4.push(p$2);
		else throw new Error(`arx: invalid 32-byte key, got length=${E$4}`);
		Ye$2(a$1) || y$4.push(a$1 = Ze$3(a$1));
		const v$3 = mt$2(p$2);
		if (r$1) {
			if (a$1.length !== 24) throw new Error("arx: extended nonce must be 24 bytes");
			r$1(d$2, v$3, mt$2(a$1.subarray(0, 16)), v$3), a$1 = a$1.subarray(16);
		}
		const m$1 = 16 - o$1;
		if (m$1 !== a$1.length) throw new Error(`arx: nonce must be ${m$1} or 16 bytes`);
		if (m$1 !== 12) {
			const N$2 = new Uint8Array(12);
			N$2.set(a$1, i$2 ? 0 : 12 - a$1.length), a$1 = N$2, y$4.push(a$1);
		}
		const O$3 = mt$2(a$1);
		return Is$1(t, d$2, v$3, O$3, u$2, l$2, f$4, s), jt$2(...y$4), l$2;
	};
}
var F$2 = (t, e) => t[e++] & 255 | (t[e++] & 255) << 8;
var Us = class {
	constructor(e) {
		this.blockLen = 16, this.outputLen = 16, this.buffer = new Uint8Array(16), this.r = new Uint16Array(10), this.h = new Uint16Array(10), this.pad = new Uint16Array(8), this.pos = 0, this.finished = !1, e = ze$2(e), tt$1(e, 32);
		const n$1 = F$2(e, 0), r$1 = F$2(e, 2), o$1 = F$2(e, 4), i$2 = F$2(e, 6), s = F$2(e, 8), c$2 = F$2(e, 10), a$1 = F$2(e, 12), u$2 = F$2(e, 14);
		this.r[0] = n$1 & 8191, this.r[1] = (n$1 >>> 13 | r$1 << 3) & 8191, this.r[2] = (r$1 >>> 10 | o$1 << 6) & 7939, this.r[3] = (o$1 >>> 7 | i$2 << 9) & 8191, this.r[4] = (i$2 >>> 4 | s << 12) & 255, this.r[5] = s >>> 1 & 8190, this.r[6] = (s >>> 14 | c$2 << 2) & 8191, this.r[7] = (c$2 >>> 11 | a$1 << 5) & 8065, this.r[8] = (a$1 >>> 8 | u$2 << 8) & 8191, this.r[9] = u$2 >>> 5 & 127;
		for (let l$2 = 0; l$2 < 8; l$2++) this.pad[l$2] = F$2(e, 16 + 2 * l$2);
	}
	process(e, n$1, r$1 = !1) {
		const o$1 = r$1 ? 0 : 2048, { h: i$2, r: s } = this, c$2 = s[0], a$1 = s[1], u$2 = s[2], l$2 = s[3], f$4 = s[4], h$3 = s[5], y$4 = s[6], E$4 = s[7], p$2 = s[8], d$2 = s[9], v$3 = F$2(e, n$1 + 0), m$1 = F$2(e, n$1 + 2), O$3 = F$2(e, n$1 + 4), N$2 = F$2(e, n$1 + 6), $$3 = F$2(e, n$1 + 8), B$2 = F$2(e, n$1 + 10), A$3 = F$2(e, n$1 + 12), T$1 = F$2(e, n$1 + 14);
		let S$3 = i$2[0] + (v$3 & 8191), L$2 = i$2[1] + ((v$3 >>> 13 | m$1 << 3) & 8191), U$2 = i$2[2] + ((m$1 >>> 10 | O$3 << 6) & 8191), _ = i$2[3] + ((O$3 >>> 7 | N$2 << 9) & 8191), j$1 = i$2[4] + ((N$2 >>> 4 | $$3 << 12) & 8191), g = i$2[5] + ($$3 >>> 1 & 8191), w$1 = i$2[6] + (($$3 >>> 14 | B$2 << 2) & 8191), b$3 = i$2[7] + ((B$2 >>> 11 | A$3 << 5) & 8191), I$2 = i$2[8] + ((A$3 >>> 8 | T$1 << 8) & 8191), R$3 = i$2[9] + (T$1 >>> 5 | o$1), x$1 = 0, C$4 = x$1 + S$3 * c$2 + L$2 * (5 * d$2) + U$2 * (5 * p$2) + _ * (5 * E$4) + j$1 * (5 * y$4);
		x$1 = C$4 >>> 13, C$4 &= 8191, C$4 += g * (5 * h$3) + w$1 * (5 * f$4) + b$3 * (5 * l$2) + I$2 * (5 * u$2) + R$3 * (5 * a$1), x$1 += C$4 >>> 13, C$4 &= 8191;
		let P$2 = x$1 + S$3 * a$1 + L$2 * c$2 + U$2 * (5 * d$2) + _ * (5 * p$2) + j$1 * (5 * E$4);
		x$1 = P$2 >>> 13, P$2 &= 8191, P$2 += g * (5 * y$4) + w$1 * (5 * h$3) + b$3 * (5 * f$4) + I$2 * (5 * l$2) + R$3 * (5 * u$2), x$1 += P$2 >>> 13, P$2 &= 8191;
		let k$4 = x$1 + S$3 * u$2 + L$2 * a$1 + U$2 * c$2 + _ * (5 * d$2) + j$1 * (5 * p$2);
		x$1 = k$4 >>> 13, k$4 &= 8191, k$4 += g * (5 * E$4) + w$1 * (5 * y$4) + b$3 * (5 * h$3) + I$2 * (5 * f$4) + R$3 * (5 * l$2), x$1 += k$4 >>> 13, k$4 &= 8191;
		let M$3 = x$1 + S$3 * l$2 + L$2 * u$2 + U$2 * a$1 + _ * c$2 + j$1 * (5 * d$2);
		x$1 = M$3 >>> 13, M$3 &= 8191, M$3 += g * (5 * p$2) + w$1 * (5 * E$4) + b$3 * (5 * y$4) + I$2 * (5 * h$3) + R$3 * (5 * f$4), x$1 += M$3 >>> 13, M$3 &= 8191;
		let D$1 = x$1 + S$3 * f$4 + L$2 * l$2 + U$2 * u$2 + _ * a$1 + j$1 * c$2;
		x$1 = D$1 >>> 13, D$1 &= 8191, D$1 += g * (5 * d$2) + w$1 * (5 * p$2) + b$3 * (5 * E$4) + I$2 * (5 * y$4) + R$3 * (5 * h$3), x$1 += D$1 >>> 13, D$1 &= 8191;
		let z$1 = x$1 + S$3 * h$3 + L$2 * f$4 + U$2 * l$2 + _ * u$2 + j$1 * a$1;
		x$1 = z$1 >>> 13, z$1 &= 8191, z$1 += g * c$2 + w$1 * (5 * d$2) + b$3 * (5 * p$2) + I$2 * (5 * E$4) + R$3 * (5 * y$4), x$1 += z$1 >>> 13, z$1 &= 8191;
		let Z$1 = x$1 + S$3 * y$4 + L$2 * h$3 + U$2 * f$4 + _ * l$2 + j$1 * u$2;
		x$1 = Z$1 >>> 13, Z$1 &= 8191, Z$1 += g * a$1 + w$1 * c$2 + b$3 * (5 * d$2) + I$2 * (5 * p$2) + R$3 * (5 * E$4), x$1 += Z$1 >>> 13, Z$1 &= 8191;
		let st$1 = x$1 + S$3 * E$4 + L$2 * y$4 + U$2 * h$3 + _ * f$4 + j$1 * l$2;
		x$1 = st$1 >>> 13, st$1 &= 8191, st$1 += g * u$2 + w$1 * a$1 + b$3 * c$2 + I$2 * (5 * d$2) + R$3 * (5 * p$2), x$1 += st$1 >>> 13, st$1 &= 8191;
		let W$2 = x$1 + S$3 * p$2 + L$2 * E$4 + U$2 * y$4 + _ * h$3 + j$1 * f$4;
		x$1 = W$2 >>> 13, W$2 &= 8191, W$2 += g * l$2 + w$1 * u$2 + b$3 * a$1 + I$2 * c$2 + R$3 * (5 * d$2), x$1 += W$2 >>> 13, W$2 &= 8191;
		let J$2 = x$1 + S$3 * d$2 + L$2 * p$2 + U$2 * E$4 + _ * y$4 + j$1 * h$3;
		x$1 = J$2 >>> 13, J$2 &= 8191, J$2 += g * f$4 + w$1 * l$2 + b$3 * u$2 + I$2 * a$1 + R$3 * c$2, x$1 += J$2 >>> 13, J$2 &= 8191, x$1 = (x$1 << 2) + x$1 | 0, x$1 = x$1 + C$4 | 0, C$4 = x$1 & 8191, x$1 = x$1 >>> 13, P$2 += x$1, i$2[0] = C$4, i$2[1] = P$2, i$2[2] = k$4, i$2[3] = M$3, i$2[4] = D$1, i$2[5] = z$1, i$2[6] = Z$1, i$2[7] = st$1, i$2[8] = W$2, i$2[9] = J$2;
	}
	finalize() {
		const { h: e, pad: n$1 } = this, r$1 = new Uint16Array(10);
		let o$1 = e[1] >>> 13;
		e[1] &= 8191;
		for (let c$2 = 2; c$2 < 10; c$2++) e[c$2] += o$1, o$1 = e[c$2] >>> 13, e[c$2] &= 8191;
		e[0] += o$1 * 5, o$1 = e[0] >>> 13, e[0] &= 8191, e[1] += o$1, o$1 = e[1] >>> 13, e[1] &= 8191, e[2] += o$1, r$1[0] = e[0] + 5, o$1 = r$1[0] >>> 13, r$1[0] &= 8191;
		for (let c$2 = 1; c$2 < 10; c$2++) r$1[c$2] = e[c$2] + o$1, o$1 = r$1[c$2] >>> 13, r$1[c$2] &= 8191;
		r$1[9] -= 8192;
		let i$2 = (o$1 ^ 1) - 1;
		for (let c$2 = 0; c$2 < 10; c$2++) r$1[c$2] &= i$2;
		i$2 = ~i$2;
		for (let c$2 = 0; c$2 < 10; c$2++) e[c$2] = e[c$2] & i$2 | r$1[c$2];
		e[0] = (e[0] | e[1] << 13) & 65535, e[1] = (e[1] >>> 3 | e[2] << 10) & 65535, e[2] = (e[2] >>> 6 | e[3] << 7) & 65535, e[3] = (e[3] >>> 9 | e[4] << 4) & 65535, e[4] = (e[4] >>> 12 | e[5] << 1 | e[6] << 14) & 65535, e[5] = (e[6] >>> 2 | e[7] << 11) & 65535, e[6] = (e[7] >>> 5 | e[8] << 8) & 65535, e[7] = (e[8] >>> 8 | e[9] << 5) & 65535;
		let s = e[0] + n$1[0];
		e[0] = s & 65535;
		for (let c$2 = 1; c$2 < 8; c$2++) s = (e[c$2] + n$1[c$2] | 0) + (s >>> 16) | 0, e[c$2] = s & 65535;
		jt$2(r$1);
	}
	update(e) {
		Or$1(this);
		const { buffer: n$1, blockLen: r$1 } = this;
		e = ze$2(e);
		const o$1 = e.length;
		for (let i$2 = 0; i$2 < o$1;) {
			const s = Math.min(r$1 - this.pos, o$1 - i$2);
			if (s === r$1) {
				for (; r$1 <= o$1 - i$2; i$2 += r$1) this.process(e, i$2);
				continue;
			}
			n$1.set(e.subarray(i$2, i$2 + s), this.pos), this.pos += s, i$2 += s, this.pos === r$1 && (this.process(n$1, 0, !1), this.pos = 0);
		}
		return this;
	}
	destroy() {
		jt$2(this.h, this.r, this.buffer, this.pad);
	}
	digestInto(e) {
		Or$1(this), ps$1(e, this), this.finished = !0;
		const { buffer: n$1, h: r$1 } = this;
		let { pos: o$1 } = this;
		if (o$1) {
			for (n$1[o$1++] = 1; o$1 < 16; o$1++) n$1[o$1] = 0;
			this.process(n$1, 0, !0);
		}
		this.finalize();
		let i$2 = 0;
		for (let s = 0; s < 8; s++) e[i$2++] = r$1[s] >>> 0, e[i$2++] = r$1[s] >>> 8;
		return e;
	}
	digest() {
		const { buffer: e, outputLen: n$1 } = this;
		this.digestInto(e);
		const r$1 = e.slice(0, n$1);
		return this.destroy(), r$1;
	}
};
function Ts$1(t) {
	const e = (r$1, o$1) => t(o$1).update(ze$2(r$1)).digest(), n$1 = t(new Uint8Array(32));
	return e.outputLen = n$1.outputLen, e.blockLen = n$1.blockLen, e.create = (r$1) => t(r$1), e;
}
var Rs$1 = Ts$1((t) => new Us(t));
function _s$1(t, e, n$1, r$1, o$1, i$2 = 20) {
	let s = t[0], c$2 = t[1], a$1 = t[2], u$2 = t[3], l$2 = e[0], f$4 = e[1], h$3 = e[2], y$4 = e[3], E$4 = e[4], p$2 = e[5], d$2 = e[6], v$3 = e[7], m$1 = o$1, O$3 = n$1[0], N$2 = n$1[1], $$3 = n$1[2], B$2 = s, A$3 = c$2, T$1 = a$1, S$3 = u$2, L$2 = l$2, U$2 = f$4, _ = h$3, j$1 = y$4, g = E$4, w$1 = p$2, b$3 = d$2, I$2 = v$3, R$3 = m$1, x$1 = O$3, C$4 = N$2, P$2 = $$3;
	for (let M$3 = 0; M$3 < i$2; M$3 += 2) B$2 = B$2 + L$2 | 0, R$3 = V$3(R$3 ^ B$2, 16), g = g + R$3 | 0, L$2 = V$3(L$2 ^ g, 12), B$2 = B$2 + L$2 | 0, R$3 = V$3(R$3 ^ B$2, 8), g = g + R$3 | 0, L$2 = V$3(L$2 ^ g, 7), A$3 = A$3 + U$2 | 0, x$1 = V$3(x$1 ^ A$3, 16), w$1 = w$1 + x$1 | 0, U$2 = V$3(U$2 ^ w$1, 12), A$3 = A$3 + U$2 | 0, x$1 = V$3(x$1 ^ A$3, 8), w$1 = w$1 + x$1 | 0, U$2 = V$3(U$2 ^ w$1, 7), T$1 = T$1 + _ | 0, C$4 = V$3(C$4 ^ T$1, 16), b$3 = b$3 + C$4 | 0, _ = V$3(_ ^ b$3, 12), T$1 = T$1 + _ | 0, C$4 = V$3(C$4 ^ T$1, 8), b$3 = b$3 + C$4 | 0, _ = V$3(_ ^ b$3, 7), S$3 = S$3 + j$1 | 0, P$2 = V$3(P$2 ^ S$3, 16), I$2 = I$2 + P$2 | 0, j$1 = V$3(j$1 ^ I$2, 12), S$3 = S$3 + j$1 | 0, P$2 = V$3(P$2 ^ S$3, 8), I$2 = I$2 + P$2 | 0, j$1 = V$3(j$1 ^ I$2, 7), B$2 = B$2 + U$2 | 0, P$2 = V$3(P$2 ^ B$2, 16), b$3 = b$3 + P$2 | 0, U$2 = V$3(U$2 ^ b$3, 12), B$2 = B$2 + U$2 | 0, P$2 = V$3(P$2 ^ B$2, 8), b$3 = b$3 + P$2 | 0, U$2 = V$3(U$2 ^ b$3, 7), A$3 = A$3 + _ | 0, R$3 = V$3(R$3 ^ A$3, 16), I$2 = I$2 + R$3 | 0, _ = V$3(_ ^ I$2, 12), A$3 = A$3 + _ | 0, R$3 = V$3(R$3 ^ A$3, 8), I$2 = I$2 + R$3 | 0, _ = V$3(_ ^ I$2, 7), T$1 = T$1 + j$1 | 0, x$1 = V$3(x$1 ^ T$1, 16), g = g + x$1 | 0, j$1 = V$3(j$1 ^ g, 12), T$1 = T$1 + j$1 | 0, x$1 = V$3(x$1 ^ T$1, 8), g = g + x$1 | 0, j$1 = V$3(j$1 ^ g, 7), S$3 = S$3 + L$2 | 0, C$4 = V$3(C$4 ^ S$3, 16), w$1 = w$1 + C$4 | 0, L$2 = V$3(L$2 ^ w$1, 12), S$3 = S$3 + L$2 | 0, C$4 = V$3(C$4 ^ S$3, 8), w$1 = w$1 + C$4 | 0, L$2 = V$3(L$2 ^ w$1, 7);
	let k$4 = 0;
	r$1[k$4++] = s + B$2 | 0, r$1[k$4++] = c$2 + A$3 | 0, r$1[k$4++] = a$1 + T$1 | 0, r$1[k$4++] = u$2 + S$3 | 0, r$1[k$4++] = l$2 + L$2 | 0, r$1[k$4++] = f$4 + U$2 | 0, r$1[k$4++] = h$3 + _ | 0, r$1[k$4++] = y$4 + j$1 | 0, r$1[k$4++] = E$4 + g | 0, r$1[k$4++] = p$2 + w$1 | 0, r$1[k$4++] = d$2 + b$3 | 0, r$1[k$4++] = v$3 + I$2 | 0, r$1[k$4++] = m$1 + R$3 | 0, r$1[k$4++] = O$3 + x$1 | 0, r$1[k$4++] = N$2 + C$4 | 0, r$1[k$4++] = $$3 + P$2 | 0;
}
var $s = Ns$1(_s$1, {
	counterRight: !1,
	counterLength: 4,
	allowShortKeys: !1
}), Ls$1 = new Uint8Array(16), Rr$1 = (t, e) => {
	t.update(e);
	const n$1 = e.length % 16;
	n$1 && t.update(Ls$1.subarray(n$1));
}, js = new Uint8Array(32);
function _r$1(t, e, n$1, r$1, o$1) {
	const i$2 = t(e, n$1, js), s = Rs$1.create(i$2);
	o$1 && Rr$1(s, o$1), Rr$1(s, r$1);
	const c$2 = new Uint8Array(16), a$1 = gs(c$2);
	Ir$1(a$1, 0, BigInt(o$1 ? o$1.length : 0), !0), Ir$1(a$1, 8, BigInt(r$1.length), !0), s.update(c$2);
	const u$2 = s.digest();
	return jt$2(i$2, c$2), u$2;
}
var Cs$1 = (t) => (e, n$1, r$1) => ({
	encrypt(i$2, s) {
		const c$2 = i$2.length;
		s = Br$1(c$2 + 16, s, !1), s.set(i$2);
		const a$1 = s.subarray(0, -16);
		t(e, n$1, a$1, a$1, 1);
		const u$2 = _r$1(t, e, n$1, a$1, r$1);
		return s.set(u$2, c$2), jt$2(u$2), s;
	},
	decrypt(i$2, s) {
		s = Br$1(i$2.length - 16, s, !1);
		const c$2 = i$2.subarray(0, -16), a$1 = i$2.subarray(-16), u$2 = _r$1(t, e, n$1, c$2, r$1);
		if (!bs$1(a$1, u$2)) throw new Error("invalid tag");
		return s.set(i$2.subarray(0, -16)), t(e, n$1, s, s, 1), jt$2(u$2), s;
	}
}), $r$1 = Es$1({
	blockSize: 64,
	nonceLength: 12,
	tagLength: 16
}, Cs$1($s));
var Lr$1 = class extends ke$3 {
	constructor(e, n$1) {
		super(), this.finished = !1, this.destroyed = !1, Ce$2(e);
		const r$1 = $t$1(n$1);
		if (this.iHash = e.create(), typeof this.iHash.update != "function") throw new Error("Expected instance of class which extends utils.Hash");
		this.blockLen = this.iHash.blockLen, this.outputLen = this.iHash.outputLen;
		const o$1 = this.blockLen, i$2 = new Uint8Array(o$1);
		i$2.set(r$1.length > o$1 ? e.create().update(r$1).digest() : r$1);
		for (let s = 0; s < i$2.length; s++) i$2[s] ^= 54;
		this.iHash.update(i$2), this.oHash = e.create();
		for (let s = 0; s < i$2.length; s++) i$2[s] ^= 106;
		this.oHash.update(i$2), i$2.fill(0);
	}
	update(e) {
		return Rt$2(this), this.iHash.update(e), this;
	}
	digestInto(e) {
		Rt$2(this), Xt$2(e, this.outputLen), this.finished = !0, this.iHash.digestInto(e), this.oHash.update(e), this.oHash.digestInto(e), this.destroy();
	}
	digest() {
		const e = new Uint8Array(this.oHash.outputLen);
		return this.digestInto(e), e;
	}
	_cloneInto(e) {
		e || (e = Object.create(Object.getPrototypeOf(this), {}));
		const { oHash: n$1, iHash: r$1, finished: o$1, destroyed: i$2, blockLen: s, outputLen: c$2 } = this;
		return e = e, e.finished = o$1, e.destroyed = i$2, e.blockLen = s, e.outputLen = c$2, e.oHash = n$1._cloneInto(e.oHash), e.iHash = r$1._cloneInto(e.iHash), e;
	}
	destroy() {
		this.destroyed = !0, this.oHash.destroy(), this.iHash.destroy();
	}
};
var ye$2 = (t, e, n$1) => new Lr$1(t, e).update(n$1).digest();
ye$2.create = (t, e) => new Lr$1(t, e);
function Ps$1(t, e, n$1) {
	return Ce$2(t), n$1 === void 0 && (n$1 = new Uint8Array(t.outputLen)), ye$2(t, $t$1(n$1), $t$1(e));
}
var Ge$3 = new Uint8Array([0]), jr$1 = new Uint8Array();
function ks$1(t, e, n$1, r$1 = 32) {
	if (Ce$2(t), Wt$2(r$1), r$1 > 255 * t.outputLen) throw new Error("Length should be <= 255*HashLen");
	const o$1 = Math.ceil(r$1 / t.outputLen);
	n$1 === void 0 && (n$1 = jr$1);
	const i$2 = new Uint8Array(o$1 * t.outputLen), s = ye$2.create(t, e), c$2 = s._cloneInto(), a$1 = new Uint8Array(s.outputLen);
	for (let u$2 = 0; u$2 < o$1; u$2++) Ge$3[0] = u$2 + 1, c$2.update(u$2 === 0 ? jr$1 : a$1).update(n$1).update(Ge$3).digestInto(a$1), i$2.set(a$1, t.outputLen * u$2), s._cloneInto(c$2);
	return s.destroy(), c$2.destroy(), a$1.fill(0), Ge$3.fill(0), i$2.slice(0, r$1);
}
var Vs$1 = (t, e, n$1, r$1, o$1) => ks$1(t, Ps$1(t, e, n$1), r$1, o$1);
function Ms$1(t, e, n$1, r$1) {
	if (typeof t.setBigUint64 == "function") return t.setBigUint64(e, n$1, r$1);
	const o$1 = BigInt(32), i$2 = BigInt(4294967295), s = Number(n$1 >> o$1 & i$2), c$2 = Number(n$1 & i$2), a$1 = r$1 ? 4 : 0, u$2 = r$1 ? 0 : 4;
	t.setUint32(e + a$1, s, r$1), t.setUint32(e + u$2, c$2, r$1);
}
function Ds$1(t, e, n$1) {
	return t & e ^ ~t & n$1;
}
function Hs$1(t, e, n$1) {
	return t & e ^ t & n$1 ^ e & n$1;
}
var qs$2 = class extends ke$3 {
	constructor(e, n$1, r$1, o$1) {
		super(), this.blockLen = e, this.outputLen = n$1, this.padOffset = r$1, this.isLE = o$1, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(e), this.view = Pe$2(this.buffer);
	}
	update(e) {
		Rt$2(this);
		const { view: n$1, buffer: r$1, blockLen: o$1 } = this;
		e = $t$1(e);
		const i$2 = e.length;
		for (let s = 0; s < i$2;) {
			const c$2 = Math.min(o$1 - this.pos, i$2 - s);
			if (c$2 === o$1) {
				const a$1 = Pe$2(e);
				for (; o$1 <= i$2 - s; s += o$1) this.process(a$1, s);
				continue;
			}
			r$1.set(e.subarray(s, s + c$2), this.pos), this.pos += c$2, s += c$2, this.pos === o$1 && (this.process(n$1, 0), this.pos = 0);
		}
		return this.length += e.length, this.roundClean(), this;
	}
	digestInto(e) {
		Rt$2(this), Gn$1(e, this), this.finished = !0;
		const { buffer: n$1, view: r$1, blockLen: o$1, isLE: i$2 } = this;
		let { pos: s } = this;
		n$1[s++] = 128, this.buffer.subarray(s).fill(0), this.padOffset > o$1 - s && (this.process(r$1, 0), s = 0);
		for (let f$4 = s; f$4 < o$1; f$4++) n$1[f$4] = 0;
		Ms$1(r$1, o$1 - 8, BigInt(this.length * 8), i$2), this.process(r$1, 0);
		const c$2 = Pe$2(e), a$1 = this.outputLen;
		if (a$1 % 4) throw new Error("_sha2: outputLen should be aligned to 32bit");
		const u$2 = a$1 / 4, l$2 = this.get();
		if (u$2 > l$2.length) throw new Error("_sha2: outputLen bigger than state");
		for (let f$4 = 0; f$4 < u$2; f$4++) c$2.setUint32(4 * f$4, l$2[f$4], i$2);
	}
	digest() {
		const { buffer: e, outputLen: n$1 } = this;
		this.digestInto(e);
		const r$1 = e.slice(0, n$1);
		return this.destroy(), r$1;
	}
	_cloneInto(e) {
		e || (e = new this.constructor()), e.set(...this.get());
		const { blockLen: n$1, buffer: r$1, length: o$1, finished: i$2, destroyed: s, pos: c$2 } = this;
		return e.length = o$1, e.pos = c$2, e.finished = i$2, e.destroyed = s, o$1 % n$1 && e.buffer.set(r$1), e;
	}
};
var Ks = new Uint32Array([
	1116352408,
	1899447441,
	3049323471,
	3921009573,
	961987163,
	1508970993,
	2453635748,
	2870763221,
	3624381080,
	310598401,
	607225278,
	1426881987,
	1925078388,
	2162078206,
	2614888103,
	3248222580,
	3835390401,
	4022224774,
	264347078,
	604807628,
	770255983,
	1249150122,
	1555081692,
	1996064986,
	2554220882,
	2821834349,
	2952996808,
	3210313671,
	3336571891,
	3584528711,
	113926993,
	338241895,
	666307205,
	773529912,
	1294757372,
	1396182291,
	1695183700,
	1986661051,
	2177026350,
	2456956037,
	2730485921,
	2820302411,
	3259730800,
	3345764771,
	3516065817,
	3600352804,
	4094571909,
	275423344,
	430227734,
	506948616,
	659060556,
	883997877,
	958139571,
	1322822218,
	1537002063,
	1747873779,
	1955562222,
	2024104815,
	2227730452,
	2361852424,
	2428436474,
	2756734187,
	3204031479,
	3329325298
]), wt$2 = new Uint32Array([
	1779033703,
	3144134277,
	1013904242,
	2773480762,
	1359893119,
	2600822924,
	528734635,
	1541459225
]), bt$1 = new Uint32Array(64);
var Fs = class extends qs$2 {
	constructor() {
		super(64, 32, 8, !1), this.A = wt$2[0] | 0, this.B = wt$2[1] | 0, this.C = wt$2[2] | 0, this.D = wt$2[3] | 0, this.E = wt$2[4] | 0, this.F = wt$2[5] | 0, this.G = wt$2[6] | 0, this.H = wt$2[7] | 0;
	}
	get() {
		const { A: e, B: n$1, C: r$1, D: o$1, E: i$2, F: s, G: c$2, H: a$1 } = this;
		return [
			e,
			n$1,
			r$1,
			o$1,
			i$2,
			s,
			c$2,
			a$1
		];
	}
	set(e, n$1, r$1, o$1, i$2, s, c$2, a$1) {
		this.A = e | 0, this.B = n$1 | 0, this.C = r$1 | 0, this.D = o$1 | 0, this.E = i$2 | 0, this.F = s | 0, this.G = c$2 | 0, this.H = a$1 | 0;
	}
	process(e, n$1) {
		for (let f$4 = 0; f$4 < 16; f$4++, n$1 += 4) bt$1[f$4] = e.getUint32(n$1, !1);
		for (let f$4 = 16; f$4 < 64; f$4++) {
			const h$3 = bt$1[f$4 - 15], y$4 = bt$1[f$4 - 2], E$4 = ct$1(h$3, 7) ^ ct$1(h$3, 18) ^ h$3 >>> 3;
			bt$1[f$4] = (ct$1(y$4, 17) ^ ct$1(y$4, 19) ^ y$4 >>> 10) + bt$1[f$4 - 7] + E$4 + bt$1[f$4 - 16] | 0;
		}
		let { A: r$1, B: o$1, C: i$2, D: s, E: c$2, F: a$1, G: u$2, H: l$2 } = this;
		for (let f$4 = 0; f$4 < 64; f$4++) {
			const h$3 = ct$1(c$2, 6) ^ ct$1(c$2, 11) ^ ct$1(c$2, 25), y$4 = l$2 + h$3 + Ds$1(c$2, a$1, u$2) + Ks[f$4] + bt$1[f$4] | 0, p$2 = (ct$1(r$1, 2) ^ ct$1(r$1, 13) ^ ct$1(r$1, 22)) + Hs$1(r$1, o$1, i$2) | 0;
			l$2 = u$2, u$2 = a$1, a$1 = c$2, c$2 = s + y$4 | 0, s = i$2, i$2 = o$1, o$1 = r$1, r$1 = y$4 + p$2 | 0;
		}
		r$1 = r$1 + this.A | 0, o$1 = o$1 + this.B | 0, i$2 = i$2 + this.C | 0, s = s + this.D | 0, c$2 = c$2 + this.E | 0, a$1 = a$1 + this.F | 0, u$2 = u$2 + this.G | 0, l$2 = l$2 + this.H | 0, this.set(r$1, o$1, i$2, s, c$2, a$1, u$2, l$2);
	}
	roundClean() {
		bt$1.fill(0);
	}
	destroy() {
		this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
	}
};
var Qt$2 = Qn$1(() => new Fs());
/*! noble-curves - MIT License (c) 2022 Paul Miller (paulmillr.com) */ var me$2 = BigInt(0), we$2 = BigInt(1), zs = BigInt(2);
function St$3(t) {
	return t instanceof Uint8Array || ArrayBuffer.isView(t) && t.constructor.name === "Uint8Array";
}
function te$1(t) {
	if (!St$3(t)) throw new Error("Uint8Array expected");
}
function Ct$1(t, e) {
	if (typeof e != "boolean") throw new Error(t + " boolean expected, got " + e);
}
var Zs$1 = Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function Pt$2(t) {
	te$1(t);
	let e = "";
	for (let n$1 = 0; n$1 < t.length; n$1++) e += Zs$1[t[n$1]];
	return e;
}
function kt$3(t) {
	const e = t.toString(16);
	return e.length & 1 ? "0" + e : e;
}
function We$3(t) {
	if (typeof t != "string") throw new Error("hex string expected, got " + typeof t);
	return t === "" ? me$2 : BigInt("0x" + t);
}
var ut$2 = {
	_0: 48,
	_9: 57,
	A: 65,
	F: 70,
	a: 97,
	f: 102
};
function Cr$1(t) {
	if (t >= ut$2._0 && t <= ut$2._9) return t - ut$2._0;
	if (t >= ut$2.A && t <= ut$2.F) return t - (ut$2.A - 10);
	if (t >= ut$2.a && t <= ut$2.f) return t - (ut$2.a - 10);
}
function Vt$2(t) {
	if (typeof t != "string") throw new Error("hex string expected, got " + typeof t);
	const e = t.length, n$1 = e / 2;
	if (e % 2) throw new Error("hex string expected, got unpadded hex of length " + e);
	const r$1 = new Uint8Array(n$1);
	for (let o$1 = 0, i$2 = 0; o$1 < n$1; o$1++, i$2 += 2) {
		const s = Cr$1(t.charCodeAt(i$2)), c$2 = Cr$1(t.charCodeAt(i$2 + 1));
		if (s === void 0 || c$2 === void 0) {
			const a$1 = t[i$2] + t[i$2 + 1];
			throw new Error("hex string expected, got non-hex character \"" + a$1 + "\" at index " + i$2);
		}
		r$1[o$1] = s * 16 + c$2;
	}
	return r$1;
}
function Ot$2(t) {
	return We$3(Pt$2(t));
}
function ee$2(t) {
	return te$1(t), We$3(Pt$2(Uint8Array.from(t).reverse()));
}
function Mt$2(t, e) {
	return Vt$2(t.toString(16).padStart(e * 2, "0"));
}
function be$2(t, e) {
	return Mt$2(t, e).reverse();
}
function Ys$1(t) {
	return Vt$2(kt$3(t));
}
function et$1(t, e, n$1) {
	let r$1;
	if (typeof e == "string") try {
		r$1 = Vt$2(e);
	} catch (i$2) {
		throw new Error(t + " must be hex string or Uint8Array, cause: " + i$2);
	}
	else if (St$3(e)) r$1 = Uint8Array.from(e);
	else throw new Error(t + " must be hex string or Uint8Array");
	const o$1 = r$1.length;
	if (typeof n$1 == "number" && o$1 !== n$1) throw new Error(t + " of length " + n$1 + " expected, got " + o$1);
	return r$1;
}
function ne$2(...t) {
	let e = 0;
	for (let r$1 = 0; r$1 < t.length; r$1++) {
		const o$1 = t[r$1];
		te$1(o$1), e += o$1.length;
	}
	const n$1 = new Uint8Array(e);
	for (let r$1 = 0, o$1 = 0; r$1 < t.length; r$1++) {
		const i$2 = t[r$1];
		n$1.set(i$2, o$1), o$1 += i$2.length;
	}
	return n$1;
}
function Gs$1(t, e) {
	if (t.length !== e.length) return !1;
	let n$1 = 0;
	for (let r$1 = 0; r$1 < t.length; r$1++) n$1 |= t[r$1] ^ e[r$1];
	return n$1 === 0;
}
function Ws$1(t) {
	if (typeof t != "string") throw new Error("string expected");
	return new Uint8Array(new TextEncoder().encode(t));
}
var Xe$2 = (t) => typeof t == "bigint" && me$2 <= t;
function Ee$3(t, e, n$1) {
	return Xe$2(t) && Xe$2(e) && Xe$2(n$1) && e <= t && t < n$1;
}
function ft$2(t, e, n$1, r$1) {
	if (!Ee$3(e, n$1, r$1)) throw new Error("expected valid " + t + ": " + n$1 + " <= n < " + r$1 + ", got " + e);
}
function Pr$1(t) {
	let e;
	for (e = 0; t > me$2; t >>= we$2, e += 1);
	return e;
}
function Xs$1(t, e) {
	return t >> BigInt(e) & we$2;
}
function Js$1(t, e, n$1) {
	return t | (n$1 ? we$2 : me$2) << BigInt(e);
}
var Je$2 = (t) => (zs << BigInt(t - 1)) - we$2, Qe$2 = (t) => new Uint8Array(t), kr$1 = (t) => Uint8Array.from(t);
function Vr$1(t, e, n$1) {
	if (typeof t != "number" || t < 2) throw new Error("hashLen must be a number");
	if (typeof e != "number" || e < 2) throw new Error("qByteLen must be a number");
	if (typeof n$1 != "function") throw new Error("hmacFn must be a function");
	let r$1 = Qe$2(t), o$1 = Qe$2(t), i$2 = 0;
	const s = () => {
		r$1.fill(1), o$1.fill(0), i$2 = 0;
	}, c$2 = (...f$4) => n$1(o$1, r$1, ...f$4), a$1 = (f$4 = Qe$2()) => {
		o$1 = c$2(kr$1([0]), f$4), r$1 = c$2(), f$4.length !== 0 && (o$1 = c$2(kr$1([1]), f$4), r$1 = c$2());
	}, u$2 = () => {
		if (i$2++ >= 1e3) throw new Error("drbg: tried 1000 values");
		let f$4 = 0;
		const h$3 = [];
		for (; f$4 < e;) {
			r$1 = c$2();
			const y$4 = r$1.slice();
			h$3.push(y$4), f$4 += r$1.length;
		}
		return ne$2(...h$3);
	};
	return (f$4, h$3) => {
		s(), a$1(f$4);
		let y$4;
		for (; !(y$4 = h$3(u$2()));) a$1();
		return s(), y$4;
	};
}
var Qs$1 = {
	bigint: (t) => typeof t == "bigint",
	function: (t) => typeof t == "function",
	boolean: (t) => typeof t == "boolean",
	string: (t) => typeof t == "string",
	stringOrUint8Array: (t) => typeof t == "string" || St$3(t),
	isSafeInteger: (t) => Number.isSafeInteger(t),
	array: (t) => Array.isArray(t),
	field: (t, e) => e.Fp.isValid(t),
	hash: (t) => typeof t == "function" && Number.isSafeInteger(t.outputLen)
};
function Dt$1(t, e, n$1 = {}) {
	const r$1 = (o$1, i$2, s) => {
		const c$2 = Qs$1[i$2];
		if (typeof c$2 != "function") throw new Error("invalid validator function");
		const a$1 = t[o$1];
		if (!(s && a$1 === void 0) && !c$2(a$1, t)) throw new Error("param " + String(o$1) + " is invalid. Expected " + i$2 + ", got " + a$1);
	};
	for (const [o$1, i$2] of Object.entries(e)) r$1(o$1, i$2, !1);
	for (const [o$1, i$2] of Object.entries(n$1)) r$1(o$1, i$2, !0);
	return t;
}
var tc = () => {
	throw new Error("not implemented");
};
function tn$1(t) {
	const e = /* @__PURE__ */ new WeakMap();
	return (n$1, ...r$1) => {
		const o$1 = e.get(n$1);
		if (o$1 !== void 0) return o$1;
		const i$2 = t(n$1, ...r$1);
		return e.set(n$1, i$2), i$2;
	};
}
var ec = Object.freeze({
	__proto__: null,
	isBytes: St$3,
	abytes: te$1,
	abool: Ct$1,
	bytesToHex: Pt$2,
	numberToHexUnpadded: kt$3,
	hexToNumber: We$3,
	hexToBytes: Vt$2,
	bytesToNumberBE: Ot$2,
	bytesToNumberLE: ee$2,
	numberToBytesBE: Mt$2,
	numberToBytesLE: be$2,
	numberToVarBytesBE: Ys$1,
	ensureBytes: et$1,
	concatBytes: ne$2,
	equalBytes: Gs$1,
	utf8ToBytes: Ws$1,
	inRange: Ee$3,
	aInRange: ft$2,
	bitLen: Pr$1,
	bitGet: Xs$1,
	bitSet: Js$1,
	bitMask: Je$2,
	createHmacDrbg: Vr$1,
	validateObject: Dt$1,
	notImplemented: tc,
	memoized: tn$1
});
var q$1 = BigInt(0), H$1 = BigInt(1), At$2 = BigInt(2), nc = BigInt(3), en$1 = BigInt(4), Mr$1 = BigInt(5), Dr$1 = BigInt(8);
function X$1(t, e) {
	const n$1 = t % e;
	return n$1 >= q$1 ? n$1 : e + n$1;
}
function Hr$1(t, e, n$1) {
	if (e < q$1) throw new Error("invalid exponent, negatives unsupported");
	if (n$1 <= q$1) throw new Error("invalid modulus");
	if (n$1 === H$1) return q$1;
	let r$1 = H$1;
	for (; e > q$1;) e & H$1 && (r$1 = r$1 * t % n$1), t = t * t % n$1, e >>= H$1;
	return r$1;
}
function it$2(t, e, n$1) {
	let r$1 = t;
	for (; e-- > q$1;) r$1 *= r$1, r$1 %= n$1;
	return r$1;
}
function nn$1(t, e) {
	if (t === q$1) throw new Error("invert: expected non-zero number");
	if (e <= q$1) throw new Error("invert: expected positive modulus, got " + e);
	let n$1 = X$1(t, e), r$1 = e, o$1 = q$1, i$2 = H$1;
	for (; n$1 !== q$1;) {
		const c$2 = r$1 / n$1, a$1 = r$1 % n$1, u$2 = o$1 - i$2 * c$2;
		r$1 = n$1, n$1 = a$1, o$1 = i$2, i$2 = u$2;
	}
	if (r$1 !== H$1) throw new Error("invert: does not exist");
	return X$1(o$1, e);
}
function rc(t) {
	const e = (t - H$1) / At$2;
	let n$1, r$1, o$1;
	for (n$1 = t - H$1, r$1 = 0; n$1 % At$2 === q$1; n$1 /= At$2, r$1++);
	for (o$1 = At$2; o$1 < t && Hr$1(o$1, e, t) !== t - H$1; o$1++) if (o$1 > 1e3) throw new Error("Cannot find square root: likely non-prime P");
	if (r$1 === 1) {
		const s = (t + H$1) / en$1;
		return function(a$1, u$2) {
			const l$2 = a$1.pow(u$2, s);
			if (!a$1.eql(a$1.sqr(l$2), u$2)) throw new Error("Cannot find square root");
			return l$2;
		};
	}
	const i$2 = (n$1 + H$1) / At$2;
	return function(c$2, a$1) {
		if (c$2.pow(a$1, e) === c$2.neg(c$2.ONE)) throw new Error("Cannot find square root");
		let u$2 = r$1, l$2 = c$2.pow(c$2.mul(c$2.ONE, o$1), n$1), f$4 = c$2.pow(a$1, i$2), h$3 = c$2.pow(a$1, n$1);
		for (; !c$2.eql(h$3, c$2.ONE);) {
			if (c$2.eql(h$3, c$2.ZERO)) return c$2.ZERO;
			let y$4 = 1;
			for (let p$2 = c$2.sqr(h$3); y$4 < u$2 && !c$2.eql(p$2, c$2.ONE); y$4++) p$2 = c$2.sqr(p$2);
			const E$4 = c$2.pow(l$2, H$1 << BigInt(u$2 - y$4 - 1));
			l$2 = c$2.sqr(E$4), f$4 = c$2.mul(f$4, E$4), h$3 = c$2.mul(h$3, l$2), u$2 = y$4;
		}
		return f$4;
	};
}
function oc(t) {
	if (t % en$1 === nc) {
		const e = (t + H$1) / en$1;
		return function(r$1, o$1) {
			const i$2 = r$1.pow(o$1, e);
			if (!r$1.eql(r$1.sqr(i$2), o$1)) throw new Error("Cannot find square root");
			return i$2;
		};
	}
	if (t % Dr$1 === Mr$1) {
		const e = (t - Mr$1) / Dr$1;
		return function(r$1, o$1) {
			const i$2 = r$1.mul(o$1, At$2), s = r$1.pow(i$2, e), c$2 = r$1.mul(o$1, s), a$1 = r$1.mul(r$1.mul(c$2, At$2), s), u$2 = r$1.mul(c$2, r$1.sub(a$1, r$1.ONE));
			if (!r$1.eql(r$1.sqr(u$2), o$1)) throw new Error("Cannot find square root");
			return u$2;
		};
	}
	return rc(t);
}
var ic = [
	"create",
	"isValid",
	"is0",
	"neg",
	"inv",
	"sqrt",
	"sqr",
	"eql",
	"add",
	"sub",
	"mul",
	"pow",
	"div",
	"addN",
	"subN",
	"mulN",
	"sqrN"
];
function sc(t) {
	const e = {
		ORDER: "bigint",
		MASK: "bigint",
		BYTES: "isSafeInteger",
		BITS: "isSafeInteger"
	}, n$1 = ic.reduce((r$1, o$1) => (r$1[o$1] = "function", r$1), e);
	return Dt$1(t, n$1);
}
function cc(t, e, n$1) {
	if (n$1 < q$1) throw new Error("invalid exponent, negatives unsupported");
	if (n$1 === q$1) return t.ONE;
	if (n$1 === H$1) return e;
	let r$1 = t.ONE, o$1 = e;
	for (; n$1 > q$1;) n$1 & H$1 && (r$1 = t.mul(r$1, o$1)), o$1 = t.sqr(o$1), n$1 >>= H$1;
	return r$1;
}
function ac(t, e) {
	const n$1 = new Array(e.length), r$1 = e.reduce((i$2, s, c$2) => t.is0(s) ? i$2 : (n$1[c$2] = i$2, t.mul(i$2, s)), t.ONE), o$1 = t.inv(r$1);
	return e.reduceRight((i$2, s, c$2) => t.is0(s) ? i$2 : (n$1[c$2] = t.mul(i$2, n$1[c$2]), t.mul(i$2, s)), o$1), n$1;
}
function qr$1(t, e) {
	const n$1 = e !== void 0 ? e : t.toString(2).length, r$1 = Math.ceil(n$1 / 8);
	return {
		nBitLength: n$1,
		nByteLength: r$1
	};
}
function Kr$1(t, e, n$1 = !1, r$1 = {}) {
	if (t <= q$1) throw new Error("invalid field: expected ORDER > 0, got " + t);
	const { nBitLength: o$1, nByteLength: i$2 } = qr$1(t, e);
	if (i$2 > 2048) throw new Error("invalid field: expected ORDER of <= 2048 bytes");
	let s;
	const c$2 = Object.freeze({
		ORDER: t,
		isLE: n$1,
		BITS: o$1,
		BYTES: i$2,
		MASK: Je$2(o$1),
		ZERO: q$1,
		ONE: H$1,
		create: (a$1) => X$1(a$1, t),
		isValid: (a$1) => {
			if (typeof a$1 != "bigint") throw new Error("invalid field element: expected bigint, got " + typeof a$1);
			return q$1 <= a$1 && a$1 < t;
		},
		is0: (a$1) => a$1 === q$1,
		isOdd: (a$1) => (a$1 & H$1) === H$1,
		neg: (a$1) => X$1(-a$1, t),
		eql: (a$1, u$2) => a$1 === u$2,
		sqr: (a$1) => X$1(a$1 * a$1, t),
		add: (a$1, u$2) => X$1(a$1 + u$2, t),
		sub: (a$1, u$2) => X$1(a$1 - u$2, t),
		mul: (a$1, u$2) => X$1(a$1 * u$2, t),
		pow: (a$1, u$2) => cc(c$2, a$1, u$2),
		div: (a$1, u$2) => X$1(a$1 * nn$1(u$2, t), t),
		sqrN: (a$1) => a$1 * a$1,
		addN: (a$1, u$2) => a$1 + u$2,
		subN: (a$1, u$2) => a$1 - u$2,
		mulN: (a$1, u$2) => a$1 * u$2,
		inv: (a$1) => nn$1(a$1, t),
		sqrt: r$1.sqrt || ((a$1) => (s || (s = oc(t)), s(c$2, a$1))),
		invertBatch: (a$1) => ac(c$2, a$1),
		cmov: (a$1, u$2, l$2) => l$2 ? u$2 : a$1,
		toBytes: (a$1) => n$1 ? be$2(a$1, i$2) : Mt$2(a$1, i$2),
		fromBytes: (a$1) => {
			if (a$1.length !== i$2) throw new Error("Field.fromBytes: expected " + i$2 + " bytes, got " + a$1.length);
			return n$1 ? ee$2(a$1) : Ot$2(a$1);
		}
	});
	return Object.freeze(c$2);
}
function Fr$1(t) {
	if (typeof t != "bigint") throw new Error("field order must be bigint");
	const e = t.toString(2).length;
	return Math.ceil(e / 8);
}
function zr$1(t) {
	const e = Fr$1(t);
	return e + Math.ceil(e / 2);
}
function uc(t, e, n$1 = !1) {
	const r$1 = t.length, o$1 = Fr$1(e), i$2 = zr$1(e);
	if (r$1 < 16 || r$1 < i$2 || r$1 > 1024) throw new Error("expected " + i$2 + "-1024 bytes of input, got " + r$1);
	const s = n$1 ? ee$2(t) : Ot$2(t), c$2 = X$1(s, e - H$1) + H$1;
	return n$1 ? be$2(c$2, o$1) : Mt$2(c$2, o$1);
}
var Zr$1 = BigInt(0), ve$1 = BigInt(1);
function rn$1(t, e) {
	const n$1 = e.negate();
	return t ? n$1 : e;
}
function Yr$1(t, e) {
	if (!Number.isSafeInteger(t) || t <= 0 || t > e) throw new Error("invalid window size, expected [1.." + e + "], got W=" + t);
}
function on$1(t, e) {
	Yr$1(t, e);
	const n$1 = Math.ceil(e / t) + 1, r$1 = 2 ** (t - 1);
	return {
		windows: n$1,
		windowSize: r$1
	};
}
function fc(t, e) {
	if (!Array.isArray(t)) throw new Error("array expected");
	t.forEach((n$1, r$1) => {
		if (!(n$1 instanceof e)) throw new Error("invalid point at index " + r$1);
	});
}
function lc(t, e) {
	if (!Array.isArray(t)) throw new Error("array of scalars expected");
	t.forEach((n$1, r$1) => {
		if (!e.isValid(n$1)) throw new Error("invalid scalar at index " + r$1);
	});
}
var sn$2 = /* @__PURE__ */ new WeakMap(), Gr$1 = /* @__PURE__ */ new WeakMap();
function cn$1(t) {
	return Gr$1.get(t) || 1;
}
function dc(t, e) {
	return {
		constTimeNegate: rn$1,
		hasPrecomputes(n$1) {
			return cn$1(n$1) !== 1;
		},
		unsafeLadder(n$1, r$1, o$1 = t.ZERO) {
			let i$2 = n$1;
			for (; r$1 > Zr$1;) r$1 & ve$1 && (o$1 = o$1.add(i$2)), i$2 = i$2.double(), r$1 >>= ve$1;
			return o$1;
		},
		precomputeWindow(n$1, r$1) {
			const { windows: o$1, windowSize: i$2 } = on$1(r$1, e), s = [];
			let c$2 = n$1, a$1 = c$2;
			for (let u$2 = 0; u$2 < o$1; u$2++) {
				a$1 = c$2, s.push(a$1);
				for (let l$2 = 1; l$2 < i$2; l$2++) a$1 = a$1.add(c$2), s.push(a$1);
				c$2 = a$1.double();
			}
			return s;
		},
		wNAF(n$1, r$1, o$1) {
			const { windows: i$2, windowSize: s } = on$1(n$1, e);
			let c$2 = t.ZERO, a$1 = t.BASE;
			const u$2 = BigInt(2 ** n$1 - 1), l$2 = 2 ** n$1, f$4 = BigInt(n$1);
			for (let h$3 = 0; h$3 < i$2; h$3++) {
				const y$4 = h$3 * s;
				let E$4 = Number(o$1 & u$2);
				o$1 >>= f$4, E$4 > s && (E$4 -= l$2, o$1 += ve$1);
				const p$2 = y$4, d$2 = y$4 + Math.abs(E$4) - 1, v$3 = h$3 % 2 !== 0, m$1 = E$4 < 0;
				E$4 === 0 ? a$1 = a$1.add(rn$1(v$3, r$1[p$2])) : c$2 = c$2.add(rn$1(m$1, r$1[d$2]));
			}
			return {
				p: c$2,
				f: a$1
			};
		},
		wNAFUnsafe(n$1, r$1, o$1, i$2 = t.ZERO) {
			const { windows: s, windowSize: c$2 } = on$1(n$1, e), a$1 = BigInt(2 ** n$1 - 1), u$2 = 2 ** n$1, l$2 = BigInt(n$1);
			for (let f$4 = 0; f$4 < s; f$4++) {
				const h$3 = f$4 * c$2;
				if (o$1 === Zr$1) break;
				let y$4 = Number(o$1 & a$1);
				if (o$1 >>= l$2, y$4 > c$2 && (y$4 -= u$2, o$1 += ve$1), y$4 === 0) continue;
				let E$4 = r$1[h$3 + Math.abs(y$4) - 1];
				y$4 < 0 && (E$4 = E$4.negate()), i$2 = i$2.add(E$4);
			}
			return i$2;
		},
		getPrecomputes(n$1, r$1, o$1) {
			let i$2 = sn$2.get(r$1);
			return i$2 || (i$2 = this.precomputeWindow(r$1, n$1), n$1 !== 1 && sn$2.set(r$1, o$1(i$2))), i$2;
		},
		wNAFCached(n$1, r$1, o$1) {
			const i$2 = cn$1(n$1);
			return this.wNAF(i$2, this.getPrecomputes(i$2, n$1, o$1), r$1);
		},
		wNAFCachedUnsafe(n$1, r$1, o$1, i$2) {
			const s = cn$1(n$1);
			return s === 1 ? this.unsafeLadder(n$1, r$1, i$2) : this.wNAFUnsafe(s, this.getPrecomputes(s, n$1, o$1), r$1, i$2);
		},
		setWindowSize(n$1, r$1) {
			Yr$1(r$1, e), Gr$1.set(n$1, r$1), sn$2.delete(n$1);
		}
	};
}
function hc(t, e, n$1, r$1) {
	if (fc(n$1, t), lc(r$1, e), n$1.length !== r$1.length) throw new Error("arrays of points and scalars must have equal length");
	const o$1 = t.ZERO, i$2 = Pr$1(BigInt(n$1.length)), s = i$2 > 12 ? i$2 - 3 : i$2 > 4 ? i$2 - 2 : i$2 ? 2 : 1, c$2 = (1 << s) - 1, a$1 = new Array(c$2 + 1).fill(o$1), u$2 = Math.floor((e.BITS - 1) / s) * s;
	let l$2 = o$1;
	for (let f$4 = u$2; f$4 >= 0; f$4 -= s) {
		a$1.fill(o$1);
		for (let y$4 = 0; y$4 < r$1.length; y$4++) {
			const E$4 = r$1[y$4], p$2 = Number(E$4 >> BigInt(f$4) & BigInt(c$2));
			a$1[p$2] = a$1[p$2].add(n$1[y$4]);
		}
		let h$3 = o$1;
		for (let y$4 = a$1.length - 1, E$4 = o$1; y$4 > 0; y$4--) E$4 = E$4.add(a$1[y$4]), h$3 = h$3.add(E$4);
		if (l$2 = l$2.add(h$3), f$4 !== 0) for (let y$4 = 0; y$4 < s; y$4++) l$2 = l$2.double();
	}
	return l$2;
}
function Wr$1(t) {
	return sc(t.Fp), Dt$1(t, {
		n: "bigint",
		h: "bigint",
		Gx: "field",
		Gy: "field"
	}, {
		nBitLength: "isSafeInteger",
		nByteLength: "isSafeInteger"
	}), Object.freeze({
		...qr$1(t.n, t.nBitLength),
		...t,
		p: t.Fp.ORDER
	});
}
BigInt(0), BigInt(1), BigInt(2), BigInt(8);
var Ht$1 = BigInt(0), an$1 = BigInt(1);
function pc(t) {
	return Dt$1(t, { a: "bigint" }, {
		montgomeryBits: "isSafeInteger",
		nByteLength: "isSafeInteger",
		adjustScalarBytes: "function",
		domain: "function",
		powPminus2: "function",
		Gu: "bigint"
	}), Object.freeze({ ...t });
}
function gc(t) {
	const e = pc(t), { P: n$1 } = e, r$1 = (m$1) => X$1(m$1, n$1), o$1 = e.montgomeryBits, i$2 = Math.ceil(o$1 / 8), s = e.nByteLength, c$2 = e.adjustScalarBytes || ((m$1) => m$1), a$1 = e.powPminus2 || ((m$1) => Hr$1(m$1, n$1 - BigInt(2), n$1));
	function u$2(m$1, O$3, N$2) {
		const $$3 = r$1(m$1 * (O$3 - N$2));
		return O$3 = r$1(O$3 - $$3), N$2 = r$1(N$2 + $$3), [O$3, N$2];
	}
	const l$2 = (e.a - BigInt(2)) / BigInt(4);
	function f$4(m$1, O$3) {
		ft$2("u", m$1, Ht$1, n$1), ft$2("scalar", O$3, Ht$1, n$1);
		const N$2 = O$3, $$3 = m$1;
		let B$2 = an$1, A$3 = Ht$1, T$1 = m$1, S$3 = an$1, L$2 = Ht$1, U$2;
		for (let j$1 = BigInt(o$1 - 1); j$1 >= Ht$1; j$1--) {
			const g = N$2 >> j$1 & an$1;
			L$2 ^= g, U$2 = u$2(L$2, B$2, T$1), B$2 = U$2[0], T$1 = U$2[1], U$2 = u$2(L$2, A$3, S$3), A$3 = U$2[0], S$3 = U$2[1], L$2 = g;
			const w$1 = B$2 + A$3, b$3 = r$1(w$1 * w$1), I$2 = B$2 - A$3, R$3 = r$1(I$2 * I$2), x$1 = b$3 - R$3, C$4 = T$1 + S$3, P$2 = T$1 - S$3, k$4 = r$1(P$2 * w$1), M$3 = r$1(C$4 * I$2), D$1 = k$4 + M$3, z$1 = k$4 - M$3;
			T$1 = r$1(D$1 * D$1), S$3 = r$1($$3 * r$1(z$1 * z$1)), B$2 = r$1(b$3 * R$3), A$3 = r$1(x$1 * (b$3 + r$1(l$2 * x$1)));
		}
		U$2 = u$2(L$2, B$2, T$1), B$2 = U$2[0], T$1 = U$2[1], U$2 = u$2(L$2, A$3, S$3), A$3 = U$2[0], S$3 = U$2[1];
		const _ = a$1(A$3);
		return r$1(B$2 * _);
	}
	function h$3(m$1) {
		return be$2(r$1(m$1), i$2);
	}
	function y$4(m$1) {
		const O$3 = et$1("u coordinate", m$1, i$2);
		return s === 32 && (O$3[31] &= 127), ee$2(O$3);
	}
	function E$4(m$1) {
		const O$3 = et$1("scalar", m$1), N$2 = O$3.length;
		if (N$2 !== i$2 && N$2 !== s) {
			let $$3 = "" + i$2 + " or " + s;
			throw new Error("invalid scalar, expected " + $$3 + " bytes, got " + N$2);
		}
		return ee$2(c$2(O$3));
	}
	function p$2(m$1, O$3) {
		const N$2 = y$4(O$3), $$3 = E$4(m$1), B$2 = f$4(N$2, $$3);
		if (B$2 === Ht$1) throw new Error("invalid private or public key received");
		return h$3(B$2);
	}
	const d$2 = h$3(e.Gu);
	function v$3(m$1) {
		return p$2(m$1, d$2);
	}
	return {
		scalarMult: p$2,
		scalarMultBase: v$3,
		getSharedSecret: (m$1, O$3) => p$2(m$1, O$3),
		getPublicKey: (m$1) => v$3(m$1),
		utils: { randomPrivateKey: () => e.randomBytes(e.nByteLength) },
		GuBytes: d$2
	};
}
var un$1 = BigInt("57896044618658097711785492504343953926634992332820282019728792003956564819949");
BigInt(0);
var yc = BigInt(1), Xr$1 = BigInt(2), mc = BigInt(3), wc = BigInt(5);
BigInt(8);
function bc(t) {
	const e = BigInt(10), n$1 = BigInt(20), r$1 = BigInt(40), o$1 = BigInt(80), i$2 = un$1, c$2 = t * t % i$2 * t % i$2, a$1 = it$2(c$2, Xr$1, i$2) * c$2 % i$2, u$2 = it$2(a$1, yc, i$2) * t % i$2, l$2 = it$2(u$2, wc, i$2) * u$2 % i$2, f$4 = it$2(l$2, e, i$2) * l$2 % i$2, h$3 = it$2(f$4, n$1, i$2) * f$4 % i$2, y$4 = it$2(h$3, r$1, i$2) * h$3 % i$2, E$4 = it$2(y$4, o$1, i$2) * y$4 % i$2, p$2 = it$2(E$4, o$1, i$2) * y$4 % i$2, d$2 = it$2(p$2, e, i$2) * l$2 % i$2;
	return {
		pow_p_5_8: it$2(d$2, Xr$1, i$2) * t % i$2,
		b2: c$2
	};
}
function Ec(t) {
	return t[0] &= 248, t[31] &= 127, t[31] |= 64, t;
}
var fn$1 = gc({
	P: un$1,
	a: BigInt(486662),
	montgomeryBits: 255,
	nByteLength: 32,
	Gu: BigInt(9),
	powPminus2: (t) => {
		const e = un$1, { pow_p_5_8: n$1, b2: r$1 } = bc(t);
		return X$1(it$2(n$1, mc, e) * r$1, e);
	},
	adjustScalarBytes: Ec,
	randomBytes: Lt$2
});
function Jr$1(t) {
	t.lowS !== void 0 && Ct$1("lowS", t.lowS), t.prehash !== void 0 && Ct$1("prehash", t.prehash);
}
function vc(t) {
	const e = Wr$1(t);
	Dt$1(e, {
		a: "field",
		b: "field"
	}, {
		allowedPrivateKeyLengths: "array",
		wrapPrivateKey: "boolean",
		isTorsionFree: "function",
		clearCofactor: "function",
		allowInfinityPoint: "boolean",
		fromBytes: "function",
		toBytes: "function"
	});
	const { endo: n$1, Fp: r$1, a: o$1 } = e;
	if (n$1) {
		if (!r$1.eql(o$1, r$1.ZERO)) throw new Error("invalid endomorphism, can only be defined for Koblitz curves that have a=0");
		if (typeof n$1 != "object" || typeof n$1.beta != "bigint" || typeof n$1.splitScalar != "function") throw new Error("invalid endomorphism, expected beta: bigint and splitScalar: function");
	}
	return Object.freeze({ ...e });
}
var { bytesToNumberBE: xc, hexToBytes: Sc } = ec;
var Oc = class extends Error {
	constructor(e = "") {
		super(e);
	}
};
var lt$1 = {
	Err: Oc,
	_tlv: {
		encode: (t, e) => {
			const { Err: n$1 } = lt$1;
			if (t < 0 || t > 256) throw new n$1("tlv.encode: wrong tag");
			if (e.length & 1) throw new n$1("tlv.encode: unpadded data");
			const r$1 = e.length / 2, o$1 = kt$3(r$1);
			if (o$1.length / 2 & 128) throw new n$1("tlv.encode: long form length too big");
			const i$2 = r$1 > 127 ? kt$3(o$1.length / 2 | 128) : "";
			return kt$3(t) + i$2 + o$1 + e;
		},
		decode(t, e) {
			const { Err: n$1 } = lt$1;
			let r$1 = 0;
			if (t < 0 || t > 256) throw new n$1("tlv.encode: wrong tag");
			if (e.length < 2 || e[r$1++] !== t) throw new n$1("tlv.decode: wrong tlv");
			const o$1 = e[r$1++], i$2 = !!(o$1 & 128);
			let s = 0;
			if (!i$2) s = o$1;
			else {
				const a$1 = o$1 & 127;
				if (!a$1) throw new n$1("tlv.decode(long): indefinite length not supported");
				if (a$1 > 4) throw new n$1("tlv.decode(long): byte length is too big");
				const u$2 = e.subarray(r$1, r$1 + a$1);
				if (u$2.length !== a$1) throw new n$1("tlv.decode: length bytes not complete");
				if (u$2[0] === 0) throw new n$1("tlv.decode(long): zero leftmost byte");
				for (const l$2 of u$2) s = s << 8 | l$2;
				if (r$1 += a$1, s < 128) throw new n$1("tlv.decode(long): not minimal encoding");
			}
			const c$2 = e.subarray(r$1, r$1 + s);
			if (c$2.length !== s) throw new n$1("tlv.decode: wrong value length");
			return {
				v: c$2,
				l: e.subarray(r$1 + s)
			};
		}
	},
	_int: {
		encode(t) {
			const { Err: e } = lt$1;
			if (t < dt$2) throw new e("integer: negative integers are not allowed");
			let n$1 = kt$3(t);
			if (Number.parseInt(n$1[0], 16) & 8 && (n$1 = "00" + n$1), n$1.length & 1) throw new e("unexpected DER parsing assertion: unpadded hex");
			return n$1;
		},
		decode(t) {
			const { Err: e } = lt$1;
			if (t[0] & 128) throw new e("invalid signature integer: negative");
			if (t[0] === 0 && !(t[1] & 128)) throw new e("invalid signature integer: unnecessary leading zero");
			return xc(t);
		}
	},
	toSig(t) {
		const { Err: e, _int: n$1, _tlv: r$1 } = lt$1, o$1 = typeof t == "string" ? Sc(t) : t;
		te$1(o$1);
		const { v: i$2, l: s } = r$1.decode(48, o$1);
		if (s.length) throw new e("invalid signature: left bytes after parsing");
		const { v: c$2, l: a$1 } = r$1.decode(2, i$2), { v: u$2, l: l$2 } = r$1.decode(2, a$1);
		if (l$2.length) throw new e("invalid signature: left bytes after parsing");
		return {
			r: n$1.decode(c$2),
			s: n$1.decode(u$2)
		};
	},
	hexFromSig(t) {
		const { _tlv: e, _int: n$1 } = lt$1, r$1 = e.encode(2, n$1.encode(t.r)), o$1 = e.encode(2, n$1.encode(t.s)), i$2 = r$1 + o$1;
		return e.encode(48, i$2);
	}
}, dt$2 = BigInt(0), K$1 = BigInt(1);
BigInt(2);
var Qr$1 = BigInt(3);
BigInt(4);
function Ac(t) {
	const e = vc(t), { Fp: n$1 } = e, r$1 = Kr$1(e.n, e.nBitLength), o$1 = e.toBytes || ((p$2, d$2, v$3) => {
		const m$1 = d$2.toAffine();
		return ne$2(Uint8Array.from([4]), n$1.toBytes(m$1.x), n$1.toBytes(m$1.y));
	}), i$2 = e.fromBytes || ((p$2) => {
		const d$2 = p$2.subarray(1), v$3 = n$1.fromBytes(d$2.subarray(0, n$1.BYTES)), m$1 = n$1.fromBytes(d$2.subarray(n$1.BYTES, 2 * n$1.BYTES));
		return {
			x: v$3,
			y: m$1
		};
	});
	function s(p$2) {
		const { a: d$2, b: v$3 } = e, m$1 = n$1.sqr(p$2), O$3 = n$1.mul(m$1, p$2);
		return n$1.add(n$1.add(O$3, n$1.mul(p$2, d$2)), v$3);
	}
	if (!n$1.eql(n$1.sqr(e.Gy), s(e.Gx))) throw new Error("bad generator point: equation left != right");
	function c$2(p$2) {
		return Ee$3(p$2, K$1, e.n);
	}
	function a$1(p$2) {
		const { allowedPrivateKeyLengths: d$2, nByteLength: v$3, wrapPrivateKey: m$1, n: O$3 } = e;
		if (d$2 && typeof p$2 != "bigint") {
			if (St$3(p$2) && (p$2 = Pt$2(p$2)), typeof p$2 != "string" || !d$2.includes(p$2.length)) throw new Error("invalid private key");
			p$2 = p$2.padStart(v$3 * 2, "0");
		}
		let N$2;
		try {
			N$2 = typeof p$2 == "bigint" ? p$2 : Ot$2(et$1("private key", p$2, v$3));
		} catch {
			throw new Error("invalid private key, expected hex or " + v$3 + " bytes, got " + typeof p$2);
		}
		return m$1 && (N$2 = X$1(N$2, O$3)), ft$2("private key", N$2, K$1, O$3), N$2;
	}
	function u$2(p$2) {
		if (!(p$2 instanceof h$3)) throw new Error("ProjectivePoint expected");
	}
	const l$2 = tn$1((p$2, d$2) => {
		const { px: v$3, py: m$1, pz: O$3 } = p$2;
		if (n$1.eql(O$3, n$1.ONE)) return {
			x: v$3,
			y: m$1
		};
		const N$2 = p$2.is0();
		d$2 ??= N$2 ? n$1.ONE : n$1.inv(O$3);
		const $$3 = n$1.mul(v$3, d$2), B$2 = n$1.mul(m$1, d$2), A$3 = n$1.mul(O$3, d$2);
		if (N$2) return {
			x: n$1.ZERO,
			y: n$1.ZERO
		};
		if (!n$1.eql(A$3, n$1.ONE)) throw new Error("invZ was invalid");
		return {
			x: $$3,
			y: B$2
		};
	}), f$4 = tn$1((p$2) => {
		if (p$2.is0()) {
			if (e.allowInfinityPoint && !n$1.is0(p$2.py)) return;
			throw new Error("bad point: ZERO");
		}
		const { x: d$2, y: v$3 } = p$2.toAffine();
		if (!n$1.isValid(d$2) || !n$1.isValid(v$3)) throw new Error("bad point: x or y not FE");
		const m$1 = n$1.sqr(v$3), O$3 = s(d$2);
		if (!n$1.eql(m$1, O$3)) throw new Error("bad point: equation left != right");
		if (!p$2.isTorsionFree()) throw new Error("bad point: not in prime-order subgroup");
		return !0;
	});
	class h$3 {
		constructor(d$2, v$3, m$1) {
			if (this.px = d$2, this.py = v$3, this.pz = m$1, d$2 == null || !n$1.isValid(d$2)) throw new Error("x required");
			if (v$3 == null || !n$1.isValid(v$3)) throw new Error("y required");
			if (m$1 == null || !n$1.isValid(m$1)) throw new Error("z required");
			Object.freeze(this);
		}
		static fromAffine(d$2) {
			const { x: v$3, y: m$1 } = d$2 || {};
			if (!d$2 || !n$1.isValid(v$3) || !n$1.isValid(m$1)) throw new Error("invalid affine point");
			if (d$2 instanceof h$3) throw new Error("projective point not allowed");
			const O$3 = (N$2) => n$1.eql(N$2, n$1.ZERO);
			return O$3(v$3) && O$3(m$1) ? h$3.ZERO : new h$3(v$3, m$1, n$1.ONE);
		}
		get x() {
			return this.toAffine().x;
		}
		get y() {
			return this.toAffine().y;
		}
		static normalizeZ(d$2) {
			const v$3 = n$1.invertBatch(d$2.map((m$1) => m$1.pz));
			return d$2.map((m$1, O$3) => m$1.toAffine(v$3[O$3])).map(h$3.fromAffine);
		}
		static fromHex(d$2) {
			const v$3 = h$3.fromAffine(i$2(et$1("pointHex", d$2)));
			return v$3.assertValidity(), v$3;
		}
		static fromPrivateKey(d$2) {
			return h$3.BASE.multiply(a$1(d$2));
		}
		static msm(d$2, v$3) {
			return hc(h$3, r$1, d$2, v$3);
		}
		_setWindowSize(d$2) {
			E$4.setWindowSize(this, d$2);
		}
		assertValidity() {
			f$4(this);
		}
		hasEvenY() {
			const { y: d$2 } = this.toAffine();
			if (n$1.isOdd) return !n$1.isOdd(d$2);
			throw new Error("Field doesn't support isOdd");
		}
		equals(d$2) {
			u$2(d$2);
			const { px: v$3, py: m$1, pz: O$3 } = this, { px: N$2, py: $$3, pz: B$2 } = d$2, A$3 = n$1.eql(n$1.mul(v$3, B$2), n$1.mul(N$2, O$3)), T$1 = n$1.eql(n$1.mul(m$1, B$2), n$1.mul($$3, O$3));
			return A$3 && T$1;
		}
		negate() {
			return new h$3(this.px, n$1.neg(this.py), this.pz);
		}
		double() {
			const { a: d$2, b: v$3 } = e, m$1 = n$1.mul(v$3, Qr$1), { px: O$3, py: N$2, pz: $$3 } = this;
			let B$2 = n$1.ZERO, A$3 = n$1.ZERO, T$1 = n$1.ZERO, S$3 = n$1.mul(O$3, O$3), L$2 = n$1.mul(N$2, N$2), U$2 = n$1.mul($$3, $$3), _ = n$1.mul(O$3, N$2);
			return _ = n$1.add(_, _), T$1 = n$1.mul(O$3, $$3), T$1 = n$1.add(T$1, T$1), B$2 = n$1.mul(d$2, T$1), A$3 = n$1.mul(m$1, U$2), A$3 = n$1.add(B$2, A$3), B$2 = n$1.sub(L$2, A$3), A$3 = n$1.add(L$2, A$3), A$3 = n$1.mul(B$2, A$3), B$2 = n$1.mul(_, B$2), T$1 = n$1.mul(m$1, T$1), U$2 = n$1.mul(d$2, U$2), _ = n$1.sub(S$3, U$2), _ = n$1.mul(d$2, _), _ = n$1.add(_, T$1), T$1 = n$1.add(S$3, S$3), S$3 = n$1.add(T$1, S$3), S$3 = n$1.add(S$3, U$2), S$3 = n$1.mul(S$3, _), A$3 = n$1.add(A$3, S$3), U$2 = n$1.mul(N$2, $$3), U$2 = n$1.add(U$2, U$2), S$3 = n$1.mul(U$2, _), B$2 = n$1.sub(B$2, S$3), T$1 = n$1.mul(U$2, L$2), T$1 = n$1.add(T$1, T$1), T$1 = n$1.add(T$1, T$1), new h$3(B$2, A$3, T$1);
		}
		add(d$2) {
			u$2(d$2);
			const { px: v$3, py: m$1, pz: O$3 } = this, { px: N$2, py: $$3, pz: B$2 } = d$2;
			let A$3 = n$1.ZERO, T$1 = n$1.ZERO, S$3 = n$1.ZERO;
			const L$2 = e.a, U$2 = n$1.mul(e.b, Qr$1);
			let _ = n$1.mul(v$3, N$2), j$1 = n$1.mul(m$1, $$3), g = n$1.mul(O$3, B$2), w$1 = n$1.add(v$3, m$1), b$3 = n$1.add(N$2, $$3);
			w$1 = n$1.mul(w$1, b$3), b$3 = n$1.add(_, j$1), w$1 = n$1.sub(w$1, b$3), b$3 = n$1.add(v$3, O$3);
			let I$2 = n$1.add(N$2, B$2);
			return b$3 = n$1.mul(b$3, I$2), I$2 = n$1.add(_, g), b$3 = n$1.sub(b$3, I$2), I$2 = n$1.add(m$1, O$3), A$3 = n$1.add($$3, B$2), I$2 = n$1.mul(I$2, A$3), A$3 = n$1.add(j$1, g), I$2 = n$1.sub(I$2, A$3), S$3 = n$1.mul(L$2, b$3), A$3 = n$1.mul(U$2, g), S$3 = n$1.add(A$3, S$3), A$3 = n$1.sub(j$1, S$3), S$3 = n$1.add(j$1, S$3), T$1 = n$1.mul(A$3, S$3), j$1 = n$1.add(_, _), j$1 = n$1.add(j$1, _), g = n$1.mul(L$2, g), b$3 = n$1.mul(U$2, b$3), j$1 = n$1.add(j$1, g), g = n$1.sub(_, g), g = n$1.mul(L$2, g), b$3 = n$1.add(b$3, g), _ = n$1.mul(j$1, b$3), T$1 = n$1.add(T$1, _), _ = n$1.mul(I$2, b$3), A$3 = n$1.mul(w$1, A$3), A$3 = n$1.sub(A$3, _), _ = n$1.mul(w$1, j$1), S$3 = n$1.mul(I$2, S$3), S$3 = n$1.add(S$3, _), new h$3(A$3, T$1, S$3);
		}
		subtract(d$2) {
			return this.add(d$2.negate());
		}
		is0() {
			return this.equals(h$3.ZERO);
		}
		wNAF(d$2) {
			return E$4.wNAFCached(this, d$2, h$3.normalizeZ);
		}
		multiplyUnsafe(d$2) {
			const { endo: v$3, n: m$1 } = e;
			ft$2("scalar", d$2, dt$2, m$1);
			const O$3 = h$3.ZERO;
			if (d$2 === dt$2) return O$3;
			if (this.is0() || d$2 === K$1) return this;
			if (!v$3 || E$4.hasPrecomputes(this)) return E$4.wNAFCachedUnsafe(this, d$2, h$3.normalizeZ);
			let { k1neg: N$2, k1: $$3, k2neg: B$2, k2: A$3 } = v$3.splitScalar(d$2), T$1 = O$3, S$3 = O$3, L$2 = this;
			for (; $$3 > dt$2 || A$3 > dt$2;) $$3 & K$1 && (T$1 = T$1.add(L$2)), A$3 & K$1 && (S$3 = S$3.add(L$2)), L$2 = L$2.double(), $$3 >>= K$1, A$3 >>= K$1;
			return N$2 && (T$1 = T$1.negate()), B$2 && (S$3 = S$3.negate()), S$3 = new h$3(n$1.mul(S$3.px, v$3.beta), S$3.py, S$3.pz), T$1.add(S$3);
		}
		multiply(d$2) {
			const { endo: v$3, n: m$1 } = e;
			ft$2("scalar", d$2, K$1, m$1);
			let O$3, N$2;
			if (v$3) {
				const { k1neg: $$3, k1: B$2, k2neg: A$3, k2: T$1 } = v$3.splitScalar(d$2);
				let { p: S$3, f: L$2 } = this.wNAF(B$2), { p: U$2, f: _ } = this.wNAF(T$1);
				S$3 = E$4.constTimeNegate($$3, S$3), U$2 = E$4.constTimeNegate(A$3, U$2), U$2 = new h$3(n$1.mul(U$2.px, v$3.beta), U$2.py, U$2.pz), O$3 = S$3.add(U$2), N$2 = L$2.add(_);
			} else {
				const { p: $$3, f: B$2 } = this.wNAF(d$2);
				O$3 = $$3, N$2 = B$2;
			}
			return h$3.normalizeZ([O$3, N$2])[0];
		}
		multiplyAndAddUnsafe(d$2, v$3, m$1) {
			const O$3 = h$3.BASE, N$2 = (B$2, A$3) => A$3 === dt$2 || A$3 === K$1 || !B$2.equals(O$3) ? B$2.multiplyUnsafe(A$3) : B$2.multiply(A$3), $$3 = N$2(this, v$3).add(N$2(d$2, m$1));
			return $$3.is0() ? void 0 : $$3;
		}
		toAffine(d$2) {
			return l$2(this, d$2);
		}
		isTorsionFree() {
			const { h: d$2, isTorsionFree: v$3 } = e;
			if (d$2 === K$1) return !0;
			if (v$3) return v$3(h$3, this);
			throw new Error("isTorsionFree() has not been declared for the elliptic curve");
		}
		clearCofactor() {
			const { h: d$2, clearCofactor: v$3 } = e;
			return d$2 === K$1 ? this : v$3 ? v$3(h$3, this) : this.multiplyUnsafe(e.h);
		}
		toRawBytes(d$2 = !0) {
			return Ct$1("isCompressed", d$2), this.assertValidity(), o$1(h$3, this, d$2);
		}
		toHex(d$2 = !0) {
			return Ct$1("isCompressed", d$2), Pt$2(this.toRawBytes(d$2));
		}
	}
	h$3.BASE = new h$3(e.Gx, e.Gy, n$1.ONE), h$3.ZERO = new h$3(n$1.ZERO, n$1.ONE, n$1.ZERO);
	const y$4 = e.nBitLength, E$4 = dc(h$3, e.endo ? Math.ceil(y$4 / 2) : y$4);
	return {
		CURVE: e,
		ProjectivePoint: h$3,
		normPrivateKeyToScalar: a$1,
		weierstrassEquation: s,
		isWithinCurveOrder: c$2
	};
}
function Bc(t) {
	const e = Wr$1(t);
	return Dt$1(e, {
		hash: "hash",
		hmac: "function",
		randomBytes: "function"
	}, {
		bits2int: "function",
		bits2int_modN: "function",
		lowS: "boolean"
	}), Object.freeze({
		lowS: !0,
		...e
	});
}
function Ic(t) {
	const e = Bc(t), { Fp: n$1, n: r$1 } = e, o$1 = n$1.BYTES + 1, i$2 = 2 * n$1.BYTES + 1;
	function s(g) {
		return X$1(g, r$1);
	}
	function c$2(g) {
		return nn$1(g, r$1);
	}
	const { ProjectivePoint: a$1, normPrivateKeyToScalar: u$2, weierstrassEquation: l$2, isWithinCurveOrder: f$4 } = Ac({
		...e,
		toBytes(g, w$1, b$3) {
			const I$2 = w$1.toAffine(), R$3 = n$1.toBytes(I$2.x), x$1 = ne$2;
			return Ct$1("isCompressed", b$3), b$3 ? x$1(Uint8Array.from([w$1.hasEvenY() ? 2 : 3]), R$3) : x$1(Uint8Array.from([4]), R$3, n$1.toBytes(I$2.y));
		},
		fromBytes(g) {
			const w$1 = g.length, b$3 = g[0], I$2 = g.subarray(1);
			if (w$1 === o$1 && (b$3 === 2 || b$3 === 3)) {
				const R$3 = Ot$2(I$2);
				if (!Ee$3(R$3, K$1, n$1.ORDER)) throw new Error("Point is not on curve");
				const x$1 = l$2(R$3);
				let C$4;
				try {
					C$4 = n$1.sqrt(x$1);
				} catch (M$3) {
					const D$1 = M$3 instanceof Error ? ": " + M$3.message : "";
					throw new Error("Point is not on curve" + D$1);
				}
				const P$2 = (C$4 & K$1) === K$1;
				return (b$3 & 1) === 1 !== P$2 && (C$4 = n$1.neg(C$4)), {
					x: R$3,
					y: C$4
				};
			} else if (w$1 === i$2 && b$3 === 4) {
				const R$3 = n$1.fromBytes(I$2.subarray(0, n$1.BYTES)), x$1 = n$1.fromBytes(I$2.subarray(n$1.BYTES, 2 * n$1.BYTES));
				return {
					x: R$3,
					y: x$1
				};
			} else {
				const R$3 = o$1, x$1 = i$2;
				throw new Error("invalid Point, expected length of " + R$3 + ", or uncompressed " + x$1 + ", got " + w$1);
			}
		}
	}), h$3 = (g) => Pt$2(Mt$2(g, e.nByteLength));
	function y$4(g) {
		const w$1 = r$1 >> K$1;
		return g > w$1;
	}
	function E$4(g) {
		return y$4(g) ? s(-g) : g;
	}
	const p$2 = (g, w$1, b$3) => Ot$2(g.slice(w$1, b$3));
	class d$2 {
		constructor(w$1, b$3, I$2) {
			this.r = w$1, this.s = b$3, this.recovery = I$2, this.assertValidity();
		}
		static fromCompact(w$1) {
			const b$3 = e.nByteLength;
			return w$1 = et$1("compactSignature", w$1, b$3 * 2), new d$2(p$2(w$1, 0, b$3), p$2(w$1, b$3, 2 * b$3));
		}
		static fromDER(w$1) {
			const { r: b$3, s: I$2 } = lt$1.toSig(et$1("DER", w$1));
			return new d$2(b$3, I$2);
		}
		assertValidity() {
			ft$2("r", this.r, K$1, r$1), ft$2("s", this.s, K$1, r$1);
		}
		addRecoveryBit(w$1) {
			return new d$2(this.r, this.s, w$1);
		}
		recoverPublicKey(w$1) {
			const { r: b$3, s: I$2, recovery: R$3 } = this, x$1 = B$2(et$1("msgHash", w$1));
			if (R$3 == null || ![
				0,
				1,
				2,
				3
			].includes(R$3)) throw new Error("recovery id invalid");
			const C$4 = R$3 === 2 || R$3 === 3 ? b$3 + e.n : b$3;
			if (C$4 >= n$1.ORDER) throw new Error("recovery id 2 or 3 invalid");
			const P$2 = (R$3 & 1) === 0 ? "02" : "03", k$4 = a$1.fromHex(P$2 + h$3(C$4)), M$3 = c$2(C$4), D$1 = s(-x$1 * M$3), z$1 = s(I$2 * M$3), Z$1 = a$1.BASE.multiplyAndAddUnsafe(k$4, D$1, z$1);
			if (!Z$1) throw new Error("point at infinify");
			return Z$1.assertValidity(), Z$1;
		}
		hasHighS() {
			return y$4(this.s);
		}
		normalizeS() {
			return this.hasHighS() ? new d$2(this.r, s(-this.s), this.recovery) : this;
		}
		toDERRawBytes() {
			return Vt$2(this.toDERHex());
		}
		toDERHex() {
			return lt$1.hexFromSig({
				r: this.r,
				s: this.s
			});
		}
		toCompactRawBytes() {
			return Vt$2(this.toCompactHex());
		}
		toCompactHex() {
			return h$3(this.r) + h$3(this.s);
		}
	}
	const v$3 = {
		isValidPrivateKey(g) {
			try {
				return u$2(g), !0;
			} catch {
				return !1;
			}
		},
		normPrivateKeyToScalar: u$2,
		randomPrivateKey: () => {
			const g = zr$1(e.n);
			return uc(e.randomBytes(g), e.n);
		},
		precompute(g = 8, w$1 = a$1.BASE) {
			return w$1._setWindowSize(g), w$1.multiply(BigInt(3)), w$1;
		}
	};
	function m$1(g, w$1 = !0) {
		return a$1.fromPrivateKey(g).toRawBytes(w$1);
	}
	function O$3(g) {
		const w$1 = St$3(g), b$3 = typeof g == "string", I$2 = (w$1 || b$3) && g.length;
		return w$1 ? I$2 === o$1 || I$2 === i$2 : b$3 ? I$2 === 2 * o$1 || I$2 === 2 * i$2 : g instanceof a$1;
	}
	function N$2(g, w$1, b$3 = !0) {
		if (O$3(g)) throw new Error("first arg must be private key");
		if (!O$3(w$1)) throw new Error("second arg must be public key");
		return a$1.fromHex(w$1).multiply(u$2(g)).toRawBytes(b$3);
	}
	const $$3 = e.bits2int || function(g) {
		if (g.length > 8192) throw new Error("input is too large");
		const w$1 = Ot$2(g), b$3 = g.length * 8 - e.nBitLength;
		return b$3 > 0 ? w$1 >> BigInt(b$3) : w$1;
	}, B$2 = e.bits2int_modN || function(g) {
		return s($$3(g));
	}, A$3 = Je$2(e.nBitLength);
	function T$1(g) {
		return ft$2("num < 2^" + e.nBitLength, g, dt$2, A$3), Mt$2(g, e.nByteLength);
	}
	function S$3(g, w$1, b$3 = L$2) {
		if (["recovered", "canonical"].some((W$2) => W$2 in b$3)) throw new Error("sign() legacy options not supported");
		const { hash: I$2, randomBytes: R$3 } = e;
		let { lowS: x$1, prehash: C$4, extraEntropy: P$2 } = b$3;
		x$1 ??= !0, g = et$1("msgHash", g), Jr$1(b$3), C$4 && (g = et$1("prehashed msgHash", I$2(g)));
		const k$4 = B$2(g), M$3 = u$2(w$1), D$1 = [T$1(M$3), T$1(k$4)];
		if (P$2 != null && P$2 !== !1) {
			const W$2 = P$2 === !0 ? R$3(n$1.BYTES) : P$2;
			D$1.push(et$1("extraEntropy", W$2));
		}
		const z$1 = ne$2(...D$1), Z$1 = k$4;
		function st$1(W$2) {
			const J$2 = $$3(W$2);
			if (!f$4(J$2)) return;
			const Be$3 = c$2(J$2), zt$2 = a$1.BASE.multiply(J$2).toAffine(), vt$1 = s(zt$2.x);
			if (vt$1 === dt$2) return;
			const Zt$2 = s(Be$3 * s(Z$1 + vt$1 * M$3));
			if (Zt$2 === dt$2) return;
			let Ut$2 = (zt$2.x === vt$1 ? 0 : 2) | Number(zt$2.y & K$1), vn$1 = Zt$2;
			return x$1 && y$4(Zt$2) && (vn$1 = E$4(Zt$2), Ut$2 ^= 1), new d$2(vt$1, vn$1, Ut$2);
		}
		return {
			seed: z$1,
			k2sig: st$1
		};
	}
	const L$2 = {
		lowS: e.lowS,
		prehash: !1
	}, U$2 = {
		lowS: e.lowS,
		prehash: !1
	};
	function _(g, w$1, b$3 = L$2) {
		const { seed: I$2, k2sig: R$3 } = S$3(g, w$1, b$3), x$1 = e;
		return Vr$1(x$1.hash.outputLen, x$1.nByteLength, x$1.hmac)(I$2, R$3);
	}
	a$1.BASE._setWindowSize(8);
	function j$1(g, w$1, b$3, I$2 = U$2) {
		const R$3 = g;
		w$1 = et$1("msgHash", w$1), b$3 = et$1("publicKey", b$3);
		const { lowS: x$1, prehash: C$4, format: P$2 } = I$2;
		if (Jr$1(I$2), "strict" in I$2) throw new Error("options.strict was renamed to lowS");
		if (P$2 !== void 0 && P$2 !== "compact" && P$2 !== "der") throw new Error("format must be compact or der");
		const k$4 = typeof R$3 == "string" || St$3(R$3), M$3 = !k$4 && !P$2 && typeof R$3 == "object" && R$3 !== null && typeof R$3.r == "bigint" && typeof R$3.s == "bigint";
		if (!k$4 && !M$3) throw new Error("invalid signature, expected Uint8Array, hex string or Signature instance");
		let D$1, z$1;
		try {
			if (M$3 && (D$1 = new d$2(R$3.r, R$3.s)), k$4) {
				try {
					P$2 !== "compact" && (D$1 = d$2.fromDER(R$3));
				} catch (Ut$2) {
					if (!(Ut$2 instanceof lt$1.Err)) throw Ut$2;
				}
				!D$1 && P$2 !== "der" && (D$1 = d$2.fromCompact(R$3));
			}
			z$1 = a$1.fromHex(b$3);
		} catch {
			return !1;
		}
		if (!D$1 || x$1 && D$1.hasHighS()) return !1;
		C$4 && (w$1 = e.hash(w$1));
		const { r: Z$1, s: st$1 } = D$1, W$2 = B$2(w$1), J$2 = c$2(st$1), Be$3 = s(W$2 * J$2), zt$2 = s(Z$1 * J$2), vt$1 = a$1.BASE.multiplyAndAddUnsafe(z$1, Be$3, zt$2)?.toAffine();
		return vt$1 ? s(vt$1.x) === Z$1 : !1;
	}
	return {
		CURVE: e,
		getPublicKey: m$1,
		getSharedSecret: N$2,
		sign: _,
		verify: j$1,
		ProjectivePoint: a$1,
		Signature: d$2,
		utils: v$3
	};
}
function Nc(t) {
	return {
		hash: t,
		hmac: (e, ...n$1) => ye$2(t, e, Vi$1(...n$1)),
		randomBytes: Lt$2
	};
}
function Uc(t, e) {
	const n$1 = (r$1) => Ic({
		...t,
		...Nc(r$1)
	});
	return {
		...n$1(e),
		create: n$1
	};
}
var to$1 = Kr$1(BigInt("0xffffffff00000001000000000000000000000000ffffffffffffffffffffffff")), Tc = to$1.create(BigInt("-3")), Rc = BigInt("0x5ac635d8aa3a93e7b3ebbd55769886bc651d06b0cc53b0f63bce3c3e27d2604b"), _c = Uc({
	a: Tc,
	b: Rc,
	Fp: to$1,
	n: BigInt("0xffffffff00000000ffffffffffffffffbce6faada7179e84f3b9cac2fc632551"),
	Gx: BigInt("0x6b17d1f2e12c4247f8bce6e563a440f277037d812deb33a0f4a13945d898c296"),
	Gy: BigInt("0x4fe342e2fe1a7f9b8ee7eb4a7c0f9e162bce33576b315ececbb6406837bf51f5"),
	h: BigInt(1),
	lowS: !1
}, Qt$2), ln$1 = "base10", G$1 = "base16", qt$1 = "base64pad", xe$1 = "base64url", Kt$2 = "utf8";
function Lc() {
	const t = fn$1.utils.randomPrivateKey(), e = fn$1.getPublicKey(t);
	return {
		privateKey: toString$1(t, G$1),
		publicKey: toString$1(e, G$1)
	};
}
function jc() {
	const t = Lt$2(32);
	return toString$1(t, G$1);
}
function Cc(t, e) {
	const n$1 = fn$1.getSharedSecret(fromString(t, G$1), fromString(e, G$1)), r$1 = Vs$1(Qt$2, n$1, void 0, void 0, 32);
	return toString$1(r$1, G$1);
}
function Pc(t) {
	const e = Qt$2(fromString(t, G$1));
	return toString$1(e, G$1);
}
function kc(t) {
	const e = Qt$2(fromString(t, Kt$2));
	return toString$1(e, G$1);
}
function pn$1(t) {
	return fromString(`${t}`, ln$1);
}
function Bt$1(t) {
	return Number(toString$1(t, ln$1));
}
function no$1(t) {
	return t.replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
}
function ro$1(t) {
	const e = t.replace(/-/g, "+").replace(/_/g, "/"), n$1 = (4 - e.length % 4) % 4;
	return e + "=".repeat(n$1);
}
function Vc(t) {
	const e = pn$1(typeof t.type < "u" ? t.type : 0);
	if (Bt$1(e) === 1 && typeof t.senderPublicKey > "u") throw new Error("Missing sender public key for type 1 envelope");
	const n$1 = typeof t.senderPublicKey < "u" ? fromString(t.senderPublicKey, G$1) : void 0, r$1 = typeof t.iv < "u" ? fromString(t.iv, G$1) : Lt$2(12), o$1 = fromString(t.symKey, G$1), i$2 = $r$1(o$1, r$1).encrypt(fromString(t.message, Kt$2)), s = gn$1({
		type: e,
		sealed: i$2,
		iv: r$1,
		senderPublicKey: n$1
	});
	return t.encoding === "base64url" ? no$1(s) : s;
}
function Mc(t) {
	const e = fromString(t.symKey, G$1), { sealed: n$1, iv: r$1 } = Se$2({
		encoded: t.encoded,
		encoding: t.encoding
	}), o$1 = $r$1(e, r$1).decrypt(n$1);
	if (o$1 === null) throw new Error("Failed to decrypt");
	return toString$1(o$1, Kt$2);
}
function Dc(t, e) {
	const n$1 = pn$1(2), r$1 = Lt$2(12), o$1 = fromString(t, Kt$2), i$2 = gn$1({
		type: n$1,
		sealed: o$1,
		iv: r$1
	});
	return e === "base64url" ? no$1(i$2) : i$2;
}
function Hc(t, e) {
	const { sealed: n$1 } = Se$2({
		encoded: t,
		encoding: e
	});
	return toString$1(n$1, Kt$2);
}
function gn$1(t) {
	if (Bt$1(t.type) === 2) return toString$1(concat([t.type, t.sealed]), qt$1);
	if (Bt$1(t.type) === 1) {
		if (typeof t.senderPublicKey > "u") throw new Error("Missing sender public key for type 1 envelope");
		return toString$1(concat([
			t.type,
			t.senderPublicKey,
			t.iv,
			t.sealed
		]), qt$1);
	}
	return toString$1(concat([
		t.type,
		t.iv,
		t.sealed
	]), qt$1);
}
function Se$2(t) {
	const e = (t.encoding || "base64pad") === "base64url" ? ro$1(t.encoded) : t.encoded, n$1 = fromString(e, qt$1), r$1 = n$1.slice(0, 1), o$1 = 1;
	if (Bt$1(r$1) === 1) {
		const a$1 = o$1 + 32, u$2 = a$1 + 12, l$2 = n$1.slice(o$1, a$1), f$4 = n$1.slice(a$1, u$2), h$3 = n$1.slice(u$2);
		return {
			type: r$1,
			sealed: h$3,
			iv: f$4,
			senderPublicKey: l$2
		};
	}
	if (Bt$1(r$1) === 2) {
		const a$1 = n$1.slice(o$1), u$2 = Lt$2(12);
		return {
			type: r$1,
			sealed: a$1,
			iv: u$2
		};
	}
	const i$2 = o$1 + 12, s = n$1.slice(o$1, i$2), c$2 = n$1.slice(i$2);
	return {
		type: r$1,
		sealed: c$2,
		iv: s
	};
}
function qc(t, e) {
	const n$1 = Se$2({
		encoded: t,
		encoding: e?.encoding
	});
	return oo({
		type: Bt$1(n$1.type),
		senderPublicKey: typeof n$1.senderPublicKey < "u" ? toString$1(n$1.senderPublicKey, G$1) : void 0,
		receiverPublicKey: e?.receiverPublicKey
	});
}
function oo(t) {
	const e = t?.type || 0;
	if (e === 1) {
		if (typeof t?.senderPublicKey > "u") throw new Error("missing sender public key");
		if (typeof t?.receiverPublicKey > "u") throw new Error("missing receiver public key");
	}
	return {
		type: e,
		senderPublicKey: t?.senderPublicKey,
		receiverPublicKey: t?.receiverPublicKey
	};
}
function Kc(t) {
	return t.type === 1 && typeof t.senderPublicKey == "string" && typeof t.receiverPublicKey == "string";
}
function Fc(t) {
	return t.type === 2;
}
function io$1(t) {
	const e = Buffer.from(t.x, "base64"), n$1 = Buffer.from(t.y, "base64");
	return concat([
		new Uint8Array([4]),
		e,
		n$1
	]);
}
function zc(t, e) {
	const [n$1, r$1, o$1] = t.split("."), i$2 = Buffer.from(ro$1(o$1), "base64");
	if (i$2.length !== 64) throw new Error("Invalid signature length");
	const s = i$2.slice(0, 32), c$2 = i$2.slice(32, 64), a$1 = `${n$1}.${r$1}`, u$2 = Qt$2(a$1), l$2 = io$1(e);
	if (!_c.verify(concat([s, c$2]), u$2, l$2)) throw new Error("Invalid signature");
	return sn(t).payload;
}
function Zc(t) {
	return t?.relay || { protocol: "irn" };
}
function Yc(t) {
	const e = C$3[t];
	if (typeof e > "u") throw new Error(`Relay Protocol not supported: ${t}`);
	return e;
}
function co$1(t, e = "-") {
	const n$1 = {}, r$1 = "relay" + e;
	return Object.keys(t).forEach((o$1) => {
		if (o$1.startsWith(r$1)) {
			const i$2 = o$1.replace(r$1, "");
			n$1[i$2] = t[o$1];
		}
	}), n$1;
}
function Gc(t) {
	if (!t.includes("wc:")) {
		const u$2 = je$2(t);
		u$2 != null && u$2.includes("wc:") && (t = u$2);
	}
	t = t.includes("wc://") ? t.replace("wc://", "") : t, t = t.includes("wc:") ? t.replace("wc:", "") : t;
	const e = t.indexOf(":"), n$1 = t.indexOf("?") !== -1 ? t.indexOf("?") : void 0, r$1 = t.substring(0, e), o$1 = t.substring(e + 1, n$1).split("@"), i$2 = typeof n$1 < "u" ? t.substring(n$1) : "", s = new URLSearchParams(i$2), c$2 = {};
	s.forEach((u$2, l$2) => {
		c$2[l$2] = u$2;
	});
	const a$1 = typeof c$2.methods == "string" ? c$2.methods.split(",") : void 0;
	return {
		protocol: r$1,
		topic: ao$1(o$1[0]),
		version: parseInt(o$1[1], 10),
		symKey: c$2.symKey,
		relay: co$1(c$2),
		methods: a$1,
		expiryTimestamp: c$2.expiryTimestamp ? parseInt(c$2.expiryTimestamp, 10) : void 0
	};
}
function ao$1(t) {
	return t.startsWith("//") ? t.substring(2) : t;
}
function uo$1(t, e = "-") {
	const n$1 = "relay", r$1 = {};
	return Object.keys(t).forEach((o$1) => {
		const i$2 = o$1, s = n$1 + e + i$2;
		t[i$2] && (r$1[s] = t[i$2]);
	}), r$1;
}
function Wc(t) {
	const e = new URLSearchParams(), n$1 = uo$1(t.relay);
	Object.keys(n$1).sort().forEach((o$1) => {
		e.set(o$1, n$1[o$1]);
	}), e.set("symKey", t.symKey), t.expiryTimestamp && e.set("expiryTimestamp", t.expiryTimestamp.toString()), t.methods && e.set("methods", t.methods.join(","));
	const r$1 = e.toString();
	return `${t.protocol}:${t.topic}@${t.version}?${r$1}`;
}
function Xc(t, e, n$1) {
	return `${t}?wc_ev=${n$1}&topic=${e}`;
}
var Jc = Object.defineProperty, Qc = Object.defineProperties, ta = Object.getOwnPropertyDescriptors, fo$1 = Object.getOwnPropertySymbols, ea = Object.prototype.hasOwnProperty, na = Object.prototype.propertyIsEnumerable, lo$1 = (t, e, n$1) => e in t ? Jc(t, e, {
	enumerable: !0,
	configurable: !0,
	writable: !0,
	value: n$1
}) : t[e] = n$1, ra = (t, e) => {
	for (var n$1 in e || (e = {})) ea.call(e, n$1) && lo$1(t, n$1, e[n$1]);
	if (fo$1) for (var n$1 of fo$1(e)) na.call(e, n$1) && lo$1(t, n$1, e[n$1]);
	return t;
}, oa = (t, e) => Qc(t, ta(e));
function It$2(t) {
	const e = [];
	return t.forEach((n$1) => {
		const [r$1, o$1] = n$1.split(":");
		e.push(`${r$1}:${o$1}`);
	}), e;
}
function ho$1(t) {
	const e = [];
	return Object.values(t).forEach((n$1) => {
		e.push(...It$2(n$1.accounts));
	}), e;
}
function po$1(t, e) {
	const n$1 = [];
	return Object.values(t).forEach((r$1) => {
		It$2(r$1.accounts).includes(e) && n$1.push(...r$1.methods);
	}), n$1;
}
function go$1(t, e) {
	const n$1 = [];
	return Object.values(t).forEach((r$1) => {
		It$2(r$1.accounts).includes(e) && n$1.push(...r$1.events);
	}), n$1;
}
function yn(t) {
	return t.includes(":");
}
function yo(t) {
	return yn(t) ? t.split(":")[0] : t;
}
function ie$2(t) {
	var e, n$1, r$1;
	const o$1 = {};
	if (!Oe(t)) return o$1;
	for (const [i$2, s] of Object.entries(t)) {
		const c$2 = yn(i$2) ? [i$2] : s.chains, a$1 = s.methods || [], u$2 = s.events || [], l$2 = yo(i$2);
		o$1[l$2] = oa(ra({}, o$1[l$2]), {
			chains: ot(c$2, (e = o$1[l$2]) == null ? void 0 : e.chains),
			methods: ot(a$1, (n$1 = o$1[l$2]) == null ? void 0 : n$1.methods),
			events: ot(u$2, (r$1 = o$1[l$2]) == null ? void 0 : r$1.events)
		});
	}
	return o$1;
}
function mo$1(t) {
	const e = {};
	return t?.forEach((n$1) => {
		var r$1;
		const [o$1, i$2] = n$1.split(":");
		e[o$1] || (e[o$1] = {
			accounts: [],
			chains: [],
			events: [],
			methods: []
		}), e[o$1].accounts.push(n$1), (r$1 = e[o$1].chains) == null || r$1.push(`${o$1}:${i$2}`);
	}), e;
}
function ca(t, e) {
	e = e.map((r$1) => r$1.replace("did:pkh:", ""));
	const n$1 = mo$1(e);
	for (const [r$1, o$1] of Object.entries(n$1)) o$1.methods ? o$1.methods = ot(o$1.methods, t) : o$1.methods = t, o$1.events = ["chainChanged", "accountsChanged"];
	return n$1;
}
function aa(t, e) {
	var n$1, r$1, o$1, i$2, s, c$2;
	const a$1 = ie$2(t), u$2 = ie$2(e), l$2 = {}, f$4 = Object.keys(a$1).concat(Object.keys(u$2));
	for (const h$3 of f$4) l$2[h$3] = {
		chains: ot((n$1 = a$1[h$3]) == null ? void 0 : n$1.chains, (r$1 = u$2[h$3]) == null ? void 0 : r$1.chains),
		methods: ot((o$1 = a$1[h$3]) == null ? void 0 : o$1.methods, (i$2 = u$2[h$3]) == null ? void 0 : i$2.methods),
		events: ot((s = a$1[h$3]) == null ? void 0 : s.events, (c$2 = u$2[h$3]) == null ? void 0 : c$2.events)
	};
	return l$2;
}
var wo$1 = {
	INVALID_METHOD: {
		message: "Invalid method.",
		code: 1001
	},
	INVALID_EVENT: {
		message: "Invalid event.",
		code: 1002
	},
	INVALID_UPDATE_REQUEST: {
		message: "Invalid update request.",
		code: 1003
	},
	INVALID_EXTEND_REQUEST: {
		message: "Invalid extend request.",
		code: 1004
	},
	INVALID_SESSION_SETTLE_REQUEST: {
		message: "Invalid session settle request.",
		code: 1005
	},
	UNAUTHORIZED_METHOD: {
		message: "Unauthorized method.",
		code: 3001
	},
	UNAUTHORIZED_EVENT: {
		message: "Unauthorized event.",
		code: 3002
	},
	UNAUTHORIZED_UPDATE_REQUEST: {
		message: "Unauthorized update request.",
		code: 3003
	},
	UNAUTHORIZED_EXTEND_REQUEST: {
		message: "Unauthorized extend request.",
		code: 3004
	},
	USER_REJECTED: {
		message: "User rejected.",
		code: 5e3
	},
	USER_REJECTED_CHAINS: {
		message: "User rejected chains.",
		code: 5001
	},
	USER_REJECTED_METHODS: {
		message: "User rejected methods.",
		code: 5002
	},
	USER_REJECTED_EVENTS: {
		message: "User rejected events.",
		code: 5003
	},
	UNSUPPORTED_CHAINS: {
		message: "Unsupported chains.",
		code: 5100
	},
	UNSUPPORTED_METHODS: {
		message: "Unsupported methods.",
		code: 5101
	},
	UNSUPPORTED_EVENTS: {
		message: "Unsupported events.",
		code: 5102
	},
	UNSUPPORTED_ACCOUNTS: {
		message: "Unsupported accounts.",
		code: 5103
	},
	UNSUPPORTED_NAMESPACE_KEY: {
		message: "Unsupported namespace key.",
		code: 5104
	},
	USER_DISCONNECTED: {
		message: "User disconnected.",
		code: 6e3
	},
	SESSION_SETTLEMENT_FAILED: {
		message: "Session settlement failed.",
		code: 7e3
	},
	WC_METHOD_UNSUPPORTED: {
		message: "Unsupported wc_ method.",
		code: 10001
	}
}, bo$1 = {
	NOT_INITIALIZED: {
		message: "Not initialized.",
		code: 1
	},
	NO_MATCHING_KEY: {
		message: "No matching key.",
		code: 2
	},
	RESTORE_WILL_OVERRIDE: {
		message: "Restore will override.",
		code: 3
	},
	RESUBSCRIBED: {
		message: "Resubscribed.",
		code: 4
	},
	MISSING_OR_INVALID: {
		message: "Missing or invalid.",
		code: 5
	},
	EXPIRED: {
		message: "Expired.",
		code: 6
	},
	UNKNOWN_TYPE: {
		message: "Unknown type.",
		code: 7
	},
	MISMATCHED_TOPIC: {
		message: "Mismatched topic.",
		code: 8
	},
	NON_CONFORMING_NAMESPACES: {
		message: "Non conforming namespaces.",
		code: 9
	}
};
function ht$1(t, e) {
	const { message: n$1, code: r$1 } = bo$1[t];
	return {
		message: e ? `${n$1} ${e}` : n$1,
		code: r$1
	};
}
function Nt(t, e) {
	const { message: n$1, code: r$1 } = wo$1[t];
	return {
		message: e ? `${n$1} ${e}` : n$1,
		code: r$1
	};
}
function se(t, e) {
	return Array.isArray(t) ? typeof e < "u" && t.length ? t.every(e) : !0 : !1;
}
function Oe(t) {
	return Object.getPrototypeOf(t) === Object.prototype && Object.keys(t).length;
}
function Et(t) {
	return typeof t > "u";
}
function nt$1(t, e) {
	return e && Et(t) ? !0 : typeof t == "string" && !!t.trim().length;
}
function Ae$1(t, e) {
	return e && Et(t) ? !0 : typeof t == "number" && !isNaN(t);
}
function ua(t, e) {
	const { requiredNamespaces: n$1 } = e, r$1 = Object.keys(t.namespaces), o$1 = Object.keys(n$1);
	let i$2 = !0;
	return gt$2(o$1, r$1) ? (r$1.forEach((s) => {
		const { accounts: c$2, methods: a$1, events: u$2 } = t.namespaces[s], l$2 = It$2(c$2), f$4 = n$1[s];
		(!gt$2(ue$2(s, f$4), l$2) || !gt$2(f$4.methods, a$1) || !gt$2(f$4.events, u$2)) && (i$2 = !1);
	}), i$2) : !1;
}
function ce$2(t) {
	return nt$1(t, !1) && t.includes(":") ? t.split(":").length === 2 : !1;
}
function Eo$1(t) {
	if (nt$1(t, !1) && t.includes(":")) {
		const e = t.split(":");
		if (e.length === 3) {
			const n$1 = e[0] + ":" + e[1];
			return !!e[2] && ce$2(n$1);
		}
	}
	return !1;
}
function fa(t) {
	function e(n$1) {
		try {
			return typeof new URL(n$1) < "u";
		} catch {
			return !1;
		}
	}
	try {
		if (nt$1(t, !1)) {
			if (e(t)) return !0;
			const n$1 = je$2(t);
			return e(n$1);
		}
	} catch {}
	return !1;
}
function la(t) {
	var e;
	return (e = t?.proposer) == null ? void 0 : e.publicKey;
}
function da(t) {
	return t?.topic;
}
function ha(t, e) {
	let n$1 = null;
	return nt$1(t?.publicKey, !1) || (n$1 = ht$1("MISSING_OR_INVALID", `${e} controller public key should be a string`)), n$1;
}
function mn$1(t) {
	let e = !0;
	return se(t) ? t.length && (e = t.every((n$1) => nt$1(n$1, !1))) : e = !1, e;
}
function vo$1(t, e, n$1) {
	let r$1 = null;
	return se(e) && e.length ? e.forEach((o$1) => {
		r$1 || ce$2(o$1) || (r$1 = Nt("UNSUPPORTED_CHAINS", `${n$1}, chain ${o$1} should be a string and conform to "namespace:chainId" format`));
	}) : ce$2(t) || (r$1 = Nt("UNSUPPORTED_CHAINS", `${n$1}, chains must be defined as "namespace:chainId" e.g. "eip155:1": {...} in the namespace key OR as an array of CAIP-2 chainIds e.g. eip155: { chains: ["eip155:1", "eip155:5"] }`)), r$1;
}
function xo$1(t, e, n$1) {
	let r$1 = null;
	return Object.entries(t).forEach(([o$1, i$2]) => {
		if (r$1) return;
		const s = vo$1(o$1, ue$2(o$1, i$2), `${e} ${n$1}`);
		s && (r$1 = s);
	}), r$1;
}
function So$1(t, e) {
	let n$1 = null;
	return se(t) ? t.forEach((r$1) => {
		n$1 || Eo$1(r$1) || (n$1 = Nt("UNSUPPORTED_ACCOUNTS", `${e}, account ${r$1} should be a string and conform to "namespace:chainId:address" format`));
	}) : n$1 = Nt("UNSUPPORTED_ACCOUNTS", `${e}, accounts should be an array of strings conforming to "namespace:chainId:address" format`), n$1;
}
function Oo$1(t, e) {
	let n$1 = null;
	return Object.values(t).forEach((r$1) => {
		if (n$1) return;
		const o$1 = So$1(r$1?.accounts, `${e} namespace`);
		o$1 && (n$1 = o$1);
	}), n$1;
}
function Ao$1(t, e) {
	let n$1 = null;
	return mn$1(t?.methods) ? mn$1(t?.events) || (n$1 = Nt("UNSUPPORTED_EVENTS", `${e}, events should be an array of strings or empty array for no events`)) : n$1 = Nt("UNSUPPORTED_METHODS", `${e}, methods should be an array of strings or empty array for no methods`), n$1;
}
function wn$1(t, e) {
	let n$1 = null;
	return Object.values(t).forEach((r$1) => {
		if (n$1) return;
		const o$1 = Ao$1(r$1, `${e}, namespace`);
		o$1 && (n$1 = o$1);
	}), n$1;
}
function pa(t, e, n$1) {
	let r$1 = null;
	if (t && Oe(t)) {
		const o$1 = wn$1(t, e);
		o$1 && (r$1 = o$1);
		const i$2 = xo$1(t, e, n$1);
		i$2 && (r$1 = i$2);
	} else r$1 = ht$1("MISSING_OR_INVALID", `${e}, ${n$1} should be an object with data`);
	return r$1;
}
function Bo(t, e) {
	let n$1 = null;
	if (t && Oe(t)) {
		const r$1 = wn$1(t, e);
		r$1 && (n$1 = r$1);
		const o$1 = Oo$1(t, e);
		o$1 && (n$1 = o$1);
	} else n$1 = ht$1("MISSING_OR_INVALID", `${e}, namespaces should be an object with data`);
	return n$1;
}
function Io(t) {
	return nt$1(t.protocol, !0);
}
function ga(t, e) {
	let n$1 = !1;
	return e && !t ? n$1 = !0 : t && se(t) && t.length && t.forEach((r$1) => {
		n$1 = Io(r$1);
	}), n$1;
}
function ya(t) {
	return typeof t == "number";
}
function ma(t) {
	return typeof t < "u" && true;
}
function wa(t) {
	return !(!t || typeof t != "object" || !t.code || !Ae$1(t.code, !1) || !t.message || !nt$1(t.message, !1));
}
function ba(t) {
	return !(Et(t) || !nt$1(t.method, !1));
}
function Ea(t) {
	return !(Et(t) || Et(t.result) && Et(t.error) || !Ae$1(t.id, !1) || !nt$1(t.jsonrpc, !1));
}
function va(t) {
	return !(Et(t) || !nt$1(t.name, !1));
}
function xa(t, e) {
	return !(!ce$2(e) || !ho$1(t).includes(e));
}
function Sa(t, e, n$1) {
	return nt$1(n$1, !1) ? po$1(t, e).includes(n$1) : !1;
}
function Oa(t, e, n$1) {
	return nt$1(n$1, !1) ? go$1(t, e).includes(n$1) : !1;
}
function No(t, e, n$1) {
	let r$1 = null;
	const o$1 = Aa(t), i$2 = Ba(e), s = Object.keys(o$1), c$2 = Object.keys(i$2), a$1 = Uo$1(Object.keys(t)), u$2 = Uo$1(Object.keys(e)), l$2 = a$1.filter((f$4) => !u$2.includes(f$4));
	return l$2.length && (r$1 = ht$1("NON_CONFORMING_NAMESPACES", `${n$1} namespaces keys don't satisfy requiredNamespaces.
      Required: ${l$2.toString()}
      Received: ${Object.keys(e).toString()}`)), gt$2(s, c$2) || (r$1 = ht$1("NON_CONFORMING_NAMESPACES", `${n$1} namespaces chains don't satisfy required namespaces.
      Required: ${s.toString()}
      Approved: ${c$2.toString()}`)), Object.keys(e).forEach((f$4) => {
		if (!f$4.includes(":") || r$1) return;
		const h$3 = It$2(e[f$4].accounts);
		h$3.includes(f$4) || (r$1 = ht$1("NON_CONFORMING_NAMESPACES", `${n$1} namespaces accounts don't satisfy namespace accounts for ${f$4}
        Required: ${f$4}
        Approved: ${h$3.toString()}`));
	}), s.forEach((f$4) => {
		r$1 || (gt$2(o$1[f$4].methods, i$2[f$4].methods) ? gt$2(o$1[f$4].events, i$2[f$4].events) || (r$1 = ht$1("NON_CONFORMING_NAMESPACES", `${n$1} namespaces events don't satisfy namespace events for ${f$4}`)) : r$1 = ht$1("NON_CONFORMING_NAMESPACES", `${n$1} namespaces methods don't satisfy namespace methods for ${f$4}`));
	}), r$1;
}
function Aa(t) {
	const e = {};
	return Object.keys(t).forEach((n$1) => {
		var r$1;
		n$1.includes(":") ? e[n$1] = t[n$1] : (r$1 = t[n$1].chains) == null || r$1.forEach((o$1) => {
			e[o$1] = {
				methods: t[n$1].methods,
				events: t[n$1].events
			};
		});
	}), e;
}
function Uo$1(t) {
	return [...new Set(t.map((e) => e.includes(":") ? e.split(":")[0] : e))];
}
function Ba(t) {
	const e = {};
	return Object.keys(t).forEach((n$1) => {
		if (n$1.includes(":")) e[n$1] = t[n$1];
		else It$2(t[n$1].accounts)?.forEach((o$1) => {
			e[o$1] = {
				accounts: t[n$1].accounts.filter((i$2) => i$2.includes(`${o$1}:`)),
				methods: t[n$1].methods,
				events: t[n$1].events
			};
		});
	}), e;
}
function Ia(t, e) {
	return Ae$1(t, !1) && t <= e.max && t >= e.min;
}
function Na() {
	const t = xt$2();
	return new Promise((e) => {
		switch (t) {
			case Y$2.browser:
				e(To$1());
				break;
			case Y$2.reactNative:
				e(Ro$1());
				break;
			case Y$2.node:
				e(_o$1());
				break;
			default: e(!0);
		}
	});
}
function To$1() {
	return Tt$1() && navigator?.onLine;
}
async function Ro$1() {
	if (pt$1() && typeof global < "u" && global != null && global.NetInfo) return (await (global == null ? void 0 : global.NetInfo.fetch()))?.isConnected;
	return !0;
}
function _o$1() {
	return !0;
}
function Ua(t) {
	switch (xt$2()) {
		case Y$2.browser:
			$o$1(t);
			break;
		case Y$2.reactNative:
			Lo$1(t);
			break;
		case Y$2.node: break;
	}
}
function $o$1(t) {
	!pt$1() && Tt$1() && (window.addEventListener("online", () => t(!0)), window.addEventListener("offline", () => t(!1)));
}
function Lo$1(t) {
	pt$1() && typeof global < "u" && global != null && global.NetInfo && global?.NetInfo.addEventListener((e) => t(e?.isConnected));
}
function Ta() {
	var t;
	return Tt$1() && (0, import_cjs$4.getDocument)() ? ((t = (0, import_cjs$4.getDocument)()) == null ? void 0 : t.visibilityState) === "visible" : !0;
}
var bn$1 = {};
var Ra = class {
	static get(e) {
		return bn$1[e];
	}
	static set(e, n$1) {
		bn$1[e] = n$1;
	}
	static delete(e) {
		delete bn$1[e];
	}
};
function allocUnsafe(size$4 = 0) {
	if (globalThis.Buffer != null && globalThis.Buffer.allocUnsafe != null) return globalThis.Buffer.allocUnsafe(size$4);
	return new Uint8Array(size$4);
}
function createCodec(name, prefix, encode, decode) {
	return {
		name,
		prefix,
		encoder: {
			name,
			prefix,
			encode
		},
		decoder: { decode }
	};
}
var string = createCodec("utf8", "u", (buf) => {
	return "u" + new TextDecoder("utf8").decode(buf);
}, (str) => {
	return new TextEncoder().encode(str.substring(1));
});
var ascii = createCodec("ascii", "a", (buf) => {
	let string$2 = "a";
	for (let i$2 = 0; i$2 < buf.length; i$2++) string$2 += String.fromCharCode(buf[i$2]);
	return string$2;
}, (str) => {
	str = str.substring(1);
	const buf = allocUnsafe(str.length);
	for (let i$2 = 0; i$2 < str.length; i$2++) buf[i$2] = str.charCodeAt(i$2);
	return buf;
});
var bases_default = {
	utf8: string,
	"utf-8": string,
	hex: bases.base16,
	latin1: ascii,
	ascii,
	binary: ascii,
	...bases
};
function toString(array, encoding = "utf8") {
	const base$1 = bases_default[encoding];
	if (!base$1) throw new Error(`Unsupported encoding "${encoding}"`);
	if ((encoding === "utf8" || encoding === "utf-8") && globalThis.Buffer != null && globalThis.Buffer.from != null) return globalThis.Buffer.from(array.buffer, array.byteOffset, array.byteLength).toString("utf8");
	return base$1.encoder.encode(array).substring(1);
}
var import_events$2 = /* @__PURE__ */ __toESM(require_events());
var import_cjs$1 = /* @__PURE__ */ __toESM(require_cjs());
var import_cjs$2 = /* @__PURE__ */ __toESM(require_cjs$1()), he$1 = "core", B$1 = `wc@2:${he$1}:`, Et$2 = {
	name: he$1,
	logger: "error"
}, It$1 = { database: ":memory:" }, Tt$2 = "crypto", ke$2 = "client_ed25519_seed", Ct = import_cjs$1.ONE_DAY, Pt$1 = "keychain", Ot$1 = "messages", je$1 = import_cjs$1.SIX_HOURS, At$1 = "publisher", $t = "relayer", C$1 = {
	message: "relayer_message",
	message_ack: "relayer_message_ack",
	connect: "relayer_connect",
	disconnect: "relayer_disconnect",
	error: "relayer_error",
	connection_stalled: "relayer_connection_stalled",
	transport_closed: "relayer_transport_closed",
	publish: "relayer_publish"
}, L$1 = {
	payload: "payload",
	connect: "connect",
	disconnect: "disconnect",
	error: "error"
}, _e$3 = "2.21.0", Q$1 = {
	link_mode: "link_mode",
	relay: "relay"
}, le$1 = {
	inbound: "inbound",
	outbound: "outbound"
}, jt$1 = "WALLETCONNECT_CLIENT_ID", $$2 = {
	created: "subscription_created",
	deleted: "subscription_deleted",
	expired: "subscription_expired",
	disabled: "subscription_disabled",
	sync: "subscription_sync",
	resubscribed: "subscription_resubscribed"
};
import_cjs$1.THIRTY_DAYS;
var Ut$1 = "subscription";
import_cjs$1.FIVE_SECONDS * 1e3;
var Mt$1 = "pairing";
import_cjs$1.THIRTY_DAYS;
var se$2 = {
	wc_pairingDelete: {
		req: {
			ttl: import_cjs$1.ONE_DAY,
			prompt: !1,
			tag: 1e3
		},
		res: {
			ttl: import_cjs$1.ONE_DAY,
			prompt: !1,
			tag: 1001
		}
	},
	wc_pairingPing: {
		req: {
			ttl: import_cjs$1.THIRTY_SECONDS,
			prompt: !1,
			tag: 1002
		},
		res: {
			ttl: import_cjs$1.THIRTY_SECONDS,
			prompt: !1,
			tag: 1003
		}
	},
	unregistered_method: {
		req: {
			ttl: import_cjs$1.ONE_DAY,
			prompt: !1,
			tag: 0
		},
		res: {
			ttl: import_cjs$1.ONE_DAY,
			prompt: !1,
			tag: 0
		}
	}
}, re$1 = {
	create: "pairing_create",
	expire: "pairing_expire",
	delete: "pairing_delete",
	ping: "pairing_ping"
}, F$1 = {
	created: "history_created",
	updated: "history_updated",
	deleted: "history_deleted",
	sync: "history_sync"
}, Bt$2 = "history", qt$2 = "expirer", M$1 = {
	created: "expirer_created",
	deleted: "expirer_deleted",
	expired: "expirer_expired",
	sync: "expirer_sync"
};
import_cjs$1.ONE_DAY;
var Wt$1 = "verify-api", Zs = "https://verify.walletconnect.com", Ht = "https://verify.walletconnect.org", ue$1 = Ht, Yt$1 = `${ue$1}/v3`, Jt$1 = [Zs, Ht], Xt$1 = "echo", Zt$1 = "https://echo.walletconnect.com", G = {
	pairing_started: "pairing_started",
	pairing_uri_validation_success: "pairing_uri_validation_success",
	pairing_uri_not_expired: "pairing_uri_not_expired",
	store_new_pairing: "store_new_pairing",
	subscribing_pairing_topic: "subscribing_pairing_topic",
	subscribe_pairing_topic_success: "subscribe_pairing_topic_success",
	existing_pairing: "existing_pairing",
	pairing_not_expired: "pairing_not_expired",
	emit_inactive_pairing: "emit_inactive_pairing",
	emit_session_proposal: "emit_session_proposal",
	subscribing_to_pairing_topic: "subscribing_to_pairing_topic"
}, Y$1 = {
	no_wss_connection: "no_wss_connection",
	no_internet_connection: "no_internet_connection",
	malformed_pairing_uri: "malformed_pairing_uri",
	active_pairing_already_exists: "active_pairing_already_exists",
	subscribe_pairing_topic_failure: "subscribe_pairing_topic_failure",
	pairing_expired: "pairing_expired",
	proposal_expired: "proposal_expired",
	proposal_listener_not_found: "proposal_listener_not_found"
}, er = {
	session_approve_started: "session_approve_started",
	proposal_not_expired: "proposal_not_expired",
	session_namespaces_validation_success: "session_namespaces_validation_success",
	create_session_topic: "create_session_topic",
	subscribing_session_topic: "subscribing_session_topic",
	subscribe_session_topic_success: "subscribe_session_topic_success",
	publishing_session_approve: "publishing_session_approve",
	session_approve_publish_success: "session_approve_publish_success",
	store_session: "store_session",
	publishing_session_settle: "publishing_session_settle",
	session_settle_publish_success: "session_settle_publish_success"
}, tr = {
	no_internet_connection: "no_internet_connection",
	no_wss_connection: "no_wss_connection",
	proposal_expired: "proposal_expired",
	subscribe_session_topic_failure: "subscribe_session_topic_failure",
	session_approve_publish_failure: "session_approve_publish_failure",
	session_settle_publish_failure: "session_settle_publish_failure",
	session_approve_namespace_validation_failure: "session_approve_namespace_validation_failure",
	proposal_not_found: "proposal_not_found"
}, ir = {
	authenticated_session_approve_started: "authenticated_session_approve_started",
	authenticated_session_not_expired: "authenticated_session_not_expired",
	chains_caip2_compliant: "chains_caip2_compliant",
	chains_evm_compliant: "chains_evm_compliant",
	create_authenticated_session_topic: "create_authenticated_session_topic",
	cacaos_verified: "cacaos_verified",
	store_authenticated_session: "store_authenticated_session",
	subscribing_authenticated_session_topic: "subscribing_authenticated_session_topic",
	subscribe_authenticated_session_topic_success: "subscribe_authenticated_session_topic_success",
	publishing_authenticated_session_approve: "publishing_authenticated_session_approve",
	authenticated_session_approve_publish_success: "authenticated_session_approve_publish_success"
}, sr = {
	no_internet_connection: "no_internet_connection",
	no_wss_connection: "no_wss_connection",
	missing_session_authenticate_request: "missing_session_authenticate_request",
	session_authenticate_request_expired: "session_authenticate_request_expired",
	chains_caip2_compliant_failure: "chains_caip2_compliant_failure",
	chains_evm_compliant_failure: "chains_evm_compliant_failure",
	invalid_cacao: "invalid_cacao",
	subscribe_authenticated_session_topic_failure: "subscribe_authenticated_session_topic_failure",
	authenticated_session_approve_publish_failure: "authenticated_session_approve_publish_failure",
	authenticated_session_pending_request_not_found: "authenticated_session_pending_request_not_found"
}, Qt$1 = .1, ei$1 = "event-client", ii = "https://pulse.walletconnect.org/batch";
function rr(r$1, e) {
	if (r$1.length >= 255) throw new TypeError("Alphabet too long");
	for (var t = new Uint8Array(256), i$2 = 0; i$2 < t.length; i$2++) t[i$2] = 255;
	for (var s = 0; s < r$1.length; s++) {
		var n$1 = r$1.charAt(s), o$1 = n$1.charCodeAt(0);
		if (t[o$1] !== 255) throw new TypeError(n$1 + " is ambiguous");
		t[o$1] = s;
	}
	var a$1 = r$1.length, c$2 = r$1.charAt(0), h$3 = Math.log(a$1) / Math.log(256), l$2 = Math.log(256) / Math.log(a$1);
	function d$2(u$2) {
		if (u$2 instanceof Uint8Array || (ArrayBuffer.isView(u$2) ? u$2 = new Uint8Array(u$2.buffer, u$2.byteOffset, u$2.byteLength) : Array.isArray(u$2) && (u$2 = Uint8Array.from(u$2))), !(u$2 instanceof Uint8Array)) throw new TypeError("Expected Uint8Array");
		if (u$2.length === 0) return "";
		for (var b$3 = 0, x$1 = 0, I$2 = 0, D$1 = u$2.length; I$2 !== D$1 && u$2[I$2] === 0;) I$2++, b$3++;
		for (var j$1 = (D$1 - I$2) * l$2 + 1 >>> 0, T$1 = new Uint8Array(j$1); I$2 !== D$1;) {
			for (var q$2 = u$2[I$2], J$2 = 0, K$2 = j$1 - 1; (q$2 !== 0 || J$2 < x$1) && K$2 !== -1; K$2--, J$2++) q$2 += 256 * T$1[K$2] >>> 0, T$1[K$2] = q$2 % a$1 >>> 0, q$2 = q$2 / a$1 >>> 0;
			if (q$2 !== 0) throw new Error("Non-zero carry");
			x$1 = J$2, I$2++;
		}
		for (var H$2 = j$1 - x$1; H$2 !== j$1 && T$1[H$2] === 0;) H$2++;
		for (var me$3 = c$2.repeat(b$3); H$2 < j$1; ++H$2) me$3 += r$1.charAt(T$1[H$2]);
		return me$3;
	}
	function g(u$2) {
		if (typeof u$2 != "string") throw new TypeError("Expected String");
		if (u$2.length === 0) return new Uint8Array();
		var b$3 = 0;
		if (u$2[b$3] !== " ") {
			for (var x$1 = 0, I$2 = 0; u$2[b$3] === c$2;) x$1++, b$3++;
			for (var D$1 = (u$2.length - b$3) * h$3 + 1 >>> 0, j$1 = new Uint8Array(D$1); u$2[b$3];) {
				var T$1 = t[u$2.charCodeAt(b$3)];
				if (T$1 === 255) return;
				for (var q$2 = 0, J$2 = D$1 - 1; (T$1 !== 0 || q$2 < I$2) && J$2 !== -1; J$2--, q$2++) T$1 += a$1 * j$1[J$2] >>> 0, j$1[J$2] = T$1 % 256 >>> 0, T$1 = T$1 / 256 >>> 0;
				if (T$1 !== 0) throw new Error("Non-zero carry");
				I$2 = q$2, b$3++;
			}
			if (u$2[b$3] !== " ") {
				for (var K$2 = D$1 - I$2; K$2 !== D$1 && j$1[K$2] === 0;) K$2++;
				for (var H$2 = new Uint8Array(x$1 + (D$1 - K$2)), me$3 = x$1; K$2 !== D$1;) H$2[me$3++] = j$1[K$2++];
				return H$2;
			}
		}
	}
	function _(u$2) {
		var b$3 = g(u$2);
		if (b$3) return b$3;
		throw new Error(`Non-${e} character`);
	}
	return {
		encode: d$2,
		decodeUnsafe: g,
		decode: _
	};
}
var nr = rr, or = nr;
var si$1 = (r$1) => {
	if (r$1 instanceof Uint8Array && r$1.constructor.name === "Uint8Array") return r$1;
	if (r$1 instanceof ArrayBuffer) return new Uint8Array(r$1);
	if (ArrayBuffer.isView(r$1)) return new Uint8Array(r$1.buffer, r$1.byteOffset, r$1.byteLength);
	throw new Error("Unknown type, must be binary type");
}, ar = (r$1) => new TextEncoder().encode(r$1), cr = (r$1) => new TextDecoder().decode(r$1);
var hr$1 = class {
	constructor(e, t, i$2) {
		this.name = e, this.prefix = t, this.baseEncode = i$2;
	}
	encode(e) {
		if (e instanceof Uint8Array) return `${this.prefix}${this.baseEncode(e)}`;
		throw Error("Unknown type, must be binary type");
	}
};
var lr = class {
	constructor(e, t, i$2) {
		if (this.name = e, this.prefix = t, t.codePointAt(0) === void 0) throw new Error("Invalid prefix character");
		this.prefixCodePoint = t.codePointAt(0), this.baseDecode = i$2;
	}
	decode(e) {
		if (typeof e == "string") {
			if (e.codePointAt(0) !== this.prefixCodePoint) throw Error(`Unable to decode multibase string ${JSON.stringify(e)}, ${this.name} decoder only supports inputs prefixed with ${this.prefix}`);
			return this.baseDecode(e.slice(this.prefix.length));
		} else throw Error("Can only multibase decode strings");
	}
	or(e) {
		return ri$1(this, e);
	}
};
var ur = class {
	constructor(e) {
		this.decoders = e;
	}
	or(e) {
		return ri$1(this, e);
	}
	decode(e) {
		const t = e[0], i$2 = this.decoders[t];
		if (i$2) return i$2.decode(e);
		throw RangeError(`Unable to decode multibase string ${JSON.stringify(e)}, only inputs prefixed with ${Object.keys(this.decoders)} are supported`);
	}
};
var ri$1 = (r$1, e) => new ur({
	...r$1.decoders || { [r$1.prefix]: r$1 },
	...e.decoders || { [e.prefix]: e }
});
var dr$1 = class {
	constructor(e, t, i$2, s) {
		this.name = e, this.prefix = t, this.baseEncode = i$2, this.baseDecode = s, this.encoder = new hr$1(e, t, i$2), this.decoder = new lr(e, t, s);
	}
	encode(e) {
		return this.encoder.encode(e);
	}
	decode(e) {
		return this.decoder.decode(e);
	}
};
var Ee$2 = ({ name: r$1, prefix: e, encode: t, decode: i$2 }) => new dr$1(r$1, e, t, i$2), de$1 = ({ prefix: r$1, name: e, alphabet: t }) => {
	const { encode: i$2, decode: s } = or(t, e);
	return Ee$2({
		prefix: r$1,
		name: e,
		encode: i$2,
		decode: (n$1) => si$1(s(n$1))
	});
}, gr = (r$1, e, t, i$2) => {
	const s = {};
	for (let l$2 = 0; l$2 < e.length; ++l$2) s[e[l$2]] = l$2;
	let n$1 = r$1.length;
	for (; r$1[n$1 - 1] === "=";) --n$1;
	const o$1 = new Uint8Array(n$1 * t / 8 | 0);
	let a$1 = 0, c$2 = 0, h$3 = 0;
	for (let l$2 = 0; l$2 < n$1; ++l$2) {
		const d$2 = s[r$1[l$2]];
		if (d$2 === void 0) throw new SyntaxError(`Non-${i$2} character`);
		c$2 = c$2 << t | d$2, a$1 += t, a$1 >= 8 && (a$1 -= 8, o$1[h$3++] = 255 & c$2 >> a$1);
	}
	if (a$1 >= t || 255 & c$2 << 8 - a$1) throw new SyntaxError("Unexpected end of data");
	return o$1;
}, pr = (r$1, e, t) => {
	const i$2 = e[e.length - 1] === "=", s = (1 << t) - 1;
	let n$1 = "", o$1 = 0, a$1 = 0;
	for (let c$2 = 0; c$2 < r$1.length; ++c$2) for (a$1 = a$1 << 8 | r$1[c$2], o$1 += 8; o$1 > t;) o$1 -= t, n$1 += e[s & a$1 >> o$1];
	if (o$1 && (n$1 += e[s & a$1 << t - o$1]), i$2) for (; n$1.length * t & 7;) n$1 += "=";
	return n$1;
}, P$1 = ({ name: r$1, prefix: e, bitsPerChar: t, alphabet: i$2 }) => Ee$2({
	prefix: e,
	name: r$1,
	encode(s) {
		return pr(s, i$2, t);
	},
	decode(s) {
		return gr(s, i$2, t, r$1);
	}
}), yr = Ee$2({
	prefix: "\0",
	name: "identity",
	encode: (r$1) => cr(r$1),
	decode: (r$1) => ar(r$1)
});
var br = Object.freeze({
	__proto__: null,
	identity: yr
});
var mr = P$1({
	prefix: "0",
	name: "base2",
	alphabet: "01",
	bitsPerChar: 1
});
var fr = Object.freeze({
	__proto__: null,
	base2: mr
});
var Dr = P$1({
	prefix: "7",
	name: "base8",
	alphabet: "01234567",
	bitsPerChar: 3
});
var vr = Object.freeze({
	__proto__: null,
	base8: Dr
});
var wr = de$1({
	prefix: "9",
	name: "base10",
	alphabet: "0123456789"
});
var _r = Object.freeze({
	__proto__: null,
	base10: wr
});
var Er = P$1({
	prefix: "f",
	name: "base16",
	alphabet: "0123456789abcdef",
	bitsPerChar: 4
}), Ir = P$1({
	prefix: "F",
	name: "base16upper",
	alphabet: "0123456789ABCDEF",
	bitsPerChar: 4
});
var Tr = Object.freeze({
	__proto__: null,
	base16: Er,
	base16upper: Ir
});
var Cr = P$1({
	prefix: "b",
	name: "base32",
	alphabet: "abcdefghijklmnopqrstuvwxyz234567",
	bitsPerChar: 5
}), Pr = P$1({
	prefix: "B",
	name: "base32upper",
	alphabet: "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567",
	bitsPerChar: 5
}), Sr = P$1({
	prefix: "c",
	name: "base32pad",
	alphabet: "abcdefghijklmnopqrstuvwxyz234567=",
	bitsPerChar: 5
}), Or = P$1({
	prefix: "C",
	name: "base32padupper",
	alphabet: "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567=",
	bitsPerChar: 5
}), Rr = P$1({
	prefix: "v",
	name: "base32hex",
	alphabet: "0123456789abcdefghijklmnopqrstuv",
	bitsPerChar: 5
}), Ar = P$1({
	prefix: "V",
	name: "base32hexupper",
	alphabet: "0123456789ABCDEFGHIJKLMNOPQRSTUV",
	bitsPerChar: 5
}), xr = P$1({
	prefix: "t",
	name: "base32hexpad",
	alphabet: "0123456789abcdefghijklmnopqrstuv=",
	bitsPerChar: 5
}), Nr = P$1({
	prefix: "T",
	name: "base32hexpadupper",
	alphabet: "0123456789ABCDEFGHIJKLMNOPQRSTUV=",
	bitsPerChar: 5
}), $r = P$1({
	prefix: "h",
	name: "base32z",
	alphabet: "ybndrfg8ejkmcpqxot1uwisza345h769",
	bitsPerChar: 5
});
var zr = Object.freeze({
	__proto__: null,
	base32: Cr,
	base32upper: Pr,
	base32pad: Sr,
	base32padupper: Or,
	base32hex: Rr,
	base32hexupper: Ar,
	base32hexpad: xr,
	base32hexpadupper: Nr,
	base32z: $r
});
var Lr = de$1({
	prefix: "k",
	name: "base36",
	alphabet: "0123456789abcdefghijklmnopqrstuvwxyz"
}), kr = de$1({
	prefix: "K",
	name: "base36upper",
	alphabet: "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ"
});
var jr = Object.freeze({
	__proto__: null,
	base36: Lr,
	base36upper: kr
});
var Ur = de$1({
	name: "base58btc",
	prefix: "z",
	alphabet: "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz"
}), Fr = de$1({
	name: "base58flickr",
	prefix: "Z",
	alphabet: "123456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ"
});
var Mr = Object.freeze({
	__proto__: null,
	base58btc: Ur,
	base58flickr: Fr
});
var Kr = P$1({
	prefix: "m",
	name: "base64",
	alphabet: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",
	bitsPerChar: 6
}), Br = P$1({
	prefix: "M",
	name: "base64pad",
	alphabet: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
	bitsPerChar: 6
}), Vr = P$1({
	prefix: "u",
	name: "base64url",
	alphabet: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_",
	bitsPerChar: 6
}), qr = P$1({
	prefix: "U",
	name: "base64urlpad",
	alphabet: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_=",
	bitsPerChar: 6
});
var Gr = Object.freeze({
	__proto__: null,
	base64: Kr,
	base64pad: Br,
	base64url: Vr,
	base64urlpad: qr
});
var ni$1 = Array.from("🚀🪐☄🛰🌌🌑🌒🌓🌔🌕🌖🌗🌘🌍🌏🌎🐉☀💻🖥💾💿😂❤😍🤣😊🙏💕😭😘👍😅👏😁🔥🥰💔💖💙😢🤔😆🙄💪😉☺👌🤗💜😔😎😇🌹🤦🎉💞✌✨🤷😱😌🌸🙌😋💗💚😏💛🙂💓🤩😄😀🖤😃💯🙈👇🎶😒🤭❣😜💋👀😪😑💥🙋😞😩😡🤪👊🥳😥🤤👉💃😳✋😚😝😴🌟😬🙃🍀🌷😻😓⭐✅🥺🌈😈🤘💦✔😣🏃💐☹🎊💘😠☝😕🌺🎂🌻😐🖕💝🙊😹🗣💫💀👑🎵🤞😛🔴😤🌼😫⚽🤙☕🏆🤫👈😮🙆🍻🍃🐶💁😲🌿🧡🎁⚡🌞🎈❌✊👋😰🤨😶🤝🚶💰🍓💢🤟🙁🚨💨🤬✈🎀🍺🤓😙💟🌱😖👶🥴▶➡❓💎💸⬇😨🌚🦋😷🕺⚠🙅😟😵👎🤲🤠🤧📌🔵💅🧐🐾🍒😗🤑🌊🤯🐷☎💧😯💆👆🎤🙇🍑❄🌴💣🐸💌📍🥀🤢👅💡💩👐📸👻🤐🤮🎼🥵🚩🍎🍊👼💍📣🥂"), Wr = ni$1.reduce((r$1, e, t) => (r$1[t] = e, r$1), []), Hr = ni$1.reduce((r$1, e, t) => (r$1[e.codePointAt(0)] = t, r$1), []);
function Yr(r$1) {
	return r$1.reduce((e, t) => (e += Wr[t], e), "");
}
function Jr(r$1) {
	const e = [];
	for (const t of r$1) {
		const i$2 = Hr[t.codePointAt(0)];
		if (i$2 === void 0) throw new Error(`Non-base256emoji character: ${t}`);
		e.push(i$2);
	}
	return new Uint8Array(e);
}
var Xr = Ee$2({
	prefix: "🚀",
	name: "base256emoji",
	encode: Yr,
	decode: Jr
}), Zr = Object.freeze({
	__proto__: null,
	base256emoji: Xr
}), Qr = ai, tn = -128, sn$1 = Math.pow(2, 31);
function ai(r$1, e, t) {
	e = e || [], t = t || 0;
	for (var i$2 = t; r$1 >= sn$1;) e[t++] = r$1 & 255 | 128, r$1 /= 128;
	for (; r$1 & tn;) e[t++] = r$1 & 255 | 128, r$1 >>>= 7;
	return e[t] = r$1 | 0, ai.bytes = t - i$2 + 1, e;
}
var rn = Me$2;
function Me$2(r$1, i$2) {
	var t = 0, i$2 = i$2 || 0, s = 0, n$1 = i$2, o$1, a$1 = r$1.length;
	do {
		if (n$1 >= a$1) throw Me$2.bytes = 0, /* @__PURE__ */ new RangeError("Could not decode varint");
		o$1 = r$1[n$1++], t += s < 28 ? (o$1 & 127) << s : (o$1 & 127) * Math.pow(2, s), s += 7;
	} while (o$1 >= 128);
	return Me$2.bytes = n$1 - i$2, t;
}
var on = Math.pow(2, 7), an = Math.pow(2, 14), cn = Math.pow(2, 21), hn = Math.pow(2, 28), ln = Math.pow(2, 35), un = Math.pow(2, 42), dn = Math.pow(2, 49), gn = Math.pow(2, 56), pn = Math.pow(2, 63), yn$1 = function(r$1) {
	return r$1 < on ? 1 : r$1 < an ? 2 : r$1 < cn ? 3 : r$1 < hn ? 4 : r$1 < ln ? 5 : r$1 < un ? 6 : r$1 < dn ? 7 : r$1 < gn ? 8 : r$1 < pn ? 9 : 10;
}, bn = {
	encode: Qr,
	decode: rn,
	encodingLength: yn$1
}, hi = bn;
var li$1 = (r$1, e, t = 0) => (hi.encode(r$1, e, t), e), ui = (r$1) => hi.encodingLength(r$1), Ke$2 = (r$1, e) => {
	const t = e.byteLength, i$2 = ui(r$1), s = i$2 + ui(t), n$1 = new Uint8Array(s + t);
	return li$1(r$1, n$1, 0), li$1(t, n$1, i$2), n$1.set(e, s), new mn(r$1, t, e, n$1);
};
var mn = class {
	constructor(e, t, i$2, s) {
		this.code = e, this.size = t, this.digest = i$2, this.bytes = s;
	}
};
var di = ({ name: r$1, code: e, encode: t }) => new fn(r$1, e, t);
var fn = class {
	constructor(e, t, i$2) {
		this.name = e, this.code = t, this.encode = i$2;
	}
	digest(e) {
		if (e instanceof Uint8Array) {
			const t = this.encode(e);
			return t instanceof Uint8Array ? Ke$2(this.code, t) : t.then((i$2) => Ke$2(this.code, i$2));
		} else throw Error("Unknown type, must be binary type");
	}
};
var gi$1 = (r$1) => async (e) => new Uint8Array(await crypto.subtle.digest(r$1, e)), Dn = di({
	name: "sha2-256",
	code: 18,
	encode: gi$1("SHA-256")
}), vn = di({
	name: "sha2-512",
	code: 19,
	encode: gi$1("SHA-512")
});
var wn = Object.freeze({
	__proto__: null,
	sha256: Dn,
	sha512: vn
}), _n = "identity", yi$1 = si$1, En = (r$1) => Ke$2(0, yi$1(r$1)), In = {
	code: 0,
	name: _n,
	encode: yi$1,
	digest: En
};
var Tn = Object.freeze({
	__proto__: null,
	identity: In
});
new TextEncoder(), new TextDecoder();
var bi$1 = {
	...br,
	...fr,
	...vr,
	..._r,
	...Tr,
	...zr,
	...jr,
	...Mr,
	...Gr,
	...Zr
};
({
	...wn,
	...Tn
});
function Cn(r$1 = 0) {
	return globalThis.Buffer != null && globalThis.Buffer.allocUnsafe != null ? globalThis.Buffer.allocUnsafe(r$1) : new Uint8Array(r$1);
}
function mi$1(r$1, e, t, i$2) {
	return {
		name: r$1,
		prefix: e,
		encoder: {
			name: r$1,
			prefix: e,
			encode: t
		},
		decoder: { decode: i$2 }
	};
}
var fi$1 = mi$1("utf8", "u", (r$1) => "u" + new TextDecoder("utf8").decode(r$1), (r$1) => new TextEncoder().encode(r$1.substring(1))), Be$2 = mi$1("ascii", "a", (r$1) => {
	let e = "a";
	for (let t = 0; t < r$1.length; t++) e += String.fromCharCode(r$1[t]);
	return e;
}, (r$1) => {
	r$1 = r$1.substring(1);
	const e = Cn(r$1.length);
	for (let t = 0; t < r$1.length; t++) e[t] = r$1.charCodeAt(t);
	return e;
}), Pn$1 = {
	utf8: fi$1,
	"utf-8": fi$1,
	hex: bi$1.base16,
	latin1: Be$2,
	ascii: Be$2,
	binary: Be$2,
	...bi$1
};
function Sn(r$1, e = "utf8") {
	const t = Pn$1[e];
	if (!t) throw new Error(`Unsupported encoding "${e}"`);
	return (e === "utf8" || e === "utf-8") && globalThis.Buffer != null && globalThis.Buffer.from != null ? globalThis.Buffer.from(r$1, "utf8") : t.decoder.decode(`${t.prefix}${r$1}`);
}
var On = Object.defineProperty, Rn = (r$1, e, t) => e in r$1 ? On(r$1, e, {
	enumerable: !0,
	configurable: !0,
	writable: !0,
	value: t
}) : r$1[e] = t, W$1 = (r$1, e, t) => Rn(r$1, typeof e != "symbol" ? e + "" : e, t);
var Di = class {
	constructor(e, t) {
		this.core = e, this.logger = t, W$1(this, "keychain", /* @__PURE__ */ new Map()), W$1(this, "name", Pt$1), W$1(this, "version", "0.3"), W$1(this, "initialized", !1), W$1(this, "storagePrefix", B$1), W$1(this, "init", async () => {
			if (!this.initialized) {
				const i$2 = await this.getKeyChain();
				typeof i$2 < "u" && (this.keychain = i$2), this.initialized = !0;
			}
		}), W$1(this, "has", (i$2) => (this.isInitialized(), this.keychain.has(i$2))), W$1(this, "set", async (i$2, s) => {
			this.isInitialized(), this.keychain.set(i$2, s), await this.persist();
		}), W$1(this, "get", (i$2) => {
			this.isInitialized();
			const s = this.keychain.get(i$2);
			if (typeof s > "u") {
				const { message: n$1 } = ht$1("NO_MATCHING_KEY", `${this.name}: ${i$2}`);
				throw new Error(n$1);
			}
			return s;
		}), W$1(this, "del", async (i$2) => {
			this.isInitialized(), this.keychain.delete(i$2), await this.persist();
		}), this.core = e, this.logger = E$1(t, this.name);
	}
	get context() {
		return y$1(this.logger);
	}
	get storageKey() {
		return this.storagePrefix + this.version + this.core.customStoragePrefix + "//" + this.name;
	}
	async setKeyChain(e) {
		await this.core.storage.setItem(this.storageKey, fi(e));
	}
	async getKeyChain() {
		const e = await this.core.storage.getItem(this.storageKey);
		return typeof e < "u" ? li(e) : void 0;
	}
	async persist() {
		await this.setKeyChain(this.keychain);
	}
	isInitialized() {
		if (!this.initialized) {
			const { message: e } = ht$1("NOT_INITIALIZED", this.name);
			throw new Error(e);
		}
	}
};
var An = Object.defineProperty, xn = (r$1, e, t) => e in r$1 ? An(r$1, e, {
	enumerable: !0,
	configurable: !0,
	writable: !0,
	value: t
}) : r$1[e] = t, S$2 = (r$1, e, t) => xn(r$1, typeof e != "symbol" ? e + "" : e, t);
var vi$1 = class {
	constructor(e, t, i$2) {
		this.core = e, this.logger = t, S$2(this, "name", Tt$2), S$2(this, "keychain"), S$2(this, "randomSessionIdentifier", jc()), S$2(this, "initialized", !1), S$2(this, "init", async () => {
			this.initialized || (await this.keychain.init(), this.initialized = !0);
		}), S$2(this, "hasKeys", (s) => (this.isInitialized(), this.keychain.has(s))), S$2(this, "getClientId", async () => {
			this.isInitialized();
			const s = await this.getClientSeed(), n$1 = Po$2(s);
			return Qe$3(n$1.publicKey);
		}), S$2(this, "generateKeyPair", () => {
			this.isInitialized();
			const s = Lc();
			return this.setPrivateKey(s.publicKey, s.privateKey);
		}), S$2(this, "signJWT", async (s) => {
			this.isInitialized();
			const n$1 = await this.getClientSeed(), o$1 = Po$2(n$1), a$1 = this.randomSessionIdentifier;
			return await Qo$1(a$1, s, Ct, o$1);
		}), S$2(this, "generateSharedKey", (s, n$1, o$1) => {
			this.isInitialized();
			const a$1 = this.getPrivateKey(s), c$2 = Cc(a$1, n$1);
			return this.setSymKey(c$2, o$1);
		}), S$2(this, "setSymKey", async (s, n$1) => {
			this.isInitialized();
			const o$1 = n$1 || Pc(s);
			return await this.keychain.set(o$1, s), o$1;
		}), S$2(this, "deleteKeyPair", async (s) => {
			this.isInitialized(), await this.keychain.del(s);
		}), S$2(this, "deleteSymKey", async (s) => {
			this.isInitialized(), await this.keychain.del(s);
		}), S$2(this, "encode", async (s, n$1, o$1) => {
			this.isInitialized();
			const a$1 = oo(o$1), c$2 = safeJsonStringify(n$1);
			if (Fc(a$1)) return Dc(c$2, o$1?.encoding);
			if (Kc(a$1)) {
				const g = a$1.senderPublicKey, _ = a$1.receiverPublicKey;
				s = await this.generateSharedKey(g, _);
			}
			const h$3 = this.getSymKey(s), { type: l$2, senderPublicKey: d$2 } = a$1;
			return Vc({
				type: l$2,
				symKey: h$3,
				message: c$2,
				senderPublicKey: d$2,
				encoding: o$1?.encoding
			});
		}), S$2(this, "decode", async (s, n$1, o$1) => {
			this.isInitialized();
			const a$1 = qc(n$1, o$1);
			if (Fc(a$1)) {
				const c$2 = Hc(n$1, o$1?.encoding);
				return safeJsonParse(c$2);
			}
			if (Kc(a$1)) {
				const c$2 = a$1.receiverPublicKey, h$3 = a$1.senderPublicKey;
				s = await this.generateSharedKey(c$2, h$3);
			}
			try {
				const c$2 = this.getSymKey(s), h$3 = Mc({
					symKey: c$2,
					encoded: n$1,
					encoding: o$1?.encoding
				});
				return safeJsonParse(h$3);
			} catch (c$2) {
				this.logger.error(`Failed to decode message from topic: '${s}', clientId: '${await this.getClientId()}'`), this.logger.error(c$2);
			}
		}), S$2(this, "getPayloadType", (s, n$1 = qt$1) => {
			const o$1 = Se$2({
				encoded: s,
				encoding: n$1
			});
			return Bt$1(o$1.type);
		}), S$2(this, "getPayloadSenderPublicKey", (s, n$1 = qt$1) => {
			const o$1 = Se$2({
				encoded: s,
				encoding: n$1
			});
			return o$1.senderPublicKey ? toString(o$1.senderPublicKey, G$1) : void 0;
		}), this.core = e, this.logger = E$1(t, this.name), this.keychain = i$2 || new Di(this.core, this.logger);
	}
	get context() {
		return y$1(this.logger);
	}
	async setPrivateKey(e, t) {
		return await this.keychain.set(e, t), e;
	}
	getPrivateKey(e) {
		return this.keychain.get(e);
	}
	async getClientSeed() {
		let e = "";
		try {
			e = this.keychain.get(ke$2);
		} catch {
			e = jc(), await this.keychain.set(ke$2, e);
		}
		return Sn(e, "base16");
	}
	getSymKey(e) {
		return this.keychain.get(e);
	}
	isInitialized() {
		if (!this.initialized) {
			const { message: e } = ht$1("NOT_INITIALIZED", this.name);
			throw new Error(e);
		}
	}
};
var Nn = Object.defineProperty, $n = Object.defineProperties, zn = Object.getOwnPropertyDescriptors, wi$1 = Object.getOwnPropertySymbols, Ln = Object.prototype.hasOwnProperty, kn = Object.prototype.propertyIsEnumerable, Ve$1 = (r$1, e, t) => e in r$1 ? Nn(r$1, e, {
	enumerable: !0,
	configurable: !0,
	writable: !0,
	value: t
}) : r$1[e] = t, jn = (r$1, e) => {
	for (var t in e || (e = {})) Ln.call(e, t) && Ve$1(r$1, t, e[t]);
	if (wi$1) for (var t of wi$1(e)) kn.call(e, t) && Ve$1(r$1, t, e[t]);
	return r$1;
}, Un = (r$1, e) => $n(r$1, zn(e)), k$2 = (r$1, e, t) => Ve$1(r$1, typeof e != "symbol" ? e + "" : e, t);
var _i = class extends y$2 {
	constructor(e, t) {
		super(e, t), this.logger = e, this.core = t, k$2(this, "messages", /* @__PURE__ */ new Map()), k$2(this, "messagesWithoutClientAck", /* @__PURE__ */ new Map()), k$2(this, "name", Ot$1), k$2(this, "version", "0.3"), k$2(this, "initialized", !1), k$2(this, "storagePrefix", B$1), k$2(this, "init", async () => {
			if (!this.initialized) {
				this.logger.trace("Initialized");
				try {
					const i$2 = await this.getRelayerMessages();
					typeof i$2 < "u" && (this.messages = i$2);
					const s = await this.getRelayerMessagesWithoutClientAck();
					typeof s < "u" && (this.messagesWithoutClientAck = s), this.logger.debug(`Successfully Restored records for ${this.name}`), this.logger.trace({
						type: "method",
						method: "restore",
						size: this.messages.size
					});
				} catch (i$2) {
					this.logger.debug(`Failed to Restore records for ${this.name}`), this.logger.error(i$2);
				} finally {
					this.initialized = !0;
				}
			}
		}), k$2(this, "set", async (i$2, s, n$1) => {
			this.isInitialized();
			const o$1 = kc(s);
			let a$1 = this.messages.get(i$2);
			if (typeof a$1 > "u" && (a$1 = {}), typeof a$1[o$1] < "u") return o$1;
			if (a$1[o$1] = s, this.messages.set(i$2, a$1), n$1 === le$1.inbound) {
				const c$2 = this.messagesWithoutClientAck.get(i$2) || {};
				this.messagesWithoutClientAck.set(i$2, Un(jn({}, c$2), { [o$1]: s }));
			}
			return await this.persist(), o$1;
		}), k$2(this, "get", (i$2) => {
			this.isInitialized();
			let s = this.messages.get(i$2);
			return typeof s > "u" && (s = {}), s;
		}), k$2(this, "getWithoutAck", (i$2) => {
			this.isInitialized();
			const s = {};
			for (const n$1 of i$2) {
				const o$1 = this.messagesWithoutClientAck.get(n$1) || {};
				s[n$1] = Object.values(o$1);
			}
			return s;
		}), k$2(this, "has", (i$2, s) => {
			this.isInitialized();
			const n$1 = this.get(i$2), o$1 = kc(s);
			return typeof n$1[o$1] < "u";
		}), k$2(this, "ack", async (i$2, s) => {
			this.isInitialized();
			const n$1 = this.messagesWithoutClientAck.get(i$2);
			if (typeof n$1 > "u") return;
			const o$1 = kc(s);
			delete n$1[o$1], Object.keys(n$1).length === 0 ? this.messagesWithoutClientAck.delete(i$2) : this.messagesWithoutClientAck.set(i$2, n$1), await this.persist();
		}), k$2(this, "del", async (i$2) => {
			this.isInitialized(), this.messages.delete(i$2), this.messagesWithoutClientAck.delete(i$2), await this.persist();
		}), this.logger = E$1(e, this.name), this.core = t;
	}
	get context() {
		return y$1(this.logger);
	}
	get storageKey() {
		return this.storagePrefix + this.version + this.core.customStoragePrefix + "//" + this.name;
	}
	get storageKeyWithoutClientAck() {
		return this.storagePrefix + this.version + this.core.customStoragePrefix + "//" + this.name + "_withoutClientAck";
	}
	async setRelayerMessages(e) {
		await this.core.storage.setItem(this.storageKey, fi(e));
	}
	async setRelayerMessagesWithoutClientAck(e) {
		await this.core.storage.setItem(this.storageKeyWithoutClientAck, fi(e));
	}
	async getRelayerMessages() {
		const e = await this.core.storage.getItem(this.storageKey);
		return typeof e < "u" ? li(e) : void 0;
	}
	async getRelayerMessagesWithoutClientAck() {
		const e = await this.core.storage.getItem(this.storageKeyWithoutClientAck);
		return typeof e < "u" ? li(e) : void 0;
	}
	async persist() {
		await this.setRelayerMessages(this.messages), await this.setRelayerMessagesWithoutClientAck(this.messagesWithoutClientAck);
	}
	isInitialized() {
		if (!this.initialized) {
			const { message: e } = ht$1("NOT_INITIALIZED", this.name);
			throw new Error(e);
		}
	}
};
var Fn = Object.defineProperty, Mn$1 = Object.defineProperties, Kn = Object.getOwnPropertyDescriptors, Ei$1 = Object.getOwnPropertySymbols, Bn = Object.prototype.hasOwnProperty, Vn = Object.prototype.propertyIsEnumerable, qe$1 = (r$1, e, t) => e in r$1 ? Fn(r$1, e, {
	enumerable: !0,
	configurable: !0,
	writable: !0,
	value: t
}) : r$1[e] = t, Ie$1 = (r$1, e) => {
	for (var t in e || (e = {})) Bn.call(e, t) && qe$1(r$1, t, e[t]);
	if (Ei$1) for (var t of Ei$1(e)) Vn.call(e, t) && qe$1(r$1, t, e[t]);
	return r$1;
}, Ge$2 = (r$1, e) => Mn$1(r$1, Kn(e)), V$2 = (r$1, e, t) => qe$1(r$1, typeof e != "symbol" ? e + "" : e, t);
var qn = class extends m {
	constructor(e, t) {
		super(e, t), this.relayer = e, this.logger = t, V$2(this, "events", new import_events$2.EventEmitter()), V$2(this, "name", At$1), V$2(this, "queue", /* @__PURE__ */ new Map()), V$2(this, "publishTimeout", (0, import_cjs$1.toMiliseconds)(import_cjs$1.ONE_MINUTE)), V$2(this, "initialPublishTimeout", (0, import_cjs$1.toMiliseconds)(import_cjs$1.ONE_SECOND * 15)), V$2(this, "needsTransportRestart", !1), V$2(this, "publish", async (i$2, s, n$1) => {
			var o$1;
			this.logger.debug("Publishing Payload"), this.logger.trace({
				type: "method",
				method: "publish",
				params: {
					topic: i$2,
					message: s,
					opts: n$1
				}
			});
			const a$1 = n$1?.ttl || je$1, c$2 = Zc(n$1), h$3 = n$1?.prompt || !1, l$2 = n$1?.tag || 0, d$2 = n$1?.id || getBigIntRpcId().toString(), g = {
				topic: i$2,
				message: s,
				opts: {
					ttl: a$1,
					relay: c$2,
					prompt: h$3,
					tag: l$2,
					id: d$2,
					attestation: n$1?.attestation,
					tvf: n$1?.tvf
				}
			}, _ = `Failed to publish payload, please try again. id:${d$2} tag:${l$2}`;
			try {
				const u$2 = new Promise(async (b$3) => {
					const x$1 = ({ id: D$1 }) => {
						g.opts.id === D$1 && (this.removeRequestFromQueue(D$1), this.relayer.events.removeListener(C$1.publish, x$1), b$3(g));
					};
					this.relayer.events.on(C$1.publish, x$1);
					const I$2 = yi(new Promise((D$1, j$1) => {
						this.rpcPublish({
							topic: i$2,
							message: s,
							ttl: a$1,
							prompt: h$3,
							tag: l$2,
							id: d$2,
							attestation: n$1?.attestation,
							tvf: n$1?.tvf
						}).then(D$1).catch((T$1) => {
							this.logger.warn(T$1, T$1?.message), j$1(T$1);
						});
					}), this.initialPublishTimeout, `Failed initial publish, retrying.... id:${d$2} tag:${l$2}`);
					try {
						await I$2, this.events.removeListener(C$1.publish, x$1);
					} catch (D$1) {
						this.queue.set(d$2, Ge$2(Ie$1({}, g), { attempt: 1 })), this.logger.warn(D$1, D$1?.message);
					}
				});
				this.logger.trace({
					type: "method",
					method: "publish",
					params: {
						id: d$2,
						topic: i$2,
						message: s,
						opts: n$1
					}
				}), await yi(u$2, this.publishTimeout, _);
			} catch (u$2) {
				if (this.logger.debug("Failed to Publish Payload"), this.logger.error(u$2), (o$1 = n$1?.internal) != null && o$1.throwOnFailedPublish) throw u$2;
			} finally {
				this.queue.delete(d$2);
			}
		}), V$2(this, "on", (i$2, s) => {
			this.events.on(i$2, s);
		}), V$2(this, "once", (i$2, s) => {
			this.events.once(i$2, s);
		}), V$2(this, "off", (i$2, s) => {
			this.events.off(i$2, s);
		}), V$2(this, "removeListener", (i$2, s) => {
			this.events.removeListener(i$2, s);
		}), this.relayer = e, this.logger = E$1(t, this.name), this.registerEventListeners();
	}
	get context() {
		return y$1(this.logger);
	}
	async rpcPublish(e) {
		var t, i$2, s, n$1;
		const { topic: o$1, message: a$1, ttl: c$2 = je$1, prompt: h$3, tag: l$2, id: d$2, attestation: g, tvf: _ } = e, u$2 = {
			method: Yc(Zc().protocol).publish,
			params: Ie$1({
				topic: o$1,
				message: a$1,
				ttl: c$2,
				prompt: h$3,
				tag: l$2,
				attestation: g
			}, _),
			id: d$2
		};
		Et((t = u$2.params) == null ? void 0 : t.prompt) && ((i$2 = u$2.params) == null || delete i$2.prompt), Et((s = u$2.params) == null ? void 0 : s.tag) && ((n$1 = u$2.params) == null || delete n$1.tag), this.logger.debug("Outgoing Relay Payload"), this.logger.trace({
			type: "message",
			direction: "outgoing",
			request: u$2
		});
		const b$3 = await this.relayer.request(u$2);
		return this.relayer.events.emit(C$1.publish, e), this.logger.debug("Successfully Published Payload"), b$3;
	}
	removeRequestFromQueue(e) {
		this.queue.delete(e);
	}
	checkQueue() {
		this.queue.forEach(async (e, t) => {
			const i$2 = e.attempt + 1;
			this.queue.set(t, Ge$2(Ie$1({}, e), { attempt: i$2 }));
			const { topic: s, message: n$1, opts: o$1, attestation: a$1 } = e;
			this.logger.warn({}, `Publisher: queue->publishing: ${e.opts.id}, tag: ${e.opts.tag}, attempt: ${i$2}`), await this.rpcPublish(Ge$2(Ie$1({}, e), {
				topic: s,
				message: n$1,
				ttl: o$1.ttl,
				prompt: o$1.prompt,
				tag: o$1.tag,
				id: o$1.id,
				attestation: a$1,
				tvf: o$1.tvf
			})), this.logger.warn({}, `Publisher: queue->published: ${e.opts.id}`);
		});
	}
	registerEventListeners() {
		this.relayer.core.heartbeat.on(r.pulse, () => {
			if (this.needsTransportRestart) {
				this.needsTransportRestart = !1, this.relayer.events.emit(C$1.connection_stalled);
				return;
			}
			this.checkQueue();
		}), this.relayer.on(C$1.message_ack, (e) => {
			this.removeRequestFromQueue(e.id.toString());
		});
	}
};
var Gn = Object.defineProperty, Wn = (r$1, e, t) => e in r$1 ? Gn(r$1, e, {
	enumerable: !0,
	configurable: !0,
	writable: !0,
	value: t
}) : r$1[e] = t, ne$1 = (r$1, e, t) => Wn(r$1, typeof e != "symbol" ? e + "" : e, t);
var Hn = class {
	constructor() {
		ne$1(this, "map", /* @__PURE__ */ new Map()), ne$1(this, "set", (e, t) => {
			const i$2 = this.get(e);
			this.exists(e, t) || this.map.set(e, [...i$2, t]);
		}), ne$1(this, "get", (e) => this.map.get(e) || []), ne$1(this, "exists", (e, t) => this.get(e).includes(t)), ne$1(this, "delete", (e, t) => {
			if (typeof t > "u") {
				this.map.delete(e);
				return;
			}
			if (!this.map.has(e)) return;
			const i$2 = this.get(e);
			if (!this.exists(e, t)) return;
			const s = i$2.filter((n$1) => n$1 !== t);
			if (!s.length) {
				this.map.delete(e);
				return;
			}
			this.map.set(e, s);
		}), ne$1(this, "clear", () => {
			this.map.clear();
		});
	}
	get topics() {
		return Array.from(this.map.keys());
	}
};
var Yn = Object.defineProperty, Jn = Object.defineProperties, Xn = Object.getOwnPropertyDescriptors, Ii$1 = Object.getOwnPropertySymbols, Zn = Object.prototype.hasOwnProperty, Qn = Object.prototype.propertyIsEnumerable, We$2 = (r$1, e, t) => e in r$1 ? Yn(r$1, e, {
	enumerable: !0,
	configurable: !0,
	writable: !0,
	value: t
}) : r$1[e] = t, ge$1 = (r$1, e) => {
	for (var t in e || (e = {})) Zn.call(e, t) && We$2(r$1, t, e[t]);
	if (Ii$1) for (var t of Ii$1(e)) Qn.call(e, t) && We$2(r$1, t, e[t]);
	return r$1;
}, He$1 = (r$1, e) => Jn(r$1, Xn(e)), f$3 = (r$1, e, t) => We$2(r$1, typeof e != "symbol" ? e + "" : e, t);
var Ti = class extends P {
	constructor(e, t) {
		super(e, t), this.relayer = e, this.logger = t, f$3(this, "subscriptions", /* @__PURE__ */ new Map()), f$3(this, "topicMap", new Hn()), f$3(this, "events", new import_events$2.EventEmitter()), f$3(this, "name", Ut$1), f$3(this, "version", "0.3"), f$3(this, "pending", /* @__PURE__ */ new Map()), f$3(this, "cached", []), f$3(this, "initialized", !1), f$3(this, "storagePrefix", B$1), f$3(this, "subscribeTimeout", (0, import_cjs$1.toMiliseconds)(import_cjs$1.ONE_MINUTE)), f$3(this, "initialSubscribeTimeout", (0, import_cjs$1.toMiliseconds)(import_cjs$1.ONE_SECOND * 15)), f$3(this, "clientId"), f$3(this, "batchSubscribeTopicsLimit", 500), f$3(this, "init", async () => {
			this.initialized || (this.logger.trace("Initialized"), this.registerEventListeners(), await this.restore()), this.initialized = !0;
		}), f$3(this, "subscribe", async (i$2, s) => {
			this.isInitialized(), this.logger.debug("Subscribing Topic"), this.logger.trace({
				type: "method",
				method: "subscribe",
				params: {
					topic: i$2,
					opts: s
				}
			});
			try {
				const n$1 = Zc(s), o$1 = {
					topic: i$2,
					relay: n$1,
					transportType: s?.transportType
				};
				this.pending.set(i$2, o$1);
				const a$1 = await this.rpcSubscribe(i$2, n$1, s);
				return typeof a$1 == "string" && (this.onSubscribe(a$1, o$1), this.logger.debug("Successfully Subscribed Topic"), this.logger.trace({
					type: "method",
					method: "subscribe",
					params: {
						topic: i$2,
						opts: s
					}
				})), a$1;
			} catch (n$1) {
				throw this.logger.debug("Failed to Subscribe Topic"), this.logger.error(n$1), n$1;
			}
		}), f$3(this, "unsubscribe", async (i$2, s) => {
			this.isInitialized(), typeof s?.id < "u" ? await this.unsubscribeById(i$2, s.id, s) : await this.unsubscribeByTopic(i$2, s);
		}), f$3(this, "isSubscribed", (i$2) => new Promise((s) => {
			s(this.topicMap.topics.includes(i$2));
		})), f$3(this, "isKnownTopic", (i$2) => new Promise((s) => {
			s(this.topicMap.topics.includes(i$2) || this.pending.has(i$2) || this.cached.some((n$1) => n$1.topic === i$2));
		})), f$3(this, "on", (i$2, s) => {
			this.events.on(i$2, s);
		}), f$3(this, "once", (i$2, s) => {
			this.events.once(i$2, s);
		}), f$3(this, "off", (i$2, s) => {
			this.events.off(i$2, s);
		}), f$3(this, "removeListener", (i$2, s) => {
			this.events.removeListener(i$2, s);
		}), f$3(this, "start", async () => {
			await this.onConnect();
		}), f$3(this, "stop", async () => {
			await this.onDisconnect();
		}), f$3(this, "restart", async () => {
			await this.restore(), await this.onRestart();
		}), f$3(this, "checkPending", async () => {
			if (this.pending.size === 0 && (!this.initialized || !this.relayer.connected)) return;
			const i$2 = [];
			this.pending.forEach((s) => {
				i$2.push(s);
			}), await this.batchSubscribe(i$2);
		}), f$3(this, "registerEventListeners", () => {
			this.relayer.core.heartbeat.on(r.pulse, async () => {
				await this.checkPending();
			}), this.events.on($$2.created, async (i$2) => {
				const s = $$2.created;
				this.logger.info(`Emitting ${s}`), this.logger.debug({
					type: "event",
					event: s,
					data: i$2
				}), await this.persist();
			}), this.events.on($$2.deleted, async (i$2) => {
				const s = $$2.deleted;
				this.logger.info(`Emitting ${s}`), this.logger.debug({
					type: "event",
					event: s,
					data: i$2
				}), await this.persist();
			});
		}), this.relayer = e, this.logger = E$1(t, this.name), this.clientId = "";
	}
	get context() {
		return y$1(this.logger);
	}
	get storageKey() {
		return this.storagePrefix + this.version + this.relayer.core.customStoragePrefix + "//" + this.name;
	}
	get length() {
		return this.subscriptions.size;
	}
	get ids() {
		return Array.from(this.subscriptions.keys());
	}
	get values() {
		return Array.from(this.subscriptions.values());
	}
	get topics() {
		return this.topicMap.topics;
	}
	get hasAnyTopics() {
		return this.topicMap.topics.length > 0 || this.pending.size > 0 || this.cached.length > 0 || this.subscriptions.size > 0;
	}
	hasSubscription(e, t) {
		let i$2 = !1;
		try {
			i$2 = this.getSubscription(e).topic === t;
		} catch {}
		return i$2;
	}
	reset() {
		this.cached = [], this.initialized = !0;
	}
	onDisable() {
		this.values.length > 0 && (this.cached = this.values), this.subscriptions.clear(), this.topicMap.clear();
	}
	async unsubscribeByTopic(e, t) {
		const i$2 = this.topicMap.get(e);
		await Promise.all(i$2.map(async (s) => await this.unsubscribeById(e, s, t)));
	}
	async unsubscribeById(e, t, i$2) {
		this.logger.debug("Unsubscribing Topic"), this.logger.trace({
			type: "method",
			method: "unsubscribe",
			params: {
				topic: e,
				id: t,
				opts: i$2
			}
		});
		try {
			const s = Zc(i$2);
			await this.restartToComplete({
				topic: e,
				id: t,
				relay: s
			}), await this.rpcUnsubscribe(e, t, s);
			const n$1 = Nt("USER_DISCONNECTED", `${this.name}, ${e}`);
			await this.onUnsubscribe(e, t, n$1), this.logger.debug("Successfully Unsubscribed Topic"), this.logger.trace({
				type: "method",
				method: "unsubscribe",
				params: {
					topic: e,
					id: t,
					opts: i$2
				}
			});
		} catch (s) {
			throw this.logger.debug("Failed to Unsubscribe Topic"), this.logger.error(s), s;
		}
	}
	async rpcSubscribe(e, t, i$2) {
		var s;
		(!i$2 || i$2?.transportType === Q$1.relay) && await this.restartToComplete({
			topic: e,
			id: e,
			relay: t
		});
		const n$1 = {
			method: Yc(t.protocol).subscribe,
			params: { topic: e }
		};
		this.logger.debug("Outgoing Relay Payload"), this.logger.trace({
			type: "payload",
			direction: "outgoing",
			request: n$1
		});
		const o$1 = (s = i$2?.internal) == null ? void 0 : s.throwOnFailedPublish;
		try {
			const a$1 = await this.getSubscriptionId(e);
			if (i$2?.transportType === Q$1.link_mode) return setTimeout(() => {
				(this.relayer.connected || this.relayer.connecting) && this.relayer.request(n$1).catch((l$2) => this.logger.warn(l$2));
			}, (0, import_cjs$1.toMiliseconds)(import_cjs$1.ONE_SECOND)), a$1;
			const c$2 = new Promise(async (l$2) => {
				const d$2 = (g) => {
					g.topic === e && (this.events.removeListener($$2.created, d$2), l$2(g.id));
				};
				this.events.on($$2.created, d$2);
				try {
					const g = await yi(new Promise((_, u$2) => {
						this.relayer.request(n$1).catch((b$3) => {
							this.logger.warn(b$3, b$3?.message), u$2(b$3);
						}).then(_);
					}), this.initialSubscribeTimeout, `Subscribing to ${e} failed, please try again`);
					this.events.removeListener($$2.created, d$2), l$2(g);
				} catch {}
			}), h$3 = await yi(c$2, this.subscribeTimeout, `Subscribing to ${e} failed, please try again`);
			if (!h$3 && o$1) throw new Error(`Subscribing to ${e} failed, please try again`);
			return h$3 ? a$1 : null;
		} catch (a$1) {
			if (this.logger.debug("Outgoing Relay Subscribe Payload stalled"), this.relayer.events.emit(C$1.connection_stalled), o$1) throw a$1;
		}
		return null;
	}
	async rpcBatchSubscribe(e) {
		if (!e.length) return;
		const t = e[0].relay, i$2 = {
			method: Yc(t.protocol).batchSubscribe,
			params: { topics: e.map((s) => s.topic) }
		};
		this.logger.debug("Outgoing Relay Payload"), this.logger.trace({
			type: "payload",
			direction: "outgoing",
			request: i$2
		});
		try {
			await await yi(new Promise((s) => {
				this.relayer.request(i$2).catch((n$1) => this.logger.warn(n$1)).then(s);
			}), this.subscribeTimeout, "rpcBatchSubscribe failed, please try again");
		} catch {
			this.relayer.events.emit(C$1.connection_stalled);
		}
	}
	async rpcBatchFetchMessages(e) {
		if (!e.length) return;
		const t = e[0].relay, i$2 = {
			method: Yc(t.protocol).batchFetchMessages,
			params: { topics: e.map((n$1) => n$1.topic) }
		};
		this.logger.debug("Outgoing Relay Payload"), this.logger.trace({
			type: "payload",
			direction: "outgoing",
			request: i$2
		});
		let s;
		try {
			s = await await yi(new Promise((n$1, o$1) => {
				this.relayer.request(i$2).catch((a$1) => {
					this.logger.warn(a$1), o$1(a$1);
				}).then(n$1);
			}), this.subscribeTimeout, "rpcBatchFetchMessages failed, please try again");
		} catch {
			this.relayer.events.emit(C$1.connection_stalled);
		}
		return s;
	}
	rpcUnsubscribe(e, t, i$2) {
		const s = {
			method: Yc(i$2.protocol).unsubscribe,
			params: {
				topic: e,
				id: t
			}
		};
		return this.logger.debug("Outgoing Relay Payload"), this.logger.trace({
			type: "payload",
			direction: "outgoing",
			request: s
		}), this.relayer.request(s);
	}
	onSubscribe(e, t) {
		this.setSubscription(e, He$1(ge$1({}, t), { id: e })), this.pending.delete(t.topic);
	}
	onBatchSubscribe(e) {
		e.length && e.forEach((t) => {
			this.setSubscription(t.id, ge$1({}, t)), this.pending.delete(t.topic);
		});
	}
	async onUnsubscribe(e, t, i$2) {
		this.events.removeAllListeners(t), this.hasSubscription(t, e) && this.deleteSubscription(t, i$2), await this.relayer.messages.del(e);
	}
	async setRelayerSubscriptions(e) {
		await this.relayer.core.storage.setItem(this.storageKey, e);
	}
	async getRelayerSubscriptions() {
		return await this.relayer.core.storage.getItem(this.storageKey);
	}
	setSubscription(e, t) {
		this.logger.debug("Setting subscription"), this.logger.trace({
			type: "method",
			method: "setSubscription",
			id: e,
			subscription: t
		}), this.addSubscription(e, t);
	}
	addSubscription(e, t) {
		this.subscriptions.set(e, ge$1({}, t)), this.topicMap.set(t.topic, e), this.events.emit($$2.created, t);
	}
	getSubscription(e) {
		this.logger.debug("Getting subscription"), this.logger.trace({
			type: "method",
			method: "getSubscription",
			id: e
		});
		const t = this.subscriptions.get(e);
		if (!t) {
			const { message: i$2 } = ht$1("NO_MATCHING_KEY", `${this.name}: ${e}`);
			throw new Error(i$2);
		}
		return t;
	}
	deleteSubscription(e, t) {
		this.logger.debug("Deleting subscription"), this.logger.trace({
			type: "method",
			method: "deleteSubscription",
			id: e,
			reason: t
		});
		const i$2 = this.getSubscription(e);
		this.subscriptions.delete(e), this.topicMap.delete(i$2.topic, e), this.events.emit($$2.deleted, He$1(ge$1({}, i$2), { reason: t }));
	}
	async persist() {
		await this.setRelayerSubscriptions(this.values), this.events.emit($$2.sync);
	}
	async onRestart() {
		if (this.cached.length) {
			const e = [...this.cached], t = Math.ceil(this.cached.length / this.batchSubscribeTopicsLimit);
			for (let i$2 = 0; i$2 < t; i$2++) {
				const s = e.splice(0, this.batchSubscribeTopicsLimit);
				await this.batchSubscribe(s);
			}
		}
		this.events.emit($$2.resubscribed);
	}
	async restore() {
		try {
			const e = await this.getRelayerSubscriptions();
			if (typeof e > "u" || !e.length) return;
			if (this.subscriptions.size) {
				const { message: t } = ht$1("RESTORE_WILL_OVERRIDE", this.name);
				throw this.logger.error(t), this.logger.error(`${this.name}: ${JSON.stringify(this.values)}`), new Error(t);
			}
			this.cached = e, this.logger.debug(`Successfully Restored subscriptions for ${this.name}`), this.logger.trace({
				type: "method",
				method: "restore",
				subscriptions: this.values
			});
		} catch (e) {
			this.logger.debug(`Failed to Restore subscriptions for ${this.name}`), this.logger.error(e);
		}
	}
	async batchSubscribe(e) {
		e.length && (await this.rpcBatchSubscribe(e), this.onBatchSubscribe(await Promise.all(e.map(async (t) => He$1(ge$1({}, t), { id: await this.getSubscriptionId(t.topic) })))));
	}
	async batchFetchMessages(e) {
		if (!e.length) return;
		this.logger.trace(`Fetching batch messages for ${e.length} subscriptions`);
		const t = await this.rpcBatchFetchMessages(e);
		t && t.messages && (await Ni((0, import_cjs$1.toMiliseconds)(import_cjs$1.ONE_SECOND)), await this.relayer.handleBatchMessageEvents(t.messages));
	}
	async onConnect() {
		await this.restart(), this.reset();
	}
	onDisconnect() {
		this.onDisable();
	}
	isInitialized() {
		if (!this.initialized) {
			const { message: e } = ht$1("NOT_INITIALIZED", this.name);
			throw new Error(e);
		}
	}
	async restartToComplete(e) {
		!this.relayer.connected && !this.relayer.connecting && (this.cached.push(e), await this.relayer.transportOpen());
	}
	async getClientId() {
		return this.clientId || (this.clientId = await this.relayer.core.crypto.getClientId()), this.clientId;
	}
	async getSubscriptionId(e) {
		return kc(e + await this.getClientId());
	}
};
var eo = Object.defineProperty, Ci = Object.getOwnPropertySymbols, to = Object.prototype.hasOwnProperty, io = Object.prototype.propertyIsEnumerable, Ye$1 = (r$1, e, t) => e in r$1 ? eo(r$1, e, {
	enumerable: !0,
	configurable: !0,
	writable: !0,
	value: t
}) : r$1[e] = t, Pi = (r$1, e) => {
	for (var t in e || (e = {})) to.call(e, t) && Ye$1(r$1, t, e[t]);
	if (Ci) for (var t of Ci(e)) io.call(e, t) && Ye$1(r$1, t, e[t]);
	return r$1;
}, y$3 = (r$1, e, t) => Ye$1(r$1, typeof e != "symbol" ? e + "" : e, t);
var Si$1 = class extends d$1 {
	constructor(e) {
		super(e), y$3(this, "protocol", "wc"), y$3(this, "version", 2), y$3(this, "core"), y$3(this, "logger"), y$3(this, "events", new import_events$2.EventEmitter()), y$3(this, "provider"), y$3(this, "messages"), y$3(this, "subscriber"), y$3(this, "publisher"), y$3(this, "name", $t), y$3(this, "transportExplicitlyClosed", !1), y$3(this, "initialized", !1), y$3(this, "connectionAttemptInProgress", !1), y$3(this, "relayUrl"), y$3(this, "projectId"), y$3(this, "packageName"), y$3(this, "bundleId"), y$3(this, "hasExperiencedNetworkDisruption", !1), y$3(this, "pingTimeout"), y$3(this, "heartBeatTimeout", (0, import_cjs$1.toMiliseconds)(import_cjs$1.THIRTY_SECONDS + import_cjs$1.FIVE_SECONDS)), y$3(this, "reconnectTimeout"), y$3(this, "connectPromise"), y$3(this, "reconnectInProgress", !1), y$3(this, "requestsInFlight", []), y$3(this, "connectTimeout", (0, import_cjs$1.toMiliseconds)(import_cjs$1.ONE_SECOND * 15)), y$3(this, "request", async (t) => {
			var i$2, s;
			this.logger.debug("Publishing Request Payload");
			const n$1 = t.id || getBigIntRpcId().toString();
			await this.toEstablishConnection();
			try {
				this.logger.trace({
					id: n$1,
					method: t.method,
					topic: (i$2 = t.params) == null ? void 0 : i$2.topic
				}, "relayer.request - publishing...");
				const o$1 = `${n$1}:${((s = t.params) == null ? void 0 : s.tag) || ""}`;
				this.requestsInFlight.push(o$1);
				const a$1 = await this.provider.request(t);
				return this.requestsInFlight = this.requestsInFlight.filter((c$2) => c$2 !== o$1), a$1;
			} catch (o$1) {
				throw this.logger.debug(`Failed to Publish Request: ${n$1}`), o$1;
			}
		}), y$3(this, "resetPingTimeout", () => {
			_e$2() && (clearTimeout(this.pingTimeout), this.pingTimeout = setTimeout(() => {
				var t, i$2, s, n$1;
				try {
					this.logger.debug({}, "pingTimeout: Connection stalled, terminating..."), (n$1 = (s = (i$2 = (t = this.provider) == null ? void 0 : t.connection) == null ? void 0 : i$2.socket) == null ? void 0 : s.terminate) == null || n$1.call(s);
				} catch (o$1) {
					this.logger.warn(o$1, o$1?.message);
				}
			}, this.heartBeatTimeout));
		}), y$3(this, "onPayloadHandler", (t) => {
			this.onProviderPayload(t), this.resetPingTimeout();
		}), y$3(this, "onConnectHandler", () => {
			this.logger.warn({}, "Relayer connected 🛜"), this.startPingTimeout(), this.events.emit(C$1.connect);
		}), y$3(this, "onDisconnectHandler", () => {
			this.logger.warn({}, "Relayer disconnected 🛑"), this.requestsInFlight = [], this.onProviderDisconnect();
		}), y$3(this, "onProviderErrorHandler", (t) => {
			this.logger.fatal(`Fatal socket error: ${t.message}`), this.events.emit(C$1.error, t), this.logger.fatal("Fatal socket error received, closing transport"), this.transportClose();
		}), y$3(this, "registerProviderListeners", () => {
			this.provider.on(L$1.payload, this.onPayloadHandler), this.provider.on(L$1.connect, this.onConnectHandler), this.provider.on(L$1.disconnect, this.onDisconnectHandler), this.provider.on(L$1.error, this.onProviderErrorHandler);
		}), this.core = e.core, this.logger = typeof e.logger < "u" && typeof e.logger != "string" ? E$1(e.logger, this.name) : (0, import_browser.default)(k({ level: e.logger || "error" })), this.messages = new _i(this.logger, e.core), this.subscriber = new Ti(this, this.logger), this.publisher = new qn(this, this.logger), this.relayUrl = e?.relayUrl || "wss://relay.walletconnect.org", this.projectId = e.projectId, ei() ? this.packageName = ri() : ni() && (this.bundleId = ri()), this.provider = {};
	}
	async init() {
		if (this.logger.trace("Initialized"), this.registerEventListeners(), await Promise.all([this.messages.init(), this.subscriber.init()]), this.initialized = !0, this.subscriber.hasAnyTopics) try {
			await this.transportOpen();
		} catch (e) {
			this.logger.warn(e, e?.message);
		}
	}
	get context() {
		return y$1(this.logger);
	}
	get connected() {
		var e, t, i$2;
		return ((i$2 = (t = (e = this.provider) == null ? void 0 : e.connection) == null ? void 0 : t.socket) == null ? void 0 : i$2.readyState) === 1 || !1;
	}
	get connecting() {
		var e, t, i$2;
		return ((i$2 = (t = (e = this.provider) == null ? void 0 : e.connection) == null ? void 0 : t.socket) == null ? void 0 : i$2.readyState) === 0 || this.connectPromise !== void 0 || !1;
	}
	async publish(e, t, i$2) {
		this.isInitialized(), await this.publisher.publish(e, t, i$2), await this.recordMessageEvent({
			topic: e,
			message: t,
			publishedAt: Date.now(),
			transportType: Q$1.relay
		}, le$1.outbound);
	}
	async subscribe(e, t) {
		var i$2, s, n$1;
		this.isInitialized(), (!(t != null && t.transportType) || t?.transportType === "relay") && await this.toEstablishConnection();
		const o$1 = typeof ((i$2 = t?.internal) == null ? void 0 : i$2.throwOnFailedPublish) > "u" ? !0 : (s = t?.internal) == null ? void 0 : s.throwOnFailedPublish;
		let a$1 = ((n$1 = this.subscriber.topicMap.get(e)) == null ? void 0 : n$1[0]) || "", c$2;
		const h$3 = (l$2) => {
			l$2.topic === e && (this.subscriber.off($$2.created, h$3), c$2());
		};
		return await Promise.all([new Promise((l$2) => {
			c$2 = l$2, this.subscriber.on($$2.created, h$3);
		}), new Promise(async (l$2, d$2) => {
			a$1 = await this.subscriber.subscribe(e, Pi({ internal: { throwOnFailedPublish: o$1 } }, t)).catch((g) => {
				o$1 && d$2(g);
			}) || a$1, l$2();
		})]), a$1;
	}
	async unsubscribe(e, t) {
		this.isInitialized(), await this.subscriber.unsubscribe(e, t);
	}
	on(e, t) {
		this.events.on(e, t);
	}
	once(e, t) {
		this.events.once(e, t);
	}
	off(e, t) {
		this.events.off(e, t);
	}
	removeListener(e, t) {
		this.events.removeListener(e, t);
	}
	async transportDisconnect() {
		this.provider.disconnect && (this.hasExperiencedNetworkDisruption || this.connected) ? await yi(this.provider.disconnect(), 2e3, "provider.disconnect()").catch(() => this.onProviderDisconnect()) : this.onProviderDisconnect();
	}
	async transportClose() {
		this.transportExplicitlyClosed = !0, await this.transportDisconnect();
	}
	async transportOpen(e) {
		if (!this.subscriber.hasAnyTopics) {
			this.logger.warn("Starting WS connection skipped because the client has no topics to work with.");
			return;
		}
		if (this.connectPromise ? (this.logger.debug({}, "Waiting for existing connection attempt to resolve..."), await this.connectPromise, this.logger.debug({}, "Existing connection attempt resolved")) : (this.connectPromise = new Promise(async (t, i$2) => {
			await this.connect(e).then(t).catch(i$2).finally(() => {
				this.connectPromise = void 0;
			});
		}), await this.connectPromise), !this.connected) throw new Error(`Couldn't establish socket connection to the relay server: ${this.relayUrl}`);
	}
	async restartTransport(e) {
		this.logger.debug({}, "Restarting transport..."), !this.connectionAttemptInProgress && (this.relayUrl = e || this.relayUrl, await this.confirmOnlineStateOrThrow(), await this.transportClose(), await this.transportOpen());
	}
	async confirmOnlineStateOrThrow() {
		if (!await Na()) throw new Error("No internet connection detected. Please restart your network and try again.");
	}
	async handleBatchMessageEvents(e) {
		if (e?.length === 0) {
			this.logger.trace("Batch message events is empty. Ignoring...");
			return;
		}
		const t = e.sort((i$2, s) => i$2.publishedAt - s.publishedAt);
		this.logger.debug(`Batch of ${t.length} message events sorted`);
		for (const i$2 of t) try {
			await this.onMessageEvent(i$2);
		} catch (s) {
			this.logger.warn(s, "Error while processing batch message event: " + s?.message);
		}
		this.logger.trace(`Batch of ${t.length} message events processed`);
	}
	async onLinkMessageEvent(e, t) {
		const { topic: i$2 } = e;
		if (!t.sessionExists) {
			const s = Ei(import_cjs$1.FIVE_MINUTES), n$1 = {
				topic: i$2,
				expiry: s,
				relay: { protocol: "irn" },
				active: !1
			};
			await this.core.pairing.pairings.set(i$2, n$1);
		}
		this.events.emit(C$1.message, e), await this.recordMessageEvent(e, le$1.inbound);
	}
	async connect(e) {
		await this.confirmOnlineStateOrThrow(), e && e !== this.relayUrl && (this.relayUrl = e, await this.transportDisconnect()), this.connectionAttemptInProgress = !0, this.transportExplicitlyClosed = !1;
		let t = 1;
		for (; t < 6;) {
			try {
				if (this.transportExplicitlyClosed) break;
				this.logger.debug({}, `Connecting to ${this.relayUrl}, attempt: ${t}...`), await this.createProvider(), await new Promise(async (i$2, s) => {
					const n$1 = () => {
						s(/* @__PURE__ */ new Error("Connection interrupted while trying to subscribe"));
					};
					this.provider.once(L$1.disconnect, n$1), await yi(new Promise((o$1, a$1) => {
						this.provider.connect().then(o$1).catch(a$1);
					}), this.connectTimeout, `Socket stalled when trying to connect to ${this.relayUrl}`).catch((o$1) => {
						s(o$1);
					}).finally(() => {
						this.provider.off(L$1.disconnect, n$1), clearTimeout(this.reconnectTimeout);
					}), await new Promise(async (o$1, a$1) => {
						const c$2 = () => {
							a$1(/* @__PURE__ */ new Error("Connection interrupted while trying to subscribe"));
						};
						this.provider.once(L$1.disconnect, c$2), await this.subscriber.start().then(o$1).catch(a$1).finally(() => {
							this.provider.off(L$1.disconnect, c$2);
						});
					}), this.hasExperiencedNetworkDisruption = !1, i$2();
				});
			} catch (i$2) {
				await this.subscriber.stop();
				const s = i$2;
				this.logger.warn({}, s.message), this.hasExperiencedNetworkDisruption = !0;
			} finally {
				this.connectionAttemptInProgress = !1;
			}
			if (this.connected) {
				this.logger.debug({}, `Connected to ${this.relayUrl} successfully on attempt: ${t}`);
				break;
			}
			await new Promise((i$2) => setTimeout(i$2, (0, import_cjs$1.toMiliseconds)(t * 1))), t++;
		}
	}
	startPingTimeout() {
		var e, t, i$2, s, n$1;
		if (_e$2()) try {
			(t = (e = this.provider) == null ? void 0 : e.connection) != null && t.socket && ((n$1 = (s = (i$2 = this.provider) == null ? void 0 : i$2.connection) == null ? void 0 : s.socket) == null || n$1.on("ping", () => {
				this.resetPingTimeout();
			})), this.resetPingTimeout();
		} catch (o$1) {
			this.logger.warn(o$1, o$1?.message);
		}
	}
	async createProvider() {
		this.provider.connection && this.unregisterProviderListeners();
		const e = await this.core.crypto.signJWT(this.relayUrl);
		this.provider = new o(new f$2(si({
			sdkVersion: _e$3,
			protocol: this.protocol,
			version: this.version,
			relayUrl: this.relayUrl,
			projectId: this.projectId,
			auth: e,
			useOnCloseEvent: !0,
			bundleId: this.bundleId,
			packageName: this.packageName
		}))), this.registerProviderListeners();
	}
	async recordMessageEvent(e, t) {
		const { topic: i$2, message: s } = e;
		await this.messages.set(i$2, s, t);
	}
	async shouldIgnoreMessageEvent(e) {
		const { topic: t, message: i$2 } = e;
		if (!i$2 || i$2.length === 0) return this.logger.warn(`Ignoring invalid/empty message: ${i$2}`), !0;
		if (!await this.subscriber.isKnownTopic(t)) return this.logger.warn(`Ignoring message for unknown topic ${t}`), !0;
		const s = this.messages.has(t, i$2);
		return s && this.logger.warn(`Ignoring duplicate message: ${i$2}`), s;
	}
	async onProviderPayload(e) {
		if (this.logger.debug("Incoming Relay Payload"), this.logger.trace({
			type: "payload",
			direction: "incoming",
			payload: e
		}), isJsonRpcRequest(e)) {
			if (!e.method.endsWith("_subscription")) return;
			const t = e.params, { topic: i$2, message: s, publishedAt: n$1, attestation: o$1 } = t.data, a$1 = {
				topic: i$2,
				message: s,
				publishedAt: n$1,
				transportType: Q$1.relay,
				attestation: o$1
			};
			this.logger.debug("Emitting Relayer Payload"), this.logger.trace(Pi({
				type: "event",
				event: t.id
			}, a$1)), this.events.emit(t.id, a$1), await this.acknowledgePayload(e), await this.onMessageEvent(a$1);
		} else isJsonRpcResponse(e) && this.events.emit(C$1.message_ack, e);
	}
	async onMessageEvent(e) {
		await this.shouldIgnoreMessageEvent(e) || (await this.recordMessageEvent(e, le$1.inbound), this.events.emit(C$1.message, e));
	}
	async acknowledgePayload(e) {
		const t = formatJsonRpcResult(e.id, !0);
		await this.provider.connection.send(t);
	}
	unregisterProviderListeners() {
		this.provider.off(L$1.payload, this.onPayloadHandler), this.provider.off(L$1.connect, this.onConnectHandler), this.provider.off(L$1.disconnect, this.onDisconnectHandler), this.provider.off(L$1.error, this.onProviderErrorHandler), clearTimeout(this.pingTimeout);
	}
	async registerEventListeners() {
		let e = await Na();
		Ua(async (t) => {
			e !== t && (e = t, t ? await this.transportOpen().catch((i$2) => this.logger.error(i$2, i$2?.message)) : (this.hasExperiencedNetworkDisruption = !0, await this.transportDisconnect(), this.transportExplicitlyClosed = !1));
		}), this.core.heartbeat.on(r.pulse, async () => {
			if (!this.transportExplicitlyClosed && !this.connected && Ta()) try {
				await this.confirmOnlineStateOrThrow(), await this.transportOpen();
			} catch (t) {
				this.logger.warn(t, t?.message);
			}
		});
	}
	async onProviderDisconnect() {
		clearTimeout(this.pingTimeout), this.events.emit(C$1.disconnect), this.connectionAttemptInProgress = !1, !this.reconnectInProgress && (this.reconnectInProgress = !0, await this.subscriber.stop(), this.subscriber.hasAnyTopics && (this.transportExplicitlyClosed || (this.reconnectTimeout = setTimeout(async () => {
			await this.transportOpen().catch((e) => this.logger.error(e, e?.message)), this.reconnectTimeout = void 0, this.reconnectInProgress = !1;
		}, (0, import_cjs$1.toMiliseconds)(.1)))));
	}
	isInitialized() {
		if (!this.initialized) {
			const { message: e } = ht$1("NOT_INITIALIZED", this.name);
			throw new Error(e);
		}
	}
	async toEstablishConnection() {
		if (await this.confirmOnlineStateOrThrow(), !this.connected) {
			if (this.connectPromise) {
				await this.connectPromise;
				return;
			}
			await this.connect();
		}
	}
};
function so() {}
function Oi$1(r$1) {
	if (!r$1 || typeof r$1 != "object") return !1;
	const e = Object.getPrototypeOf(r$1);
	return e === null || e === Object.prototype || Object.getPrototypeOf(e) === null ? Object.prototype.toString.call(r$1) === "[object Object]" : !1;
}
function Ri(r$1) {
	return Object.getOwnPropertySymbols(r$1).filter((e) => Object.prototype.propertyIsEnumerable.call(r$1, e));
}
function Ai$1(r$1) {
	return r$1 == null ? r$1 === void 0 ? "[object Undefined]" : "[object Null]" : Object.prototype.toString.call(r$1);
}
var ro = "[object RegExp]", no = "[object String]", oo$1 = "[object Number]", ao = "[object Boolean]", co = "[object Symbol]", ho = "[object Date]", lo = "[object Map]", uo = "[object Set]", go = "[object Array]", po = "[object Function]", yo$1 = "[object ArrayBuffer]", Je$1 = "[object Object]", bo = "[object Error]", mo = "[object DataView]", fo = "[object Uint8Array]", Do = "[object Uint8ClampedArray]", vo = "[object Uint16Array]", wo = "[object Uint32Array]", _o = "[object BigUint64Array]", Eo = "[object Int8Array]", Io$1 = "[object Int16Array]", To = "[object Int32Array]", Co = "[object BigInt64Array]", Po = "[object Float32Array]", So = "[object Float64Array]";
function Oo(r$1, e) {
	return r$1 === e || Number.isNaN(r$1) && Number.isNaN(e);
}
function Ro(r$1, e, t) {
	return pe$2(r$1, e, void 0, void 0, void 0, void 0, t);
}
function pe$2(r$1, e, t, i$2, s, n$1, o$1) {
	const a$1 = o$1(r$1, e, t, i$2, s, n$1);
	if (a$1 !== void 0) return a$1;
	if (typeof r$1 == typeof e) switch (typeof r$1) {
		case "bigint":
		case "string":
		case "boolean":
		case "symbol":
		case "undefined": return r$1 === e;
		case "number": return r$1 === e || Object.is(r$1, e);
		case "function": return r$1 === e;
		case "object": return ye$1(r$1, e, n$1, o$1);
	}
	return ye$1(r$1, e, n$1, o$1);
}
function ye$1(r$1, e, t, i$2) {
	if (Object.is(r$1, e)) return !0;
	let s = Ai$1(r$1), n$1 = Ai$1(e);
	if (s === "[object Arguments]" && (s = "[object Object]"), n$1 === "[object Arguments]" && (n$1 = "[object Object]"), s !== n$1) return !1;
	switch (s) {
		case no: return r$1.toString() === e.toString();
		case oo$1: {
			const c$2 = r$1.valueOf(), h$3 = e.valueOf();
			return Oo(c$2, h$3);
		}
		case ao:
		case ho:
		case co: return Object.is(r$1.valueOf(), e.valueOf());
		case ro: return r$1.source === e.source && r$1.flags === e.flags;
		case po: return r$1 === e;
	}
	t = t ?? /* @__PURE__ */ new Map();
	const o$1 = t.get(r$1), a$1 = t.get(e);
	if (o$1 != null && a$1 != null) return o$1 === e;
	t.set(r$1, e), t.set(e, r$1);
	try {
		switch (s) {
			case lo:
				if (r$1.size !== e.size) return !1;
				for (const [c$2, h$3] of r$1.entries()) if (!e.has(c$2) || !pe$2(h$3, e.get(c$2), c$2, r$1, e, t, i$2)) return !1;
				return !0;
			case uo: {
				if (r$1.size !== e.size) return !1;
				const c$2 = Array.from(r$1.values()), h$3 = Array.from(e.values());
				for (let l$2 = 0; l$2 < c$2.length; l$2++) {
					const d$2 = c$2[l$2], g = h$3.findIndex((_) => pe$2(d$2, _, void 0, r$1, e, t, i$2));
					if (g === -1) return !1;
					h$3.splice(g, 1);
				}
				return !0;
			}
			case go:
			case fo:
			case Do:
			case vo:
			case wo:
			case _o:
			case Eo:
			case Io$1:
			case To:
			case Co:
			case Po:
			case So:
				if (typeof Buffer < "u" && Buffer.isBuffer(r$1) !== Buffer.isBuffer(e) || r$1.length !== e.length) return !1;
				for (let c$2 = 0; c$2 < r$1.length; c$2++) if (!pe$2(r$1[c$2], e[c$2], c$2, r$1, e, t, i$2)) return !1;
				return !0;
			case yo$1: return r$1.byteLength !== e.byteLength ? !1 : ye$1(new Uint8Array(r$1), new Uint8Array(e), t, i$2);
			case mo: return r$1.byteLength !== e.byteLength || r$1.byteOffset !== e.byteOffset ? !1 : ye$1(new Uint8Array(r$1), new Uint8Array(e), t, i$2);
			case bo: return r$1.name === e.name && r$1.message === e.message;
			case Je$1: {
				if (!(ye$1(r$1.constructor, e.constructor, t, i$2) || Oi$1(r$1) && Oi$1(e))) return !1;
				const h$3 = [...Object.keys(r$1), ...Ri(r$1)], l$2 = [...Object.keys(e), ...Ri(e)];
				if (h$3.length !== l$2.length) return !1;
				for (let d$2 = 0; d$2 < h$3.length; d$2++) {
					const g = h$3[d$2], _ = r$1[g];
					if (!Object.hasOwn(e, g)) return !1;
					const u$2 = e[g];
					if (!pe$2(_, u$2, g, r$1, e, t, i$2)) return !1;
				}
				return !0;
			}
			default: return !1;
		}
	} finally {
		t.delete(r$1), t.delete(e);
	}
}
function Ao(r$1, e) {
	return Ro(r$1, e, so);
}
var xo = Object.defineProperty, Ni$1 = Object.getOwnPropertySymbols, No$1 = Object.prototype.hasOwnProperty, $o = Object.prototype.propertyIsEnumerable, Xe$1 = (r$1, e, t) => e in r$1 ? xo(r$1, e, {
	enumerable: !0,
	configurable: !0,
	writable: !0,
	value: t
}) : r$1[e] = t, $i = (r$1, e) => {
	for (var t in e || (e = {})) No$1.call(e, t) && Xe$1(r$1, t, e[t]);
	if (Ni$1) for (var t of Ni$1(e)) $o.call(e, t) && Xe$1(r$1, t, e[t]);
	return r$1;
}, z = (r$1, e, t) => Xe$1(r$1, typeof e != "symbol" ? e + "" : e, t);
var zi = class extends f$1 {
	constructor(e, t, i$2, s = B$1, n$1 = void 0) {
		super(e, t, i$2, s), this.core = e, this.logger = t, this.name = i$2, z(this, "map", /* @__PURE__ */ new Map()), z(this, "version", "0.3"), z(this, "cached", []), z(this, "initialized", !1), z(this, "getKey"), z(this, "storagePrefix", B$1), z(this, "recentlyDeleted", []), z(this, "recentlyDeletedLimit", 200), z(this, "init", async () => {
			this.initialized || (this.logger.trace("Initialized"), await this.restore(), this.cached.forEach((o$1) => {
				this.getKey && o$1 !== null && !Et(o$1) ? this.map.set(this.getKey(o$1), o$1) : la(o$1) ? this.map.set(o$1.id, o$1) : da(o$1) && this.map.set(o$1.topic, o$1);
			}), this.cached = [], this.initialized = !0);
		}), z(this, "set", async (o$1, a$1) => {
			this.isInitialized(), this.map.has(o$1) ? await this.update(o$1, a$1) : (this.logger.debug("Setting value"), this.logger.trace({
				type: "method",
				method: "set",
				key: o$1,
				value: a$1
			}), this.map.set(o$1, a$1), await this.persist());
		}), z(this, "get", (o$1) => (this.isInitialized(), this.logger.debug("Getting value"), this.logger.trace({
			type: "method",
			method: "get",
			key: o$1
		}), this.getData(o$1))), z(this, "getAll", (o$1) => (this.isInitialized(), o$1 ? this.values.filter((a$1) => Object.keys(o$1).every((c$2) => Ao(a$1[c$2], o$1[c$2]))) : this.values)), z(this, "update", async (o$1, a$1) => {
			this.isInitialized(), this.logger.debug("Updating value"), this.logger.trace({
				type: "method",
				method: "update",
				key: o$1,
				update: a$1
			});
			const c$2 = $i($i({}, this.getData(o$1)), a$1);
			this.map.set(o$1, c$2), await this.persist();
		}), z(this, "delete", async (o$1, a$1) => {
			this.isInitialized(), this.map.has(o$1) && (this.logger.debug("Deleting value"), this.logger.trace({
				type: "method",
				method: "delete",
				key: o$1,
				reason: a$1
			}), this.map.delete(o$1), this.addToRecentlyDeleted(o$1), await this.persist());
		}), this.logger = E$1(t, this.name), this.storagePrefix = s, this.getKey = n$1;
	}
	get context() {
		return y$1(this.logger);
	}
	get storageKey() {
		return this.storagePrefix + this.version + this.core.customStoragePrefix + "//" + this.name;
	}
	get length() {
		return this.map.size;
	}
	get keys() {
		return Array.from(this.map.keys());
	}
	get values() {
		return Array.from(this.map.values());
	}
	addToRecentlyDeleted(e) {
		this.recentlyDeleted.push(e), this.recentlyDeleted.length >= this.recentlyDeletedLimit && this.recentlyDeleted.splice(0, this.recentlyDeletedLimit / 2);
	}
	async setDataStore(e) {
		await this.core.storage.setItem(this.storageKey, e);
	}
	async getDataStore() {
		return await this.core.storage.getItem(this.storageKey);
	}
	getData(e) {
		const t = this.map.get(e);
		if (!t) {
			if (this.recentlyDeleted.includes(e)) {
				const { message: s } = ht$1("MISSING_OR_INVALID", `Record was recently deleted - ${this.name}: ${e}`);
				throw this.logger.error(s), new Error(s);
			}
			const { message: i$2 } = ht$1("NO_MATCHING_KEY", `${this.name}: ${e}`);
			throw this.logger.error(i$2), new Error(i$2);
		}
		return t;
	}
	async persist() {
		await this.setDataStore(this.values);
	}
	async restore() {
		try {
			const e = await this.getDataStore();
			if (typeof e > "u" || !e.length) return;
			if (this.map.size) {
				const { message: t } = ht$1("RESTORE_WILL_OVERRIDE", this.name);
				throw this.logger.error(t), new Error(t);
			}
			this.cached = e, this.logger.debug(`Successfully Restored value for ${this.name}`), this.logger.trace({
				type: "method",
				method: "restore",
				value: this.values
			});
		} catch (e) {
			this.logger.debug(`Failed to Restore value for ${this.name}`), this.logger.error(e);
		}
	}
	isInitialized() {
		if (!this.initialized) {
			const { message: e } = ht$1("NOT_INITIALIZED", this.name);
			throw new Error(e);
		}
	}
};
var zo = Object.defineProperty, Lo = (r$1, e, t) => e in r$1 ? zo(r$1, e, {
	enumerable: !0,
	configurable: !0,
	writable: !0,
	value: t
}) : r$1[e] = t, p = (r$1, e, t) => Lo(r$1, typeof e != "symbol" ? e + "" : e, t);
var Li = class {
	constructor(e, t) {
		this.core = e, this.logger = t, p(this, "name", Mt$1), p(this, "version", "0.3"), p(this, "events", new import_events$2.default()), p(this, "pairings"), p(this, "initialized", !1), p(this, "storagePrefix", B$1), p(this, "ignoredPayloadTypes", [1]), p(this, "registeredMethods", []), p(this, "init", async () => {
			this.initialized || (await this.pairings.init(), await this.cleanup(), this.registerRelayerEvents(), this.registerExpirerEvents(), this.initialized = !0, this.logger.trace("Initialized"));
		}), p(this, "register", ({ methods: i$2 }) => {
			this.isInitialized(), this.registeredMethods = [...new Set([...this.registeredMethods, ...i$2])];
		}), p(this, "create", async (i$2) => {
			this.isInitialized();
			const s = jc(), n$1 = await this.core.crypto.setSymKey(s), o$1 = Ei(import_cjs$1.FIVE_MINUTES), a$1 = { protocol: "irn" }, c$2 = {
				topic: n$1,
				expiry: o$1,
				relay: a$1,
				active: !1,
				methods: i$2?.methods
			}, h$3 = Wc({
				protocol: this.core.protocol,
				version: this.core.version,
				topic: n$1,
				symKey: s,
				relay: a$1,
				expiryTimestamp: o$1,
				methods: i$2?.methods
			});
			return this.events.emit(re$1.create, c$2), this.core.expirer.set(n$1, o$1), await this.pairings.set(n$1, c$2), await this.core.relayer.subscribe(n$1, { transportType: i$2?.transportType }), {
				topic: n$1,
				uri: h$3
			};
		}), p(this, "pair", async (i$2) => {
			this.isInitialized();
			const s = this.core.eventClient.createEvent({ properties: {
				topic: i$2?.uri,
				trace: [G.pairing_started]
			} });
			this.isValidPair(i$2, s);
			const { topic: n$1, symKey: o$1, relay: a$1, expiryTimestamp: c$2, methods: h$3 } = Gc(i$2.uri);
			s.props.properties.topic = n$1, s.addTrace(G.pairing_uri_validation_success), s.addTrace(G.pairing_uri_not_expired);
			let l$2;
			if (this.pairings.keys.includes(n$1)) {
				if (l$2 = this.pairings.get(n$1), s.addTrace(G.existing_pairing), l$2.active) throw s.setError(Y$1.active_pairing_already_exists), /* @__PURE__ */ new Error(`Pairing already exists: ${n$1}. Please try again with a new connection URI.`);
				s.addTrace(G.pairing_not_expired);
			}
			const d$2 = c$2 || Ei(import_cjs$1.FIVE_MINUTES), g = {
				topic: n$1,
				relay: a$1,
				expiry: d$2,
				active: !1,
				methods: h$3
			};
			this.core.expirer.set(n$1, d$2), await this.pairings.set(n$1, g), s.addTrace(G.store_new_pairing), i$2.activatePairing && await this.activate({ topic: n$1 }), this.events.emit(re$1.create, g), s.addTrace(G.emit_inactive_pairing), this.core.crypto.keychain.has(n$1) || await this.core.crypto.setSymKey(o$1, n$1), s.addTrace(G.subscribing_pairing_topic);
			try {
				await this.core.relayer.confirmOnlineStateOrThrow();
			} catch {
				s.setError(Y$1.no_internet_connection);
			}
			try {
				await this.core.relayer.subscribe(n$1, { relay: a$1 });
			} catch (_) {
				throw s.setError(Y$1.subscribe_pairing_topic_failure), _;
			}
			return s.addTrace(G.subscribe_pairing_topic_success), g;
		}), p(this, "activate", async ({ topic: i$2 }) => {
			this.isInitialized();
			const s = Ei(import_cjs$1.FIVE_MINUTES);
			this.core.expirer.set(i$2, s), await this.pairings.update(i$2, {
				active: !0,
				expiry: s
			});
		}), p(this, "ping", async (i$2) => {
			this.isInitialized(), await this.isValidPing(i$2), this.logger.warn("ping() is deprecated and will be removed in the next major release.");
			const { topic: s } = i$2;
			if (this.pairings.keys.includes(s)) {
				const n$1 = await this.sendRequest(s, "wc_pairingPing", {}), { done: o$1, resolve: a$1, reject: c$2 } = gi();
				this.events.once(xi("pairing_ping", n$1), ({ error: h$3 }) => {
					h$3 ? c$2(h$3) : a$1();
				}), await o$1();
			}
		}), p(this, "updateExpiry", async ({ topic: i$2, expiry: s }) => {
			this.isInitialized(), await this.pairings.update(i$2, { expiry: s });
		}), p(this, "updateMetadata", async ({ topic: i$2, metadata: s }) => {
			this.isInitialized(), await this.pairings.update(i$2, { peerMetadata: s });
		}), p(this, "getPairings", () => (this.isInitialized(), this.pairings.values)), p(this, "disconnect", async (i$2) => {
			this.isInitialized(), await this.isValidDisconnect(i$2);
			const { topic: s } = i$2;
			this.pairings.keys.includes(s) && (await this.sendRequest(s, "wc_pairingDelete", Nt("USER_DISCONNECTED")), await this.deletePairing(s));
		}), p(this, "formatUriFromPairing", (i$2) => {
			this.isInitialized();
			const { topic: s, relay: n$1, expiry: o$1, methods: a$1 } = i$2, c$2 = this.core.crypto.keychain.get(s);
			return Wc({
				protocol: this.core.protocol,
				version: this.core.version,
				topic: s,
				symKey: c$2,
				relay: n$1,
				expiryTimestamp: o$1,
				methods: a$1
			});
		}), p(this, "sendRequest", async (i$2, s, n$1) => {
			const o$1 = formatJsonRpcRequest(s, n$1), a$1 = await this.core.crypto.encode(i$2, o$1), c$2 = se$2[s].req;
			return this.core.history.set(i$2, o$1), this.core.relayer.publish(i$2, a$1, c$2), o$1.id;
		}), p(this, "sendResult", async (i$2, s, n$1) => {
			const o$1 = formatJsonRpcResult(i$2, n$1), a$1 = await this.core.crypto.encode(s, o$1), c$2 = (await this.core.history.get(s, i$2)).request.method, h$3 = se$2[c$2].res;
			await this.core.relayer.publish(s, a$1, h$3), await this.core.history.resolve(o$1);
		}), p(this, "sendError", async (i$2, s, n$1) => {
			const o$1 = formatJsonRpcError(i$2, n$1), a$1 = await this.core.crypto.encode(s, o$1), c$2 = (await this.core.history.get(s, i$2)).request.method, h$3 = se$2[c$2] ? se$2[c$2].res : se$2.unregistered_method.res;
			await this.core.relayer.publish(s, a$1, h$3), await this.core.history.resolve(o$1);
		}), p(this, "deletePairing", async (i$2, s) => {
			await this.core.relayer.unsubscribe(i$2), await Promise.all([
				this.pairings.delete(i$2, Nt("USER_DISCONNECTED")),
				this.core.crypto.deleteSymKey(i$2),
				s ? Promise.resolve() : this.core.expirer.del(i$2)
			]);
		}), p(this, "cleanup", async () => {
			const i$2 = this.pairings.getAll().filter((s) => vi(s.expiry));
			await Promise.all(i$2.map((s) => this.deletePairing(s.topic)));
		}), p(this, "onRelayEventRequest", async (i$2) => {
			const { topic: s, payload: n$1 } = i$2;
			switch (n$1.method) {
				case "wc_pairingPing": return await this.onPairingPingRequest(s, n$1);
				case "wc_pairingDelete": return await this.onPairingDeleteRequest(s, n$1);
				default: return await this.onUnknownRpcMethodRequest(s, n$1);
			}
		}), p(this, "onRelayEventResponse", async (i$2) => {
			const { topic: s, payload: n$1 } = i$2, o$1 = (await this.core.history.get(s, n$1.id)).request.method;
			switch (o$1) {
				case "wc_pairingPing": return this.onPairingPingResponse(s, n$1);
				default: return this.onUnknownRpcMethodResponse(o$1);
			}
		}), p(this, "onPairingPingRequest", async (i$2, s) => {
			const { id: n$1 } = s;
			try {
				this.isValidPing({ topic: i$2 }), await this.sendResult(n$1, i$2, !0), this.events.emit(re$1.ping, {
					id: n$1,
					topic: i$2
				});
			} catch (o$1) {
				await this.sendError(n$1, i$2, o$1), this.logger.error(o$1);
			}
		}), p(this, "onPairingPingResponse", (i$2, s) => {
			const { id: n$1 } = s;
			setTimeout(() => {
				isJsonRpcResult(s) ? this.events.emit(xi("pairing_ping", n$1), {}) : isJsonRpcError(s) && this.events.emit(xi("pairing_ping", n$1), { error: s.error });
			}, 500);
		}), p(this, "onPairingDeleteRequest", async (i$2, s) => {
			const { id: n$1 } = s;
			try {
				this.isValidDisconnect({ topic: i$2 }), await this.deletePairing(i$2), this.events.emit(re$1.delete, {
					id: n$1,
					topic: i$2
				});
			} catch (o$1) {
				await this.sendError(n$1, i$2, o$1), this.logger.error(o$1);
			}
		}), p(this, "onUnknownRpcMethodRequest", async (i$2, s) => {
			const { id: n$1, method: o$1 } = s;
			try {
				if (this.registeredMethods.includes(o$1)) return;
				const a$1 = Nt("WC_METHOD_UNSUPPORTED", o$1);
				await this.sendError(n$1, i$2, a$1), this.logger.error(a$1);
			} catch (a$1) {
				await this.sendError(n$1, i$2, a$1), this.logger.error(a$1);
			}
		}), p(this, "onUnknownRpcMethodResponse", (i$2) => {
			this.registeredMethods.includes(i$2) || this.logger.error(Nt("WC_METHOD_UNSUPPORTED", i$2));
		}), p(this, "isValidPair", (i$2, s) => {
			var n$1;
			if (!ma(i$2)) {
				const { message: a$1 } = ht$1("MISSING_OR_INVALID", `pair() params: ${i$2}`);
				throw s.setError(Y$1.malformed_pairing_uri), new Error(a$1);
			}
			if (!fa(i$2.uri)) {
				const { message: a$1 } = ht$1("MISSING_OR_INVALID", `pair() uri: ${i$2.uri}`);
				throw s.setError(Y$1.malformed_pairing_uri), new Error(a$1);
			}
			const o$1 = Gc(i$2?.uri);
			if (!((n$1 = o$1?.relay) != null && n$1.protocol)) {
				const { message: a$1 } = ht$1("MISSING_OR_INVALID", "pair() uri#relay-protocol");
				throw s.setError(Y$1.malformed_pairing_uri), new Error(a$1);
			}
			if (!(o$1 != null && o$1.symKey)) {
				const { message: a$1 } = ht$1("MISSING_OR_INVALID", "pair() uri#symKey");
				throw s.setError(Y$1.malformed_pairing_uri), new Error(a$1);
			}
			if (o$1 != null && o$1.expiryTimestamp && (0, import_cjs$1.toMiliseconds)(o$1?.expiryTimestamp) < Date.now()) {
				s.setError(Y$1.pairing_expired);
				const { message: a$1 } = ht$1("EXPIRED", "pair() URI has expired. Please try again with a new connection URI.");
				throw new Error(a$1);
			}
		}), p(this, "isValidPing", async (i$2) => {
			if (!ma(i$2)) {
				const { message: n$1 } = ht$1("MISSING_OR_INVALID", `ping() params: ${i$2}`);
				throw new Error(n$1);
			}
			const { topic: s } = i$2;
			await this.isValidPairingTopic(s);
		}), p(this, "isValidDisconnect", async (i$2) => {
			if (!ma(i$2)) {
				const { message: n$1 } = ht$1("MISSING_OR_INVALID", `disconnect() params: ${i$2}`);
				throw new Error(n$1);
			}
			const { topic: s } = i$2;
			await this.isValidPairingTopic(s);
		}), p(this, "isValidPairingTopic", async (i$2) => {
			if (!nt$1(i$2, !1)) {
				const { message: s } = ht$1("MISSING_OR_INVALID", `pairing topic should be a string: ${i$2}`);
				throw new Error(s);
			}
			if (!this.pairings.keys.includes(i$2)) {
				const { message: s } = ht$1("NO_MATCHING_KEY", `pairing topic doesn't exist: ${i$2}`);
				throw new Error(s);
			}
			if (vi(this.pairings.get(i$2).expiry)) {
				await this.deletePairing(i$2);
				const { message: s } = ht$1("EXPIRED", `pairing topic: ${i$2}`);
				throw new Error(s);
			}
		}), this.core = e, this.logger = E$1(t, this.name), this.pairings = new zi(this.core, this.logger, this.name, this.storagePrefix);
	}
	get context() {
		return y$1(this.logger);
	}
	isInitialized() {
		if (!this.initialized) {
			const { message: e } = ht$1("NOT_INITIALIZED", this.name);
			throw new Error(e);
		}
	}
	registerRelayerEvents() {
		this.core.relayer.on(C$1.message, async (e) => {
			const { topic: t, message: i$2, transportType: s } = e;
			if (this.pairings.keys.includes(t) && s !== Q$1.link_mode && !this.ignoredPayloadTypes.includes(this.core.crypto.getPayloadType(i$2))) try {
				const n$1 = await this.core.crypto.decode(t, i$2);
				isJsonRpcRequest(n$1) ? (this.core.history.set(t, n$1), await this.onRelayEventRequest({
					topic: t,
					payload: n$1
				})) : isJsonRpcResponse(n$1) && (await this.core.history.resolve(n$1), await this.onRelayEventResponse({
					topic: t,
					payload: n$1
				}), this.core.history.delete(t, n$1.id)), await this.core.relayer.messages.ack(t, i$2);
			} catch (n$1) {
				this.logger.error(n$1);
			}
		});
	}
	registerExpirerEvents() {
		this.core.expirer.on(M$1.expired, async (e) => {
			const { topic: t } = bi(e.target);
			t && this.pairings.keys.includes(t) && (await this.deletePairing(t, !0), this.events.emit(re$1.expire, { topic: t }));
		});
	}
};
var ko = Object.defineProperty, jo = (r$1, e, t) => e in r$1 ? ko(r$1, e, {
	enumerable: !0,
	configurable: !0,
	writable: !0,
	value: t
}) : r$1[e] = t, O$2 = (r$1, e, t) => jo(r$1, typeof e != "symbol" ? e + "" : e, t);
var ki = class extends I$1 {
	constructor(e, t) {
		super(e, t), this.core = e, this.logger = t, O$2(this, "records", /* @__PURE__ */ new Map()), O$2(this, "events", new import_events$2.EventEmitter()), O$2(this, "name", Bt$2), O$2(this, "version", "0.3"), O$2(this, "cached", []), O$2(this, "initialized", !1), O$2(this, "storagePrefix", B$1), O$2(this, "init", async () => {
			this.initialized || (this.logger.trace("Initialized"), await this.restore(), this.cached.forEach((i$2) => this.records.set(i$2.id, i$2)), this.cached = [], this.registerEventListeners(), this.initialized = !0);
		}), O$2(this, "set", (i$2, s, n$1) => {
			if (this.isInitialized(), this.logger.debug("Setting JSON-RPC request history record"), this.logger.trace({
				type: "method",
				method: "set",
				topic: i$2,
				request: s,
				chainId: n$1
			}), this.records.has(s.id)) return;
			const o$1 = {
				id: s.id,
				topic: i$2,
				request: {
					method: s.method,
					params: s.params || null
				},
				chainId: n$1,
				expiry: Ei(import_cjs$1.THIRTY_DAYS)
			};
			this.records.set(o$1.id, o$1), this.persist(), this.events.emit(F$1.created, o$1);
		}), O$2(this, "resolve", async (i$2) => {
			if (this.isInitialized(), this.logger.debug("Updating JSON-RPC response history record"), this.logger.trace({
				type: "method",
				method: "update",
				response: i$2
			}), !this.records.has(i$2.id)) return;
			const s = await this.getRecord(i$2.id);
			typeof s.response > "u" && (s.response = isJsonRpcError(i$2) ? { error: i$2.error } : { result: i$2.result }, this.records.set(s.id, s), this.persist(), this.events.emit(F$1.updated, s));
		}), O$2(this, "get", async (i$2, s) => (this.isInitialized(), this.logger.debug("Getting record"), this.logger.trace({
			type: "method",
			method: "get",
			topic: i$2,
			id: s
		}), await this.getRecord(s))), O$2(this, "delete", (i$2, s) => {
			this.isInitialized(), this.logger.debug("Deleting record"), this.logger.trace({
				type: "method",
				method: "delete",
				id: s
			}), this.values.forEach((n$1) => {
				if (n$1.topic === i$2) {
					if (typeof s < "u" && n$1.id !== s) return;
					this.records.delete(n$1.id), this.events.emit(F$1.deleted, n$1);
				}
			}), this.persist();
		}), O$2(this, "exists", async (i$2, s) => (this.isInitialized(), this.records.has(s) ? (await this.getRecord(s)).topic === i$2 : !1)), O$2(this, "on", (i$2, s) => {
			this.events.on(i$2, s);
		}), O$2(this, "once", (i$2, s) => {
			this.events.once(i$2, s);
		}), O$2(this, "off", (i$2, s) => {
			this.events.off(i$2, s);
		}), O$2(this, "removeListener", (i$2, s) => {
			this.events.removeListener(i$2, s);
		}), this.logger = E$1(t, this.name);
	}
	get context() {
		return y$1(this.logger);
	}
	get storageKey() {
		return this.storagePrefix + this.version + this.core.customStoragePrefix + "//" + this.name;
	}
	get size() {
		return this.records.size;
	}
	get keys() {
		return Array.from(this.records.keys());
	}
	get values() {
		return Array.from(this.records.values());
	}
	get pending() {
		const e = [];
		return this.values.forEach((t) => {
			if (typeof t.response < "u") return;
			const i$2 = {
				topic: t.topic,
				request: formatJsonRpcRequest(t.request.method, t.request.params, t.id),
				chainId: t.chainId
			};
			return e.push(i$2);
		}), e;
	}
	async setJsonRpcRecords(e) {
		await this.core.storage.setItem(this.storageKey, e);
	}
	async getJsonRpcRecords() {
		return await this.core.storage.getItem(this.storageKey);
	}
	getRecord(e) {
		this.isInitialized();
		const t = this.records.get(e);
		if (!t) {
			const { message: i$2 } = ht$1("NO_MATCHING_KEY", `${this.name}: ${e}`);
			throw new Error(i$2);
		}
		return t;
	}
	async persist() {
		await this.setJsonRpcRecords(this.values), this.events.emit(F$1.sync);
	}
	async restore() {
		try {
			const e = await this.getJsonRpcRecords();
			if (typeof e > "u" || !e.length) return;
			if (this.records.size) {
				const { message: t } = ht$1("RESTORE_WILL_OVERRIDE", this.name);
				throw this.logger.error(t), new Error(t);
			}
			this.cached = e, this.logger.debug(`Successfully Restored records for ${this.name}`), this.logger.trace({
				type: "method",
				method: "restore",
				records: this.values
			});
		} catch (e) {
			this.logger.debug(`Failed to Restore records for ${this.name}`), this.logger.error(e);
		}
	}
	registerEventListeners() {
		this.events.on(F$1.created, (e) => {
			const t = F$1.created;
			this.logger.info(`Emitting ${t}`), this.logger.debug({
				type: "event",
				event: t,
				record: e
			});
		}), this.events.on(F$1.updated, (e) => {
			const t = F$1.updated;
			this.logger.info(`Emitting ${t}`), this.logger.debug({
				type: "event",
				event: t,
				record: e
			});
		}), this.events.on(F$1.deleted, (e) => {
			const t = F$1.deleted;
			this.logger.info(`Emitting ${t}`), this.logger.debug({
				type: "event",
				event: t,
				record: e
			});
		}), this.core.heartbeat.on(r.pulse, () => {
			this.cleanup();
		});
	}
	cleanup() {
		try {
			this.isInitialized();
			let e = !1;
			this.records.forEach((t) => {
				(0, import_cjs$1.toMiliseconds)(t.expiry || 0) - Date.now() <= 0 && (this.logger.info(`Deleting expired history log: ${t.id}`), this.records.delete(t.id), this.events.emit(F$1.deleted, t, !1), e = !0);
			}), e && this.persist();
		} catch (e) {
			this.logger.warn(e);
		}
	}
	isInitialized() {
		if (!this.initialized) {
			const { message: e } = ht$1("NOT_INITIALIZED", this.name);
			throw new Error(e);
		}
	}
};
var Uo = Object.defineProperty, Fo = (r$1, e, t) => e in r$1 ? Uo(r$1, e, {
	enumerable: !0,
	configurable: !0,
	writable: !0,
	value: t
}) : r$1[e] = t, A$2 = (r$1, e, t) => Fo(r$1, typeof e != "symbol" ? e + "" : e, t);
var ji = class extends S$1 {
	constructor(e, t) {
		super(e, t), this.core = e, this.logger = t, A$2(this, "expirations", /* @__PURE__ */ new Map()), A$2(this, "events", new import_events$2.EventEmitter()), A$2(this, "name", qt$2), A$2(this, "version", "0.3"), A$2(this, "cached", []), A$2(this, "initialized", !1), A$2(this, "storagePrefix", B$1), A$2(this, "init", async () => {
			this.initialized || (this.logger.trace("Initialized"), await this.restore(), this.cached.forEach((i$2) => this.expirations.set(i$2.target, i$2)), this.cached = [], this.registerEventListeners(), this.initialized = !0);
		}), A$2(this, "has", (i$2) => {
			try {
				const s = this.formatTarget(i$2);
				return typeof this.getExpiration(s) < "u";
			} catch {
				return !1;
			}
		}), A$2(this, "set", (i$2, s) => {
			this.isInitialized();
			const n$1 = this.formatTarget(i$2), o$1 = {
				target: n$1,
				expiry: s
			};
			this.expirations.set(n$1, o$1), this.checkExpiry(n$1, o$1), this.events.emit(M$1.created, {
				target: n$1,
				expiration: o$1
			});
		}), A$2(this, "get", (i$2) => {
			this.isInitialized();
			const s = this.formatTarget(i$2);
			return this.getExpiration(s);
		}), A$2(this, "del", (i$2) => {
			if (this.isInitialized(), this.has(i$2)) {
				const s = this.formatTarget(i$2), n$1 = this.getExpiration(s);
				this.expirations.delete(s), this.events.emit(M$1.deleted, {
					target: s,
					expiration: n$1
				});
			}
		}), A$2(this, "on", (i$2, s) => {
			this.events.on(i$2, s);
		}), A$2(this, "once", (i$2, s) => {
			this.events.once(i$2, s);
		}), A$2(this, "off", (i$2, s) => {
			this.events.off(i$2, s);
		}), A$2(this, "removeListener", (i$2, s) => {
			this.events.removeListener(i$2, s);
		}), this.logger = E$1(t, this.name);
	}
	get context() {
		return y$1(this.logger);
	}
	get storageKey() {
		return this.storagePrefix + this.version + this.core.customStoragePrefix + "//" + this.name;
	}
	get length() {
		return this.expirations.size;
	}
	get keys() {
		return Array.from(this.expirations.keys());
	}
	get values() {
		return Array.from(this.expirations.values());
	}
	formatTarget(e) {
		if (typeof e == "string") return mi(e);
		if (typeof e == "number") return wi(e);
		const { message: t } = ht$1("UNKNOWN_TYPE", `Target type: ${typeof e}`);
		throw new Error(t);
	}
	async setExpirations(e) {
		await this.core.storage.setItem(this.storageKey, e);
	}
	async getExpirations() {
		return await this.core.storage.getItem(this.storageKey);
	}
	async persist() {
		await this.setExpirations(this.values), this.events.emit(M$1.sync);
	}
	async restore() {
		try {
			const e = await this.getExpirations();
			if (typeof e > "u" || !e.length) return;
			if (this.expirations.size) {
				const { message: t } = ht$1("RESTORE_WILL_OVERRIDE", this.name);
				throw this.logger.error(t), new Error(t);
			}
			this.cached = e, this.logger.debug(`Successfully Restored expirations for ${this.name}`), this.logger.trace({
				type: "method",
				method: "restore",
				expirations: this.values
			});
		} catch (e) {
			this.logger.debug(`Failed to Restore expirations for ${this.name}`), this.logger.error(e);
		}
	}
	getExpiration(e) {
		const t = this.expirations.get(e);
		if (!t) {
			const { message: i$2 } = ht$1("NO_MATCHING_KEY", `${this.name}: ${e}`);
			throw this.logger.warn(i$2), new Error(i$2);
		}
		return t;
	}
	checkExpiry(e, t) {
		const { expiry: i$2 } = t;
		(0, import_cjs$1.toMiliseconds)(i$2) - Date.now() <= 0 && this.expire(e, t);
	}
	expire(e, t) {
		this.expirations.delete(e), this.events.emit(M$1.expired, {
			target: e,
			expiration: t
		});
	}
	checkExpirations() {
		this.core.relayer.connected && this.expirations.forEach((e, t) => this.checkExpiry(t, e));
	}
	registerEventListeners() {
		this.core.heartbeat.on(r.pulse, () => this.checkExpirations()), this.events.on(M$1.created, (e) => {
			const t = M$1.created;
			this.logger.info(`Emitting ${t}`), this.logger.debug({
				type: "event",
				event: t,
				data: e
			}), this.persist();
		}), this.events.on(M$1.expired, (e) => {
			const t = M$1.expired;
			this.logger.info(`Emitting ${t}`), this.logger.debug({
				type: "event",
				event: t,
				data: e
			}), this.persist();
		}), this.events.on(M$1.deleted, (e) => {
			const t = M$1.deleted;
			this.logger.info(`Emitting ${t}`), this.logger.debug({
				type: "event",
				event: t,
				data: e
			}), this.persist();
		});
	}
	isInitialized() {
		if (!this.initialized) {
			const { message: e } = ht$1("NOT_INITIALIZED", this.name);
			throw new Error(e);
		}
	}
};
var Mo = Object.defineProperty, Ko = (r$1, e, t) => e in r$1 ? Mo(r$1, e, {
	enumerable: !0,
	configurable: !0,
	writable: !0,
	value: t
}) : r$1[e] = t, w = (r$1, e, t) => Ko(r$1, typeof e != "symbol" ? e + "" : e, t);
var Ui = class extends M$2 {
	constructor(e, t, i$2) {
		super(e, t, i$2), this.core = e, this.logger = t, this.store = i$2, w(this, "name", Wt$1), w(this, "abortController"), w(this, "isDevEnv"), w(this, "verifyUrlV3", Yt$1), w(this, "storagePrefix", B$1), w(this, "version", 2), w(this, "publicKey"), w(this, "fetchPromise"), w(this, "init", async () => {
			var s;
			this.isDevEnv || (this.publicKey = await this.store.getItem(this.storeKey), this.publicKey && (0, import_cjs$1.toMiliseconds)((s = this.publicKey) == null ? void 0 : s.expiresAt) < Date.now() && (this.logger.debug("verify v2 public key expired"), await this.removePublicKey()));
		}), w(this, "register", async (s) => {
			if (!Tt$1() || this.isDevEnv) return;
			const n$1 = window.location.origin, { id: o$1, decryptedId: a$1 } = s, c$2 = `${this.verifyUrlV3}/attestation?projectId=${this.core.projectId}&origin=${n$1}&id=${o$1}&decryptedId=${a$1}`;
			try {
				const h$3 = (0, import_cjs$2.getDocument)(), l$2 = this.startAbortTimer(import_cjs$1.ONE_SECOND * 5), d$2 = await new Promise((g, _) => {
					const u$2 = () => {
						window.removeEventListener("message", x$1), h$3.body.removeChild(b$3), _("attestation aborted");
					};
					this.abortController.signal.addEventListener("abort", u$2);
					const b$3 = h$3.createElement("iframe");
					b$3.src = c$2, b$3.style.display = "none", b$3.addEventListener("error", u$2, { signal: this.abortController.signal });
					const x$1 = (I$2) => {
						if (I$2.data && typeof I$2.data == "string") try {
							const D$1 = JSON.parse(I$2.data);
							if (D$1.type === "verify_attestation") {
								if (sn(D$1.attestation).payload.id !== o$1) return;
								clearInterval(l$2), h$3.body.removeChild(b$3), this.abortController.signal.removeEventListener("abort", u$2), window.removeEventListener("message", x$1), g(D$1.attestation === null ? "" : D$1.attestation);
							}
						} catch (D$1) {
							this.logger.warn(D$1);
						}
					};
					h$3.body.appendChild(b$3), window.addEventListener("message", x$1, { signal: this.abortController.signal });
				});
				return this.logger.debug("jwt attestation", d$2), d$2;
			} catch (h$3) {
				this.logger.warn(h$3);
			}
			return "";
		}), w(this, "resolve", async (s) => {
			if (this.isDevEnv) return "";
			const { attestationId: n$1, hash: o$1, encryptedId: a$1 } = s;
			if (n$1 === "") {
				this.logger.debug("resolve: attestationId is empty, skipping");
				return;
			}
			if (n$1) {
				if (sn(n$1).payload.id !== a$1) return;
				const h$3 = await this.isValidJwtAttestation(n$1);
				if (h$3) {
					if (!h$3.isVerified) {
						this.logger.warn("resolve: jwt attestation: origin url not verified");
						return;
					}
					return h$3;
				}
			}
			if (!o$1) return;
			const c$2 = this.getVerifyUrl(s?.verifyUrl);
			return this.fetchAttestation(o$1, c$2);
		}), w(this, "fetchAttestation", async (s, n$1) => {
			this.logger.debug(`resolving attestation: ${s} from url: ${n$1}`);
			const o$1 = this.startAbortTimer(import_cjs$1.ONE_SECOND * 5), a$1 = await fetch(`${n$1}/attestation/${s}?v2Supported=true`, { signal: this.abortController.signal });
			return clearTimeout(o$1), a$1.status === 200 ? await a$1.json() : void 0;
		}), w(this, "getVerifyUrl", (s) => {
			let n$1 = s || "https://verify.walletconnect.org";
			return Jt$1.includes(n$1) || (this.logger.info(`verify url: ${n$1}, not included in trusted list, assigning default: https://verify.walletconnect.org`), n$1 = "https://verify.walletconnect.org"), n$1;
		}), w(this, "fetchPublicKey", async () => {
			try {
				this.logger.debug(`fetching public key from: ${this.verifyUrlV3}`);
				const s = this.startAbortTimer(import_cjs$1.FIVE_SECONDS), n$1 = await fetch(`${this.verifyUrlV3}/public-key`, { signal: this.abortController.signal });
				return clearTimeout(s), await n$1.json();
			} catch (s) {
				this.logger.warn(s);
			}
		}), w(this, "persistPublicKey", async (s) => {
			this.logger.debug("persisting public key to local storage", s), await this.store.setItem(this.storeKey, s), this.publicKey = s;
		}), w(this, "removePublicKey", async () => {
			this.logger.debug("removing verify v2 public key from storage"), await this.store.removeItem(this.storeKey), this.publicKey = void 0;
		}), w(this, "isValidJwtAttestation", async (s) => {
			const n$1 = await this.getPublicKey();
			try {
				if (n$1) return this.validateAttestation(s, n$1);
			} catch (a$1) {
				this.logger.error(a$1), this.logger.warn("error validating attestation");
			}
			const o$1 = await this.fetchAndPersistPublicKey();
			try {
				if (o$1) return this.validateAttestation(s, o$1);
			} catch (a$1) {
				this.logger.error(a$1), this.logger.warn("error validating attestation");
			}
		}), w(this, "getPublicKey", async () => this.publicKey ? this.publicKey : await this.fetchAndPersistPublicKey()), w(this, "fetchAndPersistPublicKey", async () => {
			if (this.fetchPromise) return await this.fetchPromise, this.publicKey;
			this.fetchPromise = new Promise(async (n$1) => {
				const o$1 = await this.fetchPublicKey();
				o$1 && (await this.persistPublicKey(o$1), n$1(o$1));
			});
			const s = await this.fetchPromise;
			return this.fetchPromise = void 0, s;
		}), w(this, "validateAttestation", (s, n$1) => {
			const o$1 = zc(s, n$1.publicKey), a$1 = {
				hasExpired: (0, import_cjs$1.toMiliseconds)(o$1.exp) < Date.now(),
				payload: o$1
			};
			if (a$1.hasExpired) throw this.logger.warn("resolve: jwt attestation expired"), /* @__PURE__ */ new Error("JWT attestation expired");
			return {
				origin: a$1.payload.origin,
				isScam: a$1.payload.isScam,
				isVerified: a$1.payload.isVerified
			};
		}), this.logger = E$1(t, this.name), this.abortController = new AbortController(), this.isDevEnv = Ii(), this.init();
	}
	get storeKey() {
		return this.storagePrefix + this.version + this.core.customStoragePrefix + "//verify:public:key";
	}
	get context() {
		return y$1(this.logger);
	}
	startAbortTimer(e) {
		return this.abortController = new AbortController(), setTimeout(() => this.abortController.abort(), (0, import_cjs$1.toMiliseconds)(e));
	}
};
var Bo$1 = Object.defineProperty, Vo = (r$1, e, t) => e in r$1 ? Bo$1(r$1, e, {
	enumerable: !0,
	configurable: !0,
	writable: !0,
	value: t
}) : r$1[e] = t, Fi = (r$1, e, t) => Vo(r$1, typeof e != "symbol" ? e + "" : e, t);
var Mi = class extends O$1 {
	constructor(e, t) {
		super(e, t), this.projectId = e, this.logger = t, Fi(this, "context", Xt$1), Fi(this, "registerDeviceToken", async (i$2) => {
			const { clientId: s, token: n$1, notificationType: o$1, enableEncrypted: a$1 = !1 } = i$2, c$2 = `${Zt$1}/${this.projectId}/clients`;
			await fetch(c$2, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					client_id: s,
					type: o$1,
					token: n$1,
					always_raw: a$1
				})
			});
		}), this.logger = E$1(t, this.context);
	}
};
var qo = Object.defineProperty, Ki = Object.getOwnPropertySymbols, Go = Object.prototype.hasOwnProperty, Wo = Object.prototype.propertyIsEnumerable, Ze$2 = (r$1, e, t) => e in r$1 ? qo(r$1, e, {
	enumerable: !0,
	configurable: !0,
	writable: !0,
	value: t
}) : r$1[e] = t, be$1 = (r$1, e) => {
	for (var t in e || (e = {})) Go.call(e, t) && Ze$2(r$1, t, e[t]);
	if (Ki) for (var t of Ki(e)) Wo.call(e, t) && Ze$2(r$1, t, e[t]);
	return r$1;
}, E$3 = (r$1, e, t) => Ze$2(r$1, typeof e != "symbol" ? e + "" : e, t);
var Bi$1 = class extends R$1 {
	constructor(e, t, i$2 = !0) {
		super(e, t, i$2), this.core = e, this.logger = t, E$3(this, "context", ei$1), E$3(this, "storagePrefix", B$1), E$3(this, "storageVersion", Qt$1), E$3(this, "events", /* @__PURE__ */ new Map()), E$3(this, "shouldPersist", !1), E$3(this, "init", async () => {
			if (!Ii()) try {
				const s = {
					eventId: Bi(),
					timestamp: Date.now(),
					domain: this.getAppDomain(),
					props: {
						event: "INIT",
						type: "",
						properties: {
							client_id: await this.core.crypto.getClientId(),
							user_agent: Mn(this.core.relayer.protocol, this.core.relayer.version, _e$3)
						}
					}
				};
				await this.sendEvent([s]);
			} catch (s) {
				this.logger.warn(s);
			}
		}), E$3(this, "createEvent", (s) => {
			const { event: n$1 = "ERROR", type: o$1 = "", properties: { topic: a$1, trace: c$2 } } = s, h$3 = Bi(), l$2 = this.core.projectId || "", d$2 = Date.now(), g = be$1({
				eventId: h$3,
				timestamp: d$2,
				props: {
					event: n$1,
					type: o$1,
					properties: {
						topic: a$1,
						trace: c$2
					}
				},
				bundleId: l$2,
				domain: this.getAppDomain()
			}, this.setMethods(h$3));
			return this.telemetryEnabled && (this.events.set(h$3, g), this.shouldPersist = !0), g;
		}), E$3(this, "getEvent", (s) => {
			const { eventId: n$1, topic: o$1 } = s;
			if (n$1) return this.events.get(n$1);
			const a$1 = Array.from(this.events.values()).find((c$2) => c$2.props.properties.topic === o$1);
			if (a$1) return be$1(be$1({}, a$1), this.setMethods(a$1.eventId));
		}), E$3(this, "deleteEvent", (s) => {
			const { eventId: n$1 } = s;
			this.events.delete(n$1), this.shouldPersist = !0;
		}), E$3(this, "setEventListeners", () => {
			this.core.heartbeat.on(r.pulse, async () => {
				this.shouldPersist && await this.persist(), this.events.forEach((s) => {
					(0, import_cjs$1.fromMiliseconds)(Date.now()) - (0, import_cjs$1.fromMiliseconds)(s.timestamp) > 86400 && (this.events.delete(s.eventId), this.shouldPersist = !0);
				});
			});
		}), E$3(this, "setMethods", (s) => ({
			addTrace: (n$1) => this.addTrace(s, n$1),
			setError: (n$1) => this.setError(s, n$1)
		})), E$3(this, "addTrace", (s, n$1) => {
			const o$1 = this.events.get(s);
			o$1 && (o$1.props.properties.trace.push(n$1), this.events.set(s, o$1), this.shouldPersist = !0);
		}), E$3(this, "setError", (s, n$1) => {
			const o$1 = this.events.get(s);
			o$1 && (o$1.props.type = n$1, o$1.timestamp = Date.now(), this.events.set(s, o$1), this.shouldPersist = !0);
		}), E$3(this, "persist", async () => {
			await this.core.storage.setItem(this.storageKey, Array.from(this.events.values())), this.shouldPersist = !1;
		}), E$3(this, "restore", async () => {
			try {
				const s = await this.core.storage.getItem(this.storageKey) || [];
				if (!s.length) return;
				s.forEach((n$1) => {
					this.events.set(n$1.eventId, be$1(be$1({}, n$1), this.setMethods(n$1.eventId)));
				});
			} catch (s) {
				this.logger.warn(s);
			}
		}), E$3(this, "submit", async () => {
			if (!this.telemetryEnabled || this.events.size === 0) return;
			const s = [];
			for (const [n$1, o$1] of this.events) o$1.props.type && s.push(o$1);
			if (s.length !== 0) try {
				if ((await this.sendEvent(s)).ok) for (const n$1 of s) this.events.delete(n$1.eventId), this.shouldPersist = !0;
			} catch (n$1) {
				this.logger.warn(n$1);
			}
		}), E$3(this, "sendEvent", async (s) => {
			const n$1 = this.getAppDomain() ? "" : "&sp=desktop";
			return await fetch(`${ii}?projectId=${this.core.projectId}&st=events_sdk&sv=js-${_e$3}${n$1}`, {
				method: "POST",
				body: JSON.stringify(s)
			});
		}), E$3(this, "getAppDomain", () => Pn().url), this.logger = E$1(t, this.context), this.telemetryEnabled = i$2, i$2 ? this.restore().then(async () => {
			await this.submit(), this.setEventListeners();
		}) : this.persist();
	}
	get storageKey() {
		return this.storagePrefix + this.storageVersion + this.core.customStoragePrefix + "//" + this.context;
	}
};
var Ho = Object.defineProperty, Vi = Object.getOwnPropertySymbols, Yo = Object.prototype.hasOwnProperty, Jo = Object.prototype.propertyIsEnumerable, Qe$1 = (r$1, e, t) => e in r$1 ? Ho(r$1, e, {
	enumerable: !0,
	configurable: !0,
	writable: !0,
	value: t
}) : r$1[e] = t, qi = (r$1, e) => {
	for (var t in e || (e = {})) Yo.call(e, t) && Qe$1(r$1, t, e[t]);
	if (Vi) for (var t of Vi(e)) Jo.call(e, t) && Qe$1(r$1, t, e[t]);
	return r$1;
}, v$1 = (r$1, e, t) => Qe$1(r$1, typeof e != "symbol" ? e + "" : e, t);
var Xo = class Te$1 extends h$2 {
	constructor(e) {
		var t;
		super(e), v$1(this, "protocol", "wc"), v$1(this, "version", 2), v$1(this, "name", he$1), v$1(this, "relayUrl"), v$1(this, "projectId"), v$1(this, "customStoragePrefix"), v$1(this, "events", new import_events$2.EventEmitter()), v$1(this, "logger"), v$1(this, "heartbeat"), v$1(this, "relayer"), v$1(this, "crypto"), v$1(this, "storage"), v$1(this, "history"), v$1(this, "expirer"), v$1(this, "pairing"), v$1(this, "verify"), v$1(this, "echoClient"), v$1(this, "linkModeSupportedApps"), v$1(this, "eventClient"), v$1(this, "initialized", !1), v$1(this, "logChunkController"), v$1(this, "on", (a$1, c$2) => this.events.on(a$1, c$2)), v$1(this, "once", (a$1, c$2) => this.events.once(a$1, c$2)), v$1(this, "off", (a$1, c$2) => this.events.off(a$1, c$2)), v$1(this, "removeListener", (a$1, c$2) => this.events.removeListener(a$1, c$2)), v$1(this, "dispatchEnvelope", ({ topic: a$1, message: c$2, sessionExists: h$3 }) => {
			if (!a$1 || !c$2) return;
			const l$2 = {
				topic: a$1,
				message: c$2,
				publishedAt: Date.now(),
				transportType: Q$1.link_mode
			};
			this.relayer.onLinkMessageEvent(l$2, { sessionExists: h$3 });
		});
		const i$2 = this.getGlobalCore(e?.customStoragePrefix);
		if (i$2) try {
			return this.customStoragePrefix = i$2.customStoragePrefix, this.logger = i$2.logger, this.heartbeat = i$2.heartbeat, this.crypto = i$2.crypto, this.history = i$2.history, this.expirer = i$2.expirer, this.storage = i$2.storage, this.relayer = i$2.relayer, this.pairing = i$2.pairing, this.verify = i$2.verify, this.echoClient = i$2.echoClient, this.linkModeSupportedApps = i$2.linkModeSupportedApps, this.eventClient = i$2.eventClient, this.initialized = i$2.initialized, this.logChunkController = i$2.logChunkController, i$2;
		} catch (a$1) {
			console.warn("Failed to copy global core", a$1);
		}
		this.projectId = e?.projectId, this.relayUrl = e?.relayUrl || "wss://relay.walletconnect.org", this.customStoragePrefix = e != null && e.customStoragePrefix ? `:${e.customStoragePrefix}` : "";
		const s = k({
			level: typeof e?.logger == "string" && e.logger ? e.logger : Et$2.logger,
			name: he$1
		}), { logger: n$1, chunkLoggerController: o$1 } = A$1({
			opts: s,
			maxSizeInBytes: e?.maxLogBlobSizeInBytes,
			loggerOverride: e?.logger
		});
		this.logChunkController = o$1, (t = this.logChunkController) != null && t.downloadLogsBlobInBrowser && (window.downloadLogsBlobInBrowser = async () => {
			var a$1, c$2;
			(a$1 = this.logChunkController) != null && a$1.downloadLogsBlobInBrowser && ((c$2 = this.logChunkController) == null || c$2.downloadLogsBlobInBrowser({ clientId: await this.crypto.getClientId() }));
		}), this.logger = E$1(n$1, this.name), this.heartbeat = new i(), this.crypto = new vi$1(this, this.logger, e?.keychain), this.history = new ki(this, this.logger), this.expirer = new ji(this, this.logger), this.storage = e != null && e.storage ? e.storage : new h$1(qi(qi({}, It$1), e?.storageOptions)), this.relayer = new Si$1({
			core: this,
			logger: this.logger,
			relayUrl: this.relayUrl,
			projectId: this.projectId
		}), this.pairing = new Li(this, this.logger), this.verify = new Ui(this, this.logger, this.storage), this.echoClient = new Mi(this.projectId || "", this.logger), this.linkModeSupportedApps = [], this.eventClient = new Bi$1(this, this.logger, e?.telemetryEnabled), this.setGlobalCore(this);
	}
	static async init(e) {
		const t = new Te$1(e);
		await t.initialize();
		const i$2 = await t.crypto.getClientId();
		return await t.storage.setItem(jt$1, i$2), t;
	}
	get context() {
		return y$1(this.logger);
	}
	async start() {
		this.initialized || await this.initialize();
	}
	async getLogsBlob() {
		var e;
		return (e = this.logChunkController) == null ? void 0 : e.logsToBlob({ clientId: await this.crypto.getClientId() });
	}
	async addLinkModeSupportedApp(e) {
		this.linkModeSupportedApps.includes(e) || (this.linkModeSupportedApps.push(e), await this.storage.setItem("WALLETCONNECT_LINK_MODE_APPS", this.linkModeSupportedApps));
	}
	async initialize() {
		this.logger.trace("Initialized");
		try {
			await this.crypto.init(), await this.history.init(), await this.expirer.init(), await this.relayer.init(), await this.heartbeat.init(), await this.pairing.init(), this.linkModeSupportedApps = await this.storage.getItem("WALLETCONNECT_LINK_MODE_APPS") || [], this.initialized = !0, this.logger.info("Core Initialization Success");
		} catch (e) {
			throw this.logger.warn(`Core Initialization Failure at epoch ${Date.now()}`, e), this.logger.error(e.message), e;
		}
	}
	getGlobalCore(e = "") {
		try {
			if (this.isGlobalCoreDisabled()) return;
			const t = `_walletConnectCore_${e}`, i$2 = `${t}_count`;
			return globalThis[i$2] = (globalThis[i$2] || 0) + 1, globalThis[i$2] > 1 && console.warn(`WalletConnect Core is already initialized. This is probably a mistake and can lead to unexpected behavior. Init() was called ${globalThis[i$2]} times.`), globalThis[t];
		} catch (t) {
			console.warn("Failed to get global WalletConnect core", t);
			return;
		}
	}
	setGlobalCore(e) {
		var t;
		try {
			if (this.isGlobalCoreDisabled()) return;
			const i$2 = `_walletConnectCore_${((t = e.opts) == null ? void 0 : t.customStoragePrefix) || ""}`;
			globalThis[i$2] = e;
		} catch (i$2) {
			console.warn("Failed to set global WalletConnect core", i$2);
		}
	}
	isGlobalCoreDisabled() {
		try {
			return typeof process < "u" && {}.DISABLE_GLOBAL_CORE === "true";
		} catch {
			return !0;
		}
	}
};
var import_cjs = /* @__PURE__ */ __toESM(require_cjs());
var import_events$1 = /* @__PURE__ */ __toESM(require_events()), ke$1 = "client", we$1 = `wc@2:${ke$1}:`, me$1 = {
	name: ke$1,
	logger: "error",
	controller: !1,
	relayUrl: "wss://relay.walletconnect.org"
}, Me$1 = "WALLETCONNECT_DEEPLINK_CHOICE", pt$2 = "proposal";
import_cjs.THIRTY_DAYS;
var $e$1 = "Proposal expired", ht$2 = "session", J$1 = import_cjs.SEVEN_DAYS, dt$1 = "engine", N$1 = {
	wc_sessionPropose: {
		req: {
			ttl: import_cjs.FIVE_MINUTES,
			prompt: !0,
			tag: 1100
		},
		res: {
			ttl: import_cjs.FIVE_MINUTES,
			prompt: !1,
			tag: 1101
		},
		reject: {
			ttl: import_cjs.FIVE_MINUTES,
			prompt: !1,
			tag: 1120
		},
		autoReject: {
			ttl: import_cjs.FIVE_MINUTES,
			prompt: !1,
			tag: 1121
		}
	},
	wc_sessionSettle: {
		req: {
			ttl: import_cjs.FIVE_MINUTES,
			prompt: !1,
			tag: 1102
		},
		res: {
			ttl: import_cjs.FIVE_MINUTES,
			prompt: !1,
			tag: 1103
		}
	},
	wc_sessionUpdate: {
		req: {
			ttl: import_cjs.ONE_DAY,
			prompt: !1,
			tag: 1104
		},
		res: {
			ttl: import_cjs.ONE_DAY,
			prompt: !1,
			tag: 1105
		}
	},
	wc_sessionExtend: {
		req: {
			ttl: import_cjs.ONE_DAY,
			prompt: !1,
			tag: 1106
		},
		res: {
			ttl: import_cjs.ONE_DAY,
			prompt: !1,
			tag: 1107
		}
	},
	wc_sessionRequest: {
		req: {
			ttl: import_cjs.FIVE_MINUTES,
			prompt: !0,
			tag: 1108
		},
		res: {
			ttl: import_cjs.FIVE_MINUTES,
			prompt: !1,
			tag: 1109
		}
	},
	wc_sessionEvent: {
		req: {
			ttl: import_cjs.FIVE_MINUTES,
			prompt: !0,
			tag: 1110
		},
		res: {
			ttl: import_cjs.FIVE_MINUTES,
			prompt: !1,
			tag: 1111
		}
	},
	wc_sessionDelete: {
		req: {
			ttl: import_cjs.ONE_DAY,
			prompt: !1,
			tag: 1112
		},
		res: {
			ttl: import_cjs.ONE_DAY,
			prompt: !1,
			tag: 1113
		}
	},
	wc_sessionPing: {
		req: {
			ttl: import_cjs.ONE_DAY,
			prompt: !1,
			tag: 1114
		},
		res: {
			ttl: import_cjs.ONE_DAY,
			prompt: !1,
			tag: 1115
		}
	},
	wc_sessionAuthenticate: {
		req: {
			ttl: import_cjs.ONE_HOUR,
			prompt: !0,
			tag: 1116
		},
		res: {
			ttl: import_cjs.ONE_HOUR,
			prompt: !1,
			tag: 1117
		},
		reject: {
			ttl: import_cjs.FIVE_MINUTES,
			prompt: !1,
			tag: 1118
		},
		autoReject: {
			ttl: import_cjs.FIVE_MINUTES,
			prompt: !1,
			tag: 1119
		}
	}
}, _e$1 = {
	min: import_cjs.FIVE_MINUTES,
	max: import_cjs.SEVEN_DAYS
}, $$1 = {
	idle: "IDLE",
	active: "ACTIVE"
}, Ke$1 = {
	eth_sendTransaction: { key: "" },
	eth_sendRawTransaction: { key: "" },
	wallet_sendCalls: { key: "" },
	solana_signTransaction: { key: "signature" },
	solana_signAllTransactions: { key: "transactions" },
	solana_signAndSendTransaction: { key: "signature" }
}, ut$1 = "request", gt$1 = [
	"wc_sessionPropose",
	"wc_sessionRequest",
	"wc_authRequest",
	"wc_sessionAuthenticate"
], wt$1 = "auth", mt$1 = "authKeys", _t$1 = "pairingTopics", Et$1 = "requests", ae$1 = `wc@1.5:${wt$1}:`, ce$1 = `${ae$1}:PUB_KEY`;
var vs = Object.defineProperty, Is = Object.defineProperties, Ts = Object.getOwnPropertyDescriptors, ft$1 = Object.getOwnPropertySymbols, qs = Object.prototype.hasOwnProperty, Ps = Object.prototype.propertyIsEnumerable, Ue$1 = (S$3, n$1, e) => n$1 in S$3 ? vs(S$3, n$1, {
	enumerable: !0,
	configurable: !0,
	writable: !0,
	value: e
}) : S$3[n$1] = e, v = (S$3, n$1) => {
	for (var e in n$1 || (n$1 = {})) qs.call(n$1, e) && Ue$1(S$3, e, n$1[e]);
	if (ft$1) for (var e of ft$1(n$1)) Ps.call(n$1, e) && Ue$1(S$3, e, n$1[e]);
	return S$3;
}, b$1 = (S$3, n$1) => Is(S$3, Ts(n$1)), c = (S$3, n$1, e) => Ue$1(S$3, typeof n$1 != "symbol" ? n$1 + "" : n$1, e);
var Ns = class extends V$1 {
	constructor(n$1) {
		super(n$1), c(this, "name", dt$1), c(this, "events", new import_events$1.default()), c(this, "initialized", !1), c(this, "requestQueue", {
			state: $$1.idle,
			queue: []
		}), c(this, "sessionRequestQueue", {
			state: $$1.idle,
			queue: []
		}), c(this, "requestQueueDelay", import_cjs.ONE_SECOND), c(this, "expectedPairingMethodMap", /* @__PURE__ */ new Map()), c(this, "recentlyDeletedMap", /* @__PURE__ */ new Map()), c(this, "recentlyDeletedLimit", 200), c(this, "relayMessageCache", []), c(this, "pendingSessions", /* @__PURE__ */ new Map()), c(this, "init", async () => {
			this.initialized || (await this.cleanup(), this.registerRelayerEvents(), this.registerExpirerEvents(), this.registerPairingEvents(), await this.registerLinkModeListeners(), this.client.core.pairing.register({ methods: Object.keys(N$1) }), this.initialized = !0, setTimeout(async () => {
				await this.processPendingMessageEvents(), this.sessionRequestQueue.queue = this.getPendingSessionRequests(), this.processSessionRequestQueue();
			}, (0, import_cjs.toMiliseconds)(this.requestQueueDelay)));
		}), c(this, "connect", async (e) => {
			this.isInitialized(), await this.confirmOnlineStateOrThrow();
			const t = b$1(v({}, e), {
				requiredNamespaces: e.requiredNamespaces || {},
				optionalNamespaces: e.optionalNamespaces || {}
			});
			await this.isValidConnect(t), t.optionalNamespaces = aa(t.requiredNamespaces, t.optionalNamespaces), t.requiredNamespaces = {};
			const { pairingTopic: s, requiredNamespaces: i$2, optionalNamespaces: r$1, sessionProperties: o$1, scopedProperties: a$1, relays: l$2 } = t;
			let p$2 = s, h$3, u$2 = !1;
			try {
				if (p$2) {
					const T$1 = this.client.core.pairing.pairings.get(p$2);
					this.client.logger.warn("connect() with existing pairing topic is deprecated and will be removed in the next major release."), u$2 = T$1.active;
				}
			} catch (T$1) {
				throw this.client.logger.error(`connect() -> pairing.get(${p$2}) failed`), T$1;
			}
			if (!p$2 || !u$2) {
				const { topic: T$1, uri: K$2 } = await this.client.core.pairing.create();
				p$2 = T$1, h$3 = K$2;
			}
			if (!p$2) {
				const { message: T$1 } = ht$1("NO_MATCHING_KEY", `connect() pairing topic: ${p$2}`);
				throw new Error(T$1);
			}
			const d$2 = await this.client.core.crypto.generateKeyPair(), w$1 = N$1.wc_sessionPropose.req.ttl || import_cjs.FIVE_MINUTES, m$1 = Ei(w$1), f$4 = b$1(v(v({
				requiredNamespaces: i$2,
				optionalNamespaces: r$1,
				relays: l$2 ?? [{ protocol: "irn" }],
				proposer: {
					publicKey: d$2,
					metadata: this.client.metadata
				},
				expiryTimestamp: m$1,
				pairingTopic: p$2
			}, o$1 && { sessionProperties: o$1 }), a$1 && { scopedProperties: a$1 }), { id: payloadId() }), _ = xi("session_connect", f$4.id), { reject: g, resolve: A$3, done: D$1 } = gi(w$1, $e$1), I$2 = ({ id: T$1 }) => {
				T$1 === f$4.id && (this.client.events.off("proposal_expire", I$2), this.pendingSessions.delete(f$4.id), this.events.emit(_, { error: {
					message: "Proposal expired",
					code: 0
				} }));
			};
			return this.client.events.on("proposal_expire", I$2), this.events.once(_, ({ error: T$1, session: K$2 }) => {
				this.client.events.off("proposal_expire", I$2), T$1 ? g(T$1) : K$2 && A$3(K$2);
			}), await this.sendRequest({
				topic: p$2,
				method: "wc_sessionPropose",
				params: f$4,
				throwOnFailedPublish: !0,
				clientRpcId: f$4.id
			}), await this.setProposal(f$4.id, f$4), {
				uri: h$3,
				approval: D$1
			};
		}), c(this, "pair", async (e) => {
			this.isInitialized(), await this.confirmOnlineStateOrThrow();
			try {
				return await this.client.core.pairing.pair(e);
			} catch (t) {
				throw this.client.logger.error("pair() failed"), t;
			}
		}), c(this, "approve", async (e) => {
			var t, s, i$2;
			const r$1 = this.client.core.eventClient.createEvent({ properties: {
				topic: (t = e?.id) == null ? void 0 : t.toString(),
				trace: [er.session_approve_started]
			} });
			try {
				this.isInitialized(), await this.confirmOnlineStateOrThrow();
			} catch (q$2) {
				throw r$1.setError(tr.no_internet_connection), q$2;
			}
			try {
				await this.isValidProposalId(e?.id);
			} catch (q$2) {
				throw this.client.logger.error(`approve() -> proposal.get(${e?.id}) failed`), r$1.setError(tr.proposal_not_found), q$2;
			}
			try {
				await this.isValidApprove(e);
			} catch (q$2) {
				throw this.client.logger.error("approve() -> isValidApprove() failed"), r$1.setError(tr.session_approve_namespace_validation_failure), q$2;
			}
			const { id: o$1, relayProtocol: a$1, namespaces: l$2, sessionProperties: p$2, scopedProperties: h$3, sessionConfig: u$2 } = e, d$2 = this.client.proposal.get(o$1);
			this.client.core.eventClient.deleteEvent({ eventId: r$1.eventId });
			const { pairingTopic: w$1, proposer: m$1, requiredNamespaces: f$4, optionalNamespaces: _ } = d$2;
			let g = (s = this.client.core.eventClient) == null ? void 0 : s.getEvent({ topic: w$1 });
			g || (g = (i$2 = this.client.core.eventClient) == null ? void 0 : i$2.createEvent({
				type: er.session_approve_started,
				properties: {
					topic: w$1,
					trace: [er.session_approve_started, er.session_namespaces_validation_success]
				}
			}));
			const A$3 = await this.client.core.crypto.generateKeyPair(), D$1 = m$1.publicKey, I$2 = await this.client.core.crypto.generateSharedKey(A$3, D$1), T$1 = v(v(v({
				relay: { protocol: a$1 ?? "irn" },
				namespaces: l$2,
				controller: {
					publicKey: A$3,
					metadata: this.client.metadata
				},
				expiry: Ei(J$1)
			}, p$2 && { sessionProperties: p$2 }), h$3 && { scopedProperties: h$3 }), u$2 && { sessionConfig: u$2 }), K$2 = Q$1.relay;
			g.addTrace(er.subscribing_session_topic);
			try {
				await this.client.core.relayer.subscribe(I$2, { transportType: K$2 });
			} catch (q$2) {
				throw g.setError(tr.subscribe_session_topic_failure), q$2;
			}
			g.addTrace(er.subscribe_session_topic_success);
			const fe$3 = b$1(v({}, T$1), {
				topic: I$2,
				requiredNamespaces: f$4,
				optionalNamespaces: _,
				pairingTopic: w$1,
				acknowledged: !1,
				self: T$1.controller,
				peer: {
					publicKey: m$1.publicKey,
					metadata: m$1.metadata
				},
				controller: A$3,
				transportType: Q$1.relay
			});
			await this.client.session.set(I$2, fe$3), g.addTrace(er.store_session);
			try {
				g.addTrace(er.publishing_session_settle), await this.sendRequest({
					topic: I$2,
					method: "wc_sessionSettle",
					params: T$1,
					throwOnFailedPublish: !0
				}).catch((q$2) => {
					throw g?.setError(tr.session_settle_publish_failure), q$2;
				}), g.addTrace(er.session_settle_publish_success), g.addTrace(er.publishing_session_approve), await this.sendResult({
					id: o$1,
					topic: w$1,
					result: {
						relay: { protocol: a$1 ?? "irn" },
						responderPublicKey: A$3
					},
					throwOnFailedPublish: !0
				}).catch((q$2) => {
					throw g?.setError(tr.session_approve_publish_failure), q$2;
				}), g.addTrace(er.session_approve_publish_success);
			} catch (q$2) {
				throw this.client.logger.error(q$2), this.client.session.delete(I$2, Nt("USER_DISCONNECTED")), await this.client.core.relayer.unsubscribe(I$2), q$2;
			}
			return this.client.core.eventClient.deleteEvent({ eventId: g.eventId }), await this.client.core.pairing.updateMetadata({
				topic: w$1,
				metadata: m$1.metadata
			}), await this.client.proposal.delete(o$1, Nt("USER_DISCONNECTED")), await this.client.core.pairing.activate({ topic: w$1 }), await this.setExpiry(I$2, Ei(J$1)), {
				topic: I$2,
				acknowledged: () => Promise.resolve(this.client.session.get(I$2))
			};
		}), c(this, "reject", async (e) => {
			this.isInitialized(), await this.confirmOnlineStateOrThrow();
			try {
				await this.isValidReject(e);
			} catch (r$1) {
				throw this.client.logger.error("reject() -> isValidReject() failed"), r$1;
			}
			const { id: t, reason: s } = e;
			let i$2;
			try {
				i$2 = this.client.proposal.get(t).pairingTopic;
			} catch (r$1) {
				throw this.client.logger.error(`reject() -> proposal.get(${t}) failed`), r$1;
			}
			i$2 && (await this.sendError({
				id: t,
				topic: i$2,
				error: s,
				rpcOpts: N$1.wc_sessionPropose.reject
			}), await this.client.proposal.delete(t, Nt("USER_DISCONNECTED")));
		}), c(this, "update", async (e) => {
			this.isInitialized(), await this.confirmOnlineStateOrThrow();
			try {
				await this.isValidUpdate(e);
			} catch (h$3) {
				throw this.client.logger.error("update() -> isValidUpdate() failed"), h$3;
			}
			const { topic: t, namespaces: s } = e, { done: i$2, resolve: r$1, reject: o$1 } = gi(), a$1 = payloadId(), l$2 = getBigIntRpcId().toString(), p$2 = this.client.session.get(t).namespaces;
			return this.events.once(xi("session_update", a$1), ({ error: h$3 }) => {
				h$3 ? o$1(h$3) : r$1();
			}), await this.client.session.update(t, { namespaces: s }), await this.sendRequest({
				topic: t,
				method: "wc_sessionUpdate",
				params: { namespaces: s },
				throwOnFailedPublish: !0,
				clientRpcId: a$1,
				relayRpcId: l$2
			}).catch((h$3) => {
				this.client.logger.error(h$3), this.client.session.update(t, { namespaces: p$2 }), o$1(h$3);
			}), { acknowledged: i$2 };
		}), c(this, "extend", async (e) => {
			this.isInitialized(), await this.confirmOnlineStateOrThrow();
			try {
				await this.isValidExtend(e);
			} catch (a$1) {
				throw this.client.logger.error("extend() -> isValidExtend() failed"), a$1;
			}
			const { topic: t } = e, s = payloadId(), { done: i$2, resolve: r$1, reject: o$1 } = gi();
			return this.events.once(xi("session_extend", s), ({ error: a$1 }) => {
				a$1 ? o$1(a$1) : r$1();
			}), await this.setExpiry(t, Ei(J$1)), this.sendRequest({
				topic: t,
				method: "wc_sessionExtend",
				params: {},
				clientRpcId: s,
				throwOnFailedPublish: !0
			}).catch((a$1) => {
				o$1(a$1);
			}), { acknowledged: i$2 };
		}), c(this, "request", async (e) => {
			this.isInitialized();
			try {
				await this.isValidRequest(e);
			} catch (_) {
				throw this.client.logger.error("request() -> isValidRequest() failed"), _;
			}
			const { chainId: t, request: s, topic: i$2, expiry: r$1 = N$1.wc_sessionRequest.req.ttl } = e, o$1 = this.client.session.get(i$2);
			o$1?.transportType === Q$1.relay && await this.confirmOnlineStateOrThrow();
			const a$1 = payloadId(), l$2 = getBigIntRpcId().toString(), { done: p$2, resolve: h$3, reject: u$2 } = gi(r$1, "Request expired. Please try again.");
			this.events.once(xi("session_request", a$1), ({ error: _, result: g }) => {
				_ ? u$2(_) : h$3(g);
			});
			const d$2 = "wc_sessionRequest", w$1 = this.getAppLinkIfEnabled(o$1.peer.metadata, o$1.transportType);
			if (w$1) return await this.sendRequest({
				clientRpcId: a$1,
				relayRpcId: l$2,
				topic: i$2,
				method: d$2,
				params: {
					request: b$1(v({}, s), { expiryTimestamp: Ei(r$1) }),
					chainId: t
				},
				expiry: r$1,
				throwOnFailedPublish: !0,
				appLink: w$1
			}).catch((_) => u$2(_)), this.client.events.emit("session_request_sent", {
				topic: i$2,
				request: s,
				chainId: t,
				id: a$1
			}), await p$2();
			const m$1 = {
				request: b$1(v({}, s), { expiryTimestamp: Ei(r$1) }),
				chainId: t
			}, f$4 = this.shouldSetTVF(d$2, m$1);
			return await Promise.all([
				new Promise(async (_) => {
					await this.sendRequest(v({
						clientRpcId: a$1,
						relayRpcId: l$2,
						topic: i$2,
						method: d$2,
						params: m$1,
						expiry: r$1,
						throwOnFailedPublish: !0
					}, f$4 && { tvf: this.getTVFParams(a$1, m$1) })).catch((g) => u$2(g)), this.client.events.emit("session_request_sent", {
						topic: i$2,
						request: s,
						chainId: t,
						id: a$1
					}), _();
				}),
				new Promise(async (_) => {
					var g;
					if (!((g = o$1.sessionConfig) != null && g.disableDeepLink)) {
						const A$3 = await Oi(this.client.core.storage, Me$1);
						await Si({
							id: a$1,
							topic: i$2,
							wcDeepLink: A$3
						});
					}
					_();
				}),
				p$2()
			]).then((_) => _[2]);
		}), c(this, "respond", async (e) => {
			this.isInitialized(), await this.isValidRespond(e);
			const { topic: t, response: s } = e, { id: i$2 } = s, r$1 = this.client.session.get(t);
			r$1.transportType === Q$1.relay && await this.confirmOnlineStateOrThrow();
			const o$1 = this.getAppLinkIfEnabled(r$1.peer.metadata, r$1.transportType);
			isJsonRpcResult(s) ? await this.sendResult({
				id: i$2,
				topic: t,
				result: s.result,
				throwOnFailedPublish: !0,
				appLink: o$1
			}) : isJsonRpcError(s) && await this.sendError({
				id: i$2,
				topic: t,
				error: s.error,
				appLink: o$1
			}), this.cleanupAfterResponse(e);
		}), c(this, "ping", async (e) => {
			this.isInitialized(), await this.confirmOnlineStateOrThrow();
			try {
				await this.isValidPing(e);
			} catch (s) {
				throw this.client.logger.error("ping() -> isValidPing() failed"), s;
			}
			const { topic: t } = e;
			if (this.client.session.keys.includes(t)) {
				const s = payloadId(), i$2 = getBigIntRpcId().toString(), { done: r$1, resolve: o$1, reject: a$1 } = gi();
				this.events.once(xi("session_ping", s), ({ error: l$2 }) => {
					l$2 ? a$1(l$2) : o$1();
				}), await Promise.all([this.sendRequest({
					topic: t,
					method: "wc_sessionPing",
					params: {},
					throwOnFailedPublish: !0,
					clientRpcId: s,
					relayRpcId: i$2
				}), r$1()]);
			} else this.client.core.pairing.pairings.keys.includes(t) && (this.client.logger.warn("ping() on pairing topic is deprecated and will be removed in the next major release."), await this.client.core.pairing.ping({ topic: t }));
		}), c(this, "emit", async (e) => {
			this.isInitialized(), await this.confirmOnlineStateOrThrow(), await this.isValidEmit(e);
			const { topic: t, event: s, chainId: i$2 } = e, r$1 = getBigIntRpcId().toString(), o$1 = payloadId();
			await this.sendRequest({
				topic: t,
				method: "wc_sessionEvent",
				params: {
					event: s,
					chainId: i$2
				},
				throwOnFailedPublish: !0,
				relayRpcId: r$1,
				clientRpcId: o$1
			});
		}), c(this, "disconnect", async (e) => {
			this.isInitialized(), await this.confirmOnlineStateOrThrow(), await this.isValidDisconnect(e);
			const { topic: t } = e;
			if (this.client.session.keys.includes(t)) await this.sendRequest({
				topic: t,
				method: "wc_sessionDelete",
				params: Nt("USER_DISCONNECTED"),
				throwOnFailedPublish: !0
			}), await this.deleteSession({
				topic: t,
				emitEvent: !1
			});
			else if (this.client.core.pairing.pairings.keys.includes(t)) await this.client.core.pairing.disconnect({ topic: t });
			else {
				const { message: s } = ht$1("MISMATCHED_TOPIC", `Session or pairing topic not found: ${t}`);
				throw new Error(s);
			}
		}), c(this, "find", (e) => (this.isInitialized(), this.client.session.getAll().filter((t) => ua(t, e)))), c(this, "getPendingSessionRequests", () => this.client.pendingRequest.getAll()), c(this, "authenticate", async (e, t) => {
			var s;
			this.isInitialized(), this.isValidAuthenticate(e);
			const i$2 = t && this.client.core.linkModeSupportedApps.includes(t) && ((s = this.client.metadata.redirect) == null ? void 0 : s.linkMode), r$1 = i$2 ? Q$1.link_mode : Q$1.relay;
			r$1 === Q$1.relay && await this.confirmOnlineStateOrThrow();
			const { chains: o$1, statement: a$1 = "", uri: l$2, domain: p$2, nonce: h$3, type: u$2, exp: d$2, nbf: w$1, methods: m$1 = [], expiry: f$4 } = e, _ = [...e.resources || []], { topic: g, uri: A$3 } = await this.client.core.pairing.create({
				methods: ["wc_sessionAuthenticate"],
				transportType: r$1
			});
			this.client.logger.info({
				message: "Generated new pairing",
				pairing: {
					topic: g,
					uri: A$3
				}
			});
			const D$1 = await this.client.core.crypto.generateKeyPair(), I$2 = Pc(D$1);
			if (await Promise.all([this.client.auth.authKeys.set(ce$1, {
				responseTopic: I$2,
				publicKey: D$1
			}), this.client.auth.pairingTopics.set(I$2, {
				topic: I$2,
				pairingTopic: g
			})]), await this.client.core.relayer.subscribe(I$2, { transportType: r$1 }), this.client.logger.info(`sending request to new pairing topic: ${g}`), m$1.length > 0) {
				const { namespace: x$1 } = Ne(o$1[0]);
				let L$2 = fs(x$1, "request", m$1);
				pe$1(_) && (L$2 = ls(L$2, _.pop())), _.push(L$2);
			}
			const T$1 = f$4 && f$4 > N$1.wc_sessionAuthenticate.req.ttl ? f$4 : N$1.wc_sessionAuthenticate.req.ttl, K$2 = {
				authPayload: {
					type: u$2 ?? "caip122",
					chains: o$1,
					statement: a$1,
					aud: l$2,
					domain: p$2,
					version: "1",
					nonce: h$3,
					iat: (/* @__PURE__ */ new Date()).toISOString(),
					exp: d$2,
					nbf: w$1,
					resources: _
				},
				requester: {
					publicKey: D$1,
					metadata: this.client.metadata
				},
				expiryTimestamp: Ei(T$1)
			}, fe$3 = { eip155: {
				chains: o$1,
				methods: [...new Set(["personal_sign", ...m$1])],
				events: ["chainChanged", "accountsChanged"]
			} }, q$2 = {
				requiredNamespaces: {},
				optionalNamespaces: fe$3,
				relays: [{ protocol: "irn" }],
				pairingTopic: g,
				proposer: {
					publicKey: D$1,
					metadata: this.client.metadata
				},
				expiryTimestamp: Ei(N$1.wc_sessionPropose.req.ttl),
				id: payloadId()
			}, { done: Rt$3, resolve: je$3, reject: Se$3 } = gi(T$1, "Request expired"), te$2 = payloadId(), le$3 = xi("session_connect", q$2.id), Re$2 = xi("session_request", te$2), pe$3 = async ({ error: x$1, session: L$2 }) => {
				this.events.off(Re$2, ve$2), x$1 ? Se$3(x$1) : L$2 && je$3({ session: L$2 });
			}, ve$2 = async (x$1) => {
				var L$2, Fe$3, Qe$4;
				if (await this.deletePendingAuthRequest(te$2, {
					message: "fulfilled",
					code: 0
				}), x$1.error) {
					const ie$3 = Nt("WC_METHOD_UNSUPPORTED", "wc_sessionAuthenticate");
					return x$1.error.code === ie$3.code ? void 0 : (this.events.off(le$3, pe$3), Se$3(x$1.error.message));
				}
				await this.deleteProposal(q$2.id), this.events.off(le$3, pe$3);
				const { cacaos: He$3, responder: Q$2 } = x$1.result, Te$2 = [], ze$3 = [];
				for (const ie$3 of He$3) {
					await is({
						cacao: ie$3,
						projectId: this.client.core.projectId
					}) || (this.client.logger.error(ie$3, "Signature verification failed"), Se$3(Nt("SESSION_SETTLEMENT_FAILED", "Signature verification failed")));
					const { p: qe$3 } = ie$3, Pe$3 = pe$1(qe$3.resources), Ye$3 = [dr(qe$3.iss)], vt$1 = De$1(qe$3.iss);
					if (Pe$3) {
						const Ne$2 = ds(Pe$3), It$3 = hs(Pe$3);
						Te$2.push(...Ne$2), Ye$3.push(...It$3);
					}
					for (const Ne$2 of Ye$3) ze$3.push(`${Ne$2}:${vt$1}`);
				}
				const se$3 = await this.client.core.crypto.generateSharedKey(D$1, Q$2.publicKey);
				let he$3;
				Te$2.length > 0 && (he$3 = {
					topic: se$3,
					acknowledged: !0,
					self: {
						publicKey: D$1,
						metadata: this.client.metadata
					},
					peer: Q$2,
					controller: Q$2.publicKey,
					expiry: Ei(J$1),
					requiredNamespaces: {},
					optionalNamespaces: {},
					relay: { protocol: "irn" },
					pairingTopic: g,
					namespaces: ca([...new Set(Te$2)], [...new Set(ze$3)]),
					transportType: r$1
				}, await this.client.core.relayer.subscribe(se$3, { transportType: r$1 }), await this.client.session.set(se$3, he$3), g && await this.client.core.pairing.updateMetadata({
					topic: g,
					metadata: Q$2.metadata
				}), he$3 = this.client.session.get(se$3)), (L$2 = this.client.metadata.redirect) != null && L$2.linkMode && (Fe$3 = Q$2.metadata.redirect) != null && Fe$3.linkMode && (Qe$4 = Q$2.metadata.redirect) != null && Qe$4.universal && t && (this.client.core.addLinkModeSupportedApp(Q$2.metadata.redirect.universal), this.client.session.update(se$3, { transportType: Q$1.link_mode })), je$3({
					auths: He$3,
					session: he$3
				});
			};
			this.events.once(le$3, pe$3), this.events.once(Re$2, ve$2);
			let Ie$3;
			try {
				if (i$2) {
					const x$1 = formatJsonRpcRequest("wc_sessionAuthenticate", K$2, te$2);
					this.client.core.history.set(g, x$1);
					const L$2 = await this.client.core.crypto.encode("", x$1, {
						type: 2,
						encoding: xe$1
					});
					Ie$3 = Xc(t, g, L$2);
				} else await Promise.all([this.sendRequest({
					topic: g,
					method: "wc_sessionAuthenticate",
					params: K$2,
					expiry: e.expiry,
					throwOnFailedPublish: !0,
					clientRpcId: te$2
				}), this.sendRequest({
					topic: g,
					method: "wc_sessionPropose",
					params: q$2,
					expiry: N$1.wc_sessionPropose.req.ttl,
					throwOnFailedPublish: !0,
					clientRpcId: q$2.id
				})]);
			} catch (x$1) {
				throw this.events.off(le$3, pe$3), this.events.off(Re$2, ve$2), x$1;
			}
			return await this.setProposal(q$2.id, q$2), await this.setAuthRequest(te$2, {
				request: b$1(v({}, K$2), { verifyContext: {} }),
				pairingTopic: g,
				transportType: r$1
			}), {
				uri: Ie$3 ?? A$3,
				response: Rt$3
			};
		}), c(this, "approveSessionAuthenticate", async (e) => {
			const { id: t, auths: s } = e, i$2 = this.client.core.eventClient.createEvent({ properties: {
				topic: t.toString(),
				trace: [ir.authenticated_session_approve_started]
			} });
			try {
				this.isInitialized();
			} catch (f$4) {
				throw i$2.setError(sr.no_internet_connection), f$4;
			}
			const r$1 = this.getPendingAuthRequest(t);
			if (!r$1) throw i$2.setError(sr.authenticated_session_pending_request_not_found), /* @__PURE__ */ new Error(`Could not find pending auth request with id ${t}`);
			const o$1 = r$1.transportType || Q$1.relay;
			o$1 === Q$1.relay && await this.confirmOnlineStateOrThrow();
			const a$1 = r$1.requester.publicKey, l$2 = await this.client.core.crypto.generateKeyPair(), p$2 = Pc(a$1), h$3 = {
				type: 1,
				receiverPublicKey: a$1,
				senderPublicKey: l$2
			}, u$2 = [], d$2 = [];
			for (const f$4 of s) {
				if (!await is({
					cacao: f$4,
					projectId: this.client.core.projectId
				})) {
					i$2.setError(sr.invalid_cacao);
					const I$2 = Nt("SESSION_SETTLEMENT_FAILED", "Signature verification failed");
					throw await this.sendError({
						id: t,
						topic: p$2,
						error: I$2,
						encodeOpts: h$3
					}), new Error(I$2.message);
				}
				i$2.addTrace(ir.cacaos_verified);
				const { p: _ } = f$4, g = pe$1(_.resources), A$3 = [dr(_.iss)], D$1 = De$1(_.iss);
				if (g) {
					const I$2 = ds(g), T$1 = hs(g);
					u$2.push(...I$2), A$3.push(...T$1);
				}
				for (const I$2 of A$3) d$2.push(`${I$2}:${D$1}`);
			}
			const w$1 = await this.client.core.crypto.generateSharedKey(l$2, a$1);
			i$2.addTrace(ir.create_authenticated_session_topic);
			let m$1;
			if (u$2?.length > 0) {
				m$1 = {
					topic: w$1,
					acknowledged: !0,
					self: {
						publicKey: l$2,
						metadata: this.client.metadata
					},
					peer: {
						publicKey: a$1,
						metadata: r$1.requester.metadata
					},
					controller: a$1,
					expiry: Ei(J$1),
					authentication: s,
					requiredNamespaces: {},
					optionalNamespaces: {},
					relay: { protocol: "irn" },
					pairingTopic: r$1.pairingTopic,
					namespaces: ca([...new Set(u$2)], [...new Set(d$2)]),
					transportType: o$1
				}, i$2.addTrace(ir.subscribing_authenticated_session_topic);
				try {
					await this.client.core.relayer.subscribe(w$1, { transportType: o$1 });
				} catch (f$4) {
					throw i$2.setError(sr.subscribe_authenticated_session_topic_failure), f$4;
				}
				i$2.addTrace(ir.subscribe_authenticated_session_topic_success), await this.client.session.set(w$1, m$1), i$2.addTrace(ir.store_authenticated_session), await this.client.core.pairing.updateMetadata({
					topic: r$1.pairingTopic,
					metadata: r$1.requester.metadata
				});
			}
			i$2.addTrace(ir.publishing_authenticated_session_approve);
			try {
				await this.sendResult({
					topic: p$2,
					id: t,
					result: {
						cacaos: s,
						responder: {
							publicKey: l$2,
							metadata: this.client.metadata
						}
					},
					encodeOpts: h$3,
					throwOnFailedPublish: !0,
					appLink: this.getAppLinkIfEnabled(r$1.requester.metadata, o$1)
				});
			} catch (f$4) {
				throw i$2.setError(sr.authenticated_session_approve_publish_failure), f$4;
			}
			return await this.client.auth.requests.delete(t, {
				message: "fulfilled",
				code: 0
			}), await this.client.core.pairing.activate({ topic: r$1.pairingTopic }), this.client.core.eventClient.deleteEvent({ eventId: i$2.eventId }), { session: m$1 };
		}), c(this, "rejectSessionAuthenticate", async (e) => {
			this.isInitialized();
			const { id: t, reason: s } = e, i$2 = this.getPendingAuthRequest(t);
			if (!i$2) throw new Error(`Could not find pending auth request with id ${t}`);
			i$2.transportType === Q$1.relay && await this.confirmOnlineStateOrThrow();
			const r$1 = i$2.requester.publicKey, o$1 = await this.client.core.crypto.generateKeyPair(), a$1 = Pc(r$1), l$2 = {
				type: 1,
				receiverPublicKey: r$1,
				senderPublicKey: o$1
			};
			await this.sendError({
				id: t,
				topic: a$1,
				error: s,
				encodeOpts: l$2,
				rpcOpts: N$1.wc_sessionAuthenticate.reject,
				appLink: this.getAppLinkIfEnabled(i$2.requester.metadata, i$2.transportType)
			}), await this.client.auth.requests.delete(t, {
				message: "rejected",
				code: 0
			}), await this.client.proposal.delete(t, Nt("USER_DISCONNECTED"));
		}), c(this, "formatAuthMessage", (e) => {
			this.isInitialized();
			const { request: t, iss: s } = e;
			return hr(t, s);
		}), c(this, "processRelayMessageCache", () => {
			setTimeout(async () => {
				if (this.relayMessageCache.length !== 0) for (; this.relayMessageCache.length > 0;) try {
					const e = this.relayMessageCache.shift();
					e && await this.onRelayMessage(e);
				} catch (e) {
					this.client.logger.error(e);
				}
			}, 50);
		}), c(this, "cleanupDuplicatePairings", async (e) => {
			if (e.pairingTopic) try {
				const t = this.client.core.pairing.pairings.get(e.pairingTopic), s = this.client.core.pairing.pairings.getAll().filter((i$2) => {
					var r$1, o$1;
					return ((r$1 = i$2.peerMetadata) == null ? void 0 : r$1.url) && ((o$1 = i$2.peerMetadata) == null ? void 0 : o$1.url) === e.peer.metadata.url && i$2.topic && i$2.topic !== t.topic;
				});
				if (s.length === 0) return;
				this.client.logger.info(`Cleaning up ${s.length} duplicate pairing(s)`), await Promise.all(s.map((i$2) => this.client.core.pairing.disconnect({ topic: i$2.topic }))), this.client.logger.info("Duplicate pairings clean up finished");
			} catch (t) {
				this.client.logger.error(t);
			}
		}), c(this, "deleteSession", async (e) => {
			var t;
			const { topic: s, expirerHasDeleted: i$2 = !1, emitEvent: r$1 = !0, id: o$1 = 0 } = e, { self: a$1 } = this.client.session.get(s);
			await this.client.core.relayer.unsubscribe(s), await this.client.session.delete(s, Nt("USER_DISCONNECTED")), this.addToRecentlyDeleted(s, "session"), this.client.core.crypto.keychain.has(a$1.publicKey) && await this.client.core.crypto.deleteKeyPair(a$1.publicKey), this.client.core.crypto.keychain.has(s) && await this.client.core.crypto.deleteSymKey(s), i$2 || this.client.core.expirer.del(s), this.client.core.storage.removeItem(Me$1).catch((l$2) => this.client.logger.warn(l$2)), this.getPendingSessionRequests().forEach((l$2) => {
				l$2.topic === s && this.deletePendingSessionRequest(l$2.id, Nt("USER_DISCONNECTED"));
			}), s === ((t = this.sessionRequestQueue.queue[0]) == null ? void 0 : t.topic) && (this.sessionRequestQueue.state = $$1.idle), r$1 && this.client.events.emit("session_delete", {
				id: o$1,
				topic: s
			});
		}), c(this, "deleteProposal", async (e, t) => {
			if (t) try {
				const s = this.client.proposal.get(e);
				this.client.core.eventClient.getEvent({ topic: s.pairingTopic })?.setError(tr.proposal_expired);
			} catch {}
			await Promise.all([this.client.proposal.delete(e, Nt("USER_DISCONNECTED")), t ? Promise.resolve() : this.client.core.expirer.del(e)]), this.addToRecentlyDeleted(e, "proposal");
		}), c(this, "deletePendingSessionRequest", async (e, t, s = !1) => {
			await Promise.all([this.client.pendingRequest.delete(e, t), s ? Promise.resolve() : this.client.core.expirer.del(e)]), this.addToRecentlyDeleted(e, "request"), this.sessionRequestQueue.queue = this.sessionRequestQueue.queue.filter((i$2) => i$2.id !== e), s && (this.sessionRequestQueue.state = $$1.idle, this.client.events.emit("session_request_expire", { id: e }));
		}), c(this, "deletePendingAuthRequest", async (e, t, s = !1) => {
			await Promise.all([this.client.auth.requests.delete(e, t), s ? Promise.resolve() : this.client.core.expirer.del(e)]);
		}), c(this, "setExpiry", async (e, t) => {
			this.client.session.keys.includes(e) && (this.client.core.expirer.set(e, t), await this.client.session.update(e, { expiry: t }));
		}), c(this, "setProposal", async (e, t) => {
			this.client.core.expirer.set(e, Ei(N$1.wc_sessionPropose.req.ttl)), await this.client.proposal.set(e, t);
		}), c(this, "setAuthRequest", async (e, t) => {
			const { request: s, pairingTopic: i$2, transportType: r$1 = Q$1.relay } = t;
			this.client.core.expirer.set(e, s.expiryTimestamp), await this.client.auth.requests.set(e, {
				authPayload: s.authPayload,
				requester: s.requester,
				expiryTimestamp: s.expiryTimestamp,
				id: e,
				pairingTopic: i$2,
				verifyContext: s.verifyContext,
				transportType: r$1
			});
		}), c(this, "setPendingSessionRequest", async (e) => {
			const { id: t, topic: s, params: i$2, verifyContext: r$1 } = e, o$1 = i$2.request.expiryTimestamp || Ei(N$1.wc_sessionRequest.req.ttl);
			this.client.core.expirer.set(t, o$1), await this.client.pendingRequest.set(t, {
				id: t,
				topic: s,
				params: i$2,
				verifyContext: r$1
			});
		}), c(this, "sendRequest", async (e) => {
			const { topic: t, method: s, params: i$2, expiry: r$1, relayRpcId: o$1, clientRpcId: a$1, throwOnFailedPublish: l$2, appLink: p$2, tvf: h$3 } = e, u$2 = formatJsonRpcRequest(s, i$2, a$1);
			let d$2;
			const w$1 = !!p$2;
			try {
				const _ = w$1 ? xe$1 : qt$1;
				d$2 = await this.client.core.crypto.encode(t, u$2, { encoding: _ });
			} catch (_) {
				throw await this.cleanup(), this.client.logger.error(`sendRequest() -> core.crypto.encode() for topic ${t} failed`), _;
			}
			let m$1;
			if (gt$1.includes(s)) {
				const _ = kc(JSON.stringify(u$2)), g = kc(d$2);
				m$1 = await this.client.core.verify.register({
					id: g,
					decryptedId: _
				});
			}
			const f$4 = N$1[s].req;
			if (f$4.attestation = m$1, r$1 && (f$4.ttl = r$1), o$1 && (f$4.id = o$1), this.client.core.history.set(t, u$2), w$1) {
				const _ = Xc(p$2, t, d$2);
				await global.Linking.openURL(_, this.client.name);
			} else {
				const _ = N$1[s].req;
				r$1 && (_.ttl = r$1), o$1 && (_.id = o$1), _.tvf = b$1(v({}, h$3), { correlationId: u$2.id }), l$2 ? (_.internal = b$1(v({}, _.internal), { throwOnFailedPublish: !0 }), await this.client.core.relayer.publish(t, d$2, _)) : this.client.core.relayer.publish(t, d$2, _).catch((g) => this.client.logger.error(g));
			}
			return u$2.id;
		}), c(this, "sendResult", async (e) => {
			const { id: t, topic: s, result: i$2, throwOnFailedPublish: r$1, encodeOpts: o$1, appLink: a$1 } = e, l$2 = formatJsonRpcResult(t, i$2);
			let p$2;
			const h$3 = a$1 && typeof (global == null ? void 0 : global.Linking) < "u";
			try {
				const w$1 = h$3 ? xe$1 : qt$1;
				p$2 = await this.client.core.crypto.encode(s, l$2, b$1(v({}, o$1 || {}), { encoding: w$1 }));
			} catch (w$1) {
				throw await this.cleanup(), this.client.logger.error(`sendResult() -> core.crypto.encode() for topic ${s} failed`), w$1;
			}
			let u$2, d$2;
			try {
				u$2 = await this.client.core.history.get(s, t);
				const w$1 = u$2.request;
				try {
					this.shouldSetTVF(w$1.method, w$1.params) && (d$2 = this.getTVFParams(t, w$1.params, i$2));
				} catch (m$1) {
					this.client.logger.warn("sendResult() -> getTVFParams() failed", m$1);
				}
			} catch (w$1) {
				throw this.client.logger.error(`sendResult() -> history.get(${s}, ${t}) failed`), w$1;
			}
			if (h$3) {
				const w$1 = Xc(a$1, s, p$2);
				await global.Linking.openURL(w$1, this.client.name);
			} else {
				const w$1 = u$2.request.method, m$1 = N$1[w$1].res;
				m$1.tvf = b$1(v({}, d$2), { correlationId: t }), r$1 ? (m$1.internal = b$1(v({}, m$1.internal), { throwOnFailedPublish: !0 }), await this.client.core.relayer.publish(s, p$2, m$1)) : this.client.core.relayer.publish(s, p$2, m$1).catch((f$4) => this.client.logger.error(f$4));
			}
			await this.client.core.history.resolve(l$2);
		}), c(this, "sendError", async (e) => {
			const { id: t, topic: s, error: i$2, encodeOpts: r$1, rpcOpts: o$1, appLink: a$1 } = e, l$2 = formatJsonRpcError(t, i$2);
			let p$2;
			const h$3 = a$1 && typeof (global == null ? void 0 : global.Linking) < "u";
			try {
				const d$2 = h$3 ? xe$1 : qt$1;
				p$2 = await this.client.core.crypto.encode(s, l$2, b$1(v({}, r$1 || {}), { encoding: d$2 }));
			} catch (d$2) {
				throw await this.cleanup(), this.client.logger.error(`sendError() -> core.crypto.encode() for topic ${s} failed`), d$2;
			}
			let u$2;
			try {
				u$2 = await this.client.core.history.get(s, t);
			} catch (d$2) {
				throw this.client.logger.error(`sendError() -> history.get(${s}, ${t}) failed`), d$2;
			}
			if (h$3) {
				const d$2 = Xc(a$1, s, p$2);
				await global.Linking.openURL(d$2, this.client.name);
			} else {
				const d$2 = u$2.request.method, w$1 = o$1 || N$1[d$2].res;
				this.client.core.relayer.publish(s, p$2, w$1);
			}
			await this.client.core.history.resolve(l$2);
		}), c(this, "cleanup", async () => {
			const e = [], t = [];
			this.client.session.getAll().forEach((s) => {
				let i$2 = !1;
				vi(s.expiry) && (i$2 = !0), this.client.core.crypto.keychain.has(s.topic) || (i$2 = !0), i$2 && e.push(s.topic);
			}), this.client.proposal.getAll().forEach((s) => {
				vi(s.expiryTimestamp) && t.push(s.id);
			}), await Promise.all([...e.map((s) => this.deleteSession({ topic: s })), ...t.map((s) => this.deleteProposal(s))]);
		}), c(this, "onProviderMessageEvent", async (e) => {
			!this.initialized || this.relayMessageCache.length > 0 ? this.relayMessageCache.push(e) : await this.onRelayMessage(e);
		}), c(this, "onRelayEventRequest", async (e) => {
			this.requestQueue.queue.push(e), await this.processRequestsQueue();
		}), c(this, "processRequestsQueue", async () => {
			if (this.requestQueue.state === $$1.active) {
				this.client.logger.info("Request queue already active, skipping...");
				return;
			}
			for (this.client.logger.info(`Request queue starting with ${this.requestQueue.queue.length} requests`); this.requestQueue.queue.length > 0;) {
				this.requestQueue.state = $$1.active;
				const e = this.requestQueue.queue.shift();
				if (e) try {
					await this.processRequest(e);
				} catch (t) {
					this.client.logger.warn(t);
				}
			}
			this.requestQueue.state = $$1.idle;
		}), c(this, "processRequest", async (e) => {
			const { topic: t, payload: s, attestation: i$2, transportType: r$1, encryptedId: o$1 } = e, a$1 = s.method;
			if (!this.shouldIgnorePairingRequest({
				topic: t,
				requestMethod: a$1
			})) switch (a$1) {
				case "wc_sessionPropose": return await this.onSessionProposeRequest({
					topic: t,
					payload: s,
					attestation: i$2,
					encryptedId: o$1
				});
				case "wc_sessionSettle": return await this.onSessionSettleRequest(t, s);
				case "wc_sessionUpdate": return await this.onSessionUpdateRequest(t, s);
				case "wc_sessionExtend": return await this.onSessionExtendRequest(t, s);
				case "wc_sessionPing": return await this.onSessionPingRequest(t, s);
				case "wc_sessionDelete": return await this.onSessionDeleteRequest(t, s);
				case "wc_sessionRequest": return await this.onSessionRequest({
					topic: t,
					payload: s,
					attestation: i$2,
					encryptedId: o$1,
					transportType: r$1
				});
				case "wc_sessionEvent": return await this.onSessionEventRequest(t, s);
				case "wc_sessionAuthenticate": return await this.onSessionAuthenticateRequest({
					topic: t,
					payload: s,
					attestation: i$2,
					encryptedId: o$1,
					transportType: r$1
				});
				default: return this.client.logger.info(`Unsupported request method ${a$1}`);
			}
		}), c(this, "onRelayEventResponse", async (e) => {
			const { topic: t, payload: s, transportType: i$2 } = e, r$1 = (await this.client.core.history.get(t, s.id)).request.method;
			switch (r$1) {
				case "wc_sessionPropose": return this.onSessionProposeResponse(t, s, i$2);
				case "wc_sessionSettle": return this.onSessionSettleResponse(t, s);
				case "wc_sessionUpdate": return this.onSessionUpdateResponse(t, s);
				case "wc_sessionExtend": return this.onSessionExtendResponse(t, s);
				case "wc_sessionPing": return this.onSessionPingResponse(t, s);
				case "wc_sessionRequest": return this.onSessionRequestResponse(t, s);
				case "wc_sessionAuthenticate": return this.onSessionAuthenticateResponse(t, s);
				default: return this.client.logger.info(`Unsupported response method ${r$1}`);
			}
		}), c(this, "onRelayEventUnknownPayload", (e) => {
			const { topic: t } = e, { message: s } = ht$1("MISSING_OR_INVALID", `Decoded payload on topic ${t} is not identifiable as a JSON-RPC request or a response.`);
			throw new Error(s);
		}), c(this, "shouldIgnorePairingRequest", (e) => {
			const { topic: t, requestMethod: s } = e, i$2 = this.expectedPairingMethodMap.get(t);
			return !i$2 || i$2.includes(s) ? !1 : !!(i$2.includes("wc_sessionAuthenticate") && this.client.events.listenerCount("session_authenticate") > 0);
		}), c(this, "onSessionProposeRequest", async (e) => {
			const { topic: t, payload: s, attestation: i$2, encryptedId: r$1 } = e, { params: o$1, id: a$1 } = s;
			try {
				const l$2 = this.client.core.eventClient.getEvent({ topic: t });
				this.client.events.listenerCount("session_proposal") === 0 && (console.warn("No listener for session_proposal event"), l$2?.setError(Y$1.proposal_listener_not_found)), this.isValidConnect(v({}, s.params));
				const p$2 = o$1.expiryTimestamp || Ei(N$1.wc_sessionPropose.req.ttl), h$3 = v({
					id: a$1,
					pairingTopic: t,
					expiryTimestamp: p$2
				}, o$1);
				await this.setProposal(a$1, h$3);
				const u$2 = await this.getVerifyContext({
					attestationId: i$2,
					hash: kc(JSON.stringify(s)),
					encryptedId: r$1,
					metadata: h$3.proposer.metadata
				});
				l$2?.addTrace(G.emit_session_proposal), this.client.events.emit("session_proposal", {
					id: a$1,
					params: h$3,
					verifyContext: u$2
				});
			} catch (l$2) {
				await this.sendError({
					id: a$1,
					topic: t,
					error: l$2,
					rpcOpts: N$1.wc_sessionPropose.autoReject
				}), this.client.logger.error(l$2);
			}
		}), c(this, "onSessionProposeResponse", async (e, t, s) => {
			const { id: i$2 } = t;
			if (isJsonRpcResult(t)) {
				const { result: r$1 } = t;
				this.client.logger.trace({
					type: "method",
					method: "onSessionProposeResponse",
					result: r$1
				});
				const o$1 = this.client.proposal.get(i$2);
				this.client.logger.trace({
					type: "method",
					method: "onSessionProposeResponse",
					proposal: o$1
				});
				const a$1 = o$1.proposer.publicKey;
				this.client.logger.trace({
					type: "method",
					method: "onSessionProposeResponse",
					selfPublicKey: a$1
				});
				const l$2 = r$1.responderPublicKey;
				this.client.logger.trace({
					type: "method",
					method: "onSessionProposeResponse",
					peerPublicKey: l$2
				});
				const p$2 = await this.client.core.crypto.generateSharedKey(a$1, l$2);
				this.pendingSessions.set(i$2, {
					sessionTopic: p$2,
					pairingTopic: e,
					proposalId: i$2,
					publicKey: a$1
				});
				const h$3 = await this.client.core.relayer.subscribe(p$2, { transportType: s });
				this.client.logger.trace({
					type: "method",
					method: "onSessionProposeResponse",
					subscriptionId: h$3
				}), await this.client.core.pairing.activate({ topic: e });
			} else if (isJsonRpcError(t)) {
				await this.client.proposal.delete(i$2, Nt("USER_DISCONNECTED"));
				const r$1 = xi("session_connect", i$2);
				if (this.events.listenerCount(r$1) === 0) throw new Error(`emitting ${r$1} without any listeners, 954`);
				this.events.emit(r$1, { error: t.error });
			}
		}), c(this, "onSessionSettleRequest", async (e, t) => {
			const { id: s, params: i$2 } = t;
			try {
				this.isValidSessionSettleRequest(i$2);
				const { relay: r$1, controller: o$1, expiry: a$1, namespaces: l$2, sessionProperties: p$2, scopedProperties: h$3, sessionConfig: u$2 } = t.params, d$2 = [...this.pendingSessions.values()].find((f$4) => f$4.sessionTopic === e);
				if (!d$2) return this.client.logger.error(`Pending session not found for topic ${e}`);
				const w$1 = this.client.proposal.get(d$2.proposalId), m$1 = b$1(v(v(v({
					topic: e,
					relay: r$1,
					expiry: a$1,
					namespaces: l$2,
					acknowledged: !0,
					pairingTopic: d$2.pairingTopic,
					requiredNamespaces: w$1.requiredNamespaces,
					optionalNamespaces: w$1.optionalNamespaces,
					controller: o$1.publicKey,
					self: {
						publicKey: d$2.publicKey,
						metadata: this.client.metadata
					},
					peer: {
						publicKey: o$1.publicKey,
						metadata: o$1.metadata
					}
				}, p$2 && { sessionProperties: p$2 }), h$3 && { scopedProperties: h$3 }), u$2 && { sessionConfig: u$2 }), { transportType: Q$1.relay });
				await this.client.session.set(m$1.topic, m$1), await this.setExpiry(m$1.topic, m$1.expiry), await this.client.core.pairing.updateMetadata({
					topic: d$2.pairingTopic,
					metadata: m$1.peer.metadata
				}), this.client.events.emit("session_connect", { session: m$1 }), this.events.emit(xi("session_connect", d$2.proposalId), { session: m$1 }), this.pendingSessions.delete(d$2.proposalId), this.deleteProposal(d$2.proposalId, !1), this.cleanupDuplicatePairings(m$1), await this.sendResult({
					id: t.id,
					topic: e,
					result: !0,
					throwOnFailedPublish: !0
				});
			} catch (r$1) {
				await this.sendError({
					id: s,
					topic: e,
					error: r$1
				}), this.client.logger.error(r$1);
			}
		}), c(this, "onSessionSettleResponse", async (e, t) => {
			const { id: s } = t;
			isJsonRpcResult(t) ? (await this.client.session.update(e, { acknowledged: !0 }), this.events.emit(xi("session_approve", s), {})) : isJsonRpcError(t) && (await this.client.session.delete(e, Nt("USER_DISCONNECTED")), this.events.emit(xi("session_approve", s), { error: t.error }));
		}), c(this, "onSessionUpdateRequest", async (e, t) => {
			const { params: s, id: i$2 } = t;
			try {
				const r$1 = `${e}_session_update`, o$1 = Ra.get(r$1);
				if (o$1 && this.isRequestOutOfSync(o$1, i$2)) {
					this.client.logger.warn(`Discarding out of sync request - ${i$2}`), this.sendError({
						id: i$2,
						topic: e,
						error: Nt("INVALID_UPDATE_REQUEST")
					});
					return;
				}
				this.isValidUpdate(v({ topic: e }, s));
				try {
					Ra.set(r$1, i$2), await this.client.session.update(e, { namespaces: s.namespaces }), await this.sendResult({
						id: i$2,
						topic: e,
						result: !0,
						throwOnFailedPublish: !0
					});
				} catch (a$1) {
					throw Ra.delete(r$1), a$1;
				}
				this.client.events.emit("session_update", {
					id: i$2,
					topic: e,
					params: s
				});
			} catch (r$1) {
				await this.sendError({
					id: i$2,
					topic: e,
					error: r$1
				}), this.client.logger.error(r$1);
			}
		}), c(this, "isRequestOutOfSync", (e, t) => t.toString().slice(0, -3) < e.toString().slice(0, -3)), c(this, "onSessionUpdateResponse", (e, t) => {
			const { id: s } = t, i$2 = xi("session_update", s);
			if (this.events.listenerCount(i$2) === 0) throw new Error(`emitting ${i$2} without any listeners`);
			isJsonRpcResult(t) ? this.events.emit(xi("session_update", s), {}) : isJsonRpcError(t) && this.events.emit(xi("session_update", s), { error: t.error });
		}), c(this, "onSessionExtendRequest", async (e, t) => {
			const { id: s } = t;
			try {
				this.isValidExtend({ topic: e }), await this.setExpiry(e, Ei(J$1)), await this.sendResult({
					id: s,
					topic: e,
					result: !0,
					throwOnFailedPublish: !0
				}), this.client.events.emit("session_extend", {
					id: s,
					topic: e
				});
			} catch (i$2) {
				await this.sendError({
					id: s,
					topic: e,
					error: i$2
				}), this.client.logger.error(i$2);
			}
		}), c(this, "onSessionExtendResponse", (e, t) => {
			const { id: s } = t, i$2 = xi("session_extend", s);
			if (this.events.listenerCount(i$2) === 0) throw new Error(`emitting ${i$2} without any listeners`);
			isJsonRpcResult(t) ? this.events.emit(xi("session_extend", s), {}) : isJsonRpcError(t) && this.events.emit(xi("session_extend", s), { error: t.error });
		}), c(this, "onSessionPingRequest", async (e, t) => {
			const { id: s } = t;
			try {
				this.isValidPing({ topic: e }), await this.sendResult({
					id: s,
					topic: e,
					result: !0,
					throwOnFailedPublish: !0
				}), this.client.events.emit("session_ping", {
					id: s,
					topic: e
				});
			} catch (i$2) {
				await this.sendError({
					id: s,
					topic: e,
					error: i$2
				}), this.client.logger.error(i$2);
			}
		}), c(this, "onSessionPingResponse", (e, t) => {
			const { id: s } = t, i$2 = xi("session_ping", s);
			setTimeout(() => {
				if (this.events.listenerCount(i$2) === 0) throw new Error(`emitting ${i$2} without any listeners 2176`);
				isJsonRpcResult(t) ? this.events.emit(xi("session_ping", s), {}) : isJsonRpcError(t) && this.events.emit(xi("session_ping", s), { error: t.error });
			}, 500);
		}), c(this, "onSessionDeleteRequest", async (e, t) => {
			const { id: s } = t;
			try {
				this.isValidDisconnect({
					topic: e,
					reason: t.params
				}), Promise.all([
					new Promise((i$2) => {
						this.client.core.relayer.once(C$1.publish, async () => {
							i$2(await this.deleteSession({
								topic: e,
								id: s
							}));
						});
					}),
					this.sendResult({
						id: s,
						topic: e,
						result: !0,
						throwOnFailedPublish: !0
					}),
					this.cleanupPendingSentRequestsForTopic({
						topic: e,
						error: Nt("USER_DISCONNECTED")
					})
				]).catch((i$2) => this.client.logger.error(i$2));
			} catch (i$2) {
				this.client.logger.error(i$2);
			}
		}), c(this, "onSessionRequest", async (e) => {
			var t, s, i$2;
			const { topic: r$1, payload: o$1, attestation: a$1, encryptedId: l$2, transportType: p$2 } = e, { id: h$3, params: u$2 } = o$1;
			try {
				await this.isValidRequest(v({ topic: r$1 }, u$2));
				const d$2 = this.client.session.get(r$1), w$1 = await this.getVerifyContext({
					attestationId: a$1,
					hash: kc(JSON.stringify(formatJsonRpcRequest("wc_sessionRequest", u$2, h$3))),
					encryptedId: l$2,
					metadata: d$2.peer.metadata,
					transportType: p$2
				}), m$1 = {
					id: h$3,
					topic: r$1,
					params: u$2,
					verifyContext: w$1
				};
				await this.setPendingSessionRequest(m$1), p$2 === Q$1.link_mode && (t = d$2.peer.metadata.redirect) != null && t.universal && this.client.core.addLinkModeSupportedApp((s = d$2.peer.metadata.redirect) == null ? void 0 : s.universal), (i$2 = this.client.signConfig) != null && i$2.disableRequestQueue ? this.emitSessionRequest(m$1) : (this.addSessionRequestToSessionRequestQueue(m$1), this.processSessionRequestQueue());
			} catch (d$2) {
				await this.sendError({
					id: h$3,
					topic: r$1,
					error: d$2
				}), this.client.logger.error(d$2);
			}
		}), c(this, "onSessionRequestResponse", (e, t) => {
			const { id: s } = t, i$2 = xi("session_request", s);
			if (this.events.listenerCount(i$2) === 0) throw new Error(`emitting ${i$2} without any listeners`);
			isJsonRpcResult(t) ? this.events.emit(xi("session_request", s), { result: t.result }) : isJsonRpcError(t) && this.events.emit(xi("session_request", s), { error: t.error });
		}), c(this, "onSessionEventRequest", async (e, t) => {
			const { id: s, params: i$2 } = t;
			try {
				const r$1 = `${e}_session_event_${i$2.event.name}`, o$1 = Ra.get(r$1);
				if (o$1 && this.isRequestOutOfSync(o$1, s)) {
					this.client.logger.info(`Discarding out of sync request - ${s}`);
					return;
				}
				this.isValidEmit(v({ topic: e }, i$2)), this.client.events.emit("session_event", {
					id: s,
					topic: e,
					params: i$2
				}), Ra.set(r$1, s);
			} catch (r$1) {
				await this.sendError({
					id: s,
					topic: e,
					error: r$1
				}), this.client.logger.error(r$1);
			}
		}), c(this, "onSessionAuthenticateResponse", (e, t) => {
			const { id: s } = t;
			this.client.logger.trace({
				type: "method",
				method: "onSessionAuthenticateResponse",
				topic: e,
				payload: t
			}), isJsonRpcResult(t) ? this.events.emit(xi("session_request", s), { result: t.result }) : isJsonRpcError(t) && this.events.emit(xi("session_request", s), { error: t.error });
		}), c(this, "onSessionAuthenticateRequest", async (e) => {
			var t;
			const { topic: s, payload: i$2, attestation: r$1, encryptedId: o$1, transportType: a$1 } = e;
			try {
				const { requester: l$2, authPayload: p$2, expiryTimestamp: h$3 } = i$2.params, u$2 = await this.getVerifyContext({
					attestationId: r$1,
					hash: kc(JSON.stringify(i$2)),
					encryptedId: o$1,
					metadata: l$2.metadata,
					transportType: a$1
				}), d$2 = {
					requester: l$2,
					pairingTopic: s,
					id: i$2.id,
					authPayload: p$2,
					verifyContext: u$2,
					expiryTimestamp: h$3
				};
				await this.setAuthRequest(i$2.id, {
					request: d$2,
					pairingTopic: s,
					transportType: a$1
				}), a$1 === Q$1.link_mode && (t = l$2.metadata.redirect) != null && t.universal && this.client.core.addLinkModeSupportedApp(l$2.metadata.redirect.universal), this.client.events.emit("session_authenticate", {
					topic: s,
					params: i$2.params,
					id: i$2.id,
					verifyContext: u$2
				});
			} catch (l$2) {
				this.client.logger.error(l$2);
				const p$2 = i$2.params.requester.publicKey, h$3 = await this.client.core.crypto.generateKeyPair(), u$2 = this.getAppLinkIfEnabled(i$2.params.requester.metadata, a$1), d$2 = {
					type: 1,
					receiverPublicKey: p$2,
					senderPublicKey: h$3
				};
				await this.sendError({
					id: i$2.id,
					topic: s,
					error: l$2,
					encodeOpts: d$2,
					rpcOpts: N$1.wc_sessionAuthenticate.autoReject,
					appLink: u$2
				});
			}
		}), c(this, "addSessionRequestToSessionRequestQueue", (e) => {
			this.sessionRequestQueue.queue.push(e);
		}), c(this, "cleanupAfterResponse", (e) => {
			this.deletePendingSessionRequest(e.response.id, {
				message: "fulfilled",
				code: 0
			}), setTimeout(() => {
				this.sessionRequestQueue.state = $$1.idle, this.processSessionRequestQueue();
			}, (0, import_cjs.toMiliseconds)(this.requestQueueDelay));
		}), c(this, "cleanupPendingSentRequestsForTopic", ({ topic: e, error: t }) => {
			const s = this.client.core.history.pending;
			s.length > 0 && s.filter((i$2) => i$2.topic === e && i$2.request.method === "wc_sessionRequest").forEach((i$2) => {
				const r$1 = i$2.request.id, o$1 = xi("session_request", r$1);
				if (this.events.listenerCount(o$1) === 0) throw new Error(`emitting ${o$1} without any listeners`);
				this.events.emit(xi("session_request", i$2.request.id), { error: t });
			});
		}), c(this, "processSessionRequestQueue", () => {
			if (this.sessionRequestQueue.state === $$1.active) {
				this.client.logger.info("session request queue is already active.");
				return;
			}
			const e = this.sessionRequestQueue.queue[0];
			if (!e) {
				this.client.logger.info("session request queue is empty.");
				return;
			}
			try {
				this.sessionRequestQueue.state = $$1.active, this.emitSessionRequest(e);
			} catch (t) {
				this.client.logger.error(t);
			}
		}), c(this, "emitSessionRequest", (e) => {
			this.client.events.emit("session_request", e);
		}), c(this, "onPairingCreated", (e) => {
			if (e.methods && this.expectedPairingMethodMap.set(e.topic, e.methods), e.active) return;
			const t = this.client.proposal.getAll().find((s) => s.pairingTopic === e.topic);
			t && this.onSessionProposeRequest({
				topic: e.topic,
				payload: formatJsonRpcRequest("wc_sessionPropose", b$1(v({}, t), {
					requiredNamespaces: t.requiredNamespaces,
					optionalNamespaces: t.optionalNamespaces,
					relays: t.relays,
					proposer: t.proposer,
					sessionProperties: t.sessionProperties,
					scopedProperties: t.scopedProperties
				}), t.id)
			});
		}), c(this, "isValidConnect", async (e) => {
			if (!ma(e)) {
				const { message: l$2 } = ht$1("MISSING_OR_INVALID", `connect() params: ${JSON.stringify(e)}`);
				throw new Error(l$2);
			}
			const { pairingTopic: t, requiredNamespaces: s, optionalNamespaces: i$2, sessionProperties: r$1, scopedProperties: o$1, relays: a$1 } = e;
			if (Et(t) || await this.isValidPairingTopic(t), !ga(a$1, !0)) {
				const { message: l$2 } = ht$1("MISSING_OR_INVALID", `connect() relays: ${a$1}`);
				throw new Error(l$2);
			}
			if (!Et(s) && Oe(s) !== 0) {
				const l$2 = "requiredNamespaces are deprecated and are automatically assigned to optionalNamespaces";
				[
					"fatal",
					"error",
					"silent"
				].includes(this.client.logger.level) ? console.warn(l$2) : this.client.logger.warn(l$2), this.validateNamespaces(s, "requiredNamespaces");
			}
			if (!Et(i$2) && Oe(i$2) !== 0 && this.validateNamespaces(i$2, "optionalNamespaces"), Et(r$1) || this.validateSessionProps(r$1, "sessionProperties"), !Et(o$1)) {
				this.validateSessionProps(o$1, "scopedProperties");
				const l$2 = Object.keys(s || {}).concat(Object.keys(i$2 || {}));
				if (!Object.keys(o$1).every((p$2) => l$2.includes(p$2))) throw new Error(`Scoped properties must be a subset of required/optional namespaces, received: ${JSON.stringify(o$1)}, required/optional namespaces: ${JSON.stringify(l$2)}`);
			}
		}), c(this, "validateNamespaces", (e, t) => {
			const s = pa(e, "connect()", t);
			if (s) throw new Error(s.message);
		}), c(this, "isValidApprove", async (e) => {
			if (!ma(e)) throw new Error(ht$1("MISSING_OR_INVALID", `approve() params: ${e}`).message);
			const { id: t, namespaces: s, relayProtocol: i$2, sessionProperties: r$1, scopedProperties: o$1 } = e;
			this.checkRecentlyDeleted(t), await this.isValidProposalId(t);
			const a$1 = this.client.proposal.get(t), l$2 = Bo(s, "approve()");
			if (l$2) throw new Error(l$2.message);
			const p$2 = No(a$1.requiredNamespaces, s, "approve()");
			if (p$2) throw new Error(p$2.message);
			if (!nt$1(i$2, !0)) {
				const { message: h$3 } = ht$1("MISSING_OR_INVALID", `approve() relayProtocol: ${i$2}`);
				throw new Error(h$3);
			}
			if (Et(r$1) || this.validateSessionProps(r$1, "sessionProperties"), !Et(o$1)) {
				this.validateSessionProps(o$1, "scopedProperties");
				const h$3 = new Set(Object.keys(s));
				if (!Object.keys(o$1).every((u$2) => h$3.has(u$2))) throw new Error(`Scoped properties must be a subset of approved namespaces, received: ${JSON.stringify(o$1)}, approved namespaces: ${Array.from(h$3).join(", ")}`);
			}
		}), c(this, "isValidReject", async (e) => {
			if (!ma(e)) {
				const { message: i$2 } = ht$1("MISSING_OR_INVALID", `reject() params: ${e}`);
				throw new Error(i$2);
			}
			const { id: t, reason: s } = e;
			if (this.checkRecentlyDeleted(t), await this.isValidProposalId(t), !wa(s)) {
				const { message: i$2 } = ht$1("MISSING_OR_INVALID", `reject() reason: ${JSON.stringify(s)}`);
				throw new Error(i$2);
			}
		}), c(this, "isValidSessionSettleRequest", (e) => {
			if (!ma(e)) {
				const { message: l$2 } = ht$1("MISSING_OR_INVALID", `onSessionSettleRequest() params: ${e}`);
				throw new Error(l$2);
			}
			const { relay: t, controller: s, namespaces: i$2, expiry: r$1 } = e;
			if (!Io(t)) {
				const { message: l$2 } = ht$1("MISSING_OR_INVALID", "onSessionSettleRequest() relay protocol should be a string");
				throw new Error(l$2);
			}
			const o$1 = ha(s, "onSessionSettleRequest()");
			if (o$1) throw new Error(o$1.message);
			const a$1 = Bo(i$2, "onSessionSettleRequest()");
			if (a$1) throw new Error(a$1.message);
			if (vi(r$1)) {
				const { message: l$2 } = ht$1("EXPIRED", "onSessionSettleRequest()");
				throw new Error(l$2);
			}
		}), c(this, "isValidUpdate", async (e) => {
			if (!ma(e)) {
				const { message: a$1 } = ht$1("MISSING_OR_INVALID", `update() params: ${e}`);
				throw new Error(a$1);
			}
			const { topic: t, namespaces: s } = e;
			this.checkRecentlyDeleted(t), await this.isValidSessionTopic(t);
			const i$2 = this.client.session.get(t), r$1 = Bo(s, "update()");
			if (r$1) throw new Error(r$1.message);
			const o$1 = No(i$2.requiredNamespaces, s, "update()");
			if (o$1) throw new Error(o$1.message);
		}), c(this, "isValidExtend", async (e) => {
			if (!ma(e)) {
				const { message: s } = ht$1("MISSING_OR_INVALID", `extend() params: ${e}`);
				throw new Error(s);
			}
			const { topic: t } = e;
			this.checkRecentlyDeleted(t), await this.isValidSessionTopic(t);
		}), c(this, "isValidRequest", async (e) => {
			if (!ma(e)) {
				const { message: a$1 } = ht$1("MISSING_OR_INVALID", `request() params: ${e}`);
				throw new Error(a$1);
			}
			const { topic: t, request: s, chainId: i$2, expiry: r$1 } = e;
			this.checkRecentlyDeleted(t), await this.isValidSessionTopic(t);
			const { namespaces: o$1 } = this.client.session.get(t);
			if (!xa(o$1, i$2)) {
				const { message: a$1 } = ht$1("MISSING_OR_INVALID", `request() chainId: ${i$2}`);
				throw new Error(a$1);
			}
			if (!ba(s)) {
				const { message: a$1 } = ht$1("MISSING_OR_INVALID", `request() ${JSON.stringify(s)}`);
				throw new Error(a$1);
			}
			if (!Sa(o$1, i$2, s.method)) {
				const { message: a$1 } = ht$1("MISSING_OR_INVALID", `request() method: ${s.method}`);
				throw new Error(a$1);
			}
			if (r$1 && !Ia(r$1, _e$1)) {
				const { message: a$1 } = ht$1("MISSING_OR_INVALID", `request() expiry: ${r$1}. Expiry must be a number (in seconds) between ${_e$1.min} and ${_e$1.max}`);
				throw new Error(a$1);
			}
		}), c(this, "isValidRespond", async (e) => {
			var t;
			if (!ma(e)) {
				const { message: r$1 } = ht$1("MISSING_OR_INVALID", `respond() params: ${e}`);
				throw new Error(r$1);
			}
			const { topic: s, response: i$2 } = e;
			try {
				await this.isValidSessionTopic(s);
			} catch (r$1) {
				throw (t = e?.response) != null && t.id && this.cleanupAfterResponse(e), r$1;
			}
			if (!Ea(i$2)) {
				const { message: r$1 } = ht$1("MISSING_OR_INVALID", `respond() response: ${JSON.stringify(i$2)}`);
				throw new Error(r$1);
			}
		}), c(this, "isValidPing", async (e) => {
			if (!ma(e)) {
				const { message: s } = ht$1("MISSING_OR_INVALID", `ping() params: ${e}`);
				throw new Error(s);
			}
			const { topic: t } = e;
			await this.isValidSessionOrPairingTopic(t);
		}), c(this, "isValidEmit", async (e) => {
			if (!ma(e)) {
				const { message: o$1 } = ht$1("MISSING_OR_INVALID", `emit() params: ${e}`);
				throw new Error(o$1);
			}
			const { topic: t, event: s, chainId: i$2 } = e;
			await this.isValidSessionTopic(t);
			const { namespaces: r$1 } = this.client.session.get(t);
			if (!xa(r$1, i$2)) {
				const { message: o$1 } = ht$1("MISSING_OR_INVALID", `emit() chainId: ${i$2}`);
				throw new Error(o$1);
			}
			if (!va(s)) {
				const { message: o$1 } = ht$1("MISSING_OR_INVALID", `emit() event: ${JSON.stringify(s)}`);
				throw new Error(o$1);
			}
			if (!Oa(r$1, i$2, s.name)) {
				const { message: o$1 } = ht$1("MISSING_OR_INVALID", `emit() event: ${JSON.stringify(s)}`);
				throw new Error(o$1);
			}
		}), c(this, "isValidDisconnect", async (e) => {
			if (!ma(e)) {
				const { message: s } = ht$1("MISSING_OR_INVALID", `disconnect() params: ${e}`);
				throw new Error(s);
			}
			const { topic: t } = e;
			await this.isValidSessionOrPairingTopic(t);
		}), c(this, "isValidAuthenticate", (e) => {
			const { chains: t, uri: s, domain: i$2, nonce: r$1 } = e;
			if (!Array.isArray(t) || t.length === 0) throw new Error("chains is required and must be a non-empty array");
			if (!nt$1(s, !1)) throw new Error("uri is required parameter");
			if (!nt$1(i$2, !1)) throw new Error("domain is required parameter");
			if (!nt$1(r$1, !1)) throw new Error("nonce is required parameter");
			if ([...new Set(t.map((a$1) => Ne(a$1).namespace))].length > 1) throw new Error("Multi-namespace requests are not supported. Please request single namespace only.");
			const { namespace: o$1 } = Ne(t[0]);
			if (o$1 !== "eip155") throw new Error("Only eip155 namespace is supported for authenticated sessions. Please use .connect() for non-eip155 chains.");
		}), c(this, "getVerifyContext", async (e) => {
			const { attestationId: t, hash: s, encryptedId: i$2, metadata: r$1, transportType: o$1 } = e, a$1 = { verified: {
				verifyUrl: r$1.verifyUrl || "https://verify.walletconnect.org",
				validation: "UNKNOWN",
				origin: r$1.url || ""
			} };
			try {
				if (o$1 === Q$1.link_mode) {
					const p$2 = this.getAppLinkIfEnabled(r$1, o$1);
					return a$1.verified.validation = p$2 && new URL(p$2).origin === new URL(r$1.url).origin ? "VALID" : "INVALID", a$1;
				}
				const l$2 = await this.client.core.verify.resolve({
					attestationId: t,
					hash: s,
					encryptedId: i$2,
					verifyUrl: r$1.verifyUrl
				});
				l$2 && (a$1.verified.origin = l$2.origin, a$1.verified.isScam = l$2.isScam, a$1.verified.validation = l$2.origin === new URL(r$1.url).origin ? "VALID" : "INVALID");
			} catch (l$2) {
				this.client.logger.warn(l$2);
			}
			return this.client.logger.debug(`Verify context: ${JSON.stringify(a$1)}`), a$1;
		}), c(this, "validateSessionProps", (e, t) => {
			Object.values(e).forEach((s, i$2) => {
				if (s == null) {
					const { message: r$1 } = ht$1("MISSING_OR_INVALID", `${t} must contain an existing value for each key. Received: ${s} for key ${Object.keys(e)[i$2]}`);
					throw new Error(r$1);
				}
			});
		}), c(this, "getPendingAuthRequest", (e) => {
			const t = this.client.auth.requests.get(e);
			return typeof t == "object" ? t : void 0;
		}), c(this, "addToRecentlyDeleted", (e, t) => {
			if (this.recentlyDeletedMap.set(e, t), this.recentlyDeletedMap.size >= this.recentlyDeletedLimit) {
				let s = 0;
				const i$2 = this.recentlyDeletedLimit / 2;
				for (const r$1 of this.recentlyDeletedMap.keys()) {
					if (s++ >= i$2) break;
					this.recentlyDeletedMap.delete(r$1);
				}
			}
		}), c(this, "checkRecentlyDeleted", (e) => {
			const t = this.recentlyDeletedMap.get(e);
			if (t) {
				const { message: s } = ht$1("MISSING_OR_INVALID", `Record was recently deleted - ${t}: ${e}`);
				throw new Error(s);
			}
		}), c(this, "isLinkModeEnabled", (e, t) => {
			var s, i$2, r$1, o$1, a$1, l$2, p$2, h$3, u$2;
			return !e || t !== Q$1.link_mode ? !1 : ((i$2 = (s = this.client.metadata) == null ? void 0 : s.redirect) == null ? void 0 : i$2.linkMode) === !0 && ((o$1 = (r$1 = this.client.metadata) == null ? void 0 : r$1.redirect) == null ? void 0 : o$1.universal) !== void 0 && ((l$2 = (a$1 = this.client.metadata) == null ? void 0 : a$1.redirect) == null ? void 0 : l$2.universal) !== "" && ((p$2 = e?.redirect) == null ? void 0 : p$2.universal) !== void 0 && ((h$3 = e?.redirect) == null ? void 0 : h$3.universal) !== "" && ((u$2 = e?.redirect) == null ? void 0 : u$2.linkMode) === !0 && this.client.core.linkModeSupportedApps.includes(e.redirect.universal) && typeof (global == null ? void 0 : global.Linking) < "u";
		}), c(this, "getAppLinkIfEnabled", (e, t) => {
			var s;
			return this.isLinkModeEnabled(e, t) ? (s = e?.redirect) == null ? void 0 : s.universal : void 0;
		}), c(this, "handleLinkModeMessage", ({ url: e }) => {
			if (!e || !e.includes("wc_ev") || !e.includes("topic")) return;
			const t = Ai(e, "topic") || "", s = decodeURIComponent(Ai(e, "wc_ev") || ""), i$2 = this.client.session.keys.includes(t);
			i$2 && this.client.session.update(t, { transportType: Q$1.link_mode }), this.client.core.dispatchEnvelope({
				topic: t,
				message: s,
				sessionExists: i$2
			});
		}), c(this, "registerLinkModeListeners", async () => {
			var e;
			if (Ii() || pt$1() && (e = this.client.metadata.redirect) != null && e.linkMode) {
				const t = global == null ? void 0 : global.Linking;
				if (typeof t < "u") {
					t.addEventListener("url", this.handleLinkModeMessage, this.client.name);
					const s = await t.getInitialURL();
					s && setTimeout(() => {
						this.handleLinkModeMessage({ url: s });
					}, 50);
				}
			}
		}), c(this, "shouldSetTVF", (e, t) => {
			if (!t || e !== "wc_sessionRequest") return !1;
			const { request: s } = t;
			return Object.keys(Ke$1).includes(s.method);
		}), c(this, "getTVFParams", (e, t, s) => {
			var i$2, r$1;
			try {
				const o$1 = t.request.method, a$1 = this.extractTxHashesFromResult(o$1, s);
				return b$1(v({
					correlationId: e,
					rpcMethods: [o$1],
					chainId: t.chainId
				}, this.isValidContractData(t.request.params) && { contractAddresses: [(r$1 = (i$2 = t.request.params) == null ? void 0 : i$2[0]) == null ? void 0 : r$1.to] }), { txHashes: a$1 });
			} catch (o$1) {
				this.client.logger.warn("Error getting TVF params", o$1);
			}
			return {};
		}), c(this, "isValidContractData", (e) => {
			var t;
			if (!e) return !1;
			try {
				const s = e?.data || ((t = e?.[0]) == null ? void 0 : t.data);
				if (!s.startsWith("0x")) return !1;
				const i$2 = s.slice(2);
				return /^[0-9a-fA-F]*$/.test(i$2) ? i$2.length % 2 === 0 : !1;
			} catch {}
			return !1;
		}), c(this, "extractTxHashesFromResult", (e, t) => {
			try {
				const s = Ke$1[e];
				if (typeof t == "string") return [t];
				const i$2 = t[s.key];
				if (se(i$2)) return e === "solana_signAllTransactions" ? i$2.map((r$1) => Ji(r$1)) : i$2;
				if (typeof i$2 == "string") return [i$2];
			} catch (s) {
				this.client.logger.warn("Error extracting tx hashes from result", s);
			}
			return [];
		});
	}
	async processPendingMessageEvents() {
		try {
			const n$1 = this.client.session.keys, e = this.client.core.relayer.messages.getWithoutAck(n$1);
			for (const [t, s] of Object.entries(e)) for (const i$2 of s) try {
				await this.onProviderMessageEvent({
					topic: t,
					message: i$2,
					publishedAt: Date.now()
				});
			} catch {
				this.client.logger.warn(`Error processing pending message event for topic: ${t}, message: ${i$2}`);
			}
		} catch (n$1) {
			this.client.logger.warn("processPendingMessageEvents failed", n$1);
		}
	}
	isInitialized() {
		if (!this.initialized) {
			const { message: n$1 } = ht$1("NOT_INITIALIZED", this.name);
			throw new Error(n$1);
		}
	}
	async confirmOnlineStateOrThrow() {
		await this.client.core.relayer.confirmOnlineStateOrThrow();
	}
	registerRelayerEvents() {
		this.client.core.relayer.on(C$1.message, (n$1) => {
			this.onProviderMessageEvent(n$1);
		});
	}
	async onRelayMessage(n$1) {
		const { topic: e, message: t, attestation: s, transportType: i$2 } = n$1, { publicKey: r$1 } = this.client.auth.authKeys.keys.includes(ce$1) ? this.client.auth.authKeys.get(ce$1) : {
			responseTopic: void 0,
			publicKey: void 0
		};
		try {
			const o$1 = await this.client.core.crypto.decode(e, t, {
				receiverPublicKey: r$1,
				encoding: i$2 === Q$1.link_mode ? xe$1 : qt$1
			});
			isJsonRpcRequest(o$1) ? (this.client.core.history.set(e, o$1), await this.onRelayEventRequest({
				topic: e,
				payload: o$1,
				attestation: s,
				transportType: i$2,
				encryptedId: kc(t)
			})) : isJsonRpcResponse(o$1) ? (await this.client.core.history.resolve(o$1), await this.onRelayEventResponse({
				topic: e,
				payload: o$1,
				transportType: i$2
			}), this.client.core.history.delete(e, o$1.id)) : await this.onRelayEventUnknownPayload({
				topic: e,
				payload: o$1,
				transportType: i$2
			}), await this.client.core.relayer.messages.ack(e, t);
		} catch (o$1) {
			this.client.logger.error(o$1);
		}
	}
	registerExpirerEvents() {
		this.client.core.expirer.on(M$1.expired, async (n$1) => {
			const { topic: e, id: t } = bi(n$1.target);
			if (t && this.client.pendingRequest.keys.includes(t)) return await this.deletePendingSessionRequest(t, ht$1("EXPIRED"), !0);
			if (t && this.client.auth.requests.keys.includes(t)) return await this.deletePendingAuthRequest(t, ht$1("EXPIRED"), !0);
			e ? this.client.session.keys.includes(e) && (await this.deleteSession({
				topic: e,
				expirerHasDeleted: !0
			}), this.client.events.emit("session_expire", { topic: e })) : t && (await this.deleteProposal(t, !0), this.client.events.emit("proposal_expire", { id: t }));
		});
	}
	registerPairingEvents() {
		this.client.core.pairing.events.on(re$1.create, (n$1) => this.onPairingCreated(n$1)), this.client.core.pairing.events.on(re$1.delete, (n$1) => {
			this.addToRecentlyDeleted(n$1.topic, "pairing");
		});
	}
	isValidPairingTopic(n$1) {
		if (!nt$1(n$1, !1)) {
			const { message: e } = ht$1("MISSING_OR_INVALID", `pairing topic should be a string: ${n$1}`);
			throw new Error(e);
		}
		if (!this.client.core.pairing.pairings.keys.includes(n$1)) {
			const { message: e } = ht$1("NO_MATCHING_KEY", `pairing topic doesn't exist: ${n$1}`);
			throw new Error(e);
		}
		if (vi(this.client.core.pairing.pairings.get(n$1).expiry)) {
			const { message: e } = ht$1("EXPIRED", `pairing topic: ${n$1}`);
			throw new Error(e);
		}
	}
	async isValidSessionTopic(n$1) {
		if (!nt$1(n$1, !1)) {
			const { message: e } = ht$1("MISSING_OR_INVALID", `session topic should be a string: ${n$1}`);
			throw new Error(e);
		}
		if (this.checkRecentlyDeleted(n$1), !this.client.session.keys.includes(n$1)) {
			const { message: e } = ht$1("NO_MATCHING_KEY", `session topic doesn't exist: ${n$1}`);
			throw new Error(e);
		}
		if (vi(this.client.session.get(n$1).expiry)) {
			await this.deleteSession({ topic: n$1 });
			const { message: e } = ht$1("EXPIRED", `session topic: ${n$1}`);
			throw new Error(e);
		}
		if (!this.client.core.crypto.keychain.has(n$1)) {
			const { message: e } = ht$1("MISSING_OR_INVALID", `session topic does not exist in keychain: ${n$1}`);
			throw await this.deleteSession({ topic: n$1 }), new Error(e);
		}
	}
	async isValidSessionOrPairingTopic(n$1) {
		if (this.checkRecentlyDeleted(n$1), this.client.session.keys.includes(n$1)) await this.isValidSessionTopic(n$1);
		else if (this.client.core.pairing.pairings.keys.includes(n$1)) this.isValidPairingTopic(n$1);
		else if (nt$1(n$1, !1)) {
			const { message: e } = ht$1("NO_MATCHING_KEY", `session or pairing topic doesn't exist: ${n$1}`);
			throw new Error(e);
		} else {
			const { message: e } = ht$1("MISSING_OR_INVALID", `session or pairing topic should be a string: ${n$1}`);
			throw new Error(e);
		}
	}
	async isValidProposalId(n$1) {
		if (!ya(n$1)) {
			const { message: e } = ht$1("MISSING_OR_INVALID", `proposal id should be a number: ${n$1}`);
			throw new Error(e);
		}
		if (!this.client.proposal.keys.includes(n$1)) {
			const { message: e } = ht$1("NO_MATCHING_KEY", `proposal id doesn't exist: ${n$1}`);
			throw new Error(e);
		}
		if (vi(this.client.proposal.get(n$1).expiryTimestamp)) {
			await this.deleteProposal(n$1);
			const { message: e } = ht$1("EXPIRED", `proposal id: ${n$1}`);
			throw new Error(e);
		}
	}
};
var Os = class extends zi {
	constructor(n$1, e) {
		super(n$1, e, pt$2, we$1), this.core = n$1, this.logger = e;
	}
};
var St$1 = class extends zi {
	constructor(n$1, e) {
		super(n$1, e, ht$2, we$1), this.core = n$1, this.logger = e;
	}
};
var bs = class extends zi {
	constructor(n$1, e) {
		super(n$1, e, ut$1, we$1, (t) => t.id), this.core = n$1, this.logger = e;
	}
};
var As = class extends zi {
	constructor(n$1, e) {
		super(n$1, e, mt$1, ae$1, () => ce$1), this.core = n$1, this.logger = e;
	}
};
var xs = class extends zi {
	constructor(n$1, e) {
		super(n$1, e, _t$1, ae$1), this.core = n$1, this.logger = e;
	}
};
var Cs = class extends zi {
	constructor(n$1, e) {
		super(n$1, e, Et$1, ae$1, (t) => t.id), this.core = n$1, this.logger = e;
	}
};
var Vs = Object.defineProperty, Ds = (S$3, n$1, e) => n$1 in S$3 ? Vs(S$3, n$1, {
	enumerable: !0,
	configurable: !0,
	writable: !0,
	value: e
}) : S$3[n$1] = e, Ge$1 = (S$3, n$1, e) => Ds(S$3, typeof n$1 != "symbol" ? n$1 + "" : n$1, e);
var Ls = class {
	constructor(n$1, e) {
		this.core = n$1, this.logger = e, Ge$1(this, "authKeys"), Ge$1(this, "pairingTopics"), Ge$1(this, "requests"), this.authKeys = new As(this.core, this.logger), this.pairingTopics = new xs(this.core, this.logger), this.requests = new Cs(this.core, this.logger);
	}
	async init() {
		await this.authKeys.init(), await this.pairingTopics.init(), await this.requests.init();
	}
};
var ks = Object.defineProperty, Ms = (S$3, n$1, e) => n$1 in S$3 ? ks(S$3, n$1, {
	enumerable: !0,
	configurable: !0,
	writable: !0,
	value: e
}) : S$3[n$1] = e, E$2 = (S$3, n$1, e) => Ms(S$3, typeof n$1 != "symbol" ? n$1 + "" : n$1, e);
var Ee = class Ee extends J {
	constructor(n$1) {
		super(n$1), E$2(this, "protocol", "wc"), E$2(this, "version", 2), E$2(this, "name", me$1.name), E$2(this, "metadata"), E$2(this, "core"), E$2(this, "logger"), E$2(this, "events", new import_events$1.EventEmitter()), E$2(this, "engine"), E$2(this, "session"), E$2(this, "proposal"), E$2(this, "pendingRequest"), E$2(this, "auth"), E$2(this, "signConfig"), E$2(this, "on", (t, s) => this.events.on(t, s)), E$2(this, "once", (t, s) => this.events.once(t, s)), E$2(this, "off", (t, s) => this.events.off(t, s)), E$2(this, "removeListener", (t, s) => this.events.removeListener(t, s)), E$2(this, "removeAllListeners", (t) => this.events.removeAllListeners(t)), E$2(this, "connect", async (t) => {
			try {
				return await this.engine.connect(t);
			} catch (s) {
				throw this.logger.error(s.message), s;
			}
		}), E$2(this, "pair", async (t) => {
			try {
				return await this.engine.pair(t);
			} catch (s) {
				throw this.logger.error(s.message), s;
			}
		}), E$2(this, "approve", async (t) => {
			try {
				return await this.engine.approve(t);
			} catch (s) {
				throw this.logger.error(s.message), s;
			}
		}), E$2(this, "reject", async (t) => {
			try {
				return await this.engine.reject(t);
			} catch (s) {
				throw this.logger.error(s.message), s;
			}
		}), E$2(this, "update", async (t) => {
			try {
				return await this.engine.update(t);
			} catch (s) {
				throw this.logger.error(s.message), s;
			}
		}), E$2(this, "extend", async (t) => {
			try {
				return await this.engine.extend(t);
			} catch (s) {
				throw this.logger.error(s.message), s;
			}
		}), E$2(this, "request", async (t) => {
			try {
				return await this.engine.request(t);
			} catch (s) {
				throw this.logger.error(s.message), s;
			}
		}), E$2(this, "respond", async (t) => {
			try {
				return await this.engine.respond(t);
			} catch (s) {
				throw this.logger.error(s.message), s;
			}
		}), E$2(this, "ping", async (t) => {
			try {
				return await this.engine.ping(t);
			} catch (s) {
				throw this.logger.error(s.message), s;
			}
		}), E$2(this, "emit", async (t) => {
			try {
				return await this.engine.emit(t);
			} catch (s) {
				throw this.logger.error(s.message), s;
			}
		}), E$2(this, "disconnect", async (t) => {
			try {
				return await this.engine.disconnect(t);
			} catch (s) {
				throw this.logger.error(s.message), s;
			}
		}), E$2(this, "find", (t) => {
			try {
				return this.engine.find(t);
			} catch (s) {
				throw this.logger.error(s.message), s;
			}
		}), E$2(this, "getPendingSessionRequests", () => {
			try {
				return this.engine.getPendingSessionRequests();
			} catch (t) {
				throw this.logger.error(t.message), t;
			}
		}), E$2(this, "authenticate", async (t, s) => {
			try {
				return await this.engine.authenticate(t, s);
			} catch (i$2) {
				throw this.logger.error(i$2.message), i$2;
			}
		}), E$2(this, "formatAuthMessage", (t) => {
			try {
				return this.engine.formatAuthMessage(t);
			} catch (s) {
				throw this.logger.error(s.message), s;
			}
		}), E$2(this, "approveSessionAuthenticate", async (t) => {
			try {
				return await this.engine.approveSessionAuthenticate(t);
			} catch (s) {
				throw this.logger.error(s.message), s;
			}
		}), E$2(this, "rejectSessionAuthenticate", async (t) => {
			try {
				return await this.engine.rejectSessionAuthenticate(t);
			} catch (s) {
				throw this.logger.error(s.message), s;
			}
		}), this.name = n$1?.name || me$1.name, this.metadata = oi(n$1?.metadata), this.signConfig = n$1?.signConfig;
		const e = typeof n$1?.logger < "u" && typeof n$1?.logger != "string" ? n$1.logger : (0, import_browser.default)(k({ level: n$1?.logger || me$1.logger }));
		this.core = n$1?.core || new Xo(n$1), this.logger = E$1(e, this.name), this.session = new St$1(this.core, this.logger), this.proposal = new Os(this.core, this.logger), this.pendingRequest = new bs(this.core, this.logger), this.engine = new Ns(this), this.auth = new Ls(this.core, this.logger);
	}
	static async init(n$1) {
		const e = new Ee(n$1);
		return await e.initialize(), e;
	}
	get context() {
		return y$1(this.logger);
	}
	get pairing() {
		return this.core.pairing.pairings;
	}
	async initialize() {
		this.logger.trace("Initialized");
		try {
			await this.core.start(), await this.session.init(), await this.proposal.init(), await this.pendingRequest.init(), await this.auth.init(), await this.engine.init(), this.logger.info("SignClient Initialization Success"), setTimeout(() => {
				this.engine.processRelayMessageCache();
			}, (0, import_cjs.toMiliseconds)(import_cjs.ONE_SECOND));
		} catch (n$1) {
			throw this.logger.info("SignClient Initialization Failure"), this.logger.error(n$1.message), n$1;
		}
	}
};
var import_events = /* @__PURE__ */ __toESM(require_events()), qt = "universal_provider", U = `wc@2:${qt}:`, st = "https://rpc.walletconnect.org/v1/", I = "generic", jt = `${st}bundler`, u = { DEFAULT_CHAIN_CHANGED: "default_chain_changed" };
function Rt() {}
function k$1(s) {
	return s == null || typeof s != "object" && typeof s != "function";
}
function W(s) {
	return ArrayBuffer.isView(s) && !(s instanceof DataView);
}
function _t(s) {
	if (k$1(s)) return s;
	if (Array.isArray(s) || W(s) || s instanceof ArrayBuffer || typeof SharedArrayBuffer < "u" && s instanceof SharedArrayBuffer) return s.slice(0);
	const t = Object.getPrototypeOf(s), e = t.constructor;
	if (s instanceof Date || s instanceof Map || s instanceof Set) return new e(s);
	if (s instanceof RegExp) {
		const i$2 = new e(s);
		return i$2.lastIndex = s.lastIndex, i$2;
	}
	if (s instanceof DataView) return new e(s.buffer.slice(0));
	if (s instanceof Error) {
		const i$2 = new e(s.message);
		return i$2.stack = s.stack, i$2.name = s.name, i$2.cause = s.cause, i$2;
	}
	if (typeof File < "u" && s instanceof File) return new e([s], s.name, {
		type: s.type,
		lastModified: s.lastModified
	});
	if (typeof s == "object") {
		const i$2 = Object.create(t);
		return Object.assign(i$2, s);
	}
	return s;
}
function it(s) {
	return typeof s == "object" && s !== null;
}
function rt(s) {
	return Object.getOwnPropertySymbols(s).filter((t) => Object.prototype.propertyIsEnumerable.call(s, t));
}
function nt(s) {
	return s == null ? s === void 0 ? "[object Undefined]" : "[object Null]" : Object.prototype.toString.call(s);
}
var Ut = "[object RegExp]", at = "[object String]", ct = "[object Number]", ot$1 = "[object Boolean]", ht = "[object Arguments]", Ft = "[object Symbol]", Lt = "[object Date]", Mt = "[object Map]", xt = "[object Set]", Bt = "[object Array]", Gt = "[object ArrayBuffer]", Jt = "[object Object]", zt = "[object DataView]", kt = "[object Uint8Array]", Wt = "[object Uint8ClampedArray]", Kt = "[object Uint16Array]", Vt = "[object Uint32Array]", Xt = "[object Int8Array]", Yt = "[object Int16Array]", Qt = "[object Int32Array]", Zt = "[object Float32Array]", Tt = "[object Float64Array]";
function te(s, t) {
	return $(s, void 0, s, /* @__PURE__ */ new Map(), t);
}
function $(s, t, e, i$2 = /* @__PURE__ */ new Map(), n$1 = void 0) {
	const a$1 = n$1?.(s, t, e, i$2);
	if (a$1 != null) return a$1;
	if (k$1(s)) return s;
	if (i$2.has(s)) return i$2.get(s);
	if (Array.isArray(s)) {
		const r$1 = new Array(s.length);
		i$2.set(s, r$1);
		for (let c$2 = 0; c$2 < s.length; c$2++) r$1[c$2] = $(s[c$2], c$2, e, i$2, n$1);
		return Object.hasOwn(s, "index") && (r$1.index = s.index), Object.hasOwn(s, "input") && (r$1.input = s.input), r$1;
	}
	if (s instanceof Date) return new Date(s.getTime());
	if (s instanceof RegExp) {
		const r$1 = new RegExp(s.source, s.flags);
		return r$1.lastIndex = s.lastIndex, r$1;
	}
	if (s instanceof Map) {
		const r$1 = /* @__PURE__ */ new Map();
		i$2.set(s, r$1);
		for (const [c$2, o$1] of s) r$1.set(c$2, $(o$1, c$2, e, i$2, n$1));
		return r$1;
	}
	if (s instanceof Set) {
		const r$1 = /* @__PURE__ */ new Set();
		i$2.set(s, r$1);
		for (const c$2 of s) r$1.add($(c$2, void 0, e, i$2, n$1));
		return r$1;
	}
	if (typeof Buffer < "u" && Buffer.isBuffer(s)) return s.subarray();
	if (W(s)) {
		const r$1 = new (Object.getPrototypeOf(s)).constructor(s.length);
		i$2.set(s, r$1);
		for (let c$2 = 0; c$2 < s.length; c$2++) r$1[c$2] = $(s[c$2], c$2, e, i$2, n$1);
		return r$1;
	}
	if (s instanceof ArrayBuffer || typeof SharedArrayBuffer < "u" && s instanceof SharedArrayBuffer) return s.slice(0);
	if (s instanceof DataView) {
		const r$1 = new DataView(s.buffer.slice(0), s.byteOffset, s.byteLength);
		return i$2.set(s, r$1), y(r$1, s, e, i$2, n$1), r$1;
	}
	if (typeof File < "u" && s instanceof File) {
		const r$1 = new File([s], s.name, { type: s.type });
		return i$2.set(s, r$1), y(r$1, s, e, i$2, n$1), r$1;
	}
	if (s instanceof Blob) {
		const r$1 = new Blob([s], { type: s.type });
		return i$2.set(s, r$1), y(r$1, s, e, i$2, n$1), r$1;
	}
	if (s instanceof Error) {
		const r$1 = new s.constructor();
		return i$2.set(s, r$1), r$1.message = s.message, r$1.name = s.name, r$1.stack = s.stack, r$1.cause = s.cause, y(r$1, s, e, i$2, n$1), r$1;
	}
	if (typeof s == "object" && ee(s)) {
		const r$1 = Object.create(Object.getPrototypeOf(s));
		return i$2.set(s, r$1), y(r$1, s, e, i$2, n$1), r$1;
	}
	return s;
}
function y(s, t, e = s, i$2, n$1) {
	const a$1 = [...Object.keys(t), ...rt(t)];
	for (let r$1 = 0; r$1 < a$1.length; r$1++) {
		const c$2 = a$1[r$1], o$1 = Object.getOwnPropertyDescriptor(s, c$2);
		(o$1 == null || o$1.writable) && (s[c$2] = $(t[c$2], c$2, e, i$2, n$1));
	}
}
function ee(s) {
	switch (nt(s)) {
		case ht:
		case Bt:
		case Gt:
		case zt:
		case ot$1:
		case Lt:
		case Zt:
		case Tt:
		case Xt:
		case Yt:
		case Qt:
		case Mt:
		case ct:
		case Jt:
		case Ut:
		case xt:
		case at:
		case Ft:
		case kt:
		case Wt:
		case Kt:
		case Vt: return !0;
		default: return !1;
	}
}
function se$1(s, t) {
	return te(s, (e, i$2, n$1, a$1) => {
		const r$1 = t?.(e, i$2, n$1, a$1);
		if (r$1 != null) return r$1;
		if (typeof s == "object") switch (Object.prototype.toString.call(s)) {
			case ct:
			case at:
			case ot$1: {
				const c$2 = new s.constructor(s?.valueOf());
				return y(c$2, s), c$2;
			}
			case ht: {
				const c$2 = {};
				return y(c$2, s), c$2.length = s.length, c$2[Symbol.iterator] = s[Symbol.iterator], c$2;
			}
			default: return;
		}
	});
}
function pt(s) {
	return se$1(s);
}
function dt(s) {
	return s !== null && typeof s == "object" && nt(s) === "[object Arguments]";
}
function ie(s) {
	return W(s);
}
function re(s) {
	if (typeof s != "object" || s == null) return !1;
	if (Object.getPrototypeOf(s) === null) return !0;
	if (Object.prototype.toString.call(s) !== "[object Object]") {
		const e = s[Symbol.toStringTag];
		return e == null || !Object.getOwnPropertyDescriptor(s, Symbol.toStringTag)?.writable ? !1 : s.toString() === `[object ${e}]`;
	}
	let t = s;
	for (; Object.getPrototypeOf(t) !== null;) t = Object.getPrototypeOf(t);
	return Object.getPrototypeOf(s) === t;
}
function ne(s, ...t) {
	const e = t.slice(0, -1), i$2 = t[t.length - 1];
	let n$1 = s;
	for (let a$1 = 0; a$1 < e.length; a$1++) {
		const r$1 = e[a$1];
		n$1 = F(n$1, r$1, i$2, /* @__PURE__ */ new Map());
	}
	return n$1;
}
function F(s, t, e, i$2) {
	if (k$1(s) && (s = Object(s)), t == null || typeof t != "object") return s;
	if (i$2.has(t)) return _t(i$2.get(t));
	if (i$2.set(t, s), Array.isArray(t)) {
		t = t.slice();
		for (let a$1 = 0; a$1 < t.length; a$1++) t[a$1] = t[a$1] ?? void 0;
	}
	const n$1 = [...Object.keys(t), ...rt(t)];
	for (let a$1 = 0; a$1 < n$1.length; a$1++) {
		const r$1 = n$1[a$1];
		let c$2 = t[r$1], o$1 = s[r$1];
		if (dt(c$2) && (c$2 = { ...c$2 }), dt(o$1) && (o$1 = { ...o$1 }), typeof Buffer < "u" && Buffer.isBuffer(c$2) && (c$2 = pt(c$2)), Array.isArray(c$2)) if (typeof o$1 == "object" && o$1 != null) {
			const w$1 = [], v$3 = Reflect.ownKeys(o$1);
			for (let P$2 = 0; P$2 < v$3.length; P$2++) {
				const p$2 = v$3[P$2];
				w$1[p$2] = o$1[p$2];
			}
			o$1 = w$1;
		} else o$1 = [];
		const m$1 = e(o$1, c$2, r$1, s, t, i$2);
		m$1 != null ? s[r$1] = m$1 : Array.isArray(c$2) || it(o$1) && it(c$2) ? s[r$1] = F(o$1, c$2, e, i$2) : o$1 == null && re(c$2) ? s[r$1] = F({}, c$2, e, i$2) : o$1 == null && ie(c$2) ? s[r$1] = pt(c$2) : (o$1 === void 0 || c$2 !== void 0) && (s[r$1] = c$2);
	}
	return s;
}
function ae(s, ...t) {
	return ne(s, ...t, Rt);
}
var ce = Object.defineProperty, oe = Object.defineProperties, he = Object.getOwnPropertyDescriptors, ut = Object.getOwnPropertySymbols, pe = Object.prototype.hasOwnProperty, de = Object.prototype.propertyIsEnumerable, lt = (s, t, e) => t in s ? ce(s, t, {
	enumerable: !0,
	configurable: !0,
	writable: !0,
	value: e
}) : s[t] = e, L = (s, t) => {
	for (var e in t || (t = {})) pe.call(t, e) && lt(s, e, t[e]);
	if (ut) for (var e of ut(t)) de.call(t, e) && lt(s, e, t[e]);
	return s;
}, ue = (s, t) => oe(s, he(t));
function d(s, t, e) {
	var i$2;
	const n$1 = Ne(s);
	return ((i$2 = t.rpcMap) == null ? void 0 : i$2[n$1.reference]) || `https://rpc.walletconnect.org/v1/?chainId=${n$1.namespace}:${n$1.reference}&projectId=${e}`;
}
function b(s) {
	return s.includes(":") ? s.split(":")[1] : s;
}
function ft(s) {
	return s.map((t) => `${t.split(":")[0]}:${t.split(":")[1]}`);
}
function le(s, t) {
	const e = Object.keys(t.namespaces).filter((n$1) => n$1.includes(s));
	if (!e.length) return [];
	const i$2 = [];
	return e.forEach((n$1) => {
		const a$1 = t.namespaces[n$1].accounts;
		i$2.push(...a$1);
	}), i$2;
}
function M(s = {}, t = {}) {
	const e = mt(s), i$2 = mt(t);
	return ae(e, i$2);
}
function mt(s) {
	var t, e, i$2, n$1, a$1;
	const r$1 = {};
	if (!Oe(s)) return r$1;
	for (const [c$2, o$1] of Object.entries(s)) {
		const m$1 = yn(c$2) ? [c$2] : o$1.chains, w$1 = o$1.methods || [], v$3 = o$1.events || [], P$2 = o$1.rpcMap || {}, p$2 = yo(c$2);
		r$1[p$2] = ue(L(L({}, r$1[p$2]), o$1), {
			chains: ot(m$1, (t = r$1[p$2]) == null ? void 0 : t.chains),
			methods: ot(w$1, (e = r$1[p$2]) == null ? void 0 : e.methods),
			events: ot(v$3, (i$2 = r$1[p$2]) == null ? void 0 : i$2.events)
		}), (Oe(P$2) || Oe(((n$1 = r$1[p$2]) == null ? void 0 : n$1.rpcMap) || {})) && (r$1[p$2].rpcMap = L(L({}, P$2), (a$1 = r$1[p$2]) == null ? void 0 : a$1.rpcMap));
	}
	return r$1;
}
function vt(s) {
	return s.includes(":") ? s.split(":")[2] : s;
}
function gt(s) {
	const t = {};
	for (const [e, i$2] of Object.entries(s)) {
		const n$1 = i$2.methods || [], a$1 = i$2.events || [], r$1 = i$2.accounts || [];
		t[e] = {
			chains: yn(e) ? [e] : i$2.chains ? i$2.chains : ft(i$2.accounts),
			methods: n$1,
			events: a$1,
			accounts: r$1
		};
	}
	return t;
}
function K(s) {
	return typeof s == "number" ? s : s.includes("0x") ? parseInt(s, 16) : (s = s.includes(":") ? s.split(":")[1] : s, isNaN(Number(s)) ? s : Number(s));
}
var Pt = {}, h = (s) => Pt[s], V = (s, t) => {
	Pt[s] = t;
};
var fe = Object.defineProperty, me = (s, t, e) => t in s ? fe(s, t, {
	enumerable: !0,
	configurable: !0,
	writable: !0,
	value: e
}) : s[t] = e, O = (s, t, e) => me(s, typeof t != "symbol" ? t + "" : t, e);
var ve = class {
	constructor(t) {
		O(this, "name", "polkadot"), O(this, "client"), O(this, "httpProviders"), O(this, "events"), O(this, "namespace"), O(this, "chainId"), this.namespace = t.namespace, this.events = h("events"), this.client = h("client"), this.chainId = this.getDefaultChain(), this.httpProviders = this.createHttpProviders();
	}
	updateNamespace(t) {
		this.namespace = Object.assign(this.namespace, t);
	}
	requestAccounts() {
		return this.getAccounts();
	}
	getDefaultChain() {
		if (this.chainId) return this.chainId;
		if (this.namespace.defaultChain) return this.namespace.defaultChain;
		const t = this.namespace.chains[0];
		if (!t) throw new Error("ChainId not found");
		return t.split(":")[1];
	}
	request(t) {
		return this.namespace.methods.includes(t.request.method) ? this.client.request(t) : this.getHttpProvider().request(t.request);
	}
	setDefaultChain(t, e) {
		this.httpProviders[t] || this.setHttpProvider(t, e), this.chainId = t, this.events.emit(u.DEFAULT_CHAIN_CHANGED, `${this.name}:${t}`);
	}
	getAccounts() {
		const t = this.namespace.accounts;
		return t ? t.filter((e) => e.split(":")[1] === this.chainId.toString()).map((e) => e.split(":")[2]) || [] : [];
	}
	createHttpProviders() {
		const t = {};
		return this.namespace.chains.forEach((e) => {
			var i$2;
			const n$1 = b(e);
			t[n$1] = this.createHttpProvider(n$1, (i$2 = this.namespace.rpcMap) == null ? void 0 : i$2[e]);
		}), t;
	}
	getHttpProvider() {
		const t = `${this.name}:${this.chainId}`, e = this.httpProviders[t];
		if (typeof e > "u") throw new Error(`JSON-RPC provider for ${t} not found`);
		return e;
	}
	setHttpProvider(t, e) {
		const i$2 = this.createHttpProvider(t, e);
		i$2 && (this.httpProviders[t] = i$2);
	}
	createHttpProvider(t, e) {
		const i$2 = e || d(t, this.namespace, this.client.core.projectId);
		if (!i$2) throw new Error(`No RPC url provided for chainId: ${t}`);
		return new o(new f(i$2, h("disableProviderPing")));
	}
};
var ge = Object.defineProperty, Pe = Object.defineProperties, we = Object.getOwnPropertyDescriptors, wt = Object.getOwnPropertySymbols, ye = Object.prototype.hasOwnProperty, be = Object.prototype.propertyIsEnumerable, X = (s, t, e) => t in s ? ge(s, t, {
	enumerable: !0,
	configurable: !0,
	writable: !0,
	value: e
}) : s[t] = e, yt = (s, t) => {
	for (var e in t || (t = {})) ye.call(t, e) && X(s, e, t[e]);
	if (wt) for (var e of wt(t)) be.call(t, e) && X(s, e, t[e]);
	return s;
}, bt = (s, t) => Pe(s, we(t)), A = (s, t, e) => X(s, typeof t != "symbol" ? t + "" : t, e);
var Ie = class {
	constructor(t) {
		A(this, "name", "eip155"), A(this, "client"), A(this, "chainId"), A(this, "namespace"), A(this, "httpProviders"), A(this, "events"), this.namespace = t.namespace, this.events = h("events"), this.client = h("client"), this.httpProviders = this.createHttpProviders(), this.chainId = parseInt(this.getDefaultChain());
	}
	async request(t) {
		switch (t.request.method) {
			case "eth_requestAccounts": return this.getAccounts();
			case "eth_accounts": return this.getAccounts();
			case "wallet_switchEthereumChain": return await this.handleSwitchChain(t);
			case "eth_chainId": return parseInt(this.getDefaultChain());
			case "wallet_getCapabilities": return await this.getCapabilities(t);
			case "wallet_getCallsStatus": return await this.getCallStatus(t);
		}
		return this.namespace.methods.includes(t.request.method) ? await this.client.request(t) : this.getHttpProvider().request(t.request);
	}
	updateNamespace(t) {
		this.namespace = Object.assign(this.namespace, t);
	}
	setDefaultChain(t, e) {
		this.httpProviders[t] || this.setHttpProvider(parseInt(t), e), this.chainId = parseInt(t), this.events.emit(u.DEFAULT_CHAIN_CHANGED, `${this.name}:${t}`);
	}
	requestAccounts() {
		return this.getAccounts();
	}
	getDefaultChain() {
		if (this.chainId) return this.chainId.toString();
		if (this.namespace.defaultChain) return this.namespace.defaultChain;
		const t = this.namespace.chains[0];
		if (!t) throw new Error("ChainId not found");
		return t.split(":")[1];
	}
	createHttpProvider(t, e) {
		const i$2 = e || d(`${this.name}:${t}`, this.namespace, this.client.core.projectId);
		if (!i$2) throw new Error(`No RPC url provided for chainId: ${t}`);
		return new o(new f(i$2, h("disableProviderPing")));
	}
	setHttpProvider(t, e) {
		const i$2 = this.createHttpProvider(t, e);
		i$2 && (this.httpProviders[t] = i$2);
	}
	createHttpProviders() {
		const t = {};
		return this.namespace.chains.forEach((e) => {
			var i$2;
			const n$1 = parseInt(b(e));
			t[n$1] = this.createHttpProvider(n$1, (i$2 = this.namespace.rpcMap) == null ? void 0 : i$2[e]);
		}), t;
	}
	getAccounts() {
		const t = this.namespace.accounts;
		return t ? [...new Set(t.filter((e) => e.split(":")[1] === this.chainId.toString()).map((e) => e.split(":")[2]))] : [];
	}
	getHttpProvider() {
		const t = this.chainId, e = this.httpProviders[t];
		if (typeof e > "u") throw new Error(`JSON-RPC provider for ${t} not found`);
		return e;
	}
	async handleSwitchChain(t) {
		var e, i$2;
		let n$1 = t.request.params ? (e = t.request.params[0]) == null ? void 0 : e.chainId : "0x0";
		n$1 = n$1.startsWith("0x") ? n$1 : `0x${n$1}`;
		const a$1 = parseInt(n$1, 16);
		if (this.isChainApproved(a$1)) this.setDefaultChain(`${a$1}`);
		else if (this.namespace.methods.includes("wallet_switchEthereumChain")) await this.client.request({
			topic: t.topic,
			request: {
				method: t.request.method,
				params: [{ chainId: n$1 }]
			},
			chainId: (i$2 = this.namespace.chains) == null ? void 0 : i$2[0]
		}), this.setDefaultChain(`${a$1}`);
		else throw new Error(`Failed to switch to chain 'eip155:${a$1}'. The chain is not approved or the wallet does not support 'wallet_switchEthereumChain' method.`);
		return null;
	}
	isChainApproved(t) {
		return this.namespace.chains.includes(`${this.name}:${t}`);
	}
	async getCapabilities(t) {
		var e, i$2, n$1, a$1, r$1;
		const c$2 = (i$2 = (e = t.request) == null ? void 0 : e.params) == null ? void 0 : i$2[0], o$1 = ((a$1 = (n$1 = t.request) == null ? void 0 : n$1.params) == null ? void 0 : a$1[1]) || [], m$1 = `${c$2}${o$1.join(",")}`;
		if (!c$2) throw new Error("Missing address parameter in `wallet_getCapabilities` request");
		const w$1 = this.client.session.get(t.topic), v$3 = ((r$1 = w$1?.sessionProperties) == null ? void 0 : r$1.capabilities) || {};
		if (v$3 != null && v$3[m$1]) return v$3?.[m$1];
		const P$2 = await this.client.request(t);
		try {
			await this.client.session.update(t.topic, { sessionProperties: bt(yt({}, w$1.sessionProperties || {}), { capabilities: bt(yt({}, v$3 || {}), { [m$1]: P$2 }) }) });
		} catch (p$2) {
			console.warn("Failed to update session with capabilities", p$2);
		}
		return P$2;
	}
	async getCallStatus(t) {
		var e, i$2;
		const n$1 = this.client.session.get(t.topic), a$1 = (e = n$1.sessionProperties) == null ? void 0 : e.bundler_name;
		if (a$1) {
			const c$2 = this.getBundlerUrl(t.chainId, a$1);
			try {
				return await this.getUserOperationReceipt(c$2, t);
			} catch (o$1) {
				console.warn("Failed to fetch call status from bundler", o$1, c$2);
			}
		}
		const r$1 = (i$2 = n$1.sessionProperties) == null ? void 0 : i$2.bundler_url;
		if (r$1) try {
			return await this.getUserOperationReceipt(r$1, t);
		} catch (c$2) {
			console.warn("Failed to fetch call status from custom bundler", c$2, r$1);
		}
		if (this.namespace.methods.includes(t.request.method)) return await this.client.request(t);
		throw new Error("Fetching call status not approved by the wallet.");
	}
	async getUserOperationReceipt(t, e) {
		var i$2;
		const n$1 = new URL(t), a$1 = await fetch(n$1, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(formatJsonRpcRequest("eth_getUserOperationReceipt", [(i$2 = e.request.params) == null ? void 0 : i$2[0]]))
		});
		if (!a$1.ok) throw new Error(`Failed to fetch user operation receipt - ${a$1.status}`);
		return await a$1.json();
	}
	getBundlerUrl(t, e) {
		return `${jt}?projectId=${this.client.core.projectId}&chainId=${t}&bundler=${e}`;
	}
};
var $e = Object.defineProperty, Oe$1 = (s, t, e) => t in s ? $e(s, t, {
	enumerable: !0,
	configurable: !0,
	writable: !0,
	value: e
}) : s[t] = e, C = (s, t, e) => Oe$1(s, typeof t != "symbol" ? t + "" : t, e);
var Ae = class {
	constructor(t) {
		C(this, "name", "solana"), C(this, "client"), C(this, "httpProviders"), C(this, "events"), C(this, "namespace"), C(this, "chainId"), this.namespace = t.namespace, this.events = h("events"), this.client = h("client"), this.chainId = this.getDefaultChain(), this.httpProviders = this.createHttpProviders();
	}
	updateNamespace(t) {
		this.namespace = Object.assign(this.namespace, t);
	}
	requestAccounts() {
		return this.getAccounts();
	}
	request(t) {
		return this.namespace.methods.includes(t.request.method) ? this.client.request(t) : this.getHttpProvider().request(t.request);
	}
	setDefaultChain(t, e) {
		this.httpProviders[t] || this.setHttpProvider(t, e), this.chainId = t, this.events.emit(u.DEFAULT_CHAIN_CHANGED, `${this.name}:${t}`);
	}
	getDefaultChain() {
		if (this.chainId) return this.chainId;
		if (this.namespace.defaultChain) return this.namespace.defaultChain;
		const t = this.namespace.chains[0];
		if (!t) throw new Error("ChainId not found");
		return t.split(":")[1];
	}
	getAccounts() {
		const t = this.namespace.accounts;
		return t ? [...new Set(t.filter((e) => e.split(":")[1] === this.chainId.toString()).map((e) => e.split(":")[2]))] : [];
	}
	createHttpProviders() {
		const t = {};
		return this.namespace.chains.forEach((e) => {
			var i$2;
			const n$1 = b(e);
			t[n$1] = this.createHttpProvider(n$1, (i$2 = this.namespace.rpcMap) == null ? void 0 : i$2[e]);
		}), t;
	}
	getHttpProvider() {
		const t = `${this.name}:${this.chainId}`, e = this.httpProviders[t];
		if (typeof e > "u") throw new Error(`JSON-RPC provider for ${t} not found`);
		return e;
	}
	setHttpProvider(t, e) {
		const i$2 = this.createHttpProvider(t, e);
		i$2 && (this.httpProviders[t] = i$2);
	}
	createHttpProvider(t, e) {
		const i$2 = e || d(t, this.namespace, this.client.core.projectId);
		if (!i$2) throw new Error(`No RPC url provided for chainId: ${t}`);
		return new o(new f(i$2, h("disableProviderPing")));
	}
};
var Ce = Object.defineProperty, He = (s, t, e) => t in s ? Ce(s, t, {
	enumerable: !0,
	configurable: !0,
	writable: !0,
	value: e
}) : s[t] = e, H = (s, t, e) => He(s, typeof t != "symbol" ? t + "" : t, e);
var Ee$1 = class {
	constructor(t) {
		H(this, "name", "cosmos"), H(this, "client"), H(this, "httpProviders"), H(this, "events"), H(this, "namespace"), H(this, "chainId"), this.namespace = t.namespace, this.events = h("events"), this.client = h("client"), this.chainId = this.getDefaultChain(), this.httpProviders = this.createHttpProviders();
	}
	updateNamespace(t) {
		this.namespace = Object.assign(this.namespace, t);
	}
	requestAccounts() {
		return this.getAccounts();
	}
	getDefaultChain() {
		if (this.chainId) return this.chainId;
		if (this.namespace.defaultChain) return this.namespace.defaultChain;
		const t = this.namespace.chains[0];
		if (!t) throw new Error("ChainId not found");
		return t.split(":")[1];
	}
	request(t) {
		return this.namespace.methods.includes(t.request.method) ? this.client.request(t) : this.getHttpProvider().request(t.request);
	}
	setDefaultChain(t, e) {
		this.httpProviders[t] || this.setHttpProvider(t, e), this.chainId = t, this.events.emit(u.DEFAULT_CHAIN_CHANGED, `${this.name}:${this.chainId}`);
	}
	getAccounts() {
		const t = this.namespace.accounts;
		return t ? [...new Set(t.filter((e) => e.split(":")[1] === this.chainId.toString()).map((e) => e.split(":")[2]))] : [];
	}
	createHttpProviders() {
		const t = {};
		return this.namespace.chains.forEach((e) => {
			var i$2;
			const n$1 = b(e);
			t[n$1] = this.createHttpProvider(n$1, (i$2 = this.namespace.rpcMap) == null ? void 0 : i$2[e]);
		}), t;
	}
	getHttpProvider() {
		const t = `${this.name}:${this.chainId}`, e = this.httpProviders[t];
		if (typeof e > "u") throw new Error(`JSON-RPC provider for ${t} not found`);
		return e;
	}
	setHttpProvider(t, e) {
		const i$2 = this.createHttpProvider(t, e);
		i$2 && (this.httpProviders[t] = i$2);
	}
	createHttpProvider(t, e) {
		const i$2 = e || d(t, this.namespace, this.client.core.projectId);
		if (!i$2) throw new Error(`No RPC url provided for chainId: ${t}`);
		return new o(new f(i$2, h("disableProviderPing")));
	}
};
var Ne$1 = Object.defineProperty, Se = (s, t, e) => t in s ? Ne$1(s, t, {
	enumerable: !0,
	configurable: !0,
	writable: !0,
	value: e
}) : s[t] = e, E = (s, t, e) => Se(s, typeof t != "symbol" ? t + "" : t, e);
var De = class {
	constructor(t) {
		E(this, "name", "algorand"), E(this, "client"), E(this, "httpProviders"), E(this, "events"), E(this, "namespace"), E(this, "chainId"), this.namespace = t.namespace, this.events = h("events"), this.client = h("client"), this.chainId = this.getDefaultChain(), this.httpProviders = this.createHttpProviders();
	}
	updateNamespace(t) {
		this.namespace = Object.assign(this.namespace, t);
	}
	requestAccounts() {
		return this.getAccounts();
	}
	request(t) {
		return this.namespace.methods.includes(t.request.method) ? this.client.request(t) : this.getHttpProvider().request(t.request);
	}
	setDefaultChain(t, e) {
		if (!this.httpProviders[t]) {
			const i$2 = e || d(`${this.name}:${t}`, this.namespace, this.client.core.projectId);
			if (!i$2) throw new Error(`No RPC url provided for chainId: ${t}`);
			this.setHttpProvider(t, i$2);
		}
		this.chainId = t, this.events.emit(u.DEFAULT_CHAIN_CHANGED, `${this.name}:${this.chainId}`);
	}
	getDefaultChain() {
		if (this.chainId) return this.chainId;
		if (this.namespace.defaultChain) return this.namespace.defaultChain;
		const t = this.namespace.chains[0];
		if (!t) throw new Error("ChainId not found");
		return t.split(":")[1];
	}
	getAccounts() {
		const t = this.namespace.accounts;
		return t ? [...new Set(t.filter((e) => e.split(":")[1] === this.chainId.toString()).map((e) => e.split(":")[2]))] : [];
	}
	createHttpProviders() {
		const t = {};
		return this.namespace.chains.forEach((e) => {
			var i$2;
			t[e] = this.createHttpProvider(e, (i$2 = this.namespace.rpcMap) == null ? void 0 : i$2[e]);
		}), t;
	}
	getHttpProvider() {
		const t = `${this.name}:${this.chainId}`, e = this.httpProviders[t];
		if (typeof e > "u") throw new Error(`JSON-RPC provider for ${t} not found`);
		return e;
	}
	setHttpProvider(t, e) {
		const i$2 = this.createHttpProvider(t, e);
		i$2 && (this.httpProviders[t] = i$2);
	}
	createHttpProvider(t, e) {
		const i$2 = e || d(t, this.namespace, this.client.core.projectId);
		return typeof i$2 > "u" ? void 0 : new o(new f(i$2, h("disableProviderPing")));
	}
};
var qe = Object.defineProperty, je = (s, t, e) => t in s ? qe(s, t, {
	enumerable: !0,
	configurable: !0,
	writable: !0,
	value: e
}) : s[t] = e, N = (s, t, e) => je(s, typeof t != "symbol" ? t + "" : t, e);
var Re = class {
	constructor(t) {
		N(this, "name", "cip34"), N(this, "client"), N(this, "httpProviders"), N(this, "events"), N(this, "namespace"), N(this, "chainId"), this.namespace = t.namespace, this.events = h("events"), this.client = h("client"), this.chainId = this.getDefaultChain(), this.httpProviders = this.createHttpProviders();
	}
	updateNamespace(t) {
		this.namespace = Object.assign(this.namespace, t);
	}
	requestAccounts() {
		return this.getAccounts();
	}
	getDefaultChain() {
		if (this.chainId) return this.chainId;
		if (this.namespace.defaultChain) return this.namespace.defaultChain;
		const t = this.namespace.chains[0];
		if (!t) throw new Error("ChainId not found");
		return t.split(":")[1];
	}
	request(t) {
		return this.namespace.methods.includes(t.request.method) ? this.client.request(t) : this.getHttpProvider().request(t.request);
	}
	setDefaultChain(t, e) {
		this.httpProviders[t] || this.setHttpProvider(t, e), this.chainId = t, this.events.emit(u.DEFAULT_CHAIN_CHANGED, `${this.name}:${this.chainId}`);
	}
	getAccounts() {
		const t = this.namespace.accounts;
		return t ? [...new Set(t.filter((e) => e.split(":")[1] === this.chainId.toString()).map((e) => e.split(":")[2]))] : [];
	}
	createHttpProviders() {
		const t = {};
		return this.namespace.chains.forEach((e) => {
			const i$2 = this.getCardanoRPCUrl(e), n$1 = b(e);
			t[n$1] = this.createHttpProvider(n$1, i$2);
		}), t;
	}
	getHttpProvider() {
		const t = `${this.name}:${this.chainId}`, e = this.httpProviders[t];
		if (typeof e > "u") throw new Error(`JSON-RPC provider for ${t} not found`);
		return e;
	}
	getCardanoRPCUrl(t) {
		const e = this.namespace.rpcMap;
		if (e) return e[t];
	}
	setHttpProvider(t, e) {
		const i$2 = this.createHttpProvider(t, e);
		i$2 && (this.httpProviders[t] = i$2);
	}
	createHttpProvider(t, e) {
		const i$2 = e || this.getCardanoRPCUrl(t);
		if (!i$2) throw new Error(`No RPC url provided for chainId: ${t}`);
		return new o(new f(i$2, h("disableProviderPing")));
	}
};
var _e = Object.defineProperty, Ue = (s, t, e) => t in s ? _e(s, t, {
	enumerable: !0,
	configurable: !0,
	writable: !0,
	value: e
}) : s[t] = e, S = (s, t, e) => Ue(s, typeof t != "symbol" ? t + "" : t, e);
var Fe = class {
	constructor(t) {
		S(this, "name", "elrond"), S(this, "client"), S(this, "httpProviders"), S(this, "events"), S(this, "namespace"), S(this, "chainId"), this.namespace = t.namespace, this.events = h("events"), this.client = h("client"), this.chainId = this.getDefaultChain(), this.httpProviders = this.createHttpProviders();
	}
	updateNamespace(t) {
		this.namespace = Object.assign(this.namespace, t);
	}
	requestAccounts() {
		return this.getAccounts();
	}
	request(t) {
		return this.namespace.methods.includes(t.request.method) ? this.client.request(t) : this.getHttpProvider().request(t.request);
	}
	setDefaultChain(t, e) {
		this.httpProviders[t] || this.setHttpProvider(t, e), this.chainId = t, this.events.emit(u.DEFAULT_CHAIN_CHANGED, `${this.name}:${t}`);
	}
	getDefaultChain() {
		if (this.chainId) return this.chainId;
		if (this.namespace.defaultChain) return this.namespace.defaultChain;
		const t = this.namespace.chains[0];
		if (!t) throw new Error("ChainId not found");
		return t.split(":")[1];
	}
	getAccounts() {
		const t = this.namespace.accounts;
		return t ? [...new Set(t.filter((e) => e.split(":")[1] === this.chainId.toString()).map((e) => e.split(":")[2]))] : [];
	}
	createHttpProviders() {
		const t = {};
		return this.namespace.chains.forEach((e) => {
			var i$2;
			const n$1 = b(e);
			t[n$1] = this.createHttpProvider(n$1, (i$2 = this.namespace.rpcMap) == null ? void 0 : i$2[e]);
		}), t;
	}
	getHttpProvider() {
		const t = `${this.name}:${this.chainId}`, e = this.httpProviders[t];
		if (typeof e > "u") throw new Error(`JSON-RPC provider for ${t} not found`);
		return e;
	}
	setHttpProvider(t, e) {
		const i$2 = this.createHttpProvider(t, e);
		i$2 && (this.httpProviders[t] = i$2);
	}
	createHttpProvider(t, e) {
		const i$2 = e || d(t, this.namespace, this.client.core.projectId);
		if (!i$2) throw new Error(`No RPC url provided for chainId: ${t}`);
		return new o(new f(i$2, h("disableProviderPing")));
	}
};
var Le = Object.defineProperty, Me = (s, t, e) => t in s ? Le(s, t, {
	enumerable: !0,
	configurable: !0,
	writable: !0,
	value: e
}) : s[t] = e, D = (s, t, e) => Me(s, typeof t != "symbol" ? t + "" : t, e);
var xe = class {
	constructor(t) {
		D(this, "name", "multiversx"), D(this, "client"), D(this, "httpProviders"), D(this, "events"), D(this, "namespace"), D(this, "chainId"), this.namespace = t.namespace, this.events = h("events"), this.client = h("client"), this.chainId = this.getDefaultChain(), this.httpProviders = this.createHttpProviders();
	}
	updateNamespace(t) {
		this.namespace = Object.assign(this.namespace, t);
	}
	requestAccounts() {
		return this.getAccounts();
	}
	request(t) {
		return this.namespace.methods.includes(t.request.method) ? this.client.request(t) : this.getHttpProvider().request(t.request);
	}
	setDefaultChain(t, e) {
		this.httpProviders[t] || this.setHttpProvider(t, e), this.chainId = t, this.events.emit(u.DEFAULT_CHAIN_CHANGED, `${this.name}:${t}`);
	}
	getDefaultChain() {
		if (this.chainId) return this.chainId;
		if (this.namespace.defaultChain) return this.namespace.defaultChain;
		const t = this.namespace.chains[0];
		if (!t) throw new Error("ChainId not found");
		return t.split(":")[1];
	}
	getAccounts() {
		const t = this.namespace.accounts;
		return t ? [...new Set(t.filter((e) => e.split(":")[1] === this.chainId.toString()).map((e) => e.split(":")[2]))] : [];
	}
	createHttpProviders() {
		const t = {};
		return this.namespace.chains.forEach((e) => {
			var i$2;
			const n$1 = b(e);
			t[n$1] = this.createHttpProvider(n$1, (i$2 = this.namespace.rpcMap) == null ? void 0 : i$2[e]);
		}), t;
	}
	getHttpProvider() {
		const t = `${this.name}:${this.chainId}`, e = this.httpProviders[t];
		if (typeof e > "u") throw new Error(`JSON-RPC provider for ${t} not found`);
		return e;
	}
	setHttpProvider(t, e) {
		const i$2 = this.createHttpProvider(t, e);
		i$2 && (this.httpProviders[t] = i$2);
	}
	createHttpProvider(t, e) {
		const i$2 = e || d(t, this.namespace, this.client.core.projectId);
		if (!i$2) throw new Error(`No RPC url provided for chainId: ${t}`);
		return new o(new f(i$2, h("disableProviderPing")));
	}
};
var Be = Object.defineProperty, Ge = (s, t, e) => t in s ? Be(s, t, {
	enumerable: !0,
	configurable: !0,
	writable: !0,
	value: e
}) : s[t] = e, q = (s, t, e) => Ge(s, typeof t != "symbol" ? t + "" : t, e);
var Je = class {
	constructor(t) {
		q(this, "name", "near"), q(this, "client"), q(this, "httpProviders"), q(this, "events"), q(this, "namespace"), q(this, "chainId"), this.namespace = t.namespace, this.events = h("events"), this.client = h("client"), this.chainId = this.getDefaultChain(), this.httpProviders = this.createHttpProviders();
	}
	updateNamespace(t) {
		this.namespace = Object.assign(this.namespace, t);
	}
	requestAccounts() {
		return this.getAccounts();
	}
	getDefaultChain() {
		if (this.chainId) return this.chainId;
		if (this.namespace.defaultChain) return this.namespace.defaultChain;
		const t = this.namespace.chains[0];
		if (!t) throw new Error("ChainId not found");
		return t.split(":")[1];
	}
	request(t) {
		return this.namespace.methods.includes(t.request.method) ? this.client.request(t) : this.getHttpProvider().request(t.request);
	}
	setDefaultChain(t, e) {
		if (this.chainId = t, !this.httpProviders[t]) {
			const i$2 = e || d(`${this.name}:${t}`, this.namespace);
			if (!i$2) throw new Error(`No RPC url provided for chainId: ${t}`);
			this.setHttpProvider(t, i$2);
		}
		this.events.emit(u.DEFAULT_CHAIN_CHANGED, `${this.name}:${this.chainId}`);
	}
	getAccounts() {
		const t = this.namespace.accounts;
		return t ? t.filter((e) => e.split(":")[1] === this.chainId.toString()).map((e) => e.split(":")[2]) || [] : [];
	}
	createHttpProviders() {
		const t = {};
		return this.namespace.chains.forEach((e) => {
			var i$2;
			t[e] = this.createHttpProvider(e, (i$2 = this.namespace.rpcMap) == null ? void 0 : i$2[e]);
		}), t;
	}
	getHttpProvider() {
		const t = `${this.name}:${this.chainId}`, e = this.httpProviders[t];
		if (typeof e > "u") throw new Error(`JSON-RPC provider for ${t} not found`);
		return e;
	}
	setHttpProvider(t, e) {
		const i$2 = this.createHttpProvider(t, e);
		i$2 && (this.httpProviders[t] = i$2);
	}
	createHttpProvider(t, e) {
		const i$2 = e || d(t, this.namespace);
		return typeof i$2 > "u" ? void 0 : new o(new f(i$2, h("disableProviderPing")));
	}
};
var ze = Object.defineProperty, ke = (s, t, e) => t in s ? ze(s, t, {
	enumerable: !0,
	configurable: !0,
	writable: !0,
	value: e
}) : s[t] = e, j = (s, t, e) => ke(s, typeof t != "symbol" ? t + "" : t, e);
var We = class {
	constructor(t) {
		j(this, "name", "tezos"), j(this, "client"), j(this, "httpProviders"), j(this, "events"), j(this, "namespace"), j(this, "chainId"), this.namespace = t.namespace, this.events = h("events"), this.client = h("client"), this.chainId = this.getDefaultChain(), this.httpProviders = this.createHttpProviders();
	}
	updateNamespace(t) {
		this.namespace = Object.assign(this.namespace, t);
	}
	requestAccounts() {
		return this.getAccounts();
	}
	getDefaultChain() {
		if (this.chainId) return this.chainId;
		if (this.namespace.defaultChain) return this.namespace.defaultChain;
		const t = this.namespace.chains[0];
		if (!t) throw new Error("ChainId not found");
		return t.split(":")[1];
	}
	request(t) {
		return this.namespace.methods.includes(t.request.method) ? this.client.request(t) : this.getHttpProvider().request(t.request);
	}
	setDefaultChain(t, e) {
		if (this.chainId = t, !this.httpProviders[t]) {
			const i$2 = e || d(`${this.name}:${t}`, this.namespace);
			if (!i$2) throw new Error(`No RPC url provided for chainId: ${t}`);
			this.setHttpProvider(t, i$2);
		}
		this.events.emit(u.DEFAULT_CHAIN_CHANGED, `${this.name}:${this.chainId}`);
	}
	getAccounts() {
		const t = this.namespace.accounts;
		return t ? t.filter((e) => e.split(":")[1] === this.chainId.toString()).map((e) => e.split(":")[2]) || [] : [];
	}
	createHttpProviders() {
		const t = {};
		return this.namespace.chains.forEach((e) => {
			t[e] = this.createHttpProvider(e);
		}), t;
	}
	getHttpProvider() {
		const t = `${this.name}:${this.chainId}`, e = this.httpProviders[t];
		if (typeof e > "u") throw new Error(`JSON-RPC provider for ${t} not found`);
		return e;
	}
	setHttpProvider(t, e) {
		const i$2 = this.createHttpProvider(t, e);
		i$2 && (this.httpProviders[t] = i$2);
	}
	createHttpProvider(t, e) {
		const i$2 = e || d(t, this.namespace);
		return typeof i$2 > "u" ? void 0 : new o(new f(i$2));
	}
};
var Ke = Object.defineProperty, Ve = (s, t, e) => t in s ? Ke(s, t, {
	enumerable: !0,
	configurable: !0,
	writable: !0,
	value: e
}) : s[t] = e, R = (s, t, e) => Ve(s, typeof t != "symbol" ? t + "" : t, e);
var Xe = class {
	constructor(t) {
		R(this, "name", I), R(this, "client"), R(this, "httpProviders"), R(this, "events"), R(this, "namespace"), R(this, "chainId"), this.namespace = t.namespace, this.events = h("events"), this.client = h("client"), this.chainId = this.getDefaultChain(), this.httpProviders = this.createHttpProviders();
	}
	updateNamespace(t) {
		this.namespace.chains = [...new Set((this.namespace.chains || []).concat(t.chains || []))], this.namespace.accounts = [...new Set((this.namespace.accounts || []).concat(t.accounts || []))], this.namespace.methods = [...new Set((this.namespace.methods || []).concat(t.methods || []))], this.namespace.events = [...new Set((this.namespace.events || []).concat(t.events || []))], this.httpProviders = this.createHttpProviders();
	}
	requestAccounts() {
		return this.getAccounts();
	}
	request(t) {
		return this.namespace.methods.includes(t.request.method) ? this.client.request(t) : this.getHttpProvider(t.chainId).request(t.request);
	}
	setDefaultChain(t, e) {
		this.httpProviders[t] || this.setHttpProvider(t, e), this.chainId = t, this.events.emit(u.DEFAULT_CHAIN_CHANGED, `${this.name}:${t}`);
	}
	getDefaultChain() {
		if (this.chainId) return this.chainId;
		if (this.namespace.defaultChain) return this.namespace.defaultChain;
		const t = this.namespace.chains[0];
		if (!t) throw new Error("ChainId not found");
		return t.split(":")[1];
	}
	getAccounts() {
		const t = this.namespace.accounts;
		return t ? [...new Set(t.filter((e) => e.split(":")[1] === this.chainId.toString()).map((e) => e.split(":")[2]))] : [];
	}
	createHttpProviders() {
		var t, e;
		const i$2 = {};
		return (e = (t = this.namespace) == null ? void 0 : t.accounts) == null || e.forEach((n$1) => {
			const a$1 = Ne(n$1);
			i$2[`${a$1.namespace}:${a$1.reference}`] = this.createHttpProvider(n$1);
		}), i$2;
	}
	getHttpProvider(t) {
		const e = this.httpProviders[t];
		if (typeof e > "u") throw new Error(`JSON-RPC provider for ${t} not found`);
		return e;
	}
	setHttpProvider(t, e) {
		const i$2 = this.createHttpProvider(t, e);
		i$2 && (this.httpProviders[t] = i$2);
	}
	createHttpProvider(t, e) {
		const i$2 = e || d(t, this.namespace, this.client.core.projectId);
		if (!i$2) throw new Error(`No RPC url provided for chainId: ${t}`);
		return new o(new f(i$2, h("disableProviderPing")));
	}
};
var Ye = Object.defineProperty, Qe = Object.defineProperties, Ze = Object.getOwnPropertyDescriptors, It = Object.getOwnPropertySymbols, Te = Object.prototype.hasOwnProperty, ts = Object.prototype.propertyIsEnumerable, Y = (s, t, e) => t in s ? Ye(s, t, {
	enumerable: !0,
	configurable: !0,
	writable: !0,
	value: e
}) : s[t] = e, x = (s, t) => {
	for (var e in t || (t = {})) Te.call(t, e) && Y(s, e, t[e]);
	if (It) for (var e of It(t)) ts.call(t, e) && Y(s, e, t[e]);
	return s;
}, Q = (s, t) => Qe(s, Ze(t)), l = (s, t, e) => Y(s, typeof t != "symbol" ? t + "" : t, e);
var B = class B {
	constructor(t) {
		l(this, "client"), l(this, "namespaces"), l(this, "optionalNamespaces"), l(this, "sessionProperties"), l(this, "scopedProperties"), l(this, "events", new import_events.default()), l(this, "rpcProviders", {}), l(this, "session"), l(this, "providerOpts"), l(this, "logger"), l(this, "uri"), l(this, "disableProviderPing", !1), this.providerOpts = t, this.logger = typeof t?.logger < "u" && typeof t?.logger != "string" ? t.logger : (0, import_browser.default)(k({ level: t?.logger || "error" })), this.disableProviderPing = t?.disableProviderPing || !1;
	}
	static async init(t) {
		const e = new B(t);
		return await e.initialize(), e;
	}
	async request(t, e, i$2) {
		const [n$1, a$1] = this.validateChain(e);
		if (!this.session) throw new Error("Please call connect() before request()");
		return await this.getProvider(n$1).request({
			request: x({}, t),
			chainId: `${n$1}:${a$1}`,
			topic: this.session.topic,
			expiry: i$2
		});
	}
	sendAsync(t, e, i$2, n$1) {
		const a$1 = (/* @__PURE__ */ new Date()).getTime();
		this.request(t, i$2, n$1).then((r$1) => e(null, formatJsonRpcResult(a$1, r$1))).catch((r$1) => e(r$1, void 0));
	}
	async enable() {
		if (!this.client) throw new Error("Sign Client not initialized");
		return this.session || await this.connect({
			namespaces: this.namespaces,
			optionalNamespaces: this.optionalNamespaces,
			sessionProperties: this.sessionProperties,
			scopedProperties: this.scopedProperties
		}), await this.requestAccounts();
	}
	async disconnect() {
		var t;
		if (!this.session) throw new Error("Please call connect() before enable()");
		await this.client.disconnect({
			topic: (t = this.session) == null ? void 0 : t.topic,
			reason: Nt("USER_DISCONNECTED")
		}), await this.cleanup();
	}
	async connect(t) {
		if (!this.client) throw new Error("Sign Client not initialized");
		if (this.setNamespaces(t), await this.cleanupPendingPairings(), !t.skipPairing) return await this.pair(t.pairingTopic);
	}
	async authenticate(t, e) {
		if (!this.client) throw new Error("Sign Client not initialized");
		this.setNamespaces(t), await this.cleanupPendingPairings();
		const { uri: i$2, response: n$1 } = await this.client.authenticate(t, e);
		i$2 && (this.uri = i$2, this.events.emit("display_uri", i$2));
		const a$1 = await n$1();
		if (this.session = a$1.session, this.session) {
			const r$1 = gt(this.session.namespaces);
			this.namespaces = M(this.namespaces, r$1), await this.persist("namespaces", this.namespaces), this.onConnect();
		}
		return a$1;
	}
	on(t, e) {
		this.events.on(t, e);
	}
	once(t, e) {
		this.events.once(t, e);
	}
	removeListener(t, e) {
		this.events.removeListener(t, e);
	}
	off(t, e) {
		this.events.off(t, e);
	}
	get isWalletConnect() {
		return !0;
	}
	async pair(t) {
		const { uri: e, approval: i$2 } = await this.client.connect({
			pairingTopic: t,
			requiredNamespaces: this.namespaces,
			optionalNamespaces: this.optionalNamespaces,
			sessionProperties: this.sessionProperties,
			scopedProperties: this.scopedProperties
		});
		e && (this.uri = e, this.events.emit("display_uri", e));
		const n$1 = await i$2();
		this.session = n$1;
		const a$1 = gt(n$1.namespaces);
		return this.namespaces = M(this.namespaces, a$1), await this.persist("namespaces", this.namespaces), await this.persist("optionalNamespaces", this.optionalNamespaces), this.onConnect(), this.session;
	}
	setDefaultChain(t, e) {
		try {
			if (!this.session) return;
			const [i$2, n$1] = this.validateChain(t), a$1 = this.getProvider(i$2);
			a$1.name === "generic" ? a$1.setDefaultChain(`${i$2}:${n$1}`, e) : a$1.setDefaultChain(n$1, e);
		} catch (i$2) {
			if (!/Please call connect/.test(i$2.message)) throw i$2;
		}
	}
	async cleanupPendingPairings(t = {}) {
		this.logger.info("Cleaning up inactive pairings...");
		const e = this.client.pairing.getAll();
		if (se(e)) {
			for (const i$2 of e) t.deletePairings ? this.client.core.expirer.set(i$2.topic, 0) : await this.client.core.relayer.subscriber.unsubscribe(i$2.topic);
			this.logger.info(`Inactive pairings cleared: ${e.length}`);
		}
	}
	abortPairingAttempt() {
		this.logger.warn("abortPairingAttempt is deprecated. This is now a no-op.");
	}
	async checkStorage() {
		this.namespaces = await this.getFromStore("namespaces") || {}, this.optionalNamespaces = await this.getFromStore("optionalNamespaces") || {}, this.session && this.createProviders();
	}
	async initialize() {
		this.logger.trace("Initialized"), await this.createClient(), await this.checkStorage(), this.registerEventListeners();
	}
	async createClient() {
		var t, e;
		if (this.client = this.providerOpts.client || await Ee.init({
			core: this.providerOpts.core,
			logger: this.providerOpts.logger || "error",
			relayUrl: this.providerOpts.relayUrl || "wss://relay.walletconnect.org",
			projectId: this.providerOpts.projectId,
			metadata: this.providerOpts.metadata,
			storageOptions: this.providerOpts.storageOptions,
			storage: this.providerOpts.storage,
			name: this.providerOpts.name,
			customStoragePrefix: this.providerOpts.customStoragePrefix,
			telemetryEnabled: this.providerOpts.telemetryEnabled
		}), this.providerOpts.session) try {
			this.session = this.client.session.get(this.providerOpts.session.topic);
		} catch (i$2) {
			throw this.logger.error("Failed to get session", i$2), /* @__PURE__ */ new Error(`The provided session: ${(e = (t = this.providerOpts) == null ? void 0 : t.session) == null ? void 0 : e.topic} doesn't exist in the Sign client`);
		}
		else this.session = this.client.session.getAll()[0];
		this.logger.trace("SignClient Initialized");
	}
	createProviders() {
		if (!this.client) throw new Error("Sign Client not initialized");
		if (!this.session) throw new Error("Session not initialized. Please call connect() before enable()");
		const t = [...new Set(Object.keys(this.session.namespaces).map((e) => yo(e)))];
		V("client", this.client), V("events", this.events), V("disableProviderPing", this.disableProviderPing), t.forEach((e) => {
			if (!this.session) return;
			const i$2 = le(e, this.session), n$1 = ft(i$2), a$1 = M(this.namespaces, this.optionalNamespaces), r$1 = Q(x({}, a$1[e]), {
				accounts: i$2,
				chains: n$1
			});
			switch (e) {
				case "eip155":
					this.rpcProviders[e] = new Ie({ namespace: r$1 });
					break;
				case "algorand":
					this.rpcProviders[e] = new De({ namespace: r$1 });
					break;
				case "solana":
					this.rpcProviders[e] = new Ae({ namespace: r$1 });
					break;
				case "cosmos":
					this.rpcProviders[e] = new Ee$1({ namespace: r$1 });
					break;
				case "polkadot":
					this.rpcProviders[e] = new ve({ namespace: r$1 });
					break;
				case "cip34":
					this.rpcProviders[e] = new Re({ namespace: r$1 });
					break;
				case "elrond":
					this.rpcProviders[e] = new Fe({ namespace: r$1 });
					break;
				case "multiversx":
					this.rpcProviders[e] = new xe({ namespace: r$1 });
					break;
				case "near":
					this.rpcProviders[e] = new Je({ namespace: r$1 });
					break;
				case "tezos":
					this.rpcProviders[e] = new We({ namespace: r$1 });
					break;
				default: this.rpcProviders["generic"] ? this.rpcProviders[I].updateNamespace(r$1) : this.rpcProviders[I] = new Xe({ namespace: r$1 });
			}
		});
	}
	registerEventListeners() {
		if (typeof this.client > "u") throw new Error("Sign Client is not initialized");
		this.client.on("session_ping", (t) => {
			var e;
			const { topic: i$2 } = t;
			i$2 === ((e = this.session) == null ? void 0 : e.topic) && this.events.emit("session_ping", t);
		}), this.client.on("session_event", (t) => {
			var e;
			const { params: i$2, topic: n$1 } = t;
			if (n$1 !== ((e = this.session) == null ? void 0 : e.topic)) return;
			const { event: a$1 } = i$2;
			if (a$1.name === "accountsChanged") {
				const r$1 = a$1.data;
				r$1 && se(r$1) && this.events.emit("accountsChanged", r$1.map(vt));
			} else if (a$1.name === "chainChanged") {
				const r$1 = i$2.chainId, c$2 = i$2.event.data, o$1 = yo(r$1), m$1 = K(r$1) !== K(c$2) ? `${o$1}:${K(c$2)}` : r$1;
				this.onChainChanged(m$1);
			} else this.events.emit(a$1.name, a$1.data);
			this.events.emit("session_event", t);
		}), this.client.on("session_update", ({ topic: t, params: e }) => {
			var i$2, n$1;
			if (t !== ((i$2 = this.session) == null ? void 0 : i$2.topic)) return;
			const { namespaces: a$1 } = e, r$1 = (n$1 = this.client) == null ? void 0 : n$1.session.get(t);
			this.session = Q(x({}, r$1), { namespaces: a$1 }), this.onSessionUpdate(), this.events.emit("session_update", {
				topic: t,
				params: e
			});
		}), this.client.on("session_delete", async (t) => {
			var e;
			t.topic === ((e = this.session) == null ? void 0 : e.topic) && (await this.cleanup(), this.events.emit("session_delete", t), this.events.emit("disconnect", Q(x({}, Nt("USER_DISCONNECTED")), { data: t.topic })));
		}), this.on(u.DEFAULT_CHAIN_CHANGED, (t) => {
			this.onChainChanged(t, !0);
		});
	}
	getProvider(t) {
		return this.rpcProviders[t] || this.rpcProviders["generic"];
	}
	onSessionUpdate() {
		Object.keys(this.rpcProviders).forEach((t) => {
			var e;
			this.getProvider(t).updateNamespace((e = this.session) == null ? void 0 : e.namespaces[t]);
		});
	}
	setNamespaces(t) {
		const { namespaces: e = {}, optionalNamespaces: i$2 = {}, sessionProperties: n$1, scopedProperties: a$1 } = t;
		this.optionalNamespaces = M(e, i$2), this.sessionProperties = n$1, this.scopedProperties = a$1;
	}
	validateChain(t) {
		const [e, i$2] = t?.split(":") || ["", ""];
		if (!this.namespaces || !Object.keys(this.namespaces).length) return [e, i$2];
		if (e && !Object.keys(this.namespaces || {}).map((r$1) => yo(r$1)).includes(e)) throw new Error(`Namespace '${e}' is not configured. Please call connect() first with namespace config.`);
		if (e && i$2) return [e, i$2];
		const n$1 = yo(Object.keys(this.namespaces)[0]), a$1 = this.rpcProviders[n$1].getDefaultChain();
		return [n$1, a$1];
	}
	async requestAccounts() {
		const [t] = this.validateChain();
		return await this.getProvider(t).requestAccounts();
	}
	async onChainChanged(t, e = !1) {
		if (!this.namespaces) return;
		const [i$2, n$1] = this.validateChain(t);
		if (!n$1) return;
		this.updateNamespaceChain(i$2, n$1), this.events.emit("chainChanged", n$1);
		const a$1 = this.getProvider(i$2).getDefaultChain();
		e || this.getProvider(i$2).setDefaultChain(n$1), this.emitAccountsChangedOnChainChange({
			namespace: i$2,
			previousChainId: a$1,
			newChainId: t
		}), await this.persist("namespaces", this.namespaces);
	}
	emitAccountsChangedOnChainChange({ namespace: t, previousChainId: e, newChainId: i$2 }) {
		var n$1, a$1;
		try {
			if (e === i$2) return;
			const r$1 = (a$1 = (n$1 = this.session) == null ? void 0 : n$1.namespaces[t]) == null ? void 0 : a$1.accounts;
			if (!r$1) return;
			const c$2 = r$1.filter((o$1) => o$1.includes(`${i$2}:`)).map(vt);
			if (!se(c$2)) return;
			this.events.emit("accountsChanged", c$2);
		} catch (r$1) {
			this.logger.warn("Failed to emit accountsChanged on chain change", r$1);
		}
	}
	updateNamespaceChain(t, e) {
		if (!this.namespaces) return;
		const i$2 = this.namespaces[t] ? t : `${t}:${e}`, n$1 = {
			chains: [],
			methods: [],
			events: [],
			defaultChain: e
		};
		this.namespaces[i$2] ? this.namespaces[i$2] && (this.namespaces[i$2].defaultChain = e) : this.namespaces[i$2] = n$1;
	}
	onConnect() {
		this.createProviders(), this.events.emit("connect", { session: this.session });
	}
	async cleanup() {
		this.namespaces = void 0, this.optionalNamespaces = void 0, this.sessionProperties = void 0, await this.deleteFromStore("namespaces"), await this.deleteFromStore("optionalNamespaces"), await this.deleteFromStore("sessionProperties"), this.session = void 0, await this.cleanupPendingPairings({ deletePairings: !0 }), await this.cleanupStorage();
	}
	async persist(t, e) {
		var i$2;
		const n$1 = ((i$2 = this.session) == null ? void 0 : i$2.topic) || "";
		await this.client.core.storage.setItem(`${U}/${t}${n$1}`, e);
	}
	async getFromStore(t) {
		var e;
		const i$2 = ((e = this.session) == null ? void 0 : e.topic) || "";
		return await this.client.core.storage.getItem(`${U}/${t}${i$2}`);
	}
	async deleteFromStore(t) {
		var e;
		const i$2 = ((e = this.session) == null ? void 0 : e.topic) || "";
		await this.client.core.storage.removeItem(`${U}/${t}${i$2}`);
	}
	async cleanupStorage() {
		var t;
		try {
			if (((t = this.client) == null ? void 0 : t.session.length) > 0) return;
			const e = await this.client.core.storage.getKeys();
			for (const i$2 of e) i$2.startsWith(U) && await this.client.core.storage.removeItem(i$2);
		} catch (e) {
			this.logger.warn("Failed to cleanup storage", e);
		}
	}
};
function checkNamespaceConnectorId(namespace, connectorId) {
	return ConnectorController.getConnectorId(namespace) === connectorId;
}
function getChainsToDisconnect(namespace) {
	const namespaces = Array.from(ChainController.state.chains.keys());
	let chains = [];
	if (namespace) {
		chains.push([namespace, ChainController.state.chains.get(namespace)]);
		if (checkNamespaceConnectorId(namespace, ConstantsUtil.CONNECTOR_ID.WALLET_CONNECT)) namespaces.forEach((ns$1) => {
			if (ns$1 !== namespace && checkNamespaceConnectorId(ns$1, ConstantsUtil.CONNECTOR_ID.WALLET_CONNECT)) chains.push([ns$1, ChainController.state.chains.get(ns$1)]);
		});
		else if (checkNamespaceConnectorId(namespace, ConstantsUtil.CONNECTOR_ID.AUTH)) namespaces.forEach((ns$1) => {
			if (ns$1 !== namespace && checkNamespaceConnectorId(ns$1, ConstantsUtil.CONNECTOR_ID.AUTH)) chains.push([ns$1, ChainController.state.chains.get(ns$1)]);
		});
	} else chains = Array.from(ChainController.state.chains.entries());
	return chains;
}
function isHex(value, { strict = true } = {}) {
	if (!value) return false;
	if (typeof value !== "string") return false;
	return strict ? /^0x[0-9a-fA-F]*$/.test(value) : value.startsWith("0x");
}
function size(value) {
	if (isHex(value, { strict: false })) return Math.ceil((value.length - 2) / 2);
	return value.length;
}
const version = "2.37.6";
var errorConfig = {
	getDocsUrl: ({ docsBaseUrl, docsPath = "", docsSlug }) => docsPath ? `${docsBaseUrl ?? "https://viem.sh"}${docsPath}${docsSlug ? `#${docsSlug}` : ""}` : void 0,
	version: `viem@${version}`
};
var BaseError = class BaseError extends Error {
	constructor(shortMessage, args = {}) {
		const details = (() => {
			if (args.cause instanceof BaseError) return args.cause.details;
			if (args.cause?.message) return args.cause.message;
			return args.details;
		})();
		const docsPath = (() => {
			if (args.cause instanceof BaseError) return args.cause.docsPath || args.docsPath;
			return args.docsPath;
		})();
		const docsUrl = errorConfig.getDocsUrl?.({
			...args,
			docsPath
		});
		const message = [
			shortMessage || "An error occurred.",
			"",
			...args.metaMessages ? [...args.metaMessages, ""] : [],
			...docsUrl ? [`Docs: ${docsUrl}`] : [],
			...details ? [`Details: ${details}`] : [],
			...errorConfig.version ? [`Version: ${errorConfig.version}`] : []
		].join("\n");
		super(message, args.cause ? { cause: args.cause } : void 0);
		Object.defineProperty(this, "details", {
			enumerable: true,
			configurable: true,
			writable: true,
			value: void 0
		});
		Object.defineProperty(this, "docsPath", {
			enumerable: true,
			configurable: true,
			writable: true,
			value: void 0
		});
		Object.defineProperty(this, "metaMessages", {
			enumerable: true,
			configurable: true,
			writable: true,
			value: void 0
		});
		Object.defineProperty(this, "shortMessage", {
			enumerable: true,
			configurable: true,
			writable: true,
			value: void 0
		});
		Object.defineProperty(this, "version", {
			enumerable: true,
			configurable: true,
			writable: true,
			value: void 0
		});
		Object.defineProperty(this, "name", {
			enumerable: true,
			configurable: true,
			writable: true,
			value: "BaseError"
		});
		this.details = details;
		this.docsPath = docsPath;
		this.metaMessages = args.metaMessages;
		this.name = args.name ?? this.name;
		this.shortMessage = shortMessage;
		this.version = version;
	}
	walk(fn$2) {
		return walk(this, fn$2);
	}
};
function walk(err, fn$2) {
	if (fn$2?.(err)) return err;
	if (err && typeof err === "object" && "cause" in err && err.cause !== void 0) return walk(err.cause, fn$2);
	return fn$2 ? null : err;
}
var SizeExceedsPaddingSizeError = class extends BaseError {
	constructor({ size: size$4, targetSize, type }) {
		super(`${type.charAt(0).toUpperCase()}${type.slice(1).toLowerCase()} size (${size$4}) exceeds padding size (${targetSize}).`, { name: "SizeExceedsPaddingSizeError" });
	}
};
function pad(hexOrBytes, { dir, size: size$4 = 32 } = {}) {
	if (typeof hexOrBytes === "string") return padHex(hexOrBytes, {
		dir,
		size: size$4
	});
	return padBytes(hexOrBytes, {
		dir,
		size: size$4
	});
}
function padHex(hex_, { dir, size: size$4 = 32 } = {}) {
	if (size$4 === null) return hex_;
	const hex = hex_.replace("0x", "");
	if (hex.length > size$4 * 2) throw new SizeExceedsPaddingSizeError({
		size: Math.ceil(hex.length / 2),
		targetSize: size$4,
		type: "hex"
	});
	return `0x${hex[dir === "right" ? "padEnd" : "padStart"](size$4 * 2, "0")}`;
}
function padBytes(bytes, { dir, size: size$4 = 32 } = {}) {
	if (size$4 === null) return bytes;
	if (bytes.length > size$4) throw new SizeExceedsPaddingSizeError({
		size: bytes.length,
		targetSize: size$4,
		type: "bytes"
	});
	const paddedBytes = new Uint8Array(size$4);
	for (let i$2 = 0; i$2 < size$4; i$2++) {
		const padEnd = dir === "right";
		paddedBytes[padEnd ? i$2 : size$4 - i$2 - 1] = bytes[padEnd ? i$2 : bytes.length - i$2 - 1];
	}
	return paddedBytes;
}
var IntegerOutOfRangeError = class extends BaseError {
	constructor({ max, min, signed, size: size$4, value }) {
		super(`Number "${value}" is not in safe ${size$4 ? `${size$4 * 8}-bit ${signed ? "signed" : "unsigned"} ` : ""}integer range ${max ? `(${min} to ${max})` : `(above ${min})`}`, { name: "IntegerOutOfRangeError" });
	}
};
var SizeOverflowError = class extends BaseError {
	constructor({ givenSize, maxSize }) {
		super(`Size cannot exceed ${maxSize} bytes. Given size: ${givenSize} bytes.`, { name: "SizeOverflowError" });
	}
};
function assertSize(hexOrBytes, { size: size$4 }) {
	if (size(hexOrBytes) > size$4) throw new SizeOverflowError({
		givenSize: size(hexOrBytes),
		maxSize: size$4
	});
}
var hexes = /* @__PURE__ */ Array.from({ length: 256 }, (_v, i$2) => i$2.toString(16).padStart(2, "0"));
function toHex(value, opts = {}) {
	if (typeof value === "number" || typeof value === "bigint") return numberToHex(value, opts);
	if (typeof value === "string") return stringToHex(value, opts);
	if (typeof value === "boolean") return boolToHex(value, opts);
	return bytesToHex(value, opts);
}
function boolToHex(value, opts = {}) {
	const hex = `0x${Number(value)}`;
	if (typeof opts.size === "number") {
		assertSize(hex, { size: opts.size });
		return pad(hex, { size: opts.size });
	}
	return hex;
}
function bytesToHex(value, opts = {}) {
	let string$2 = "";
	for (let i$2 = 0; i$2 < value.length; i$2++) string$2 += hexes[value[i$2]];
	const hex = `0x${string$2}`;
	if (typeof opts.size === "number") {
		assertSize(hex, { size: opts.size });
		return pad(hex, {
			dir: "right",
			size: opts.size
		});
	}
	return hex;
}
function numberToHex(value_, opts = {}) {
	const { signed, size: size$4 } = opts;
	const value = BigInt(value_);
	let maxValue;
	if (size$4) if (signed) maxValue = (1n << BigInt(size$4) * 8n - 1n) - 1n;
	else maxValue = 2n ** (BigInt(size$4) * 8n) - 1n;
	else if (typeof value_ === "number") maxValue = BigInt(Number.MAX_SAFE_INTEGER);
	const minValue = typeof maxValue === "bigint" && signed ? -maxValue - 1n : 0;
	if (maxValue && value > maxValue || value < minValue) {
		const suffix = typeof value_ === "bigint" ? "n" : "";
		throw new IntegerOutOfRangeError({
			max: maxValue ? `${maxValue}${suffix}` : void 0,
			min: `${minValue}${suffix}`,
			signed,
			size: size$4,
			value: `${value_}${suffix}`
		});
	}
	const hex = `0x${(signed && value < 0 ? (1n << BigInt(size$4 * 8)) + BigInt(value) : value).toString(16)}`;
	if (size$4) return pad(hex, { size: size$4 });
	return hex;
}
var encoder = /* @__PURE__ */ new TextEncoder();
function stringToHex(value_, opts = {}) {
	const value = encoder.encode(value_);
	return bytesToHex(value, opts);
}
const WcConstantsUtil = {
	ERROR_CODE_UNRECOGNIZED_CHAIN_ID: 4902,
	ERROR_CODE_DEFAULT: 5e3,
	ERROR_INVALID_CHAIN_ID: 32603,
	DEFAULT_ALLOWED_ANCESTORS: [
		"http://localhost:*",
		"https://*.pages.dev",
		"https://*.vercel.app",
		"https://*.ngrok-free.app",
		"https://secure-mobile.walletconnect.com",
		"https://secure-mobile.walletconnect.org"
	]
};
function defineChain(chain) {
	return {
		formatters: void 0,
		fees: void 0,
		serializers: void 0,
		...chain
	};
}
const solana = defineChain({
	id: "5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp",
	name: "Solana",
	network: "solana-mainnet",
	nativeCurrency: {
		name: "Solana",
		symbol: "SOL",
		decimals: 9
	},
	rpcUrls: { default: { http: ["https://rpc.walletconnect.org/v1"] } },
	blockExplorers: { default: {
		name: "Solscan",
		url: "https://solscan.io"
	} },
	testnet: false,
	chainNamespace: "solana",
	caipNetworkId: "solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp",
	deprecatedCaipNetworkId: "solana:4sGjMW1sUnHzSxGspuhpqLDx6wiyjNtZ"
});
const solanaDevnet = defineChain({
	id: "EtWTRABZaYq6iMfeYKouRu166VU2xqa1",
	name: "Solana Devnet",
	network: "solana-devnet",
	nativeCurrency: {
		name: "Solana",
		symbol: "SOL",
		decimals: 9
	},
	rpcUrls: { default: { http: ["https://rpc.walletconnect.org/v1"] } },
	blockExplorers: { default: {
		name: "Solscan",
		url: "https://solscan.io"
	} },
	testnet: true,
	chainNamespace: "solana",
	caipNetworkId: "solana:EtWTRABZaYq6iMfeYKouRu166VU2xqa1",
	deprecatedCaipNetworkId: "solana:8E9rvCKLFQia2Y35HXjjpWzj8weVo44K"
});
defineChain({
	id: "4uhcVJyU9pJkvQyS88uRDiswHXSCkY3z",
	name: "Solana Testnet",
	network: "solana-testnet",
	nativeCurrency: {
		name: "Solana",
		symbol: "SOL",
		decimals: 9
	},
	rpcUrls: { default: { http: ["https://rpc.walletconnect.org/v1"] } },
	blockExplorers: { default: {
		name: "Solscan",
		url: "https://solscan.io"
	} },
	testnet: true,
	chainNamespace: "solana",
	caipNetworkId: "solana:4uhcVJyU9pJkvQyS88uRDiswHXSCkY3z"
});
defineChain({
	id: "000000000019d6689c085ae165831e93",
	caipNetworkId: "bip122:000000000019d6689c085ae165831e93",
	chainNamespace: "bip122",
	name: "Bitcoin",
	nativeCurrency: {
		name: "Bitcoin",
		symbol: "BTC",
		decimals: 8
	},
	rpcUrls: { default: { http: ["https://rpc.walletconnect.org/v1"] } }
});
defineChain({
	id: "000000000933ea01ad0ee984209779ba",
	caipNetworkId: "bip122:000000000933ea01ad0ee984209779ba",
	chainNamespace: "bip122",
	name: "Bitcoin Testnet",
	nativeCurrency: {
		name: "Bitcoin",
		symbol: "BTC",
		decimals: 8
	},
	rpcUrls: { default: { http: ["https://rpc.walletconnect.org/v1"] } },
	testnet: true
});
const DEFAULT_METHODS = {
	solana: [
		"solana_signMessage",
		"solana_signTransaction",
		"solana_requestAccounts",
		"solana_getAccounts",
		"solana_signAllTransactions",
		"solana_signAndSendTransaction"
	],
	eip155: [
		"eth_accounts",
		"eth_requestAccounts",
		"eth_sendRawTransaction",
		"eth_sign",
		"eth_signTransaction",
		"eth_signTypedData",
		"eth_signTypedData_v3",
		"eth_signTypedData_v4",
		"eth_sendTransaction",
		"personal_sign",
		"wallet_switchEthereumChain",
		"wallet_addEthereumChain",
		"wallet_getPermissions",
		"wallet_requestPermissions",
		"wallet_registerOnboarding",
		"wallet_watchAsset",
		"wallet_scanQRCode",
		"wallet_getCallsStatus",
		"wallet_showCallsStatus",
		"wallet_sendCalls",
		"wallet_getCapabilities",
		"wallet_grantPermissions",
		"wallet_revokePermissions",
		"wallet_getAssets"
	],
	bip122: [
		"sendTransfer",
		"signMessage",
		"signPsbt",
		"getAccountAddresses"
	]
};
const WcHelpersUtil = {
	getMethodsByChainNamespace(chainNamespace) {
		return DEFAULT_METHODS[chainNamespace] || [];
	},
	createDefaultNamespace(chainNamespace) {
		return {
			methods: this.getMethodsByChainNamespace(chainNamespace),
			events: ["accountsChanged", "chainChanged"],
			chains: [],
			rpcMap: {}
		};
	},
	applyNamespaceOverrides(baseNamespaces, overrides) {
		if (!overrides) return { ...baseNamespaces };
		const result = { ...baseNamespaces };
		const namespacesToOverride = /* @__PURE__ */ new Set();
		if (overrides.methods) Object.keys(overrides.methods).forEach((ns$1) => namespacesToOverride.add(ns$1));
		if (overrides.chains) Object.keys(overrides.chains).forEach((ns$1) => namespacesToOverride.add(ns$1));
		if (overrides.events) Object.keys(overrides.events).forEach((ns$1) => namespacesToOverride.add(ns$1));
		if (overrides.rpcMap) Object.keys(overrides.rpcMap).forEach((chainId) => {
			const [ns$1] = chainId.split(":");
			if (ns$1) namespacesToOverride.add(ns$1);
		});
		namespacesToOverride.forEach((ns$1) => {
			if (!result[ns$1]) result[ns$1] = this.createDefaultNamespace(ns$1);
		});
		if (overrides.methods) Object.entries(overrides.methods).forEach(([ns$1, methods]) => {
			if (result[ns$1]) result[ns$1].methods = methods;
		});
		if (overrides.chains) Object.entries(overrides.chains).forEach(([ns$1, chains]) => {
			if (result[ns$1]) result[ns$1].chains = chains;
		});
		if (overrides.events) Object.entries(overrides.events).forEach(([ns$1, events]) => {
			if (result[ns$1]) result[ns$1].events = events;
		});
		if (overrides.rpcMap) {
			const processedNamespaces = /* @__PURE__ */ new Set();
			Object.entries(overrides.rpcMap).forEach(([chainId, rpcUrl]) => {
				const [ns$1, id] = chainId.split(":");
				if (!ns$1 || !id || !result[ns$1]) return;
				if (!result[ns$1].rpcMap) result[ns$1].rpcMap = {};
				if (!processedNamespaces.has(ns$1)) {
					result[ns$1].rpcMap = {};
					processedNamespaces.add(ns$1);
				}
				result[ns$1].rpcMap[id] = rpcUrl;
			});
		}
		return result;
	},
	createNamespaces(caipNetworks, configOverride) {
		const defaultNamespaces = caipNetworks.reduce((acc, chain) => {
			const { id, chainNamespace, rpcUrls } = chain;
			const rpcUrl = rpcUrls.default.http[0];
			if (!acc[chainNamespace]) acc[chainNamespace] = this.createDefaultNamespace(chainNamespace);
			const caipNetworkId = `${chainNamespace}:${id}`;
			const namespace = acc[chainNamespace];
			namespace.chains.push(caipNetworkId);
			switch (caipNetworkId) {
				case solana.caipNetworkId:
					namespace.chains.push(solana.deprecatedCaipNetworkId);
					break;
				case solanaDevnet.caipNetworkId:
					namespace.chains.push(solanaDevnet.deprecatedCaipNetworkId);
					break;
				default:
			}
			if (namespace?.rpcMap && rpcUrl) namespace.rpcMap[id] = rpcUrl;
			return acc;
		}, {});
		return this.applyNamespaceOverrides(defaultNamespaces, configOverride);
	},
	resolveReownName: async (name) => {
		const wcNameAddress = await EnsController.resolveName(name);
		return (Object.values(wcNameAddress?.addresses) || [])[0]?.address || false;
	},
	getChainsFromNamespaces(namespaces = {}) {
		return Object.values(namespaces).flatMap((namespace) => {
			const chains = namespace.chains || [];
			const accountsChains = namespace.accounts.map((account) => {
				const [chainNamespace, chainId] = account.split(":");
				return `${chainNamespace}:${chainId}`;
			});
			return Array.from(new Set([...chains, ...accountsChains]));
		});
	},
	isSessionEventData(data) {
		return typeof data === "object" && data !== null && "id" in data && "topic" in data && "params" in data && typeof data.params === "object" && data.params !== null && "chainId" in data.params && "event" in data.params && typeof data.params.event === "object" && data.params.event !== null;
	},
	isOriginAllowed(currentOrigin, allowedPatterns, defaultAllowedOrigins) {
		for (const pattern of [...allowedPatterns, ...defaultAllowedOrigins]) if (pattern.includes("*")) {
			const regexString = `^${pattern.replace(/[.*+?^${}()|[\]\\]/gu, "\\$&").replace(/\\\*/gu, ".*")}$`;
			if (new RegExp(regexString, "u").test(currentOrigin)) return true;
		} else try {
			if (new URL(pattern).origin === currentOrigin) return true;
		} catch (e) {
			if (pattern === currentOrigin) return true;
		}
		return false;
	}
};
var WalletConnectConnector = class {
	constructor({ provider, namespace }) {
		this.id = ConstantsUtil.CONNECTOR_ID.WALLET_CONNECT;
		this.name = PresetsUtil.ConnectorNamesMap[ConstantsUtil.CONNECTOR_ID.WALLET_CONNECT];
		this.type = "WALLET_CONNECT";
		this.imageId = PresetsUtil.ConnectorImageIds[ConstantsUtil.CONNECTOR_ID.WALLET_CONNECT];
		this.getCaipNetworks = ChainController.getCaipNetworks.bind(ChainController);
		this.caipNetworks = this.getCaipNetworks();
		this.provider = provider;
		this.chain = namespace;
	}
	get chains() {
		return this.getCaipNetworks();
	}
	async connectWalletConnect() {
		if (!await this.authenticate()) {
			const caipNetworks = this.getCaipNetworks();
			const universalProviderConfigOverride = OptionsController.state.universalProviderConfigOverride;
			const namespaces = WcHelpersUtil.createNamespaces(caipNetworks, universalProviderConfigOverride);
			await this.provider.connect({ optionalNamespaces: namespaces });
		}
		return {
			clientId: await this.provider.client.core.crypto.getClientId(),
			session: this.provider.session
		};
	}
	async disconnect() {
		await this.provider.disconnect();
	}
	async authenticate() {
		const chains = this.chains.map((network) => network.caipNetworkId);
		return SIWXUtil.universalProviderAuthenticate({
			universalProvider: this.provider,
			chains,
			methods: OPTIONAL_METHODS
		});
	}
};
var OPTIONAL_METHODS = [
	"eth_accounts",
	"eth_requestAccounts",
	"eth_sendRawTransaction",
	"eth_sign",
	"eth_signTransaction",
	"eth_signTypedData",
	"eth_signTypedData_v3",
	"eth_signTypedData_v4",
	"eth_sendTransaction",
	"personal_sign",
	"wallet_switchEthereumChain",
	"wallet_addEthereumChain",
	"wallet_getPermissions",
	"wallet_requestPermissions",
	"wallet_registerOnboarding",
	"wallet_watchAsset",
	"wallet_scanQRCode",
	"wallet_getCallsStatus",
	"wallet_sendCalls",
	"wallet_getCapabilities",
	"wallet_grantPermissions",
	"wallet_revokePermissions",
	"wallet_getAssets"
];
var AdapterBlueprint = class {
	constructor(params) {
		this.availableConnectors = [];
		this.eventListeners = /* @__PURE__ */ new Map();
		this.getCaipNetworks = (namespace) => ChainController.getCaipNetworks(namespace);
		if (params) this.construct(params);
	}
	construct(params) {
		this.projectId = params.projectId;
		this.namespace = params.namespace;
		this.adapterType = params.adapterType;
	}
	get connectors() {
		return this.availableConnectors;
	}
	get networks() {
		return this.getCaipNetworks(this.namespace);
	}
	setAuthProvider(authProvider) {
		this.addConnector({
			id: ConstantsUtil.CONNECTOR_ID.AUTH,
			type: "AUTH",
			name: ConstantsUtil.CONNECTOR_NAMES.AUTH,
			provider: authProvider,
			imageId: PresetsUtil.ConnectorImageIds[ConstantsUtil.CONNECTOR_ID.AUTH],
			chain: this.namespace,
			chains: []
		});
	}
	addConnector(...connectors) {
		const connectorsAdded = /* @__PURE__ */ new Set();
		this.availableConnectors = [...connectors, ...this.availableConnectors].filter((connector) => {
			if (connectorsAdded.has(connector.id)) return false;
			connectorsAdded.add(connector.id);
			return true;
		});
		this.emit("connectors", this.availableConnectors);
	}
	setStatus(status, chainNamespace) {
		AccountController.setStatus(status, chainNamespace);
	}
	on(eventName, callback) {
		if (!this.eventListeners.has(eventName)) this.eventListeners.set(eventName, /* @__PURE__ */ new Set());
		this.eventListeners.get(eventName)?.add(callback);
	}
	off(eventName, callback) {
		const listeners = this.eventListeners.get(eventName);
		if (listeners) listeners.delete(callback);
	}
	removeAllEventListeners() {
		this.eventListeners.forEach((listeners) => {
			listeners.clear();
		});
	}
	emit(eventName, data) {
		const listeners = this.eventListeners.get(eventName);
		if (listeners) listeners.forEach((callback) => callback(data));
	}
	async connectWalletConnect(_chainId) {
		return { clientId: (await this.getWalletConnectConnector().connectWalletConnect()).clientId };
	}
	async switchNetwork(params) {
		const { caipNetwork, providerType } = params;
		if (!params.provider) return;
		const provider = "provider" in params.provider ? params.provider.provider : params.provider;
		if (providerType === "WALLET_CONNECT") {
			provider.setDefaultChain(caipNetwork.caipNetworkId);
			return;
		}
		if (provider && providerType === "AUTH") {
			const authProvider = provider;
			const preferredAccountType = AccountController.state.preferredAccountTypes?.[caipNetwork.chainNamespace];
			await authProvider.switchNetwork(caipNetwork.caipNetworkId);
			const user = await authProvider.getUser({
				chainId: caipNetwork.caipNetworkId,
				preferredAccountType
			});
			this.emit("switchNetwork", user);
		}
	}
	getWalletConnectConnector() {
		const connector = this.connectors.find((c$2) => c$2 instanceof WalletConnectConnector);
		if (!connector) throw new Error("WalletConnectConnector not found");
		return connector;
	}
};
var UniversalAdapter = class extends AdapterBlueprint {
	setUniversalProvider(universalProvider) {
		this.addConnector(new WalletConnectConnector({
			provider: universalProvider,
			caipNetworks: this.getCaipNetworks(),
			namespace: this.namespace
		}));
	}
	async connect(params) {
		return Promise.resolve({
			id: "WALLET_CONNECT",
			type: "WALLET_CONNECT",
			chainId: Number(params.chainId),
			provider: this.provider,
			address: ""
		});
	}
	async disconnect() {
		try {
			await this.getWalletConnectConnector().disconnect();
		} catch (error) {
			console.warn("UniversalAdapter:disconnect - error", error);
		}
	}
	async getAccounts({ namespace }) {
		const addresses = this.provider?.session?.namespaces?.[namespace]?.accounts?.map((account) => {
			const [, , address] = account.split(":");
			return address;
		}).filter((address, index$1, self) => self.indexOf(address) === index$1) || [];
		return Promise.resolve({ accounts: addresses.map((address) => CoreHelperUtil.createAccount(namespace, address, namespace === "bip122" ? "payment" : "eoa")) });
	}
	async syncConnectors() {
		return Promise.resolve();
	}
	async getBalance(params) {
		if (!(params.caipNetwork && ConstantsUtil$1.BALANCE_SUPPORTED_CHAINS.includes(params.caipNetwork?.chainNamespace)) || params.caipNetwork?.testnet) return {
			balance: "0.00",
			symbol: params.caipNetwork?.nativeCurrency.symbol || ""
		};
		if (AccountController.state.balanceLoading && params.chainId === ChainController.state.activeCaipNetwork?.id) return {
			balance: AccountController.state.balance || "0.00",
			symbol: AccountController.state.balanceSymbol || ""
		};
		const balance = (await AccountController.fetchTokenBalance()).find((b$3) => b$3.chainId === `${params.caipNetwork?.chainNamespace}:${params.chainId}` && b$3.symbol === params.caipNetwork?.nativeCurrency.symbol);
		return {
			balance: balance?.quantity.numeric || "0.00",
			symbol: balance?.symbol || params.caipNetwork?.nativeCurrency.symbol || ""
		};
	}
	async signMessage(params) {
		const { provider, message, address } = params;
		if (!provider) throw new Error("UniversalAdapter:signMessage - provider is undefined");
		let signature = "";
		if (ChainController.state.activeCaipNetwork?.chainNamespace === ConstantsUtil.CHAIN.SOLANA) signature = (await provider.request({
			method: "solana_signMessage",
			params: {
				message: esm_default.encode(new TextEncoder().encode(message)),
				pubkey: address
			}
		}, ChainController.state.activeCaipNetwork?.caipNetworkId)).signature;
		else signature = await provider.request({
			method: "personal_sign",
			params: [message, address]
		}, ChainController.state.activeCaipNetwork?.caipNetworkId);
		return { signature };
	}
	async estimateGas() {
		return Promise.resolve({ gas: BigInt(0) });
	}
	async sendTransaction() {
		return Promise.resolve({ hash: "" });
	}
	walletGetAssets(_params) {
		return Promise.resolve({});
	}
	async writeContract() {
		return Promise.resolve({ hash: "" });
	}
	parseUnits() {
		return 0n;
	}
	formatUnits() {
		return "0";
	}
	async getCapabilities() {
		return Promise.resolve({});
	}
	async grantPermissions() {
		return Promise.resolve({});
	}
	async revokePermissions() {
		return Promise.resolve("0x");
	}
	async syncConnection() {
		return Promise.resolve({
			id: "WALLET_CONNECT",
			type: "WALLET_CONNECT",
			chainId: 1,
			provider: this.provider,
			address: ""
		});
	}
	async switchNetwork(params) {
		const { caipNetwork } = params;
		const connector = this.getWalletConnectConnector();
		if (caipNetwork.chainNamespace === ConstantsUtil.CHAIN.EVM) try {
			await connector.provider?.request({
				method: "wallet_switchEthereumChain",
				params: [{ chainId: toHex(caipNetwork.id) }]
			});
		} catch (switchError) {
			if (switchError.code === WcConstantsUtil.ERROR_CODE_UNRECOGNIZED_CHAIN_ID || switchError.code === WcConstantsUtil.ERROR_INVALID_CHAIN_ID || switchError.code === WcConstantsUtil.ERROR_CODE_DEFAULT || switchError?.data?.originalError?.code === WcConstantsUtil.ERROR_CODE_UNRECOGNIZED_CHAIN_ID) try {
				await connector.provider?.request({
					method: "wallet_addEthereumChain",
					params: [{
						chainId: toHex(caipNetwork.id),
						rpcUrls: [caipNetwork?.rpcUrls["chainDefault"]?.http],
						chainName: caipNetwork.name,
						nativeCurrency: caipNetwork.nativeCurrency,
						blockExplorerUrls: [caipNetwork.blockExplorers?.default.url]
					}]
				});
			} catch (error) {
				throw new Error("Chain is not supported");
			}
		}
		connector.provider.setDefaultChain(caipNetwork.caipNetworkId);
	}
	getWalletConnectProvider() {
		return this.connectors.find((c$2) => c$2.type === "WALLET_CONNECT")?.provider;
	}
};
var FEATURE_KEYS = [
	"email",
	"socials",
	"swaps",
	"onramp",
	"activity",
	"reownBranding"
];
var featureConfig = {
	email: {
		apiFeatureName: "social_login",
		localFeatureName: "email",
		returnType: false,
		isLegacy: false,
		isAvailableOnBasic: false,
		processApi: (apiConfig) => {
			if (!apiConfig?.config) return false;
			const config = apiConfig.config;
			return Boolean(apiConfig.isEnabled) && config.includes("email");
		},
		processFallback: (localValue) => {
			if (localValue === void 0) return ConstantsUtil$1.DEFAULT_REMOTE_FEATURES.email;
			return Boolean(localValue);
		}
	},
	socials: {
		apiFeatureName: "social_login",
		localFeatureName: "socials",
		returnType: false,
		isLegacy: false,
		isAvailableOnBasic: false,
		processApi: (apiConfig) => {
			if (!apiConfig?.config) return false;
			const config = apiConfig.config;
			return Boolean(apiConfig.isEnabled) && config.length > 0 ? config.filter((s) => s !== "email") : false;
		},
		processFallback: (localValue) => {
			if (localValue === void 0) return ConstantsUtil$1.DEFAULT_REMOTE_FEATURES.socials;
			if (typeof localValue === "boolean") return localValue ? ConstantsUtil$1.DEFAULT_REMOTE_FEATURES.socials : false;
			return localValue;
		}
	},
	swaps: {
		apiFeatureName: "swap",
		localFeatureName: "swaps",
		returnType: false,
		isLegacy: false,
		isAvailableOnBasic: false,
		processApi: (apiConfig) => {
			if (!apiConfig?.config) return false;
			const config = apiConfig.config;
			return Boolean(apiConfig.isEnabled) && config.length > 0 ? config : false;
		},
		processFallback: (localValue) => {
			if (localValue === void 0) return ConstantsUtil$1.DEFAULT_REMOTE_FEATURES.swaps;
			if (typeof localValue === "boolean") return localValue ? ConstantsUtil$1.DEFAULT_REMOTE_FEATURES.swaps : false;
			return localValue;
		}
	},
	onramp: {
		apiFeatureName: "onramp",
		localFeatureName: "onramp",
		returnType: false,
		isLegacy: false,
		isAvailableOnBasic: false,
		processApi: (apiConfig) => {
			if (!apiConfig?.config) return false;
			const config = apiConfig.config;
			return Boolean(apiConfig.isEnabled) && config.length > 0 ? config : false;
		},
		processFallback: (localValue) => {
			if (localValue === void 0) return ConstantsUtil$1.DEFAULT_REMOTE_FEATURES.onramp;
			if (typeof localValue === "boolean") return localValue ? ConstantsUtil$1.DEFAULT_REMOTE_FEATURES.onramp : false;
			return localValue;
		}
	},
	activity: {
		apiFeatureName: "activity",
		localFeatureName: "history",
		returnType: false,
		isLegacy: true,
		isAvailableOnBasic: false,
		processApi: (apiConfig) => Boolean(apiConfig.isEnabled),
		processFallback: (localValue) => {
			if (localValue === void 0) return ConstantsUtil$1.DEFAULT_REMOTE_FEATURES.activity;
			return Boolean(localValue);
		}
	},
	reownBranding: {
		apiFeatureName: "reown_branding",
		localFeatureName: "reownBranding",
		returnType: false,
		isLegacy: false,
		isAvailableOnBasic: false,
		processApi: (apiConfig) => Boolean(apiConfig.isEnabled),
		processFallback: (localValue) => {
			if (localValue === void 0) return ConstantsUtil$1.DEFAULT_REMOTE_FEATURES.reownBranding;
			return Boolean(localValue);
		}
	}
};
const ConfigUtil = {
	localSettingsOverridden: /* @__PURE__ */ new Set(),
	getApiConfig(id, apiProjectConfig) {
		return apiProjectConfig?.find((f$4) => f$4.id === id);
	},
	addWarning(localFeatureValue, featureKey) {
		if (localFeatureValue !== void 0) {
			const config = featureConfig[featureKey];
			const warningName = config.isLegacy ? `"features.${config.localFeatureName}" (now "${featureKey}")` : `"features.${featureKey}"`;
			this.localSettingsOverridden.add(warningName);
		}
	},
	processFeature(featureKey, localFeatures, apiProjectConfig, useApi, isBasic) {
		const config = featureConfig[featureKey];
		const localValue = localFeatures[config.localFeatureName];
		if (isBasic && !config.isAvailableOnBasic) return false;
		if (useApi) {
			const apiConfig = this.getApiConfig(config.apiFeatureName, apiProjectConfig);
			if (apiConfig?.config === null) return this.processFallbackFeature(featureKey, localValue);
			if (!apiConfig?.config) return false;
			if (localValue !== void 0) this.addWarning(localValue, featureKey);
			return this.processApiFeature(featureKey, apiConfig);
		}
		return this.processFallbackFeature(featureKey, localValue);
	},
	processApiFeature(featureKey, apiConfig) {
		return featureConfig[featureKey].processApi(apiConfig);
	},
	processFallbackFeature(featureKey, localValue) {
		return featureConfig[featureKey].processFallback(localValue);
	},
	async fetchRemoteFeatures(config) {
		const isBasic = config.basic ?? false;
		const localFeatures = config.features || {};
		this.localSettingsOverridden.clear();
		let apiProjectConfig = null;
		let useApiConfig = false;
		try {
			apiProjectConfig = await ApiController.fetchProjectConfig();
			useApiConfig = apiProjectConfig !== null && apiProjectConfig !== void 0;
		} catch (e) {
			console.warn("[Reown Config] Failed to fetch remote project configuration. Using local/default values.", e);
		}
		const remoteFeaturesConfig = useApiConfig && !isBasic ? ConstantsUtil$1.DEFAULT_REMOTE_FEATURES : ConstantsUtil$1.DEFAULT_REMOTE_FEATURES_DISABLED;
		try {
			for (const featureKey of FEATURE_KEYS) {
				const result = this.processFeature(featureKey, localFeatures, apiProjectConfig, useApiConfig, isBasic);
				Object.assign(remoteFeaturesConfig, { [featureKey]: result });
			}
		} catch (e) {
			console.warn("[Reown Config] Failed to process the configuration from Cloud. Using default values.", e);
			return ConstantsUtil$1.DEFAULT_REMOTE_FEATURES;
		}
		if (useApiConfig && this.localSettingsOverridden.size > 0) {
			const warningMessage = `Your local configuration for ${Array.from(this.localSettingsOverridden).join(", ")} was ignored because a remote configuration was successfully fetched. Please manage these features via your project dashboard on dashboard.reown.com.`;
			AlertController.open({
				shortMessage: "Local configuration ignored",
				longMessage: `[Reown Config Notice] ${warningMessage}`
			}, "warning");
		}
		return remoteFeaturesConfig;
	}
};
var AppKitBaseClient = class {
	constructor(options) {
		this.chainNamespaces = [];
		this.remoteFeatures = {};
		this.reportedAlertErrors = {};
		this.getCaipNetwork = (chainNamespace, id) => {
			if (chainNamespace) {
				const caipNetworkWithId = ChainController.getNetworkData(chainNamespace)?.requestedCaipNetworks?.find((c$2) => c$2.id === id);
				if (caipNetworkWithId) return caipNetworkWithId;
				const namespaceCaipNetwork = ChainController.getNetworkData(chainNamespace)?.caipNetwork;
				if (namespaceCaipNetwork) return namespaceCaipNetwork;
				return ChainController.getRequestedCaipNetworks(chainNamespace).filter((c$2) => c$2.chainNamespace === chainNamespace)?.[0];
			}
			return ChainController.state.activeCaipNetwork || this.defaultCaipNetwork;
		};
		this.getCaipNetworkId = () => {
			const network = this.getCaipNetwork();
			if (network) return network.id;
		};
		this.getCaipNetworks = (namespace) => ChainController.getCaipNetworks(namespace);
		this.getActiveChainNamespace = () => ChainController.state.activeChain;
		this.setRequestedCaipNetworks = (requestedCaipNetworks, chain) => {
			ChainController.setRequestedCaipNetworks(requestedCaipNetworks, chain);
		};
		this.getApprovedCaipNetworkIds = () => ChainController.getAllApprovedCaipNetworkIds();
		this.getCaipAddress = (chainNamespace) => {
			if (ChainController.state.activeChain === chainNamespace || !chainNamespace) return ChainController.state.activeCaipAddress;
			return ChainController.getAccountProp("caipAddress", chainNamespace);
		};
		this.setClientId = (clientId) => {
			BlockchainApiController.setClientId(clientId);
		};
		this.getProvider = (namespace) => ProviderUtil.getProvider(namespace);
		this.getProviderType = (namespace) => ProviderUtil.getProviderId(namespace);
		this.getPreferredAccountType = (namespace) => AccountController.state.preferredAccountTypes?.[namespace];
		this.setCaipAddress = (caipAddress, chain) => {
			AccountController.setCaipAddress(caipAddress, chain);
			if (caipAddress && OptionsController.state.enableEmbedded) this.close();
		};
		this.setBalance = (balance, balanceSymbol, chain) => {
			AccountController.setBalance(balance, balanceSymbol, chain);
		};
		this.setProfileName = (profileName, chain) => {
			AccountController.setProfileName(profileName, chain);
		};
		this.setProfileImage = (profileImage, chain) => {
			AccountController.setProfileImage(profileImage, chain);
		};
		this.setUser = (user, chain) => {
			AccountController.setUser(user, chain);
		};
		this.resetAccount = (chain) => {
			AccountController.resetAccount(chain);
		};
		this.setCaipNetwork = (caipNetwork) => {
			ChainController.setActiveCaipNetwork(caipNetwork);
		};
		this.setCaipNetworkOfNamespace = (caipNetwork, chainNamespace) => {
			ChainController.setChainNetworkData(chainNamespace, { caipNetwork });
		};
		this.setAllAccounts = (addresses, chain) => {
			AccountController.setAllAccounts(addresses, chain);
			OptionsController.setHasMultipleAddresses(addresses?.length > 1);
		};
		this.setStatus = (status, chain) => {
			AccountController.setStatus(status, chain);
			if (ConnectorController.isConnected()) StorageUtil.setConnectionStatus("connected");
			else StorageUtil.setConnectionStatus("disconnected");
		};
		this.getAddressByChainNamespace = (chainNamespace) => ChainController.getAccountProp("address", chainNamespace);
		this.setConnectors = (connectors) => {
			const allConnectors = [...ConnectorController.state.allConnectors, ...connectors];
			ConnectorController.setConnectors(allConnectors);
		};
		this.setConnections = (connections, chainNamespace) => {
			ConnectionController.setConnections(connections, chainNamespace);
		};
		this.fetchIdentity = (request) => BlockchainApiController.fetchIdentity(request);
		this.getReownName = (address) => EnsController.getNamesForAddress(address);
		this.getConnectors = () => ConnectorController.getConnectors();
		this.getConnectorImage = (connector) => AssetUtil.getConnectorImage(connector);
		this.setConnectedWalletInfo = (connectedWalletInfo, chain) => {
			const type = ProviderUtil.getProviderId(chain);
			const walletInfo = connectedWalletInfo ? {
				...connectedWalletInfo,
				type
			} : void 0;
			AccountController.setConnectedWalletInfo(walletInfo, chain);
		};
		this.getIsConnectedState = () => Boolean(ChainController.state.activeCaipAddress);
		this.addAddressLabel = (address, label, chain) => {
			AccountController.addAddressLabel(address, label, chain);
		};
		this.removeAddressLabel = (address, chain) => {
			AccountController.removeAddressLabel(address, chain);
		};
		this.getAddress = (chainNamespace) => {
			if (ChainController.state.activeChain === chainNamespace || !chainNamespace) return AccountController.state.address;
			return ChainController.getAccountProp("address", chainNamespace);
		};
		this.setApprovedCaipNetworksData = (namespace) => ChainController.setApprovedCaipNetworksData(namespace);
		this.resetNetwork = (namespace) => {
			ChainController.resetNetwork(namespace);
		};
		this.addConnector = (connector) => {
			ConnectorController.addConnector(connector);
		};
		this.resetWcConnection = () => {
			ConnectionController.resetWcConnection();
		};
		this.setAddressExplorerUrl = (addressExplorerUrl, chain) => {
			AccountController.setAddressExplorerUrl(addressExplorerUrl, chain);
		};
		this.setSmartAccountDeployed = (isDeployed, chain) => {
			AccountController.setSmartAccountDeployed(isDeployed, chain);
		};
		this.setSmartAccountEnabledNetworks = (smartAccountEnabledNetworks, chain) => {
			ChainController.setSmartAccountEnabledNetworks(smartAccountEnabledNetworks, chain);
		};
		this.setPreferredAccountType = (preferredAccountType, chain) => {
			AccountController.setPreferredAccountType(preferredAccountType, chain);
		};
		this.setEIP6963Enabled = (enabled) => {
			OptionsController.setEIP6963Enabled(enabled);
		};
		this.handleUnsafeRPCRequest = () => {
			if (this.isOpen()) {
				if (this.isTransactionStackEmpty()) return;
				this.redirect("ApproveTransaction");
			} else this.open({ view: "ApproveTransaction" });
		};
		this.options = options;
		this.version = options.sdkVersion;
		this.caipNetworks = this.extendCaipNetworks(options);
		this.chainNamespaces = this.getChainNamespacesSet(options.adapters, this.caipNetworks);
		this.defaultCaipNetwork = this.extendDefaultCaipNetwork(options);
		this.chainAdapters = this.createAdapters(options.adapters);
		this.readyPromise = this.initialize(options);
	}
	getChainNamespacesSet(adapters, caipNetworks) {
		const adapterNamespaces = adapters?.map((adapter) => adapter.namespace).filter((namespace) => Boolean(namespace));
		if (adapterNamespaces?.length) return [...new Set(adapterNamespaces)];
		const networkNamespaces = caipNetworks?.map((network) => network.chainNamespace);
		return [...new Set(networkNamespaces)];
	}
	async initialize(options) {
		this.initializeProjectSettings(options);
		this.initControllers(options);
		await this.initChainAdapters();
		this.sendInitializeEvent(options);
		await this.syncExistingConnection();
		this.remoteFeatures = await ConfigUtil.fetchRemoteFeatures(options);
		OptionsController.setRemoteFeatures(this.remoteFeatures);
		if (this.remoteFeatures.onramp) OnRampController.setOnrampProviders(this.remoteFeatures.onramp);
		if (OptionsController.state.remoteFeatures?.email || Array.isArray(OptionsController.state.remoteFeatures?.socials) && OptionsController.state.remoteFeatures?.socials.length > 0) await this.checkAllowedOrigins();
	}
	async checkAllowedOrigins() {
		const allowedOrigins = await ApiController.fetchAllowedOrigins();
		if (allowedOrigins && CoreHelperUtil.isClient()) {
			const currentOrigin = window.location.origin;
			if (!WcHelpersUtil.isOriginAllowed(currentOrigin, allowedOrigins, WcConstantsUtil.DEFAULT_ALLOWED_ANCESTORS)) AlertController.open(ErrorUtil.ALERT_ERRORS.INVALID_APP_CONFIGURATION, "error");
		} else AlertController.open(ErrorUtil.ALERT_ERRORS.PROJECT_ID_NOT_CONFIGURED, "error");
	}
	sendInitializeEvent(options) {
		const { ...optionsCopy } = options;
		delete optionsCopy.adapters;
		delete optionsCopy.universalProvider;
		EventsController.sendEvent({
			type: "track",
			event: "INITIALIZE",
			properties: {
				...optionsCopy,
				networks: options.networks.map((n$1) => n$1.id),
				siweConfig: { options: options.siweConfig?.options || {} }
			}
		});
	}
	initControllers(options) {
		this.initializeOptionsController(options);
		this.initializeChainController(options);
		this.initializeThemeController(options);
		this.initializeConnectionController(options);
		this.initializeConnectorController();
	}
	initializeThemeController(options) {
		if (options.themeMode) ThemeController.setThemeMode(options.themeMode);
		if (options.themeVariables) ThemeController.setThemeVariables(options.themeVariables);
	}
	initializeChainController(options) {
		if (!this.connectionControllerClient || !this.networkControllerClient) throw new Error("ConnectionControllerClient and NetworkControllerClient must be set");
		ChainController.initialize(options.adapters ?? [], this.caipNetworks, {
			connectionControllerClient: this.connectionControllerClient,
			networkControllerClient: this.networkControllerClient
		});
		const network = this.getDefaultNetwork();
		if (network) ChainController.setActiveCaipNetwork(network);
	}
	initializeConnectionController(options) {
		ConnectionController.setWcBasic(options.basic ?? false);
	}
	initializeConnectorController() {
		ConnectorController.initialize(this.chainNamespaces);
	}
	initializeProjectSettings(options) {
		OptionsController.setProjectId(options.projectId);
		OptionsController.setSdkVersion(options.sdkVersion);
	}
	initializeOptionsController(options) {
		OptionsController.setDebug(options.debug !== false);
		OptionsController.setEnableWalletConnect(options.enableWalletConnect !== false);
		OptionsController.setEnableWalletGuide(options.enableWalletGuide !== false);
		OptionsController.setEnableWallets(options.enableWallets !== false);
		OptionsController.setEIP6963Enabled(options.enableEIP6963 !== false);
		OptionsController.setEnableNetworkSwitch(options.enableNetworkSwitch !== false);
		OptionsController.setEnableAuthLogger(options.enableAuthLogger !== false);
		OptionsController.setCustomRpcUrls(options.customRpcUrls);
		OptionsController.setEnableEmbedded(options.enableEmbedded);
		OptionsController.setAllWallets(options.allWallets);
		OptionsController.setIncludeWalletIds(options.includeWalletIds);
		OptionsController.setExcludeWalletIds(options.excludeWalletIds);
		OptionsController.setFeaturedWalletIds(options.featuredWalletIds);
		OptionsController.setTokens(options.tokens);
		OptionsController.setTermsConditionsUrl(options.termsConditionsUrl);
		OptionsController.setPrivacyPolicyUrl(options.privacyPolicyUrl);
		OptionsController.setCustomWallets(options.customWallets);
		OptionsController.setFeatures(options.features);
		OptionsController.setAllowUnsupportedChain(options.allowUnsupportedChain);
		OptionsController.setUniversalProviderConfigOverride(options.universalProviderConfigOverride);
		OptionsController.setPreferUniversalLinks(options.experimental_preferUniversalLinks);
		OptionsController.setDefaultAccountTypes(options.defaultAccountTypes);
		const storedAccountTypes = StorageUtil.getPreferredAccountTypes() || {};
		const defaultTypes = {
			...OptionsController.state.defaultAccountTypes,
			...storedAccountTypes
		};
		AccountController.setPreferredAccountTypes(defaultTypes);
		const defaultMetaData = this.getDefaultMetaData();
		if (!options.metadata && defaultMetaData) options.metadata = defaultMetaData;
		OptionsController.setMetadata(options.metadata);
		OptionsController.setDisableAppend(options.disableAppend);
		OptionsController.setEnableEmbedded(options.enableEmbedded);
		OptionsController.setSIWX(options.siwx);
		if (!options.projectId) {
			AlertController.open(ErrorUtil.ALERT_ERRORS.PROJECT_ID_NOT_CONFIGURED, "error");
			return;
		}
		if (options.adapters?.find((adapter) => adapter.namespace === ConstantsUtil.CHAIN.EVM)) {
			if (options.siweConfig) {
				if (options.siwx) throw new Error("Cannot set both `siweConfig` and `siwx` options");
				OptionsController.setSIWX(options.siweConfig.mapToSIWX());
			}
		}
	}
	getDefaultMetaData() {
		if (CoreHelperUtil.isClient()) return {
			name: document.getElementsByTagName("title")?.[0]?.textContent || "",
			description: document.querySelector("meta[property=\"og:description\"]")?.content || "",
			url: window.location.origin,
			icons: [document.querySelector("link[rel~=\"icon\"]")?.href || ""]
		};
		return null;
	}
	setUnsupportedNetwork(chainId) {
		const namespace = this.getActiveChainNamespace();
		if (namespace) {
			const unsupportedNetwork = CaipNetworksUtil.getUnsupportedNetwork(`${namespace}:${chainId}`);
			ChainController.setActiveCaipNetwork(unsupportedNetwork);
		}
	}
	getDefaultNetwork() {
		return CaipNetworksUtil.getCaipNetworkFromStorage(this.defaultCaipNetwork);
	}
	extendCaipNetwork(network, options) {
		return CaipNetworksUtil.extendCaipNetwork(network, {
			customNetworkImageUrls: options.chainImages,
			projectId: options.projectId
		});
	}
	extendCaipNetworks(options) {
		return CaipNetworksUtil.extendCaipNetworks(options.networks, {
			customNetworkImageUrls: options.chainImages,
			customRpcUrls: options.customRpcUrls,
			projectId: options.projectId
		});
	}
	extendDefaultCaipNetwork(options) {
		const defaultNetwork = options.networks.find((n$1) => n$1.id === options.defaultNetwork?.id);
		return defaultNetwork ? CaipNetworksUtil.extendCaipNetwork(defaultNetwork, {
			customNetworkImageUrls: options.chainImages,
			customRpcUrls: options.customRpcUrls,
			projectId: options.projectId
		}) : void 0;
	}
	async disconnectNamespace(namespace) {
		try {
			const adapter = this.getAdapter(namespace);
			const provider = ProviderUtil.getProvider(namespace);
			const providerType = ProviderUtil.getProviderId(namespace);
			const { caipAddress } = ChainController.getAccountData(namespace) || {};
			this.setLoading(true, namespace);
			if (caipAddress && adapter?.disconnect) await adapter.disconnect({
				provider,
				providerType
			});
			StorageUtil.removeConnectedNamespace(namespace);
			ProviderUtil.resetChain(namespace);
			this.setUser(void 0, namespace);
			this.setStatus("disconnected", namespace);
			this.setConnectedWalletInfo(void 0, namespace);
			ConnectorController.removeConnectorId(namespace);
			ChainController.resetAccount(namespace);
			ChainController.resetNetwork(namespace);
			this.setLoading(false, namespace);
		} catch (error) {
			this.setLoading(false, namespace);
			throw new Error(`Failed to disconnect chain ${namespace}: ${error.message}`);
		}
	}
	createClients() {
		this.connectionControllerClient = {
			connectWalletConnect: async () => {
				const activeChain = ChainController.state.activeChain;
				const adapter = this.getAdapter(activeChain);
				const chainId = this.getCaipNetwork(activeChain)?.id;
				if (!adapter) throw new Error("Adapter not found");
				const result = await adapter.connectWalletConnect(chainId);
				this.close();
				this.setClientId(result?.clientId || null);
				StorageUtil.setConnectedNamespaces([...ChainController.state.chains.keys()]);
				this.chainNamespaces.forEach((namespace) => {
					ConnectorController.setConnectorId(ConstantsUtil$2.CONNECTOR_TYPE_WALLET_CONNECT, namespace);
				});
				await this.syncWalletConnectAccount();
			},
			connectExternal: async ({ id, info, type, provider, chain, caipNetwork, socialUri }) => {
				const activeChain = ChainController.state.activeChain;
				const chainToUse = chain || activeChain;
				const adapter = this.getAdapter(chainToUse);
				if (chain && chain !== activeChain && !caipNetwork) {
					const toConnectNetwork = this.getCaipNetworks().find((network) => network.chainNamespace === chain);
					if (toConnectNetwork) this.setCaipNetwork(toConnectNetwork);
				}
				if (!adapter) throw new Error("Adapter not found");
				const fallbackCaipNetwork = this.getCaipNetwork(chainToUse);
				const res = await adapter.connect({
					id,
					info,
					type,
					provider,
					socialUri,
					chainId: caipNetwork?.id || fallbackCaipNetwork?.id,
					rpcUrl: caipNetwork?.rpcUrls?.default?.http?.[0] || fallbackCaipNetwork?.rpcUrls?.default?.http?.[0]
				});
				if (!res) return;
				StorageUtil.addConnectedNamespace(chainToUse);
				this.syncProvider({
					...res,
					chainNamespace: chainToUse
				});
				const syncedAccounts = AccountController.state.allAccounts;
				const { accounts } = syncedAccounts?.length > 0 ? { accounts: [...syncedAccounts] } : await adapter.getAccounts({
					namespace: chainToUse,
					id
				});
				this.setAllAccounts(accounts, chainToUse);
				this.setStatus("connected", chainToUse);
				this.syncConnectedWalletInfo(chainToUse);
			},
			reconnectExternal: async ({ id, info, type, provider }) => {
				const namespace = ChainController.state.activeChain;
				const adapter = this.getAdapter(namespace);
				if (adapter?.reconnect) {
					await adapter?.reconnect({
						id,
						info,
						type,
						provider,
						chainId: this.getCaipNetwork()?.id
					});
					StorageUtil.addConnectedNamespace(namespace);
					this.syncConnectedWalletInfo(namespace);
				}
			},
			disconnect: async (chainNamespace) => {
				const chainsToDisconnect = getChainsToDisconnect(chainNamespace);
				try {
					const disconnectResults = await Promise.allSettled(chainsToDisconnect.map(async ([ns$1]) => this.disconnectNamespace(ns$1)));
					SendController.resetSend();
					ConnectionController.resetWcConnection();
					await SIWXUtil.clearSessions();
					ConnectorController.setFilterByNamespace(void 0);
					const failures = disconnectResults.filter((result) => result.status === "rejected");
					if (failures.length > 0) throw new Error(failures.map((f$4) => f$4.reason.message).join(", "));
					StorageUtil.deleteConnectedSocialProvider();
					EventsController.sendEvent({
						type: "track",
						event: "DISCONNECT_SUCCESS",
						properties: { namespace: chainNamespace || "all" }
					});
				} catch (error) {
					throw new Error(`Failed to disconnect chains: ${error.message}`);
				}
			},
			checkInstalled: (ids) => {
				if (!ids) return Boolean(window.ethereum);
				return ids.some((id) => Boolean(window.ethereum?.[String(id)]));
			},
			signMessage: async (message) => {
				return (await this.getAdapter(ChainController.state.activeChain)?.signMessage({
					message,
					address: AccountController.state.address,
					provider: ProviderUtil.getProvider(ChainController.state.activeChain)
				}))?.signature || "";
			},
			sendTransaction: async (args) => {
				const namespace = args.chainNamespace;
				if (ConstantsUtil$1.SEND_SUPPORTED_NAMESPACES.includes(namespace)) {
					const adapter = this.getAdapter(ChainController.state.activeChain);
					const provider = ProviderUtil.getProvider(namespace);
					return (await adapter?.sendTransaction({
						...args,
						caipNetwork: this.getCaipNetwork(),
						provider
					}))?.hash || "";
				}
				return "";
			},
			estimateGas: async (args) => {
				if (args.chainNamespace === ConstantsUtil.CHAIN.EVM) {
					const adapter = this.getAdapter(ChainController.state.activeChain);
					const provider = ProviderUtil.getProvider(ChainController.state.activeChain);
					const caipNetwork = this.getCaipNetwork();
					if (!caipNetwork) throw new Error("CaipNetwork is undefined");
					return (await adapter?.estimateGas({
						...args,
						provider,
						caipNetwork
					}))?.gas || 0n;
				}
				return 0n;
			},
			getEnsAvatar: async () => {
				await this.syncIdentity({
					address: AccountController.state.address,
					chainId: Number(this.getCaipNetwork()?.id),
					chainNamespace: ChainController.state.activeChain
				});
				return AccountController.state.profileImage || false;
			},
			getEnsAddress: async (name) => await WcHelpersUtil.resolveReownName(name),
			writeContract: async (args) => {
				const adapter = this.getAdapter(ChainController.state.activeChain);
				const caipNetwork = this.getCaipNetwork();
				const caipAddress = this.getCaipAddress();
				const provider = ProviderUtil.getProvider(ChainController.state.activeChain);
				if (!caipNetwork || !caipAddress) throw new Error("CaipNetwork or CaipAddress is undefined");
				return (await adapter?.writeContract({
					...args,
					caipNetwork,
					provider,
					caipAddress
				}))?.hash;
			},
			parseUnits: (value, decimals) => {
				return this.getAdapter(ChainController.state.activeChain)?.parseUnits({
					value,
					decimals
				}) ?? 0n;
			},
			formatUnits: (value, decimals) => {
				return this.getAdapter(ChainController.state.activeChain)?.formatUnits({
					value,
					decimals
				}) ?? "0";
			},
			getCapabilities: async (params) => {
				return await this.getAdapter(ChainController.state.activeChain)?.getCapabilities(params);
			},
			grantPermissions: async (params) => {
				return await this.getAdapter(ChainController.state.activeChain)?.grantPermissions(params);
			},
			revokePermissions: async (params) => {
				const adapter = this.getAdapter(ChainController.state.activeChain);
				if (adapter?.revokePermissions) return await adapter.revokePermissions(params);
				return "0x";
			},
			walletGetAssets: async (params) => {
				return await this.getAdapter(ChainController.state.activeChain)?.walletGetAssets(params) ?? {};
			},
			updateBalance: (namespace) => {
				const caipNetwork = this.getCaipNetwork(namespace);
				if (!caipNetwork || !AccountController.state.address) return;
				this.updateNativeBalance(AccountController.state.address, caipNetwork?.id, namespace);
			}
		};
		this.networkControllerClient = {
			switchCaipNetwork: async (caipNetwork) => await this.switchCaipNetwork(caipNetwork),
			getApprovedCaipNetworksData: async () => this.getApprovedCaipNetworksData()
		};
		ConnectionController.setClient(this.connectionControllerClient);
	}
	getApprovedCaipNetworksData() {
		if (ProviderUtil.getProviderId(ChainController.state.activeChain) === ConstantsUtil$2.CONNECTOR_TYPE_WALLET_CONNECT) {
			const namespaces = this.universalProvider?.session?.namespaces;
			return {
				supportsAllNetworks: this.universalProvider?.session?.peer?.metadata.name === "MetaMask Wallet",
				approvedCaipNetworkIds: this.getChainsFromNamespaces(namespaces)
			};
		}
		return {
			supportsAllNetworks: true,
			approvedCaipNetworkIds: []
		};
	}
	async switchCaipNetwork(caipNetwork) {
		if (!caipNetwork) return;
		const networkNamespace = caipNetwork.chainNamespace;
		if (this.getAddressByChainNamespace(caipNetwork.chainNamespace)) {
			const provider = ProviderUtil.getProvider(networkNamespace);
			const providerType = ProviderUtil.getProviderId(networkNamespace);
			if (caipNetwork.chainNamespace === ChainController.state.activeChain) await this.getAdapter(networkNamespace)?.switchNetwork({
				caipNetwork,
				provider,
				providerType
			});
			else {
				this.setCaipNetwork(caipNetwork);
				if (providerType === ConstantsUtil$2.CONNECTOR_TYPE_WALLET_CONNECT) this.syncWalletConnectAccount();
				else {
					const address = this.getAddressByChainNamespace(networkNamespace);
					if (address) this.syncAccount({
						address,
						chainId: caipNetwork.id,
						chainNamespace: networkNamespace
					});
				}
			}
		} else this.setCaipNetwork(caipNetwork);
	}
	getChainsFromNamespaces(namespaces = {}) {
		return Object.values(namespaces).flatMap((namespace) => {
			const chains = namespace.chains || [];
			const accountsChains = namespace.accounts.map((account) => {
				const { chainId, chainNamespace } = ParseUtil.parseCaipAddress(account);
				return `${chainNamespace}:${chainId}`;
			});
			return Array.from(new Set([...chains, ...accountsChains]));
		});
	}
	createAdapters(blueprints) {
		this.createClients();
		return this.chainNamespaces.reduce((adapters, namespace) => {
			const blueprint = blueprints?.find((b$3) => b$3.namespace === namespace);
			if (blueprint) {
				blueprint.construct({
					namespace,
					projectId: this.options?.projectId,
					networks: this.getCaipNetworks()
				});
				adapters[namespace] = blueprint;
			} else adapters[namespace] = new UniversalAdapter({
				namespace,
				networks: this.getCaipNetworks()
			});
			return adapters;
		}, {});
	}
	async initChainAdapter(namespace) {
		this.onConnectors(namespace);
		this.listenAdapter(namespace);
		await this.chainAdapters?.[namespace].syncConnectors(this.options, this);
		await this.createUniversalProviderForAdapter(namespace);
	}
	async initChainAdapters() {
		await Promise.all(this.chainNamespaces.map(async (namespace) => {
			await this.initChainAdapter(namespace);
		}));
	}
	onConnectors(chainNamespace) {
		this.getAdapter(chainNamespace)?.on("connectors", this.setConnectors.bind(this));
	}
	listenAdapter(chainNamespace) {
		const adapter = this.getAdapter(chainNamespace);
		if (!adapter) return;
		const connectionStatus = StorageUtil.getConnectionStatus();
		if (connectionStatus === "connected") this.setStatus("connecting", chainNamespace);
		else if (connectionStatus === "disconnected") {
			StorageUtil.clearAddressCache();
			this.setStatus(connectionStatus, chainNamespace);
		} else this.setStatus(connectionStatus, chainNamespace);
		adapter.on("switchNetwork", ({ address, chainId }) => {
			const caipNetwork = this.getCaipNetworks().find((n$1) => n$1.id === chainId || n$1.caipNetworkId === chainId);
			const isSameNamespace = ChainController.state.activeChain === chainNamespace;
			const accountAddress = ChainController.getAccountProp("address", chainNamespace);
			if (caipNetwork) {
				const account = isSameNamespace && address ? address : accountAddress;
				if (account) this.syncAccount({
					address: account,
					chainId: caipNetwork.id,
					chainNamespace
				});
			} else this.setUnsupportedNetwork(chainId);
		});
		adapter.on("disconnect", this.disconnect.bind(this, chainNamespace));
		adapter.on("connections", (connections) => {
			this.setConnections(connections, chainNamespace);
		});
		adapter.on("pendingTransactions", () => {
			const address = AccountController.state.address;
			const activeCaipNetwork = ChainController.state.activeCaipNetwork;
			if (!address || !activeCaipNetwork?.id) return;
			this.updateNativeBalance(address, activeCaipNetwork.id, activeCaipNetwork.chainNamespace);
		});
		adapter.on("accountChanged", ({ address, chainId }) => {
			const isActiveChain = ChainController.state.activeChain === chainNamespace;
			if (isActiveChain && chainId) this.syncAccount({
				address,
				chainId,
				chainNamespace
			});
			else if (isActiveChain && ChainController.state.activeCaipNetwork?.id) this.syncAccount({
				address,
				chainId: ChainController.state.activeCaipNetwork?.id,
				chainNamespace
			});
			else this.syncAccountInfo(address, chainId, chainNamespace);
			this.syncAllAccounts(chainNamespace);
		});
	}
	async createUniversalProviderForAdapter(chainNamespace) {
		await this.getUniversalProvider();
		if (this.universalProvider) this.chainAdapters?.[chainNamespace]?.setUniversalProvider?.(this.universalProvider);
	}
	async syncExistingConnection() {
		await Promise.allSettled(this.chainNamespaces.map((namespace) => this.syncNamespaceConnection(namespace)));
	}
	async syncNamespaceConnection(namespace) {
		try {
			if (namespace === ConstantsUtil.CHAIN.EVM && CoreHelperUtil.isSafeApp()) ConnectorController.setConnectorId(ConstantsUtil.CONNECTOR_ID.SAFE, namespace);
			const connectorId = ConnectorController.getConnectorId(namespace);
			this.setStatus("connecting", namespace);
			switch (connectorId) {
				case ConstantsUtil.CONNECTOR_ID.WALLET_CONNECT:
					await this.syncWalletConnectAccount();
					break;
				case ConstantsUtil.CONNECTOR_ID.AUTH: break;
				default: await this.syncAdapterConnection(namespace);
			}
		} catch (err) {
			console.warn("AppKit couldn't sync existing connection", err);
			this.setStatus("disconnected", namespace);
		}
	}
	async syncAdapterConnection(namespace) {
		const adapter = this.getAdapter(namespace);
		const connectorId = ConnectorController.getConnectorId(namespace);
		const caipNetwork = this.getCaipNetwork(namespace);
		const connector = ConnectorController.getConnectors(namespace).find((c$2) => c$2.id === connectorId);
		try {
			if (!adapter || !connector) throw new Error(`Adapter or connector not found for namespace ${namespace}`);
			if (!caipNetwork?.id) throw new Error("CaipNetwork not found");
			const connection = await adapter?.syncConnection({
				namespace,
				id: connector.id,
				chainId: caipNetwork.id,
				rpcUrl: caipNetwork?.rpcUrls?.default?.http?.[0]
			});
			if (connection) {
				const accounts = await adapter?.getAccounts({
					namespace,
					id: connector.id
				});
				if (accounts && accounts.accounts.length > 0) this.setAllAccounts(accounts.accounts, namespace);
				else this.setAllAccounts([CoreHelperUtil.createAccount(namespace, connection.address, "eoa")], namespace);
				this.syncProvider({
					...connection,
					chainNamespace: namespace
				});
				await this.syncAccount({
					...connection,
					chainNamespace: namespace
				});
				this.setStatus("connected", namespace);
			} else this.setStatus("disconnected", namespace);
		} catch (e) {
			this.setStatus("disconnected", namespace);
		}
	}
	async syncWalletConnectAccount() {
		const syncTasks = this.chainNamespaces.map(async (chainNamespace) => {
			const adapter = this.getAdapter(chainNamespace);
			const namespaceAccounts = this.universalProvider?.session?.namespaces?.[chainNamespace]?.accounts || [];
			const activeChainId = ChainController.state.activeCaipNetwork?.id;
			const sessionAddress = namespaceAccounts.find((account) => {
				const { chainId } = ParseUtil.parseCaipAddress(account);
				return chainId === activeChainId?.toString();
			}) || namespaceAccounts[0];
			if (sessionAddress) {
				const caipAddress = ParseUtil.validateCaipAddress(sessionAddress);
				const { chainId, address } = ParseUtil.parseCaipAddress(caipAddress);
				ProviderUtil.setProviderId(chainNamespace, ConstantsUtil$2.CONNECTOR_TYPE_WALLET_CONNECT);
				if (this.caipNetworks && ChainController.state.activeCaipNetwork && adapter?.namespace !== ConstantsUtil.CHAIN.EVM) {
					const provider = adapter?.getWalletConnectProvider({
						caipNetworks: this.getCaipNetworks(),
						provider: this.universalProvider,
						activeCaipNetwork: ChainController.state.activeCaipNetwork
					});
					ProviderUtil.setProvider(chainNamespace, provider);
				} else ProviderUtil.setProvider(chainNamespace, this.universalProvider);
				ConnectorController.setConnectorId(ConstantsUtil.CONNECTOR_ID.WALLET_CONNECT, chainNamespace);
				StorageUtil.addConnectedNamespace(chainNamespace);
				this.syncWalletConnectAccounts(chainNamespace);
				await this.syncAccount({
					address,
					chainId,
					chainNamespace
				});
			} else this.setStatus("disconnected", chainNamespace);
			this.syncConnectedWalletInfo(chainNamespace);
			await ChainController.setApprovedCaipNetworksData(chainNamespace);
		});
		await Promise.all(syncTasks);
	}
	syncWalletConnectAccounts(chainNamespace) {
		const addresses = this.universalProvider?.session?.namespaces?.[chainNamespace]?.accounts?.map((account) => {
			const { address } = ParseUtil.parseCaipAddress(account);
			return address;
		}).filter((address, index$1, self) => self.indexOf(address) === index$1);
		if (addresses) this.setAllAccounts(addresses.map((address) => CoreHelperUtil.createAccount(chainNamespace, address, chainNamespace === "bip122" ? "payment" : "eoa")), chainNamespace);
	}
	syncProvider({ type, provider, id, chainNamespace }) {
		ProviderUtil.setProviderId(chainNamespace, type);
		ProviderUtil.setProvider(chainNamespace, provider);
		ConnectorController.setConnectorId(id, chainNamespace);
	}
	async syncAllAccounts(namespace) {
		const connectorId = ConnectorController.getConnectorId(namespace);
		if (!connectorId) return;
		const accounts = await this.getAdapter(namespace)?.getAccounts({
			namespace,
			id: connectorId
		});
		if (accounts && accounts.accounts.length > 0) this.setAllAccounts(accounts.accounts, namespace);
	}
	async syncAccount(params) {
		const isActiveNamespace = params.chainNamespace === ChainController.state.activeChain;
		const networkOfChain = ChainController.getCaipNetworkByNamespace(params.chainNamespace, params.chainId);
		const { address, chainId, chainNamespace } = params;
		const { chainId: activeChainId } = StorageUtil.getActiveNetworkProps();
		const chainIdToUse = chainId || activeChainId;
		const isUnsupportedNetwork = ChainController.state.activeCaipNetwork?.name === ConstantsUtil.UNSUPPORTED_NETWORK_NAME;
		const shouldSupportAllNetworks = ChainController.getNetworkProp("supportsAllNetworks", chainNamespace);
		this.setStatus("connected", chainNamespace);
		if (isUnsupportedNetwork && !shouldSupportAllNetworks) return;
		if (chainIdToUse) {
			let caipNetwork = this.getCaipNetworks().find((n$1) => n$1.id.toString() === chainIdToUse.toString());
			let fallbackCaipNetwork = this.getCaipNetworks().find((n$1) => n$1.chainNamespace === chainNamespace);
			if (!shouldSupportAllNetworks && !caipNetwork && !fallbackCaipNetwork) {
				const caipNetworkIds = this.getApprovedCaipNetworkIds() || [];
				const caipNetworkId = caipNetworkIds.find((id) => ParseUtil.parseCaipNetworkId(id)?.chainId === chainIdToUse.toString());
				const fallBackCaipNetworkId = caipNetworkIds.find((id) => ParseUtil.parseCaipNetworkId(id)?.chainNamespace === chainNamespace);
				caipNetwork = this.getCaipNetworks().find((n$1) => n$1.caipNetworkId === caipNetworkId);
				fallbackCaipNetwork = this.getCaipNetworks().find((n$1) => n$1.caipNetworkId === fallBackCaipNetworkId || "deprecatedCaipNetworkId" in n$1 && n$1.deprecatedCaipNetworkId === fallBackCaipNetworkId);
			}
			const network = caipNetwork || fallbackCaipNetwork;
			if (network?.chainNamespace === ChainController.state.activeChain) if (OptionsController.state.enableNetworkSwitch && !OptionsController.state.allowUnsupportedChain && ChainController.state.activeCaipNetwork?.name === ConstantsUtil.UNSUPPORTED_NETWORK_NAME) ChainController.showUnsupportedChainUI();
			else this.setCaipNetwork(network);
			else if (!isActiveNamespace) {
				if (networkOfChain) this.setCaipNetworkOfNamespace(networkOfChain, chainNamespace);
			}
			this.syncConnectedWalletInfo(chainNamespace);
			if (!HelpersUtil.isLowerCaseMatch(address, AccountController.state.address)) this.syncAccountInfo(address, network?.id, chainNamespace);
			if (isActiveNamespace) await this.syncBalance({
				address,
				chainId: network?.id,
				chainNamespace
			});
			else await this.syncBalance({
				address,
				chainId: networkOfChain?.id,
				chainNamespace
			});
		}
	}
	async syncAccountInfo(address, chainId, chainNamespace) {
		const caipAddress = this.getCaipAddress(chainNamespace);
		const newChainId = chainId || caipAddress?.split(":")[1];
		if (!newChainId) return;
		const newCaipAddress = `${chainNamespace}:${newChainId}:${address}`;
		this.setCaipAddress(newCaipAddress, chainNamespace);
		await this.syncIdentity({
			address,
			chainId: newChainId,
			chainNamespace
		});
	}
	async syncReownName(address, chainNamespace) {
		try {
			const registeredWcNames = await this.getReownName(address);
			if (registeredWcNames[0]) {
				const wcName = registeredWcNames[0];
				this.setProfileName(wcName.name, chainNamespace);
			} else this.setProfileName(null, chainNamespace);
		} catch {
			this.setProfileName(null, chainNamespace);
		}
	}
	syncConnectedWalletInfo(chainNamespace) {
		const connectorId = ConnectorController.getConnectorId(chainNamespace);
		const providerType = ProviderUtil.getProviderId(chainNamespace);
		if (providerType === ConstantsUtil$2.CONNECTOR_TYPE_ANNOUNCED || providerType === ConstantsUtil$2.CONNECTOR_TYPE_INJECTED) {
			if (connectorId) {
				const connector = this.getConnectors().find((c$2) => c$2.id === connectorId);
				if (connector) {
					const { info, name, imageUrl } = connector;
					const icon = imageUrl || this.getConnectorImage(connector);
					this.setConnectedWalletInfo({
						name,
						icon,
						...info
					}, chainNamespace);
				}
			}
		} else if (providerType === ConstantsUtil$2.CONNECTOR_TYPE_WALLET_CONNECT) {
			const provider = ProviderUtil.getProvider(chainNamespace);
			if (provider?.session) this.setConnectedWalletInfo({
				...provider.session.peer.metadata,
				name: provider.session.peer.metadata.name,
				icon: provider.session.peer.metadata.icons?.[0]
			}, chainNamespace);
		} else if (connectorId) {
			if (connectorId === ConstantsUtil.CONNECTOR_ID.COINBASE) {
				const connector = this.getConnectors().find((c$2) => c$2.id === ConstantsUtil.CONNECTOR_ID.COINBASE);
				this.setConnectedWalletInfo({
					name: "Coinbase Wallet",
					icon: this.getConnectorImage(connector)
				}, chainNamespace);
			}
		}
	}
	async syncBalance(params) {
		if (!NetworkUtil.getNetworksByNamespace(this.getCaipNetworks(), params.chainNamespace).find((n$1) => n$1.id.toString() === params.chainId?.toString()) || !params.chainId) return;
		await this.updateNativeBalance(params.address, params.chainId, params.chainNamespace);
	}
	async ready() {
		await this.readyPromise;
	}
	async updateNativeBalance(address, chainId, namespace) {
		const adapter = this.getAdapter(namespace);
		const caipNetwork = ChainController.getCaipNetworkByNamespace(namespace, chainId);
		if (adapter) {
			const balance = await adapter.getBalance({
				address,
				chainId,
				caipNetwork,
				tokens: this.options.tokens
			});
			this.setBalance(balance.balance, balance.symbol, namespace);
			return balance;
		}
	}
	async initializeUniversalAdapter() {
		const logger = LoggerUtil.createLogger((error, ...args) => {
			if (error) this.handleAlertError(error);
			console.error(...args);
		});
		const universalProviderOptions = {
			projectId: this.options?.projectId,
			metadata: {
				name: this.options?.metadata ? this.options?.metadata.name : "",
				description: this.options?.metadata ? this.options?.metadata.description : "",
				url: this.options?.metadata ? this.options?.metadata.url : "",
				icons: this.options?.metadata ? this.options?.metadata.icons : [""]
			},
			logger
		};
		OptionsController.setManualWCControl(Boolean(this.options?.manualWCControl));
		this.universalProvider = this.options.universalProvider ?? await B.init(universalProviderOptions);
		this.listenWalletConnect();
	}
	listenWalletConnect() {
		if (this.universalProvider) {
			this.universalProvider.on("display_uri", (uri) => {
				ConnectionController.setUri(uri);
			});
			this.universalProvider.on("connect", ConnectionController.finalizeWcConnection);
			this.universalProvider.on("disconnect", () => {
				this.chainNamespaces.forEach((namespace) => {
					this.resetAccount(namespace);
				});
				ConnectionController.resetWcConnection();
			});
			this.universalProvider.on("chainChanged", (chainId) => {
				const caipNetwork = this.getCaipNetworks().find((c$2) => c$2.id == chainId);
				const currentCaipNetwork = this.getCaipNetwork();
				if (!caipNetwork) {
					this.setUnsupportedNetwork(chainId);
					return;
				}
				if (currentCaipNetwork?.id !== caipNetwork?.id) this.setCaipNetwork(caipNetwork);
			});
			this.universalProvider.on("session_event", (callbackData) => {
				if (WcHelpersUtil.isSessionEventData(callbackData)) {
					const { name, data } = callbackData.params.event;
					if (name === "accountsChanged" && Array.isArray(data) && CoreHelperUtil.isCaipAddress(data[0])) this.syncAccount(ParseUtil.parseCaipAddress(data[0]));
				}
			});
		}
	}
	createUniversalProvider() {
		if (!this.universalProviderInitPromise && CoreHelperUtil.isClient() && this.options?.projectId) this.universalProviderInitPromise = this.initializeUniversalAdapter();
		return this.universalProviderInitPromise;
	}
	async getUniversalProvider() {
		if (!this.universalProvider) try {
			await this.createUniversalProvider();
		} catch (err) {
			EventsController.sendEvent({
				type: "error",
				event: "INTERNAL_SDK_ERROR",
				properties: {
					errorType: "UniversalProviderInitError",
					errorMessage: err instanceof Error ? err.message : "Unknown",
					uncaught: false
				}
			});
			console.error("AppKit:getUniversalProvider - Cannot create provider", err);
		}
		return this.universalProvider;
	}
	handleAlertError(error) {
		const [errorKey, errorValue] = Object.entries(ErrorUtil.UniversalProviderErrors).find(([, { message: message$1 }]) => error.message.includes(message$1)) ?? [];
		const { message, alertErrorKey } = errorValue ?? {};
		if (errorKey && message && !this.reportedAlertErrors[errorKey]) {
			const alertError = ErrorUtil.ALERT_ERRORS[alertErrorKey];
			if (alertError) {
				AlertController.open(alertError, "error");
				this.reportedAlertErrors[errorKey] = true;
			}
		}
	}
	getAdapter(namespace) {
		if (!namespace) return;
		return this.chainAdapters?.[namespace];
	}
	createAdapter(blueprint) {
		if (!blueprint) return;
		const namespace = blueprint.namespace;
		if (!namespace) return;
		this.createClients();
		const adapterBlueprint = blueprint;
		adapterBlueprint.namespace = namespace;
		adapterBlueprint.construct({
			namespace,
			projectId: this.options?.projectId,
			networks: this.getCaipNetworks()
		});
		if (!this.chainNamespaces.includes(namespace)) this.chainNamespaces.push(namespace);
		if (this.chainAdapters) this.chainAdapters[namespace] = adapterBlueprint;
	}
	async open(options) {
		await this.injectModalUi();
		if (options?.uri) ConnectionController.setUri(options.uri);
		if (options?.arguments) switch (options?.view) {
			case "Swap": return ModalController.open({
				...options,
				data: { swap: options.arguments }
			});
			default:
		}
		return ModalController.open(options);
	}
	async close() {
		await this.injectModalUi();
		ModalController.close();
	}
	setLoading(loading, namespace) {
		ModalController.setLoading(loading, namespace);
	}
	async disconnect(chainNamespace) {
		await ConnectionController.disconnect(chainNamespace);
	}
	getSIWX() {
		return OptionsController.state.siwx;
	}
	getError() {
		return "";
	}
	getChainId() {
		return ChainController.state.activeCaipNetwork?.id;
	}
	async switchNetwork(appKitNetwork) {
		const network = this.getCaipNetworks().find((n$1) => n$1.id === appKitNetwork.id);
		if (!network) {
			AlertController.open(ErrorUtil.ALERT_ERRORS.SWITCH_NETWORK_NOT_FOUND, "error");
			return;
		}
		await ChainController.switchActiveNetwork(network);
	}
	getWalletProvider() {
		return ChainController.state.activeChain ? ProviderUtil.state.providers[ChainController.state.activeChain] : null;
	}
	getWalletProviderType() {
		return ProviderUtil.getProviderId(ChainController.state.activeChain);
	}
	subscribeProviders(callback) {
		return ProviderUtil.subscribeProviders(callback);
	}
	getThemeMode() {
		return ThemeController.state.themeMode;
	}
	getThemeVariables() {
		return ThemeController.state.themeVariables;
	}
	setThemeMode(themeMode) {
		ThemeController.setThemeMode(themeMode);
		setColorTheme(ThemeController.state.themeMode);
	}
	setTermsConditionsUrl(termsConditionsUrl) {
		OptionsController.setTermsConditionsUrl(termsConditionsUrl);
	}
	setPrivacyPolicyUrl(privacyPolicyUrl) {
		OptionsController.setPrivacyPolicyUrl(privacyPolicyUrl);
	}
	setThemeVariables(themeVariables) {
		ThemeController.setThemeVariables(themeVariables);
		setThemeVariables(ThemeController.state.themeVariables);
	}
	subscribeTheme(callback) {
		return ThemeController.subscribe(callback);
	}
	getWalletInfo() {
		return AccountController.state.connectedWalletInfo;
	}
	getAccount(namespace) {
		const authConnector = ConnectorController.getAuthConnector(namespace);
		const accountState = ChainController.getAccountData(namespace);
		const activeChain = ChainController.state.activeChain;
		const activeConnectorId = StorageUtil.getConnectedConnectorId(namespace || activeChain);
		if (!accountState) return;
		return {
			allAccounts: accountState.allAccounts,
			caipAddress: accountState.caipAddress,
			address: CoreHelperUtil.getPlainAddress(accountState.caipAddress),
			isConnected: Boolean(accountState.caipAddress),
			status: accountState.status,
			embeddedWalletInfo: authConnector && activeConnectorId === ConstantsUtil.CONNECTOR_ID.AUTH ? {
				user: accountState.user ? {
					...accountState.user,
					username: StorageUtil.getConnectedSocialUsername()
				} : void 0,
				authProvider: accountState.socialProvider || "email",
				accountType: accountState.preferredAccountTypes?.[namespace || activeChain],
				isSmartAccountDeployed: Boolean(accountState.smartAccountDeployed)
			} : void 0
		};
	}
	subscribeAccount(callback, namespace) {
		const updateVal = () => {
			const account = this.getAccount(namespace);
			if (!account) return;
			callback(account);
		};
		if (namespace) ChainController.subscribeChainProp("accountState", updateVal, namespace);
		else ChainController.subscribe(updateVal);
		ConnectorController.subscribe(updateVal);
	}
	subscribeNetwork(callback) {
		return ChainController.subscribe(({ activeCaipNetwork }) => {
			callback({
				caipNetwork: activeCaipNetwork,
				chainId: activeCaipNetwork?.id,
				caipNetworkId: activeCaipNetwork?.caipNetworkId
			});
		});
	}
	subscribeWalletInfo(callback) {
		return AccountController.subscribeKey("connectedWalletInfo", callback);
	}
	subscribeShouldUpdateToAddress(callback) {
		AccountController.subscribeKey("shouldUpdateToAddress", callback);
	}
	subscribeCaipNetworkChange(callback) {
		ChainController.subscribeKey("activeCaipNetwork", callback);
	}
	getState() {
		return PublicStateController.state;
	}
	subscribeState(callback) {
		return PublicStateController.subscribe(callback);
	}
	showErrorMessage(message) {
		SnackController.showError(message);
	}
	showSuccessMessage(message) {
		SnackController.showSuccess(message);
	}
	getEvent() {
		return { ...EventsController.state };
	}
	subscribeEvents(callback) {
		return EventsController.subscribe(callback);
	}
	replace(route) {
		RouterController.replace(route);
	}
	redirect(route) {
		RouterController.push(route);
	}
	popTransactionStack(status) {
		RouterController.popTransactionStack(status);
	}
	isOpen() {
		return ModalController.state.open;
	}
	isTransactionStackEmpty() {
		return RouterController.state.transactionStack.length === 0;
	}
	static getInstance() {
		return this.instance;
	}
	updateFeatures(newFeatures) {
		OptionsController.setFeatures(newFeatures);
	}
	updateRemoteFeatures(newRemoteFeatures) {
		OptionsController.setRemoteFeatures(newRemoteFeatures);
	}
	updateOptions(newOptions) {
		const updatedOptions = {
			...OptionsController.state || {},
			...newOptions
		};
		OptionsController.setOptions(updatedOptions);
	}
	setConnectMethodsOrder(connectMethodsOrder) {
		OptionsController.setConnectMethodsOrder(connectMethodsOrder);
	}
	setWalletFeaturesOrder(walletFeaturesOrder) {
		OptionsController.setWalletFeaturesOrder(walletFeaturesOrder);
	}
	setCollapseWallets(collapseWallets) {
		OptionsController.setCollapseWallets(collapseWallets);
	}
	setSocialsOrder(socialsOrder) {
		OptionsController.setSocialsOrder(socialsOrder);
	}
	getConnectMethodsOrder() {
		return WalletUtil.getConnectOrderMethod(OptionsController.state.features, ConnectorController.getConnectors());
	}
	addNetwork(namespace, network) {
		if (this.chainAdapters && !this.chainAdapters[namespace]) throw new Error(`Adapter for namespace ${namespace} doesn't exist`);
		const extendedNetwork = this.extendCaipNetwork(network, this.options);
		if (!this.getCaipNetworks().find((n$1) => n$1.id === extendedNetwork.id)) ChainController.addNetwork(extendedNetwork);
	}
	removeNetwork(namespace, networkId) {
		if (this.chainAdapters && !this.chainAdapters[namespace]) throw new Error(`Adapter for namespace ${namespace} doesn't exist`);
		if (!this.getCaipNetworks().find((n$1) => n$1.id === networkId)) return;
		ChainController.removeNetwork(namespace, networkId);
	}
};
var isInitialized = false;
var AppKit = class extends AppKitBaseClient {
	async open(options) {
		if (!ConnectorController.isConnected()) await super.open(options);
	}
	async close() {
		await super.close();
		if (this.options.manualWCControl) ConnectionController.finalizeWcConnection();
	}
	async syncIdentity(_request) {
		return Promise.resolve();
	}
	async syncBalance(_params) {
		return Promise.resolve();
	}
	async injectModalUi() {
		if (!isInitialized && CoreHelperUtil.isClient()) {
			await __vitePreload(() => import("./basic-Bx7U79E3.js"), __vite__mapDeps([4,1,2,5,6,7,8]));
			await __vitePreload(() => import("./w3m-modal-C3aiu4Ji.js"), __vite__mapDeps([9,5,6,1,2,7,10]));
			if (!document.querySelector("w3m-modal")) {
				const modal = document.createElement("w3m-modal");
				if (!OptionsController.state.disableAppend && !OptionsController.state.enableEmbedded) document.body.insertAdjacentElement("beforeend", modal);
			}
			isInitialized = true;
		}
	}
};
const PACKAGE_VERSION = "1.7.8";
function createAppKit(options) {
	return new AppKit({
		...options,
		basic: true,
		sdkVersion: `html-core-${PACKAGE_VERSION}`
	});
}
export { AppKit, createAppKit };
