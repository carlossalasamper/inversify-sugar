<a href="https://www.npmjs.com/package/inversify-sugar" target="_blank"><img src="https://img.shields.io/npm/v/inversify-sugar.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/package/inversify-sugar" target="_blank"><img src="https://img.shields.io/npm/l/inversify-sugar.svg" alt="Package License" /></a>

# Inversify Sugar

<p align="center">
  <img alt="Inversify Sugar banner" src="https://raw.githubusercontent.com/carlossalasamper/inversify-sugar/master/assets/images/inversify-sugar-banner.png" style="max-width: 900px; width: 100%;" />
</p>
<p align="center" style="margin-top: 10px;">🧁 Sweeten up the <a href="https://inversify.io/">InversifyJS</a> syntax with this set of decorators, functions, and types built on top of the dependency container.</p>

## Table of Contents

- [Introduction](#introduction)
  - [Inversify and Other Dependency Systems](#inversify-and-other-dependency-systems)
- [Getting Started](#getting-started)
  - [1. Installation](#1-installation)
  - [2. Define a Scoped Module](#2-define-a-scoped-module)
  - [3. Entrypoint](#3-entrypoint)
- [Documentation](#documentation)
- [Support the Project](#support-the-project)

## Introduction

Why do you need to add Inversify Sugar to your project?

Let me illustrate with a comparison.

### Inversify and Other Dependency Systems

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

Why can't we Inversify users organize our dependencies in such an elegant way?

This is how we have to write the same code in Inversify, with these 3 disadvantages:

- Your have to manage all the instantiated containers separately to scope the dependencies into modules.
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

> ⚠️ The result is a brittle dependency system that we can break just by changing the order of the imported files.

**Inversify Sugar is a syntactic sugar** built on top of Inversify with a clear objective: to offer an API on par with the most cutting-edge dependency containers.

Once you try it you will no longer be able to live without it.

## Getting Started

Follow this small step-by-step guide to start using Inversify Sugar in your project.

### 1. Installation

Add the `inversify` and `inversify-sugar` packages to your project.

Using yarn:

```bash
yarn inversify inversify-sugar
```

Or using npm:

```bash
npm install inversify inversify-sugar
```

Inversify Sugar installs and imports the `reflect-metadata` package under the hood, so we don't have to worry about adding any extra steps.

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

We can understand each module more or less as a container of Inversify.

```typescript
import { module } from "inversify-sugar";
import { CatsController } from "./CatsController";
import { CatsService } from "./CatsService";

@Module({
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
InversifySugar.debug = process.env.NODE_ENV === "development";

// Entrypoint
InversifySugar.run(AppModule);
```

And that's it!

You can now start injecting your dependencies where you need them.

## Documentation

Let's not forget that Inversify Sugar works on top of Inversify, so to understand what's going on behind the scenes, we'll be referencing [the original Inversify documentation](https://inversify.io/) throughout this guide.

We also recommend having the original documentation on hand in order to report malfunctions in this library or the lack of any of the Inversify features.

// TODO

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
