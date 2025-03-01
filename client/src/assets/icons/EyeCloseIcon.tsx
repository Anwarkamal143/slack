import React from "react";

type Props = React.SVGAttributes<SVGSVGElement>;

const EyeCloseIcon = (props: Props) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      // stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      className="lucide lucide-eye-off h-[18px] absolute top-[50%] translate-y-[-50%] right-2 pointer-events-auto cursor-pointer"
      stroke="#bbb"
      {...props}
    >
      <path d="M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49"></path>
      <path d="M14.084 14.158a3 3 0 0 1-4.242-4.242"></path>
      <path d="M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143"></path>
      <path d="m2 2 20 20"></path>
    </svg>
  );
};

export default EyeCloseIcon;
