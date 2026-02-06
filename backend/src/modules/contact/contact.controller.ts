import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';

import { ContactService } from './contact.service';
import { CreateContactDto } from './dto/create-contact.dto';
import { Public, Roles } from '@/common/decorators';

@ApiTags('contact')
@Controller('contact')
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  @Public()
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Enviar mensagem de contato' })
  @ApiResponse({ status: 201, description: 'Mensagem enviada com sucesso' })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  async create(@Body() createContactDto: CreateContactDto) {
    return this.contactService.create(createContactDto);
  }

  @Get()
  @Roles('ADMIN', 'GERENTE')
  @ApiOperation({ summary: 'Listar mensagens de contato (Admin)' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'isRead', required: false, type: Boolean })
  @ApiResponse({ status: 200, description: 'Lista de mensagens' })
  async findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('isRead') isRead?: string,
  ) {
    return this.contactService.findAll(
      page ? parseInt(page) : 1,
      limit ? parseInt(limit) : 20,
      isRead !== undefined ? isRead === 'true' : undefined,
    );
  }

  @Get('unread-count')
  @Roles('ADMIN', 'GERENTE')
  @ApiOperation({ summary: 'Contar mensagens não lidas (Admin)' })
  @ApiResponse({ status: 200, description: 'Contagem de mensagens não lidas' })
  async getUnreadCount() {
    return this.contactService.getUnreadCount();
  }

  @Get(':id')
  @Roles('ADMIN', 'GERENTE')
  @ApiOperation({ summary: 'Buscar mensagem por ID (Admin)' })
  @ApiResponse({ status: 200, description: 'Detalhes da mensagem' })
  async findOne(@Param('id') id: string) {
    return this.contactService.findOne(id);
  }

  @Patch(':id/read')
  @Roles('ADMIN', 'GERENTE')
  @ApiOperation({ summary: 'Marcar mensagem como lida (Admin)' })
  @ApiResponse({ status: 200, description: 'Mensagem marcada como lida' })
  async markAsRead(@Param('id') id: string) {
    return this.contactService.markAsRead(id);
  }

  @Delete(':id')
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Excluir mensagem (Admin)' })
  @ApiResponse({ status: 200, description: 'Mensagem excluída' })
  async delete(@Param('id') id: string) {
    return this.contactService.delete(id);
  }
}
