import { Controller, Get } from '@nestjs/common';
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
}
