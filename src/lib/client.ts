import { Client as DiscordJsClient, ClientOptions as DiscordJsClientOptions } from 'discord.js';
import Container from './container';
import Handler from './handlers/handler';
import CommandsHandler from './handlers/commands.handler';
import EventsHandler from './handlers/events.handler';
import Logger, { LogLevel, LogStrategy } from './utils/logger/logger';
import ConsoleLogStrategy from './utils/logger/strategies/console.strategy';

export interface ClientOptions extends DiscordJsClientOptions {
  logLevel?: LogLevel;
  logStrategy?: LogStrategy;
}

export default class Client extends DiscordJsClient {
  private handlers: Handler[];
  private container: Container;

  public constructor(options: ClientOptions) {
    super(options);

    const logLevel: LogLevel = options.logLevel ?? LogLevel.Info;
    const logStrategy: LogStrategy = options.logStrategy ?? new ConsoleLogStrategy();

    this.container = new Container();
    this.container.logger = new Logger(logLevel, logStrategy);

    this.handlers = [new CommandsHandler(this.container), new EventsHandler(this.container)];
  }

  public async run(token: string): Promise<void> {
    try {
      for (const handler of this.handlers) await handler.initialize(this);
      await this.login(token);
    } catch (error) {
      this.container.logger.error(error);
      process.exit(1);
    }
  }
}
