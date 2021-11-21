import type { PermissionString } from 'discord.js'

export function formatPermissions(permissions: PermissionString[]): string[] {
    return permissions.map((perm: string): string =>
        perm
            .toLowerCase()
            .split('_')
            .map((word: string): string => word[0].toUpperCase() + word.slice(1))
            .join(' ')
    )
}
