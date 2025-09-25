import { GenerateArgs } from "../Generate/types";

export type GenerateLocalFileSystemArgs = GenerateArgs & {
  singleOutputFilePath?: string;
};
