import {
  ChangeDetectionStrategy,
  Component,
} from '@angular/core';
import {FabBase} from '../core/fab-base/fab-base';

@Component({
  selector: 'button[simplyMatExtendedFab]',
  template: `<ng-content />`,
  styleUrls: ['./extended-fab.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    'class': 'simply-mat-extended-fab',
  }
})
export class SimplyMatExtendedFab extends FabBase {}

