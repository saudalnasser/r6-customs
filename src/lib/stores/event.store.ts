import { ClientEvents, Collection } from 'discord.js';
import { importStructures } from '../utils/structure.utils';
import Event from '../structures/event.structure';
import Store from './store';
import Container from '../container';

class EventStore implements Store<Event<keyof ClientEvents>> {
  private events!: Collection<string, Event<keyof ClientEvents>>;

  public async initialize(container: Container): Promise<void> {
    this.events = await importStructures<Event<keyof ClientEvents>>('event', container);
  }

  public get(name: string): Event<keyof ClientEvents> | undefined {
    return this.events.get(name);
  }

  public getMany(names: string[]): Event<keyof ClientEvents>[] {
    const events: Event<keyof ClientEvents>[] = [];

    for (const name of names) {
      const event: Event<keyof ClientEvents> | undefined = this.events.get(name);
      if (event) events.push(event);
    }

    return events;
  }

  public getIterable(): IterableIterator<Event<keyof ClientEvents>> {
    return this.events.values();
  }
}

export default EventStore;
