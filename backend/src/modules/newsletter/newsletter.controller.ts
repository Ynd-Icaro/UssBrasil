import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { NewsletterService } from './newsletter.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Public } from '../../common/decorators/public.decorator';
import { SubscribeDto } from './dto/subscribe.dto';

@ApiTags('Newsletter')
@Controller('newsletter')
export class NewsletterController {
  constructor(private readonly newsletterService: NewsletterService) {}

  @Post('subscribe')
  @Public()
  @ApiOperation({ summary: 'Inscrever-se na newsletter' })
  subscribe(@Body() dto: SubscribeDto) {
    return this.newsletterService.subscribe(dto);
  }

  @Post('unsubscribe')
  @Public()
  @ApiOperation({ summary: 'Cancelar inscrição na newsletter' })
  unsubscribe(@Body() dto: SubscribeDto) {
    return this.newsletterService.unsubscribe(dto.email);
  }

  @Get('admin/subscribers')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'GERENTE')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Listar todos os inscritos (admin)' })
  @ApiQuery({ name: 'includeInactive', required: false })
  getAllSubscribers(@Query('includeInactive') includeInactive?: string) {
    return this.newsletterService.getAllSubscribers(includeInactive === 'true');
  }

  @Get('admin/stats')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'GERENTE')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Estatísticas da newsletter' })
  getStats() {
    return this.newsletterService.getStats();
  }

  @Delete('admin/:email')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'GERENTE')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Remover inscrito permanentemente' })
  deleteSubscriber(@Param('email') email: string) {
    return this.newsletterService.deleteSubscriber(email);
  }
}
