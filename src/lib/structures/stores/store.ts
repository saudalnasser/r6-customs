import Container from '../container';
import Structure from '../structure';
import Piece from '../pieces/piece';
import PiecesLoader from '../../utils/pieces/pieces-loader';

abstract class Store<T extends Piece> extends Structure {
  protected piecesLoader: PiecesLoader;

  public abstract initialize(): Promise<void>;
  public abstract get(name: string): T | undefined;
  public abstract getMany(names: string[]): T[];
  public abstract getIterable(): IterableIterator<T>;

  public constructor(container: Container, piecesLoader: PiecesLoader) {
    super(container);

    this.piecesLoader = piecesLoader;
  }
}

export default Store;
