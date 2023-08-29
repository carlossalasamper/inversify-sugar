import { InversifySugar, getModuleContainer, module } from "../../src";

describe("ModuleContainer", () => {
  beforeEach(() => {
    InversifySugar.reset();
  });

  it("getProvided() should get a provided service by service identifier.", () => {
    @module({
      providers: [{ provide: "test", useValue: "test" }],
    })
    class AppModule {}

    InversifySugar.run(AppModule);

    const container = getModuleContainer(AppModule);

    expect(container.getProvided("test")).toBe("test");
  });

  it("getProvided() should throw an error if the service is not provided.", () => {
    @module({
      providers: [{ provide: "test", useValue: "test" }],
    })
    class AppModule {}

    InversifySugar.run(AppModule);

    const container = getModuleContainer(AppModule);

    expect(() => container.getProvided("test2")).toThrow();
  });

  it("getAllProvided() should get all provided services by service identifier.", () => {
    @module({
      providers: [
        {
          provide: "test",
          useValue: "test",
        },
        {
          provide: "test",
          useValue: "test2",
        },
        {
          provide: "test2",
          useValue: "test2",
        },
      ],
    })
    class AppModule {}

    InversifySugar.run(AppModule);

    const container = getModuleContainer(AppModule);

    expect(container.getAllProvided("test")).toHaveLength(2);
  });

  it("getAllProvided() should throw an error if the service is not provided.", () => {
    @module({
      providers: [{ provide: "test", useValue: "test" }],
    })
    class AppModule {}

    InversifySugar.run(AppModule);

    const container = getModuleContainer(AppModule);

    expect(() => container.getAllProvided("test2")).toThrow();
  });

  it("getImported() should get an imported service by service identifier.", () => {
    @module({
      providers: [{ provide: "test", useValue: "test" }],
      exports: ["test"],
    })
    class TestModule {}

    @module({
      imports: [TestModule],
    })
    class AppModule {}

    InversifySugar.run(AppModule);

    const container = getModuleContainer(AppModule);

    expect(container.getImported("test")).toBe("test");
  });
});
