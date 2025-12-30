/// <reference types="vite/client" />

// JSON module declarations for ABI imports
declare module "*.json" {
  const value: any;
  export default value;
}
