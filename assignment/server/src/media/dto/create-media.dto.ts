
import { IsString } from 'class-validator';

export class CreateMediaDto {
  @IsString()
  readonly name: string;
  @IsString()
  readonly type: string;
  @IsString()
  readonly hashed_id: string;
}
