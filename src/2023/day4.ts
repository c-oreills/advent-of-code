import { readFileSync } from 'fs';
import assert from 'node:assert/strict';

const lines = readFileSync('src/2023/inputs/4.txt', 'utf8').split('\n');

function sumScratchcardPoints() {
    return lines.reduce((acc, line) => acc + getScratchcardPoints(line), 0)
}

function getScratchcardPoints(line: string): number {
    const match = /^Card +\d+: ([\d ]+) \| ([\d ]+)$/.exec(line);
    assert(match)
    const [_, winningStr, haveStr] = match;
    const winningNumbers = winningStr.match(/\d+/g)?.map((v) => parseInt(v));
    const haveNumbers = haveStr.match(/\d+/g)?.map((v) => parseInt(v));

    assert(winningNumbers && haveNumbers)

    // Node does not support Set.intersection or could have used Sets
    // const overlapCount = new Set(winningNumbers).intersection(haveNumbers)

    const overlapCount = haveNumbers.filter((v) => winningNumbers.includes(v)).length

    if (overlapCount === 0) {
        return 0;
    }
    return Math.pow(2, overlapCount-1)
}

if (!module?.parent) {
    console.log(sumScratchcardPoints())
}

module.exports = { getScratchcardPoints }