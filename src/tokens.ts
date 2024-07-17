import * as lib from "./lib"

export type TokenVart
  = lib.Tag<"int", number>
  | lib.Tag<"float", number>
  | lib.Tag<"minus">
  | lib.Tag<"plus">
  | lib.Tag<"multiply">
  | lib.Tag<"divide">
  | lib.Tag<"left_paren">
  | lib.Tag<"right_paren">

export type TokenKind = TokenVart["kind"];

export type Token = TokenVart & { line: number, lexeme: string };
