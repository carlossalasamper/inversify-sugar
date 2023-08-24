import { keys } from "ts-transformer-keys";
import ModuleMetadata from "../types/ModuleMetadata";

export const IS_MODULE_KEY: keyof ModuleMetadata = "isModule";

export const MODULE_IS_BINDED_KEY: keyof ModuleMetadata = "isBinded";

export const MODULE_METADATA_KEYS = keys<ModuleMetadata>();

export const IMPORTED_TAG = "exports";

export const PROVIDED_TAG = "provided";
