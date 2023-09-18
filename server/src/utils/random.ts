import random_gen from "random-seed";


// в сумме числа значения должны давать 100
export function sample(random: random_gen.RandomSeed, dictionary: { [x: string]: number }) {
    if (Object.values(dictionary).reduce((acc, value) => acc + value) != 100)
        throw Error('Сумма значений не равна 100')
    const random_number = random.intBetween(1, 100);
    let index = 0;
    for (const [key, value] of Object.entries(dictionary)) {
        index += value;

        if (random_number <= index) {
            return key;
        }
    }

}