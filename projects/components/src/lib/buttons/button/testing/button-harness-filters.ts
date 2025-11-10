import {BaseHarnessFilters} from '@angular/cdk/testing';
import {ButtonVariant, ButtonSize, ButtonShape} from '../button';

/** A set of criteria that can be used to filter a list of button harness instances. */
export interface ButtonHarnessFilters extends BaseHarnessFilters {
  /** Only find instances whose text matches the given value. */
  text?: string | RegExp;

  /** Only find instances with a specific variant. */
  variant?: ButtonVariant | string | RegExp;

  /** Only find instances with a specific size. */
  size?: ButtonSize | string | RegExp;

  /** Only find instances with a specific shape. */
  shape?: ButtonShape | string | RegExp;

  /** Only find instances which match the given toggle state. */
  toggle?: boolean;

  /** Only find instances which match the given disabled state. */
  disabled?: boolean;

  /** Only find instances which match the given selected state (for toggle buttons). */
  selected?: boolean;
}

// Re-export types for convenience
export type {ButtonVariant, ButtonSize, ButtonShape} from '../button';

