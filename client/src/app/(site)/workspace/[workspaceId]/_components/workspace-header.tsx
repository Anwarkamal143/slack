import {
  ChevronDownLucidIcon,
  ListFilterLucidIcon,
  SquarePenLucidIcon,
} from "@/assets/icons";
import Hint from "@/components/hint";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { IWorkSpace } from "@/features/workspaces/schemas";
import { useState } from "react";
import PreferencesModal from "./preferences-modal";

type Props = {
  workspace?: IWorkSpace;
  isAdmin: boolean;
};

const WorkspaceHeader = (props: Props) => {
  const { workspace, isAdmin } = props;

  const [isPreferencesOpen, setPreferencesOpen] = useState(false);

  const getAdminItems = () => {
    if (isAdmin) {
      return (
        <>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="cursor-pointer py-2" onClick={() => {}}>
            Invite people to {workspace?.name}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="cursor-pointer py-2"
            onClick={() => {
              setPreferencesOpen(true);
            }}
          >
            Preferences
          </DropdownMenuItem>
        </>
      );
    }
    return null;
  };
  return (
    <>
      <PreferencesModal
        open={isPreferencesOpen}
        onOpenChange={setPreferencesOpen}
        initialValue={workspace?.name as string}
      />
      <div className="flex items-center justify-between px-4 h-[49px] gap-0.5">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant={"transparent"}
              className="font-semibold text-lg w-auto p-1.5 overflow-hidden"
              size={"sm"}
            >
              <span className="truncate">{workspace?.name}</span>
              <ChevronDownLucidIcon className="size-4 ml-1 shrink-0" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent side="bottom" align="start" className="w-64">
            <DropdownMenuItem
              key={workspace?.id}
              className="cursor-pointer capitalize"
            >
              <div className="size-9 relative overflow-hidden bg-[#616061] text-white font-semibold text-xl rounded-md  flex items-center justify-center mr-2">
                {workspace?.name?.charAt(0)?.toUpperCase()}
              </div>
              <div className="flex flex-col items-start">
                <p className="font-bold">{workspace?.name}</p>
                <p className="text-xs text-muted-foreground">
                  Active workspace
                </p>
              </div>
            </DropdownMenuItem>
            {getAdminItems()}
          </DropdownMenuContent>
        </DropdownMenu>
        <div className="flex items-center gap-0.5">
          <Hint label="Filter conversation" side="bottom">
            <Button variant={"transparent"} size={"iconSm"}>
              <ListFilterLucidIcon className="size-4" />
            </Button>
          </Hint>
          <Hint label="New Message" side="bottom">
            <Button variant={"transparent"} size={"iconSm"}>
              <SquarePenLucidIcon className="size-4" />
            </Button>
          </Hint>
        </div>
      </div>
    </>
  );
};

export default WorkspaceHeader;
