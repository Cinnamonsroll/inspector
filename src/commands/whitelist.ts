import { Guild } from '.prisma/client'
import { CommandInteraction, Permissions, Formatters } from 'discord.js'
import { BotClient, BotCommand } from '../classes/index'

const { codeBlock } = Formatters

export default class PingCommand extends BotCommand {
    private regex = /(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z0-9][a-z0-9-]{0,61}[a-z0-9]/

    constructor(client: BotClient) {
        super(client, {
            name: 'whitelist',
            description: 'Allows you to configure the whitelist.',
            options: [
                {
                    name: 'all',
                    description: 'Allows you to see all whitelisted domains.',
                    type: 'SUB_COMMAND'
                },
                {
                    name: 'add',
                    description: 'Adds a domain to the whitelist.',
                    type: 'SUB_COMMAND',
                    options: [
                        {
                            name: 'link',
                            description: 'The domain to add.',
                            required: true,
                            type: 'STRING'
                        }
                    ]
                },
                {
                    name: 'remove',
                    description: 'Removes a domain from the whitelist.',
                    type: 'SUB_COMMAND',
                    options: [
                        {
                            name: 'link',
                            description: 'The domain to remove.',
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
        const input = interaction.options.getString('link')

        if (input && !this.regex.test(input)) return await interaction.reply('Invalid link(s).')

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

            const whitelist = guild.domain_whitelist

            if (subcommand === 'all') {
                if (whitelist.length === 0) return interaction.reply('This guild has no whitelisted domains.')
                else return interaction.reply(`Whitelisted domains: ${codeBlock(whitelist.join(', '))}`)
            } else if (subcommand === 'add') {
                const domains = this.regex.exec(input)

                whitelist.concat(domains)

                await this.client.database.guild.update({
                    where: {
                        id: interaction.guildId
                    },
                    data: {
                        domain_whitelist: {
                            set: whitelist
                        }
                    }
                })

                await interaction.reply(`The link has been added to the whitelist.`)
            } else if (subcommand === 'remove') {
                const domains = this.regex.exec(input)

                const invalidDomains: string[] = []

                for (const domain of domains) {
                    const index = whitelist.indexOf(domain)

                    if (index === -1) invalidDomains.push(domain)

                    whitelist.splice(index, 1)
                }

                if (invalidDomains.length > 0) {
                    return await interaction.reply(
                        `The following domains are not whitelisted: ${codeBlock(invalidDomains.join(', '))}`
                    )
                }

                await this.client.database.guild.update({
                    where: {
                        id: interaction.guildId
                    },
                    data: {
                        domain_whitelist: {
                            set: whitelist
                        }
                    }
                })

                await interaction.reply(`The link has been removed from the whitelist.`)
            }
        }
    }
}
