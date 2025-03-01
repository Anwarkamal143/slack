"use client";
import { LoaderIcon, PlusLucidIcon } from "@/assets/icons";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  useGetInfinteCurrentMemberWorkspaces,
  useGetMemberWithWorkspaceByWorkspaceIdIfIsMember,
  useGetUserWorkspacesIfIsMember,
} from "@/features/workspaces/api";
import useRemoveWorkspaceByIdCache from "@/features/workspaces/api/cache/use-remove-workspace-byId-cache";
import { useCreateWorkspaceModalStoreActions } from "@/features/workspaces/store/use-create-workspace-modal";
import useWorkspaceDeleted from "@/hooks/sockets/useWorkspaceDeleted";
import useWorkSpaceId from "@/hooks/useWorkSpaceId";
import { useRouter } from "next/navigation";

type Props = {};

const WorkSpaceSwitcher = (props: Props) => {
  const router = useRouter();
  const onRemoveWorkspaceByIdCache = useRemoveWorkspaceByIdCache();
  useWorkspaceDeleted();
  const workSpaceId = useWorkSpaceId();
  const { data: workspace, isLoading: isWorkspaceLoading } =
    useGetMemberWithWorkspaceByWorkspaceIdIfIsMember(workSpaceId);
  const { data: workspaces, isLoading: isWorkspacesLoading } =
    useGetUserWorkspacesIfIsMember(!!workSpaceId);
  // const { data: workspaceMembers } =
  //   useGetMembersByWorkspaceIdIfUserisMember(workSpaceId);
  const { data: infiniteMembers, fetchNextPage } =
    useGetInfinteCurrentMemberWorkspaces();

  const { setModalOpen } = useCreateWorkspaceModalStoreActions();

  const filteredWorkspaces = workspaces?.data?.filter(
    (ws) => ws.workSpaceId !== workSpaceId
  );
  const activeWorkspaceName = workspace?.data?.workSpace.name || "";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="size-9 relative overflow-hidden bg-[#ABABAD] hover:bg-[#ABABAD]/80 text-slate-800 font-semibold text-xl">
          {isWorkspaceLoading ? (
            <LoaderIcon className="size-5 animate-spin shrink-0" />
          ) : (
            activeWorkspaceName.charAt(0).toUpperCase()
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent side="bottom" align="start" className="w-64">
        <DropdownMenuItem
          onClick={() => router.push(`/workspace/${workSpaceId}`)}
          className="cursor-pointer flex-col justify-start items-start capitalize pb-3"
        >
          {activeWorkspaceName}
          <span className="text-xs leading-[0] text-muted-foreground">
            Active workspace
          </span>
        </DropdownMenuItem>
        {filteredWorkspaces?.map((ws) => (
          <DropdownMenuItem
            key={ws.id}
            className="cursor-pointer capitalize overflow-hidden"
            onClick={() => router.push(`/workspace/${ws.workSpaceId}`)}
          >
            <div className="shrink-0 size-9 relative overflow-hidden bg-[#616061]  text-white font-semibold text-lg rounded-md flex items-center justify-center mr-2">
              {ws?.workSpace?.name?.charAt(0).toUpperCase()}
            </div>
            <p className="truncate">{ws?.workSpace?.name}</p>
          </DropdownMenuItem>
        ))}
        <DropdownMenuItem
          className="cursor-pointer"
          onClick={() => setModalOpen(true)}
        >
          <div className="size-9 relative overflow-hidden bg-[#F2F2F2]  text-slate-800 font-semibold text-lg rounded-md flex items-center justify-center mr-2">
            <PlusLucidIcon />
          </div>
          Create a new workspace
        </DropdownMenuItem>
        <DropdownMenuItem
          className="cursor-pointer"
          onClick={() => fetchNextPage()}
        >
          <div className="size-9 relative overflow-hidden bg-[#F2F2F2]  text-slate-800 font-semibold text-lg rounded-md flex items-center justify-center mr-2">
            <PlusLucidIcon />
          </div>
          More
        </DropdownMenuItem>
        <DropdownMenuItem
          className="cursor-pointer"
          onClick={() => {
            onRemoveWorkspaceByIdCache(workSpaceId);

            router.replace("/");
          }}
        >
          <div className="size-9 relative overflow-hidden bg-[#F2F2F2]  text-slate-800 font-semibold text-lg rounded-md flex items-center justify-center mr-2">
            <PlusLucidIcon />
          </div>
          Remove
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default WorkSpaceSwitcher;
