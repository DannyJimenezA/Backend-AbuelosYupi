import { IsNotEmpty, IsEmail, Length, IsOptional } from "class-validator";

// create-user.dto.ts
export class CreateUserDto {
    @IsNotEmpty({ message: 'El nombre es obligatorio' })
    name: string;
  
    @IsEmail()
    email: string;
  
    @IsNotEmpty()
    @Length(6)
    password: string;
  
    @IsNotEmpty()
    phone: string;
  
    @IsOptional()
    address?: string;
  }
  