import { Controller, Get, Post, Put, Delete } from '@nestjs/common';
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
}
