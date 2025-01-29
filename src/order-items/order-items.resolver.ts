import { Resolver, Query, Mutation, Args, Int, ID } from '@nestjs/graphql';
import { OrderItemsService } from './order-items.service';
import { OrderItem } from './entities/order-item.entity';
import { CreateOrderItemInput } from './dto/create-order-item.input';
import { UpdateOrderItemInput } from './dto/update-order-item.input';
import { ParseUUIDPipe, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { ValidRoles } from 'src/auth/enums/valid-roles.enum';
import { User } from 'src/users/entities/user.entity';

@Resolver(() => OrderItem)
@UseGuards(JwtAuthGuard)
export class OrderItemsResolver {
  constructor(private readonly orderItemsService: OrderItemsService) {}

  @Mutation(() => OrderItem, {
    name: 'createOrderItem',
    description: `Roles allowed: ${ValidRoles.user} This mutation is used to create a new order item`,
  })
  createOrderItem(
    @Args('createOrderItemInput') createOrderItemInput: CreateOrderItemInput,
    @CurrentUser([ValidRoles.user]) user: User,
  ) {
    return this.orderItemsService.create(createOrderItemInput);
  }

  @Query(() => [OrderItem], { name: 'orderItems' })
  findAll() {
    return this.orderItemsService.findAll();
  }

  @Query(() => OrderItem, { name: 'orderItem' })
  findOne(@Args('id', { type: () => ID }, ParseUUIDPipe) id: string) {
    return this.orderItemsService.findOne(id);
  }

  @Mutation(() => OrderItem, {
    name: 'updateOrderItem',
    description: `Roles allowed: ${ValidRoles.user} This mutation is used to update an order item`,
  })
  updateOrderItem(
    @Args('updateOrderItemInput') updateOrderItemInput: UpdateOrderItemInput,
    @CurrentUser([ValidRoles.user]) user: User,
  ) {
    return this.orderItemsService.update(
      updateOrderItemInput.id,
      updateOrderItemInput,
    );
  }

  @Mutation(() => OrderItem, {
    name: 'removeOrderItem',
    description: `Roles allowed: ${ValidRoles.user} This mutation is used to remove an order item`,
  })
  removeOrderItem(
    @Args('id', { type: () => ID }, ParseUUIDPipe) id: string,
    @CurrentUser([ValidRoles.user]) user: User,
  ) {
    return this.orderItemsService.remove(id);
  }
}
