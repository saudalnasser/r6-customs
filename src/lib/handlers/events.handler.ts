import { Client, ClientEvents, Collection } from 'discord.js';
import { redBright, yellowBright } from 'colorette';
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
        client.once(event.options.name, async (...args): Promise<any> => {
          try {
            await event.run(...args);
          } catch (error: any) {
            this.container.logger.error(this.generateErrorMessage(client, event, error));
          }
        });
      } else {
        client.once(event.options.name, async (...args): Promise<any> => {
          try {
            await event.run(...args);
          } catch (error: any) {
            this.container.logger.error(this.generateErrorMessage(client, event, error));
          }
        });
      }
    }
  }

  private generateErrorMessage(
    client: Client,
    event: Event<keyof ClientEvents>,
    error: Error
  ): string {
    const shard: string = `[${yellowBright(client.shard?.count ?? 0)}]`;
    const eventName: string = `${yellowBright(event.options.name)}`;
    const errorMessage: string = `${yellowBright(error?.message ?? '')}`;

    const openBracket: string = redBright('<');
    const closeBracket: string = redBright('>');

    const styledEventName: string = `${openBracket}${eventName}${closeBracket}`;
    const styledErrorMessage: string = `${redBright('error:')} ${errorMessage}`;

    return `${shard} ${styledEventName} ${styledErrorMessage}`;
  }
}

export default EventsHandler;
