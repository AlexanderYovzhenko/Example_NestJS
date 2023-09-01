import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString, Max, Min } from 'class-validator';
import { ToBoolean } from '../custom-validators/transform-boolean';
import {
  PUBLICATIONS_MAXIMUM_LIMIT,
  PUBLICATION_AUTHOR_SHOULD_BE_STRING,
  QUERY_LIMIT_MAX,
  QUERY_LIMIT_MIN,
  QUERY_LIMIT_SHOULD_BE_NUMBER,
  QUERY_OFFSET_MIN,
  QUERY_OFFSET_SHOULD_BE_NUMBER,
} from '@app/shared/constants';

export class GetPublicationsQueryDto {
  @ApiProperty({
    example: 50,
    description: 'limit publications',
    required: false,
  })
  @IsOptional()
  @IsInt({ message: QUERY_LIMIT_SHOULD_BE_NUMBER })
  @Min(0, { message: QUERY_LIMIT_MIN + 0 })
  @Max(PUBLICATIONS_MAXIMUM_LIMIT, {
    message: QUERY_LIMIT_MAX + PUBLICATIONS_MAXIMUM_LIMIT,
  })
  readonly limit?: number;

  @ApiProperty({
    example: 0,
    description: 'offset publications',
    required: false,
  })
  @IsOptional()
  @IsInt({ message: QUERY_OFFSET_SHOULD_BE_NUMBER })
  @Min(0, { message: QUERY_OFFSET_MIN + 0 })
  readonly offset?: number;

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
