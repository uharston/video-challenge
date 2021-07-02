
import { IsBoolean, IsString } from 'class-validator';

export class ToggleVisibilityDto {
  @IsString()
  readonly hashed_id: string;

  @IsBoolean() 
  readonly active: boolean;
}
