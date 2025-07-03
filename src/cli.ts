#!/usr/bin/env node

import { Command } from "@commander-js/extra-typings";
import { generateLocalFileSystem } from "./Generate/generateLocalFileSystem";

const args = new Command()
  .option(
    "-p, --test-file-patterns <patterns...>",
    "glob patterns to match test files that will serve to generate charts",
    ["**/*.spec.ts"]
  )
  .option(
    "-o, --output-directory <path>",
    "path to output directory for chart files (will be created if not existing already)",
    "speccharts"
  )
  .showHelpAfterError()
  .parse()
  .opts();

generateLocalFileSystem({
  testFilesGlobPatterns: args.testFilePatterns,
  outputDirectoryPath: args.outputDirectory,
});
