import { Container } from "inversify";
import { module } from "../../src";
import ModuleMetadata from "../../src/types/ModuleMetadata";
import { MODULE_METADATA_KEYS } from "../../src/utils/constants";
import getAllMetadata from "../../src/utils/getAllMetadata";

@module({})
class EmptyMetadataModule {}

describe("@module", () => {
  it("Should generate correct metadata from empty args.", () => {
    const metadata = getAllMetadata<ModuleMetadata>(
      EmptyMetadataModule.prototype,
      MODULE_METADATA_KEYS
    );

    expect(metadata).toMatchObject<Omit<ModuleMetadata, "id" | "container">>({
      isModule: true,
      isBinded: false,
      imports: [],
      providers: [],
      globalProviders: [],
      exports: [],
    });

    expect(metadata.container).toBeInstanceOf(Container);
  });

  it("Should separate scoped and global providers.", () => {
    @module({
      providers: [
        {
          provide: "scoped",
          useValue: "scoped",
        },
        {
          provide: "global",
          useValue: "global",
          isGlobal: true,
        },
      ],
    })
    class ProvidersModule {}

    const metadata = getAllMetadata<ModuleMetadata>(
      ProvidersModule.prototype,
      MODULE_METADATA_KEYS
    );

    expect(metadata.providers).toHaveLength(1);
    expect(metadata.globalProviders).toHaveLength(1);
  });

  it("Should merge metadata from addons.", () => {
    const addon1 = jest.fn().mockReturnValue({
      imports: [EmptyMetadataModule],
      providers: [
        {
          provide: "scoped",
          useValue: "scoped",
        },
        {
          provide: "exported",
          useValue: "exported",
          isGlobal: true,
        },
      ],
      exports: [
        {
          provide: "exported",
        },
      ],
    });
    const addon2 = jest.fn().mockReturnValue({});

    @module({
      addons: [addon1, addon2],
      imports: [EmptyMetadataModule],
      providers: [
        {
          provide: "scoped",
          useValue: "scoped",
        },
        {
          provide: "exported",
          useValue: "exported",
          isGlobal: true,
        },
      ],
      exports: [
        {
          provide: "exported",
        },
      ],
    })
    class AddonsModule {}

    const metadata = getAllMetadata<ModuleMetadata>(
      AddonsModule.prototype,
      MODULE_METADATA_KEYS
    );

    expect(metadata.imports).toHaveLength(2);
    expect(metadata.providers).toHaveLength(2);
    expect(metadata.globalProviders).toHaveLength(2);
    expect(metadata.exports).toHaveLength(2);
  });

  it("Should merge empty addon metadata", () => {
    const addon = jest.fn().mockReturnValue({});

    @module({
      addons: [addon],
    })
    class AddonsModule {}

    const metadata = getAllMetadata<ModuleMetadata>(
      AddonsModule.prototype,
      MODULE_METADATA_KEYS
    );

    expect(metadata.imports).toHaveLength(0);
    expect(metadata.providers).toHaveLength(0);
    expect(metadata.globalProviders).toHaveLength(0);
    expect(metadata.exports).toHaveLength(0);
  });
});
