/* eslint-disable @typescript-eslint/no-explicit-any */
import { interfaces } from "inversify";
import { Newable } from ".";

interface WithProvide {
  /**
   * @description ServiceIdentifier / InjectionToken
   */
  provide: string | symbol;
}

interface WithIsGlobal {
  /**
   * @description Flag that indicates if the provider is binded to the global container.
   */
  isGlobal?: boolean;
}

/**
 * @description Shorthand to define a *Class* provider to self in singleton scope.
 */
export type NewableProvider<T = any> = Newable<T>;

/**
 * @description Interface defining a *Class* type provider.
 */
export interface ClassProvider<T = any>
  extends Partial<WithProvide>,
    WithIsGlobal {
  /**
   * @description Instance of a provider to be injected.
   */
  useClass: T;
  useValue?: never;
  /**
   * @description Binding scope of a provider.
   * @default 'Singleton'
   */
  scope?: interfaces.BindingScope;
}

/**
 * @description Interface defining a *Value* type provider.
 */
export interface ValueProvider<T = any> extends WithProvide, WithIsGlobal {
  /**
   * @description Instance of a provider to be injected.
   */
  useValue: T;
  useClass?: never;
}

/**
 * @description Interface defining a *Factory* type provider. The scope of a factory provider is always singleton.
 */
export interface FactoryProvider<T = any> extends WithProvide, WithIsGlobal {
  /**
   * @description Factory function to be injected.
   */
  useFactory: (context: interfaces.Context) => (...args: any[]) => T;
  useValue?: never;
  useClass?: never;
}

type Provider<T = any> =
  | NewableProvider<T>
  | ClassProvider<T>
  | ValueProvider<T>
  | FactoryProvider<T>;

export default Provider;
