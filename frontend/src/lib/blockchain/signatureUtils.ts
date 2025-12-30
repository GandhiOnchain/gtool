import { 
  keccak256, 
  encodePacked, 
  encodeAbiParameters, 
  getAddress,
  isAddress,
  isHex,
  size,
  pad,
  slice,
  toHex,
  hexToBigInt,
  stringToHex,
  type Address,
  type Hex,
  createPublicClient,
  http,
  recoverAddress
} from 'viem';
import { getChainById, getRpcUrl, getSimulationRpcUrl } from './chains';

// ===== BASE TYPES & GUARDS =====

/**
 * Common signature result structure returned by all signature functions
 */
export interface SignResult {
  /** The full signature as hex string */
  signature: Hex;
  /** EIP-712 typed data (when applicable) */
  typedData?: {
    domain: EIP712Domain;
    types: Record<string, Array<{ name: string; type: string }>>;
    primaryType: string;
    message: Record<string, unknown>;
  };
  /** The hash that was signed */
  digest?: Hex;
  /** Signature components */
  v?: number;
  r?: Hex;
  s?: Hex;
  /** Ready-to-use transaction calldata (when applicable) */
  calldata?: Hex;
  deadline: bigint;
}

/**
 * EIP-712 Domain structure
 */
export interface EIP712Domain {
  name: string;
  version?: string;
  chainId: bigint;
  verifyingContract: Address;
  salt?: Hex;
}

/**
 * Asserts and normalizes an address with checksum
 */
export function assertAddress(addr: string): Address {
  if (!isAddress(addr)) {
    throw new Error(`Invalid address: ${addr}`);
  }
  return getAddress(addr);
}

/**
 * Asserts hex string with optional byte length validation
 */
export function assertHexBytes(hex: string, byteLength?: number): Hex {
  if (!isHex(hex)) {
    throw new Error(`Invalid hex string: ${hex}`);
  }
  if (byteLength !== undefined && size(hex as Hex) !== byteLength) {
    throw new Error(`Expected ${byteLength} bytes, got ${size(hex as Hex)}`);
  }
  return hex as Hex;
}

/**
 * Converts value to 32-byte hex string (left-padded)
 */
export function toBytes32(value: string | number | bigint): Hex {
  if (typeof value === 'string' && isHex(value)) {
    return pad(value as Hex, { size: 32 });
  }
  return pad(toHex(value), { size: 32 });
}

/**
 * Left-pads hex value to specified byte length
 */
export function leftPadBytes(hex: Hex, byteLength: number): Hex {
  return pad(hex, { size: byteLength });
}

/**
 * Strict BigInt conversion that throws on invalid input
 */
export function toBigIntStrict(value: string | number | bigint): bigint {
  if (typeof value === 'bigint') return value;
  if (typeof value === 'number' && !Number.isInteger(value)) {
    throw new Error('Decimal numbers not supported, use string or bigint');
  }
  if (typeof value === 'string' && isHex(value)) {
    return hexToBigInt(value as Hex);
  }
  return BigInt(value);
}

/**
 * Checks if value can be converted to BigInt
 */
export function isBigNumberish(value: unknown): boolean {
  if (typeof value === 'bigint' || typeof value === 'number') return true;
  if (typeof value === 'string') {
    try {
      BigInt(value);
      return true;
    } catch {
      return isHex(value);
    }
  }
  return false;
}

// ===== HASHING & ENCODING =====

/**
 * Keccak256 hash of data
 */
export function keccak(data: Hex | Uint8Array): Hex {
  return keccak256(data);
}

/**
 * Solidity-style packed encoding then hash
 */
export function solidityKeccak(types: string[], values: unknown[]): Hex {
  const packed = encodePacked(types, values);
  return keccak256(packed);
}

/**
 * Solidity-style packed encoding (no hash)
 */
export function solidityPack(types: string[], values: unknown[]): Hex {
  return encodePacked(types, values);
}

// ===== ECDSA HELPERS =====

