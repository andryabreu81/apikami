import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

//entity
import { RoleEntity } from './rols.entity'

@Injectable()
export class RolsService {
  constructor(
      @InjectRepository(RoleEntity)
      private readonly rolsRepository: Repository<RoleEntity>,
    ) {}
  
    async getRoles(): Promise<RoleEntity[]> {
      console.log('here service');
      return await this.rolsRepository.find({
        relations:['users']
      });
    }

    // Obtener un rol por su ID
    async findRol(rolId: string): Promise<RoleEntity | null> {
      return await this.rolsRepository.findOne({ 
        where: { id: rolId },
        relations:['users'] 
      });
    }

    // Agregar un rol
    async addRol(role_code: string, descripcion: string, active?: number): Promise<RoleEntity> {
      const newRol = this.rolsRepository.create({ role_code, descripcion, active });
      return await this.rolsRepository.save(newRol);
    }

    // Actualizar un rol especifico
    async updateRol(
      rolId: string,
      updateData: { role_code?: string; descripcion?: string; active?: number; }
    ): Promise<RoleEntity | null> {
      await this.rolsRepository.update(rolId, updateData);
      return this.findRol(rolId);
    }

    // Eliminar un rol especifico
    async deleteRol(rolId: string): Promise<boolean> {
      if (!rolId) {
        throw new Error('El ID del rol es requerido para eliminar.');
      }
      const result = await this.rolsRepository.delete(rolId);
      return (result.affected ?? 0) > 0;
    }
}
