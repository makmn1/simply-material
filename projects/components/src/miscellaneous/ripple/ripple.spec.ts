import {Component} from '@angular/core';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {By} from '@angular/platform-browser';
import {provideZonelessChangeDetection} from '@angular/core';
import {describe, it, expect, beforeEach, afterEach, vi} from 'vitest';
import {SmRippleDirective} from './ripple';
import {stubRect} from '../../testing/test-helpers';

@Component({
  template: `
    <button id="basic" sm-ripple>Basic button</button>
    <button
      id="custom-props"
      sm-ripple
      [rippleOpacity]="0.5"
      [rippleDuration]="300"
      rippleEasing="ease-in-out"
      rippleColor="rgba(255,0,0,0.5)"
    >
      Custom properties
    </button>
    <button id="disabled-native" sm-ripple [disabled]="true">Disabled button</button>
    <div id="aria-disabled" sm-ripple aria-disabled="true">Aria disabled</div>
    <div id="disabled-attr" sm-ripple disabled>Disabled attribute</div>
    <button id="ripple-disabled" sm-ripple [rippleDisabled]="true">Ripple disabled</button>
    <a id="anchor" sm-ripple href="#">Anchor link</a>
    <div id="no-directive">No directive</div>
    <button id="string-duration" sm-ripple rippleDuration="1s">String duration</button>
  `,
  imports: [SmRippleDirective],
  standalone: true,
})
class RippleTestComponent {}

