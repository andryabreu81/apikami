import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { RolsController } from 'src/rols/rols.controller';
import { RolsService } from 'src/rols/rols.service';
import { UserEntity } from './users.entity'
import { RoleEntity } from '../rols/rols.entity'

@Module({
  imports: [
    // REGISTRA AQUÍ LAS ENTIDADES
    TypeOrmModule.forFeature([UserEntity, RoleEntity]) 
  ],
  controllers: [UsersController, RolsController],
  providers: [UsersService, RolsService],
  exports: [UsersService, RolsService],
})
export class UsersModule {}
