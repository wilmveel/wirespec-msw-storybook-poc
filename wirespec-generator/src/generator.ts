import RandExp from "randexp";
import {cache} from "./cache";
import {rng, Rng} from "./rng";

import {community} from "@flock/wirespec";
import WsType = community.flock.wirespec.compiler.lib.WsType;
import WsRefined = community.flock.wirespec.compiler.lib.WsRefined;
import WsEnum = community.flock.wirespec.compiler.lib.WsEnum;
import WsReference = community.flock.wirespec.compiler.lib.WsReference;
import WsCustom = community.flock.wirespec.compiler.lib.WsCustom;
import WsPrimitive = community.flock.wirespec.compiler.lib.WsPrimitive;
import WsParseResult = community.flock.wirespec.compiler.lib.WsParseResult;
import WsPrimitiveType = community.flock.wirespec.compiler.lib.WsPrimitiveType;

export const generate = (ast: WsParseResult, type: string, isIterator: boolean = false, generator: Rng = rng(), customGeneratorMap: Record<string, (seed: number) => any> ) => {

    const def = ast.result?.find((it: any) => it.name === type)

    if (def == undefined) {
        throw new Error(`Type not found: ${type}`)
    }

    //@ts-ignore
    const name = def.name

    if (isIterator) {
        const length = generator.range(1, 10)
        return Array(length).fill(0).map((_, idx) => {
            return generateObject(generator.nextState(idx.toString()))
        });
    } else {
        return generateObject(generator)
    }


    function generateObject(generator: Rng): any {

        if (customGeneratorMap[name] !== undefined) {
            const gen = customGeneratorMap[name]
            const seed = generator.range(0, 100)
            const data = gen(seed)
            cache.push({name, seed: generator.state, data})
            return data
        }

        if (def instanceof WsType)
            return generateType(def, generator)

        if (def instanceof WsRefined)
            return generateRefined(def, generator)

        if (def instanceof WsEnum)
            return generateEnum(def, generator)

    }

    function generateType(def: WsType, generator: Rng) {
        const data = def.shape.value.reduce((acc: {}, cur) => {
            return {
                ...acc,
                [cur.identifier.value]: generateReference(cur.reference, generator.nextState(cur.identifier.value))
            }
        }, {})
        cache.push({name, seed: generator.state, data})
        return data
    }

    function generateReference(def: WsReference, generator: Rng) {
        if (def instanceof WsPrimitive) {
            if (def.type === WsPrimitiveType.Boolean)
                return randomBoolean(generator)
            else
                return randomRegex(".{1,50}", generator)
        }
        if (def instanceof WsCustom) {
            return generate(ast, def.value, def.isIterable, generator, customGeneratorMap)
        }
    }

    function generateRefined(def: WsRefined, generator: Rng) {
        const regex = def.validator.substring(1).slice(0, -2).replace(/\\\\/, "\\")
        return randomRegex(regex, generator)
    }

    function generateEnum(def: WsEnum, generator: Rng) {
        const seed = generator.range(0, def.entries.length) ?? 0
        return def.entries[seed]
    }


    function randomRegex(regex: string, generator: Rng) {
        const randexp = new RandExp(regex)
        randexp.max = 50
        randexp.randInt = (from, to) => {
            return generator.nextRange(from, to)
        }
        return randexp.gen()
    }

    function randomBoolean(generator: Rng) {
        return !!generator.nextRange(0, 2)
    }

}
