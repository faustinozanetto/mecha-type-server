import DataLoader from 'dataloader';
import { AuthProvider, User, UserBadge } from '../models/user/user.model';
import { PrismaService } from '../prisma/prisma.service';

export const createUserLoader = (prismaService: PrismaService) =>
  new DataLoader<string, User>(async (userIds) => {
    const users = await prismaService.user.findMany({ where: { id: { in: userIds as string[] } } });
    const mappedUsers = users.map((user) => {
      return {
        ...user,
        badge:
          user.badge === 'DEFAULT'
            ? UserBadge.DEFAULT
            : user.badge === 'PRO'
            ? UserBadge.PRO
            : UserBadge.TESTER,
        authProvider:
          user.authProvider === 'DEFAULT'
            ? AuthProvider.DEFAULT
            : user.authProvider === 'DISCORD'
            ? AuthProvider.DISCORD
            : user.authProvider === 'GITHUB'
            ? AuthProvider.GITHUB
            : AuthProvider.GOOGLE,
      };
    });
    const userIdToUser: Record<string, User> = {};
    mappedUsers.forEach((user) => {
      userIdToUser[user.id] = user;
    });

    return userIds.map((userId) => userIdToUser[userId]);
  });
