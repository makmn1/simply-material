import {
  ChangeDetectionStrategy,
  Component,
} from '@angular/core';
import {FabBase} from '../core/fab-base/fab-base';
import {SimplyMatElevation} from '../../core/elevation/elevation';

@Component({
  selector: 'button[simplyMatFab]',
  template: `
    <simply-mat-elevation [startElevation]="3" [hoverElevation]="4"></simply-mat-elevation>
    <ng-content/>
  `,
  styleUrls: ['./fab.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    SimplyMatElevation
  ],
  host: {
    'class': 'simply-mat-fab',

  }
})
export class SimplyMatFab extends FabBase {}

