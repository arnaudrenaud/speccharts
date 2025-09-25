#!/usr/bin/env node

import { generateAndWriteToFiles, generateAndWriteToStandardOutput } from "../";
import { printCommandHeader } from "./utils";
import { args } from "./args";

if (args.singleOutputFile && args.multipleOutputFiles) {
  console.error(
    "❌ Error: Cannot specify both --single-output-file and --multiple-output-files."
  );
  process.exit(1);
}

if (args.singleOutputFile || args.multipleOutputFiles) {
  printCommandHeader(args);
  generateAndWriteToFiles({
    inputFilePatterns: args.inputFilePatterns,
    singleOutputFilePath: args.singleOutputFile,
  });
} else {
  generateAndWriteToStandardOutput(args);
}
