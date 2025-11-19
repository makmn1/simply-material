import { Component, input } from '@angular/core';

export type ButtonGroupType = 'standard' | 'connected';
export type ButtonGroupSize = 'xsmall' | 'small' | 'medium' | 'large' | 'xlarge';

@Component({
  selector: 'sm-button-group',
  imports: [],
  template: '<ng-content/>',
  styleUrl: './button-group.css',
  host: {
    '[attr.data-type]': 'type()',
    '[attr.data-size]': 'size()',
  },
})
export class ButtonGroup {
  public type = input<ButtonGroupType>('standard');
  public size = input<ButtonGroupSize>('small');
}
