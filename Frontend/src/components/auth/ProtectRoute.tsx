import { useEffect, useState } from 'react';
import { useAuthStore } from '@/stores/useAuthStore'
import { Navigate, Outlet } from 'react-router';

const ProtectRoute = () => {
    const {accessToken, user, loading, refresh, fetchMe} = useAuthStore();
    const [starting, setStarting] = useState(true);
    
    useEffect(() => {
        let cancelled = false;

        const init = async () => {
            if (!accessToken) {
                await refresh();
            } else if (!user) {
                await fetchMe();
            }

            if (!cancelled) {
                setStarting(false);
            }
        };

        void init();

        return () => {
            cancelled = true;
        };
    }, [accessToken, user, refresh, fetchMe]);
    
    if (starting || loading) {
        return <div className="flex h-screen items-center justify-center">Đang tải trang...</div>;
    }

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