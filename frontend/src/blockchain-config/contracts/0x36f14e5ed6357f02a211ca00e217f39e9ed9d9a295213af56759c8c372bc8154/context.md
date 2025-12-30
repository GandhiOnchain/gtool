# Important Example

IMPORTANT: LOOK at how swapping is implemented in src/components/examples/SwapWidgetExample.tsx for reference. Make the swap widget look great.

## Signature Gotchas

When using the permit signature, ALWAYS re-use the deadline that's been encoded into the signature, NEVER re-instantiate a new deadline value to pass into the contract.

## How to Implement Buying and Selling

If you haven't read context elsewhere (like via the `buyTokenContext` and `sellTokenContext` fields of the metadata of a VieToken deployment in `deployments.ts`) on how to implement buying or selling via this contract (the VieTokenSwapManager), read on:

### Buying the token

To swap ETH for this token (a buy), use the function swapExactEthAmountForToken(address token, uint128 exactEthAmountIn, uint128 minimumTokenAmountOut) external payable function on the VieTokenSwapManager. Make sure to first simulate the transaction by using the useSimulateTransactions hook with a very small amount passed in to minimumTokenAmountOut (non-zero), and then show the result of the simulation to the user in the swap widget. Once they approve a quote, pass the result of the quote minus 5% of it (so 5% slippage) into minimumTokenAmountOut, when actually executing the transaction. Make sure to populate the value field of the transaction with the same value as exactEthAmountIn.

### Selling the token

To swap this token for ETH (a sell), use the function swapExactTokenAmountForEthWithPermitSignature(address token, uint128 exactTokenAmountIn, uint128 minimumEthAmountOut, PermitSignaturePayload memory sig) external function on the VieTokenSwapManager. Make sure to first simulate the transaction by using the useSimulateTransactions hook with 2 transactions: 1) an initial approval transaction to the token contract that approves the VieTokenSwapManager to move the exact amount of tokens you\'re passing in, and 2) a call to swapExactTokenAmountForEth(address token, uint128 exactTokenAmountIn, uint128 minimumEthAmountOut) with a very small amount passed in to minimumEthAmountOut (non-zero), and then show the result of the simulation to the user in the swap widget. The result of the simulation is the return value, NOT in the asset changes. Once they approve a quote, first construct a valid Permit signature with the usePermitSignature hook, have the user sign it with their wallet via the signPermit function, and then pass the Permit signature along with the rest of the parameters (particularly, pass the result of the quote minus 5% of it (so 5% slippage) into minimumEthAmountOut), when actually executing the transaction.