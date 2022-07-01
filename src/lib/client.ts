import { Client as DiscordJsClient, ClientOptions as DiscordJsClientOptions } from 'discord.js';
import Logger, { LogLevel, LogStrategy } from './utils/logger/logger';
import ConsoleLogStrategy from './utils/logger/strategies/console.strategy';
import Store from './stores/store';
import Handler from './handlers/handler';
import EventStore from './stores/event.store';
import EventsHandler from './handlers/events.handler';
import CommandStore from './stores/command.store';
import CommandsHandler from './handlers/commands.handler';
import GuardStore from './stores/guard.store';
import Container from './container';

export interface ClientOptions extends DiscordJsClientOptions {
  logLevel?: LogLevel;
  logStrategy?: LogStrategy;
}

export default class Client extends DiscordJsClient {
  private handlers: Handler[];
  private stores: Store<any>[];
  private container!: Container;

  public constructor(options: ClientOptions) {
    super(options);

    this.initializeContainer(options);

    const commandStore: CommandStore = new CommandStore();
    const eventStore: EventStore = new EventStore();
    const guardStore: GuardStore = new GuardStore();
    this.stores = [commandStore, eventStore, guardStore];

    const commandsHandler: CommandsHandler = new CommandsHandler(commandStore, guardStore);
    const eventsHandler: EventsHandler = new EventsHandler(eventStore);
    this.handlers = [commandsHandler, eventsHandler];
  }

  public async run(token: string): Promise<void> {
    try {
      for (const store of this.stores) await store.initialize(this.container);
      for (const handler of this.handlers) await handler.initialize(this, this.container);

      await this.login(token);
    } catch (error) {
      this.container.logger.error(error);
      process.exit(1);
    }
  }

  private initializeContainer(options: ClientOptions): void {
    const logLevel: LogLevel = options.logLevel ?? LogLevel.Info;
    const logStrategy: LogStrategy = options.logStrategy ?? new ConsoleLogStrategy();

    this.container = new Container();
    this.container.logger = new Logger(logLevel, logStrategy);
  }
}
