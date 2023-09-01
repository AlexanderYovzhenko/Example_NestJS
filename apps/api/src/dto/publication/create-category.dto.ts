import { IsString, Length, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import {
  PUBLICATION_CATEGORY_SHOULD_BE_LENGTH,
  PUBLICATION_CATEGORY_SHOULD_BE_STRING,
  PUBLICATION_IS_NEWS_SHOULD_BE_BOOLEAN,
} from '@app/shared/constants';

export class CreateCategoryDto {
  @ApiProperty({
    example: 'IT',
    description: 'publication category',
  })
  @IsString({ message: PUBLICATION_CATEGORY_SHOULD_BE_STRING })
  @Length(2, 50, { message: PUBLICATION_CATEGORY_SHOULD_BE_LENGTH })
  readonly value?: string;

  @ApiProperty({
    example: false,
    description: 'category flag is news',
  })
  @IsBoolean({ message: PUBLICATION_IS_NEWS_SHOULD_BE_BOOLEAN })
  readonly is_news: boolean;
}
