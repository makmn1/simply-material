import {Component, signal, WritableSignal} from '@angular/core';
import {
  ButtonGroupType,
  ButtonShape,
  ButtonSize,
  ButtonVariant, SimplyMatButton, SimplyMatButtonGroup,
  SimplyMatButtonGroupSelection, SimplyMatButtonOption
} from '@simply-material/components';
import {Option} from '@angular/aria/listbox';
import {Field, form, disabled, readonly} from '@angular/forms/signals';

type FormModel = {selected: string[]}

@Component({
  selector: 'app-button-group-selection-demo',
  imports: [SimplyMatButtonGroupSelection, SimplyMatButtonOption, Option, Field, SimplyMatButton, SimplyMatButtonGroup],
  templateUrl: './button-group-selection-demo.html',
  styleUrl: './button-group-selection-demo.css',
})
export class ButtonGroupSelectionDemo {
  readonly sizes: ButtonSize[] = ['xsmall', 'small', 'medium', 'large', 'xlarge'] as const;
  readonly variants: ButtonVariant[] = ['filled', 'elevated', 'tonal', 'outlined', 'text'] as const;

  buttonGroupType: WritableSignal<ButtonGroupType> = signal<'standard' | 'connected'>('standard');
  selectedShape: WritableSignal<ButtonShape> = signal<'round' | 'square'>('round');
  multi: WritableSignal<boolean> = signal<boolean>(false);
  disabled: WritableSignal<boolean> = signal<boolean>(false);
  softDisabled: WritableSignal<boolean> = signal<boolean>(false);
  readonly: WritableSignal<boolean> = signal<boolean>(false);

  formModel = signal<FormModel>({
    selected: []
  });

  form = form(this.formModel, (path) => {
    disabled(path.selected, () => this.disabled())
    readonly(path.selected, () => this.readonly())
  });
}
