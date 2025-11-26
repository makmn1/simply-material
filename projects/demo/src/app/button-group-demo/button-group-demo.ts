import {ChangeDetectionStrategy, Component, signal, WritableSignal} from '@angular/core';
import {
  ButtonGroupType, ButtonShape,
  ButtonSize,
  ButtonVariant,
  SimplyMatButton,
  SimplyMatButtonGroup
} from '@simply-material/components';

@Component({
  selector: 'app-button-group-demo',
  imports: [SimplyMatButton, SimplyMatButtonGroup],
  templateUrl: './button-group-demo.html',
  styleUrl: './button-group-demo.css',
})
export class ButtonGroupDemo {
  readonly sizes: ButtonSize[] = ['xsmall', 'small', 'medium', 'large', 'xlarge'] as const;
  readonly variants: ButtonVariant[] = ['filled', 'elevated', 'tonal', 'outlined', 'text'] as const;

  buttonGroupType: WritableSignal<ButtonGroupType> = signal<'standard' | 'connected'>('standard');
  selectedShape: WritableSignal<ButtonShape> = signal<'round' | 'square'>('round');

  // Toggle button states
  // For standard button groups with different sizes
  toggleSizeXSmall = signal([false, false, false]);
  toggleSizeSmall = signal([false, false, false]);
  toggleSizeMedium = signal([false, false, false]);
  toggleSizeLarge = signal([false, false, false]);
  toggleSizeXLarge = signal([false, false, false]);

  // For button groups with mixed button sizes
  toggleMixed1 = signal([false, false, false]);
  toggleMixed2 = signal([false, false, false]);
  toggleMixed3 = signal([false, false, false]);
  toggleMixed4 = signal([false, false, false]);
  toggleMixed5 = signal([false, false, false]);

  // For button groups with different variants
  toggleVariantFilled = signal([false, false, false]);
  toggleVariantElevated = signal([false, false, false]);
  toggleVariantTonal = signal([false, false, false]);
  toggleVariantOutlined = signal([false, false, false]);
  toggleVariantText = signal([false, false, false]);
}
