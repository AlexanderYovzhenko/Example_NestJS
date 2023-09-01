import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, MinLength, IsDefined } from 'class-validator';
import { ToBoolean } from '../custom-validators/transform-boolean';
import {
  PUBLICATION_AUTHOR_SHOULD_BE_STRING,
  QUERY_SEARCH_SHOULD_BE,
  QUERY_SEARCH_SHOULD_BE_LENGTH,
} from '@app/shared/constants';

export class SearchPublicationsQueryDto {
  @ApiProperty({
    example: 'title',
    description: 'title publication',
    required: true,
  })
  @IsDefined({ message: QUERY_SEARCH_SHOULD_BE })
  @MinLength(3, { message: QUERY_SEARCH_SHOULD_BE_LENGTH })
  readonly search: string;

  @ApiProperty({
    example: false,
    description: 'is_news publications',
    required: false,
  })
  @IsOptional()
  @ToBoolean()
  readonly is_news?: boolean;

  @ApiProperty({
    example: false,
    description: 'is_hidden publications',
    required: false,
  })
  @IsOptional()
  @ToBoolean()
  readonly is_hidden?: boolean;

  @ApiProperty({
    example: true,
    description: 'first new publications',
    required: false,
  })
  @IsOptional()
  @ToBoolean()
  readonly is_first_new?: boolean;

  @ApiProperty({
    example: ['IT'],
    description: 'publications categories',
    required: false,
  })
  @IsOptional()
  readonly categories?: string[];

  @ApiProperty({
    example: 'nickname',
    description: 'publications author',
    required: false,
  })
  @IsOptional()
  @IsString({ message: PUBLICATION_AUTHOR_SHOULD_BE_STRING })
  readonly author?: string;
}
