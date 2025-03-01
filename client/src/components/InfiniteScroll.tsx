"use client";

import React, {
  ComponentProps,
  ReactNode,
  useCallback,
  useEffect,
  useRef,
} from "react";
type IInfinteScrollProps = {
  wrapperProps?: ComponentProps<"div">; //Should be html tag or React element
  loader?: ReactNode; //It should be a React element.
  dipatchScroll: (data: { scrollHeight: number }) => void | Promise<any>;
  children: ReactNode[];
};
export default function InfiniteScroll({
  wrapperProps,
  children,
  loader,
  dipatchScroll,
}: IInfinteScrollProps) {
  let mainWrapperRef = useRef<any>(null);

  const triggerScroll = useCallback((mainWrapperRef: any) => {
    if (
      mainWrapperRef.current &&
      Object.keys(mainWrapperRef.current).length > 0
    ) {
      const element = mainWrapperRef.current;
      element.onscroll = (e: any) => {
        if (
          e.target.scrollTop + e.target.offsetHeight ===
          e.target.scrollHeight
        )
          dipatchScroll({ scrollHeight: e.target.scrollHeight });
      };
    }
  }, []);

  useEffect(() => {
    triggerScroll(mainWrapperRef);
  }, [triggerScroll]);

  return React.cloneElement(
    <div ref={mainWrapperRef} {...wrapperProps} />,
    {},
    [children, loader]
  );
  //   return React.cloneElement(mainWrapper, { ref: mainWrapperRef }, [
  //     ...children,
  //     loader,
  //   ]);
}

// InfiniteScroll.defaultProps = {
//   mainWrapper: null, //Should be html tag or React element
//   loader: null, //It should be a React element.
//   dipatchScroll: (data) => {
//     console.log("dipatchScroll", data);
//   }, //Used to handle scroll callback event in the parent.
// };