/**
 * Split 65-byte signature into v, r, s components
 * 
 * @example
 * ```typescript
 * const sig = '0x1234...'; // 65-byte signature
 * const { v, r, s } = splitSig65(sig);
 * // v: 27 or 28
 * // r: '0x...' (32 bytes)
 * // s: '0x...' (32 bytes)
 * ```
 */
export function splitSig65(signature: Hex): { v: number; r: Hex; s: Hex } {
  const sig = signature.startsWith('0x') ? signature.slice(2) : signature;
  if (sig.length !== 130) { // 65 bytes * 2 hex chars
    throw new Error(`Invalid signature length: expected 130 chars, got ${sig.length}`);
  }
  
  const r = `0x${sig.slice(0, 64)}` as Hex;
  const s = `0x${sig.slice(64, 128)}` as Hex;
  const v = parseInt(sig.slice(128, 130), 16);
  
  return { v: normalizeV(v), r, s };
}

/**
 * Join v, r, s components into 65-byte signature
 */
export function joinSig65(v: number, r: Hex, s: Hex): Hex {
  const normalizedV = normalizeV(v);
  const vHex = normalizedV.toString(16).padStart(2, '0');
  return `${r}${s.slice(2)}${vHex}` as Hex;
}

/**
 * Convert 65-byte signature to compact 64-byte format (EIP-2098)
 */
export function toCompact2098(signature: Hex): Hex {
  const { v, r, s } = splitSig65(signature);
  const recoveryBit = v === 28 ? 1 : 0;
  
  // Set the recovery bit in the most significant bit of s
  const sBigInt = hexToBigInt(s);
  const sWithRecovery = sBigInt | (BigInt(recoveryBit) << 255n);
  const sCompact = pad(toHex(sWithRecovery), { size: 32 });
  
  return `${r}${sCompact.slice(2)}` as Hex;
}

/**
 * Convert compact 64-byte signature back to 65-byte format
 */
export function fromCompact2098(signature: Hex): Hex {
  if (size(signature) !== 64) {
    throw new Error('Invalid compact signature length');
  }
  
  const r = slice(signature, 0, 32);
  const sCompact = slice(signature, 32, 64);
  
  const sBigInt = hexToBigInt(sCompact);
  const recoveryBit = (sBigInt >> 255n) & 1n;
  const s = sBigInt & ((1n << 255n) - 1n);
  const v = recoveryBit === 1n ? 28 : 27;
  
  return joinSig65(v, r, pad(toHex(s), { size: 32 }));
}

/**
 * Normalize recovery parameter to 27 or 28
 */
export function normalizeV(v: number): 27 | 28 {
  if (v === 0 || v === 1) return v + 27 as 27 | 28;
  if (v === 27 || v === 28) return v as 27 | 28;
  if (v >= 35) {
    // EIP-155 format: v = 35 + 2 * chainId + recovery
    return ((v % 2) + 27) as 27 | 28;
  }
  throw new Error(`Invalid v value: ${v}`);
}

/**
 * Check if signature has canonical (low) S value (EIP-2)
 */
export function isCanonicalS(s: Hex): boolean {
  const sBigInt = hexToBigInt(s);
  const secp256k1HalfOrder = BigInt('0x7FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF5D576E7357A4501DDFE92F46681B20A0');
  return sBigInt <= secp256k1HalfOrder;
}

/**
 * Create personal message hash with EIP-191 prefix
 */
export function personalMessageHash(message: Hex): Hex {
  const messageBytes = typeof message === 'string' ? stringToHex(message) : message;
  const prefix = stringToHex(`\x19Ethereum Signed Message:\n${size(messageBytes)}`);
  return keccak256(`${prefix}${messageBytes.slice(2)}` as Hex);
}

// ===== TIME & DEADLINE HELPERS =====

/**
 * Get current timestamp in seconds
 */
export function nowSec(): number {
  return Math.floor(Date.now() / 1000);
}

/**
 * Create deadline N seconds from now
 */
export function deadlineIn(seconds: number): number {
  return nowSec() + seconds;
}

/**
 * Clamp deadline to reasonable bounds with skew tolerance
 */
