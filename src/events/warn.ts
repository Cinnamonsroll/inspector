import { BotClient, BotEvent } from '../classes/index'

export default class WarnEvent extends BotEvent {
    constructor(client: BotClient) {
        super(client, {
            name: 'warn'
        })
    }

    async execute(data: string) {
        this.client.logger.warn(data)
    }
}
