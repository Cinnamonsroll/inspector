import axios from 'axios'
import { cache } from '../utils/cache'

interface Runtime {
    language: string
    version: string
    aliases: string[]
}

export class PistonClient {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    constructor() {}

    async getRuntimes(): Promise<Runtime[]> {
        const { data } = await axios.get('https://emkc.org/api/v2/piston/runtimes')
        return data
    }

    async execute(
        code: string,
        language: string
    ): Promise<{
        console: string
        compiler?: string
        error?: boolean
    }> {
        const runtimes: Runtime[] = await cache(this.getRuntimes)
        const runtime: Runtime = runtimes.find(
            (r: Runtime): boolean => r.language === language || r.aliases.includes(language)
        )

        if (runtime === undefined) throw new Error(`Language ${language} not found`)

        try {
            const { data } = (await axios.post(`https://emkc.org/api/v2/piston/execute`, {
                language: runtime.language,
                version: runtime.version,
                files: [{ content: code }]
            })) as any

            return data.compile != undefined
                ? { console: data.run.output, compiler: data.compile.output }
                : { console: data.run.output }
        } catch (error: any) {
            if (error.isAxiosError) return { console: error.response.data.message, error: true }
        }
    }
}
