import { Collection } from 'discord.js';
import Structure from '../structure';
import Piece from '../pieces/piece';
import Container from '../container';
import PiecesLoader from '../../utils/pieces/pieces-loader';

abstract class Store<T extends Piece> extends Structure {
  protected pieces!: Collection<string, T>;
  protected piecesLoader: PiecesLoader;

  public constructor(container: Container, piecesLoader: PiecesLoader) {
    super(container);

    this.piecesLoader = piecesLoader;
  }

  public abstract initialize(): Promise<void>;

  public get(name: string): T | undefined {
    return this.pieces.get(name);
  }

  public getMany(names: string[]): T[] {
    const pieces: T[] = [];

    for (const name of names) {
      const piece: T | undefined = this.pieces.get(name);
      if (piece) pieces.push(piece);
    }

    return pieces;
  }

  public getIterable(): IterableIterator<T> {
    return this.pieces.values();
  }
}

export default Store;
