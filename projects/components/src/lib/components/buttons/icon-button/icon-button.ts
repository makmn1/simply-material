import {
  ChangeDetectionStrategy,
  Component, forwardRef,
  input, linkedSignal, output, WritableSignal,
} from '@angular/core';
import {SimplyMatRippleDirective} from '../../../../miscellaneous/ripple/ripple';
import {BaseConfig, BUTTON_BASE_CONFIG, ButtonBaseConfig} from '../core/button-base/button-base.token';
import {ButtonBase} from '../core/button-base/button-base';

export type IconButtonVariant = 'filled' | 'tonal' | 'outlined' | 'standard';
export type IconButtonSize = 'xsmall' | 'small' | 'medium' | 'large' | 'xlarge';
export type IconButtonShape = 'round' | 'square';
export type IconButtonWidth = 'narrow' | 'default' | 'wide';

@Component({
  selector: 'button[simplyMatIconButton]:not([ngOption]), a[simplyMatIconButton]:not([ngOption])',
  templateUrl: './icon-button.html',
  styleUrls: ['./icon-button.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {provide: BUTTON_BASE_CONFIG, useExisting: forwardRef(() => SimplyMatIconButton)},
  ],
  hostDirectives: [
    {
      directive: ButtonBase
    },
    {
      directive: SimplyMatRippleDirective,
      inputs: [
        'rippleDisabled',
        'rippleOpacity',
        'rippleDuration',
        'rippleEasing',
        'rippleColor',
      ],
    }
  ],
  host: {
    'class': 'simply-mat-icon-button',
    '[attr.data-sm-width]': 'width()'
  },
})
export class SimplyMatIconButton implements ButtonBaseConfig {
  public variant = input<IconButtonVariant>('filled');
  public shape = input<IconButtonShape>();
  public size = input<IconButtonSize>('small');
  public disabled = input<boolean | undefined>();
  public softDisabled = input<boolean | undefined>();
  public readonly = input<boolean | undefined>();
  public togglable = input<boolean>(false);
  public width = input<IconButtonWidth>('default');

  public selected = input<boolean>(false);
  public isSelected: WritableSignal<boolean> = linkedSignal(() => this.selected())

  public readonly selectedChange = output<boolean>();

  get baseConfig(): BaseConfig<IconButtonShape> {
    return {
      buttonShapeMorphRole: "icon" as const,
      buttonVariant: this.variant,
      buttonSize: this.size,
      buttonShape: this.shape,
      defaultButtonShape: "round",
      buttonDisabled: this.disabled,
      buttonSoftDisabled: this.softDisabled,
      buttonReadonly: this.readonly,
      togglable: this.togglable,
      isSelected: this.isSelected
    }
  }
}
