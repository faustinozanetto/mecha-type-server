import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { Inject, Injectable } from '@nestjs/common';
import { AuthenticationProvider } from 'modules/auth/services/auth';
import { UserDetails } from 'types/types';
import { AuthProvider } from 'models/user/user.model';
import { __DISCORD_CALLBACK__ } from 'utils/constants';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject('AUTH_SERVICE')
    private readonly authService: AuthenticationProvider,
  ) {
    super({
      callbackURL: __DISCORD_CALLBACK__,
    });
  }

  async validate(username: string, password: string) {
    console.log({ username, password });

    return this.authService.validateUser({
      username: username,
      accessToken: '',
      refreshToken: '',
      oauthId: '',
      authProvider: AuthProvider.LOCAL,
      avatar: '',
    });
  }
}
