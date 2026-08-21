import { useCallback, useEffect, useRef, useState } from 'react';

interface UseResizableOptions {
  initial: number;
  min: number;
  max: number;
  /** direction the panel grows when dragging: -1 = left panel grows leftward (divider on right edge), 1 = right panel grows rightward */
  direction: -1 | 1;
}

/**
 * Returns a width (px) and a set of drag handlers for a resizable panel.
 * `direction` indicates which side of the divider the panel sits on:
 *  -1 means dragging the divider left increases this panel's width (panel is to the LEFT of divider)
 *   1 means dragging the divider right increases this panel's width (panel is to the RIGHT of divider)
 */
export function useResizable({ initial, min, max, direction }: UseResizableOptions) {
  const [width, setWidth] = useState(initial);
  const startX = useRef(0);
  const startWidth = useRef(initial);
  const dragging = useRef(false);

  const onPointerDown = useCallback(
    (e: React.PointerEvent) => {
      e.preventDefault();
      dragging.current = true;
      startX.current = e.clientX;
      startWidth.current = width;
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
    },
    [width],
  );

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      if (!dragging.current) return;
      const delta = (e.clientX - startX.current) * direction;
      const next = Math.max(min, Math.min(max, startWidth.current + delta));
      setWidth(next);
    };
    const onUp = () => {
      if (!dragging.current) return;
      dragging.current = false;
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
    };
  }, [min, max, direction]);

  return { width, onPointerDown, setWidth };
}
