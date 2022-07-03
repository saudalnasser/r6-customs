import { Client as DiscordJsClient, ClientOptions as DiscordJsClientOptions } from 'discord.js';
import Logger, { LogLevel, LogStrategy } from './utils/logger/logger';
import ConsoleLogStrategy from './utils/logger/strategies/console.strategy';
import PiecesLoader from './utils/pieces/pieces-loader';
import StrictLoadStrategy from './utils/pieces/strategies/strict.strategy';
import Store from './structures/stores/store';
import CommandStore from './structures/stores/command.store';
import EventStore from './structures/stores/event.store';
import GuardStore from './structures/stores/guard.store';
import Handler from './structures/handlers/handler';
import CommandHandler from './structures/handlers/command.handler';
import EventHandler from './structures/handlers/event.handler';
import Container from './structures/container';

export interface ClientOptions extends DiscordJsClientOptions {
  logLevel?: LogLevel;
  logStrategy?: LogStrategy;
}

export default class Client extends DiscordJsClient {
  private handlers!: Handler[];
  private stores!: Store<any>[];
  private piecesLoader!: PiecesLoader;
  private container!: Container;

  public constructor(options: ClientOptions) {
    super(options);

    this.initializeContainer(options);

    this.initializeStructures();
  }

  public async run(token: string): Promise<void> {
    try {
      for (const store of this.stores) await store.initialize(this.piecesLoader);
      for (const handler of this.handlers) await handler.initialize();

      await this.login(token);
    } catch (error) {
      this.container.logger.error(error);
      process.exit(1);
    }
  }

  private initializeContainer(options: ClientOptions): void {
    this.container = new Container();

    this.container.client = this;

    const logLevel: LogLevel = options.logLevel ?? LogLevel.Info;
    const logStrategy: LogStrategy = options.logStrategy ?? new ConsoleLogStrategy();
    this.container.logger = new Logger(logLevel, logStrategy);
  }

  private initializeStructures(): void {
    this.piecesLoader = new PiecesLoader(new StrictLoadStrategy(), this.container);

    const commandStore: CommandStore = new CommandStore(this.container);
    const eventStore: EventStore = new EventStore(this.container);
    const guardStore: GuardStore = new GuardStore(this.container);
    this.stores = [commandStore, eventStore, guardStore];

    const commandHandler: CommandHandler = new CommandHandler(
      this.container,
      commandStore,
      guardStore
    );
    const eventHandler: EventHandler = new EventHandler(this.container, eventStore);
    this.handlers = [commandHandler, eventHandler];
  }
}
