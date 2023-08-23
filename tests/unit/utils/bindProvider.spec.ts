import { Container, injectable } from "inversify";
import {
  ClassProvider,
  NewableProvider,
  FactoryProvider,
  ValueProvider,
} from "../../../src/types/Provider";
import { getModuleContainer, module } from "../../../src";
import {
  bindProviderToContainer,
  bindProviderToModule,
} from "../../../src/utils/bindProvider";

const TestClassToken = Symbol();

@injectable()
class TestClass {}

@module({})
class TestModule {}

describe("bindProvider", () => {
  beforeEach(() => {
    getModuleContainer(TestModule).unbindAll();
  });

  it("Should bind a NewableProvider", () => {
    const provider: NewableProvider = TestClass;

    @module({})
    class TestModule {}

    bindProviderToModule(provider, TestModule);

    const container = getModuleContainer(TestModule);

    expect(container.isBound(TestClass)).toBe(true);
  });

  it("Should bind a ClassProvider without provide", () => {
    const provider: ClassProvider = { useClass: TestClass };

    bindProviderToModule(provider, TestModule);

    const container = getModuleContainer(TestModule);

    expect(container.isBound(TestClass)).toBe(true);
  });

  it("Should bind a ClassProvider with provide", () => {
    const provider: ClassProvider = {
      provide: TestClassToken,
      useClass: TestClass,
    };

    bindProviderToModule(provider, TestModule);

    const container = getModuleContainer(TestModule);

    expect(container.isBound(TestClassToken)).toBe(true);
  });

  it("Should bind a ValueProvider", () => {
    const provider: ValueProvider = {
      provide: TestClassToken,
      useValue: new TestClass(),
    };

    bindProviderToModule(provider, TestModule);

    const container = getModuleContainer(TestModule);

    expect(container.isBound(TestClassToken)).toBe(true);
  });

  it("Should bind a FactoryProvider", () => {
    const provider: FactoryProvider = {
      provide: TestClassToken,
      useFactory: () => () => new TestClass(),
    };

    bindProviderToModule(provider, TestModule);

    const container = getModuleContainer(TestModule);

    expect(container.isBound(TestClassToken)).toBe(true);
  });

  it("Should bind a NewableProvider to a container", () => {
    const provider: NewableProvider = TestClass;
    const container = new Container();

    bindProviderToContainer(provider, container);

    expect(container.isBound(TestClass)).toBe(true);
  });

  it("Should bind a ClassProvider without provide to a container", () => {
    const provider: ClassProvider = { useClass: TestClass };
    const container = new Container();

    bindProviderToContainer(provider, container);

    expect(container.isBound(TestClass)).toBe(true);
  });

  it("Should bind a ClassProvider with provide to a container", () => {
    const provider: ClassProvider = {
      provide: TestClassToken,
      useClass: TestClass,
    };

    const container = new Container();

    bindProviderToContainer(provider, container);

    expect(container.isBound(TestClassToken)).toBe(true);
  });

  it("Should bind a ValueProvider to a container", () => {
    const provider: ValueProvider = {
      provide: TestClassToken,
      useValue: new TestClass(),
    };
    const container = new Container();

    bindProviderToContainer(provider, container);

    expect(container.isBound(TestClassToken)).toBe(true);
  });

  it("Should bind a FactoryProvider to a container", () => {
    const provider: FactoryProvider = {
      provide: TestClassToken,
      useFactory: () => () => new TestClass(),
    };
    const container = new Container();

    bindProviderToContainer(provider, container);

    expect(container.isBound(TestClassToken)).toBe(true);
  });
});
