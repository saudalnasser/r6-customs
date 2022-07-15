import { Client } from 'discord.js';
import Logger from '../utils/logger/logger';
import R6ApiService from '../services/r6api.service';
import PlayerService from '../services/player.service';
import MatchService from '../services/match.service';

class Container {
  public client!: Client;
  public logger!: Logger;
  public r6apiService!: R6ApiService;
  public playerService!: PlayerService;
  public matchService!: MatchService;
}

export default Container;
