/* eslint-disable no-unused-vars */

export enum Identifiers {}

export default class UserError extends Error {
  public readonly identifier: keyof typeof Identifiers;
  public readonly isUserError: boolean;

  public constructor(message: string, identifier: keyof typeof Identifiers) {
    super(message);

    this.identifier = identifier;
    this.isUserError = true;

    Object.setPrototypeOf(this, UserError.prototype);
  }

  public override get name(): string {
    return 'UserError';
  }
}
