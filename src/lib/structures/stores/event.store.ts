import { ClientEvents } from 'discord.js';
import Store from './store';
import Event from '../pieces/event.piece';

class EventStore extends Store<Event<keyof ClientEvents>> {
  public async initialize(): Promise<void> {
    this.pieces = await this.piecesLoader.load<Event<keyof ClientEvents>>('event');
  }
}

export default EventStore;
