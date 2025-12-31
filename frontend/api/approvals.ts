// API endpoint to fetch token approvals without CORS issues
// This runs server-side so it can call Revoke.cash API directly

export default async function handler(req: Request) {
  const url = new URL(req.url)
  const address = url.searchParams.get('address')
  const chainId = url.searchParams.get('chainId')

  if (!address || !chainId) {
    return new Response(JSON.stringify({ error: 'Missing address or chainId' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  try {
    // Call Revoke.cash API from server-side (no CORS issues)
    const revokeCashUrl = `https://api.revoke.cash/v1/allowances/${chainId}/${address}`
    console.log('Fetching from Revoke.cash:', revokeCashUrl)

    const response = await fetch(revokeCashUrl, {
      headers: {
        'Accept': 'application/json',
      },
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Revoke.cash API error:', response.status, errorText)
      return new Response(JSON.stringify({ error: 'Failed to fetch approvals', details: errorText }), {
        status: response.status,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    const data = await response.json()
    console.log('Revoke.cash returned:', data?.length || 0, 'approvals')

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    })
  } catch (error) {
    console.error('API error:', error)
    return new Response(JSON.stringify({ error: 'Internal server error', details: (error as Error).message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}
