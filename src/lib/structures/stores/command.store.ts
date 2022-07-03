import { Collection } from 'discord.js';
import Store from './store';
import Command from '../pieces/command.piece';

class CommandStore extends Store<Command> {
  private commands!: Collection<string, Command>;

  public async initialize(): Promise<void> {
    this.commands = await this.piecesLoader.load<Command>('command');
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
