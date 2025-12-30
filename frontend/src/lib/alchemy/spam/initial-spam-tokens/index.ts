import { Network } from "../../config";
import { SpamScore } from "../types";
import ethereumSpamTokens from "./ethereum.json" assert { type: "json" };
import baseSpamTokens from "./base.json" assert { type: "json" };
import optimismSpamTokens from "./optimism.json" assert { type: "json" };
import polygonSpamTokens from "./polygon.json" assert { type: "json" };
import bscSpamTokens from "./bsc.json" assert { type: "json" };

export const INITIAL_SPAM_TOKENS: Partial<Record<Network, Record<string, SpamScore>>> = {
  [Network.ETH_MAINNET]: ethereumSpamTokens as Record<string, SpamScore>,
  [Network.BASE_MAINNET]: baseSpamTokens as Record<string, SpamScore>,
  [Network.OPT_MAINNET]: optimismSpamTokens as Record<string, SpamScore>,
  [Network.MATIC_MAINNET]: polygonSpamTokens as Record<string, SpamScore>,
  [Network.BNB_MAINNET]: bscSpamTokens as Record<string, SpamScore>,
}