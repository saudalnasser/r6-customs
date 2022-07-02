import {
  Client,
  CommandInteraction,
  CommandInteractionOptionResolver,
  GuildBasedChannel,
  InteractionDeferReplyOptions,
} from 'discord.js';
import { yellowBright, greenBright, redBright } from 'colorette';
import Handler from './handler';
import Command from '../pieces/command.piece';
import CommandStore from '../stores/command.store';
import Guard, { GuardResult } from '../pieces/guard.piece';
import GuardStore from '../stores/guard.store';
import Container from '../../container';

class CommandHandler implements Handler {
  private commandStore: CommandStore;
  private guardStore: GuardStore;

  public constructor(commandStore: CommandStore, guardStore: GuardStore) {
    this.commandStore = commandStore;
    this.guardStore = guardStore;
  }

  public async initialize(client: Client, container: Container): Promise<void> {
    client.on('interactionCreate', async (interaction) => {
      if (interaction.isCommand()) {
        try {
          const command: Command | undefined = this.commandStore.get(interaction.commandName);
          if (!command) return;

          const guards: Guard[] = this.guardStore.getMany(command.options.guards ?? []);

          for (const guard of guards) {
            const result: GuardResult = await guard.run({
              client,
              interaction,
              args: interaction.options as CommandInteractionOptionResolver,
            });

            if (!result.ok) {
              if (guard.options.deferReply) {
                await interaction.deferReply(result.response as InteractionDeferReplyOptions);
                await interaction.editReply(result.response);
              } else {
                await interaction.reply(result.response);
              }

              return;
            }
          }

          await command.run({
            client,
            interaction,
            args: interaction.options as CommandInteractionOptionResolver,
          });

          container.logger.info(this.generateMessage('success', client, interaction));
        } catch (error: any) {
          container.logger.error(this.generateMessage('error', client, interaction, error));
        }
      }
    });
  }

  private generateMessage(
    type: 'success' | 'error',
    client: Client,
    interaction: CommandInteraction,
    error?: Error
  ): string {
    const shard: string = `[${yellowBright(client.shard?.count ?? 0)}]`;
    const member: string = `${yellowBright(interaction.member?.user.username ?? '')}`;
    const command: string = `${yellowBright(interaction.commandName)}`;
    const channel: string = `${yellowBright((interaction.channel as GuildBasedChannel).name)}`;
    const errorMessage: string = `${yellowBright(error?.message ?? '')}`;

    const at: string = type === 'success' ? greenBright('@') : redBright('@');
    const openBracket: string = type === 'success' ? greenBright('<') : redBright('<');
    const closeBracket: string = type === 'success' ? greenBright('>') : redBright('>');

    const styledMember: string = `${at}${member}`;
    const styledCommand: string = `${openBracket}${command}${closeBracket}`;
    const styledChannel: string = `${openBracket}${channel}${closeBracket}`;
    const styledErrorMessage: string = `${redBright('error:')} ${errorMessage}`;

    switch (type) {
      case 'success':
        return `${shard} ${styledMember} ${styledCommand} ${styledChannel}`;
      case 'error':
        return `${shard} ${styledMember} ${styledCommand} ${styledChannel} ${styledErrorMessage}`;
    }
  }
}

export default CommandHandler;
