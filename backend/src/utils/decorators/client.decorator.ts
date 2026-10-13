import { createParamDecorator, ExecutionContext } from '@nestjs/common';

import { ClientType } from '@/modules/sessions';

import { getRequest } from '../helpers';

export const Client = createParamDecorator((_, context: ExecutionContext) => {
  const request = getRequest(context);
  const xApplication = request.headers['x-application'];

  const isClientType = Object.values(ClientType).includes(xApplication as ClientType);

  return isClientType ? (xApplication as ClientType) : ClientType.WEB;
});
