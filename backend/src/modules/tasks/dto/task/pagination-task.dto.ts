import { IsBoolean, IsEnum, IsOptional } from "class-validator";
import { PaginationDto } from "../../../../common/dto/pagination.dto";
import { Transform } from "class-transformer";

export enum SortOrder {
  ASC = 'ASC',
  DESC = 'DESC'
}

export enum StatusFilter {
  ALL = 'ALL',
  COMPLETED = 'COMPLETED',
  PENDING = 'PENDING'
}

export class PaginationTaskDto extends PaginationDto {
    @IsOptional()
    @IsEnum(SortOrder)
    orderBy?: SortOrder;

    @IsOptional()
    @IsEnum(StatusFilter)
    status?: StatusFilter;

    @IsOptional()
    @IsBoolean()
    @Transform(( { value } ) => value === 'true' || value === true)
    sortByPriority?: boolean;
}