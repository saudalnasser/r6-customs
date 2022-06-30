import {
  Client,
  CommandInteraction,
  CommandInteractionOptionResolver,
  GuildBasedChannel,
} from 'discord.js';
import { yellowBright, greenBright, redBright } from 'colorette';
import Container from '../container';
import Handler from './handler';
import CommandStore from '../stores/command.store';

class CommandsHandler implements Handler {
  private commandStore: CommandStore;

  public constructor(commandStore: CommandStore) {
    this.commandStore = commandStore;
  }

  public async initialize(client: Client, container: Container): Promise<void> {
    client.on('interactionCreate', async (interaction) => {
      if (interaction.isCommand()) {
        try {
          await this.commandStore.get(interaction.commandName)?.run({
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

export default CommandsHandler;
