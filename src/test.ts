import {rng} from "./rng";
import {generate} from "./generator";
import {deepEqual, equal} from "assert";
import {cache, findFromCache} from "./cache";

const seed = "218c7a91c0e245728c74asfadf"


const person = generate("Person", false, rng(seed))
const personDetail = generate("PersonDetail", false, rng(seed))

console.log(person)
console.log("-----")
console.log(personDetail)

equal(person.id, personDetail.id, "Id is not equals")
equal(person.name, personDetail.name, "Name is not equals")

console.log("-----")

cache.forEach(it => {
    const data = generate(it.name, false, rng(it.seed))
    // console.log(it, data)
    deepEqual(it.data, data)
})

const formCache = findFromCache(personDetail.id)

// console.log("formCache", formCache);

const x = generate("PersonDetail", false, rng(formCache?.seed))

equal(personDetail.name, x.name)



