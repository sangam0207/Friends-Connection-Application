import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Link,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { PATHS } from "@/constants/page-paths";
import api from "@/services";
import { useUserStore,useTokenStore } from "@/store";
import { LockKeyhole, Mail } from "lucide-react";
import { toast, Toaster } from "sonner";
const loginFormSchema = z.object({
  email: z
    .string()
    .min(1, { message: "This is required" })
    .email("Invalid email"),
  password: z.string().min(1, { message: "This is required" }),
  remember: z.boolean().optional(),
});

const Index = () => {
const navigate = useNavigate();
const{setUser,setAuthenticated,setCount}=useUserStore()
const{setToken}=useTokenStore()

  const form = useForm({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
      remember: false,
    },
  });

  const handleLogin = async (data: z.infer<typeof loginFormSchema>) => {
    try {
      const res=await api.post('/auth/login',data);
      if(res.data.success){
        setToken(res.data.data.token);
        setUser(res.data.data.user)
        setCount(res.data.data.user.totalRequest)
        setAuthenticated(true)
        toast.success("Logged in successfully")
        setTimeout(()=>{
          navigate('/')
        })
      }
    } catch (error) {
      console.log(error)
      toast.error("Failed to login")
    }
  };

  return (
    <>
     <Toaster theme="dark" />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleLogin)}
          className="flex flex-col space-y-6"
        >
          <div className="text-center space-y-2">
            <h2>Login to Friend's App</h2>
            <p className="text-stone-500">
            Login to Friends app , And connect with your friends.
            </p>
          </div>
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      {...field}
                      type="email"
                      autoComplete="off"
                      placeholder="Enter Email"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <PasswordInput
                      {...field}
                      placeholder="Enter Password"
                      autoComplete="off"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center justify-between">
              <FormField
                control={form.control}
                name="remember"
                render={({ field }) => (
                  <FormItem className="flex items-center gap-2">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel className="!mt-0">Remember me</FormLabel>
                  </FormItem>
                )}
              />
            </div>
          </div>
          <Button type="submit" className="w-full">
            Login
          </Button>{" "}
          <p className="text-stone-500 text-center leading-[0px]">or</p>
          <p className="text-center font-light">
            New User?&nbsp;
            <Link to={PATHS.SIGNUP} className="font-medium text-primary">
              Sign Up
            </Link>
          </p>
        </form>
      </Form>
    </>
  );
};

export default Index;
