"use client";

import { useEffect, useState } from "react";

const useServer = () => {
  const [isServer, setIsServer] = useState(typeof window === undefined);

  useEffect(() => {
    if (isServer) {
      setIsServer(false);
    }
    return () => {};
  }, []);
};

export default useServer;
