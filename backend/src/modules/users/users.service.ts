import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import { BaseService } from '@/utils/base';
import { Result } from '@/utils/helpers';

import { UpdateProfileDto } from './dto';
import { UpdateProfileResponse } from './responses';
import { UserEntitySchema } from './user.schema';

@Injectable()
export class UsersService extends BaseService<UserEntitySchema> {
  constructor(@InjectModel(UserEntitySchema.name) private userModel: Model<UserEntitySchema>) {
    super(userModel);
  }

  async updateProfile(
    id: Types.ObjectId,
    updateProfileDto: UpdateProfileDto
  ): Promise<UpdateProfileResponse> {
    const updatedUser = await this.updateById(id, updateProfileDto);

    if (!updatedUser) {
      throw new BadRequestException(Result.fail('Пользователь не существует'));
    }

    return Result.success({ user: updatedUser });
  }

  async findOrCreateUser(phone: string) {
    let user = await this.findOne({ phone });

    if (!user) {
      user = await this.create({ phone });
    }

    return user;
  }
}
