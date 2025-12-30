import { useState, useCallback } from 'react';
import { useAccount, useSignTypedData, useSignMessage as useWagmiSignMessage, useSwitchChain, useChainId } from 'wagmi';
import { type Address, type Hex, keccak256, stringToHex, encodeFunctionData, createPublicClient, http } from 'viem';
import { 
  type SignResult,
  type EIP712Domain,
  buildDomain,
  hashTypedData,
  buildTypedData,
  readDomainOnchain,
  validateAddress,
  validateBigInt,
  validateDeadline,
  validateNonZeroAddress,
  splitSig65,
  randomNonce32,
} from '../lib/blockchain/signatureUtils';
import { getChainById, getRpcUrl } from '@/lib/blockchain/chains';
import { toast } from 'sonner';

// ===== PERMIT SIGNATURES (EIP-2612) =====

export interface PermitSignatureParams {
  /** Token address */
  token: Address;
  /** Owner address */
  owner?: Address;
  /** Spender address */
  spender: Address;
  /** Amount */
  value: bigint;
  /** Deadline timestamp */
  deadline: bigint;
  /** Chain ID */
  chainId: number;
  /** Custom domain */
  domain?: EIP712Domain;
}

export interface PermitSignatureResult extends SignResult {
  /** Nonce */
  nonce?: bigint;
}

/**
 * Sign ERC-20 permit messages (EIP-2612)
 * 
 * @example
 * ```typescript
 * import { deadlineIn } from '@/lib/blockchain/utils';
 * 
 * const { signPermit, signature } = usePermitSignature();
 * 
 * await signPermit({
 *   token: tokenAddress,
 *   spender: spenderAddress,
 *   deadline: deadlineIn(3600),
 *   value: parseEther('100'),
 *   chainId: 8453
 * });
 * ```
 */
export function usePermitSignature() {
  const { address } = useAccount();
  const { signTypedDataAsync } = useSignTypedData();
  const { switchChain } = useSwitchChain();
  const currentChainId = useChainId();
  
  const [result, setResult] = useState<PermitSignatureResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
  const scheduleDismiss = (id: string, ms: number) => { setTimeout(() => toast.dismiss(id), ms) }

  const signPermit = useCallback(async (params: PermitSignatureParams): Promise<PermitSignatureResult> => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Switch chain if needed (with 2s delay)
      if (currentChainId !== params.chainId) {
        try {
          toast.loading('Please switch to the correct network...', { id: 'sig-chain-switch' });
          switchChain({ chainId: params.chainId });
          toast.dismiss('sig-chain-switch');
          toast.success('Network switched successfully', { id: 'sig-chain-switch-success' });
          await sleep(2000);
          scheduleDismiss('sig-chain-switch-success', 5000)
        } catch (switchError) {
          toast.dismiss('sig-chain-switch');
          toast.dismiss('sig-chain-switch-success');
          toast.error('Failed to switch network. Please switch manually.');
          throw (switchError instanceof Error ? switchError : new Error(String(switchError)));
        }
      }

      const owner = validateAddress(params.owner || address);
      if (!owner) {
        throw new Error('No owner address provided and no wallet connected');
      }

      // Validate inputs
      const token = validateAddress(params.token);
      const spender = validateNonZeroAddress(params.spender);
      const value = validateBigInt(params.value);
      const deadline = params.deadline;
      
      validateDeadline(deadline);

      // Get or build domain
      let domain: EIP712Domain;
      if (params.domain) {
        domain = params.domain;
      } else {
        const domainInfo = await readDomainOnchain(token, params.chainId);
        domain = buildDomain({
          name: domainInfo.name || 'Unknown Token',
          version: domainInfo.version || '1',
          chainId: params.chainId,
          verifyingContract: token,
        });
      }

      const chain = getChainById(params.chainId);
      if (!chain) {
        throw new Error('Unsupported chain ID: ' + params.chainId);
      }

      const publicClient = createPublicClient({
        chain,
        transport: http(getRpcUrl(params.chainId)),
      });

      // Read current nonce
      let nonce: bigint;
      try {
        // Try to read nonce using the deployed contract's ABI
        nonce = await publicClient.readContract({
          address: token,
          abi: [{
            "inputs": [
              {
                "internalType": "address",
                "name": "owner",
                "type": "address"
              }
            ],
            "name": "nonces",
            "outputs": [
              {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
              }
            ],
            "stateMutability": "view",
            "type": "function"
          }],
          functionName: 'nonces',
          args: [owner],
        });
      } catch {
        // If we can't read nonce, use 0 by default
        nonce = 0n;
      }

      // Build typed data
      const types = {
        Permit: [
          { name: 'owner', type: 'address' },
          { name: 'spender', type: 'address' },
          { name: 'value', type: 'uint256' },
          { name: 'nonce', type: 'uint256' },
          { name: 'deadline', type: 'uint256' },
        ],
      };

      const message = {
        owner,
        spender,
        value,
        nonce,
        deadline,
      };

      const typedData = buildTypedData(domain, 'Permit', types, message);
      const digest = hashTypedData(domain, 'Permit', types, message);

      // Sign the typed data
      const signature = await signTypedDataAsync({
        domain: domain,
        types: types,
        primaryType: 'Permit',
        message: message,
        account: owner,
      });

      // Split signature
      const { v, r, s } = splitSig65(signature);

      const signResult: PermitSignatureResult = {
        signature,
        typedData,
        digest,
        v,
        r,
        s,
        nonce,
        deadline,
      };

      setResult(signResult);
      return signResult;
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [address, signTypedDataAsync]);

  const reset = useCallback(() => {
    setResult(null);
    setError(null);
  }, []);

  return {
    signPermit,
    signature: result?.signature,
    typedData: result?.typedData,
    digest: result?.digest,
    calldata: result?.calldata,
    nonce: result?.nonce,
    v: result?.v,
    r: result?.r,
    s: result?.s,
    isLoading,
    error,
    reset,
  };
}

