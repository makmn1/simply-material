import {BaseHarnessFilters} from '@angular/cdk/testing';

/** Possible button group types. */
export type ButtonGroupType = 'standard' | 'connected';

/** Possible button group sizes. */
export type ButtonGroupSize = 'xsmall' | 'small' | 'medium' | 'large' | 'xlarge';

/** Possible default button shapes for button group. */
export type ButtonGroupDefaultShape = 'round' | 'square';

/** A set of criteria that can be used to filter a list of button group harness instances. */
export interface ButtonGroupHarnessFilters extends BaseHarnessFilters {
  /** Only find instances with a specific type. */
  type?: ButtonGroupType;

  /** Only find instances with a specific size. */
  size?: ButtonGroupSize;

  /** Only find instances with a specific default button shape. */
  defaultButtonShape?: ButtonGroupDefaultShape;

  /** Only find instances which match the given disabled width animations state. */
  disableWidthAnimations?: boolean;
}

