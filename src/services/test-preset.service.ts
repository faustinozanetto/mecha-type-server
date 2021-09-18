import { Injectable } from '@nestjs/common';
import { Request } from 'express';
import { TestPresetResponse } from 'models/responses/test-preset/test-preset-response.model';
import { TestPresetsResponse } from 'models/responses/test-preset/test-presets-response.model';
import { UserResponse } from 'models/responses/user/user-response.model';
import { TestLanguage, TestPreset, TestType } from 'models/test-preset/test-preset.model';
import { UserBadge } from 'models/user/user.model';
import { CreateTestPresetInput } from 'resolvers/testPreset/dto/create-test-preset.input';
import { TestPresetsFindInput } from 'resolvers/testPreset/dto/test-presets-find.input';
import { validateAuthCookies } from 'utils/helper-functions';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TestPresetService {
  constructor(private prisma: PrismaService) {}

  async presetCreator(creatorId: string): Promise<UserResponse> {
    const user = await this.prisma.user.findUnique({ where: { id: creatorId } });
    return {
      user: {
        ...user,
        badge:
          user.badge === 'DEFAULT'
            ? UserBadge.DEFAULT
            : user.badge === 'PRO'
            ? UserBadge.PRO
            : UserBadge.TESTER,
      },
    };
  }

  async testPreset(id: string): Promise<TestPresetResponse> {
    const preset = await this.prisma.testPreset.findUnique({
      where: { id },
    });
    return {
      testPreset: {
        ...preset,
        type: preset.type === 'TIME' ? TestType.TIME : TestType.WORDS,
        language: preset.language === 'ENGLISH' ? TestLanguage.ENGLISH : TestLanguage.SPANISH,
      },
    };
  }

  async testPresets(input: TestPresetsFindInput): Promise<TestPresetsResponse> {
    const presets = await this.prisma.testPreset.findMany({
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
    const presets = await this.prisma.testPreset.findMany({
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
    const preset = await this.prisma.testPreset.create({
      data: {
        type: data.type,
        language: data.language,
        words: data.words,
        time: data.time,
        creatorImage: 'https://i.imgur.com/xuIzYtW.png',
      },
    });
    const parsedPreset = {
      ...preset,
      type: preset.type === 'TIME' ? TestType.TIME : TestType.WORDS,
      language: preset.language === 'ENGLISH' ? TestLanguage.ENGLISH : TestLanguage.SPANISH,
    };
    return { testPreset: parsedPreset };
  }

  async createTestPresetUser(
    data: CreateTestPresetInput,
    request: Request,
  ): Promise<TestPresetResponse> {
    // Validating wether user is logged in or not.
    const validAuthCookie = validateAuthCookies(request);
    if (!validAuthCookie) {
      return {
        errors: [
          {
            field: 'auth',
            message: 'not authorized',
          },
        ],
      };
    }
    const preset = await this.prisma.testPreset.create({
      data: {
        type: data.type,
        language: data.language,
        words: data.words,
        time: data.time,
        creatorImage: data.creatorImage,
        user: {
          connect: {
            id: data.userId,
          },
        },
      },
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
