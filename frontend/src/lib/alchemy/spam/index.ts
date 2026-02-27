// The Alchemy hooks in the codebase automatically filter out these spam tokens

import { Network } from "../config";
import { INITIAL_SPAM_TOKENS } from "./initial-spam-tokens";
import { ADDITIONAL_SPAM_TOKENS } from "./additional-spam-tokens";

export const isSpamToken = (network: Network, address?: string | null) => {
  if (!address) return false;

  if (network == Network.MATIC_MAINNET_OLD) {
    network = Network.MATIC_MAINNET
  }
  
  return INITIAL_SPAM_TOKENS[network]?.[address.toLowerCase()] 
    || ADDITIONAL_SPAM_TOKENS[network]?.[address.toLowerCase()];
};

/**
 * Returns true if an NFT should be blocked from display.
 * Checks both the static spam lists and Alchemy's live isSpam flag.
 */
export const isSpamNft = (
  network: Network,
  contractAddress?: string | null,
  isSpamFlag?: boolean,
  spamClassifications?: string[]
): boolean => {
  if (isSpamFlag === true) return true;
  if (spamClassifications && spamClassifications.length > 0) return true;
  if (isSpamToken(network, contractAddress)) return true;
  return false;
};

/**
 * Validates that a contract address is a properly formatted EVM address.
 * Rejects zero address and obviously invalid inputs.
 */
export const isSafeContractAddress = (address?: string | null): boolean => {
  if (!address) return false;
  if (!/^0x[0-9a-fA-F]{40}$/.test(address)) return false;
  if (address.toLowerCase() === '0x0000000000000000000000000000000000000000') return false;
  return true;
};