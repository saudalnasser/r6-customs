import { Client } from 'discord.js';
import Logger from '../utils/logger/logger';
import R6StatsService from '../services/r6stats.service';
import PlayerService from '../services/player.service';

class Container {
  public client!: Client;
  public logger!: Logger;
  public r6statsService!: R6StatsService;
  public playerService!: PlayerService;
}

export default Container;
