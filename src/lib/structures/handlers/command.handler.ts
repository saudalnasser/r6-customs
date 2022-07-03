import { CommandInteractionOptionResolver, InteractionDeferReplyOptions } from 'discord.js';
import {
  commandExecutionSuccessMessage,
  commandExecutionErrorMessage,
  guardExecutionErrorMessage,
} from '../../utils/logger/messages/command-handler.messages';
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
    const { container, commandStore, guardStore } = this;
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
            logger.error(guardExecutionErrorMessage(interaction, guard, error));
          }
        }

        try {
          await command.run({
            interaction,
            args: interaction.options as CommandInteractionOptionResolver,
          });

          logger.debug(commandExecutionSuccessMessage(interaction));
        } catch (error: any) {
          logger.error(commandExecutionErrorMessage(interaction, error));
        }
      }
    });
  }
}

export default CommandHandler;
