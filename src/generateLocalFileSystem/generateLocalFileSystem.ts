import { glob } from "fast-glob";
import fsExtra from "fs-extra";

import { File, GenerateArgs } from "../Generate/types";
import { Generate } from "../Generate/Generate";
import { logChartFilesWritten } from "../Generate/helpers/log";
import { getChartFiles } from "../Generate/helpers/getChartFiles";
import { getChartsInSingleFile } from "../Generate/helpers/getChartsInSingleFile/getChartsInSingleFile";
import { GenerateLocalFileSystemArgs } from "./types";

const getFilePaths = async (patterns: string[]): Promise<string[]> => {
  return glob(patterns);
};

const readFile = async (path: string): Promise<File> => {
  return { path, content: (await fsExtra.readFile(path)).toString() };
};

const writeToLocalFileSystem = async (files: File[]): Promise<File[]> => {
  const filesWritten = await Promise.all(
    files.map(async (file) => {
      await fsExtra.outputFile(file.path, file.content);
      return file;
    })
  );
  logChartFilesWritten(filesWritten);
  return filesWritten;
};

export const generateAndWriteToFiles = async (
  args: GenerateLocalFileSystemArgs
): Promise<void> => {
  const charts = await Generate(getFilePaths, readFile)(args);
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
