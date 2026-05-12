import { Controller } from '@nestjs/common';
import { RolsService } from './rols.service';

@Controller('rols')
export class RolsController {
  constructor(private readonly rolsService: RolsService) {}
}
