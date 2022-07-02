import {
  ChatInputApplicationCommandData,
  CommandInteraction,
  CommandInteractionOptionResolver,
} from 'discord.js';
import { Guards } from '../../types/guards.enum';
import Piece, { PieceOptions } from './piece';
import Structure from '../structure';
import Container from '../container';

export interface CommandOptions extends PieceOptions, ChatInputApplicationCommandData {
  guards?: (keyof typeof Guards)[];
}

export interface RunOptions {
  interaction: CommandInteraction;
  args: CommandInteractionOptionResolver;
}

export default abstract class Command extends Structure implements Piece {
  public readonly options: CommandOptions;

  public constructor(options: CommandOptions, container: Container) {
    super(container);

    this.options = options;
  }

  public abstract run(options: RunOptions): Promise<any>;
}
