#!/usr/bin/env node

import { printCommandHeader } from "./utils";
import { args } from "./args";
import {
  generateAndWriteToFiles,
  generateAndWriteToStandardOutput,
} from "../generateLocalFileSystem/generateLocalFileSystem";

if (args.singleOutputFile && args.multipleOutputFiles) {
  console.error(
    "❌ Error: Cannot specify both --single-output-file and --multiple-output-files."
  );
  process.exit(1);
}

if (
  args.deleteExistingCharts &&
  !(args.singleOutputFile || args.multipleOutputFiles)
) {
  console.error(
    "❌ Error: --delete-existing-charts can only be used when writing charts to files."
  );
  process.exit(1);
}

if (args.singleOutputFile || args.multipleOutputFiles) {
  printCommandHeader(args);
  generateAndWriteToFiles({
    inputFilePatterns: args.inputFilePatterns,
    singleOutputFilePath: args.singleOutputFile,
    deleteExistingCharts: args.deleteExistingCharts,
  });
} else {
  generateAndWriteToStandardOutput(args);
}