export function clampDeadline(input: number | Date, skewSec = 30): number {
  let deadline: number;
  
  if (input instanceof Date) {
    deadline = Math.floor(input.getTime() / 1000);
  } else if (typeof input === 'number') {
    // Assume seconds if reasonable, otherwise milliseconds
    deadline = input > 1e10 ? Math.floor(input / 1000) : input;
  } else {
    deadline = input;
  }
  
  const now = nowSec();
  const minDeadline = now + skewSec;
  const maxDeadline = now + 365 * 24 * 3600; // 1 year max
  
  if (deadline < minDeadline) {
    throw new Error(`Deadline too soon: ${deadline} < ${minDeadline}`);
  }
  if (deadline > maxDeadline) {
    throw new Error(`Deadline too far: ${deadline} > ${maxDeadline}`);
  }
  
  return deadline;
}

/**
 * Generate random 32-byte nonce
 */
export function randomNonce32(): Hex {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  return toHex(bytes);
}

// ===== ADDRESS & CHAIN HELPERS =====

/**
 * Compare addresses for equality (case-insensitive)
 */
export function sameAddr(a: string, b: string): boolean {
  try {
    return getAddress(a) === getAddress(b);
  } catch {
    return false;
  }
}

/**
 * Sort token pair addresses for consistent ordering
 */
export function sortTokenPair(tokenA: Address, tokenB: Address): { 
  token0: Address; 
  token1: Address; 
} {
  const a = getAddress(tokenA);
  const b = getAddress(tokenB);
  
  if (a === b) {
    throw new Error('Identical tokens');
  }
  
  return a.toLowerCase() < b.toLowerCase() 
    ? { token0: a, token1: b }
    : { token0: b, token1: a };
}

/**
 * Get chain ID from provider
 */
export async function getChainId(chainId: number): Promise<bigint> {
  const chain = getChainById(chainId);
  if (!chain) {
    throw new Error(`Unsupported chain ID: ${chainId}`);
  }
  return BigInt(chain.id);
}

/**
 * Assert that we're on the expected chain
 */
export async function assertChainId(chainId: number, expected: bigint): Promise<void> {
  const actual = await getChainId(chainId);
  if (actual !== expected) {
    throw new Error(`Chain mismatch: expected ${expected}, got ${actual}`);
  }
}

// ===== VALIDATION HELPERS =====

/**
 * Validate and normalize address input
 */
export function validateAddress(addr: unknown): Address {
  if (typeof addr !== 'string') {
    throw new Error('Address must be a string');
  }
  return assertAddress(addr);
}

/**
 * Validate hex string
 */
export function validateHex(hex: unknown): Hex {
  if (typeof hex !== 'string') {
    throw new Error('Hex must be a string');
  }
  return assertHexBytes(hex);
}

/**
 * Validate and convert to BigInt
 */
export function validateBigInt(value: unknown): bigint {
  if (!isBigNumberish(value)) {
    throw new Error('Value must be convertible to BigInt');
  }
  return toBigIntStrict(value as string | number | bigint);
}

/**
 * Validate deadline is in seconds and future
 */
export function validateDeadline(deadline: unknown): bigint {
  const dl = validateBigInt(deadline);
  const now = nowSec();
  if (dl <= now) {
    throw new Error('Deadline must be in the future');
  }
  return dl;
}

/**
 * Ensure non-zero address
 */
export function validateNonZeroAddress(addr: unknown): Address {
  const address = validateAddress(addr);
  if (address === '0x0000000000000000000000000000000000000000') {
    throw new Error('Address cannot be zero');
  }
  return address;
}

// ===== EIP-712 CORE =====

/**
 * Build EIP-712 domain object with validation
 * 
 * @example
 * ```typescript
 * const domain = buildDomain({
 *   name: 'MyToken',
 *   version: '1',
 *   chainId: 8453,
 *   verifyingContract: '0x...'
 * });
 * ```
 */
export function buildDomain(params: {
  name: string;
  version?: string;
  chainId: bigint | number;
  verifyingContract: Address;
  salt?: Hex;
}): EIP712Domain {
  return {
    name: params.name,
    version: params.version || '1',
    chainId: typeof params.chainId === 'number' ? BigInt(params.chainId) : params.chainId,
    verifyingContract: assertAddress(params.verifyingContract),
    salt: params.salt,
  };
}

