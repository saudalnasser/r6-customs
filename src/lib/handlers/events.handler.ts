import { Client, ClientEvents, Collection } from 'discord.js';
import { importStructures } from '../utils/structure.utils';
import Container from '../container';
import Handler from './handler';
import Event from '../structures/event.structure';

class EventsHandler implements Handler {
  public events!: Collection<string, Event<keyof ClientEvents>>;
  public container: Container;

  public constructor(container: Container) {
    this.container = container;
  }

  public async initialize(client: Client): Promise<void> {
    await this.loadEvents();
    await this.handleEvents(client);
  }

  private async loadEvents(): Promise<void> {
    this.events = await importStructures<Event<keyof ClientEvents>>('event', this.container);
  }

  private async handleEvents(client: Client): Promise<void> {
    for (const event of this.events.values()) {
      if (event.options.once) {
        client.once(event.options.name, event.run);
      } else {
        client.once(event.options.name, event.run);
      }
    }
  }
}

export default EventsHandler;
