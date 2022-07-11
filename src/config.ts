const { NODE_ENV, TOKEN, CLIENT_ID, GUILD_ID, DB_URI, UBI_EMAIL, UBI_PASSWORD } = process.env;

function validate(): void {
  if (!NODE_ENV || !TOKEN || !CLIENT_ID || !GUILD_ID || !DB_URI || !UBI_EMAIL || !UBI_PASSWORD) {
    throw new Error('Missing environment variables');
  }
}

interface Config {
  environment: string;
  token: string;
  clientId: string;
  guildId: string;
  dbUri: string;
  ubiEmail: string;
  ubiPassword: string;
  validate(): void;
}

const config: Config = {
  environment: NODE_ENV ?? 'development',
  token: TOKEN ?? '<token>',
  clientId: CLIENT_ID ?? '<clientId>',
  guildId: GUILD_ID ?? '<guildId>',
  dbUri: DB_URI ?? '<dbUri>',
  ubiEmail: UBI_EMAIL ?? '<ubiEmail>',
  ubiPassword: UBI_PASSWORD ?? '<ubiPassword>',
  validate,
};

export default config;
