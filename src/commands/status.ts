import { BotCommand } from '../classes/index'
import type { CommandInteraction } from 'discord.js'
import type { BotClient } from '../classes/index'

export default class StatusCommand extends BotCommand {
    constructor(client: BotClient) {
        super(client, {
            name: 'status',
            description: 'Returns the status of the bot and its services.'
        })
    }

    async execute(interaction: CommandInteraction): Promise<void> {
        await interaction.reply(`View the status page at: https://stats.uptimerobot.com/KGP6xUD4om`)
    }
}
