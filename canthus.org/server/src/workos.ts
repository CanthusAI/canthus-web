// Centralized WorkOS client singleton
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { WorkOS } = require('@workos-inc/node');
import { WorkOS as WorkOSType } from '@workos-inc/node';

export const workos: WorkOSType = new WorkOS(process.env.WORKOS_API_KEY, {
    clientId: process.env.WORKOS_CLIENT_ID,
});


