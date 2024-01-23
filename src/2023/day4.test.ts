const day4 = require('./day4');

// Part 1
test('Get scratchcard points', () => {
    expect(day4.getScratchcardPoints(
        'Card 1: 41 48 83 86 17 | 83 86  6 31 17  9 48 53'
    )).toEqual(8);
    expect(day4.getScratchcardPoints(
        'Card 2: 13 32 20 16 61 | 61 30 68 82 17 32 24 19'
    )).toEqual(2);
    expect(day4.getScratchcardPoints(
        'Card 3:  1 21 53 59 44 | 69 82 63 72 16 21 14  1'
    )).toEqual(2);
    expect(day4.getScratchcardPoints(
        'Card 4: 41 92 73 84 69 | 59 84 76 51 58  5 54 83'
    )).toEqual(1);
    expect(day4.getScratchcardPoints(
        'Card 5: 87 83 26 28 32 | 88 30 70 12 93 22 82 36'
    )).toEqual(0);
    expect(day4.getScratchcardPoints(
        'Card 6: 31 18 13 56 72 | 74 77 10 23 35 67 36 11'
    )).toEqual(0);
})


// Part 2
test('Calculate scratchcard copies', () => {
    expect(day4.calculateScratchcardCopies(`
Card 1: 41 48 83 86 17 | 83 86  6 31 17  9 48 53
Card 2: 13 32 20 16 61 | 61 30 68 82 17 32 24 19
Card 3:  1 21 53 59 44 | 69 82 63 72 16 21 14  1
Card 4: 41 92 73 84 69 | 59 84 76 51 58  5 54 83
Card 5: 87 83 26 28 32 | 88 30 70 12 93 22 82 36
Card 6: 31 18 13 56 72 | 74 77 10 23 35 67 36 11 
    `.trim().split('\n'))).toEqual([1, 2, 4, 8, 14, 1]);
})