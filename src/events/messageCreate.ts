import axios from 'axios'
import { GuildTextBasedChannel, Message } from 'discord.js'
import { BotClient, BotEvent } from '../classes/index'

export default class MessageCreateEvent extends BotEvent {
    constructor(client: BotClient) {
        super(client, {
            name: 'messageCreate'
        })
    }

    async execute(message: Message) {
        const channel = message.channel as GuildTextBasedChannel
        const bot = await message.guild.members.fetch(this.client.user.id)

        if (message.author?.bot || message.webhookId || !bot.permissionsIn(channel).has('MANAGE_MESSAGES')) return

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
