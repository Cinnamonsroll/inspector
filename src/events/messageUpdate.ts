import { Message } from 'discord.js'
import { BotClient, BotEvent } from '../classes/index'

export default class MessageUpdateEvent extends BotEvent {
    constructor(client: BotClient) {
        super(client, {
            name: 'messageUpdate'
        })
    }

    async execute(messages: Message[]) {
        const [, message] = messages

        if (message.channel?.type !== 'GUILD_TEXT' || message.author?.bot || message.webhookId) return

        // TODO: Check message for malicious links and other stuff
    }
}
