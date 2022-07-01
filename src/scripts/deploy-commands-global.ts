import 'dotenv/config';
import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v10';
import { ApplicationCommandDataResolvable, Collection } from 'discord.js';
import StructuresLoader from '../lib/utils/structures/structures-loader';
import StrictLoadStrategy from '../lib/utils/structures/strategies/strict.strategy';
import Container from '../lib/container';
import Command from '../lib/structures/command.structure';
import config from '../config';

(async (): Promise<void> => {
  const loader: StructuresLoader = new StructuresLoader(new StrictLoadStrategy(), new Container());

  const commands: Collection<string, Command> = await loader.load<Command>('command');

  const data: ApplicationCommandDataResolvable[] = [];

  for (const command of commands.values()) data.push(command.options);

  const rest: REST = new REST({ version: '10' }).setToken(config.token);

  rest.put(Routes.applicationCommands(config.clientId), { body: data }).then(console.log);
})();
