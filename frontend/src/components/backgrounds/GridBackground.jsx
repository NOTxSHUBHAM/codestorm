import { cn } from "@/lib/utils";
import React, { useEffect, useMemo, useRef, useState } from "react";

/* ---------------- Shared utilities ---------------- */

const PARTICLE_COUNT = 22;

function useDrift(seedCount = PARTICLE_COUNT) {
  // Gentle per-particle drift using requestAnimationFrame
  const [tick, setTick] = useState(0);
  const rafRef = useRef(null);

  useEffect(() => {
    let last = performance.now();
    const loop = (now) => {
      if (now - last > 100) {
        setTick((t) => (t + 1) % 1000);
        last = now;
      }
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  return tick;
}

/* Deterministic pseudo-random from seed */
const rnd = (seed) => {
  const x = Math.sin(seed * 12.9898) * 43758.5453;
  return x - Math.floor(x);
};

/* ---------------- Variant 1: Circuit Storm Map ---------------- */
function CircuitStormMap() {
  const tick = useDrift();
  return (
    <>
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          background:
            "radial-gradient(circle at 12% 18%, rgba(255, 115, 55, 0.22), transparent 22%), radial-gradient(circle at 82% 28%, rgba(0, 214, 255, 0.16), transparent 18%), radial-gradient(circle at 55% 88%, rgba(91, 255, 164, 0.13), transparent 22%), #050505",
        }}
      />
      <div
        className="fixed inset-0 pointer-events-none z-0 opacity-60"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.06) 1px, transparent 1px)",
          backgroundSize: "34px 34px",
        }}
      />
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {[
          "left-[6%] top-[16%] w-[42rem] rotate-12 border-primary/70",
          "left-[38%] top-[34%] w-[50rem] -rotate-6 border-cyan-400/45",
          "left-[12%] top-[70%] w-[32rem] rotate-3 border-lime-300/35",
          "left-[68%] top-[10%] h-[34rem] border-primary/50",
        ].map((classes, index) => (
          <div
            key={index}
            className={cn(
              "absolute rounded-full border-t-2 blur-[0.2px]",
              classes
            )}
          />
        ))}
        {Array.from({ length: 18 }).map((_, index) => {
          const phase = (tick * 0.02 + index * 0.37) % 1;
          const pulse = 0.5 + Math.sin(phase * Math.PI * 2) * 0.5;
          return (
            <span
              key={index}
              className="absolute h-2 w-2 rounded-full bg-primary shadow-[0_0_18px_rgba(255,123,64,0.9)]"
              style={{
                left: `${8 + ((index * 17) % 86)}%`,
                top: `${10 + ((index * 23) % 78)}%`,
                opacity: index % 3 === 0 ? 0.6 + pulse * 0.4 : 0.3 + pulse * 0.3,
                transform: `scale(${0.9 + pulse * 0.4})`,
              }}
            />
          );
        })}
      </div>
    </>
  );
}

/* ---------------- Variant 2: Terminal Aurora ---------------- */
function TerminalAurora() {
  const codeSnippets = useMemo(
    () => [
      "const solve = (graph) => queue.shift()",
      "while (left <= right) mid = (left + right) >> 1",
      "dp[i][j] = Math.max(take, skip)",
      "visited.add(node); stack.push(next)",
      "return path.reverse().join(' -> ')",
      "if (accepted) ship(event)",
    ],
    []
  );

  return (
    <>
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          background:
            "linear-gradient(125deg, #050505 0%, #07110f 38%, #100707 68%, #050505 100%)",
        }}
      />
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Animated aurora bands */}
        <div className="absolute -left-32 top-0 h-[140vh] w-72 rotate-12 bg-cyan-400/10 blur-3xl animate-[pulse_8s_ease-in-out_infinite]" />
        <div className="absolute left-[50%] top-[-20%] h-[120vh] w-64 -rotate-12 bg-primary/18 blur-3xl animate-[pulse_10s_ease-in-out_infinite]" />
        <div className="absolute right-[-8rem] bottom-[-8rem] h-[36rem] w-[36rem] bg-lime-300/10 blur-3xl animate-[pulse_12s_ease-in-out_infinite]" />

        {/* Floating code snippets with subtle glow */}
        {codeSnippets.map((snippet, index) => (
          <div
            key={snippet}
            className="absolute whitespace-nowrap font-mono text-xs tracking-normal text-white/15 sm:text-sm drop-shadow-[0_0_12px_rgba(255,123,64,0.15)]"
            style={{
              left: `${index % 2 === 0 ? 8 : 44}%`,
              top: `${12 + index * 13}%`,
              transform: `rotate(${index % 2 === 0 ? -8 : 7}deg)`,
            }}
          >
            <span className="text-primary/55">{"{"}</span>{" "}
            <span className="text-cyan-200/40">{snippet}</span>{" "}
            <span className="text-lime-200/40">{"}"}</span>
          </div>
        ))}
      </div>
    </>
  );
}

