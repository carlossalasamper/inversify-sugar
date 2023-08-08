<a href="https://www.npmjs.com/package/inversify-sugar" target="_blank"><img src="https://img.shields.io/npm/v/inversify-sugar.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/package/inversify-sugar" target="_blank"><img src="https://img.shields.io/npm/l/inversify-sugar.svg" alt="Package License" /></a>

# Inversify Sugar

<p align="center">
  <img alt="Inversify Sugar banner" src="assets/images/inversify-sugar-banner.png" style="max-width: 900px; width: 100%;" />
</p>
<p align="center" style="margin-top: 10px;">🧁 Sweeten up the <a href="https://inversify.io/">InversifyJS</a> syntax with this set of decorators, functions, and types built on top of the dependency container.</p>

## Table of Contents

- [Introduction](#introduction)
- [Getting Started](#getting-started)
  - [1. Installation](#1-installation)
  - [2. Entrypoint](#2-entrypoint)
- [Documentation](#documentation)
- [Support the Project](#support-the-project)

## Introduction

Have you ever tried the dependency injection system [Angular](https://angular.io/)?

```typescript
@NgModule({
  imports: [BrowserModule],
  providers: [Logger],
})
export class AppModule {}
```

Or the [NestJS](https://nestjs.com/) one?

```typescript
@Module({
  imports: [CatsModule],
  providers: [
    {
      provide: "DATABASE_URI",
      useValue: process.env.DATABASE_URI,
    },
  ],
})
export class AppModule {}
```

Why can't we Inversify users organize our dependencies in such an elegant way?
Does the library need a little sugar?

**Inversify Sugar is a syntactic sugar** built on top of Inversify with a clear objective: to offer an API on par with the most cutting-edge dependency containers.

Once you try it you will no longer be able to live without it.

## Getting Started

Follow this small step-by-step guide to start using Inversify Sugar in your project.

### 1. Installation

Add the inversify and inversify-sugar packages to your project.

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

### 2. Entrypoint

Define a root module for your application.

```typescript
import { module } from "inversify-sugar";
import AnotherModule from "./modules/AnotherModule";

@module({
  providers: [
    {
      provide: "DATABASE_URI",
      useValue: process.env.DATABASE_URI,
    },
  ],
})
export class AppModule {}
```

Choose the newly defined root module as the entry point of the dependency system.

```typescript
import { InversifySugar } from "inversify-sugar";
import { AppModule } from "./AppModule.ts";

// Configure the InversifySugar instance
InversifySugar.debug = process.env.NODE_ENV === "development";

// Entrypoint
InversifySugar.start(AppModule);
```

## Documentation

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
