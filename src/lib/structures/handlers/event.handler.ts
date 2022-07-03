import { ClientEvents } from 'discord.js';
import { redBright, yellowBright } from 'colorette';
import Structure from '../structure';
import Handler from './handler';
import Container from '../container';
import Event from '../pieces/event.piece';
import EventStore from '../stores/event.store';

class EventHandler extends Structure implements Handler {
  private eventStore: EventStore;

  public constructor(container: Container, eventStore: EventStore) {
    super(container);

    this.eventStore = eventStore;
  }

  public async initialize(): Promise<void> {
    const { container, eventStore, generateErrorMessage } = this;
    const { client, logger } = container;

    for (const event of eventStore.getIterable()) {
      const method: 'once' | 'on' = event.options.once ? 'once' : 'on';

      client[method](event.options.name, async (...args): Promise<any> => {
        try {
          await event.run(...args);
        } catch (error: any) {
          logger.error(generateErrorMessage(event, error));
        }
      });
    }
  }

  private generateErrorMessage(event: Event<keyof ClientEvents>, error: Error): string {
    const eventName: string = `${yellowBright(event.options.name)}`;
    const errorMessage: string = `${yellowBright(error?.message ?? '')}`;

    const openBracket: string = redBright('<');
    const closeBracket: string = redBright('>');

    const styledEventName: string = `${openBracket}${eventName}${closeBracket}`;
    const styledErrorMessage: string = `${redBright('error:')} ${errorMessage}`;

    return `${styledEventName} ${styledErrorMessage}`;
  }
}

export default EventHandler;
