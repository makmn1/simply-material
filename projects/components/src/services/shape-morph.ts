import {inject, Injectable } from '@angular/core';
import {MinimalCircularBorderRadius} from './minimal-circular-border-radius';
import {SpringAnimate} from '../utils/spring-animate'

@Injectable({
  providedIn: 'root',
})
export class ShapeMorph {
  private springAnimateService: SpringAnimate = inject(SpringAnimate)
  private minimalService: MinimalCircularBorderRadius = inject(MinimalCircularBorderRadius);

  public animateBorderRadius(element: HTMLElement, from: string, to: string, dampingStyleVar: string, stiffnessStyleVar: string) {
    const damping = Number(this.readVar(element, dampingStyleVar));
    const stiffness = Number(this.readVar(element, stiffnessStyleVar));

    if (from == this.minimalService.CIRCULAR_BORDER_RADIUS_VALUE)
      from = this.minimalService.getMinimalCircularBorderRadius(element)
    if (to == this.minimalService.CIRCULAR_BORDER_RADIUS_VALUE)
      to = this.minimalService.getMinimalCircularBorderRadius(element)

    return this.springAnimateService.animate(element, 'borderRadius', from, to, { damping, stiffness });
  }

  public readVar(element: HTMLElement, name: string): string {
    return getComputedStyle(element).getPropertyValue(name).trim();
  }
}
