const day3 = require('./day3');

// Part 1
test('Find part numbers', () => {
    expect(day3.findPartNumbers(
        `
467..114..
...*......
..35..633.
......#...
617*......
.....+.58.
..592.....
......755.
...$.*....
.664.598..
        `.trim().split('\n')
    )).toEqual([467, 35, 633, 617, 592, 755, 664, 598]);
})


// Part 2
test('Find gear ratios', () => {
    expect(day3.findGearRatios(
        `
467.114..2.
.***.....*.
..35..633*.
        `.trim().split('\n')
    )).toEqual([467 * 35, 467 * 35, 2 * 633]);
})