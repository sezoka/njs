import "./prelude";
import * as lib from "./lib";
import * as log from "./log";
import * as scaner from "./scaner";
import * as parser from "./parser";
import * as codegen from "./codegen";
import * as typecheck from "./typecheck";












async function main() {
  const argv = Bun.argv;
  if (argv.length !== 3) {
    log.info("usage: njs <file_path.njs>");
    return;
  }

  const file_path = argv[2];
  const program_src = lib.read_entire_file(file_path);
  if (program_src === nil) {
    log.err(`Can't read file ${file_path}`);
    return;
  }

  const tokens = scaner.get_tokens(program_src);
  if (tokens === nil) return;

  const ast = parser.parse(tokens);
  if (ast === nil) return;

  const typecheck_ok = typecheck.check(ast);
  if (!typecheck_ok) return;

  const js_code = codegen.generate(ast);

  console.log(js_code);

  eval("console.log(" + js_code + ");");
}

main();
