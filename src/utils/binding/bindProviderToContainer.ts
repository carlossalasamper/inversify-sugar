import { Container } from "inversify";
import { Provider } from "../../types";
import isNewable from "../validation/isNewable";
import setScope from "./setScope";
import isClassProvider from "../validation/isClassProvider";
import {
  AsyncFactoryProvider,
  ClassProvider,
  FactoryProvider,
  NewableProvider,
  ValueProvider,
} from "../../types/Provider";
import isAsyncFactoryProvider from "../validation/isAsyncFactoryProvider";
import isFactoryProvider from "../validation/isFactoryProvider";
import isValueProvider from "../validation/isValueProvider";
import { PROVIDED_TAG } from "../constants";

export const bindProviderToContainer = (
  provider: Provider,
  container: Container
) => {
  if (isNewable(provider)) {
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
  } else if (isAsyncFactoryProvider(provider)) {
    const asyncFactoryProvider = provider as AsyncFactoryProvider;

    container
      .bind(asyncFactoryProvider.provide)
      .toProvider(asyncFactoryProvider.useAsyncFactory)
      .whenTargetTagged(PROVIDED_TAG, true);
  }
};
