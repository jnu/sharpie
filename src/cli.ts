import * as fs from "fs";
import {renderToString} from "./html";

interface CLIArg {
  readonly shortFlag: string;
  readonly longFlag: string;
  readonly nargs: number;
  readonly required?: boolean;
  readonly default?: string | boolean; 
}

const ARGS: CLIArg[] = [
  {
    shortFlag: "t",
    longFlag: "text",
    nargs: 1,
    required: true,
  },
  {
    shortFlag: "a",
    longFlag: "annotations",
    nargs: 1,
    required: true,
  },
  {
    shortFlag: "s",
    longFlag: "simple",
    nargs: 0,
    default: true,
  },
  {
    shortFlag: "p",
    longFlag: "paragraphs",
    nargs: 0,
    default: true,
  },
];

/**
 * A teeny tiny CLI flag parser.
 *
 * Supports flags only; no positional arguments. Flags can have 0 or more
 * values. With 0 values the flag is interpretted as boolean; with 1 the
 * value is interpetted as a string; and multiple values are interpretted as
 * an array of strings.
 *
 * Parser supports required arguments and defaults.
 */
function parseArgs(argList: CLIArg[], argv: string[]) {
  const ns = new Map<string, boolean | string | string[]>();
  const required = new Set<string>();

  // Build lookup table for flags
  const flagMap = argList.reduce((m, def) => {
    m.set(def.shortFlag, def);
    m.set(def.longFlag, def);
    if (def.hasOwnProperty("default")) {
      ns.set(def.longFlag, def.default);
    }
    if (def.required) {
      required.add(def.longFlag);
    }
    return m;
  }, new Map<string, CLIArg>());

  const args = [...argv];
  while (args.length > 0) {
    const arg = args.shift();
    const key = arg.startsWith("--") ?
      arg.substr(2) :
      arg.startsWith("-") ?
      arg.substr(1) : "";

    if (!key || !flagMap.has(key)) {
      throw new Error(`Unrecognized flag: ${arg}`);
    }

    const def = flagMap.get(key);
    required.delete(def.longFlag);

    if (def.nargs > args.length) {
      throw new Error(`${arg} expected ${def.nargs} arguments`);
    }

    // Get values for this flag
    const vals: string[] = [];
    for (let i = 0; i < def.nargs; i++) {
      vals.push(args.shift());
    }

    switch (vals.length) {
      case 0:
        ns.set(def.longFlag, true);
        break;
      case 1:
        ns.set(def.longFlag, vals[0]);
        break;
      default:
        ns.set(def.longFlag, vals);
        break;
    }
  }

  // Ensure requirements
  if (required.size > 0) {
    const r = Array.from(required).join(", ");
    throw new Error(`Missing required arguments: ${r}`);
  }

  return ns;
}

/**
 * Apply annotations to a text (both read from files).
 */
function main() {
  const args = parseArgs(ARGS, process.argv.slice(2));
  const text = fs.readFileSync(args.get("text") as string, "utf-8");
  const atns = fs.readFileSync(args.get("annotations") as string, "utf-8");
  const opts = {
    autoParagraph: args.get("paragraphs") as boolean,
    simpleHTML: args.get("simple") as boolean,
  };
  const result = renderToString(text, JSON.parse(atns), opts);
  // tslint:disable-next-line:no-console
  console.log(result);
}

if (require.main === module) {
  main();
}
