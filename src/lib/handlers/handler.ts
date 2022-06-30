import { Client } from 'discord.js';
import Container from '../container';

interface Handler {
  container: Container;
  initialize(client: Client): Promise<void>;
}

export default Handler;
