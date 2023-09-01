import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';

@ValidatorConstraint({ name: 'string-or-number', async: false })
export class IsNumberOrString implements ValidatorConstraintInterface {
  validate(text: unknown, args: ValidationArguments) {
    return typeof args.value === 'number' || typeof args.value === 'string';
  }

  defaultMessage(args: ValidationArguments) {
    return `${args.value} must be number or string`;
  }
}
