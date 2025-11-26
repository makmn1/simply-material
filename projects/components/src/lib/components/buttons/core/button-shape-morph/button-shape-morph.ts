import {
  AfterViewInit,
  Directive,
  effect,
  ElementRef,
  inject,
  output
} from '@angular/core';
import {ShapeMorph} from '../../../../../services/shape-morph';
import {AnimationPlaybackControlsWithThen} from 'motion';
import {BUTTON_SHAPE_MORPH_ROLE, ButtonShapeMorphConfig} from "./button-shape-morph-type.token";
import {
  pressedMorph, restingShapeMorph, selectedShape, springDamping, springStiffness
} from "./button-shape-morph-css-vars"

@Directive({
  selector: 'button[smButtonShapeMorph], a[smButtonShapeMorph]'
})
export class ButtonShapeMorph implements AfterViewInit {
  private readonly buttonShapeMorphRole =
    inject<ButtonShapeMorphConfig>(BUTTON_SHAPE_MORPH_ROLE, { host: true, optional: false })
  private readonly morphConfig = this.buttonShapeMorphRole.morphConfig;

  private readonly el: ElementRef<HTMLElement> = inject(ElementRef<HTMLElement>);
  private readonly shapeMorph: ShapeMorph = inject(ShapeMorph)
  protected readonly String = String;

  private _animationControls: AnimationPlaybackControlsWithThen | undefined = undefined;
  private _baseWidthPx: number | null = null;
  private _activePointerId: number | null = null;
  private _viewInitialized = false;
  private _prevConfiguration: string = this.configuration();

  // Cache neighbors we shrank on press so we restore the same ones on release
  private _lastNeighbors: HTMLElement[] | null = null;

  private configuration() {
    return `${this.morphConfig.buttonGroupType ? this.morphConfig.buttonGroupType() : 'standalone'}-${this.morphConfig.buttonShape()}`;
  }

  constructor() {
    this.buttonShapeMorphRole.registerShapeMorphHost(this);

    effect(() => {
      const currentConfiguration = this.configuration();

      if (currentConfiguration == this._prevConfiguration) return;

      // Important: update previous even if the view is not initialized so that future effects have a correct starting point
      this._prevConfiguration = currentConfiguration;

      if (!this._viewInitialized) return;

      this.resetBorderRadius();
    });
  }

  public ngAfterViewInit() {
    this._viewInitialized = true;

    const element = this.root();
    this.resetBorderRadius();

    // For standard button groups, lock a base width so we can animate width on press.
    if (this.hasWidthMorphingGroup(element)) {
      this.getBaseWidthPx(element);
    }
  }

  private resetBorderRadius() {
    const el = this.root();

    const borderRadiusVar: string = this.morphConfig.isSelected()
      ? selectedShape(this.morphConfig) : restingShapeMorph(this.morphConfig);
    const borderRadius = this.shapeMorph.readVar(el, borderRadiusVar)

    this._animationControls = this.shapeMorph.animateBorderRadius(
      el,
      getComputedStyle(el).borderRadius,
      borderRadius,
      springDamping(this.morphConfig),
      springStiffness(this.morphConfig),
    );
  }

  private root(): HTMLElement {
    return this.el.nativeElement;
  }

  async animatePointerDown(e: Event) {
    const event = e as PointerEvent;
    if (event.button !== 0) return; // only primary button

    this._activePointerId = event.pointerId;
    await this.animatePressIn(this.morphConfig.isSelected());
  }

  async animateWindowPointerUp(e: Event) {
    const event = e as PointerEvent;

    if (this._activePointerId === null || event.pointerId !== this._activePointerId) {
      return; // not our press
    }
    this._activePointerId = null;

    const element = this.root();
    const target = event.target as Node | null;
    const releasedInside =
      !!target && (target === element || element.contains(target));

    if (!releasedInside) {
      // Release happened OUTSIDE the button:
      // no click will fire, so we must finish the animation here.
      await this.animateToRest();
    }
    // If released inside, normal click will fire onClick() which
    // will call animateToRest(), so do nothing here to avoid double-animating.
  }

  async animateWindowPointerCancel(e: Event) {
    const event = e as PointerEvent;

    if (this._activePointerId === null || event.pointerId !== this._activePointerId) {
      return;
    }
    this._activePointerId = null;

    // Treat cancel like a canceled press: just go back to rest.
    await this.animateToRest();
  }

  async animateKeyDownEnter(_e: Event) {
    await this.animatePressIn(this.morphConfig.isSelected());
  }

