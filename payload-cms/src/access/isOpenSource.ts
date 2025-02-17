import { Access, Field, FieldAccess } from 'payload';
import { User } from '../payload-types';

export const isOpenSource: Access<User> = ({ req: { user } }) => {
    // Return if 'openSource' is a part of users roles
    return Boolean(user?.roles?.includes('openSource'));
};

export const isFieldOpenSource: FieldAccess<{ id: string }, User> = ({ req: { user } }) => {
    // Return if 'openSource' is a part of users roles (used for fields)
    return Boolean(user?.roles?.includes('openSource'));
};
