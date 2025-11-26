import { inject, Injectable } from '@angular/core';
import type { AnimationPlaybackControlsWithThen } from 'motion';

import { BorderRadius } from './border-radius';
import { SpringAnimate, SpringAnimateProperty } from '../utils/spring-animate';

@Injectable({
  providedIn: 'root',
})
export class ShapeMorph {
  private springAnimateService: SpringAnimate = inject(SpringAnimate);
  private borderRadiusService: BorderRadius = inject(BorderRadius);

  private getSpringOptions(
    element: HTMLElement,
    dampingStyleVar: string,
    stiffnessStyleVar: string,
  ): { damping: number; stiffness: number } {
    // Optional overrides set by button groups
    const overrideDamping = this.readVar(
      element,
      '--sm-button-group-pressed-spring-damping',
    );
    const overrideStiffness = this.readVar(
      element,
      '--sm-button-group-pressed-spring-stiffness',
    );

    const dampingSource =
      overrideDamping !== '' ? overrideDamping : this.readVar(element, dampingStyleVar);
    const stiffnessSource =
      overrideStiffness !== '' ? overrideStiffness : this.readVar(element, stiffnessStyleVar);

    const damping = Number(dampingSource);
    const stiffness = Number(stiffnessSource);

    return { damping, stiffness };
  }

  /**
   * Animate border radius between two CSS values.
   *
   * - First, delegate circular-token replacement (9999rem) to BorderRadius so that
   *   both endpoints share a single minimal-radius computation.
   * - Then:
   *   - If both `from` and `to` (after replacement + trim) contain no whitespace,
   *     animate the shorthand `borderRadius` property.
   *   - Otherwise, normalize them to 4-value syntax and animate each physical
   *     corner (`borderTopLeftRadius`, `borderTopRightRadius`,
   *     `borderBottomRightRadius`, `borderBottomLeftRadius`) individually.
   */
  public animateBorderRadius(
    element: HTMLElement,
    from: string,
    to: string,
    dampingStyleVar: string,
    stiffnessStyleVar: string,
  ): AnimationPlaybackControlsWithThen {
    const fromValueRem = this.borderRadiusService.convertToRem(from);
    const toValueRem = this.borderRadiusService.convertToRem(to);

    const { from: fromValue, to: toValue } =
      this.borderRadiusService.convertCircularBorderRadiusPair(element, fromValueRem, toValueRem);

    const { damping, stiffness } = this.getSpringOptions(
      element,
      dampingStyleVar,
      stiffnessStyleVar,
    );

    const fromTrimmed = fromValue.trim();
    const toTrimmed = toValue.trim();

    // Multi-value case: normalize to 4 corners and animate each corner individually
    const fromNorm = this.borderRadiusService.normalizeBorderRadius(fromTrimmed);
    const toNorm = this.borderRadiusService.normalizeBorderRadius(toTrimmed);

    const fromParts = fromNorm.split(/\s+/);
    const toParts = toNorm.split(/\s+/);

    const properties: SpringAnimateProperty[] = [
      {
        property: 'borderTopLeftRadius',
        from: fromParts[0],
        to: toParts[0],
      },
      {
        property: 'borderTopRightRadius',
        from: fromParts[1],
        to: toParts[1],
      },
      {
        property: 'borderBottomRightRadius',
        from: fromParts[2],
        to: toParts[2],
      },
      {
        property: 'borderBottomLeftRadius',
        from: fromParts[3],
        to: toParts[3],
      }
    ];

    return this.springAnimateService.animate(element, properties, { damping, stiffness });
  }

  public animateWidth(
    element: HTMLElement,
    from: string,
    to: string,
    dampingStyleVar: string,
    stiffnessStyleVar: string,
  ): AnimationPlaybackControlsWithThen {
    const { damping, stiffness } = this.getSpringOptions(
      element,
      dampingStyleVar,
      stiffnessStyleVar,
    );

    const props: SpringAnimateProperty[] = [
      {
        property: 'width',
        from,
        to,
      }
    ];

    return this.springAnimateService.animate(element, props, { damping, stiffness });
  }

  public readVar(element: HTMLElement, name: string): string {
    return getComputedStyle(element).getPropertyValue(name).trim();
  }
}
