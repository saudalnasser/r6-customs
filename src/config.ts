const { NODE_ENV, TOKEN, CLIENT_ID, GUILD_ID, DB_URI } = process.env;

function validate(): void {
  if (!NODE_ENV || !TOKEN || !CLIENT_ID || !GUILD_ID || !DB_URI) {
    throw new Error('Missing environment variables');
  }
}

interface Config {
  environment: string;
  token: string;
  clientId: string;
  guildId: string;
  dbUri: string;
  validate(): void;
}

const config: Config = {
  environment: NODE_ENV ?? 'development',
  token: TOKEN ?? '<token>',
  clientId: CLIENT_ID ?? '<clientId>',
  guildId: GUILD_ID ?? '<guildId>',
  dbUri: DB_URI ?? '<dbUri>',
  validate,
};

export default config;
