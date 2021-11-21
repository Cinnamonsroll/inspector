const units: string[] = ['', 'K', 'M', 'B', 'T', 'Q']

export function humanReadable(
    number: number,
    options = {
        decimals: 2
    }
): string {
    const decimal: number = Math.pow(10, options.decimals)

    let unit: number = 0

    while (number >= 1000) {
        number /= 1000
        unit++
    }

    return `${Math.round(number * decimal) / decimal}${units[unit]}`
}
