import { useEffect, useRef } from 'react';
import { useAuthStore } from '@/stores/useAuthStore'
import { Navigate, Outlet } from 'react-router';

const ProtectRoute = () => {
    const {accessToken, loading, refreshSession} = useAuthStore();
    const started = useRef(false);

    useEffect(() => {
        if (!started.current && !accessToken) {
            started.current = true;
            void refreshSession();
        }
    }, [accessToken, refreshSession]);

    if (loading) {
        return <div>Đang xác thực phiên đăng nhập...</div>;
    }

    if(!accessToken ){
        return <Navigate to="/signin" replace></Navigate>
    }
  return (
    <Outlet></Outlet>
  )
}

export default ProtectRoute;