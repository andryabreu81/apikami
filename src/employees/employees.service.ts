import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { EmployeeEntity } from './entities/employee.entity';
import { EmployeeLocalEntity } from './entities/employee-local.entity';

@Injectable()
export class EmployeesService {
  constructor(
    @InjectRepository(EmployeeEntity)
    private readonly employeesRepository: Repository<EmployeeEntity>,
    @InjectRepository(EmployeeLocalEntity)
    private readonly employeeLocalsRepository: Repository<EmployeeLocalEntity>,
  ) {}

  // Utilidad para validar RUT Chileno
  private validateRut(rut: string): boolean {
    if (!rut || !/^[0-9]+[-|‐]{1}[0-9kK]{1}$/.test(rut)) return false;
    const [cuerpo, digitoVerificador] = rut.split('-');
    let suma = 0;
    let multiplo = 2;
    for (let i = cuerpo.length - 1; i >= 0; i--) {
      suma += multiplo * parseInt(cuerpo.charAt(i), 10);
      multiplo = multiplo < 7 ? multiplo + 1 : 2;
    }
    const dvEsperado = 11 - (suma % 11);
    const dvCalculado = dvEsperado === 11 ? '0' : dvEsperado === 10 ? 'k' : dvEsperado.toString();
    return dvCalculado === digitoVerificador.toLowerCase();
  }

  async getEmployees(): Promise<EmployeeEntity[]> {
    return await this.employeesRepository.find({
      relations: ['sucursales', 'sucursales.local'],
    });
  }

  async findEmployee(employeeId: number): Promise<EmployeeEntity | null> {
    return await this.employeesRepository.findOne({
      where: { id: employeeId },
      relations: ['sucursales', 'sucursales.local'],
    });
  }

  async addEmployee(employeeData: any): Promise<EmployeeEntity> {
    // Validar RUT si el documento es rut/carnet
    if (employeeData.tipo_dni === 'Carnet' && !this.validateRut(employeeData.dni)) {
      throw new BadRequestException('El RUT del documento identificatorio no es válido.');
    }

    if (employeeData.datos_bancarios_rut && !this.validateRut(employeeData.datos_bancarios_rut)) {
      throw new BadRequestException('El RUT de los datos bancarios no es válido.');
    }

    // Regla: No pueden registrarse empleados con el mismo DNI, Nombre y Cargo
    const exists = await this.employeesRepository.findOne({
      where: { dni: employeeData.dni, nombre: employeeData.nombre, cargo: employeeData.cargo }
    });
    if (exists) {
      throw new BadRequestException('Ya existe un empleado registrado con el mismo DNI, Nombre y Cargo.');
    }

    // Extraer sucursales para manejarlas por separado
    const { sucursales, ...data } = employeeData;

    // Crear el empleado
    const newEmployee: EmployeeEntity = this.employeesRepository.create(data as object);
    const savedEmployee = await this.employeesRepository.save(newEmployee);

    // Guardar las sucursales y salarios asociadas
    if (sucursales && Array.isArray(sucursales)) {
      const employeeLocals = sucursales.map((sucursal: any) => {
        return this.employeeLocalsRepository.create({
          employee_id: savedEmployee.id,
          local_id: sucursal.local_id,
          salario: sucursal.salario,
        });
      });
      await this.employeeLocalsRepository.save(employeeLocals);
    }

    return (await this.findEmployee(savedEmployee.id)) as EmployeeEntity;
  }

  async updateEmployee(employeeId: number, updateData: any): Promise<EmployeeEntity | null> {
    if (updateData.tipo_dni === 'Carnet' && updateData.dni && !this.validateRut(updateData.dni)) {
      throw new BadRequestException('El RUT del documento identificatorio no es válido.');
    }

    if (updateData.datos_bancarios_rut && !this.validateRut(updateData.datos_bancarios_rut)) {
      throw new BadRequestException('El RUT de los datos bancarios no es válido.');
    }

    const current = await this.findEmployee(employeeId);
    if (!current) {
      throw new BadRequestException('Empleado no encontrado.');
    }

    // Regla: No pueden registrarse empleados con el mismo DNI, Nombre y Cargo
    if (updateData.dni || updateData.nombre || updateData.cargo) {
      const checkDni = updateData.dni || current.dni;
      const checkNombre = updateData.nombre || current.nombre;
      const checkCargo = updateData.cargo || current.cargo;

      const exists = await this.employeesRepository.findOne({
        where: { dni: checkDni, nombre: checkNombre, cargo: checkCargo }
      });
      if (exists && exists.id !== employeeId) {
        throw new BadRequestException('Ya existe otro empleado registrado con el mismo DNI, Nombre y Cargo.');
      }
    }

    const { sucursales, ...data } = updateData;

    if (Object.keys(data).length > 0) {
      await this.employeesRepository.update(employeeId, data);
    }

    // Si se envían sucursales, reemplazar las actuales
    if (sucursales && Array.isArray(sucursales)) {
      // Eliminar las anteriores
      await this.employeeLocalsRepository.delete({ employee_id: employeeId });
      
      // Crear las nuevas
      const employeeLocals = sucursales.map((sucursal: any) => {
        return this.employeeLocalsRepository.create({
          employee_id: employeeId,
          local_id: sucursal.local_id,
          salario: sucursal.salario,
        });
      });
      await this.employeeLocalsRepository.save(employeeLocals);
    }

    return this.findEmployee(employeeId);
  }

  async deleteEmployee(employeeId: number): Promise<boolean> {
    if (!employeeId) {
      throw new BadRequestException('El ID del empleado es requerido para eliminar.');
    }
    // Regla: Los datos no se borran, solo deben quedar como estado borrado
    const result = await this.employeesRepository.update(employeeId, { estado: 'Borrado' });
    return (result.affected ?? 0) > 0;
  }
}
