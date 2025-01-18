import { signOut } from "@/actions/auth.actions";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { resetAllStores } from "@/store/useGlobalStore";
import useUserStore from "@/store/userStore";
import { LogOut } from "lucide-react";

type Props = {};

const UserButton = (props: Props) => {
  const user = useUserStore((state) => state.user);
  console.log({ user });
  const avatarFallback = user?.name.charAt(0).toUpperCase();
  const onLogout = () => {
    resetAllStores();
    signOut();
  };
  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger className="outline-none relative">
        <Avatar className="size-10 hover:opacity-75 transition">
          <AvatarImage alt={user?.name} src={user?.image as string} />
          <AvatarFallback className="bg-sky-500 text-white">
            {avatarFallback}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="center" side="right" className="w-60">
        <DropdownMenuItem onClick={onLogout}>
          <LogOut className="size-4 mr-2" />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserButton;
