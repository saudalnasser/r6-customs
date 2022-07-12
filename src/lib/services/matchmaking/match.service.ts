import Service from '../service';
import Container from '../../structures/container';

export interface MatchmakingStrategy {
  matchmake(discordId: string): void;
  stopMatchmaking(discordId: string): void;
}

export default class MatchService extends Service {
  private readonly strategy: MatchmakingStrategy;

  public constructor(container: Container, strategy: MatchmakingStrategy) {
    super(container);

    this.strategy = strategy;
  }

  public matchmake(discordId: string): void {
    this.strategy.matchmake(discordId);
  }

  public stopMatchmaking(discordId: string): void {
    this.strategy.stopMatchmaking(discordId);
  }
}
