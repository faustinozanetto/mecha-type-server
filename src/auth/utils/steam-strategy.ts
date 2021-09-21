import { Profile, Strategy } from 'passport-steam';
import { PassportStrategy } from '@nestjs/passport';
import { Inject, Injectable } from '@nestjs/common';
import { AuthenticationProvider } from 'auth/services/auth';
import { UserDetails } from 'types/types';
import { AuthProvider } from 'models/user/user.model';

@Injectable()
export class SteamStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject('AUTH_SERVICE')
    private readonly authService: AuthenticationProvider,
  ) {
    super({
      apiKey: process.env.STEAM_API_KEY,
      realm: 'http://localhost:4000/',
      returnURL: 'http://localhost:4000/api/auth/steam/redirect',
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: Profile) {
    if (profile) {
      console.log(accessToken);
      // const { displayName, identifier, avatarfull } = profile;
      const details: UserDetails = {
        username: profile?.displayName ?? '',
        oauthId: profile?.id ?? '',
        authProvider: AuthProvider.DEFAULT,
        avatar: profile?.photos[0]?.value ?? '',
        accessToken: accessToken ?? '',
        refreshToken: refreshToken ?? '',
      };
      return this.authService.validateUser(details);
    }
  }
}
