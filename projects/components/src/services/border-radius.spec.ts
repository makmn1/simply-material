import { TestBed } from '@angular/core/testing';
import { describe, test, expect, beforeEach, afterEach } from 'vitest';
import { BorderRadius } from './border-radius';

export function remValueRegex(): RegExp {
  return /^\d+\.?\d*rem$/;
}

describe('BorderRadius', () => {
  let service: BorderRadius;
  let testElement: HTMLElement;

  beforeEach(async () => {
    TestBed.configureTestingModule({});

    service = TestBed.inject(BorderRadius);
    testElement = document.createElement('div');
    document.body.appendChild(testElement);
  });

  afterEach(() => {
    if (testElement && testElement.parentNode) {
      testElement.parentNode.removeChild(testElement);
    }
  });

  describe('Service Injection & Setup', () => {
    test('should be created', () => {
      expect(service).toBeTruthy();
      expect(service).toBeInstanceOf(BorderRadius);
    });
  });

  describe('Constants Testing', () => {
    test('should have CIRCULAR_BORDER_RADIUS_NUMBER_VALUE equal to 9999', () => {
      expect(service.CIRCULAR_BORDER_RADIUS_NUMBER_VALUE).toBe(9999);
    });

    test('should have CIRCULAR_BORDER_RADIUS_VALUE equal to "9999rem"', () => {
      expect(service.CIRCULAR_BORDER_RADIUS_VALUE).toBe('9999rem');
    });
  });

  describe('rootPx() Method', () => {
    test('should return default root font size (16px fallback)', () => {
      const rootPx = service.rootPx();
      expect(rootPx).toBeGreaterThan(0);
      expect(typeof rootPx).toBe('number');
    });

    test('should return custom root font size when set', () => {
      const originalFontSize = getComputedStyle(document.documentElement).fontSize;

      document.documentElement.style.fontSize = '20px';
      const rootPx = service.rootPx();
      expect(rootPx).toBe(20);

      document.documentElement.style.fontSize = originalFontSize;
    });

    test('should fallback to 16px when font-size is invalid', () => {
      const originalFontSize = getComputedStyle(document.documentElement).fontSize;

      document.documentElement.style.fontSize = 'invalid';
      const rootPx = service.rootPx();
      expect(rootPx).toBe(16);

      document.documentElement.style.fontSize = originalFontSize;
    });

    test('should fallback to 16px when font-size is empty', () => {
      const originalFontSize = getComputedStyle(document.documentElement).fontSize;

      document.documentElement.style.fontSize = '';
      const rootPx = service.rootPx();
      expect(rootPx).toBe(16);

      document.documentElement.style.fontSize = originalFontSize;
    });
  });

  describe('pxToRem() Method', () => {
    test('should convert pixels to rem with standard 16px base', () => {
      const rootPx = service.rootPx();
      const rem = service.pxToRem(16);
      expect(rem).toBe(16 / rootPx);
    });

    test('should convert various pixel values correctly', () => {
      const rootPx = service.rootPx();

      expect(service.pxToRem(0)).toBe(0);
      expect(service.pxToRem(8)).toBe(8 / rootPx);
      expect(service.pxToRem(32)).toBe(32 / rootPx);
      expect(service.pxToRem(100)).toBe(100 / rootPx);
    });

    test('should handle custom root font size', () => {
      const originalFontSize = getComputedStyle(document.documentElement).fontSize;

      document.documentElement.style.fontSize = '20px';
      const rem = service.pxToRem(20);
      expect(rem).toBe(1);

      document.documentElement.style.fontSize = originalFontSize;
    });

    test('should handle zero values', () => {
      expect(service.pxToRem(0)).toBe(0);
    });

    test('should handle negative values', () => {
      const rootPx = service.rootPx();
      expect(service.pxToRem(-16)).toBe(-16 / rootPx);
    });

    test('should handle very large values', () => {
      const rootPx = service.rootPx();
      const largeValue = 1000000;
      expect(service.pxToRem(largeValue)).toBe(largeValue / rootPx);
    });

    test('should handle very small values', () => {
      const rootPx = service.rootPx();
      const smallValue = 0.001;
      expect(service.pxToRem(smallValue)).toBe(smallValue / rootPx);
    });

    test('should handle decimal precision', () => {
      const rootPx = service.rootPx();
      const rem = service.pxToRem(15.5);
      expect(rem).toBe(15.5 / rootPx);
    });
  });

  describe('getWidthAndHeight() Method', () => {
    test('should get dimensions of square element', () => {
      testElement.style.width = '100px';
      testElement.style.height = '100px';
      testElement.style.position = 'absolute';

      const { w, h } = service.getWidthAndHeight(testElement);
      expect(w).toBe(100);
      expect(h).toBe(100);
    });

    test('should get dimensions of rectangular element (width > height)', () => {
      testElement.style.width = '200px';
      testElement.style.height = '100px';
      testElement.style.position = 'absolute';

      const { w, h } = service.getWidthAndHeight(testElement);
      expect(w).toBe(200);
      expect(h).toBe(100);
    });

    test('should get dimensions of rectangular element (height > width)', () => {
      testElement.style.width = '100px';
      testElement.style.height = '200px';
      testElement.style.position = 'absolute';

      const { w, h } = service.getWidthAndHeight(testElement);
      expect(w).toBe(100);
      expect(h).toBe(200);
    });

    test('should get dimensions with explicit CSS dimensions', () => {
      testElement.style.width = '150px';
      testElement.style.height = '75px';
      testElement.style.position = 'absolute';

      const { w, h } = service.getWidthAndHeight(testElement);
      expect(w).toBe(150);
      expect(h).toBe(75);
    });

    test('should handle zero dimensions', () => {
      testElement.style.width = '0px';
      testElement.style.height = '0px';
      testElement.style.position = 'absolute';

      const { w, h } = service.getWidthAndHeight(testElement);
      expect(w).toBe(0);
      expect(h).toBe(0);
    });

    test('should work with elements not explicitly in DOM', () => {
      testElement.style.width = '50px';
      testElement.style.height = '50px';
      testElement.style.position = 'absolute';

      const { w, h } = service.getWidthAndHeight(testElement);
      expect(w).toBeGreaterThanOrEqual(0);
      expect(h).toBeGreaterThanOrEqual(0);
    });

    test('should handle elements with padding and border', () => {
      testElement.style.width = '100px';
      testElement.style.height = '100px';
      testElement.style.padding = '10px';
      testElement.style.border = '5px solid black';
      testElement.style.boxSizing = 'border-box';
      testElement.style.position = 'absolute';

      const { w, h } = service.getWidthAndHeight(testElement);
      // getBoundingClientRect includes padding and border
      expect(w).toBeGreaterThanOrEqual(100);
      expect(h).toBeGreaterThanOrEqual(100);
    });
  });

  describe('convertToRem() Method', () => {
    test('should convert single px value', () => {
      const rootPx = service.rootPx();
      const result = service.convertToRem('16px');
      const expectedRem = (16 / rootPx).toFixed(4);
      expect(result).toBe(`${parseFloat(expectedRem)}rem`);
    });

    test('should convert multiple px values (space-separated)', () => {
      const result = service.convertToRem('16px 32px 8px');
      const parts = result.split(' ');
      expect(parts.length).toBe(3);
      expect(parts[0]).toMatch(remValueRegex());
      expect(parts[1]).toMatch(remValueRegex());
      expect(parts[2]).toMatch(remValueRegex());
    });

    test('should handle mixed units (px, rem, %, etc.)', () => {
      const result = service.convertToRem('16px 2rem 50%');
      const parts = result.split(' ');
      expect(parts[0]).toMatch(remValueRegex());
      expect(parts[1]).toBe('2rem');
      expect(parts[2]).toBe('50%');
    });

    test('should leave values without px unchanged', () => {
      expect(service.convertToRem('2rem')).toBe('2rem');
      expect(service.convertToRem('50%')).toBe('50%');
      expect(service.convertToRem('1em')).toBe('1em');
      expect(service.convertToRem('10')).toBe('10');
    });

    test('should handle empty strings', () => {
      expect(service.convertToRem('')).toBe('');
    });

    test('should handle whitespace', () => {
      const result = service.convertToRem('  16px  32px  ');
      const parts = result.trim().split(/\s+/);
      expect(parts.length).toBe(2);
      expect(parts[0]).toMatch(remValueRegex());
      expect(parts[1]).toMatch(remValueRegex());
    });

    test('should maintain 4 decimal places precision', () => {
      const rootPx = service.rootPx();
      const result = service.convertToRem('15px');
      const remValue = parseFloat(result.replace('rem', ''));
      const expectedRem = 15 / rootPx;
      expect(remValue).toBeCloseTo(expectedRem, 4);
    });

    test('should handle decimal px values', () => {
      const rootPx = service.rootPx();
      const result = service.convertToRem('15.5px');
      const remValue = parseFloat(result.replace('rem', ''));
      const expectedRem = 15.5 / rootPx;
      expect(remValue).toBeCloseTo(expectedRem, 4);
    });

    test('should handle negative px values', () => {
      const rootPx = service.rootPx();
      const result = service.convertToRem('-16px');
      const remValue = parseFloat(result.replace('rem', ''));
      const expectedRem = -16 / rootPx;
      expect(remValue).toBeCloseTo(expectedRem, 4);
    });
  });

  describe('normalizeBorderRadius() Method', () => {
    test('should normalize 1 value to 4 values', () => {
      expect(service.normalizeBorderRadius('1rem')).toBe('1rem 1rem 1rem 1rem');
      expect(service.normalizeBorderRadius('10px')).toBe('10px 10px 10px 10px');
    });

    test('should normalize 2 values (v h -> v h v h)', () => {
      expect(service.normalizeBorderRadius('1rem 2rem')).toBe('1rem 2rem 1rem 2rem');
      expect(service.normalizeBorderRadius('10px 20px')).toBe('10px 20px 10px 20px');
    });

    test('should normalize 3 values (t h b -> t h b h)', () => {
      expect(service.normalizeBorderRadius('1rem 2rem 3rem')).toBe('1rem 2rem 3rem 2rem');
      expect(service.normalizeBorderRadius('10px 20px 30px')).toBe('10px 20px 30px 20px');
    });

    test('should keep 4 values unchanged', () => {
      expect(service.normalizeBorderRadius('1rem 2rem 3rem 4rem')).toBe('1rem 2rem 3rem 4rem');
    });

    test('should use first 4 values when 5+ values provided', () => {
      expect(service.normalizeBorderRadius('1rem 2rem 3rem 4rem 5rem')).toBe('1rem 2rem 3rem 4rem');
      expect(service.normalizeBorderRadius('a b c d e f')).toBe('a b c d');
    });

    test('should handle empty string', () => {
      expect(service.normalizeBorderRadius('')).toBe('');
    });

    test('should handle whitespace-only strings', () => {
      expect(service.normalizeBorderRadius('   ')).toBe('');
      expect(service.normalizeBorderRadius('\t\n')).toBe('');
    });

    test('should handle multiple spaces between values', () => {
      expect(service.normalizeBorderRadius('1rem   2rem')).toBe('1rem 2rem 1rem 2rem');
      expect(service.normalizeBorderRadius('1rem\t\t2rem')).toBe('1rem 2rem 1rem 2rem');
    });

    test('should handle leading/trailing whitespace', () => {
      expect(service.normalizeBorderRadius('  1rem  ')).toBe('1rem 1rem 1rem 1rem');
      expect(service.normalizeBorderRadius('\t2rem\n')).toBe('2rem 2rem 2rem 2rem');
    });

    test('should handle mixed units', () => {
      expect(service.normalizeBorderRadius('1rem 2px 3% 4em')).toBe('1rem 2px 3% 4em');
    });
  });

  describe('getMinimalCircularBorderRadius() Method', () => {
    test('should calculate minimal radius for square element', () => {
      testElement.style.width = '100px';
      testElement.style.height = '100px';
      testElement.style.position = 'absolute';

      const result = service.getMinimalCircularBorderRadius(testElement);
      const rootPx = service.rootPx();
      const expectedRem = (50 / rootPx).toFixed(4);
      expect(result).toBe(`${expectedRem}rem`);
    });

    test('should calculate minimal radius for rectangular element (width > height)', () => {
      testElement.style.width = '200px';
      testElement.style.height = '100px';
      testElement.style.position = 'absolute';

      const result = service.getMinimalCircularBorderRadius(testElement);
      const rootPx = service.rootPx();
      const expectedRem = (50 / rootPx).toFixed(4);
      expect(result).toBe(`${expectedRem}rem`);
    });

    test('should calculate minimal radius for rectangular element (height > width)', () => {
      testElement.style.width = '100px';
      testElement.style.height = '200px';
      testElement.style.position = 'absolute';

      const result = service.getMinimalCircularBorderRadius(testElement);
      const rootPx = service.rootPx();
      const expectedRem = (50 / rootPx).toFixed(4);
      expect(result).toBe(`${expectedRem}rem`);
    });

    test('should handle different element sizes', () => {
      testElement.style.width = '50px';
      testElement.style.height = '50px';
      testElement.style.position = 'absolute';

      const result1 = service.getMinimalCircularBorderRadius(testElement);
      const rootPx = service.rootPx();
      const expectedRem1 = (25 / rootPx).toFixed(4);

      expect(result1).toBe(`${expectedRem1}rem`);

      testElement.style.width = '300px';
      testElement.style.height = '300px';
      const result2 = service.getMinimalCircularBorderRadius(testElement);
      const expectedRem2 = (150 / rootPx).toFixed(4);

      expect(result2).toBe(`${expectedRem2}rem`);
    });

    test('should maintain 4 decimal places precision', () => {
      testElement.style.width = '100px';
      testElement.style.height = '100px';
      testElement.style.position = 'absolute';

      const result = service.getMinimalCircularBorderRadius(testElement);
      const remValue = parseFloat(result.replace('rem', ''));
      const rootPx = service.rootPx();
      const expectedRem = 50 / rootPx;
      expect(remValue).toBeCloseTo(expectedRem, 4);
    });

    test('should handle elements with CSS transforms', () => {
      testElement.style.width = '100px';
      testElement.style.height = '100px';
      testElement.style.position = 'absolute';
      testElement.style.transform = 'scale(2)';

      // getBoundingClientRect should account for transforms
      const result = service.getMinimalCircularBorderRadius(testElement);
      expect(result).toMatch(remValueRegex());
    });

    test('should handle very small elements', () => {
      testElement.style.width = '1px';
      testElement.style.height = '1px';
      testElement.style.position = 'absolute';

      const result = service.getMinimalCircularBorderRadius(testElement);
      const rootPx = service.rootPx();
      const expectedRem = (0.5 / rootPx).toFixed(4);

      expect(result).toBe(`${expectedRem}rem`);
    });
  });

  describe('convertCircularBorderRadius() Method', () => {
    test('should replace single circular token', () => {
      testElement.style.width = '100px';
      testElement.style.height = '100px';
      testElement.style.position = 'absolute';

      const result = service.convertCircularBorderRadius(testElement, '9999rem');
      const rootPx = service.rootPx();
      const expectedRem = (50 / rootPx).toFixed(4);

      expect(result).toBe(`${expectedRem}rem`);
    });

    test('should replace multiple circular tokens in 4-value syntax', () => {
      testElement.style.width = '100px';
      testElement.style.height = '100px';
      testElement.style.position = 'absolute';

      const result = service.convertCircularBorderRadius(testElement, '1rem 9999rem 9999rem 1rem');
      const rootPx = service.rootPx();
      const expectedRem = (50 / rootPx).toFixed(4);

      const parts = result.split(' ');
      expect(parts[0]).toBe('1rem');
      expect(parts[1]).toBe(`${expectedRem}rem`);
      expect(parts[2]).toBe(`${expectedRem}rem`);
      expect(parts[3]).toBe('1rem');
    });

    test('should return unchanged when no circular tokens', () => {
      testElement.style.width = '100px';
      testElement.style.height = '100px';
      testElement.style.position = 'absolute';

      expect(service.convertCircularBorderRadius(testElement, '1rem 2rem 3rem 4rem')).toBe('1rem 2rem 3rem 4rem');
      expect(service.convertCircularBorderRadius(testElement, '10px')).toBe('10px');
    });

    test('should handle mixed values with circular tokens', () => {
      testElement.style.width = '100px';
      testElement.style.height = '100px';
      testElement.style.position = 'absolute';

      const result = service.convertCircularBorderRadius(testElement, '1rem 9999rem 2rem 9999rem');
      const rootPx = service.rootPx();
      const expectedRem = (50 / rootPx).toFixed(4);

      const parts = result.split(' ');
      expect(parts[0]).toBe('1rem');
      expect(parts[1]).toBe(`${expectedRem}rem`);
      expect(parts[2]).toBe('2rem');
      expect(parts[3]).toBe(`${expectedRem}rem`);
    });

    test('should handle empty string', () => {
      testElement.style.width = '100px';
      testElement.style.height = '100px';
      testElement.style.position = 'absolute';

      expect(service.convertCircularBorderRadius(testElement, '')).toBe('');
    });

    test('should handle whitespace-only string', () => {
      testElement.style.width = '100px';
      testElement.style.height = '100px';
      testElement.style.position = 'absolute';

      const result = service.convertCircularBorderRadius(testElement, '   ');
      expect(result).toBe('   ');
    });
  });

  describe('convertCircularBorderRadiusPair() Method', () => {
    test('should replace circular tokens in both from and to', () => {
      testElement.style.width = '100px';
      testElement.style.height = '100px';
      testElement.style.position = 'absolute';

      const result = service.convertCircularBorderRadiusPair(testElement, '9999rem', '9999rem');
      const rootPx = service.rootPx();
      const expectedRem = (50 / rootPx).toFixed(4);

      const expectedValue = `${expectedRem}rem`;
      expect(result.from).toBe(expectedValue);
      expect(result.to).toBe(expectedValue);
    });

    test('should replace circular tokens only in from', () => {
      testElement.style.width = '100px';
      testElement.style.height = '100px';
      testElement.style.position = 'absolute';

      const result = service.convertCircularBorderRadiusPair(testElement, '9999rem', '1rem');
      const rootPx = service.rootPx();
      const expectedRem = (50 / rootPx).toFixed(4);

      expect(result.from).toBe(`${expectedRem}rem`);
      expect(result.to).toBe('1rem');
    });

    test('should replace circular tokens only in to', () => {
      testElement.style.width = '100px';
      testElement.style.height = '100px';
      testElement.style.position = 'absolute';

      const result = service.convertCircularBorderRadiusPair(testElement, '1rem', '9999rem');
      const rootPx = service.rootPx();
      const expectedRem = (50 / rootPx).toFixed(4);

      expect(result.from).toBe('1rem');
      expect(result.to).toBe(`${expectedRem}rem`);
    });

    test('should return unchanged when neither contains circular tokens', () => {
      testElement.style.width = '100px';
      testElement.style.height = '100px';
      testElement.style.position = 'absolute';

      const result = service.convertCircularBorderRadiusPair(testElement, '1rem', '2rem');
      expect(result.from).toBe('1rem');
      expect(result.to).toBe('2rem');
    });

    test('should compute minimal radius only once when both contain circular tokens', () => {
      testElement.style.width = '100px';
      testElement.style.height = '100px';
      testElement.style.position = 'absolute';

      const result = service.convertCircularBorderRadiusPair(testElement, '9999rem', '9999rem');
      expect(result.from).toBe(result.to);
    });

    test('should handle multiple circular tokens in from', () => {
      testElement.style.width = '100px';
      testElement.style.height = '100px';
      testElement.style.position = 'absolute';

      const result = service.convertCircularBorderRadiusPair(
        testElement,
        '1rem 9999rem 9999rem 1rem',
        '2rem'
      );
      const rootPx = service.rootPx();
      const expectedRem = (50 / rootPx).toFixed(4);

      const parts = result.from.split(' ');
      expect(parts[0]).toBe('1rem');
      expect(parts[1]).toBe(`${expectedRem}rem`);
      expect(parts[2]).toBe(`${expectedRem}rem`);
      expect(parts[3]).toBe('1rem');
      expect(result.to).toBe('2rem');
    });

    test('should handle multiple circular tokens in to', () => {
      testElement.style.width = '100px';
      testElement.style.height = '100px';
      testElement.style.position = 'absolute';

      const result = service.convertCircularBorderRadiusPair(
        testElement,
        '1rem',
        '2rem 9999rem 9999rem 2rem'
      );
      const rootPx = service.rootPx();
      const expectedRem = (50 / rootPx).toFixed(4);

      expect(result.from).toBe('1rem');
      const parts = result.to.split(' ');
      expect(parts[0]).toBe('2rem');
      expect(parts[1]).toBe(`${expectedRem}rem`);
      expect(parts[2]).toBe(`${expectedRem}rem`);
      expect(parts[3]).toBe('2rem');
    });

    test('should handle multiple circular tokens in both from and to', () => {
      testElement.style.width = '100px';
      testElement.style.height = '100px';
      testElement.style.position = 'absolute';

      const result = service.convertCircularBorderRadiusPair(
        testElement,
        '1rem 9999rem 9999rem 1rem',
        '2rem 9999rem 9999rem 2rem'
      );
      const rootPx = service.rootPx();
      const expectedRem = (50 / rootPx).toFixed(4);

      const expectedValue = `${expectedRem}rem`;

      const fromParts = result.from.split(' ');
      expect(fromParts[0]).toBe('1rem');
      expect(fromParts[1]).toBe(expectedValue);
      expect(fromParts[2]).toBe(expectedValue);
      expect(fromParts[3]).toBe('1rem');

      const toParts = result.to.split(' ');
      expect(toParts[0]).toBe('2rem');
      expect(toParts[1]).toBe(expectedValue);
      expect(toParts[2]).toBe(expectedValue);
      expect(toParts[3]).toBe('2rem');
    });

    test('should handle mixed scenarios with regular values', () => {
      testElement.style.width = '100px';
      testElement.style.height = '100px';
      testElement.style.position = 'absolute';

      const result = service.convertCircularBorderRadiusPair(
        testElement,
        '1rem 2rem 9999rem 4rem',
        '5rem 9999rem 7rem 8rem'
      );
      const rootPx = service.rootPx();
      const expectedRem = (50 / rootPx).toFixed(4);

      const expectedValue = `${expectedRem}rem`;

      const fromParts = result.from.split(' ');
      expect(fromParts[0]).toBe('1rem');
      expect(fromParts[1]).toBe('2rem');
      expect(fromParts[2]).toBe(expectedValue);
      expect(fromParts[3]).toBe('4rem');

      const toParts = result.to.split(' ');
      expect(toParts[0]).toBe('5rem');
      expect(toParts[1]).toBe(expectedValue);
      expect(toParts[2]).toBe('7rem');
      expect(toParts[3]).toBe('8rem');
    });
  });
});