/**
 * Encode EIP-712 domain separator
 */
export function encodeDomainSeparator(domain: EIP712Domain): Hex {
  const types = ['bytes32', 'bytes32', 'bytes32', 'uint256', 'address'];
  const values = [
    keccak256(stringToHex('EIP712Domain(string name,string version,uint256 chainId,address verifyingContract)')),
    keccak256(stringToHex(domain.name)),
    keccak256(stringToHex(domain.version || '1')),
    domain.chainId,
    domain.verifyingContract,
  ];

  if (domain.salt) {
    types.push('bytes32');
    values.push(domain.salt);
  }

  return keccak256(encodeAbiParameters(
    types.map(type => ({ type })),
    values as any[]
  ));
}

/**
 * Encode struct hash for EIP-712
 */
export function encodeStructHash(
  primaryType: string,
  types: Record<string, Array<{ name: string; type: string }>>,
  message: Record<string, unknown>
): Hex {
  // Get the type definition
  const typeArray = types[primaryType];
  if (!typeArray) {
    throw new Error(`Type ${primaryType} not found`);
  }

  // Create type hash
  const typeString = `${primaryType}(${typeArray.map(t => `${t.type} ${t.name}`).join(',')})`;
  const typeHash = keccak256(stringToHex(typeString));

  // Encode message values
  const paramTypes = typeArray.map(t => ({ type: t.type }));
  const paramValues = typeArray.map(t => {
    const value = message[t.name];
    if (value === undefined) {
      throw new Error(`Missing value for ${t.name}`);
    }
    return value;
  });

  const encodedParams = encodeAbiParameters(paramTypes, paramValues as any[]);
  
  return keccak256(`${typeHash}${encodedParams.slice(2)}` as Hex);
}

/**
 * Create EIP-712 typed data hash
 */
export function hashTypedData(
  domain: EIP712Domain,
  primaryType: string,
  types: Record<string, Array<{ name: string; type: string }>>,
  message: Record<string, unknown>
): Hex {
  const domainSeparator = encodeDomainSeparator(domain);
  const structHash = encodeStructHash(primaryType, types, message);
  
  return keccak256(
    encodePacked(
      ['string', 'bytes32', 'bytes32'],
      ['\x19\x01', domainSeparator, structHash]
    )
  );
}

/**
 * Build complete typed data object with validation
 */
export function buildTypedData(
  domain: EIP712Domain,
  primaryType: string,
  types: Record<string, Array<{ name: string; type: string }>>,
  message: Record<string, unknown>
) {
  // Validate that primaryType exists in types
  if (!types[primaryType]) {
    throw new Error(`Primary type ${primaryType} not found in types`);
  }

  // Validate message has all required fields
  const requiredFields = types[primaryType].map(t => t.name);
  const messageFields = Object.keys(message);
  
  for (const field of requiredFields) {
    if (!(field in message)) {
      throw new Error(`Missing required field: ${field}`);
    }
  }

  // Warn about extra fields
  for (const field of messageFields) {
    if (!requiredFields.includes(field)) {
      console.warn(`Extra field in message: ${field}`);
    }
  }

  return {
    domain,
    types,
    primaryType,
    message,
  };
}

// ===== CONTRACT INTERACTION HELPERS =====

/**
 * Read contract domain (EIP-5267 or fallback)
 * 
 * @example
 * ```typescript
 * const domain = await readDomainOnchain(
 *   '0xTokenAddress...',
 *   8453
 * );
 * // Returns: { name: 'MyToken', version: '1', chainId: 8453n, ... }
 * ```
 */
