import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmployeesController } from './employees.controller';
import { EmployeesService } from './employees.service';
import { EmployeeEntity } from './entities/employee.entity';
import { EmployeeLocalEntity } from './entities/employee-local.entity';

@Module({
  imports: [TypeOrmModule.forFeature([EmployeeEntity, EmployeeLocalEntity])],
  controllers: [EmployeesController],
  providers: [EmployeesService],
  exports: [EmployeesService],
})
export class EmployeesModule {}
