import { GenerateArgs, File, SpecChart } from "./types";
import { Logger } from "./helpers/log";
import { getChartFromSpecFile } from "./helpers/getChartFromSpecFile";

export const Generate =
  (
    getFilePaths: (patterns: string[]) => Promise<string[]>,
    readFile: (path: string) => Promise<File>,
    logger: Logger = new Logger(() => {})
  ) =>
  async (args: GenerateArgs): Promise<SpecChart[]> => {
    const specFilePaths = await getFilePaths(args.inputFilePatterns);
    if (specFilePaths.length === 0) {
      throw new Error(
        `❌ Found no spec files – did you pass directory name instead of glob pattern (e.g. "src" instead of "src/**/*.spec.ts")?`
      );
    }
    logger.logSpecFilesFound(specFilePaths);

    const specFiles = await Promise.all(specFilePaths.map(readFile));

    return specFiles.map(getChartFromSpecFile);
  };
