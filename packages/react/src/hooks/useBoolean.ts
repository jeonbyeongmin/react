import { useCallback, useState } from 'react';

export function useBoolean() {
  const [value, setValue] = useState(false);

  const toggle = useCallback(() => {
    setValue(!value);
  }, []);

  const setTrue = useCallback(() => {
    setValue(true);
  }, []);

  const setFalse = useCallback(() => {
    setValue(false);
  }, []);

  return [value, setTrue, setFalse, toggle] as const;
}
