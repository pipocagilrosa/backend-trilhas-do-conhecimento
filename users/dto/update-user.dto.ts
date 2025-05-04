import {
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
  registerDecorator,
} from 'class-validator';
import * as moment from 'moment';

// Custom validator to check if the user is at least 18 years old
@ValidatorConstraint({ name: 'isAdult', async: false })
export class IsAdultConstraint implements ValidatorConstraintInterface {
  validate(birthDate: string, args: ValidationArguments) {
    const date = moment(birthDate, 'DD/MM/YYYY');
    return date.isValid() && moment().diff(date, 'years') >= 18;
  }

  defaultMessage(args: ValidationArguments) {
    return 'User must be at least 18 years old';
  }
}

export function IsAdult(validationOptions?: any) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsAdultConstraint,
    });
  };
}


export class UpdateUserDto {

  @IsNotEmpty({ message: 'Name is required' })
  @IsString({
    message: 'Name must be a string',
  })
  @Matches(/^[a-zA-Z\s]*$/, { message: 'Name cannot contain special characters' })
  name?: string;

  @IsOptional()
  @IsString({
    message: 'Favorite Word Phrase must be a string',
  })
  @Matches(/^[a-zA-Z\s]*$/, { message: 'Favorite Word cannot contain special characters' })
  favoriteWordPhrase?: string;

  @IsNotEmpty({ message: 'Date of birth is required' })
  @IsString()
  @Matches(/^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/, { message: 'Invalid date format (dd/mm/yyyy)' })
  @IsAdult({ message: 'User must be at least 18 years old' })
  birthDate: string;

}

