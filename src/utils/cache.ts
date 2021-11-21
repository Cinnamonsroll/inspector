const cacheMap = new Map()

// Function type
type func = (() => Promise<any> | any) | ((...args: any[]) => Promise<any> | any)

export async function cache(func: func): Promise<any> {
    const key: string = func.toString()

    if (cacheMap.has(key)) return cacheMap.get(key)

    const result: any = await func()

    cacheMap.set(key, result)

    return result
}
