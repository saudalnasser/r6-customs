import { Collection } from 'discord.js';
import Structure from '../../structures/structure';
import Container from '../../container';

export type StructureName = 'command' | 'event' | 'guard';

export interface LoadStrategy {
  load<T extends Structure>(
    structureName: StructureName,
    collection: Collection<string, T>,
    container: Container
  ): Promise<void>;
}

export default class StructuresLoader {
  private loadStrategy: LoadStrategy;
  private container: Container;

  public constructor(loadStrategy: LoadStrategy, container: Container) {
    this.loadStrategy = loadStrategy;
    this.container = container;
  }

  public async load<T extends Structure>(
    structureName: StructureName
  ): Promise<Collection<string, T>> {
    const collection: Collection<string, T> = new Collection();

    try {
      await this.loadStrategy.load<T>(structureName, collection, this.container);
    } catch (error) {
      this.container.logger.warn(`${structureName} store is empty.`);
    }

    return collection;
  }
}
