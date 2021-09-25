import type { NextApiRequest, NextApiResponse } from 'next';

import * as rollup from "rollup";
// import sucrase from '@rollup/plugin-sucrase';
// import jsx from 'acorn-jsx';
// import typescript from "@rollup/plugin-typescript";
import resolve from '@rollup/plugin-node-resolve';
import babel from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import replace from '@rollup/plugin-replace';


import { promises } from "fs"
// import { copy } from "fs-extra"
import crypto from 'crypto';


const codeEntry = `import * as React from "react";
const TestApiRollup = () => {
  return (
    <div>
      <p>This component is loaded dynamically by dynamically transpiling a string containing Typescript code with Rollup and Babel in a NextJS API route.<br/>See ./pages/test-api-rollup.ts</p>
    </div>
  );
};

export default TestApiRollup;
`


const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<string>
) => {

  const { "no-cache": noCache } = req.query;
  const mode = (process.env.NODE_ENV ?? "production");

  // Ensure we have a temp dir we can use
  const tempDir = `/tmp`;
  if (!(await promises.stat(tempDir).catch(err => {
    if (err.code === "ENOENT") {
      return { isDirectory: () => false }
    };
    throw err;
  })).isDirectory()) {
    await promises.mkdir(tempDir)
  }

  // Ensure we have our own dir in the temp dir to let rollup work on
  const selfDir = `/tmp/reflective-next-rollup`;
  if (!(await promises.stat(selfDir).catch(err => {
    if (err.code === "ENOENT") {
      return { isDirectory: () => false }
    };
    throw err;
  })).isDirectory()) {
    await promises.mkdir(selfDir)
  }

  // Ensure we have a symlink node_modules into our own dir
  const nodeModulesDir = `/tmp/reflective-next-rollup/node_modules`;
  if (!(await promises.stat(nodeModulesDir).catch(err => {
    if (err.code === "ENOENT") {
      return { isDirectory: () => false }
    };
    throw err;
  })).isDirectory()) {
    await promises.symlink(`${process.cwd()}/node_modules`, nodeModulesDir, "dir")
  }


  // // OR Ensure we have a copy of node_modules into our own dir
  // const nodeModulesDir = `/tmp/reflective-next-rollup/node_modules`;
  // if (!(await promises.stat(nodeModulesDir).catch(err => {
  //   if (err.code === "ENOENT") {
  //     return { isDirectory: () => false }
  //   };
  //   throw err;
  // })).isDirectory()) {
  //   await copy(`${process.cwd()}/node_modules`, nodeModulesDir)
  // }

  // Ensure we have a dir for the current code, based on its hash
  const key = crypto.createHash('md5').update(codeEntry).digest('hex');
  const keyDir = `${selfDir}/${key}`
  if (!(await promises.stat(keyDir).catch(err => {
    if (err.code === "ENOENT") {
      return { isDirectory: () => false }
    };
    throw err;
  })).isDirectory()) {
    await promises.mkdir(keyDir)
  }

  // Ensure we have a file containing the entry of the current code 
  const entryFile = `${keyDir}/entry.tsx`;
  if (noCache !== undefined || !(await promises.stat(entryFile).catch(err => {
    if (err.code === "ENOENT") {
      return { isFile: () => false }
    };
    throw err;
  })).isFile()) {
    await promises.writeFile(entryFile, codeEntry, { encoding: 'utf8' })
  }

  // Ensure we have a file containing the output of the current code 
  const outputFile = `${keyDir}/output.js`;
  if (noCache !== undefined || !(await promises.stat(outputFile).catch(err => {
    if (err.code === "ENOENT") {
      return { isFile: () => false }
    };
    throw err;
  })).isFile()) {

    const bundle = await rollup.rollup({
      input: entryFile,
      cache: false,
      external: [],
      // acornInjectPlugins: [jsx() as () => unknown],
      plugins: [
        replace({
          preventAssignment: true,
          'process.env.NODE_ENV': JSON.stringify(mode)
        }),
        resolve({
          extensions: ['.js', '.ts', ".tsx", ".jsx"]
        }),
        commonjs(),
        babel({
          babelrc: false,
          presets: [
            ['@babel/preset-react', { development: mode === "development" }],
            ['@babel/preset-typescript', { isTSX: true, allExtensions: true }],
            ['@babel/preset-env', { targets: "defaults" }]
          ], babelHelpers: 'bundled', extensions: ['.js', '.ts', ".tsx", ".jsx"]
        })

        // // Sucrase transpiles but does not bundle imported packages...
        // sucrase({
        //   exclude: [],
        //   transforms: [
        //     "jsx",
        //     'typescript',
        //     "imports"
        //   ]
        // })

        // // Typescript bundles but does not transpile....
        // commonjs(),
        // typescript({
        //   tsconfig: false,
        //   "target": "es5",
        //   "lib": [
        //     "dom",
        //     "dom.iterable",
        //     "esnext"
        //   ],
        //   "allowJs": true,
        //   "skipLibCheck": true,
        //   "strict": true,
        //   "module": "esnext",
        //   "moduleResolution": "node",
        //   "resolveJsonModule": true,
        //   "isolatedModules": true,
        //   "jsx": "react",
        // })
      ],
    });

    const { output } = await bundle.generate({
      file: outputFile,
      format: 'module'
    });

    const codeOutput = output[0].code;
    // await bundle.write({
    //   file: outputFile,
    // });
    await bundle.close();
    await promises.writeFile(outputFile, codeOutput, { encoding: 'utf8' })

    res.setHeader('Content-Type', 'application/javascript');
    res.status(200).send(codeOutput);
    console.log("Returned rollup without cache")
    return;
  }

  // Return the content of the cached file
  const codeOutput = await promises.readFile(outputFile, { encoding: 'utf8' })
  res.setHeader('Content-Type', 'application/javascript');
  res.status(200).send(codeOutput);
  console.log("Returned rollup from cache")
  return;

}

export default handler

