import { IsEmail, IsString, IsOptional, MinLength, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateContactDto {
  @ApiProperty({ example: 'João Silva', description: 'Nome do remetente' })
  @IsString()
  @MinLength(2, { message: 'O nome deve ter pelo menos 2 caracteres' })
  @MaxLength(100, { message: 'O nome deve ter no máximo 100 caracteres' })
  name: string;

  @ApiProperty({ example: 'joao@email.com', description: 'Email do remetente' })
  @IsEmail({}, { message: 'Email inválido' })
  email: string;

  @ApiPropertyOptional({ example: '11999999999', description: 'Telefone do remetente' })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({ example: 'Dúvida sobre produto', description: 'Assunto da mensagem' })
  @IsString()
  @MinLength(3, { message: 'O assunto deve ter pelo menos 3 caracteres' })
  @MaxLength(200, { message: 'O assunto deve ter no máximo 200 caracteres' })
  subject: string;

  @ApiProperty({ example: 'Gostaria de saber mais sobre...', description: 'Mensagem' })
  @IsString()
  @MinLength(10, { message: 'A mensagem deve ter pelo menos 10 caracteres' })
  @MaxLength(2000, { message: 'A mensagem deve ter no máximo 2000 caracteres' })
  message: string;
}
