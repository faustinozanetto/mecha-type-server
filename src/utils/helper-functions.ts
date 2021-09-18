import { Request } from 'express';
import { TestLanguage, TestPreset, TestType } from '../models/test-preset/test-preset.model';

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

/**
 *
 * @param request Request parameter to get cookies from
 * @returns true or false wether session token was found or not.
 */
export const validateAuthCookies = (request: Request): boolean => {
  const cookies: string[] = request.headers.cookie.split('; ');
  const mappedCookies = cookies.map((cookie) => {
    const splittedCookie = cookie.split('=');
    const extractedCookie: { name: string; value: string } = {
      name: splittedCookie[0],
      value: splittedCookie[1],
    };
    return extractedCookie;
  });
  return mappedCookies.find((cookie) => cookie.name === 'session-token') ? true : false;
};
