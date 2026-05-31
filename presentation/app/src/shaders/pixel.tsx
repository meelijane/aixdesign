/**
 * Pixel — CRT-style pixel-art image renderer.
 *
 * Pipeline:
 *   1. Load source image
 *   2. Draw it pixelated + green-monochrome onto an offscreen 2D canvas
 *   3. Pipe that canvas through a WebGL2 CRT post-process shader
 *      (adapted from gingerbeardman/webgl-crt-shader, MIT license)
 *   4. Result: chunky phosphor-green pixels with scanlines, bloom, vignette, curvature
 */

import { useEffect, useRef, useState, type CSSProperties } from "react";

/* ─── types ─────────────────────────────────────────────────────────── */

export interface PixelProps {
  src: string;
  alt?: string;
  pixelSize?: number;
  levels?: number;
  threshold?: number;
  brightness?: number;
  contrast?: number;
  fit?: "contain" | "cover";
  invert?: boolean;
  tint?: string;
  curvature?: number;
  scanlineIntensity?: number;
  scanlineCount?: number;
  bloomIntensity?: number;
  vignetteStrength?: number;
  style?: CSSProperties;
  className?: string;
}

/* ─── helpers ───────────────────────────────────────────────────────── */

function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace("#", "");
  return [
    parseInt(h.slice(0, 2), 16) / 255,
    parseInt(h.slice(2, 4), 16) / 255,
    parseInt(h.slice(4, 6), 16) / 255,
  ];
}

/* ─── CRT shaders (adapted from gingerbeardman/webgl-crt-shader, MIT) ── */

const CRT_VERT = `#version 300 es
precision highp float;
const vec4 pos[4] = vec4[4](
  vec4(-1, -1, 0, 1), vec4( 1, -1, 0, 1),
  vec4(-1,  1, 0, 1), vec4( 1,  1, 0, 1)
);
const vec2 uvData[4] = vec2[4](
  vec2(0.0, 0.0), vec2(1.0, 0.0),
  vec2(0.0, 1.0), vec2(1.0, 1.0)
);
out vec2 vUv;
void main() { vUv = uvData[gl_VertexID]; gl_Position = pos[gl_VertexID]; }
`;

const CRT_FRAG = `#version 300 es
precision highp float;
uniform sampler2D uTexture;
uniform float scanlineIntensity, scanlineCount, time;
uniform float brightness, contrast;
uniform float bloomIntensity, bloomThreshold;
uniform float vignetteStrength, curvature, flickerStrength;
in vec2 vUv;
out vec4 fragColor;
const float PI = 3.14159265;
const vec3 LUMA = vec3(0.299, 0.587, 0.114);

vec2 curveUV(vec2 uv, float c) {
  vec2 co = uv * 2.0 - 1.0;
  co *= 1.0 + dot(co, co) * c * 0.25;
  return co * 0.5 + 0.5;
}

vec4 sampleBloom(vec2 uv, float r, vec4 center) {
  vec2 o = vec2(r);
  return center * 0.4 + (
    texture(uTexture, uv + vec2(o.x, 0.0)) +
    texture(uTexture, uv - vec2(o.x, 0.0)) +
    texture(uTexture, uv + vec2(0.0, o.y)) +
    texture(uTexture, uv - vec2(0.0, o.y))
  ) * 0.15;
}

void main() {
  vec2 uv = vUv;
  if (curvature > 0.001) {
    uv = curveUV(uv, curvature);
    if (uv.x < 0.0 || uv.x > 1.0 || uv.y < 0.0 || uv.y > 1.0) {
      fragColor = vec4(0.0, 0.0, 0.0, 1.0); return;
    }
  }
  vec4 pixel = texture(uTexture, uv);
  if (bloomIntensity > 0.001) {
    float pl = dot(pixel.rgb, LUMA);
    if (pl > bloomThreshold * 0.5) {
      vec4 bs = sampleBloom(uv, 0.005, pixel);
      bs.rgb *= brightness;
      float bl = dot(bs.rgb, LUMA);
      pixel.rgb += bs.rgb * bloomIntensity * max(0.0, (bl - bloomThreshold) * 1.5);
    }
  }
  pixel.rgb *= brightness;
  pixel.rgb = (pixel.rgb - 0.5) * contrast + 0.5;
  float mask = 1.0;
  if (scanlineIntensity > 0.001) {
    mask *= 1.0 - abs(sin(uv.y * scanlineCount * PI)) * scanlineIntensity;
  }
  if (flickerStrength > 0.001) { mask *= 1.0 + sin(time * 110.0) * flickerStrength; }
  if (vignetteStrength > 0.001) {
    vec2 v = uv * 2.0 - 1.0;
    float d = max(abs(v.x), abs(v.y));
    mask *= 1.0 - d * d * vignetteStrength;
  }
  pixel.rgb *= mask;
  fragColor = pixel;
}
`;

