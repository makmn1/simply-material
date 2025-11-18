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
  rippleDuration = input<number | string>(550);
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

    const x = useCenter ? rect.width  / 2 : (clientX - rect.left);
    const y = useCenter ? rect.height / 2 : (clientY - rect.top);

    // Circle large enough to cover host from origin to farthest corner
    const dx = Math.max(x, rect.width  - x);
    const dy = Math.max(y, rect.height - y);
    const radius = Math.hypot(dx, dy);
    const size = radius * 2;

    const wave = document.createElement('span');
    wave.className = 'sm-ripple__wave';

    // Position & size
    wave.style.width = `${size}px`;
    wave.style.height = `${size}px`;
    wave.style.left = `${x - size / 2}px`;
    wave.style.top  = `${y - size / 2}px`;

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
