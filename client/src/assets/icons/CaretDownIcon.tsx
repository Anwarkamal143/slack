import { cn } from "@/lib/utils";
import React from "react";

type Props = React.SVGAttributes<SVGSVGElement>;

const CaretDown = (props: Props) => {
  const { className, ...rest } = props;
  return (
    <svg
      stroke="currentColor"
      fill="currentColor"
      strokeWidth="0"
      viewBox="0 0 320 512"
      xmlns="http://www.w3.org/2000/svg"
      className={cn(`w-7 h-7`, className)}
      {...rest}
    >
      <path d="M31.3 192h257.3c17.8 0 26.7 21.5 14.1 34.1L174.1 354.8c-7.8 7.8-20.5 7.8-28.3 0L17.2 226.1C4.6 213.5 13.5 192 31.3 192z"></path>
    </svg>
  );
};

export default CaretDown;
