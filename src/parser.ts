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
  if (!is_at_end(parser)) {
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
  return parse_sum(p);
}

function parse_sum(p: Parser): ast.Node | nil {
  let maybe_left = parse_mult(p);
  if (maybe_left === nil) return nil;
  let left = maybe_left;

  let bin_op_token: lib.Box<tokens.TokenKind> = { data: "plus" };
  while (matches_any(p, ["plus", "minus"], bin_op_token)) {
    const right = parse_mult(p);
    if (right === nil) return nil;

    let op: ast.BinOp;
    switch (bin_op_token.data) {
      case 'minus': op = '-'; break;
      case 'plus': op = '+'; break;
      default: lib.unreachable();
    }

    left = {
      kind: "binary",
      value: { left, op: op, right },
      line: maybe_left.line,
      type: types.type_int,
    }
  }

  return left;
}

function parse_mult(p: Parser): ast.Node | nil {
  let maybe_left = parse_primary(p);
  if (maybe_left === nil) return nil;
  let left = maybe_left;

  let bin_op_token: lib.Box<tokens.TokenKind> = { data: "multiply" };
  while (matches_any(p, ["multiply", "divide"], bin_op_token)) {
    const right = parse_primary(p);
    if (right === nil) return nil;

    let op: ast.BinOp;
    switch (bin_op_token.data) {
      case 'multiply': op = '*'; break;
      case 'divide': op = '/'; break;
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

// function matches(p: Parser, tok_kind: tokens.TokenKind): bool {
//   if (peek(p).kind === tok_kind) {
//     next(p);
//     return true;
//   }
//   return false;
// }

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
      return { kind: "int", value: tok.value, line: tok.line, type: types.type_unknown };
    case "float":
      return { kind: "float", value: tok.value, line: tok.line, type: types.type_unknown };
    default:
      return err(`unexpected token '${tok.kind}'`, tok.line,);
  }
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
