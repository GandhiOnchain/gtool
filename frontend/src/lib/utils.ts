import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function convertNestedBigIntsToStrings(obj: any) {
  if (typeof obj === 'object' && obj !== null) {
    for (const key in obj) {
      if (obj[key] instanceof BigInt) {
        obj[key] = obj[key].toString();
      }
      else if ((typeof obj[key] === 'object' || Array.isArray(obj[key])) && obj[key] !== null) {
        convertNestedBigIntsToStrings(obj[key]);
      }
    }
  }
}
