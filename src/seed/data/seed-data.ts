import { hashPasswordSync } from '../../common/helpers/hash-password.helper';
interface SeedUser {
  email: string;
  fullName: string;
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
      fullName: 'Admin User',
      password: hashPasswordSync('secret'),
      roles: ['admin'],
      permissions: ['all'],
    },
    {
      email: 'cashier@gmail.com',
      fullName: 'Cashier User',
      password: hashPasswordSync('secret'),
      roles: ['cashier'],
      permissions: ['create:invoice'],
    },
    {
      email: 'accountant@gmail.com',
      fullName: 'Accountant User',
      password: hashPasswordSync('secret'),
      roles: ['accountant'],
      permissions: ['read:invoice'],
    },
    {
      email: 'sales@gmail.com',
      fullName: 'Sales User',
      password: hashPasswordSync('secret'),
      roles: ['sales'],
      permissions: ['update:invoice'],
    },
  ],
};
