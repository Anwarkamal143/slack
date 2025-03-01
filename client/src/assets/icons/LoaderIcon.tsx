import { Loader } from "lucide-react";

type Props = {
  className?: string;
};

const LoaderIcon = (props: Props) => {
  const { className } = props;
  return <Loader className={className} />;
};

export default LoaderIcon;
