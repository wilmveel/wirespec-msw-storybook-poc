import {seededFaker} from "./utils";



export const customGeneratorMap: Record<string, (seed: number) => any> = {
    "City": (seed: number) => seededFaker(seed).location.city(),
    "Street": (seed: number) => seededFaker(seed).location.street(),
    "PostalCode": (seed: number) => seededFaker(seed).location.zipCode(),
    "Country": (seed: number) => seededFaker(seed).location.country(),
    "Email": (seed: number) => seededFaker(seed).internet.email(),
    "FullName": (seed: number) => seededFaker(seed).person.fullName(),
    "Todo[]": (seed: number) => [
        {},
        {},
        {},
    ],
}
