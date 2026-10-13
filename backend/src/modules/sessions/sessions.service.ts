import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { BaseService } from '@/utils/base';

import { SessionEntitySchema } from './session.schema';

@Injectable()
export class SessionsService extends BaseService<SessionEntitySchema> {
  constructor(
    @InjectModel(SessionEntitySchema.name) private readonly sessionModel: Model<SessionEntitySchema>
  ) {
    super(sessionModel);
  }
}
