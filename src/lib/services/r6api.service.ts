import Service from './service';
import Container from '../structures/container';
import R6API from 'r6api.js';

class R6ApiService extends Service {
  private readonly api: R6API;

  public constructor(container: Container, email: string, password: string) {
    super(container);

    this.api = new R6API({ email, password });
  }

  public async getUplayId(username: string): Promise<string | null> {
    const { 0: player } = await this.api.findByUsername('uplay', username);

    return player ? player.id : null;
  }
}

export default R6ApiService;
