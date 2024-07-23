import * as lib from "./lib"

export type TokenVart
  = lib.Tag<"int", number>
  | lib.Tag<"float", number>
  | lib.Tag<"minus">
  | lib.Tag<"plus">
  | lib.Tag<"star">
  | lib.Tag<"slash">
  | lib.Tag<"left_paren">
  | lib.Tag<"right_paren">

  | lib.Tag<"and">
  | lib.Tag<"or">
  | lib.Tag<"bang">

  | lib.Tag<"true">
  | lib.Tag<"false">

  | lib.Tag<"ident", string>

// | lib.Tag<"equal_equal">
// | lib.Tag<"not_qual">
// | lib.Tag<"less">
// | lib.Tag<"less_equal">
// | lib.Tag<"greater">
// | lib.Tag<"greater_equal">

export type TokenKind = TokenVart["kind"];

export type Token = TokenVart & { line: number, lexeme: string };
