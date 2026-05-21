import { Controller, Get, Post, Body , Put, Delete, Param} from '@nestjs/common';
import { UsersService } from './users.service';

@Controller()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  //obtener lista de usuarios
  @Get('/getusers')
  async getUsers(): Promise<any> {
    console.log('here controller');
    let userList = this.usersService.getUsers();
    
    let response = {
      statusCode: 200,
      message: 'Lista de usuarios obtenida',
      data: await userList
    };

    return response;
  }

  // buscar un usuario especifico
  @Post('/findUser')
  async findUser(@Body() brandData: { userId: number }) {
    
    let usuario = await this.usersService.findUser(brandData.userId);

    let response = {};

    if (usuario?.id != null) {
     
        response = {
          statusCode: 200,
          message: 'Usuario obtenido exitosamente',
          data: await usuario
        };
    }else{
          response = {
          statusCode: 404,
          message: 'Usuario no encontrado',
          data: null
        };
    }

    return response;
  }

  // agregar un usuario
  @Post('/addusers')
  async addUsers(@Body() userData: { 
    name: string; 
    lastname: string; 
    email: string; 
    role_id: number ;  
    password:string }): Promise<any> {

    let addUser = this.usersService.addUsers(userData.name, userData.email, userData.lastname, userData.role_id, userData.password);

    let response = {
      statusCode: 200,
      message: 'Usuario agregado exitosamente',
      data: await addUser
    };

    return response;
  }

  // actualizar un usuario especifico
  @Put('/updateuser')
  async updateUser(
    @Body() body: { 
      userId: number; 
      name?: string; 
      lastname?: string; 
      email?: string; 
      role_id?: number; 
      password?: string; 
    }
  ) {
    // Extraemos el userId y agrupamos el resto de datos para la actualización
    const { userId, ...dataToUpdate } = body;

    const usuarioActualizado = await this.usersService.updateUser(userId, dataToUpdate);

    if (!usuarioActualizado) {
      return {
        statusCode: 404,
        message: 'No se pudo actualizar. Usuario no encontrado.',
        data: null
      };
    }

    return {
      statusCode: 200,
      message: 'Usuario actualizado exitosamente',
      data: usuarioActualizado
    };
  }

  // actualizar un usuario especifico
  @Delete('/deleteuser/:id')
  async deleteUser(@Param('id') id: string) {
    // Los parámetros de la URL siempre llegan como string, lo convertimos a número
    const userId = parseInt(id, 10);

    const eliminado = await this.usersService.deleteUser(userId);

    if (!eliminado) {
      return {
        statusCode: 404,
        message: 'No se pudo eliminar. El usuario no existe.',
        data: null
      };
    }

    return {
      statusCode: 200,
      message: 'Usuario eliminado exitosamente',
      data: { userId }
    };
  }
}
