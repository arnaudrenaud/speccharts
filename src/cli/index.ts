#!/usr/bin/env node

import {
  generateAndWriteToFiles,
  generateAndWriteToStandardOutput,
} from "../generateLocalFileSystem/generateLocalFileSystem";
import { printCommandHeader } from "./utils";
import { args } from "./args";

if (args.outputFile || args.separateOutputFiles) {
  printCommandHeader(args);
  generateAndWriteToFiles({
    inputFilePatterns: args.inputFilePatterns,
    singleOutputFilePath: args.outputFile,
  });
} else {
  generateAndWriteToStandardOutput({
    inputFilePatterns: args.inputFilePatterns,
  });
}
