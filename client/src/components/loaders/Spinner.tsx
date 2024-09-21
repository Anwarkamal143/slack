type ISpinnerType = {
  bgColor?: "grey";
  color?: "pink" | "cyan" | "violet" | "green";
};
const Spinner = (props: ISpinnerType) => {
  const { color, bgColor } = props;

  return (
    <>
      <div className="relative">
        {/* <div className="w-12 h-12 rounded-full absolute border border-solid border-gray-200"></div> */}
        <div className="w-12 h-12 rounded-full animate-spin border-y-2 border-solid border-violet-500 border-t-transparent shadow-md"></div>

        {/* <div className="w-12 h-12 rounded-full animate-spin border absolute  border-solid border-[#C8C7FF] border-t-transparent shadow-md"></div> */}
      </div>
    </>
  );
};

export default Spinner;
