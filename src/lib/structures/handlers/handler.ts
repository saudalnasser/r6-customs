import { Client } from 'discord.js';
import Container from '../../container';

interface Handler {
  initialize(client: Client, container: Container): Promise<void>;
}

export default Handler;
