import { FileWithContent, SpecTree } from "../../types";

export default (file: FileWithContent): SpecTree => {
  // TODO
  return {
    name: file.path,
    children: [],
  };
};
