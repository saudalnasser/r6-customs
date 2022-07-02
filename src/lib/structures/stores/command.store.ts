import { Collection } from 'discord.js';
import PiecesLoader from '../../utils/pieces/pieces-loader';
import Command from '../pieces/command.piece';
import Store from './store';

class CommandStore implements Store<Command> {
  private commands!: Collection<string, Command>;

  public async initialize(loader: PiecesLoader): Promise<void> {
    this.commands = await loader.load<Command>('command');
  }

  public get(name: string): Command | undefined {
    return this.commands.get(name);
  }

  public getMany(names: string[]): Command[] {
    const commands: Command[] = [];

    for (const name of names) {
      const command: Command | undefined = this.commands.get(name);
      if (command) commands.push(command);
    }

    return commands;
  }

  public getIterable(): IterableIterator<Command> {
    return this.commands.values();
  }
}

export default CommandStore;
