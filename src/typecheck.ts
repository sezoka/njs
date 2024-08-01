import * as ast from "./ast";
import * as fmt from "./fmt";
import * as lib from "./lib";
import * as types from "./types";



export type Typechecker = {

};


export function check(nodes: ast.Node[]): bool {
  const tc: Typechecker = {

  };

  for (let i = 0; i < nodes.length; i += 1) {
    const ok = check_node(tc, nodes[i]);
    if (!ok) return false;
  }

  return true;
}

function check_node(tc: Typechecker, node: ast.Node): bool {
  const result = check_node_impl(tc, node);
  lib.assert(!result || node.type.kind !== "unknown");
  return result;
}

function check_node_impl(tc: Typechecker, node: ast.Node): bool {
  switch (node.kind) {
    case "int":
      console.log("DFJLSDFJ");
      node.type = types.type_int
      return true;
    case "float":
      node.type = types.type_float
      return true;
    case "binary":
      const binary = node.value;
      let ok = check_node(tc, binary.left);
      if (!ok) return false;
      ok = check_node(tc, binary.right);
      if (!ok) return false;

      switch (binary.op) {
        case "plus":
        case "minus":
        case "multiply":
        case "divide":
          if (binary.left.type.kind !== binary.right.type.kind) {
            return err(
              `expect both operands of binary op '${binary.op}' to be of same type, but got '${fmt.format_type(binary.left.type)}' and '${fmt.format_type(binary.right.type)}'`,
              node.line);
          }
          node.type = binary.left.type;
          break;
        case "and":
        case "or":
          if (binary.left.type.kind !== binary.right.type.kind || binary.left.type.kind !== "bool") {
            return err(`expect both operans of binary op '${binary.op}' to be of type 'bool', but got '${binary.left.kind}' and '${binary.right.kind}'`, node.line);
          }
          node.type = types.type_bool;
          break;
        default:
          lib.unreachable()
      }
      return true;
    case "grouping":
      check_node(tc, node.value.expr);
      node.type = node.value.expr.type;
      return true;
    case "bool":
      return true;
  }
}

function err(msg: string, line: number): false {
  console.error(`[${line}]Type error: ${msg}`);
  return false;
}

