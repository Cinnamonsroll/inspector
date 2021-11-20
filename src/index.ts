import { Api } from '@top-gg/sdk'
import { PrismaClient } from '@prisma/client'
import { Collection } from 'discord.js'
import { BotClient, Logger } from './classes/index'
import { ClientOptions } from './utils/index'
import { commandHandler, eventHandler } from './handlers/index'

const client = new BotClient(ClientOptions)

async function main() {
    client.ownerID = '476662199872651264'
    client.database = new PrismaClient()
    client.topgg = new Api(process.env.TOPGG_TOKEN)
    client.commands = new Collection()
    client.logger = new Logger({
        color: false,
        spacing: true,
        allowDebug: false
    })

    await commandHandler(client)
    await eventHandler(client)

    process.on('uncaughtExceptionMonitor', (error: Error) => {
        client.logger.error(error)
    })

    await client.login()
}

main()
