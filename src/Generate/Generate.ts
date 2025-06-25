import { GenerateArgs, File } from "../types";
import { getChartFiles } from "./getChartFiles/getChartFiles";
import { getChartFromTestFile } from "./getChartFromTestFile/getChartFromTestFile";
import { logChartFilesWritten, logTestFilesFound } from "./logTestFilesFound";

export const Generate =
  (
    getFilePaths: (patterns: string[]) => Promise<string[]>,
    readFile: (path: string) => Promise<File>,
    writeFile: (file: File) => Promise<File>
  ) =>
  async (args: GenerateArgs): Promise<File[]> => {
    const testFilePaths = await getFilePaths(args.testFilesGlobPatterns);
    if (testFilePaths.length === 0) {
      throw new Error(
        `❌ Found no test files – did you pass directory name instead of glob pattern (e.g. "src" instead of "src/**/*.spec.ts")?`
      );
    }
    logTestFilesFound(testFilePaths);

    const testFiles = await Promise.all(testFilePaths.map(readFile));

    const charts = testFiles.map(getChartFromTestFile);

    const filesToWrite = getChartFiles(charts, args.outputDirectoryPath);
    const filesWritten = await Promise.all(filesToWrite.map(writeFile));
    logChartFilesWritten(filesWritten);
    return filesWritten;
  };
