export type GenerateArgs = {
  inputFilePatterns: string[];
};

export type File = {
  path: string;
  content: string;
};

export type TableSpecNodeType = "table" | "table-row" | "table-cell";

export type SpecNode = {
  type: "case" | "question" | "answer" | "behavior" | TableSpecNodeType;
  name: string;
  location?: {
    file: string;
    line: number;
  };
  children?: SpecNode[];
  tableData?: unknown[];
  isInterpolated?: boolean; // For table-cell nodes: true if contains interpolated value
};

export type SpecTree = {
  name: string;
  children: SpecNode[];
};

export type SpecChart = {
  specFile: File;
  chart: string;
};
