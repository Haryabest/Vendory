import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrderStatus } from '@prisma/client';
import { ApiTags, ApiOperation, ApiParam } from '@nestjs/swagger';

@ApiTags('orders')
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new order' })
  create(@Body() createOrderDto: { buyerId: string; totalPrice: number; currency?: string }) {
    return this.ordersService.create(
      createOrderDto.buyerId,
      createOrderDto.totalPrice,
      createOrderDto.currency,
    );
  }

  @Get()
  @ApiOperation({ summary: 'Get all orders' })
  findAll() {
    return this.ordersService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get order by ID' })
  @ApiParam({ name: 'id', description: 'Order ID' })
  findOne(@Param('id') id: string) {
    return this.ordersService.findOne(id);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Update order status' })
  @ApiParam({ name: 'id', description: 'Order ID' })
  updateStatus(@Param('id') id: string, @Body() updateStatusDto: { status: OrderStatus }) {
    return this.ordersService.updateStatus(id, updateStatusDto.status);
  }

  @Get('user/:buyerId')
  @ApiOperation({ summary: 'Get orders by buyer' })
  @ApiParam({ name: 'buyerId', description: 'Buyer ID' })
  findByBuyer(@Param('buyerId') buyerId: string) {
    return this.ordersService.findByBuyer(buyerId);
  }
}
