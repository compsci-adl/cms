import { Access, FieldAccess } from 'payload';
import { User } from '../payload-types';

export const isExec: Access<User> = ({ req: { user } }) => {
    // Return if 'exec' is a part of users roles
    return Boolean(user?.roles?.some((role) => role === 'exec' || role === 'admin'));
};

export const isFieldExec: FieldAccess<{ id: string }, User> = ({ req: { user } }) => {
    // Return if 'exec' is a part of users roles (used for fields)
    return Boolean(user?.roles?.some((role) => role === 'exec' || role === 'admin'));
};
