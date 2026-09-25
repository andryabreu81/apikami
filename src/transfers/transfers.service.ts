import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, In } from 'typeorm';

import { TransferEntity } from './entities/transfer.entity';
import { EmployeeEntity } from '../employees/entities/employee.entity';
import { EmployeeLocalEntity } from '../employees/entities/employee-local.entity';

@Injectable()
export class TransfersService {
  constructor(
    @InjectRepository(TransferEntity)
    private readonly transfersRepository: Repository<TransferEntity>,
    @InjectRepository(EmployeeEntity)
    private readonly employeesRepository: Repository<EmployeeEntity>,
    @InjectRepository(EmployeeLocalEntity)
    private readonly employeeLocalsRepository: Repository<EmployeeLocalEntity>,
  ) {}

  async getTransfers(): Promise<TransferEntity[]> {
    return await this.transfersRepository.find({
      relations: ['local', 'employee'],
      order: { create_at: 'DESC' }
    });
  }

  async findTransfer(transferId: number): Promise<TransferEntity | null> {
    return await this.transfersRepository.findOne({
      where: { id: transferId },
      relations: ['local', 'employee'],
    });
  }

  async addTransfer(transferData: any): Promise<TransferEntity> {
    // Regla: Validar saldo si es Salario, Adelanto o Quincena
    if (['Salario', 'Adelanto', 'Quincena'].includes(transferData.tipo_pago)) {
      const employeeLocal = await this.employeeLocalsRepository.findOne({
        where: { employee_id: transferData.employee_id, local_id: transferData.local_id }
      });

      if (!employeeLocal) {
        throw new BadRequestException('El empleado no está asignado a esta sucursal o no tiene salario definido allí.');
      }

      const salarioBase = Number(employeeLocal.salario);

      const date = new Date(transferData.fecha || new Date());
      const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
      const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);

      const startStr = firstDay.toISOString().split('T')[0];
      const endStr = lastDay.toISOString().split('T')[0];

      const previousTransfers = await this.transfersRepository.find({
        where: {
          employee_id: transferData.employee_id,
          local_id: transferData.local_id,
          tipo_pago: In(['Salario', 'Adelanto', 'Quincena']),
          fecha: Between(startStr, endStr)
        }
      });

      const totalPrevio = previousTransfers.reduce((acc, t) => acc + Number(t.monto), 0);
      const montoActual = Number(transferData.monto);

      if (totalPrevio + montoActual > salarioBase) {
        throw new BadRequestException(`El monto supera el salario mensual de la sucursal. Salario base: $${salarioBase}. Pagado previamente: $${totalPrevio}. Saldo disponible: $${salarioBase - totalPrevio}. Intento de pago: $${montoActual}.`);
      }
    }

    if (!transferData.datos_bancarios_rut) {
      const employee = await this.employeesRepository.findOne({ where: { id: transferData.employee_id } });
      if (employee) {
        transferData.datos_bancarios_rut = employee.datos_bancarios_rut;
        transferData.datos_bancarios_banco = employee.datos_bancarios_banco;
        transferData.datos_bancarios_cuenta = employee.datos_bancarios_cuenta;
        transferData.datos_bancarios_tipo_cuenta = employee.datos_bancarios_tipo_cuenta;
      }
    }

    const newTransfer: TransferEntity = this.transfersRepository.create(transferData as object);
    const savedTransfer = await this.transfersRepository.save(newTransfer);

    return (await this.findTransfer(savedTransfer.id)) as TransferEntity;
  }

  async updateTransfer(transferId: number, updateData: any): Promise<TransferEntity | null> {
    await this.transfersRepository.update(transferId, updateData);
    return this.findTransfer(transferId);
  }

  async deleteTransfer(transferId: number): Promise<boolean> {
    if (!transferId) {
      throw new BadRequestException('El ID de la transferencia es requerido para eliminar.');
    }
    const result = await this.transfersRepository.delete(transferId);
    return (result.affected ?? 0) > 0;
  }
}
