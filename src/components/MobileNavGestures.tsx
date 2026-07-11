"use client";

import { useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";

const EDGE_PX = 28;
const MIN_DX = 72;
const MAX_DY = 56;

/**
 * 手机端：
 * - 禁用双击缩放（配合 viewport + touch-action）
 * - 从左缘右滑返回上一级；无历史时回首页，避免直接退出
 */
export function MobileNavGestures() {
  const router = useRouter();
  const pathname = usePathname();
  const start = useRef<{ x: number; y: number; fromEdge: boolean } | null>(null);
  const pathnameRef = useRef(pathname);
  pathnameRef.current = pathname;

  useEffect(() => {
    const isTouch = window.matchMedia("(hover: none), (pointer: coarse)").matches;
    if (!isTouch) return;

    function onStart(e: TouchEvent) {
      if (e.touches.length !== 1) {
        start.current = null;
        return;
      }
      const t = e.touches[0]!;
      start.current = {
        x: t.clientX,
        y: t.clientY,
        fromEdge: t.clientX <= EDGE_PX,
      };
    }

    function onMove(e: TouchEvent) {
      const s = start.current;
      if (!s?.fromEdge || e.touches.length !== 1) return;
      const t = e.touches[0]!;
      const dx = t.clientX - s.x;
      const dy = Math.abs(t.clientY - s.y);
      // 识别为返回手势后阻止浏览器横向退出/前进手势
      if (dx > 24 && dy < MAX_DY) {
        e.preventDefault();
      }
    }

    function onEnd(e: TouchEvent) {
      const s = start.current;
      start.current = null;
      if (!s?.fromEdge || e.changedTouches.length !== 1) return;

      const t = e.changedTouches[0]!;
      const dx = t.clientX - s.x;
      const dy = Math.abs(t.clientY - s.y);
      if (dx < MIN_DX || dy > MAX_DY) return;

      const path = pathnameRef.current;
      if (path === "/") return;

      // 站内有历史则返回；否则回首页，避免直接退出 WebView
      if (window.history.length > 1) {
        router.back();
      } else {
        router.push("/");
      }
    }

    document.addEventListener("touchstart", onStart, { passive: true });
    document.addEventListener("touchmove", onMove, { passive: false });
    document.addEventListener("touchend", onEnd, { passive: true });

    return () => {
      document.removeEventListener("touchstart", onStart);
      document.removeEventListener("touchmove", onMove);
      document.removeEventListener("touchend", onEnd);
    };
  }, [router]);

  return null;
}
