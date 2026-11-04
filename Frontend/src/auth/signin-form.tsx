import { cn } from "cn"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "../components/ui/label"
import {z} from "zod"
import {zodResolver} from "@hookform/resolvers/zod"
import {useForm} from "react-hook-form"

const SignInSchema = z.object({
  username: z.string().min(1, { message: "Tên đăng nhập không được để trống" }),
  password: z.string().min(6, { message: "Mật khẩu phải có ít nhất 6 ký tự" }),
});

type SignInFormValues = z.infer<typeof SignInSchema>;