import { Module } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { AuthController } from './controllers/auth.controller';
import { AuthService } from './services/auth.service';
import { DiscordStrategy } from './utils/discord-strategy';
import { GithubStrategy } from './utils/github-strategy';
import { GoogleStrategy } from './utils/google-strategy';
import { SessionSerializer } from './utils/serializer';
import { SteamStrategy } from './utils/steam-strategy';

@Module({
  controllers: [AuthController],
  providers: [
    PrismaService,
    DiscordStrategy,
    GoogleStrategy,
    SteamStrategy,
    GithubStrategy,
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
  imports: [PrismaService],
})
export class AuthModule {}
