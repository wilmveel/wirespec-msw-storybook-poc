import {wsAst, wsLib} from "./wirespec";

import RandExp from "randexp";
import {customGeneratorMap} from "./context";
import {cache} from "./cache";
import {rng, Rng} from "./rng";

export const generate = (type: string, isIterator: boolean = false, path: string = "", randomGenerator: Rng = rng()) => {


    const def = wsAst.parsed.find((it: any) => it.name === type)

    if (!def) {
        throw new Error(`Type not found: ${type}`)
    }

    const name = def.name as string

    if (isIterator) {
        const length = randomGenerator.range(1, 10)
        return Array(length).fill(0).map((_, idx) => {
            return generateObject(`${idx}`)
        });
    } else {
        return generateObject(path)
    }


    function generateObject(path: string): any {

        if (customGeneratorMap[name] !== undefined) {
            const gen = customGeneratorMap[name]
            const generator = pathGenerator(path)
            const seed = generator.range(0, 100)
            const data = gen(seed)
            cache.push({name, seed: generator.state, data})
            return data
        }

        switch (def.constructor) {
            case wsLib.WsType:
                return generateType(def, path)
            case wsLib.WsRefined:
                return generateRefined(def, path)
            case wsLib.WsEnum:
                return generateEnum(def, path)
        }
    }

    function generateType(def: typeof wsLib.WsType, path: string) {
        const data = def.shape.value.reduce((acc: {}, cur: typeof wsLib.WsShape) => {
            return {
                ...acc,
                [cur.identifier.value]: generateReference(cur.reference, `${cur.identifier.value}`)
            }
        }, {})
        cache.push({name, seed: randomGenerator.state, data})
        return data
    }

    function generateReference(def: typeof wsLib.WsReference, path: string) {
        switch (def.constructor) {
            case wsLib.WsPrimitive:
                return randomRegex(".{1,50}", path)
            case wsLib.WsCustom:
                return generate(def.value, def.u24_1, path, pathGenerator(path))
        }
    }

    function generateRefined(def: typeof wsLib.WsRefined, path: string) {
        const regex = def.validator.substring(1).slice(0, -2).replaceAll("\\\\", "\\")
        return randomRegex(regex, path)
    }

    function generateEnum(def: typeof wsLib.WsEnum, path: string) {
        const generator = pathGenerator(path)
        const seed = generator.range(0, def.entries.length) ?? 0
        return def.entries[seed]
    }


    function randomRegex(regex: string, path: string) {
        const randexp = new RandExp(regex)
        const generator = pathGenerator(path)
        randexp.max = 50
        randexp.randInt = (from, to) => {
            return generator.nextRange(from, to)
        }
        return randexp.gen()
    }

    function pathGenerator(path: string) {

        if(path !== "") {
            const generator = randomGenerator.nextState(path)
            console.log(path, randomGenerator.state, generator.state)
            return generator
        } else {
            return randomGenerator
        }

    }

}
