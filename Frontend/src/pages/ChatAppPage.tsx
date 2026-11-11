


import Logout from "@/components/auth/Logout";
import { useAuthStore } from "@/stores/useAuthStore";
import { Button } from "@base-ui/react/button";
import { toast } from "sonner";
import api from "@/lib/axios";


const ChatAppPage = () => {
  const user = useAuthStore((s) => s.user);
  const handleOnClick = async() => {
    try {
      await api.get("/users/test", {withCredentials: true});
      toast.success("OK");
    } catch (error) {
      toast.error("Thất bại");
      console.error(error);
    }
  }
  return (
    <div>
      {user?.username}
      <Logout></Logout>
      <Button onClick={handleOnClick}>Test</Button>
    </div>
  )
}

export default ChatAppPage;