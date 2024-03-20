import {community} from "@flock/wirespec";
import {readFileSync} from "node:fs";
import {resolve} from "node:path";
import WsMethod = community.flock.wirespec.compiler.lib.WsMethod;
import WsLiteral = community.flock.wirespec.compiler.lib.WsLiteral;
import WsParam = community.flock.wirespec.compiler.lib.WsParam;
import WsEndpoint = community.flock.wirespec.compiler.lib.WsEndpoint;
import WsSegment = community.flock.wirespec.compiler.lib.WsSegment;

export const parse = community.flock.wirespec.plugin.npm.parse


export const wsFile = String(readFileSync(resolve(__dirname, "../../spec/todo.ws")))

export const wsAst = parse(wsFile)

export const wsMethods = {
    GET: WsMethod.valueOf("GET"),
    POST: WsMethod.valueOf("POST"),
    PUT: WsMethod.valueOf("PUT"),
    DELETE: WsMethod.valueOf("DELETE"),
}

export const emitPath = (endpoint: WsEndpoint): string =>
    "/" + endpoint.path.map((segment: WsSegment) => {
        if (segment instanceof WsLiteral) return segment.value
        if (segment instanceof WsParam) return `:${segment.identifier.value}`
        else throw new Error("Cannot emit path")
    }).join("/")
