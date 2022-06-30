import 'dotenv/config';
import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v10';
import { importStructures } from '../lib/utils/structure.utils';
import { ApplicationCommandDataResolvable, Collection } from 'discord.js';
import Container from '../lib/container';
import Command from '../lib/structures/command.structure';
import config from '../config';

(async (): Promise<void> => {
  const commands: Collection<string, Command> = await importStructures<Command>(
    'command',
    new Container()
  );

  const data: ApplicationCommandDataResolvable[] = [];

  for (const command of commands.values()) data.push(command.options);

  const rest: REST = new REST({ version: '10' }).setToken(config.token);

  rest.put(Routes.applicationCommands(config.clientId), { body: data }).then(console.log);
})();
