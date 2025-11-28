import {Directive, input} from '@angular/core';
import {SimplyMatRippleDirective} from '../../../../../miscellaneous/ripple/ripple';
import {FabColor, FabSize} from './fab-base.types';

@Directive({
  selector: '[simplyMatFabBase]',
  hostDirectives: [
    {
      directive: SimplyMatRippleDirective,
      inputs: [
        'rippleDisabled',
        'rippleOpacity',
        'rippleDuration',
        'rippleEasing',
        'rippleColor',
      ],
    }
  ],
  host: {
    '[attr.data-sm-color]': 'color()',
    '[attr.data-sm-size]': 'size()',
    '[attr.data-sm-tonal]': 'tonal() ? "" : null',
    '[attr.aria-label]': 'ariaLabel() ?? null',
    '[attr.aria-labelledby]': 'ariaLabelledby() ?? null',
  },
})
export class FabBase {
  public color = input<FabColor>('primary');
  public size = input<FabSize>('small');
  public tonal = input<boolean>(false);

  ariaLabel = input<string | null>(null);
  ariaLabelledby = input<string | null>(null);
}

