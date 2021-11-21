import { Permissions } from 'discord.js'
import { BotCommand } from '../classes/index'
import type { CommandInteraction } from 'discord.js'
import type { BotClient } from '../classes/index'

export default class PingCommand extends BotCommand {
    constructor(client: BotClient) {
        super(client, {
            name: 'ping',
            description: 'Returns the ping of the bot.'
        })

        this.options = {
            clientPermissions: [Permissions.FLAGS.ADMINISTRATOR]
        }
    }

    async execute(interaction: CommandInteraction): Promise<void> {
        await interaction.reply(`My ping is \`${this.client.ws.ping}ms\``)
    }
}
