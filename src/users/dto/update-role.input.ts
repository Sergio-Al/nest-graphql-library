import { Field, ID, InputType } from '@nestjs/graphql';
import { IsArray, IsUUID } from 'class-validator';
import { ValidRoles } from 'src/auth/enums/valid-roles.enum';

@InputType()
export class UpdateRoleInput {
  @Field(() => ID)
  @IsUUID()
  id: string;

  @Field(() => [ValidRoles])
  @IsArray()
  roles: ValidRoles[];
}
