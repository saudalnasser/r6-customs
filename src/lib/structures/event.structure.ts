import { ClientEvents } from 'discord.js';
import Container from '../container';
import Structure, { StructureOptions } from './structure';

export interface EventOptions extends StructureOptions {
  name: keyof ClientEvents;
  once?: boolean;
}

export default abstract class Event<Key extends keyof ClientEvents> implements Structure {
  public options: EventOptions;
  public container: Container;

  public constructor(options: EventOptions, container: Container) {
    this.options = options;
    this.container = container;
  }

  public abstract run(...args: ClientEvents[Key]): Promise<any>;
}
