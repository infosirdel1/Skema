/**
 * Signature navigateur — canvas HTML5 (pas de WebView).
 */
import React, { useCallback, useEffect, useRef } from "react";
import type { SignaturePadProps } from "./signaturePadTypes";

const PEN = "#000000";
const BG = "#ffffff";
const LINE = 2.5;

export default function SignaturePadWeb({
  value,
  onChange,
  onClear: onClearProp,
  height = 180,
}: SignaturePadProps) {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const drawing = useRef(false);
  const last = useRef<{ x: number; y: number } | null>(null);

  const setupContext = useCallback(
    (canvas: HTMLCanvasElement, logicalW: number, logicalH: number) => {
      const dpr = typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1;
      canvas.width = Math.max(1, Math.floor(logicalW * dpr));
      canvas.height = Math.max(1, Math.floor(logicalH * dpr));
      canvas.style.width = `${logicalW}px`;
      canvas.style.height = `${logicalH}px`;
      const ctx = canvas.getContext("2d");
      if (!ctx) return null;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
      ctx.fillStyle = BG;
      ctx.fillRect(0, 0, logicalW, logicalH);
      ctx.strokeStyle = PEN;
      ctx.lineWidth = LINE;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      return ctx;
    },
    []
  );

  const paintFromDataUrl = useCallback(
    (dataUrl: string, logicalW: number, logicalH: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = setupContext(canvas, logicalW, logicalH);
      if (!ctx) return;
      const img = new Image();
      img.onload = () => {
        ctx.fillStyle = BG;
        ctx.fillRect(0, 0, logicalW, logicalH);
        ctx.drawImage(img, 0, 0, logicalW, logicalH);
      };
      img.onerror = () => {
        setupContext(canvas, logicalW, logicalH);
      };
      img.src = dataUrl;
    },
    [setupContext]
  );

  const resizeAndPaint = useCallback(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;
    const logicalW = Math.max(1, wrap.clientWidth);
    const logicalH = height;
    if (value) {
      paintFromDataUrl(value, logicalW, logicalH);
    } else {
      setupContext(canvas, logicalW, logicalH);
    }
  }, [height, value, paintFromDataUrl, setupContext]);

  useEffect(() => {
    resizeAndPaint();
    const wrap = wrapRef.current;
    if (!wrap || typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(() => {
      resizeAndPaint();
    });
    ro.observe(wrap);
    return () => ro.disconnect();
  }, [resizeAndPaint]);

  const getPos = (
    e: React.MouseEvent | React.TouchEvent,
    canvas: HTMLCanvasElement
  ): { x: number; y: number } => {
    const rect = canvas.getBoundingClientRect();
    let cx: number;
    let cy: number;
    if ("touches" in e && e.touches[0]) {
      cx = e.touches[0].clientX;
      cy = e.touches[0].clientY;
    } else if ("clientX" in e) {
      cx = e.clientX;
      cy = e.clientY;
    } else {
      return { x: 0, y: 0 };
    }
    return { x: cx - rect.left, y: cy - rect.top };
  };

  const emitPng = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    try {
      onChange(canvas.toDataURL("image/png"));
    } catch {
      onChange(null);
    }
  }, [onChange]);

  const startDraw = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      e.preventDefault();
      drawing.current = true;
      last.current = getPos(e, canvas);
    },
    []
  );

  const moveDraw = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas || !drawing.current || !last.current) return;
    e.preventDefault();
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const p = getPos(e, canvas);
    ctx.beginPath();
    ctx.moveTo(last.current.x, last.current.y);
    ctx.lineTo(p.x, p.y);
    ctx.stroke();
    last.current = p;
  }, []);

  const endDraw = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      if (!drawing.current) return;
      e.preventDefault();
      drawing.current = false;
      last.current = null;
      emitPng();
    },
    [emitPng]
  );

  const handleClear = useCallback(() => {
    resizeAndPaint();
    onChange(null);
    onClearProp?.();
  }, [onChange, onClearProp, resizeAndPaint]);

  return (
    <div style={{ width: "100%" }}>
      <div
        ref={wrapRef}
        style={{
          width: "100%",
          height,
          backgroundColor: BG,
          borderRadius: 10,
          overflow: "hidden",
          border: "1px solid rgba(255,255,255,0.08)",
          touchAction: "none",
        }}
      >
        <canvas
          ref={canvasRef}
          style={{
            display: "block",
            width: "100%",
            height: "100%",
            cursor: "crosshair",
          }}
          onMouseDown={startDraw}
          onMouseMove={moveDraw}
          onMouseUp={endDraw}
          onMouseLeave={(e) => {
            if (drawing.current) endDraw(e);
          }}
          onTouchStart={startDraw}
          onTouchMove={moveDraw}
          onTouchEnd={endDraw}
        />
      </div>
      <button
        type="button"
        onClick={handleClear}
        style={{
          marginTop: 10,
          padding: "10px 14px",
          borderRadius: 10,
          border: "1px solid rgba(255,255,255,0.12)",
          background: "#151515",
          color: "#A1A1AA",
          cursor: "pointer",
          fontSize: 14,
        }}
      >
        Effacer
      </button>
    </div>
  );
}
