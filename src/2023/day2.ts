import { readFileSync } from 'fs';

const lines = readFileSync('src/2023/inputs/2.txt', 'utf8').split('\n');

type Set = {
    red?: number,
    green?: number,
    blue?: number
}

function sumAllValidGameIds() {
    return lines.reduce(
        function (accumulator, line) { 
            let [gameId, isValid] = extractGameIdAndValidity(line);
            return accumulator + (isValid ? gameId : 0);
        },
        0
    )
}

function sumAllGamePowers () {
    return lines.reduce(
        (accumulator, line) =>
            accumulator + extractGamePower(line),
        0
    )
}

const maxAllowedCubes = {red: 12, green: 13, blue: 14}

function parseGame(line: string) {
    let [gameIdStr, setsStr] = line.split(': ');
    let gameId = parseInt(gameIdStr.split(' ')[1]);
    let sets = [];

    for (let setStr of setsStr.split('; ')) {
        let set: Set = {};
        for (let cubesStr of setStr.split(', ')) {
            let [countStr, colour] = cubesStr.split(' ') as [string, keyof Set];
            let count = parseInt(countStr);
            set[colour] = count;
        }
        sets.push(set);
    }

    return {id: gameId, sets}
}

function extractGameIdAndValidity(line: string): [number, boolean] {
    let game = parseGame(line);

    for (let set of game.sets) {
        for (let [colour, count] of Object.entries(set) as [keyof Set, number][]) {
            if (count > maxAllowedCubes[colour]) {
                return [game.id, false]
            }
        }
    }

    return [game.id, true]
}

function extractGamePower(line: string): number {
    let game = parseGame(line);
    let minimumCubes: Set = {};

    for (let set of game.sets) {
        for (let [colour, count] of Object.entries(set) as [keyof Set, number][]) {
            if (count > (minimumCubes[colour] || 0)) {
                minimumCubes[colour] = count;
            }
        }
    }

    let counts = Object.values(minimumCubes)
    // For games which don't specify all colours, product should be zero
    if (counts.length < 3) {
        return 0;
    }
    return counts.reduce((product, count) => product * count, 1)
}

if (!module?.parent) {
    console.log(sumAllValidGameIds())
    console.log(sumAllGamePowers())
}

module.exports = { extractGameIdAndValidity, extractGamePower }