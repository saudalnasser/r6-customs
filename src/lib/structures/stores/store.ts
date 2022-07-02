import Piece from '../pieces/piece';
import PiecesLoader from '../../utils/pieces/pieces-loader';

interface Store<T extends Piece> {
  initialize(loader: PiecesLoader): Promise<void>;
  get(name: string): T | undefined;
  getMany(names: string[]): T[];
  getIterable(): IterableIterator<T>;
}

export default Store;
