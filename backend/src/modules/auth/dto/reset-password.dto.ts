import { IsString, MinLength, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ResetPasswordDto {
  @ApiProperty({ description: 'Token de recuperação de senha' })
  @IsString({ message: 'Token é obrigatório' })
  token: string;

  @ApiProperty({ example: 'NovaSenha123!', description: 'Nova senha do usuário' })
  @IsString()
  @MinLength(8, { message: 'A senha deve ter no mínimo 8 caracteres' })
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
    { message: 'A senha deve conter pelo menos uma letra maiúscula, uma minúscula e um número' }
  )
  password: string;
}
