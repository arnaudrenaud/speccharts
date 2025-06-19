import { FileWithContent, SpecChart } from "../../types";
import { getSpecTree } from "../getSpecTree/getSpecTree";
import { getChart } from "../getChart/getChart";

export const getChartFromSpecFile = (specFile: FileWithContent): SpecChart => {
  return {
    specFile,
    chart: getChart(getSpecTree(specFile)),
  };
};
