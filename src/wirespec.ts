// @ts-ignore
import wsImport from "@flock/wirespec/wirespec-src-compiler-lib";
import {readFileSync} from "node:fs";

export const wsLib = wsImport.community.flock.wirespec.compiler.lib
export const wsFile = String(readFileSync("./spec/meetup.ws"))
export const wsCompiler = new wsLib.Compiler()
export const wsAst = wsCompiler.parse(wsFile)

export const wsMethods = {
    GET : wsLib.WsMethod.valueOf("GET"),
    POST : wsLib.WsMethod.valueOf("POST"),
    PUT : wsLib.WsMethod.valueOf("PUT"),
    DELETE : wsLib.WsMethod.valueOf("DELETE"),
}

type Path = (typeof wsLib.WsLiteral | typeof wsLib.WsParam)[]
export const emitPath = (path: Path): string =>
    "/" + path.map((segment) => {
        if(segment instanceof wsLib.WsLiteral) return segment.value
        if(segment instanceof wsLib.WsParam) return `:${segment.identifier.value}`
        else throw new Error("Cannot emit path")
    }).join("/")
