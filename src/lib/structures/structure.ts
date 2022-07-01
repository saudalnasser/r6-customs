import Container from '../container';

export interface StructureOptions {
  name: string;
  disabled?: boolean;
}

export default interface Structure {
  options: StructureOptions;
  container: Container;
}
