import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransfersController } from './transfers.controller';
import { TransfersService } from './transfers.service';
import { TransferEntity } from './entities/transfer.entity';
import { EmployeeEntity } from '../employees/entities/employee.entity';
import { EmployeeLocalEntity } from '../employees/entities/employee-local.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TransferEntity, EmployeeEntity, EmployeeLocalEntity])],
  controllers: [TransfersController],
  providers: [TransfersService],
  exports: [TransfersService],
})
export class TransfersModule {}
