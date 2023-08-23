import { Container } from "inversify";
import { InversifySugar, getModuleContainer } from "../../../src";
import { AppModule } from "./src/AppModule";
import { App } from "./src/App";

describe("authApi", () => {
  beforeAll(() => {
    InversifySugar.reset();
    InversifySugar.options.debug = true;
    InversifySugar.run(AppModule);
  });

  it("Should resolve all dependencies properly.", () => {
    const appModuleContainer = getModuleContainer(AppModule);
    const app = appModuleContainer.get(App);

    expect(appModuleContainer).toBeInstanceOf(Container);
    expect(app).toBeInstanceOf(App);
    expect(app.controllers).toHaveLength(2);
  });
});
