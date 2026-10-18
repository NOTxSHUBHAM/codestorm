import { useEffect, useRef } from "react";

export const useMousePositionRef = (containerRef) => {
  const positionRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const updatePosition = (clientX, clientY) => {
      if (containerRef?.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const relativeX = clientX - rect.left - rect.width / 2;
        const relativeY = clientY - rect.top - rect.height / 2;

        positionRef.current = {
          x: relativeX,
          y: relativeY,
        };
        return;
      }

      positionRef.current = { x: clientX, y: clientY };
    };

    const handleMouseMove = (event) => {
      updatePosition(event.clientX, event.clientY);
    };

    const handleTouchMove = (event) => {
      const touch = event.touches[0];
      if (!touch) return;
      updatePosition(touch.clientX, touch.clientY);
    };

    const handleLeave = () => {
      positionRef.current = { x: 0, y: 0 };
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: true });
    window.addEventListener("mouseleave", handleLeave);
    window.addEventListener("touchend", handleLeave, { passive: true });

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("mouseleave", handleLeave);
      window.removeEventListener("touchend", handleLeave);
    };
  }, [containerRef]);

  return positionRef;
};
