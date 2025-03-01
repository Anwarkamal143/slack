import { Button } from "@/components/ui/button";
import useWorkSpaceId from "@/hooks/useWorkSpaceId";
import { cn } from "@/lib/utils";
import { cva, VariantProps } from "class-variance-authority";
import { LucideIcon } from "lucide-react";
import Link from "next/link";
import { ReactNode } from "react";
const sidebarItemVariants = cva(
  "flex items-center gap-1.5 justify-start font-normal h-7 px-[18px] text-sm overflow-hidden ",

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
type Props = {
  label: ReactNode;
  id: string | number;
  icon: LucideIcon;
  variant?: VariantProps<typeof sidebarItemVariants>["variant"];
};
const SidebarItem = (props: Props) => {
  const { label, icon: Icon, id, variant } = props;
  const workspaceId = useWorkSpaceId();
  return (
    <Button
      asChild
      variant={"transparent"}
      size={"sm"}
      className={cn(sidebarItemVariants({ variant }))}
    >
      <Link href={`/workspace/${workspaceId}/channel/${id}`}>
        <Icon className="size-3.5 mr-1 shrink-0" />
        <span className="truncate text-sm">{label}</span>
      </Link>
    </Button>
  );
};

export default SidebarItem;
