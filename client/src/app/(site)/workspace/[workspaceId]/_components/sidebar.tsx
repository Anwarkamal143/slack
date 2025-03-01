"use client";
import {
  BellLucidIcon,
  HomeLucidIcon,
  MessageSquareLucidIcon,
  MoreHorizontalLucidIcon,
} from "@/assets/icons";
import UserButton from "@/components/user-button";
import { usePathname } from "next/navigation";
import SidebarButton from "./sidebar-button";
import WorkSpaceSwitcher from "./workspace-switcher";

type Props = {};

const Sidebar = (props: Props) => {
  const pathname = usePathname();
  return (
    <aside className="w-[70px] h-full bg-slack-bg flex flex-col gap-y-4 items-center pt-[9px] pb-4">
      <WorkSpaceSwitcher />
      <SidebarButton
        icon={HomeLucidIcon}
        label="Home"
        isActive={pathname.includes("/workspace")}
      />
      <SidebarButton icon={MessageSquareLucidIcon} label="DMs" />
      <SidebarButton icon={BellLucidIcon} label="Activity" />
      <SidebarButton icon={MoreHorizontalLucidIcon} label="More" />
      <div className="flex flex-col items-center justify-center gap-y-1 mt-auto">
        <UserButton />
      </div>
    </aside>
  );
};

export default Sidebar;
