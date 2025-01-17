import { useEffect, useState } from "react";

type ApiFunction<T> = () => Promise<T>;
type Props = {
  delay: number;
  onCallback: (data: any) => void;
};
function useApiPolling<T>(apiFunction: ApiFunction<T>, args: Props): T | null {
  const [data, setData] = useState<T | null>(null);
  const { delay, onCallback } = args;
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await apiFunction();
        setData(response);
        onCallback(response);
      } catch (error) {
        onCallback(null);
        console.error(error);
      }
    };

    const intervalId = setInterval(fetchData, delay);

    // Clear the interval on unmount
    return () => clearInterval(intervalId);
  }, [delay]);

  return data;
}

export default useApiPolling;
