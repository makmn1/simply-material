import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import {SimplyMatFab, SimplyMatExtendedFab, SimplyMatIcon} from '@simply-material/components';

export type FabColor = 'primary' | 'secondary' | 'tertiary';

@Component({
  selector: 'app-fab-demo',
  imports: [SimplyMatFab, SimplyMatExtendedFab, SimplyMatIcon],
  templateUrl: './fab-demo.component.html',
  styleUrls: ['./fab-demo.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FabDemoComponent {
  readonly fabSizes = ['small', 'medium', 'large'] as const;
  readonly extendedFabSizes = ['small', 'medium', 'large'] as const;
  readonly colors: FabColor[] = ['primary', 'secondary', 'tertiary'];

  selectedColor = signal<FabColor>('primary');
  selectedTonal = signal<boolean>(false);
}