/* ---------------- Variant 3: Hackathon Wall ---------------- */
function HackathonWall() {
  const eventImages = useMemo(
    () => [
      "/gallery/gallery-1.jpeg",
      "/monster/monster-1.jpeg",
      "/escape/escape-1.jpg",
      "/hackathon/hackathon-2.jpeg",
      "/prototyping/prototyping-1.jpeg",
      "/gallery/gallery-4.jpeg",
    ],
    []
  );

  return (
    <>
      <div className="fixed inset-0 pointer-events-none z-0 bg-[#050505]" />
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden opacity-45">
        {eventImages.map((image, index) => (
          <img
            key={image}
            src={image}
            alt=""
            className="absolute h-40 w-56 object-cover grayscale-[25%] saturate-125 opacity-55 shadow-[0_24px_70px_rgba(0,0,0,0.7)] sm:h-52 sm:w-72 ring-1 ring-white/5"
            style={{
              left: `${(index * 19) % 82}%`,
              top: `${8 + ((index * 23) % 72)}%`,
              transform: `rotate(${[-8, 5, -3, 7, -6, 4][index]}deg)`,
            }}
          />
        ))}
      </div>
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          background:
            "linear-gradient(90deg, rgba(255,123,64,0.2), transparent 18%, transparent 82%, rgba(0,214,255,0.12)), repeating-linear-gradient(-8deg, transparent 0 24px, rgba(255,255,255,0.035) 25px 26px)",
        }}
      />
    </>
  );
}

/* ---------------- Variant 4: Algorithm Constellation ---------------- */
function AlgorithmConstellation() {
  const tick = useDrift();
  const stars = useMemo(
    () =>
      Array.from({ length: 40 }).map((_, i) => ({
        left: `${rnd(i + 1) * 100}%`,
        top: `${rnd(i + 51) * 100}%`,
        size: 1 + rnd(i + 101) * 2,
        phase: rnd(i + 151) * Math.PI * 2,
      })),
    []
  );

  const edges = [
    ["8%", "20%", "31%", "36%"],
    ["31%", "36%", "52%", "22%"],
    ["52%", "22%", "82%", "42%"],
    ["18%", "74%", "45%", "58%"],
    ["45%", "58%", "76%", "78%"],
    ["31%", "36%", "45%", "58%"],
  ];

  const nodes = [
    ["8%", "20%", "24%", "0"],
    ["31%", "36%", "40%", "1"],
    ["52%", "22%", "26%", "2"],
    ["82%", "42%", "46%", "3"],
    ["18%", "74%", "78%", "4"],
    ["45%", "58%", "62%", "5"],
    ["76%", "78%", "82%", "6"],
  ];

  return (
    <>
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          background:
            "radial-gradient(circle at 50% 45%, rgba(255,255,255,0.05), transparent 34%), radial-gradient(circle at 20% 80%, rgba(42, 209, 255, 0.13), transparent 22%), radial-gradient(circle at 74% 18%, rgba(255, 115, 55, 0.17), transparent 24%), #030303",
        }}
      />

      {/* Twinkling star field */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {stars.map((s, i) => {
          const twinkle = 0.35 + Math.sin(tick * 0.05 + s.phase) * 0.35;
          return (
            <span
              key={i}
              className="absolute rounded-full bg-white"
              style={{
                left: s.left,
                top: s.top,
                width: `${s.size}px`,
                height: `${s.size}px`,
                opacity: twinkle,
              }}
            />
          );
        })}
      </div>

      <svg
        className="fixed inset-0 pointer-events-none z-0 h-full w-full opacity-70"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="routeGlow" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="rgba(255,123,64,0.9)" />
            <stop offset="50%" stopColor="rgba(0,214,255,0.55)" />
            <stop offset="100%" stopColor="rgba(144,255,177,0.6)" />
          </linearGradient>
        </defs>
        {edges.map(([x1, y1, x2, y2], index) => (
          <line
            key={index}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke={index === 2 ? "url(#routeGlow)" : "rgba(255,255,255,0.14)"}
            strokeWidth={index === 2 ? "2.4" : "1.2"}
          />
        ))}
        {nodes.map(([cx, cy, labelY, label], index) => {
          const glow = 0.6 + Math.sin(tick * 0.08 + index) * 0.4;
          return (
            <g key={label}>
              <circle
                cx={cx}
                cy={cy}
                r={index % 2 === 0 ? "7" : "5"}
                fill={
                  index === 3
                    ? `rgba(255,123,64,${0.6 + glow * 0.35})`
                    : `rgba(255,255,255,${0.35 + glow * 0.3})`
                }
              />
              <text
                x={cx}
                y={labelY}
                fill="rgba(255,255,255,0.35)"
                fontSize="12"
                textAnchor="middle"
              >
                {label}
              </text>
            </g>
          );
        })}
      </svg>
    </>
  );
}

