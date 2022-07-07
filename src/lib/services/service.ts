import Container from '../structures/container';

export default abstract class Service {
  protected readonly container: Container;

  public constructor(container: Container) {
    this.container = container;
  }
}
