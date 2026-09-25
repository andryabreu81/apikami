import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { EmployeesService } from './employees.service';

@Controller()
export class EmployeesController {
  constructor(private readonly employeesService: EmployeesService) {}

  @Get('/getemployees')
  async getEmployees(): Promise<any> {
    const employeeList = await this.employeesService.getEmployees();
    
    return {
      statusCode: 200,
      message: 'Lista de empleados obtenida',
      data: employeeList
    };
  }

  @Post('/findEmployee')
  async findEmployee(@Body() data: { employeeId: number }) {
    const employee = await this.employeesService.findEmployee(data.employeeId);

    if (employee?.id != null) {
        return {
          statusCode: 200,
          message: 'Empleado obtenido exitosamente',
          data: employee
        };
    } else {
        return {
          statusCode: 404,
          message: 'Empleado no encontrado',
          data: null
        };
    }
  }

  @Post('/addemployee')
  async addEmployee(@Body() employeeData: any): Promise<any> {
    try {
      const addedEmployee = await this.employeesService.addEmployee(employeeData);
      return {
        statusCode: 200,
        message: 'Empleado agregado exitosamente',
        data: addedEmployee
      };
    } catch (error: any) {
      return {
        statusCode: 400,
        message: error.message || 'Error al agregar empleado',
        data: null
      };
    }
  }

  @Put('/updateemployee')
  async updateEmployee(
    @Body() body: any
  ) {
    const { employeeId, ...dataToUpdate } = body;

    try {
      const empleadoActualizado = await this.employeesService.updateEmployee(employeeId, dataToUpdate);

      if (!empleadoActualizado) {
        return {
          statusCode: 404,
          message: 'No se pudo actualizar. Empleado no encontrado.',
          data: null
        };
      }

      return {
        statusCode: 200,
        message: 'Empleado actualizado exitosamente',
        data: empleadoActualizado
      };
    } catch (error: any) {
      return {
        statusCode: 400,
        message: error.message || 'Error al actualizar empleado',
        data: null
      };
    }
  }

  @Delete('/deleteemployee/:id')
  async deleteEmployee(@Param('id') id: string) {
    const employeeId = parseInt(id, 10);

    const eliminado = await this.employeesService.deleteEmployee(employeeId);

    if (!eliminado) {
      return {
        statusCode: 404,
        message: 'No se pudo eliminar. El empleado no existe.',
        data: null
      };
    }

    return {
      statusCode: 200,
      message: 'Empleado eliminado exitosamente',
      data: { employeeId }
    };
  }
}
