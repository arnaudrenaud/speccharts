import { GenerateArgs, File } from "../types";
import { getChartFromSpecFile } from "./getChartFromSpecFile/getChartFromSpecFile";
import { getChartFiles } from "./getChartFiles/getChartFiles";

export const Generate =
  (
    getFilePaths: (patterns: string[]) => Promise<string[]>,
    readFile: (path: string) => Promise<File>,
    writeFile: (file: File) => Promise<File>
  ) =>
  async (args: GenerateArgs): Promise<File[]> => {
    const specFilePaths = await getFilePaths(args.specFilePathPatterns);
    const specFiles = await Promise.all(specFilePaths.map(readFile));
    const charts = specFiles.map(getChartFromSpecFile);
    const filesToWrite = getChartFiles(charts, args.outputDirectoryPath);
    return await Promise.all(filesToWrite.map(writeFile));
  };
