import {BaseHarnessFilters} from '@angular/cdk/testing';

/** Possible button variants. */
export type ButtonVariant = 'filled' | 'elevated' | 'tonal' | 'outlined' | 'text';

/** Possible button sizes. */
export type ButtonSize = 'xsmall' | 'small' | 'medium' | 'large' | 'xlarge';

/** Possible button shapes. */
export type ButtonShape = 'round' | 'square';

/** A set of criteria that can be used to filter a list of button harness instances. */
export interface ButtonHarnessFilters extends BaseHarnessFilters {
  /** Only find instances whose text matches the given value. */
  text?: string | RegExp;

  /** Only find instances with a specific variant. */
  variant?: ButtonVariant;

  /** Only find instances with a specific size. */
  size?: ButtonSize;

  /** Only find instances with a specific shape. */
  shape?: ButtonShape;

  /** Only find instances which match the given disabled state. */
  disabled?: boolean;

  /** Only find instances which match the given togglable state. */
  togglable?: boolean;

  /** Only find instances which match the given selected state. */
  selected?: boolean;
}

