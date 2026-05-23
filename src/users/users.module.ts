import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { RolsController } from '../rols/rols.controller';
import { RolsService } from '../rols/rols.service';
import { UserEntity } from './users.entity'
import { RoleEntity } from '../rols/rols.entity'
import { LocalEntity } from '../locals/locals.entity';
import { LocalsController } from '../locals/locals.controller';
import { LocalsService } from '../locals/locals.service';

@Module({
  imports: [
    // REGISTRA AQUÍ LAS ENTIDADES
    TypeOrmModule.forFeature([UserEntity, RoleEntity, LocalEntity]) 
  ],
  controllers: [UsersController, RolsController, LocalsController],
  providers: [UsersService, RolsService, LocalsService],
  exports: [UsersService, RolsService, LocalsService],
})
export class UsersModule {}
