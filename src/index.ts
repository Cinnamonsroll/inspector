import { Api } from '@top-gg/sdk'
import { PrismaClient } from '@prisma/client'
import { Collection } from 'discord.js'
import { BotClient, Logger } from './classes/index'
import { ClientOptions } from './utils/index'
import { commandHandler, eventHandler } from './handlers/index'
import { config } from 'dotenv'
import { join } from 'path'

config({
    path: join(process.cwd(), '..', '.env')
})

const client: BotClient = new BotClient(ClientOptions)

async function main() {
    client.ownerID = process.env.OWNER_ID ?? '476662199872651264'
    client.database = new PrismaClient()
    client.topgg = new Api(process.env.TOPGG_TOKEN)
    client.commands = new Collection()
    client.logger = new Logger({
        color: false,
        spacing: true,
        allowDebug: false
    })

    const express = (await import('express')).default
    const app = express()

    app.use(express.json())

    app.get('/', (req, res) => {
        res.sendStatus(200)
    })

    app.listen(3000, () => {
        client.logger.info('Express server started on port 3000')
    })

    await commandHandler(client)
    await eventHandler(client)

    process.on('uncaughtExceptionMonitor', (error: Error): void => {
        client.logger.error(error)
    })

    await client.login()
}

main()
