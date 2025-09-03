// Системные разрешения
export const SystemPermissions = {
  // Управление пользователями
  USERS_MANAGE: 'users:manage',
  USERS_CREATE: 'users:create',
  USERS_READ: 'users:read',
  USERS_UPDATE: 'users:update',
  USERS_DELETE: 'users:delete',
  
  // Управление ролями
  ROLES_MANAGE: 'roles:manage',
  ROLES_CREATE: 'roles:create',
  ROLES_READ: 'roles:read',
  ROLES_UPDATE: 'roles:update',
  ROLES_DELETE: 'roles:delete',
  
  // Управление разрешениями
  PERMISSIONS_MANAGE: 'permissions:manage',
  PERMISSIONS_READ: 'permissions:read',
  
  // Управление устройствами
  DEVICES_MANAGE: 'devices:manage',
  DEVICES_CREATE: 'devices:create',
  DEVICES_READ: 'devices:read',
  DEVICES_UPDATE: 'devices:update',
  DEVICES_DELETE: 'devices:delete',
  
  // Управление клиентами
  CLIENTS_MANAGE: 'clients:manage',
  CLIENTS_CREATE: 'clients:create',
  CLIENTS_READ: 'clients:read',
  CLIENTS_UPDATE: 'clients:update',
  CLIENTS_DELETE: 'clients:delete',
  
  // Управление формами
  FORMS_MANAGE: 'forms:manage',
  FORMS_CREATE: 'forms:create',
  FORMS_READ: 'forms:read',
  FORMS_UPDATE: 'forms:update',
  FORMS_DELETE: 'forms:delete',
} as const;
