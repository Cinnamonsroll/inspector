import { BotEvent } from '../classes/index'
import type { BotClient } from '../classes/index'

export default class WarnEvent extends BotEvent {
    constructor(client: BotClient) {
        super(client, {
            name: 'warn'
        })
    }

    async execute(data: string): Promise<void> {
        this.client.logger.warn(data)
    }
}