// ===== SIGN-IN WITH ETHEREUM (EIP-4361) =====

/**
 * Parameters for SIWE message
 */
export interface SiweMessageParams {
  /** Domain requesting the sign-in */
  domain: string;
  /** Ethereum address performing the sign-in */
  address?: Address;
  /** Human-readable statement */
  statement?: string;
  /** RFC 3986 URI */
  uri: string;
  /** Version of the message (defaults to "1") */
  version?: string;
  /** Chain ID */
  chainId: number;
  /** Random nonce */
  nonce?: string;
  /** When the message was generated */
  issuedAt?: string;
  /** When the signed authentication will no longer be valid */
  expirationTime?: string;
  /** When the signed authentication will become valid */
  notBefore?: string;
  /** System-specific identifier for the session */
  requestId?: string;
  /** List of information or references to information */
  resources?: string[];
}

/**
 * Sign-In With Ethereum (EIP-4361)
 * 
 * @example
 * ```typescript
 * const { signSiwe, signature, message } = useSiweSignature();
 * 
 * await signSiwe({
 *   domain: window.location.host,
 *   uri: window.location.origin,
 *   chainId: 8453,
 *   statement: 'Sign in to Example App'
 * });
 * ```
 */
export function useSiweSignature() {
  const { address } = useAccount();
  const { signMessageAsync } = useWagmiSignMessage();
  const { switchChain } = useSwitchChain();
  const currentChainId = useChainId();
  
  const [result, setResult] = useState<{ 
    signature: Hex; 
    message: string; 
    digest: Hex; 
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
  const scheduleDismiss = (id: string, ms: number) => { setTimeout(() => toast.dismiss(id), ms) }

  const signSiwe = useCallback(async (params: SiweMessageParams) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Switch chain if needed (with 2s delay)
      if (currentChainId !== params.chainId) {
        try {
          toast.loading('Please switch to the correct network...', { id: 'sig-chain-switch' });
          switchChain({ chainId: params.chainId });
          toast.dismiss('sig-chain-switch');
          toast.success('Network switched successfully', { id: 'sig-chain-switch-success' });
          await sleep(2000);
          scheduleDismiss('sig-chain-switch-success', 5000)
        } catch (switchError) {
          toast.dismiss('sig-chain-switch');
          toast.dismiss('sig-chain-switch-success');
          toast.error('Failed to switch network. Please switch manually.');
          throw (switchError instanceof Error ? switchError : new Error(String(switchError)));
        }
      }

      const signerAddress = params.address || address;
      if (!signerAddress) {
        throw new Error('No address provided and no wallet connected');
      }

      // Build SIWE message
      const message = buildSiweMessage({
        ...params,
        address: validateAddress(signerAddress),
        nonce: params.nonce || randomNonce32().slice(0, 10),
        issuedAt: params.issuedAt || new Date().toISOString(),
        version: params.version || '1',
      });

      // Sign the message
      const signature = await signMessageAsync({ message });
      
      // Create message hash
      const digest = keccak256(stringToHex(message));

      const signResult = {
        signature,
        message,
        digest,
      };

      setResult(signResult);
      return signResult;
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [address, signMessageAsync]);

  const reset = useCallback(() => {
    setResult(null);
    setError(null);
  }, []);

  return {
    signSiwe,
    signature: result?.signature,
    message: result?.message,
    digest: result?.digest,
    isLoading,
    error,
    reset,
  };
}

// ===== HELPER FUNCTIONS =====

/**
 * Build SIWE message string according to EIP-4361
 */
function buildSiweMessage(params: Required<Omit<SiweMessageParams, 'statement' | 'expirationTime' | 'notBefore' | 'requestId' | 'resources'>> & Pick<SiweMessageParams, 'statement' | 'expirationTime' | 'notBefore' | 'requestId' | 'resources'>): string {
  const {
    domain,
    address,
    statement,
    uri,
    version = '1',
    chainId,
    nonce = randomNonce32().slice(0, 10), // Use first 8 chars of random hex
    issuedAt = new Date().toISOString(),
    expirationTime,
    notBefore,
    requestId,
    resources,
  } = params;

  let message = `${domain} wants you to sign in with your Ethereum account:\n${address}`;
  
  if (statement) {
    message += `\n\n${statement}`;
  }
  
  message += `\n\nURI: ${uri}`;
  message += `\nVersion: ${version}`;
  message += `\nChain ID: ${chainId}`;
  message += `\nNonce: ${nonce}`;
  message += `\nIssued At: ${issuedAt}`;
  
  if (expirationTime) {
    message += `\nExpiration Time: ${expirationTime}`;
  }
  
  if (notBefore) {
    message += `\nNot Before: ${notBefore}`;
  }
  
  if (requestId) {
    message += `\nRequest ID: ${requestId}`;
  }
  
  if (resources && resources.length > 0) {
    message += `\nResources:`;
    resources.forEach(resource => {
      message += `\n- ${resource}`;
    });
  }
  
  return message;
}

// ===== ERC-721 PERMIT SIGNATURES (EIP-4494) =====

export interface Permit721SignatureParams {
  /** NFT address */
  nft: Address;
  /** Owner address */
  owner?: Address;
  /** Spender address */
  spender: Address;
  /** Token ID */
  tokenId: bigint;
  /** Deadline */
  deadline: bigint;
  /** Chain ID */
  chainId: number;
  /** Custom domain */
  domain?: EIP712Domain;
}

/**
 * Sign ERC-721 permit messages (EIP-4494)
 * 
 * @example
 * ```typescript
 * import { deadlineIn } from '@/lib/blockchain/utils';
 * 
 * const { signPermit721, signature } = usePermit721Signature();
 * 
 * await signPermit721({
 *   nft: nftAddress,
 *   spender: spenderAddress,
 *   tokenId: 42n,
 *   deadline: deadlineIn(3600),
 *   chainId: 8453
 * });
 * ```
 */
export function usePermit721Signature() {
  const { address } = useAccount();
  const { signTypedDataAsync } = useSignTypedData();
  const { switchChain } = useSwitchChain();
  const currentChainId = useChainId();
  
  const [result, setResult] = useState<PermitSignatureResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
  const scheduleDismiss = (id: string, ms: number) => { setTimeout(() => toast.dismiss(id), ms) }

  const signPermit721 = useCallback(async (params: Permit721SignatureParams): Promise<PermitSignatureResult> => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Switch chain if needed (with 2s delay)
      if (currentChainId !== params.chainId) {
        try {
          toast.loading('Please switch to the correct network...', { id: 'sig-chain-switch' });
          switchChain({ chainId: params.chainId });
          toast.dismiss('sig-chain-switch');
          toast.success('Network switched successfully', { id: 'sig-chain-switch-success' });
          await sleep(2_000);
          scheduleDismiss('sig-chain-switch-success', 5000)
        } catch (switchError) {
          toast.dismiss('sig-chain-switch');
          toast.dismiss('sig-chain-switch-success');
          toast.error('Failed to switch network. Please switch manually.');
          throw (switchError instanceof Error ? switchError : new Error(String(switchError)));
        }
      }

      const owner = validateAddress(params.owner || address);
      if (!owner) {
        throw new Error('No owner address provided and no wallet connected');
      }

      // Validate inputs
      const nft = validateAddress(params.nft);
      const spender = validateNonZeroAddress(params.spender);
      const tokenId = validateBigInt(params.tokenId);
      const deadline = params.deadline;
      
      validateDeadline(deadline);

      // Get or build domain
      let domain: EIP712Domain;
      if (params.domain) {
        domain = params.domain;
      } else {
        const domainInfo = await readDomainOnchain(nft, params.chainId);
        domain = buildDomain({
          name: domainInfo.name || 'Unknown NFT',
          version: domainInfo.version || '1',
          chainId: params.chainId,
          verifyingContract: nft,
        });
      }

      const chain = getChainById(params.chainId);
      if (!chain) {
        throw new Error('Unsupported chain ID: ' + params.chainId);
      }

      const publicClient = createPublicClient({
        chain,
        transport: http(getRpcUrl(params.chainId)),
      });

      // Read current nonce for the token
      let nonce: bigint;
      try {
        // Try to read nonce for the specific token ID
        nonce = await publicClient.readContract({
          address: nft,
          abi: [
            {
              "inputs": [
                {
                  "internalType": "uint256",
                  "name": "tokenId",
                  "type": "uint256"
                }
              ],
              "name": "nonces",
              "outputs": [
                {
                  "internalType": "uint256",
                  "name": "",
                  "type": "uint256"
                }
              ],
              "stateMutability": "view",
              "type": "function"
            }
          ],
          functionName: 'nonces',
          args: [tokenId],
        });
      } catch {
        console.warn('Could not read nonce from contract, using timestamp');
        nonce = BigInt(Date.now());
      }

      // Build typed data for EIP-4494
      const types = {
        Permit: [
          { name: 'spender', type: 'address' },
          { name: 'tokenId', type: 'uint256' },
          { name: 'nonce', type: 'uint256' },
          { name: 'deadline', type: 'uint256' },
        ],
      };

      const message = {
        spender,
        tokenId,
        nonce,
        deadline,
      };

      const typedData = buildTypedData(domain, 'Permit', types, message);
      const digest = hashTypedData(domain, 'Permit', types, message);

      // Sign the typed data
      const signature = await signTypedDataAsync({
        domain: domain,
        types: types,
        primaryType: 'Permit',
        message: message,
        account: owner,
      });

      // Split signature
      const { v, r, s } = splitSig65(signature);

      const signResult: PermitSignatureResult = {
        signature,
        typedData,
        digest,
        v,
        r,
        s,
        nonce,
        deadline,
      };

      setResult(signResult);
      return signResult;
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [address, signTypedDataAsync]);

  const reset = useCallback(() => {
    setResult(null);
    setError(null);
  }, []);

  return {
    signPermit721,
    signature: result?.signature,
    typedData: result?.typedData,
    digest: result?.digest,
    calldata: result?.calldata,
    nonce: result?.nonce,
    v: result?.v,
    r: result?.r,
    s: result?.s,
    isLoading,
    error,
    reset,
  };
}

// ===== META-TRANSACTION SIGNATURES (EIP-2771) =====

/**
 * Parameters for meta-transaction signature
 */
export interface MetaTxSignatureParams {
  /** Trusted forwarder contract address */
  forwarder: Address;
  /** Transaction sender address (defaults to connected account) */
  from?: Address;
  /** Target contract address */
  to: Address;
  /** Transaction value in wei */
  value: bigint;
  /** Transaction data */
  data: Hex;
  /** Gas limit for the transaction */
  gas: bigint;
  /** Nonce for replay protection */
  nonce: bigint;
  /** Transaction deadline */
  deadline: bigint;
  /** Chain ID */
  chainId: number;
  /** Custom domain override */
  domain?: EIP712Domain;
}

/**
 * Sign meta-transaction messages (EIP-2771)
 * 
 * @example
 * ```typescript
 * import { deadlineIn } from '@/lib/blockchain/utils';
 * 
 * const { signMetaTx, signature } = useMetaTxSignature();
 * 
 * await signMetaTx({
 *   forwarder: forwarderAddress,
 *   to: targetContract,
 *   value: 0n,
 *   data: encodedFunctionData,
 *   gas: 100000n,
 *   nonce: 1n,
 *   deadline: deadlineIn(3600),
 *   chainId: 8453
 * });
 * ```
 */
export function useMetaTxSignature() {
  const { address } = useAccount();
  const { signTypedDataAsync } = useSignTypedData();
  const { switchChain } = useSwitchChain();
  const currentChainId = useChainId();
  
  const [result, setResult] = useState<SignResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const signMetaTx = useCallback(async (params: MetaTxSignatureParams): Promise<SignResult> => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Switch chain if needed (with 2s delay)
      if (currentChainId !== params.chainId) {
        try {
          toast.loading('Please switch to the correct network...', { id: 'sig-chain-switch' });
          switchChain({ chainId: params.chainId });
          toast.dismiss('sig-chain-switch');
          toast.success('Network switched successfully', { duration: 5000 });
          await new Promise(resolve => setTimeout(resolve, 2000));
        } catch (switchError) {
          toast.dismiss('sig-chain-switch');
          toast.error('Failed to switch network. Please switch manually.', { duration: 5000 });
          throw (switchError instanceof Error ? switchError : new Error(String(switchError)));
        }
      }

      const from = params.from || address;
      if (!from) {
        throw new Error('No from address provided and no wallet connected');
      }

      // Validate inputs
      const forwarder = validateAddress(params.forwarder);
      const fromAddr = validateAddress(from);
      const to = validateAddress(params.to);
      const value = validateBigInt(params.value);
      const gas = validateBigInt(params.gas);
      const nonce = validateBigInt(params.nonce);
      const deadline = validateDeadline(params.deadline);

      // Get or build domain
      let domain: EIP712Domain;
      if (params.domain) {
        domain = params.domain;
      } else {
        const domainInfo = await readDomainOnchain(forwarder, params.chainId);
        domain = buildDomain({
          name: domainInfo.name || 'Forwarder',
          version: domainInfo.version || '1',
          chainId: params.chainId,
          verifyingContract: forwarder,
        });
      }

      // Build typed data for EIP-2771
      const types = {
        ForwardRequest: [
          { name: 'from', type: 'address' },
          { name: 'to', type: 'address' },
          { name: 'value', type: 'uint256' },
          { name: 'gas', type: 'uint256' },
          { name: 'nonce', type: 'uint256' },
          { name: 'deadline', type: 'uint256' },
          { name: 'data', type: 'bytes' },
        ],
      };

      const message = {
        from: fromAddr,
        to,
        value,
        gas,
        nonce,
        deadline,
        data: params.data,
      };

      const typedData = buildTypedData(domain, 'ForwardRequest', types, message);
      const digest = hashTypedData(domain, 'ForwardRequest', types, message);

      // Sign the typed data
      const signature = await signTypedDataAsync({
        domain: domain,
        types: types,
        primaryType: 'ForwardRequest',
        message: message,
        account: from,
      });

      // Split signature
      const { v, r, s } = splitSig65(signature);

      const signResult: SignResult = {
        signature,
        typedData,
        digest,
        v,
        r,
        s,
        deadline,
      };

      setResult(signResult);
      return signResult;
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [address, signTypedDataAsync]);

  const reset = useCallback(() => {
    setResult(null);
    setError(null);
  }, []);

  return {
    signMetaTx,
    signature: result?.signature,
    typedData: result?.typedData,
    digest: result?.digest,
    v: result?.v,
    r: result?.r,
    s: result?.s,
    isLoading,
    error,
    reset,
  };
}