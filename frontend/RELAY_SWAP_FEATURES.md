# Relay Swap - Farcaster Mini App

A comprehensive token swap interface built as a Farcaster Mini App, integrating the Relay API for cross-chain swaps across 85+ chains.

## Features Implemented

### Core Swap Functionality
- ✅ **Multi-Chain Swaps**: Swap any token across 85+ supported chains
- ✅ **Real-time Quotes**: Live pricing and fee estimation using Relay API
- ✅ **Chain & Token Selection**: Visual selectors with logos for all chains and tokens
- ✅ **Balance Display**: Shows available balance after selecting chain and token
- ✅ **Slippage Control**: Customizable slippage tolerance in settings
- ✅ **Contract Address Search**: Find any token by pasting contract address

### Batch Cleanup Swaps
- ✅ **Multi-Token Selection**: Select multiple tokens from your wallet
- ✅ **Batch Execution**: Swap multiple tokens to a single destination token
- ✅ **Individual Amount Control**: Set custom amounts for each token in batch
- ✅ **Multi-Input Quote API**: Uses Relay's advanced multi-input swap endpoint

### Trending Tokens
- ✅ **Farcaster Integration**: Displays trending tokens from Farcaster wallet
- ✅ **Real-time Data**: Fetches from Warpcast API
- ✅ **Price Changes**: Shows 24h price change percentages
- ✅ **Quick Selection**: Tap to instantly select trending tokens
- ✅ **Scrollable List**: Compact view under swap button

### Swap History
- ✅ **Transaction Tracking**: Complete history of all swaps
- ✅ **Status Monitoring**: Real-time status updates (waiting, pending, success, etc.)
- ✅ **Transaction Details**: From/to tokens, amounts, chains, timestamps
- ✅ **Shareable Receipts**: Share swap receipts directly to Farcaster

### Daily Streak System
- ✅ **Streak Tracking**: Counts consecutive days of swapping
- ✅ **Persistent Storage**: Saves streak data in localStorage
- ✅ **Visual Indicator**: Flame icon with current streak count
- ✅ **Auto-Update**: Updates on each successful swap

### Leaderboard
- ✅ **Top Swappers**: Weekly leaderboard of most active users
- ✅ **Ranking System**: Automatic ranking based on swap count
- ✅ **Volume Tracking**: Tracks total swap volume per user
- ✅ **Persistent Data**: Stored locally and updated in real-time

### Farcaster Mini App Integration
- ✅ **SDK Integration**: Proper Farcaster Mini App SDK setup
- ✅ **Manifest File**: Complete farcaster.json configuration
- ✅ **Meta Tags**: fc:miniapp meta tags in HTML
- ✅ **Wagmi Connector**: Farcaster Mini App wagmi connector integrated
- ✅ **Auto-ready**: Calls sdk.actions.ready() on load

### UI/UX Optimizations
- ✅ **Mobile-First**: Optimized for 424x695px Warpcast dimensions
- ✅ **Compact Layout**: All features accessible without scrolling main view
- ✅ **4 Tabs**: Swap, Batch, History, Settings
- ✅ **Chain/Token Logos**: Visual logos throughout the interface
- ✅ **Dark Theme**: Brutal theme with purple/pink accents
- ✅ **Responsive Dialogs**: Modal selectors for chains and tokens
- ✅ **Loading States**: Clear feedback during quote fetching and swapping

## Relay API Integration

### Endpoints Implemented
1. **GET /chains** - Fetch all supported chains
2. **POST /currencies/v2** - Get tokens for specific chains
3. **POST /quote/v2** - Get swap quotes with full details
4. **GET /intents/status/v3** - Monitor swap status
5. **GET /requests/v2** - Fetch swap history
6. **POST /execute/swap/multi-input** - Batch swap quotes
7. **GET /currencies/token/price** - Get token prices
8. **POST /transactions/index** - Index transactions
9. **POST /transactions/single** - Index single transaction
10. **GET /swap-sources** - Get available swap sources

### Advanced Features
- ✅ **Slippage Tolerance**: Configurable in basis points
- ✅ **Gas Estimation**: Real-time gas fee calculation
- ✅ **Time Estimates**: Expected swap completion time
- ✅ **Rate Display**: Exchange rate between tokens
- ✅ **Fee Breakdown**: Detailed fee structure (gas, relayer, service)
- ✅ **External Search**: Search for tokens not in default list
- ✅ **Multi-VM Support**: Works with EVM and other VM types

## Technical Implementation

### State Management
- React hooks for local state
- localStorage for persistence (streaks, leaderboard, history)
- Real-time updates via Relay API polling

### Wallet Integration
- Wagmi hooks for wallet connection
- Balance fetching with useBalance
- Transaction sending with useSendTransaction
- Receipt monitoring with useWaitForTransactionReceipt

### Error Handling
- Toast notifications for all user actions
- Graceful API error handling
- Transaction failure recovery
- Status monitoring with retry logic

### Performance
- Debounced quote fetching (500ms)
- Efficient re-renders with proper dependencies
- Lazy loading of token lists
- Optimized image loading for logos

## User Flow

### Standard Swap
1. Connect wallet (auto-connects in Farcaster)
2. Select origin chain and token
3. Select destination chain and token
4. Enter amount
5. Review quote (rate, fees, time)
6. Execute swap
7. Monitor status
8. View in history

### Batch Cleanup
1. Navigate to Batch tab
2. Add multiple tokens from wallet
3. Set amounts for each token
4. Select destination chain and token
5. Execute batch swap
6. All tokens swapped in sequence

### Trending Tokens
1. View trending list under swap button
2. Tap any trending token
3. Auto-populates in swap interface
4. See price change and volume data

## Data Persistence

### LocalStorage Keys
- `streak_{address}` - User's swap streak data
- `leaderboard` - Global leaderboard data
- Swap history fetched from Relay API

## Future Enhancements
- WebSocket integration for real-time status updates
- Advanced routing options
- Gas sponsorship integration
- Multi-wallet support
- Enhanced analytics dashboard
- Social features (follow traders, copy trades)

## Testing Checklist
- ✅ Chain selection works for both from/to
- ✅ Token selection works for both from/to
- ✅ Balance displays correctly
- ✅ Quote fetches on amount change
- ✅ Swap executes successfully
- ✅ Status monitoring works
- ✅ History displays correctly
- ✅ Batch swap adds/removes tokens
- ✅ Trending tokens load from Farcaster
- ✅ Streak increments on swap
- ✅ Leaderboard updates
- ✅ Share receipt opens Warpcast
- ✅ Contract search finds tokens
- ✅ Slippage setting persists
- ✅ All 85+ chains available
- ✅ Logos display for chains and tokens
- ✅ Mobile layout fits 424x695px
- ✅ Dark theme applied
- ✅ No TypeScript errors
- ✅ No linting errors

## API Rate Limits
- Relay API: No documented limits, but implement exponential backoff
- Warpcast API: Standard rate limits apply

## Security Considerations
- Never store private keys
- Validate all user inputs
- Sanitize contract addresses
- Check transaction data before signing
- Monitor for suspicious activity

## Deployment Notes
- Ensure __ICON_URL__, __HOME_URL__, __IMAGE_URL__ are replaced during deployment
- Configure proper CORS for API calls
- Set up error tracking (Sentry, etc.)
- Monitor API usage and costs
- Test on actual Farcaster client before launch
