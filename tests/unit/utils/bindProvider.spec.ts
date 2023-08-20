import { injectable } from "inversify";
import {
  ClassProvider,
  ConstructorProvider,
  FactoryProvider,
  ValueProvider,
} from "../../../src/types/Provider";
import { getModuleContainer, module } from "../../../src";
import { bindProviderToModule } from "../../../src/utils/bindProvider";

const TestClassToken = Symbol();

@injectable()
class TestClass {}

@module({})
class TestModule {}

describe("bindProvider", () => {
  beforeEach(() => {
    getModuleContainer(TestModule).unbindAll();
  });

  it("Should bind a ConstructorProvider", () => {
    const provider: ConstructorProvider = TestClass;

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
});
