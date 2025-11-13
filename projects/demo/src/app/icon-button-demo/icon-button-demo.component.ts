import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import {IconButton, SmTooltipDirective} from '@simply-material/components';

@Component({
  selector: 'app-icon-button-demo',
  imports: [IconButton, SmTooltipDirective],
  templateUrl: './icon-button-demo.component.html',
  styleUrls: ['./icon-button-demo.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IconButtonDemoComponent {
  readonly sizes = ['xsmall', 'small', 'medium', 'large', 'xlarge'] as const;
  readonly variants = ['filled', 'tonal', 'outlined', 'standard'] as const;
  readonly shapes = ['round', 'square'] as const;
  readonly widths = ['narrow', 'default', 'wide'] as const;

  filledSelected = signal(false);
  tonalSelected = signal(false);
  outlinedSelected = signal(false);
  standardSelected = signal(false);

  selectedShape = signal<'round' | 'square'>('round');
}

