import { Injectable } from '@nestjs/common';
import { TestPresetEntity } from 'entities/test-preset.entity';
import { UserEntity } from 'entities/user.entity';
import { TestPresetResponse } from 'models/responses/test-preset/test-preset-response.model';
import { TestPresetsResponse } from 'models/responses/test-preset/test-presets-response.model';
import { UserResponse } from 'models/responses/user/user-response.model';
import { TestLanguage, TestPreset, TestType } from 'models/test-preset/test-preset.model';
import { AuthProvider, UserBadge } from 'models/user/user.model';
import { CreateTestPresetInput } from 'test-presets/dto/create-test-preset.input';
import { TestPresetsFindInput } from 'test-presets/dto/test-presets-find.input';
import { Connection } from 'typeorm';

@Injectable()
export class TestPresetService {
  constructor(private connection: Connection) {}

  async presetCreator(creatorId: string): Promise<UserResponse> {
    const user = await this.connection.getRepository(UserEntity).findOne({
      where: { id: creatorId },
    });

    return {
      user: {
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
      },
    };
  }

  async testPreset(id: string): Promise<TestPresetResponse> {
    const preset = await this.connection.getRepository(TestPresetEntity).findOne({ where: { id } });
    return {
      testPreset: {
        ...preset,
        type: preset.type === 'TIME' ? TestType.TIME : TestType.WORDS,
        language: preset.language === 'ENGLISH' ? TestLanguage.ENGLISH : TestLanguage.SPANISH,
      },
    };
  }

  async testPresets(input: TestPresetsFindInput): Promise<TestPresetsResponse> {
    const presets = await this.connection.getRepository(TestPresetEntity).find({
      take: input.take,
      skip: input.skip,
      where: {
        id: input.where.id,
        language: input.where.language,
        type: input.where.type,
        words: input.where.words,
        time: input.where.time,
        userId: input.where.userId,
      },
    });

    const parsedPresets: TestPreset[] = presets.map((preset) => {
      return {
        ...preset,
        type: preset.type === 'TIME' ? TestType.TIME : TestType.WORDS,
        language: preset.language === 'ENGLISH' ? TestLanguage.ENGLISH : TestLanguage.SPANISH,
      };
    });

    return { testPresets: parsedPresets };
  }

  async userTestPresets(userId: string): Promise<TestPresetsResponse> {
    const presets = await this.connection.getRepository(TestPresetEntity).find({
      where: { userId },
    });
    const parsedPresets: TestPreset[] = [];
    presets.map((preset) => {
      // Converting the preset to a valid one.
      const parsedPreset = {
        ...preset,
        type: preset.type === 'TIME' ? TestType.TIME : TestType.WORDS,
        language: preset.language === 'ENGLISH' ? TestLanguage.ENGLISH : TestLanguage.SPANISH,
      };
      parsedPresets.push(parsedPreset);
    });
    return { testPresets: parsedPresets };
  }

  async createTestPreset(data: CreateTestPresetInput): Promise<TestPresetResponse> {
    const preset = await this.connection.getRepository(TestPresetEntity).create({
      type: data.type,
      language: data.language,
      words: data.words,
      time: data.time,
    });

    const parsedPreset = {
      ...preset,
      type: preset.type === 'TIME' ? TestType.TIME : TestType.WORDS,
      language: preset.language === 'ENGLISH' ? TestLanguage.ENGLISH : TestLanguage.SPANISH,
    };
    return { testPreset: parsedPreset };
  }

  async createTestPresetUser(data: CreateTestPresetInput): Promise<TestPresetResponse> {
    const user = await this.connection.getRepository(UserEntity).findOne({
      where: { id: data.userId },
    });
    const preset = await this.connection.getRepository(TestPresetEntity).create({
      type: data.type,
      language: data.language,
      words: data.words,
      time: data.time,
      user,
    });
    if (!preset) {
      return {
        errors: [
          {
            field: 'preset',
            message: 'An error occurred while creating preset.',
          },
        ],
      };
    }
    const parsedPreset = {
      ...preset,
      type: preset.type === 'TIME' ? TestType.TIME : TestType.WORDS,
      language: preset.language === 'ENGLISH' ? TestLanguage.ENGLISH : TestLanguage.SPANISH,
    };
    return { testPreset: parsedPreset };
  }
}
