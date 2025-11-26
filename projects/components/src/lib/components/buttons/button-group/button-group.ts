import {Component, forwardRef} from '@angular/core';
import {SimplyMatButtonGroupBase} from './button-group-base';

/**
 * A button group supporting single and multi-selection mode, compatible with Angular's Signal form API.
 *
 * To use this component, add the `ngListbox` to the component's selector.
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
  selector: 'simply-mat-button-group:not([ngListbox])',
  imports: [],
  template: '<ng-content/>',
  styleUrl: './button-group.css',
  providers: [
    {
      provide: SimplyMatButtonGroupBase,
      useExisting: forwardRef(() => SimplyMatButtonGroup)
    }
  ],
  host: {
    '[attr.data-sm-size]': 'size()',
    '[attr.data-sm-type]': 'type()',
  },
})
export class SimplyMatButtonGroup extends SimplyMatButtonGroupBase {

}
