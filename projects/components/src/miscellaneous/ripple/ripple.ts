import { Directive, ElementRef, inject, input, booleanAttribute } from '@angular/core';

@Directive({
  selector: '[sm-ripple]',
  host: {
    'class': 'sm-ripple',
    '(click)': 'ripple($event)'
  }
})
export class SmRippleDirective {
  #hostEl = inject(ElementRef<HTMLElement>).nativeElement;

  // Allow attribute form: <button sm-ripple rippleDisabled>
  rippleDisabled = input(false, { transform: booleanAttribute });

  rippleOpacity  = input<number>(0.25);
  rippleDuration = input<number | string>(550);
  rippleEasing   = input<string>('cubic-bezier(0,0,0.2,1)');
  rippleColor    = input<string | null>(null);

  ripple(event: MouseEvent) {
    if (this.rippleDisabled() || this.#hostIsDisabled() || event.defaultPrevented) return;

    const host = this.#hostEl;
    const rect = host.getBoundingClientRect();

    // Keyboard-initiated clicks (or programmatic): detail === 0
    const isKeyboard = event.detail === 0;

    const x = isKeyboard ? rect.width  / 2 : (event.clientX - rect.left);
    const y = isKeyboard ? rect.height / 2 : (event.clientY - rect.top);

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
    if (this.rippleColor()) wave.style.background = this.rippleColor()!;

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
