export function humanReadable(
    number: number,
    options = {
        decimals: 2
    }
) {
    const units = ['', 'K', 'M', 'B', 'T', 'Q']
    const decimal = Math.pow(10, options.decimals)

    let unit = 0

    while (number >= 1000) {
        number /= 1000
        unit++
    }

    return `${Math.round(number * decimal) / decimal}${units[unit]}`
}
