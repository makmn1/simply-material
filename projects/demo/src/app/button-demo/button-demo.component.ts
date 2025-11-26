import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import {SimplyMatButton} from '@simply-material/components';

@Component({
  selector: 'app-button-demo',
  imports: [SimplyMatButton],
  templateUrl: './button-demo.component.html',
  styleUrls: ['./button-demo.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ButtonDemoComponent {
  readonly sizes = ['xsmall', 'small', 'medium', 'large', 'xlarge'] as const;
  readonly variants = ['filled', 'elevated', 'tonal', 'outlined', 'text'] as const;
  readonly shapes = ['round', 'square'] as const;

  filledSelected = signal(false);
  elevatedSelected = signal(false);
  tonalSelected = signal(false);
  outlinedSelected = signal(false);
  controlledSelected = signal(false);

  selectedShape = signal<'round' | 'square'>('round');
}
