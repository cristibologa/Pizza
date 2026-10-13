import { Controller, Get, Render } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { OtpsService } from './modules/otps';

@ApiTags('📃 pages')
@Controller()
export class AppController {
  constructor(private readonly otpsService: OtpsService) {}

  @ApiOperation({ summary: 'страница с отп кодами' })
  @Get('/otps')
  @Render('otps.hbs')
  async otps() {
    const otps = await this.otpsService.findMany();

    return {
      otps: otps.map((otp) => ({
        phone: otp.phone,
        code: otp.code,
        expiresAt: otp.expiresAt
      }))
    };
  }
}
