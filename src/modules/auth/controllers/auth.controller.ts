import { Controller, Get, HttpCode, Post, Req, Res, UseGuards } from '@nestjs/common';
import {
  AuthenticatedGuard,
  DiscordAuthGuard,
  GithubAuthGuard,
  GoogleAuthGuard,
} from 'modules/auth/utils/guards';
import { Response, Request } from 'express';
import { __AUTH_REDIRECT__, __ORIGIN__, __URL__ } from 'utils/constants';

@Controller({
  path: 'auth',
  version: '1',
})
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
   * GET /api/auth/github/redirect
   * This is the redirect URL the OAuth2 Provider will call for github
   */
  @Get('/github/redirect')
  @UseGuards(GithubAuthGuard)
  githubRedirect(@Res() res: Response) {
    res.redirect(__AUTH_REDIRECT__ as string);
  }

  @Get('/logout')
  @HttpCode(200)
  @UseGuards(AuthenticatedGuard)
  async logout(@Res() res: Response, @Req() req: Request) {
    await new Promise<void>((resolve, reject) => {
      req.session?.destroy((err) => {
        if (err) {
          return reject(err);
        }
        return resolve();
      });
    });
    res.clearCookie('session');
    return res.send({ success: true });
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
          authUrl: `${__URL__}/api/v1/auth/discord/login`,
        },
        {
          id: 'google',
          name: 'Google',
          authUrl: `${__URL__}/api/v1/auth/google/login`,
        },
        {
          id: 'github',
          name: 'Github',
          authUrl: `${__URL__}/api/v1/auth/github/login`,
        },
      ],
    });
  }
}
