import jwt from 'jsonwebtoken';

const secret = 'abc123';
const EXPIRES = 60;

export const createJWT = async function (payload: number) {
    const token = jwt.sign({ userId: payload }, secret, { expiresIn: EXPIRES });
    return token;
};

export const validateJWT = async function (token: string): Promise<boolean> {
    try {
        jwt.verify(token, secret)
        return true
        
    } catch (error) {
        console.error('Erro ao validar o token:', error)
        return false 
    }
};
