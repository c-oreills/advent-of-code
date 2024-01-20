import { AssertionError } from 'node:assert';

const day1 = require('./day1');

test('extract calibration values with multiple numbers', () => {
    expect(day1.extractCalibrationValueFromLine('a1b2c3d')).toBe(13);
})
test('extract calibration values with a single number', () => {
    expect(day1.extractCalibrationValueFromLine('a1b')).toBe(11);
})
test('error on lines without numbers', () => {
    expect(() => day1.extractCalibrationValueFromLine('ab')).toThrow(AssertionError);
})

test('extract calibration values with multiple numbers (iterable)', () => {
    expect(day1.extractCalibrationValueFromLineIterable('a1b2c3d')).toBe(13);
})
test('extract calibration values with a single number (iterable)', () => {
    expect(day1.extractCalibrationValueFromLineIterable('a1b')).toBe(11);
})
test('error on lines without numbers (iterable)', () => {
    expect(() => day1.extractCalibrationValueFromLineIterable('ab')).toThrow(AssertionError);
})