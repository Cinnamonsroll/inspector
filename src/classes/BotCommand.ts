import { ApplicationCommandData, CommandInteraction } from 'discord.js'
import { BotClient } from './index'

interface Options {
    ownerOnly?: boolean
    clientPermissions?: bigint[]
    userPermissions?: bigint[]
}

export abstract class BotCommand {
    constructor(public client: BotClient, public data: ApplicationCommandData, public options?: Options) {}

    abstract execute(interaction: CommandInteraction): Promise<unknown>

    toJSON() {
        return this.data
    }

    toString() {
        return this.data.name
    }
}
