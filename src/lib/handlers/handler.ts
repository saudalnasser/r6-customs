import { Client } from 'discord.js';

interface Handler {
  initialize(client: Client): Promise<void>;
}

export default Handler;
