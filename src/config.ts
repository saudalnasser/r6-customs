const { NODE_ENV, TOKEN, CLIENT_ID, GUILD_ID } = process.env;

function validate(): void {
  if (!NODE_ENV || !TOKEN || !CLIENT_ID || !GUILD_ID) {
    throw new Error('Missing environment variables');
  }
}

interface Config {
  environment: string;
  token: string;
  clientId: string;
  guildId: string;
  validate(): void;
}

const config: Config = {
  environment: NODE_ENV ?? 'development',
  token: TOKEN ?? '<token>',
  clientId: CLIENT_ID ?? '<clientId>',
  guildId: GUILD_ID ?? '<guildId>',
  validate,
};

export default config;
