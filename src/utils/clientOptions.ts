import { Intents, Options } from 'discord.js'
import type { ClientOptions } from 'discord.js'

const clientOptions: ClientOptions = {
    partials: ['CHANNEL', 'MESSAGE'],
    intents: [Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILDS],
    restGlobalRateLimit: 50,
    shards: 'auto',
    presence: {
        status: 'online',
        activities: [
            {
                name: 'Inspecting messages...',
                type: 'PLAYING'
            }
        ]
    },
    makeCache: Options.cacheWithLimits({
        BaseGuildEmojiManager: 0,
        GuildBanManager: 0,
        GuildMemberManager: 0,
        PresenceManager: 0,
        ReactionManager: 0,
        ReactionUserManager: 0,
        StageInstanceManager: 0,
        ThreadManager: 0,
        ThreadMemberManager: 0,
        UserManager: 0,
        VoiceStateManager: 0,
        MessageManager: 100
    })
}

export { clientOptions as ClientOptions }
