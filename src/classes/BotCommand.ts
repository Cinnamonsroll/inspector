import type { ApplicationCommandData, CommandInteraction } from 'discord.js'
import type { BotClient } from './index'

interface Options {
    ownerOnly?: boolean
    clientPermissions?: bigint[]
    userPermissions?: bigint[]
}

export abstract class BotCommand {
    constructor(public client: BotClient, public data: ApplicationCommandData, public options?: Options) {}

    abstract execute(interaction: CommandInteraction): Promise<unknown>

    toJSON(): ApplicationCommandData {
        return this.data
    }

    toString(): string {
        return this.data.name
    }
}
