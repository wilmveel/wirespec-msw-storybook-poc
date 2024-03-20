import {rest} from "msw";
import {community} from "@flock/wirespec";
import {generate, rng} from "wirespec-generator";
import parse = community.flock.wirespec.plugin.npm.parse;
import WsEndpoint = community.flock.wirespec.compiler.lib.WsEndpoint;
import WsSegment = community.flock.wirespec.compiler.lib.WsSegment;
import WsLiteral = community.flock.wirespec.compiler.lib.WsLiteral;
import WsParam = community.flock.wirespec.compiler.lib.WsParam;
import WsCustom = community.flock.wirespec.compiler.lib.WsCustom;
import WsMethod = community.flock.wirespec.compiler.lib.WsMethod;

type Config = {
    input: string,
    seed: string,
    customGeneratorMap: Record<string, (seed: number) => any>,
}

export const wirespecGenerator = async (config: Config) => {
    const res = await fetch(config.input)
    const ws = await res.text()
    const ast = parse(ws)
    return ast.result
        ?.filter((it): it is WsEndpoint => it instanceof WsEndpoint)
        ?.map((endpoint) => {
            const handler = emitMethod(endpoint)
                console.log("Path:", emitPath(endpoint))
            return handler(emitPath(endpoint), (req, res, ctx) => {
                const request = endpoint.requests.find(it => it?.content?.type === "application/json")
                console.log("endpoint", endpoint)
                console.log("request", request?.content?.reference)
                const reference = endpoint.responses
                    .find(it => it.status === "200")
                    ?.content
                    ?.reference
                if (reference != undefined && reference instanceof WsCustom) {
                    const generator = rng(endpoint.method + req.url.toJSON() + config.seed ?? "")
                    return res(
                        ctx.json(generate(ast, reference.value, reference.isIterable, generator, config.customGeneratorMap))
                    )
                }
            })
        })
}

const emitPath = (endpoint: WsEndpoint): string =>
    "/" + endpoint.path.map((segment: WsSegment) => {
        if (segment instanceof WsLiteral) return segment.value
        if (segment instanceof WsParam) return `:${segment.identifier.value}`
        else throw new Error("Cannot emit path")
    }).join("/")

const emitMethod = (endpoint: WsEndpoint) => {
    switch (endpoint.method){
        case WsMethod.GET: return rest.get
        case WsMethod.POST: return rest.post
        case WsMethod.PUT: return rest.put
        case WsMethod.DELETE: return rest.delete
        default: throw new Error("Cannot map method")
    }
}


