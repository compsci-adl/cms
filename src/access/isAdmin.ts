import { Access, FieldAccess } from 'payload';
import { User } from '../payload-types';

export const isAdmin: Access<User> = ({ req: { user } }) => {
    // Return if 'admin' is a part of users roles
    return Boolean(user?.roles?.includes('admin'));
};

export const isFieldAdmin: FieldAccess<{ id: string }, User> = ({ req: { user } }) => {
    // Return if 'admin' is a part of users roles (used for fields)
    return Boolean(user?.roles?.includes('admin'));
};

export const isAdminOrSelf: Access<User> = ({ req: { user } }) => {
    // If user exists and is admin or editing user id (itself)
    if (user) {
        if (user?.roles?.includes('admin')) {
            return true;
        }

        return {
            id: {
                equals: user.id,
            },
        };
    }

    return false;
};
