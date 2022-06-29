import { StructureOptions } from '../structures/structure';

function ApplyOptions<T extends StructureOptions>(options: T) {
  return function <E extends { new (...args: any[]): {} }>(target: E): any {
    return class extends target {
      public constructor(...args: any[]) {
        super(options, ...args);
      }
    };
  };
}

export default ApplyOptions;
