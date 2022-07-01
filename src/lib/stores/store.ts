import Structure from '../structures/structure';
import StructuresLoader from '../utils/structures/structures-loader';

interface Store<T extends Structure> {
  initialize(loader: StructuresLoader): Promise<void>;
  get(name: string): T | undefined;
  getMany(names: string[]): T[];
  getIterable(): IterableIterator<T>;
}

export default Store;
