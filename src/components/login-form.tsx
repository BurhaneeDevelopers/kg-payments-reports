"use client";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useMutation } from "@tanstack/react-query";
import { usersService } from "@/supabase/services/userService";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { currentUserAtom } from "@/jotai/store";
import { useEffect, useState } from "react";
import { useAtom } from "jotai";
import { Eye, EyeOff } from "lucide-react";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [showPassword, setShowPassword] = useState(false);
  const togglePasswordVisibility = () => setShowPassword((prev) => !prev);
  const router = useRouter();
  const [currentUser, setCurrentUser] = useAtom(currentUserAtom);

  const loginMutation = useMutation({
    mutationFn: async (values: { email: string; password: string }) => {
      return await usersService.loginUser(values.email, values.password);
    },
    onSuccess: async () => {
      router.push("/");
      toast.success("Login successful");
      const user = await usersService.getCurrentUser();
      if (user) {
        setCurrentUser(user);
      }
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Login failed");
    },
  });

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string().email("Invalid email address").required("Required"),
      password: Yup.string().required("Required"),
    }),
    onSubmit: (values) => {
      loginMutation.mutate(values);
    },
  });

  useEffect(() => {
    if (currentUser) {
      router.push("/");
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser]);

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={formik.handleSubmit}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-3">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  {...formik.getFieldProps("email")}
                />
                {formik.touched.email && formik.errors.email ? (
                  <div className="text-sm text-red-500">
                    {formik.errors.email}
                  </div>
                ) : null}
              </div>
              <div className="grid gap-3">
                {/* <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <a
                    href="#"
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                  >
                    Forgot your password?
                  </a>
                </div> */}
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    {...formik.getFieldProps("password")}
                    className="pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={togglePasswordVisibility}
                    className="absolute inset-y-0 right-2 flex items-center text-sm text-muted-foreground"
                    tabIndex={-1}
                  >
                    {showPassword ? (
                      <Eye className="h-4 w-4" />
                    ) : (
                      <EyeOff className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                {formik.touched.password && formik.errors.password ? (
                  <div className="text-sm text-red-500">
                    {formik.errors.password}
                  </div>
                ) : null}
              </div>
              <div className="flex flex-col gap-3">
                <Button className="w-full" disabled={loginMutation.isPending}>
                  {loginMutation.isPending ? "Logging in..." : "Login"}
                </Button>
                {/* <Button variant="outline" className="w-full">
                  Login with Google
                </Button> */}
              </div>
            </div>
            {/* <div className="mt-4 text-center text-sm">
              Don&apos;t have an account?{" "}
              <a href="#" className="underline underline-offset-4">
                Sign up
              </a>
            </div> */}
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
