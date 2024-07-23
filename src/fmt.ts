import * as types from "./types";

export function format_type(t: types.ValType): string {
  switch (t.kind) {
    case "int": return "int";
    case "float": return "float";
    case "unknown": return "unknown";
    case "bool": return "bool";
  }
}
