import { glob } from "fast-glob";
import fsExtra from "fs-extra";

import { File } from "../Generate/types";
import { Generate } from "../Generate/Generate";
import { Logger } from "../Generate/helpers/log";
import { getChartFiles } from "../Generate/helpers/getChartFiles/getChartFiles";
import { getChartsInSingleFile } from "../Generate/helpers/getChartsInSingleFile/getChartsInSingleFile";
import { GenerateLocalFileSystemArgs } from "./types";

const standardOutputLogger = new Logger(console.log);

const getFilePaths = async (patterns: string[]): Promise<string[]> => {
  return glob(patterns);
};

const readFile = async (path: string): Promise<File> => {
  return { path, content: (await fsExtra.readFile(path)).toString() };
};

const writeToLocalFileSystem = async (files: File[]): Promise<File[]> => {
  const logger = new Logger(console.log);
  const filesWritten = await Promise.all(
    files.map(async (file) => {
      await fsExtra.outputFile(file.path, file.content);
      return file;
    })
  );
  logger.logChartFilesWritten(filesWritten);
  return filesWritten;
};

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
  console.log(output);
};
