import { Container, injectable } from "inversify";
import bindProvider from "../../../src/utils/bindProvider";
import {
  ClassProvider,
  ConstructorProvider,
  FactoryProvider,
  ValueProvider,
} from "../../../src/types/Provider";

const TestClassToken = Symbol();

@injectable()
class TestClass {}

describe("bindProvider", () => {
  const container = new Container();

  beforeEach(() => {
    container.unbindAll();
  });

  it("Should bind a ConstructorProvider", () => {
    const provider: ConstructorProvider = TestClass;
    bindProvider(provider, container);

    expect(container.isBound(TestClass)).toBe(true);
  });

  it("Should bind a ClassProvider without provide", () => {
    const provider: ClassProvider = { useClass: TestClass };

    bindProvider(provider, container);

    expect(container.isBound(TestClass)).toBe(true);
  });

  it("Should bind a ClassProvider with provide", () => {
    const provider: ClassProvider = {
      provide: TestClassToken,
      useClass: TestClass,
    };

    bindProvider(provider, container);

    expect(container.isBound(TestClassToken)).toBe(true);
  });

  it("Should bind a ValueProvider", () => {
    const provider: ValueProvider = {
      provide: TestClassToken,
      useValue: new TestClass(),
    };

    bindProvider(provider, container);

    expect(container.isBound(TestClassToken)).toBe(true);
  });

  it("Should bind a FactoryProvider", () => {
    const provider: FactoryProvider = {
      provide: TestClassToken,
      useFactory: () => () => new TestClass(),
    };

    bindProvider(provider, container);

    expect(container.isBound(TestClassToken)).toBe(true);
  });
});
