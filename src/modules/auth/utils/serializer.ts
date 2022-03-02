import { Injectable, Inject } from '@nestjs/common';
import { PassportSerializer } from '@nestjs/passport';
import { User } from '@prisma/client';
import { AuthenticationProvider } from 'modules/auth/services/auth';
import { Done, DoneUser } from 'types/types';

@Injectable()
export class SessionSerializer extends PassportSerializer {
  constructor(
    @Inject('AUTH_SERVICE')
    private readonly authService: AuthenticationProvider,
  ) {
    super();
  }

  serializeUser(user: User, done: Done) {
    done(null, user.id);
  }

  async deserializeUser(user: User, done: DoneUser) {
    const userDB = await this.authService.findUser(user.id);
    return userDB ? done(null, userDB) : done(null, null);
  }
}
