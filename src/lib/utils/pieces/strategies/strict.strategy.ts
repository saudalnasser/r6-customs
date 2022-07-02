import { Collection } from 'discord.js';
import { readdirSync } from 'fs';
import { join } from 'path';
import { LoadStrategy, PieceName } from '../pieces-loader';
import Piece from '../../../pieces/piece';
import Container from '../../../container';

class StrictLoadStrategy implements LoadStrategy {
  public async load<T extends Piece>(
    pieceName: PieceName,
    collection: Collection<string, T>,
    container: Container
  ): Promise<void> {
    const path: string = join(process.cwd(), 'dist', `${pieceName}s`);
    const files: string[] = readdirSync(path);

    for (const file of files) {
      const Type: any = await this.importType(pieceName, file);
      const instance: T = new Type(container) as T;

      if (instance.options.disabled) continue;

      collection.set(instance.options.name, instance);
    }
  }

  private async importType(pieceName: PieceName, file: string): Promise<any> {
    return (await import(`../../../../../dist/${pieceName}s/${file}`))?.default;
  }
}

export default StrictLoadStrategy;
