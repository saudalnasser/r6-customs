/* eslint-disable no-unused-vars */

export enum LogLevel {
  Trace = 10,
  Debug = 20,
  Info = 30,
  Warn = 40,
  Error = 50,
  Fatal = 60,
  None = 100,
}

export interface LogStrategy {
  write(level: LogLevel, ...values: readonly unknown[]): void;
}

export default class Logger {
  public readonly level: LogLevel;
  private readonly logStrategy: LogStrategy;

  public constructor(level: LogLevel, logStrategy: LogStrategy) {
    this.level = level;
    this.logStrategy = logStrategy;
  }

  public has(level: LogLevel): boolean {
    return level >= this.level;
  }

  public trace(...values: readonly unknown[]): void {
    this.write(LogLevel.Trace, ...values);
  }

  public debug(...values: readonly unknown[]): void {
    this.write(LogLevel.Debug, ...values);
  }

  public info(...values: readonly unknown[]): void {
    this.write(LogLevel.Info, ...values);
  }

  public warn(...values: readonly unknown[]): void {
    this.write(LogLevel.Warn, ...values);
  }

  public error(...values: readonly unknown[]): void {
    this.write(LogLevel.Error, ...values);
  }

  public fatal(...values: readonly unknown[]): void {
    this.write(LogLevel.Fatal, ...values);
  }

  private write(level: LogLevel, ...values: readonly unknown[]): void {
    if (!this.has(level)) return;

    this.logStrategy.write(level, ...values);
  }
}
