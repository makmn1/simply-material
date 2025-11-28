import {
  ChangeDetectionStrategy,
  Component,
} from '@angular/core';
import {FabBase} from '../core/fab-base/fab-base';

@Component({
  selector: 'button[simplyMatFab]',
  template: `<ng-content />`,
  styleUrls: ['./fab.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    'class': 'simply-mat-fab',
  }
})
export class SimplyMatFab extends FabBase {}