/* ---------------- Variant 5: Neon Lab Blueprint ---------------- */
function NeonLabBlueprint() {
  return (
    <>
      <div className="fixed inset-0 pointer-events-none z-0 bg-[#050607]" />
      <div
        className="fixed inset-0 pointer-events-none z-0 opacity-80"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(0,214,255,0.07) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,214,255,0.07) 1px, transparent 1px), linear-gradient(to right, rgba(255,123,64,0.11) 2px, transparent 2px), linear-gradient(to bottom, rgba(255,123,64,0.11) 2px, transparent 2px)",
          backgroundSize: "24px 24px, 24px 24px, 144px 144px, 144px 144px",
        }}
      />
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {[
          { c: "left-[8%] top-[18%] h-36 w-64 border-cyan-300/25", accent: "text-cyan-300/60" },
          { c: "right-[10%] top-[22%] h-48 w-40 border-primary/30", accent: "text-primary/60" },
          { c: "left-[18%] bottom-[12%] h-28 w-80 border-lime-300/25", accent: "text-lime-300/60" },
          { c: "right-[22%] bottom-[18%] h-36 w-56 border-red-300/20", accent: "text-red-300/60" },
        ].map((box, index) => (
          <div
            key={index}
            className={cn(
              "absolute border text-[10px] font-mono uppercase tracking-[0.3em] text-white/25 backdrop-blur-[1px]",
              box.c
            )}
          >
            {/* corner ticks */}
            <span className={cn("absolute -top-px -left-px w-3 h-3 border-t border-l", box.accent)} />
            <span className={cn("absolute -top-px -right-px w-3 h-3 border-t border-r", box.accent)} />
            <span className={cn("absolute -bottom-px -left-px w-3 h-3 border-b border-l", box.accent)} />
            <span className={cn("absolute -bottom-px -right-px w-3 h-3 border-b border-r", box.accent)} />

            <span className="absolute left-3 top-3">prototype-{index + 1}</span>
            <span className={cn("absolute bottom-3 right-3", box.accent)}>
              approved
            </span>
          </div>
        ))}
      </div>
    </>
  );
}

/* ---------------- Router ---------------- */
function BackgroundVariant({ variant }) {
  if (variant === "1") return <CircuitStormMap />;
  if (variant === "2") return <TerminalAurora />;
  if (variant === "3") return <HackathonWall />;
  if (variant === "4") return <AlgorithmConstellation />;
  if (variant === "5") return <NeonLabBlueprint />;
  return null;
}