  async animateKeyDownSpace(e: Event) {
    const event = e as KeyboardEvent;
    if (event.repeat) return;
    await this.animatePressIn(this.morphConfig.isSelected());
  }

  async animateClick() {
    if (this._animationControls) {
      this._animationControls.then(() => this.animateToRest())
    } else {
      // If no animation was started (e.g., programmatic click), animate to rest directly
      await this.animateToRest();
    }
  }

  // Starts the animation, completes any pending animations
  public animatePressIn(
    pressInSelectionState: boolean,
    options?: { skipWidth?: boolean }
  ) : AnimationPlaybackControlsWithThen | undefined {
    if (!this._viewInitialized) return;
    if (this._animationControls) this._animationControls.cancel();

    const element = this.root();
    const fromVar: string = pressInSelectionState ? selectedShape(this.morphConfig) : restingShapeMorph(this.morphConfig);

    const fromRadius = this.shapeMorph.readVar(this.root(), fromVar);
    const toRadius = this.shapeMorph.readVar(element, pressedMorph(this.morphConfig));

    // Border radius animation
    this._animationControls = this.shapeMorph.animateBorderRadius(
      element,
      fromRadius,
      toRadius,
      springDamping(this.morphConfig),
      springStiffness(this.morphConfig),
    );

    // Width animation only if in a STANDARD button group
    if (options?.skipWidth || this.morphConfig.disableWidthAnimations() || !this.hasWidthMorphingGroup(element))
      return this._animationControls;

    const dampingVar = springDamping(this.morphConfig);
    const stiffnessVar = springStiffness(this.morphConfig);
    const basePressed = this.getBaseWidthPx(element);
    const multiplier = this.getPressedWidthMultiplier(element);

    if (multiplier === 0) return;

    const targetPressed = basePressed * (1 + multiplier);
    const delta = targetPressed - basePressed;

    const { prev, next } = this.getAdjacentGroupItems(element);
    const neighbors: HTMLElement[] = [];
    if (prev) neighbors.push(prev);
    if (next) neighbors.push(next);

    // Cache the neighbors we are about to shrink so we can restore them later
    this._lastNeighbors = neighbors.length ? neighbors : null;

    if (neighbors.length === 0) {
      // No neighbors on this row: just grow this button; group width will change.
      this.shapeMorph.animateWidth(
        element,
        `${basePressed}px`,
        `${targetPressed}px`,
        dampingVar,
        stiffnessVar,
      );
      return;
    }

    const share = delta / neighbors.length;

    // Pressed button: base -> larger
    this.shapeMorph.animateWidth(
      element,
      `${basePressed}px`,
      `${targetPressed}px`,
      dampingVar,
      stiffnessVar,
    );

    // Neighbors: base -> smaller, sharing the "borrowed" width between them
    for (const neighbor of neighbors) {
      const baseNeighbor = this.getBaseWidthPx(neighbor);
      const targetNeighbor = baseNeighbor - share;

      this.shapeMorph.animateWidth(
        neighbor,
        `${baseNeighbor}px`,
        `${targetNeighbor}px`,
        dampingVar,
        stiffnessVar,
      );
    }

    return this._animationControls
  }

  /**
   * Default button release: pressed → current resting shape (selected or not).
   */
  public async animateToRest(options?: { skipWidth?: boolean }): Promise<void> {
    if (!this._viewInitialized) return;

    const element = this.root();
    const fromRadius = this.shapeMorph.readVar(element, pressedMorph(this.morphConfig));

    const toRadiusVar = this.morphConfig.togglable() && this.morphConfig.isSelected()
      ? selectedShape(this.morphConfig)
      : restingShapeMorph(this.morphConfig);
    const toRadius = this.shapeMorph.readVar(element, toRadiusVar);

    // Border radius back to the rest / selected shape
    this._animationControls = this.shapeMorph.animateBorderRadius(
      element,
      fromRadius,
      toRadius,
      springDamping(this.morphConfig),
      springStiffness(this.morphConfig),
    );

    // Width back to base for STANDARD button groups
    if (options?.skipWidth || this.morphConfig.disableWidthAnimations() || !this.hasWidthMorphingGroup(element)) return;

    const dampingVar = springDamping(this.morphConfig);
    const stiffnessVar = springStiffness(this.morphConfig);
    const basePressed = this.getBaseWidthPx(element);
    const currentPressedRect = element.getBoundingClientRect();
    const fromWidthPressed = `${currentPressedRect.width}px`;
    const toWidthPressed = `${basePressed}px`;

    this.shapeMorph.animateWidth(
      element,
      fromWidthPressed,
      toWidthPressed,
      dampingVar,
      stiffnessVar,
    );

    // Prefer neighbors we actually shrank on press; fall back to current row adjacency if none cached
    let neighbors: HTMLElement[] = [];

    if (this._lastNeighbors && this._lastNeighbors.length > 0) {
      neighbors = this._lastNeighbors.filter((neighbor) => neighbor.isConnected);
    } else {
      const { prev, next } = this.getAdjacentGroupItems(element);
      if (prev) neighbors.push(prev);
      if (next) neighbors.push(next);
    }

    for (const neighbor of neighbors) {
      const baseNeighbor = this.getBaseWidthPx(neighbor);
      const currentRect = neighbor.getBoundingClientRect();
      const fromWidth = `${currentRect.width}px`;
      const toWidth = `${baseNeighbor}px`;

      this.shapeMorph.animateWidth(
        neighbor,
        fromWidth,
        toWidth,
        dampingVar,
        stiffnessVar,
      );
    }

    // Clear the neighbor cache after we've restored widths
    this._lastNeighbors = null;
  }

