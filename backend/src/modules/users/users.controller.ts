import { Body, Controller, Get, Patch } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse
} from '@nestjs/swagger';

import { ErrorResponse } from '@/utils/base';
import { CurrentUser } from '@/utils/decorators';
import { AuthorizedOnly } from '@/utils/guards';
import { Result } from '@/utils/helpers';

import { UpdateProfileDto } from './dto';
import { GetProfileResponse, UpdateProfileResponse } from './responses';
import { User } from './user.entity';
import { UsersService } from './users.service';

@ApiTags('💂‍♂️ users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiBadRequestResponse({
    type: ErrorResponse,
    description:
      'Пользователь не найден, пользователь не существует или некорректные данные запроса'
  })
  @ApiOperation({ summary: 'Обновить профиль пользователя' })
  @ApiResponse({
    type: UpdateProfileResponse,
    description: 'update profile',
    status: 200
  })
  @ApiUnauthorizedResponse({
    type: ErrorResponse,
    description: 'Не авторизован'
  })
  @Patch('/profile')
  @AuthorizedOnly()
  async updateProfile(
    @Body() updateProfileDto: UpdateProfileDto,
    @CurrentUser() user: User
  ): Promise<UpdateProfileResponse> {
    return this.usersService.updateProfile(user._id, updateProfileDto);
  }

  @ApiBadRequestResponse({
    type: ErrorResponse,
    description: 'Пользователь не найден'
  })
  @ApiOperation({ summary: 'Получить профиль пользователя' })
  @ApiResponse({
    type: GetProfileResponse,
    description: 'get profile',
    status: 200
  })
  @ApiUnauthorizedResponse({
    type: ErrorResponse,
    description: 'Не авторизован'
  })
  @Get('/profile')
  @AuthorizedOnly()
  async getProfile(@CurrentUser() user: User): Promise<GetProfileResponse> {
    return Result.success({ user });
  }
}
