import React, { useRef, useEffect, useCallback, useMemo } from "react";

export const LightningBackground = ({
  className = "",
  speed = 0.4,
  intensity = 0.3,
  size = 1.2,
  hue = 18, // base hue for the bolt (0-360)
  saturation = 1.0, // 0-1
  pulse = 0.15, // subtle temporal pulse on intensity
  grain = 0.04, // 0 = off, ~0.04 = subtle film grain
  blur = 2, // canvas blur in px
}) => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const glContextRef = useRef(null);
  const programRef = useRef(null);
  const uniformsRef = useRef({});
  const startTimeRef = useRef(0);
  const lastFrameTimeRef = useRef(0);
  const isInitializedRef = useRef(false);

  // FPS throttle: 30 on mobile, 60 on desktop
  const isMobile = useMemo(
    () =>
      typeof navigator !== "undefined" &&
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      ),
    []
  );
  const FRAME_INTERVAL = 1000 / (isMobile ? 30 : 60);

  /* ------------------ resize ------------------ */
  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const pixelRatio = Math.min(
      window.devicePixelRatio || 1,
      isMobile ? 0.8 : 2
    );
    const scale = isMobile ? 0.85 : 1;
    const width = Math.floor(rect.width * pixelRatio * scale);
    const height = Math.floor(rect.height * pixelRatio * scale);

    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width;
      canvas.height = height;
      canvas.style.width = rect.width + "px";
      canvas.style.height = rect.height + "px";

      const gl = glContextRef.current;
      if (gl) gl.viewport(0, 0, width, height);
    }
  }, [isMobile]);

  /* ------------------ shader utils ------------------ */
  const compileShader = useCallback((gl, source, type) => {
    const shader = gl.createShader(type);
    if (!shader) return null;

    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.error("Shader compile error:", gl.getShaderInfoLog(shader));
      gl.deleteShader(shader);
      return null;
    }
    return shader;
  }, []);

  /* ------------------ init ------------------ */
  const initWebGL = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return false;

    const gl = canvas.getContext("webgl", {
      antialias: false,
      alpha: false,
      depth: false,
      stencil: false,
      preserveDrawingBuffer: false,
      powerPreference: isMobile ? "default" : "high-performance",
    });

    if (!gl) {
      console.error("WebGL not supported");
      return false;
    }

    glContextRef.current = gl;

    const vertexShaderSource = `
      attribute vec2 aPosition;
      void main() {
        gl_Position = vec4(aPosition, 0.0, 1.0);
      }
    `;

    // Fragment shader with hue / saturation / pulse / grain controls
    const fragmentShaderSource = `
      precision mediump float;
      uniform vec2 iResolution;
      uniform float iTime;
      uniform float uSpeed;
      uniform float uIntensity;
      uniform float uSize;
      uniform float uIsDark;
      uniform float uHue;
      uniform float uSat;
      uniform float uPulse;
      uniform float uGrain;

      #define OCTAVE_COUNT 8

      float hash11(float p) {
          p = fract(p * .1031);
          p *= p + 33.33;
          p *= p + p;
          return fract(p);
      }

      float hash12(vec2 p) {
          vec3 p3 = fract(vec3(p.xyx) * .1031);
          p3 += dot(p3, p3.yzx + 33.33);
          return fract((p3.x + p3.y) * p3.z);
      }

      mat2 rotate2d(float theta) {
          float c = cos(theta);
          float s = sin(theta);
          return mat2(c, -s, s, c);
      }

      float noise(vec2 p) {
          vec2 ip = floor(p);
          vec2 fp = fract(p);
          float a = hash12(ip);
          float b = hash12(ip + vec2(1.0, 0.0));
          float c = hash12(ip + vec2(0.0, 1.0));
          float d = hash12(ip + vec2(1.0, 1.0));
          vec2 t = smoothstep(0.0, 1.0, fp);
          return mix(mix(a, b, t.x), mix(c, d, t.x), t.y);
      }

      float fbm(vec2 p) {
          float value = 0.0;
          float amplitude = 0.5;
          for (int i = 0; i < OCTAVE_COUNT; ++i) {
              value += amplitude * noise(p);
              p *= rotate2d(0.45);
              p *= 2.0;
              amplitude *= 0.5;
          }
          return value;
      }

      // hsv -> rgb
      vec3 hsv2rgb(vec3 c) {
          vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
          vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
          return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
      }

      void mainImage(out vec4 fragColor, in vec2 fragCoord) {
          vec2 uv = fragCoord / iResolution.xy;
          uv = 2.0 * uv - 1.0;
          uv.x *= iResolution.x / iResolution.y;

          float aspectRatio = iResolution.x / iResolution.y;
          float boltOffset = aspectRatio < 1.0 ? 0.8 : 1.3;

          vec2 uvLeft = uv;
          vec2 uvRight = uv;

          uvLeft.x += boltOffset;
          uvRight.x -= boltOffset;

          uvLeft += 2.0 * fbm(uvLeft * uSize + 0.8 * iTime * uSpeed) - 1.0;
          uvRight += 2.0 * fbm(uvRight * uSize + 0.8 * (iTime + 13.37) * (uSpeed * 1.12)) - 1.0;

          // Hue-shifted bolt color
          vec3 boltColor = hsv2rgb(vec3(uHue / 360.0, uSat, 1.0));

          // Temporal pulse on the flash
          float pulse = 1.0 + uPulse * sin(iTime * 2.0);
          float lightning = mix(0.0, 0.05, hash11(iTime * uSpeed)) * uIntensity * pulse;

          vec3 colLeft = boltColor * lightning / abs(uvLeft.x);
          vec3 colRight = boltColor * lightning / abs(uvRight.x);
          vec3 col = colLeft + colRight;

          vec3 bgTint = mix(
              vec3(0.985, 0.985, 0.985),
              vec3(0.145, 0.145, 0.145),
              uIsDark
          );

          float fadeLeft = smoothstep(0.5, 0.1, abs(uvLeft.x));
          float fadeRight = smoothstep(0.5, 0.1, abs(uvRight.x));
          float fade = max(fadeLeft, fadeRight);
          col = mix(bgTint * 0.1, col, fade);

          // Subtle film grain
          if (uGrain > 0.0) {
              float g = hash12(fragCoord + iTime * 60.0) - 0.5;
              col += g * uGrain;
          }

          fragColor = vec4(col, 1.0);
      }

      void main() {
          mainImage(gl_FragColor, gl_FragCoord.xy);
      }
    `;

    const vertexShader = compileShader(gl, vertexShaderSource, gl.VERTEX_SHADER);
    const fragmentShader = compileShader(
      gl,
      fragmentShaderSource,
      gl.FRAGMENT_SHADER
    );
    if (!vertexShader || !fragmentShader) return false;

    const program = gl.createProgram();
    if (!program) return false;

    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error("Program linking error:", gl.getProgramInfoLog(program));
      return false;
    }

    programRef.current = program;

    const vertices = new Float32Array([
      -1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1,
    ]);
    const vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    const aPosition = gl.getAttribLocation(program, "aPosition");
    gl.enableVertexAttribArray(aPosition);
    gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 0, 0);

    uniformsRef.current = {
      iResolution: gl.getUniformLocation(program, "iResolution"),
      iTime: gl.getUniformLocation(program, "iTime"),
      uSpeed: gl.getUniformLocation(program, "uSpeed"),
      uIntensity: gl.getUniformLocation(program, "uIntensity"),
      uSize: gl.getUniformLocation(program, "uSize"),
      uIsDark: gl.getUniformLocation(program, "uIsDark"),
      uHue: gl.getUniformLocation(program, "uHue"),
      uSat: gl.getUniformLocation(program, "uSat"),
      uPulse: gl.getUniformLocation(program, "uPulse"),
      uGrain: gl.getUniformLocation(program, "uGrain"),
    };

    gl.useProgram(program);
    gl.uniform1f(uniformsRef.current.uSpeed, speed);
    gl.uniform1f(uniformsRef.current.uIntensity, intensity);
    gl.uniform1f(uniformsRef.current.uSize, size);
    gl.uniform1f(uniformsRef.current.uHue, hue);
    gl.uniform1f(uniformsRef.current.uSat, saturation);
    gl.uniform1f(uniformsRef.current.uPulse, pulse);
    gl.uniform1f(uniformsRef.current.uGrain, grain);

    gl.deleteShader(vertexShader);
    gl.deleteShader(fragmentShader);

    startTimeRef.current = performance.now();
    return true;
  }, [speed, intensity, size, hue, saturation, pulse, grain, compileShader, isMobile]);

  /* ------------------ render loop ------------------ */
  const render = useCallback(
    (currentTime) => {
      const gl = glContextRef.current;
      const program = programRef.current;
      const uniforms = uniformsRef.current;

      if (!gl || !program || !uniforms.iResolution) return;

      if (currentTime - lastFrameTimeRef.current < FRAME_INTERVAL) {
        animationRef.current = requestAnimationFrame(render);
        return;
      }
      lastFrameTimeRef.current = currentTime;

      gl.useProgram(program);
      gl.uniform2f(uniforms.iResolution, gl.canvas.width, gl.canvas.height);
      gl.uniform1f(
        uniforms.iTime,
        (currentTime - startTimeRef.current) / 1000.0
      );

      const isDark = document.documentElement.classList.contains("dark")
        ? 1.0
        : 0.0;
      gl.uniform1f(uniforms.uIsDark, isDark);

      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.drawArrays(gl.TRIANGLES, 0, 6);

      animationRef.current = requestAnimationFrame(render);
    },
    [FRAME_INTERVAL]
  );

  /* ------------------ cleanup ------------------ */
  const cleanup = useCallback(() => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
    const gl = glContextRef.current;
    if (gl && programRef.current) {
      gl.deleteProgram(programRef.current);
      programRef.current = null;
    }
    glContextRef.current = null;
    uniformsRef.current = {};
    isInitializedRef.current = false;
  }, []);

  /* ------------------ lifecycle ------------------ */
  useEffect(() => {
    if (isInitializedRef.current) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    resizeCanvas();

    if (initWebGL()) {
      isInitializedRef.current = true;
      animationRef.current = requestAnimationFrame(render);
    }

    let resizeTimeout;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(resizeCanvas, isMobile ? 32 : 16);
    };
    window.addEventListener("resize", handleResize, { passive: true });

    // Pause when tab hidden (saves battery)
    const handleVisibility = () => {
      if (document.hidden) {
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
          animationRef.current = null;
        }
      } else if (isInitializedRef.current && !animationRef.current) {
        lastFrameTimeRef.current = 0;
        animationRef.current = requestAnimationFrame(render);
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      window.removeEventListener("resize", handleResize);
      document.removeEventListener("visibilitychange", handleVisibility);
      clearTimeout(resizeTimeout);
      cleanup();
    };
  }, [initWebGL, render, cleanup, resizeCanvas, isMobile]);

  /* ------------------ live prop updates ------------------ */
  useEffect(() => {
    const gl = glContextRef.current;
    const program = programRef.current;
    const u = uniformsRef.current;
    if (!gl || !program || !u.uSpeed) return;

    gl.useProgram(program);
    gl.uniform1f(u.uSpeed, speed);
    gl.uniform1f(u.uIntensity, intensity);
    gl.uniform1f(u.uSize, size);
    gl.uniform1f(u.uHue, hue);
    gl.uniform1f(u.uSat, saturation);
    gl.uniform1f(u.uPulse, pulse);
    gl.uniform1f(u.uGrain, grain);
  }, [speed, intensity, size, hue, saturation, pulse, grain]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`fixed top-0 left-0 w-screen h-screen pointer-events-none z-0 ${className}`}
      style={{
        background: "var(--background)",
        filter: `blur(${blur}px)`,
      }}
    />
  );
};