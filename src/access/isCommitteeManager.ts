import { Access, FieldAccess } from 'payload';
import { User } from '../payload-types';

export const isCommitteeManager: Access<User> = ({ req: { user } }) => {
    // Return if 'committee-manager' is a part of users roles
    return Boolean(user?.roles?.some((role) => role === 'committee-manager' || role === 'admin'));
};

export const isFieldCommitteeManager: FieldAccess<{ id: string }, User> = ({ req: { user } }) => {
    // Return if 'committee-manager' is a part of users roles (used for fields)
    return Boolean(user?.roles?.some((role) => role === 'committee-manager' || role === 'admin'));
};
