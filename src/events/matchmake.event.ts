import { VoiceState } from 'discord.js';
import ApplyOptions from '../lib/decorators/pieces/options.decorator';
import Player from '../lib/models/player.model';
import Event, { EventOptions } from '../lib/structures/pieces/event.piece';
import Events from '../lib/types/events.enum';

@ApplyOptions<EventOptions>({
  name: Events.VoiceStateUpdate,
})
class MatchmakeEvent extends Event<Events.VoiceStateUpdate> {
  public async run(oldState: VoiceState, newState: VoiceState): Promise<void> {
    const discordId: string | undefined = newState.member?.id;
    if (!discordId) return;

    const registered: boolean = (await Player.exists({ discordId })) !== null;
    if (!registered) return;

    if (oldState.channel?.name === 'Queue') this.container.matchService.stopMatchmaking(discordId);

    if (newState.channel?.name === 'Queue') this.container.matchService.matchmake(discordId);
  }
}

export default MatchmakeEvent;
