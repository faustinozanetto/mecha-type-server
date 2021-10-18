import { User } from '@prisma/client';
import { UserDetails } from 'types/types';

export interface AuthenticationProvider {
  validateUser(details: UserDetails);
  createUser(details: UserDetails);
  findUser(oauthId: string): Promise<User | undefined>;
}
