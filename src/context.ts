import {AsyncLocalStorage} from "async_hooks";
import {Rng} from "./rng";
import {seededFaker} from "./utils";

export const customGeneratorMap: Record<string, (seed: number) => any> = {
    "Street": (seed: number) => seededFaker(seed).location.street(),
    "PostalCode": (seed: number) => seededFaker(seed).location.zipCode(),
    "Country": (seed: number) => seededFaker(seed).location.country(),
    "Email": (seed: number) => seededFaker(seed).internet.email(),
}

export const storage = new AsyncLocalStorage<Rng>()
