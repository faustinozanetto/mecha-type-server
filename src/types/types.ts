import { User } from '@prisma/client';
import { Request, Response } from 'express';

export type UserDetails = {
  username: string;
  discordId: string;
  avatar: string;
  accessToken: string;
  refreshToken: string;
};

export type MechaContext = {
  req: Request;
  res: Response;
};

export type Done = (err: Error, user: User) => void;
