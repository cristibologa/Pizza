import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { SessionEntitySchema, SessionSchema } from './session.schema';
import { SessionsService } from './sessions.service';

@Module({
  exports: [SessionsService],
  imports: [MongooseModule.forFeature([{ name: SessionEntitySchema.name, schema: SessionSchema }])],
  providers: [SessionsService]
})
export class SessionsModule {}
