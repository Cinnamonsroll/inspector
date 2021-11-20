import axios from 'axios'
import { GuildTextBasedChannel, Message } from 'discord.js'
import { BotClient, BotEvent } from '../classes/index'

export default class MessageUpdateEvent extends BotEvent {
    constructor(client: BotClient) {
        super(client, {
            name: 'messageUpdate'
        })
    }

    async execute(messages: Message[]) {
        const [, message] = messages

        const channel = message.channel as GuildTextBasedChannel
        const bot = await message.guild.members.fetch(this.client.user.id)

        if (message.author?.bot || message.webhookId || !bot.permissionsIn(channel).has('MANAGE_MESSAGES')) return

        const guild = await this.client.database.guild.findFirst({ where: { id: channel.guild.id } })

        let isMalicious = false
        let isWhiteListed = false

        if (guild) {
            const links = message.content.match(
                /(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z0-9][a-z0-9-]{0,61}[a-z0-9]/
            )

            const whitelist = guild.domain_whitelist

            // check if all links are in the whitelist
            if (links.every((v) => whitelist.includes(v))) {
                isWhiteListed = true
            }
        }

        if (isWhiteListed) return

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
