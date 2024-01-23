import { readFileSync } from 'fs';
import assert from 'node:assert/strict';

const lines = readFileSync('src/2023/inputs/4.txt', 'utf8').split('\n');

function sumScratchcardPoints() {
    return lines.reduce((acc, line) => acc + getScratchcardPoints(line), 0)
}

function sumScratchcardCopies() {
    const scratchcardCopies = calculateScratchcardCopies(lines);
    return scratchcardCopies.reduce((acc, copies) => acc + copies, 0)
}

function getScratchcardMatchCount(line: string): number {
    const match = /^Card +\d+: ([\d ]+) \| ([\d ]+)$/.exec(line);
    assert(match)
    const [_, winningStr, haveStr] = match;
    const winningNumbers = winningStr.match(/\d+/g)?.map((v) => parseInt(v));
    const haveNumbers = haveStr.match(/\d+/g)?.map((v) => parseInt(v));

    assert(winningNumbers && haveNumbers)

    // Node does not support Set.intersection or could have used Sets
    // const overlapCount = new Set(winningNumbers).intersection(haveNumbers)

    return haveNumbers.filter((v) => winningNumbers.includes(v)).length
}

function getScratchcardPoints(line: string): number {
    const matchCount = getScratchcardMatchCount(line);
    if (matchCount === 0) {
        return 0;
    }
    return Math.pow(2, matchCount-1)
}

function calculateScratchcardCopies(lines: string[]): number[] {
    // We never actually parse Card ids but the main thing that matters is the
    // sequence, not the index
    const scratchcardMatchesAndCounts = lines.map((l) => ({
        matchCount: getScratchcardMatchCount(l), cardCount: 1}));
    for (let i = 0; i < scratchcardMatchesAndCounts.length; i++) {
        const {matchCount, cardCount} = scratchcardMatchesAndCounts[i];
        for (let j = 0; j < matchCount; j++) {
            const sc = scratchcardMatchesAndCounts[i+j+1];
            if (sc) {
                sc.cardCount += cardCount;
            }
        }
    }
    return scratchcardMatchesAndCounts.map(({cardCount}) => cardCount) 
}

if (!module?.parent) {
    console.log(sumScratchcardPoints())
    console.log(sumScratchcardCopies())
}

module.exports = { getScratchcardPoints: getScratchcardPoints, calculateScratchcardCopies }