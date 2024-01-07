import { PagemegaInterface } from '../pagemega.interface';
import { ApiProperty } from '@nestjs/swagger';

export class PageMegaDto {
  @ApiProperty()
  readonly page: number;

  @ApiProperty()
  readonly take: number;

  @ApiProperty()
  readonly itemCount: number;

  @ApiProperty()
  readonly pageCount: number;

  @ApiProperty()
  readonly hasprevious: boolean;

  @ApiProperty()
  readonly hasnext: boolean;

  constructor({ pageOptionDto, itemCount }: PagemegaInterface) {
    this.page = pageOptionDto.page;
    this.take = pageOptionDto.take;
    this.itemCount = itemCount;
    this.pageCount = Math.ceil(this.itemCount / this.take);
    this.hasprevious = this.page > 1;
    this.hasnext = this.page < this.pageCount;
  }
}
