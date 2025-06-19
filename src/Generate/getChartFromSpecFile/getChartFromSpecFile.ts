import { FileWithContent, SpecChart } from "../../types";
import getChart from "../getChart/getChart";
import getSpecTree from "../getSpecTree/getSpecTree";

export default (specFile: FileWithContent): SpecChart => {
  return {
    specFile,
    chart: getChart(getSpecTree(specFile)),
  };
};
