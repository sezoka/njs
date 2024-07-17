import * as lib from "./lib";

export type ValType
  = lib.Tag<"int">
  | lib.Tag<"float">
  | lib.Tag<"unknown">

export type ValTypeKind = ValType["kind"];

export const type_unknown: ValType = { kind: "unknown", value: nil };
export const type_int: ValType = { kind: "int", value: nil };
export const type_float: ValType = { kind: "float", value: nil };
