import { Collection } from 'discord.js';
import { readdirSync } from 'fs';
import { join } from 'path';
import { LoadStrategy, PieceName } from '../pieces-loader';
import Piece from '../../../structures/pieces/piece';
import Container from '../../../structures/container';

class StrictLoadStrategy implements LoadStrategy {
  public async load<T extends Piece>(
    pieceName: PieceName,
    collection: Collection<string, T>,
    container: Container
  ): Promise<void> {
    const path: string = join(process.cwd(), 'dist', `${pieceName}s`);
    const files: string[] = readdirSync(path);

    const filteredFiles: string[] = files.filter((file) => file.endsWith('.js'));

    for (const file of filteredFiles) {
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
