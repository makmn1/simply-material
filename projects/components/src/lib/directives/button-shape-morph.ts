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

  async onPointerDown(e: Event) {
    const event = e as PointerEvent;
    if (this.disabled()) return;
    if (event.button !== 0) return; // only primary button
    await this.animatePressIn();
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
    const from = this.getCurrentBorderRadius(this.isSelected());
    const to = this.shapeMorph.readVar(element, this.pressedMorphCssVar());

    this.animationControls = this.shapeMorph.animateBorderRadius(
      element,
      from,
      to,
      this.springDampingCssVar(),
      this.springStiffnessCssVar(),
    );
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
    const from = this.shapeMorph.readVar(element, this.pressedMorphCssVar());
    const to = this.toggle() && this.isSelected() ?
      this.shapeMorph.readVar(element, this.selectedShapeCssVar(this.shape()))
      : this.shapeMorph.readVar(element, this.restingShapeCssVar(this.shape()))

    this.animationControls = this.shapeMorph.animateBorderRadius(
      element,
      from,
      to,
      this.springDampingCssVar(),
      this.springStiffnessCssVar(),
    );
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
