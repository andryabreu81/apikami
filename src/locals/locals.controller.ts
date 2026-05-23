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
}
