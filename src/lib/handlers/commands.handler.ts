import { Client, Collection, CommandInteractionOptionResolver } from 'discord.js';
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
        await this.commands.get(interaction.commandName)?.run({
          client,
          interaction,
          args: interaction.options as CommandInteractionOptionResolver,
        });
      }
    });
  }
}

export default CommandsHandler;
