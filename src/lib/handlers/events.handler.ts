import { Client, ClientEvents } from 'discord.js';
import { redBright, yellowBright } from 'colorette';
import Handler from './handler';
import Event from '../structures/event.structure';
import EventStore from '../stores/event.store';
import Container from '../container';

class EventsHandler implements Handler {
  private eventStore: EventStore;

  public constructor(eventStore: EventStore) {
    this.eventStore = eventStore;
  }

  public async initialize(client: Client, container: Container): Promise<void> {
    for (const event of this.eventStore.getIterable()) {
      if (event.options.once) {
        client.once(event.options.name, async (...args): Promise<any> => {
          try {
            await event.run(...args);
          } catch (error: any) {
            container.logger.error(this.generateErrorMessage(client, event, error));
          }
        });
      } else {
        client.once(event.options.name, async (...args): Promise<any> => {
          try {
            await event.run(...args);
          } catch (error: any) {
            container.logger.error(this.generateErrorMessage(client, event, error));
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
