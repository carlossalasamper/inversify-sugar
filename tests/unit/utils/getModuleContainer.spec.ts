import { injectable } from "inversify";
import { getModuleContainer, module } from "../../../src";
import importModule from "../../../src/utils/importModule";

@injectable()
class TestService {}

describe("getModuleContainer", () => {
  it("Should return the module container of a module.", () => {
    @module({
      providers: [TestService],
    })
    class TestModule {}

    const container = importModule(TestModule);

    expect(getModuleContainer(TestModule)).toBe(container);
  });
});
