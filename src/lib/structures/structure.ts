import Container from './container';

export default abstract class Structure {
  protected readonly container: Container;

  public constructor(container: Container) {
    this.container = container;
  }
}
