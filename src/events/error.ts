import { BotEvent } from '../classes/index'
import type { BotClient } from '../classes/index'

export default class ErrorEvent extends BotEvent {
    constructor(client: BotClient) {
        super(client, {
            name: 'error'
        })
    }

    async execute(data: Error): Promise<void> {
        if (data.message.includes('403')) return

        this.client.logger.error(data)
    }
}
