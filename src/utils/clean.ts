const cleanChar: string = String.fromCharCode(8203)

export function clean(text: string): string {
    return text.replaceAll('`', '`' + cleanChar).replaceAll('@', '@' + cleanChar)
}