  /* Animation Utilities */
  /**
   * Reads the effective pressed width multiplier from CSS.
   * Supports values like '0.15' or '15%'.
   */
  private getPressedWidthMultiplier(element: HTMLElement): number {
    const raw = this.shapeMorph.readVar(element, '--sm-button-group-pressed-width-multiplier');
    if (!raw) return 0;

    const trimmed = raw.trim();
    if (!trimmed) return 0;

    const numeric = Number.parseFloat(trimmed);
    if (!Number.isFinite(numeric)) return 0;

    if (trimmed.endsWith('%')) {
      return numeric / 100;
    }

    return numeric;
  }

  private hasWidthMorphingGroup(element: HTMLElement): boolean {
    return this.getPressedWidthMultiplier(element) > 0;
  }

  /**
   * Gets or computes the base width for an element, storing it in data attributes
   * for cross-instance access. For standard button groups, also sets a fixed width.
   */
  private getBaseWidthPx(element: HTMLElement): number {
    // If this is our own host, and we've already cached the base width, use it.
    if (element === this.root() && this._baseWidthPx !== null) {
      return this._baseWidthPx;
    }

    // Try a data attribute first so all instances can read it.
    const data = element.dataset["smBaseWidth"];
    if (data) {
      const parsed = Number.parseFloat(data);
      if (Number.isFinite(parsed)) {
        if (element === this.root()) {
          this._baseWidthPx = parsed;
        }
        return parsed;
      }
    }

    // Fallback: compute it now and persist it.
    const rect = element.getBoundingClientRect();
    const width = rect.width;
    element.dataset["smBaseWidth"] = String(width);

    // Only force a fixed width for standard button groups.
    if (this.hasWidthMorphingGroup(element)) {
      if (!element.style.width) {
        element.style.width = `${width}px`;
      }
    }

    if (element === this.root()) {
      this._baseWidthPx = width;
    }

    return width;
  }

  private isGroupItemElement(el: Element | null): el is HTMLElement {
    if (!el) return false;
    const element = el as HTMLElement;
    return element.classList.contains('simply-mat-button') || element.classList.contains('simply-mat-icon-button');
  }

  private getAdjacentGroupItems(element: HTMLElement): { prev: HTMLElement | null; next: HTMLElement | null } {
    const parent = element.parentElement;
    if (!parent) return { prev: null, next: null };

    const items = Array.from(parent.children).filter((child): child is HTMLElement =>
      this.isGroupItemElement(child),
    );

    if (!items.length) return { prev: null, next: null };

    const index = items.indexOf(element);
    if (index === -1) return { prev: null, next: null };

    const rect = element.getBoundingClientRect();
    const rowTop = element.offsetTop;
    const rowThreshold = rect.height / 2; // tolerate vertical shifts from align-items: center

    const isSameRow = (el: HTMLElement) =>
      Math.abs(el.offsetTop - rowTop) <= rowThreshold;

    // Only pick items on the same visual row
    const sameRowItems = items.filter(isSameRow);
    if (sameRowItems.length <= 1) {
      return { prev: null, next: null };
    }

    const rowIndex = sameRowItems.indexOf(element);
    if (rowIndex === -1) {
      return { prev: null, next: null };
    }

    const prev = rowIndex > 0 ? sameRowItems[rowIndex - 1] : null;
    const next = rowIndex < sameRowItems.length - 1 ? sameRowItems[rowIndex + 1] : null;

    return { prev, next };
  }
}
