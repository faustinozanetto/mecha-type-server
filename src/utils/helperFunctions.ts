import { TestLanguage, TestPreset, TestType } from 'models/test-preset/test-preset.model';

/**
 *
 * @param testPreset Test Preset to retrieve data from.
 * @returns The parsed Test Preset.
 */
export const parseTestPreset = (testPreset: TestPreset) => {
  const parsedPreset = {
    ...testPreset,
    type: testPreset.type === 'TIME' ? TestType.TIME : TestType.WORDS,
    language: testPreset.language === 'ENGLISH' ? TestLanguage.ENGLISH : TestLanguage.SPANISH,
  };
  return parsedPreset;
};

/**
 *
 * @param user the user to retrieve data from
 * @returns the average accuracy.
 */
export const calculateAverage = (data: number[]): number => {
  if (data && data.length > 0) {
    const sum = data.reduce((tot, arr) => {
      return tot + arr;
    }, 0);
    return Number.parseFloat((sum / data.length).toFixed(2));
  }
  return 0;
};
