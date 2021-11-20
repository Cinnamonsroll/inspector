import { BotClient, BotEvent } from '../classes/index'

export default class ErrorEvent extends BotEvent {
    constructor(client: BotClient) {
        super(client, {
            name: 'error'
        })
    }

    async execute(data: Error) {
        if (data.message.includes('403')) return
        else this.client.logger.error(data)
    }
}
