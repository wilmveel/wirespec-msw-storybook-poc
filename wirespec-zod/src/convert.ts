import {z} from "zod";
import {community} from "@flock/wirespec";
import WsType = community.flock.wirespec.compiler.lib.WsType;
import WsReference = community.flock.wirespec.compiler.lib.WsReference;
import WsPrimitive = community.flock.wirespec.compiler.lib.WsPrimitive;
import WsPrimitiveType = community.flock.wirespec.compiler.lib.WsPrimitiveType;
import WsCustom = community.flock.wirespec.compiler.lib.WsCustom;
import WsParseResult = community.flock.wirespec.compiler.lib.WsParseResult;
import WsRefined = community.flock.wirespec.compiler.lib.WsRefined;

export const convert = (ast:WsParseResult, type: string) => {

    const def = ast.result?.find(it => it.name === type)

    if (def == undefined) {
        throw new Error(`Type not found: ${type}`)
    }

    if(def instanceof WsRefined) {
        const validator = def.validator.substring(1).slice(0, -2).replace(/\\\\/, "\\")
        return z.string().regex(RegExp(validator))
    }

    if(def instanceof WsType) {
        const obj = def.shape.value.reduce((acc, cur) => {
            return Object.assign(Object.assign({}, acc), {[cur.identifier.value]: convertReference(cur.reference)});
        }, {});

        return z.object(obj)
    }

    return z.object({})

    function convertReference(def: WsReference):any {
        if (def instanceof WsPrimitive) {
            switch (def.type){
                case WsPrimitiveType.Boolean: return z.boolean()
                case WsPrimitiveType.Number: return z.number()
                case WsPrimitiveType.Integer: return z.number()
                case WsPrimitiveType.String: return z.string()
            }
        }
        if (def instanceof WsCustom) {
            return convert(ast, def.value)
        }
    }
}
