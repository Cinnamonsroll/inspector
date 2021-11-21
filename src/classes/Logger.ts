import Colors from 'chalk'

export class Logger {
    private previousLog: {
        type: string
        message: string
    }

    constructor(public options: { color: boolean; spacing: boolean; allowDebug: boolean }) {
        this.previousLog = {
            type: 'none',
            message: ''
        }
    }

    private handleSpacing(type: string): void {
        if (this.options.spacing && this.previousLog.type !== type.toLowerCase() && this.previousLog.type !== 'none')
            console.log('')
    }

    success(data: unknown, customTag?: string): void {
        const tag: string = customTag ?? 'Success'
        this.handleSpacing(tag)

        const displayTag: string = this.options.color ? Colors.bgGreenBright(Colors.black(` ${tag} `)) : `[${tag}]`
        console.log(`${displayTag} ${data}`)

        this.previousLog = { message: String(data), type: tag.toLowerCase() }
    }

    debug(data: unknown, customTag?: string): void {
        if (!this.options.allowDebug) return

        const tag: string = customTag ?? 'Debug'
        this.success(data, tag)
    }

    log(data: unknown, customTag?: string): void {
        const tag: string = customTag ?? 'Log'
        this.handleSpacing(tag)

        const displayTag: string = this.options.color ? Colors.bgCyanBright(Colors.black(` ${tag} `)) : `[${tag}]`
        console.log(`${displayTag} ${data}`)

        this.previousLog = { message: String(data), type: tag.toLowerCase() }
    }

    info(data: unknown, customTag?: string): void {
        const tag: string = customTag ?? 'Info'
        this.log(data, tag)
    }

    error(data: unknown, customTag?: string): void {
        const tag: string = customTag ?? 'Error'
        this.handleSpacing(tag)

        const displayTag: string = this.options.color ? Colors.bgRedBright(Colors.black(` ${tag} `)) : `[${tag}]`
        console.error(displayTag, data)

        this.previousLog = { message: String(data), type: tag.toLowerCase() }
    }

    warn(data: unknown, customTag?: string): void {
        const tag: string = customTag ?? 'Warning'
        this.handleSpacing(tag)

        const displayTag: string = this.options.color ? Colors.bgYellowBright(Colors.black(` ${tag} `)) : `[${tag}]`
        console.log(`${displayTag} ${data}`)

        this.previousLog = { message: String(data), type: tag.toLowerCase() }
    }
}
