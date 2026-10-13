import { Session } from '@/modules/sessions';
import { User } from '@/modules/users';

import 'fastify';

declare module 'fastify' {
  interface FastifyRequest {
    session?: Session;
    user?: User;
  }
}
