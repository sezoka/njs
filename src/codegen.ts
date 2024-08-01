import * as ast from "./ast";
import * as lib from "./lib";


type Generator = {
  buff: string[];
};


export function generate(nodes: ast.Ast): string {
  const generator: Generator = { buff: [] };

  for (let i = 0; i < nodes.length; i += 1) {
    gen_node(generator, nodes[i]);
    append(generator, ";\n");
  }

  return generator.buff.join("");
}

function append(g: Generator, str: string) {
  g.buff.push(str);
}

function gen_node(g: Generator, node: ast.Node): boolean {
  switch (node.kind) {
    case "int":
      append(g, node.value.toString());
      break;
    case "float":
      append(g, node.value.toString());
      break;
    case "binary":
      gen_node(g, node.value.left);
      switch (node.value.op) {
        case "plus": append(g, " + "); break;
        case "minus": append(g, " - "); break;
        case "multiply": append(g, " * "); break;
        case "divide": append(g, " / "); break;
        case "and": append(g, " && "); break;
        case "or": append(g, " || "); break;
        case "less": append(g, " < "); break;
        case "greater": append(g, " ) "); break;
        case "less_equal": append(g, " <= "); break;
        case "greater_equal": append(g, " >= "); break;
        case "equal": append(g, " === "); break;
        case "not_equal": append(g, " <= "); break;
        default: lib.unreachable();
      }
      gen_node(g, node.value.right);
      break;
    case "grouping":
      append(g, "(");
      gen_node(g, node.value.expr);
      append(g, ")");
      break;
    case "bool":
      append(g, node.value.toString());
      break;
    default:
      lib.unreachable();
  }
  return true;
}
