import 'dotenv/config';
import { LogLevel } from './lib/utils/logger/logger';
import { createColors } from 'colorette';
import Client, { ClientOptions } from './lib/client';
import config from './config';

createColors({ useColor: true });

config.validate();

const options: ClientOptions = {
  token: config.token,
  dbUri: config.dbUri,
  ubiEmail: config.ubiEmail,
  ubiPassword: config.ubiPassword,
  shards: 'auto',
  intents: ['GUILDS', 'GUILD_MEMBERS', 'GUILD_MESSAGES', 'GUILD_VOICE_STATES'],
  logLevel: config.environment === 'development' ? LogLevel.Debug : LogLevel.Info,
  environment: config.environment,
};

const client: Client = new Client(options);

client.run();
