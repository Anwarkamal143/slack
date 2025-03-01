import ButtonLoader from "@/components/ButtonLoader";
import Form from "@/components/forms/Form";
import Input from "@/components/forms/Input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import useWorkSpaceId from "@/hooks/useWorkSpaceId";
import useZodForm from "@/hooks/useZodForm";
import { toast } from "sonner";
import { useCreateUserChannel } from "../api";
import { CHANNELS_CREATE_SCEHEMA, IChannelInsert } from "../schema";
import {
  useCreateWorkspaceChannelModalStoreActions,
  useCreateWorkspaceChannelModalStoreIsOpen,
} from "../store/use-create-workspace-channel-modal";

const CreateChannelModal = () => {
  const workspaceId = useWorkSpaceId();
  const { setModalOpen } = useCreateWorkspaceChannelModalStoreActions();
  const isOpen = useCreateWorkspaceChannelModalStoreIsOpen();
  const { handleCreateChannel } = useCreateUserChannel(workspaceId);
  const form = useZodForm({
    schema: CHANNELS_CREATE_SCEHEMA,
    defaultValues: {
      name: "",
    },
  });
  const handleClose = () => {
    form.reset();
    setModalOpen(false);
  };
  const onSubmit = async (e: IChannelInsert) => {
    const { success, data } = CHANNELS_CREATE_SCEHEMA.safeParse(e);
    if (!success) {
      toast.error("Please provide a valid name");
      return;
    }
    const { name } = data;
    try {
      await handleCreateChannel({ name: name });
      handleClose();
      toast.success("Channel created");
    } catch (error: any) {
      toast.error(error.message);
    }
  };
  const { name } = form.getValues();
  const isFormSubmitting = form.formState.isSubmitting;
  return (
    <Dialog open={isOpen} onOpenChange={setModalOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add a channel</DialogTitle>
        </DialogHeader>
        <Form form={form} onSubmit={onSubmit} className="space-y-4">
          <Input
            value={name}
            disabled={isFormSubmitting}
            autoFocus
            name="name"
            placeholder="e.g. plan-budget"
            onChange={(e) => {
              form.setValue("name", e.target.value.replace(/\s+/g, "-"), {
                shouldValidate: true,
              });
            }}
          />
          <div className="flex justify-end">
            <ButtonLoader
              className="ml-auto "
              disabled={isFormSubmitting}
              isloading={isFormSubmitting}
            >
              Create
            </ButtonLoader>
          </div>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateChannelModal;
