import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import {SimplyMatButtonGroup, SimplyMatIconButton} from '@simply-material/components';

@Component({
  selector: 'app-button-group-icon-demo',
  imports: [SimplyMatButtonGroup, SimplyMatIconButton],
  templateUrl: './button-group-icon-demo.html',
  styleUrl: './button-group-icon-demo.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ButtonGroupIconDemo {
  readonly widths = ['narrow', 'default', 'wide'] as const;
  readonly sizes = ['xsmall', 'small', 'medium', 'large', 'xlarge'] as const;
  readonly variants = ['filled', 'tonal', 'outlined', 'standard'] as const;

  buttonGroupType = signal<'standard' | 'connected'>('connected');
  selectedShape = signal<'round' | 'square'>('round');

  // Toggle button states for different width combinations
  toggleAllWidths = signal([false, false, false]);
  toggleNarrowDefault = signal([false, false]);
  toggleDefaultWide = signal([false, false]);
  toggleNarrowWide = signal([false, false]);
  toggleStandard1 = signal([false, false, false]);
  toggleStandard2 = signal([false, false]);

  // Toggle button states for connected sections
  toggleConnectedNarrow = signal([false, false, false]);
  toggleConnectedDefault = signal([false, false, false]);
  toggleConnectedWide = signal([false, false, false]);
  toggleConnectedMixed = signal([false, false, false, false, false, false]);
  toggleConnectedVariantFilled = signal([false, false, false]);
  toggleConnectedVariantTonal = signal([false, false, false]);
  toggleConnectedVariantOutlined = signal([false, false, false]);
  toggleConnectedVariantStandard = signal([false, false, false]);
}

