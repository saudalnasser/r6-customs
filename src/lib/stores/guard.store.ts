import { Collection } from 'discord.js';
import Store from './store';
import Guard from '../structures/guard.structure';
import StructuresLoader from '../utils/structures/structures-loader';

class GuardStore implements Store<Guard> {
  private guards!: Collection<string, Guard>;

  public async initialize(loader: StructuresLoader): Promise<void> {
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
