import {
  ChangeDetectionStrategy,
  Component, forwardRef,
  signal, WritableSignal
} from '@angular/core';
import {
  BaseConfig, BUTTON_BASE_CONFIG,
} from "../core/button-base/button-base.token";
import {SimplyMatButton, ButtonShape} from './button';

@Component({
  selector: 'button[simplyMatButton][ngOption]',
  template: `<ng-content/>`,
  styleUrls: ['./button.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {provide: BUTTON_BASE_CONFIG, useExisting: forwardRef(() => SimplyMatButtonOption)},
  ],
  host: {
    'class': 'simply-mat-button',
  },
})
export class SimplyMatButtonOption extends SimplyMatButton {
  public override isSelected: WritableSignal<boolean> = signal<boolean>(false);

  override get baseConfig(): BaseConfig<ButtonShape> {
    return {
      ...super.baseConfig,
      togglable: signal(true),
      isSelected: this.isSelected
    }
  }
}
