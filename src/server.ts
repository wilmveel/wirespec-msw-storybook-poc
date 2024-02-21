import {emitPath, wsAst, wsCompiler, wsFile, wsLib, wsMethods} from "./wirespec";
import express, {Handler, Request, Response, Router} from "express";
import {generate} from "./generator";
import {rng} from "./rng";
import {storage} from "./context";

const handler = (router: Router, endpoint: typeof wsLib.WsEndpoint) => {
    const route = (method: typeof wsLib.WsMethod, path: string, handler: Handler) => {
        switch (method) {
            case wsMethods.GET:
                return router.get(path, handler)
            case wsMethods.POST:
                return router.post(path, handler)
            case wsMethods.PUT:
                return router.put(path, handler)
            case wsMethods.DELETE:
                return router.delete(path, handler)
            default:
                throw new Error(`Cannot map method: ${method}`)
        }
    }

    route(endpoint.method, emitPath(endpoint.path), (req: Request, res: Response) => {
        storage.enterWith(rng(endpoint.method + emitPath(endpoint.path)))
        const wsResponse = endpoint.responses.find((it:any) =>  it.status === "200")
        const wsReference = wsResponse.content.reference
        res.status(wsResponse.status);
        res.send(generate(wsReference.value, wsReference.u24_1))
    })

    return router
}

export const app = express()

app.use(
    wsAst.parsed
        .filter((it: any) => it instanceof wsLib.WsEndpoint)
        .reduce(handler, express.Router())
)





