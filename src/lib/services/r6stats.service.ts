import { Platform } from '@r6stats/node/lib/types/stats/meta.type';
import R6StatsAPI, { APIResponse, GenericStatsResponse } from '@r6stats/node';
import Service from './service';
import Container from '../structures/container';

class R6StatsService extends Service {
  private api: R6StatsAPI;
  private platform: Platform;

  public constructor(container: Container, baseUrl: string, apiKey: string) {
    super(container);
    this.api = new R6StatsAPI({ baseUrl, apiKey });
    this.platform = 'pc';
  }

  public async getUplayId(username: string): Promise<string | null> {
    try {
      const stats: APIResponse<GenericStatsResponse> = await this.api.playerStats(
        username,
        this.platform
      );

      return stats.data.uplay_id;
    } catch (error: any) {
      if (error.isAxiosError) {
        const expectedError: boolean | undefined =
          error.response && error.response.status >= 400 && error.response.status < 500;

        if (!expectedError) {
          this.container.logger.error(error);
          throw error;
        }
      }

      return null;
    }
  }
}

export default R6StatsService;
