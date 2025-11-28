import {ChangeDetectionStrategy, Component, input, ViewEncapsulation,} from '@angular/core';

@Component({
  selector: 'simply-mat-icon',
  template: `<ng-content />`,
  styleUrls: ['./icon.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    'class': 'simply-mat-icon',

    '[attr.aria-hidden]': 'ariaHidden() ? "true" : null',
    '[attr.role]': 'ariaHidden() ? null : "img"',
    '[attr.aria-label]': 'ariaHidden() || !ariaLabel() ? null : ariaLabel()',
  },
})
export class SimplyMatIcon {
  /**
   * If true, the icon is treated as decorative and hidden from assistive tech.
   * This is the right default for icons inside labeled controls (buttons, extended FABs, etc.).
   * For unlabelled controls (e.g. a normal FAB or an icon button), set this to false.
   */
  ariaHidden = input<boolean>(true);

  /**
   * Optional accessible label if the icon should be exposed.
   * Only used when ariaHidden() is false.
   */
  ariaLabel = input<string | null>(null);
}
