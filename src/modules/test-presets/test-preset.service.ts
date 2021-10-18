import { Injectable } from '@nestjs/common';
import { TestPresetResponse } from 'models/responses/test-preset/test-preset-response.model';
import {
  Edge,
  TestPresetsResponse,
} from 'models/responses/test-preset/test-presets-response.model';
import { UserResponse } from 'models/responses/user/user-response.model';
import { TestLanguage, TestPreset, TestType } from 'models/test-preset/test-preset.model';
import { AuthProvider, UserBadge } from 'models/user/user.model';
import { PrismaService } from 'nestjs-prisma';
import { CreateTestPresetInput } from 'modules/test-presets/dto/create-test-preset.input';
import { TestPresetsFindInput } from 'modules/test-presets/dto/test-presets-find.input';

@Injectable()
export class TestPresetService {
  constructor(private prisma: PrismaService) {}

  async presetCreator(creatorId: string): Promise<UserResponse> {
    const user = await this.prisma.user.findUnique({ where: { id: creatorId ?? '' } });

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
    const preset = await this.prisma.testPreset.findUnique({
      where: { id: id ?? '' },
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
        punctuated: input.where.punctuated,
        userId: null,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    if (!presets.length) {
      /**
       * this will occur in two (2) scenarios
       *  a) client error, pageInfo was not respected when making request
       *  b) there are no posts matching query
       */
      return {
        count: 0,
        edges: [],
        pageInfo: {
          hasMore: false,
          startCursor: null,
          endCursor: null,
        },
      };
    }

    const hasMore = Boolean(
      await this.prisma.testPreset.count({
        take: 1,
        where: {
          createdAt: { lt: presets[presets.length - 1].createdAt },
        },
      }),
    );

    const edges = presets.map((node) => ({
      cursor: node.createdAt,
      node,
    }));

    const mapped: Edge[] = edges.map((edge) => {
      return {
        cursor: edge.cursor,
        node: {
          ...edge.node,
          type: edge.node.type === 'TIME' ? TestType.TIME : TestType.WORDS,
          language: edge.node.language === 'ENGLISH' ? TestLanguage.ENGLISH : TestLanguage.SPANISH,
        },
      };
    });

    return {
      count: edges.length,
      edges: mapped,
      pageInfo: {
        hasMore,
        startCursor: edges[0].cursor,
        endCursor: edges[edges.length - 1].cursor,
      },
    };
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
    return {
      count: 0,
      edges: [],
      pageInfo: { endCursor: null, startCursor: null, hasMore: false },
    };
  }

  async createTestPreset(data: CreateTestPresetInput): Promise<TestPresetResponse> {
    const preset = await this.prisma.testPreset.create({
      data: {
        type: data.type,
        language: data.language,
        words: data.words,
        time: data.time,
        punctuated: data.punctuated,
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

  async createTestPresetUser(data: CreateTestPresetInput): Promise<TestPresetResponse> {
    const preset = await this.prisma.testPreset.create({
      data: {
        type: data.type,
        language: data.language,
        words: data.words,
        time: data.time,
        punctuated: data.punctuated,
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
