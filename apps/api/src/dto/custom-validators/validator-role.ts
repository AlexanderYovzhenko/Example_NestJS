import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { Roles } from '@app/shared/enums';

export const roles = Object.keys(Roles)
  .filter((key: string) => isNaN(Number(key)) && key.toLowerCase() !== 'admin')
  .map((role: string) => role.toLowerCase());

@ValidatorConstraint({ name: 'ValidatorRole', async: false })
export class CustomValidatorRole implements ValidatorConstraintInterface {
  validate(text: string, args: ValidationArguments) {
    return roles.includes(args.value);
  }

  defaultMessage(args: ValidationArguments) {
    return `Role ${args.value} is not correct. Role should be one of ${roles}`;
  }
}
