import bcrypt from 'bcrypt';

export const hashPassword = (password: string): Promise<string> => {
    return bcrypt.hash(password, 10);
};

export const comparePasswords = (
    password: string,
    hashedPassword: string
): Promise<boolean> => {
    return bcrypt.compare(password, hashedPassword);
};