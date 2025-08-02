import { Access, FieldAccess } from 'payload';
import { User } from '../payload-types';

export const isOpenSource: Access<User> = ({ req: { user } }) => {
    // Return if 'open-source' is a part of users roles
    return Boolean(user?.roles?.some((role) => role === 'open-source' || role === 'admin'));
};

export const isFieldOpenSource: FieldAccess<{ id: string }, User> = ({ req: { user } }) => {
    // Return if 'open-source' is a part of users roles (used for fields)
    return Boolean(user?.roles?.some((role) => role === 'open-source' || role === 'admin'));
};
