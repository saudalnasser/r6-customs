const { NODE_ENV, TOKEN, CLIENT_ID, GUILD_ID, DB_URI, R6API_KEY } = process.env;

function validate(): void {
  if (!NODE_ENV || !TOKEN || !CLIENT_ID || !GUILD_ID || !DB_URI || !R6API_KEY) {
    throw new Error('Missing environment variables');
  }
}

interface Config {
  environment: string;
  token: string;
  clientId: string;
  guildId: string;
  dbUri: string;
  r6apiKey: string;
  validate(): void;
}

const config: Config = {
  environment: NODE_ENV ?? 'development',
  token: TOKEN ?? '<token>',
  clientId: CLIENT_ID ?? '<clientId>',
  guildId: GUILD_ID ?? '<guildId>',
  dbUri: DB_URI ?? '<dbUri>',
  r6apiKey: R6API_KEY ?? '<r6apiKey>',
  validate,
};

export default config;
