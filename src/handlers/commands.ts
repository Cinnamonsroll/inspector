import { readdirSync } from 'fs'
import type { BotClient } from '../classes/index'

export async function commandHandler(client: BotClient): Promise<void> {
    const commandFiles: string[] = readdirSync('./commands').filter((file: string): boolean => file.endsWith('.js'))

    for (const file of commandFiles) {
        import(`../commands/${file}`).then(({ default: BotCommand }): void => {
            const command = new BotCommand(client)
            client.commands.set(command.data.name, command)
        })
    }
}
