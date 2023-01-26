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
            fullName: 'Test One',
            password: hashPasswordSync('secret'),
            roles: ['admin']
        },
        {
            email: 'user2@gmail.com',
            fullName: 'Test Two',
            password: hashPasswordSync('secret'),
            roles: ['user',]
        }
    ],
}