import { readFileSync } from 'fs';
import assert from 'node:assert/strict';

const lines = readFileSync('src/2023/inputs/3.txt', 'utf8').split('\n');

function sumPartNumbers() {
    const partNumbers = findPartNumbers(lines);
    return partNumbers.reduce((acc, current) => acc + current, 0)
}

function findPartNumbers(lines: string[]) {
    const partNumbers: number[] = [];

    for (const [matchedText, lineIndex, matchIndex, matchLength] of numberMatchesGenerator(lines)) {
        if (!adjacentSymbolGenerator(lines, lineIndex, matchIndex, matchLength).next().done) {
            partNumbers.push(parseInt(matchedText))
        }
    }

    return partNumbers;
}

function* numberMatchesGenerator(lines: string[]): Generator<[string, number, number, number]> {
    for (const [lineIndex, line] of lines.entries()) {
        const numberMatches = [...line.matchAll(/\d+/g)]
        for (const numberMatch of numberMatches) {
            const matchedText = numberMatch[0];
            const matchIndex = numberMatch.index as number;
            const matchLength = matchedText.length;

            yield [matchedText, lineIndex, matchIndex, matchLength]
        }
    }
}

function* adjacentSymbolGenerator(
    lines: string[], lineIndex: number, matchIndex: number,
    matchLength: number
): Generator<[string, number, number]> {
    const minCharIndex = Math.max(matchIndex - 1, 0)
    const maxCharIndex = Math.min(matchIndex + matchLength + 1, lines[0].length - 1);

    for (const searchLineIndex of [lineIndex - 1, lineIndex, lineIndex + 1]) {
        if (searchLineIndex < 0 || searchLineIndex >= lines.length) {
            continue
        }
        const searchStr = lines[searchLineIndex].slice(minCharIndex, maxCharIndex);
        for (const match of searchStr.matchAll(/[^\d.]/g)) {
            assert(match.index !== undefined)

            const matchedText = match[0];
            const columnIndex = minCharIndex + match.index;
            yield [matchedText, searchLineIndex, columnIndex];
        }
    }
}

if (!module?.parent) {
    console.log(sumPartNumbers())
}

module.exports = { findPartNumbers }