import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';

import { CurrentUser } from '@/utils/decorators';
import { AuthorizedOnly } from '@/utils/guards';
import { Result } from '@/utils/helpers';

import { UpdateProfileDto } from './dto';
import { GetProfileResponse, UpdateProfileResponse } from './responses';
import { User } from './user.entity';
import { UsersService } from './users.service';

@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Mutation(() => UpdateProfileResponse)
  @AuthorizedOnly()
  async updateProfile(
    @Args() updateProfileDto: UpdateProfileDto,
    @CurrentUser() user: User
  ): Promise<UpdateProfileResponse> {
    return this.usersService.updateProfile(user._id, updateProfileDto);
  }

  @Query(() => GetProfileResponse)
  @AuthorizedOnly()
  async getProfile(@CurrentUser() user: User): Promise<GetProfileResponse> {
    return Result.success({ user });
  }
}
