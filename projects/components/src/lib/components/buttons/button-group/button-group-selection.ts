import {
  booleanAttribute,
  Component,
  contentChildren,
  effect,
  ElementRef,
  forwardRef,
  inject, input, InputSignal, InputSignalWithTransform,
  model, WritableSignal,
} from '@angular/core';
import {SimplyMatButtonGroupBase} from './button-group-base';
import {Listbox, Option} from '@angular/aria/listbox';
import {ButtonBase} from '../core/button-base/button-base';
import {FormValueControl} from '@angular/forms/signals';
import {toObservable} from '@angular/core/rxjs-interop';
import {BaseConfig, BUTTON_GROUP_BASE_CONFIG, ButtonGroupBaseConfig} from './button-group-base.token';

/**
 * A button group supporting single and multi-selection mode, compatible with Angular's Signal form API.
 *
 * This component relies on Angular Aria's Listbox directive.
 * Because of this, note the following:
 * - Pass `orientation="horizontal"` to the component for left + right focus navigation with the arrow keys (default is up + down)
 * - If `multi="true"`, make sure that `selectionMode="explicit"`, otherwise it will act in single select mode.
 *
 * To add buttons to the component, use the Simply Material buttons but add the `ngOption` directive to them.
 * Note that using this component will disable the use of the normal selection attributes for the buttons.
 * To programmatically control which buttons are selected, use the `values` property.
 *
 *
 * The selection logic of this group should be handled through the listbox API.
 * You can change and adjust any non-selection attributes for the button group and each button as normal.
 *
 * @see [Aria Listbox API](https://angular.dev/guide/aria/listbox#apis)
 *
 * @class
 */
@Component({
  selector: 'simply-mat-button-group-selection',
  imports: [],
  template: '<ng-content/>',
  styleUrl: './button-group.css',
  providers: [
    {
      provide: SimplyMatButtonGroupBase,
      useExisting: forwardRef(() => SimplyMatButtonGroupSelection)
    },
    {
      provide: BUTTON_GROUP_BASE_CONFIG,
      useExisting: forwardRef(() => SimplyMatButtonGroupSelection)
    }
  ],
  hostDirectives: [
    {
      directive: Listbox,
      inputs: [
        'id',
        // TODO: If Angular ever supports overriding inputs, we should change the default here from "vertical" to "horizontal"
        "orientation",
        'multi',
        'wrap',
        'selectionMode',
        'focusMode',
        'softDisabled',
        'disabled',
        'readonly'
      ]
    }
  ],
  host: {
    '[attr.aria-disabled]': 'disabled()',
    '[attr.aria-readonly]': 'readonly()',
    '[attr.data-sm-size]': 'size()',
    '[attr.data-sm-type]': 'type()',
    '(focusin)': 'onFocusIn()',
    '(focusout)': 'onFocusOut($event)',
  },
})
export class SimplyMatButtonGroupSelection<V> extends SimplyMatButtonGroupBase
  implements FormValueControl<V[]>, ButtonGroupBaseConfig {

  private readonly el: ElementRef<HTMLElement> = inject(ElementRef<HTMLElement>);
  private hadFocus = false;

  private ngListbox = inject(Listbox<V>);
  private ngOptions = contentChildren(Option, { descendants: true, read: ButtonBase });

  public value = model<V[]>([]);
  public value$ = toObservable(this.value);
  public ngListboxValue$ = toObservable(this.ngListbox.values);

  public touched = model(false);

  constructor() {
    super();

    // TODO: This doesn't actually work as we want it to. The Listbox uses the signals on creation type which is before
    // we inject it. Even if we reassign it, it's still listening to the old signals.
    // We already manually update the aria attributes and have disabled / readonly guards in place, so this
    // might not be a big deal, but something to note for now. Maybe Aria's listbox will get better compatibility
    // with signal forms in the future
    this.ngListbox.disabled = this.disabled as InputSignalWithTransform<boolean, unknown>;
    this.ngListbox.readonly = this.readonly as InputSignalWithTransform<boolean, unknown>;

    // We need to sync the values between the form and Listbox
    this.value$.subscribe(values => {
      if (this.ngListbox.values() !== values) {
        this.ngListbox.values.set(values);
      }
    })

    this.ngListboxValue$.subscribe(values => {
      if (this.readonly()) {
        this.ngListbox.values.set(this.value());
      } else if (this.value() !== values) {
        this.value.set(values);
      }
    });


    // When the values change (either by user interaction or programmatically), we need to update the buttons accordingly
    effect(() => {
      const values = this.value();
      const valueSet = new Set(values);
      const buttons: readonly ButtonBase[] = this.ngOptions();

      for (const button of buttons) {
        if (!button.ngOption) {
          console.warn("Button has an Option directive but ButtonBase is missing ngOption.")
          continue;
        }

        const value = button.ngOption!.value()
        const selected = valueSet.has(value);
        void button.setSelected(selected);
      }
    });
  }

  get baseConfig(): BaseConfig {
    return {
      groupDisabled: this.disabled,
      groupSoftDisabled: this.softDisabled,
      groupReadonly: this.readonly
    }
  }

  onFocusIn() {
    this.hadFocus = true;
  }

  onFocusOut(event: FocusEvent) {
    const host = this.el.nativeElement as HTMLElement;
    const next = event.relatedTarget as Node | null;

    if (this.hadFocus && (!next || !host.contains(next)) && !this.readonly()) {
      this.touched.set(true);
    }
  }
}
