import { Command } from "@commander-js/extra-typings";

export const args = new Command()
  .option(
    "-i, --input-file-patterns <patterns...>",
    "glob pattern(s) to match input spec files that will serve to generate charts",
    ["**/*.{spec,test}.{ts,tsx}"]
  )
  .option(
    "-s, --single-output-file <path>",
    "writes charts in single Markdown file"
  )
  .option(
    "-m, --multiple-output-files",
    "writes each chart in a Mermaid file next to corresponding spec file",
    false
  )
  .showHelpAfterError()
  .parse()
  .opts();
