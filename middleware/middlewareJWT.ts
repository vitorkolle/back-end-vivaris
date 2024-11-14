import jwt from 'jsonwebtoken';

const secret = 'abc123';
const EXPIRES = 60 * 60;

interface payload {
    id: number,
    role: 'client' | 'professional'
}

export async function createJWT (payload: payload) : Promise<boolean |string> {
    const token = jwt.sign({ userId: payload.id, role: payload.role}, secret, { expiresIn: EXPIRES });

    if (!token) {
        return false
    }

    return token
}

export async function getRole(token : string) : Promise<string> {
    const verify = jwt.verify(token, secret) as {userId: number, role: string}

    if(!verify){    
        return 'Função Inválida'
    }

    return verify.role
}

export async function validateJWT(token: string): Promise<boolean> {
    const verify = jwt.verify(token, secret) as {userId: number, role: string}

    return verify ? true : false
}