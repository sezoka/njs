const nill = Symbol("nil");

globalThis.nil = nill;

declare global {
  var nil: typeof nill;
  type nil = typeof nill;
  type bool = boolean;
  type char = string;
}
