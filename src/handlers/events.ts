import { readdirSync } from 'fs'
import type { BotClient } from '../classes/index'

export async function eventHandler(client: BotClient): Promise<void> {
    const eventFiles: string[] = readdirSync('./events').filter((file: string): boolean => file.endsWith('.js'))

    for (const file of eventFiles) {
        import(`../events/${file}`).then(({ default: BotEvent }): void => {
            const event = new BotEvent(client)

            client[event.data.once ? 'once' : 'on'](event.data.name, (...args: any[]): void => {
                if (Array.isArray(args) && args.length === 1) args = args[0]
                event.execute(args)
            })
        })
    }
}
