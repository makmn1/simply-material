import { Injectable } from '@angular/core';
import {animate, AnimationPlaybackControlsWithThen} from 'motion';

export interface SpringAnimateOptions {
  /** Required spring damping (dimensionless ζ). */
  damping: number;
  /** Required spring stiffness (k). */
  stiffness: number;
  /** Optional mass (m). Defaults to 1 internally. */
  mass?: number;
  /** Optional "go back" target after reaching `to`. (Not used yet) */
  back?: string;
}

function assertFiniteNumber(name: string, value: unknown): asserts value is number {
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    throw new Error(`springAnimate: ${name} must be a finite number`);
  }
}

/**
 * Spring animate a CSS property from -> to.
 * Assumes string CSS values (e.g., '20px', 'scale(0.95)', '0.5').
 */
@Injectable({ providedIn: 'root' })
export class SpringAnimate {
  animate(
    element: HTMLElement,
    property: string,
    from: string,
    to: string,
    opts: SpringAnimateOptions,
  ): AnimationPlaybackControlsWithThen {
    assertFiniteNumber('stiffness', opts.stiffness);
    assertFiniteNumber('damping', opts.damping);

    const mass = 1;
    const damping = 2 * opts.damping * Math.sqrt(opts.stiffness * mass);

    return animate(
      element,
      { [property]: [from, to] },
      { type: 'spring', stiffness: opts.stiffness, damping, mass },
    );
  }
}
