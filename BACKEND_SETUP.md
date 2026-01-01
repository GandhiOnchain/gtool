# Airdrop Notification Backend Setup

This guide explains how to set up the serverless backend for airdrop notifications on Vercel.

## Overview

The backend consists of:
- **Cron Job**: Runs every hour to check airdrops for all registered users
- **API Endpoints**: Register users and manage notifications
- **Notifications**: Send alerts via Farcaster when new airdrops are detected

## Setup Steps

### 1. Install Dependencies

```bash
cd api
npm install
```

### 2. Set Up Environment Variables

In your Vercel dashboard, add these environment variables:

```bash
# Required
CRON_SECRET=your-random-secret-key-here
APP_URL=https://your-app.vercel.app

# Optional (for Farcaster notifications)
FARCASTER_API_KEY=your-farcaster-api-key
```

To generate a CRON_SECRET:
```bash
openssl rand -base64 32
```

### 3. Set Up Database (Choose One)

#### Option A: Vercel KV (Recommended - Easiest)

1. Go to Vercel Dashboard → Storage → Create Database → KV
2. Connect it to your project
3. Environment variables are auto-added

Update `api/register-user.ts`:
```typescript
import { kv } from '@vercel/kv';

async function registerUser(user: { address: string; fid?: string }) {
  await kv.set(`user:${user.address}`, JSON.stringify(user));
  await kv.sadd('users', user.address);
}

async function getRegisteredUsers() {
  const addresses = await kv.smembers('users');
  const users = await Promise.all(
    addresses.map(addr => kv.get(`user:${addr}`))
  );
  return users.filter(Boolean);
}
```

#### Option B: Vercel Postgres

1. Go to Vercel Dashboard → Storage → Create Database → Postgres
2. Run migrations:

```sql
CREATE TABLE users (
  address VARCHAR(42) PRIMARY KEY,
  fid VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE notified_airdrops (
  user_address VARCHAR(42),
  airdrop_id VARCHAR(255),
  notified_at TIMESTAMP DEFAULT NOW(),
  PRIMARY KEY (user_address, airdrop_id)
);
```

#### Option C: Simple JSON (Development Only)

Store users in environment variable:
```bash
REGISTERED_USERS='[{"address":"0x123...","fid":"12345"}]'
```

### 4. Deploy to Vercel

```bash
vercel deploy
```

The cron job will automatically run every hour.

### 5. Test the Cron Job

Manually trigger the cron:
```bash
curl -X POST https://your-app.vercel.app/api/check-airdrops \
  -H "Authorization: Bearer YOUR_CRON_SECRET"
```

## API Endpoints

### POST /api/register-user
Register a user for airdrop notifications

**Request:**
```json
{
  "address": "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
  "fid": "12345"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Successfully registered for airdrop notifications",
  "address": "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb"
}
```

### POST /api/check-airdrops (Cron Only)
Checks airdrops for all registered users

**Headers:**
```
Authorization: Bearer YOUR_CRON_SECRET
```

**Response:**
```json
{
  "success": true,
  "checked": 150,
  "notifications": 5,
  "details": [
    {
      "address": "0x123...",
      "airdrops": [
        {
          "id": "clanker-xyz",
          "name": "Clanker Token",
          "amount": "1000",
          "tokenSymbol": "CLANKER"
        }
      ]
    }
  ]
}
```

## Implementing Airdrop Checks

Update `api/check-airdrops.ts` with actual contract calls:

```typescript
import { createPublicClient, http } from 'viem';
import { base } from 'viem/chains';

async function checkClankerAirdrops(address: string, chainId: number) {
  const client = createPublicClient({
    chain: base,
    transport: http(),
  });

  const airdrops = [];
  
  // Example: Check if user is eligible for a specific airdrop
  const isEligible = await client.readContract({
    address: '0xYourAirdropContract',
    abi: [{
      name: 'isEligible',
      type: 'function',
      inputs: [{ name: 'user', type: 'address' }],
      outputs: [{ name: '', type: 'bool' }],
    }],
    functionName: 'isEligible',
    args: [address],
  });

  if (isEligible) {
    const amount = await client.readContract({
      address: '0xYourAirdropContract',
      abi: [{
        name: 'getClaimAmount',
        type: 'function',
        inputs: [{ name: 'user', type: 'address' }],
        outputs: [{ name: '', type: 'uint256' }],
      }],
      functionName: 'getClaimAmount',
      args: [address],
    });

    airdrops.push({
      id: 'clanker-xyz',
      name: 'Clanker Token',
      amount: amount.toString(),
      tokenSymbol: 'CLANKER',
      contractAddress: '0xYourAirdropContract',
      chainId,
    });
  }

  return airdrops;
}
```

## Farcaster Notifications

To send notifications via Farcaster, you'll need to:

1. Get a Farcaster API key from [Neynar](https://neynar.com/) or [Pinata](https://pinata.cloud/)
2. Update `sendFarcasterNotification` function:

```typescript
async function sendFarcasterNotification(fid: string, airdrops: any[]) {
  const message = airdrops.length === 1
    ? `🎁 New airdrop: ${airdrops[0].amount} ${airdrops[0].tokenSymbol}`
    : `🎁 ${airdrops.length} new airdrops available!`;

  await fetch('https://api.neynar.com/v2/farcaster/notification', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.FARCASTER_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      fid,
      message,
      url: `${process.env.APP_URL}?openAirdrops=true`,
    }),
  });
}
```

## Monitoring

View cron job logs in Vercel Dashboard:
1. Go to your project
2. Click "Deployments"
3. Click on latest deployment
4. Go to "Functions" tab
5. Click on `check-airdrops` to see logs

## Cron Schedule

Current schedule: Every hour (`0 */1 * * *`)

To change frequency, update `vercel.json`:
- Every 30 minutes: `*/30 * * * *`
- Every 6 hours: `0 */6 * * *`
- Daily at 9 AM: `0 9 * * *`

## Cost Estimate

Vercel Free Tier includes:
- 100 GB-hours of serverless function execution
- Unlimited cron jobs
- 100 GB bandwidth

For 1000 users checked hourly:
- ~2-3 seconds per check
- ~720 checks/month (24 hours × 30 days)
- Well within free tier limits

## Troubleshooting

### Cron not running
- Check Vercel logs for errors
- Verify `CRON_SECRET` is set correctly
- Ensure function doesn't timeout (max 10s on free tier)

### Users not receiving notifications
- Check Farcaster API key is valid
- Verify FID is correct
- Check notification logs in Vercel

### Database connection issues
- Verify KV/Postgres is connected to project
- Check environment variables are set
- Test connection in function logs

## Next Steps

1. Set up Vercel KV for user storage
2. Add Farcaster API key for notifications
3. Implement actual airdrop eligibility checks
4. Test with your wallet address
5. Monitor logs and adjust as needed
