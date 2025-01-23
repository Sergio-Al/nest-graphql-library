import { registerEnumType } from '@nestjs/graphql';

export enum ValidStatuses {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

registerEnumType(ValidStatuses, {
  name: 'ValidStatuses',
  description: 'Valid order statuses',
});
