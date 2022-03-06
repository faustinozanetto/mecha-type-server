import { DynamicModule } from '@nestjs/common';
import { RedisModule, RedisModuleOptions } from 'nestjs-redis';

export const Redis: DynamicModule = RedisModule.forRootAsync({
  imports: [],
  inject: [],
  useFactory: (): RedisModuleOptions => {
    return {
      host: process.env.REDIS_HOST as string,
      username: process.env.REDIS_USER as string,
      password: process.env.REDIS_PASS as string,
      port: Number(process.env.REDIS_PORT),
    };
  },
});
