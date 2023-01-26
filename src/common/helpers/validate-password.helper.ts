import * as bcrypt from 'bcrypt';

export const validatePassword = async (password: string, hashPassword: string): Promise<boolean> => {
    const isValid = await bcrypt.compare(password, hashPassword);

    return isValid;
}