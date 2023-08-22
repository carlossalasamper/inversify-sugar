/* eslint-disable @typescript-eslint/no-explicit-any */
import Provider, {
  ClassProvider,
  ConstructorProvider,
  FactoryProvider,
  ValueProvider,
} from "../types/Provider";
import isConstructorProvider from "./validation/isConstructorProvider";
import isClassProvider from "./validation/isClassProvider";
import isValueProvider from "./validation/isValueProvider";
import isFactoryProvider from "./validation/isFactoryProvider";
import setScope from "./setScope";
import { Newable } from "../types";
import getAllMetadata from "./getAllMetadata";
import ModuleMetadata from "../types/ModuleMetadata";
import { MODULE_METADATA_KEYS } from "./constants";
import { Container } from "inversify";

export const bindProviderToModule = (provider: Provider, Module: Newable) => {
  const metatadata = getAllMetadata<ModuleMetadata>(
    Module.prototype,
    MODULE_METADATA_KEYS
  );
  const { container, id } = metatadata;

  if (isConstructorProvider(provider)) {
    const constructorProvider = provider as ConstructorProvider;

    setScope(
      container.bind(constructorProvider).toSelf()
    ).whenTargetIsDefault();
    setScope(container.bind(constructorProvider).toSelf()).whenTargetNamed(id);
  } else if (isClassProvider(provider)) {
    const classProvider = provider as ClassProvider;

    setScope(
      classProvider.provide
        ? container.bind(classProvider.provide).to(classProvider.useClass)
        : container.bind(classProvider.useClass).toSelf(),
      classProvider.scope
    ).whenTargetNamed(id);
  } else if (isValueProvider(provider)) {
    const valueProvider = provider as ValueProvider;

    container
      .bind(valueProvider.provide)
      .toConstantValue(valueProvider.useValue)
      .whenTargetNamed(id);
  } else if (isFactoryProvider(provider)) {
    const factoryProvider = provider as FactoryProvider;
    container
      .bind(factoryProvider.provide)
      .toFactory(factoryProvider.useFactory)
      .whenTargetNamed(id);
  }
};

export const bindProviderToContainer = (
  provider: Provider,
  container: Container
) => {
  if (isConstructorProvider(provider)) {
    const constructorProvider = provider as ConstructorProvider;

    container.bind(constructorProvider).toSelf().inSingletonScope();
  } else if (isClassProvider(provider)) {
    const classProvider = provider as ClassProvider;
    setScope(
      classProvider.provide
        ? container.bind(classProvider.provide).to(classProvider.useClass)
        : container.bind(classProvider.useClass).toSelf(),
      classProvider.scope
    );
  } else if (isValueProvider(provider)) {
    const valueProvider = provider as ValueProvider;

    container
      .bind(valueProvider.provide)
      .toConstantValue(valueProvider.useValue);
  } else if (isFactoryProvider(provider)) {
    const factoryProvider = provider as FactoryProvider;

    container
      .bind(factoryProvider.provide)
      .toFactory(factoryProvider.useFactory);
  }
};
