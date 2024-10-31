import { hashPasswordSync } from '../../common/helpers/hash-password.helper';
interface SeedUser {
  email: string;
  name: string;
  password: string;
  roles: string[];
  permissions: string[];
}

interface SeedData {
  users: SeedUser[];
}

export const initialData: SeedData = {
  users: [
    {
      email: 'admin@gmail.com',
      name: 'Admin User',
      password: hashPasswordSync('secret'),
      roles: ['admin'],
      permissions: ['all'],
    },
    {
      email: 'cashier@gmail.com',
      name: 'Cashier User',
      password: hashPasswordSync('secret'),
      roles: ['cashier'],
      permissions: ['create:invoice'],
    },
    {
      email: 'accountant@gmail.com',
      name: 'Accountant User',
      password: hashPasswordSync('secret'),
      roles: ['accountant'],
      permissions: ['read:invoice'],
    },
    {
      email: 'sales@gmail.com',
      name: 'Sales User',
      password: hashPasswordSync('secret'),
      roles: ['sales'],
      permissions: ['update:invoice'],
    },
  ],
};
