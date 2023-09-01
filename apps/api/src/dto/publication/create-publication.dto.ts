import { IsNumber, IsOptional, IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import {
  PUBLICATION_CATEGORY_ID_SHOULD_BE_NUMBER,
  PUBLICATION_CONTENT_SHOULD_BE_STRING,
  PUBLICATION_PREVIEW_SHOULD_BE_STRING,
  PUBLICATION_TITLE_SHOULD_BE_LENGTH,
  PUBLICATION_TITLE_SHOULD_BE_STRING,
} from '@app/shared/constants';

export class CreatePublicationDto {
  @ApiProperty({
    example: 'title',
    description: 'publication title',
    required: false,
  })
  @IsOptional()
  @IsString({ message: PUBLICATION_TITLE_SHOULD_BE_STRING })
  @Length(3, 100, { message: PUBLICATION_TITLE_SHOULD_BE_LENGTH })
  readonly title?: string;

  @ApiProperty({
    example: '<p>publication text<p>',
    description: 'publication content',
  })
  @IsString({ message: PUBLICATION_CONTENT_SHOULD_BE_STRING })
  readonly content: string;

  @ApiProperty({
    example:
      'https://images.unsplash.com/photo-1541963463532-d68292c34b19?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=688&q=80',
    description: 'publication preview',
  })
  @IsString({ message: PUBLICATION_PREVIEW_SHOULD_BE_STRING })
  readonly preview: string;

  @ApiProperty({
    example: 1,
    description: 'publication category id',
  })
  @IsNumber({}, { message: PUBLICATION_CATEGORY_ID_SHOULD_BE_NUMBER })
  readonly category_id: number;
}
