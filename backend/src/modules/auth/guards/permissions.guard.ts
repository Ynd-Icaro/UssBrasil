import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PrismaService } from '../../../common/prisma/prisma.service';
import { Role, SystemModule, AccessLevel } from '@prisma/client';

export const PERMISSION_KEY = 'permission';

export interface PermissionRequirement {
  module: SystemModule;
  minAccess: AccessLevel;
}

@Injectable()
export class PermissionsGuard implements CanActivate {
  // Hierarquia de níveis de acesso
  private accessLevels: Record<AccessLevel, number> = {
    [AccessLevel.NONE]: 0,
    [AccessLevel.VIEW]: 1,
    [AccessLevel.EDIT]: 2,
    [AccessLevel.FULL]: 3,
  };

  constructor(
    private reflector: Reflector,
    private prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requirement = this.reflector.getAllAndOverride<PermissionRequirement>(
      PERMISSION_KEY,
      [context.getHandler(), context.getClass()],
    );

    // Se não tiver requisito de permissão, permite
    if (!requirement) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();

    if (!user) {
      throw new ForbiddenException('Usuário não autenticado');
    }

    // ADMIN tem acesso total a tudo
    if (user.role === Role.ADMIN) {
      return true;
    }

    // Buscar permissão do role para o módulo
    const permission = await this.prisma.rolePermission.findUnique({
      where: {
        role_module: {
          role: user.role as Role,
          module: requirement.module,
        },
      },
    });

    // Se não tiver permissão configurada, negar acesso
    if (!permission) {
      throw new ForbiddenException(
        `Você não tem permissão para acessar o módulo ${requirement.module}`,
      );
    }

    // Verificar se o nível de acesso é suficiente
    const userAccessLevel = this.accessLevels[permission.accessLevel];
    const requiredAccessLevel = this.accessLevels[requirement.minAccess];

    if (userAccessLevel < requiredAccessLevel) {
      throw new ForbiddenException(
        `Nível de acesso insuficiente para ${requirement.module}. Necessário: ${requirement.minAccess}, Atual: ${permission.accessLevel}`,
      );
    }

    return true;
  }
}
