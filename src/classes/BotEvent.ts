import type { ClientEvents } from 'discord.js'
import type { BotClient } from '../classes/index'

interface EventData {
    name: keyof ClientEvents
    once?: boolean
}

export abstract class BotEvent {
    constructor(public client: BotClient, public data: EventData) {}

    abstract execute(...args: any): Promise<unknown>

    toJSON(): EventData {
        return this.data
    }

    toString(): string {
        return this.data.name
    }
}
