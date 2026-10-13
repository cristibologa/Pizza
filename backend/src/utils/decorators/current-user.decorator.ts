import { createParamDecorator, ExecutionContext } from '@nestjs/common';

import { User } from '@/modules/users';

import { getRequest } from '../helpers';

export const CurrentUser = createParamDecorator(
  (field: keyof User | undefined, context: ExecutionContext) => {
    const request = getRequest(context);
    const user = request.user;

    if (!field) return user;

    return user?.[field];
  }
);
