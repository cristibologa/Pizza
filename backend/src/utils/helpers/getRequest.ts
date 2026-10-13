import { ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { FastifyRequest } from 'fastify';

export const getRequest = (context: ExecutionContext): FastifyRequest => {
  if (context.getType<'graphql' | 'http'>() === 'graphql') {
    const gqlContext = GqlExecutionContext.create(context);
    return gqlContext.getContext().req;
  }

  return context.switchToHttp().getRequest<FastifyRequest>();
};
