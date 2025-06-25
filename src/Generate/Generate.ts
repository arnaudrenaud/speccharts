import { GenerateArgs, File } from "../types";
import { getChartFromSpecFile } from "./getChartFromSpecFile/getChartFromSpecFile";
import { getChartFiles } from "./getChartFiles/getChartFiles";
import { logFoundSpecFiles as logSpecFilesFound } from "./logFoundSpecFiles";

export const Generate =
  (
    getFilePaths: (patterns: string[]) => Promise<string[]>,
    readFile: (path: string) => Promise<File>,
    writeFile: (file: File) => Promise<File>
  ) =>
  async (args: GenerateArgs): Promise<File[]> => {
    const specFilePaths = await getFilePaths(args.specFilesGlobPatterns);
    if (specFilePaths.length === 0) {
      throw new Error(
        `❌ Found no spec files – did you pass directory name instead of glob pattern (e.g. "src" instead of "src/**/*.spec.ts")?`
      );
    }
    logSpecFilesFound(specFilePaths);

    const specFiles = await Promise.all(specFilePaths.map(readFile));
    const charts = specFiles.map(getChartFromSpecFile);
    const filesToWrite = getChartFiles(charts, args.outputDirectoryPath);
    return await Promise.all(filesToWrite.map(writeFile));
  };
