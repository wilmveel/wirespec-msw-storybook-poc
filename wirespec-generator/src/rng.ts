
let globalRange = 9999999999

export type Rng = {
    nextState: (str: string) => Rng
    nextInt: () => number
    nextRange: (start: number, end: number) => number

    int: () => number
    range: (start: number, end: number) => number

    clone: () => Rng
    state: number
}
export const rng = (seed: number | string | undefined = undefined): Rng => {

    const m = 0x80000000; // 2**31;
    const a = 1103515245;
    const c = 12345;

    const seedNumber = (typeof seed === "string") ? Math.floor(stringToSeed(seed)) : seed
    let state = seedNumber ? seedNumber  : Math.floor(Math.random() * (m - 1));

    function stringToSeed(str: string) {
        const values = [];
        for (let i = 0, len = str.length; i < len; i++) {
            values.push(str.charCodeAt(i));
        }
        const under = parseInt(values.join(''))
        return Math.floor(under % globalRange)
    }

    const nextState = (str: string) => {
        return rng(state + stringToSeed(str) % globalRange)
    }

    const nextInt = () => {
        state = (a * state + c) % m;
        return state;
    }
    const nextRange = (start: number, end: number) => {
        const rangeSize = end - start;
        const randomUnder = nextInt() / m;
        return start + Math.floor(randomUnder * rangeSize);
    }

    const int = () => {
        return (a * state + c) % m;
    }

    const range = (start: number, end: number) => {
        const rangeSize = end - start;
        const randomUnder = int() / m;
        return start + Math.floor(randomUnder * rangeSize);
    }

    const clone = () => {
        return rng(state)
    }



    return {nextInt, nextRange, nextState, int, range, clone, state}
}
