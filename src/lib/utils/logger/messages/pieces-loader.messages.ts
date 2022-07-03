import { PieceName } from '../../pieces/pieces-loader';

export function loadWarnMessage(pieceName: PieceName): string {
  return `${pieceName} store is empty.`;
}
