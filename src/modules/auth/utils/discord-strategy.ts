import { Profile, Strategy } from 'passport-discord';
import { PassportStrategy } from '@nestjs/passport';
import { Inject, Injectable } from '@nestjs/common';
import { AuthenticationProvider } from 'modules/auth/services/auth';
import { UserDetails } from 'types/types';
import { AuthProvider } from 'models/user/user.model';
import { __DISCORD_CALLBACK__ } from 'utils/constants';

@Injectable()
export class DiscordStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject('AUTH_SERVICE')
    private readonly authService: AuthenticationProvider,
  ) {
    super({
      clientID: process.env.DISCORD_CLIENT_ID,
      clientSecret: process.env.DISCORD_CLIENT_SECRET,
      callbackURL: __DISCORD_CALLBACK__,
      scope: ['identify'],
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: Profile) {
    const { username, id, avatar } = profile;
    const details: UserDetails = {
      username,
      authProvider: AuthProvider.DISCORD,
      oauthId: id,
      avatar,
      accessToken,
      refreshToken,
    };
    return this.authService.validateUser(details);
  }
}
