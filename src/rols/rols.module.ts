import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { RolsService } from './rols.service';
import { RolsController } from './rols.controller';
import { RoleEntity } from './rols.entity'; // Asegúrate de que la ruta sea correcta

@Module({
  imports: [
    // Esto es lo que falta para que RolsService pueda encontrar el repositorio
    TypeOrmModule.forFeature([RoleEntity])
  ],
  controllers: [RolsController],
  providers: [RolsService],
})
export class RolsModule {}
