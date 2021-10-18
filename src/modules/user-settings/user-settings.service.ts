import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { UserSettingsCreateInput } from './dto/user-settings-create.input';

@Injectable()
export class UserSettingsService {
  constructor(private prisma: PrismaService) {}

  async createUserSettings(input: UserSettingsCreateInput): Promise<UserSettingsResponse> {
    const userSettings = await this.prisma.userSettings
  }
}
