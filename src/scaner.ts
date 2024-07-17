import * as tokens from "./tokens";
import * as lib from "./lib";


type Lexer = {
  src: string,
  i: number,
  start: number,
  line: number,
};


export function get_tokens(src: string): tokens.Token[] | nil {
  const lexer: Lexer = { src, i: 0, line: 1, start: 0, };
  const tokens_list: tokens.Token[] = [];

  let tok = get_next_token(lexer);
  while (tok !== nil) {
    tokens_list.push(tok);
    tok = get_next_token(lexer);
  }

  return tokens_list;
}

function is_at_end(l: Lexer): bool {
  return l.src.length <= l.i;
}

function peek(l: Lexer): char {
  return l.src.length <= l.i ? "\0" : l.src[l.i];
}

function advance(l: Lexer): char {
  const c = l.src[l.i];
  l.i += 1;
  return c;
}

function create_token(l: Lexer, tok: tokens.TokenVart): tokens.Token {
  return {
    ...tok,
    line: l.line,
    lexeme: get_lexeme(l),
  }
}

function get_next_token(l: Lexer): tokens.Token | nil {
  skip_whitespaces(l);

  l.start = l.i;

  if (is_at_end(l)) {
    return nil;
  }

  if (lib.is_digit(peek(l))) {
    return read_number(l);
  }

  const c = advance(l);
  switch (c) {
    case '+': return create_token(l, { kind: "plus", value: nil });
    case '-': return create_token(l, { kind: "minus", value: nil });
    case '*': return create_token(l, { kind: "multiply", value: nil });
    case '/': return create_token(l, { kind: "divide", value: nil });
  }

  return err(l, `unexpected character '${c}'`);
}

function read_number(l: Lexer): tokens.Token {
  while (lib.is_digit(peek(l))) {
    advance(l);
  }

  let is_float = peek(l) === ".";
  if (is_float) {
    is_float = true;
    advance(l);
    while (lib.is_digit(peek(l))) {
      advance(l);
    }
  }

  const num = Number(get_lexeme(l));
  return create_token(l, { kind: is_float ? "float" : "int", value: num });
}

function get_lexeme(l: Lexer): string {
  return l.src.slice(l.start, l.i);
}

function skip_whitespaces(l: Lexer) {
  while (!is_at_end(l)) {
    switch (peek(l)) {
      case '\n':
        l.line += 1;
        advance(l);
        break;
      case '\t':
      case ' ':
      case '\r':
        advance(l);
        break;
      default:
        return;
    }
  }
}


function err(l: Lexer, msg: string): nil {
  console.error(`[${l.line}]Syntax error: ${msg}`);
  return nil;
}
