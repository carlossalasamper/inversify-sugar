import { Container, injectable } from "inversify";
import processImports from "../../../src/utils/processImports";
import { module } from "../../../src";
import ExportedProviderRef from "../../../src/types/ExportedProviderRef";

describe("processImports", () => {
  it("Should group refs with the same provider.", () => {
    const TestServiceToken = Symbol("TestService");

    @injectable()
    class TestService {}

    @module({
      providers: [
        {
          provide: TestServiceToken,
          useClass: TestService,
        },
        {
          provide: TestServiceToken,
          useClass: TestService,
        },
      ],
      exports: [
        {
          provide: TestServiceToken,
          multiple: true,
        },
      ],
    })
    class AModule {}

    @module({
      providers: [
        {
          provide: TestServiceToken,
          useClass: TestService,
        },
      ],
      exports: [TestServiceToken],
    })
    class BModule {}

    const container = new Container();
    const imports = [AModule, BModule];
    const reducedRefs: ExportedProviderRef[] = [
      {
        provide: TestServiceToken,
        multiple: true,
        getValue: jest.fn(),
      },
    ];
    const result = processImports(container, imports);

    expect(result).toHaveLength(1);
    expect(result[0].provide).toEqual(reducedRefs[0].provide);
    expect(result[0].getValue()).toHaveLength(3);
  });

  it("Should group imported providers when provide is a class", () => {
    @injectable()
    class TestService {}

    @module({
      providers: [TestService],
      exports: [TestService],
    })
    class AModule {}

    @module({
      providers: [TestService],
      exports: [TestService],
    })
    class BModule {}

    const container = new Container();
    const imports = [AModule, BModule];
    const reducedRefs: ExportedProviderRef[] = [
      {
        provide: TestService,
        multiple: true,
        getValue: jest.fn(),
      },
    ];
    const result = processImports(container, imports);

    expect(result).toHaveLength(1);
    expect(result[0].provide).toEqual(reducedRefs[0].provide);
    expect(result[0].getValue()).toHaveLength(2);
  });

  it("Should group imported providers when provide is a string", () => {
    const TestServiceToken = "TestService";

    @injectable()
    class TestService {}

    @module({
      providers: [
        {
          provide: TestServiceToken,
          useClass: TestService,
        },
      ],
      exports: [TestServiceToken],
    })
    class AModule {}

    @module({
      providers: [
        {
          provide: TestServiceToken,
          useClass: TestService,
        },
      ],
      exports: [TestServiceToken],
    })
    class BModule {}

    const container = new Container();
    const imports = [AModule, BModule];
    const reducedRefs: ExportedProviderRef[] = [
      {
        provide: TestServiceToken,
        multiple: true,
        getValue: jest.fn(),
      },
    ];
    const result = processImports(container, imports);

    expect(result).toHaveLength(1);
    expect(result[0].provide).toEqual(reducedRefs[0].provide);
    expect(result[0].getValue()).toHaveLength(2);
  });

  it("Should group and flat value of many MultipleExportedProvider", () => {
    const TestServiceToken = Symbol("TestService");

    @injectable()
    class TestService {}

    @module({
      providers: [
        {
          provide: TestServiceToken,
          useClass: TestService,
        },
        {
          provide: TestServiceToken,
          useClass: TestService,
        },
      ],
      exports: [
        {
          provide: TestServiceToken,
          multiple: true,
        },
      ],
    })
    class AModule {}

    @module({
      providers: [
        {
          provide: TestServiceToken,
          useClass: TestService,
        },
        {
          provide: TestServiceToken,
          useClass: TestService,
        },
      ],
      exports: [
        {
          provide: TestServiceToken,
          multiple: true,
        },
      ],
    })
    class BModule {}

    @module({
      providers: [
        {
          provide: TestServiceToken,
          useClass: TestService,
        },
        {
          provide: TestServiceToken,
          useClass: TestService,
        },
      ],
      exports: [
        {
          provide: TestServiceToken,
          multiple: true,
        },
      ],
    })
    class CModule {}

    const container = new Container();
    const imports = [AModule, BModule, CModule];
    const reducedRefs: ExportedProviderRef[] = [
      {
        provide: TestServiceToken,
        multiple: true,
        getValue: jest.fn(),
      },
    ];
    const result = processImports(container, imports);

    expect(result).toHaveLength(1);
    expect(result[0].provide).toEqual(reducedRefs[0].provide);
    expect(result[0].getValue()).toHaveLength(6);
  });
});
