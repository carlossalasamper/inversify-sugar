import { module } from "../../../src";
import ModuleMetadata, {
  moduleMetadataKeys,
} from "../../../src/types/ModuleMetadata";
import getAllMetadata from "../../../src/utils/getAllMetadata";
import { Container } from "inversify";

@module({})
class EmptyMetadataModule {}

describe("@module", () => {
  const emptyContainer = new Container();

  it("Should generate correct metadata from empty args.", () => {
    const metadata = getAllMetadata<ModuleMetadata>(
      EmptyMetadataModule.prototype,
      moduleMetadataKeys
    );

    expect(metadata).toMatchObject<
      Omit<ModuleMetadata, "container" | "exportsContainer">
    >({
      isModule: true,
      isBinded: false,
      imports: [],
      providers: [],
      globalProviders: [],
      exports: [],
    });

    expect(metadata.container).toBeInstanceOf(Container);
    expect({ ...metadata.container, id: emptyContainer.id }).toMatchObject(
      emptyContainer
    );

    expect(metadata.exportsContainer).toBeInstanceOf(Container);
    expect({
      ...metadata.exportsContainer,
      id: emptyContainer.id,
    }).toMatchObject(emptyContainer);
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
      moduleMetadataKeys
    );

    expect(metadata.providers).toHaveLength(1);
    expect(metadata.globalProviders).toHaveLength(1);
  });
});
