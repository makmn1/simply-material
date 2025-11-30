import {
  ChangeDetectionStrategy,
  Component,
  input,
} from '@angular/core';

export type ElevationLevel = 0 | 1 | 2 | 3 | 4 | 5;

/**
 * A component that adds elevation transitions to a parent element between resting and hovered states.
 *
 * It animates between two box-shadow properties using the CSS `transition` property.
 */
@Component({
  selector: 'simply-mat-elevation',
  standalone: true,
  template: '',
  styleUrls: ['./elevation.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    'aria-hidden': 'true',
    '[attr.data-sm-start-elevation]': 'String(this.startElevation())',
    '[attr.data-sm-hover-elevation]': 'String(this.hoverElevation())',
  },
})
export class SimplyMatElevation {
  startElevation = input<ElevationLevel>(3);
  hoverElevation = input<ElevationLevel>(3);
  protected readonly String = String;
}
