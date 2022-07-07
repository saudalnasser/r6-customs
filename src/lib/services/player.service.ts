import Player from '../models/player.model';
import UserError from '../types/user.error';
import Service from './service';

class PlayerService extends Service {
  public async register(discordId: string, uplay: string): Promise<void> {
    const registered: boolean = (await Player.exists({ discordId })) !== null;
    if (registered) throw new UserError('you are already registered', 'Registered');

    const uplayId: string | null = await this.container.r6statsService.getUplayId(uplay);
    if (uplayId === null)
      throw new UserError(`the \`${uplay}\` username does not exist!`, 'UplayDoesNotExist');

    const linked: boolean = (await Player.exists({ uplayId })) !== null;
    if (linked)
      throw new UserError(
        `the \`${uplay}\` username is linked to another player!`,
        'UplayLinkedToAnotherPlayer'
      );

    await Player.create({ discordId, uplayId });
  }
}

export default PlayerService;
