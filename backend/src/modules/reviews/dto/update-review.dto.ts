import { IsOptional, IsBoolean } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { PartialType, OmitType } from '@nestjs/mapped-types';
import { CreateReviewDto } from './create-review.dto';

export class UpdateReviewDto extends PartialType(
  OmitType(CreateReviewDto, ['productId'] as const)
) {
  @ApiPropertyOptional({ description: 'Status de aprovação (apenas admin)' })
  @IsOptional()
  @IsBoolean()
  isApproved?: boolean;
}
