import {
  ChatInputApplicationCommandData,
  Client,
  CommandInteraction,
  CommandInteractionOptionResolver,
} from 'discord.js';
import { Guards } from './guard.structure';
import Structure, { StructureOptions } from './structure';
import Container from '../container';

export interface CommandOptions extends StructureOptions, ChatInputApplicationCommandData {
  guards?: (keyof typeof Guards)[];
}

export interface RunOptions {
  client: Client;
  interaction: CommandInteraction;
  args: CommandInteractionOptionResolver;
}

export default abstract class Command implements Structure {
  public options: CommandOptions;
  public container: Container;

  public constructor(options: CommandOptions, container: Container) {
    this.options = options;
    this.container = container;
  }

  public abstract run(options: RunOptions): Promise<any>;
}
