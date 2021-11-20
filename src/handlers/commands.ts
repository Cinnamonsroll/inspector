import { readdirSync } from 'fs'
import { BotClient } from '../classes'

export async function commandHandler(client: BotClient) {
    const commandFiles = readdirSync('./commands').filter((file) => file.endsWith('.js'))

    for (const file of commandFiles) {
        import(`../commands/${file}`).then(({ default: BotCommand }) => {
            const command = new BotCommand(client)
            client.commands.set(command.data.name, command)
        })
    }
}
