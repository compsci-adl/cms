import type { NextAuthConfig } from 'next-auth';
import Keycloak from 'next-auth/providers/keycloak';

export const authConfig: NextAuthConfig = {
  providers: [Keycloak],
};
