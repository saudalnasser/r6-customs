export interface PieceOptions {
  name: string;
  disabled?: boolean;
}

export default interface Piece {
  readonly options: PieceOptions;
}
