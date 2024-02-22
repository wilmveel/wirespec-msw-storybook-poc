export type CacheItem = {
    name: string,
    seed: number,
    data: any,
}

export const cache: CacheItem[] = []

export const findFromCache = (value:string) => {
    return cache.find(it => findVal(it.data, value))
}

const findVal = (object: object, search: string): boolean => {
    return Object.entries(object).some(( [_, value]) => {
        if(typeof value === "string"){
            return value === search
        }else{
            return findVal(value, search)
        }
    })
}


