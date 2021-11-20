import { readdirSync } from 'fs'
import { BotClient } from '../classes'

export async function eventHandler(client: BotClient) {
    const eventFiles = readdirSync('./events').filter((file) => file.endsWith('.js'))

    for (const file of eventFiles) {
        import(`../events/${file}`).then(({ default: BotEvent }) => {
            const event = new BotEvent(client)

            if (event.data.once) {
                client.once(event.data.name, (...args) => {
                    if (Array.isArray(args) && args.length === 1) args = args[0]
                    event.execute(args)
                })
            } else {
                client.on(event.data.name, (...args) => {
                    if (Array.isArray(args) && args.length === 1) args = args[0]
                    event.execute(args)
                })
            }
        })
    }
}
