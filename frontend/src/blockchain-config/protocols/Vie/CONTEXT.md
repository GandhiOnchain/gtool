# Context

- When creating tokens via the VieFactory, use the Uniswap SDK to calculate the correct startingPrice to pass in

- Use the VieTokenSwapManager to handle all swaps / buys / sells of a VieToken. Prefer to use the method with permit signatures when swapping tokens for ETH. Simulate the transaction always to show the user the amount they're expected to get back. Then when calling the transaction (with an approval signature that the user has signed, pass in a minimum amount out that is 95% of the simulated expected amount back - this amounts to a slippage of 5%).

- Use the ViePredictionMarketUSDC to handle buys / sells of outcome tokens of a prediction market. Prefer to use the method with permit signatures when buying outcome token shares with USDC. Simulate the transaction always to show the user the amount of USDC they're expected to pay. Then when calling the transaction (with an approval signature that the user has signed, pass in a maximum amount of USDC in that is 105% of the simulated expected USDC amount in - this amounts to a slippage of 5%).