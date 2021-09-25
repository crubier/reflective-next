import type { NextApiRequest, NextApiResponse } from 'next';
// import { bundle } from "@swc/core";
import { promises } from "fs"
import { copy } from "fs-extra"
import crypto from 'crypto';
import { Mode } from '@swc/core/spack';

const codeEntry = `import * as React from "react";
const TestApi = () => {
  return (
    <div>
      <p>This component is loaded dynamically by dynamically transpiling a string containing Typescript code with SWC in a NextJS API route.<br/>See ./pages/test-api.ts</p>
    </div>
  );
};

export default TestApi;
`

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<string>
) => {

  const { "no-cache": noCache } = req.query;
  const mode = (process.env.NODE_ENV ?? "production") as Mode;

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

  // Ensure we have our own dir in the temp dir to let swc work on
  const selfDir = `/tmp/reflective-next`;
  if (!(await promises.stat(selfDir).catch(err => {
    if (err.code === "ENOENT") {
      return { isDirectory: () => false }
    };
    throw err;
  })).isDirectory()) {
    await promises.mkdir(selfDir)
  }

  // // Ensure we have a symlink node_modules into our own dir
  // const nodeModulesDir = `/tmp/reflective-next/node_modules`;
  // if (!(await promises.stat(nodeModulesDir).catch(err => {
  //   if (err.code === "ENOENT") {
  //     return { isDirectory: () => false }
  //   };
  //   throw err;
  // })).isDirectory()) {
  //   await promises.symlink(`${process.cwd()}/node_modules`, nodeModulesDir, "dir")
  // }
  // console.error("Listing swc files");
  // (await promises.readdir(`${nodeModulesDir}/@swc`)).forEach(file => {
  //   console.error(`    ${file}`);
  // });

  const nodeModulesLocation = require.resolve('next');
  console.error("nodeModulesLocation", nodeModulesLocation);
  console.error("__dirname", __dirname);
  console.error("process.cwd()", process.cwd());

  console.error("Listing swc files from own node_modules");
  (await promises.readdir(`${process.cwd()}/node_modules/@swc`)).forEach(file => {
    console.error(`    ${file}`);
  });

  // Ensure we have a symlink node_modules into our own dir
  const nodeModulesDir = `/tmp/reflective-next/node_modules`;
  if (!(await promises.stat(nodeModulesDir).catch(err => {
    if (err.code === "ENOENT") {
      return { isDirectory: () => false }
    };
    throw err;
  })).isDirectory()) {
    await copy(`${process.cwd()}/node_modules`, nodeModulesDir)
  }

  console.error("Listing swc files from copied node_modules");
  (await promises.readdir(`${nodeModulesDir}/@swc`)).forEach(file => {
    console.error(`    ${file}`);
  });

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
    // const transpilationOutput = await bundle({
    //   entry: { main: entryFile },
    //   output: { name: "mainOutput", path: outputFile },
    //   target: "browser",
    //   module: {
    //   },
    //   options: {
    //     jsc: {
    //       transform: {
    //         optimizer: {
    //           globals: {
    //             vars: {
    //               process: `{env:{NODE_ENV: "${mode}"}}`
    //             }
    //           }
    //         }
    //       }
    //     },
    //   },
    // })
    // const codeOutput = transpilationOutput.main.code;
    const codeOutput = "";
    await promises.writeFile(outputFile, codeOutput, { encoding: 'utf8' })
    res.setHeader('Content-Type', 'application/javascript');
    res.status(200).send(codeOutput);
    console.error("Returned without cache")
    return;
  }

  // Return the content of the cached file
  const codeOutput = await promises.readFile(outputFile, { encoding: 'utf8' })
  res.setHeader('Content-Type', 'application/javascript');
  res.status(200).send(codeOutput);
  console.error("Returned from cache")
  return;

}

export default handler

