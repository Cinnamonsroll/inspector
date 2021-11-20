import { Client, Collection, ClientOptions } from 'discord.js'
import { PrismaClient } from '@prisma/client'
import { Api } from '@top-gg/sdk'
import { Logger } from '../classes/index'
import { BotCommand } from './index'

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
