import {
  ChangeDetectionStrategy,
  Component,
  inject, input, InputSignal,
} from '@angular/core';
import {SmRippleDirective} from '../../../miscellaneous/ripple/ripple';
import {ButtonShapeMorph, ButtonShapeMorphCssVars} from "../../directives/button-shape-morph";

export type ButtonVariant = 'filled' | 'elevated' | 'tonal' | 'outlined' | 'text';
export type ButtonSize = 'xsmall' | 'small' | 'medium' | 'large' | 'xlarge';
export type ButtonShape = 'round' | 'square';

@Component({
  selector: 'button[sm-button], a[sm-button]',
  template: `
    <ng-content/>`,
  styleUrls: ['./button.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  hostDirectives: [
    {
      directive: SmRippleDirective,
      inputs: [
        'rippleDisabled',
        'rippleOpacity',
        'rippleDuration',
        'rippleEasing',
        'rippleColor',
      ],
    },
    {
      directive: ButtonShapeMorph,
      inputs: [
        'toggle',
        'selected',
        'disabled'
      ],
      outputs: [
        'selectedChange'
      ]
    }
  ],
  host: {
    'class': 'sm-button',
  },
})
export class Button {
  public readonly buttonShapeMorph =
    inject(ButtonShapeMorph<ButtonVariant, ButtonShape, ButtonSize>)

  public variant = input<ButtonVariant>('filled');
  public shape = input<ButtonShape>('round');
  public size = input<ButtonSize>('small');

  private buttonShapeMorphCssVars: ButtonShapeMorphCssVars<ButtonShape, ButtonSize> = {
    pressedMorph: (size: ButtonSize) => `--md-comp-button-${size}-shape-pressed-morph`,
    restingShapeMorph: (size: ButtonSize, shape: ButtonShape) => `--md-comp-button-${size}-shape-${shape}`,
    selectedShape: (size: ButtonSize, shape: ButtonShape) => `--md-comp-button-${size}-selected-container-shape-${shape}`,
    springDamping: (size: ButtonSize) => `--md-comp-button-${size}-shape-spring-animation-damping`,
    springStiffness: (size: ButtonSize) => `--md-comp-button-${size}-shape-spring-animation-stiffness`,
  }

  // Workaround: we cast as undefined since:
  // - we can't make the directive input required, otherwise Angular forces us to expose it to the user
  // - the directive wants the type to be able to accept undefined to match its own typing
  // Note: user only sees the typing of our inputs, not the directive, so they can't pass in undefined
  constructor() {
    this.buttonShapeMorph.buttonShapeMorphCssVars = this.buttonShapeMorphCssVars;
    this.buttonShapeMorph.variant = this.variant as InputSignal<ButtonVariant | undefined>;
    this.buttonShapeMorph.shape = this.shape as InputSignal<ButtonShape | undefined>;
    this.buttonShapeMorph.size = this.size as InputSignal<ButtonSize | undefined>;
  }
}
