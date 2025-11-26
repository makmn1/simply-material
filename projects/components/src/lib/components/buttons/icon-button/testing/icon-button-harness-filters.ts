import {BaseHarnessFilters} from '@angular/cdk/testing';

/** Possible icon button variants. */
export type IconButtonVariant = 'filled' | 'tonal' | 'outlined' | 'standard';

/** Possible icon button sizes. */
export type IconButtonSize = 'xsmall' | 'small' | 'medium' | 'large' | 'xlarge';

/** Possible icon button shapes. */
export type IconButtonShape = 'round' | 'square';

/** Possible icon button widths. */
export type IconButtonWidth = 'narrow' | 'default' | 'wide';

/** A set of criteria that can be used to filter a list of icon button harness instances. */
export interface IconButtonHarnessFilters extends BaseHarnessFilters {
  /** Only find instances whose text matches the given value. */
  text?: string | RegExp;

  /** Only find instances with a specific variant. */
  variant?: IconButtonVariant;

  /** Only find instances with a specific size. */
  size?: IconButtonSize;

  /** Only find instances with a specific shape. */
  shape?: IconButtonShape;

  /** Only find instances with a specific width. */
  width?: IconButtonWidth;

  /** Only find instances which match the given disabled state. */
  disabled?: boolean;

  /** Only find instances which match the given togglable state. */
  togglable?: boolean;

  /** Only find instances which match the given selected state. */
  selected?: boolean;
}

