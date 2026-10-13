import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { UserEntitySchema, UserSchema } from './user.schema';
import { UsersController } from './users.controller';
import { UsersResolver } from './users.resolver';
import { UsersService } from './users.service';

@Module({
  controllers: [UsersController],
  exports: [UsersService],
  imports: [MongooseModule.forFeature([{ name: UserEntitySchema.name, schema: UserSchema }])],
  providers: [UsersService, UsersResolver]
})
export class UsersModule {}
