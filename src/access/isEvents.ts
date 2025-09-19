import { Access, FieldAccess } from 'payload';
import { User } from '../payload-types';

export const isEvents: Access<User> = ({ req: { user } }) => {
    // Return if 'events' is a part of users roles
    return Boolean(user?.roles?.some((role) => role === 'events' || role === 'admin'));
};

export const isFieldEvents: FieldAccess<{ id: string }, User> = ({ req: { user } }) => {
    // Return if 'events' is a part of users roles (used for fields)
    return Boolean(user?.roles?.some((role) => role === 'events' || role === 'admin'));
};
