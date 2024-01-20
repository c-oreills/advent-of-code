const day2 = require('./day2');

// Part 1
test('Valid game', () => {
    expect(day2.extractGameIdAndValidity('Game 1: 3 blue, 4 red; 1 red, 2 green, 6 blue; 2 green')).toEqual([1, true]);
})
test('Invalid game', () => {
    expect(day2.extractGameIdAndValidity('Game 3: 8 green, 6 blue, 20 red; 5 blue, 4 red, 13 green; 5 green, 1 red')).toEqual([3, false]);
})