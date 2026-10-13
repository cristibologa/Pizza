import { createParamDecorator, ExecutionContext } from '@nestjs/common';

import type { Session } from '@/modules/sessions/session.entity';

import { getRequest } from '../helpers';

export const CurrentSession = createParamDecorator(
  (field: keyof Session | undefined, context: ExecutionContext) => {
    const request = getRequest(context);
    const session = request.session;

    if (!field) return session;

    return session?.[field];
  }
);
