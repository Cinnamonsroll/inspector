import { PermissionString } from 'discord.js'

export function formatPermissions(permissions: PermissionString[]): string[] {
    return permissions.map((perm) =>
        perm
            .toLowerCase()
            .split('_')
            .map((word) => word[0].toUpperCase() + word.slice(1))
            .join(' ')
    )
}
