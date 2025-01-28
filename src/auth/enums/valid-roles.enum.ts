import { registerEnumType } from '@nestjs/graphql';

export enum ValidRoles {
  admin = 'admin',
  user = 'user',
  guest = 'guest',
  superAdmin = 'super-admin',
}

registerEnumType(ValidRoles, {
  name: 'ValidRoles',
  description: 'Valid user roles',
});
