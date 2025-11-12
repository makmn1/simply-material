import {BaseHarnessFilters} from '@angular/cdk/testing';
import {IconButtonVariant, IconButtonSize, IconButtonShape, IconButtonWidth} from '../icon-button';

/** A set of criteria that can be used to filter a list of icon button harness instances. */
export interface IconButtonHarnessFilters extends BaseHarnessFilters {
  /** Only find instances with a specific variant. */
  variant?: IconButtonVariant | string | RegExp;

  /** Only find instances with a specific size. */
  size?: IconButtonSize | string | RegExp;

  /** Only find instances with a specific shape. */
  shape?: IconButtonShape | string | RegExp;

  /** Only find instances with a specific width. */
  width?: IconButtonWidth | string | RegExp;

  /** Only find instances which match the given toggle state. */
  toggle?: boolean;

  /** Only find instances which match the given disabled state. */
  disabled?: boolean;

  /** Only find instances which match the given selected state (for toggle buttons). */
  selected?: boolean;
}

// Re-export types for convenience
export type {IconButtonVariant, IconButtonSize, IconButtonShape, IconButtonWidth} from '../icon-button';

