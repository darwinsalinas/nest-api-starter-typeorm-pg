import * as bcrypt from 'bcrypt';

const defaultSaltRounds = 10;

export const hashPassword = async (password: string) => {
    const hash = await bcrypt.hash(password, defaultSaltRounds);

    return hash;
}

export const hashPasswordSync = (password: string) => {
    const hash = bcrypt.hashSync(password, defaultSaltRounds);

    return hash;
}