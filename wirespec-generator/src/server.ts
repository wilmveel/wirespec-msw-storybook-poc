import {emitPath, wsAst} from "./wirespec";
import express, {Handler, Request, Response, Router} from "express";
import {generate} from "./generator";
import {rng} from "./rng";
import {CacheItem, findFromCache} from "./cache";
import {community} from "@flock/wirespec";
import WsMethod = community.flock.wirespec.compiler.lib.WsMethod;
import WsEndpoint = community.flock.wirespec.compiler.lib.WsEndpoint;
import WsCustom = community.flock.wirespec.compiler.lib.WsCustom;

const handler = (router: Router, endpoint: WsEndpoint) => {
    const route = (method: WsMethod, path: string, handler: Handler) => {
        switch (method) {
            case WsMethod.GET:
                return router.get(path, handler)
            case WsMethod.POST:
                return router.post(path, handler)
            case WsMethod.PUT:
                return router.put(path, handler)
            case WsMethod.DELETE:
                return router.delete(path, handler)
            default:
                throw new Error(`Cannot map method: ${method}`)
        }
    }

    const path = emitPath(endpoint)

    route(endpoint.method, path, (req: Request, res: Response) => {
        const generator = rng(endpoint.method + req.originalUrl + "random")
        const wsResponse = endpoint.responses.find(it => it.status === "200")
        const wsReference = wsResponse?.content?.reference

        if (wsResponse != undefined && wsReference != undefined && wsReference instanceof WsCustom) {
            const cache = Object.entries(req.params).reduce<CacheItem[]>((acc, [key, value]) => {
                const res = findFromCache(value)
                if (res) {
                    return [...acc, res]
                } else {
                    return acc
                }
            }, [])

            const cachedGenerator = cache[0] ? rng(cache[0].seed) : generator

            res.status(parseInt(wsResponse.status));
            res.send(generate(wsReference.value, wsReference.isIterable, cachedGenerator))
        }
    })

    return router
}

export const app = express()


export const router = wsAst.result
        // @ts-ignore
        ?.filter((it): it is WsEndpoint => it instanceof WsEndpoint)
        ?.reduce(handler, express.Router())
    ?? express.Router()

app.use(router)





