import { DynamicModule } from '@nestjs/common';
import { RedisModule, RedisModuleOptions } from 'nestjs-redis';

export const Redis: DynamicModule = RedisModule.forRootAsync({
  imports: [],
  inject: [],
  useFactory: (): RedisModuleOptions => {
    return {
      host: process.env.REDIS_HOST,
      port: Number(process.env.REDIS_PORT || 6379),
    };
  },
});
