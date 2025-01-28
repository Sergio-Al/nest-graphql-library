import {
  Resolver,
  Query,
  Mutation,
  Args,
  Int,
  ID,
  ResolveField,
} from '@nestjs/graphql';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { UpdateUserInput } from './dto/update-user.input';
import { ParseUUIDPipe, UseGuards } from '@nestjs/common';
import { SignupInput } from 'src/auth/dto/inputs/signup.input';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { UpdateRoleInput } from './dto/update-role.input';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { ValidRoles } from 'src/auth/enums/valid-roles.enum';

@Resolver(() => User)
@UseGuards(JwtAuthGuard)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Mutation(() => User)
  createUser(@Args('createUserInput') signupInput: SignupInput) {
    return this.usersService.create(signupInput);
  }

  @Query(() => [User], { name: 'users' })
  findAll() {
    return this.usersService.findAll();
  }

  @Query(() => User, { name: 'user' })
  findOne(@Args('id', { type: () => ID }, ParseUUIDPipe) id: string) {
    return this.usersService.findOne(id);
  }

  @Mutation(() => User)
  updateUser(@Args('updateUserInput') updateUserInput: UpdateUserInput) {
    return this.usersService.update(updateUserInput.id, updateUserInput);
  }

  @Mutation(() => User, {
    name: 'updateUserRole',
    description: `Roles allowed: ${ValidRoles.superAdmin} This mutation is used to update the role of a user`,
  })
  updateUserRole(
    @CurrentUser([ValidRoles.superAdmin]) user: User,
    @Args('updateInput') updateRoleInput: UpdateRoleInput,
  ) {
    return this.usersService.updateUserRole(updateRoleInput, user);
  }

  @Mutation(() => User)
  removeUser(@Args('id', { type: () => ID }, ParseUUIDPipe) id: string) {
    return this.usersService.remove(id);
  }

  @ResolveField(() => Number, { name: 'totalUsers' })
  totalUsers() {
    return this.usersService.totalUsers();
  }
}
