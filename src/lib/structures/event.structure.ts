import { ClientEvents } from 'discord.js';
import Structure, { StructureOptions } from './structure';

export interface EventOptions extends StructureOptions {
  name: keyof ClientEvents;
  once?: boolean;
}

export default abstract class Event<Key extends keyof ClientEvents> implements Structure {
  public options: EventOptions;

  public constructor(options: EventOptions) {
    this.options = options;
  }

  public abstract run(...args: ClientEvents[Key]): Promise<any>;
}
