import { CommandInteraction, Permissions } from 'discord.js'
import { BotClient, BotCommand } from '../classes/index'

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

    async execute(interaction: CommandInteraction) {
        await interaction.reply(`My ping is \`${this.client.ws.ping}ms\``)
    }
}
