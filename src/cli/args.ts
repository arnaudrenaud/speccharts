import { Command } from "@commander-js/extra-typings";

export const args = new Command()
  .option(
    "-i, --input-file-patterns <patterns...>",
    "glob pattern(s) to match input spec files that will serve to generate charts",
    ["**/*.{spec,test}.{ts,tsx}"]
  )
  .option(
    "-o, --output-directory <path>",
    "path to output directory for chart files (will be created if not existing already)",
    "./speccharts"
  )
  .option(
    "-s, --single-output-file",
    "gather all charts in a single Markdown file",
    false
  )
  .showHelpAfterError()
  .parse()
  .opts();
