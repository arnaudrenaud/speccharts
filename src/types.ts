export type GenerateArgs = {
  testFilesGlobPatterns: string[];
  outputDirectoryPath: string;
};

export type File = {
  path: string;
  content: string;
};

export type SpecNode = {
  type: "case" | "behavior";
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
  testFile: File;
  chart: string;
};
