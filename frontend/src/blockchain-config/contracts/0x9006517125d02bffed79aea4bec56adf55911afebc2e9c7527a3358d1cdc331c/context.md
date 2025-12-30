# ViePredictionMarketUSDC Context

This contract is the main entry point for interacting with prediction markets using USDC as the collateral.

## USDC and Outcome Token Decimals

- All outcome tokens and USDC tokens have **6 decimals**.
- Outcome token IDs are 1-indexed.

## Market Identifiers

- Each _market_ is identified by its own **VieMarketInventory** contract address (called `marketId`), which is also an ERC-1155 contract for the outcome tokens.

## Buying Outcome Token Shares

To buy shares of an outcome token:
1. **Quote the Cost**: Use `useReadContract` with the function:
   ```
   quoteBuy(address marketId, uint256 outcomeId, uint256 sharesToBuy)
   ```
   This will return the expected cost in USDC to buy a specific amount of shares of a specific outcome.

2. **Permit Signature**: Once the user approves the quote, create a valid Permit signature (with the `usePermitSignature` hook) for spending USDC, using a `cost` value equal to the quoted cost **plus 5%** (slippage buffer).

3. **Execute the Purchase**: Call
   ```
   buyWithPermitSignature(address marketId, uint256 outcomeId, uint256 sharesToBuy, uint256 maxCost, PermitSignaturePayload memory sig)
   ```
   - Pass the signed Permit payload.
   - Use the quoted cost **plus 5%** for `maxCost`.

IMPORTANT: Make sure to immediately trigger the useWriteContractLifecycle transaction after the permit signature is constructed.

## Selling Outcome Token Shares

To sell shares:
1. **Quote the Payout**: Use `useReadContract` with
   ```
   quoteSell(address marketId, uint256 outcomeId, uint256 sharesToSell)
   ```
   This returns the expected USDC payout for selling outcome shares.

2. **Check Approval**: Before selling, check if the contract is approved to spend the user's ERC-1155 outcome tokens. If not, call:
   ```
   setApprovalForAll(address operator, bool approved)
   ```
   Where `operator` is the ViePredictionMarketUSDC contract address.

3. **Execute the Sell**: Call
   ```
   sell(address marketId, uint256 outcomeId, uint256 sharesToSell)
   ```
   - Use a `minPayout` equal to the quoted payout **minus 5%** (slippage buffer).

## Redeeming Winning Shares

After a market is resolved and the user holds shares in the winning outcome:
- Use
  ```
  redeem(address marketId, uint256 outcomeId, uint256 shares)
  ```
  to redeem each share for one USDC.

## Resolving Markets

When implementing a UI for a prediction market, always try to implement a UI only visible to the resolver that lets the resolver resolve the market.

To resolve a market (admin only):
- Use
  ```
  resolve(address marketId, uint256 winningOutcomeId)
  ```
  Only show this option in the UI if the connected wallet is the resolver.

## Signature Gotchas

When using permit signatures:
> **ALWAYS re-use the deadline that's been encoded into the signature. NEVER re-instantiate a new deadline value to pass to the contract.**

## Example/UI Note

When implementing the buy/sell flows, look at `src/components/examples/SwapWidgetExample.tsx` for a hands-on reference of how to handle permit-signing flows (but you don't have to simulate any transactions in this case).

## Price History

To retrieve price history of an outcome token, use the `useQueryEvents` hook to fetch the `OutcomeTraded` event history. Each event gives the historical price.

## UI

When building a UI for a prediction market, ALMOST ALWAYS show each outcome's share price (in USDC).


## Getting Market State

To get the current state of a market, use the following two functions:

- `getMarket(address marketId)`: Returns all current state data for the given market.
- `getUserBalances(address marketId, address user)`: Returns the user's outcome token share balances and collateral contributions.

These should be the primary read functions for presenting market and user state in your UI.

## Quoting Buy & Sell Amounts

To quote the expected USDC cost or payout before buying or selling shares:

- **Buy Quote**: Use `quoteBuy(address marketId, uint256 outcomeId, uint256 sharesToBuy)` to get the USDC required to buy a given number of shares.
- **Sell Quote**: Use `quoteSell(address user, address marketId, uint256 outcomeId, uint256 sharesToSell)` to get the expected USDC payout for selling shares.

You should always display the quoted value in the UI (e.g., "Expected cost: $X.XX" or "Expected payout: $X.XX" under the buy/sell button). These read functions may revert (e.g., if the user does not have enough USDC or sells more than they own) — handle errors gracefully in the UI.

## Price History or Chart

To display historical price information for outcome tokens:

- Use the `useQueryEvents` hook to fetch the `OutcomeTraded` event log for the market and outcome.
- Each emission of the `OutcomeTraded` event contains price data for the given outcome at that time.

This enables you to build a price chart or show price history for each outcome.


---