import { Access, Field, FieldAccess } from "payload";
import {User} from "../payload-types"

export const isSponsorship: Access<User> = ({ req: { user }}) => {
    // Return if 'sponsorships' is a part of users roles
    return Boolean(user?.roles?.includes('sponsorships'));
}

export const isFieldSponsorship: FieldAccess<{id: string}, User> = ({req: { user } }) => {
    // Return if 'sponsorships' is a part of users roles (used for fields)
    return Boolean(user?.roles?.includes('sponsorships'));
}