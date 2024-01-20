import { readFileSync } from 'fs';

const lines = readFileSync('src/2023/inputs/2.txt', 'utf8').split('\n');

function sumAllValidGameIds() {
    return lines.reduce(
        function (accumulator, line) { 
            let [gameId, isValid] = extractGameIdAndValidity(line);
            return accumulator + (isValid ? gameId : 0);
        },
        0
    )
}

const maxAllowedCubes: {[index: string]:number} = {red: 12, green: 13, blue: 14}

function extractGameIdAndValidity(line: string): [number, boolean] {
    let [gameIdStr, setsStr] = line.split(': ');
    let gameId = parseInt(gameIdStr.split(' ')[1]);

    for (let setStr of setsStr.split('; ')) {
        for (let cubesStr of setStr.split(', ')) {
            let [numberStr, colour] = cubesStr.split(' ');
            let number = parseInt(numberStr);
            if (number > maxAllowedCubes[colour]) {
                return [gameId, false]
            }
        }
    }

    return [gameId, true]
}

if (!module?.parent) {
    console.log(sumAllValidGameIds())
}

module.exports = { extractGameIdAndValidity }