import R6StatsAPI from '@r6stats/node';
import Service from './service';
import Container from '../structures/container';

class R6StatsService extends Service {
  private api: R6StatsAPI;

  public constructor(container: Container, apiKey: string) {
    super(container);
    this.api = new R6StatsAPI({ baseUrl: 'https://api2.r6stats.com/public-api/', apiKey });
  }
}

export default R6StatsService;
