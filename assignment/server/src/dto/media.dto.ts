import { IsString, IsInt,  } from 'class-validator';

export class MediaDto {
  @IsInt()
  readonly id: number;
  @IsString()
  readonly name: string;
  @IsString()
  readonly type: string;
  @IsString()
  readonly hashed_id: string;
}