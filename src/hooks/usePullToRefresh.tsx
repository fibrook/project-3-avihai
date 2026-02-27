import { useRef, useCallback, useState } from "react";

export function usePullToRefresh(onRefresh: () => Promise<void> | void) {
  const [pulling, setPulling] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const startY = useRef(0);
  const isPulling = useRef(false);
  const threshold = 80;

  const onTouchStart = useCallback((e: React.TouchEvent) => {
    if (window.scrollY === 0) {
      startY.current = e.touches[0].clientY;
      isPulling.current = true;
    }
  }, []);

  const onTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isPulling.current) return;
    const dy = e.touches[0].clientY - startY.current;
    if (dy > 0) {
      setPullDistance(Math.min(dy * 0.4, 120));
      setPulling(true);
    }
  }, []);

  const onTouchEnd = useCallback(async () => {
    if (!isPulling.current) return;
    isPulling.current = false;
    if (pullDistance >= threshold * 0.4) {
      await onRefresh();
    }
    setPullDistance(0);
    setPulling(false);
  }, [pullDistance, onRefresh]);

  return { pulling, pullDistance, onTouchStart, onTouchMove, onTouchEnd, threshold: threshold * 0.4 };
}
