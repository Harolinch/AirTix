import { randomBytes, scryptSync } from 'crypto';


export class Password{
    static toHash(password: string): string{
        const salt = randomBytes(8).toString('hex');
        const buf: Buffer = scryptSync(password, salt, 64);
        return `${buf.toString('hex')}.${salt}`;
    }

    static compare(storedPassword: string, suppliedPassword: string){
        const [hashedPassword, salt] = storedPassword.split('.');
        const buf: Buffer = scryptSync(suppliedPassword, salt, 64);
        return hashedPassword === buf.toString('hex');            
    }
}

export default Password;