import { Access, FieldAccess } from 'payload';
import { User } from '../payload-types';

export const isDiscordMod: Access<User> = ({ req: { user } }) => {
    // Return if 'discordMod' is a part of users roles
    return Boolean(user?.roles?.some((role) => role === 'discordMod' || role === 'admin'));
};

export const isFieldDiscordMod: FieldAccess<{ id: string }, User> = ({ req: { user } }) => {
    // Return if 'discordMod' is a part of users roles (used for fields)
    return Boolean(user?.roles?.some((role) => role === 'discordMod' || role === 'admin'));
};
