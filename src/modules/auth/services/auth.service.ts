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
      const updatedUser = await this.prisma.user.update({
        where: { username: details.username },
        include: {
          followers: true,
          following: true,
          testPresetHistory: true,
          testPresets: true,
        },
        data: details,
      });
      return updatedUser;
    } catch (error) {
      return this.createUser(details);
    }
  }

  async createUser(details: UserDetails) {
    return await this.prisma.user.create({
      data: details,
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
