
import { useState, useEffect } from 'react';

export function useIsTouch() {
  const [isTouch, setIsTouch] = useState<boolean>(false);
  
  useEffect(() => {
    const checkTouch = () => {
      setIsTouch(window.matchMedia('(hover: none) and (pointer: coarse)').matches);
    };
    
    checkTouch();
    window.addEventListener('resize', checkTouch);
    
    return () => {
      window.removeEventListener('resize', checkTouch);
    };
  }, []);
  
  return isTouch;
}
