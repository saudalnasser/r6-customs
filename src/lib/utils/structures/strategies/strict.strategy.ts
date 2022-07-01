import { Collection } from 'discord.js';
import { readdirSync } from 'fs';
import { join } from 'path';
import { LoadStrategy, StructureName } from './../structures-loader';
import Structure from '../../../structures/structure';
import Container from '../../../container';

class StrictLoadStrategy implements LoadStrategy {
  public async load<T extends Structure>(
    structureName: StructureName,
    collection: Collection<string, T>,
    container: Container
  ): Promise<void> {
    const path: string = join(process.cwd(), 'dist', `${structureName}s`);
    const files: string[] = readdirSync(path);

    for (const file of files) {
      const Type: any = await this.importType(structureName, file);
      const instance: T = new Type(container) as T;

      if (instance.options.disabled) continue;

      collection.set(instance.options.name, instance);
    }
  }

  private async importType(structureName: StructureName, file: string): Promise<any> {
    return (await import(`../../../../../dist/${structureName}s/${file}`))?.default;
  }
}

export default StrictLoadStrategy;
