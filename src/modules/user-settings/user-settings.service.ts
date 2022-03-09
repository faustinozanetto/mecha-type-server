import { Injectable } from '@nestjs/common';
import { UserSettingsResponse } from 'models/responses/user-settings/user-settings.response';
import { CaretStyle, UserSettings } from 'models/user-settings/user-settings.model';
import { PrismaService } from 'nestjs-prisma';
import { parseModelCaretStyle, parsePrismaCaretStyle } from 'utils/helper-functions';
import { UserSettingsCreateInput } from './dto/user-settings-create.input';
import { UserSettingsUpdateInput } from './dto/user-settings-update.input';
import { UserSettingsWhereInput } from './dto/user-settings-where.input';

@Injectable()
export class UserSettingsService {
  constructor(private prisma: PrismaService) {}

  async userSettings(input: UserSettingsWhereInput): Promise<UserSettingsResponse> {
    const emptySettings: UserSettings = {
      id: '',
      blindMode: false,
      noBackspace: false,
      pauseOnError: false,
      typeSounds: false,
      caretStyle: CaretStyle.LINE,
      caretColor: '#ffb300',
      typeSoundsVolume: 0.0,
    };
    // If no input is given, return the default settings
    if (input.userId === '') return { userSettings: emptySettings };
    // If valid input try to find it.
    const userSettings = await this.prisma.userSettings.findMany({
      where: {
        user: { username: input.username },
      },
    });
    // Not settings found, we create one.
    if (userSettings.length === 0) {
      const createdSettings = await this.prisma.userSettings.create({
        data: {
          user: { connect: { username: input.username } },
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
        ...userSettings[0],
        caretStyle: parsePrismaCaretStyle(userSettings[0].caretStyle),
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
