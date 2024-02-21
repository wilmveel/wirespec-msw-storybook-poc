import {app} from "./server";
import {json} from "express";

const port = 3000

const call = async () => {
    app.listen(port, () => {
        console.log(`Example app listening on port ${port}`)
    })
    const list = await fetch(`http://localhost:${port}/persons/`)
    const body = await list.json()
    console.log(JSON.stringify(body, null, 2))
}

call()