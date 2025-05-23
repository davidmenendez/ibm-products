/**
 * Copyright IBM Corp. 2023, 2023
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */
import { useRef, useState, useLayoutEffect, useEffect } from 'react';

export const useResizeObserver = (ref, callback, deps = []) => {
  const [width, setWidth] = useState(-1);
  const [height, setHeight] = useState(-1);
  const entriesToHandle = useRef(null);
  const cb = useRef(callback);

  useEffect(() => {
    // ref for callback removes it as dependency from useLayoutEffect
    // This significantly reduces repeated calls if a function is redefined on every
    // render
    cb.current = callback;
  }, [callback]);

  useEffect(() => {
    const getInitialSize = () => {
      if (ref.current) {
        const refComputedStyle = window.getComputedStyle(ref.current);
        const initialWidth =
          (ref.current?.offsetWidth || 0) -
          (parseFloat(refComputedStyle?.paddingLeft || 0),
          parseFloat(refComputedStyle?.paddingRight || 0));

        const initialHeight =
          (ref.current?.offsetHeight || 0) -
          (parseFloat(refComputedStyle?.paddingTop || 0),
          parseFloat(refComputedStyle?.paddingLeft || 0));

        setWidth(initialWidth);
        setHeight(initialHeight);
      }
    };
    if (!ref?.current || (width >= 0 && height >= 0)) {
      return;
    }
    getInitialSize();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [width, height, ref.current, ...deps]);

  useLayoutEffect(() => {
    if (!ref?.current) {
      return;
    }

    const doCallbacks = () => {
      if (!ref?.current || !Array.isArray(entriesToHandle?.current)) {
        return;
      }

      const entry = entriesToHandle.current[0];

      setWidth(entry.contentRect.width);
      setHeight(entry.contentRect.height);

      cb.current && cb.current(entry.contentRect);
    };

    let observer = new ResizeObserver((entries) => {
      // always update entriesToHandle
      entriesToHandle.current = entries;

      window.requestAnimationFrame(() => {
        // do callbacks
        doCallbacks();
      });
    });

    // observe all refs passed
    observer.observe(ref.current);

    return () => {
      observer?.disconnect();
      observer = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ref.current, ...deps]);
  return { width, height };
};
