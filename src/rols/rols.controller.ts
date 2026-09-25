import { Controller, Get, Post, Body, Put, Delete, Param } from '@nestjs/common';
import { RolsService } from './rols.service';

@Controller()
export class RolsController {
  constructor(private readonly rolsService: RolsService) {}

  //obtener lista de roles
    @Get('/getroles')
    async getRoles(): Promise<any> {
      //console.log('here controller');
      let userList = this.rolsService.getRoles();
      
      let response = {
        statusCode: 200,
        message: 'Lista de usuarios obtenida',
        data: await userList
      };
  
      return response;
    }
    // buscar un rol especifico
    @Post('/findRol')
    async findRol(@Body() rolData: { rolId: string }) {
      
      let rol = await this.rolsService.findRol(rolData.rolId);
  
      let response = {};
  
      if (rol?.id != null) {
       
          response = {
            statusCode: 200,
            message: 'Rol obtenido exitosamente',
            data: await rol
          };
      } else {
            response = {
            statusCode: 404,
            message: 'Rol no encontrado',
            data: null
          };
      }
  
      return response;
    }
  
    // agregar un rol
    @Post('/addrol')
    async addRol(@Body() rolData: { 
      role_code: string; 
      descripcion: string; 
      active?: number;
      }): Promise<any> {
  
      let addRol = this.rolsService.addRol(rolData.role_code, rolData.descripcion, rolData.active);
  
      let response = {
        statusCode: 200,
        message: 'Rol agregado exitosamente',
        data: await addRol
      };
  
      return response;
    }
  
    // actualizar un rol especifico
    @Put('/updaterol')
    async updateRol(
      @Body() body: { 
        rolId: string; 
        role_code?: string; 
        descripcion?: string;  
        active?: number; 
      }
    ) {
      const { rolId, ...dataToUpdate } = body;
  
      const rolActualizado = await this.rolsService.updateRol(rolId, dataToUpdate);
  
      if (!rolActualizado) {
        return {
          statusCode: 404,
          message: 'No se pudo actualizar. Rol no encontrado.',
          data: null
        };
      }
  
      return {
        statusCode: 200,
        message: 'Rol actualizado exitosamente',
        data: rolActualizado
      };
    }
  
    // eliminar un rol especifico
    @Delete('/deleterol/:id')
    async deleteRol(@Param('id') id: string) {
      const eliminado = await this.rolsService.deleteRol(id);
  
      if (!eliminado) {
        return {
          statusCode: 404,
          message: 'No se pudo eliminar. El rol no existe.',
          data: null
        };
      }
  
      return {
        statusCode: 200,
        message: 'Rol eliminado exitosamente',
        data: { rolId: id }
      };
    }
}
