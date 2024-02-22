import {app} from "./server";
import {json} from "express";

const port = 3000

const call = async () => {
    app.listen(port, () => {
        console.log(`Example app listening on port ${port}`)
    })
    const listRes = await fetch(`http://localhost:${port}/persons`)
    const list = await listRes.json()
    console.log(JSON.stringify(list, null, 2))

    const objRes = await fetch(`http://localhost:${port}/persons/${list[0].id}`)
    const obj = await objRes.json()
    console.log(JSON.stringify(obj, null, 2))
}

call()