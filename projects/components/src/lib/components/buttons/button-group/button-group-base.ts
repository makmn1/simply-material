import {Component, input} from '@angular/core';

export type ButtonGroupType = 'standard' | 'connected';
export type ButtonGroupSize = 'xsmall' | 'small' | 'medium' | 'large' | 'xlarge';
export type ButtonGroupDefaultShape = 'round' | 'square';

/**
 * Represents the default options for the button group that can be configured
 * using the `SIMPLY_MAT_BUTTON_GROUP_DEFAULT_OPTIONS` injection token.
 */
export interface SimplyMatButtonGroupDefaultOptions {

  /** Default button group type. */
  type?: ButtonGroupType;

  /** Default button group size. */
  size?: ButtonGroupSize;

  /** Default shape for buttons in the group. */
  defaultButtonShape?: 'round' | 'square';

  /** Whether disabled toggle buttons should be interactive. */
  disabledInteractive: boolean;
}

@Component({
  selector: 'simply-mat-button-group',
  imports: [],
  template: '<ng-content/>',
  styleUrl: './button-group.css',
  host: {
    '[attr.data-sm-size]': 'size()',
    '[attr.data-sm-type]': 'type()',
  },
})
export class SimplyMatButtonGroupBase {

  /**
   * The type of button group. For guidance in picking an option, refer to the [Material Design button group guidelines](https://m3.material.io/components/button-groups/guidelines).
   *
   * For button groups with styling that can allow it to wrap to a new line,
   * use either `standard` with `disableWidthAnimations` set to `true` or `connected`
   * (otherwise unexpected wrapping may occur).
   */
  public type = input<ButtonGroupType>('standard');

  /**
   * The size of the button group container. This should be set to the size of the largest button in the button group.
   *
   * By default, the button group will be sized to match the size of the largest button in the group.
   * This check is skipped if you pass a size which may help performance in very certain cases.
   */
  public size = input<ButtonGroupSize>('small');

  /**
   * The default shape for buttons in the group if a button doesn't specify its own shape.
   */
  public defaultButtonShape = input<ButtonGroupDefaultShape>('round');

  /**
   * It's recommended to disable width animations for multi-line standard button groups to prevent wrapping issues.
   * For example, elements that shrink may fit onto the previous line in a flex container and shift to it, then
   * shift back once they grow again.
   *
   * To prevent this, make sure to do one of the following:
   * - Keep buttons on a single line (e.g., switch to smaller button sizes at smaller screen sizes)
   * - Set the button container to a fixed width
   * - Set this input to `true`
   *
   * Again, this issue is only relevant for **standard** button groups where the buttons can **wrap to a new line**
   * (connected button groups don't have width animations when a button is clicked).
   */
  public disableWidthAnimations = input(false);

  /**
   * Sets all buttons in the group to be disabled.
   * Only has an effect if the button doesn't define its own `disabled` state.
   */
  readonly disabled = input(false);

  /**
   * Allows a disabled button in the group to be focusable.
   * Only has an effect if the button is disabled and the button doesn't define its own `softDisabled` state.
   */
  readonly softDisabled = input(false);

  /**
   * Sets all buttons in the group to be read-only.
   * Only has an effect if the button doesn't define its own `readonly` state.'
   */
  readonly readonly = input(false);
}