/* ---------------- Root ---------------- */
export function GridBackground({
  children,
  className,
  maskIntensity = "20%",
  variant,
}) {
  return (
    <div className={cn("relative w-full", className)}>
      {variant ? (
        <BackgroundVariant variant={variant} />
      ) : (
        <div
          className={cn(
            "fixed inset-0 pointer-events-none z-0",
            "[background-size:20px_20px]",
            "[background-image:linear-gradient(to_right,#1f1f1f_1px,transparent_1px),linear-gradient(to_bottom,#1f1f1f_1px,transparent_1px)]",
            "dark:[background-image:linear-gradient(to_right,#1f1f1f_1px,transparent_1px),linear-gradient(to_bottom,#1f1f1f_1px,transparent_1px)]"
          )}
        />
      )}

      {/* Fixed radial gradient mask */}
      <div
        className={cn(
          "pointer-events-none fixed inset-0 z-0",
          variant ? "bg-black/20" : "bg-white dark:bg-black"
        )}
        style={{
          maskImage: `radial-gradient(ellipse 60% 50% at center, transparent 5%, rgba(0,0,0,0.05) 20%, rgba(0,0,0,0.2) 35%, rgba(0,0,0,0.5) 50%, rgba(0,0,0,0.8) 65%, black 80%)`,
          WebkitMaskImage: `radial-gradient(ellipse 60% 50% at center, transparent 5%, rgba(0,0,0,0.05) 20%, rgba(0,0,0,0.2) 35%, rgba(0,0,0,0.5) 50%, rgba(0,0,0,0.8) 65%, black 80%)`,
        }}
      />

      {/* Quarter grid top-left */}
      <div
        className={cn(
          "fixed -top-4 -left-4 pointer-events-none z-0",
          "sm:w-120 sm:h-120 w-80 h-80",
          "[background-size:20px_20px]",
          "[background-image:linear-gradient(to_right,#1f1f1f_1px,transparent_1px),linear-gradient(to_bottom,#1f1f1f_1px,transparent_1px)]",
          "dark:[background-image:linear-gradient(to_right,#1f1f1f_1px,transparent_1px),linear-gradient(to_bottom,#1f1f1f_1px,transparent_1px)]",
          "opacity-60"
        )}
        style={{
          clipPath: "polygon(0 0, 100% 0, 0 100%)",
          maskImage: `radial-gradient(ellipse 80% 80% at 0% 0%, black 20%, rgba(0,0,0,0.8) 35%, rgba(0,0,0,0.5) 50%, rgba(0,0,0,0.2) 65%, transparent 80%)`,
          WebkitMaskImage: `radial-gradient(ellipse 80% 80% at 0% 0%, black 20%, rgba(0,0,0,0.8) 35%, rgba(0,0,0,0.5) 50%, rgba(0,0,0,0.2) 65%, transparent 80%)`,
        }}
      />

      {/* Quarter grid bottom-right */}
      <div
        className={cn(
          "fixed -bottom-4 -right-4 pointer-events-none z-0",
          "w-90 h-90",
          "[background-size:20px_20px]",
          "[background-image:linear-gradient(to_right,#1f1f1f_1px,transparent_1px),linear-gradient(to_bottom,#1f1f1f_1px,transparent_1px)]",
          "dark:[background-image:linear-gradient(to_right,#1f1f1f_1px,transparent_1px),linear-gradient(to_bottom,#1f1f1f_1px,transparent_1px)]",
          "opacity-60"
        )}
        style={{
          clipPath: "polygon(100% 100%, 0 100%, 100% 0)",
          maskImage: `radial-gradient(ellipse 80% 80% at 100% 100%, black 20%, rgba(0,0,0,0.8) 35%, rgba(0,0,0,0.5) 50%, rgba(0,0,0,0.2) 65%, transparent 80%)`,
          WebkitMaskImage: `radial-gradient(ellipse 80% 80% at 100% 100%, black 20%, rgba(0,0,0,0.8) 35%, rgba(0,0,0,0.5) 50%, rgba(0,0,0,0.2) 65%, transparent 80%)`,
        }}
      />

      {/* Content */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}