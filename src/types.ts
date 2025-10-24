export type GenerateArgs = {
  inputFilePatterns: string[];
};

export type File = {
  path: string;
  content: string;
};

type SpecNodeBaseType = "case" | "question" | "answer" | "behavior";

export type TableSpecNodeType = "table" | "table-row" | "table-cell";

export type TableSpecNodeSpecifics = {
  tableData?: unknown[];
  isInterpolated?: boolean;
};

export type SpecNode = {
  type: SpecNodeBaseType | TableSpecNodeType;
  name: string;
  location?: {
    file: string;
    line: number;
  };
  children?: SpecNode[];
} & TableSpecNodeSpecifics;

export type SpecTree = {
  name: string;
  children: SpecNode[];
};

export type SpecChart = {
  specFile: File;
  chart: string;
};
