"use client";
import { signInWithGoogle, signUp } from "@/api/auth";
import Google from "@/assets/icons/GoogleIcon";
import AuthForm from "@/components/auth/AuthForm";
import Form from "@/components/forms/Form";
import Input from "@/components/forms/Input";
import SeparatorText from "@/components/SeparatorText";
import { Button } from "@/components/ui/button";
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
  const onSubmit = async (e: SignUpSchemaType) => {
    const result = await signUp(e);
    if (result.success) {
      toast.success(result.message);
      const { user } = result.data;
      setUser({
        user: user as IUser,
        isAuthenticated: true,
        isLoggedIn: true,
      });
      return router.replace("/client");
    }
    toast.error(result.message);
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
        <Form form={form} onSubmit={onSubmit} fieldSetclassName="space-y-5">
          <Input name="name" placeholder="Enter name" label="Name" border="b" />
          <Input
            name="email"
            placeholder="Enter email..."
            type="email"
            label="Email"
            border="b"
          />
          <Input
            name="password"
            placeholder="********"
            type="password"
            label="Password"
            border="b"
          />
          <Input
            name="confirmPassword"
            placeholder="********"
            type="password"
            label="Confirm Password"
            border="b"
          />
        </Form>
      </AuthForm>
    </div>
  );
};

export default SignUpPage;
