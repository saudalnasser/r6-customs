import Container from '../container';

interface Handler {
  initialize(container: Container): Promise<void>;
}

export default Handler;
