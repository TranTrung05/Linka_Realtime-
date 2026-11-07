import type { User } from "./user";
export interface AuthState{
    accessToken: string | null;
    user: User | null;
    loading: boolean;

    clearState: () => void;
    signUp:(
username: string, password: string, email: string, firstname: string, lastname: string) => Promise<boolean>

    signIn: (username: string, password: string) => Promise<boolean>
    signOut: () => Promise<void>
    refreshSession: () => Promise<boolean>
}