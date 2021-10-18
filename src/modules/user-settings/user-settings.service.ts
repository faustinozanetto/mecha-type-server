import { Injectable } from '@nestjs/common';
import { UserSettingsResponse } from 'models/responses/user-settings/user-settings.response';
import { PrismaService } from 'nestjs-prisma';
import { UserSettingsCreateInput } from './dto/user-settings-create.input';
import { UserSettingsUpdateInput } from './dto/user-settings-update.input';
import { UserSettingsWhereInput } from './dto/user-settings-where.input';

@Injectable()
export class UserSettingsService {
  constructor(private prisma: PrismaService) {}

  async userSettings(input: UserSettingsWhereInput): Promise<UserSettingsResponse> {
    const userSettings = await this.prisma.userSettings.findUnique({
      where: input,
    });
    if (!userSettings) {
      const createdSettings = await this.prisma.userSettings.create({
        data: {
          user: { connect: { id: input.userId } },
          blindMode: false,
          noBackspace: false,
          pauseOnError: false,
          typeSounds: false,
          typeSoundsVolume: 0.0,
        },
      });
      return {
        userSettings: createdSettings,
      };
    }
    return { userSettings };
  }

  async createUserSettings(input: UserSettingsCreateInput): Promise<UserSettingsResponse> {
    const userSettings = await this.prisma.userSettings.create({
      data: {
        blindMode: input.blindMode,
        noBackspace: input.noBackspace,
        pauseOnError: input.pauseOnError,
        typeSounds: input.typeSounds,
        typeSoundsVolume: input.typeSoundsVolume,
        user: { connect: { id: input.userId } },
      },
    });
    if (!userSettings) {
      return { errors: [{ field: 'userSettings', message: 'An error occurred!' }] };
    }
    return { userSettings };
  }

  async updateUserSettings(input: UserSettingsUpdateInput): Promise<UserSettingsResponse> {
    const userSettings = await this.prisma.userSettings.update({
      where: {
        userId: input.userId,
      },
      data: {
        blindMode: input.blindMode,
        noBackspace: input.noBackspace,
        pauseOnError: input.pauseOnError,
        typeSounds: input.typeSounds,
        typeSoundsVolume: input.typeSoundsVolume,
      },
    });
    if (!userSettings) {
      return { errors: [{ field: 'userSettings', message: 'An error occurred!' }] };
    }
    return { userSettings };
  }
}
