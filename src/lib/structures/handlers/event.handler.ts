import { eventExecutionErrorMessage } from '../../utils/logger/messages/event-handler.messages';
import Structure from '../structure';
import Handler from './handler';
import Container from '../container';
import EventStore from '../stores/event.store';

class EventHandler extends Structure implements Handler {
  private eventStore: EventStore;

  public constructor(container: Container, eventStore: EventStore) {
    super(container);

    this.eventStore = eventStore;
  }

  public async initialize(): Promise<void> {
    const { container, eventStore } = this;
    const { client, logger } = container;

    for (const event of eventStore.getIterable()) {
      const method: 'once' | 'on' = event.options.once ? 'once' : 'on';

      client[method](event.options.name, async (...args): Promise<any> => {
        try {
          await event.run(...args);
        } catch (error: any) {
          logger.error(eventExecutionErrorMessage(event, error));
        }
      });
    }
  }
}

export default EventHandler;
