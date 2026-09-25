import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { TransfersService } from './transfers.service';

@Controller()
export class TransfersController {
  constructor(private readonly transfersService: TransfersService) {}

  @Get('/gettransfers')
  async getTransfers(): Promise<any> {
    const list = await this.transfersService.getTransfers();
    
    return {
      statusCode: 200,
      message: 'Lista de transferencias obtenida',
      data: list
    };
  }

  @Post('/findTransfer')
  async findTransfer(@Body() data: { transferId: number }) {
    const result = await this.transfersService.findTransfer(data.transferId);

    if (result?.id != null) {
        return {
          statusCode: 200,
          message: 'Transferencia obtenida exitosamente',
          data: result
        };
    } else {
        return {
          statusCode: 404,
          message: 'Transferencia no encontrada',
          data: null
        };
    }
  }

  @Post('/addtransfer')
  async addTransfer(@Body() transferData: any): Promise<any> {
    try {
      const added = await this.transfersService.addTransfer(transferData);
      return {
        statusCode: 200,
        message: 'Transferencia registrada exitosamente',
        data: added
      };
    } catch (error: any) {
      return {
        statusCode: 400,
        message: error.message || 'Error al registrar transferencia',
        data: null
      };
    }
  }

  @Put('/updatetransfer')
  async updateTransfer(
    @Body() body: any
  ) {
    const { transferId, ...dataToUpdate } = body;

    try {
      const actualizado = await this.transfersService.updateTransfer(transferId, dataToUpdate);

      if (!actualizado) {
        return {
          statusCode: 404,
          message: 'No se pudo actualizar. Transferencia no encontrada.',
          data: null
        };
      }

      return {
        statusCode: 200,
        message: 'Transferencia actualizada exitosamente',
        data: actualizado
      };
    } catch (error: any) {
      return {
        statusCode: 400,
        message: error.message || 'Error al actualizar transferencia',
        data: null
      };
    }
  }

  @Delete('/deletetransfer/:id')
  async deleteTransfer(@Param('id') id: string) {
    const transferId = parseInt(id, 10);

    const eliminado = await this.transfersService.deleteTransfer(transferId);

    if (!eliminado) {
      return {
        statusCode: 404,
        message: 'No se pudo eliminar. La transferencia no existe.',
        data: null
      };
    }

    return {
      statusCode: 200,
      message: 'Transferencia eliminada exitosamente',
      data: { transferId }
    };
  }
}
