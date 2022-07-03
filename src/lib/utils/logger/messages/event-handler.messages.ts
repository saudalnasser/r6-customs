import { redBright, yellowBright } from 'colorette';
import { ClientEvents } from 'discord.js';
import Event from '../../../structures/pieces/event.piece';

export function eventExecutionErrorMessage(event: Event<keyof ClientEvents>, error: Error): string {
  const eventName: string = `${yellowBright(event.options.name)}`;
  const errorMessage: string = `${yellowBright(error?.message ?? '')}`;

  const openBracket: string = redBright('<');
  const closeBracket: string = redBright('>');

  const styledEventName: string = `${openBracket}${eventName}${closeBracket}`;
  const styledErrorMessage: string = `${redBright('error:')} ${errorMessage}`;

  return `${styledEventName} ${styledErrorMessage}`;
}
