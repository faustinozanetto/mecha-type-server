import { User } from '@prisma/client';
import { UserDetails } from 'types/types';

export interface AuthenticationProvider {
  validateUser(details: UserDetails);
  createUser(details: UserDetails);
  findUser(discordId: string): Promise<User | undefined>;
}
