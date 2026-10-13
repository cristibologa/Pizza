import { ApiProperty } from '@nestjs/swagger';

export class ErrorResponse {
  @ApiProperty({ description: 'Статус запроса', example: false, enum: [false] })
  success: false;

  @ApiProperty({ description: 'Причина ошибки', example: 'Не авторизован' })
  reason: string;
}
