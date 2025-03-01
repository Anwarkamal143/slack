import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import useWorkSpaceId from "@/hooks/useWorkSpaceId";
import { cn } from "@/lib/utils";
import { cva, VariantProps } from "class-variance-authority";
import Link from "next/link";

const userItemVariants = cva(
  "flex items-center gap-1.5 justify-start font-normal h-7 px-4 text-sm overflow-hidden",
  {
    variants: {
      variant: {
        default: "text-[#f9edffcc]",
        active: "text-[#481349] bg-white/90 hover:bg-white/90",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

type IUserItem = {
  id: number;
  label?: string;
  image?: string;
  variant?: VariantProps<typeof userItemVariants>["variant"];
};

const UserItem = (props: IUserItem) => {
  const workspaceId = useWorkSpaceId();
  const { label = "Member", id, image, variant } = props;
  const avatarFallback = label?.charAt(0)?.toLocaleUpperCase();
  return (
    <Button
      variant={"transparent"}
      className={cn(userItemVariants({ variant: variant }))}
      size={"sm"}
      asChild
    >
      <Link href={`/workspace/${workspaceId}/member/${id}`}>
        <Avatar className="size-5 rounded-md mr-1">
          <AvatarImage className="rounded-md" src={image} />
          <AvatarFallback className="rounded-md bg-sky-500 text-xs">
            {avatarFallback}
          </AvatarFallback>
        </Avatar>
        <span className="truncate text-sm">{label}</span>
      </Link>
    </Button>
  );
};

export default UserItem;
