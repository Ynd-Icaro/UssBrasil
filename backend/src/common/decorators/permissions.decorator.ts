import { SetMetadata } from '@nestjs/common';
import { SystemModule, AccessLevel } from '@prisma/client';

export const PERMISSION_KEY = 'permission';

export interface PermissionRequirement {
  module: SystemModule;
  minAccess: AccessLevel;
}

export const RequirePermission = (module: SystemModule, minAccess: AccessLevel = AccessLevel.VIEW) =>
  SetMetadata(PERMISSION_KEY, { module, minAccess } as PermissionRequirement);

// Helpers para cada módulo
export const ViewProducts = () => RequirePermission(SystemModule.PRODUCTS, AccessLevel.VIEW);
export const EditProducts = () => RequirePermission(SystemModule.PRODUCTS, AccessLevel.EDIT);
export const FullProducts = () => RequirePermission(SystemModule.PRODUCTS, AccessLevel.FULL);

export const ViewOrders = () => RequirePermission(SystemModule.ORDERS, AccessLevel.VIEW);
export const EditOrders = () => RequirePermission(SystemModule.ORDERS, AccessLevel.EDIT);
export const FullOrders = () => RequirePermission(SystemModule.ORDERS, AccessLevel.FULL);

export const ViewCategories = () => RequirePermission(SystemModule.CATEGORIES, AccessLevel.VIEW);
export const EditCategories = () => RequirePermission(SystemModule.CATEGORIES, AccessLevel.EDIT);

export const ViewCustomers = () => RequirePermission(SystemModule.CUSTOMERS, AccessLevel.VIEW);
export const EditCustomers = () => RequirePermission(SystemModule.CUSTOMERS, AccessLevel.EDIT);

export const ViewReports = () => RequirePermission(SystemModule.REPORTS, AccessLevel.VIEW);
export const ManageSettings = () => RequirePermission(SystemModule.SETTINGS, AccessLevel.FULL);
export const ManageIntegrations = () => RequirePermission(SystemModule.INTEGRATIONS, AccessLevel.FULL);
export const ManageUsers = () => RequirePermission(SystemModule.USERS, AccessLevel.FULL);
