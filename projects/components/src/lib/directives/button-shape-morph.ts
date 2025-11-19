import {
  AfterViewInit,
  Directive,
  effect,
  ElementRef,
  inject,
  input,
  InputSignal,
  linkedSignal,
  output,
  WritableSignal
} from '@angular/core';
import {MinimalCircularBorderRadius} from '../../services/minimal-circular-border-radius';
import {ShapeMorph} from '../../services/shape-morph';
import {AnimationPlaybackControlsWithThen} from 'motion';

export type ButtonShapeMorphCssVars<Shape, Size> = {
  pressedMorph: (size: Size) => string,
  restingShapeMorph: (size: Size, shape: Shape) => string,
  selectedShape: (size: Size, shape: Shape) => string,
  springDamping: (size: Size) => string,
  springStiffness: (size: Size) => string,
}

/**
 * Directive that handles shape morph animations for any element by animating the border radius.
 * It handles transitioning between pressed, resting, and selected states, relying on
 * ButtonShapeMorphCssVars to provide the CSS variables for the states to transition to.
 * Since the variables are dynamically determined through callback handlers, they can be easily
 * customized based on the component's state.
 */
@Directive({
  selector: 'button[smButtonShapeMorph], a[smButtonShapeMorph]',
  host: {
    '[attr.data-variant]': 'variant()',
    '[attr.data-size]': 'size()',
    '[attr.data-toggle]': 'String(toggle())',
    '[attr.data-selected]': 'String(isSelected())',
    '[attr.data-shape]': 'shape()',

    // activation
    '(click)': 'void onClick($event)',

    // pointer press
    '(pointerdown)': 'void onPointerDown($event)',

    '(window:pointerup)': 'void onWindowPointerUp($event)',
    '(window:pointercancel)': 'void onWindowPointerCancel($event)',

    // keyboard press
    '(keydown.enter)': 'void onKeyDownEnter($event)',
    '(keydown.space)': 'void onKeyDownSpace($event)',

    // Space release
    '(keyup.space)': 'void onKeyUpSpace($event)',

    '[attr.aria-pressed]': 'toggle() ? isSelected() : null',
    '[attr.disabled]': 'isNativeButton() && disabled() ? "" : null',

    // button sets this automatically, manually set for anchor
    '[attr.aria-disabled]': 'isAnchor() ? String(disabled()) : null',
    '[attr.tabindex]': 'isAnchor() && disabled() ? -1 : 0',
  }
})
export class ButtonShapeMorph<Variant, Shape, Size> implements AfterViewInit {
  private readonly el: ElementRef<HTMLElement> = inject(ElementRef<HTMLElement>);
  private readonly minimalService = inject(MinimalCircularBorderRadius)
  private readonly shapeMorph: ShapeMorph = inject(ShapeMorph)
  protected readonly String = String;

  public variant = input<Variant>();
  public shape = input<Shape>();
  public size = input<Size>();
  public buttonShapeMorphCssVars: ButtonShapeMorphCssVars<Shape, Size> | null = null;
  private _previousShape: Shape | undefined = this.shape();

  public toggle = input<boolean>(false);
  public disabled = input<boolean>(false);
  public selected = input<boolean>(false);
  public isSelected: WritableSignal<boolean> = linkedSignal(() => this.selected())
  private animationControls: AnimationPlaybackControlsWithThen | undefined = undefined;
  private _baseWidthPx: number | null = null;
  private _activePointerId: number | null = null;

  public readonly selectedChange = output<boolean>();

  safelyGetSignal<T>(signal: InputSignal<T | undefined>): T {
    const value = signal()
    if (value !== undefined) return value as T;
    else throw new Error('ButtonShapeMorph: signal value is undefined');
  }

  safelyGetShapeMorphCssVars(): ButtonShapeMorphCssVars<Shape, Size> {
    if (this.buttonShapeMorphCssVars) return this.buttonShapeMorphCssVars;
    else throw new Error('ButtonShapeMorph: buttonShapeMorphCssVars not set');
  }

