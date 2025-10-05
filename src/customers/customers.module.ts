import { Module } from '@nestjs/common';
import { CustomersService } from './customers.service';
import { CustomersController } from './customers.controller';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Customer } from './entities/customer.entity';
import { BypassOrJwtGuard } from 'src/common/guards/bypass-or-jwt.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';

@Module({
  imports: [
    TypeOrmModule.forFeature([Customer]),
    PassportModule,
    JwtModule.register({}), // firmamos manualmente en el service
  ],
  providers: [CustomersService, BypassOrJwtGuard, RolesGuard],
  controllers: [CustomersController],
})
export class CustomersModule {}
