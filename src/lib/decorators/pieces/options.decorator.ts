import { PieceOptions } from '../../structures/pieces/piece';

function ApplyOptions<T extends PieceOptions>(options: T) {
  return function <E extends { new (...args: any[]): {} }>(target: E): any {
    return class extends target {
      public constructor(...args: any[]) {
        super(options, ...args);
      }
    };
  };
}

export default ApplyOptions;