export async function readDomainOnchain(
  contractAddress: Address,
  chainId: number
): Promise<Partial<EIP712Domain>> {
  const chain = getChainById(chainId);
  if (!chain) {
    throw new Error(`Unsupported chain ID: ${chainId}`);
  }

  const client = createPublicClient({
    chain,
    transport: http(getRpcUrl(chainId)),
  });

  try {
    // Try EIP-5267 eip712Domain() first
    const domainResult = await client.readContract({
      address: contractAddress,
      abi: [
        {
          name: 'eip712Domain',
          type: 'function',
          stateMutability: 'view',
          inputs: [],
          outputs: [
            { name: 'fields', type: 'bytes1' },
            { name: 'name', type: 'string' },
            { name: 'version', type: 'string' },
            { name: 'chainId', type: 'uint256' },
            { name: 'verifyingContract', type: 'address' },
            { name: 'salt', type: 'bytes32' },
            { name: 'extensions', type: 'uint256[]' },
          ],
        },
      ],
      functionName: 'eip712Domain',
    });

    const [,name, version, chainIdResult, verifyingContract, salt] = domainResult as readonly [
      Hex, string, string, bigint, Address, Hex, readonly bigint[]
    ];

    return {
      name,
      version,
      chainId: chainIdResult,
      verifyingContract,
      salt: salt !== '0x0000000000000000000000000000000000000000000000000000000000000000' ? salt : undefined,
    };
  } catch {
    // Fallback to individual calls
    try {
      const [name, version] = await Promise.all([
        client.readContract({
          address: contractAddress,
          abi: [{ name: 'name', type: 'function', stateMutability: 'view', inputs: [], outputs: [{ type: 'string' }] }],
          functionName: 'name',
        }).catch(() => 'Unknown'),
        client.readContract({
          address: contractAddress,
          abi: [{ name: 'version', type: 'function', stateMutability: 'view', inputs: [], outputs: [{ type: 'string' }] }],
          functionName: 'version',
        }).catch(() => '1'),
      ]);

      return {
        name: name as string,
        version: version as string,
        chainId: BigInt(chainId),
        verifyingContract: contractAddress,
      };
    } catch {
      // Last resort - use contract address as name
      return {
        name: contractAddress,
        version: '1',
        chainId: BigInt(chainId),
        verifyingContract: contractAddress,
      };
    }
  }
}

/**
 * Read domain separator from contract
 */
export async function domainSeparatorOnchain(
  contractAddress: Address,
  chainId: number
): Promise<Hex | null> {
  const chain = getChainById(chainId);
  if (!chain) {
    throw new Error(`Unsupported chain ID: ${chainId}`);
  }

  const client = createPublicClient({
    chain,
    transport: http(getRpcUrl(chainId)),
  });

  try {
    const result = await client.readContract({
      address: contractAddress,
      abi: [
        {
          name: 'DOMAIN_SEPARATOR',
          type: 'function',
          stateMutability: 'view',
          inputs: [],
          outputs: [{ type: 'bytes32' }],
        },
      ],
      functionName: 'DOMAIN_SEPARATOR',
    });

    return result as Hex;
  } catch {
    return null;
  }
}

/**
 * Assert that local domain matches on-chain domain
 */
export async function assertDomainMatchesOnchain(
  domain: EIP712Domain,
  contractAddress: Address,
  chainId: number
): Promise<void> {
  const onchainSeparator = await domainSeparatorOnchain(contractAddress, chainId);
  if (!onchainSeparator) {
    console.warn('Contract does not have DOMAIN_SEPARATOR() function');
    return;
  }

  const localSeparator = encodeDomainSeparator(domain);
  if (onchainSeparator !== localSeparator) {
    throw new Error(
      `Domain separator mismatch: local ${localSeparator} != onchain ${onchainSeparator}`
    );
  }
}

// ===== SIGNATURE VERIFICATION =====

/**
 * Verify EIP-712 signature against expected address (EOA only)
 */
export async function verifyTypedEoa(
  domain: EIP712Domain,
  types: Record<string, Array<{ name: string; type: string }>>,
  message: Record<string, unknown>,
  signature: Hex,
  expectedAddress: Address
): Promise<boolean> {
  try {
    const primaryType = Object.keys(types)[0];
    const hash = hashTypedData(domain, primaryType, types, message);
    const recovered = await recoverAddress({ hash, signature });
    return sameAddr(recovered, expectedAddress);
  } catch {
    return false;
  }
}

/**
 * Verify signature using EIP-1271 (smart contract wallets)
 */
