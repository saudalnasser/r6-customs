import { ClientEvents } from 'discord.js';
import Piece, { PieceOptions } from './piece';
import Container from '../../container';

export interface EventOptions extends PieceOptions {
  name: keyof ClientEvents;
  once?: boolean;
}

export default abstract class Event<Key extends keyof ClientEvents> implements Piece {
  public options: EventOptions;
  public container: Container;

  public constructor(options: EventOptions, container: Container) {
    this.options = options;
    this.container = container;
  }

  public abstract run(...args: ClientEvents[Key]): Promise<any>;
}
