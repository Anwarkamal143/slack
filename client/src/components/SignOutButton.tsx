"use client";
import { signOut } from "@/actions/auth.actions";
import useUserStore from "@/store/userStore";
import { Button } from "./ui/button";

type Props = {};

const SignOutButton = (props: Props) => {
  const logOut = useUserStore((state) => state.reset);
  const onLogout = () => {};
  return (
    <div>
      <Button
        onClick={() => {
          logOut();
          signOut();
        }}
      >
        Logout
      </Button>
    </div>
  );
};

export default SignOutButton;
