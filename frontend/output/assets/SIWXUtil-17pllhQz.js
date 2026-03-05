import { $t as require_events, Zo as __toESM } from "./index-DvCBuJa1.js";
import { C as EventsController, F as ConstantsUtil, O as OptionsController, _ as SnackController, d as AccountController, g as ConnectionController, k as CoreHelperUtil, p as ChainController, u as ModalController, v as W3mFrameRpcConstants, x as RouterController, y as ConnectorController } from "./ConstantsUtil-BkAzooxe.js";
require_events();
const SIWXUtil = {
	getSIWX() {
		return OptionsController.state.siwx;
	},
	async initializeIfEnabled() {
		const siwx = OptionsController.state.siwx;
		const caipAddress = ChainController.getActiveCaipAddress();
		if (!(siwx && caipAddress)) return;
		const [namespace, chainId, address] = caipAddress.split(":");
		if (!ChainController.checkIfSupportedNetwork(namespace)) return;
		try {
			if ((await siwx.getSessions(`${namespace}:${chainId}`, address)).length) return;
			await ModalController.open({ view: "SIWXSignMessage" });
		} catch (error) {
			console.error("SIWXUtil:initializeIfEnabled", error);
			EventsController.sendEvent({
				type: "track",
				event: "SIWX_AUTH_ERROR",
				properties: this.getSIWXEventProperties()
			});
			await ConnectionController._getClient()?.disconnect().catch(console.error);
			RouterController.reset("Connect");
			SnackController.showError("A problem occurred while trying initialize authentication");
		}
	},
	async requestSignMessage() {
		const siwx = OptionsController.state.siwx;
		const address = CoreHelperUtil.getPlainAddress(ChainController.getActiveCaipAddress());
		const network = ChainController.getActiveCaipNetwork();
		const client = ConnectionController._getClient();
		if (!siwx) throw new Error("SIWX is not enabled");
		if (!address) throw new Error("No ActiveCaipAddress found");
		if (!network) throw new Error("No ActiveCaipNetwork or client found");
		if (!client) throw new Error("No ConnectionController client found");
		try {
			const siwxMessage = await siwx.createMessage({
				chainId: network.caipNetworkId,
				accountAddress: address
			});
			const message = siwxMessage.toString();
			if (ConnectorController.getConnectorId(network.chainNamespace) === ConstantsUtil.CONNECTOR_ID.AUTH) RouterController.pushTransactionStack({});
			const signature = await client.signMessage(message);
			await siwx.addSession({
				data: siwxMessage,
				message,
				signature
			});
			ModalController.close();
			EventsController.sendEvent({
				type: "track",
				event: "SIWX_AUTH_SUCCESS",
				properties: this.getSIWXEventProperties()
			});
		} catch (error) {
			const properties = this.getSIWXEventProperties();
			if (!ModalController.state.open || RouterController.state.view === "ApproveTransaction") await ModalController.open({ view: "SIWXSignMessage" });
			if (properties.isSmartAccount) SnackController.showError("This application might not support Smart Accounts");
			else SnackController.showError("Signature declined");
			EventsController.sendEvent({
				type: "track",
				event: "SIWX_AUTH_ERROR",
				properties
			});
			console.error("SWIXUtil:requestSignMessage", error);
		}
	},
	async cancelSignMessage() {
		try {
			if (this.getSIWX()?.getRequired?.()) await ConnectionController.disconnect();
			else ModalController.close();
			RouterController.reset("Connect");
			EventsController.sendEvent({
				event: "CLICK_CANCEL_SIWX",
				type: "track",
				properties: this.getSIWXEventProperties()
			});
		} catch (error) {
			console.error("SIWXUtil:cancelSignMessage", error);
		}
	},
	async getSessions() {
		const siwx = OptionsController.state.siwx;
		const address = CoreHelperUtil.getPlainAddress(ChainController.getActiveCaipAddress());
		const network = ChainController.getActiveCaipNetwork();
		if (!(siwx && address && network)) return [];
		return siwx.getSessions(network.caipNetworkId, address);
	},
	async isSIWXCloseDisabled() {
		const siwx = this.getSIWX();
		if (siwx) {
			const isApproveSignScreen = RouterController.state.view === "ApproveTransaction";
			const isSiwxSignMessage = RouterController.state.view === "SIWXSignMessage";
			if (isApproveSignScreen || isSiwxSignMessage) return siwx.getRequired?.() && (await this.getSessions()).length === 0;
		}
		return false;
	},
	async universalProviderAuthenticate({ universalProvider, chains, methods }) {
		const siwx = SIWXUtil.getSIWX();
		const namespaces = new Set(chains.map((chain) => chain.split(":")[0]));
		if (!siwx || namespaces.size !== 1 || !namespaces.has("eip155")) return false;
		const siwxMessage = await siwx.createMessage({
			chainId: ChainController.getActiveCaipNetwork()?.caipNetworkId || "",
			accountAddress: ""
		});
		const result = await universalProvider.authenticate({
			nonce: siwxMessage.nonce,
			domain: siwxMessage.domain,
			uri: siwxMessage.uri,
			exp: siwxMessage.expirationTime,
			iat: siwxMessage.issuedAt,
			nbf: siwxMessage.notBefore,
			requestId: siwxMessage.requestId,
			version: siwxMessage.version,
			resources: siwxMessage.resources,
			statement: siwxMessage.statement,
			chainId: siwxMessage.chainId,
			methods,
			chains: [siwxMessage.chainId, ...chains.filter((chain) => chain !== siwxMessage.chainId)]
		});
		SnackController.showLoading("Authenticating...", { autoClose: false });
		AccountController.setConnectedWalletInfo({
			...result.session.peer.metadata,
			name: result.session.peer.metadata.name,
			icon: result.session.peer.metadata.icons?.[0],
			type: "WALLET_CONNECT"
		}, Array.from(namespaces)[0]);
		if (result?.auths?.length) {
			const sessions = result.auths.map((cacao) => {
				const message = universalProvider.client.formatAuthMessage({
					request: cacao.p,
					iss: cacao.p.iss
				});
				return {
					data: {
						...cacao.p,
						accountAddress: cacao.p.iss.split(":").slice(-1).join(""),
						chainId: cacao.p.iss.split(":").slice(2, 4).join(":"),
						uri: cacao.p.aud,
						version: cacao.p.version || siwxMessage.version,
						expirationTime: cacao.p.exp,
						issuedAt: cacao.p.iat,
						notBefore: cacao.p.nbf
					},
					message,
					signature: cacao.s.s,
					cacao
				};
			});
			try {
				await siwx.setSessions(sessions);
				EventsController.sendEvent({
					type: "track",
					event: "SIWX_AUTH_SUCCESS",
					properties: SIWXUtil.getSIWXEventProperties()
				});
			} catch (error) {
				console.error("SIWX:universalProviderAuth - failed to set sessions", error);
				EventsController.sendEvent({
					type: "track",
					event: "SIWX_AUTH_ERROR",
					properties: SIWXUtil.getSIWXEventProperties()
				});
				await universalProvider.disconnect().catch(console.error);
				throw error;
			} finally {
				SnackController.hide();
			}
		}
		return true;
	},
	getSIWXEventProperties() {
		const activeChainNamespace = ChainController.state.activeChain;
		return {
			network: ChainController.state.activeCaipNetwork?.caipNetworkId || "",
			isSmartAccount: AccountController.state.preferredAccountTypes?.[activeChainNamespace] === W3mFrameRpcConstants.ACCOUNT_TYPES.SMART_ACCOUNT
		};
	},
	async clearSessions() {
		const siwx = this.getSIWX();
		if (siwx) await siwx.setSessions([]);
	}
};
export { SIWXUtil as t };
