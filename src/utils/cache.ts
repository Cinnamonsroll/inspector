const cacheMap = new Map()

export async function cache(func: Function): Promise<any> {
    const key: string = func.toString()

    if (cacheMap.has(key)) return cacheMap.get(key)

    const result: any = await func()

    cacheMap.set(key, result)

    return result
}
