import {inject, Injectable } from '@angular/core';
import {MinimalCircularBorderRadius} from './minimal-circular-border-radius';
import {SpringAnimate} from '../utils/spring-animate'

@Injectable({
  providedIn: 'root',
})
export class ShapeMorph {
  private springAnimateService: SpringAnimate = inject(SpringAnimate)
  private minimalService: MinimalCircularBorderRadius = inject(MinimalCircularBorderRadius);

  private getSpringOptions(
    element: HTMLElement,
    dampingStyleVar: string,
    stiffnessStyleVar: string,
  ) {
    // Optional overrides set by button groups
    const overrideDamping = this.readVar(element, '--sm-button-group-pressed-spring-damping');
    const overrideStiffness = this.readVar(element, '--sm-button-group-pressed-spring-stiffness');

    const dampingSource = overrideDamping !== '' ? overrideDamping : this.readVar(element, dampingStyleVar);
    const stiffnessSource = overrideStiffness !== '' ? overrideStiffness : this.readVar(element, stiffnessStyleVar);

    const damping = Number(dampingSource);
    const stiffness = Number(stiffnessSource);

    return { damping, stiffness };
  }

  public animateBorderRadius(element: HTMLElement, from: string, to: string, dampingStyleVar: string, stiffnessStyleVar: string) {
    let fromValue = from;
    let toValue = to;

    if (fromValue === this.minimalService.CIRCULAR_BORDER_RADIUS_VALUE) {
      fromValue = this.minimalService.getMinimalCircularBorderRadius(element);
    }
    if (toValue === this.minimalService.CIRCULAR_BORDER_RADIUS_VALUE) {
      toValue = this.minimalService.getMinimalCircularBorderRadius(element);
    }

    const { damping, stiffness } = this.getSpringOptions(
      element,
      dampingStyleVar,
      stiffnessStyleVar,
    );

    return this.springAnimateService.animate(
      element,
      'borderRadius',
      fromValue,
      toValue,
      { damping, stiffness },
    );
  }

  public animateWidth(
    element: HTMLElement,
    from: string,
    to: string,
    dampingStyleVar: string,
    stiffnessStyleVar: string,
  ) {
    const { damping, stiffness } = this.getSpringOptions(
      element,
      dampingStyleVar,
      stiffnessStyleVar,
    );

    return this.springAnimateService.animate(
      element,
      'width',
      from,
      to,
      { damping, stiffness },
    );
  }

  public readVar(element: HTMLElement, name: string): string {
    return getComputedStyle(element).getPropertyValue(name).trim();
  }
}
