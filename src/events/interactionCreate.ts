import { BotEvent } from '../classes/index'
import { formatPermissions } from '../utils'
import type { Interaction, GuildTextBasedChannel, PermissionString } from 'discord.js'
import type { BotClient } from '../classes/index'

export default class InteractionEvent extends BotEvent {
    constructor(client: BotClient) {
        super(client, {
            name: 'interactionCreate'
        })
    }

    async execute(interaction: Interaction): Promise<void> {
        if (!interaction.isCommand() || !this.client.commands.has(interaction.commandName)) return

        const command = this.client.commands.get(interaction.commandName)

        if (command.options?.ownerOnly && interaction.user.id !== this.client.ownerID)
            return void (await interaction.reply('Only the bot owner can use this.'))

        try {
            const channel = (await this.client.channels.fetch(interaction.channel.id)) as GuildTextBasedChannel

            if (command.options?.clientPermissions) {
                const bot = await channel.guild.members.fetch(this.client.user.id)

                const missingPermissions: PermissionString[] = !interaction.channel.type.includes('THREAD')
                    ? channel.permissionsFor(bot.user.id).missing(command.options.clientPermissions)
                    : bot.permissions.missing(command.options.clientPermissions)

                if (missingPermissions && missingPermissions.length > 0) {
                    const permissions = formatPermissions(missingPermissions)

                    return void (await interaction.reply({
                        embeds: [
                            {
                                title: 'Missing Permissions',
                                color: 'BLURPLE',
                                description: `I need the permissions below to execute this`,
                                fields: [
                                    {
                                        name: 'Permissions',
                                        value: '```\n' + permissions.join(', ') + '\n```'
                                    }
                                ]
                            }
                        ]
                    }))
                }
            }

            if (command.options?.userPermissions) {
                const member = await channel.guild.members.fetch(interaction.user.id)
                const missingPermissions = member.permissions
                    .missing(command.options.userPermissions)
                    .concat(channel.permissionsFor(member).missing(command.options.userPermissions))

                if (missingPermissions && missingPermissions.length > 0) {
                    const permissions = formatPermissions(missingPermissions)

                    return void (await interaction.reply({
                        embeds: [
                            {
                                title: 'Missing Permissions',
                                color: 'BLURPLE',
                                description: `You need the permissions below to execute this`,
                                fields: [
                                    {
                                        name: 'Permissions',
                                        value: '```\n' + permissions.join(', ') + '\n```'
                                    }
                                ]
                            }
                        ]
                    }))
                }
            }
        } catch (error) {
            this.client.logger.error(error)
        }

        try {
            await command.execute(interaction)
        } catch (e) {
            const error = e as any

            this.client.logger.error(error)

            if (interaction.user.id === this.client.ownerID)
                await interaction.reply({
                    content: `${error.name}: ${error.message} ${error.stack}`,
                    ephemeral: true
                })

            await interaction.reply({
                content: 'There was an error while executing this command!',
                ephemeral: true
            })
        }
    }
}
