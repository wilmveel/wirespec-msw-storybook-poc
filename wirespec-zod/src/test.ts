import {wsAst} from "./wirespec";
import {convert} from "./convert";
import {ZodError} from "zod";

const zod = convert(wsAst, "Todo")

try{
    const res =  zod.parse({
        id: "ed7e2475-067f-424b-bcff-2d14d9521ad2",
        name: "ed7e2475-067f-424b-bcff-2d14d9521ad2"
    })
} catch (e:any){
    if(e instanceof ZodError)
        e.errors.forEach(it => {
            console.log(it.message, it.path, it.code)
        })

}

