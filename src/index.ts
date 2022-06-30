import 'dotenv/config';
import config from './config';
import Client, { ClientOptions } from './lib/client';
import { LogLevel } from './lib/utils/logger/logger';
import { createColors } from 'colorette';

config.validate();

createColors({ useColor: true });

const options: ClientOptions = {
  shards: 'auto',
  intents: ['GUILDS', 'GUILD_MEMBERS', 'GUILD_MESSAGES'],
  logLevel: config.environment === 'development' ? LogLevel.Debug : LogLevel.Info,
};

const client: Client = new Client(options);

client.run(config.token);
