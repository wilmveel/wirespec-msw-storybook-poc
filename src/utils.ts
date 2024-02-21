import {faker} from "@faker-js/faker";

export const seededFaker = (seed:number) => {
    faker.seed(seed)
    return faker
}