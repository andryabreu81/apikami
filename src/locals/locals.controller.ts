import { Controller, Get, Post, Put, Delete, Body } from '@nestjs/common';
import { LocalsService } from './locals.service';

@Controller()
export class LocalsController {
  constructor(private readonly localsService: LocalsService) {}

  //obtener lista de usuarios
    @Get('/getlocals')
    async getLocals(): Promise<any> {
      //console.log('here controller');
      let localList = this.localsService.getLocals();
      
      let response = {
        statusCode: 200,
        message: 'Lista de locales obtenidos',
        data: await localList
      };
  
      return response;
    }

    // buscar un local especifico
  @Post('/findLocal')
  async findLocal(@Body() localData: { localId: number }) {
    
    let local = await this.localsService.findLocal(localData.localId);

    let response = {};

    if (local?.id != null) {
     
        response = {
          statusCode: 200,
          message: 'Local obtenido exitosamente',
          data: await local
        };
    }else{
          response = {
          statusCode: 404,
          message: 'Local no encontrado',
          data: null
        };
    }

    return response;
  }

  // agregar un local
  @Post('/addlocal')
  async addLocal(@Body() localData: { 
    name: string; 
    address: string; 
    user_id: number ;
    }): Promise<any> {

    let addLocal = this.localsService.addLocal(localData);

    let response = {
      statusCode: 200,
      message: 'Local agregado exitosamente',
      data: await addLocal
    };

    return response;
  }

  @Put('/updatelocal')
  async updateLocal(
    @Body() body: { 
      localId: number; 
      name?: string; 
      address?: string;  
      user_id?: number; 
    }
  ) {
    // Extraemos el userId y agrupamos el resto de datos para la actualización
    const { localId, ...dataToUpdate } = body;

    const localActualizado = await this.localsService.updateLocal(localId, dataToUpdate);

    if (!localActualizado) {
      return {
        statusCode: 404,
        message: 'No se pudo actualizar. Local no encontrado.',
        data: null
      };
    }

    return {
      statusCode: 200,
      message: 'Local actualizado exitosamente',
      data: localActualizado
    };
  }

}
