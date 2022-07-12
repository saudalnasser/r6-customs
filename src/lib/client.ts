import { Client as DiscordJsClient, ClientOptions as DiscordJsClientOptions } from 'discord.js';
import { databaseReadyMessage } from './utils/logger/messages/client.messages';
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
import mongoose from 'mongoose';
import R6ApiService from './services/r6api.service';
import PlayerService from './services/player.service';
import MatchService from './services/matchmaking/match.service';

export interface ClientOptions extends DiscordJsClientOptions {
  token: string;
  dbUri: string;
  ubiEmail: string;
  ubiPassword: string;
  logLevel?: LogLevel;
  logStrategy?: LogStrategy;
  environment: string;
}

export default class Client extends DiscordJsClient {
  public override options: ClientOptions;
  private handlers!: Handler[];
  private stores!: Store<any>[];
  private piecesLoader!: PiecesLoader;
  private container!: Container;

  public constructor(options: ClientOptions) {
    super(options);

    this.options = options;

    this.initializeContainer();

    this.initializeStructures();
  }

  public async run(): Promise<void> {
    try {
      for (const store of this.stores) await store.initialize();
      for (const handler of this.handlers) await handler.initialize();

      await mongoose.connect(this.options.dbUri, {
        dbName: `r6customs_${this.options.environment}`,
      });

      this.container.logger.info(databaseReadyMessage());

      await this.login(this.options.token);
    } catch (error) {
      this.container.logger.error(error);
      process.exit(1);
    }
  }

  private initializeContainer(): void {
    this.container = new Container();

    this.container.client = this;

    const logLevel: LogLevel = this.options.logLevel ?? LogLevel.Info;
    const logStrategy: LogStrategy = this.options.logStrategy ?? new ConsoleLogStrategy();
    this.container.logger = new Logger(logLevel, logStrategy);

    this.container.r6apiService = new R6ApiService(
      this.container,
      this.options.ubiEmail,
      this.options.ubiPassword
    );

    this.container.playerService = new PlayerService(this.container);

    this.container.matchService = new MatchService(this.container, null);
  }

  private initializeStructures(): void {
    this.piecesLoader = new PiecesLoader(new StrictLoadStrategy(), this.container);

    const commandStore: CommandStore = new CommandStore(this.container, this.piecesLoader);
    const eventStore: EventStore = new EventStore(this.container, this.piecesLoader);
    const guardStore: GuardStore = new GuardStore(this.container, this.piecesLoader);
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
