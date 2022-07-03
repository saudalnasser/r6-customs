import { greenBright, redBright, yellowBright } from 'colorette';
import { CommandInteraction, GuildBasedChannel } from 'discord.js';
import Guard from '../../../structures/pieces/guard.piece';

export function commandExecutionSuccessMessage(interaction: CommandInteraction): string {
  const member: string = `${yellowBright(interaction.member?.user.username ?? '')}`;
  const command: string = `${yellowBright(interaction.commandName)}`;
  const channel: string = `${yellowBright((interaction.channel as GuildBasedChannel).name)}`;

  const at: string = greenBright('@');
  const openBracket: string = greenBright('<');
  const closeBracket: string = greenBright('>');

  const styledMember: string = `${at}${member}`;
  const styledCommand: string = `${openBracket}${command}${closeBracket}`;
  const styledChannel: string = `${openBracket}${channel}${closeBracket}`;

  return `${styledMember} ${styledCommand} ${styledChannel}`;
}

export function commandExecutionErrorMessage(
  interaction: CommandInteraction,
  error?: Error
): string {
  const member: string = `${yellowBright(interaction.member?.user.username ?? '')}`;
  const command: string = `${yellowBright(interaction.commandName)}`;
  const channel: string = `${yellowBright((interaction.channel as GuildBasedChannel).name)}`;
  const errorMessage: string = `${yellowBright(error?.message ?? '')}`;

  const at: string = redBright('@');
  const openBracket: string = redBright('<');
  const closeBracket: string = redBright('>');

  const styledMember: string = `${at}${member}`;
  const styledCommand: string = `${openBracket}${command}${closeBracket}`;
  const styledChannel: string = `${openBracket}${channel}${closeBracket}`;
  const styledErrorMessage: string = `${redBright('error:')} ${errorMessage}`;

  return `${styledMember} ${styledCommand} ${styledChannel} ${styledErrorMessage}`;
}

export function guardExecutionErrorMessage(
  interaction: CommandInteraction,
  guard: Guard,
  error?: Error
): string {
  const member: string = `${yellowBright(interaction.member?.user.username ?? '')}`;
  const guardName: string = `${yellowBright(guard.options.name)}`;
  const command: string = `${yellowBright(interaction.commandName)}`;
  const channel: string = `${yellowBright((interaction.channel as GuildBasedChannel).name)}`;
  const errorMessage: string = `${yellowBright(error?.message ?? '')}`;

  const at: string = redBright('@');
  const openBracket: string = redBright('<');
  const closeBracket: string = redBright('>');

  const styledMember: string = `${at}${member}`;
  const styledGuard: string = `${openBracket}${guardName}${closeBracket}`;
  const styledCommand: string = `${openBracket}${command}${closeBracket}`;
  const styledChannel: string = `${openBracket}${channel}${closeBracket}`;
  const styledErrorMessage: string = `${redBright('error:')} ${errorMessage}`;

  return `${styledMember} ${styledGuard} ${styledCommand} ${styledChannel} ${styledErrorMessage}`;
}
