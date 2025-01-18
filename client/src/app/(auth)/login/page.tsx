"use client";
import { signIn, signInWithGoogle } from "@/api/auth";
import { EmailIcon, EyeIcon, GoogleIcon } from "@/assets/icons";

import AuthForm from "@/components/auth/AuthForm";
import Form from "@/components/forms/Form";
import Input from "@/components/forms/Input";
import SeparatorText from "@/components/SeparatorText";
import { Button } from "@/components/ui/button";
import useZodForm from "@/hooks/useZodForm";
import { SIGN_IN_SCHEMA, SignInSchemaType } from "@/schema/auth";
import { IUser } from "@/schema/user";
import useUserStore from "@/store/userStore";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

type Props = {};

const SignInPage = (props: Props) => {
  const router = useRouter();
  const [isSocialLogginIn, setIsSocialLogginIn] = useState(false);
  const setUser = useUserStore((state) => state.setUser);

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
          user: result.data as IUser,
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
                    onClick={form.handleSubmit(onSubmit)}
                    disabled={isFormSubmitting}
                  >
                    Login
                  </Button>
                  <SeparatorText text="OR" className="py-1" />
                  <Button
                    type="button"
                    variant={"outline"}
                    className=" w-full gap-2 text-gray-600"
                    onClick={SignInWithG}
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
              <Form
                form={form}
                onSubmit={onSubmit}
                fieldSetclassName="space-y-6"
              >
                <Input
                  name="email"
                  placeholder="Enter your email..."
                  type="email"
                  label="Email"
                  border="b"
                  rightIcon={{
                    Icon: <EmailIcon />,
                  }}
                />
                <Input
                  name="password"
                  placeholder="********"
                  type="password"
                  label="Password"
                  border="b"
                  rightIcon={{
                    Icon: <EyeIcon />,
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

export default SignInPage;
