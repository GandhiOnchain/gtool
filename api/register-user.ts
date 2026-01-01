import type { VercelRequest, VercelResponse } from '@vercel/node';

/**
 * API endpoint to register a user for airdrop notifications
 * Called from the frontend when user connects wallet
 */
export default async function handler(
  req: VercelRequest,
  res: VercelResponse,
) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { address, fid } = req.body;

    // Validate input
    if (!address || !address.match(/^0x[a-fA-F0-9]{40}$/)) {
      return res.status(400).json({ error: 'Invalid wallet address' });
    }

    // Store user in database
    await registerUser({ address, fid });

    return res.status(200).json({
      success: true,
      message: 'Successfully registered for airdrop notifications',
      address,
    });
  } catch (error) {
    console.error('Error registering user:', error);
    return res.status(500).json({ error: 'Failed to register user' });
  }
}

async function registerUser(user: { address: string; fid?: string }) {
  // TODO: Store in actual database (Vercel KV, Postgres, etc.)
  // For now, this is a placeholder
  console.log('Registering user:', user);
  
  // Example with Vercel KV:
  // const kv = createClient({
  //   url: process.env.KV_REST_API_URL,
  //   token: process.env.KV_REST_API_TOKEN,
  // });
  // await kv.set(`user:${user.address}`, JSON.stringify(user));
}
