import { ClientEvents } from 'discord.js';
import Piece, { PieceOptions } from './piece';
import Structure from '../structure';
import Container from '../container';

export interface EventOptions extends PieceOptions {
  name: keyof ClientEvents;
  once?: boolean;
}

export default abstract class Event<Key extends keyof ClientEvents>
  extends Structure
  implements Piece
{
  public readonly options: EventOptions;

  public constructor(options: EventOptions, container: Container) {
    super(container);

    this.options = options;
  }

  public abstract run(...args: ClientEvents[Key]): Promise<any>;
}
