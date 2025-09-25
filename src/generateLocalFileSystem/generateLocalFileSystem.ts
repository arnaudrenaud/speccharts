import { SpecChartsGenerator } from "../SpecChartsGenerator/SpecChartsGenerator";
import { GenerateLocalFileSystemArgs } from "./types";
import { writeToLocalFileSystem } from "./helpers/writeFiles";
import { readFile } from "./helpers/readFile";
import { getFilePaths } from "./helpers/getFilePaths";
import { standardOutputLogger } from "./helpers/standardOutputLogger";
import { getChartFiles } from "../chart-files/getChartFiles/getChartFiles";
import { getChartsInSingleFile } from "../chart-files/getChartsInSingleFile/getChartsInSingleFile";

export const generateAndWriteToFiles = async (
  args: GenerateLocalFileSystemArgs
): Promise<void> => {
  const generator = new SpecChartsGenerator(
    getFilePaths,
    readFile,
    standardOutputLogger
  );
  const charts = await generator.generate(args);
  const files = getChartFiles(charts, args.singleOutputFilePath);
  await writeToLocalFileSystem(files);
};

export const generateAndWriteToStandardOutput = async (
  args: GenerateLocalFileSystemArgs
): Promise<void> => {
  const generator = new SpecChartsGenerator(getFilePaths, readFile);
  const charts = await generator.generate(args);
  const output = getChartsInSingleFile(charts, process.cwd());
  standardOutputLogger.log(output);
};
