import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input, InputSignal,
} from '@angular/core';
import {SmRippleDirective} from '../../../miscellaneous/ripple/ripple';
import {ButtonShapeMorph, ButtonShapeMorphCssVars} from '../../directives/button-shape-morph';

export type IconButtonVariant = 'filled' | 'tonal' | 'outlined' | 'standard';
export type IconButtonSize = 'xsmall' | 'small' | 'medium' | 'large' | 'xlarge';
export type IconButtonShape = 'round' | 'square';
export type IconButtonWidth = 'narrow' | 'default' | 'wide';

@Component({
  selector: 'button[sm-icon-button], a[sm-icon-button]',
  templateUrl: './icon-button.html',
  styleUrls: ['./icon-button.css'],
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
    'class': 'sm-icon-button',
    '[attr.data-width]': 'width()'
  },
})
export class IconButton {
  public readonly buttonShapeMorph =
    inject(ButtonShapeMorph<IconButtonVariant, IconButtonShape, IconButtonSize>)

  public variant = input<IconButtonVariant>('filled');
  public shape = input<IconButtonShape>('round');
  public size = input<IconButtonSize>('small');
  public width = input<IconButtonWidth>('default');

  private buttonShapeMorphCssVars: ButtonShapeMorphCssVars<IconButtonShape, IconButtonSize> = {
    pressedMorph: (size: IconButtonSize) => `--md-comp-icon-button-${size}-shape-pressed-morph`,
    restingShapeMorph: (size: IconButtonSize, shape: IconButtonShape) => `--md-comp-icon-button-${size}-container-shape-${shape}`,
    selectedShape: (size: IconButtonSize, shape: IconButtonShape) => `--md-comp-icon-button-${size}-selected-container-shape-${shape}`,
    springDamping: (size: IconButtonSize) => `--md-comp-icon-button-${size}-shape-spring-animation-damping`,
    springStiffness: (size: IconButtonSize) => `--md-comp-icon-button-${size}-shape-spring-animation-stiffness`,
  }

  // Workaround: we cast as undefined since:
  // - we can't make the directive input required, otherwise Angular forces us to expose it to the user
  // - the directive wants the type to be able to accept undefined to match its own typing
  // Note: user only sees the typing of our inputs, not the directive, so they can't pass in undefined
  constructor() {
    this.buttonShapeMorph.buttonShapeMorphCssVars = this.buttonShapeMorphCssVars;
    this.buttonShapeMorph.variant = this.variant as InputSignal<IconButtonVariant | undefined>;
    this.buttonShapeMorph.shape = this.shape as InputSignal<IconButtonShape | undefined>;
    this.buttonShapeMorph.size = this.size as InputSignal<IconButtonSize | undefined>;
  }
}
