import { blackBright, magentaBright, cyanBright, yellowBright, redBright, red } from 'colorette';
import { LogLevel, LogStrategy } from '../logger';

function colorize(logLevel: LogLevel, text: string): string {
  switch (logLevel) {
    case LogLevel.Trace:
      return blackBright(text);
    case LogLevel.Debug:
      return magentaBright(text);
    case LogLevel.Info:
      return cyanBright(text);
    case LogLevel.Warn:
      return yellowBright(text);
    case LogLevel.Error:
      return redBright(text);
    case LogLevel.Fatal:
      return red(text);
    default:
      return text;
  }
}

type LogMethods = 'trace' | 'debug' | 'info' | 'warn' | 'error';

class ConsoleLogStrategy implements LogStrategy {
  public write(level: LogLevel, ...values: readonly unknown[]): void {
    const levelLabel: string = LogLevel[level].toUpperCase();
    const messageLevel: string = `[${colorize(level, levelLabel)}]`;

    const method: LogMethods | undefined = ConsoleLogStrategy.levels.get(level);
    if (typeof method === 'string') console[method](messageLevel, ...values);
  }

  private static readonly levels: Map<LogLevel, LogMethods> = new Map<LogLevel, LogMethods>([
    [LogLevel.Trace, 'trace'],
    [LogLevel.Debug, 'debug'],
    [LogLevel.Info, 'info'],
    [LogLevel.Warn, 'warn'],
    [LogLevel.Error, 'error'],
    [LogLevel.Fatal, 'error'],
  ]);
}

export default ConsoleLogStrategy;
