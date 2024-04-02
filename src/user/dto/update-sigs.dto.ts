import { IsNumber } from 'class-validator';

export class UpdateSigsDTO {
  @IsNumber({}, { each: true })
  sigIds: number[];
}
