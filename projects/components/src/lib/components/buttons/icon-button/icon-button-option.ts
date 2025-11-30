import {
  ChangeDetectionStrategy,
  Component, forwardRef,
  signal, WritableSignal
} from '@angular/core';
import {
  BaseConfig, BUTTON_BASE_CONFIG,
} from "../core/button-base/button-base.token";
import {SimplyMatIconButton, IconButtonShape} from './icon-button';
import {SimplyMatIcon} from '../../icon/icon';

@Component({
  selector: 'button[simplyMatIconButton][ngOption]',
  templateUrl: './icon-button.html',
  styleUrls: ['./icon-button.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {provide: BUTTON_BASE_CONFIG, useExisting: forwardRef(() => SimplyMatIconButtonOption)},
  ],
  host: {
    'class': 'simply-mat-icon-button',
    '[attr.data-sm-width]': 'width()'
  },
  imports: [
    SimplyMatIcon
  ]
})
export class SimplyMatIconButtonOption extends SimplyMatIconButton {
  public override isSelected: WritableSignal<boolean> = signal<boolean>(false);

  override get baseConfig(): BaseConfig<IconButtonShape> {
    return {
      ...super.baseConfig,
      togglable: signal(true),
      isSelected: this.isSelected
    }
  }
}

