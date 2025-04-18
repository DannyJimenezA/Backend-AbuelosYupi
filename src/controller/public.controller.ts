import { Controller, Get, Param, Res } from '@nestjs/common';
import { Response } from 'express';
import { join } from 'path';
import { existsSync } from 'fs';

@Controller('uploads')
export class PublicController {
  @Get(':folder/:filename')
  getImage(
    @Param('folder') folder: string,
    @Param('filename') filename: string,
    @Res() res: Response,
  ) {
    const path = join(__dirname, '..', '..', 'uploads', folder, filename);
    if (existsSync(path)) {
      res.sendFile(path);
    } else {
      res.status(404).send('Archivo no encontrado');
    }
  }
}
