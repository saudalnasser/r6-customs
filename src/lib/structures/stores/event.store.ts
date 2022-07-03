import { ClientEvents, Collection } from 'discord.js';
import Store from './store';
import Event from '../pieces/event.piece';

class EventStore extends Store<Event<keyof ClientEvents>> {
  private events!: Collection<string, Event<keyof ClientEvents>>;

  public async initialize(): Promise<void> {
    this.events = await this.piecesLoader.load<Event<keyof ClientEvents>>('event');
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
