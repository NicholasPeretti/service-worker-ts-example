import rimraf from "rimraf";

//  Rollup plugins
import typescript from "@rollup/plugin-typescript";
import nodeResolve from "@rollup/plugin-node-resolve";
import json from "@rollup/plugin-json";

//  Cleaning destination folders
rimraf.sync("./dist");
rimraf.sync("./.ts-tmp");

export default {
  input: "./src/index.ts",
  output: {
    dir: "./dist"
  },
  plugins: [
    //  compile typescript with the tsconfig.json options
    typescript(),

    //  Resolve imports
    nodeResolve(),

    //  Allow JSON imports
    json()
  ]
};
