import { Collection } from 'discord.js';
import Store from './store';
import Structure from '../structure';
import Guard from '../pieces/guard.piece';
import PiecesLoader from '../../utils/pieces/pieces-loader';

class GuardStore extends Structure implements Store<Guard> {
  private guards!: Collection<string, Guard>;

  public async initialize(loader: PiecesLoader): Promise<void> {
    this.guards = await loader.load<Guard>('guard');
  }

  public get(name: string): Guard | undefined {
    return this.guards.get(name);
  }

  public getMany(names: string[]): Guard[] {
    const guards: Guard[] = [];

    for (const name of names) {
      const event: Guard | undefined = this.guards.get(name);
      if (event) guards.push(event);
    }

    return guards;
  }

  public getIterable(): IterableIterator<Guard> {
    return this.guards.values();
  }
}

export default GuardStore;
