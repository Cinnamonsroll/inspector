import { CommandInteraction } from 'discord.js'
import { BotClient, BotCommand } from '../classes/index'

export default class DeployCommand extends BotCommand {
    constructor(client: BotClient) {
        super(client, {
            name: 'deploy',
            description: 'Deploys the slash commands globally (OWNER ONLY)'
        })

        this.options = { ownerOnly: true }
    }

    async execute(interaction: CommandInteraction) {
        // const ownerCommands = this.client.commands.filter((c) => c.options?.ownerOnly).map((c) => c.data.name)
        const commands = this.client.commands.map((command) => command.toJSON())

        if (interaction.user.id !== this.client.ownerID) {
            return await interaction.reply('This command is only available to the bot owner.')
        }

        await interaction.deferReply({ ephemeral: true })

        await this.client.application.commands.set([])
        await interaction.guild.commands.set(commands)

        // if (ownerCommands.length > 0) {
        //     await this.client.application.commands.set(commands.filter((c) => !ownerCommands.includes(c.name)))
        //     await interaction.guild.commands.set(commands.filter((c) => ownerCommands.includes(c.name)))
        // } else {
        //     await this.client.application.commands.set(commands)
        // }

        await interaction.editReply('Slash commands have updated globally.')
    }
}
