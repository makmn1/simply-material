import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  input,
  linkedSignal,
  output,
  resource,
  WritableSignal,
} from '@angular/core';
import {MinimalCircularBorderRadius} from '../../../services/minimal-circular-border-radius';
import {ShapeMorph} from '../../../services/shape-morph';
import {SmRippleDirective} from '../../../miscellaneous/ripple/ripple';

export type ButtonVariant = 'filled' | 'elevated' | 'tonal' | 'outlined' | 'text';
export type ButtonSize = 'xsmall' | 'small' | 'medium' | 'large' | 'xlarge';
export type ButtonShape = 'round' | 'square';

@Component({
  selector: 'button[sm-button], a[sm-button]',
  template: `<ng-content />`,
  styleUrls: ['./button.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  hostDirectives: [{
    directive: SmRippleDirective,
    inputs: [
      'rippleDisabled',
      'rippleOpacity',
      'rippleDuration',
      'rippleEasing',
      'rippleColor',
    ],
  }],
  host: {
    'class': 'sm-button',

    '[attr.data-variant]': 'variant()',
    '[attr.data-size]': 'size()',
    '[attr.data-toggle]': 'String(toggle())',
    '[attr.data-selected]': 'String(isSelected())',
    '[attr.data-shape]': 'shape()',

    '(click)': 'onClick($event)',

    '[attr.aria-pressed]': 'toggle() ? isSelected() : null',
    '[attr.disabled]': 'isNativeButton() && disabled() ? "" : null',

    // button sets this automatically, manually set for anchor
    '[attr.aria-disabled]': 'isAnchor() ? String(disabled()) : null',
  },
})
export class SmButtonComponent implements AfterViewInit {
  private readonly el: ElementRef<HTMLElement> = inject(ElementRef<HTMLElement>);
  private readonly minimalService = inject(MinimalCircularBorderRadius)
  private readonly shapeMorph: ShapeMorph = inject(ShapeMorph)
  protected readonly String = String;

  public variant = input<ButtonVariant>('filled');
  public size = input<ButtonSize>('small');
  public shape = input<ButtonShape>('round');

  public toggle = input<boolean>(false);
  public disabled = input<boolean>(false);
  public selected = input<boolean>(false);
  public isSelected: WritableSignal<boolean> = linkedSignal(() => this.selected())

  public readonly selectedChange = output<boolean>();

  private pressedMorphVar() { return `--md-comp-button-${this.size()}-shape-pressed-morph`; }
  private restingShapeVar(shape: ButtonShape | undefined = undefined){
    if (!shape) shape = this.shape()
    return `--md-comp-button-${this.size()}-shape-${shape}`;
  }
  private selectedShapeVar(shape: ButtonShape | undefined = undefined) {
    if (!shape) shape = this.shape()
    return `--md-comp-button-${this.size()}-selected-container-shape-${shape}`;
  }
  private springDampingVar() { return `--md-comp-button-${this.size()}-shape-spring-animation-damping`; }
  private springStiffnessVar() { return `--md-comp-button-${this.size()}-shape-spring-animation-stiffness`; }

  private _viewInitialized = false

  public ngAfterViewInit() {
    const element = this.root()

    // edge case where a button is already selected on render
    if (this.isSelected()) {
      const targetShapeVar: string = this.isSelected() ? this.selectedShapeVar() : this.restingShapeVar();
      element.style.borderRadius = this.shapeMorph.readVar(element, targetShapeVar)
    }

    this.minimalService.setIfCircularBorderRadius(element)
    this._viewInitialized = true
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

  // This resource keeps the border radius in-sync with the selected shape, animating between shape changes
  private readonly _shapeSync = resource({
    params: () => this.shape(),
    loader: async ({params: newShape}) => {
      if (this._viewInitialized) {
        const el = this.root();
        const oldShape: ButtonShape = this.shape() == "round" ? "square" : "round"

        if (this.isSelected()) {
          const targetShapeVar: string = this.isSelected() ? this.selectedShapeVar() : this.restingShapeVar();
          const from: string = this.getCurrentBorderRadius(this.isSelected(), oldShape);
          const to: string = this.shapeMorph.readVar(el, targetShapeVar);

          await this.shapeMorph.animateBorderRadius(
            el, from, to, this.springDampingVar(), this.springStiffnessVar()
          )
        }
        else if (newShape === 'round') {
          const from = this.getCurrentBorderRadius(this.isSelected(), oldShape);
          const to = this.minimalService.getMinimalCircularBorderRadius(el);
          await this.shapeMorph.animateBorderRadius(
            el, from, to, this.springDampingVar(), this.springStiffnessVar()
          )
        } else if (newShape === 'square') {
          const from = this.getCurrentBorderRadius(this.isSelected(), oldShape);
          const to = this.getCurrentBorderRadius(this.isSelected(), this.shape());
          await this.shapeMorph.animateBorderRadius(
            el, from, to, this.springDampingVar(), this.springStiffnessVar()
          )
        }
      }
    }
  });

  async onClick(event: Event) {
    if (this.disabled()) {
      event.preventDefault();
      (event as MouseEvent).stopImmediatePropagation?.();
      return;
    }

    if (this.toggle()) {
      const next = !this.isSelected();
      this.isSelected.set(next);
      this.selectedChange.emit(next);
      await this.animateToSelectedShape(!next, next);
    } else {
      await this.animatePressMorph();
    }
  }

  private async animatePressMorph() {
    const element: HTMLElement = this.root();
    const to: string = this.shapeMorph.readVar(element, this.pressedMorphVar());
    const back: string = this.getCurrentBorderRadius(this.selected());

    await this.shapeMorph.animateBorderRadius(
      element, back, to, this.springDampingVar(), this.springStiffnessVar()
    )

    await this.shapeMorph.animateBorderRadius(
      element, to, back, this.springDampingVar(), this.springStiffnessVar()
    )
  }

  private async animateToSelectedShape(wasSelected: boolean, nextSelected: boolean) {
    const element: HTMLElement = this.root();
    const targetShapeVar: string = nextSelected ? this.selectedShapeVar() : this.restingShapeVar();
    const from: string = this.getCurrentBorderRadius(wasSelected);
    const to: string = this.shapeMorph.readVar(element, targetShapeVar);

    await this.shapeMorph.animateBorderRadius(
      element, from, to, this.springDampingVar(), this.springStiffnessVar()
    )
  }

  private getCurrentBorderRadius(selected: boolean, shape: ButtonShape | undefined = undefined): string {
    const targetShapeVar: string = selected ? this.selectedShapeVar(shape) : this.restingShapeVar(shape);
    return this.shapeMorph.readVar(this.root(), targetShapeVar);
  }
}
