import { Profile, Strategy } from 'passport-discord';
import { PassportStrategy } from '@nestjs/passport';
import { Inject, Injectable } from '@nestjs/common';
import { AuthenticationProvider } from 'auth/services/auth';

@Injectable()
export class DiscordStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject('AUTH_SERVICE')
    private readonly authService: AuthenticationProvider,
  ) {
    super({
      clientID: process.env.DISCORD_CLIENT_ID,
      clientSecret: process.env.DISCORD_CLIENT_SECRET,
      callbackURL: process.env.DISCORD_CALLBACK_URL,
      scope: ['identify'],
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: Profile) {
    const { username, id: discordId, avatar } = profile;
    const details = {
      username,
      discordId,
      avatar,
      accessToken,
      refreshToken,
    };
    return this.authService.validateUser(details);
  }
}
