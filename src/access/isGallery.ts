import { Access, FieldAccess } from 'payload';
import { User } from '../payload-types';

export const isGallery: Access<User> = ({ req: { user } }) => {
    // Return if 'gallery' is a part of users roles
    return Boolean(user?.roles?.some((role) => role === 'gallery' || role === 'admin'));
};

export const isFieldGallery: FieldAccess<{ id: string }, User> = ({ req: { user } }) => {
    // Return if 'gallery' is a part of users roles (used for fields)
    return Boolean(user?.roles?.some((role) => role === 'gallery' || role === 'admin'));
};
