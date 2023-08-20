import { Container } from "inversify";
import ExportedProviderRef from "../types/ExportedProviderRef";

export default function bindExportedProviderRef(
  exportedProviderRef: ExportedProviderRef,
  container: Container
) {
  container
    .bind(exportedProviderRef.provide)
    .toDynamicValue(exportedProviderRef.getValue)
    .whenTargetIsDefault();
}
