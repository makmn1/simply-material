import {
  ChangeDetectionStrategy,
  Component,
  input, model, output,
} from '@angular/core';
import {SmButtonComponent} from '../../buttons/button/button';

export interface TooltipButtonConfig {
  label: string;
  action?: () => void;
}

export interface RichTooltipConfig {
  subhead?: string;
  supportingText: string;
  buttons?: TooltipButtonConfig[];
}

@Component({
  selector: 'sm-tooltip-content',
  templateUrl: './tooltip-content.html',
  styleUrls: ['./tooltip.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SmButtonComponent],
  host: {
    'role': 'tooltip',
    '[attr.data-type]': 'type()'
  },
})
export class TooltipContentComponent {
  public type = input<'plain' | 'rich'>('plain');
  public text = input<string>('');
  public config = input<RichTooltipConfig | null>(null);
  public open = model<boolean>(true);
  public closingAnimationComplete = output<void>();

  onAnimationEnd() {
    if (!this.open()) {
      this.closingAnimationComplete.emit();
    }
  }

  protected get buttons(): TooltipButtonConfig[] | undefined {
    return this.config()?.buttons;
  }

  protected onButtonClick(button: TooltipButtonConfig) {
    button.action?.();
  }
}

