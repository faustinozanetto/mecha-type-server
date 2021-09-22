import { User } from '@prisma/client';
import { Response, Request } from 'express';
import { AuthProvider } from 'models/user/user.model';

export type UserDetails = {
  username: string;
  oauthId: string;
  avatar: string;
  authProvider: AuthProvider;
  accessToken: string;
  refreshToken: string;
};

export type UserStatus = {
  id: string;
  username: string;
};

export type MechaContext = {
  req: Request;
  res: Response;
};

export type Done = (err: Error, user: User) => void;
