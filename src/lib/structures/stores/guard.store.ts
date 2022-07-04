import Store from './store';
import Guard from '../pieces/guard.piece';

class GuardStore extends Store<Guard> {
  public async initialize(): Promise<void> {
    this.pieces = await this.piecesLoader.load<Guard>('guard');
  }
}

export default GuardStore;
