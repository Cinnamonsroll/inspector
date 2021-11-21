import { BotEvent } from '../classes/index'
import { AutoPoster } from 'topgg-autoposter'
import { bold } from 'chalk'
import { humanReadable } from '../utils/humanReadable'
import type { BotClient } from '../classes/index'

const testingGuild: string = '911766580818497566'

export default class ReadyEvent extends BotEvent {
    constructor(client: BotClient) {
        super(client, {
            name: 'ready'
        })
    }

    async execute(): Promise<void> {
        const ownerCommands = this.client.commands
            .filter((command) => command.options?.ownerOnly)
            .map((command) => command.toJSON())

        const guild = await this.client.guilds.fetch(testingGuild)
        await guild.commands.set(ownerCommands)

        if (!('TOPGG_TOKEN' in process.env))
            return this.client.logger.info(`${bold(this.client.user.username)} is ready!`)

        const poster = AutoPoster(process.env.TOPGG_TOKEN, this.client)

        poster.on('posted', async (stats): Promise<void> => {
            try {
                stats.serverCount ||= 0
                stats.shardCount ||= 0

                const serverCount: string = humanReadable(stats.serverCount)
                const shardCount: string = humanReadable(stats.shardCount)

                const content: string = `In ${serverCount} servers! (${shardCount} shards)`

                this.client.user.setPresence({
                    status: 'online',
                    activities: [
                        {
                            name: content,
                            type: 'PLAYING'
                        }
                    ]
                })
            } catch (e) {}
        })

        this.client.logger.info(`${bold(this.client.user.username)} is ready!`)
    }
}
