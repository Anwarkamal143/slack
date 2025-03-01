"use client";
import Form from "@/components/forms/Form";
import Input from "@/components/forms/Input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  useCreateWorkspaceModalStoreActions,
  useCreateWorkspaceModalStoreIsOpen,
} from "@/features/workspaces/store/use-create-workspace-modal";
import useZodForm from "@/hooks/useZodForm";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { z } from "zod";

import { useCreateWorkSpace } from "../api";
import { CREATE_WORK_SPACE_SCHEMA } from "../schemas";

type Props = {};

const CreateWorkspaceModal = (props: Props) => {
  const { setModalOpen } = useCreateWorkspaceModalStoreActions();
  const isModalOpen = useCreateWorkspaceModalStoreIsOpen();
  const { handleCreateWorkSpace, isPending } = useCreateWorkSpace(true);
  const router = useRouter();

  const form = useZodForm({
    schema: CREATE_WORK_SPACE_SCHEMA,
    mode: "onChange",
    defaultValues: {
      name: "",
    },
  });
  const onSubmit = async (values: z.infer<typeof CREATE_WORK_SPACE_SCHEMA>) => {
    try {
      const data = await handleCreateWorkSpace(values);
      router.push(`/workspace/${data.data?.workSpaceId}`);
      toast.success("Work space created");
      form.reset();
    } catch (error: any) {
      toast.error(error.message || "Error creating workspace");
    } finally {
      setModalOpen(false);
    }
  };
  const { getValues } = form;
  const { name } = getValues();
  return (
    <Dialog open={isModalOpen} onOpenChange={setModalOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add a workspace</DialogTitle>
        </DialogHeader>
        <Form form={form} onSubmit={onSubmit} className="space-y-4">
          <Input
            name="name"
            placeholder="Workspace name e.g. 'Work', 'Personal', 'Home'"
            value={name}
            disabled={!!isPending}
          />
          <div className="flex items-end">
            <Button className="ml-auto " disabled={!!isPending}>
              Create
            </Button>
          </div>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateWorkspaceModal;
