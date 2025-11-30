import {
  ChangeDetectionStrategy,
  Component, forwardRef,
  input, linkedSignal, output, TemplateRef, WritableSignal
} from '@angular/core';
import {
  ButtonBaseConfig,
  BaseConfig, BUTTON_BASE_CONFIG,
} from "../core/button-base/button-base.token";
import {ButtonBase} from "../core/button-base/button-base";
import {SimplyMatRippleDirective} from '../../core/ripple/ripple';
import {SimplyMatIcon} from '../../icon/icon';
import {NgTemplateOutlet} from '@angular/common';

export type ButtonVariant = 'filled' | 'elevated' | 'tonal' | 'outlined' | 'text';
export type ButtonSize = 'xsmall' | 'small' | 'medium' | 'large' | 'xlarge';
export type ButtonShape = 'round' | 'square';

@Component({
  selector: 'button[simplyMatButton]:not([ngOption]), a[simplyMatButton]:not([ngOption])',
  templateUrl: './button.html',
  styleUrls: ['./button.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {provide: BUTTON_BASE_CONFIG, useExisting: forwardRef(() => SimplyMatButton)},
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
    'class': 'simply-mat-button',
  },
  imports: [SimplyMatIcon, NgTemplateOutlet]
})
export class SimplyMatButton implements ButtonBaseConfig {
  public variant = input<ButtonVariant>('filled');
  public shape = input<ButtonShape>();
  public size = input<ButtonSize>('small');
  public disabled = input<boolean | undefined>();
  public softDisabled = input<boolean | undefined>();
  public readonly = input<boolean | undefined>();
  public togglable = input<boolean>(false);
  public icon = input<TemplateRef<unknown>>();

  public selected = input<boolean>(false);
  public isSelected: WritableSignal<boolean> = linkedSignal(() => this.selected());

  public readonly selectedChange = output<boolean>();

  get baseConfig(): BaseConfig<ButtonShape> {
    return {
      buttonShapeMorphRole: "button" as const,
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
