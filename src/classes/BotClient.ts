import { Client } from 'discord.js'
import type { Collection, ClientOptions } from 'discord.js'
import type { PrismaClient } from '@prisma/client'
import type { Api } from '@top-gg/sdk'
import type { Logger } from '../classes/index'
import type { BotCommand } from './index'

export class BotClient extends Client {
    ownerID!: string
    commands!: Collection<string, BotCommand>
    logger!: Logger
    database: PrismaClient
    topgg!: Api

    constructor(options: ClientOptions) {
        super(options)
    }
}
