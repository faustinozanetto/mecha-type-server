import { HttpService, Inject, Injectable } from '@nestjs/common';
import { DiscordProvider } from './discord';

@Injectable()
export class DiscordService implements DiscordProvider {
  constructor(@Inject(HttpService) private readonly httpService: HttpService) {}
}
