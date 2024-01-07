import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { IsEnum, IsOptional, IsInt, Min, Max } from 'class-validator';
import { Orderconstraint } from '../orderConstraint/orderconstraint';
import { Type } from 'class-transformer';

export class PageOptionDto {
  @ApiPropertyOptional({
    enum: Orderconstraint,
    default: Orderconstraint.ASC,
  })
  @IsEnum(Orderconstraint)
  @IsOptional()
  readonly order?: Orderconstraint = Orderconstraint.ASC;

  @ApiPropertyOptional({
    minimum: 1,
    default: 1,
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  readonly page?: number = 1;

  @ApiProperty({
    minimum: 1,
    default: 10,
    maximum: 50,
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(50)
  @IsOptional()
  readonly take?: number = 10;

  get skip(): number {
    return (this.page - 1) * this.take;
  }
}
