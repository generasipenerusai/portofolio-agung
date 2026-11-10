'use client';

import React, { useEffect, useRef, useState } from 'react';

// Shared singleton IntersectionObserver so the entire page uses only ONE observer instance
type RevealCallback = () => void;
const observerCallbacks = new WeakMap<Element, RevealCallback>();
let sharedObserver: IntersectionObserver | null = null;

function getSharedObserver(): IntersectionObserver | null {
  if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
    return null;
  }
  if (!sharedObserver) {
    sharedObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const cb = observerCallbacks.get(entry.target);
            if (cb) {
              cb();
              observerCallbacks.delete(entry.target);
            }
            sharedObserver?.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.08, rootMargin: '0px 0px -30px 0px' }
    );
  }
  return sharedObserver;
}

interface SpotlightTiltCardProps {
  children: React.ReactNode;
  className?: string;
  /** Maximum 3D tilt angle in degrees on desktop devices (0 disables tilt) */
  tiltIntensity?: number;
  onClick?: () => void;
  onMouseEnter?: () => void;
  spotlightColor?: string;
}

/**
 * Feather-light GPU-accelerated Interactive Card:
 * - Caches bounding rect once on mouseenter (zero layout reflows during mousemove)
 * - Releases GPU layer memory (`will-change: auto`) immediately on mouseleave
 * - Zero React state updates
 */
export const SpotlightTiltCard: React.FC<SpotlightTiltCardProps> = ({
  children,
  className = '',
  tiltIntensity = 3.5,
  onClick,
  onMouseEnter,
  spotlightColor = 'rgba(163, 230, 53, 0.11)',
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const spotRef = useRef<HTMLDivElement>(null);
  const rectRef = useRef<DOMRect | null>(null);
  const rafRef = useRef<number | null>(null);
  const canTiltRef = useRef<boolean>(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      canTiltRef.current =
        window.matchMedia('(pointer: fine)').matches &&
        !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const handleMouseEnter = () => {
    const el = cardRef.current;
    if (el && canTiltRef.current) {
      rectRef.current = el.getBoundingClientRect();
      el.style.willChange = tiltIntensity > 0 ? 'transform' : 'auto';
      el.style.transition = 'transform 150ms ease-out, border-color 200ms ease, box-shadow 200ms ease';
    }
    if (spotRef.current && canTiltRef.current) {
      spotRef.current.style.opacity = '1';
    }
    onMouseEnter?.();
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!canTiltRef.current) return;
    const rect = rectRef.current;
    const el = cardRef.current;
    if (!rect || !el) return;

    const clientX = e.clientX;
    const clientY = e.clientY;

    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      const x = clientX - rect.left;
      const y = clientY - rect.top;

      if (spotRef.current) {
        spotRef.current.style.background = `radial-gradient(380px circle at ${x.toFixed(0)}px ${y.toFixed(0)}px, ${spotlightColor}, transparent 68%)`;
      }

      if (tiltIntensity > 0 && rect.width > 0 && rect.height > 0) {
        const normX = (x / rect.width - 0.5) * 2;
        const normY = (y / rect.height - 0.5) * 2;
        const rotateY = normX * tiltIntensity;
        const rotateX = -normY * tiltIntensity;
        el.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translate3d(0, -2px, 0)`;
      }
    });
  };

  const handleMouseLeave = () => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    const el = cardRef.current;
    if (el) {
      el.style.transition = 'transform 350ms ease-out, border-color 200ms ease, box-shadow 200ms ease';
      el.style.transform = 'translate3d(0, 0, 0)';
      el.style.willChange = 'auto';
    }
    if (spotRef.current) {
      spotRef.current.style.opacity = '0';
    }
    rectRef.current = null;
  };

  return (
    <div
      ref={cardRef}
      onClick={onClick}
      onMouseEnter={handleMouseEnter}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`relative overflow-hidden ${className}`}
    >
      {/* Single Lightweight Cursor Spotlight Layer */}
      <div
        ref={spotRef}
        aria-hidden="true"
        style={{ opacity: 0 }}
        className="pointer-events-none absolute inset-0 z-[1] transition-opacity duration-300"
      />

      <div className="relative z-[2] h-full flex flex-col justify-between">{children}</div>
    </div>
  );
};

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  direction?: 'up' | 'scale';
}

/**
 * Shared-Observer Scroll Reveal:
 * Uses one shared IntersectionObserver across the entire app.
 */
export const ScrollReveal: React.FC<ScrollRevealProps> = ({
  children,
  className = '',
  delay = 0,
  direction = 'up',
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      setVisible(true);
      return;
    }

    const observer = getSharedObserver();
    if (!observer) {
      setVisible(true);
      return;
    }

    observerCallbacks.set(el, () => setVisible(true));
    observer.observe(el);

    return () => {
      observerCallbacks.delete(el);
      observer.unobserve(el);
    };
  }, []);

  const hiddenTransform =
    direction === 'scale' ? 'scale(0.98)' : 'translate3d(0, 16px, 0)';

  return (
    <div
      ref={ref}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translate3d(0, 0, 0) scale(1)' : hiddenTransform,
        transition: `opacity 450ms ease-out ${delay}ms, transform 450ms ease-out ${delay}ms`,
      }}
      className={className}
    >
      {children}
    </div>
  );
};

interface AnimatedCounterProps {
  value: string;
  durationMs?: number;
}

/**
 * Zero-Re-Render Animated Counter:
 * Updates DOM textContent directly via ref during animation (0 React re-renders).
 */
export const AnimatedCounter: React.FC<AnimatedCounterProps> = ({
  value,
  durationMs = 1100,
}) => {
  const spanRef = useRef<HTMLSpanElement>(null);
  const hasAnimatedRef = useRef(false);

  useEffect(() => {
    const el = spanRef.current;
    if (!el) return;

    const match = String(value).match(/^([^0-9]*)(\d+)(.*)$/);
    if (!match) {
      el.textContent = value;
      return;
    }

    const prefix = match[1] || '';
    const targetNum = parseInt(match[2], 10);
    const suffix = match[3] || '';

    if (isNaN(targetNum) || targetNum <= 0) {
      el.textContent = value;
      return;
    }

    let rafId: number | null = null;

    const startAnimation = () => {
      if (hasAnimatedRef.current) return;
      hasAnimatedRef.current = true;
      const startTime = performance.now();

      const step = (now: number) => {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / durationMs, 1);
        const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
        const current = Math.round(eased * targetNum);
        if (spanRef.current) {
          spanRef.current.textContent = `${prefix}${current}${suffix}`;
        }

        if (progress < 1) {
          rafId = requestAnimationFrame(step);
        } else if (spanRef.current) {
          spanRef.current.textContent = value;
        }
      };

      rafId = requestAnimationFrame(step);
    };

    const observer = getSharedObserver();
    if (!observer) {
      el.textContent = value;
      return;
    }

    observerCallbacks.set(el, startAnimation);
    observer.observe(el);

    return () => {
      observerCallbacks.delete(el);
      observer.unobserve(el);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [value, durationMs]);

  return <span ref={spanRef}>{value}</span>;
};
