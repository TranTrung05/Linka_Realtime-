import {create} from "zustand";
import {toast} from "sonner";
import { authService } from "@/services/authService";
import type { AuthState } from "@/types/store";

export const useAuthStore = create<AuthState>((set) => ({
    accessToken: null,
    user: null,
    loading: false,

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
            const accessToken = await authService.signIn(username, password);
            set({accessToken});
            toast.success("Đăng nhập thành công!Chào mừng bạn quay trở lại với Linka!");
            return true;
        }catch(error){
            console.error(error);
            toast.error("Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin đăng nhập.");
            return false;
        }finally{
            set({loading: false});
        }
    }
}));
