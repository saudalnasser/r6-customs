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
      if (error.isUserError)
        return await interaction.reply({ content: error.message, ephemeral: true });

      this.container.logger.error(error);

      return await interaction.reply({ content: 'unexpected error occurred!', ephemeral: true });
    }

    await interaction.reply({ content: 'you have been registered successfully!', ephemeral: true });
  }
}

export default RegisterCommand;
