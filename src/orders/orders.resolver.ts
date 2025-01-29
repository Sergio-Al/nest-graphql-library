import { Resolver, Query, Mutation, Args, Int, ID } from '@nestjs/graphql';
import { OrdersService } from './orders.service';
import { Order } from './entities/order.entity';
import { CreateOrderInput } from './dto/create-order.input';
import { UpdateOrderInput } from './dto/update-order.input';
import { ParseUUIDPipe, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { ValidRoles } from 'src/auth/enums/valid-roles.enum';
import { User } from 'src/users/entities/user.entity';

@Resolver(() => Order)
@UseGuards(JwtAuthGuard)
export class OrdersResolver {
  constructor(private readonly ordersService: OrdersService) {}

  @Mutation(() => Order, {
    name: 'createOrder',
    description: `Roles allowed: ${ValidRoles.user} This mutation is used to create a new order`,
  })
  createOrder(
    @Args('createOrderInput') createOrderInput: CreateOrderInput,
    @CurrentUser([ValidRoles.user]) user: User,
  ): Promise<Order> {
    return this.ordersService.create(createOrderInput);
  }

  @Query(() => [Order], { name: 'orders' })
  findAll(): Promise<Order[]> {
    return this.ordersService.findAll();
  }

  @Query(() => Order, { name: 'order' })
  findOne(
    @Args('id', { type: () => ID }, ParseUUIDPipe) id: string,
  ): Promise<Order> {
    return this.ordersService.findOne(id);
  }

  @Mutation(() => Order, {
    name: 'updateOrder',
    description: `Roles allowed: ${ValidRoles.user} This mutation is used to update an order`,
  })
  updateOrder(
    @Args('updateOrderInput') updateOrderInput: UpdateOrderInput,
    @CurrentUser([ValidRoles.user]) user: User,
  ) {
    return this.ordersService.update(updateOrderInput.id, updateOrderInput);
  }

  @Mutation(() => Order, {
    name: 'removeOrder',
    description: `Roles allowed: ${ValidRoles.user} This mutation is used to remove an order`,
  })
  removeOrder(
    @Args('id', { type: () => ID }, ParseUUIDPipe) id: string,
    @CurrentUser([ValidRoles.user]) user: User,
  ) {
    return this.ordersService.remove(id);
  }
}
