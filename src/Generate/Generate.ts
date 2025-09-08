import { GenerateArgs, File } from "./types";
import { getChartFiles } from "./helpers/getChartFiles";
import { logChartFilesWritten, logSpecFilesFound } from "./helpers/log";
import { getChartFromSpecFile } from "./helpers/getChartFromSpecFile";

export const Generate =
  (
    getFilePaths: (patterns: string[]) => Promise<string[]>,
    readFile: (path: string) => Promise<File>,
    writeFile: (file: File) => Promise<File>
  ) =>
  async (args: GenerateArgs): Promise<File[]> => {
    const specFilePaths = await getFilePaths(args.inputFilePatterns);
    if (specFilePaths.length === 0) {
      throw new Error(
        `❌ Found no spec files – did you pass directory name instead of glob pattern (e.g. "src" instead of "src/**/*.spec.ts")?`
      );
    }
    logSpecFilesFound(specFilePaths);

    const specFiles = await Promise.all(specFilePaths.map(readFile));

    const charts = specFiles.map(getChartFromSpecFile);

    const filesToWrite = getChartFiles(charts, args.outputDirectoryPath, {
      singleOutputFile: args.singleOutputFile,
    });
    const filesWritten = await Promise.all(filesToWrite.map(writeFile));
    logChartFilesWritten(filesWritten);
    return filesWritten;
  };
