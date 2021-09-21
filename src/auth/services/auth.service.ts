import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';
import { UserDetails } from 'types/types';
import { AuthenticationProvider } from './auth';

@Injectable()
export class AuthService implements AuthenticationProvider {
  constructor(private prisma: PrismaService) {}

  async validateUser(details: UserDetails) {
    const user = await this.prisma.user.findUnique({
      where: { oauthId: details.oauthId ?? '' },
      include: {
        accuracy: true,
        charsPerMinute: true,
        followedBy: true,
        following: true,
        testPresets: true,
        wordsPerMinute: true,
      },
    });
    if (user) {
      await this.prisma.user.update({
        where: {
          oauthId: details.oauthId ?? '',
        },
        include: {
          accuracy: true,
          charsPerMinute: true,
          followedBy: true,
          following: true,
          testPresets: true,
          wordsPerMinute: true,
        },
        data: details,
      });
      return user;
    }
    return this.createUser(details);
  }

  async createUser(details: UserDetails) {
    return await this.prisma.user.create({
      data: details,
    });
  }

  async findUser(oauthId: string): Promise<User | undefined> {
    return await this.prisma.user.findUnique({
      where: { oauthId: oauthId ?? '' },
      include: {
        accuracy: true,
        charsPerMinute: true,
        followedBy: true,
        following: true,
        testPresets: true,
        wordsPerMinute: true,
      },
    });
  }
}
