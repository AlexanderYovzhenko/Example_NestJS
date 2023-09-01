import { SetMetadata } from '@nestjs/common';

export const Roles = (...roles: string[]) =>
  SetMetadata(
    'roles',
    roles.map((role: string) => role.toLowerCase()),
  );
