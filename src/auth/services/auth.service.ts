import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';
import { UserDetails } from 'types/types';
import { AuthenticationProvider } from './auth';

@Injectable()
export class AuthService implements AuthenticationProvider {
  constructor(private prisma: PrismaService) {}

  async validateUser(details: UserDetails) {
    const { discordId } = details;
    const user = await this.prisma.user.findUnique({
      where: { discordId },
    });
    if (user) {
      await this.prisma.user.update({
        where: {
          discordId,
        },
        data: details,
      });
      console.log('Updated');
      return user;
    }
    return this.createUser(details);
  }

  async createUser(details: UserDetails) {
    return await this.prisma.user.create({
      data: details,
    });
  }

  async findUser(discordId: string): Promise<User | undefined> {
    return await this.prisma.user.findUnique({ where: { discordId } });
  }
}
