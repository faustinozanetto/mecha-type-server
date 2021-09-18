import { calculateAverage } from '../helper-functions';

test('It should return the average of an array of numbers', () => {
  const data: number[] = [10, 5, 45, 8, 6, 45, 25, 150];
  const average = calculateAverage(data);
  expect(average).toBe(36.75);
});
