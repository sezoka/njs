import * as lib from "./lib"
import * as types from "./types"

export type NodeVart
  = lib.Tag<"int", number>
  | lib.Tag<"float", number>
  | lib.Tag<"binary", { left: Node, op: BinOp, right: Node }>

export type NodeKind = NodeVart["kind"];

export type Node = NodeVart & { line: number, type: types.ValType };

export type Ast = Node[];

export type BinOp
  = "+"
  | "-"
  | "*"
  | "/"
