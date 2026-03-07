import { $ as readContract, $n as sendTransaction$1, G as switchChain, H as watchConnectors, J as getConnectors, K as reconnect, Ka as hexToString, Q as readContracts, U as watchChainId, W as watchAccount, X as getChainId, Y as getChains, Z as getBalance, et as multicall, it as getAction, ln as waitForTransactionReceipt$1, nr as call, nt as getConnectorClient, pn as getTransaction, q as getWalletClient, rt as connect, tt as getAccount } from "./index-BOu-R1IX.js";
async function sendTransaction(config, parameters) {
	const { account, chainId, connector,...rest } = parameters;
	let client;
	if (typeof account === "object" && account?.type === "local") client = config.getClient({ chainId });
	else client = await getConnectorClient(config, {
		account: account ?? void 0,
		chainId,
		connector
	});
	return await getAction(client, sendTransaction$1, "sendTransaction")({
		...rest,
		...account ? { account } : {},
		chain: chainId ? { id: chainId } : null,
		gas: rest.gas ?? void 0
	});
}
async function waitForTransactionReceipt(config, parameters) {
	const { chainId, timeout = 0,...rest } = parameters;
	const client = config.getClient({ chainId });
	const receipt = await getAction(client, waitForTransactionReceipt$1, "waitForTransactionReceipt")({
		...rest,
		timeout
	});
	if (receipt.status === "reverted") {
		const txn = await getAction(client, getTransaction, "getTransaction")({ hash: receipt.transactionHash });
		const code = await getAction(client, call, "call")({
			...txn,
			data: txn.input,
			gasPrice: txn.type !== "eip1559" ? txn.gasPrice : void 0,
			maxFeePerGas: txn.type === "eip1559" ? txn.maxFeePerGas : void 0,
			maxPriorityFeePerGas: txn.type === "eip1559" ? txn.maxPriorityFeePerGas : void 0
		});
		const reason = code?.data ? hexToString(`0x${code.data.substring(138)}`) : "unknown reason";
		throw new Error(reason);
	}
	return {
		...receipt,
		chainId: client.chain.id
	};
}
export { connect, getBalance as fetchBalance, getBalance, getAccount, getChainId, getChains, getConnectorClient, getConnectors, getWalletClient, multicall, readContract, readContracts, reconnect, sendTransaction, switchChain, switchChain as switchNetwork, waitForTransactionReceipt as waitForTransaction, waitForTransactionReceipt, watchAccount, watchChainId, watchConnectors };
