// Workaround for Next.js 16.2.6 bug:
// Next generates `.next/types/validator.ts` which imports from "next/types.js",
// but the `next` package ships no type declaration for that path (types.js is
// an empty "// types-only" file). This ambient declaration lets type-checking
// proceed so our own code can be validated. Remove when Next fixes the upstream issue.
declare module 'next/types.js' {
  export type ResolvingMetadata = Record<string, unknown>;
  export type ResolvingViewport = Record<string, unknown>;
}
