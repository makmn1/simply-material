import { TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { provideZonelessChangeDetection } from '@angular/core';
import { MinimalCircularBorderRadius } from './minimal-circular-border-radius';
import {
  stubComputedStyleForElement,
  stubRect,
  stubRootFontSize,
} from '../testing/test-helpers';

describe('MinimalCircularBorderRadius', () => {
  let svc: MinimalCircularBorderRadius;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection()],
    });
    svc = TestBed.inject(MinimalCircularBorderRadius);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('creates the service', () => {
    expect(svc).toBeTruthy();
  });

  describe('constants', () => {
    it('CIRCULAR_BORDER_RADIUS_NUMBER_VALUE is 9999', () => {
      expect(svc.CIRCULAR_BORDER_RADIUS_NUMBER_VALUE).toBe(9999);
    });

    it('CIRCULAR_BORDER_RADIUS_VALUE is "9999rem"', () => {
      expect(svc.CIRCULAR_BORDER_RADIUS_VALUE).toBe('9999rem');
    });
  });

  describe('rootPx()', () => {
    it('reads root font-size (px) and returns the numeric value', () => {
      stubRootFontSize(20);
      expect(svc.rootPx()).toBe(20);
    });

    it('parses decimal values', () => {
      stubRootFontSize('18.5px');
      expect(svc.rootPx()).toBeCloseTo(18.5);
    });

    it('falls back to 16 when parseFloat is NaN or empty', () => {
      stubRootFontSize('');
      expect(svc.rootPx()).toBe(16);

      stubRootFontSize('not-a-size');
      expect(svc.rootPx()).toBe(16);
    });
  });

  describe('pxToRem()', () => {
    it('converts px to rem using rootPx()', () => {
      vi.spyOn(svc, 'rootPx').mockReturnValue(20);
      expect(svc.pxToRem(0)).toBe(0);
      expect(svc.pxToRem(20)).toBe(1);
      expect(svc.pxToRem(30)).toBe(1.5);
      expect(svc.pxToRem(5)).toBe(0.25);
    });
  });

  describe('getWidthAndHeight()', () => {
    it('returns width and height from getBoundingClientRect()', () => {
      const el = document.createElement('div');
      stubRect(el, 123, 45);
      const { w, h } = svc.getWidthAndHeight(el);
      expect(w).toBe(123);
      expect(h).toBe(45);
    });

    it('handles zero-sized elements', () => {
      const el = document.createElement('div');
      stubRect(el, 0, 0);
      const { w, h } = svc.getWidthAndHeight(el);
      expect(w).toBe(0);
      expect(h).toBe(0);
    });
  });

  describe('getMinimalCircularBorderRadius()', () => {
    it('returns min(width, height)/2 converted to rem with the "rem" suffix', () => {
      vi.spyOn(svc, 'rootPx').mockReturnValue(16);
      const el = document.createElement('div');
      // min(100, 60)/2 = 30px → 1.875rem
      stubRect(el, 100, 60);
      expect(svc.getMinimalCircularBorderRadius(el)).toBe('1.875rem');
    });

    it('works with square elements', () => {
      vi.spyOn(svc, 'rootPx').mockReturnValue(20);
      const el = document.createElement('div');
      // 80/2 = 40px → 2rem
      stubRect(el, 80, 80);
      expect(svc.getMinimalCircularBorderRadius(el)).toBe('2rem');
    });
  });

  describe('setMinimalCircularBorderRadius()', () => {
    it('sets element.style.borderRadius to the computed minimal circular radius', () => {
      vi.spyOn(svc, 'rootPx').mockReturnValue(16);
      const el = document.createElement('button');
      // min(40, 10)/2 = 5px → 0.3125rem
      stubRect(el, 40, 10);
      svc.setMinimalCircularBorderRadius(el);
      expect(el.style.borderRadius).toBe('0.3125rem');
    });
  });

  describe('setIfCircularBorderRadius()', () => {
    it('calls setMinimalCircularBorderRadius() when current border-radius equals 9999 * rootPx in px', () => {
      const el = document.createElement('button');

      // Ensure rootPx is known
      vi.spyOn(svc, 'rootPx').mockReturnValue(16);
      // 9999 * 16 = 159984
      stubComputedStyleForElement(el, { borderRadius: '159984px' });

      const setSpy = vi.spyOn(svc, 'setMinimalCircularBorderRadius');
      // Needed by setMinimal... path
      stubRect(el, 100, 60);

      svc.setIfCircularBorderRadius(el);
      expect(setSpy).toHaveBeenCalledTimes(1);
      expect(setSpy).toHaveBeenCalledWith(el);
    });

    it('does nothing when current border-radius does not equal 9999 * rootPx in px', () => {
      const el = document.createElement('button');

      vi.spyOn(svc, 'rootPx').mockReturnValue(16);
      // Off by 1px on purpose
      stubComputedStyleForElement(el, { borderRadius: '159983px' });

      const setSpy = vi.spyOn(svc, 'setMinimalCircularBorderRadius');
      stubRect(el, 100, 60);

      svc.setIfCircularBorderRadius(el);
      expect(setSpy).not.toHaveBeenCalled();
    });

    it('respects different rootPx values when computing the px threshold', () => {
      const el = document.createElement('button');

      vi.spyOn(svc, 'rootPx').mockReturnValue(20);
      // 9999 * 20 = 199980
      stubComputedStyleForElement(el, { borderRadius: '199980px' });

      const setSpy = vi.spyOn(svc, 'setMinimalCircularBorderRadius');
      stubRect(el, 120, 40);

      svc.setIfCircularBorderRadius(el);
      expect(setSpy).toHaveBeenCalledTimes(1);
    });
  });
});
