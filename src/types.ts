export type GenerateArgs = {
  specFilesPathPatterns: string[];
  outputDirectoryPath: string;
};

export type File = {
  path: string;
  content: string;
};

export type SpecNode = {
  type: "describe" | "it";
  name: string;
  location?: {
    file: string;
    line: number;
  };
  children?: SpecNode[];
};

export type SpecTree = {
  name: string;
  children: SpecNode[];
};

export type SpecChart = {
  specFile: File;
  chart: string;
};
