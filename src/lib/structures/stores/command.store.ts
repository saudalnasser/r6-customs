import Store from './store';
import Command from '../pieces/command.piece';

class CommandStore extends Store<Command> {
  public async initialize(): Promise<void> {
    this.pieces = await this.piecesLoader.load<Command>('command');
  }
}

export default CommandStore;
