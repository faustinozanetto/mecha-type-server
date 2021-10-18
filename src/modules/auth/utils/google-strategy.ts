import { Strategy, Profile } from 'passport-google-oauth20';
import { PassportStrategy } from '@nestjs/passport';
import { Inject, Injectable } from '@nestjs/common';
import { AuthenticationProvider } from 'modules/auth/services/auth';
import { UserDetails } from 'types/types';
import { AuthProvider } from 'models/user/user.model';
import { __GOOGLE_CALLBACK__ } from 'utils/constants';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject('AUTH_SERVICE')
    private readonly authService: AuthenticationProvider,
  ) {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: __GOOGLE_CALLBACK__,
      scope: [
        'https://www.googleapis.com/auth/userinfo.profile',
        'https://www.googleapis.com/auth/userinfo.email',
      ],
      response_type: 'token',
      accessType: 'offline',
      approvalPrompt: 'consent',
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: Profile) {
    const { displayName, id, photos } = profile;
    console.log(refreshToken);
    const details: UserDetails = {
      username: displayName,
      oauthId: id,
      authProvider: AuthProvider.GOOGLE,
      avatar: photos[0].value,
      accessToken: accessToken ?? '',
      refreshToken: refreshToken ?? '',
    };
    return this.authService.validateUser(details);
  }
}
