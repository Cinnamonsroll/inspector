import { inspect } from '../handlers/message'
import { BotEvent } from '../classes/index'
import type { GuildTextBasedChannel, Message } from 'discord.js'
import type { BotClient } from '../classes/index'

export default class MessageCreateEvent extends BotEvent {
    constructor(client: BotClient) {
        super(client, {
            name: 'messageCreate'
        })
    }

    async execute(message: Message): Promise<void> {
        const bot = await message.guild.members.fetch(this.client.user.id)

        if (
            message.author?.bot ||
            message.webhookId != undefined ||
            !bot.permissionsIn(message.channel as GuildTextBasedChannel).has('MANAGE_MESSAGES')
        )
            return

        await inspect(this.client, message)
    }
}
