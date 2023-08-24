import ExportedProviderRef from "../types/ExportedProviderRef";
import { Newable } from "../types";
import importModule from "./importModule";
import bindExportedProviderRef from "./bindExportedProviderRef";
import getAllMetadata from "./getAllMetadata";
import ModuleMetadata from "../types/ModuleMetadata";
import { MODULE_METADATA_KEYS } from "./constants";

/**
 * @description This function is used to process imports.
 * It will group all imported providers from different modules with the same 'provide' property.
 * Then you can inject them as an array.
 */
export default function processImports(
  Module: Newable,
  imports: Newable[]
): ExportedProviderRef[] {
  const { container } = getAllMetadata<ModuleMetadata>(
    Module.prototype,
    MODULE_METADATA_KEYS
  );
  const allRefs: ExportedProviderRef[] = [];
  const reducedRefs: ExportedProviderRef[] = [];
  const groups: Record<
    string,
    {
      provide: ExportedProviderRef["provide"];
      getters: ExportedProviderRef["getValue"][];
    }
  > = {};

  for (const item of imports) {
    allRefs.push(...importModule(item));
  }

  for (const ref of allRefs) {
    const key = ref.provide.toString();

    if (!groups[key]) {
      Object.assign(groups, {
        [key]: {
          provide: ref.provide,
          getters: [],
        },
      });

      groups[key].getters.push(ref.getValue);
    } else {
      groups[key].getters.push(ref.getValue);
    }
  }

  for (const key of Object.keys(groups)) {
    const group = groups[key];
    const multiple = group.getters.length > 1;
    const reducedRef: ExportedProviderRef = {
      provide: group.provide,
      multiple,
      getValue: () => {
        return multiple
          ? group.getters.map((getter) => getter()).flat()
          : group.getters[0]();
      },
    };

    reducedRefs.push(reducedRef);

    bindExportedProviderRef(reducedRef, container);
  }

  return reducedRefs;
}
