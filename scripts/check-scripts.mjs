import { execute, filesUnder, root } from "./workspace.mjs";
import { resolve } from "node:path";

for (const directory of ["scripts", "tests"]) {
  for (const file of await filesUnder(resolve(root, directory))) {
    if (file.endsWith(".mjs"))
      await execute(process.execPath, ["--check", file]);
  }
}
console.log("Node scripts: syntax OK");
