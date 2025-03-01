import { TrashIconLucidIcon } from "@/assets/icons";
import Form from "@/components/forms/Form";
import Input from "@/components/forms/Input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogProps,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useUserUpdateWorkspace } from "@/features/workspaces/api";
import useUserDeleteWorkspace from "@/features/workspaces/api/use-user-delete-workspace";
import {
  IWorkSpaceUpdate,
  WORKSPACE_UPDATE_SCEHEMA,
} from "@/features/workspaces/schemas";
import useConfirm from "@/hooks/use-confirm";
import useWorkSpaceId from "@/hooks/useWorkSpaceId";
import useZodForm from "@/hooks/useZodForm";
import { useRouter } from "next/navigation";

import { useState } from "react";
import { toast } from "sonner";

type Props = DialogProps & {
  initialValue: string;
};

const PreferencesModal = (props: Props) => {
  const { open, onOpenChange, initialValue } = props;
  const router = useRouter();
  const [ConfirmDialog, confirm] = useConfirm({
    title: "Are you sure?",
    message: "This action is irreversible",
  });
  const [value, setValue] = useState(initialValue);
  const [editOpen, setEditOpen] = useState(false);
  const workSpaceId = useWorkSpaceId();
  const { handleUpdateWorkspace, isPending: isUpdatingWorkspace } =
    useUserUpdateWorkspace(workSpaceId);
  const { handleDelete, isPending: isDeletingWorkspace } =
    useUserDeleteWorkspace(workSpaceId);
  const form = useZodForm({
    mode: "onChange",
    schema: WORKSPACE_UPDATE_SCEHEMA,
    defaultValues: {
      name: value,
    },
  });
  const onHandleDelete = async () => {
    try {
      const ok = await confirm();
      if (!ok) return;
      const data = await handleDelete();
      if (data.id) {
        router.replace("/");
        toast.success("Workspace removed");
      }
    } catch (error) {
      toast.error("Failed to remove workspace");
    }
  };
  const onHandleUpdate = async (data: IWorkSpaceUpdate) => {
    const parseResult = WORKSPACE_UPDATE_SCEHEMA.safeParse(data);
    console.log(parseResult, "parseResult");
    if (!parseResult.success) {
      console.log({ err: parseResult.error });
      // form.setError()
    }
    if (parseResult.success) {
      const updatedData = await handleUpdateWorkspace(data);
      if (updatedData.data) {
        setValue(updatedData.data.name as string);
        setEditOpen(false);
        toast.success("Workspace updated");
      }
    }
  };
  const { name } = form.getValues();

  return (
    <>
      {<ConfirmDialog />}
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="p-0 bg-gray-50 overflow-hidden">
          <DialogHeader className="p-4 border-b bg-white">
            <DialogTitle>{value}</DialogTitle>
          </DialogHeader>
          <div className="px-4 pb-4 flex flex-col gap-y-2">
            <Dialog open={editOpen} onOpenChange={setEditOpen}>
              <DialogTrigger asChild>
                <div className="px-5 py-5 bg-white rounded-lg border cursor-pointer hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold">Workspace name</p>
                    <p className="text-sm text-[#1264a3] hover:underline font-semibold">
                      Edit
                    </p>
                  </div>
                  <div className="text-xs">{value}</div>
                </div>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Rename this workspace</DialogTitle>
                </DialogHeader>
                <Form form={form} onSubmit={onHandleUpdate}>
                  <Input name="name" value={name || ""} />
                  <DialogFooter className="pt-2">
                    <DialogClose asChild>
                      <Button
                        variant={"outline"}
                        disabled={isUpdatingWorkspace}
                      >
                        Cancel
                      </Button>
                    </DialogClose>
                    <Button type="submit" disabled={isUpdatingWorkspace}>
                      Save
                    </Button>
                  </DialogFooter>
                </Form>
              </DialogContent>
            </Dialog>
            <button
              disabled={false}
              onClick={() => onHandleDelete()}
              className="flex items-center gap-x-2 px-5 py-4 bg-white rounded-lg border cursor-pointer hover:bg-gray-50 text-rose-600"
            >
              <TrashIconLucidIcon className="size-4" />
              <p className="text-sm font-semibold">Delete workspace</p>
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PreferencesModal;