  private pressedMorphCssVar() {
    return this.safelyGetShapeMorphCssVars().pressedMorph(this.safelyGetSignal(this.size));
  }
  private restingShapeCssVar(shape: any | undefined = undefined) {
    if (!shape) shape = this.shape()
    return this.safelyGetShapeMorphCssVars().restingShapeMorph(this.safelyGetSignal(this.size), shape);
  }
  private selectedShapeCssVar(shape: any | undefined = undefined) {
    if (!shape) shape = this.shape()
    return this.safelyGetShapeMorphCssVars().selectedShape(this.safelyGetSignal(this.size), shape);
  }
  private springDampingCssVar() {
    return this.safelyGetShapeMorphCssVars().springDamping(this.safelyGetSignal(this.size));
  }
  private springStiffnessCssVar() {
    return this.safelyGetShapeMorphCssVars().springStiffness(this.safelyGetSignal(this.size));
  }

  private _viewInitialized = false;

  constructor() {
    effect(async () => {
      const newShape: Shape = this.safelyGetSignal(this.shape);
      const oldShape: Shape | undefined = this._previousShape;

      if (oldShape == newShape || !this._viewInitialized) return;

      const el = this.root();
      const selected = this.isSelected();
      this._previousShape = newShape;

      if (selected) {
        const targetShapeVar: string = selected ? this.selectedShapeCssVar() : this.restingShapeCssVar();
        const from: string = this.getCurrentBorderRadius(selected, oldShape);
        const to: string = this.shapeMorph.readVar(el, targetShapeVar);

        await this.shapeMorph.animateBorderRadius(
          el, from, to, this.springDampingCssVar(), this.springStiffnessCssVar()
        )
      }
      else if (newShape === 'round') {
        const from = this.getCurrentBorderRadius(selected, oldShape);
        const to = this.minimalService.getMinimalCircularBorderRadius(el);
        await this.shapeMorph.animateBorderRadius(
          el, from, to, this.springDampingCssVar(), this.springStiffnessCssVar()
        )
      } else if (newShape === 'square') {
        const from = this.getCurrentBorderRadius(selected, oldShape);
        const to = this.getCurrentBorderRadius(selected, this.shape());
        await this.shapeMorph.animateBorderRadius(
          el, from, to, this.springDampingCssVar(), this.springStiffnessCssVar()
        )
      }
    });
  }

  public ngAfterViewInit() {
    this._viewInitialized = true
    const element = this.root()

    // edge case where a button is already selected on render
    // Only set border radius if CSS vars are configured
    if (this.isSelected() && this.buttonShapeMorphCssVars) {
      const targetShapeVar = this.selectedShapeCssVar();
      element.style.borderRadius = this.shapeMorph.readVar(element, targetShapeVar);
    }

    this.minimalService.setIfCircularBorderRadius(element); // when circular shape
    this._previousShape = this.shape(); // initialize previousShape here

    // For standard button groups, lock a base width so we can animate width on press.
    if (this.hasWidthMorphingGroup(element)) {
      this.getBaseWidthPx(element);
    }
  }

  public isNativeButton(): boolean {
    return this.root().tagName.toLowerCase() === 'button';
  }

  public isAnchor(): boolean {
    return this.root().tagName.toLowerCase() === 'a';
  }

