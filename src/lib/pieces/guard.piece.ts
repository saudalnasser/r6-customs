import {
  Client,
  CommandInteraction,
  CommandInteractionOptionResolver,
  InteractionReplyOptions,
  MessagePayload,
  WebhookEditMessageOptions,
} from 'discord.js';
import Piece, { PieceOptions } from './piece';
import Container from '../container';

export enum Guards {}

type Response = string | MessagePayload | InteractionReplyOptions | WebhookEditMessageOptions;

export class GuardResult {
  public ok: boolean;
  public response: Response;

  public constructor(ok: boolean, response?: Response) {
    this.ok = ok;
    this.response = response ?? {};
  }
}

export interface GuardOptions extends PieceOptions {
  deferReply?: boolean;
}

export interface RunOptions {
  client: Client;
  interaction: CommandInteraction;
  args: CommandInteractionOptionResolver;
}

export default abstract class Guard implements Piece {
  public options: GuardOptions;
  public container: Container;

  public constructor(options: GuardOptions, container: Container) {
    this.options = options;
    this.container = container;
  }

  public abstract run(options: RunOptions): Promise<GuardResult>;

  protected ok(): GuardResult {
    return new GuardResult(true);
  }

  protected error(response: Response): GuardResult {
    return new GuardResult(false, response);
  }
}
