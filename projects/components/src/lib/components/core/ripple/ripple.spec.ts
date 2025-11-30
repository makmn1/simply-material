import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, test, expect, beforeEach } from 'vitest';
import { page } from 'vitest/browser';
import { SimplyMatRippleDirective } from './ripple';

describe('SimplyMatRippleDirective', () => {
  let fixture: ComponentFixture<RippleTestComponent>;
  let testPage: RipplePage;
  let testComponent: RippleTestComponent;

  beforeEach(async () => {
    fixture = TestBed.createComponent(RippleTestComponent);
    testPage = new RipplePage(fixture);
    testComponent = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  describe('Pointer-Based Ripples', () => {
    test('should create ripple on primary button click', async () => {
      expect(testPage.hasWave('default-btn')).toBe(false);

      await testPage.click('default-btn', 50, 50);

      expect(testPage.hasWave('default-btn')).toBe(true);
    });

    test('should ignore non-primary button clicks', async () => {
      expect(testPage.hasWave('default-btn')).toBe(false);

      await testPage.click('default-btn', 50, 50, 1);

      expect(testPage.hasWave('default-btn')).toBe(false);

      await testPage.click('default-btn', 50, 50, 2);

      expect(testPage.hasWave('default-btn')).toBe(false);
    });

    test('should calculate correct position from clientX/clientY', async () => {
      const element = testPage.getElement('default-btn')!;
      const rect = element.getBoundingClientRect();
      const clientX = rect.left + 30;
      const clientY = rect.top + 20;

      await testPage.click('default-btn', clientX, clientY);

      const origin = testPage.getComputedOrigin('default-btn');
      expect(origin.x).toBeCloseTo(30 / rect.width, 2);
      expect(origin.y).toBeCloseTo(20 / rect.height, 2);
    });

    test('should set CSS custom properties for origin', async () => {
      await testPage.click('default-btn', 50, 50);

      const element = testPage.getElement('default-btn')!;
      const originX = element.style.getPropertyValue('--sm-ripple-origin-x');
      const originY = element.style.getPropertyValue('--sm-ripple-origin-y');

      expect(originX).not.toBe('');
      expect(originY).not.toBe('');
      expect(parseFloat(originX)).toBeGreaterThanOrEqual(0);
      expect(parseFloat(originX)).toBeLessThanOrEqual(1);
      expect(parseFloat(originY)).toBeGreaterThanOrEqual(0);
      expect(parseFloat(originY)).toBeLessThanOrEqual(1);
    });

    test('should create wave element with correct size based on farthest corner', async () => {
      const element = testPage.getElement('default-btn')!;
      const rect = element.getBoundingClientRect();
      const clientX = rect.left + 10;
      const clientY = rect.top + 10;

      await testPage.click('default-btn', clientX, clientY);

      const wave = testPage.getWaves('default-btn')[0];
      const waveSize = parseFloat(wave.style.width);

      const dx = Math.max(10, rect.width - 10);
      const dy = Math.max(10, rect.height - 10);
      const expectedRadius = Math.hypot(dx, dy);
      const expectedSize = expectedRadius * 2;

      expect(waveSize).toBeCloseTo(expectedSize, 1);
      expect(wave.style.width).toBe(wave.style.height);
    });

    test('should respect event.preventDefault() and not create ripple', async () => {
      const element = testPage.getElement('prevent-default-btn')!;

      element.addEventListener('pointerdown', (e) => {
        e.preventDefault();
      }, { capture: true });

      await testPage.click('prevent-default-btn', 50, 50);

      expect(testPage.hasWave('prevent-default-btn')).toBe(false);
    });
  });

  describe('Keyboard-Based Ripples', () => {
    test('should create centered ripple on Enter key', async () => {
      expect(testPage.hasWave('default-btn')).toBe(false);

      await testPage.keydown('default-btn', 'Enter', false);

      expect(testPage.hasWave('default-btn')).toBe(true);
      const origin = testPage.getComputedOrigin('default-btn');
      expect(origin.x).toBe(0.5);
      expect(origin.y).toBe(0.5);
    });

    test('should create centered ripple on Space key', async () => {
      expect(testPage.hasWave('default-btn')).toBe(false);

      await testPage.keydown('default-btn', ' ', false);

      expect(testPage.hasWave('default-btn')).toBe(true);
      const origin = testPage.getComputedOrigin('default-btn');
      expect(origin.x).toBe(0.5);
      expect(origin.y).toBe(0.5);
    });

    test('should create centered ripple on Spacebar key (legacy)', async () => {
      expect(testPage.hasWave('default-btn')).toBe(false);

      await testPage.keydown('default-btn', 'Spacebar', false);

      expect(testPage.hasWave('default-btn')).toBe(true);
    });

    test('should ignore Space key repeats', async () => {
      await testPage.keydown('default-btn', ' ', false);
      expect(testPage.getWaves('default-btn').length).toBe(1);

      await testPage.keydown('default-btn', ' ', true);
      expect(testPage.getWaves('default-btn').length).toBe(1);

      await testPage.keydown('default-btn', ' ', true);
      expect(testPage.getWaves('default-btn').length).toBe(1);
    });

    test('should ignore other keys', async () => {
      await testPage.keydown('default-btn', 'a', false);
      expect(testPage.hasWave('default-btn')).toBe(false);

      await testPage.keydown('default-btn', 'Tab', false);
      expect(testPage.hasWave('default-btn')).toBe(false);

      await testPage.keydown('default-btn', 'Escape', false);
      expect(testPage.hasWave('default-btn')).toBe(false);
    });

    test('should respect event.preventDefault() on keyboard events', async () => {
      const element = testPage.getElement('prevent-default-btn')!;

      element.addEventListener('keydown', (e) => {
        e.preventDefault();
      }, { capture: true });

      await testPage.keydown('prevent-default-btn', 'Enter', false);

      expect(testPage.hasWave('prevent-default-btn')).toBe(false);
    });
  });

  describe('Disabled States', () => {
    test('should not create ripple when rippleDisabled input is true', async () => {
      await testPage.click('ripple-disabled-btn', 50, 50);
      expect(testPage.hasWave('ripple-disabled-btn')).toBe(false);

      await testPage.keydown('ripple-disabled-btn', 'Enter', false);
      expect(testPage.hasWave('ripple-disabled-btn')).toBe(false);
    });

    test('should not create ripple when host has disabled attribute', async () => {
      await testPage.click('disabled-attr-btn', 50, 50);
      expect(testPage.hasWave('disabled-attr-btn')).toBe(false);

      await testPage.keydown('disabled-attr-btn', 'Enter', false);
      expect(testPage.hasWave('disabled-attr-btn')).toBe(false);
    });

    test('should not create ripple when host has disabled property', async () => {
      await testPage.click('disabled-prop-btn', 50, 50);
      expect(testPage.hasWave('disabled-prop-btn')).toBe(false);

      await testPage.keydown('disabled-prop-btn', 'Enter', false);
      expect(testPage.hasWave('disabled-prop-btn')).toBe(false);
    });

    test('should not create ripple when host has aria-disabled="true"', async () => {
      await testPage.click('aria-disabled-btn', 50, 50);
      expect(testPage.hasWave('aria-disabled-btn')).toBe(false);

      await testPage.keydown('aria-disabled-btn', 'Enter', false);
      expect(testPage.hasWave('aria-disabled-btn')).toBe(false);
    });

    test('should react to dynamic rippleDisabled changes', async () => {
      await testPage.click('dynamic-disabled-btn', 50, 50);
      expect(testPage.hasWave('dynamic-disabled-btn')).toBe(true);

      testPage.clearWaves('dynamic-disabled-btn');

      testComponent.dynamicRippleDisabled.set(true);
      await fixture.whenStable();

      await testPage.click('dynamic-disabled-btn', 50, 50);
      expect(testPage.hasWave('dynamic-disabled-btn')).toBe(false);
    });
  });

  describe('Configuration Inputs', () => {
    test('should apply custom rippleOpacity value to wave', async () => {
      await testPage.click('custom-opacity-btn', 50, 50);

      const wave = testPage.getWaves('custom-opacity-btn')[0];
      expect(wave.style.opacity).toBe('0.5');
    });

    test('should apply custom rippleDuration as number (ms)', async () => {
      await testPage.click('custom-duration-btn', 50, 50);

      const wave = testPage.getWaves('custom-duration-btn')[0];
      expect(wave.style.animationDuration).toBe('500ms');
    });

    test('should apply custom rippleDuration as string', async () => {
      await testPage.click('custom-duration-string-btn', 50, 50);

      const wave = testPage.getWaves('custom-duration-string-btn')[0];
      expect(wave.style.animationDuration).toBe('2s');
    });

    test('should apply custom rippleEasing function', async () => {
      await testPage.click('custom-easing-btn', 50, 50);

      const wave = testPage.getWaves('custom-easing-btn')[0];
      expect(wave.style.animationTimingFunction).toBe('ease-in-out');
    });

    test('should apply custom rippleColor', async () => {
      await testPage.click('custom-color-btn', 50, 50);

      const wave = testPage.getWaves('custom-color-btn')[0];
      expect(wave.style.background).toBe('red');
    });

    test('should not set background when rippleColor is null', async () => {
      await testPage.click('default-btn', 50, 50);

      const wave = testPage.getWaves('default-btn')[0];
      expect(wave.style.background).toBe('');
    });

    test('should react to dynamic configuration changes', async () => {
      testComponent.dynamicOpacity.set(0.8);
      testComponent.dynamicColor.set('blue');
      await fixture.whenStable();

      await testPage.click('dynamic-config-btn', 50, 50);

      const wave = testPage.getWaves('dynamic-config-btn')[0];
      expect(wave.style.opacity).toBe('0.8');
      expect(wave.style.background).toBe('blue');
    });
  });

  describe('Wave Element Properties', () => {
    test('should create wave with sm-ripple__wave class', async () => {
      await testPage.click('default-btn', 50, 50);

      const wave = testPage.getWaves('default-btn')[0];
      expect(wave.classList.contains('sm-ripple__wave')).toBe(true);
    });

    test('should set wave width and height to same value', async () => {
      await testPage.click('default-btn', 50, 50);

      const wave = testPage.getWaves('default-btn')[0];
      expect(wave.style.width).toBe(wave.style.height);
      expect(wave.style.width).not.toBe('');
    });

    test('should set animation properties correctly', async () => {
      await testPage.click('default-btn', 50, 50);

      const wave = testPage.getWaves('default-btn')[0];
      expect(wave.style.animationDuration).toBe('1000ms');
      expect(wave.style.animationTimingFunction).toBe('cubic-bezier(0, 0, 0.2, 1)');
      expect(wave.style.animationFillMode).toBe('forwards');
      expect(wave.style.animationName).toBe('sm-ripple-wave');
    });

    test('should not append wave element to host (so that it does not interfere with host overflow layout)', async () => {
      const element = testPage.getElement('default-btn')!;
      const childrenBefore = element.children.length;

      await testPage.click('default-btn', 50, 50);

      expect(element.children.length).toBe(childrenBefore);
      expect(testPage.getWaves('default-btn').length).toBe(1);
    });

    test('should support multiple waves in same host', async () => {
      await testPage.click('default-btn', 30, 30);
      expect(testPage.getWaves('default-btn').length).toBe(1);

      await testPage.click('default-btn', 70, 70);
      expect(testPage.getWaves('default-btn').length).toBe(2);
    });
  });

  describe('Animation Lifecycle', () => {
    test('should remove wave element after animation completes', async () => {
      await testPage.click('default-btn', 50, 50);
      expect(testPage.hasWave('default-btn')).toBe(true);

      const wave = testPage.getWaves('default-btn')[0];
      wave.dispatchEvent(new Event('animationend'));

      expect(testPage.hasWave('default-btn')).toBe(false);
    });

    test('should clean up multiple waves independently', async () => {
      await testPage.click('default-btn', 30, 30);
      await testPage.click('default-btn', 70, 70);
      expect(testPage.getWaves('default-btn').length).toBe(2);

      const waves = testPage.getWaves('default-btn');
      waves[0].dispatchEvent(new Event('animationend'));
      expect(testPage.getWaves('default-btn').length).toBe(1);

      testPage.getWaves('default-btn')[0].dispatchEvent(new Event('animationend'));
      expect(testPage.getWaves('default-btn').length).toBe(0);
    });

    test('should only remove wave once when animationend fires', async () => {
      await testPage.click('default-btn', 50, 50);
      const wave = testPage.getWaves('default-btn')[0];

      wave.dispatchEvent(new Event('animationend'));
      expect(testPage.hasWave('default-btn')).toBe(false);

      expect(() => {
        wave.dispatchEvent(new Event('animationend'));
      }).not.toThrow();
    });
  });

  describe('Edge Cases', () => {
    test('should handle zero width/height elements gracefully', async () => {
      await testPage.click('zero-size-btn', 0, 0);

      const origin = testPage.getComputedOrigin('zero-size-btn');
      expect(origin.x).toBeGreaterThanOrEqual(0);
      expect(origin.x).toBeLessThanOrEqual(1);
      expect(origin.y).toBeGreaterThanOrEqual(0);
      expect(origin.y).toBeLessThanOrEqual(1);
    });

    test('should clamp pointer coordinates outside bounds to [0, 1]', async () => {
      const element = testPage.getElement('default-btn')!;
      const rect = element.getBoundingClientRect();

      const clientX = rect.left - 50;
      const clientY = rect.top - 50;

      await testPage.click('default-btn', clientX, clientY);

      const origin = testPage.getComputedOrigin('default-btn');
      expect(origin.x).toBeGreaterThanOrEqual(0);
      expect(origin.x).toBeLessThanOrEqual(1);
      expect(origin.y).toBeGreaterThanOrEqual(0);
      expect(origin.y).toBeLessThanOrEqual(1);
    });

    test('should clamp pointer coordinates beyond bounds to [0, 1]', async () => {
      const element = testPage.getElement('default-btn')!;
      const rect = element.getBoundingClientRect();

      const clientX = rect.right + 50;
      const clientY = rect.bottom + 50;

      await testPage.click('default-btn', clientX, clientY);

      const origin = testPage.getComputedOrigin('default-btn');
      expect(origin.x).toBeGreaterThanOrEqual(0);
      expect(origin.x).toBeLessThanOrEqual(1);
      expect(origin.y).toBeGreaterThanOrEqual(0);
      expect(origin.y).toBeLessThanOrEqual(1);
    });

    test('should create centered ripple when clientX/clientY are undefined', async () => {
      await testPage.keydown('default-btn', 'Enter', false);

      const origin = testPage.getComputedOrigin('default-btn');
      expect(origin.x).toBe(0.5);
      expect(origin.y).toBe(0.5);
    });
  });
});

@Component({
  selector: 'ripple-test-component',
  imports: [SimplyMatRippleDirective],
  template: `
    <!-- Default ripple button -->
    <button
      data-testid="default-btn"
      simply-mat-ripple>
      Default
    </button>

    <!-- Ripple disabled via input -->
    <button
      data-testid="ripple-disabled-btn"
      simply-mat-ripple
      [rippleDisabled]="true">
      Ripple Disabled
    </button>

    <!-- Disabled via attribute -->
    <button
      data-testid="disabled-attr-btn"
      simply-mat-ripple
      disabled>
      Disabled Attr
    </button>

    <!-- Disabled via property -->
    <button
      data-testid="disabled-prop-btn"
      simply-mat-ripple
      [disabled]="true">
      Disabled Prop
    </button>

    <!-- Disabled via aria-disabled -->
    <button
      data-testid="aria-disabled-btn"
      simply-mat-ripple
      aria-disabled="true">
      Aria Disabled
    </button>

    <!-- Custom opacity -->
    <button
      data-testid="custom-opacity-btn"
      simply-mat-ripple
      [rippleOpacity]="0.5">
      Custom Opacity
    </button>

    <!-- Custom duration (number) -->
    <button
      data-testid="custom-duration-btn"
      simply-mat-ripple
      [rippleDuration]="500">
      Custom Duration
    </button>

    <!-- Custom duration (string) -->
    <button
      data-testid="custom-duration-string-btn"
      simply-mat-ripple
      [rippleDuration]="'2s'">
      Custom Duration String
    </button>

    <!-- Custom easing -->
    <button
      data-testid="custom-easing-btn"
      simply-mat-ripple
      [rippleEasing]="'ease-in-out'">
      Custom Easing
    </button>

    <!-- Custom color -->
    <button
      data-testid="custom-color-btn"
      simply-mat-ripple
      [rippleColor]="'red'">
      Custom Color
    </button>

    <!-- Dynamic rippleDisabled -->
    <button
      data-testid="dynamic-disabled-btn"
      simply-mat-ripple
      [rippleDisabled]="dynamicRippleDisabled()">
      Dynamic Disabled
    </button>

    <!-- Dynamic configuration -->
    <button
      data-testid="dynamic-config-btn"
      simply-mat-ripple
      [rippleOpacity]="dynamicOpacity()"
      [rippleColor]="dynamicColor()">
      Dynamic Config
    </button>

    <!-- Zero size button (for edge case testing) -->
    <button
      data-testid="zero-size-btn"
      simply-mat-ripple
      style="width: 1px; height: 1px; padding: 0; min-width: 0;">
      Zero
    </button>

    <!-- Button for preventDefault testing -->
    <button
      data-testid="prevent-default-btn"
      simply-mat-ripple>
      Prevent Default
    </button>
  `,
})
export class RippleTestComponent {
  dynamicRippleDisabled = signal(false);
  dynamicOpacity = signal(0.25);
  dynamicColor = signal<string | null>(null);
}

export class RipplePage {
  constructor(protected fixture: ComponentFixture<any>) {}

  getElement(testId: string): HTMLElement | null {
    return page.getByTestId(testId).query() as HTMLElement | null;
  }

  async click(testId: string, clientX: number, clientY: number, button: number = 0): Promise<void> {
    const element = this.getElement(testId);
    if (!element) throw new Error(`Element with testId ${testId} not found`);

    const event = new PointerEvent('pointerdown', {
      clientX,
      clientY,
      button,
      bubbles: true,
      cancelable: true,
    });

    element.dispatchEvent(event);
    await this.fixture.whenStable();
  }

  async keydown(testId: string, key: string, repeat: boolean): Promise<void> {
    const element = this.getElement(testId);
    if (!element) throw new Error(`Element with testId ${testId} not found`);

    const event = new KeyboardEvent('keydown', {
      key,
      repeat,
      bubbles: true,
      cancelable: true,
    });

    element.dispatchEvent(event);
    await this.fixture.whenStable();
  }

  getWaves(testId: string): HTMLElement[] {
    const element = this.getElement(testId);
    if (!element) return [];
    return Array.from(element.querySelectorAll('.sm-ripple__wave')) as HTMLElement[];
  }

  hasWave(testId: string): boolean {
    return this.getWaves(testId).length > 0;
  }

  getComputedOrigin(testId: string): { x: number; y: number } {
    const element = this.getElement(testId);
    if (!element) return { x: 0, y: 0 };

    const originX = element.style.getPropertyValue('--sm-ripple-origin-x');
    const originY = element.style.getPropertyValue('--sm-ripple-origin-y');

    return {
      x: parseFloat(originX) || 0,
      y: parseFloat(originY) || 0,
    };
  }

  clearWaves(testId: string): void {
    const waves = this.getWaves(testId);
    waves.forEach(wave => wave.remove());
  }
}

