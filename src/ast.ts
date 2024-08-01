import * as lib from "./lib"
import * as types from "./types"

export type NodeVart
  = lib.Tag<"int", number>
  | lib.Tag<"float", number>
  | lib.Tag<"bool", boolean>
  | lib.Tag<"binary", { op: BinOp, left: Node, right: Node }>
  | lib.Tag<"grouping", { expr: Node }>

export type NodeKind = NodeVart["kind"];

export type Node = NodeVart & { line: number, type: types.ValType };

export type Ast = Node[];

export type BinOp
  = "plus"
  | "minus"
  | "multiply"
  | "divide"
  | "and"
  | "or"
  | "less"
  | "greater"
  | "less_equal"
  | "greater_equal"
  | "equal"
  | "not_equal"
