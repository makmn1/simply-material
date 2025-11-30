import { Injectable } from '@angular/core';
import { animate, AnimationPlaybackControlsWithThen } from 'motion';

export interface SpringAnimateOptions {
  /** Required spring damping (dimensionless ζ). */
  damping: number;
  /** Required spring stiffness (k). */
  stiffness: number;
  /** Optional mass (m). Defaults to 1 internally. */
  mass?: number;
}

export interface SpringAnimateProperty {
  property: string;
  from: string;
  to: string;
}

function assertFiniteNumber(name: string, value: unknown): asserts value is number {
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    throw new Error(`springAnimate: ${name} must be a finite number`);
  }
}

/**
 * Spring animate one or more CSS properties from -> to.
 *
 * Each property is provided as a { property, from, to } triple.
 * All properties are animated in a single Motion `animate` call
 * so they stay perfectly in sync and share the same spring physics.
 *
 * Note that by the end of the animation, the element will have the property with the `to` value set as an in-line style.
 */
@Injectable({ providedIn: 'root' })
export class SpringAnimate {
  animate(
    element: HTMLElement,
    properties: SpringAnimateProperty[],
    opts: SpringAnimateOptions,
  ): AnimationPlaybackControlsWithThen {
    assertFiniteNumber('stiffness', opts.stiffness);
    assertFiniteNumber('damping', opts.damping);

    const mass = opts.mass ?? 1;
    const damping = 2 * opts.damping * Math.sqrt(opts.stiffness * mass);

    const keyframes: Record<string, string[]> = {};
    for (const { property, from, to } of properties) {
      keyframes[property] = [from, to];
      // console.log(property, from, to);
    }

    return animate(
      element,
      keyframes,
      {
        type: 'spring',
        stiffness: opts.stiffness,
        damping,
        mass,
      },
    );
  }
}
