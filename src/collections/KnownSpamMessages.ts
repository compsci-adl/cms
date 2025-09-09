import { isDiscordMod } from '@/access/isDiscordMod';
import type { CollectionConfig } from 'payload';

export const KnownSpamMessages: CollectionConfig = {
    slug: 'known-spam-messages',
    admin: {
        useAsTitle: 'message',
        description: 'Please upload messages that are known to be spam so they can be automatically filtered out on Discord using DuckBot.',
    },
    fields: [
        {
            name: 'message',
            type: 'text',
            required: true,
        },
    ],
    access: {
        create: isDiscordMod,
        update: isDiscordMod,
        delete: isDiscordMod,
        read: () => true,
    },
    versions: {
        drafts: true,
    },
};
