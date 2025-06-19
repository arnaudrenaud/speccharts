export type GenerateArgs = {
  specFilePatterns: string[];
};

export type FileWithContent = {
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
  specFile: FileWithContent;
  chart: string;
};
