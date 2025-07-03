import { glob } from "fast-glob";
import fsExtra from "fs-extra";

import { File } from "./types";
import { Generate } from "./Generate";

const getFilePaths = async (patterns: string[]): Promise<string[]> => {
  return glob(patterns);
};

const readFile = async (path: string): Promise<File> => {
  return { path, content: (await fsExtra.readFile(path)).toString() };
};

const writeFile = async (file: File): Promise<File> => {
  await fsExtra.outputFile(file.path, file.content);
  return file;
};

export const generateLocalFileSystem = Generate(
  getFilePaths,
  readFile,
  writeFile
);
