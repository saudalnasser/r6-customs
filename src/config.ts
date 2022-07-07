const { NODE_ENV, TOKEN, CLIENT_ID, GUILD_ID, DB_URI, R6API_KEY, R6API_BASE_URL } = process.env;

function validate(): void {
  if (!NODE_ENV || !TOKEN || !CLIENT_ID || !GUILD_ID || !DB_URI || !R6API_KEY || !R6API_BASE_URL) {
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
  r6apiBaseUrl: string;
  validate(): void;
}

const config: Config = {
  environment: NODE_ENV ?? 'development',
  token: TOKEN ?? '<token>',
  clientId: CLIENT_ID ?? '<clientId>',
  guildId: GUILD_ID ?? '<guildId>',
  dbUri: DB_URI ?? '<dbUri>',
  r6apiKey: R6API_KEY ?? '<r6apiKey>',
  r6apiBaseUrl: R6API_BASE_URL ?? '<r6apiBaseUrl>',
  validate,
};

export default config;
