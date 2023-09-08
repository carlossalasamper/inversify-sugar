<a href="https://www.npmjs.com/package/inversify-sugar" target="_blank"><img src="https://img.shields.io/npm/v/inversify-sugar.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/package/inversify-sugar" target="_blank"><img src="https://img.shields.io/npm/l/inversify-sugar.svg" alt="Package License" /></a>

# Inversify Sugar

<p align="center">
  <img alt="Inversify Sugar banner" src="https://raw.githubusercontent.com/carlossalasamper/inversify-sugar/master/assets/images/inversify-sugar-banner.png" style="max-width: 900px; width: 100%;" />
</p>
<p align="center" style="margin-top: 10px;">🧁 <a href="https://inversify.io/">InversifyJS</a> framework to build hierarchical dependency systems with an elegant API.</p>

## Table of Contents

- [Introduction](#introduction)
  - [Other Dependency Systems](#other-dependency-systems)
  - [Inversify API Disadvantages](#inversify-api-disadvantages)
- [Getting Started](#getting-started)
  - [1. Installation](#1-installation)
  - [2. Define a Scoped Module](#2-define-a-scoped-module)
  - [3. Entrypoint](#3-entrypoint)
- [Documentation](#documentation)
  - [Modules](#modules)
    - [Imports](#imports)
    - [Providers](#providers)
    - [Exports](#exports)
    - [Get the Container of a Module](#get-the-container-of-a-module)
    - [ModuleContainer](#modulecontainer)
  - [Injection](#injection)
    - [Provider Injection](#provider-injection)
    - [Imported Provider Injection](#imported-provider-injection)
- [Testing](#testing)
- [Support the Project](#support-the-project)
- [License](#license)

## Introduction

Inversify Sugar is a set of decorators, types and functions built on top of Inversify and offers an API to handle TypeScript applications with multiple dependency containers and relationships between them.

Let me illustrate with a comparison.

### Other Dependency Systems

Have you ever tried the [Angular](https://angular.io/)'s dependency injection system?

```typescript
import { NgModule } from "@angular/core";
import { CatsController } from "./cats.controller";
import { CatsService } from "./cats.service";

@NgModule({
  declarations: [CatsController, CatsService],
})
export class CatsModule {}
```

```typescript
import { NgModule } from "@angular/core";
import { CatsModule } from "./cats/cats.module";

@NgModule({
  imports: [CatsModule],
})
export class AppModule {}
```

Or the [NestJS](https://nestjs.com/) one?

```typescript
import { Module } from "@nestjs/common";
import { CatsController } from "./cats.controller";
import { CatsService } from "./cats.service";

@Module({
  controllers: [CatsController],
  providers: [CatsService],
})
export class CatsModule {}
```

```typescript
import { Module } from "@nestjs/common";
import { CatsModule } from "./cats/cats.module";

@Module({
  imports: [CatsModule],
})
export class AppModule {}
```

### Inversify API Disadvantages

Why can't we Inversify users organize our dependencies in such an elegant way?

This is how we have to write the same code in Inversify, with these 3 disadvantages:

- Your have to manage all the instantiated containers separately to scope the dependencies into modules (to build a hierarchical dependency system).
- Containers are initialized at the time the files that declare them are first imported.
- There is no single entry point to initialize all the containers.

```typescript
import { Container } from "inversify";
import { CatsController } from "./CatsController";
import { CatsService } from "./CatsService";

const catsContainer = new Container();

catsContainer.bind(CatsController).toSelf().inSingletonScope();
catsContainer.bind(CatsService).toSelf().inSingletonScope();

export default catsContainer;
```

```typescript
import { Container } from "inversify";
import "./cats/catsContainer";

const container = new Container();

container.bind("DATABASE_URI").toConstantValue(process.env.DATABASE_URI);

export container;
```

> 😵 The result is a brittle dependency system that we can break just by changing the order of the imported files. And we have to handle all the containers manually.

**Inversify Sugar** is a framework built on top of Inversify with a clear objective: to offer an API on par with the most cutting-edge hierarchical dependency systems.

Once you try it you will no longer be able to live without it.

## Getting Started

Follow this small step-by-step guide to start using Inversify Sugar in your project.

### 1. Installation

Add the `inversify-sugar` package to your project.

Using yarn:

```bash
yarn inversify-sugar
```

Or using npm:

```bash
npm install inversify-sugar
```

- The `inversify` package is already included within `inversify-sugar` to expose only what is necessary.
- Inversify Sugar installs and imports the `reflect-metadata` package under the hood, so we don't have to worry about adding any extra steps.

⚠️ **Important!** InversifyJS requires TypeScript >= 4.4 and the `experimentalDecorators`, `emitDecoratorMetadata` compilation options in your `tsconfig.json` file.

```json
{
  "compilerOptions": {
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true
  }
}
```

### 2. Define a Scoped Module

All dependencies defined in the `providers` field of this module are only visible to each other.

We can understand each module more or less as a compartmentalized container of Inversify. We will explain this later.

```typescript
import { module } from "inversify-sugar";
import { CatsController } from "./CatsController";
import { CatsService } from "./CatsService";

@module({
  providers: [CatsController, CatsService],
})
export class CatsModule {}
```

### 3. Entrypoint

Define a root module, `AppModule`, for your application and import the previously defined CatsModule.

```typescript
import { module } from "inversify-sugar";
import { CatsModule } from "./cats/CatsModule";

@module({
  imports: [CatsModule],
})
export class AppModule {}
```

Choose the newly defined `AppModule` as the entry point of the dependency system.

```typescript
import { InversifySugar } from "inversify-sugar";
import { AppModule } from "./AppModule";

// Configure the InversifySugar instance
InversifySugar.options.debug = process.env.NODE_ENV === "development";
InversifySugar.options.defaultScope = "Singleton";

// Entrypoint
InversifySugar.run(AppModule);
```

And that's it!

You can now start injecting your dependencies where you need them.

## Documentation

Let's not forget that Inversify Sugar works on top of Inversify, so to understand what's going on behind the scenes, we'll be referencing [the original Inversify documentation](https://inversify.io/) throughout this guide.

Below you will find a detailed explanation of each of the concepts that this library handles together with different use examples and its public API.

### Modules

A module is a class annotated with a `@module()` decorator. The `@module()` decorator provides metadata that is used to organize the dependency system.

Each application has at least one module, a root module. The root module is normally called `AppModule` and is the starting point used to build the dependencies tree. While very small applications may theoretically have just the root module, for most applications, the resulting architecture will employ multiple modules, each encapsulating a closely related set of capabilities.

```typescript
import { module } from "inversify-sugar";
import CatsModule from "./cats/CatsModule";
import DogsModule from "./dogs/DogsModule";
import BirdsModule from "./birds/BirdsModule";

@module({
  imports: [CatsModule, DogsModule, BirdsModule],
  providers: [],
  exports: [],
})
export class AppModule {}
```

The relationship between modules would be as follows:

</br>

<div align="center">
<img src="./assets/images/inversify-sugar-modules.png" style="max-width: 900px; width: 100%;">
</div>

</br>

Once `AppModule` is defined, we will only have to call the `InversifySugar.run` method specifying the root module:

```typescript
import { InversifySugar } from "inversify-sugar";
import { AppModule } from "./AppModule";

InversifySugar.run(AppModule);
```

The module decorator accepts an object argument with the `imports`, `providers` and `exports` properties.

Next we will explain what each of these properties is for.

#### Imports

The list of imported modules that export the providers which are required in this module.

```typescript
@module({
  imports: [CatsModule],
})
export class AppModule {}
```

You can also use the `forRoot` pattern to generate dynamic modules in the air and inject a configuration into the container.

The following example illustrates how we could inject a [Mongoose](https://mongoosejs.com/) database connection asynchronously from the options we pass as a parameter to the static `forRoot` method.

```typescript
@module({})
export default class MongooseModule {
  static forRoot(config: MongooseConnectionConfig): DynamicModule {
    const { uri, options } = config;

    return {
      module: MongooseModule,
      providers: [
        {
          provide: MongooseConnectionToken,
          useAsyncFactory: () => async () => {
            if (!mongoose.connection || mongoose.connection.readyState === 0) {
              await mongoose.connect(uri, options);
            }

            return mongoose.connection;
          },
          isGlobal: true,
        },
        {
          provide: MongooseConnectionConfigToken,
          useValue: config,
          isGlobal: true,
        },
      ],
    };
  }
}
```

Now we just need to import the dynamic module into the `AppModule` to globally provide the database connection and configuration.

```typescript
@module({
  imports: [MongooseModule.forRoot({ uri: process.env.MONGO_URI })],
})
export class AppModule {}
```

#### Providers

The providers that will be instantiated when the module is registered. These providers may be shared at least across this module.

You can define a provider in different ways depending on the desired instantiation method.

```typescript
@module({
  providers: [
    CatsService,
    {
      provide: CatsServiceToken,
      useClass: CatsService,
    },
    {
      provide: CatNameToken,
      useValue: "Toulouse",
    },
    {
      provide: CatNameFactoryToken,
      useFactory:
        (context) =>
        (...args) =>
          "New name",
    },
  ],
})
export class CatsModule {}
```

#### Exports

The subset of providers that will be e available in other modules which import this module. You can use either a `ExportedProvider` object or just its token (provide value).

If you export a provider with an injection token that is not registeres as a provider, an error will be thrown.

```typescript
@module({
  providers: [
    CatsService,
    {
      provide: CatNameToken,
      useValue: "Toulouse",
    },
  ],
  exports: [TestService, CatNameToken],
})
export class CatsModule {}
```

If more than one provider is registered for the same identifier, you will have to add the `multiple` property to the `ExportedProvider`.

```typescript
@module({
  providers: [
    {
      provide: CatNameToken,
      useValue: "Toulouse",
    },
    {
      provide: CatNameToken,
      useValue: "Tomas O'Malley",
    },
    {
      provide: CatNameToken,
      useValue: "Duchess",
    },
  ],
  exports: [
    {
      provide: CatNameToken,
      multiple: true,
    },
  ],
})
export class CatsModule {}
```

```bash
@imported(CatNameToken) = ["Toulouse", "Tomas O'Malley", "Duchess"]
```

And if you want to re-export providers with an identifier that have been imported into a module you must add the `deep` property.

```typescript
@module({
  providers: [
    {
      provide: CatNameToken,
      useValue: "Toulouse",
    },
    {
      provide: CatNameToken,
      useValue: "Tomas O'Malley",
    },
    {
      provide: CatNameToken,
      useValue: "Duchess",
    },
  ],
  exports: [
    {
      provide: CatNameToken,
      multiple: true,
    },
  ],
})
export class CatsModule {}

@module({
  imports: [CatsModule],
  providers: [
    {
      provide: CatNameToken,
      useValue: "Félix",
    },
  ],
  exports: [
    {
      provide: CatNameToken,
      multiple: true,
      deep: true,
    },
  ],
})
export class MoreCatsModule {}
```

```bash
@imported(CatNameToken) = ["Toulouse", "Tomas O'Malley", "Duchess", "Félix"]
```

#### Get the Container of a Module

**Ideally we shouldn't be accessing module containers directly to get a service**. In either case, the `getModuleContainer` function allows you to get the container of a module in case you need to access it in an statement.

```typescript
import {
  getModuleContainer,
  module,
  injectable,
  InversifySugar,
} from "inversify-sugar";

@injectable()
class ProvidedService {}

@injectable()
class ExportedService {}

@module({
  providers: [ProvidedService, ExportedService],
  exports: [ExportedService],
})
class AModule {}

@module({
  imports: [AModule],
})
class AppModule {}

InversifySugar.run(AppModule);

// Accessing the container of a module
const appModuleContainer = getModuleContainer(AppModule);
const testModuleContainer = getModuleContainer(TestModule);

// Getting a service provided to module
const providedService = testModuleContainer.getProvided(ProvidedService);

// Getting a provider imported to a module
const exportedService = appModuleContainer.getImported(ExportedService);
```

The container returned by the `getModuleContainer()` function is a wrapper of the Inversify's `Container` class that exposes only the necessary methods to access dependencies in both the providers section of the container and the container section of services imported by other modules.

It has been necessary for us to separate the providers declared in one module from those imported from another module in these compartments in order to implement the functionality of exporting imported suppliers (re-exporting).

#### ModuleContainer

```typescript
isProvided(serviceIdentifier: interfaces.ServiceIdentifier<T>): boolean
```

```typescript
isImported(serviceIdentifier: interfaces.ServiceIdentifier<T>): boolean
```

```typescript
bindProvider(provider: Provider): void
```

```typescript
bindExportedProviderRef(exportedProviderRef: ExportedProviderRef): void
```

```typescript
getProvided<T = unknown>(serviceIdentifier: interfaces.ServiceIdentifier<T>): T
```

```typescript
getAllProvided<T = unknown>(serviceIdentifier: interfaces.ServiceIdentifier<T>): T[]
```

```typescript
getImported<T = unknown>(serviceIdentifier: interfaces.ServiceIdentifier<T>): T | T[]
```

```typescript
getAllImported<T = unknown>(serviceIdentifier: interfaces.ServiceIdentifier<T>): T[]
```

```typescript
unbindAll(): void
```

> ⚠️ For the moment the `getImported()` function will return a single value or an array depending on how many providers with the same `ServiceIdentifier` have been imported into the module.
>
> So `getImported()` and `getAllImported()` will return the same list of services when more than one service with the same identifier is bound.
>
> However, we do not rule out that this API changes in the future.

### Injection

When injecting the dependencies, either as a parameter in the constructor of a class, or as a property of the class, we have to use 2 sets of decorators that we have prepared.

You will have to use one or the other depending on how the dependency has been registered in the module.

> ⚠️ Splitting into different decorators for dependency injection adds extra complexity to the code, compared to Angular or NestJS injection systems. This is why the injection API may change in the future.
>
> In any case, this solution is not a whim, since to organize the content of the container of each module, the [tagged bindings](https://github.com/inversify/InversifyJS/blob/master/wiki/tagged_bindings.md) feature of Inversify is used.

#### Provider Injection

We will use the `@provided` decorator when we want to inject a provider into another provider that belongs to the same module (`CatsModule`).

In the same way, we can use the `@allProvided` decorator to obtain an array with all providers registered with that identifier. This would be the decorator equivalent to Inversify's `@multiInject`.

```typescript
// cats/CatsService.ts

import { injectable } from "inversify-sugar";

@injectable()
export class CatsService {}
```

```typescript
// cats/constants.ts

export const CatNameToken = Symbol("CatName");
```

```typescript
// cats/CatsController.ts

import { injectable, provided, allProvided } from "inversify-sugar";
import { CatsService } from "./CatsService";
import { CatNameToken } from './constants'

@injectable()
export class CatsController {
  constructor(
    @provided(CatsService) public readonly catsService: CatsService
    @allProvided(CatNameToken) public readonly catNames: string[]
  ) {}
}
```

<small></small>

```typescript
// cats/CatsModule.ts

import { module } from "inversify-sugar";
import { CatsController } from "./CatsController";
import { CatsService } from "./CatsService";

@module({
  providers: [
    CatsService,
    CatsController,
    {
      provide: CatNameToken,
      useValue: "Toulouse",
    },
    {
      provide: CatNameToken,
      useValue: "Tomas O'Malley",
    },
    {
      provide: CatNameToken,
      useValue: "Duchess",
    },
  ],
})
export class CatsModule {}
```

#### Imported Provider Injection

We will use the `@imported` decorator when we want to inject a provider exported by `CatsModule` into a provider belonging to `AppModule` which is importing `CatsModule`.

```typescript
// cats/CatsService.ts

import { injectable } from "inversify-sugar";

@injectable()
export class CatsService {}
```

```typescript
// cats/CatsModule.ts

import { module } from "inversify-sugar";
import { CatsController } from "./CatsController";
import { CatsService } from "./CatsService";

@module({
  providers: [CatsService],
  exported: [CatsService],
})
export class CatsModule {}
```

```typescript
// AppController.ts

import { injectable, imported } from "inversify-sugar";
import { CatsService } from "./cats/CatsService";

@injectable()
export class AppController {
  constructor(
    @imported(CatsService) public readonly catsService: CatsService
  ) {}
}
```

```typescript
// AppModule.ts

import { module } from "inversify-sugar";
import { CatsModule } from "./cats/CatsModule";

@module({
  imports: [CatsModule],
})
export class AppModule {}
```

> ⚠️ As you can see there is no `@allImported()` decorator.
>
> As with the `ModuleContainer.getImported()` method, the `@imported()` decorator will return a single value or an >array depending on how many providers with the specified `ServiceIdentifier` have been imported into the module.

## Testing

The complexity of the memory state during the execution of Inversify Sugar, managing multiple Inversify containers under the hood, is too high to ensure that it is working correctly without writing unit tests of each of the functionalities separately.

For this reason, a set of tests have been written that you can consult [here](./test).

So you can use it without worries. You are facing a completely armored dependency system.

<img src="./assets/badges/coverage/badge-functions.svg" />
<img src="./assets/badges/coverage/badge-lines.svg" />
<img src="./assets/badges/coverage/badge-statements.svg" />
<img src="./assets/badges/coverage/badge-branches.svg" />

## Support the Project

<p align="center">☕️ Buy me a coffee so the open source party never ends.</p>

<p align="center"><a href="https://www.buymeacoffee.com/carlossala95" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/default-orange.png" alt="Buy Me A Coffee" height="41" width="174"></a></p>

<p align="center">
  <a href="https://www.youtube.com/channel/UCC-EUKPStBfQ1nEIvSl6bAQ" target="_blank">YouTube</a> |
  <a href="https://instagram.com/carlossalasamper" target="_blank">Instagram</a> |
  <a href="https://twitter.com/carlossala95" target="_blank">Twitter</a> |
  <a href="https://facebook.com/carlossala95" target="_blank">Facebook</a>
</p>
<p align="center">
  <a href="https://godofprogramming.com" target="_blank">godofprogramming.com</a>
</p>

## License

The Inversify Sugar source code is made available under the [MIT license](./LICENSE).

Some of the dependencies are licensed differently, with the BSD license, for example.
