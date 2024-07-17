import * as ast from "./ast";


type Generator = {
  buff: string[];
};


export function generate(nodes: ast.Ast): string {
  const generator: Generator = { buff: [] };

  for (let i = 0; i < nodes.length; i += 1) {
    gen_node(generator, nodes[i]);
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
        case "+": append(g, " + "); break;
        case "-": append(g, " - "); break;
        case "*": append(g, " * "); break;
        case "/": append(g, " / "); break;
      }
      gen_node(g, node.value.right);
  }
  return true;
}
