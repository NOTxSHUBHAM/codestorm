import React, { useEffect, useRef, useState, useMemo, useCallback } from "react";

import "./GradualBlur.css";

/* ------------------------------------------------------------------ */
/* Defaults & presets                                                 */
/* ------------------------------------------------------------------ */

const DEFAULT_CONFIG = {
  position: "bottom",
  strength: 2,
  height: "6rem",
  width: undefined,
  divCount: 5,
  exponential: false,
  zIndex: 1000,
  animated: false,
  duration: "0.3s",
  easing: "ease-out",
  opacity: 1,
  curve: "linear",
  responsive: false,
  target: "parent",
  hoverIntensity: undefined,
  onAnimationComplete: undefined,
  disabled: false,
  className: "",
  style: {},
};

const PRESETS = {
  top: { position: "top", height: "6rem" },
  bottom: { position: "bottom", height: "6rem" },
  left: { position: "left", height: "6rem" },
  right: { position: "right", height: "6rem" },
  subtle: { height: "4rem", strength: 1, opacity: 0.8, divCount: 3 },
  intense: { height: "10rem", strength: 4, divCount: 8, exponential: true },
  smooth: { height: "8rem", curve: "bezier", divCount: 10 },
  sharp: { height: "5rem", curve: "linear", divCount: 4 },
  header: { position: "top", height: "8rem", curve: "ease-out" },
  footer: { position: "bottom", height: "8rem", curve: "ease-out" },
  sidebar: { position: "left", height: "6rem", strength: 2.5 },
  "page-header": { position: "top", height: "10rem", target: "page", strength: 3 },
  "page-footer": { position: "bottom", height: "10rem", target: "page", strength: 3 },
};

const CURVE_FUNCTIONS = {
  linear: (p) => p,
  bezier: (p) => p * p * (3 - 2 * p),
  "ease-in": (p) => p * p,
  "ease-out": (p) => 1 - Math.pow(1 - p, 2),
  "ease-in-out": (p) => (p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2),
};

/* ------------------------------------------------------------------ */
/* Helpers                                                            */
/* ------------------------------------------------------------------ */

const mergeConfigs = (...configs) =>
  configs.reduce((acc, c) => ({ ...acc, ...(c || {}) }), {});

const getGradientDirection = (position) =>
  ({
    top: "to top",
    bottom: "to bottom",
    left: "to left",
    right: "to right",
  }[position] || "to bottom");

const debounce = (fn, wait) => {
  let t;
  return (...a) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...a), wait);
  };
};

/* Map `key` -> `mobileKey` / `tabletKey` / `desktopKey` */
const RESPONSIVE_SUFFIXES = [
  { max: 480, prefix: "mobile" },
  { max: 768, prefix: "tablet" },
  { max: 1024, prefix: "desktop" },
];

/* ------------------------------------------------------------------ */
/* Hooks                                                              */
/* ------------------------------------------------------------------ */

const useResponsiveDimension = (responsive, config, key) => {
  const [value, setValue] = useState(config[key]);

  useEffect(() => {
    if (!responsive || typeof window === "undefined") {
      setValue(config[key]);
      return;
    }

    const calc = () => {
      const w = window.innerWidth;
      let v = config[key];

      for (const { max, prefix } of RESPONSIVE_SUFFIXES) {
        const overrideKey = `${prefix}${key[0].toUpperCase()}${key.slice(1)}`;
        if (w <= max && config[overrideKey] != null) {
          v = config[overrideKey];
          break;
        }
      }
      setValue(v);
    };

    const debounced = debounce(calc, 100);
    calc();
    window.addEventListener("resize", debounced);
    return () => window.removeEventListener("resize", debounced);
  }, [responsive, config, key]);

  return responsive ? value : config[key];
};

const useIntersectionObserver = (ref, shouldObserve = false) => {
  const [isVisible, setIsVisible] = useState(!shouldObserve);

  useEffect(() => {
    if (!shouldObserve || !ref.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.1 }
    );

    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [ref, shouldObserve]);

  return isVisible;
};

const usePrefersReducedMotion = () => {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handler = (e) => setReduced(e.matches);
    handler(mq);
    mq.addEventListener?.("change", handler);
    return () => mq.removeEventListener?.("change", handler);
  }, []);

  return reduced;
};

/* ------------------------------------------------------------------ */
/* Component                                                          */
/* ------------------------------------------------------------------ */

