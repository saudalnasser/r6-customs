import { Collection } from 'discord.js';
import Piece from '../../structures/pieces/piece';
import Container from '../../structures/container';

export type PieceName = 'command' | 'event' | 'guard';

export interface LoadStrategy {
  load<T extends Piece>(
    pieceName: PieceName,
    collection: Collection<string, T>,
    container: Container
  ): Promise<void>;
}

export default class PiecesLoader {
  private loadStrategy: LoadStrategy;
  private container: Container;

  public constructor(loadStrategy: LoadStrategy, container: Container) {
    this.loadStrategy = loadStrategy;
    this.container = container;
  }

  public async load<T extends Piece>(pieceName: PieceName): Promise<Collection<string, T>> {
    const collection: Collection<string, T> = new Collection();

    try {
      await this.loadStrategy.load<T>(pieceName, collection, this.container);
    } catch (error) {
      this.container.logger.warn(`${pieceName} store is empty.`);
    }

    return collection;
  }
}