/* ─── component ──────────────────────────────────────────────────── */

export default function Pixel({
  src, alt = "",
  pixelSize = 4, levels = 6, threshold = 0.08,
  brightness = 1.0, contrast = 1.2,
  fit = "contain", invert = false,
  tint = "#39ff14",
  curvature = 0.08,
  scanlineIntensity = 0.35, scanlineCount = 256,
  bloomIntensity = 0.3, vignetteStrength = 0.25,
  style, className,
}: PixelProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [imgLoaded, setImgLoaded] = useState(false);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const cleanupRef = useRef<(() => void) | null>(null);

  // Load image
  useEffect(() => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => { imgRef.current = img; setImgLoaded(true); };
    img.onerror = () => console.error("Pixel: FAILED to load", src);
    img.src = src;
    return () => { img.onload = null; img.onerror = null; };
  }, [src]);

  // Init when image loaded — use ResizeObserver to wait for real dimensions
  useEffect(() => {
    if (!imgLoaded || !canvasRef.current || !imgRef.current || !wrapRef.current) return;

    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    const img = imgRef.current;
    const dpr = window.devicePixelRatio || 1;
    const [tR, tG, tB] = hexToRgb(tint);

    let gl: WebGL2RenderingContext | null = null;
    let pgm: WebGLProgram | null = null;
    let tex: WebGLTexture | null = null;
    let vao: WebGLVertexArrayObject | null = null;
    let vs: WebGLShader | null = null;
    let fs: WebGLShader | null = null;
    let raf = 0;
    let started = false;
    const start = performance.now();

    // Pixelate source image onto a 2D offscreen canvas
    function pixelate(cw: number, ch: number): HTMLCanvasElement {
      const off = document.createElement("canvas");
      off.width = cw; off.height = ch;
      const ctx = off.getContext("2d")!;

      const imgAspect = img.naturalWidth / img.naturalHeight;
      const canAspect = cw / ch;
      let dw: number, dh: number;
      if (fit === "contain") {
        if (imgAspect > canAspect) { dw = cw; dh = cw / imgAspect; }
        else { dh = ch; dw = ch * imgAspect; }
      } else {
        if (imgAspect > canAspect) { dh = ch; dw = ch * imgAspect; }
        else { dw = cw; dh = cw / imgAspect; }
      }
      const dx = (cw - dw) / 2;
      const dy = (ch - dh) / 2;

      const cell = Math.max(1, Math.round(pixelSize));
      const sw = Math.max(1, Math.ceil(dw / cell));
      const sh = Math.max(1, Math.ceil(dh / cell));

      const tmp = document.createElement("canvas");
      tmp.width = sw; tmp.height = sh;
      const tc = tmp.getContext("2d")!;
      tc.imageSmoothingEnabled = true;
      tc.drawImage(img, 0, 0, sw, sh);

      const id = tc.getImageData(0, 0, sw, sh);
      const d = id.data;
      for (let i = 0; i < d.length; i += 4) {
        let l = (d[i] * 0.299 + d[i+1] * 0.587 + d[i+2] * 0.114) / 255;
        if (invert) l = 1 - l;
        if (l < threshold) { d[i] = d[i+1] = d[i+2] = 0; d[i+3] = 255; continue; }
        const q = Math.round(l * (levels - 1)) / (levels - 1);
        d[i]   = Math.round(q * tR * 255);
        d[i+1] = Math.round(q * tG * 255);
        d[i+2] = Math.round(q * tB * 255);
        d[i+3] = 255;
      }
      tc.putImageData(id, 0, 0);

      ctx.fillStyle = "#000";
      ctx.fillRect(0, 0, cw, ch);
      ctx.imageSmoothingEnabled = false;
      ctx.drawImage(tmp, 0, 0, sw, sh, dx, dy, Math.ceil(dw), Math.ceil(dh));
      return off;
    }

    function compileShader(g: WebGL2RenderingContext, type: number, source: string) {
      const s = g.createShader(type)!;
      g.shaderSource(s, source);
      g.compileShader(s);
      if (!g.getShaderParameter(s, g.COMPILE_STATUS)) {
        console.error("Pixel shader:", g.getShaderInfoLog(s));
        return null;
      }
      return s;
    }

    function initGL(w: number, h: number) {
      canvas.width = w;
      canvas.height = h;

      const offscreen = pixelate(w, h);

      gl = canvas.getContext("webgl2", { alpha: false });
      if (!gl) { console.error("Pixel: no WebGL2"); return; }

      vs = compileShader(gl, gl.VERTEX_SHADER, CRT_VERT);
      fs = compileShader(gl, gl.FRAGMENT_SHADER, CRT_FRAG);
      if (!vs || !fs) return;

      pgm = gl.createProgram()!;
      gl.attachShader(pgm, vs);
      gl.attachShader(pgm, fs);
      gl.linkProgram(pgm);
      if (!gl.getProgramParameter(pgm, gl.LINK_STATUS)) {
        console.error("Pixel link:", gl.getProgramInfoLog(pgm));
        return;
      }

      vao = gl.createVertexArray()!;
      tex = gl.createTexture()!;
      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, offscreen);

      const u = (name: string) => gl!.getUniformLocation(pgm!, name);

      function render() {
        try {
          if (!gl || !pgm || !tex) return;
          const t = (performance.now() - start) / 1000;
          gl.viewport(0, 0, canvas.width, canvas.height);
          gl.clearColor(0, 0, 0, 1);
          gl.clear(gl.COLOR_BUFFER_BIT);
          gl.useProgram(pgm);
          gl.bindVertexArray(vao);
          gl.activeTexture(gl.TEXTURE0);
          gl.bindTexture(gl.TEXTURE_2D, tex);
          gl.uniform1i(u("uTexture"), 0);
          gl.uniform1f(u("scanlineIntensity"), scanlineIntensity);
          gl.uniform1f(u("scanlineCount"), scanlineCount);
          gl.uniform1f(u("time"), t);
          gl.uniform1f(u("brightness"), brightness);
          gl.uniform1f(u("contrast"), contrast);
          gl.uniform1f(u("bloomIntensity"), bloomIntensity);
          gl.uniform1f(u("bloomThreshold"), 0.5);
          gl.uniform1f(u("vignetteStrength"), vignetteStrength);
          gl.uniform1f(u("curvature"), curvature);
          gl.uniform1f(u("flickerStrength"), 0.008);
          gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
        } catch(e) {
          // silent
        }
        raf = requestAnimationFrame(render);
      }
      render();
      started = true;
    }

    // Use ResizeObserver to detect when the container has real dimensions
    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const cr = entry.contentRect;
        const w = Math.round(cr.width * dpr);
        const h = Math.round(cr.height * dpr);
        if (w < 10 || h < 10) continue;
        if (!started) {
          initGL(w, h);
        } else if (gl && tex && (w !== canvas.width || h !== canvas.height)) {
          // Resize
          canvas.width = w;
          canvas.height = h;
          const off = pixelate(w, h);
          gl.bindTexture(gl.TEXTURE_2D, tex);
          gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, off);
        }
      }
    });
    ro.observe(wrap);

    // Also try immediately in case container already has size
    const rect = wrap.getBoundingClientRect();
    if (rect.width > 10 && rect.height > 10) {
      initGL(Math.round(rect.width * dpr), Math.round(rect.height * dpr));
    }

    cleanupRef.current = () => {
      ro.disconnect();
      cancelAnimationFrame(raf);
      if (gl) {
        if (tex) gl.deleteTexture(tex);
        if (pgm) gl.deleteProgram(pgm);
        if (vs) gl.deleteShader(vs);
        if (fs) gl.deleteShader(fs);
        if (vao) gl.deleteVertexArray(vao);
      }
    };

    return () => { cleanupRef.current?.(); };
  }, [imgLoaded, pixelSize, levels, threshold, brightness, contrast, fit, invert, tint,
      curvature, scanlineIntensity, scanlineCount, bloomIntensity, vignetteStrength]);

  return (
    <div ref={wrapRef} className={className}
      style={{ position: "relative", width: "100%", height: "100%", background: "#000", ...style }}>
      <canvas ref={canvasRef} aria-label={alt}
        style={{ display: "block", width: "100%", height: "100%" }} />
    </div>
  );
}
