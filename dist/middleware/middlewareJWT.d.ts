interface payload {
    id: number;
    role: 'client' | 'professional';
}
export declare function createJWT(payload: payload): Promise<boolean | string>;
export declare function getRole(token: string): Promise<string>;
export declare function validateJWT(token: string): Promise<boolean>;
export declare function validateJWTRole(token: string, user: string): Promise<boolean>;
export {};
