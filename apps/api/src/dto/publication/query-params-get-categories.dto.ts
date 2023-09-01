import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { ToBoolean } from '../custom-validators/transform-boolean';

export class GetCategoriesQueryDto {
  @ApiProperty({
    example: false,
    description: 'is_news categories',
    required: false,
  })
  @IsOptional()
  @ToBoolean()
  readonly is_news?: boolean;
}
