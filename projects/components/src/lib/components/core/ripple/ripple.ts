import {
  Directive,
  ElementRef,
  inject,
  input,
  booleanAttribute,
} from '@angular/core';

@Directive({
  selector: '[simply-mat-ripple]',
  host: {
    'class': 'simply-mat-ripple',
    '(pointerdown)': 'onPointerDown($event)',
    '(keydown)': 'onKeyDown($event)',
  }
})
export class SimplyMatRippleDirective {
  #hostEl = inject(ElementRef<HTMLElement>).nativeElement;
  #surfaceEl: HTMLSpanElement;

  rippleDisabled = input(false, { transform: booleanAttribute });

  rippleOpacity  = input<number>(0.25);
  rippleDuration = input<number | string>(1000);
  rippleEasing   = input<string>('cubic-bezier(0,0,0.2,1)');
  rippleColor    = input<string | null>(null);

  constructor() {
    const host = this.#hostEl;

    // Ensure the host can position the surface
    const style = getComputedStyle(host);
    if (style.position === 'static') {
      host.style.position = 'relative';
    }

    // Create the clipping surface
    const surface = document.createElement('span');
    surface.className = 'simply-mat-ripple__surface';

    // Put it as the first child so it sits under content
    host.insertBefore(surface, host.firstChild);
    this.#surfaceEl = surface;
  }

  onPointerDown(event: PointerEvent) {
    if (!this.#canActivate(event) || event.button !== 0) return;
    this.#createRipple(event.clientX, event.clientY);
  }

  onKeyDown(event: KeyboardEvent) {
    if (!this.#canActivate(event)) return;
    const key = event.key;
    const isSpace = key === ' ' || key === 'Spacebar';
    const isEnter = key === 'Enter';
    if (!isEnter && !isSpace) return;
    if (isSpace && event.repeat) return;
    this.#createRipple(); // center
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

    let fx: number, fy: number, x: number, y: number;

    if (useCenter) {
      x = rect.width / 2;
      y = rect.height / 2;
      fx = 0.5;
      fy = 0.5;
    } else {
      x = clientX! - rect.left;
      y = clientY! - rect.top;
      const w = rect.width || 1;
      const h = rect.height || 1;
      fx = Math.min(Math.max(x / w, 0), 1);
      fy = Math.min(Math.max(y / h, 0), 1);
    }

    const dx = Math.max(x, rect.width  - x);
    const dy = Math.max(y, rect.height - y);
    const radius = Math.hypot(dx, dy);
    const size = radius * 2;

    const wave = document.createElement('span');
    wave.className = 'sm-ripple__wave';

    wave.style.width = `${size}px`;
    wave.style.height = `${size}px`;

    host.style.setProperty('--sm-ripple-origin-x', fx.toString());
    host.style.setProperty('--sm-ripple-origin-y', fy.toString());

    wave.style.opacity = String(this.rippleOpacity());
    const color = this.rippleColor();
    if (color) wave.style.background = color;

    const dur = this.rippleDuration();
    wave.style.animationDuration = typeof dur === 'number' ? `${dur}ms` : dur;
    wave.style.animationTimingFunction = this.rippleEasing();
    wave.style.animationFillMode = 'forwards';
    wave.style.animationName = 'sm-ripple-wave';

    // append to surface, not host
    this.#surfaceEl.appendChild(wave);
    wave.addEventListener('animationend', () => wave.remove(), { once: true });
  }

  #hostIsDisabled(): boolean {
    const el = this.#hostEl as HTMLElement & { disabled?: boolean };
    if (typeof el.disabled === 'boolean' && el.disabled) return true;
    if (el.getAttribute('aria-disabled') === 'true') return true;
    return el.hasAttribute('disabled');
  }
}
