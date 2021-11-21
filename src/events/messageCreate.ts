import axios from 'axios'
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
        const channel = message.channel as GuildTextBasedChannel
        const bot = await message.guild.members.fetch(this.client.user.id)

        if (message.author?.bot || message.webhookId != undefined || !bot.permissionsIn(channel).has('MANAGE_MESSAGES'))
            return

        const guild = await this.client.database.guild.findFirst({ where: { id: channel.guild.id } })

        let isMalicious: boolean = false
        let isWhiteListed: boolean = false

        if (guild != undefined) {
            const domains = message.content.match(
                /(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z0-9][a-z0-9-]{0,61}[a-z0-9]/
            )

            const whitelist: string[] = guild.domain_whitelist

            // check if all links are in the whitelist
            if (domains.every((v: string): boolean => whitelist.includes(v))) isWhiteListed = true
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

        data.matches.forEach((match: { type: string }): void => {
            const type: string = match.type.toLowerCase()

            if ((type === 'phishing' || type === 'ip_logger') && !isMalicious) isMalicious = true
        })

        if (isMalicious) await message.delete()
    }
}
