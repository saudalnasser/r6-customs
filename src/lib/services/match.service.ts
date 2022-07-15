import { Types } from 'mongoose';
import { randomEnum, randomIndex } from '../utils/random';
import Service from './service';
import Container from '../structures/container';
import Player, { IPlayer } from '../models/player.model';
import Match, { IMatch } from '../models/match.model';
import Maps from '../types/maps.enum';

interface MatchmakingStrategy {
  addPlayer(discordId: string): void;
  removePlayer(discordId: string): void;
}

export class QueueMatchmakingStrategy implements MatchmakingStrategy {
  private readonly pool: string[];
  private readonly maxSize: number;

  public constructor() {
    this.pool = [];
    this.maxSize = 10;
  }

  public addPlayer(discordId: string): void {
    this.pool.push(discordId);

    this.onUpdate();
  }

  public removePlayer(discordId: string): void {
    const index: number = this.pool.findIndex((playerDiscordId) => playerDiscordId === discordId);
    if (index > -1) this.pool.splice(index, 1);
  }

  private onUpdate(): void {
    if (this.possibleMatch) this.createMatch();
  }

  private async createMatch(): Promise<void> {
    const players: IPlayer[] | null = await this.getPlayers();
    if (!players) return this.onUpdate();

    const [teamA, teamB] = this.split(players);

    const match: IMatch = {
      teamA: new Types.Array(...teamA),
      teamB: new Types.Array(...teamB),
      host: players[randomIndex(players.length)],
      map: randomEnum(Maps),
      state: 'ongoing',
      timestamps: { createdAt: new Date() },
    };

    await Match.create(match);
  }

  private async getPlayers(): Promise<IPlayer[] | null> {
    const players: IPlayer[] = [];
    const discordIds: string[] = this.pool.splice(0, this.maxSize);

    for (const discordId of discordIds) {
      const player: IPlayer | null = await Player.findOne({ discordId });

      if (player) {
        players.push(player);
      } else {
        const index: number = discordIds.findIndex((id) => id === discordId);
        discordIds.splice(index, 1);

        this.pool.unshift(...discordIds);

        return null;
      }
    }

    return players;
  }

  private split(players: IPlayer[]): [teamA: IPlayer[], teamB: IPlayer[]] {
    const playersToSplit: IPlayer[] = [...players];
    const teamA: IPlayer[] = [];
    const teamB: IPlayer[] = [];

    while (playersToSplit.length !== 0) {
      teamA.push(playersToSplit.splice(randomIndex(playersToSplit.length), 1)[0]);

      teamB.push(playersToSplit.splice(randomIndex(playersToSplit.length), 1)[0]);
    }

    return [teamA, teamB];
  }

  private get possibleMatch(): boolean {
    return Math.floor(this.pool.length / this.maxSize) > 0;
  }
}

export default class MatchService extends Service {
  private readonly strategy: MatchmakingStrategy;

  public constructor(container: Container, strategy: MatchmakingStrategy) {
    super(container);

    this.strategy = strategy;
  }

  public matchmake(discordId: string): void {
    this.strategy.addPlayer(discordId);
  }

  public stopMatchmaking(discordId: string): void {
    this.strategy.removePlayer(discordId);
  }
}
