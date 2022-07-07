import { ApplicationCommandOptionTypes as OptionTypes } from 'discord.js/typings/enums';
import Command, { CommandOptions, RunOptions } from '../lib/structures/pieces/command.piece';
import ApplyOptions from '../lib/decorators/pieces/options.decorator';

@ApplyOptions<CommandOptions>({
  name: 'register',
  description: 'registers a new player',
  options: [
    {
      name: 'uplay',
      description: 'the uplay username that will be linked to you.',
      required: true,
      type: OptionTypes.STRING,
    },
  ],
})
class RegisterCommand extends Command {
  public async run({ interaction, args }: RunOptions): Promise<void> {
    const discordId: string = interaction.user.id;
    const uplay: string = args.getString('uplay', true);

    try {
      await this.container.playerService.register(discordId, uplay);
    } catch (error: any) {
      const message: string = error.isUserError ? error.message : 'unexpected error occurred!';

      return await interaction.reply({ content: message, ephemeral: true });
    }

    await interaction.reply({ content: 'you have been registered successfully!', ephemeral: true });
  }
}

export default RegisterCommand;
