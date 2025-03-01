"use client";
import { InfoLucidIcon, SearchLucidIcon } from "@/assets/icons";
import { Button } from "@/components/ui/button";
import { useGetMemberWithWorkspaceByWorkspaceIdIfIsMember } from "@/features/workspaces/api";
import useWorkSpaceId from "@/hooks/useWorkSpaceId";

type Props = {};

const Toolbar = (props: Props) => {
  const workSpaceId = useWorkSpaceId();
  const { isLoading, data } =
    useGetMemberWithWorkspaceByWorkspaceIdIfIsMember(workSpaceId);
  return (
    <nav className="bg-slack-bg flex items-center justify-between h-10 p-1.5">
      <div className="flex-1" />
      <div className="min-w-[280px] max-w-[642px] grow-[2] shrink">
        <Button
          size="sm"
          className="bg-accent/25 hover:bg-accent/25 w-full justify-start h-7 px-2"
        >
          <SearchLucidIcon className="size-4 text-white mr-2" />
          <span className="text-white text-xs">
            Search {data?.data?.workSpace?.name}
          </span>
        </Button>
      </div>
      <div className="ml-auto flex-1 flex items-center justify-end">
        <Button variant={"transparent"} size={"iconSm"} className="">
          <InfoLucidIcon className="size-5 text-white" />
        </Button>
      </div>
    </nav>
  );
};

export default Toolbar;
