export enum PermissionAction {
  CREATE = 'create',
  READ = 'read',
  UPDATE = 'update',
  DELETE = 'delete',
  MANAGE = 'manage',
}

export interface Permission {
  id: string;
  name: string;
  description?: string;
  resource: string;
  action: PermissionAction;
  createdAt: Date;
  updatedAt: Date;
}
