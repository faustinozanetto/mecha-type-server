import { TestPreset as PrismaTestPreset } from '@prisma/client';
import {
  TestContent,
  TestLanguage,
  TestPreset,
  TestType,
} from 'models/test-preset/test-preset.model';

/**
 *
 * @param preset Test Preset from Prisma to retrieve data from.
 * @returns the parsed preset using the type from the modal.
 */
export const parsePrismaTestPreset = (preset: PrismaTestPreset): TestPreset => {
  return {
    ...preset,
    content: preset.content === 'RANDOM' ? TestContent.RANDOM : TestContent.QUOTE,
    type: preset.type === 'TIME' ? TestType.TIME : TestType.WORDS,
    language: preset.language === 'ENGLISH' ? TestLanguage.ENGLISH : TestLanguage.SPANISH,
  };
};
