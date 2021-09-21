import { Strategy, Profile } from 'passport-github';
import { PassportStrategy } from '@nestjs/passport';
import { Inject, Injectable } from '@nestjs/common';
import { AuthenticationProvider } from 'auth/services/auth';
import { UserDetails } from 'types/types';
import { AuthProvider } from 'models/user/user.model';
import { __GITHUB_CALLBACK__ } from 'utils/constants';

@Injectable()
export class GithubStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject('AUTH_SERVICE')
    private readonly authService: AuthenticationProvider,
  ) {
    super({
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: __GITHUB_CALLBACK__,
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: Profile) {
    const details: UserDetails = {
      username: profile.displayName,
      oauthId: profile.id,
      authProvider: AuthProvider.GITHUB,
      avatar: profile.photos[0].value,
      accessToken: accessToken ?? '',
      refreshToken: refreshToken ?? '',
    };
    return this.authService.validateUser(details);
  }
}
