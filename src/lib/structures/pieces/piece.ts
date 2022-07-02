import Container from '../../container';

export interface PieceOptions {
  name: string;
  disabled?: boolean;
}

export default interface Piece {
  options: PieceOptions;
  container: Container;
}
