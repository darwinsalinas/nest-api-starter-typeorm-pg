import { hashPasswordSync } from '../../common/helpers/hash-password.helper';
interface SeedUser {
    email: string;
    fullName: string;
    password: string;
    roles: string[];
}


interface SeedData {
    users: SeedUser[];
}


export const initialData: SeedData = {
    users: [
        {
            email: 'user1@gmail.com',
            fullName: 'Admin User',
            password: hashPasswordSync('secret'),
            roles: ['admin',]
        },
        {
            email: 'cashier@gmail.com',
            fullName: 'Cashier User',
            password: hashPasswordSync('secret'),
            roles: ['cashier',]
        },
        {
            email: 'accountant@gmail.com',
            fullName: 'Accountant User',
            password: hashPasswordSync('secret'),
            roles: ['accountant',]
        },
        {
            email: 'sales@gmail.com',
            fullName: 'Sales User',
            password: hashPasswordSync('secret'),
            roles: ['sales',]
        }
    ],
}