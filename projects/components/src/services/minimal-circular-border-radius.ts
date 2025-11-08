import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class MinimalCircularBorderRadius {
  public readonly CIRCULAR_BORDER_RADIUS_NUMBER_VALUE = 9999
  public readonly CIRCULAR_BORDER_RADIUS_VALUE = `${this.CIRCULAR_BORDER_RADIUS_NUMBER_VALUE}rem`

  /**
   * Helper to set border radius to the smallest possible value while still having the highest
   * circular border radius visually possible with a px / rem value.
   *
   * For smoother border radius animations, you should call this function after a component is initialized.
   * Otherwise, the component will have a much faster animation than expected since it's animating from a super high
   * border radius value to a low border radius value.
   *
   * @param element
   */
  public setIfCircularBorderRadius(element: HTMLElement) {
    const computedStyle = window.getComputedStyle(element);
    const computedCircularBorderRadiusStyleInPixels = this.CIRCULAR_BORDER_RADIUS_NUMBER_VALUE * this.rootPx()

    if (computedStyle.borderRadius === `${computedCircularBorderRadiusStyleInPixels}px`)
      this.setMinimalCircularBorderRadius(element);
  }

  public setMinimalCircularBorderRadius(element: HTMLElement) {
    element.style.borderRadius = this.getMinimalCircularBorderRadius(element)
  }

  public getMinimalCircularBorderRadius(element: HTMLElement) {
    const {w, h} = this.getWidthAndHeight(element)
    const rRem = this.pxToRem(Math.min(w, h) / 2);
    return `${rRem}rem`
  }

  public getWidthAndHeight(element: HTMLElement): { w: number; h: number } {
    const { width: w, height: h } = element.getBoundingClientRect();
    return { w, h };
  }

  public pxToRem(px: number) {
    return px / this.rootPx();
  }

  public rootPx() {
    return parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
  }
}