describe('SmRippleDirective', () => {
  let fixture: ComponentFixture<RippleTestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RippleTestComponent],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();

    fixture = TestBed.createComponent(RippleTestComponent);
    fixture.detectChanges();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Basic Directive Functionality', () => {
    it('should apply sm-ripple class to host element', () => {
      const button = fixture.debugElement.query(By.css('#basic'));
      expect(button.nativeElement.classList.contains('sm-ripple')).toBe(true);
    });

    it('should create ripple wave element on click', () => {
      const button = fixture.debugElement.query(By.css('#basic'));
      const hostEl = button.nativeElement as HTMLElement;

      stubRect(hostEl, 100, 50);
      hostEl.click();

      const wave = hostEl.querySelector('.sm-ripple__wave');
      expect(wave).toBeTruthy();
      expect(wave?.className).toBe('sm-ripple__wave');
    });

    it('should append wave element to host', () => {
      const button = fixture.debugElement.query(By.css('#basic'));
      const hostEl = button.nativeElement as HTMLElement;

      stubRect(hostEl, 100, 50);
      hostEl.click();

      const wave = hostEl.querySelector('.sm-ripple__wave');
      expect(wave).toBeTruthy();
      expect(hostEl.contains(wave)).toBe(true);
    });

    it('should set correct initial styles on wave', () => {
      const button = fixture.debugElement.query(By.css('#basic'));
      const hostEl = button.nativeElement as HTMLElement;

      stubRect(hostEl, 100, 50);
      hostEl.click();

      const wave = hostEl.querySelector('.sm-ripple__wave') as HTMLElement;
      expect(wave).toBeTruthy();
      // Position is set by CSS, not directive - check directive-set styles
      expect(wave.style.animationName).toBe('sm-ripple-wave');
      expect(wave.style.animationFillMode).toBe('forwards');
      expect(wave.style.width).toBeTruthy();
      expect(wave.style.height).toBeTruthy();
    });

    it('should remove wave after animationend event', () => {
      const button = fixture.debugElement.query(By.css('#basic'));
      const hostEl = button.nativeElement as HTMLElement;

      stubRect(hostEl, 100, 50);
      hostEl.click();

      const wave = hostEl.querySelector('.sm-ripple__wave') as HTMLElement;
      expect(wave).toBeTruthy();

      // Simulate animationend event (using Event since AnimationEvent may not be available in test env)
      const animationEndEvent = new Event('animationend', {bubbles: true});
      wave.dispatchEvent(animationEndEvent);

      expect(hostEl.querySelector('.sm-ripple__wave')).toBeNull();
    });
  });

  describe('Input Properties', () => {
    it('should apply custom rippleOpacity', () => {
      const button = fixture.debugElement.query(By.css('#custom-props'));
      const hostEl = button.nativeElement as HTMLElement;

      stubRect(hostEl, 100, 50);
      hostEl.click();

      const wave = hostEl.querySelector('.sm-ripple__wave') as HTMLElement;
      expect(wave.style.opacity).toBe('0.5');
    });

    it('should use default opacity when not provided', () => {
      const button = fixture.debugElement.query(By.css('#basic'));
      const hostEl = button.nativeElement as HTMLElement;

      stubRect(hostEl, 100, 50);
      hostEl.click();

      const wave = hostEl.querySelector('.sm-ripple__wave') as HTMLElement;
      expect(wave.style.opacity).toBe('0.25');
    });

    it('should convert numeric rippleDuration to ms', () => {
      const button = fixture.debugElement.query(By.css('#custom-props'));
      const hostEl = button.nativeElement as HTMLElement;

      stubRect(hostEl, 100, 50);
      hostEl.click();

      const wave = hostEl.querySelector('.sm-ripple__wave') as HTMLElement;
      expect(wave.style.animationDuration).toBe('300ms');
    });

    it('should use string rippleDuration as-is', () => {
      const button = fixture.debugElement.query(By.css('#string-duration'));
      const hostEl = button.nativeElement as HTMLElement;

      stubRect(hostEl, 100, 50);
      hostEl.click();

      const wave = hostEl.querySelector('.sm-ripple__wave') as HTMLElement;
      expect(wave.style.animationDuration).toBe('1s');
    });

    it('should use default duration when not provided', () => {
      const button = fixture.debugElement.query(By.css('#basic'));
      const hostEl = button.nativeElement as HTMLElement;

      stubRect(hostEl, 100, 50);
      hostEl.click();

      const wave = hostEl.querySelector('.sm-ripple__wave') as HTMLElement;
      expect(wave.style.animationDuration).toBe('550ms');
    });

    it('should apply custom rippleEasing', () => {
      const button = fixture.debugElement.query(By.css('#custom-props'));
      const hostEl = button.nativeElement as HTMLElement;

      stubRect(hostEl, 100, 50);
      hostEl.click();

      const wave = hostEl.querySelector('.sm-ripple__wave') as HTMLElement;
      expect(wave.style.animationTimingFunction).toBe('ease-in-out');
    });

    it('should use default easing when not provided', () => {
      const button = fixture.debugElement.query(By.css('#basic'));
      const hostEl = button.nativeElement as HTMLElement;

      stubRect(hostEl, 100, 50);
      hostEl.click();

      const wave = hostEl.querySelector('.sm-ripple__wave') as HTMLElement;
      expect(wave.style.animationTimingFunction).toBe('cubic-bezier(0,0,0.2,1)');
    });

    it('should apply custom rippleColor when provided', () => {
      const button = fixture.debugElement.query(By.css('#custom-props'));
      const hostEl = button.nativeElement as HTMLElement;

      stubRect(hostEl, 100, 50);
      hostEl.click();

      const wave = hostEl.querySelector('.sm-ripple__wave') as HTMLElement;
      // Browser may normalize rgba values with spaces, so check that it contains the color
      expect(wave.style.background).toContain('255');
      expect(wave.style.background).toContain('0');
      expect(wave.style.background).toContain('0.5');
    });

    it('should not set background when rippleColor is null', () => {
      const button = fixture.debugElement.query(By.css('#basic'));
      const hostEl = button.nativeElement as HTMLElement;

      stubRect(hostEl, 100, 50);
      hostEl.click();

      const wave = hostEl.querySelector('.sm-ripple__wave') as HTMLElement;
      // When rippleColor is null, background should not be set (uses CSS default: currentColor)
      expect(wave.style.background).toBe('');
    });
  });

  describe('Ripple Calculation', () => {
    it('should calculate ripple size correctly from click position', () => {
      const button = fixture.debugElement.query(By.css('#basic'));
      const hostEl = button.nativeElement as HTMLElement;

      stubRect(hostEl, 100, 50);
      // Click at center (50, 25) with detail > 0 (mouse click)
      const clickEvent = new MouseEvent('click', {
        clientX: 50,
        clientY: 25,
        detail: 1, // Mouse click has detail > 0
      });
      hostEl.dispatchEvent(clickEvent);

      const wave = hostEl.querySelector('.sm-ripple__wave') as HTMLElement;
      // From center: dx = max(50, 50) = 50, dy = max(25, 25) = 25
      // radius = hypot(50, 25) ≈ 55.9, size = 111.8
      const expectedSize = Math.hypot(50, 25) * 2;
      expect(parseFloat(wave.style.width)).toBeCloseTo(expectedSize, 1);
      expect(parseFloat(wave.style.height)).toBeCloseTo(expectedSize, 1);
    });

    it('should position ripple correctly relative to click coordinates', () => {
      const button = fixture.debugElement.query(By.css('#basic'));
      const hostEl = button.nativeElement as HTMLElement;

      stubRect(hostEl, 100, 50);
      // Click at (30, 20) with detail > 0 (mouse click)
      const clickEvent = new MouseEvent('click', {
        clientX: 30,
        clientY: 20,
        detail: 1, // Mouse click
      });
      hostEl.dispatchEvent(clickEvent);

      const wave = hostEl.querySelector('.sm-ripple__wave') as HTMLElement;
      const size = parseFloat(wave.style.width);
      const expectedLeft = 30 - size / 2;
      const expectedTop = 20 - size / 2;

      expect(parseFloat(wave.style.left)).toBeCloseTo(expectedLeft, 1);
      expect(parseFloat(wave.style.top)).toBeCloseTo(expectedTop, 1);
    });

    it('should cover entire element from click point to farthest corner', () => {
      const button = fixture.debugElement.query(By.css('#basic'));
      const hostEl = button.nativeElement as HTMLElement;

      stubRect(hostEl, 100, 50);
      // Click at top-left corner (0, 0) with detail > 0 (mouse click)
      const clickEvent = new MouseEvent('click', {
        clientX: 0,
        clientY: 0,
        detail: 1, // Mouse click
      });
      hostEl.dispatchEvent(clickEvent);

      const wave = hostEl.querySelector('.sm-ripple__wave') as HTMLElement;
      // From top-left: dx = max(0, 100) = 100, dy = max(0, 50) = 50
      // radius = hypot(100, 50) ≈ 111.8, size ≈ 223.6
      const expectedSize = Math.hypot(100, 50) * 2;
      expect(parseFloat(wave.style.width)).toBeCloseTo(expectedSize, 1);
    });

    it('should work with different element sizes', () => {
      const button = fixture.debugElement.query(By.css('#basic'));
      const hostEl = button.nativeElement as HTMLElement;

      stubRect(hostEl, 200, 100);
      const clickEvent = new MouseEvent('click', {
        clientX: 100,
        clientY: 50,
        detail: 1, // Mouse click
      });
      hostEl.dispatchEvent(clickEvent);

      const wave = hostEl.querySelector('.sm-ripple__wave') as HTMLElement;
      const expectedSize = Math.hypot(100, 50) * 2;
      expect(parseFloat(wave.style.width)).toBeCloseTo(expectedSize, 1);
    });

    it('should center ripple origin for keyboard-initiated clicks (detail === 0)', () => {
      const button = fixture.debugElement.query(By.css('#basic'));
      const hostEl = button.nativeElement as HTMLElement;

      stubRect(hostEl, 100, 50);
      // Keyboard-initiated click has detail === 0
      const clickEvent = new MouseEvent('click', {
        clientX: 30, // These coordinates should be ignored
        clientY: 20, // These coordinates should be ignored
        detail: 0, // Keyboard click
      });
      hostEl.dispatchEvent(clickEvent);

      const wave = hostEl.querySelector('.sm-ripple__wave') as HTMLElement;
      // Origin should be at center: x = 100/2 = 50, y = 50/2 = 25
      // From center: dx = max(50, 50) = 50, dy = max(25, 25) = 25
      const expectedSize = Math.hypot(50, 25) * 2;
      expect(parseFloat(wave.style.width)).toBeCloseTo(expectedSize, 1);

      // Position should be centered
      const expectedLeft = 50 - expectedSize / 2;
      const expectedTop = 25 - expectedSize / 2;
      expect(parseFloat(wave.style.left)).toBeCloseTo(expectedLeft, 1);
      expect(parseFloat(wave.style.top)).toBeCloseTo(expectedTop, 1);
    });

    it('should center ripple origin for programmatic clicks (detail === 0)', () => {
      const button = fixture.debugElement.query(By.css('#basic'));
      const hostEl = button.nativeElement as HTMLElement;

      stubRect(hostEl, 120, 80);
      // Programmatic click via element.click() has detail === 0
      const clickEvent = new MouseEvent('click', {
        detail: 0, // Programmatic click
      });
      hostEl.dispatchEvent(clickEvent);

      const wave = hostEl.querySelector('.sm-ripple__wave') as HTMLElement;
      // Origin should be at center: x = 120/2 = 60, y = 80/2 = 40
      // From center: dx = max(60, 60) = 60, dy = max(40, 40) = 40
      const expectedSize = Math.hypot(60, 40) * 2;
      expect(parseFloat(wave.style.width)).toBeCloseTo(expectedSize, 1);

      // Position should be centered
      const expectedLeft = 60 - expectedSize / 2;
      const expectedTop = 40 - expectedSize / 2;
      expect(parseFloat(wave.style.left)).toBeCloseTo(expectedLeft, 1);
      expect(parseFloat(wave.style.top)).toBeCloseTo(expectedTop, 1);
    });

    it('should use click coordinates for mouse clicks (detail > 0)', () => {
      const button = fixture.debugElement.query(By.css('#basic'));
      const hostEl = button.nativeElement as HTMLElement;

      stubRect(hostEl, 100, 50);
      // Mouse click at (30, 20) with detail > 0
      const clickEvent = new MouseEvent('click', {
        clientX: 30,
        clientY: 20,
        detail: 1, // Mouse click
      });
      hostEl.dispatchEvent(clickEvent);

      const wave = hostEl.querySelector('.sm-ripple__wave') as HTMLElement;
      // Should use actual click coordinates, not center
      const size = parseFloat(wave.style.width);
      const expectedLeft = 30 - size / 2;
      const expectedTop = 20 - size / 2;
      expect(parseFloat(wave.style.left)).toBeCloseTo(expectedLeft, 1);
      expect(parseFloat(wave.style.top)).toBeCloseTo(expectedTop, 1);
    });
  });

  describe('Disabled State Handling', () => {
    it('should not create ripple when rippleDisabled is true', () => {
      const button = fixture.debugElement.query(By.css('#ripple-disabled'));
      const hostEl = button.nativeElement as HTMLElement;

      stubRect(hostEl, 100, 50);
      hostEl.click();

      const wave = hostEl.querySelector('.sm-ripple__wave');
      expect(wave).toBeNull();
    });

    it('should not create ripple when host has native disabled property', () => {
      const button = fixture.debugElement.query(By.css('#disabled-native'));
      const hostEl = button.nativeElement as HTMLButtonElement;

      stubRect(hostEl, 100, 50);
      hostEl.click();

      const wave = hostEl.querySelector('.sm-ripple__wave');
      expect(wave).toBeNull();
    });

    it('should not create ripple when host has aria-disabled="true"', () => {
      const div = fixture.debugElement.query(By.css('#aria-disabled'));
      const hostEl = div.nativeElement as HTMLElement;

      stubRect(hostEl, 100, 50);
      hostEl.click();

      const wave = hostEl.querySelector('.sm-ripple__wave');
      expect(wave).toBeNull();
    });

    it('should not create ripple when host has disabled attribute', () => {
      const div = fixture.debugElement.query(By.css('#disabled-attr'));
      const hostEl = div.nativeElement as HTMLElement;

      stubRect(hostEl, 100, 50);
      hostEl.click();

      const wave = hostEl.querySelector('.sm-ripple__wave');
      expect(wave).toBeNull();
    });

    it('should create ripple when disabled states are false/absent', () => {
      const button = fixture.debugElement.query(By.css('#basic'));
      const hostEl = button.nativeElement as HTMLElement;

      stubRect(hostEl, 100, 50);
      hostEl.click();

      const wave = hostEl.querySelector('.sm-ripple__wave');
      expect(wave).toBeTruthy();
    });
  });

  describe('Event Handling', () => {
    it('should not create ripple when event.defaultPrevented is true', () => {
      const button = fixture.debugElement.query(By.css('#basic'));
      const hostEl = button.nativeElement as HTMLElement;

      stubRect(hostEl, 100, 50);
      const clickEvent = new MouseEvent('click', {
        clientX: 50,
        clientY: 25,
        cancelable: true,
      });
      clickEvent.preventDefault();
      hostEl.dispatchEvent(clickEvent);

      const wave = hostEl.querySelector('.sm-ripple__wave');
      expect(wave).toBeNull();
    });

    it('should handle click event properly', () => {
      const button = fixture.debugElement.query(By.css('#basic'));
      const hostEl = button.nativeElement as HTMLElement;

      stubRect(hostEl, 100, 50);
      hostEl.click();

      const wave = hostEl.querySelector('.sm-ripple__wave');
      expect(wave).toBeTruthy();
    });
  });

  describe('Multiple Ripples', () => {
    it('should create multiple wave elements on multiple clicks', () => {
      const button = fixture.debugElement.query(By.css('#basic'));
      const hostEl = button.nativeElement as HTMLElement;

      stubRect(hostEl, 100, 50);
      hostEl.click();
      hostEl.click();
      hostEl.click();

      const waves = hostEl.querySelectorAll('.sm-ripple__wave');
      expect(waves.length).toBe(3);
    });

    it('should remove each wave independently after animationend', () => {
      const button = fixture.debugElement.query(By.css('#basic'));
      const hostEl = button.nativeElement as HTMLElement;

      stubRect(hostEl, 100, 50);
      hostEl.click();
      hostEl.click();

      const waves = hostEl.querySelectorAll('.sm-ripple__wave');
      expect(waves.length).toBe(2);

      // Remove first wave (using Event since AnimationEvent may not be available in test env)
      const animationEndEvent1 = new Event('animationend', {bubbles: true});
      waves[0].dispatchEvent(animationEndEvent1);

      expect(hostEl.querySelectorAll('.sm-ripple__wave').length).toBe(1);

      // Remove second wave
      const remainingWave = hostEl.querySelector('.sm-ripple__wave');
      const animationEndEvent2 = new Event('animationend', {bubbles: true});
      remainingWave?.dispatchEvent(animationEndEvent2);

      expect(hostEl.querySelectorAll('.sm-ripple__wave').length).toBe(0);
    });
  });

  describe('Directive Querying', () => {
    it('should find all elements with directive using By.directive', () => {
      const elements = fixture.debugElement.queryAll(By.directive(SmRippleDirective));
      // Should find: basic, custom-props, disabled-native, aria-disabled, disabled-attr,
      // ripple-disabled, anchor, string-duration = 8 elements
      expect(elements.length).toBe(8);
    });

    it('should access directive instance via element injector', () => {
      const button = fixture.debugElement.query(By.css('#basic'));
      const directive = button.injector.get(SmRippleDirective);
      expect(directive).toBeTruthy();
      expect(directive).toBeInstanceOf(SmRippleDirective);
    });

    it('should access directive input properties via instance', () => {
      const button = fixture.debugElement.query(By.css('#basic'));
      const directive = button.injector.get(SmRippleDirective);
      expect(directive.rippleOpacity()).toBe(0.25);
      expect(directive.rippleDuration()).toBe(550);
      expect(directive.rippleEasing()).toBe('cubic-bezier(0,0,0.2,1)');
      expect(directive.rippleDisabled()).toBe(false);
    });

    it('should find elements without directive using :not([sm-ripple])', () => {
      const elements = fixture.debugElement.queryAll(By.css('*:not([sm-ripple])'));
      // Should find elements that don't have the directive
      const noDirectiveEl = fixture.debugElement.query(By.css('#no-directive'));
      expect(elements.some(el => el.nativeElement === noDirectiveEl.nativeElement)).toBe(true);
    });

    it('should work with different host element types', () => {
      const button = fixture.debugElement.query(By.css('#basic'));
      const anchor = fixture.debugElement.query(By.css('#anchor'));
      const div = fixture.debugElement.query(By.css('#aria-disabled'));

      expect(button.nativeElement.classList.contains('sm-ripple')).toBe(true);
      expect(anchor.nativeElement.classList.contains('sm-ripple')).toBe(true);
      expect(div.nativeElement.classList.contains('sm-ripple')).toBe(true);
    });
  });
});

