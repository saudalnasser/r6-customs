import {
  Client,
  Collection,
  CommandInteraction,
  CommandInteractionOptionResolver,
  GuildBasedChannel,
} from 'discord.js';
import { yellowBright, greenBright, redBright } from 'colorette';
import { importStructures } from '../utils/structure.utils';
import Container from '../container';
import Handler from './handler';
import Command from '../structures/command.structure';

class CommandsHandler implements Handler {
  public commands!: Collection<string, Command>;
  public container: Container;

  public constructor(container: Container) {
    this.container = container;
  }

  public async initialize(client: Client): Promise<void> {
    await this.loadCommands();
    await this.handleCommands(client);
  }

  private async loadCommands(): Promise<void> {
    this.commands = await importStructures<Command>('command', this.container);
  }

  private async handleCommands(client: Client): Promise<void> {
    client.on('interactionCreate', async (interaction) => {
      if (interaction.isCommand()) {
        try {
          await this.commands.get(interaction.commandName)?.run({
            client,
            interaction,
            args: interaction.options as CommandInteractionOptionResolver,
          });

          this.container.logger.info(this.generateMessage('success', client, interaction));
        } catch (error: any) {
          this.container.logger.error(this.generateMessage('error', client, interaction, error));
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
