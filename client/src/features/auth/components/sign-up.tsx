import Google from "@/assets/icons/GoogleIcon";
import AuthForm from "@/components/auth/AuthForm";
import Form from "@/components/forms/Form";
import Input from "@/components/forms/Input";
import SeparatorText from "@/components/SeparatorText";
import { Button } from "@/components/ui/button";
import { signInWithGoogle, useRegisterUser } from "@/features/auth/api";
import useZodForm from "@/hooks/useZodForm";

import { IUser } from "@/schema/user";
import useUserStore from "@/store/userUserStore";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { SIGN_UP_SCHEMA, SignUpSchemaType } from "../schema";

type Props = {};

const SignUpScreen = (props: Props) => {
  const router = useRouter();
  // useIsAuth(true);
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
  const { handleRegister } = useRegisterUser();

  const onSubmit = async (e: SignUpSchemaType) => {
    try {
      const result = await handleRegister(e);
      console.log(result, "result");
      if (result.success) {
        toast.success(result.message);
        setUser({
          user: result.data as IUser,
          isAuthenticated: true,
          isLoggedIn: true,
        });
        return router.replace("/client");
      }
    } catch (error: any) {
      toast.error(error.message || "Registration failed");
    }
  };

  const SignInWithG = async () => {
    try {
      const result = await signInWithGoogle();
      router.replace(result.data);
    } catch (error) {}
  };

  return (
    <div className="relative flex w-full  h-screen bg-background justify-center items-center">
      <AuthForm
        title="Begin your journey!"
        description="Create your account to continue."
        className=""
        footer={
          <div className="w-full flex flex-col gap-2 items-center justify-center">
            <Button
              type="button"
              className="w-full"
              onClick={form.handleSubmit(onSubmit)}
            >
              Sign up
            </Button>
            <SeparatorText text="OR" className="py-1" />
            <Button
              type="button"
              variant={"outline"}
              className=" w-full gap-2 text-gray-600"
              onClick={SignInWithG}
            >
              <Google /> Continue with Google
            </Button>
            <div className="flex  gap-1 text-sm">
              <span className="text-gray-400">Alreay have an account?</span>
              <Link href={"/login"} className="text-blue-400 hover:underline">
                Login
              </Link>
            </div>
          </div>
        }
      >
        <Form form={form} onSubmit={onSubmit} className="space-y-5">
          <Input
            name="name"
            placeholder="Enter name"
            label="Name"
            border="bottom"
          />
          <Input
            border="bottom"
            name="email"
            placeholder="Enter email..."
            type="email"
            label="Email"
          />
          <Input
            border="bottom"
            name="password"
            placeholder="********"
            type="password"
            label="Password"
          />
          <Input
            border="bottom"
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

export default SignUpScreen;
