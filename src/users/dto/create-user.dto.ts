import {
  IsBoolean,
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty({
    message: 'Name is required',
  })
  @IsString({
    message: 'Name must be a string',
  })
  name: string;

  @IsString({
    message: 'Email must be a string',
  })
  email: string;

  @IsString({
    message: 'Favorite Word Phrase must be a string',
  })
  favoriteWordPhrase: string;

  @IsString()
  @MinLength(4)
  @MaxLength(20)
  password: string;

  @IsString()
  @IsNotEmpty({ message: 'Date birth is required' })
  @Matches(/^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/, { message: 'Invalid date format (dd/mm/yyyy)' })
  birthDate: string;

}
