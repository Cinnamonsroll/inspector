import { ClientEvents } from 'discord.js'
import { BotClient } from '../classes/index'

export abstract class BotEvent {
    constructor(public client: BotClient, public data: { name: keyof ClientEvents; once?: boolean }) {}

    abstract execute(...args: any): Promise<unknown>

    toString() {
        return this.data.name
    }

    toJSON() {
        return this.data
    }
}
