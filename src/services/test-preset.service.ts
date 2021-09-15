import { Injectable } from '@nestjs/common';
import { TestLanguage, TestPreset, TestType } from 'models/test-preset/test-preset.model';
import { CreateTestPresetInput } from 'resolvers/testPreset/dto/create-test-preset.input';
import { TestPresetsFindInput } from 'resolvers/testPreset/dto/test-presets-find.input';
import { PrismaService } from './prisma.service';

@Injectable()
export class TestPresetService {
  constructor(private prisma: PrismaService) {}

  async testPreset(id: string): Promise<TestPreset | null> {
    const preset = await this.prisma.testPreset.findUnique({
      where: { id },
    });
    return {
      ...preset,
      type: preset.type === 'TIME' ? TestType.TIME : TestType.WORDS,
      language: preset.language === 'ENGLISH' ? TestLanguage.ENGLISH : TestLanguage.SPANISH,
    };
  }

  async testPresets(input: TestPresetsFindInput): Promise<TestPreset[] | null> {
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

    return parsedPresets;
  }

  async userTestPresets(userId: string): Promise<TestPreset[] | null> {
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
    return parsedPresets;
  }

  async createTestPreset(data: CreateTestPresetInput): Promise<TestPreset | null> {
    const preset = await this.prisma.testPreset.create({
      data: {
        type: data.type,
        language: data.language,
        words: data.words,
        time: data.time,
        creatorImage: 'https://imgur.com/xuIzYtW',
      },
    });
    const parsedPreset = {
      ...preset,
      type: preset.type === 'TIME' ? TestType.TIME : TestType.WORDS,
      language: preset.language === 'ENGLISH' ? TestLanguage.ENGLISH : TestLanguage.SPANISH,
    };
    return parsedPreset;
  }

  async createTestPresetUser(data: CreateTestPresetInput): Promise<TestPreset | null> {
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
    const parsedPreset = {
      ...preset,
      type: preset.type === 'TIME' ? TestType.TIME : TestType.WORDS,
      language: preset.language === 'ENGLISH' ? TestLanguage.ENGLISH : TestLanguage.SPANISH,
    };
    return parsedPreset;
  }
}
