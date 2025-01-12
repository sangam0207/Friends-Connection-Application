import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom";
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
import { toast, Toaster } from "sonner";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { PATHS } from "@/constants/page-paths"
import api from "@/services";
const loginFormSchema = z
  .object({
    name: z.string().min(1, { message: "This is required" }),
    email: z
      .string()
      .min(1, { message: "This is required" })
      .email("Invalid email"),
    password: z.string().min(6, { message: "Password must be at least 6 characters" }),
    confirm_password: z.string().min(1, { message: "This is required" }),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "Passwords must match",
    path: ["confirm_password"],
  });

const Index = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const location = useLocation();

  const form = useForm({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirm_password: "",
    },
  });

  const handleSignup = async (data: z.infer<typeof loginFormSchema>) => {
    try {
      const res=await api.post('/auth/signup',data);
      if(res.data.success){
        toast.success("Sign up successfully")
        setTimeout(()=>{
          navigate('/login')
        },500)
       
      }
      else{
        toast.error(res.data.message)
      }
     
    } catch (error) {
      console.log(error)
      toast.error("Failed to signup")
    }
  
  };

  return (
    <>
     <Toaster theme="dark" />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSignup)}
          className="flex flex-col space-y-6"
        >
          <div className="text-center space-y-2">
            <h2>Sign up to Friend's App</h2>
            <p className="text-stone-500">
              Create an account to connect with your friends.
            </p>
          </div>

          <div className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      {...field}
                      type="text"
                      autoComplete="off"
                      placeholder="Enter Name"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
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
            <FormField
              control={form.control}
              name="confirm_password"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <PasswordInput
                      {...field}
                      placeholder="Confirm Password"
                      autoComplete="off"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button type="submit" className="w-full">
            Sign up
          </Button>
          <p className="text-stone-500 text-center leading-[0px]">or</p>

          <p className="text-center font-light">
            Already have an account?&nbsp;
            <Link to={PATHS.LOGIN} className="font-medium text-primary">
              Login
            </Link>
          </p>
        </form>
      </Form>
    </>
  );
};

export default Index;
