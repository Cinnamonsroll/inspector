import { Guild } from '.prisma/client'
import { CommandInteraction, Permissions, Formatters } from 'discord.js'
import { URL } from 'url'
import { BotClient, BotCommand } from '../classes/index'

const { codeBlock } = Formatters

export default class PingCommand extends BotCommand {
    constructor(client: BotClient) {
        super(client, {
            name: 'whitelist',
            description: 'Allows you to configure the whitelist.',
            options: [
                {
                    name: 'all',
                    description: 'Allows you to see all whitelisted links.',
                    type: 'SUB_COMMAND'
                },
                {
                    name: 'add',
                    description: 'Adds a link to the whitelist.',
                    type: 'SUB_COMMAND',
                    options: [
                        {
                            name: 'link',
                            description: 'The link to add.',
                            required: true,
                            type: 'STRING'
                        }
                    ]
                },
                {
                    name: 'remove',
                    description: 'Removes a link from the whitelist.',
                    type: 'SUB_COMMAND',
                    options: [
                        {
                            name: 'link',
                            description: 'The link to remove.',
                            required: true,
                            type: 'STRING'
                        }
                    ]
                }
            ]
        })

        this.options = {
            userPermissions: [Permissions.FLAGS.MANAGE_GUILD]
        }
    }

    async execute(interaction: CommandInteraction) {
        let guild: Guild = null

        const subcommand = interaction.options.getSubcommand()
        const link = interaction.options.getString('link')

        try {
            if (link) new URL(link)
        } catch (e) {
            return interaction.reply('Invalid link.')
        }

        try {
            guild = await this.client.database.guild.findFirst({
                rejectOnNotFound: true,
                where: {
                    id: interaction.guildId
                }
            })
        } catch (error) {
            guild = await this.client.database.guild.create({
                data: {
                    id: interaction.guildId,
                    domain_whitelist: []
                }
            })
        } finally {
            if (!guild) return interaction.reply('Could not retrieve this guild from the database.')

            const links = guild.domain_whitelist

            if (subcommand === 'all') {
                if (links.length === 0) return interaction.reply('This guild has no whitelisted links.')
                else return interaction.reply(`Whitelisted domains: ${codeBlock(links.join(', '))}`)
            } else if (subcommand === 'add') {
                const url = new URL(link)

                links.push(url.hostname)

                await this.client.database.guild.update({
                    where: {
                        id: interaction.guildId
                    },
                    data: {
                        domain_whitelist: {
                            set: links
                        }
                    }
                })

                await interaction.reply(`The link has been added to the whitelist.`)
            } else if (subcommand === 'remove') {
                const url = new URL(link)
                const index = links.indexOf(url.hostname)

                if (index === -1) return interaction.reply('This link is not whitelisted.')

                links.splice(index, 1)

                await this.client.database.guild.update({
                    where: {
                        id: interaction.guildId
                    },
                    data: {
                        domain_whitelist: {
                            set: links
                        }
                    }
                })

                await interaction.reply(`The link has been removed from the whitelist.`)
            }
        }
    }
}
