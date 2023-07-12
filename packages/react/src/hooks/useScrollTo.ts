import { useCallback, useRef } from 'react';

export function useScrollTo<T extends HTMLElement>() {
  const scrollRef = useRef<T>(null);

  const scrollIntoView = useCallback(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'end',
      });
    }
  }, []);

  return { scrollRef, scrollIntoView };
}
