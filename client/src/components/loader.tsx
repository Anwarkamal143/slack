import "@/styles/loader.scss";
type Props = {};

const PageLoader = (props: Props) => {
  return (
    // <div
    //   className="w-full h-full fixed top-0 lef-0 flex justify-center items-center z-[999] after:content-['']
    // after:w-full after:absolute after:h-full after:bg-black after:top-0 after:lef-0 after:z-[99]"
    // >
    //   <div className="w-12 h-12 rounded-full animate-spin border-y-2 border-solid border-white border-t-transparent shadow-md z-[999]"></div>
    // </div>
    <div className="w-full h-full flex justify-center items-center bg-slack-bg">
      <div className="loader"></div>
      <span className="sr-only">Loading...</span>
    </div>
  );
};

export default PageLoader;
export const SlackLoader = () => {
  return (
    <>
      <div className="loader "></div>
      <span className="sr-only">Loading...</span>
    </>
  );
};
