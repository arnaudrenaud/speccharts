import { GenerateArgs, File } from "../types";
import { getChartFromSpecFile } from "./getChartFromSpecFile/getChartFromSpecFile";
import { getChartFiles } from "./getChartFiles/getChartFiles";

export default (
    getFilePaths: (patterns: string[]) => Promise<string[]>,
    readFile: (path: string) => Promise<File>,
    writeFile: (file: File) => Promise<File>
  ) =>
  async (args: GenerateArgs): Promise<File[]> => {
    const specFilePaths = await getFilePaths(args.specFilePatterns);
    const specFiles = await Promise.all(specFilePaths.map(readFile));
    const charts = specFiles.map(getChartFromSpecFile);
    const filesToWrite = getChartFiles(charts);
    return await Promise.all(filesToWrite.map(writeFile));
  };
