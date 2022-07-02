import { Client } from 'discord.js';
import Logger from '../utils/logger/logger';

class Container {
  public client!: Client;
  public logger!: Logger;
}

export default Container;
