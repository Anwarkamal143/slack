"use client";
import { signIn, signInWithGoogle } from "@/api/auth";
// import { signIn } from "@/actions/auth.actions";
import AuthForm from "@/components/auth/AuthForm";
import Form from "@/components/forms/Form";
import Input from "@/components/forms/Input";
import { Button } from "@/components/ui/button";
import useIsAuth from "@/hooks/useIsAuth";
import useZodForm from "@/hooks/useZodForm";
import { SIGN_IN_SCHEMA, SignInSchemaType } from "@/schema/auth";
import { IUser } from "@/schema/user";
import useUserStore from "@/store/userStore";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

type Props = {};

const SignInPage = (props: Props) => {
  const router = useRouter();

  const setUser = useUserStore((state) => state.setUser);

  useIsAuth(true);

  const form = useZodForm({
    schema: SIGN_IN_SCHEMA,
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const onSubmit = async (e: SignInSchemaType) => {
    try {
      const result = await signIn({ email: e.email, password: e.password });
      if (result.success) {
        toast.success(result.message);
        setUser({
          user: result.data.user as IUser,
          isAuthenticated: true,
          isLoggedIn: true,
        });
        router.replace("/client");
      } else {
        toast.error(result.message);
      }
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const SignInWithG = async () => {
    console.log("Cool");
    try {
      const result = await signInWithGoogle();

      console.log(result, "Result");
      location.href = result;
    } catch (error) {}
  };
  return (
    <div className="relative flex w-full  h-screen bg-background justify-center items-center">
      <AuthForm
        title="Welcome back!"
        description="Sign in to continue"
        footer={
          <div className="w-full flex flex-col gap-2 items-center justify-center">
            <Button
              type="button"
              className="w-full"
              onClick={form.handleSubmit(onSubmit)}
            >
              Login
            </Button>
            <Button type="button" className="w-full" onClick={SignInWithG}>
              Login with google
            </Button>
            <div className="flex  gap-1 text-sm">
              <span className="text-gray-400">Don&apos;t have an account?</span>
              <Link href={"/sign-up"} className="text-blue-400">
                Sign Up
              </Link>
            </div>
          </div>
        }
      >
        <Form form={form} onSubmit={onSubmit}>
          <Input
            name="email"
            placeholder="Enter your email..."
            type="email"
            label="Email"
          />
          <Input
            name="password"
            placeholder="********"
            type="password"
            label="Password"
          />
        </Form>
      </AuthForm>
    </div>
  );
};

export default SignInPage;
