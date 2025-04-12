import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../service/user.service';
import * as bcrypt from 'bcrypt';

@Controller('auth')
export class AuthController {
  constructor(private readonly userService: UserService) {}

  @Post('login')
  async login(@Body() body: { email: string; password: string }) {
    const user = await this.userService.findByEmail(body.email);

    if (!user) {
      throw new UnauthorizedException('Correo no encontrado');
    }

    const passwordValid = await bcrypt.compare(body.password, user.passwordHash);

    if (!passwordValid) {
      throw new UnauthorizedException('Contraseña incorrecta');
    }

    // Opcional: podrías generar un JWT aquí
    return {
      message: 'Login exitoso ✅',
      user: {
        id: user.id,
        name: user.name,
        role: user.role.name,
        email: user.email,
      },
    };
  }
}