export function GradualBlur(props) {
  const containerRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const prefersReducedMotion = usePrefersReducedMotion();

  const config = useMemo(() => {
    const presetConfig =
      props.preset && PRESETS[props.preset] ? PRESETS[props.preset] : {};
    return mergeConfigs(DEFAULT_CONFIG, presetConfig, props);
  }, [props]);

  const responsiveHeight = useResponsiveDimension(
    config.responsive,
    config,
    "height"
  );
  const responsiveWidth = useResponsiveDimension(
    config.responsive,
    config,
    "width"
  );

  const isVisible = useIntersectionObserver(
    containerRef,
    config.animated === "scroll"
  );

  const hoverHandlers = useMemo(() => {
    if (!config.hoverIntensity) return {};
    return {
      onMouseEnter: () => setIsHovered(true),
      onMouseLeave: () => setIsHovered(false),
      onFocus: () => setIsHovered(true),
      onBlur: () => setIsHovered(false),
    };
  }, [config.hoverIntensity]);

  const blurDivs = useMemo(() => {
    if (config.disabled) return null;

    const divs = [];
    const increment = 100 / config.divCount;
    const currentStrength =
      isHovered && config.hoverIntensity
        ? config.strength * config.hoverIntensity
        : config.strength;

    const curveFunc = CURVE_FUNCTIONS[config.curve] || CURVE_FUNCTIONS.linear;
    const direction = getGradientDirection(config.position);
    const shouldTransition =
      config.animated && config.animated !== "scroll" && !prefersReducedMotion;

    for (let i = 1; i <= config.divCount; i++) {
      let progress = i / config.divCount;
      progress = curveFunc(progress);

      let blurValue;
      if (config.exponential) {
        blurValue = Math.pow(2, progress * 4) * 0.0625 * currentStrength;
      } else {
        blurValue =
          0.0625 * (progress * config.divCount + 1) * currentStrength;
      }

      const p1 = Math.round((increment * i - increment) * 10) / 10;
      const p2 = Math.round(increment * i * 10) / 10;
      const p3 = Math.round((increment * i + increment) * 10) / 10;
      const p4 = Math.round((increment * i + increment * 2) * 10) / 10;

      let gradient = `transparent ${p1}%, black ${p2}%`;
      if (p3 <= 100) gradient += `, black ${p3}%`;
      if (p4 <= 100) gradient += `, transparent ${p4}%`;

      const divStyle = {
        position: "absolute",
        inset: 0,
        maskImage: `linear-gradient(${direction}, ${gradient})`,
        WebkitMaskImage: `linear-gradient(${direction}, ${gradient})`,
        backdropFilter: `blur(${blurValue.toFixed(3)}rem)`,
        WebkitBackdropFilter: `blur(${blurValue.toFixed(3)}rem)`,
        opacity: config.opacity,
        transition: shouldTransition
          ? `backdrop-filter ${config.duration} ${config.easing}`
          : undefined,
        willChange: shouldTransition ? "backdrop-filter" : undefined,
      };

      divs.push(<div key={i} style={divStyle} />);
    }

    return divs;
  }, [config, isHovered, prefersReducedMotion]);

  const containerStyle = useMemo(() => {
    const isVertical = ["top", "bottom"].includes(config.position);
    const isHorizontal = ["left", "right"].includes(config.position);
    const isPageTarget = config.target === "page";

    const baseStyle = {
      position: isPageTarget ? "fixed" : "absolute",
      pointerEvents: config.hoverIntensity ? "auto" : "none",
      opacity: isVisible ? 1 : 0,
      transition:
        config.animated && !prefersReducedMotion
          ? `opacity ${config.duration} ${config.easing}`
          : undefined,
      zIndex: isPageTarget ? config.zIndex + 100 : config.zIndex,
      ...config.style,
    };

    if (isVertical) {
      baseStyle.height = responsiveHeight;
      baseStyle.width = responsiveWidth || "100%";
      baseStyle[config.position] = 0;
      baseStyle.left = 0;
      baseStyle.right = 0;
    } else if (isHorizontal) {
      baseStyle.width = responsiveWidth || responsiveHeight;
      baseStyle.height = "100%";
      baseStyle[config.position] = 0;
      baseStyle.top = 0;
      baseStyle.bottom = 0;
    }

    return baseStyle;
  }, [config, responsiveHeight, responsiveWidth, isVisible, prefersReducedMotion]);

  const { animated, onAnimationComplete, duration } = config;

  useEffect(() => {
    if (isVisible && animated === "scroll" && onAnimationComplete) {
      const ms = parseFloat(duration) * 1000;
      const t = setTimeout(() => onAnimationComplete(), ms);
      return () => clearTimeout(t);
    }
  }, [isVisible, animated, onAnimationComplete, duration]);

  if (config.disabled) return null;

  return (
    <div
      ref={containerRef}
      className={`gradual-blur ${
        config.target === "page" ? "gradual-blur-page" : "gradual-blur-parent"
      } ${config.className}`}
      style={containerStyle}
      {...hoverHandlers}
    >
      <div className="gradual-blur-inner">
        {blurDivs}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Memoization & static exports                                       */
/* ------------------------------------------------------------------ */

const GradualBlurMemo = React.memo(GradualBlur);
GradualBlurMemo.displayName = "GradualBlur";
GradualBlurMemo.PRESETS = PRESETS;
GradualBlurMemo.CURVE_FUNCTIONS = CURVE_FUNCTIONS;
GradualBlurMemo.DEFAULT_CONFIG = DEFAULT_CONFIG;

export default GradualBlurMemo;

/* ------------------------------------------------------------------ */
/* One-time style injection                                           */
/* ------------------------------------------------------------------ */

const injectStyles = () => {
  if (typeof document === "undefined") return;

  const styleId = "gradual-blur-styles";
  if (document.getElementById(styleId)) return;

  const styleElement = document.createElement("style");
  styleElement.id = styleId;
  styleElement.textContent = `
    .gradual-blur { pointer-events: none; transition: opacity 0.3s ease-out; isolation: isolate; }
    .gradual-blur-parent { overflow: hidden; }
    .gradual-blur-inner { pointer-events: none; position: relative; width: 100%; height: 100%; }
    .gradual-blur-inner > div { -webkit-backdrop-filter: inherit; backdrop-filter: inherit; }
    @media (prefers-reduced-motion: reduce) {
      .gradual-blur, .gradual-blur-inner > div { transition: none !important; }
    }
  `;

  document.head.appendChild(styleElement);
};

if (typeof document !== "undefined") {
  injectStyles();
}