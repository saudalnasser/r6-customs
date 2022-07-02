import {
  CommandInteraction,
  CommandInteractionOptionResolver,
  InteractionReplyOptions,
  MessagePayload,
  WebhookEditMessageOptions,
} from 'discord.js';
import Structure from '../structure';
import Container from '../container';
import Piece, { PieceOptions } from './piece';

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
  interaction: CommandInteraction;
  args: CommandInteractionOptionResolver;
}

export default abstract class Guard extends Structure implements Piece {
  public readonly options: GuardOptions;

  public constructor(options: GuardOptions, container: Container) {
    super(container);

    this.options = options;
  }

  public abstract run(options: RunOptions): Promise<GuardResult>;

  protected ok(): GuardResult {
    return new GuardResult(true);
  }

  protected error(response: Response): GuardResult {
    return new GuardResult(false, response);
  }
}
