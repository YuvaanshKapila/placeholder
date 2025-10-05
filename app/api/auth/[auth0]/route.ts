import { AuthClient } from '@auth0/nextjs-auth0/server';

const auth0 = new AuthClient();

export const GET = auth0.handleAuth();
