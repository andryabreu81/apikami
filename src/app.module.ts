import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { RolsModule } from './rols/rols.module';
import { LocalsModule } from './locals/locals.module';

// entities
import { UserEntity } from './users/users.entity'
import { RoleEntity } from './rols/rols.entity';
import { LocalEntity } from './locals/locals.entity';
import { EmployeeEntity } from './employees/entities/employee.entity';
import { EmployeeLocalEntity } from './employees/entities/employee-local.entity';
import { EmployeesModule } from './employees/employees.module';
import { TransferEntity } from './transfers/entities/transfer.entity';
import { TransfersModule } from './transfers/transfers.module';

@Module({
  imports: [UsersModule,TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: '20111981',
      database: 'db_apikami',
      entities: [UserEntity, RoleEntity, LocalEntity, EmployeeEntity, EmployeeLocalEntity, TransferEntity], // O [__dirname + '/**/*.entity{.ts,.js}']
      synchronize: false, // Mantenlo en false si la tabla ya existe
    }), UsersModule, RolsModule, LocalsModule, EmployeesModule, TransfersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
