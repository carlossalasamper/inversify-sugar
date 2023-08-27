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
});
