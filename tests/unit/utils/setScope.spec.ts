import { Container } from "inversify";
import setScope from "../../../src/utils/setScope";
import { InversifySugar } from "../../../src";

class ClassA {}

describe("setScope", () => {
  const container = new Container();

  beforeEach(() => {
    InversifySugar.reset();
    container?.unbindAll();
  });

  it("Should call binding.inTransientScope() when scope is Transient.", () => {
    const binding = container.bind(ClassA).toSelf();
    const inTransientScope = jest.spyOn(binding, "inTransientScope");

    setScope(binding, "Transient");

    expect(inTransientScope).toHaveBeenCalled();
  });

  it("Should call binding.inRequestScope() when scope is Request.", () => {
    const binding = container.bind(ClassA).toSelf();
    const inRequestScope = jest.spyOn(binding, "inRequestScope");

    setScope(binding, "Request");

    expect(inRequestScope).toHaveBeenCalled();
  });

  it("Should call binding.inSingletonScope() when scope is Singleton.", () => {
    const binding = container.bind(ClassA).toSelf();
    const inSingletonScope = jest.spyOn(binding, "inSingletonScope");

    setScope(binding, "Singleton");

    expect(inSingletonScope).toHaveBeenCalled();
  });

  it("Should use InversifySugar.defaultScope when scope is not provided.", () => {
    const binding = container.bind(ClassA).toSelf();
    const inSingletonScope = jest.spyOn(binding, "inSingletonScope");

    InversifySugar.options.defaultScope = "Singleton";

    setScope(binding);

    expect(inSingletonScope).toHaveBeenCalled();
  });
});
