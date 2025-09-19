import type { CollectionConfig } from 'payload';
import { isAdmin, isFieldAdmin, isAdminOrSelf } from '../access/isAdmin';

export const Users: CollectionConfig = {
    // Collection for users
    slug: 'users',
    admin: {
        useAsTitle: 'email',
    },
    auth: true,
    // Any user can update themselves, admin updates all
    access: {
        create: isAdminOrSelf,
        update: isAdminOrSelf,
        read: isAdminOrSelf,
        delete: isAdmin,
    },
    fields: [
        {
            name: 'email',
            type: 'email',
            required: true,
        },
        {
            name: 'roles',
            type: 'select',
            hasMany: true,
            options: [
                {
                    label: 'Admin',
                    value: 'admin',
                },
                {
                    label: 'Open Source',
                    value: 'open-source',
                },
                {
                    label: 'Events',
                    value: 'events',
                },
                {
                    label: 'Sponsorships',
                    value: 'sponsorships',
                },
                {
                    label: 'Gallery',
                    value: 'gallery',
                },
                {
                    label: 'Discord Moderator',
                    value: 'discord-mod',
                },
                {
                    label: 'Committee Manager',
                    value: 'committee-manager',
                },
                {
                    label: 'Exec',
                    value: 'exec',
                },
            ],
            // Only admins can add or change roles
            access: {
                create: isFieldAdmin,
                update: isFieldAdmin,
            },
            admin: {
                description: 'Users can have one or many roles',
            },
        },
    ],
};
