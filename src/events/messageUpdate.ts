import axios from 'axios'
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

        if (message.author?.bot || message.webhookId) return

        let isMalicious = false

        const { data } = (await axios.post(
            'https://anti-fish.bitflow.dev/check',
            {
                message: message.content
            },
            {
                headers: {
                    'User-Agent': 'Inspector (https://github.com/link-discord/inspector)'
                }
            }
        )) as any

        data.matches.forEach((match: { type: string }) => {
            const type = match.type.toLowerCase()

            if ((type === 'phishing' || type === 'ip_logger') && !isMalicious) {
                isMalicious = true
            }
        })

        if (isMalicious) {
            message.delete()
        }
    }
}
