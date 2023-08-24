import { Newable, Provider } from "../types";
import ModuleMetadata from "../types/ModuleMetadata";
import {
  ClassProvider,
  FactoryProvider,
  NewableProvider,
  ValueProvider,
} from "../types/Provider";
import { MODULE_METADATA_KEYS, PROVIDED_TAG } from "./constants";
import getAllMetadata from "./getAllMetadata";
import setScope from "./setScope";
import isClassProvider from "./validation/isClassProvider";
import isFactoryProvider from "./validation/isFactoryProvider";
import isNewableProvider from "./validation/isNewableProvider";
import isValueProvider from "./validation/isValueProvider";

export const bindProviderToModule = (provider: Provider, Module: Newable) => {
  const metatadata = getAllMetadata<ModuleMetadata>(
    Module.prototype,
    MODULE_METADATA_KEYS
  );
  const { container } = metatadata;

  if (isNewableProvider(provider)) {
    const newableProvider = provider as NewableProvider;

    setScope(container.bind(newableProvider).toSelf()).whenTargetTagged(
      PROVIDED_TAG,
      true
    );
  } else if (isClassProvider(provider)) {
    const classProvider = provider as ClassProvider;

    setScope(
      classProvider.provide
        ? container.bind(classProvider.provide).to(classProvider.useClass)
        : container.bind(classProvider.useClass).toSelf(),
      classProvider.scope
    ).whenTargetTagged(PROVIDED_TAG, true);
  } else if (isValueProvider(provider)) {
    const valueProvider = provider as ValueProvider;

    container
      .bind(valueProvider.provide)
      .toConstantValue(valueProvider.useValue)
      .whenTargetTagged(PROVIDED_TAG, true);
  } else if (isFactoryProvider(provider)) {
    const factoryProvider = provider as FactoryProvider;

    container
      .bind(factoryProvider.provide)
      .toFactory(factoryProvider.useFactory)
      .whenTargetTagged(PROVIDED_TAG, true);
  }
};
