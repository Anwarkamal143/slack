import { ReactNode } from "react";

type Props = {
  text: ReactNode;
};

const SeparatorText = (props: Props) => {
  const { text } = props;
  return (
    <div className="flex items-center gap-4 w-full">
      <hr className="w-full" />
      <p className="text-sm text-gray-800 text-center">{text}</p>
      <hr className="w-full " />
    </div>
  );
};

export default SeparatorText;
