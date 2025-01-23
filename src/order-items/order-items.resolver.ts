import { Resolver, Query, Mutation, Args, Int, ID } from '@nestjs/graphql';
import { OrderItemsService } from './order-items.service';
import { OrderItem } from './entities/order-item.entity';
import { CreateOrderItemInput } from './dto/create-order-item.input';
import { UpdateOrderItemInput } from './dto/update-order-item.input';
import { ParseUUIDPipe } from '@nestjs/common';

@Resolver(() => OrderItem)
export class OrderItemsResolver {
  constructor(private readonly orderItemsService: OrderItemsService) {}

  @Mutation(() => OrderItem)
  createOrderItem(
    @Args('createOrderItemInput') createOrderItemInput: CreateOrderItemInput,
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

  @Mutation(() => OrderItem)
  updateOrderItem(
    @Args('updateOrderItemInput') updateOrderItemInput: UpdateOrderItemInput,
  ) {
    return this.orderItemsService.update(
      updateOrderItemInput.id,
      updateOrderItemInput,
    );
  }

  @Mutation(() => OrderItem)
  removeOrderItem(@Args('id', { type: () => ID }, ParseUUIDPipe) id: string) {
    return this.orderItemsService.remove(id);
  }
}
