import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import {ButtonGroup, IconButton, Button} from '@simply-material/components';

@Component({
  selector: 'app-button-group-demo',
  imports: [ButtonGroup, IconButton, Button],
  templateUrl: './button-group-demo.html',
  styleUrl: './button-group-demo.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ButtonGroupDemo {
  readonly sizes = ['xsmall', 'small', 'medium', 'large', 'xlarge'] as const;
  readonly variants = ['filled', 'elevated', 'tonal', 'outlined', 'text'] as const;

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