export async function verify1271(
  hash: Hex,
  signature: Hex,
  contractWallet: Address,
  chainId: number
): Promise<boolean> {
  const chain = getChainById(chainId);
  if (!chain) {
    throw new Error(`Unsupported chain ID: ${chainId}`);
  }

  const client = createPublicClient({
    chain,
    transport: http(getRpcUrl(chainId)),
  });

  try {
    const result = await client.readContract({
      address: contractWallet,
      abi: [
        {
          name: 'isValidSignature',
          type: 'function',
          stateMutability: 'view',
          inputs: [
            { name: 'hash', type: 'bytes32' },
            { name: 'signature', type: 'bytes' },
          ],
          outputs: [{ name: 'magicValue', type: 'bytes4' }],
        },
      ],
      functionName: 'isValidSignature',
      args: [hash, signature],
    });

    // EIP-1271 magic value: 0x1626ba7e
    const MAGIC_VALUE = '0x1626ba7e';
    return result === MAGIC_VALUE;
  } catch {
    return false;
  }
}

/**
 * Verify signature against expected address (tries both EOA and EIP-1271)
 */
export async function verifyAny(
  params: {
    hash?: Hex;
    domain?: EIP712Domain;
    types?: Record<string, Array<{ name: string; type: string }>>;
    message?: Record<string, unknown>;
  },
  signature: Hex,
  expectedAddress: Address,
  chainId: number
): Promise<{ ok: boolean; method: 'ecrecover' | '1271' | null }> {
  try {
    let hash: Hex;
    
    if (params.hash) {
      hash = params.hash;
    } else if (params.domain && params.types && params.message) {
      const primaryType = Object.keys(params.types)[0];
      hash = hashTypedData(params.domain, primaryType, params.types, params.message);
    } else {
      throw new Error('Must provide either hash or typed data parameters');
    }

    // First try EOA verification
    try {
      const recovered = await recoverAddress({ hash, signature });
      if (sameAddr(recovered, expectedAddress)) {
        return { ok: true, method: 'ecrecover' };
      }
    } catch {
      // EOA verification failed, continue to EIP-1271
    }

    // Try EIP-1271 verification for smart contracts
    const isValid1271 = await verify1271(hash, signature, expectedAddress, chainId);
    return { 
      ok: isValid1271, 
      method: isValid1271 ? '1271' : null 
    };
  } catch {
    return { ok: false, method: null };
  }
}

// ===== NONCE READING HELPERS =====

/**
 * Generic nonce reader that handles different nonce function signatures
 */
export async function readNonceGeneric(
  contractAddress: Address,
  ownerOrTokenId: Address | bigint,
  chainId: number
): Promise<bigint> {
  const chain = getChainById(chainId);
  if (!chain) {
    throw new Error(`Unsupported chain ID: ${chainId}`);
  }

  const client = createPublicClient({
    chain,
    transport: http(getSimulationRpcUrl(chainId)),
  });

  // Try different nonce function signatures
  const nonceFunctions = [
    // ERC-20 permit style: nonces(address)
    {
      name: 'nonces',
      inputs: [{ type: 'address' }],
      condition: () => typeof ownerOrTokenId === 'string',
    },
    // ERC-721 permit style: nonces(uint256)
    {
      name: 'nonces',
      inputs: [{ type: 'uint256' }],
      condition: () => typeof ownerOrTokenId === 'bigint',
    },
    // Alternative: getNonce(address)
    {
      name: 'getNonce',
      inputs: [{ type: 'address' }],
      condition: () => typeof ownerOrTokenId === 'string',
    },
  ];

  for (const func of nonceFunctions) {
    if (!func.condition()) continue;

    try {
      const result = await client.readContract({
        address: contractAddress,
        abi: [
          {
            name: func.name,
            type: 'function',
            stateMutability: 'view',
            inputs: func.inputs,
            outputs: [{ name: 'nonce', type: 'uint256' }],
          },
        ],
        functionName: func.name,
  
        args: [ownerOrTokenId] as any,
      });

      return result as bigint;
    } catch {
      // Try next function signature
      continue;
    }
  }

  throw new Error(`Could not read nonce for ${ownerOrTokenId} from ${contractAddress}`);
}
