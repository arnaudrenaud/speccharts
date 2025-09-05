export type GenerateArgs = {
  inputFilePatterns: string[];
  outputDirectoryPath: string;
  singleOutputFile: boolean;
};

export type File = {
  path: string;
  content: string;
};

export type SpecNode = {
  type: "case" | "question" | "answer" | "behavior";
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
