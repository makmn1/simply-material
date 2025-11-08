import {vi} from 'vitest';
import {ShapeMorph} from '../services/shape-morph';
import {MinimalCircularBorderRadius} from '../services/minimal-circular-border-radius';

/**
 * Mocks CSS custom properties for a specific element.
 */
export function mockVarsFor(el: Element, vars: Record<string, string>): void {
  vi.spyOn(window, 'getComputedStyle').mockImplementation(
    (target: Element): CSSStyleDeclaration => {
      if (target === el) {
        return {
          getPropertyValue: (name: string) => vars[name] ?? '',
        } as unknown as CSSStyleDeclaration;
      }
      return {getPropertyValue: () => ''} as unknown as CSSStyleDeclaration;
    },
  );
}

/**
 * Stubs computed style for a specific element.
 */
export function stubComputedStyleForElement(
  el: Element,
  style: Partial<CSSStyleDeclaration>,
): void {
  const previous = window.getComputedStyle;
  vi.spyOn(window, 'getComputedStyle').mockImplementation(
    (target: Element): CSSStyleDeclaration => {
      if (target === el) {
        return style as CSSStyleDeclaration;
      }
      if (previous !== window.getComputedStyle) {
        return previous.call(window, target);
      }
      return {borderRadius: '', fontSize: '16px'} as unknown as CSSStyleDeclaration;
    },
  );
}

/**
 * Stubs an element's bounding box.
 */
export function stubRect(el: HTMLElement, w: number, h: number): void {
  const rect = new DOMRect(0, 0, w, h);
  vi.spyOn(el, 'getBoundingClientRect').mockReturnValue(rect);
}

/**
 * Stubs the root element's font size (used for px → rem conversion).
 * @param px - The font size in pixels (number) or as a string (e.g., "18.5px")
 */
export function stubRootFontSize(px: number | string): void {
  const fontSize = typeof px === 'number' ? `${px}px` : px;
  stubComputedStyleForElement(document.documentElement, {fontSize});
}

/**
 * Creates a mock ShapeMorph service for testing.
 */
export function createMockShapeMorph(
  animateBorderRadiusSpy?: ReturnType<typeof vi.fn>,
): ShapeMorph {
  return {
    animateBorderRadius:
      animateBorderRadiusSpy ?? vi.fn().mockResolvedValue(undefined),
    readVar: (el: HTMLElement, name: string) =>
      getComputedStyle(el).getPropertyValue(name).trim(),
  } as unknown as ShapeMorph;
}

/**
 * Creates a mock MinimalCircularBorderRadius service for testing.
 */
export function createMockMinimalCircularBorderRadius(): {
  service: MinimalCircularBorderRadius;
  spies: {
    setIfCircularBorderRadius: ReturnType<typeof vi.fn>;
    setMinimalCircularBorderRadius: ReturnType<typeof vi.fn>;
    getMinimalCircularBorderRadius: ReturnType<typeof vi.fn>;
  };
} {
  const setIfCircularBorderRadiusSpy = vi.fn();
  const setMinimalCircularBorderRadiusSpy = vi.fn((el: HTMLElement) => {
    const rect = el.getBoundingClientRect();
    const minDim = Math.min(rect.width, rect.height);
    const rootPx = 16;
    el.style.borderRadius = `${(minDim / 2) / rootPx}rem`;
  });
  const getMinimalCircularBorderRadiusSpy = vi.fn((el: HTMLElement) => {
    const rect = el.getBoundingClientRect();
    const minDim = Math.min(rect.width, rect.height);
    const rootPx = 16;
    return `${(minDim / 2) / rootPx}rem`;
  });

  const service = {
    setIfCircularBorderRadius: setIfCircularBorderRadiusSpy,
    setMinimalCircularBorderRadius: setMinimalCircularBorderRadiusSpy,
    getMinimalCircularBorderRadius: getMinimalCircularBorderRadiusSpy,
    CIRCULAR_BORDER_RADIUS_VALUE: '9999rem',
    rootPx: () => 16,
    pxToRem: (px: number) => px / 16,
    getWidthAndHeight: (el: HTMLElement) => {
      const rect = el.getBoundingClientRect();
      return {w: rect.width, h: rect.height};
    },
  } as unknown as MinimalCircularBorderRadius;

  return {
    service,
    spies: {
      setIfCircularBorderRadius: setIfCircularBorderRadiusSpy,
      setMinimalCircularBorderRadius: setMinimalCircularBorderRadiusSpy,
      getMinimalCircularBorderRadius: getMinimalCircularBorderRadiusSpy,
    },
  };
}

