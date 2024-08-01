import * as tokens from "./tokens";
import * as ast from "./ast";
import * as lib from "./lib";
import * as types from "./types";

type Parser = {
  tokens: tokens.Token[];
  i: number;
}

export function parse(tokens: tokens.Token[]): ast.Ast | nil {
  const parser: Parser = {
    tokens,
    i: 0,
  };

  const result = [];
  while (!is_at_end(parser)) {
    const expr = parse_expression(parser);
    if (expr === nil) return nil
    result.push(expr);
  }

  return result;
}

function is_at_end(p: Parser): bool {
  return p.tokens.length <= p.i;
}

function parse_expression(p: Parser): ast.Node | nil {
  return parse_or(p);
}

function parse_or(p: Parser): ast.Node | nil {
  let maybe_left = parse_and(p);
  if (maybe_left === nil) return nil;
  let left = maybe_left;

  while (matches(p, "or")) {
    const right = parse_and(p);
    if (right === nil) return nil;

    left = {
      kind: "binary",
      value: { left, op: "or", right },
      line: maybe_left.line,
      type: types.type_unknown,
    }
  }

  return left;
}

function parse_and(p: Parser): ast.Node | nil {
  let maybe_left = parse_equality(p);
  if (maybe_left === nil) return nil;
  let left = maybe_left;

  while (matches(p, "and")) {
    const right = parse_equality(p);
    if (right === nil) return nil;

    left = {
      kind: "binary",
      value: { left, op: "and", right },
      line: maybe_left.line,
      type: types.type_unknown,
    }
  }

  return left;
}

function parse_equality(p: Parser): ast.Node | nil {
  let maybe_left = parse_comparison(p);
  if (maybe_left === nil) return nil;
  let left = maybe_left;

  let bin_op_token: lib.Box<tokens.TokenKind> = { data: "equal" };
  while (matches_any(p, ["equal_equal", "not_equal"], bin_op_token)) {
    const right = parse_comparison(p);
    if (right === nil) return nil;

    let op: ast.BinOp;
    switch (bin_op_token.data) {
      case 'equal_equal': op = 'equal'; break;
      case 'not_equal': op = 'not_equal'; break;
      default: lib.unreachable();
    }

    left = {
      kind: "binary",
      value: { left, op: op, right },
      line: maybe_left.line,
      type: types.type_unknown,
    }
  }

  return left;
}

function parse_comparison(p: Parser): ast.Node | nil {
  let maybe_left = parse_mult(p);
  if (maybe_left === nil) return nil;
  let left = maybe_left;

  let bin_op_token: lib.Box<tokens.TokenKind> = { data: "less" };
  while (matches_any(p, ["greater", "greater_equal", "less", "less_equal"], bin_op_token)) {
    const right = parse_mult(p);
    if (right === nil) return nil;

    let op: ast.BinOp = bin_op_token.data as ast.BinOp;

    left = {
      kind: "binary",
      value: { left, op: op, right },
      line: maybe_left.line,
      type: types.type_unknown,
    }
  }

  return left;
}

function parse_mult(p: Parser): ast.Node | nil {
  let maybe_left = parse_primary(p);
  if (maybe_left === nil) return nil;
  let left = maybe_left;

  let bin_op_token: lib.Box<tokens.TokenKind> = { data: "slash" };
  while (matches_any(p, ["star", "slash"], bin_op_token)) {
    const right = parse_primary(p);
    if (right === nil) return nil;

    let op: ast.BinOp;
    switch (bin_op_token.data) {
      case 'star': op = 'multiply'; break;
      case 'slash': op = 'divide'; break;
      default: lib.unreachable();
    }

    left = {
      kind: "binary",
      value: { left, op: op, right },
      line: maybe_left.line,
      type: types.type_unknown,
    }
  }

  return left;
}

function matches(p: Parser, tok_kind: tokens.TokenKind): bool {
  if (peek(p).kind === tok_kind) {
    next(p);
    return true;
  }
  return false;
}

function matches_any(p: Parser, tok_kinds: tokens.TokenKind[], ptr: lib.Box<tokens.TokenKind>): bool {
  for (let i = 0; i < tok_kinds.length; i += 1) {
    if (peek(p).kind === tok_kinds[i]) {
      ptr.data = tok_kinds[i];
      next(p);
      return true;
    }
  }
  return false;
}

function parse_primary(p: Parser): ast.Node | nil {
  const tok = next(p);
  if (tok === nil) return nil;
  switch (tok.kind) {
    case "int":
      return { kind: "int", value: tok.value, line: tok.line, type: types.type_int };
    case "float":
      return { kind: "float", value: tok.value, line: tok.line, type: types.type_float };
    case "true":
    case "false":
      return { kind: "bool", value: tok.kind === "true", line: tok.line, type: types.type_bool };
    case "left_paren":
      const expr = parse_expression(p);
      if (expr === nil) return nil;
      if (expect(p, "right_paren", "expect ')' after grouping expression, but got '" + tok.lexeme + "'", tok.line)) return nil;
      return { kind: "grouping", value: { expr }, line: tok.line, type: types.type_unknown };
    default:
      return err(`unexpected token '${tok.lexeme}'`, tok.line,);
  }
}

function expect(p: Parser, tok_kind: tokens.TokenKind, err_msg: string, line: number): bool {
  if (peek(p).kind === tok_kind) {
    next(p);
    return false;
  }
  err(err_msg, line);
  return true;
}

function next(p: Parser): tokens.Token | nil {
  if (p.tokens.length <= p.i) {
    return err("unexpected end of expression", p.tokens[p.tokens.length - 1].line);
  }
  p.i += 1;
  return p.tokens[p.i - 1];
}

function peek(p: Parser): tokens.Token {
  if (p.tokens.length <= p.i) {
    return p.tokens[p.tokens.length - 1];
  }
  return p.tokens[p.i]
}

function err(msg: string, line: number): nil {
  console.error(`[${line}]Parse error: ${msg}`)
  return nil;
}
