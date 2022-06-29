/* eslint-disable no-unused-vars */
import {
  ChatInputApplicationCommandData,
  Client,
  CommandInteraction,
  CommandInteractionOptionResolver,
} from 'discord.js';
import Structure, { StructureOptions } from './structure';

export interface CommandOptions extends StructureOptions, ChatInputApplicationCommandData {}

export interface RunOptions {
  client: Client;
  interaction: CommandInteraction;
  args: CommandInteractionOptionResolver;
}

export default abstract class Command implements Structure {
  public options: CommandOptions;

  public constructor(options: CommandOptions) {
    this.options = options;
  }

  public abstract run(options: RunOptions): Promise<any>;
}
