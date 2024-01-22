import { readFileSync } from 'fs';
import assert from 'node:assert/strict';

const lines = readFileSync('src/2023/inputs/3.txt', 'utf8').split('\n');

function sumPartNumbers() {
    let partNumbers = findPartNumbers(lines);
    return partNumbers.reduce((acc, current) => acc + current, 0)
}

function findPartNumbers(lines: string[]) {
    let partNumbers: number[] = [];

    for (let [matchedText, lineIndex, matchIndex, matchLength] of numberMatchesGenerator(lines)) {
        if (!adjacentSymbolGenerator(lines, lineIndex, matchIndex, matchLength).next().done) {
            partNumbers.push(parseInt(matchedText))
        }
    }

    return partNumbers;
}

function* numberMatchesGenerator(lines: string[]): Generator<[string, number, number, number]> {
    for (let [lineIndex, line] of lines.entries()) {
        let numberMatches = [...line.matchAll(/\d+/g)]
        for (let numberMatch of numberMatches) {
            let matchedText = numberMatch[0];
            let matchIndex = numberMatch.index as number;
            let matchLength = matchedText.length;

            yield [matchedText, lineIndex, matchIndex, matchLength]
        }
    }
}

function* adjacentSymbolGenerator(
    lines: string[], lineIndex: number, matchIndex: number,
    matchLength: number
): Generator<[string, number, number]> {
    let minCharIndex = Math.max(matchIndex - 1, 0)
    let maxCharIndex = Math.min(matchIndex + matchLength + 1, lines[0].length - 1);

    for (let searchLineIndex of [lineIndex - 1, lineIndex, lineIndex + 1]) {
        if (searchLineIndex < 0 || searchLineIndex >= lines.length) {
            continue
        }
        let searchStr = lines[searchLineIndex].slice(minCharIndex, maxCharIndex);
        for (let match of searchStr.matchAll(/[^\d.]/g)) {
            assert(match.index !== undefined)

            let matchedText = match[0];
            let columnIndex = minCharIndex + match.index;
            yield [matchedText, searchLineIndex, columnIndex];
        }
    }
}

if (!module?.parent) {
    console.log(sumPartNumbers())
}

module.exports = { findPartNumbers }