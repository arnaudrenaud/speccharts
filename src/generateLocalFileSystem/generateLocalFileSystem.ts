import { Generate } from "../Generate/Generate";
import { getChartFiles } from "../Generate/helpers/getChartFiles/getChartFiles";
import { getChartsInSingleFile } from "../Generate/helpers/getChartsInSingleFile/getChartsInSingleFile";
import { GenerateLocalFileSystemArgs } from "./types";
import {
  getFilePaths,
  readFile,
  standardOutputLogger,
  writeToLocalFileSystem,
} from "./helpers";

export const generateAndWriteToFiles = async (
  args: GenerateLocalFileSystemArgs
): Promise<void> => {
  const charts = await Generate(
    getFilePaths,
    readFile,
    standardOutputLogger
  )(args);
  const files = getChartFiles(charts, args.singleOutputFilePath);
  await writeToLocalFileSystem(files);
};

export const generateAndWriteToStandardOutput = async (
  args: GenerateLocalFileSystemArgs
): Promise<void> => {
  const charts = await Generate(getFilePaths, readFile)(args);
  const output = getChartsInSingleFile(charts, process.cwd());
  standardOutputLogger.log(output);
};
