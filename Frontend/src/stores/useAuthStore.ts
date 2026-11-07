import {create} from "zustand";
import {toast} from "sonner";
import { authService } from "@/services/authService";
import type { AuthState } from "@/types/store";
import { setApiAccessToken } from "@/lib/axios";

export const useAuthStore = create<AuthState>((set, get) => ({
    accessToken: null,
    user: null,
    loading: true,

    clearState: () => {
        setApiAccessToken(null);
        set({accessToken: null, user: null, loading: false});
    },

    signUp : async(username, password, email, firstname, lastname) => {
        try{
            
            set({loading: true});
            // goi API 
            await authService.signUp(username, password, email, firstname, lastname);

            toast.success("Đăng ký thành công. Bạn sẽ được chuyển sang trang đăng nhập!");
            return true;
        }catch(error){
            console.error(error);
            toast.error("Đăng ký thất bại. Vui lòng thử lại sau.");
            return false;
        }finally{
            set({loading: false});
        }
    },

    signIn : async(username, password) => {
        try{
            set({loading: true});
            const {accessToken, user} = await authService.signIn(username, password);
            setApiAccessToken(accessToken);
            set({accessToken, user});
            toast.success("Đăng nhập thành công!Chào mừng bạn quay trở lại với Linka!");
            return true;
        }catch(error){
            console.error(error);
            toast.error("Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin đăng nhập.");
            return false;
        }finally{
            set({loading: false});
        }
    },

    refreshSession: async () => {
        try {
            set({loading: true});
            const {accessToken, user} = await authService.refresh();
            setApiAccessToken(accessToken);
            set({accessToken, user, loading: false});
            return true;
        }catch(error){
            get().clearState();
            return false;
        }
    },

    signOut: async() => {
        try{
            get().clearState();
            await authService.signOut();
            toast.success("Đăng xuất thành công!");
        }catch(error){
            console.error(error);
            toast.error("Đăng xuất thất bại. Vui lòng thử lại sau.");
        }
    }
}));
