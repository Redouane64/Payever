import { Controller, Get, HttpStatus, Res } from '@nestjs/common';
import { Response } from 'express';

@Controller()
export class AppController {
  @Get('healthz')
  healthz(@Res() response: Response) {
    return response.sendStatus(HttpStatus.OK);
  }
}
