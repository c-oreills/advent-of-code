import { readFileSync } from 'fs';
import assert from 'node:assert/strict';

const lines = readFileSync('src/2023/inputs/1.txt', 'utf8').split('\n');

function sumAllCalibrationValues() {
    return lines.reduce((accumulator, currentValue) =>
        accumulator + extractCalibrationValueFromLine(currentValue),
        0
    )
}

function extractCalibrationValueFromLine(line: string) {
    let numberMatches = [...line.matchAll(/\d/g)];
    assert(numberMatches.length, 'No numbers in line');

    let firstMatch = numberMatches[0];
    let lastMatch = numberMatches[numberMatches.length-1];

    let valueStr = firstMatch[0] + lastMatch[0];
    let value = parseInt(valueStr);
    return value;
}

function extractCalibrationValueFromLineIterable(line: string) {
    let numberMatches = line.matchAll(/\d/g);
    let firstMatch, lastMatch;

    firstMatch = lastMatch = numberMatches.next().value;
    assert(typeof firstMatch !== 'undefined', 'No numbers in line');
    for (let match of numberMatches) {
        lastMatch = match;
    }

    let valueStr = firstMatch[0] + lastMatch[0];
    let value = parseInt(valueStr);
    return value;
}

if (!module?.parent) {
    console.log(sumAllCalibrationValues())
}

module.exports = { extractCalibrationValueFromLine, extractCalibrationValueFromLineIterable }