import { Body, Controller, Post } from '@nestjs/common';
import { ApiBadRequestResponse, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { ErrorResponse } from '@/utils/base';

import { OtpsService } from '../otps';
import { CreateOtpDto } from './dto';
import { CreateOtpResponse } from './responses';

@ApiTags('🔑 otps')
@Controller('otps')
export class OtpsController {
  constructor(private readonly otpsService: OtpsService) {}

  @ApiBadRequestResponse({
    type: ErrorResponse,
    description: 'Некорректные данные запроса'
  })
  @ApiOperation({ summary: 'Создание отп кода' })
  @ApiResponse({
    type: CreateOtpResponse,
    description: 'create otp',
    status: 200
  })
  @Post('/otp')
  async createOtp(@Body() createOtpDto: CreateOtpDto): Promise<CreateOtpResponse> {
    return this.otpsService.createOtp(createOtpDto);
  }
}
