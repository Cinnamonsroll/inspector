import axios from 'axios'
import { BotEvent } from '../classes/index'
import type { GuildTextBasedChannel, Message } from 'discord.js'
import type { BotClient } from '../classes/index'

export default class MessageUpdateEvent extends BotEvent {
    constructor(client: BotClient) {
        super(client, {
            name: 'messageUpdate'
        })
    }

    async execute(messages: Message[]): Promise<void> {
        const [, message] = messages

        const channel = message.channel as GuildTextBasedChannel
        const bot = await message.guild.members.fetch(this.client.user.id)

        if (message.author?.bot || message.webhookId != undefined || !bot.permissionsIn(channel).has('MANAGE_MESSAGES'))
            return

        const whitelist = await this.client.database.whitelistedDomain.findMany({
            where: { guild: { id: message.guildId } }
        })

        let isMalicious: boolean = false
        let isWhiteListed: boolean = false

        if (whitelist !== undefined && whitelist.length > 0) {
            const domains = message.content.match(
                /(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z0-9][a-z0-9-]{0,61}[a-z0-9]/
            )

            const whitelistedDomains: string[] = whitelist.map((d) => d.domain)

            // check if all links are in the whitelist
            if (domains.every((v: string): boolean => whitelistedDomains.includes(v))) isWhiteListed = true
        }

        if (isWhiteListed) return

        try {
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
        } catch (error) {
            // @ts-ignore unknown type
            if (!error.isAxiosError) this.client.logger.error(e)
        }
    }
}
