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

    private handleSpacing(type: string) {
        if (this.options.spacing && this.previousLog.type !== type.toLowerCase() && this.previousLog.type !== 'none')
            console.log('')
    }

    success(data: unknown, customTag?: string) {
        const tag = customTag ?? 'Success'
        this.handleSpacing(tag)

        const displayTag = this.options.color === true ? Colors.bgGreenBright(Colors.black(` ${tag} `)) : `[${tag}]`
        console.log(`${displayTag} ${data}`)

        this.previousLog = { message: String(data), type: tag.toLowerCase() }
    }

    debug(data: unknown, customTag?: string) {
        if (!this.options.allowDebug) return
        const tag = customTag ?? 'Debug'
        this.success(data, tag)
    }

    log(data: unknown, customTag?: string) {
        const tag = customTag ?? 'Log'
        this.handleSpacing(tag)

        const displayTag = this.options.color === true ? Colors.bgCyanBright(Colors.black(` ${tag} `)) : `[${tag}]`
        console.log(`${displayTag} ${data}`)

        this.previousLog = { message: String(data), type: tag.toLowerCase() }
    }

    info(data: unknown, customTag?: string) {
        const tag = customTag ?? 'Info'
        this.log(data, tag)
    }

    error(data: unknown, customTag?: string) {
        const tag = customTag ?? 'Error'
        this.handleSpacing(tag)

        const displayTag = this.options.color === true ? Colors.bgRedBright(Colors.black(` ${tag} `)) : `[${tag}]`
        console.error(displayTag, data)

        this.previousLog = { message: String(data), type: tag.toLowerCase() }
    }

    warn(data: unknown, customTag?: string) {
        const tag = customTag ?? 'Warning'
        this.handleSpacing(tag)

        const displayTag = this.options.color === true ? Colors.bgYellowBright(Colors.black(` ${tag} `)) : `[${tag}]`
        console.log(`${displayTag} ${data}`)

        this.previousLog = { message: String(data), type: tag.toLowerCase() }
    }
}
