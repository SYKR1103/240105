import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as RedisStore from 'cache-manager-redis-store';

@Module({
  imports: [
    CacheModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        store: RedisStore,
        host: configService.get('REDIS_HOST'),
        port: configService.get('REDIS_PORT'),
        user: configService.get('REDIS_USER'),
        password: configService.get('REDIS_PASSWORD'),
        ttl: configService.get('REDIS_TTL'),
      }),
      isGlobal: true,
    }),
  ],
})
export class RedisModule {}
