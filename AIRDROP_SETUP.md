# Airdrop System Setup Guide

Complete in-app airdrop claiming system with Moralis/Alchemy integration.

## ✅ Features Implemented

- **Eligibility Checking**: Uses Moralis/Alchemy API to check wallet balance
- **In-App Claiming**: Execute claim transactions without leaving the app
- **Gas Efficient**: Optimized contract calls on Base chain
- **Error Handling**: Handles "Already claimed", "Not eligible", and transaction errors
- **Success States**: Shows transaction hash and updated balance
- **Clean UI**: Matches existing theme with badges and status indicators

## 🎯 Configuration

### 1. Update Airdrop Config

Edit `frontend/src/lib/airdrop/config.ts`:

```typescript
export const AIRDROP_CONFIG: AirdropConfig = {
  // Your ERC20 token address on Base
  tokenAddress: '0xYourTokenAddress',
  tokenSymbol: 'YOUR',
  tokenName: 'Your Token',
  tokenDecimals: 18,
  
  // Chain (Base mainnet)
  chainId: 8453,
  chainName: 'Base',
  
  // Total airdrop supply
  totalSupply: '1000000', // 1M tokens
  
  // Eligibility criteria
  eligibilityCriteria: {
    minEthBalance: '0.01', // Minimum 0.01 ETH
    customCriteria: 'Users with >0.01 ETH balance on Base'
  },
  
  // Optional: If using a claim contract
  claimContractAddress: '0xYourClaimContract', // or undefined
  
  // Optional: If using Merkle tree distribution
  merkleRoot: '0xYourMerkleRoot', // or undefined
}
```

### 2. Customize Eligibility Logic

Edit `frontend/src/lib/airdrop/eligibility.ts`:

```typescript
function calculateAirdropAmount(ethBalance: string): string {
  const balance = parseFloat(ethBalance)
  
  // Customize your distribution formula
  if (balance >= 1) {
    return '10000'  // 10k tokens for 1+ ETH
  } else if (balance >= 0.1) {
    return '5000'   // 5k tokens for 0.1+ ETH
  } else if (balance >= 0.01) {
    return '1000'   // 1k tokens for 0.01+ ETH
  }
  
  return '0'
}
```

## 📋 Distribution Methods

### Method 1: Direct Transfer (Simplest)

No claim contract needed. You manually transfer tokens after users claim.

**Setup:**
1. Set `claimContractAddress: undefined` in config
2. Users click "Claim" → transaction is recorded
3. You manually send tokens to eligible addresses

### Method 2: Claim Contract (Recommended)

Users claim directly from a smart contract.

**Setup:**
1. Deploy a claim contract on Base
2. Set `claimContractAddress` in config
3. Fund the contract with tokens
4. Users claim automatically

**Example Claim Contract:**
```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract AirdropClaim {
    IERC20 public token;
    mapping(address => bool) public hasClaimed;
    
    constructor(address _token) {
        token = IERC20(_token);
    }
    
    function claim() external {
        require(!hasClaimed[msg.sender], "Already claimed");
        
        // Calculate amount based on eligibility
        uint256 amount = calculateAmount(msg.sender);
        require(amount > 0, "Not eligible");
        
        hasClaimed[msg.sender] = true;
        token.transfer(msg.sender, amount);
    }
    
    function calculateAmount(address user) public view returns (uint256) {
        // Implement your eligibility logic
        uint256 balance = user.balance;
        if (balance >= 1 ether) return 10000 * 10**18;
        if (balance >= 0.1 ether) return 5000 * 10**18;
        if (balance >= 0.01 ether) return 1000 * 10**18;
        return 0;
    }
}
```

### Method 3: Merkle Tree (Most Gas Efficient)

Use Merkle proofs for large airdrops.

**Setup:**
1. Generate Merkle tree of eligible addresses
2. Set `merkleRoot` in config
3. Deploy Merkle claim contract
4. Implement proof generation in backend

**Generate Merkle Tree:**
```typescript
// api/generate-merkle-tree.ts
import { MerkleTree } from 'merkletreejs';
import keccak256 from 'keccak256';

const eligibleAddresses = [
  { address: '0x123...', amount: '1000' },
  { address: '0x456...', amount: '5000' },
  // ... more addresses
];

const leaves = eligibleAddresses.map(x => 
  keccak256(ethers.utils.solidityPack(['address', 'uint256'], [x.address, x.amount]))
);

const tree = new MerkleTree(leaves, keccak256, { sortPairs: true });
const root = tree.getRoot().toString('hex');

// Store tree for proof generation
```

