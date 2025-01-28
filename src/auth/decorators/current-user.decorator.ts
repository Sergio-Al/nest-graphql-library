import {
  createParamDecorator,
  ExecutionContext,
  ForbiddenException,
  InternalServerErrorException,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { User } from 'src/users/entities/user.entity';
import { ValidRoles } from '../enums/valid-roles.enum';

export const CurrentUser = createParamDecorator(
  (roles: ValidRoles[] = [], context: ExecutionContext) => {
    const ctx = GqlExecutionContext.create(context);
    const user: User = ctx.getContext().req.user;

    if (!user) {
      throw new InternalServerErrorException(
        'User not found, please check your request and the use of Guards',
      );
    }

    if (roles.length === 0) {
      return user;
    }

    const hasRole = roles.some((role) => user.role.includes(role));

    if (!hasRole) {
      throw new ForbiddenException(
        'You do not have permission to access this resource',
      );
    }

    return user;
  },
);
