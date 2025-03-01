"use client";
import {
  AlertTriangleLucidIcon,
  HashIconLucidIcon,
  MessageSquareTextLucidIcon,
  SendHorizonalLucidIcon,
} from "@/assets/icons";
import DataLoader from "@/components/data-loader";
import { useGetUserChannelsByWorkspaceId } from "@/features/channels/api";
import { useCreateWorkspaceChannelModalStoreActions } from "@/features/channels/store/use-create-workspace-channel-modal";
import {
  useGetMembersByWorkspaceIdIfUserisMember,
  useGetMemberWithWorkspaceByWorkspaceIdIfIsMember,
  useGetWorkspace,
} from "@/features/workspaces/api";
import useWorkSpaceId from "@/hooks/useWorkSpaceId";
import { canAdminAccess } from "@/lib";
import SidebarItem from "./sidebar-item";
import UserItem from "./user-item";
import WorkspaceHeader from "./workspace-header";
import WorkspaceSection from "./workspace-section";

type Props = {};

const WorkspaceSidebar = (props: Props) => {
  const workSpaceId = useWorkSpaceId();
  const { isLoading: isMemberLoading, data: member } =
    useGetMemberWithWorkspaceByWorkspaceIdIfIsMember(workSpaceId);
  const { isLoading: isWorkspaceLoading, data: workspaceData } =
    useGetWorkspace(workSpaceId);
  const { isLoading: isChannelsLoading, data: channelsData } =
    useGetUserChannelsByWorkspaceId(workSpaceId);
  const { isLoading: isWrokspaceMembersloading, data: workspaceMembers } =
    useGetMembersByWorkspaceIdIfUserisMember(workSpaceId);
  const { setModalOpen } = useCreateWorkspaceChannelModalStoreActions();
  if (isWorkspaceLoading || isMemberLoading) {
    return (
      <div className="flex h-full w-full items-center flex-col bg-slack-channel justify-center">
        <DataLoader />
      </div>
    );
  }
  const channels = channelsData?.data || [];
  const wworkspace = workspaceData?.data;
  const memberdata = member?.data;
  if (!memberdata?.id || !wworkspace?.id) {
    return (
      <div className="flex h-full gap-y-2 w-full items-center flex-col bg-slack-channel justify-center">
        <AlertTriangleLucidIcon className="size-5 text-white" />
        <p className="text-white text-sm">Workspace not found</p>
      </div>
    );
  }
  return (
    <div className="flex h-full flex-col bg-slack-channel">
      <WorkspaceHeader
        workspace={wworkspace}
        isAdmin={memberdata.role === "admin"}
      />
      <div className="flex flex-col px-2 mt-3 space-y-2">
        <SidebarItem
          label="Threads"
          icon={MessageSquareTextLucidIcon}
          id="threads"
        />
        <SidebarItem
          label="Drafts & Sent"
          icon={SendHorizonalLucidIcon}
          id="drafts"
        />
      </div>
      {isChannelsLoading ? (
        <DataLoader />
      ) : (
        <>
          <WorkspaceSection
            label="Channels"
            hint="New chennel"
            onNew={() => {
              console.log("channels click");
              if (canAdminAccess(member?.data)) {
                setModalOpen(true);
              }
            }}
          >
            {channels?.map((channel) => (
              <SidebarItem
                key={channel.id}
                id={channel.id}
                label={channel.name}
                icon={HashIconLucidIcon}
              />
            ))}
          </WorkspaceSection>
          <WorkspaceSection
            label="Direct Messages"
            hint="New direct message"
            onNew={() => {}}
          >
            {workspaceMembers?.data?.map((member) => {
              return (
                <UserItem
                  key={member.id}
                  label={member.user?.name}
                  id={member.id}
                  image={member?.user?.image as string}
                />
              );
            })}
          </WorkspaceSection>
        </>
      )}
    </div>
  );
};

export default WorkspaceSidebar;
