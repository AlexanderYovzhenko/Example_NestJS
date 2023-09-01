import { IsBoolean, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { CreatePublicationDto } from './create-publication.dto';
import { PUBLICATION_IS_HIDDEN_SHOULD_BE_BOOLEAN } from '@app/shared/constants';

export class UpdatePublicationDto extends CreatePublicationDto {
  @ApiProperty({
    example: '<p>publication text<p>',
    description: 'publication content',
    required: false,
  })
  @IsOptional()
  readonly content: string;

  @ApiProperty({
    example:
      'https://images.unsplash.com/photo-1541963463532-d68292c34b19?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=688&q=80',
    description: 'publication preview',
    required: false,
  })
  @IsOptional()
  readonly preview: string;

  @ApiProperty({
    example: false,
    description: 'publication flag is hidden',
    required: false,
  })
  @IsOptional()
  @IsBoolean({ message: PUBLICATION_IS_HIDDEN_SHOULD_BE_BOOLEAN })
  readonly is_hidden?: boolean;

  @ApiProperty({
    example: 1,
    description: 'publication category id',
    required: false,
  })
  @IsOptional()
  readonly category_id: number;
}
