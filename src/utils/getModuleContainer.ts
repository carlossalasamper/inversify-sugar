import { Newable } from "../types";
import SugaryContainer from "./ModuleContainer";
import { getModuleMetadata } from "./metadata/getModuleMetadata";

export default function getModuleContainer(Module: Newable): SugaryContainer {
  const metadata = getModuleMetadata(Module);

  return metadata.container;
}
