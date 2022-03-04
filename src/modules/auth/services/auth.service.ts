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
        where: { oauthId: details.oauthId },
      });
      if (userExists) {
        console.log('Updating user: ', details.username);
        const updatedUser = await this.prisma.user.update({
          where: { oauthId: details.oauthId },
          data: details,
        });
        return updatedUser;
      } else {
        console.log('Creating user: ', details.username);
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
