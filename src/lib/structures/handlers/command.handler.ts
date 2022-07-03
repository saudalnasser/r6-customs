import {
  Client,
  CommandInteraction,
  CommandInteractionOptionResolver,
  GuildBasedChannel,
  InteractionDeferReplyOptions,
} from 'discord.js';
import { yellowBright, greenBright, redBright } from 'colorette';
import Structure from '../structure';
import Handler from './handler';
import Container from '../container';
import Command from '../pieces/command.piece';
import CommandStore from '../stores/command.store';
import Guard, { GuardResult } from '../pieces/guard.piece';
import GuardStore from '../stores/guard.store';

class CommandHandler extends Structure implements Handler {
  private commandStore: CommandStore;
  private guardStore: GuardStore;

  public constructor(container: Container, commandStore: CommandStore, guardStore: GuardStore) {
    super(container);

    this.commandStore = commandStore;
    this.guardStore = guardStore;
  }

  public async initialize(): Promise<void> {
    const {
      container,
      commandStore,
      guardStore,
      generateCommandExecutionMessage,
      generateGuardExecutionMessage,
    } = this;
    const { client, logger } = container;

    client.on('interactionCreate', async (interaction) => {
      if (interaction.isCommand()) {
        const command: Command | undefined = commandStore.get(interaction.commandName);
        if (!command) return;

        const guards: Guard[] = guardStore.getMany((command.options.guards ?? []) as string[]);

        for (const guard of guards) {
          try {
            const result: GuardResult = await guard.run({
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
          } catch (error: any) {
            logger.error(generateGuardExecutionMessage(client, interaction, guard, error));
          }
        }

        try {
          await command.run({
            interaction,
            args: interaction.options as CommandInteractionOptionResolver,
          });

          logger.debug(generateCommandExecutionMessage('success', client, interaction));
        } catch (error: any) {
          logger.error(generateCommandExecutionMessage('error', client, interaction, error));
        }
      }
    });
  }

  private generateCommandExecutionMessage(
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

  private generateGuardExecutionMessage(
    client: Client,
    interaction: CommandInteraction,
    guard: Guard,
    error?: Error
  ): string {
    const shard: string = `[${yellowBright(client.shard?.count ?? 0)}]`;
    const member: string = `${yellowBright(interaction.member?.user.username ?? '')}`;
    const guardName: string = `${yellowBright(guard.options.name)}`;
    const command: string = `${yellowBright(interaction.commandName)}`;
    const channel: string = `${yellowBright((interaction.channel as GuildBasedChannel).name)}`;
    const errorMessage: string = `${yellowBright(error?.message ?? '')}`;

    const at: string = redBright('@');
    const openBracket: string = redBright('<');
    const closeBracket: string = redBright('>');

    const styledMember: string = `${at}${member}`;
    const styledGuard: string = `${openBracket}${guardName}${closeBracket}`;
    const styledCommand: string = `${openBracket}${command}${closeBracket}`;
    const styledChannel: string = `${openBracket}${channel}${closeBracket}`;
    const styledErrorMessage: string = `${redBright('error:')} ${errorMessage}`;

    return `${shard} ${styledMember} ${styledGuard} ${styledCommand} ${styledChannel} ${styledErrorMessage}`;
  }
}

export default CommandHandler;
