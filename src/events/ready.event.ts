import ApplyOptions from '../lib/decorators/pieces/options.decorator';
import Event, { EventOptions } from '../lib/structures/pieces/event.piece';
import Events from '../lib/types/events.enum';

@ApplyOptions<EventOptions>({
  name: Events.ClientReady,
  once: true,
})
class ReadyEvent extends Event<Events.ClientReady> {
  public async run(): Promise<void> {
    this.container.logger.info('The bot is ready!');
  }
}

export default ReadyEvent;