  private root(): HTMLElement {
    return this.el.nativeElement;
  }

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
    // Host classes from button.css / icon-button.css
    return element.classList.contains('sm-button') || element.classList.contains('sm-icon-button');
  }

  private getAdjacentGroupItems(element: HTMLElement): { prev: HTMLElement | null; next: HTMLElement | null } {
    let prev = element.previousElementSibling;
    while (prev && !this.isGroupItemElement(prev)) {
      prev = prev.previousElementSibling;
    }

    let next = element.nextElementSibling;
    while (next && !this.isGroupItemElement(next)) {
      next = next.nextElementSibling;
    }

    return {
      prev: this.isGroupItemElement(prev) ? (prev as HTMLElement) : null,
      next: this.isGroupItemElement(next) ? (next as HTMLElement) : null,
    };
  }

  async onPointerDown(e: Event) {
    const event = e as PointerEvent;
    if (this.disabled()) return;
    if (event.button !== 0) return; // only primary button

    this._activePointerId = event.pointerId;
    await this.animatePressIn();
  }

  async onWindowPointerUp(e: Event) {
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

  async onWindowPointerCancel(e: Event) {
    const event = e as PointerEvent;

    if (this._activePointerId === null || event.pointerId !== this._activePointerId) {
      return;
    }
    this._activePointerId = null;

    // Treat cancel like a canceled press: just go back to rest.
    await this.animateToRest();
  }

  async onKeyDownEnter(_e: Event) {
    if (this.disabled()) return;
    await this.animatePressIn();
  }

  async onKeyDownSpace(e: Event) {
    const event = e as KeyboardEvent;
    if (this.disabled() || event.repeat) return;

    await this.animatePressIn();
  }

  // Starts the animation, completes any pending animations
  private async animatePressIn(): Promise<void> {
    if (!this._viewInitialized) return;
    if (this.animationControls) this.animationControls.cancel();

    const element = this.root();
    const fromRadius = this.getCurrentBorderRadius(this.isSelected());
    const toRadius = this.shapeMorph.readVar(element, this.pressedMorphCssVar());

    // Border radius animation
    this.animationControls = this.shapeMorph.animateBorderRadius(
      element,
      fromRadius,
      toRadius,
      this.springDampingCssVar(),
      this.springStiffnessCssVar(),
    );

    // Width animation only if in a STANDARD button group
    if (!this.hasWidthMorphingGroup(element)) return;

    const dampingVar = this.springDampingCssVar();
    const stiffnessVar = this.springStiffnessCssVar();
    const basePressed = this.getBaseWidthPx(element);
    const multiplier = this.getPressedWidthMultiplier(element);

    if (multiplier === 0) return;

    const targetPressed = basePressed * (1 + multiplier);
    const delta = targetPressed - basePressed;

    const { prev, next } = this.getAdjacentGroupItems(element);
    const neighbors: HTMLElement[] = [];
    if (prev) neighbors.push(prev);
    if (next) neighbors.push(next);

    if (neighbors.length === 0) {
      // No neighbors: just grow this button; group width will change.
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
  }

  async onKeyUpSpace(_e: Event) {
    if (this.isAnchor()) {
      this.root().click();
    }
  }

  /**
   * Default button release: pressed → current resting shape (selected or not).
   */
  private async animateToRest(): Promise<void> {
    if (!this._viewInitialized) return;

    const element = this.root();
    const fromRadius = this.shapeMorph.readVar(element, this.pressedMorphCssVar());
    const toRadius = this.toggle() && this.isSelected()
      ? this.shapeMorph.readVar(element, this.selectedShapeCssVar(this.shape()))
      : this.shapeMorph.readVar(element, this.restingShapeCssVar(this.shape()));

    // Border radius back to the rest / selected shape
    this.animationControls = this.shapeMorph.animateBorderRadius(
      element,
      fromRadius,
      toRadius,
      this.springDampingCssVar(),
      this.springStiffnessCssVar(),
    );

    // Width back to base for STANDARD button groups
    if (!this.hasWidthMorphingGroup(element)) return;

    const dampingVar = this.springDampingCssVar();
    const stiffnessVar = this.springStiffnessCssVar();
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

    const { prev, next } = this.getAdjacentGroupItems(element);
    const neighbors: HTMLElement[] = [];
    if (prev) neighbors.push(prev);
    if (next) neighbors.push(next);

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
  }

  async onClick(event: Event) {
    if (this.disabled()) {
      event.preventDefault();
      return;
    }

    if (this.toggle()) {
      const next = !this.isSelected();
      this.isSelected.set(next);
      this.selectedChange.emit(next);
    }

    if (this.animationControls) {
      this.animationControls.then(() => this.animateToRest())
    } else {
      // If no animation was started (e.g., programmatic click), animate to rest directly
      await this.animateToRest();
    }
  }

  // Reads border radius property based on the current selected and shape state
  private getCurrentBorderRadius(
    selected: boolean,
    shape: Shape | undefined = undefined,
  ): string {
    const targetShapeVar: string = selected
      ? this.selectedShapeCssVar(shape)
      : this.restingShapeCssVar(shape);

    return this.shapeMorph.readVar(this.root(), targetShapeVar);
  }
}
