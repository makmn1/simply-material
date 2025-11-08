import { TestBed } from '@angular/core/testing';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { provideZonelessChangeDetection } from '@angular/core';

import { ShapeMorph } from './shape-morph';
import { MinimalCircularBorderRadius } from './minimal-circular-border-radius';
import { SpringAnimate } from '../utils/spring-animate';
import { mockVarsFor } from '../testing/test-helpers';

type SpringOptions = { damping: number; stiffness: number };
type SpringFn = (
  el: HTMLElement,
  prop: string,
  from: string,
  to: string,
  opts: SpringOptions,
) => Promise<void>;

describe('ShapeMorph', () => {
  let service: ShapeMorph;

  const CIRC = '9999rem';

  const getMinimalSpy = vi.fn((_el: HTMLElement): string => '1.25rem');
  let animateSpy: ReturnType<typeof vi.fn<SpringFn>>;

  beforeEach(() => {
    const minimalStub: Pick<
      MinimalCircularBorderRadius,
      'CIRCULAR_BORDER_RADIUS_VALUE' | 'getMinimalCircularBorderRadius'
    > = {
      CIRCULAR_BORDER_RADIUS_VALUE: CIRC,
      getMinimalCircularBorderRadius: (el: HTMLElement) => getMinimalSpy(el),
    };

    animateSpy = vi.fn<SpringFn>().mockResolvedValue();

    TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        { provide: MinimalCircularBorderRadius, useValue: minimalStub as MinimalCircularBorderRadius },
        { provide: SpringAnimate, useValue: { animate: animateSpy } as SpringAnimate },
      ],
    });

    service = TestBed.inject(ShapeMorph);
  });

  afterEach(() => {
    vi.restoreAllMocks();
    getMinimalSpy.mockReset();
    animateSpy.mockReset();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('readVar()', () => {
    it('returns trimmed CSS custom property', () => {
      const el = document.createElement('div');
      mockVarsFor(el, { '--d': '   20  ' });
      expect(service.readVar(el, '--d')).toBe('20');
    });
  });

  describe('animateBorderRadius()', () => {
    it('animates when both endpoints are concrete values', async () => {
      const el = document.createElement('button');
      mockVarsFor(el, { '--damping': '20', '--stiffness': '150' });

      await service.animateBorderRadius(el, '8px', '16px', '--damping', '--stiffness');

      expect(getMinimalSpy).not.toHaveBeenCalled();
      expect(animateSpy).toHaveBeenCalledTimes(1);
      expect(animateSpy).toHaveBeenCalledWith(
        el,
        'borderRadius',
        '8px',
        '16px',
        { damping: 20, stiffness: 150 },
      );
    });

    it('replaces `from` when it equals the circular constant', async () => {
      const el = document.createElement('div');
      mockVarsFor(el, { '--d': '12', '--k': '200' });
      getMinimalSpy.mockReturnValueOnce('2rem');

      await service.animateBorderRadius(el, CIRC, '24px', '--d', '--k');

      expect(getMinimalSpy).toHaveBeenCalledTimes(1);
      expect(getMinimalSpy).toHaveBeenCalledWith(el);
      expect(animateSpy).toHaveBeenCalledWith(
        el,
        'borderRadius',
        '2rem',
        '24px',
        { damping: 12, stiffness: 200 },
      );
    });

    it('replaces `to` when it equals the circular constant', async () => {
      const el = document.createElement('div');
      mockVarsFor(el, { '--d': '30', '--k': '300' });
      getMinimalSpy.mockReturnValueOnce('0.75rem');

      await service.animateBorderRadius(el, '4px', CIRC, '--d', '--k');

      expect(getMinimalSpy).toHaveBeenCalledTimes(1);
      expect(getMinimalSpy).toHaveBeenCalledWith(el);
      expect(animateSpy).toHaveBeenCalledWith(
        el,
        'borderRadius',
        '4px',
        '0.75rem',
        { damping: 30, stiffness: 300 },
      );
    });

    it('replaces both when both equal the circular constant', async () => {
      const el = document.createElement('div');
      mockVarsFor(el, { '--d': '18', '--k': '120' });
      getMinimalSpy.mockImplementationOnce(() => '1rem').mockImplementationOnce(() => '2rem');

      await service.animateBorderRadius(el, CIRC, CIRC, '--d', '--k');

      expect(getMinimalSpy).toHaveBeenCalledTimes(2);
      expect(animateSpy).toHaveBeenCalledWith(
        el,
        'borderRadius',
        '1rem',
        '2rem',
        { damping: 18, stiffness: 120 },
      );
    });

    it('coerces CSS var values with Number() (NaN/0 pass through)', async () => {
      const el = document.createElement('div');
      mockVarsFor(el, { '--d': 'abc', '--k': ' ' }); // NaN and 0

      await service.animateBorderRadius(el, '6px', '12px', '--d', '--k');

      const call = animateSpy.mock.calls.at(-1) as Parameters<SpringFn> | undefined;
      expect(call).toBeTruthy();

      expect(call![2]).toBe('6px');
      expect(call![3]).toBe('12px');
      const opts = call![4] as SpringOptions;
      expect(Number.isNaN(opts.damping)).toBe(true);
      expect(opts.stiffness).toBe(0);
    });
  });
});
