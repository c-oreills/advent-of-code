import { readFileSync } from 'fs';
import assert from 'node:assert/strict';

const lines = readFileSync('src/2023/inputs/1.txt', 'utf8').split('\n');

function sumAllCalibrationValues() {
    return lines.reduce((accumulator, currentValue) =>
        accumulator + extractCalibrationValueFromLine(currentValue),
        0
    )
}


const numberWordsToInts: {[index: string]:number} = { one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9 }

// Use lookahead and matching groups as per https://stackoverflow.com/questions/20833295/how-can-i-match-overlapping-strings-with-regex/33903830#33903830
const matchRegex = /(?=(one|two|three|four|five|six|seven|eight|nine|1|2|3|4|5|6|7|8|9))/g

function convertMatchToNumber(matchArray: RegExpMatchArray) {
    // the first element of the match array will be an empty string due to the
    // lookahead, need to use the second element to get the matched text via the
    // matching groups
    let matchedText = matchArray[1];
    return numberWordsToInts[matchedText] ?? parseInt(matchedText);
}

function extractCalibrationValueFromLine(line: string) {
    let numberMatches = [...line.matchAll(matchRegex)];
    assert(numberMatches.length, 'No numbers in line');

    let firstMatch = numberMatches[0];
    let lastMatch = numberMatches[numberMatches.length-1];

    let valueStr = `${convertMatchToNumber(firstMatch)}${convertMatchToNumber(lastMatch)}`;
    let value = parseInt(valueStr)
    return value;
}

function extractCalibrationValueFromLineIterable(line: string) {
    let numberMatches = line.matchAll(matchRegex);
    let firstMatch, lastMatch;

    firstMatch = lastMatch = numberMatches.next().value;
    assert(typeof firstMatch !== 'undefined', 'No numbers in line');
    for (let match of numberMatches) {
        lastMatch = match;
    }

    let valueStr = `${convertMatchToNumber(firstMatch)}${convertMatchToNumber(lastMatch)}`;
    let value = parseInt(valueStr)
    return value;
}

if (!module?.parent) {
    console.log(sumAllCalibrationValues())
}

module.exports = { extractCalibrationValueFromLine, extractCalibrationValueFromLineIterable }