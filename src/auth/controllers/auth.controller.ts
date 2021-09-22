import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { Request, Response } from 'express';
import {
  AuthenticatedGuard,
  DiscordAuthGuard,
  GithubAuthGuard,
  GoogleAuthGuard,
  SteamAuthGuard,
} from 'auth/utils/guards';
import { __AUTH_REDIRECT__, __PROD__, __URL__ } from 'utils/constants';
import { UserStatus } from 'types/types';

@Controller('auth')
export class AuthController {
  /**
   * GET /api/auth/discord/login
   * This is the route the user will visit to authenticate with discord
   */
  @Get('/discord/login')
  @UseGuards(DiscordAuthGuard)
  discordLogin() {
    return;
  }

  /**
   * GET /api/auth/google/login
   * This is the route the user will visit to authenticate with google
   */
  @Get('/google/login')
  @UseGuards(GoogleAuthGuard)
  googleLogin() {
    return;
  }

  /**
   * GET /api/auth/steam/login
   * This is the route the user will visit to authenticate with steam
   */
  @Get('/steam/login')
  @UseGuards(SteamAuthGuard)
  steamLogin() {
    return;
  }

  /**
   * GET /api/auth/github/login
   * This is the route the user will visit to authenticate with github
   */
  @Get('/github/login')
  @UseGuards(GithubAuthGuard)
  githubLogin() {
    return;
  }

  /**
   * GET /api/auth/google/redirect
   * This is the redirect URL the OAuth2 Provider will call for google.
   */
  @Get('/google/redirect')
  @UseGuards(GoogleAuthGuard)
  googleRedirect(@Res() res: Response) {
    res.redirect(__AUTH_REDIRECT__ as string);
  }

  /**
   * GET /api/auth/discord/redirect
   * This is the redirect URL the OAuth2 Provider will call for discord
   */
  @Get('/discord/redirect')
  @UseGuards(DiscordAuthGuard)
  discordRedirect(@Res() res: Response) {
    res.redirect(__AUTH_REDIRECT__ as string);
  }

  /**
   * GET /api/auth/steam/redirect
   * This is the redirect URL the OAuth2 Provider will call for steam
   */
  @Get('/steam/redirect')
  @UseGuards(SteamAuthGuard)
  steamRedirect(@Res() res: Response) {
    res.redirect(__AUTH_REDIRECT__ as string);
  }

  /**
   * GET /api/auth/github/redirect
   * This is the redirect URL the OAuth2 Provider will call for github
   */
  @Get('/github/redirect')
  @UseGuards(GithubAuthGuard)
  githubRedirect(@Res() res: Response) {
    res.redirect(__AUTH_REDIRECT__ as string);
  }

  /**
   * GET /api/auth/status
   * Retrieve the auth status
   */
  @Get('status')
  @UseGuards(AuthenticatedGuard)
  status(@Req() req: Request, @Res() res: Response) {
    const user = req.user as UserStatus;
    return res.json({ id: user.id, username: user.username }).status(200);
  }

  /**
   * GET /api/auth/providers
   * Retrieve the auth providers
   */
  @Get('providers')
  providers(@Res() res: Response) {
    return res.json({
      providers: [
        {
          id: 'discord',
          name: 'Discord',
          authUrl: `${__URL__}/api/auth/discord/login`,
        },
        {
          id: 'google',
          name: 'Google',
          authUrl: `${__URL__}/api/auth/google/login`,
        },
        {
          id: 'github',
          name: 'Github',
          authUrl: `${__URL__}/api/auth/github/login`,
        },
      ],
    });
  }

  /**
   * GET /api/auth/logout
   * Logging the user out
   */
  @Get('logout')
  @UseGuards(AuthenticatedGuard)
  logout(@Req() req: Request) {
    req.logOut();
  }
}
