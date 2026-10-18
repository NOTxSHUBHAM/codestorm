import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
} from "react";
import { useAnimationFrame, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useMousePositionRef } from "@/hooks/useMousePositionRef";

const FloatingContext = createContext(null);

/* Global tunables */
const DEFAULTS = {
  sensitivity: 1,
  easingFactor: 0.08,
  strengthDivisor: 28,
  rotateAmount: 0, // degrees per unit of pointer delta
  scaleAmount: 0, // scale delta per unit of pointer delta
  idleAmplitude: 0, // px of idle float
  idleSpeed: 0.6, // rad/s
  disabled: false,
};

const Floating = ({
  children,
  className,
  sensitivity = DEFAULTS.sensitivity,
  easingFactor = DEFAULTS.easingFactor,
  strengthDivisor = DEFAULTS.strengthDivisor,
  rotateAmount = DEFAULTS.rotateAmount,
  scaleAmount = DEFAULTS.scaleAmount,
  idleAmplitude = DEFAULTS.idleAmplitude,
  idleSpeed = DEFAULTS.idleSpeed,
  disabled = DEFAULTS.disabled,
  ...props
}) => {
  const containerRef = useRef(null);
  const elementsMap = useRef(new Map());
  const mousePositionRef = useMousePositionRef(containerRef);
  const prefersReducedMotion = useReducedMotion();

  const isDisabled = disabled || prefersReducedMotion;

  const registerElement = useCallback((id, element, depth) => {
    elementsMap.current.set(id, {
      element,
      depth,
      currentPosition: { x: 0, y: 0 },
      currentRotate: 0,
      currentScale: 1,
      seed: Math.random() * Math.PI * 2, // per-element idle phase
    });
  }, []);

  const unregisterElement = useCallback((id) => {
    elementsMap.current.delete(id);
  }, []);

  useAnimationFrame((t) => {
    if (!containerRef.current || isDisabled) return;

    const time = t / 1000; // seconds

    elementsMap.current.forEach((data) => {
      const strength = (data.depth * sensitivity) / strengthDivisor;

      // pointer-driven target
      const targetX = mousePositionRef.current.x * strength;
      const targetY = mousePositionRef.current.y * strength;

      // idle drift (per-element phase + depth-scaled)
      const idleX = idleAmplitude
        ? Math.sin(time * idleSpeed + data.seed) * idleAmplitude * data.depth
        : 0;
      const idleY = idleAmplitude
        ? Math.cos(time * idleSpeed * 0.8 + data.seed) *
          idleAmplitude *
          data.depth *
          0.6
        : 0;

      const nextX = targetX + idleX;
      const nextY = targetY + idleY;

      data.currentPosition.x += (nextX - data.currentPosition.x) * easingFactor;
      data.currentPosition.y += (nextY - data.currentPosition.y) * easingFactor;

      // optional rotate / scale based on pointer delta
      const targetRotate = rotateAmount
        ? (mousePositionRef.current.x / 100) * rotateAmount * data.depth
        : 0;
      const targetScale = scaleAmount
        ? 1 + (mousePositionRef.current.y / 1000) * scaleAmount * data.depth
        : 1;

      data.currentRotate += (targetRotate - data.currentRotate) * easingFactor;
      data.currentScale += (targetScale - data.currentScale) * easingFactor;

      data.element.style.transform = `translate3d(${data.currentPosition.x}px, ${data.currentPosition.y}px, 0) rotate(${data.currentRotate}deg) scale(${data.currentScale})`;
    });
  });

  const ctx = useMemo(
    () => ({ registerElement, unregisterElement }),
    [registerElement, unregisterElement]
  );

  return (
    <FloatingContext.Provider value={ctx}>
      <div
        ref={containerRef}
        className={cn("absolute inset-0 h-full w-full", className)}
        {...props}
      >
        {children}
      </div>
    </FloatingContext.Provider>
  );
};

export const FloatingElement = ({ children, className, depth = 1 }) => {
  const elementRef = useRef(null);
  const idRef = useRef(null);
  if (idRef.current === null) {
    idRef.current = Math.random().toString(36).slice(2);
  }
  const context = useContext(FloatingContext);

  useEffect(() => {
    if (!elementRef.current || !context) return;

    const id = idRef.current;
    context.registerElement(id, elementRef.current, depth ?? 0.01);

    return () => {
      context.unregisterElement(id);
    };
  }, [context, depth]);

  return (
    <div
      ref={elementRef}
      className={cn("absolute will-change-transform", className)}
    >
      {children}
    </div>
  );
};

export default Floating;