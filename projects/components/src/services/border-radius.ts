import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class BorderRadius {
  public readonly CIRCULAR_BORDER_RADIUS_NUMBER_VALUE = 9999;
  public readonly CIRCULAR_BORDER_RADIUS_VALUE = `${this.CIRCULAR_BORDER_RADIUS_NUMBER_VALUE}rem`;

  public getMinimalCircularBorderRadius(element: HTMLElement): string {
    const { w, h } = this.getWidthAndHeight(element);
    const rRem = this.pxToRem(Math.min(w, h) / 2);
    return `${rRem.toFixed(4)}rem`;
  }

  public getWidthAndHeight(element: HTMLElement): { w: number; h: number } {
    const { width: w, height: h } = element.getBoundingClientRect();
    return { w, h };
  }

  public pxToRem(px: number): number {
    return px / this.rootPx();
  }

  public rootPx(): number {
    return parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
  }

  public convertToRem(value: string): string {
    return value
      .split(' ')
      .map(part => {
        if (!part.endsWith('px')) return part;

        const num = parseFloat(part.slice(0, -2)); // remove "px"
        const rem = this.pxToRem(num);

        return `${parseFloat(rem.toFixed(4))}rem`;
      })
      .join(' ');
  }

  /**
   * Normalize border-radius shorthand into its 4-corner representation.
   *
   * CSS rules:
   *  - 1 value: r -> r r r r
   *  - 2 values: v h -> v h v h (top/bottom, left/right)
   *  - 3 values: t h b -> t h b h (top, left/right, bottom)
   *  - 4+ values: tl tr br bl (ignore the rest)
   */
  public normalizeBorderRadius(value: string): string {
    const trimmed = value.trim();
    const parts = trimmed.split(/\s+/).filter(Boolean);
    if (parts.length === 0) return trimmed;

    if (parts.length === 1) {
      return `${parts[0]} ${parts[0]} ${parts[0]} ${parts[0]}`;
    }

    if (parts.length === 2) {
      return `${parts[0]} ${parts[1]} ${parts[0]} ${parts[1]}`;
    }

    if (parts.length === 3) {
      return `${parts[0]} ${parts[1]} ${parts[2]} ${parts[1]}`;
    }

    return `${parts[0]} ${parts[1]} ${parts[2]} ${parts[3]}`;
  }

  /**
   * Replace the circular constant (9999rem) in `borderRadiusString` with the
   * minimal circular border radius for `element`.
   */
  public convertCircularBorderRadius(
    element: HTMLElement,
    borderRadiusString: string,
  ): string {
    const { from } = this.convertCircularBorderRadiusPair(
      element,
      borderRadiusString,
      borderRadiusString,
    );
    return from;
  }

  /**
   * Replace the circular constant (9999rem) in both `from` and `to` values,
   * computing the minimal circular radius at most once.
   */
  public convertCircularBorderRadiusPair(
    element: HTMLElement,
    from: string,
    to: string,
  ): { from: string; to: string } {
    const circularValue = this.CIRCULAR_BORDER_RADIUS_VALUE;

    let fromValue = from;
    let toValue = to;

    if (from.includes(circularValue) || to.includes(circularValue)) {
      const minimalValue = this.getMinimalCircularBorderRadius(element);

      if (from.includes(circularValue)) {
        fromValue = this.replaceCircularTokens(from, circularValue, minimalValue);
      }
      if (to.includes(circularValue)) {
        toValue = this.replaceCircularTokens(to, circularValue, minimalValue);
      }
    }

    return { from: fromValue, to: toValue };
  }

  private replaceCircularTokens(value: string, circular: string, minimal: string): string {
    return value
      .split(/\s+/)
      .filter(Boolean)
      .map(token => (token === circular ? minimal : token))
      .join(' ');
  }
}
