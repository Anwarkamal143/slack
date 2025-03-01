import { EmailIcon, EyeCloseIcon, EyeIcon, GoogleIcon } from "@/assets/icons";
import { signInWithGoogle } from "@/features/auth/api";

import AuthForm from "@/components/auth/AuthForm";
import Form from "@/components/forms/Form";
import Input from "@/components/forms/Input";
import SeparatorText from "@/components/SeparatorText";
import { Button } from "@/components/ui/button";
import useZodForm from "@/hooks/useZodForm";
import useUserStore from "@/store/userUserStore";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { useSignIn } from "../api/hooks";
import { SIGN_IN_SCHEMA, SignInSchemaType } from "../schema";

const SignInScreen = () => {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const [isSocialLogginIn, setIsSocialLogginIn] = useState(false);
  const setUser = useUserStore((state) => state.setUser);

  const { handleSignIn } = useSignIn();
  const form = useZodForm({
    schema: SIGN_IN_SCHEMA,
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const onSubmit = async (e: SignInSchemaType) => {
    try {
      const parseResult = SIGN_IN_SCHEMA.safeParse(e);
      if (!parseResult.success) {
        toast.error("Please provide a valid data");
        return {
          message: parseResult.error.errors[0].message,
          error: true,
          success: false,
        };
      }
      const { data, message } = await handleSignIn(e);

      if (data?.id) {
        toast.success(message);
        const { accessToken, refreshToken, ...rest } = data;
        setUser({
          user: rest,
          isAuthenticated: true,
          isLoggedIn: true,
        });
        router.replace("/client");
      } else {
        toast.error(message);
      }
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const SignInWithG = async () => {
    try {
      setIsSocialLogginIn(true);
      const result = await signInWithGoogle();
      const { data } = result;
      router.replace(data);
    } catch (error) {
    } finally {
      setIsSocialLogginIn(false);
    }
  };
  const { formState } = form;
  const isFormSubmitting = formState.isSubmitting || isSocialLogginIn;
  return (
    <>
      <div className="relative  flex w-full bg-background  h-screen  justify-center items-center   ">
        <div className="flex h-screen max-w-[80%]  mx-auto justify-center items-center w-full ">
          <div className=" flex h-screen justify-center items-center w-full">
            <AuthForm
              className=" shrink-0  space-y-3 "
              title="Welcome back!"
              description="Sign in to your account and explore a world of possibilities. Your journey begins here.
"
              footer={
                <div className="w-full flex flex-col gap-2 items-center justify-center">
                  <Button
                    type="button"
                    className="w-full"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      form.handleSubmit(onSubmit)(e);
                    }}
                    disabled={isFormSubmitting}
                  >
                    Login
                  </Button>
                  <SeparatorText text="OR" className="py-1" />
                  <Button
                    type="button"
                    variant={"outline"}
                    className=" w-full gap-2 text-gray-600"
                    onClick={(e) => {
                      e.stopPropagation();
                      SignInWithG();
                    }}
                    disabled={isFormSubmitting}
                  >
                    <GoogleIcon /> Continue with Google
                  </Button>
                  <div className="flex  gap-1 pt-1 text-sm">
                    <span className="text-gray-400">
                      Don&apos;t have an account?
                    </span>
                    <Link
                      href={"/sign-up"}
                      className="text-blue-400 hover:underline"
                    >
                      Sign Up
                    </Link>
                  </div>
                </div>
              }
            >
              <Form form={form} onSubmit={onSubmit} className="space-y-6">
                <Input
                  name="email"
                  placeholder="Enter your email"
                  type="email"
                  label="Email"
                  border="bottom"
                  rightIcon={{
                    Icon: <EmailIcon />,
                  }}
                />
                <Input
                  name="password"
                  placeholder="********"
                  type={!showPassword ? "password" : "text"}
                  label="Password"
                  border="bottom"
                  rightIcon={{
                    Icon: !showPassword ? <EyeIcon /> : <EyeCloseIcon />,
                    onClick(e, { value, name }) {
                      setShowPassword((show) => !show);
                    },
                  }}
                />
              </Form>
            </AuthForm>
          </div>
        </div>
      </div>
    </>
  );
};

export default SignInScreen;
