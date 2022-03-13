import { Module } from '@nestjs/common';
import { AuthController } from './controllers/auth.controller';
import { AuthService } from './services/auth.service';
import { DiscordStrategy } from './utils/discord-strategy';
import { GithubStrategy } from './utils/github-strategy';
import { LocalStrategy } from './utils/local-strategy';
import { SessionSerializer } from './utils/serializer';

@Module({
  controllers: [AuthController],
  providers: [
    DiscordStrategy,
    GithubStrategy,
    LocalStrategy,
    SessionSerializer,
    {
      provide: 'AUTH_SERVICE',
      useClass: AuthService,
    },
  ],
  exports: [
    {
      provide: 'AUTH_SERVICE',
      useClass: AuthService,
    },
  ],
  imports: [],
})
export class AuthModule {}
