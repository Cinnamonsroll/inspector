import * as utils from '../utils/index'
import { inspect } from 'util'
import { transpile } from 'typescript'
import { Formatters, MessageEmbed } from 'discord.js'
import { BotCommand, PistonClient } from '../classes/index'
import type { CommandInteraction } from 'discord.js'
import type { BotClient } from '../classes/index'

const piston = new PistonClient()

// We do a little trolling and make this a public eval command lol

export default class EvalCommand extends BotCommand {
    private regex: RegExp = /```(.*)\n([\s\S]*?)\n```/

    constructor(client: BotClient) {
        super(client, {
            name: 'eval',
            description: 'Allows you to execute code.',
            options: [
                {
                    name: 'code',
                    description: 'The code to execute. (OWNER ONLY)',
                    type: 'STRING',
                    required: true
                }
            ]
        })
    }

    getCode(input: string): { language: string; code: string } {
        const match = this.regex.exec(input)

        if (match === null) return { code: input, language: 'js' }

        const [, language, code] = match

        return { language, code }
    }

    async executeCode(
        code: string,
        options: { useEval: boolean; language: string }
    ): Promise<{ console: string; compiler?: string; error?: boolean }> {
        if (options.useEval) {
          if (options.language === 'js') return { console: eval(code) }
          else if (options.language === 'ts') return { console: eval(transpile(code)) }
        }

        return await piston.execute(code, options.language)
    }

    async execute(interaction: CommandInteraction): Promise<void> {
        await interaction.deferReply({ ephemeral: true })

        const { code, language } = this.getCode(interaction.options.getString('code', true))

        try {
            let output = await this.executeCode(code, {
                useEval: interaction.user.id === this.client.ownerID,
                language
            })

            if (typeof output.console !== 'string') output.console = inspect(output.console)

            const embed = new MessageEmbed()
                .setTitle('Input')
                .setColor(output.error ? 'RED' : 'BLURPLE')
                .setDescription(Formatters.codeBlock(language, code))
                .addField('Output', Formatters.codeBlock(language, utils.clean(output.console)))

            if (output.compiler != undefined)
                embed.addField('Compiler', Formatters.codeBlock(language, utils.clean(output.compiler)))

            await interaction.followUp({ embeds: [embed] })
        } catch (error) {
            // @ts-ignore
            const output: string = `${error.name}: ${error.message}`

            await interaction.followUp({
                embeds: [
                    {
                        title: 'Input',
                        color: 'RED',
                        description: Formatters.codeBlock(language, code),
                        fields: [
                            {
                                name: 'Output',
                                value: Formatters.codeBlock(language, output)
                            }
                        ]
                    }
                ]
            })
        }
    }
}
