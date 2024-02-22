import {community} from "@flock/wirespec";
import {readFileSync} from "node:fs";
import WsMethod = community.flock.wirespec.compiler.lib.WsMethod;
import WsLiteral = community.flock.wirespec.compiler.lib.WsLiteral;
import WsParam = community.flock.wirespec.compiler.lib.WsParam;
import WsSegment = community.flock.wirespec.compiler.lib.WsSegment;

export const parse = community.flock.wirespec.plugin.npm.parse

export const wsFile = String(readFileSync("./spec/meetup.ws"))

export const wsAst = parse(wsFile)

export const wsMethods = {
    GET : WsMethod.valueOf("GET"),
    POST : WsMethod.valueOf("POST"),
    PUT : WsMethod.valueOf("PUT"),
    DELETE : WsMethod.valueOf("DELETE"),
}

export const emitPath = (path: (WsSegment | WsParam)[]): string =>
    "/" + path.map((segment) => {
        if(segment instanceof WsLiteral) return segment.value
        if(segment instanceof WsParam) return `:${segment.identifier.value}`
        else throw new Error("Cannot emit path")
    }).join("/")
