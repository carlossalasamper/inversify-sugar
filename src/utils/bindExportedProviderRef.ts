import { Container } from "inversify";
import ExportedProviderRef from "../types/ExportedProviderRef";
import { IMPORTED_TAG } from "./constants";

export default function bindExportedProviderRef(
  exportedProviderRef: ExportedProviderRef,
  container: Container
) {
  container
    .bind(exportedProviderRef.provide)
    .toDynamicValue(exportedProviderRef.getValue)
    .whenTargetTagged(IMPORTED_TAG, true);
}
