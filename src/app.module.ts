import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DblistModule } from './dblist/dblist.module';
import { AppconfigModule } from './appconfig/appconfig.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { RedisModule } from './redis/redis.module';
import { EmailModule } from './email/email.module';
import { MovieModule } from './movie/movie.module';

@Module({
  imports: [DblistModule, AppconfigModule, UserModule, AuthModule, RedisModule, EmailModule, MovieModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
