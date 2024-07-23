import fs from "node:fs";
import * as config from "../config"
import * as log from "../log"

export type Box<T> = { data: T };

export type Tag<T, V = nil> = { kind: T, value: V };

export function read_entire_file(file_path: string): string | nil {
  try {
    return fs.readFileSync(file_path, { encoding: "utf8" });
  } catch (e: any) {
    if (config.mode === "debug") {
      const thisline = new Error().stack
      console.log(thisline)
      log.err(e);
    }
    return nil;
  }
}

export function is_digit(c: char): bool {
  return '0' <= c && c <= '9';
}

const alpha_regex = /\p{L}/u;
export function is_alpha(c: char): bool {
  return alpha_regex.test(c);
};

export function unreachable(): never {
  throw new Error("unreachable");
}


