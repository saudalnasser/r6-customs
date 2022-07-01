import { Collection } from 'discord.js';
import { join } from 'path';
import fs from 'fs';
import Structure from '../structures/structure';
import Container from '../container';

type structureName = 'command' | 'event' | 'guard';

async function importType(structureName: structureName, file: string): Promise<any> {
  return (await import(`../../../dist/${structureName}s/${file}`))?.default;
}

/**
 * imports all the structures of the given type and returns them in an array
 * @param {structureName} structureName the name of the structure to import
 * @returns array of structures of a specific type
 */
export async function importStructures<T extends Structure>(
  structureName: structureName,
  container: Container
): Promise<Collection<string, T>> {
  const collection: Collection<string, T> = new Collection();

  const path: string = join(process.cwd(), 'dist', `${structureName}s`);
  const files: string[] = fs.readdirSync(path);

  for (const file of files) {
    const Type: any = await importType(structureName, file);
    const instance: T = new Type(container) as T;

    if (instance.options.disabled) continue;

    collection.set(instance.options.name, instance);
  }

  return collection;
}
