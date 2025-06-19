import getChartFiles from "./getChartFiles/getChartFiles";
import getChartFromSpecFile from "./getChartFromSpecFile/getChartFromSpecFile";
import { GenerateArgs, FileWithContent } from "../types";

export default (
    getFilePaths: (patterns: string[]) => Promise<string[]>,
    readFile: (path: string) => Promise<FileWithContent>,
    writeFile: (file: FileWithContent) => Promise<void>
  ) =>
  async (args: GenerateArgs) => {
    const specFilePaths = await getFilePaths(args.specFilePatterns);
    const specFiles = await Promise.all(specFilePaths.map(readFile));
    const charts = specFiles.map(getChartFromSpecFile);
    const filesToWrite = getChartFiles(charts);
    await Promise.all(filesToWrite.map(writeFile));
  };
