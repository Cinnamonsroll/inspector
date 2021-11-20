import { BotClient, BotEvent } from '../classes/index'

export default class DebugEvent extends BotEvent {
    constructor(client: BotClient) {
        super(client, {
            name: 'debug'
        })
    }

    async execute(data: string) {
        this.client.logger.debug(data)
    }
}
