import { Command } from "@commander-js/extra-typings";

export const args = new Command()
  .option(
    "-i, --input-file-patterns <patterns...>",
    "glob pattern(s) to match input spec files that will serve to generate charts",
    ["**/*.{spec,test}.{ts,tsx}"]
  )
  .option(
    "-o, --output-file <path>",
    "path to output Markdown file compiling all charts"
  )
  .option(
    "-s, --separate-output-files",
    "output separate Mermaid charts next to each corresponding spec file",
    false
  )
  .showHelpAfterError()
  .parse()
  .opts();

if (args.outputFile && args.separateOutputFiles) {
  console.error(
    "❌ Error: Cannot specify both --output-file and --separate-files."
  );
  process.exit(1);
}
