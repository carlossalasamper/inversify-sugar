import isNewableProvider from "../../../../src/utils/validation/isNewableProvider";

describe("isNewableProvider", () => {
  it("Should return true if the object is a NewableProvider.", () => {
    const newableProviders = [
      class {},
      class {
        public readonly arg: string;
        constructor(arg: string) {
          this.arg = arg;
        }
      },
    ];

    for (const provider of newableProviders) {
      expect(isNewableProvider(provider)).toBe(true);
    }
  });

  it("Should return false if the object is not a NewableProvider.", () => {
    const notNewableProviders: unknown[] = [
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

    for (const provider of notNewableProviders) {
      expect(isNewableProvider(provider)).toBe(false);
    }
  });
});
