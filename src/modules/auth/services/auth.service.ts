import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';
import { UserDetails } from 'types/types';
import { AuthenticationProvider } from './auth';

@Injectable()
export class AuthService implements AuthenticationProvider {
  constructor(private prisma: PrismaService) {}

  async validateUser(details: UserDetails) {
    try {
      const userExists = await this.prisma.user.findUnique({
        where: { username: details.username },
      });
      if (userExists) {
        const updatedUser = await this.prisma.user.update({
          where: { username: details.username },
          // include: {
          // followers: true,
          // following: true,
          // testPresetHistory: true,
          // testPresets: true,
          // },
          data: details,
        });
        return updatedUser;
      } else {
        return this.createUser(details);
      }
    } catch (error) {}
  }

  async createUser(details: UserDetails) {
    return await this.prisma.user.create({
      data: {
        oauthId: details.oauthId,
        username: details.username,
        avatar: details.avatar,
        authProvider: details.authProvider,
        accessToken: details.accessToken,
        refreshToken: details.refreshToken,
      },
    });
  }

  async findUser(id: string): Promise<User | undefined> {
    const user = await this.prisma.user.findUnique({
      where: { id: id },
    });
    if (user) {
      return user;
    }
  }
}
