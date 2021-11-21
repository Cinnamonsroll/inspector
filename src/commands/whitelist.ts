import { WhitelistedDomain } from '.prisma/client'
import { CommandInteraction, Permissions, Formatters } from 'discord.js'
import { BotClient, BotCommand } from '../classes/index'

const { codeBlock } = Formatters

export default class WhitelistCommand extends BotCommand {
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
        let whitelist: WhitelistedDomain[] = []

        const subcommand = interaction.options.getSubcommand()
        const input = interaction.options.getString('link')

        if (input && !this.regex.test(input)) return await interaction.reply('Invalid link(s).')

        try {
            whitelist = await this.client.database.whitelistedDomain.findMany({
                where: {
                    guild: {
                        id: interaction.guildId
                    }
                }
            })

            await this.client.database.guild.findFirst({
                rejectOnNotFound: true,
                where: {
                    id: interaction.guildId
                }
            })
        } catch (error) {
            await this.client.database.guild.create({
                data: {
                    id: interaction.guildId
                }
            })
        } finally {
            if (subcommand === 'all') {
                const domains = codeBlock(whitelist.map((d) => d.domain).join(', '))

                if (whitelist.length === 0) return interaction.reply('This guild has no whitelisted domains.')
                else return interaction.reply(`Whitelisted domains: ${domains}`)
            } else if (subcommand === 'add') {
                const invalidDomains: string[] = []
                const domains = this.regex.exec(input)

                for (const domain of domains) {
                    const domainExists = whitelist.find((d) => d.domain === domain)

                    if (domainExists) invalidDomains.push(domain)

                    await this.client.database.whitelistedDomain.create({
                        data: {
                            domain: domain,
                            guild: {
                                connect: {
                                    id: interaction.guildId
                                }
                            }
                        }
                    })
                }

                if (invalidDomains.length > 0) {
                    return await interaction.reply(
                        `The following domains are already whitelisted: ${codeBlock(invalidDomains.join(', '))}`
                    )
                }

                await interaction.reply(`The domain(s) have been added to the whitelist.`)
            } else if (subcommand === 'remove') {
                const invalidDomains: string[] = []
                const domains = this.regex.exec(input)

                for (const domain of domains) {
                    try {
                        const { id } = await this.client.database.whitelistedDomain.findFirst({
                            rejectOnNotFound: true,
                            where: {
                                domain: domain,
                                guild: {
                                    id: interaction.guildId
                                }
                            }
                        })

                        await this.client.database.whitelistedDomain.delete({
                            where: {
                                id
                            }
                        })
                    } catch (error) {
                        invalidDomains.push(domain)
                        continue
                    }
                }

                if (invalidDomains.length > 0) {
                    return await interaction.reply(
                        `The following domains are not whitelisted: ${codeBlock(invalidDomains.join(', '))}`
                    )
                }

                await interaction.reply(`The domain(s) have been removed from the whitelist.`)
            }
        }
    }
}
