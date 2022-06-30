import Container from '../container';

export interface StructureOptions {
  name: string;
}

export default interface Structure {
  options: StructureOptions;
  container: Container;
}
