import { Directive, ElementRef, inject, input, booleanAttribute } from '@angular/core';

@Directive({
  selector: '[sm-ripple]',
  host: {
    'class': 'sm-ripple',
    '(pointerdown)': 'onPointerDown($event)',
    '(keydown)': 'onKeyDown($event)',
  }
})
export class SmRippleDirective {
  #hostEl = inject(ElementRef<HTMLElement>).nativeElement;

  rippleDisabled = input(false, { transform: booleanAttribute });

  rippleOpacity  = input<number>(0.25);
  rippleDuration = input<number | string>(1000);
  rippleEasing   = input<string>('cubic-bezier(0,0,0.2,1)');
  rippleColor    = input<string | null>(null);

  onPointerDown(event: PointerEvent) {
    // Only primary button, respect preventDefault
    if (!this.#canActivate(event) || event.button !== 0) return;

    this.#createRipple(event.clientX, event.clientY);
  }

  onKeyDown(event: KeyboardEvent) {
    if (!this.#canActivate(event)) return;

    const key = event.key;
    const isSpace = key === ' ' || key === 'Spacebar';
    const isEnter = key === 'Enter';

    if (!isEnter && !isSpace) return;

    // For Space: only ripple on the *first* keydown (no repeats while held)
    if (isSpace && event.repeat) {
      return;
    }

    // Keyboard: always center
    this.#createRipple();
  }

  #canActivate(event: Event): boolean {
    if (this.rippleDisabled() || this.#hostIsDisabled()) return false;
    if (event.defaultPrevented) return false;
    return true;
  }

  #createRipple(clientX?: number, clientY?: number) {
    const host = this.#hostEl;
    const rect = host.getBoundingClientRect();

    const useCenter = clientX == null || clientY == null;

    let fx: number;
    let fy: number;
    let x: number;
    let y: number;

    if (useCenter) {
      // Keyboard / forced center
      fx = 0.5;
      fy = 0.5;
      x = rect.width / 2;
      y = rect.height / 2;
    } else {
      // Pointer-based origin, in local coordinates
      x = clientX - rect.left;
      y = clientY - rect.top;

      // Guard against zero width/height
      const w = rect.width || 1;
      const h = rect.height || 1;

      fx = x / w;
      fy = y / h;

      // Clamp to [0, 1] just in case
      fx = Math.min(Math.max(fx, 0), 1);
      fy = Math.min(Math.max(fy, 0), 1);
    }

    // Circle large enough to cover the host from origin to the farthest corner
    const dx = Math.max(x, rect.width  - x);
    const dy = Math.max(y, rect.height - y);
    const radius = Math.hypot(dx, dy);
    const size = radius * 2;

    const wave = document.createElement('span');
    wave.className = 'sm-ripple__wave';

    // Size of the wave
    wave.style.width = `${size}px`;
    wave.style.height = `${size}px`;

    // Store origin as fractions so CSS can place via percentages.
    // This keeps the visual origin correct even if the host width animates like a button in a standard button group
    host.style.setProperty('--sm-ripple-origin-x', fx.toString());
    host.style.setProperty('--sm-ripple-origin-y', fy.toString());

    // Visuals
    wave.style.opacity = String(this.rippleOpacity());
    const color = this.rippleColor();
    if (color) wave.style.background = color;

    // Timing
    const dur = this.rippleDuration();
    wave.style.animationDuration = typeof dur === 'number' ? `${dur}ms` : dur;
    wave.style.animationTimingFunction = this.rippleEasing();
    wave.style.animationFillMode = 'forwards';
    wave.style.animationName = 'sm-ripple-wave';

    host.appendChild(wave);
    wave.addEventListener('animationend', () => wave.remove(), { once: true });
  }

  #hostIsDisabled(): boolean {
    const el = this.#hostEl as HTMLElement & { disabled?: boolean };
    if (typeof el.disabled === 'boolean' && el.disabled) return true;
    if (el.getAttribute('aria-disabled') === 'true') return true;
    return el.hasAttribute('disabled');
  }
}
