import { CommandInteraction, CommandInteractionOptionResolver } from 'discord.js';
import {
  commandExecutionSuccessMessage,
  commandExecutionErrorMessage,
  guardExecutionErrorMessage,
} from '../../utils/logger/messages/command-handler.messages';
import { GuardResult, RunOptions as GuardRunOptions } from '../pieces/guard.piece';
import Structure from '../structure';
import Handler from './handler';
import Container from '../container';
import Command, { RunOptions as CommandRunOptions } from '../pieces/command.piece';
import CommandStore from '../stores/command.store';
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
    this.container.client.on('interactionCreate', async (interaction) => {
      if (interaction.isCommand()) {
        const command: Command | undefined = this.commandStore.get(interaction.commandName);
        if (!command) return;

        const runOptions: GuardRunOptions | CommandRunOptions = {
          interaction,
          args: interaction.options as CommandInteractionOptionResolver,
        };

        const guards: string[] = (command.options.guards ?? []) as string[];
        const passGuards: boolean = await this.runGuards(guards, runOptions, interaction);
        if (!passGuards) return;

        await this.runCommand(command, runOptions, interaction);
      }
    });
  }

  private async runGuards(
    guards: string[],
    runOptions: GuardRunOptions,
    interaction: CommandInteraction
  ): Promise<boolean> {
    for (const guard of this.guardStore.getMany(guards)) {
      try {
        const result: GuardResult = await guard.run(runOptions);
        if (result.ok) continue;

        await interaction.reply(result.response);

        return false;
      } catch (error: any) {
        this.container.logger.error(guardExecutionErrorMessage(interaction, guard, error));
      }
    }

    return true;
  }

  private async runCommand(
    command: Command,
    runOptions: CommandRunOptions,
    interaction: CommandInteraction
  ): Promise<void> {
    try {
      await command.run(runOptions);

      this.container.logger.debug(commandExecutionSuccessMessage(interaction));
    } catch (error: any) {
      await interaction.reply({ content: 'unexpected error occurred!', ephemeral: true });

      this.container.logger.error(commandExecutionErrorMessage(interaction, error));
    }
  }
}

export default CommandHandler;
