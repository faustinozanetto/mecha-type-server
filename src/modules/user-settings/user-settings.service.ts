import { Injectable } from '@nestjs/common';
import { UserSettingsResponse } from 'models/responses/user-settings/user-settings.response';
import { CaretStyle } from 'models/user-settings/user-settings.model';
import { PrismaService } from 'nestjs-prisma';
import { parseModelCaretStyle, parsePrismaCaretStyle } from 'utils/helper-functions';
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
    // Not settings found, we create one.
    if (!userSettings) {
      const createdSettings = await this.prisma.userSettings.create({
        data: {
          user: { connect: { id: input.userId } },
          blindMode: false,
          noBackspace: false,
          pauseOnError: false,
          typeSounds: false,
          caretStyle: 'LINE',
          caretColor: '#ffb300',
          typeSoundsVolume: 0.0,
        },
      });
      return {
        userSettings: {
          ...createdSettings,
          caretStyle: parsePrismaCaretStyle(createdSettings.caretStyle),
        },
      };
    }
    return {
      userSettings: {
        ...userSettings,
        caretStyle: parsePrismaCaretStyle(userSettings.caretStyle),
      },
    };
  }

  async createUserSettings(input: UserSettingsCreateInput): Promise<UserSettingsResponse> {
    const userSettings = await this.prisma.userSettings.create({
      data: {
        blindMode: input.blindMode,
        noBackspace: input.noBackspace,
        caretStyle: parseModelCaretStyle(input.caretStyle),
        pauseOnError: input.pauseOnError,
        typeSounds: input.typeSounds,
        typeSoundsVolume: input.typeSoundsVolume,
        caretColor: input.caretColor,
        user: { connect: { id: input.userId } },
      },
    });
    if (!userSettings) {
      return { errors: [{ field: 'userSettings', message: 'An error occurred!' }] };
    }
    return {
      userSettings: { ...userSettings, caretStyle: parsePrismaCaretStyle(userSettings.caretStyle) },
    };
  }

  async updateUserSettings(input: UserSettingsUpdateInput): Promise<UserSettingsResponse> {
    const userSettings = await this.prisma.userSettings.update({
      where: {
        userId: input.userId,
      },
      data: {
        caretStyle: parseModelCaretStyle(input.caretStyle),
        blindMode: input.blindMode,
        noBackspace: input.noBackspace,
        pauseOnError: input.pauseOnError,
        typeSounds: input.typeSounds,
        caretColor: input.caretColor,
        typeSoundsVolume: input.typeSoundsVolume,
      },
    });
    if (!userSettings) {
      return { errors: [{ field: 'userSettings', message: 'An error occurred!' }] };
    }
    return {
      userSettings: { ...userSettings, caretStyle: parsePrismaCaretStyle(userSettings.caretStyle) },
    };
  }
}
