import { Network } from "../../config";
import { SpamScore } from "../types";

export const ADDITIONAL_SPAM_TOKENS: Partial<Record<Network, Record<string, SpamScore>>> = {};