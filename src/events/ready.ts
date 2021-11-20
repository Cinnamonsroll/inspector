import { BotClient, BotEvent } from '../classes/index'
import { AutoPoster } from 'topgg-autoposter'
import { bold } from 'chalk'
import { humanReadable } from '../utils/humanReadable'

const testingGuild = '813808947164741670'

export default class ReadyEvent extends BotEvent {
    constructor(client: BotClient) {
        super(client, {
            name: 'ready'
        })
    }

    async execute() {
        // const ownerCommands = this.client.commands
        //     .filter((command) => command.options?.ownerOnly)
        //     .map((command) => command.toJSON())

        // const guild = await this.client.guilds.fetch(testingGuild)
        // await guild.commands.set(ownerCommands)

        try {
            await this.client.database.$connect()
            this.client.logger.info('Connected to database')

            const guild = await this.client.database.guild.upsert({
                where: {
                    id: testingGuild
                },
                create: {
                    id: testingGuild,
                    link_whitelist: []
                },
                update: {
                    id: testingGuild,
                    link_whitelist: []
                }
            })

            this.client.logger.info(`Created guild with id ${guild.id}`)
        } catch (error) {
            this.client.logger.error(error)
            process.exit(1)
        }

        if (!process.env.TOPGG_TOKEN) return this.client.logger.info(`${bold(this.client.user.username)} is ready!`)

        const poster = AutoPoster(process.env.TOPGG_TOKEN, this.client)

        poster.on('posted', async (stats) => {
            try {
                stats.serverCount ||= 0
                stats.shardCount ||= 0

                const serverCount = humanReadable(stats.serverCount)
                const shardCount = humanReadable(stats.shardCount)

                const content = `In ${serverCount} servers! (${shardCount} shards)`

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