## 🔧 Testing

### 1. Test Eligibility Check

```bash
# Open the app
# Connect wallet
# Click gift icon
# Should show eligibility status
```

### 2. Test Claim (Testnet)

1. Deploy test token on Base Sepolia
2. Update config with testnet addresses
3. Change `chainId: 84532` (Base Sepolia)
4. Test full claim flow

### 3. Test Error States

- **Not Eligible**: Connect wallet with <0.01 ETH
- **Already Claimed**: Claim twice
- **Wrong Network**: Try claiming on different chain

## 🎨 UI States

### Checking Eligibility
- Pulsing animation
- "Checking eligibility..." message

### Eligible
- Green badge with "Eligible"
- Shows claimable amount
- Token details
- "Claim" button

### Not Eligible
- X icon
- Reason displayed
- "Check Again" button

### Claiming
- Status messages:
  - "Preparing claim transaction..."
  - "Switching to Base chain..."
  - "Submitting claim transaction..."

### Success
- Green success message
- Transaction hash link
- Updated balance (after 3s)

### Error
- Red error message
- Specific error handling:
  - "Already claimed"
  - "Not eligible"
  - "Transaction rejected"

## 🔔 Notifications

### Auto-Notifications
- Checks eligibility when wallet connects
- Shows toast notification if eligible
- Auto-opens dialog after 2 seconds
- Periodic checks every 5 minutes

### Gift Icon Badge
- Green badge with "1" when eligible
- Pulsing animation
- Ping effect for attention

## 🚀 Deployment Checklist

- [ ] Update `AIRDROP_CONFIG` with your token details
- [ ] Customize eligibility criteria
- [ ] Deploy claim contract (if using)
- [ ] Fund claim contract with tokens
- [ ] Test on testnet first
- [ ] Update to mainnet addresses
- [ ] Deploy frontend
- [ ] Test end-to-end flow
- [ ] Monitor claims

## 📊 Monitoring

### Track Claims
```typescript
// Add to your backend
app.get('/api/airdrop/stats', async (req, res) => {
  const totalClaimed = await claimContract.totalClaimed();
  const uniqueClaimers = await claimContract.claimerCount();
  
  res.json({
    totalClaimed,
    uniqueClaimers,
    remaining: TOTAL_SUPPLY - totalClaimed
  });
});
```

### View Transactions
- Base Scan: `https://basescan.org/address/YOUR_CONTRACT`
- Filter by "claim" function calls

## 🛠️ Troubleshooting

### "Not eligible" but should be
- Check wallet has >0.01 ETH on Base
- Verify correct chain (Base mainnet)
- Check eligibility logic in `calculateAirdropAmount()`

### Transaction fails
- Ensure claim contract has enough tokens
- Check gas limits
- Verify user hasn't claimed already

### Wrong amount shown
- Update `calculateAirdropAmount()` formula
- Check token decimals match

## 💡 Advanced Features

### Add Snapshot Block
```typescript
eligibilityCriteria: {
  snapshotBlock: 12345678,
  // Check balance at specific block
}
```

### Add Token Balance Requirement
```typescript
eligibilityCriteria: {
  minTokenBalance: '100', // Require 100 of another token
}
```

### Add Whitelist
```typescript
const WHITELIST = ['0x123...', '0x456...'];

function checkEligibility(address: string) {
  return WHITELIST.includes(address.toLowerCase());
}
```

## 📝 Example Configurations

### Simple ETH Balance
```typescript
minEthBalance: '0.01',
customCriteria: 'Users with >0.01 ETH on Base'
```

### NFT Holders
```typescript
customCriteria: 'NFT holders from collection 0x...'
// Implement NFT check in eligibility.ts
```

### Early Adopters
```typescript
snapshotBlock: 12345678,
customCriteria: 'Users active before block 12345678'
```

## 🎯 Gas Optimization

- Use Merkle trees for >1000 recipients
- Batch claims if possible
- Optimize contract storage
- Use `transfer` instead of `approve + transferFrom`

## 🔒 Security

- ✅ Validates eligibility on-chain
- ✅ Prevents double claims
- ✅ Uses secure RPC endpoints
- ✅ Handles transaction errors
- ✅ No external redirects

## 📞 Support

For issues or questions:
1. Check diagnostics: `bun run typecheck`
2. Review console logs
3. Test on Base Sepolia first
4. Verify contract addresses

---

**Ready to launch!** Update the config and deploy your airdrop. 🚀
