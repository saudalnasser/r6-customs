import Structure from '../structures/structure';
import Container from '../container';

interface Store<T extends Structure> {
  initialize(container: Container): Promise<void>;
  get(name: string): T | undefined;
  getMany(names: string[]): T[];
  getIterable(): IterableIterator<T>;
}

export default Store;
