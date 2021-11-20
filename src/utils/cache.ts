const cacheMap = new Map()

export async function cache(func: any) {
    const key = func.toString()

    if (cacheMap.has(key)) {
        return cacheMap.get(key)
    }

    const result = await func()

    cacheMap.set(key, result)

    return result
}