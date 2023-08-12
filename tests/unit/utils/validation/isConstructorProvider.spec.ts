import isConstructorProvider from "../../../../src/utils/validation/isConstructorProvider";

describe("isConstructorProvider", () => {
  it("Should return true if the object is a ConstructorProvider.", () => {
    const constructorProviders = [
      class {},
      class {
        public readonly arg: string;
        constructor(arg: string) {
          this.arg = arg;
        }
      },
    ];

    for (const constructorProvider of constructorProviders) {
      expect(isConstructorProvider(constructorProvider)).toBe(true);
    }
  });

  it("Should return false if the object is not a ConstructorProvider.", () => {
    const notConstructorProviders: unknown[] = [
      {
        provide: "provide",
        useValue: "useValue",
      },
      {
        provide: "provide",
        useClass: class {},
      },
      undefined,
      null,
      0,
      "",
      true,
    ];

    for (const notConstructorProvider of notConstructorProviders) {
      expect(isConstructorProvider(notConstructorProvider)).toBe(false);
    }
  });
});
