import type { User } from "./user";
export interface AuthState{
    accessToken: string | null;
    user: User | null;
    loading: boolean;
    signUp:(
username: string, password: string, email: string, firstname: string, lastname: string) => Promise<boolean>

    signIn: (username: string, password: string) => Promise<boolean>
    
}