import { BotEvent } from '../classes/index'
import type { BotClient } from '../classes/index'

export default class DebugEvent extends BotEvent {
    constructor(client: BotClient) {
        super(client, {
            name: 'debug'
        })
    }

    async execute(data: string): Promise<void> {
        this.client.logger.debug(data)
    }
}
