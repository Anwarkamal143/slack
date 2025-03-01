import { cn } from "@/lib/utils";
import DataLoader from "./data-loader";
import { Button, ButtonProps } from "./ui/button";

type Props = ButtonProps & {
  isloading?: boolean;
};

const ButtonLoader = ({ isloading, className, ...rest }: Props) => {
  return (
    <Button className={cn("flex gap-1", className)} {...rest}>
      {rest.children} {isloading ? <DataLoader className="h-2/6 !w-4" /> : null}
    </Button>
  );
};

export default ButtonLoader;
