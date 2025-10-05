import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { CustomersService } from './customers.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { QueryCustomerDto } from './dto/query-customer.dto';

@ApiTags('customers')
@ApiBearerAuth()
@Controller('customers')
export class CustomersController {
  constructor(private readonly service: CustomersService) {}

  @Post()
  @ApiOkResponse({ description: 'Crea un cliente' })
  create(@Body() dto: CreateCustomerDto) {
    return this.service.create(dto);
  }

  @Get()
  @ApiOkResponse({ description: 'Lista clientes con filtros y paginación' })
  findAll(@Query() q: QueryCustomerDto) {
    const take = q.take ? Math.min(q.take, 100) : undefined;
    const skip = q.skip ? Math.max(q.skip, 0) : undefined;
    return this.service.findAll({
      q: q.q,
      status: q.status,
      take,
      skip,
      order: q.order,
    });
  }

  @Get(':id')
  @ApiOkResponse({ description: 'Obtiene un cliente por id' })
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  @ApiOkResponse({ description: 'Actualiza un cliente' })
  update(@Param('id') id: string, @Body() dto: UpdateCustomerDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @ApiOkResponse({ description: 'Elimina un cliente' })
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
