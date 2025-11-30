import {
  ChangeDetectionStrategy,
  Component, computed,
  inject,
} from '@angular/core';
import {TooltipContainerComponent} from './tooltip-container';

@Component({
  selector: 'sm-tooltip-content',
  template: `<ng-content />`,
  styleUrls: ['./tooltip-content.css'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    'class': 'sm-tooltip-content',
    '[attr.data-sm-type]': 'container.type()',
  },
})
export class SimplyMatTooltipContentComponent {
  public readonly container = inject(TooltipContainerComponent);
}
