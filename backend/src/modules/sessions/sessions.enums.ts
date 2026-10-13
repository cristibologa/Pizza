import { registerEnumType } from '@nestjs/graphql';

export enum ClientType {
  WEB = 'web',
  MOBILE = 'mobile'
}

registerEnumType(ClientType, { name: 'ClientType', description: 'Тип клиента' });
