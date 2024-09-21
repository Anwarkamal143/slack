"use client";
import { signUp } from "@/api/auth";
import AuthForm from "@/components/auth/AuthForm";
import Form from "@/components/forms/Form";
import Input from "@/components/forms/Input";
import { Button } from "@/components/ui/button";
import useIsAuth from "@/hooks/useIsAuth";
import useZodForm from "@/hooks/useZodForm";
import { SIGN_UP_SCHEMA, SignUpSchemaType } from "@/schema/auth";
import { IUser } from "@/schema/user";
import useUserStore from "@/store/userStore";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

type Props = {};

const SignUpPage = (props: Props) => {
  const router = useRouter();
  useIsAuth(true);
  const form = useZodForm({
    schema: SIGN_UP_SCHEMA,
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });
  const setUser = useUserStore((state) => state.setUser);
  const onSubmit = async (e: SignUpSchemaType) => {
    console.log("hello there", e);
    const result = await signUp(e);

    if (result.success) {
      toast.success(result.message);
      setUser({
        user: result.data.user as IUser,
        isAuthenticated: true,
        isLoggedIn: true,
      });
      return router.push("/client");
    }
    toast.error(result.message);
  };

  return (
    <div className="relative flex w-full  h-screen bg-background justify-center items-center">
      <AuthForm
        title="Begin your journey!"
        description="Create your account to continue."
        footer={
          <div className="w-full flex flex-col gap-2 items-center justify-center">
            <Button
              type="button"
              className="w-full"
              onClick={form.handleSubmit(onSubmit)}
            >
              Sign up
            </Button>
            <div className="flex  gap-1 text-sm">
              <span className="text-gray-400">Alreay have an account?</span>
              <Link href={"/login"} className="text-blue-400">
                Login
              </Link>
            </div>
          </div>
        }
      >
        <Form form={form} onSubmit={onSubmit}>
          <Input name="name" placeholder="Enter name" label="Name" />
          <Input
            name="email"
            placeholder="Enter email..."
            type="email"
            label="Email"
          />
          <Input
            name="password"
            placeholder="********"
            type="password"
            label="Password"
          />
          <Input
            name="confirmPassword"
            placeholder="********"
            type="password"
            label="Confirm Password"
          />
        </Form>
      </AuthForm>
    </div>
  );
};

export default SignUpPage;
