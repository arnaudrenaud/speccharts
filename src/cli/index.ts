#!/usr/bin/env node

import { generateLocalFileSystem } from "../Generate/generateLocalFileSystem";
import { printCommandHeader } from "./utils";
import { args } from "./args";

printCommandHeader(args);
generateLocalFileSystem({
  inputFilePatterns: args.inputFilePatterns,
  outputDirectoryPath: args.outputDirectory,
  singleOutputFile: args.singleOutputFile,
});
