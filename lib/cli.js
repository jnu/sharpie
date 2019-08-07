"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const html_1 = require("./html");
const ARGS = [
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
function parseArgs(argList, argv) {
    const ns = new Map();
    const required = new Set();
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
    }, new Map());
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
        const vals = [];
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
    if (required.size > 0) {
        const r = Array.from(required).join(", ");
        throw new Error(`Missing required arguments: ${r}`);
    }
    return ns;
}
function main() {
    const args = parseArgs(ARGS, process.argv.slice(2));
    const text = fs.readFileSync(args.get("text"), "utf-8");
    const atns = fs.readFileSync(args.get("annotations"), "utf-8");
    const opts = {
        autoParagraph: args.get("paragraphs"),
        simpleHTML: args.get("simple"),
    };
    const result = html_1.renderToString(text, JSON.parse(atns), opts);
    console.log(result);
}
if (require.main === module) {
    main();
}
//# sourceMappingURL=cli.js.map