import axios from 'axios'
import { Message } from 'discord.js'
import { BotClient } from '../classes'

export async function inspect(client: BotClient, message: Message) {
    const whitelist = await client.database.whitelistedDomain.findMany({
        where: { guild: { id: message.guildId } }
    })

    let isMalicious = false
    let isWhiteListed = false

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
    } catch (error: any) {
        if (!error.isAxiosError) client.logger.error(error)
    }
}
