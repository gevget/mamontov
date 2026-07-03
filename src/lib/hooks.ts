import { useEffect, useState } from 'react';

export const useCmsValue = <T>(loader: () => Promise<T>, fallback: T) => {
  const [value, setValue] = useState<T>(fallback);

  useEffect(() => {
    let isActive = true;

    loader().then((result) => {
      if (isActive) {
        setValue(result);
      }
    });

    return () => {
      isActive = false;
    };
  }, []);

  return value;
};
